// src/hooks/checkout/useCheckoutCalculation.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import type { CartItem } from "@/types/cart";
import { fetchCartItems } from "@/services/cartService"; // Mengambil data cart

// --- Interfaces & Types ---

// Item yang sudah diproses untuk tampilan checkout
export interface CheckoutItem extends CartItem {
  subtotal: number;
  originalSubtotal: number;
  discountAmount: number;
}

// Hasil perhitungan
export interface CalculationResult {
  subtotalItems: number;
  totalDiscount: number;
  shippingCost: number;
  finalTotal: number;
  checkoutItems: CheckoutItem[];
  isLoading: boolean;
}

// --- Hook Utama ---

const SHIPPING_COST = 15000; // Contoh Biaya Kirim tetap

export const useCheckoutCalculation = (): CalculationResult => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Data Cart
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data: CartItem[] = await fetchCartItems();
      setCartItems(data);
    } catch (error) {
      console.error("Gagal memuat item checkout:", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // 2. Perhitungan dan Pemrosesan Item
  const result = useMemo(() => {
    const processedItems: CheckoutItem[] = cartItems.map((item) => {
      const subtotal = item.price * item.quantity;
      const originalSubtotal =
        (item.original_price || item.price) * item.quantity;
      const discountAmount = originalSubtotal - subtotal;

      return {
        ...item,
        subtotal,
        originalSubtotal,
        discountAmount,
      };
    });

    const subtotalItems = processedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    const totalDiscount = processedItems.reduce(
      (sum, item) => sum + item.discountAmount,
      0
    );

    // Final Total = (Total Harga Barang - Diskon) + Biaya Kirim
    const finalTotal = subtotalItems + SHIPPING_COST; // Subtotal sudah harga diskon

    return {
      subtotalItems,
      totalDiscount,
      shippingCost: SHIPPING_COST,
      finalTotal,
      checkoutItems: processedItems,
      isLoading,
    };
  }, [cartItems, isLoading]);

  return result;
};
