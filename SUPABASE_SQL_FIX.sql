-- ESEGUI QUESTA QUERY UNA SOLA VOLTA NEL SQL EDITOR DI SUPABASE

-- 1) rimuove trigger/funzione che causano "Database error saving new user"
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2) mantiene RLS attiva
alter table if exists public.pending_registrations enable row level security;
alter table if exists public.profiles enable row level security;

-- 3) policy minime corrette per il flusso attuale (Strada B gestita dal frontend)
drop policy if exists "Allow anon insert pending registrations" on public.pending_registrations;
drop policy if exists "Allow authenticated read own pending registration" on public.pending_registrations;
drop policy if exists "Allow authenticated delete own pending registration" on public.pending_registrations;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Allow anon insert pending registrations"
on public.pending_registrations
for insert
to anon
with check (true);

create policy "Allow authenticated read own pending registration"
on public.pending_registrations
for select
to authenticated
using (email = auth.email());

create policy "Allow authenticated delete own pending registration"
on public.pending_registrations
for delete
to authenticated
using (email = auth.email());

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- 4) opzionale ma consigliato: pulizia test vecchi
-- delete from public.pending_registrations;
-- delete from public.profiles where email = 'LA_TUA_EMAIL_DI_TEST';
-- poi elimina anche l'utente da Authentication > Users

notify pgrst, 'reload schema';
