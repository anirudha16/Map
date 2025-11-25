import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use fallback values to prevent crashes
const url = supabaseUrl || 'https://jsfpqnnfexrsrzwyjbcv.supabase.co';
const key = supabaseAnonKey || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase config. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env'
  );
}

export const supabase = createClient(url, key);


