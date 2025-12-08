// src/hooks/checkout/useCheckoutComputation.ts

import { useMemo } from "react";
import type { CheckoutItem } from "@/types/checkout";

interface ComputationProps {
  cartItems: CheckoutItem[];
  selectedKecamatan: string;
}

const BASE_SHIPPING = 15000;
const SHIPPING_RATE = 5000; // Biaya per 10 items

export const useCheckoutComputation = ({
  cartItems,
  selectedKecamatan,
}: ComputationProps) => {
  const { subtotal, discountTotal, isStockValid } = useMemo(() => {
    let subtotal = 0;
    let discountTotal = 0;
    let isStockValid = true; // Asumsi validasi stok sederhana

    // Asumsi harga di item sudah harga bersih (setelah diskon)
    cartItems.forEach((item) => {
      subtotal += item.harga * item.quantity;
      // Di sini bisa ditambahkan logika hitung discountTotal jika diperlukan
      // discountTotal += (item.original_price - item.harga) * item.quantity;

      // Validasi Stok Sederhana: Asumsi stok > 0
      if (item.quantity <= 0) {
        isStockValid = false;
      }
    });

    return { subtotal, discountTotal, isStockValid };
  }, [cartItems]);

  const shippingCost = useMemo(() => {
    if (!selectedKecamatan) return 0;
    // Logika perhitungan biaya kirim (contoh sederhana)
    const totalWeight = cartItems.length; // Hitung berdasarkan jumlah item
    const rate = Math.ceil(totalWeight / 10);
    return BASE_SHIPPING + rate * SHIPPING_RATE;
  }, [selectedKecamatan, cartItems]);

  const finalTotal = subtotal + shippingCost - discountTotal;

  return {
    subtotal,
    discountTotal,
    shippingCost,
    finalTotal,
    processedItems: cartItems, // Menggunakan cartItems sebagai processedItems
    isStockValid,
  };
};
