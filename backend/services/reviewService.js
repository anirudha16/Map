import { supabase } from "../utils/supabaseClient.js";

export const getReviewsByLocation = async (locationId) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, user_email, user_name")
    .eq("location_id", locationId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const addReview = async ({ locationId, rating, comment, user_email, user_name }) => {
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

