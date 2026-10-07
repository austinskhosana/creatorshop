create table if not exists public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  audience text not null check (audience in ('brand', 'creator')),
  email text not null,
  email_normalized text generated always as (lower(email)) stored,
  name text,
  company_name text,
  website text,
  social_handle text,
  platform text,
  audience_size text,
  source_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.waitlist_entries enable row level security;

create unique index if not exists waitlist_entries_email_audience_idx
  on public.waitlist_entries (email_normalized, audience);

create index if not exists waitlist_entries_audience_created_at_idx
  on public.waitlist_entries (audience, created_at desc);
