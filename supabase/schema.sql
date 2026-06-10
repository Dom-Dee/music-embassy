-- ============================================================
-- Music Embassy — Full Database Schema
-- Run this once in Supabase SQL Editor (Project > SQL Editor)
-- ============================================================

-- ── Profiles ────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  full_name  text not null,
  email      text not null,
  role       text not null default 'student' check (role in ('admin', 'student')),
  status     text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  phone      text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ── Instruments ─────────────────────────────────────────────
create table if not exists public.instruments (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  monthly_fee numeric(10,2) not null default 0,
  active      boolean not null default true,
  created_at  timestamptz default now()
);

alter table public.instruments enable row level security;

create policy "Anyone can view active instruments"
  on public.instruments for select
  using (active = true);

create policy "Admins can manage instruments"
  on public.instruments for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ── Classes ─────────────────────────────────────────────────
create table if not exists public.classes (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz default now()
);

alter table public.classes enable row level security;

create policy "Authenticated users can view classes"
  on public.classes for select
  using (auth.uid() is not null);

-- ── Enrollments ─────────────────────────────────────────────
create table if not exists public.enrollments (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.profiles(id) on delete cascade,
  instrument_id uuid not null references public.instruments(id) on delete cascade,
  class_id      uuid references public.classes(id) on delete set null,
  start_date    date not null default current_date,
  status        text not null default 'active' check (status in ('active', 'paused', 'completed')),
  created_at    timestamptz default now()
);

alter table public.enrollments enable row level security;

create policy "Students can view own enrollments"
  on public.enrollments for select
  using (auth.uid() = student_id);

create policy "Students can create own enrollments"
  on public.enrollments for insert
  with check (auth.uid() = student_id);

create policy "Admins can manage all enrollments"
  on public.enrollments for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ── Invoices ─────────────────────────────────────────────────
create table if not exists public.invoices (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.profiles(id) on delete cascade,
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  month         text not null,
  amount        numeric(10,2) not null,
  currency      text not null default 'GHS',
  due_date      date not null,
  status        text not null default 'pending' check (status in ('pending', 'paid', 'overdue', 'cancelled')),
  paid_at       timestamptz,
  created_at    timestamptz default now()
);

alter table public.invoices enable row level security;

create policy "Students can view own invoices"
  on public.invoices for select
  using (auth.uid() = student_id);

create policy "Admins can manage all invoices"
  on public.invoices for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ── Lesson Sessions ──────────────────────────────────────────
create table if not exists public.lesson_sessions (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  scheduled_at  timestamptz not null,
  title         text not null,
  notes         text,
  video_url     text,
  status        text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_at    timestamptz default now()
);

alter table public.lesson_sessions enable row level security;

create policy "Students can view own lesson sessions"
  on public.lesson_sessions for select
  using (
    exists (
      select 1 from public.enrollments
      where id = lesson_sessions.enrollment_id
        and student_id = auth.uid()
    )
  );

create policy "Admins can manage all lesson sessions"
  on public.lesson_sessions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ── Auto-create profile on signup ───────────────────────────
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
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Sample instruments ───────────────────────────────────────
insert into public.instruments (name, description, monthly_fee, active) values
  ('Piano & Keys',        'Classical foundations to contemporary harmony and performance.', 150, true),
  ('Guitar & Bass',       'Fingerstyle, ensemble playing, and groove-focused practice.',    130, true),
  ('Voice & Performance', 'Breath, tone, stage presence, and studio-ready delivery.',       140, true),
  ('Production & Audio',  'DAW workflow, mixing, and creative sound design.',               160, true),
  ('Strings & Ensemble',  'Violin, cello, and small-group coaching.',                       150, true),
  ('Rhythm & Percussion', 'Time feel, kit and hand percussion, and ensemble locking.',      130, true)
on conflict do nothing;
