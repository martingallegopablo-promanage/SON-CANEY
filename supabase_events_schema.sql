-- ==============================================================================
-- SON CANEY - CUBAN RESTAURANT & BAR
-- SUPABASE CMS EVENTS TABLE SCHEMA & SEED DATA
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- It creates the 'events' table, enables Row Level Security (RLS), adds public read
-- policies, and populates the authentic weekly Cuban events.

-- 1. Create the events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price NUMERIC(10, 2) DEFAULT 0.00,
  is_ticketed BOOLEAN DEFAULT FALSE,
  date_text TEXT NOT NULL, -- e.g. 'Every Sunday', 'Every Friday & Saturday Night', 'Every Thursday Evening', or specific date '2026-10-31'
  specific_date DATE, -- Optional: for one-time events
  recurrence_days INTEGER[], -- Optional: array of day numbers (0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday)
  time TEXT NOT NULL, -- e.g. '3:00 PM – 8:00 PM'
  image_url TEXT NOT NULL,
  badge TEXT, -- e.g. 'FREE ENTRY • NO TICKET REQUIRED', 'POPULAR • £26.50'
  badge_variant TEXT DEFAULT 'free', -- 'free', 'ticketed-red', 'ticketed-blue'
  badge_color TEXT DEFAULT 'bg-emerald-600 text-white',
  badge_short TEXT DEFAULT 'Free Entry',
  badge_short_color TEXT DEFAULT 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  highlights JSONB DEFAULT '[]'::jsonb, -- Array of bullet points: ["highlight 1", "highlight 2"]
  cta_text TEXT DEFAULT 'Walk-ins Welcome • Reserve Table',
  cta_type TEXT DEFAULT 'info', -- 'ticket' (opens ticket modal) or 'info'
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public read access to active events
DROP POLICY IF EXISTS "Public can view active events" ON public.events;
CREATE POLICY "Public can view active events"
  ON public.events
  FOR SELECT
  USING (is_active = TRUE);

-- 4. Policy: Allow authenticated users / admins full control
DROP POLICY IF EXISTS "Full access for authenticated users" ON public.events;
CREATE POLICY "Full access for authenticated users"
  ON public.events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow public insertion for development / demo if needed:
DROP POLICY IF EXISTS "Allow anon manage for development" ON public.events;
CREATE POLICY "Allow anon manage for development"
  ON public.events
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 5. Seed initial Son Caney authentic Cuban events
INSERT INTO public.events (
  slug,
  title,
  subtitle,
  description,
  price,
  is_ticketed,
  date_text,
  recurrence_days,
  time,
  image_url,
  badge,
  badge_variant,
  badge_color,
  badge_short,
  badge_short_color,
  highlights,
  cta_text,
  cta_type,
  display_order,
  is_active
)
VALUES
  (
    'event-free-tapas',
    'Domingo Free Tapas (Sunday Free Cuban Tapas)',
    'Free authentic bites with any cocktail, rum, or craft beer',
    'Spend your Sunday the Havana way! Order any handcrafted Cuban cocktail (Mojito, Daiquirí, Cuba Libre), cold Cuban craft beer, or rum, and our kitchen treats your table to complimentary homemade tapas: crispy artisan ham croquettes, crunchy mariquitas with criollo garlic mojo dip, and golden yuca bites.',
    0.00,
    FALSE,
    'Every Sunday',
    ARRAY[0],
    '3:00 PM – 8:00 PM',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    'FREE ENTRY • NO TICKET REQUIRED',
    'free',
    'bg-emerald-600 text-white',
    'Free Entry',
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    '["Free tapas served with every round of drinks", "Outdoor patio & bar seating in Notting Hill", "Chilled Latin jazz & acoustic Son Cubano background", "No ticket or cover charge needed"]'::jsonb,
    'Walk-ins Welcome • Reserve Table',
    'info',
    1,
    TRUE
  ),
  (
    'event-cochinillo',
    'Cochinillo Asado Criollo (Whole Roast Suckling Pig Feast)',
    '24h mojo marinated suckling pig slow-roasted over open charcoal',
    'The centerpiece of authentic Cuban country celebrations! Whole tender suckling pig marinated for 24 hours in our heirloom Seville sour orange, smashed garlic, cumin, and oregano criollo mojo, then slow-roasted over charcoal until the crackling is ultra-crisp and the meat falls apart with a spoon.',
    26.50,
    TRUE,
    'Every Friday & Saturday Night',
    ARRAY[5, 6],
    '7:00 PM – 10:30 PM',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    'POPULAR • TICKETED CULINARY FEAST',
    'ticketed-red',
    'bg-primary text-primary-foreground',
    '£26.50 Feast',
    'bg-primary/20 text-red-300 border-primary/30',
    '["Generous portion of charcoal roasted suckling pig", "Includes Moros y Cristianos (black beans & rice)", "Steamed cassava with sizzling mojo & maduros plantains", "Traditional homemade Cuban caramel flan dessert included"]'::jsonb,
    'Buy Feast Ticket (£26.50)',
    'ticket',
    2,
    TRUE
  ),
  (
    'event-salsa',
    'Havana Salsa & Rueda Dance Masterclass',
    'Authentic Cuban dance class + 2 hours Latin social dancing with cocktail',
    'Get your hips moving to authentic Cuban rhythms! Led by master instructor Lázaro straight from Santiago de Cuba. We kick off with a friendly 1-hour workshop covering Cuban salsa footwork and fun Rueda de Casino partner switching, followed by 2 hours of social Latin dancing.',
    14.00,
    TRUE,
    'Every Thursday Evening',
    ARRAY[4],
    '7:30 PM – 10:30 PM',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    'HIGH ENERGY • TICKETED WORKSHOP',
    'ticketed-blue',
    'bg-secondary text-white',
    '£14.00 Class',
    'bg-blue-500/20 text-blue-300 border-blue-500/30',
    '["1 hour structured workshop (Beginners & improvers welcome)", "Includes 1 complimentary Havana Club Mojito on arrival", "2 hours open social dancing with DJ playing Timba & Son", "No partner needed – meet great people!"]'::jsonb,
    'Buy Class Ticket (£14.00)',
    'ticket',
    3,
    TRUE
  ),
  (
    'event-live-music',
    'Noches de Buena Vista (Live Acoustic Son Cubano)',
    'Legendary Havana melodies, vintage guitars, and tropical brass',
    'Midweek Cuban soul. Live acoustic trios perform timeless classics from Buena Vista Social Club, Compay Segundo, and Benny Moré. Enjoy slow-sipped aged rums, authentic street food, and warm Havana hospitality under dim tropical lights.',
    0.00,
    FALSE,
    'Every Wednesday Night',
    ARRAY[3],
    '8:00 PM – 11:00 PM',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    'FREE ADMISSION • LIVE MUSIC',
    'free',
    'bg-emerald-600 text-white',
    'Live Music',
    'bg-amber-500/20 text-amber-300 border-amber-500/30',
    '["Live 3-piece authentic Cuban acoustic band", "Special discounts on aged rum flights & cocktails", "Walk-ins strictly welcome, no cover fee", "Warm, intimate Cuban bar atmosphere"]'::jsonb,
    'Free Admission • No Ticket Needed',
    'info',
    4,
    TRUE
  ),
  (
    'event-rum-tasting',
    'Noche de Ron & Rumba (Cuban Rum Tasting & Live Rumba)',
    'Guided tasting of 4 aged Havana Club rums + live percussion & Cuban street food',
    'An exclusive sensory journey through Cuba''s rich rum heritage. Led by our master cantinero, you will taste four vintage Havana Club expressions (3 Años, 7 Años, Selección de Maestros, and Cuban Smoky), paired with crispy mariquitas, artisanal Cuban empanadas, and authentic live Afro-Cuban guaguancó rumba percussion.',
    18.50,
    TRUE,
    'Every Tuesday Evening',
    ARRAY[2],
    '7:00 PM – 10:00 PM',
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80',
    'TASTING & LIVE SHOW • £18.50',
    'ticketed-amber',
    'bg-amber-600 text-white',
    '£18.50 Rum Flight',
    'bg-amber-500/20 text-amber-300 border-amber-500/30',
    '["4-flight guided tasting of aged vintage Cuban rums", "Includes 2 handcrafted artisan Cuban empanadas & mariquitas", "Live Afro-Cuban rumba and batá drum performance", "Exclusive 15% discount on whole rum bottles to take home"]'::jsonb,
    'Buy Tasting Ticket (£18.50)',
    'ticket',
    5,
    TRUE
  )
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_ticketed = EXCLUDED.is_ticketed,
  date_text = EXCLUDED.date_text,
  time = EXCLUDED.time,
  image_url = EXCLUDED.image_url,
  highlights = EXCLUDED.highlights,
  updated_at = now();

-- Done! Now events can be added, updated, or removed directly from Supabase Table Editor.
