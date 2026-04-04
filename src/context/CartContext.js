import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const cartStorageKey = user ? `nexus_cart_${user._id}` : 'nexus_cart_guest';

  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(cartStorageKey)) || []; } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem(cartStorageKey)) || [];
      setCartItems(storedCart);
    } catch {
      setCartItems([]);
    }
  }, [cartStorageKey]);

  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems, cartStorageKey]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(i => i._id === product._id ? { ...i, quantity: newQty } : i);
      }
      return [...prev, { ...product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(i => i._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCartItems(prev => prev.map(i => i._id === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = cartItems.reduce((acc, i) => {
    const price = i.discount > 0 ? Math.round(i.price * (1 - i.discount / 100)) : i.price;
    return acc + price * i.quantity;
  }, 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + tax + shipping;

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, subtotal, tax, shipping, total,
      isCartOpen, setIsCartOpen,
      addToCart, removeFromCart, updateQuantity, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};