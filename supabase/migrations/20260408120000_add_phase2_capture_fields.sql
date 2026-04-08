-- Additive schema updates for lead magnet phase-2 field capture

ALTER TABLE public.audit_runs
  ADD COLUMN IF NOT EXISTS agent_count text,
  ADD COLUMN IF NOT EXISTS org_size text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text;

ALTER TABLE public.assessment_runs
  ADD COLUMN IF NOT EXISTS workflow_count integer,
  ADD COLUMN IF NOT EXISTS production_live boolean,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text;

ALTER TABLE public.lm06_leads
  ADD COLUMN IF NOT EXISTS peak_season_month text,
  ADD COLUMN IF NOT EXISTS peak_challenge text;

ALTER TABLE public.lm08_challenge_signups
  ADD COLUMN IF NOT EXISTS pilot_goal text,
  ADD COLUMN IF NOT EXISTS current_tools text;
