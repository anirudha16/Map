import { createClient } from "@supabase/supabase-js";

let supabaseAdminInstance = null;

function getSupabaseAdmin() {
  if (!supabaseAdminInstance) {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_URL:', SUPABASE_URL);
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY);
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env"
      );
    }

    supabaseAdminInstance = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log('✅ supabaseAdmin initialized');
  }

  return supabaseAdminInstance;
}

export const supabaseAdmin = new Proxy({}, {
  get: (target, prop) => {
    return getSupabaseAdmin()[prop];
  },
});
