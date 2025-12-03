import { useEffect, useState } from "react";
import AdminPageWrapper from "./AdminPageWrapper";
import api from "@/services/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/orders")
      .then(res => setOrders(res.data.data || res.data))
      .catch(() => console.error("Gagal load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminPageWrapper title="Orders"><p className="text-center py-10">Loading orders...</p></AdminPageWrapper>;

  return (
    <AdminPageWrapper title="Manage Orders">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pembeli</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((o: any) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">#{o.id}</td>
                <td className="px-6 py-4">{o.user?.nama || o.pembeli?.nama || "-"}</td>
                <td className="px-6 py-4">Rp {(o.total_harga || o.total || 0).toLocaleString("id-ID")}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    o.status === "completed" || o.status === "success" ? "bg-green-100 text-green-800" :
                    o.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    o.status === "cancelled" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {o.status || "unknown"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(o.created_at || o.tanggal).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPageWrapper>
  );
}