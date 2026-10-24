-- Schema for AI Career Development Agent
-- Target database: Hosted PostgreSQL (Neon / Supabase)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table tracking CV extraction and student confirmation
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed')),
  cv_text TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Development plans table with profile snapshot and JSONB activities
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  profile_snapshot JSONB NOT NULL,
  activities JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_plans_profile_id ON plans(profile_id);
CREATE INDEX IF NOT EXISTS idx_plans_created_at ON plans(created_at DESC);

