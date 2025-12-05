import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

function getSupabase() {
  if (!supabaseInstance) {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('❌ SUPABASE_URL:', SUPABASE_URL);
      console.error('❌ SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY);
      throw new Error(
        'Missing Supabase credentials. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in backend/.env'
      );
    }

    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    console.log('✅ supabase initialized');
  }

  return supabaseInstance;
}

export const supabase = new Proxy({}, {
  get: (target, prop) => {
    return getSupabase()[prop];
  },
});
