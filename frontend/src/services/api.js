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
  { rating, comment, user_email = 'anonymous_user', user_name }
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

export const searchPlaces = async (params) => {
  // params: { searchTerm, placeType, region, minRating, hasReviews, sort }
  // Using /locations as a base, assuming it returns all locations or supports filtering.
  // If the backend doesn't support filtering, we'll filter client-side here for now.
  const { data } = await api.get('/locations');

  let results = data;

  if (params.searchTerm) {
    const term = params.searchTerm.toLowerCase();
    results = results.filter(p =>
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  }

  if (params.placeType) {
    results = results.filter(p => p.placeType === params.placeType);
  }

  // Region filtering (mock implementation if not in data)
  if (params.region) {
    // Assuming region is a property, or we skip if not present
    results = results.filter(p => p.region === params.region);
  }

  if (params.minRating) {
    results = results.filter(p => (p.average_rating || 0) >= params.minRating);
  }

  if (params.hasReviews) {
    results = results.filter(p => (p.review_count || 0) > 0);
  }

  // Sorting
  results.sort((a, b) => {
    switch (params.sort) {
      case 'name_asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name_desc':
        return (b.name || '').localeCompare(a.name || '');
      case 'rating_desc':
        return (b.average_rating || 0) - (a.average_rating || 0);
      case 'reviews_desc':
        return (b.review_count || 0) - (a.review_count || 0);
      default:
        return 0;
    }
  });

  // Map to PlaceRecord shape if needed (Dashboard uses 'name', 'placeType', etc. matching our filters)
  return results.map(p => ({
    id: p.id,
    Name: p.name, // Mapping 'name' to 'Name' for ResultsPanel
    PlaceType: p.placeType,
    Latitude: p.latitude,
    Longitude: p.longitude,
    average_rating: p.average_rating,
    review_count: p.review_count
  }));
};
