
-- Scorecard tables for Neutral vs Proprietary Scorecard (LM10)
CREATE TABLE public.cc_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  role text,
  stack_desc text,
  vertical text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.cc_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert cc_leads" ON public.cc_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select cc_leads" ON public.cc_leads FOR SELECT USING (true);

CREATE TABLE public.cc_scorecard_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  session_id text,
  lead_id uuid REFERENCES public.cc_leads(id),
  answers_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  score integer NOT NULL DEFAULT 0,
  band text NOT NULL DEFAULT 'pending'
);

ALTER TABLE public.cc_scorecard_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert cc_scorecard_runs" ON public.cc_scorecard_runs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select cc_scorecard_runs" ON public.cc_scorecard_runs FOR SELECT USING (true);
CREATE POLICY "Allow anon update cc_scorecard_runs" ON public.cc_scorecard_runs FOR UPDATE USING (true) WITH CHECK (true);

CREATE TABLE public.cc_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  run_id uuid REFERENCES public.cc_scorecard_runs(id),
  lead_id uuid REFERENCES public.cc_leads(id),
  created_at timestamptz DEFAULT now(),
  event_payload jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.cc_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert cc_events" ON public.cc_events FOR INSERT WITH CHECK (true);
