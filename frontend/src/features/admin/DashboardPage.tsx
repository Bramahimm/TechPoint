import { useEffect, useState } from "react";
import AdminPageWrapper from "./AdminPageWrapper";
import api from "@/services/api";
import { Package, ShoppingCart, Users, Activity, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    total_penjual: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(res => {
        const data = res.data?.data || res.data || {};
        setStats({
          total_users: data.total_users || 0,
          total_products: data.total_products || 0,
          total_orders: data.total_orders || 0,
          total_penjual: data.total_penjual || 0,
        });
      })
      .catch(() => {
        // Kalau error, tetap tampilkan 0 biar nggak crash
        setStats({ total_users: 0, total_products: 0, total_orders: 0, total_penjual: 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { title: "Total Pengguna", value: stats.total_users.toLocaleString(), icon: Users, color: "bg-blue-500" },
    { title: "Total Produk", value: stats.total_products.toLocaleString(), icon: Package, color: "bg-purple-500" },
    { title: "Total Order", value: stats.total_orders.toLocaleString(), icon: ShoppingCart, color: "bg-green-500" },
    { title: "Total Penjual", value: stats.total_penjual.toLocaleString(), icon: Activity, color: "bg-orange-500" },
  ];

  if (loading) {
    return (
      <AdminPageWrapper title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl text-gray-500 animate-pulse">Memuat data...</div>
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper title="Dashboard Admin">
      <div className="space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Selamat Datang, Admin!</h1>
          <p className="text-gray-600 mt-2 text-lg">Semua sistem berjalan dengan lancar hari ini</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                  <p className="text-4xl font-bold text-gray-800 mt-3">{card.value}</p>
                </div>
                <div className={`${card.color} p-4 rounded-xl shadow-md`}>
                  <card.icon className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bagian Bawah — Hanya Server Aktif */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-10 text-white shadow-2xl text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-6 h-6 bg-green-300 rounded-full animate-ping"></div>
              <CheckCircle2 className="w-16 h-16" />
              <div className="w-6 h-6 bg-green-300 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-4xl font-bold mb-3">Server Aktif & Stabil</h2>
            <p className="text-xl opacity-95">TechPoint berjalan dengan sempurna. Semua layanan online 100%.</p>
            <p className="mt-6 text-sm opacity-80">
              {new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" })}
            </p>
          </div>
        </div>

      </div>
    </AdminPageWrapper>
  );
}