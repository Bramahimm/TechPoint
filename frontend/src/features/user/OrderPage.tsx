// frontend/src/features/user/OrderPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import api from "@/services/api";


interface DetailTransaksi {
  id: string;
  barang_id: string;
  jumlah: number;
  harga_satuan: number;
  nama_barang_snapshot: string;
}

interface Transaksi {
  id: string;
  invoice_number: string;
  total_harga: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  created_at: string;
  toko: {
    nama_toko: string;
  };
  details: DetailTransaksi[];
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/transaksi")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
        alert("Gagal memuat pesanan");
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      paid: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: "Menunggu Pembayaran",
      paid: "Sudah Dibayar",
      shipped: "Dikirim",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center">
          <p>Memuat pesanan...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 max-w-5xl mx-auto w-full p-6">
        <h1 className="text-3xl font-bold mb-8">Riwayat Pesanan Saya</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <p className="text-gray-600 text-lg mb-6">
              Kamu belum pernah berbelanja.
            </p>
            {/* GANTI INI SESUAI ROUTE KAMU */}
            <Link
              to="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-xl transform hover:scale-105 transition"
            >
              Yuk Belanja Sekarang
            </Link>

          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">No. Invoice</p>
                    <p className="font-semibold text-lg">{order.invoice_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Tanggal</p>
                    <p>{new Date(order.created_at).toLocaleDateString("id-ID")}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Toko</p>
                      <p className="font-medium text-lg">
                        {order.toko?.nama_toko || "Toko Tidak Diketahui"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Belanja</p>
                      <p className="text-3xl font-bold text-green-600">
                        Rp {Number(order.total_harga).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="font-medium mb-3">{order.details.length} barang</p>
                    <div className="space-y-3">
                      {order.details.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.nama_barang_snapshot} × {item.jumlah}</span>
                          <span className="font-medium">
                            Rp {(item.harga_satuan * item.jumlah).toLocaleString("id-ID")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}