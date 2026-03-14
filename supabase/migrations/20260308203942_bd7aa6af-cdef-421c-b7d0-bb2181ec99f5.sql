
-- Shared leads table (deduplicates by email across all lead magnets)
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  role text,
  vertical text,
  tool_stack text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  UNIQUE(email)
);

-- Asset registry
CREATE TABLE public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  asset_key text UNIQUE NOT NULL,
  title text NOT NULL
);

-- Audit / assessment runs (shared for checklist, scorecard, reliability quiz)
CREATE TABLE public.audit_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  asset_key text NOT NULL,
  answers_json jsonb NOT NULL,
  score numeric NOT NULL,
  band text NOT NULL
);

-- Downloads tracking
CREATE TABLE public.downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  asset_key text NOT NULL,
  file_path text,
  downloaded_at timestamptz
);

-- Events funnel tracking
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  session_id text,
  event_name text NOT NULL,
  event_payload jsonb DEFAULT '{}'::jsonb
);

-- RLS policies (public forms - anonymous inserts allowed)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON public.leads FOR INSERT WITH CHECK (true);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.assets FOR SELECT USING (true);

ALTER TABLE public.audit_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON public.audit_runs FOR INSERT WITH CHECK (true);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON public.downloads FOR INSERT WITH CHECK (true);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON public.events FOR INSERT WITH CHECK (true);

-- Storage bucket for generated PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('lead-magnets', 'lead-magnets', true);

-- Storage policies
CREATE POLICY "Public read lead-magnets" ON storage.objects FOR SELECT USING (bucket_id = 'lead-magnets');
CREATE POLICY "Service insert lead-magnets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lead-magnets');

-- Seed the silo audit asset
INSERT INTO public.assets (asset_key, title) VALUES ('silo-audit-checklist', '2026 AI Agent Silo Audit Checklist');
