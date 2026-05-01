-- Run this in the Supabase SQL editor for the scanner project

create table if not exists public.users (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text unique not null,
  plan                text not null default 'free',       -- free | starter | pro | enterprise
  ls_subscription_id  text,                              -- Lemon Squeezy subscription ID
  ls_customer_id      text,                              -- Lemon Squeezy customer ID
  scan_count_month    int not null default 0,            -- resets monthly
  scan_reset_at       timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

-- Auto-create user row on Supabase Auth sign-up / magic link
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (email) do update set id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS: users can only read their own row
alter table public.users enable row level security;

create policy "user can read own row"
  on public.users for select
  using (auth.uid() = id);
