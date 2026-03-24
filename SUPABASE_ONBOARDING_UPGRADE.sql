create table if not exists public.professional_documents (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.profiles(id) on delete cascade,
  document_type text not null,
  file_path text not null,
  file_name text,
  mime_type text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  created_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

create table if not exists public.service_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  default_duration int,
  created_at timestamptz default now()
);

alter table public.professional_services
add column if not exists catalog_id uuid references public.service_catalog(id);

insert into public.service_catalog (name, category, default_duration)
values
('Taglio donna', 'Capelli', 45),
('Taglio uomo', 'Capelli', 30),
('Piega', 'Capelli', 30),
('Colore', 'Capelli', 90),
('Manicure', 'Unghie', 45),
('Pedicure', 'Unghie', 60),
('Pulizia viso', 'Estetica', 60),
('Massaggio rilassante', 'Massaggi', 60)
on conflict do nothing;

insert into storage.buckets (id, name, public)
values
('documents', 'documents', false),
('portfolio', 'portfolio', true)
on conflict do nothing;

alter table public.professional_documents enable row level security;

create policy if not exists "users read own documents"
on public.professional_documents
for select
using (auth.uid() = professional_id);

create policy if not exists "users insert own documents"
on public.professional_documents
for insert
with check (auth.uid() = professional_id);

create policy if not exists "users update own documents"
on public.professional_documents
for update
using (auth.uid() = professional_id);

create policy if not exists "upload documents"
on storage.objects
for insert
with check (
  bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
);

create policy if not exists "read own documents"
on storage.objects
for select
using (
  bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
);

create policy if not exists "upload portfolio"
on storage.objects
for insert
with check (
  bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]
);

create policy if not exists "read portfolio public"
on storage.objects
for select
using (bucket_id = 'portfolio');

alter table public.professional_services
  drop constraint if exists duration_step_check;
alter table public.professional_services
  add constraint duration_step_check check (duration_minutes % 10 = 0);

alter table public.professional_availability
  drop constraint if exists time_step_check;
alter table public.professional_availability
  add constraint time_step_check check (
    extract(minute from start_time)::int % 15 = 0 AND
    extract(minute from end_time)::int % 15 = 0
  );
