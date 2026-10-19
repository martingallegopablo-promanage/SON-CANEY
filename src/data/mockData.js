export const initialCategories = [
  { id: '1', name: 'Cuban Sandwiches', emoji: '🥪', description: 'Artisan Cuban bread pressed hot & crispy with slow-roasted pork' },
  { id: '2', name: 'Traditional Mains', emoji: '🥘', description: 'Authentic criollo slow-cooked stews served with rice & plantains' },
  { id: '3', name: 'Street Food & Sides', emoji: '🍌', description: 'Crispy tostones, cassava yuca fries, maduros and handmade croquettes' },
  { id: '4', name: 'Cocktails & Tropical Drinks', emoji: '🍹', description: 'Handcrafted Havana mojitos, rum daiquiris and tropical fruit nectars' },
  { id: '5', name: 'Artisan Desserts', emoji: '🍮', description: 'Traditional family Cuban desserts and sweet treats' },
];

export const initialMenuItems = [
  {
    id: 'cuban-1',
    name: 'Classic Cuban Sandwich (Cubano)',
    description: 'The world-famous Havana classic on crisp artisan Cuban bread, packed with slow-roasted mojo pork shoulder, honey-glazed ham, melted Swiss cheese, tangy dill pickles, and yellow mustard. Pressed golden hot.',
    price: 10.95,
    category: 'Cuban Sandwiches',
    image_url: 'https://images.unsplash.com/photo-1628191010210-a59de33e5941?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: true,
    calories: 680,
    prep_time_minutes: 10,
    tags: ['Bestseller', 'Chef Special'],
    customizations: [
      {
        group_name: 'Choice of Side',
        required: true,
        max_select: 1,
        options: [
          { name: 'Crispy Plantain Crisps (Mariquitas)', price_add: 0 },
          { name: 'Skin-on Seasoned Fries', price_add: 0 },
          { name: 'Green Plantain Tostones with Garlic Mojo', price_add: 1.50 },
        ]
      },
      {
        group_name: 'Extras & Add-ons',
        required: false,
        max_select: 3,
        options: [
          { name: 'Extra Slow-Roasted Mojo Pork', price_add: 2.50 },
          { name: 'Extra Melted Swiss Cheese', price_add: 1.20 },
          { name: 'Rum-Caramelised Onions', price_add: 0.90 },
          { name: 'Side of Citrus Garlic Mojo Dip', price_add: 0.75 },
        ]
      }
    ]
  },
  {
    id: 'cuban-2',
    name: 'Medianoche Sandwich (Midnight Special)',
    description: 'A sweeter sibling to the Cubano, served in soft golden egg challah-style brioche bread. Filled with shredded slow-roast pork, sweet ham, melted Swiss cheese, pickles, and classic mustard.',
    price: 10.50,
    category: 'Cuban Sandwiches',
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: true,
    calories: 640,
    prep_time_minutes: 10,
    tags: ['Havana Classic'],
    customizations: [
      {
        group_name: 'Choice of Side',
        required: true,
        max_select: 1,
        options: [
          { name: 'Crispy Plantain Crisps', price_add: 0 },
          { name: 'Skin-on Seasoned Fries', price_add: 0 },
          { name: 'Sweet Fried Plantains (Maduros)', price_add: 1.50 },
        ]
      }
    ]
  },
  {
    id: 'cuban-3',
    name: 'Pan con Lechón (Pulled Mojo Roast Pork Roll)',
    description: 'Crisp rustic bread roll overflowing with hand-pulled 24-hour slow-roasted pork shoulder, steeped in bubbling hot citrus garlic mojo, pickled red onions, and crisp crackling bits.',
    price: 11.50,
    category: 'Cuban Sandwiches',
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: false,
    calories: 720,
    prep_time_minutes: 12,
    tags: ['Authentic Criollo'],
    customizations: [
      {
        group_name: 'Mojo Spice Level',
        required: true,
        max_select: 1,
        options: [
          { name: 'Traditional Citrus Garlic Mojo', price_add: 0 },
          { name: 'Spicy Habanero Mojo 🔥', price_add: 0 },
          { name: 'Roasted Garlic & Herb Mojo', price_add: 0.50 },
        ]
      }
    ]
  },
  {
    id: 'cuban-4',
    name: "Grandma's Ropa Vieja (Shredded Flank Steak)",
    description: "Cuba's national culinary pride. Tender flank beef braised slowly in a rich sofrito reduction of crushed tomatoes, sweet bell peppers, Spanish onions, white wine, garlic and warm cumin. Served with fluffy white rice, seasoned black beans, and crispy tostones.",
    price: 14.95,
    category: 'Traditional Mains',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: true,
    calories: 790,
    prep_time_minutes: 15,
    tags: ['Signature Dish', 'Traditional'],
    customizations: [
      {
        group_name: 'Rice Selection',
        required: true,
        max_select: 1,
        options: [
          { name: 'Fluffy White Rice & Seasoned Black Beans', price_add: 0 },
          { name: 'Moros y Cristianos (Traditional Black Bean Rice / Congrí)', price_add: 0.50 },
        ]
      },
      {
        group_name: 'Plantain Accompaniment',
        required: true,
        max_select: 1,
        options: [
          { name: 'Crisp Green Plantain Tostones', price_add: 0 },
          { name: 'Sweet Caramelised Maduros', price_add: 0 },
          { name: 'Steamed Cassava Yuca with Garlic Mojo', price_add: 1.00 },
        ]
      }
    ]
  },
  {
    id: 'cuban-5',
    name: 'Vaca Frita (Crispy Pan-Fried Shredded Beef)',
    description: 'Tender braised flank steak shredded and pan-seared till crispy with sweet sauteed white onions, roasted garlic, aromatic oregano, and fresh lime juice splash.',
    price: 15.50,
    category: 'Traditional Mains',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: false,
    calories: 760,
    prep_time_minutes: 15,
    tags: ['Crispy & Juicy'],
    customizations: [
      {
        group_name: 'Platter Sides',
        required: true,
        max_select: 1,
        options: [
          { name: 'Congrí Rice, Yuca with Mojo & Lime', price_add: 0 },
          { name: 'Steamed Rice, Stewed Black Beans & Tostones', price_add: 0 },
        ]
      }
    ]
  },
  {
    id: 'cuban-6',
    name: 'Lechón Asado (Slow-Roasted Country Pork)',
    description: 'Succulent pork leg marinated for 24 hours in Seville sour orange, wild garlic, bay leaves and cumin, slow roasted to juicy perfection with blistered crispy skin.',
    price: 14.50,
    category: 'Traditional Mains',
    image_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: true,
    calories: 820,
    prep_time_minutes: 14,
    tags: ['Chef Special'],
    customizations: [
      {
        group_name: 'Platter Sides',
        required: true,
        max_select: 1,
        options: [
          { name: 'Congrí Rice & Sweet Fried Maduros', price_add: 0 },
          { name: 'Steamed Rice, Garlic Cassava Yuca & Black Beans', price_add: 0 },
        ]
      }
    ]
  },
  {
    id: 'cuban-7',
    name: 'Stuffed Green Tostones (4 pcs)',
    description: 'Crispy fried green plantain cups freshly pressed and double-fried, stuffed with rich beef ropa vieja and pulled lechón pork, finished with melted cheese and fresh coriander.',
    price: 7.95,
    category: 'Street Food & Sides',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: true,
    calories: 410,
    prep_time_minutes: 8,
    tags: ['Sharing', 'Bestseller'],
    customizations: []
  },
  {
    id: 'cuban-8',
    name: 'Steamed Cassava Yuca with Garlic Mojo',
    description: 'Buttery soft boiled cassava root drizzled with sizzling criollo mojo made from crushed garlic, sweet red onions and Seville sour orange.',
    price: 6.50,
    category: 'Street Food & Sides',
    image_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: false,
    calories: 320,
    prep_time_minutes: 6,
    tags: ['Vegetarian', 'Gluten Free'],
    customizations: []
  },
  {
    id: 'cuban-9',
    name: 'Sweet Fried Plantains (Maduros)',
    description: 'Ripe plantain slices pan-fried until deeply golden with caramelised brown edges. Naturally sweet, soft and utterly addictive.',
    price: 5.25,
    category: 'Street Food & Sides',
    image_url: 'https://images.unsplash.com/photo-1639024471287-035186f55b1c?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: false,
    calories: 280,
    prep_time_minutes: 5,
    tags: ['Vegetarian', 'Gluten Free'],
    customizations: []
  },
  {
    id: 'cuban-10',
    name: 'Handmade Artisan Cuban Croquettes (6 pcs)',
    description: 'Velvety bechamel croquettes loaded with cured serrano ham and seasoned shredded chicken, rolled in fine breadcrumbs and fried golden crisp.',
    price: 6.95,
    category: 'Street Food & Sides',
    image_url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: false,
    calories: 390,
    prep_time_minutes: 8,
    tags: ['Sharing'],
    customizations: []
  },
  {
    id: 'cuban-11',
    name: 'Traditional Havana Mojito Cocktail',
    description: 'The definitive Cuban classic: aged white rum, fresh garden spearmint muddled with raw demerara cane sugar, fresh lime juice, and chilled sparkling soda over crushed ice.',
    price: 7.95,
    category: 'Cocktails & Tropical Drinks',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: true,
    calories: 160,
    prep_time_minutes: 4,
    tags: ['Classic Cocktail', 'Bestseller'],
    customizations: [
      {
        group_name: 'Cocktail Preference',
        required: true,
        max_select: 1,
        options: [
          { name: 'Classic Havana Club Rum Mojito', price_add: 0 },
          { name: 'Virgin Mojito (Non-Alcoholic Mocktail)', price_add: -2.00 },
          { name: 'Wild Strawberry Mojito', price_add: 0.50 },
          { name: 'Tropical Passion Fruit Mojito', price_add: 0.50 },
        ]
      }
    ]
  },
  {
    id: 'cuban-12',
    name: 'Son Caney Piña Colada',
    description: 'Velvety blend of sweet ripe Caribbean pineapple juice, velvety coconut cream and aged white rum, garnished with toasted coconut flakes and fresh pineapple slice.',
    price: 8.25,
    category: 'Cocktails & Tropical Drinks',
    image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: false,
    calories: 290,
    prep_time_minutes: 4,
    tags: ['Tropical Cocktail'],
    customizations: []
  },
  {
    id: 'cuban-13',
    name: "Abuela's Classic Caramel Flan",
    description: "Cuba's beloved silky custard dessert, slowly baked with condensed milk and whole free-range eggs, drenched in a deep golden toasted caramel glaze.",
    price: 5.50,
    category: 'Artisan Desserts',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: true,
    calories: 340,
    prep_time_minutes: 3,
    tags: ['House Favourite'],
    customizations: []
  },
  {
    id: 'cuban-14',
    name: 'Caribbean Tres Leches Cake',
    description: 'Light sponge cake soaked in a decadent three-milk infusion of sweet condensed milk, evaporated milk, and heavy cream. Topped with torched vanilla meringue and cinnamon dust.',
    price: 5.95,
    category: 'Artisan Desserts',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    is_available: true,
    is_featured: false,
    calories: 420,
    prep_time_minutes: 3,
    tags: ['Delicious'],
    customizations: []
  }
];

// LocalStorage helpers for Orders
const ORDERS_STORAGE_KEY = 'soncaney_orders';

export const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const saveOrder = (order) => {
  try {
    const existing = getStoredOrders();
    const updated = [order, ...existing];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return order;
  } catch (e) {
    console.error('Failed to save order to localStorage:', e);
    return order;
  }
};

export const getOrderById = (id) => {
  const orders = getStoredOrders();
  return orders.find(o => o.id === id || o.order_number === id);
};
