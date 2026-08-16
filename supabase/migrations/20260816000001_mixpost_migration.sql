-- Mixpost Lite Database Schema Migration

ALTER TABLE public.scheduled_posts
  ADD COLUMN IF NOT EXISTS external_post_id TEXT,
  ADD COLUMN IF NOT EXISTS publishing_provider TEXT DEFAULT 'mixpost',
  ADD COLUMN IF NOT EXISTS account_id TEXT;

-- Update existing records if any to provider-neutral format
UPDATE public.scheduled_posts
SET external_post_id = COALESCE(external_post_id, postiz_post_id),
    publishing_provider = 'mixpost'
WHERE external_post_id IS NULL;
