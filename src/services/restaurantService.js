import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { initialCategories, initialMenuItems, getStoredOrders, saveOrder, getOrderById } from '@/data/mockData';

export const restaurantService = {
  // 1. GET CATEGORIES
  async getCategories() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          const active = data.filter((c) => c.is_active !== false);
          return active.length > 0 ? active : data;
        }
      } catch (err) {
        console.warn('[restaurantService] Supabase getCategories notice:', err);
      }
    }
    return initialCategories;
  },

  // 2. GET MENU ITEMS
  async getMenuItems() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          const available = data.filter((item) => item.is_available !== false);
          return available.length > 0 ? available : data;
        }
      } catch (err) {
        console.warn('[restaurantService] Supabase getMenuItems notice:', err);
      }
    }
    return initialMenuItems;
  },

  // 3. GET MENU ITEM BY ID
  async getMenuItemById(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        // Fallback below
      }
    }
    return initialMenuItems.find((i) => i.id === id || i.id === `cuban-${id}`) || null;
  },

  // 4. CREAR UN NUEVO PEDIDO
  async createOrder(orderPayload) {
    let createdOrder = { ...orderPayload };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert([orderPayload])
          .select()
          .single();

        if (!error && data) {
          createdOrder = data;
        } else {
          console.error('Supabase create order error:', error);
        }
      } catch (err) {
        console.error('Supabase exception placing order:', err);
      }
    }

    // Siempre guardamos copia local en el navegador
    saveOrder(createdOrder);
    return createdOrder;
  },

  // 5. OBTENER PEDIDOS DE INVITADO (SÓLO LOS REALIZADOS EN ESTE DISPOSITIVO)
  async getGuestOrders() {
    return getStoredOrders();
  },

  // Obtener pedidos de forma segura (para invitados devuelve sólo los suyos)
  async getOrders() {
    return getStoredOrders();
  },

  // 6. OBTENER PEDIDOS DE UN USUARIO ESPECÍFICO POR EMAIL
  async getUserOrders(email) {
    if (!email) {
      return getStoredOrders();
    }

    const cleanEmail = email.trim().toLowerCase();
    let supabaseOrders = [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .ilike('customer_email', cleanEmail)
          .order('created_at', { ascending: false });

        if (!error && data) {
          supabaseOrders = data;
        } else if (error) {
          console.warn('Supabase getUserOrders error:', error);
        }
      } catch (err) {
        console.warn('Supabase getUserOrders exception:', err);
      }
    }

    // Combinar con órdenes en localStorage que tengan ese mismo email
    const localOrders = getStoredOrders().filter((o) => {
      return o.customer_email && o.customer_email.toLowerCase() === cleanEmail;
    });

    // Unir sin duplicados (priorizando el ID o número de orden)
    const orderMap = new Map();
    supabaseOrders.forEach((o) => orderMap.set(o.id || o.order_number, o));
    localOrders.forEach((o) => {
      const key = o.id || o.order_number;
      if (!orderMap.has(key)) {
        orderMap.set(key, o);
      }
    });

    const combined = Array.from(orderMap.values());
    // Ordenar de más reciente a más antiguo
    return combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  },

  // 7. OBTENER PEDIDO POR ID O NUMERO DE ORDEN
  async getOrder(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .or(`id.eq.${id},order_number.eq.${id}`)
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase get order error, checking local fallback:', err);
      }
    }
    return getOrderById(id);
  },

  // 8. BUSCAR PEDIDO POR NUMERO O EMAIL
  async searchOrders(query) {
    if (!query) return [];
    const q = query.trim();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .or(`order_number.ilike.%${q}%,customer_email.ilike.%${q}%,customer_name.ilike.%${q}%`)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase searchOrders error:', err);
      }
    }

    // Local fallback
    const all = getStoredOrders();
    return all.filter((o) =>
      o.order_number?.toLowerCase().includes(q.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(q.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(q.toLowerCase())
    );
  },

  // 9. ACTUALIZAR ESTADO DEL PEDIDO (STATUS)
  async updateOrderStatus(orderId, newStatus) {
    let updatedOrder = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .or(`id.eq.${orderId},order_number.eq.${orderId}`)
          .select()
          .maybeSingle();

        if (!error && data) {
          updatedOrder = data;
        } else if (error) {
          console.warn('Supabase updateOrderStatus error:', error);
        }
      } catch (err) {
        console.warn('Supabase updateOrderStatus exception:', err);
      }
    }

    // Always sync with localStorage
    const localOrders = getStoredOrders();
    const idx = localOrders.findIndex((o) => o.id === orderId || o.order_number === orderId);
    if (idx !== -1) {
      localOrders[idx].status = newStatus;
      if (updatedOrder) {
        localOrders[idx] = { ...localOrders[idx], ...updatedOrder };
      }
      localStorage.setItem('soncaney_orders', JSON.stringify(localOrders));
      return { data: localOrders[idx], error: null };
    }

    if (updatedOrder) {
      saveOrder(updatedOrder);
      return { data: updatedOrder, error: null };
    }

    return { data: null, error: new Error('Order not found') };
  },

  // 10. SUSCRIPCIÓN EN TIEMPO REAL (WEBSOCKETS)
  subscribeToOrderUpdates(orderId, onUpdate) {
    if (!isSupabaseConfigured || !supabase) {
      return () => {};
    }

    const channel = supabase
      .channel(`order-live-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.new) {
            onUpdate(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
