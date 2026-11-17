-- =====================================================================
-- Kenny's Authentic Footwear — import the 24 existing designs
-- Run AFTER schema.sql. Safe to re-run (existing slugs are skipped).
-- Images keep pointing at the files already in your /images folder.
-- Prices are left empty so the site keeps showing "Contact for price";
-- set real prices from the dashboard (All Products -> Price).
-- =====================================================================

insert into public.categories (name, slug, sort_order) values
  ('Casual',    'casual',    1),
  ('Premium',   'premium',   2),
  ('Signature', 'signature', 3),
  ('Featured',  'featured',  4),
  ('Slides',    'slides',    5),
  ('Sandals',   'sandals',   6),
  ('Slippers',  'slippers',  7),
  ('Loafers',   'loafers',   8),
  ('Formal',    'formal',    9)
on conflict (slug) do nothing;

with seed (slug, name, description, category, gender, sizes, colour, image, created_at) as (
values
  ('urbanrunner', 'The Urban Runner', 'A clean everyday silhouette designed for effortless movement and modern style.', 'featured', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/1.jpg', now() - interval '0 minutes'),
  ('crossstrap', 'The Cross-Strap', 'A distinctive design that combines relaxed comfort with a bold and confident finish.', 'casual', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/black.png', now() - interval '1 minutes'),
  ('dailyslipon', 'The Daily Slip-On', 'Simple, versatile and easy to wear — built for everyday moments without compromising style.', 'casual', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/sliver.png', now() - interval '2 minutes'),
  ('classicessential', 'Classic Essential', 'A timeless silhouette created for those who prefer understated design with a refined finish.', 'premium', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/sweet.png', now() - interval '3 minutes'),
  ('streetedition', 'The Street Edition', 'Inspired by modern street style, created for people who want their footwear to make an impression.', 'casual', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/plenty.png', now() - interval '4 minutes'),
  ('signatureseries', 'Signature Series', 'A statement design representing the character and craftsmanship behind Kenny''s Authentic Footwear.', 'premium', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/bueauty.png', now() - interval '5 minutes'),
  ('girly', 'Girly', 'A stylish and elegant design made for effortless everyday looks.', 'premium', 'women', array['37','38','39','40','41']::text[], 'As shown', 'images/girly.png', now() - interval '6 minutes'),
  ('cool', 'Cool', 'A clean contemporary silhouette built around comfort and character.', 'casual', 'unisex', array['40','41','42','43','44']::text[], 'As shown', 'images/Screenshot 2026-09-05 162527.png', now() - interval '7 minutes'),
  ('slick', 'Slick', 'A sharp modern design for those who prefer a confident finish.', 'premium', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/slick.png', now() - interval '8 minutes'),
  ('backgirl', 'Back Girl', 'A distinctive feminine silhouette with a bold and expressive feel.', 'casual', 'women', array['37','38','39','40','41']::text[], 'As shown', 'images/cool.png', now() - interval '9 minutes'),
  ('urban', 'Urban', 'Designed for everyday movement with a relaxed modern aesthetic.', 'casual', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/Screenshot 2026-09-04 044049.png', now() - interval '10 minutes'),
  ('elegant', 'Elegant', 'A refined silhouette designed to bring sophistication to every step.', 'premium', 'women', array['37','38','39','40','41']::text[], 'As shown', 'images/black-girl.png', now() - interval '11 minutes'),
  ('classic', 'Classic', 'A timeless design that keeps things simple, versatile and refined.', 'premium', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/classic.png', now() - interval '12 minutes'),
  ('chic', 'Chic', 'A fashionable everyday piece with a confident contemporary edge.', 'casual', 'women', array['37','38','39','40','41']::text[], 'As shown', 'images/chick.png', now() - interval '13 minutes'),
  ('prime', 'Prime', 'Built around a strong silhouette, lasting comfort and everyday style.', 'premium', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/bella.jpeg', now() - interval '14 minutes'),
  ('bella', 'Bella', 'A graceful design created for effortless style and versatility.', 'premium', 'women', array['37','38','39','40','41']::text[], 'As shown', 'images/bel.jpeg', now() - interval '15 minutes'),
  ('edge', 'Edge', 'A bold contemporary silhouette made to stand apart from the crowd.', 'casual', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/edgee.jpeg', now() - interval '16 minutes'),
  ('glam', 'Glam', 'A statement design combining elegance with a modern personality.', 'premium', 'women', array['37','38','39','40','41']::text[], 'As shown', 'images/glam.jpeg', now() - interval '17 minutes'),
  ('force', 'Force', 'A strong everyday design built for comfort and confident styling.', 'casual', 'men', array['40','41','42','43','44']::text[], 'As shown', 'images/force.jpeg', now() - interval '18 minutes'),
  ('dream', 'Dream', 'A soft and stylish silhouette designed to complement any look.', 'casual', 'women', array['37','38','39','40','41']::text[], 'As shown', 'images/dream.jpeg', now() - interval '19 minutes'),
  ('royal', 'Royal', 'A sophisticated statement piece created with a premium feel.', 'premium', 'unisex', array['39','40','41','42','43','44']::text[], 'As shown', 'images/royal.jpeg', now() - interval '20 minutes'),
  ('fresh', 'Fresh', 'A versatile modern design bringing a fresh perspective to everyday footwear.', 'casual', 'unisex', array['39','40','41','42','43','44']::text[], 'As shown', 'images/fresh.jpeg', now() - interval '21 minutes'),
  ('luxe', 'Luxe', 'A polished design for those who appreciate a more elevated look.', 'premium', 'unisex', array['37','38','39','40','41','42']::text[], 'As shown', 'images/luxe.jpeg', now() - interval '22 minutes'),
  ('icon', 'Icon', 'A standout silhouette representing the character of Kenny''s Authentic Footwear.', 'signature', 'unisex', array['39','40','41','42','43','44']::text[], 'As shown', 'images/sig.jpeg', now() - interval '23 minutes')
), ins as (
  insert into public.products (slug, name, description, category, gender, sizes, colour, status, created_at)
  select slug, name, description, category, gender, sizes, colour, 'available', created_at from seed
  on conflict (slug) do nothing
  returning id, slug
)
insert into public.product_images (product_id, url, storage_path, position)
select ins.id, seed.image, null, 0
from ins join seed on seed.slug = ins.slug;

insert into public.site_settings (key, value) values ('catalogue_live', 'true')
on conflict (key) do update set value = 'true', updated_at = now();
