// src/hooks/checkout/useCheckoutComputation.ts
import { useMemo } from "react";
import type { CartItem } from "@/types/cart";
import { calculateDiscount } from "@/utils/calculateDiscount";
import { BANDAR_LAMPUNG_SHIPPING } from "@/utils/constants";

// --- Interfaces & Types ---

export interface CheckoutItem extends CartItem {
  subtotal: number;
  originalSubtotal: number;
  discountAmount: number;
  stock: number; 
  isOutOfStock: boolean;
}

export interface ComputationResult {
  processedItems: CheckoutItem[];
  subtotal: number; 
  discountTotal: number; 
  shippingCost: number;
  finalTotal: number; 
  originalSubtotal: number; 
  isStockValid: boolean;
}

interface ComputationProps {
  cartItems: CartItem[];
  selectedKecamatan: string | null;
}

// --- Hook Utama ---

export const useCheckoutComputation = ({
  cartItems,
  selectedKecamatan,
}: ComputationProps): ComputationResult => {
  const result = useMemo(() => {
    if (!cartItems || cartItems.length === 0) {
      return {
        processedItems: [],
        subtotal: 0,
        discountTotal: 0,
        shippingCost: 0,
        finalTotal: 0,
        originalSubtotal: 0,
        isStockValid: true,
      };
    }

    // --- 1. Hitung Ongkir ---
    const shippingRate =
      BANDAR_LAMPUNG_SHIPPING.find(
        (rate) => rate.kecamatan === selectedKecamatan
      )?.rate || 0; // Ongkir 0 jika kecamatan belum dipilih/tidak ditemukan

    // --- 2. Proses Item, Diskon, dan Stok ---
    let overallStockValid = true;
    const processedItems: CheckoutItem[] = cartItems.map((item) => {
      // Dummy Stock (Asumsi API akan memberikan data stok)
      const itemStock = 10; // Contoh: semua item memiliki stok 10
      const isOutOfStock = item.quantity > itemStock;
      if (isOutOfStock) overallStockValid = false;

      // Hitung Diskon per item
      const { priceAfterDiscount, discountAmount } = calculateDiscount(item);

      const subtotal = priceAfterDiscount * item.quantity;
      const originalSubtotal =
        (item.original_price || item.price) * item.quantity;

      return {
        ...item,
        price: priceAfterDiscount, // Ganti harga item dengan harga setelah diskon
        subtotal,
        originalSubtotal,
        discountAmount: discountAmount * item.quantity,
        stock: itemStock,
        isOutOfStock,
      };
    });

    // --- 3. Hitung Total Global ---
    const subtotal = processedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    const originalSubtotal = processedItems.reduce(
      (sum, item) => sum + item.originalSubtotal,
      0
    );
    const discountTotal = processedItems.reduce(
      (sum, item) => sum + item.discountAmount,
      0
    );

    const finalTotal = subtotal + shippingRate;

    return {
      processedItems,
      subtotal,
      discountTotal,
      shippingCost: shippingRate,
      finalTotal,
      originalSubtotal,
      isStockValid: overallStockValid,
    };
  }, [cartItems, selectedKecamatan]);

  return result;
};
