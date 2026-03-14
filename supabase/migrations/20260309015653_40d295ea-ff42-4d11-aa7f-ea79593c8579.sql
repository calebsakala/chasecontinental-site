
-- lm06_leads
CREATE TABLE public.lm06_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  vertical TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.lm06_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert lm06_leads" ON public.lm06_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select lm06_leads" ON public.lm06_leads FOR SELECT USING (true);

-- lm06_downloads
CREATE TABLE public.lm06_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.lm06_leads(id) ON DELETE CASCADE,
  download_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  pdf_version TEXT DEFAULT '1.0'
);

ALTER TABLE public.lm06_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert lm06_downloads" ON public.lm06_downloads FOR INSERT WITH CHECK (true);

-- lm06_events
CREATE TABLE public.lm06_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.lm06_leads(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.lm06_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert lm06_events" ON public.lm06_events FOR INSERT WITH CHECK (true);
