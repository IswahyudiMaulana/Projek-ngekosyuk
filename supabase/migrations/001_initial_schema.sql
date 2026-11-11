-- ===================================================
-- NGEKOSYUK DATABASE INITIAL SCHEMA
-- ===================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'owner')),
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  area TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  gender_type TEXT NOT NULL CHECK (gender_type IN ('PUTRA', 'PUTRI', 'CAMPUR')),
  price_min NUMERIC(12, 2),
  rating_average NUMERIC(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  verification_status TEXT DEFAULT 'unconfirmed' CHECK (verification_status IN ('verified', 'unconfirmed', 'demo')),
  listing_status TEXT DEFAULT 'available' CHECK (listing_status IN ('available', 'full', 'unconfirmed')),
  data_source TEXT DEFAULT 'owner',
  is_demo BOOLEAN DEFAULT FALSE,
  rules_description TEXT,
  curfew_time TEXT,
  guest_policy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  room_name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  total_rooms INT NOT NULL DEFAULT 1,
  available_rooms INT NOT NULL DEFAULT 1,
  occupied_rooms INT NOT NULL DEFAULT 0,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'full')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FACILITIES TABLE
CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);

-- 5. PROPERTY_FACILITIES TABLE
CREATE TABLE IF NOT EXISTS public.property_facilities (
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, facility_id)
);

-- 6. PROPERTY_IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_category TEXT DEFAULT 'general' CHECK (image_category IN ('exterior', 'bedroom', 'bathroom', 'kitchen', 'parking', 'common', 'environment', 'general'))
);

-- 7. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  cleanliness_rating NUMERIC(2, 1) CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  comfort_rating NUMERIC(2, 1) CHECK (comfort_rating >= 1 AND comfort_rating <= 5),
  security_rating NUMERIC(2, 1) CHECK (security_rating >= 1 AND security_rating <= 5),
  facilities_rating NUMERIC(2, 1) CHECK (facilities_rating >= 1 AND facilities_rating <= 5),
  environment_rating NUMERIC(2, 1) CHECK (environment_rating >= 1 AND environment_rating <= 5),
  comment TEXT,
  verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified', 'demo')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  UNIQUE(customer_id, property_id)
);

-- 9. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, owner_id, property_id)
);

-- 10. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Read policies (Public can view properties, rooms, facilities, images, reviews)
CREATE POLICY "Public properties read" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Public rooms read" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Public facilities read" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Public property_facilities read" ON public.property_facilities FOR SELECT USING (true);
CREATE POLICY "Public property_images read" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Public reviews read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (true);
