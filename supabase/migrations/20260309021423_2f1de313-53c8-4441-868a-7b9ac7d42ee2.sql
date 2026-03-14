
-- lm08_challenge_signups
CREATE TABLE public.lm08_challenge_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  company text,
  role text,
  phone text,
  vertical text,
  challenges text,
  signup_date timestamptz DEFAULT now()
);
ALTER TABLE public.lm08_challenge_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert lm08_challenge_signups" ON public.lm08_challenge_signups FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select lm08_challenge_signups" ON public.lm08_challenge_signups FOR SELECT USING (true);

-- lm08_challenge_email_state
CREATE TABLE public.lm08_challenge_email_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid REFERENCES public.lm08_challenge_signups(id) ON DELETE CASCADE,
  day integer NOT NULL DEFAULT 0,
  completed boolean DEFAULT false,
  sent_at timestamptz DEFAULT now(),
  answers jsonb DEFAULT '{}'::jsonb
);
ALTER TABLE public.lm08_challenge_email_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert lm08_email_state" ON public.lm08_challenge_email_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update lm08_email_state" ON public.lm08_challenge_email_state FOR UPDATE USING (true) WITH CHECK (true);

-- lm08_events
CREATE TABLE public.lm08_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid REFERENCES public.lm08_challenge_signups(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.lm08_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert lm08_events" ON public.lm08_events FOR INSERT WITH CHECK (true);
