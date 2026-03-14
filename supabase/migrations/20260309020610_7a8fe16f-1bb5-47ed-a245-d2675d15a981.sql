
-- lm07_leads
CREATE TABLE public.lm07_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  role text,
  vertical text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.lm07_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert lm07_leads" ON public.lm07_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select lm07_leads" ON public.lm07_leads FOR SELECT USING (true);

-- lm07_downloads
CREATE TABLE public.lm07_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.lm07_leads(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now(),
  template_version text DEFAULT '1.0'
);
ALTER TABLE public.lm07_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert lm07_downloads" ON public.lm07_downloads FOR INSERT WITH CHECK (true);

-- lm07_events
CREATE TABLE public.lm07_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.lm07_leads(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.lm07_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert lm07_events" ON public.lm07_events FOR INSERT WITH CHECK (true);
