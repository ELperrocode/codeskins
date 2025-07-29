'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { getCartCount } from './api';

interface CartContextType {
  cartCount: number;
  updateCartCount: () => Promise<void>;
  incrementCartCount: (amount?: number) => void;
  decrementCartCount: (amount?: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }

    try {
      const response = await getCartCount();
      if (response.success && response.data) {
        setCartCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const incrementCartCount = (amount: number = 1) => {
    setCartCount(prev => prev + amount);
  };

  const decrementCartCount = (amount: number = 1) => {
    setCartCount(prev => Math.max(0, prev - amount));
  };

  useEffect(() => {
    updateCartCount();
  }, [user]);

  const value: CartContextType = {
    cartCount,
    updateCartCount,
    incrementCartCount,
    decrementCartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 