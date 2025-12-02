import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  // State untuk menampung data dari Laravel
  const [stats, setStats] = useState({
    total_users: 0,
    total_orders: 0,
    total_products: 0,
  });

  useEffect(() => {
    // Panggil API Laravel
    const fetchStats = async () => {
      try {
        
        const response = await axios.get(
          "http://127.0.0.1:8000/api/admin/dashboard"
        );
        setStats(response.data.data); // Simpan data ke state
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Users</h2>
          {/* Tampilkan data dari State */}
          <p className="text-2xl font-bold">{stats.total_users}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Orders</h2>
          <p className="text-2xl font-bold">{stats.total_orders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Products</h2>
          <p className="text-2xl font-bold">{stats.total_products}</p>
        </div>
      </div>
    </div>
  );
}
