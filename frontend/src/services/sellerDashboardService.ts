// src/services/sellerDashboardService.ts

import api from "@/services/api";

export const getSellerDashboardStats = async () => {
  const response = await api.get("/seller/dashboard/stats");

  // SEKARANG LANGSUNG return response.data (bukan .data.data!)
  console.log("Data dari backend:", response.data);
  return response.data; // ← INI YANG BENAR SEKARANG
};
