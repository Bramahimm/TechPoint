// src/types/seller.ts

export interface SellerDashboardStats {
  total_produk: number;
  pesanan_baru: number;
  diproses: number;
  dikirim: number;
  selesai?: number;
  dibatalkan?: number;
}
