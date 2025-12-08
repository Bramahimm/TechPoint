import { useEffect, useState } from "react";
import AdminPageWrapper from "./AdminPageWrapper";
import api from "@/services/api";

interface Product {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  toko: {
    nama_toko: string;
  } | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fungsi hapus produk
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Yakin ingin menghapus produk ini? Tindakan ini tidak bisa dibatalkan.");
    if (!confirmed) return;

    try {
      await api.delete(`/admin/products/${id}`);

      // Hapus dari state agar UI langsung update
      setProducts((prev) => prev.filter((p) => p.id !== id));

      alert("Produk berhasil dihapus!");
    } catch (err: any) {
      console.error("Error deleting product:", err);
      alert(
        "Gagal menghapus produk: " +
          (err.response?.data?.message || err.message || "Terjadi kesalahan")
      );
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/admin/products");
        const items = res.data?.data?.data || res.data?.data || res.data || [];
        setProducts(items);
      } catch (err: any) {
        console.error("Error loading products:", err);
        setError("Gagal memuat produk: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <AdminPageWrapper title="Products">
        <div className="text-center py-16 text-gray-600">Loading produk...</div>
      </AdminPageWrapper>
    );
  }

  if (error) {
    return (
      <AdminPageWrapper title="Products">
        <div className="text-center py-16 text-red-600 font-medium">{error}</div>
      </AdminPageWrapper>
    );
  }

  if (products.length === 0) {
    return (
      <AdminPageWrapper title="Products">
        <div className="text-center py-16 text-gray-500 text-lg">
          Belum ada produk
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper title="Manage Products">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama Produk
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Toko
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    #{p.id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                    {p.nama}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Rp {Number(p.harga).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{p.stok}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {p.toko?.nama_toko || "Tanpa Toko"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:text-red-900 font-medium text-sm transition-colors duration-200 hover:underline"
                    >
                      Hapus
                    </button>
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