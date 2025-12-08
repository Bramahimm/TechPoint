// src/services/sellerOrderService.ts

import api from "@/services/api"; // Gunakan instance axios yang sudah di-config (withCredentials + baseURL)

export const getSellerOrders = async (): Promise<any[]> => {
  try {
    const response = await api.get("/seller/orders");
    // Pastikan selalu return array (biar frontend ga crash)
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error(
      "Gagal mengambil daftar pesanan seller:",
      error.response?.data || error.message
    );
    // Kalau 403 (belum punya toko) atau 401 (belum login), tetap return array kosong supaya UI aman
    return [];
  }
};

export const getOrderDetail = async (id: string) => {
  try {
    const response = await api.get(`/seller/orders/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(
      `Gagal mengambil detail pesanan ${id}:`,
      error.response?.data || error.message
    );
    throw error; // biar OrderDetailPage bisa tangkap error dan tampilkan "Pesanan tidak ditemukan"
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const response = await api.put(`/seller/orders/${id}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error(
      `Gagal update status pesanan ${id}:`,
      error.response?.data || error.message
    );
    throw error; // biar tombol di OrderDetailPage bisa kasih alert error
  }
};
