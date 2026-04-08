DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'assessment_runs'
      AND policyname = 'Allow anon select assessment_runs'
  ) THEN
    CREATE POLICY "Allow anon select assessment_runs"
    ON public.assessment_runs
    FOR SELECT
    TO anon, authenticated
    USING (true);
  END IF;
END $$;