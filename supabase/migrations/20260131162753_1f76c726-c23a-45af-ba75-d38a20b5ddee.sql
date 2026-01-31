-- Create categories table
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    weight_grams DECIMAL(8, 2),
    purity TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wishlist table
CREATE TABLE public.wishlist (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- Create call bookings table
CREATE TABLE public.call_bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_date DATE,
    preferred_time TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product inquiries table
CREATE TABLE public.product_inquiries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    inquiry_type TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact queries table
CREATE TABLE public.contact_queries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and products
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can view their own wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their own wishlist" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from their own wishlist" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);

-- Call bookings policies
CREATE POLICY "Anyone can create a call booking" ON public.call_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own call bookings" ON public.call_bookings FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Product inquiries policies
CREATE POLICY "Anyone can create a product inquiry" ON public.product_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own product inquiries" ON public.product_inquiries FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Contact queries - anyone can submit
CREATE POLICY "Anyone can submit a contact query" ON public.contact_queries FOR INSERT WITH CHECK (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Gold Necklaces', 'gold-necklaces', 'Exquisite gold necklaces for every occasion', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'),
('Diamond Rings', 'diamond-rings', 'Stunning diamond rings that sparkle', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'),
('Gold Bangles', 'gold-bangles', 'Traditional and modern gold bangles', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400'),
('Earrings', 'earrings', 'Elegant earrings for every style', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'),
('Bridal Sets', 'bridal-sets', 'Complete bridal jewelry sets', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'),
('Silver Jewelry', 'silver-jewelry', 'Beautiful silver ornaments', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400');

-- Insert sample products
INSERT INTO public.products (name, description, price, weight_grams, purity, category_id, image_url, is_featured) VALUES
('Royal Kundan Necklace', 'Handcrafted kundan necklace with intricate meenakari work', 245000, 45.5, '22K', (SELECT id FROM public.categories WHERE slug = 'gold-necklaces'), 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', true),
('Diamond Solitaire Ring', 'Classic solitaire with 1 carat VVS diamond', 185000, 5.2, '18K', (SELECT id FROM public.categories WHERE slug = 'diamond-rings'), 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600', true),
('Traditional Gold Bangles Set', 'Set of 4 traditional gold bangles with temple design', 165000, 38.0, '22K', (SELECT id FROM public.categories WHERE slug = 'gold-bangles'), 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600', true),
('Pearl Drop Earrings', 'Elegant gold earrings with natural pearls', 42000, 8.5, '22K', (SELECT id FROM public.categories WHERE slug = 'earrings'), 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600', true),
('Bridal Choker Set', 'Complete bridal set with choker, earrings and maang tikka', 485000, 85.0, '22K', (SELECT id FROM public.categories WHERE slug = 'bridal-sets'), 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', true),
('Silver Oxidized Anklet', 'Traditional silver anklet with bell charms', 3500, 25.0, '925 Sterling', (SELECT id FROM public.categories WHERE slug = 'silver-jewelry'), 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600', false),
('Temple Gold Necklace', 'South Indian temple jewelry necklace', 320000, 55.0, '22K', (SELECT id FROM public.categories WHERE slug = 'gold-necklaces'), 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', true),
('Diamond Tennis Bracelet', 'Sparkling diamond tennis bracelet', 275000, 12.0, '18K', (SELECT id FROM public.categories WHERE slug = 'diamond-rings'), 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600', false),
('Antique Gold Jhumkas', 'Vintage style gold jhumka earrings', 68000, 18.5, '22K', (SELECT id FROM public.categories WHERE slug = 'earrings'), 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600', false),
('Modern Minimal Ring', 'Sleek modern gold ring for daily wear', 28000, 4.0, '18K', (SELECT id FROM public.categories WHERE slug = 'diamond-rings'), 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600', false),
('Polki Bridal Set', 'Royal polki diamond bridal jewelry set', 650000, 95.0, '22K', (SELECT id FROM public.categories WHERE slug = 'bridal-sets'), 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', true),
('Silver Chain Necklace', 'Modern silver chain with pendant', 8500, 15.0, '925 Sterling', (SELECT id FROM public.categories WHERE slug = 'silver-jewelry'), 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600', false);