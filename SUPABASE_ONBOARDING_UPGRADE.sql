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
('Massaggio rilassante', 'Massaggi', 60);

alter table public.service_catalog enable row level security;

drop policy if exists "read service catalog" on public.service_catalog;
create policy "read service catalog"
on public.service_catalog
for select
using (true);

drop constraint if exists duration_step_check on public.professional_services;
alter table public.professional_services
add constraint duration_step_check
check (duration_minutes % 10 = 0);

drop constraint if exists time_step_check on public.professional_availability;
alter table public.professional_availability
add constraint time_step_check
check (
  extract(minute from start_time)::int % 15 = 0 AND
  extract(minute from end_time)::int % 15 = 0
);
