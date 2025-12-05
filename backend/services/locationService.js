import { supabase } from '../utils/supabaseClient.js';

const baseSelect = () =>
  supabase
    .from('locations')
    .select('id, name, description, latitude, longitude, created_at');

export const getAllLocations = () => baseSelect();

export const getLocationById = (id) =>
  baseSelect()
    .eq('id', id)
    .single();

export const searchLocationsByName = (name) =>
  baseSelect().ilike('name', `%${name}%`).limit(5);

