// src/features/seller/Dashboard/SellerDashboardPage.tsx

import React, { useState, useEffect } from "react";
import StoreStatsCard from "./StoreStatsCard";
import { Package, Clock, Truck, TrendingUp } from "lucide-react";
import { getSellerDashboardStats } from "@/services/sellerDashboardService";

interface DashboardStats {
  total_products: number;
  total_orders?: number;
  // tambahin field lain kalau mau
}

const SellerDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_products: 0,
    total_orders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSellerDashboardStats();
        console.log("Data sukses diterima:", data);

        setStats({
          total_products: data.total_products ?? 0,
          total_orders: data.total_orders ?? 0,
        });
      } catch (err: any) {
        console.error("Error:", err);
        setError("Gagal memuat data dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return <div className="p-10 text-center">Memuat dashboard...</div>;

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard Toko</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StoreStatsCard
          title="Total Produk"
          value={stats.total_products ?? 0} // tambah ?? 0
          icon={Package}
          bgColor="bg-indigo-500"
        />
        <StoreStatsCard
          title="Total Pesanan"
          value={stats.total_orders ?? 0}
          icon={TrendingUp}
          bgColor="bg-orange-500"
        />
        <StoreStatsCard
          title="Menunggu Diproses"
          value={0} // langsung kasih angka
          icon={Clock}
          bgColor="bg-yellow-500"
        />
        <StoreStatsCard
          title="Sedang Dikirim"
          value={0}
          icon={Truck}
          bgColor="bg-green-500"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-100 rounded-lg text-red-700 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default SellerDashboardPage;
