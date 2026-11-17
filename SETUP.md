# Kenny's Authentic Footwear — admin dashboard setup

TESTED: database rules on a real Postgres; admin + customer screens end-to-end in a
real browser (92 checks: login/security, add, multi-image upload, edit, price, sold-out,
hidden, delete + image cleanup, search/filters/sort, live updates, mobile/tablet/desktop)
using a simulated Supabase. NOT testable by me: your real Supabase project, so do the
"live checks" at the bottom once after setup. Try it on a Netlify deploy preview first.

## 1. Create the database (Supabase, free)
1. supabase.com -> New project.
2. SQL Editor -> paste ALL of `supabase/schema.sql` -> Run.
3. SQL Editor -> paste ALL of `supabase/seed.sql` -> Run
   (imports your 24 existing designs so they appear in the admin; images keep using /images).

## 2. Lock down sign-ups, create your admin login
1. Authentication -> Sign In / Providers -> turn OFF "Allow new users to sign up".
2. Authentication -> Users -> Add user -> Create new user (email + long password, tick Auto Confirm).
3. SQL Editor, run (use your email):
   insert into public.admin_users (user_id) select id from auth.users where email = 'YOU@EXAMPLE.COM';

## 3. Connect the website
Project Settings -> API: copy the Project URL and the **anon / publishable** key.
NEVER use the service_role / secret key (the site and build refuse it).
- Netlify: Site settings -> Environment variables -> add SUPABASE_URL and SUPABASE_ANON_KEY -> redeploy.
  OR edit `supabase-config.js` and paste both values.

## 4. Use it
Go to https://kennysfootwear.com/admin/ and sign in.
Set real prices: All Products -> Price (seeded designs show "Contact for price").

## Notes
- Files changed from your originals: collections.html (head repaired, scripts added),
  product.html, product.js, script.js (one line), robots.txt, _headers (admin rules).
- New: admin/, js/, catalogue.css, supabase/, scripts/, netlify.toml, supabase-config.js.
- If the database is unreachable, the site falls back to your original built-in designs.
- Existing bugs I found: collections.html had 6 broken <meta> tags (fixed); two product
  links were misspelled (fixed); sitemap.xml uses https:// in its xmlns (should be http://) — not changed.
- Sitemap does not yet list dashboard-added products.
- Live checks to do after deploy: login, upload 3 photos, edit price, mark Sold Out,
  hide, delete, open the site on another phone.
