-- ═══════════════════════════════════════════════════════════════════
-- THE MUSIC EMBASSY — run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run most sections
-- ═══════════════════════════════════════════════════════════════════


-- ── 1) INSTRUMENTS — active offerings (Drums, Piano, Saxophone, Voice Training, Violin) ──

update public.instruments
set active = false
where name not in ('Drums', 'Piano', 'Saxophone', 'Voice Training', 'Violin');

insert into public.instruments (name, description, monthly_fee, active)
values
  ('Drums', 'Time feel, kit technique, hand percussion, and locking with ensembles.', 300.00, true),
  ('Piano', 'Classical foundations to contemporary harmony and performance at the keys.', 350.00, true),
  ('Saxophone', 'Tone production, breath control, jazz phrasing, and ensemble skills.', 320.00, true),
  ('Voice Training', 'Breath, tone, stage presence, and studio-ready delivery.', 320.00, true),
  ('Violin', 'Bow technique, intonation, repertoire, and ensemble skills.', 320.00, true)
on conflict (name) do update set
  description = excluded.description,
  monthly_fee = excluded.monthly_fee,
  active = true;


-- ── 2) STUDENT POLICIES — browse instruments & self-enrol ──

drop policy if exists "Anyone can view active instruments for signup" on public.instruments;
create policy "Anyone can view active instruments for signup"
  on public.instruments for select
  using (active = true);

drop policy if exists "Students can create own enrollments" on public.enrollments;
create policy "Students can create own enrollments"
  on public.enrollments for insert
  with check (auth.uid() = student_id);


-- ── 3) ASSIGNMENTS TABLE + ADMIN PORTAL POLICIES ──

create table if not exists public.assignments (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  due_date      date,
  enrollment_id uuid references public.enrollments(id) on delete cascade,
  student_id    uuid not null references public.profiles(id) on delete cascade,
  resource_url  text,
  created_by    uuid references public.profiles(id),
  created_at    timestamptz not null default now()
);

alter table public.assignments
  add column if not exists enrollment_id uuid references public.enrollments(id) on delete cascade;

alter table public.assignments
  add column if not exists resource_url text;

alter table public.assignments enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Students can view own assignments" on public.assignments;
create policy "Students can view own assignments"
  on public.assignments for select
  using (auth.uid() = student_id);

drop policy if exists "Admins can manage assignments" on public.assignments;
create policy "Admins can manage assignments"
  on public.assignments for all
  using (public.is_admin());

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());


-- ── 4) QUIZZES TABLE ──

create table if not exists public.quizzes (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  scheduled_at  timestamptz not null,
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  student_id    uuid not null references public.profiles(id) on delete cascade,
  created_by    uuid references public.profiles(id),
  created_at    timestamptz not null default now()
);

alter table public.quizzes enable row level security;

drop policy if exists "Students can view own quizzes" on public.quizzes;
create policy "Students can view own quizzes"
  on public.quizzes for select
  using (auth.uid() = student_id);

drop policy if exists "Admins can manage quizzes" on public.quizzes;
create policy "Admins can manage quizzes"
  on public.quizzes for all
  using (public.is_admin());


-- ── 5) ADMIN ACCOUNT — promote admin@themusicembassy.com ──
-- (Create the auth user first: npm run seed:admin in your project folder)

insert into public.profiles (id, full_name, email, role, status)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.email,
  case when lower(u.email) = 'admin@themusicembassy.com' then 'admin' else 'student' end,
  'approved'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

update public.profiles
set
  role = 'admin',
  status = 'approved',
  full_name = coalesce(nullif(full_name, ''), 'Admin')
where lower(email) = 'admin@themusicembassy.com';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  assigned_role text;
begin
  assigned_role := case
    when lower(new.email) = 'admin@themusicembassy.com' then 'admin'
    else 'student'
  end;

  insert into public.profiles (id, full_name, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    assigned_role,
    'approved'
  )
  on conflict (id) do update set
    role = excluded.role,
    status = 'approved';

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── 6) VERIFY — check results ──

select 'Active instruments' as check_name, count(*)::text as result
from public.instruments where active = true

union all

select 'Admin profile', coalesce(role, 'NOT FOUND')
from public.profiles
where lower(email) = 'admin@themusicembassy.com'

union all

select 'Assignments table', case when to_regclass('public.assignments') is not null then 'OK' else 'MISSING' end

union all

select 'Quizzes table', case when to_regclass('public.quizzes') is not null then 'OK' else 'MISSING' end;


-- ── 7) ADMIN RLS — use is_admin() everywhere (avoids recursive profile checks) ──

drop policy if exists "Admins can manage instruments" on public.instruments;
create policy "Admins can manage instruments"
  on public.instruments for all
  using (public.is_admin());

drop policy if exists "Admins can manage all enrollments" on public.enrollments;
create policy "Admins can manage all enrollments"
  on public.enrollments for all
  using (public.is_admin());

drop policy if exists "Admins can manage all invoices" on public.invoices;
create policy "Admins can manage all invoices"
  on public.invoices for all
  using (public.is_admin());

drop policy if exists "Admins can manage all lesson sessions" on public.lesson_sessions;
create policy "Admins can manage all lesson sessions"
  on public.lesson_sessions for all
  using (public.is_admin());


-- ── 8) FILE UPLOADS — lessons & assignments attachments ──

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portal-files', 'portal-files', true, 26214400, null)
on conflict (id) do update
set public = excluded.public, file_size_limit = excluded.file_size_limit;

alter table public.lesson_sessions
  add column if not exists attachment_urls text[] default '{}';

alter table public.assignments
  add column if not exists attachment_urls text[] default '{}';

drop policy if exists "Admins can upload portal files" on storage.objects;
create policy "Admins can upload portal files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portal-files' and public.is_admin());

drop policy if exists "Admins can update portal files" on storage.objects;
create policy "Admins can update portal files"
  on storage.objects for update to authenticated
  using (bucket_id = 'portal-files' and public.is_admin());

drop policy if exists "Admins can delete portal files" on storage.objects;
create policy "Admins can delete portal files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portal-files' and public.is_admin());

drop policy if exists "Public read portal files" on storage.objects;
create policy "Public read portal files"
  on storage.objects for select to public
  using (bucket_id = 'portal-files');

drop policy if exists "Students can upload assignment submissions" on storage.objects;
create policy "Students can upload assignment submissions"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portal-files'
    and (storage.foldername(name))[1] = 'assignment-submissions'
    and (storage.foldername(name))[2] = auth.uid()::text
  );


-- ── 9) PORTAL FEATURES — submissions, notifications, safety constraints ──

create unique index if not exists enrollments_one_active_per_instrument
  on public.enrollments (student_id, instrument_id)
  where status = 'active';

create unique index if not exists invoices_one_per_enrollment_month
  on public.invoices (enrollment_id, month)
  where status <> 'cancelled';

alter table public.assignments
  add column if not exists submission_notes text,
  add column if not exists submission_urls text[] default '{}',
  add column if not exists submitted_at timestamptz,
  add column if not exists submission_status text not null default 'pending';

alter table public.assignments
  drop constraint if exists assignments_submission_status_check;

alter table public.assignments
  add constraint assignments_submission_status_check
  check (submission_status in ('pending', 'submitted', 'reviewed'));

create table if not exists public.portal_notifications (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles(id) on delete cascade,
  type        text not null check (type in ('lesson', 'assignment', 'quiz', 'invoice')),
  title       text not null,
  body        text,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.portal_notifications enable row level security;

drop policy if exists "Students can view own notifications" on public.portal_notifications;
create policy "Students can view own notifications"
  on public.portal_notifications for select
  using (auth.uid() = student_id);

drop policy if exists "Students can mark own notifications read" on public.portal_notifications;
create policy "Students can mark own notifications read"
  on public.portal_notifications for update
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

drop policy if exists "Admins can manage notifications" on public.portal_notifications;
create policy "Admins can manage notifications"
  on public.portal_notifications for all
  using (public.is_admin());

drop policy if exists "Students can submit own assignments" on public.assignments;
create policy "Students can submit own assignments"
  on public.assignments for update
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);


-- ── 10) SIGN-IN — check if login identifier exists (precise error messages) ──

create or replace function public.profile_exists_for_login(login_identifier text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved text;
begin
  resolved := lower(trim(login_identifier));
  if resolved = 'admin' then
    resolved := 'admin@themusicembassy.com';
  end if;
  return exists (
    select 1 from public.profiles where lower(email) = resolved
  );
end;
$$;

revoke all on function public.profile_exists_for_login(text) from public;
grant execute on function public.profile_exists_for_login(text) to anon, authenticated;


-- ── 11) SECURITY HARDENING — profiles, submissions, enrollments, storage ──

-- Block students from changing role, status, or email on their own profile
create or replace function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    if new.role is distinct from old.role then
      raise exception 'Cannot change role';
    end if;
    if new.status is distinct from old.status then
      raise exception 'Cannot change status';
    end if;
    if lower(new.email) is distinct from lower(old.email) then
      raise exception 'Cannot change email';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_privileged_columns on public.profiles;
create trigger profiles_protect_privileged_columns
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_columns();

-- New signups are always students; promote admin only via section 5 SQL
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    'student',
    'approved'
  )
  on conflict (id) do update set
    full_name = excluded.full_name;

  return new;
end;
$$;

-- Students submit / resubmit assignments via RPC (submission fields only).
-- First submit: status must be pending.
-- Resubmit: allowed for 24 hours after submitted_at while status is still 'submitted'.
-- Locked once reviewed, or after the 24-hour edit window.
create or replace function public.submit_assignment(
  p_assignment_id uuid,
  p_notes text,
  p_urls text[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_status text;
  first_submitted_at timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select coalesce(submission_status, 'pending'), submitted_at
    into current_status, first_submitted_at
  from public.assignments
  where id = p_assignment_id
    and student_id = auth.uid()
  for update;

  if not found then
    raise exception 'Assignment not found';
  end if;

  if current_status = 'reviewed' then
    raise exception 'This submission has been reviewed and can no longer be edited';
  end if;

  if current_status = 'submitted' then
    if first_submitted_at is null
       or first_submitted_at < (now() - interval '24 hours') then
      raise exception 'The 24-hour edit window for this submission has closed';
    end if;

    update public.assignments
    set
      submission_notes = nullif(trim(p_notes), ''),
      submission_urls = coalesce(p_urls, '{}'),
      submission_status = 'submitted'
    where id = p_assignment_id
      and student_id = auth.uid();
  elsif current_status = 'pending' then
    update public.assignments
    set
      submission_notes = nullif(trim(p_notes), ''),
      submission_urls = coalesce(p_urls, '{}'),
      submitted_at = now(),
      submission_status = 'submitted'
    where id = p_assignment_id
      and student_id = auth.uid();
  else
    raise exception 'Assignment cannot be submitted in its current state';
  end if;
end;
$$;

revoke all on function public.submit_assignment(uuid, text, text[]) from public;
grant execute on function public.submit_assignment(uuid, text, text[]) to authenticated;

drop policy if exists "Students can submit own assignments" on public.assignments;

-- Enrolment: active instrument only, approved students only
drop policy if exists "Students can create own enrollments" on public.enrollments;
create policy "Students can create own enrollments"
  on public.enrollments for insert
  with check (
    auth.uid() = student_id
    and status = 'active'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'student'
        and status = 'approved'
    )
    and exists (
      select 1 from public.instruments
      where id = instrument_id and active = true
    )
  );

-- Private file bucket; scoped reads
update storage.buckets
set public = false,
    file_size_limit = 26214400,
    allowed_mime_types = array[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'audio/mpeg',
      'audio/wav',
      'audio/mp4',
      'video/mp4',
      'text/plain'
    ]::text[]
where id = 'portal-files';

drop policy if exists "Public read portal files" on storage.objects;

drop policy if exists "Admins can read portal files" on storage.objects;
create policy "Admins can read portal files"
  on storage.objects for select to authenticated
  using (bucket_id = 'portal-files' and public.is_admin());

drop policy if exists "Students can read portal materials" on storage.objects;
create policy "Students can read portal materials"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'portal-files'
    and (
      (storage.foldername(name))[1] in ('lessons', 'assignments')
      or (
        (storage.foldername(name))[1] = 'assignment-submissions'
        and (storage.foldername(name))[2] = auth.uid()::text
      )
    )
  );


-- ── 12) ASSIGNMENT RESUBMIT WINDOW — 24 hours after first submit ──
-- Re-run this section alone if section 11 was already applied earlier.
-- Students may edit/resubmit while status is 'submitted' and within 24h of submitted_at.
-- Locked after review, or after the window closes. First submitted_at is preserved.

create or replace function public.submit_assignment(
  p_assignment_id uuid,
  p_notes text,
  p_urls text[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_status text;
  first_submitted_at timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select coalesce(submission_status, 'pending'), submitted_at
    into current_status, first_submitted_at
  from public.assignments
  where id = p_assignment_id
    and student_id = auth.uid()
  for update;

  if not found then
    raise exception 'Assignment not found';
  end if;

  if current_status = 'reviewed' then
    raise exception 'This submission has been reviewed and can no longer be edited';
  end if;

  if current_status = 'submitted' then
    if first_submitted_at is null
       or first_submitted_at < (now() - interval '24 hours') then
      raise exception 'The 24-hour edit window for this submission has closed';
    end if;

    update public.assignments
    set
      submission_notes = nullif(trim(p_notes), ''),
      submission_urls = coalesce(p_urls, '{}'),
      submission_status = 'submitted'
    where id = p_assignment_id
      and student_id = auth.uid();
  elsif current_status = 'pending' then
    update public.assignments
    set
      submission_notes = nullif(trim(p_notes), ''),
      submission_urls = coalesce(p_urls, '{}'),
      submitted_at = now(),
      submission_status = 'submitted'
    where id = p_assignment_id
      and student_id = auth.uid();
  else
    raise exception 'Assignment cannot be submitted in its current state';
  end if;
end;
$$;

revoke all on function public.submit_assignment(uuid, text, text[]) from public;
grant execute on function public.submit_assignment(uuid, text, text[]) to authenticated;


-- ── 13) SITE MEDIA — admin-managed events & gallery (photos / videos) ──

create table if not exists public.site_events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  event_date  text,
  media_url   text,
  media_type  text check (media_type is null or media_type in ('image', 'video')),
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  tag         text,
  media_url   text not null,
  media_type  text not null default 'image' check (media_type in ('image', 'video')),
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.site_events enable row level security;
alter table public.gallery_items enable row level security;

drop policy if exists "Public read published site events" on public.site_events;
create policy "Public read published site events"
  on public.site_events for select to public
  using (published = true);

drop policy if exists "Admins manage site events" on public.site_events;
create policy "Admins manage site events"
  on public.site_events for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public read published gallery items" on public.gallery_items;
create policy "Public read published gallery items"
  on public.gallery_items for select to public
  using (published = true);

drop policy if exists "Admins manage gallery items" on public.gallery_items;
create policy "Admins manage gallery items"
  on public.gallery_items for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Allow larger uploads for site media; add video/webm
update storage.buckets
set file_size_limit = 104857600,
    allowed_mime_types = array[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'audio/mpeg',
      'audio/wav',
      'audio/mp4',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'text/plain'
    ]::text[]
where id = 'portal-files';

drop policy if exists "Public read site media files" on storage.objects;
create policy "Public read site media files"
  on storage.objects for select to public
  using (
    bucket_id = 'portal-files'
    and (storage.foldername(name))[1] in ('events', 'gallery')
  );


-- ── 14) BILLING — auto invoice on enroll + monthly ensure ──

create or replace function public.month_label_for(d date)
returns text
language sql
immutable
as $$
  select trim(to_char(d, 'Month YYYY'));
$$;

create or replace function public.end_of_month_for(d date)
returns date
language sql
immutable
as $$
  select (date_trunc('month', d) + interval '1 month' - interval '1 day')::date;
$$;

create or replace function public.notify_student_invoice(
  p_student_id uuid,
  p_title text,
  p_body text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.portal_notifications (student_id, type, title, body)
  values (p_student_id, 'invoice', p_title, p_body);
exception
  when undefined_table then
    null;
end;
$$;

create or replace function public.create_invoice_for_enrollment(
  p_enrollment_id uuid,
  p_billing_date date default current_date
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  enr record;
  fee numeric;
  month_txt text;
  due date;
begin
  select e.id, e.student_id, e.status, e.instrument_id
    into enr
  from public.enrollments e
  where e.id = p_enrollment_id;

  if not found or enr.status <> 'active' then
    return false;
  end if;

  select i.monthly_fee into fee
  from public.instruments i
  where i.id = enr.instrument_id and i.active = true;

  if fee is null or fee <= 0 then
    return false;
  end if;

  month_txt := public.month_label_for(p_billing_date);
  due := public.end_of_month_for(p_billing_date);

  if exists (
    select 1
    from public.invoices inv
    where inv.enrollment_id = enr.id
      and inv.month = month_txt
      and inv.status <> 'cancelled'
  ) then
    return false;
  end if;

  insert into public.invoices (
    student_id, enrollment_id, month, amount, due_date, currency, status
  )
  values (enr.student_id, enr.id, month_txt, fee, due, 'GHS', 'pending');

  perform public.notify_student_invoice(
    enr.student_id,
    'New tuition invoice',
    format(
      'Your %s tuition of GHS %s is due by %s. You have 7 days after the due date to pay before dashboard access is paused.',
      month_txt,
      fee,
      to_char(due, 'Mon DD, YYYY')
    )
  );

  return true;
end;
$$;

create or replace function public.trg_enrollment_invoice()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'active' then
    perform public.create_invoice_for_enrollment(new.id, new.start_date);
  end if;
  return new;
end;
$$;

drop trigger if exists enrollment_create_invoice on public.enrollments;
create trigger enrollment_create_invoice
  after insert on public.enrollments
  for each row execute function public.trg_enrollment_invoice();

create or replace function public.ensure_student_monthly_invoices(p_student_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  enr record;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if auth.uid() <> p_student_id and not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  for enr in
    select id
    from public.enrollments
    where student_id = p_student_id
      and status = 'active'
  loop
    perform public.create_invoice_for_enrollment(enr.id, current_date);
  end loop;
end;
$$;

revoke all on function public.ensure_student_monthly_invoices(uuid) from public;
grant execute on function public.ensure_student_monthly_invoices(uuid) to authenticated;


-- ── 15) VIOLIN + INSTRUMENT PRICING — unique names + admin price edits ──

create unique index if not exists instruments_name_key on public.instruments (name);

insert into public.instruments (name, description, monthly_fee, active)
values
  ('Violin', 'Bow technique, intonation, repertoire, and ensemble skills.', 320.00, true)
on conflict (name) do update set
  description = excluded.description,
  monthly_fee = excluded.monthly_fee,
  active = true;

update public.instruments
set active = false
where name not in ('Drums', 'Piano', 'Saxophone', 'Voice Training', 'Violin');


-- ── 16) AUTH FIX — reliable sign-in after sign-up ──

-- Check auth.users (not profiles) so login lookup matches Supabase credentials.
create or replace function public.profile_exists_for_login(login_identifier text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved text;
begin
  resolved := lower(trim(login_identifier));
  if resolved = 'admin' then
    resolved := 'admin@themusicembassy.com';
  end if;
  return exists (
    select 1 from auth.users where lower(email) = resolved
  );
end;
$$;

revoke all on function public.profile_exists_for_login(text) from public;
grant execute on function public.profile_exists_for_login(text) to anon, authenticated;

-- Store lowercase emails on profiles so they stay in sync with auth.users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  assigned_role text;
begin
  assigned_role := case
    when lower(new.email) = 'admin@themusicembassy.com' then 'admin'
    else 'student'
  end;

  insert into public.profiles (id, full_name, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    lower(new.email),
    assigned_role,
    'approved'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    role = excluded.role,
    status = 'approved';

  return new;
end;
$$;


-- ── 17) PAYMENT SETTINGS + STUDENT PAYMENT CLAIMS ──

create table if not exists public.payment_settings (
  id                   uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  momo_number          text,
  momo_name            text,
  bank_name            text,
  bank_account_name    text,
  bank_account_number  text,
  bank_branch          text,
  instructions         text,
  updated_at           timestamptz not null default now()
);

insert into public.payment_settings (id)
values ('00000000-0000-0000-0000-000000000001'::uuid)
on conflict (id) do nothing;

alter table public.payment_settings enable row level security;

drop policy if exists "Authenticated users can read payment settings" on public.payment_settings;
create policy "Authenticated users can read payment settings"
  on public.payment_settings for select
  to authenticated
  using (true);

drop policy if exists "Admins can manage payment settings" on public.payment_settings;
create policy "Admins can manage payment settings"
  on public.payment_settings for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.payment_claims (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references public.profiles(id) on delete cascade,
  invoice_id        uuid not null references public.invoices(id) on delete cascade,
  reference         text,
  notes             text,
  status            text not null default 'pending'
                      check (status in ('pending', 'confirmed', 'rejected')),
  submitted_at      timestamptz not null default now(),
  reviewed_at       timestamptz,
  reviewed_by       uuid references public.profiles(id),
  rejection_reason  text,
  created_at        timestamptz not null default now()
);

create unique index if not exists payment_claims_one_pending_per_invoice
  on public.payment_claims (invoice_id)
  where status = 'pending';

alter table public.payment_claims enable row level security;

drop policy if exists "Students can view own payment claims" on public.payment_claims;
create policy "Students can view own payment claims"
  on public.payment_claims for select
  using (auth.uid() = student_id);

drop policy if exists "Admins can manage payment claims" on public.payment_claims;
create policy "Admins can manage payment claims"
  on public.payment_claims for all
  using (public.is_admin())
  with check (public.is_admin());

alter table public.portal_notifications
  drop constraint if exists portal_notifications_type_check;

alter table public.portal_notifications
  add constraint portal_notifications_type_check
  check (type in ('lesson', 'assignment', 'quiz', 'invoice', 'payment'));

create or replace function public.submit_payment_claim(
  p_invoice_id uuid,
  p_reference text default null,
  p_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inv record;
  claim_id uuid;
  student_name text;
  admin_row record;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select i.*, p.full_name
  into inv
  from public.invoices i
  join public.profiles p on p.id = i.student_id
  where i.id = p_invoice_id
    and i.student_id = auth.uid()
  for update;

  if not found then
    raise exception 'Invoice not found';
  end if;

  if inv.status not in ('pending', 'overdue') then
    raise exception 'This invoice is already settled';
  end if;

  if exists (
    select 1 from public.payment_claims
    where invoice_id = p_invoice_id and status = 'pending'
  ) then
    raise exception 'A payment confirmation is already pending for this invoice';
  end if;

  insert into public.payment_claims (student_id, invoice_id, reference, notes)
  values (auth.uid(), p_invoice_id, nullif(trim(p_reference), ''), nullif(trim(p_notes), ''))
  returning id into claim_id;

  student_name := inv.full_name;

  for admin_row in
    select id from public.profiles where role = 'admin'
  loop
    insert into public.portal_notifications (student_id, type, title, body)
    values (
      admin_row.id,
      'payment',
      'Payment submitted',
      student_name || ' marked ' || inv.month || ' tuition as paid. Review in Finance → Pending payments.'
    );
  end loop;

  return claim_id;
end;
$$;

revoke all on function public.submit_payment_claim(uuid, text, text) from public;
grant execute on function public.submit_payment_claim(uuid, text, text) to authenticated;

create or replace function public.confirm_payment_claim(p_claim_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  claim record;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  select pc.*, i.month, i.student_id as invoice_student_id
  into claim
  from public.payment_claims pc
  join public.invoices i on i.id = pc.invoice_id
  where pc.id = p_claim_id
  for update;

  if not found then
    raise exception 'Payment claim not found';
  end if;

  if claim.status <> 'pending' then
    raise exception 'This payment claim has already been reviewed';
  end if;

  update public.payment_claims
  set
    status = 'confirmed',
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    rejection_reason = null
  where id = p_claim_id;

  update public.invoices
  set status = 'paid', paid_at = now()
  where id = claim.invoice_id;

  return jsonb_build_object('student_id', claim.invoice_student_id, 'month', claim.month);
end;
$$;

revoke all on function public.confirm_payment_claim(uuid) from public;
grant execute on function public.confirm_payment_claim(uuid) to authenticated;

create or replace function public.reject_payment_claim(
  p_claim_id uuid,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  claim record;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  select pc.*, i.month, i.student_id as invoice_student_id
  into claim
  from public.payment_claims pc
  join public.invoices i on i.id = pc.invoice_id
  where pc.id = p_claim_id
  for update;

  if not found then
    raise exception 'Payment claim not found';
  end if;

  if claim.status <> 'pending' then
    raise exception 'This payment claim has already been reviewed';
  end if;

  update public.payment_claims
  set
    status = 'rejected',
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    rejection_reason = nullif(trim(p_reason), '')
  where id = p_claim_id;

  return jsonb_build_object('student_id', claim.invoice_student_id, 'month', claim.month);
end;
$$;

revoke all on function public.reject_payment_claim(uuid, text) from public;
grant execute on function public.reject_payment_claim(uuid, text) to authenticated;
