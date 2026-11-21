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
  SUPABASE_URL: "https://rpcnsogbmppfdpxaewac.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwY25zb2dibXBwZmRweGFld2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4NzQ4NTYsImV4cCI6MjExMDQ1MDg1Nn0.TT21C28dWgXqScfVo_y--xjFYPk5GhpjtHcCR38YGSo",
  STORAGE_BUCKET: "product-images"
};
