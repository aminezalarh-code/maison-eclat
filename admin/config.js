/* ============================================================
   BELORYA Admin — Supabase connection
   ------------------------------------------------------------
   Fill these two values in AFTER you create your Supabase project.
   Supabase Dashboard → Project Settings → API:
     • Project URL      -> url
     • Project API keys -> anon / public key -> anonKey
   The anon key is SAFE to expose in the browser: all access is
   enforced by Row Level Security in the database. NEVER paste the
   service_role (secret) key here.
   ============================================================ */
window.BELORYA_SUPABASE = {
  url: 'https://YOUR-PROJECT.supabase.co',
  anonKey: 'YOUR-ANON-PUBLIC-KEY'
};
