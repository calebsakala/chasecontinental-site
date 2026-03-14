
CREATE POLICY "Allow anon select leads" ON public.leads FOR SELECT TO anon, authenticated USING (true);
