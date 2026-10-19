import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

/**
 * DEFAULT SON CANEY AUTHENTIC CUBAN EVENTS
 * Used as immediate fallback when offline or before Supabase table migration is executed.
 */
export const DEFAULT_EVENTS = [
  {
    id: 'event-free-tapas',
    slug: 'event-free-tapas',
    title: 'Domingo Free Tapas (Sunday Free Cuban Tapas)',
    subtitle: 'Free authentic bites with any cocktail, rum, or craft beer',
    date_text: 'Every Sunday',
    time: '3:00 PM – 8:00 PM',
    badge: 'FREE ENTRY • NO TICKET REQUIRED',
    badge_variant: 'free',
    badge_color: 'bg-emerald-600 text-white',
    badge_short: 'Free Entry',
    badge_short_color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    price: 0,
    is_ticketed: false,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    description:
      'Spend your Sunday the Havana way! Order any handcrafted Cuban cocktail (Mojito, Daiquirí, Cuba Libre), cold Cuban craft beer, or rum, and our kitchen treats your table to complimentary homemade tapas: crispy artisan ham croquettes, crunchy mariquitas with criollo garlic mojo dip, and golden yuca bites.',
    highlights: [
      'Free tapas served with every round of drinks',
      'Outdoor patio & bar seating in Notting Hill',
      'Chilled Latin jazz & acoustic Son Cubano background',
      'No ticket or cover charge needed'
    ],
    cta_text: 'Walk-ins Welcome • Reserve Table',
    cta_type: 'info',
    display_order: 1,
    is_active: true
  },
  {
    id: 'event-cochinillo',
    slug: 'event-cochinillo',
    title: 'Cochinillo Asado Criollo (Whole Roast Suckling Pig Feast)',
    subtitle: '24h mojo marinated suckling pig slow-roasted over open charcoal',
    date_text: 'Every Friday & Saturday Night',
    time: '7:00 PM – 10:30 PM',
    badge: 'POPULAR • TICKETED CULINARY FEAST',
    badge_variant: 'ticketed-red',
    badge_color: 'bg-primary text-primary-foreground',
    badge_short: '£26.50 Feast',
    badge_short_color: 'bg-primary/20 text-red-300 border-primary/30',
    price: 26.50,
    is_ticketed: true,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    description:
      'The centerpiece of authentic Cuban country celebrations! Whole tender suckling pig marinated for 24 hours in our heirloom Seville sour orange, smashed garlic, cumin, and oregano criollo mojo, then slow-roasted over charcoal until the crackling is ultra-crisp and the meat falls apart with a spoon.',
    highlights: [
      'Generous portion of charcoal roasted suckling pig',
      'Includes Moros y Cristianos (seasoned black beans & rice)',
      'Steamed cassava with sizzling mojo & sweet maduros plantains',
      'Traditional homemade Cuban caramel flan dessert included'
    ],
    cta_text: 'Buy Feast Ticket (£26.50)',
    cta_type: 'ticket',
    display_order: 2,
    is_active: true
  },
  {
    id: 'event-salsa',
    slug: 'event-salsa',
    title: 'Havana Salsa & Rueda Dance Masterclass',
    subtitle: 'Authentic Cuban dance class + 2 hours Latin social dancing with cocktail',
    date_text: 'Every Thursday Evening',
    time: '7:30 PM – 10:30 PM',
    badge: 'HIGH ENERGY • TICKETED WORKSHOP',
    badge_variant: 'ticketed-blue',
    badge_color: 'bg-secondary text-white',
    badge_short: '£14.00 Class',
    badge_short_color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    price: 14.00,
    is_ticketed: true,
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    description:
      'Get your hips moving to authentic Cuban rhythms! Led by master instructor Lázaro straight from Santiago de Cuba. We kick off with a friendly 1-hour workshop covering Cuban salsa footwork and fun Rueda de Casino partner switching, followed by 2 hours of social Latin dancing.',
    highlights: [
      '1 hour structured workshop (Beginners & improvers welcome)',
      'Includes 1 complimentary Havana Club Mojito on arrival',
      '2 hours open social dancing with DJ playing Timba & Son',
      'No partner needed – meet great people!'
    ],
    cta_text: 'Buy Class Ticket (£14.00)',
    cta_type: 'ticket',
    display_order: 3,
    is_active: true
  },
  {
    id: 'event-live-music',
    slug: 'event-live-music',
    title: 'Noches de Buena Vista (Live Acoustic Son Cubano)',
    subtitle: 'Legendary Havana melodies, vintage guitars, and tropical brass',
    date_text: 'Every Wednesday Night',
    time: '8:00 PM – 11:00 PM',
    badge: 'FREE ADMISSION • LIVE MUSIC',
    badge_variant: 'free',
    badge_color: 'bg-emerald-600 text-white',
    badge_short: 'Live Music',
    badge_short_color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    price: 0,
    is_ticketed: false,
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    description:
      'Midweek Cuban soul. Live acoustic trios perform timeless classics from Buena Vista Social Club, Compay Segundo, and Benny Moré. Enjoy slow-sipped aged rums, authentic street food, and warm Havana hospitality under dim tropical lights.',
    highlights: [
      'Live 3-piece authentic Cuban acoustic band',
      'Special discounts on aged rum flights & cocktails',
      'Walk-ins strictly welcome, no cover fee',
      'Warm, intimate Cuban bar atmosphere'
    ],
    cta_text: 'Free Admission • No Ticket Needed',
    cta_type: 'info',
    display_order: 4,
    is_active: true
  }
];

/**
 * Normalizes an event row coming from Supabase or mock data
 * Guarantees that all expected properties exist in both camelCase and snake_case
 */
export function normalizeEvent(item) {
  if (!item) return null;

  const id = String(item.id || item.slug || `event-${Math.random().toString(36).substring(2, 9)}`);
  const title = item.title || 'Cuban Fiesta';
  const subtitle = item.subtitle || '';
  const description = item.description || '';
  const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;

  const isTicketed =
    typeof item.is_ticketed === 'boolean'
      ? item.is_ticketed
      : typeof item.isTicketed === 'boolean'
      ? item.isTicketed
      : price > 0;

  const dateText = item.date_text || item.day || item.dateText || 'Weekly';
  const time = item.time || '7:00 PM – 10:30 PM';
  const imageUrl =
    item.image_url ||
    item.image ||
    item.imageUrl ||
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800';

  // Parse highlights
  let highlights = [];
  if (Array.isArray(item.highlights)) {
    highlights = item.highlights;
  } else if (typeof item.highlights === 'string') {
    try {
      const parsed = JSON.parse(item.highlights);
      if (Array.isArray(parsed)) highlights = parsed;
      else highlights = [item.highlights];
    } catch {
      highlights = item.highlights.split('\n').map((s) => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
    }
  }

  // Badges & styling
  const badge = item.badge || (isTicketed ? `£${price.toFixed(2)}` : 'FREE ENTRY');
  const badgeVariant = item.badge_variant || item.badgeVariant || (isTicketed ? 'ticketed-red' : 'free');
  const badgeColor =
    item.badge_color ||
    item.badgeColor ||
    (isTicketed ? 'bg-primary text-primary-foreground' : 'bg-emerald-600 text-white');
  const badgeShort = item.badge_short || item.badgeShort || (isTicketed ? `£${price.toFixed(2)}` : 'Free Entry');
  const badgeShortColor =
    item.badge_short_color ||
    item.badgeShortColor ||
    (isTicketed ? 'bg-primary/20 text-red-300 border-primary/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30');

  const ctaText =
    item.cta_text ||
    item.ctaText ||
    (isTicketed ? `Buy Ticket (£${price.toFixed(2)})` : 'Free Walk-ins • See Details');
  const ctaType = item.cta_type || item.ctaType || (isTicketed ? 'ticket' : 'info');

  return {
    ...item,
    id,
    slug: item.slug || id,
    title,
    subtitle,
    description,
    price,
    isTicketed,
    is_ticketed: isTicketed,
    dateText,
    date_text: dateText,
    day: dateText, // backward compatibility
    time,
    imageUrl,
    image_url: imageUrl,
    image: imageUrl, // backward compatibility
    highlights,
    badge,
    badgeVariant,
    badge_variant: badgeVariant,
    badgeColor,
    badge_color: badgeColor,
    badgeShort,
    badge_short: badgeShort,
    badgeShortColor,
    badge_short_color: badgeShortColor,
    ctaText,
    cta_text: ctaText,
    ctaType,
    cta_type: ctaType,
    displayOrder: item.display_order ?? 0,
    display_order: item.display_order ?? 0,
    isActive: item.is_active ?? true,
    is_active: item.is_active ?? true,
    recurrence_days: item.recurrence_days || null,
    specific_date: item.specific_date || null
  };
}

/**
 * ROCK-SOLID PERIODICITY & DATE PARSER
 * Determines whether an event takes place on a specific calendar date (dateObj).
 * Handles:
 * - Recurring days: "Every Sunday", "Fridays & Saturdays", "Every Thursday", "Wednesdays", etc.
 * - Bilingual: English & Spanish terms ("domingo", "viernes", "sábado", "jueves", etc.)
 * - Explicit single dates: "2026-10-31", "31/10/2026", "October 31 2026"
 * - General intervals: "Daily", "Every day", "Weekends"
 * - Database recurrence arrays: event.recurrence_days = [0, 5, 6]
 */
export function isEventOnDate(event, dateObj) {
  if (!event || !dateObj) return false;

  const dayOfWeek = dateObj.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  const dayOfMonth = dateObj.getDate();
  const monthIndex = dateObj.getMonth(); // 0 to 11
  const monthNum = monthIndex + 1; // 1 to 12
  const yearNum = dateObj.getFullYear();

  // Format date as YYYY-MM-DD
  const yyyy = yearNum;
  const mm = String(monthNum).padStart(2, '0');
  const dd = String(dayOfMonth).padStart(2, '0');
  const dateStrISO = `${yyyy}-${mm}-${dd}`;

  // 1. If explicit recurrence_days array exists (e.g. [0] or [5, 6]):
  if (Array.isArray(event.recurrence_days) && event.recurrence_days.length > 0) {
    if (event.recurrence_days.includes(dayOfWeek)) return true;
  }

  // 2. If specific_date exists in database (e.g. "2026-10-31"):
  if (event.specific_date) {
    const specificStr = String(event.specific_date).slice(0, 10);
    if (specificStr === dateStrISO) return true;
  }

  // 3. Smart Parser for date_text string
  const rawText = String(event.date_text || event.day || '').toLowerCase().trim();
  if (!rawText) return false;

  // Check for specific date format YYYY-MM-DD in text:
  const isoMatch = rawText.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (isoMatch) {
    const [_, y, m, d] = isoMatch;
    if (parseInt(y, 10) === yearNum && parseInt(m, 10) === monthNum && parseInt(d, 10) === dayOfMonth) {
      return true;
    }
  }

  // Check for DD/MM/YYYY or DD-MM-YYYY in text:
  const ddmmyyyyMatch = rawText.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/);
  if (ddmmyyyyMatch) {
    const [_, d, m, y] = ddmmyyyyMatch;
    if (parseInt(y, 10) === yearNum && parseInt(m, 10) === monthNum && parseInt(d, 10) === dayOfMonth) {
      return true;
    }
  }

  // Check for "Daily" or "Every day" or "Todos los días":
  if (rawText.includes('daily') || rawText.includes('every day') || rawText.includes('todos los d')) {
    return true;
  }

  // Check for "Weekends" or "Fines de semana":
  if (rawText.includes('weekend') || rawText.includes('fin de semana') || rawText.includes('fines de semana')) {
    if (dayOfWeek === 0 || dayOfWeek === 6) return true;
  }

  // Periodicity mappings by day of week (English + Spanish)
  const dayPatterns = [
    { day: 0, keywords: ['sunday', 'domingo', 'sun', 'dom'] },
    { day: 1, keywords: ['monday', 'lunes', 'mon', 'lun'] },
    { day: 2, keywords: ['tuesday', 'martes', 'tue', 'mar'] },
    { day: 3, keywords: ['wednesday', 'miercoles', 'miércoles', 'wed', 'mie'] },
    { day: 4, keywords: ['thursday', 'jueves', 'thu', 'jue'] },
    { day: 5, keywords: ['friday', 'viernes', 'fri', 'vie'] },
    { day: 6, keywords: ['saturday', 'sabado', 'sábado', 'sat', 'sab'] },
  ];

  for (const { day, keywords } of dayPatterns) {
    if (dayOfWeek === day) {
      for (const kw of keywords) {
        // Match keyword with boundaries (e.g. "Sunday", "Sundays", "Every Sunday")
        const regex = new RegExp(`(^|[^a-z0-9])${kw}(s|es)?([^a-z0-9]|$)`, 'i');
        if (regex.test(rawText)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * EVENTS SERVICE CMS API
 */
export const eventsService = {
  /**
   * Fetches all active events from Supabase.
   * If table does not exist or connection fails, seamlessly returns normalized fallback events.
   */
  async getEvents() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          const active = data.filter((item) => item.is_active !== false);
          const normalized = (active.length > 0 ? active : data).map(normalizeEvent);
          return normalized;
        } else if (error) {
          console.warn('[eventsService] Supabase query notice:', error.message);
        }
      } catch (err) {
        console.warn('[eventsService] Exception connecting to Supabase:', err);
      }
    }

    // Try reading from cache if it has at least as many items as DEFAULT_EVENTS
    try {
      const cached = localStorage.getItem('son_caney_events_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= DEFAULT_EVENTS.length) {
          return parsed.map(normalizeEvent);
        }
      }
    } catch {
      // Continue to default
    }

    // Default fallback
    return DEFAULT_EVENTS.map(normalizeEvent);
  },

  /**
   * Fetch single event by ID or slug
   */
  async getEventById(idOrSlug) {
    const all = await this.getEvents();
    return all.find((e) => e.id === idOrSlug || e.slug === idOrSlug) || null;
  },

  /**
   * Find matching events for a specific calendar date
   */
  getEventsForDate(eventsList, dateObj) {
    if (!Array.isArray(eventsList) || !dateObj) return [];
    return eventsList.filter((event) => isEventOnDate(event, dateObj));
  },

  /**
   * Create or update an event in Supabase
   */
  async saveEvent(eventPayload) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const payload = {
      title: eventPayload.title,
      subtitle: eventPayload.subtitle || '',
      description: eventPayload.description || '',
      price: parseFloat(eventPayload.price) || 0,
      is_ticketed: Boolean(eventPayload.is_ticketed ?? eventPayload.isTicketed),
      date_text: eventPayload.date_text || eventPayload.day || '',
      time: eventPayload.time || '',
      image_url: eventPayload.image_url || eventPayload.image || '',
      badge: eventPayload.badge || '',
      badge_variant: eventPayload.badge_variant || 'free',
      badge_color: eventPayload.badge_color || '',
      badge_short: eventPayload.badge_short || '',
      badge_short_color: eventPayload.badge_short_color || '',
      highlights: Array.isArray(eventPayload.highlights) ? eventPayload.highlights : [],
      cta_text: eventPayload.cta_text || '',
      cta_type: eventPayload.cta_type || 'info',
      display_order: parseInt(eventPayload.display_order, 10) || 0,
      is_active: eventPayload.is_active ?? true,
      updated_at: new Date().toISOString()
    };

    if (eventPayload.id && !eventPayload.id.startsWith('event-')) {
      const { data, error } = await supabase
        .from('events')
        .update(payload)
        .eq('id', eventPayload.id)
        .select()
        .single();
      if (error) throw error;
      return normalizeEvent(data);
    } else {
      const { data, error } = await supabase
        .from('events')
        .insert([{ ...payload, slug: eventPayload.slug || null }])
        .select()
        .single();
      if (error) throw error;
      return normalizeEvent(data);
    }
  }
};
