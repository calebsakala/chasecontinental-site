CREATE TABLE IF NOT EXISTS public.lm08_challenge_cleanup_archive (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  archived_at timestamptz NOT NULL DEFAULT now(),
  source_table text NOT NULL,
  source_key text NOT NULL,
  payload jsonb NOT NULL,
  UNIQUE (source_table, source_key)
);

INSERT INTO public.lm08_challenge_cleanup_archive (
  source_table,
  source_key,
  payload
)
SELECT
  'lm08_challenge_signups',
  signup.id::text,
  jsonb_build_object(
    'archived_reason', 'signup_field_cleanup',
    'email', signup.email,
    'phone', signup.phone,
    'challenges', signup.challenges,
    'signup_date', signup.signup_date,
    'updated_at', signup.updated_at
  )
FROM public.lm08_challenge_signups AS signup
WHERE signup.phone IS NOT NULL
   OR signup.challenges IS NOT NULL
ON CONFLICT (source_table, source_key) DO NOTHING;

ALTER TABLE public.lm08_challenge_signups
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS challenges;