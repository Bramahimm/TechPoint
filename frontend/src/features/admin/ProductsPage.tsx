import { useEffect, useState } from "react";
import AdminPageWrapper from "./AdminPageWrapper";
import api from "@/services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/admin/products");
        // Pastikan ambil data yang benar (bisa data.data atau data langsung)
        setProducts(res.data?.data || res.data || []);
      } catch (err: any) {
        console.error("Error loading products:", err);
        setError("Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <AdminPageWrapper title="Products">
        <div className="text-center py-10 text-gray-600">Loading produk...</div>
      </AdminPageWrapper>
    );
  }

  if (error) {
    return (
      <AdminPageWrapper title="Products">
        <div className="text-center py-10 text-red-600 font-medium">{error}</div>
      </AdminPageWrapper>
    );
  }

  if (products.length === 0) {
    return (
      <AdminPageWrapper title="Products">
        <div className="text-center py-10 text-gray-500">Belum ada produk</div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper title="Manage Products">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Produk</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Toko</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-700">#{p.id.slice(-6)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                    {p.nama || p.nama_barang || "Tanpa Nama"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Rp {(p.harga || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{p.stok || 0}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {p.toko?.nama_toko || p.user?.nama || "Unknown"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        p.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {p.status || "unknown"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageWrapper>
  );
}