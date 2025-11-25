const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_ANON_KEY,
} = process.env;

const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !supabaseKey) {
  throw new Error(
    'Missing Supabase credentials. Ensure SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY are set in backend/.env'
  );
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[supabase] Service role key missing. Falling back to anon key—writes may fail if row-level security blocks them.'
  );
}

const supabase = createClient(SUPABASE_URL, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

module.exports = { supabase };

