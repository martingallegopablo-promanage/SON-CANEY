import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = useCallback((item) => {
    setItems(prev => {
      const key = `${item.menu_item_id}-${JSON.stringify(item.customizations || [])}`;
      const existing = prev.find(i => `${i.menu_item_id}-${JSON.stringify(i.customizations || [])}` === key);
      if (existing) {
        return prev.map(i =>
          `${i.menu_item_id}-${JSON.stringify(i.customizations || [])}` === key
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, { ...item, cartId: Date.now().toString() }];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((cartId) => {
    setItems(prev => prev.filter(i => i.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.cartId !== cartId));
      return;
    }
    setItems(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      itemCount, subtotal, tax, total,
      isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
