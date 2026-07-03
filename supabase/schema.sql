-- ============================================================
-- BELORYA — Supabase schema (run once in the SQL Editor)
-- Postgres + Row Level Security. Safe to re-run (idempotent-ish).
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- updated_at helper ----------
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ============================================================
-- TABLES
-- ============================================================

-- Admin allowlist (links to Supabase Auth users)
create table if not exists admins (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  email     text,
  role      text not null default 'admin',
  created_at timestamptz not null default now()
);

-- is_admin(): true when the current auth user is in the admins table
create or replace function is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from admins a where a.user_id = auth.uid());
$$;

-- Categories
create table if not exists categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name_fr    text not null,
  name_en    text,
  image_url  text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Filter groups + options (dynamic collection filters)
create table if not exists filters (
  id         uuid primary key default gen_random_uuid(),
  key        text unique not null,
  name_fr    text not null,
  name_en    text,
  display_order int not null default 0
);
create table if not exists filter_options (
  id         uuid primary key default gen_random_uuid(),
  filter_id  uuid references filters(id) on delete cascade,
  value      text not null,
  label_fr   text,
  label_en   text,
  display_order int not null default 0
);

-- Products
create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  category_id   uuid references categories(id) on delete set null,
  price         numeric(10,2) not null default 0,
  sale_price    numeric(10,2),
  sale_start    timestamptz,
  sale_end      timestamptz,
  material      text,
  sku           text,
  stock         int not null default 0,
  description   text,
  short         text,
  rating        numeric(2,1) default 4.8,
  status        text not null default 'active'
                check (status in ('active','draft','out_of_stock','archived')),
  is_featured   boolean not null default false,
  is_best_seller boolean not null default false,
  is_new        boolean not null default false,
  badge         text,
  featured_image text,
  display_order int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

-- Variants (e.g. Gold / Silver / Rose Gold)
create table if not exists product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade,
  name        text not null,
  color       text,
  sku         text,
  stock       int not null default 0,
  price_diff  numeric(10,2) not null default 0,
  display_order int not null default 0
);

-- Media library
create table if not exists media (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  path       text,
  alt        text,
  kind       text not null default 'product',   -- product | homepage | category | logo
  created_at timestamptz not null default now()
);

-- Product images (ordered, optionally tied to a variant)
create table if not exists product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade,
  variant_id  uuid references product_variants(id) on delete set null,
  url         text not null,
  alt         text,
  display_order int not null default 0,
  is_featured boolean not null default false
);

-- Promo codes
create table if not exists promo_codes (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,
  discount_type text not null default 'percent' check (discount_type in ('percent','fixed')),
  discount_value numeric(10,2) not null,
  min_order     numeric(10,2) not null default 0,
  expires_at    timestamptz,
  usage_limit   int,
  used_count    int not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Orders (saved from the storefront WhatsApp checkout)
create table if not exists orders (
  id            bigint generated always as identity primary key,
  customer_name text,
  phone         text,
  address       text,
  shipping_zone text,
  subtotal      numeric(10,2),
  discount      numeric(10,2) default 0,
  shipping      numeric(10,2) default 0,
  total         numeric(10,2),
  promo_code    text,
  status        text not null default 'pending'
                check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  note          text,
  created_at    timestamptz not null default now()
);
create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    bigint references orders(id) on delete cascade,
  product_id  uuid,
  product_name text,
  variant     text,
  qty         int not null default 1,
  unit_price  numeric(10,2)
);

-- Settings (key -> JSON): brand, socials, shipping, seo, homepage, trust...
create table if not exists settings (
  key        text primary key,
  value      jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_settings_updated on settings;
create trigger trg_settings_updated before update on settings
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- Public (anon) can READ storefront data and CREATE orders.
-- Only admins can write everything else / read orders.
-- ============================================================
alter table admins           enable row level security;
alter table categories       enable row level security;
alter table filters          enable row level security;
alter table filter_options   enable row level security;
alter table products         enable row level security;
alter table product_variants enable row level security;
alter table media            enable row level security;
alter table product_images   enable row level security;
alter table promo_codes      enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;
alter table settings         enable row level security;

-- helper macro pattern: drop-then-create so re-running is safe
-- Admins can see the admins table (to verify their own membership)
drop policy if exists admins_admin_all on admins;
create policy admins_admin_all on admins for all using (is_admin()) with check (is_admin());
drop policy if exists admins_self_read on admins;
create policy admins_self_read on admins for select using (user_id = auth.uid());

-- Public-readable storefront tables
drop policy if exists categories_read on categories;
create policy categories_read on categories for select using (true);
drop policy if exists categories_admin on categories;
create policy categories_admin on categories for all using (is_admin()) with check (is_admin());

drop policy if exists filters_read on filters;
create policy filters_read on filters for select using (true);
drop policy if exists filters_admin on filters;
create policy filters_admin on filters for all using (is_admin()) with check (is_admin());

drop policy if exists filter_options_read on filter_options;
create policy filter_options_read on filter_options for select using (true);
drop policy if exists filter_options_admin on filter_options;
create policy filter_options_admin on filter_options for all using (is_admin()) with check (is_admin());

-- Products: public sees everything except archived/draft; admins see all
drop policy if exists products_read on products;
create policy products_read on products for select using (status in ('active','out_of_stock') or is_admin());
drop policy if exists products_admin on products;
create policy products_admin on products for all using (is_admin()) with check (is_admin());

drop policy if exists variants_read on product_variants;
create policy variants_read on product_variants for select using (true);
drop policy if exists variants_admin on product_variants;
create policy variants_admin on product_variants for all using (is_admin()) with check (is_admin());

drop policy if exists images_read on product_images;
create policy images_read on product_images for select using (true);
drop policy if exists images_admin on product_images;
create policy images_admin on product_images for all using (is_admin()) with check (is_admin());

drop policy if exists media_read on media;
create policy media_read on media for select using (true);
drop policy if exists media_admin on media;
create policy media_admin on media for all using (is_admin()) with check (is_admin());

-- Promo codes: public may read ACTIVE codes (storefront validates); admins all
drop policy if exists promo_read on promo_codes;
create policy promo_read on promo_codes for select using (active or is_admin());
drop policy if exists promo_admin on promo_codes;
create policy promo_admin on promo_codes for all using (is_admin()) with check (is_admin());

-- Orders: anyone may CREATE an order; only admins may read/update/delete
drop policy if exists orders_insert on orders;
create policy orders_insert on orders for insert with check (true);
drop policy if exists orders_admin_read on orders;
create policy orders_admin_read on orders for select using (is_admin());
drop policy if exists orders_admin_write on orders;
create policy orders_admin_write on orders for update using (is_admin()) with check (is_admin());
drop policy if exists orders_admin_delete on orders;
create policy orders_admin_delete on orders for delete using (is_admin());

drop policy if exists order_items_insert on order_items;
create policy order_items_insert on order_items for insert with check (true);
drop policy if exists order_items_admin on order_items;
create policy order_items_admin on order_items for select using (is_admin());

-- Settings: public read (storefront needs them); admins write
drop policy if exists settings_read on settings;
create policy settings_read on settings for select using (true);
drop policy if exists settings_admin on settings;
create policy settings_admin on settings for all using (is_admin()) with check (is_admin());

-- ============================================================
-- SEED — categories, filters, promo, settings
-- (products are seeded by supabase/seed-products.sql)
-- ============================================================
insert into categories (slug, name_fr, name_en, display_order) values
  ('necklaces', 'Colliers', 'Necklaces', 1),
  ('sets',      'Parures',  'Sets',      2),
  ('earrings',  'Boucles d''oreilles', 'Earrings', 3),
  ('bracelets', 'Bracelets','Bracelets', 4),
  ('rings',     'Bagues',   'Rings',     5)
on conflict (slug) do nothing;

insert into filters (key, name_fr, name_en, display_order) values
  ('color',    'Couleur',  'Color',    1),
  ('material', 'Matière',  'Material', 2)
on conflict (key) do nothing;

insert into filter_options (filter_id, value, label_fr, label_en, display_order)
select f.id, x.value, x.label_fr, x.label_en, x.ord
from filters f
join (values
  ('color','gold','Doré','Gold',1),
  ('color','silver','Argenté','Silver',2),
  ('color','rose-gold','Or rose','Rose Gold',3),
  ('color','white-gold','Or blanc','White Gold',4),
  ('material','stainless','Acier inoxydable','Stainless steel',1)
) as x(fkey,value,label_fr,label_en,ord) on x.fkey = f.key
on conflict do nothing;

insert into promo_codes (code, discount_type, discount_value, min_order, active) values
  ('BELORYA10', 'percent', 10, 100, true)
on conflict (code) do nothing;

insert into settings (key, value) values
  ('brand', '{"name":"Belorya","tagline":"Eternal Shine"}'),
  ('socials', '{"instagram":"https://www.instagram.com/belorya_/","facebook":"https://www.facebook.com/profile.php?id=61591102114678","tiktok":"https://www.tiktok.com/@belorya5","whatsapp":"212660323891","email":"belorya1@gmail.com"}'),
  ('shipping', '{"casablanca_free":true,"outside_fee":35,"free_threshold":250,"eta":"2–4 jours ouvrables"}'),
  ('seo', '{"title":"BELORYA | Bijoux en acier inoxydable","description":"Découvrez notre collection de bijoux en acier inoxydable : bagues, colliers, bracelets et boucles d''oreilles. Livraison gratuite à Casablanca et offerte dès 250 MAD.","ga":"","meta_pixel":""}'),
  ('homepage', '{"hero_title_fr":"Bijoux en acier<br><em>inoxydable</em>","hero_sub_fr":"Des pièces raffinées, pensées pour l''élégance du quotidien, l''éclat et la durabilité.","hero_image":"assets/products/reflet-lunaire/1.jpeg","hero_label":"Reflet Lunaire"}')
on conflict (key) do nothing;
