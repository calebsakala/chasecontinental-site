
-- The trailing-space policies are restrictive; drop them
-- The non-trailing-space ones may already exist as permissive, so drop and recreate all

DROP POLICY IF EXISTS "Allow anonymous insert " ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.leads;
CREATE POLICY "Allow anon insert leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous insert " ON public.audit_runs;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.audit_runs;
CREATE POLICY "Allow anon insert audit_runs" ON public.audit_runs FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous insert " ON public.downloads;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.downloads;
CREATE POLICY "Allow anon insert downloads" ON public.downloads FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous insert " ON public.events;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.events;
CREATE POLICY "Allow anon insert events" ON public.events FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read " ON public.assets;
DROP POLICY IF EXISTS "Allow public read" ON public.assets;
CREATE POLICY "Allow public read assets" ON public.assets FOR SELECT TO anon, authenticated USING (true);
