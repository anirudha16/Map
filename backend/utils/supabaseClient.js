import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ SUPABASE_URL:', SUPABASE_URL);
  console.error('❌ SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY);
  throw new Error(
    'Missing Supabase credentials. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in backend/.env'
  );
}

console.log('✅ Initializing supabase with URL:', SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

console.log('✅ supabase initialized successfully');
