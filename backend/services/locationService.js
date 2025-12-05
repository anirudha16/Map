async function getSupabaseClient() {
  const { supabase } = await import('../utils/supabaseClient.js');
  return supabase;
}

const baseSelect = async () => {
  const supabase = await getSupabaseClient();
  return supabase
    .from('locations')
    .select('id, name, description, latitude, longitude, created_at');
};

export const getAllLocations = async () => await baseSelect();

export const getLocationById = async (id) => {
  const query = await baseSelect();
  return query.eq('id', id).single();
};

export const searchLocationsByName = async (name) => {
  const query = await baseSelect();
  return query.ilike('name', `%${name}%`).limit(5);
};

