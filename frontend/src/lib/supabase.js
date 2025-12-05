import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use fallback values to prevent crashes
const url = supabaseUrl || 'https://jsfpqnnfexrsrzwyjbcv.supabase.co';
const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzZnBxbm5mZXhyc3J6d3lqYmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIwNjgsImV4cCI6MjA3OTE2ODA2OH0.W0SUWcckqxy4xIot4VY_UiHjF8t1GBMVl9jSf3OFEBE';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase config. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env'
  );
}

export const supabase = createClient(url, key);


