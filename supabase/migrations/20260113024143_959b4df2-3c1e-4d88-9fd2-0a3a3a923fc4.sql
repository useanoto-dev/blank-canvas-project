-- Drop existing trigger and function if they exist to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_signup();

-- Create function to sync signup data with stores table
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_store_id UUID;
  store_slug TEXT;
BEGIN
  -- Generate a unique slug from store name
  store_slug := lower(replace(replace(replace(COALESCE(NEW.raw_user_meta_data ->> 'store_name', 'minha-loja'), ' ', '-'), '.', ''), ',', ''));
  store_slug := store_slug || '-' || substring(gen_random_uuid()::text, 1, 8);

  -- Insert into profiles table first
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NULL
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name;

  -- Insert into stores table with all signup data
  INSERT INTO public.stores (
    name,
    slug,
    owner_id,
    phone,
    whatsapp_phone,
    address,
    cep,
    city,
    state,
    neighborhood,
    address_number,
    is_active
  )
  VALUES (
    COALESCE(NEW.raw_user_meta_data ->> 'store_name', 'Minha Loja'),
    store_slug,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'store_address', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'cep', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'city', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'state', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'neighborhood', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'address_number', ''),
    true
  )
  RETURNING id INTO new_store_id;

  -- Insert user role as owner
  INSERT INTO public.user_roles (user_id, role, store_id)
  VALUES (NEW.id, 'owner', new_store_id)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block signup
    RAISE WARNING 'Error in handle_new_user_signup: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger to run after user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_signup();