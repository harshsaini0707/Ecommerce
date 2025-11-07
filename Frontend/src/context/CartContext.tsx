import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types';
import { removeFromCart as removeFromCartAPI, updateCartItem as updateCartItemAPI } from '../services/api';

interface CartContextType {
  cart: CartItem[];
  total: number;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string | number) => Promise<void>;
  updateQuantity: (productId: string | number, quantity: number) => Promise<void>;
  clearCart: () => void;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total whenever cart changes
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(parseFloat(newTotal.toFixed(2)));
  }, [cart]);

  const addToCart = async (product: Product, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update local state
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.productId === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prevCart,
          {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image || 'https://via.placeholder.com/150',
          },
        ];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string | number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call backend API
      await removeFromCartAPI(productId);
      
      // Update local state
      setCart((prevCart) => 
        prevCart.filter((item) => item.productId !== productId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Call backend API
      await updateCartItemAPI(productId, quantity);
      
      // Update local state
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart([]);
    setError(null);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      total, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      loading,
      error
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
