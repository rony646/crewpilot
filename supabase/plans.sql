-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  idea text not null,
  product text not null,
  market text not null,
  tech text not null,
  created_at timestamptz not null default now()
);

create index if not exists plans_user_id_created_at_idx
  on public.plans (user_id, created_at desc);

alter table public.plans enable row level security;

create policy "Users can read own plans"
  on public.plans
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own plans"
  on public.plans
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own plans"
  on public.plans
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own plans"
  on public.plans
  for delete
  using (auth.uid() = user_id);
