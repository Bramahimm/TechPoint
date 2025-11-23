// src/utils/calculateDiscount.ts
import type { CartItem } from "@/types/cart";

// Tambahkan definisi diskon nominal ke CartItem untuk fleksibilitas
interface DiscountableItem extends CartItem {
  discount_nominal?: number; // Diskon dalam Rupiah
}

/**
 * Menghitung subtotal dan jumlah diskon untuk satu item.
 *
 * @param item Data CartItem, bisa memiliki original_price, discount_percent, atau discount_nominal.
 * @returns { priceAfterDiscount: number, discountAmount: number }
 */
export const calculateDiscount = (item: DiscountableItem) => {
  const priceBeforeDiscount = item.original_price || item.price;
  let finalPrice = priceBeforeDiscount;
  let discountAmount = 0;

  if (item.discount_nominal && item.discount_nominal > 0) {
    // 1. Diskon Nominal
    discountAmount = Math.min(item.discount_nominal, priceBeforeDiscount);
  } else if (item.discount_percent && item.discount_percent > 0) {
    // 2. Diskon Persen
    discountAmount = priceBeforeDiscount * (item.discount_percent / 100);
  }

  // 3. Jika price API sudah final (item.price != original_price)
  // Ini mengasumsikan item.price adalah harga NETT setelah diskon,
  // jika API tidak mengirimkan discount_nominal/percent.
  if (item.price !== priceBeforeDiscount && discountAmount === 0) {
    discountAmount = priceBeforeDiscount - item.price;
  }

  finalPrice = priceBeforeDiscount - discountAmount;

  // Pastikan harga final tidak negatif
  finalPrice = Math.max(0, finalPrice);

  return {
    priceAfterDiscount: finalPrice,
    discountAmount: discountAmount,
  };
};
