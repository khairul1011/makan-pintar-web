-- ============================================
-- MAKAN PINTAR — Supabase Database Schema
-- ============================================

-- 1. PROFILES (data user: saldo, target, notifikasi)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  saldo_makan integer default 420000,
  hari_ke_kiriman integer default 12,
  total_kiriman integer default 1500000,
  tanggal_kiriman text default '30 Juni',
  target_calories integer default 2000,
  target_protein integer default 60,
  notifications jsonb default '{"budgetWarning": true, "logReminder": true, "kirimanReminder": false}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. FOOD_ENTRIES (log makanan harian)
create table if not exists food_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  emoji text default '🍛',
  name text not null,
  meal text not null check (meal in ('Pagi', 'Siang', 'Sore', 'Malam')),
  calories integer default 0,
  price integer default 0,
  entry_date date default current_date,
  created_at timestamptz default now()
);

-- 3. KIRIMAN_HISTORY (riwayat penerimaan kiriman)
create table if not exists kiriman_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  amount integer not null,
  received_date date default current_date,
  note text,
  created_at timestamptz default now()
);

-- 4. RECIPES (resep survival)
create table if not exists recipes (
  id uuid default gen_random_uuid() primary key,
  emoji text default '🍳',
  name text not null,
  meta text,
  price integer default 0,
  ingredients text[] default '{}',
  tags text[] default '{}',
  steps jsonb default '[]'::jsonb,
  is_ai_generated boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Setiap user hanya bisa akses data miliknya
-- ============================================

alter table profiles enable row level security;
alter table food_entries enable row level security;
alter table kiriman_history enable row level security;
alter table recipes enable row level security;

-- Profiles: user hanya bisa baca/tulis profilnya sendiri
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Food entries: user hanya bisa akses log makanannya sendiri
create policy "Users can view own food entries"
  on food_entries for select using (auth.uid() = user_id);

create policy "Users can insert own food entries"
  on food_entries for insert with check (auth.uid() = user_id);

create policy "Users can delete own food entries"
  on food_entries for delete using (auth.uid() = user_id);

-- Kiriman history: user hanya bisa akses riwayat kirimannya sendiri
create policy "Users can view own kiriman"
  on kiriman_history for select using (auth.uid() = user_id);

create policy "Users can insert own kiriman"
  on kiriman_history for insert with check (auth.uid() = user_id);

-- Recipes: semua orang bisa baca resep
create policy "Anyone can view recipes"
  on recipes for select using (true);

-- ============================================
-- TRIGGER: Auto-create profile saat user register
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- SEED DATA: Resep default
-- ============================================

insert into recipes (emoji, name, meta, price, ingredients, tags, steps, is_ai_generated) values
  ('🥚', 'Telur Kecap + Nasi', 'Rp 5.000 | 10 menit | ~400 kkal', 5000,
   '{"Telur","Nasi","Kecap","Bawang"}', '{"telur","nasi"}',
   '[["Panaskan sedikit minyak, tumis bawang sampai harum.","2 menit"],["Masukkan telur, orak-arik atau ceplok sesuai selera.","3 menit"],["Tambahkan kecap dan sedikit air, aduk sampai meresap.","3 menit"],["Sajikan dengan nasi hangat.","2 menit"]]'::jsonb,
   false),
  ('🍜', 'Indomie Telur Rebus', 'Rp 4.500 | 7 menit | ~380 kkal', 4500,
   '{"Indomie","Telur","Sayur"}', '{"indomie","telur"}',
   '[["Rebus air sampai mendidih.","2 menit"],["Masukkan mie dan telur, masak sampai matang.","4 menit"],["Campur bumbu, tambahkan sayur jika ada.","1 menit"]]'::jsonb,
   false),
  ('🍳', 'Nasi + Tempe Goreng', 'Rp 6.000 | 15 menit | ~450 kkal', 6000,
   '{"Nasi","Tempe","Minyak","Garam"}', '{"nasi"}',
   '[["Iris tempe tipis lalu beri garam secukupnya.","3 menit"],["Panaskan minyak dan goreng tempe hingga kecokelatan.","9 menit"],["Tiriskan lalu sajikan bersama nasi.","3 menit"]]'::jsonb,
   false),
  ('🥣', 'Bubur Indomie', 'Rp 3.500 | 8 menit | ~320 kkal', 3500,
   '{"Indomie","Air","Telur"}', '{"indomie","telur"}',
   '[["Remukkan mie lalu rebus dengan air agak banyak.","4 menit"],["Aduk sampai teksturnya lembut seperti bubur.","2 menit"],["Masukkan telur dan bumbu, aduk sampai matang.","2 menit"]]'::jsonb,
   false);
