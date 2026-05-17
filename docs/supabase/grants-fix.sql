-- BookVerse: исправление HTTP 403 на profiles, favorites, collections…
-- Выполните в Supabase → SQL Editor → Run (один раз, если уже запускали schema.sql без GRANT).

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table public.profiles to anon, authenticated;
grant select, insert, update, delete on table public.favorites to anon, authenticated;
grant select, insert, update, delete on table public.collections to anon, authenticated;
grant select, insert, update, delete on table public.collection_books to anon, authenticated;
grant select, insert, update, delete on table public.reviews to anon, authenticated;
