-- =============================================
-- ProposalAI Database Schema
-- HOW TO USE:
--   1. Go to https://supabase.com → your project
--   2. Click "SQL Editor" in the left sidebar
--   3. Click "New query"
--   4. Paste this ENTIRE file
--   5. Click "Run"
-- =============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- PROFILES TABLE
-- Extra info about each user (freelancer)
-- ─────────────────────────────────────────────
create table profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  full_name       text,
  freelancer_type text default 'developer',
  hourly_rate     numeric(10,2) default 75,
  bio             text,
  skills          text[] default '{}',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─────────────────────────────────────────────
-- CLIENTS TABLE
-- People/companies the freelancer pitches to
-- ─────────────────────────────────────────────
create table clients (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  email       text,
  company     text,
  platform    text,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─────────────────────────────────────────────
-- PROPOSALS TABLE
-- Core table — one row per generated proposal
-- ─────────────────────────────────────────────
create table proposals (
  id                        uuid default uuid_generate_v4() primary key,
  user_id                   uuid references auth.users(id) on delete cascade not null,
  client_id                 uuid references clients(id) on delete set null,

  -- Input
  job_post                  text not null,
  job_title                 text,
  client_name               text,
  platform                  text default 'Other',

  -- AI-generated content
  proposal_text             text,
  subject_line              text,
  pricing_suggestion        jsonb,
  scope_of_work             jsonb,
  follow_up_email           text,
  follow_up_subject         text,
  win_probability           integer check (win_probability between 0 and 100),
  win_probability_reasoning text,

  -- Tracking
  status                    text default 'draft'
                            check (status in ('draft','sent','won','lost','archived')),
  bid_amount                numeric(10,2),
  loss_reason               text,
  sent_at                   timestamptz,
  result_at                 timestamptz,

  created_at                timestamptz default now(),
  updated_at                timestamptz default now()
);

-- ─────────────────────────────────────────────
-- ACTIVITY LOGS TABLE
-- ─────────────────────────────────────────────
create table activity_logs (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  proposal_id  uuid references proposals(id) on delete cascade,
  action       text not null,
  details      jsonb default '{}',
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table profiles      enable row level security;
alter table clients       enable row level security;
alter table proposals     enable row level security;
alter table activity_logs enable row level security;

create policy "profile_select" on profiles for select using (auth.uid() = id);
create policy "profile_insert" on profiles for insert with check (auth.uid() = id);
create policy "profile_update" on profiles for update using (auth.uid() = id);

create policy "clients_all"   on clients       for all using (auth.uid() = user_id);
create policy "proposals_all" on proposals     for all using (auth.uid() = user_id);
create policy "logs_all"      on activity_logs for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- AUTO-CREATE PROFILE ON SIGNUP
-- ─────────────────────────────────────────────
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Freelancer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
create index idx_proposals_user_id on proposals(user_id);
create index idx_proposals_status  on proposals(user_id, status);
create index idx_proposals_created on proposals(user_id, created_at desc);
create index idx_clients_user_id   on clients(user_id);
create index idx_logs_user_id      on activity_logs(user_id);
create index idx_logs_proposal_id  on activity_logs(proposal_id);
