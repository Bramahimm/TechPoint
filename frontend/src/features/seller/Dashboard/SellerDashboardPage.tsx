// src/features/seller/Dashboard/SellerDashboardPage.tsx
import React, { useState, useEffect } from "react";
import StoreStatsCard from "./StoreStatsCard";
import { Package, Clock, Truck, TrendingUp } from "lucide-react";
import { getProducts } from "@/services/productService";
import { getSellerOrders } from "@/services/sellerOrderService";
import type { Product, SellerOrder } from "@/types/product";

const SellerDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // TODO: Hubungkan dengan axios
      const loadedProducts = await getProducts();
      const loadedOrders = await getSellerOrders();
      setProducts(loadedProducts);
      setOrders(loadedOrders);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const countOrders = (status: string) =>
    orders.filter((o) => o.status === status).length;

  const stats = [
    {
      title: "Total Produk",
      value: products.length,
      icon: Package,
      bgColor: "bg-indigo-500",
    },
    {
      title: "Pesanan Baru",
      value: countOrders("Menunggu Konfirmasi"),
      icon: TrendingUp,
      bgColor: "bg-orange-500",
    },
    {
      title: "Menunggu Diproses",
      value: countOrders("Diproses"),
      icon: Clock,
      bgColor: "bg-yellow-500",
    },
    {
      title: "Sedang Dikirim",
      value: countOrders("Dikirim"),
      icon: Truck,
      bgColor: "bg-green-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">Memuat Dashboard...</div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard Toko</h2>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StoreStatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Aktivitas Terkini (Dummy) */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Aktivitas Toko Terkini
        </h3>
        <p className="text-gray-500">Tidak ada notifikasi penting saat ini.</p>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
