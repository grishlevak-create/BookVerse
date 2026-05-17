-- BookVerse — Supabase schema + Row Level Security
-- Run in Supabase SQL editor (project → SQL → New query).

create extension if not exists "pgcrypto";

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Favorites
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, book_id)
);

create index if not exists favorites_user_id_idx on public.favorites (user_id);

alter table public.favorites enable row level security;

create policy "favorites_select_own"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites_insert_own"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites_delete_own"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Collections
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create index if not exists collections_user_id_idx on public.collections (user_id);

alter table public.collections enable row level security;

create policy "collections_select_own"
  on public.collections for select
  using (auth.uid() = user_id);

create policy "collections_insert_own"
  on public.collections for insert
  with check (auth.uid() = user_id);

create policy "collections_update_own"
  on public.collections for update
  using (auth.uid() = user_id);

create policy "collections_delete_own"
  on public.collections for delete
  using (auth.uid() = user_id);

-- Collection books
create table if not exists public.collection_books (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections (id) on delete cascade,
  book_id text not null,
  created_at timestamptz not null default now(),
  unique (collection_id, book_id)
);

create index if not exists collection_books_collection_id_idx on public.collection_books (collection_id);

alter table public.collection_books enable row level security;

create policy "collection_books_select_via_owner"
  on public.collection_books for select
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

create policy "collection_books_insert_via_owner"
  on public.collection_books for insert
  with check (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

create policy "collection_books_delete_via_owner"
  on public.collection_books for delete
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

-- Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  book_id text not null,
  text text not null,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique (user_id, book_id)
);

create index if not exists reviews_book_id_idx on public.reviews (book_id);

alter table public.reviews enable row level security;

create policy "reviews_select_all"
  on public.reviews for select
  using (true);

create policy "reviews_insert_own"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "reviews_update_own"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "reviews_delete_own"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Права для REST API (роли anon / authenticated). Без этого — HTTP 403 на /rest/v1/*
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table public.profiles to anon, authenticated;
grant select, insert, update, delete on table public.favorites to anon, authenticated;
grant select, insert, update, delete on table public.collections to anon, authenticated;
grant select, insert, update, delete on table public.collection_books to anon, authenticated;
grant select, insert, update, delete on table public.reviews to anon, authenticated;
