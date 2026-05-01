-- =============================================
-- Egypt Tour Guide Platform - Supabase Schema
-- Run this in your Supabase SQL editor
-- =============================================

-- 1. Hero Images
create table if not exists hero_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text_ja text not null default '',
  alt_text_en text not null default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Guides
create table if not exists guides (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('licensed', 'travel_buddy')),
  bio_ja text not null default '',
  bio_en text not null default '',
  photo_url text,
  languages text[] not null default '{}',
  experience_years integer not null default 0,
  license_number text,
  specialties text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Packages
create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references guides(id) on delete cascade,
  title_ja text not null default '',
  title_en text not null default '',
  description_ja text not null default '',
  description_en text not null default '',
  duration text not null default '',
  price_usd numeric not null default 0,
  included_items text[] not null default '{}',
  photo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4. Airport Pickup Services
create table if not exists airport_pickup_services (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  vehicle_type text not null default '',
  capacity integer not null default 4,
  price_usd numeric not null default 0,
  description_ja text not null default '',
  description_en text not null default '',
  photo_url text,
  is_active boolean not null default true
);

-- 5. Landmarks
create table if not exists landmarks (
  id uuid primary key default gen_random_uuid(),
  name_ja text not null,
  name_en text not null,
  slug text not null unique,
  description_ja text not null default '',
  description_en text not null default '',
  location text not null default '',
  tips_ja text not null default '',
  tips_en text not null default '',
  photos text[] not null default '{}',
  is_featured boolean not null default false
);

-- 6. Reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  review_ja text not null default '',
  review_en text not null default '',
  rating integer not null check (rating between 1 and 5),
  photo_url text,
  service_type text not null check (service_type in ('guide', 'airport_pickup', 'landmark')),
  created_at timestamptz not null default now()
);

-- 7. About Content
create table if not exists about_content (
  id uuid primary key default gen_random_uuid(),
  title_ja text not null default '',
  title_en text not null default '',
  content_ja text not null default '',
  content_en text not null default '',
  photo_url text
);

-- 8. Contact Info
create table if not exists contact_info (
  id uuid primary key default gen_random_uuid(),
  email text not null default '',
  whatsapp text not null default '',
  line_id text not null default '',
  instagram text not null default '',
  facebook text not null default '',
  address text not null default ''
);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
alter table hero_images enable row level security;
alter table guides enable row level security;
alter table packages enable row level security;
alter table airport_pickup_services enable row level security;
alter table landmarks enable row level security;
alter table reviews enable row level security;
alter table about_content enable row level security;
alter table contact_info enable row level security;

-- Public read access for all tables
drop policy if exists "Public read hero_images" on hero_images;
create policy "Public read hero_images" on hero_images for select using (true);
drop policy if exists "Public read guides" on guides;
create policy "Public read guides" on guides for select using (true);
drop policy if exists "Public read packages" on packages;
create policy "Public read packages" on packages for select using (true);
drop policy if exists "Public read airport_pickup_services" on airport_pickup_services;
create policy "Public read airport_pickup_services" on airport_pickup_services for select using (true);
drop policy if exists "Public read landmarks" on landmarks;
create policy "Public read landmarks" on landmarks for select using (true);
drop policy if exists "Public read reviews" on reviews;
create policy "Public read reviews" on reviews for select using (true);
drop policy if exists "Public read about_content" on about_content;
create policy "Public read about_content" on about_content for select using (true);
drop policy if exists "Public read contact_info" on contact_info;
create policy "Public read contact_info" on contact_info for select using (true);

-- Authenticated users (admins) can do everything
drop policy if exists "Admins manage hero_images" on hero_images;
create policy "Admins manage hero_images" on hero_images for all using (auth.role() = 'authenticated');
drop policy if exists "Admins manage guides" on guides;
create policy "Admins manage guides" on guides for all using (auth.role() = 'authenticated');
drop policy if exists "Admins manage packages" on packages;
create policy "Admins manage packages" on packages for all using (auth.role() = 'authenticated');
drop policy if exists "Admins manage airport_pickup_services" on airport_pickup_services;
create policy "Admins manage airport_pickup_services" on airport_pickup_services for all using (auth.role() = 'authenticated');
drop policy if exists "Admins manage landmarks" on landmarks;
create policy "Admins manage landmarks" on landmarks for all using (auth.role() = 'authenticated');
drop policy if exists "Admins manage reviews" on reviews;
create policy "Admins manage reviews" on reviews for all using (auth.role() = 'authenticated');
drop policy if exists "Admins manage about_content" on about_content;
create policy "Admins manage about_content" on about_content for all using (auth.role() = 'authenticated');
drop policy if exists "Admins manage contact_info" on contact_info;
create policy "Admins manage contact_info" on contact_info for all using (auth.role() = 'authenticated');

-- =============================================
-- Storage Bucket
-- =============================================

-- Create a public 'images' bucket in Supabase Storage (do this in the dashboard UI)
-- Or run:
-- insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- Storage policies
-- create policy "Public read images" on storage.objects for select using (bucket_id = 'images');
-- create policy "Auth upload images" on storage.objects for insert using (auth.role() = 'authenticated' and bucket_id = 'images');
-- create policy "Auth delete images" on storage.objects for delete using (auth.role() = 'authenticated' and bucket_id = 'images');

-- =============================================
-- Seed: 3 placeholder hero images (Unsplash Egypt)
-- =============================================

insert into hero_images (image_url, alt_text_ja, alt_text_en, display_order, is_active) values
  ('https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1600&q=80', 'ギザのピラミッド', 'Pyramids of Giza', 1, true),
  ('https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1600&q=80', 'ルクソール神殿', 'Luxor Temple', 2, true),
  ('https://images.unsplash.com/photo-1608425093889-8f2f39df16c7?w=1600&q=80', 'ナイル川の夕暮れ', 'Nile River Sunset', 3, true)
on conflict do nothing;

-- =============================================
-- IMPORTANT: Create admin user
-- =============================================
-- Go to Supabase Dashboard > Authentication > Users > "Invite user"
-- Or use the Supabase Auth API to create your admin account.
-- After creating, update .env.local with your Supabase URL and keys.
