CREATE TABLE IF NOT EXISTS public.lm02_sector_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_name text NOT NULL,
  time_reduction_default numeric NOT NULL,
  error_reduction_default numeric NOT NULL,
  productivity_factor numeric NOT NULL DEFAULT 0,
  error_factor numeric NOT NULL DEFAULT 0,
  barriers_json jsonb DEFAULT '{}'::jsonb,
  enablers_json jsonb DEFAULT '{}'::jsonb,
  avg_volume integer DEFAULT 5000,
  avg_minutes numeric DEFAULT 30,
  avg_hourly numeric DEFAULT 100,
  avg_error_rate numeric DEFAULT 0.05,
  avg_error_cost numeric DEFAULT 2000,
  avg_investment numeric DEFAULT 500000,
  roi_mult numeric DEFAULT 3.0,
  strategies_json jsonb DEFAULT '[]'::jsonb
);
