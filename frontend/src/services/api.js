import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
});

export const getAllLocations = async () => {
  const { data } = await api.get('/locations');
  return data;
};

export const getLocations = async () => {
  const { data } = await api.get('/locations');
  return data;
};

export const getLocationByName = async (name) => {
  const { data } = await api.get('/locations/search', {
    params: { name },
  });
  return data;
};

export const getReviewsByLocation = async (locationId) => {
  const { data } = await api.get(`/locations/${locationId}/reviews`);
  return data;
};

export const addReview = async (
  locationId,
  { rating, comment, user_email = 'anonymous_user',user_name  }
) => {
  const { data } = await api.post(`/locations/${locationId}/reviews`, {
    rating,
    comment,
    user_email,
    user_name
  });
  return data;
};

export const getPlaces = async () => {
  const { data } = await api.get("/places");
  return data;
};

export const getPlacesInBBox = async (minLon, minLat, maxLon, maxLat) => {
  const { data } = await api.get("/places/bbox", {
    params: { minLon, minLat, maxLon, maxLat },
  });
  return data;
};
