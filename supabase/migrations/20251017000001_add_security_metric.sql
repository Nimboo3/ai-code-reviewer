-- Migration: Add security metric to structured reviews
-- Run this in Supabase SQL Editor

-- Add security_score column (0-100)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'code_reviews' 
    AND column_name = 'security_score'
  ) THEN
    ALTER TABLE public.code_reviews ADD COLUMN security_score INTEGER;
  END IF;
END $$;

-- Create index for security_score
CREATE INDEX IF NOT EXISTS idx_code_reviews_security_score ON public.code_reviews (security_score);

-- Add comment
COMMENT ON COLUMN public.code_reviews.security_score IS 'Security score (0-100): Production readiness, secrets detection, vulnerability assessment';
