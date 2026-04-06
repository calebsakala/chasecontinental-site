CREATE TABLE IF NOT EXISTS public.lm08_challenge_cleanup_archive (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  archived_at timestamptz NOT NULL DEFAULT now(),
  source_table text NOT NULL,
  source_key text NOT NULL,
  payload jsonb NOT NULL,
  UNIQUE (source_table, source_key)
);

CREATE INDEX IF NOT EXISTS lm08_challenge_cleanup_archive_source_table_idx
  ON public.lm08_challenge_cleanup_archive (source_table, archived_at DESC);

INSERT INTO public.lm08_challenge_cleanup_archive (
  source_table,
  source_key,
  payload
)
SELECT
  'lm08_challenge_email_log',
  log.id::text,
  to_jsonb(log)
FROM public.lm08_challenge_email_log AS log
WHERE log.day <> 6
ON CONFLICT (source_table, source_key) DO NOTHING;

DELETE FROM public.lm08_challenge_email_log
WHERE day <> 6;

WITH followup_log AS (
  SELECT
    signup_id,
    max(sent_at) FILTER (WHERE status = 'sent') AS sent_at
  FROM public.lm08_challenge_email_log
  WHERE day = 6
  GROUP BY signup_id
)
UPDATE public.lm08_challenge_progress AS progress
SET current_day = 6,
    last_sent_day = 6,
    status = 'completed',
    next_send_at = NULL,
    completed_at = COALESCE(progress.completed_at, followup_log.sent_at),
    updated_at = now()
FROM followup_log
WHERE progress.signup_id = followup_log.signup_id
  AND followup_log.sent_at IS NOT NULL;

UPDATE public.lm08_challenge_progress
SET current_day = 6,
    last_sent_day = 6,
    next_send_at = NULL,
    updated_at = now()
WHERE signup_id NOT IN (
    SELECT signup_id
    FROM public.lm08_challenge_email_log
    WHERE day = 6
  )
  AND (status = 'completed' OR completed_at IS NOT NULL);

UPDATE public.lm08_challenge_progress
SET current_day = 0,
    last_sent_day = 0,
    next_send_at = NULL,
    updated_at = now()
WHERE status = 'unsubscribed';

UPDATE public.lm08_challenge_progress
SET current_day = 0,
    last_sent_day = 0,
    updated_at = now()
WHERE status <> 'completed'
  AND status <> 'unsubscribed'
  AND (current_day NOT IN (0, 6) OR last_sent_day NOT IN (0, 6));

ALTER TABLE public.lm08_challenge_progress
DROP CONSTRAINT IF EXISTS lm08_challenge_progress_current_day_check;

ALTER TABLE public.lm08_challenge_progress
DROP CONSTRAINT IF EXISTS lm08_challenge_progress_last_sent_day_check;

ALTER TABLE public.lm08_challenge_email_log
DROP CONSTRAINT IF EXISTS lm08_challenge_email_log_day_check;

ALTER TABLE public.lm08_challenge_progress
ADD CONSTRAINT lm08_challenge_progress_current_day_check
CHECK (current_day IN (0, 6));

ALTER TABLE public.lm08_challenge_progress
ADD CONSTRAINT lm08_challenge_progress_last_sent_day_check
CHECK (last_sent_day IN (0, 6));

ALTER TABLE public.lm08_challenge_email_log
ADD CONSTRAINT lm08_challenge_email_log_day_check
CHECK (day = 6);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename = 'lm08_challenge_email_state'
  ) THEN
    EXECUTE $archive$
      INSERT INTO public.lm08_challenge_cleanup_archive (
        source_table,
        source_key,
        payload
      )
      SELECT
        'lm08_challenge_email_state',
        state.id::text,
        to_jsonb(state)
      FROM public.lm08_challenge_email_state AS state
      ON CONFLICT (source_table, source_key) DO NOTHING
    $archive$;

    EXECUTE 'DROP TABLE public.lm08_challenge_email_state';
  END IF;
END $$;