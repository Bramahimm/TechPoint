// src/services/cartService.ts
import type { CartItem } from "@/types/cart"; // Asumsi '@/types/cart' sudah ada dan berisi interface CartItem
import ProductMock1 from "@/assets/images/product1.webp";
import ProductMock2 from "@/assets/images/product2.webp";
import ProductMock3 from "@/assets/images/product3.webp";

// --- MOCK DATA ---
const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    product_id: 101,
    name: "Laptop Asus Vivobook 15X OLED K3500P",
    price: 9800000,
    original_price: 12500000,
    quantity: 1,
    image: ProductMock1,
    variant: "i5/16GB/OLED",
    discount_percent: 21,
  },
  {
    id: 2,
    product_id: 202,
    name: "Headset Gaming HyperX Cloud Alpha S",
    price: 1550000,
    original_price: 1750000,
    quantity: 2,
    image: ProductMock2,
    variant: "Warna Biru",
  },
  {
    id: 3,
    product_id: 303,
    name: "Mechanical Keyboard Fantech Maxfit67",
    price: 990000,
    quantity: 1,
    image: ProductMock3,
  },
];

let currentCart = [...MOCK_CART_ITEMS];

// --- FUNGSI MOCK ASYNC ---

/**
 * Mengambil semua item keranjang (Mock Async).
 * @returns Promise yang resolve dengan list item CartItem.
 */
export const fetchCartItems = async (): Promise<CartItem[]> => {
  // Simulasi delay API 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Promise.resolve(currentCart);
};

/**
 * Menghapus item keranjang berdasarkan ID (Mock Async).
 * @param id ID item yang akan dihapus.
 * @returns Promise<void>.
 */
export const removeCartItem = async (id: number): Promise<void> => {
  // Simulasi delay API 300ms
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Perbarui state mock
  const initialLength = currentCart.length;
  currentCart = currentCart.filter((item) => item.id !== id);

  if (currentCart.length === initialLength) {
    // Simulasi error jika ID tidak ditemukan
    return Promise.reject(new Error(`Item dengan ID ${id} tidak ditemukan.`));
  }

  return Promise.resolve();
};

/**
 * Mengubah kuantitas item keranjang (Mock Async).
 * Fungsi ini dibutuhkan oleh CartItemCard.tsx yang Anda buat sebelumnya.
 */
export const updateCartItemQuantity = async (
  id: number,
  quantity: number
): Promise<CartItem> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const itemIndex = currentCart.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return Promise.reject(new Error(`Item dengan ID ${id} tidak ditemukan.`));
  }

  // Update kuantitas
  currentCart[itemIndex] = { ...currentCart[itemIndex], quantity: quantity };

  return Promise.resolve(currentCart[itemIndex]);
};

// Fungsi dummy untuk menangani error (untuk menghindari error import di CartPage)
export const handleError = (error: unknown) => {
  console.error("Mock Error Handling:", error);
  // Di aplikasi nyata, ini akan menampilkan toast atau pesan error ke user.
};

// import type { CartItem } from '@/types/cart';
// import api from '@/services/api'; // Menggunakan Axios instance yang sudah ada

// // Fungsi untuk mengambil semua item keranjang user
// export const fetchCartItems = async (): Promise<CartItem[]> => {
//   const response = await api.get('/cart');
//   // Asumsi API Laravel mengembalikan data dalam response.data.data
//   return response.data.data;
// };

// // Fungsi untuk mengubah kuantitas item
// export const updateCartItemQuantity = async (id: number, quantity: number): Promise<CartItem> => {
//   const response = await api.put(`/cart/${id}`, { quantity });
//   return response.data.data; // Mengembalikan item yang diperbarui
// };

// // Fungsi untuk menghapus item
// export const removeCartItem = async (id: number): Promise<void> => {
//   await api.delete(`/cart/${id}`);
// };
