-- =====================================================================
-- Kenny's Authentic Footwear — product management schema
-- Run this ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- It is safe to re-run (idempotent).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ADMIN ACCOUNTS
-- Only users listed here are administrators. There is NO public way to
-- add rows (no insert policy) — you add yourself once in the SQL editor
-- (see the bottom of this file).
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admin can read own admin row" on public.admin_users;
create policy "admin can read own admin row"
  on public.admin_users for select to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 2. CATEGORIES
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique check (char_length(name) between 2 and 60),
  slug       text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;

-- ---------------------------------------------------------------------
-- 3. PRODUCTS
-- status: available | sold_out | hidden
--   available -> shown, can be enquired about
--   sold_out  -> shown with a "Sold Out" label
--   hidden    -> NOT visible to the public (draft / unpublished)
-- price is NULL when you prefer "Contact for price".
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name           text not null check (char_length(name) between 2 and 120),
  description    text not null default '' check (char_length(description) <= 2000),
  price          numeric(12,2) check (price is null or price >= 0),
  previous_price numeric(12,2) check (previous_price is null or previous_price >= 0),
  category       text not null references public.categories (slug)
                   on update cascade on delete restrict,
  gender         text not null check (gender in ('men','women','unisex')),
  sizes          text[] not null default '{}',
  colour         text check (colour is null or char_length(colour) <= 60),
  status         text not null default 'available'
                   check (status in ('available','sold_out','hidden')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- a "previous price" only makes sense when it is higher than the price
  constraint products_previous_price_higher
    check (previous_price is null or (price is not null and previous_price > price))
);
alter table public.products enable row level security;

create index if not exists products_status_created_idx on public.products (status, created_at desc);
create index if not exists products_category_idx       on public.products (category);
create index if not exists products_gender_idx         on public.products (gender);

create or replace function public.kx_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.kx_touch_updated_at();

-- ---------------------------------------------------------------------
-- 4. PRODUCT IMAGES  (first image by position = main image)
-- storage_path is NULL for the original images that live in /images on
-- the website; it is set for images uploaded through the dashboard.
-- ---------------------------------------------------------------------
create table if not exists public.product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products (id) on delete cascade,
  url          text not null check (url ~* '^(https://|images/)'),
  storage_path text,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);
alter table public.product_images enable row level security;
create index if not exists product_images_product_idx on public.product_images (product_id, position);

-- ---------------------------------------------------------------------
-- 5. SITE SETTINGS (small key/value store)
--   whatsapp_number : digits only, international format (no +)
--   catalogue_live  : set to 'true' automatically when the first product
--                     is saved; tells the website to use the database
--                     instead of the old built-in product list.
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  key        text primary key check (key ~ '^[a-z_]+$'),
  value      text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

create or replace function public.kx_mark_catalogue_live()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.site_settings (key, value) values ('catalogue_live', 'true')
  on conflict (key) do update set value = 'true', updated_at = now();
  return null;
end;
$$;
drop trigger if exists products_mark_live on public.products;
create trigger products_mark_live
  after insert on public.products
  for each statement execute function public.kx_mark_catalogue_live();

-- ---------------------------------------------------------------------
-- 6. TABLE PRIVILEGES (explicit, RLS below still decides who gets what)
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.products, public.product_images,
               public.categories, public.site_settings to anon, authenticated;
grant insert, update, delete on public.products, public.product_images,
               public.categories, public.site_settings to authenticated;
grant select on public.admin_users to authenticated;

-- ---------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY POLICIES
-- ---------------------------------------------------------------------
-- PRODUCTS: public sees available + sold_out only. Admin sees everything.
drop policy if exists "public can read published products" on public.products;
create policy "public can read published products"
  on public.products for select to anon, authenticated
  using (status in ('available','sold_out') or public.is_admin());

drop policy if exists "admin can insert products" on public.products;
create policy "admin can insert products"
  on public.products for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin can update products" on public.products;
create policy "admin can update products"
  on public.products for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin can delete products" on public.products;
create policy "admin can delete products"
  on public.products for delete to authenticated
  using (public.is_admin());

-- PRODUCT IMAGES: visible whenever the parent product is visible
-- (the sub-select is itself filtered by the products policy above).
drop policy if exists "public can read images of visible products" on public.product_images;
create policy "public can read images of visible products"
  on public.product_images for select to anon, authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.products p where p.id = product_images.product_id)
  );

drop policy if exists "admin can insert product images" on public.product_images;
create policy "admin can insert product images"
  on public.product_images for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin can update product images" on public.product_images;
create policy "admin can update product images"
  on public.product_images for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin can delete product images" on public.product_images;
create policy "admin can delete product images"
  on public.product_images for delete to authenticated
  using (public.is_admin());

-- CATEGORIES + SETTINGS: public read, admin write.
drop policy if exists "public can read categories" on public.categories;
create policy "public can read categories"
  on public.categories for select to anon, authenticated using (true);

drop policy if exists "admin can insert categories" on public.categories;
create policy "admin can insert categories"
  on public.categories for insert to authenticated with check (public.is_admin());
drop policy if exists "admin can update categories" on public.categories;
create policy "admin can update categories"
  on public.categories for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin can delete categories" on public.categories;
create policy "admin can delete categories"
  on public.categories for delete to authenticated using (public.is_admin());

drop policy if exists "public can read settings" on public.site_settings;
create policy "public can read settings"
  on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "admin can insert settings" on public.site_settings;
create policy "admin can insert settings"
  on public.site_settings for insert to authenticated with check (public.is_admin());
drop policy if exists "admin can update settings" on public.site_settings;
create policy "admin can update settings"
  on public.site_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin can delete settings" on public.site_settings;
create policy "admin can delete settings"
  on public.site_settings for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------
-- 8. IMAGE STORAGE BUCKET
-- Public bucket (anyone can VIEW an image by its URL). Only admins can
-- upload / replace / delete. The bucket itself enforces: max 5 MB per
-- file and only JPG / PNG / WebP.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "admin manages product images" on storage.objects;
create policy "admin manages product images"
  on storage.objects for all to authenticated
  using      (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

-- ---------------------------------------------------------------------
-- 9. REAL-TIME UPDATES (customer pages refresh when products change)
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products')
  then
    alter publication supabase_realtime add table public.products;
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 10. DEFAULT SETTINGS
-- ---------------------------------------------------------------------
insert into public.site_settings (key, value)
values ('whatsapp_number', '2347038313960')
on conflict (key) do nothing;

-- =====================================================================
-- 11. MAKE YOURSELF AN ADMIN  (run AFTER creating your login)
-- 1) Supabase -> Authentication -> Users -> Add user -> Create new user
--    (tick "Auto Confirm User").
-- 2) Replace the email below with that email and run just this statement:
--
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = 'owner@example.com';
-- =====================================================================
