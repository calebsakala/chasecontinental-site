ALTER TABLE public.lm08_challenge_progress
DROP CONSTRAINT IF EXISTS lm08_challenge_progress_current_day_check;

ALTER TABLE public.lm08_challenge_progress
DROP CONSTRAINT IF EXISTS lm08_challenge_progress_last_sent_day_check;

ALTER TABLE public.lm08_challenge_email_log
DROP CONSTRAINT IF EXISTS lm08_challenge_email_log_day_check;

ALTER TABLE public.lm08_challenge_progress
ADD CONSTRAINT lm08_challenge_progress_current_day_check
CHECK (current_day BETWEEN 0 AND 6);

ALTER TABLE public.lm08_challenge_progress
ADD CONSTRAINT lm08_challenge_progress_last_sent_day_check
CHECK (last_sent_day BETWEEN -1 AND 6);

ALTER TABLE public.lm08_challenge_email_log
ADD CONSTRAINT lm08_challenge_email_log_day_check
CHECK (day BETWEEN 0 AND 6);

UPDATE public.lm08_challenge_signups AS signup
SET lead_id = leads.id,
    updated_at = now()
FROM public.leads
WHERE signup.lead_id IS NULL
  AND lower(signup.email) = lower(leads.email);

INSERT INTO public.lm08_challenge_progress (
  signup_id,
  lead_id,
  current_day,
  last_sent_day,
  status,
  next_send_at,
  started_at,
  updated_at
)
SELECT
  signup.id,
  signup.lead_id,
  0,
  0,
  'active',
  COALESCE(signup.signup_date, now()) + interval '5 days',
  COALESCE(signup.signup_date, now()),
  now()
FROM public.lm08_challenge_signups AS signup
WHERE NOT EXISTS (
  SELECT 1
  FROM public.lm08_challenge_progress AS progress
  WHERE progress.signup_id = signup.id
);

WITH followup_log AS (
  SELECT
    signup_id,
    max(sent_at) FILTER (WHERE status = 'sent') AS sent_at
  FROM public.lm08_challenge_email_log
  WHERE day = 6
  GROUP BY signup_id
)
UPDATE public.lm08_challenge_progress AS progress
SET lead_id = COALESCE(progress.lead_id, signup.lead_id),
    current_day = CASE
      WHEN prefs.unsubscribed_at IS NOT NULL THEN 0
      WHEN followup_log.sent_at IS NOT NULL THEN 6
      ELSE 0
    END,
    last_sent_day = CASE
      WHEN prefs.unsubscribed_at IS NOT NULL THEN 0
      WHEN followup_log.sent_at IS NOT NULL THEN 6
      ELSE 0
    END,
    status = CASE
      WHEN prefs.unsubscribed_at IS NOT NULL THEN 'unsubscribed'
      WHEN followup_log.sent_at IS NOT NULL THEN 'completed'
      ELSE 'active'
    END,
    next_send_at = CASE
      WHEN prefs.unsubscribed_at IS NOT NULL THEN NULL
      WHEN followup_log.sent_at IS NOT NULL THEN NULL
      ELSE COALESCE(signup.signup_date, progress.started_at, now()) + interval '5 days'
    END,
    completed_at = CASE
      WHEN followup_log.sent_at IS NOT NULL THEN COALESCE(progress.completed_at, followup_log.sent_at)
      ELSE NULL
    END,
    last_error = NULL,
    updated_at = now()
FROM public.lm08_challenge_signups AS signup
LEFT JOIN public.email_preferences AS prefs
  ON lower(prefs.email) = lower(signup.email)
LEFT JOIN followup_log
  ON followup_log.signup_id = signup.id
WHERE progress.signup_id = signup.id;