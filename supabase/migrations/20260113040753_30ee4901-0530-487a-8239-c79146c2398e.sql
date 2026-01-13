-- Fix security issues: set search_path for function and replace overly permissive policies

-- Fix function search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;

-- Create more secure policies - orders must have a valid store_id
CREATE POLICY "Anyone can create orders with valid store" ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE is_active = true));

-- Reviews must have a valid store_id
CREATE POLICY "Anyone can create reviews with valid store" ON public.reviews FOR INSERT TO anon, authenticated
WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE is_active = true));