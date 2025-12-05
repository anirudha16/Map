export const getReviewsByLocation = async (locationId) => {
  const { supabase } = await import("../utils/supabaseClient.js");
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, user_email, user_name")
    .eq("location_id", locationId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const addReview = async ({ locationId, rating, comment, user_email, user_name }) => {
  const { supabase } = await import("../utils/supabaseClient.js");
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      location_id: locationId,
      rating,
      comment,
      user_email,
      user_name,
    })
    .select('*');

  return { data, error };
};

