import api from "@/services/api";
import type { CartItem } from "@/types/cart";


/**
 * @returns Promise yang resolve dengan list item CartItem.
 */
export const fetchCartItems = async (): Promise<CartItem[]> => {
  const response = await api.get<{ data: CartItem[] }>("/cart");
  // Asumsi API Laravel mengembalikan array di response.data.data
  return response.data.data;
};

/**
 * Menambahkan atau mengubah kuantitas item keranjang.
 * @param product_id ID Produk (UUID).
 * @param quantity Jumlah produk yang ingin ditambahkan/diperbarui.
 * @returns Promise yang resolve dengan item keranjang yang baru/diperbarui.
 */

export const addProductToCart = async (
  product_id: string,
  quantity: number = 1
): Promise<CartItem> => {
  const response = await api.post("/cart", { product_id, quantity });
  // Asumsi backend mengembalikan item keranjang yang baru dibuat/diperbarui di response.data.data
  return response.data.data;
};

//Mengubah kuantitas item keranjang berdasarkan cart_item_id (UUID item keranjang).
export const updateCartItemQuantity = async (
  cart_item_id: string,
  quantity: number
): Promise<CartItem> => {
  // Di backend, kita akan menggunakan PUT/PATCH untuk mengupdate item yang sudah ada.
  const response = await api.put(`/cart/${cart_item_id}`, { quantity });
  return response.data.data;
};

//Menghapus item keranjang berdasarkan cart_item_id (UUID item keranjang).
export const removeCartItem = async (cart_item_id: string): Promise<void> => {
  await api.delete(`/cart/${cart_item_id}`);
};

