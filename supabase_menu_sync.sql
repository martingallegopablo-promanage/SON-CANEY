-- ==============================================================================
-- SON CANEY - CUBAN MENU SYNCHRONIZATION FOR SUPABASE
-- ==============================================================================
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- This replaces the old generic template burgers with the 14 authentic Son Caney
-- Cuban dishes and 5 Cuban categories.

-- 1. Ensure RLS policies allow reading and updating
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can manage categories" ON public.categories;
CREATE POLICY "Public can manage categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view menu_items" ON public.menu_items;
CREATE POLICY "Public can view menu_items" ON public.menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can manage menu_items" ON public.menu_items;
CREATE POLICY "Public can manage menu_items" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);

-- 2. Clear old template burger items & categories
DELETE FROM public.menu_items;
DELETE FROM public.categories;

-- 3. Insert Authentic Son Caney Cuban Categories
INSERT INTO public.categories (id, name, emoji, description, sort_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Cuban Sandwiches', '🥪', 'Artisan Cuban bread pressed hot & crispy with slow-roasted pork', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Traditional Mains', '🥘', 'Authentic criollo slow-cooked stews served with rice & plantains', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Street Food & Sides', '🍌', 'Crispy tostones, cassava yuca fries, maduros and handmade croquettes', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Cocktails & Tropical Drinks', '🍹', 'Handcrafted Havana mojitos, rum daiquiris and tropical fruit nectars', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Artisan Desserts', '🍮', 'Traditional family Cuban desserts and sweet treats', 5, true);

-- 4. Insert 14 Authentic Son Caney Cuban Dishes
INSERT INTO public.menu_items (
  id,
  name,
  description,
  price,
  category,
  image_url,
  is_available,
  is_featured,
  calories,
  prep_time_minutes,
  tags,
  customizations
)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'Classic Cuban Sandwich (Cubano)',
    'The world-famous Havana classic on crisp artisan Cuban bread, packed with slow-roasted mojo pork shoulder, honey-glazed ham, melted Swiss cheese, tangy dill pickles, and yellow mustard. Pressed golden hot.',
    10.95,
    'Cuban Sandwiches',
    'https://images.unsplash.com/photo-1628191010210-a59de33e5941?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    680,
    10,
    ARRAY['Bestseller', 'Chef Special'],
    '[{"group_name":"Choice of Side","required":true,"max_select":1,"options":[{"name":"Crispy Plantain Crisps (Mariquitas)","price_add":0},{"name":"Skin-on Seasoned Fries","price_add":0},{"name":"Green Plantain Tostones with Garlic Mojo","price_add":1.50}]},{"group_name":"Extras & Add-ons","required":false,"max_select":3,"options":[{"name":"Extra Slow-Roasted Mojo Pork","price_add":2.50},{"name":"Extra Melted Swiss Cheese","price_add":1.20},{"name":"Rum-Caramelised Onions","price_add":0.90},{"name":"Side of Citrus Garlic Mojo Dip","price_add":0.75}]}]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Medianoche Sandwich (Midnight Special)',
    'A sweeter sibling to the Cubano, served in soft golden egg challah-style brioche bread. Filled with shredded slow-roast pork, sweet ham, melted Swiss cheese, pickles, and classic mustard.',
    10.50,
    'Cuban Sandwiches',
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    640,
    10,
    ARRAY['Havana Classic'],
    '[{"group_name":"Choice of Side","required":true,"max_select":1,"options":[{"name":"Crispy Plantain Crisps","price_add":0},{"name":"Skin-on Seasoned Fries","price_add":0},{"name":"Sweet Fried Plantains (Maduros)","price_add":1.50}]}]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'Pan con Lechón (Pulled Mojo Roast Pork Roll)',
    'Crisp rustic bread roll overflowing with hand-pulled 24-hour slow-roasted pork shoulder, steeped in bubbling hot citrus garlic mojo, pickled red onions, and crisp crackling bits.',
    11.50,
    'Cuban Sandwiches',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    true,
    false,
    720,
    12,
    ARRAY['Authentic Criollo'],
    '[{"group_name":"Mojo Spice Level","required":true,"max_select":1,"options":[{"name":"Traditional Citrus Garlic Mojo","price_add":0},{"name":"Spicy Habanero Mojo 🔥","price_add":0},{"name":"Roasted Garlic & Herb Mojo","price_add":0.50}]}]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'Grandma''s Ropa Vieja (Shredded Flank Steak)',
    'Cuba''s national culinary pride. Tender flank beef braised slowly in a rich sofrito reduction of crushed tomatoes, sweet bell peppers, Spanish onions, white wine, garlic and warm cumin. Served with fluffy white rice, seasoned black beans, and crispy tostones.',
    14.95,
    'Traditional Mains',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    790,
    15,
    ARRAY['Signature Dish', 'Traditional'],
    '[{"group_name":"Rice Selection","required":true,"max_select":1,"options":[{"name":"Fluffy White Rice & Seasoned Black Beans","price_add":0},{"name":"Moros y Cristianos (Traditional Black Bean Rice / Congrí)","price_add":0.50}]},{"group_name":"Plantain Accompaniment","required":true,"max_select":1,"options":[{"name":"Crisp Green Plantain Tostones","price_add":0},{"name":"Sweet Caramelised Maduros","price_add":0},{"name":"Steamed Cassava Yuca with Garlic Mojo","price_add":1.00}]}]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000005',
    'Vaca Frita (Crispy Pan-Fried Shredded Beef)',
    'Tender braised flank steak shredded and pan-seared till crispy with sweet sauteed white onions, roasted garlic, aromatic oregano, and fresh lime juice splash.',
    15.50,
    'Traditional Mains',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    true,
    false,
    760,
    15,
    ARRAY['Crispy & Juicy'],
    '[{"group_name":"Platter Sides","required":true,"max_select":1,"options":[{"name":"Congrí Rice, Yuca with Mojo & Lime","price_add":0},{"name":"Steamed Rice, Stewed Black Beans & Tostones","price_add":0}]}]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000006',
    'Lechón Asado (Slow-Roasted Country Pork)',
    'Succulent pork leg marinated for 24 hours in Seville sour orange, wild garlic, bay leaves and cumin, slow roasted to juicy perfection with blistered crispy skin.',
    14.50,
    'Traditional Mains',
    'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    820,
    14,
    ARRAY['Chef Special'],
    '[{"group_name":"Platter Sides","required":true,"max_select":1,"options":[{"name":"Congrí Rice & Sweet Fried Maduros","price_add":0},{"name":"Steamed Rice, Garlic Cassava Yuca & Black Beans","price_add":0}]}]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000007',
    'Stuffed Green Tostones (4 pcs)',
    'Crispy fried green plantain cups freshly pressed and double-fried, stuffed with rich beef ropa vieja and pulled lechón pork, finished with melted cheese and fresh coriander.',
    7.95,
    'Street Food & Sides',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    410,
    8,
    ARRAY['Sharing', 'Bestseller'],
    '[]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000008',
    'Steamed Cassava Yuca with Garlic Mojo',
    'Buttery soft boiled cassava root drizzled with sizzling criollo mojo made from crushed garlic, sweet red onions and Seville sour orange.',
    6.50,
    'Street Food & Sides',
    'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
    true,
    false,
    380,
    8,
    ARRAY['Vegetarian', 'Gluten Free'],
    '[]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000009',
    'Homemade Cuban Ham Croquettes (5 pcs)',
    'Artisanal golden croquettes with a velvety smooth béchamel interior filled with smoked Serrano ham and Cuban spices, served with fresh lime wedges and spicy mayo.',
    6.95,
    'Street Food & Sides',
    'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    450,
    6,
    ARRAY['Sharing', 'Traditional'],
    '[]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000010',
    'Crispy Plantain Crisps (Mariquitas)',
    'Wafer-thin green plantain slices fried golden and seasoned with sea salt, served with a ramekin of homemade garlic mojo dipping sauce.',
    4.50,
    'Street Food & Sides',
    'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
    true,
    false,
    290,
    5,
    ARRAY['Vegetarian', 'Gluten Free'],
    '[]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000011',
    'Sweet Caramelised Fried Maduros',
    'Ripe sweet yellow plantains pan-fried until deeply golden and caramelised around the edges with tender sweet center.',
    4.95,
    'Street Food & Sides',
    'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop&q=80',
    true,
    false,
    320,
    6,
    ARRAY['Vegetarian', 'Sweet & Savoury'],
    '[]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000012',
    'Classic Havana Club Mojito (500ml)',
    'Fresh spearmint leaves muddled with raw cane sugar, freshly squeezed lime juice, genuine Havana Club Añejo 3 Años rum, topped with sparkling soda and crushed ice.',
    8.50,
    'Cocktails & Tropical Drinks',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    195,
    4,
    ARRAY['Cuban Cocktail', 'Bestseller'],
    '[{"group_name":"Rum Preference","required":true,"max_select":1,"options":[{"name":"Havana Club 3 Años (Classic White)","price_add":0},{"name":"Havana Club 7 Años (Dark Aged Rum)","price_add":1.50},{"name":"Virgin Mojito (Non-Alcoholic)","price_add":-2.00}]}]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000013',
    'Daiquirí Floridita (Frozen or Shaken)',
    'Hemingway''s beloved cocktail straight from El Floridita in Havana. Premium Cuban white rum, freshly squeezed lime juice, Maraschino cherry liqueur, and simple syrup.',
    8.95,
    'Cocktails & Tropical Drinks',
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80',
    true,
    false,
    180,
    4,
    ARRAY['Cuban Cocktail'],
    '[{"group_name":"Style","required":true,"max_select":1,"options":[{"name":"Classic Frozen Frappé","price_add":0},{"name":"Shaken Straight Up (Coupe Glass)","price_add":0}]}]'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000014',
    'Traditional Caramel Flan Cubano',
    'Velvety smooth Cuban baked egg custard infused with sweet condensed milk, Tahitian vanilla bean, and finished with golden amber caramel syrup.',
    5.50,
    'Artisan Desserts',
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    340,
    2,
    ARRAY['Homemade', 'Bestseller'],
    '[]'::jsonb
  );

-- Done! The 14 Cuban items and 5 categories are now populated in Supabase.
