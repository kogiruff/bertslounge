-- Run this once in the Supabase SQL editor.
-- The site only stores one configuration value today, but this shape is extensible.
create table if not exists public.commission_config (
  key text primary key,
  value text not null check (value in ('true', 'false')),
  updated_by text,
  updated_at timestamptz not null default now()
);

alter table public.commission_config enable row level security;

-- Public reads and admin writes go through Vercel server functions using the
-- service-role key, which bypasses RLS. No browser policies are intentionally
-- created: clients must never write this table directly.

insert into public.commission_config (key, value)
values ('open', 'false')
on conflict (key) do nothing;
