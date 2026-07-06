-- Care schedules, reminders, and weekly task generation for Sproutly.
-- Run in Supabase SQL editor after the base schema from CONTEXT.md.

-- Extend care_type to include weekly check-ups
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

-- Extend log_type for manual check-up completions
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

create table if not exists public.care_schedules (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  care_type public.care_type not null,
  frequency_days int not null check (frequency_days > 0),
  last_completed_at timestamptz,
  next_due_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_care_schedules_plant_id on public.care_schedules(plant_id);
create index if not exists idx_care_schedules_next_due
  on public.care_schedules(next_due_at) where is_active = true;

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  care_schedule_id uuid references public.care_schedules(id) on delete cascade,
  care_type public.care_type not null,
  due_at timestamptz not null,
  status public.reminder_status not null default 'pending',
  notified_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_reminders_user_id on public.reminders(user_id);
create index if not exists idx_reminders_status_due on public.reminders(status, due_at);

-- Backfill column when reminders table already existed from the base schema.
alter table public.reminders
  add column if not exists completed_at timestamptz;

alter table public.care_schedules enable row level security;
alter table public.reminders enable row level security;

drop policy if exists "care_schedules_all_own" on public.care_schedules;
create policy "care_schedules_all_own" on public.care_schedules for all
  using (exists (select 1 from public.plants p where p.id = plant_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.plants p where p.id = plant_id and p.user_id = auth.uid()));

drop policy if exists "reminders_all_own" on public.reminders;
create policy "reminders_all_own" on public.reminders for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Create default watering + weekly check-up schedules for a plant
create or replace function public.generate_plant_care_schedules(
  p_plant_id uuid,
  p_user_id uuid,
  p_watering_days int default 7,
  p_checkup_days int default 7
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_watering_schedule_id uuid;
  v_checkup_schedule_id uuid;
  v_next_due timestamptz := date_trunc('day', now()) + interval '1 day' + interval '10 hours';
begin
  if not exists (
    select 1 from public.plants
    where id = p_plant_id and user_id = p_user_id and is_active = true
  ) then
    raise exception 'Plant not found';
  end if;

  insert into public.care_schedules (plant_id, care_type, frequency_days, next_due_at)
  values (p_plant_id, 'watering', p_watering_days, v_next_due)
  returning id into v_watering_schedule_id;

  insert into public.reminders (plant_id, user_id, care_schedule_id, care_type, due_at)
  values (p_plant_id, p_user_id, v_watering_schedule_id, 'watering', v_next_due);

  insert into public.care_schedules (plant_id, care_type, frequency_days, next_due_at)
  values (p_plant_id, 'checkup', p_checkup_days, v_next_due + interval '2 hours')
  returning id into v_checkup_schedule_id;

  insert into public.reminders (plant_id, user_id, care_schedule_id, care_type, due_at)
  values (p_plant_id, p_user_id, v_checkup_schedule_id, 'checkup', v_next_due + interval '2 hours');
end;
$$;

-- Ensure each active schedule has a pending reminder for its next due date
create or replace function public.ensure_weekly_reminders(p_user_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_schedule record;
  v_created int := 0;
begin
  for v_schedule in
    select cs.id, cs.plant_id, cs.care_type, cs.next_due_at
    from public.care_schedules cs
    join public.plants p on p.id = cs.plant_id
    where p.user_id = p_user_id
      and p.is_active = true
      and cs.is_active = true
      and cs.next_due_at <= now() + interval '7 days'
      and not exists (
        select 1 from public.reminders r
        where r.care_schedule_id = cs.id
          and r.status = 'pending'
          and r.due_at >= date_trunc('day', now())
      )
  loop
    insert into public.reminders (plant_id, user_id, care_schedule_id, care_type, due_at)
    values (
      v_schedule.plant_id,
      p_user_id,
      v_schedule.id,
      v_schedule.care_type,
      greatest(v_schedule.next_due_at, now())
    );
    v_created := v_created + 1;
  end loop;

  return v_created;
end;
$$;

-- Complete a care reminder and roll the schedule forward
create or replace function public.complete_care_reminder(
  p_reminder_id uuid,
  p_user_id uuid
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reminder public.reminders;
  v_schedule public.care_schedules;
  v_completed_at timestamptz := now();
  v_next_due timestamptz;
  v_log_type public.log_type;
begin
  select * into v_reminder
  from public.reminders
  where id = p_reminder_id and user_id = p_user_id and status = 'pending'
  for update;

  if not found then
    raise exception 'Reminder not found or already completed';
  end if;

  select * into v_schedule
  from public.care_schedules
  where id = v_reminder.care_schedule_id
  for update;

  update public.reminders
  set status = 'completed', completed_at = v_completed_at
  where id = p_reminder_id;

  v_next_due := v_completed_at + (v_schedule.frequency_days || ' days')::interval;

  update public.care_schedules
  set
    last_completed_at = v_completed_at,
    next_due_at = v_next_due,
    updated_at = v_completed_at
  where id = v_schedule.id;

  v_log_type := case
    when v_reminder.care_type = 'watering' then 'watering'::public.log_type
    when v_reminder.care_type = 'checkup' then 'checkup'::public.log_type
    else 'note'::public.log_type
  end;

  insert into public.plant_logs (plant_id, log_type, notes)
  values (
    v_reminder.plant_id,
    v_log_type,
    case v_reminder.care_type
      when 'watering' then 'Watered'
      when 'checkup' then 'Weekly check-up completed'
      else 'Care task completed'
    end
  );

  insert into public.reminders (plant_id, user_id, care_schedule_id, care_type, due_at)
  values (v_reminder.plant_id, p_user_id, v_schedule.id, v_reminder.care_type, v_next_due);

  return v_completed_at;
end;
$$;

grant execute on function public.generate_plant_care_schedules(uuid, uuid, int, int) to authenticated;
grant execute on function public.ensure_weekly_reminders(uuid) to authenticated;
grant execute on function public.complete_care_reminder(uuid, uuid) to authenticated;
