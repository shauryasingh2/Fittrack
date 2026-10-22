-- FitTrack database. Run this whole file once in Supabase > SQL Editor.

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade default auth.uid(),
  name text, age int, gender text, height_cm numeric, weight_kg numeric,
  goal text, activity_level text, goal_weight_kg numeric,
  calorie_target int default 2000, step_target int default 10000, water_target_ml int default 2500,
  created_at timestamptz default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  type text not null, duration_min int, distance_km numeric, calories int,
  logged_at timestamptz not null default now()
);
create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  category text, exercise text not null, sets int, reps int, weight_kg numeric,
  duration_min int, calories int, notes text, logged_at timestamptz not null default now()
);
create table if not exists food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  meal text not null, name text not null, quantity text, calories int not null,
  logged_on date not null default current_date
);
create table if not exists water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  amount_ml int not null, logged_at timestamptz not null default now()
);
create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  weight_kg numeric not null, logged_on date not null default current_date
);
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  title text not null, metric text, target numeric not null, current numeric not null default 0,
  deadline date, completed boolean not null default false, created_at timestamptz default now()
);
create table if not exists daily_steps (
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  day date not null default current_date, steps int not null default 0,
  primary key (user_id, day)
);

-- Row Level Security: every user can only touch rows that belong to them.
alter table profiles enable row level security;
drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles for all using (id = auth.uid()) with check (id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['activities','workouts','food_entries','water_logs','weight_logs','goals','daily_steps']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "own rows" on %I', t);
    execute format('create policy "own rows" on %I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;
