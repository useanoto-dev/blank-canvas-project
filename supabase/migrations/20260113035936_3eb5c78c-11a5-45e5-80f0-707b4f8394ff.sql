-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  store_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role, store_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo_url TEXT,
  banner_url TEXT,
  primary_color TEXT DEFAULT '#dc2626',
  secondary_color TEXT DEFAULT '#f97316',
  font_family TEXT DEFAULT 'Inter',
  phone TEXT,
  whatsapp_phone TEXT,
  instagram TEXT,
  address TEXT,
  cep TEXT,
  city TEXT,
  state TEXT,
  neighborhood TEXT,
  address_number TEXT,
  google_maps_link TEXT,
  about_us TEXT,
  pix_key TEXT,
  open_hour INTEGER DEFAULT 8,
  close_hour INTEGER DEFAULT 22,
  is_open_override BOOLEAN,
  estimated_prep_time INTEGER DEFAULT 25,
  estimated_delivery_time INTEGER DEFAULT 20,
  delivery_fee NUMERIC DEFAULT 5,
  min_order_value NUMERIC DEFAULT 0,
  schedule JSONB,
  use_comanda_mode BOOLEAN DEFAULT true,
  sidebar_color TEXT DEFAULT 'amber',
  printnode_api_key TEXT,
  printnode_printer_id TEXT,
  printnode_auto_print BOOLEAN DEFAULT false,
  printnode_max_retries INTEGER DEFAULT 2,
  printer_width TEXT DEFAULT '80mm',
  print_footer_message TEXT,
  uazapi_instance_name TEXT,
  uazapi_instance_token TEXT,
  whatsapp_status TEXT DEFAULT 'disconnected',
  whatsapp_number TEXT,
  whatsapp_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on stores
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- RLS policies for stores
CREATE POLICY "Store owners can view their own stores" ON public.stores FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Store owners can update their own stores" ON public.stores FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Store owners can insert their own stores" ON public.stores FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Public can view active stores by slug" ON public.stores FOR SELECT USING (is_active = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'owner');
  
  INSERT INTO public.stores (owner_id, name, slug)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'establishment_name', 'Minha Loja'), 
          LOWER(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data->>'establishment_name', 'loja-' || SUBSTRING(NEW.id::text, 1, 8)), '[^a-zA-Z0-9]', '-', 'g')));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();