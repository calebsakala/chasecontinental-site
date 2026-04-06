CREATE TABLE public.email_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  email text NOT NULL UNIQUE,
  unsubscribed_at timestamptz,
  source text,
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX email_preferences_unsubscribed_at_idx
  ON public.email_preferences (unsubscribed_at);

ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;