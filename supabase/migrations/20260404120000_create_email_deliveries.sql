CREATE TABLE public.email_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  asset_key text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  provider_message_id text,
  sent_at timestamptz,
  error_message text,
  access_token text NOT NULL UNIQUE,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  first_clicked_at timestamptz,
  last_clicked_at timestamptz,
  click_count integer NOT NULL DEFAULT 0 CHECK (click_count >= 0),
  UNIQUE (lead_id, asset_key)
);

CREATE INDEX email_deliveries_asset_key_idx ON public.email_deliveries (asset_key);
CREATE INDEX email_deliveries_email_idx ON public.email_deliveries (email);

ALTER TABLE public.email_deliveries ENABLE ROW LEVEL SECURITY;