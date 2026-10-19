-- ==============================================================================
-- SCHEMA SUPABASE: FLAMEGRILL / SON CANEY
-- Pega este script en el "SQL Editor" de tu proyecto de Supabase y dale a "Run"
-- ==============================================================================

-- 1. TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    emoji TEXT DEFAULT '🍔',
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA DE PLATOS / MENÚ
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    calories INT DEFAULT 0,
    prep_time_minutes INT DEFAULT 15,
    tags TEXT[] DEFAULT '{}',
    customizations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA DE PEDIDOS (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'confirmed' 
        CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
    order_type TEXT NOT NULL DEFAULT 'delivery' 
        CHECK (order_type IN ('pickup', 'delivery', 'dine_in')),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT,
    special_instructions TEXT,
    payment_method TEXT DEFAULT 'card',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. SEGURIDAD Y PERMISOS (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Permisos públicos para lectura de menú
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Menu" ON public.menu_items FOR SELECT USING (is_available = true);

-- Permisos de pedidos: cualquier cliente puede crear y consultar
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow Update Orders" ON public.orders FOR UPDATE USING (true);

-- ==============================================================================
-- 5. HABILITAR TIEMPO REAL (WEBSOCKETS) EN PEDIDOS
-- Permite que la pantalla del cliente cambie el estado en vivo cuando cocina lo mueva
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- ==============================================================================
-- 6. DATOS INICIALES (SEED DATA)
-- ==============================================================================
INSERT INTO public.categories (name, emoji, description, sort_order) VALUES
('Burgers', '🍔', 'Flame-grilled signature burgers', 1),
('Chicken', '🍗', 'Crispy and grilled chicken favorites', 2),
('Sides', '🍟', 'Fries, rings, and savory sides', 3),
('Drinks', '🥤', 'Refreshing sodas, shakes, and drinks', 4),
('Desserts', '🍦', 'Sweet treats and frozen desserts', 5),
('Salads', '🥗', 'Fresh green salads and bowls', 6)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.menu_items (name, description, price, category, image_url, is_available, is_featured, calories, prep_time_minutes, tags, customizations) VALUES
(
    'Classic Flame Burger',
    '100% Angus beef patty, flame-grilled to perfection with cheddar, lettuce, tomato, pickles, and our signature secret sauce on a toasted brioche bun.',
    9.99,
    'Burgers',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    720,
    12,
    ARRAY['Bestseller', 'Chef Special'],
    '[
        {"group_name": "Choose Cheese", "required": true, "max_select": 1, "options": [{"name": "Aged Cheddar", "price_add": 0}, {"name": "Swiss Cheese", "price_add": 0.5}, {"name": "Pepper Jack", "price_add": 0.5}, {"name": "No Cheese", "price_add": 0}]},
        {"group_name": "Extras & Add-ons", "required": false, "max_select": 4, "options": [{"name": "Crispy Bacon", "price_add": 1.50}, {"name": "Caramelized Onions", "price_add": 0.75}, {"name": "Extra Beef Patty", "price_add": 3.50}, {"name": "Jalapeños", "price_add": 0.50}, {"name": "Fried Egg", "price_add": 1.25}]}
    ]'::jsonb
),
(
    'Smoky Bacon BBQ Burger',
    'Double smoked bacon, sharp cheddar, crispy fried onion straws, and tangy bourbon BBQ sauce on artisan pretzel bun.',
    12.49,
    'Burgers',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    890,
    15,
    ARRAY['Popular', 'BBQ'],
    '[
        {"group_name": "Meat Doneness", "required": true, "max_select": 1, "options": [{"name": "Medium", "price_add": 0}, {"name": "Medium Well", "price_add": 0}, {"name": "Well Done", "price_add": 0}]},
        {"group_name": "Add-ons", "required": false, "max_select": 3, "options": [{"name": "Extra BBQ Sauce", "price_add": 0.50}, {"name": "Extra Bacon Strips", "price_add": 1.75}, {"name": "Avocado Slices", "price_add": 1.50}]}
    ]'::jsonb
),
(
    'Spicy Inferno Smash',
    'Two smashed beef patties, pepper jack, grilled jalapeños, ghost pepper aioli, and habanero honey glaze.',
    11.99,
    'Burgers',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    true,
    false,
    810,
    12,
    ARRAY['Spicy 🔥', 'New'],
    '[
        {"group_name": "Spice Level", "required": true, "max_select": 1, "options": [{"name": "Mild Heat", "price_add": 0}, {"name": "Spicy Hot", "price_add": 0}, {"name": "Extra Inferno 🔥🔥", "price_add": 0}]}
    ]'::jsonb
),
(
    'Crispy Buttermilk Chicken',
    '24-hour buttermilk brined chicken breast, golden fried with dill pickles, creamy coleslaw, and spicy herb mayo.',
    10.49,
    'Chicken',
    'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    680,
    10,
    ARRAY['Crispy', 'Bestseller'],
    '[
        {"group_name": "Style", "required": true, "max_select": 1, "options": [{"name": "Original Crispy", "price_add": 0}, {"name": "Nashville Hot", "price_add": 0.50}, {"name": "Honey Glazed", "price_add": 0.50}]}
    ]'::jsonb
),
(
    'Golden Truffle Fries',
    'Crispy skin-on french fries tossed with white truffle oil, grated parmesan cheese, and fresh Italian parsley.',
    5.49,
    'Sides',
    'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    420,
    8,
    ARRAY['Must Try'],
    '[
        {"group_name": "Dipping Sauce", "required": false, "max_select": 2, "options": [{"name": "Garlic Truffle Mayo", "price_add": 0.50}, {"name": "Smoky Chipotle BBQ", "price_add": 0.50}, {"name": "Honey Mustard", "price_add": 0.50}]}
    ]'::jsonb
),
(
    'Salted Caramel Milkshake',
    'Creamy Madagascar vanilla bean ice cream spun with buttery caramel syrup, sea salt, whipped cream, and wafer stick.',
    5.49,
    'Drinks',
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    true,
    true,
    580,
    5,
    ARRAY['Sweet Treat'],
    '[]'::jsonb
);
