-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS store_id UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_owner BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  category_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  promotional_price NUMERIC,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  variations JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables (restaurant tables) table
CREATE TABLE IF NOT EXISTS public.tables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  number TEXT NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'available',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  name TEXT NOT NULL,
  icon_type TEXT DEFAULT 'cash',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create category_option_groups table
CREATE TABLE IF NOT EXISTS public.category_option_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  category_id UUID NOT NULL,
  name TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_required BOOLEAN DEFAULT false,
  selection_type TEXT DEFAULT 'single',
  min_selections INTEGER DEFAULT 0,
  max_selections INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create category_option_items table
CREATE TABLE IF NOT EXISTS public.category_option_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  group_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  additional_price NUMERIC DEFAULT 0,
  promotional_price NUMERIC,
  promotion_start_at TIMESTAMP WITH TIME ZONE,
  promotion_end_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory_categories table
CREATE TABLE IF NOT EXISTS public.inventory_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory_products table
CREATE TABLE IF NOT EXISTS public.inventory_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  category_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  promotional_price NUMERIC,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_cpf TEXT,
  service_type TEXT DEFAULT 'delivery',
  status TEXT DEFAULT 'pending',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  delivery_fee NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT,
  change_amount NUMERIC,
  address JSONB,
  table_number TEXT,
  observations TEXT,
  coupon_id UUID,
  coupon_code TEXT,
  coupon_discount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  code TEXT NOT NULL,
  discount_type TEXT DEFAULT 'percentage',
  discount_value NUMERIC NOT NULL DEFAULT 0,
  min_order_value NUMERIC DEFAULT 0,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery_areas table
CREATE TABLE IF NOT EXISTS public.delivery_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  name TEXT NOT NULL,
  fee NUMERIC DEFAULT 0,
  min_order_value NUMERIC DEFAULT 0,
  estimated_time INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create banners table
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL,
  order_id UUID,
  customer_name TEXT,
  rating INTEGER NOT NULL,
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_option_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories
CREATE POLICY "Store owners can manage categories" ON public.categories FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT TO anon, authenticated
USING (is_active = true);

-- Create RLS policies for products
CREATE POLICY "Store owners can manage products" ON public.products FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

CREATE POLICY "Public can view available products" ON public.products FOR SELECT TO anon, authenticated
USING (is_available = true);

-- Create RLS policies for tables
CREATE POLICY "Store owners can manage tables" ON public.tables FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

-- Create RLS policies for payment_methods
CREATE POLICY "Store owners can manage payment methods" ON public.payment_methods FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

CREATE POLICY "Public can view active payment methods" ON public.payment_methods FOR SELECT TO anon, authenticated
USING (is_active = true);

-- Create RLS policies for category_option_groups
CREATE POLICY "Store owners can manage option groups" ON public.category_option_groups FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

CREATE POLICY "Public can view active option groups" ON public.category_option_groups FOR SELECT TO anon, authenticated
USING (is_active = true);

-- Create RLS policies for category_option_items
CREATE POLICY "Store owners can manage option items" ON public.category_option_items FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

CREATE POLICY "Public can view active option items" ON public.category_option_items FOR SELECT TO anon, authenticated
USING (is_active = true);

-- Create RLS policies for inventory_categories
CREATE POLICY "Store owners can manage inventory categories" ON public.inventory_categories FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

-- Create RLS policies for inventory_products
CREATE POLICY "Store owners can manage inventory products" ON public.inventory_products FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

-- Create RLS policies for orders
CREATE POLICY "Store owners can manage orders" ON public.orders FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Create RLS policies for coupons
CREATE POLICY "Store owners can manage coupons" ON public.coupons FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT TO anon, authenticated
USING (is_active = true);

-- Create RLS policies for delivery_areas
CREATE POLICY "Store owners can manage delivery areas" ON public.delivery_areas FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

CREATE POLICY "Public can view active delivery areas" ON public.delivery_areas FOR SELECT TO anon, authenticated
USING (is_active = true);

-- Create RLS policies for banners
CREATE POLICY "Store owners can manage banners" ON public.banners FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

CREATE POLICY "Public can view active banners" ON public.banners FOR SELECT TO anon, authenticated
USING (is_active = true);

-- Create RLS policies for reviews
CREATE POLICY "Store owners can manage reviews" ON public.reviews FOR ALL TO authenticated
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

CREATE POLICY "Anyone can create reviews" ON public.reviews FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can view approved reviews" ON public.reviews FOR SELECT TO anon, authenticated
USING (is_approved = true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inventory_products_updated_at BEFORE UPDATE ON public.inventory_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();