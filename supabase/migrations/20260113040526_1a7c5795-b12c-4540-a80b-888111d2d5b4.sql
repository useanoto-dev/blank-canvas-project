-- Add onboarding_completed column to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;