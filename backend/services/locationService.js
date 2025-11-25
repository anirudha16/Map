const { supabase } = require('../utils/supabaseClient');

const baseSelect = () =>
  supabase
    .from('locations')
    .select('id, name, description, latitude, longitude, created_at');

const getAllLocations = () => baseSelect();

const getLocationById = (id) =>
  baseSelect()
    .eq('id', id)
    .single();

const searchLocationsByName = (name) =>
  baseSelect().ilike('name', `%${name}%`).limit(5);

module.exports = {
  getAllLocations,
  getLocationById,
  searchLocationsByName,
};

