-- Zenkai Platform — Supabase Schema
-- Run in the Supabase SQL editor: https://app.supabase.com → SQL Editor
-- Each app uses a separate Postgres schema for isolation.

-- ─── Create schemas ──────────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS scan;
CREATE SCHEMA IF NOT EXISTS goals;
CREATE SCHEMA IF NOT EXISTS job;
CREATE SCHEMA IF NOT EXISTS workout;

-- ─── scan (scan.zenkai.nl — domain security audit) ───────────────────────────

CREATE TABLE IF NOT EXISTS scan.waitlist (
  id         SERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  domain     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scan.reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain      TEXT NOT NULL,
  email       TEXT NOT NULL,
  score       INT,
  findings    JSONB,
  pdf_url     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── goals (goals.zenkai.nl — finance / Financios) ───────────────────────────

CREATE TABLE IF NOT EXISTS goals.users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goals.transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES goals.users(id) ON DELETE CASCADE,
  amount      NUMERIC(12, 2) NOT NULL,
  category    TEXT,
  description TEXT,
  date        DATE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goals.budgets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES goals.users(id) ON DELETE CASCADE,
  category    TEXT NOT NULL,
  limit_amount NUMERIC(12, 2) NOT NULL,
  month       CHAR(7) NOT NULL, -- YYYY-MM
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── job (job.zenkai.nl — Sollicitatie Coach) ────────────────────────────────

CREATE TABLE IF NOT EXISTS job.users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job.applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES job.users(id) ON DELETE CASCADE,
  company     TEXT NOT NULL,
  role        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'applied', -- applied, interview, offer, rejected
  notes       TEXT,
  applied_at  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job.cv_scores (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES job.users(id) ON DELETE CASCADE,
  score      INT,
  feedback   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── workout (workout.zenkai.nl — Zenkai Workout) ────────────────────────────

CREATE TABLE IF NOT EXISTS workout.users (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email              TEXT UNIQUE NOT NULL,
  username           TEXT,
  level              INT NOT NULL DEFAULT 1,
  xp                 INT NOT NULL DEFAULT 0,
  streak             INT NOT NULL DEFAULT 0,
  grace_days_used    INT NOT NULL DEFAULT 0,
  last_active        DATE,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout.quest_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES workout.users(id) ON DELETE CASCADE,
  quest_id     TEXT NOT NULL,
  xp_gained    INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout.streak_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES workout.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'streak', 'grace', 'reset'
  day        DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Shared waitlist (existing — migrate from NeonDB) ────────────────────────

CREATE TABLE IF NOT EXISTS public.waitlist_zenkai (
  id         SERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
