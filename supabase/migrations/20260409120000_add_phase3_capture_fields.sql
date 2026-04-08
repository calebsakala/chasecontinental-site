-- Additive schema updates for lead magnet phase-3 field capture

ALTER TABLE public.lm02_calculator_runs
  ADD COLUMN IF NOT EXISTS automation_maturity text,
  ADD COLUMN IF NOT EXISTS priority_area text;

ALTER TABLE public.lm07_downloads
  ADD COLUMN IF NOT EXISTS workflow_name text;

ALTER TABLE public.lm08_challenge_progress
  ADD COLUMN IF NOT EXISTS completed boolean NOT NULL DEFAULT false;

ALTER TABLE public.cc_leads
  ADD COLUMN IF NOT EXISTS migration_timeline text,
  ADD COLUMN IF NOT EXISTS stack_size text;

ALTER TABLE public.cc_scorecard_runs
  ADD COLUMN IF NOT EXISTS chase_agents_fit_score integer;
