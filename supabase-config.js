/*
  Kenny's Authentic Footwear — public Supabase settings.

  These two values are PUBLIC by design (they ship to every visitor's
  browser). Your data is protected by the row-level-security rules in
  supabase/schema.sql, NOT by hiding these values.

  NEVER put a "service_role" or "secret" key here. The site refuses to
  start if it detects one.

  Two ways to fill this in:
   A) Edit the two values below and commit/deploy, OR
   B) Leave this file alone and set SUPABASE_URL and SUPABASE_ANON_KEY as
      Netlify environment variables — the build step (scripts/build-config.js)
      rewrites this file for you on every deploy.
*/
window.KENNYS_CONFIG = {
  SUPABASE_URL: "https://YOUR-PROJECT-REF.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-PUBLIC-ANON-KEY",
  STORAGE_BUCKET: "product-images"
};
