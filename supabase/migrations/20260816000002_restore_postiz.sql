-- Restore Postiz Database Schema Migration

ALTER TABLE public.scheduled_posts
  ALTER COLUMN publishing_provider SET DEFAULT 'postiz';

-- Update records to Postiz provider
UPDATE public.scheduled_posts
SET publishing_provider = 'postiz'
WHERE publishing_provider IS NULL OR publishing_provider = 'mixpost';
