const { supabase } = require("../utils/supabaseClient");

// GET all reviews for one location
const getReviewsByLocation = async (locationId) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, user_email, user_name")
    .eq("location_id", locationId)
    .order("created_at", { ascending: false });

  return { data, error };
};

// ADD review (public submission)
const addReview = async ({ locationId, rating, comment, user_email, user_name }) => {
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

module.exports = {
  getReviewsByLocation,
  addReview,
};

