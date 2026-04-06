CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM cron.job
    WHERE jobname = 'process-challenge-schedule-hourly'
  ) THEN
    PERFORM cron.unschedule('process-challenge-schedule-hourly');
  END IF;
END $$;

SELECT cron.schedule(
  'process-challenge-schedule-hourly',
  '5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://ydjicfgyegmqfusgunko.supabase.co/functions/v1/process-challenge-schedule',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);