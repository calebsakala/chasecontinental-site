ALTER TABLE public.lm08_challenge_signups
ADD COLUMN IF NOT EXISTS lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL;

ALTER TABLE public.lm08_challenge_signups
ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE public.lm08_challenge_signups AS signup
SET lead_id = leads.id,
    updated_at = now()
FROM public.leads
WHERE signup.lead_id IS NULL
  AND lower(signup.email) = lower(leads.email);

CREATE TABLE IF NOT EXISTS public.lm08_challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid NOT NULL UNIQUE REFERENCES public.lm08_challenge_signups(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  current_day integer NOT NULL DEFAULT 0 CHECK (current_day BETWEEN 0 AND 5),
  last_sent_day integer NOT NULL DEFAULT -1 CHECK (last_sent_day BETWEEN -1 AND 5),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'unsubscribed', 'failed')),
  next_send_at timestamptz,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  last_error text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lm08_challenge_progress ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'lm08_challenge_progress'
      AND policyname = 'Allow anon insert lm08_challenge_progress'
  ) THEN
    CREATE POLICY "Allow anon insert lm08_challenge_progress"
      ON public.lm08_challenge_progress
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'lm08_challenge_progress'
      AND policyname = 'Allow anon select lm08_challenge_progress'
  ) THEN
    CREATE POLICY "Allow anon select lm08_challenge_progress"
      ON public.lm08_challenge_progress
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'lm08_challenge_progress'
      AND policyname = 'Allow anon update lm08_challenge_progress'
  ) THEN
    CREATE POLICY "Allow anon update lm08_challenge_progress"
      ON public.lm08_challenge_progress
      FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS lm08_challenge_progress_status_idx
  ON public.lm08_challenge_progress (status, next_send_at);

CREATE TABLE IF NOT EXISTS public.lm08_challenge_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid NOT NULL REFERENCES public.lm08_challenge_signups(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  day integer NOT NULL CHECK (day BETWEEN 0 AND 5),
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  sent_at timestamptz,
  last_attempt_at timestamptz NOT NULL DEFAULT now(),
  attempt_count integer NOT NULL DEFAULT 1 CHECK (attempt_count >= 1),
  provider_message_id text,
  delivery_id uuid REFERENCES public.email_deliveries(id) ON DELETE SET NULL,
  error_message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (signup_id, day)
);

ALTER TABLE public.lm08_challenge_email_log ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS lm08_challenge_email_log_signup_idx
  ON public.lm08_challenge_email_log (signup_id, day);

CREATE INDEX IF NOT EXISTS lm08_challenge_email_log_status_idx
  ON public.lm08_challenge_email_log (status, last_attempt_at);

INSERT INTO public.lm08_challenge_progress (
  signup_id,
  lead_id,
  current_day,
  last_sent_day,
  status,
  next_send_at,
  started_at,
  updated_at
)
SELECT
  signup.id,
  signup.lead_id,
  0,
  CASE WHEN state.sent_at IS NOT NULL THEN 0 ELSE -1 END,
  'active',
  CASE WHEN state.sent_at IS NOT NULL THEN state.sent_at + interval '1 day' ELSE now() END,
  COALESCE(signup.signup_date, now()),
  now()
FROM public.lm08_challenge_signups AS signup
LEFT JOIN LATERAL (
  SELECT sent_at
  FROM public.lm08_challenge_email_state
  WHERE signup_id = signup.id
  ORDER BY sent_at DESC NULLS LAST
  LIMIT 1
) AS state ON true
ON CONFLICT (signup_id) DO NOTHING;