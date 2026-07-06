-- Quick patch for existing Supabase projects.
-- Run this if the Analysis tab fails after the initial care-schedules.sql migration.

-- 1. Add missing enum values (run each block separately if the full script failed).
do $$
begin
  if not exists (
    select 1 from pg_enum
    where enumlabel = 'checkup'
      and enumtypid = 'public.care_type'::regtype
  ) then
    alter type public.care_type add value 'checkup';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_enum
    where enumlabel = 'checkup'
      and enumtypid = 'public.log_type'::regtype
  ) then
    alter type public.log_type add value 'checkup';
  end if;
end $$;

-- 2. Add completed_at if reminders table predates the care migration.
alter table public.reminders
  add column if not exists completed_at timestamptz;

-- 3. Re-grant RPC access (safe to re-run).
grant execute on function public.generate_plant_care_schedules(uuid, uuid, int, int) to authenticated;
grant execute on function public.ensure_weekly_reminders(uuid) to authenticated;
grant execute on function public.complete_care_reminder(uuid, uuid) to authenticated;
