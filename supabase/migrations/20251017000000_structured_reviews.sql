-- Migration: Add structured code review data support
-- This adds JSONB column for structured review data, score columns, and indices
-- Safe to run in Supabase SQL editor - idempotent with IF NOT EXISTS checks

-- 1) Add new columns if they don't exist
DO $$
BEGIN
  -- Add structured_data JSONB column for parsed LLM output
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'code_reviews' 
    AND column_name = 'structured_data'
  ) THEN
    ALTER TABLE public.code_reviews ADD COLUMN structured_data JSONB;
  END IF;

  -- Add overall_score (0-100)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'code_reviews' 
    AND column_name = 'overall_score'
  ) THEN
    ALTER TABLE public.code_reviews ADD COLUMN overall_score INTEGER;
  END IF;

  -- Add grade (A+, A, B, C, D, F)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'code_reviews' 
    AND column_name = 'grade'
  ) THEN
    ALTER TABLE public.code_reviews ADD COLUMN grade TEXT;
  END IF;

  -- Add issue counts by severity
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'code_reviews' 
    AND column_name = 'critical_issues'
  ) THEN
    ALTER TABLE public.code_reviews ADD COLUMN critical_issues INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'code_reviews' 
    AND column_name = 'high_issues'
  ) THEN
    ALTER TABLE public.code_reviews ADD COLUMN high_issues INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'code_reviews' 
    AND column_name = 'medium_issues'
  ) THEN
    ALTER TABLE public.code_reviews ADD COLUMN medium_issues INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'code_reviews' 
    AND column_name = 'low_issues'
  ) THEN
    ALTER TABLE public.code_reviews ADD COLUMN low_issues INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'code_reviews' 
    AND column_name = 'total_issues'
  ) THEN
    ALTER TABLE public.code_reviews ADD COLUMN total_issues INTEGER DEFAULT 0;
  END IF;
END $$;

-- 2) Create indices for performance
CREATE INDEX IF NOT EXISTS idx_code_reviews_structured_data ON public.code_reviews USING GIN (structured_data);
CREATE INDEX IF NOT EXISTS idx_code_reviews_overall_score ON public.code_reviews (overall_score);
CREATE INDEX IF NOT EXISTS idx_code_reviews_grade ON public.code_reviews (grade);
CREATE INDEX IF NOT EXISTS idx_code_reviews_total_issues ON public.code_reviews (total_issues);

-- 3) Add comments for documentation
COMMENT ON COLUMN public.code_reviews.structured_data IS 'JSONB structured review data with issues, metrics, and recommendations';
COMMENT ON COLUMN public.code_reviews.overall_score IS 'Overall code quality score (0-100)';
COMMENT ON COLUMN public.code_reviews.grade IS 'Letter grade: A+, A, B, C, D, F';
COMMENT ON COLUMN public.code_reviews.critical_issues IS 'Count of critical severity issues';
COMMENT ON COLUMN public.code_reviews.high_issues IS 'Count of high severity issues';
COMMENT ON COLUMN public.code_reviews.medium_issues IS 'Count of medium severity issues';
COMMENT ON COLUMN public.code_reviews.low_issues IS 'Count of low severity issues';
COMMENT ON COLUMN public.code_reviews.total_issues IS 'Total count of all issues';
