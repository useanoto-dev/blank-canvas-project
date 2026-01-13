-- Drop existing restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Store owners can insert their own stores" ON public.stores;
DROP POLICY IF EXISTS "Store owners can update their own stores" ON public.stores;
DROP POLICY IF EXISTS "Store owners can view their own stores" ON public.stores;
DROP POLICY IF EXISTS "Public can view active stores by slug" ON public.stores;

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Recreate stores policies as PERMISSIVE (default)
CREATE POLICY "Store owners can insert their own stores" 
ON public.stores 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Store owners can update their own stores" 
ON public.stores 
FOR UPDATE 
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Store owners can view their own stores" 
ON public.stores 
FOR SELECT 
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Public can view active stores by slug" 
ON public.stores 
FOR SELECT 
TO anon, authenticated
USING (is_active = true);

-- Recreate profiles policies as PERMISSIVE
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Recreate user_roles policies as PERMISSIVE
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);