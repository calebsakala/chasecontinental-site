-- Add benchmark columns to lm02_sector_configs for full ROI calculation
ALTER TABLE lm02_sector_configs
ADD COLUMN IF NOT EXISTS avg_volume integer DEFAULT 5000,
ADD COLUMN IF NOT EXISTS avg_minutes numeric DEFAULT 30,
ADD COLUMN IF NOT EXISTS avg_hourly numeric DEFAULT 100,
ADD COLUMN IF NOT EXISTS avg_error_rate numeric DEFAULT 0.05,
ADD COLUMN IF NOT EXISTS avg_error_cost numeric DEFAULT 2000,
ADD COLUMN IF NOT EXISTS avg_investment numeric DEFAULT 500000,
ADD COLUMN IF NOT EXISTS roi_mult numeric DEFAULT 3.0,
ADD COLUMN IF NOT EXISTS strategies_json jsonb DEFAULT '[]'::jsonb;