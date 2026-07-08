-- ============================================================
-- WAITLIST (public signups from the marketing site)
-- ============================================================
-- Run this in the Supabase SQL Editor, then view rows under
-- Table Editor → waitlist.
-- ============================================================

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  constraint waitlist_email_unique unique (email)
);

create index if not exists idx_waitlist_created_at
  on public.waitlist (created_at desc);

alter table public.waitlist enable row level security;

-- Anyone can join the waitlist (anon / publishable key).
drop policy if exists "waitlist_insert_public" on public.waitlist;
create policy "waitlist_insert_public"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (
    email is not null
    and length(trim(email)) > 3
    and position('@' in email) > 1
  );

-- No public reads — view emails in the Supabase dashboard
-- (service role bypasses RLS) or add an authenticated admin policy later.
drop policy if exists "waitlist_select_none" on public.waitlist;

comment on table public.waitlist is 'Marketing-site early-access waitlist emails';
