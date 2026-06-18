"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  product_id: string;
  variant_id: string | null;
  product_name: string;
  variant_label: string | null;
  unit_price: number;
  quantity: number;
  image_url: string | null;
  category: string | null;
  bg?: string;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem("cart");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && Array.isArray(parsed.items)) {
            setItems(parsed.items.map((item: CartItem) => ({ ...item, variant_id: item.variant_id ?? null, variant_label: item.variant_label ?? null })));
          }
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage", error);
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("cart", JSON.stringify({ items }));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, "quantity">, quantityToAdd = 1) => {
    const normalizedItem = { ...newItem, variant_id: newItem.variant_id ?? null, variant_label: newItem.variant_label ?? null };

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product_id === normalizedItem.product_id &&
          (item.variant_id ?? null) === normalizedItem.variant_id
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantityToAdd,
        };
        return updated;
      }

      return [...prevItems, { ...normalizedItem, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (productId: string, variantId: string | null) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product_id === productId && (item.variant_id ?? null) === (variantId ?? null))
      )
    );
  };

  const updateQuantity = (productId: string, variantId: string | null, delta: number) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.product_id === productId && (item.variant_id ?? null) === (variantId ?? null)) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: Math.max(1, nextQty) };
          }
          return item;
        })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.length;
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
