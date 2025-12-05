import { supabase } from '../lib/supabase';

export const toggleFavorite = async (placeId, userEmail, isAlreadyFavorite) => {
  if (isAlreadyFavorite) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('place_id', placeId)
      .eq('user_email', userEmail);

    if (error) {
      console.error('❌ Failed to remove favorite:', error);
      throw error;
    }
    return { success: true, isFavorite: false };
  } else {
    const { error } = await supabase
      .from('favorites')
      .insert({
        place_id: placeId,
        user_email: userEmail,
      });

    if (error) {
      console.error('❌ Failed to add favorite:', error);
      throw error;
    }
    return { success: true, isFavorite: true };
  }
};

export const fetchUserFavorites = async (userEmail) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('place_id')
    .eq('user_email', userEmail);

  if (error) {
    console.error('❌ Failed to fetch favorites:', error);
    return [];
  }

  return data.map(fav => fav.place_id);
};
