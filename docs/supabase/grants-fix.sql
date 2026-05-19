-- BookVerse — права REST API (роли anon / authenticated)
-- Supabase → SQL Editor → Run (если schema.sql уже выполнялся без GRANT)

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table public.profiles to anon, authenticated;
grant select, insert, update, delete on table public.favorites to anon, authenticated;
grant select, insert, update, delete on table public.collections to anon, authenticated;
grant select, insert, update, delete on table public.collection_books to anon, authenticated;
grant select, insert, update, delete on table public.reviews to anon, authenticated;
