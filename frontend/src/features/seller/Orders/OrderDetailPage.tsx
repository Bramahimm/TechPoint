// src/features/seller/Orders/OrderDetailPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderDetail,
  updateOrderStatus,
} from "@/services/sellerOrderService";
import type { SellerOrder } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { ChevronLeft, CheckCircle, Truck } from "lucide-react";

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<SellerOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getOrderDetail(id);
        setOrder(data);
      } catch (error: any) {
        alert("Pesanan tidak ditemukan");
        navigate("/seller/orders");
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [id, navigate]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order || isUpdating) return;
    if (!window.confirm(`Ubah status menjadi ${getDisplayStatus(newStatus)}?`))
      return;

    setIsUpdating(true);
    try {
      await updateOrderStatus(id!, newStatus);
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      alert("Status berhasil diubah!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengubah status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getDisplayStatus = (status: string): string => {
    const map: Record<string, string> = {
      pending: "Menunggu Konfirmasi",
      paid: "Diproses",
      shipped: "Dikirim",
      completed: "Selesai",
    };
    return map[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-600",
      paid: "bg-blue-600",
      shipped: "bg-indigo-600",
      completed: "bg-green-600",
    };
    return colors[status] || "bg-gray-500";
  };

  const getNextStatus = (current: string): string | null => {
    if (current === "pending") return "paid";
    if (current === "paid") return "shipped";
    if (current === "shipped") return "completed";
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-32 text-2xl text-red-600 font-bold">
        Pesanan tidak ditemukan
      </div>
    );
  }

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => navigate("/seller/orders")}
        className="flex items-center gap-2 text-orange-600 hover:underline mb-8 text-lg font-medium"
      >
        <ChevronLeft className="w-5 h-5" />
        Kembali ke Daftar Pesanan
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-10 py-8 border-b">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Invoice: {order.invoice_number}
          </h1>
        </div>

        <div className="p-10">
          <div className="flex justify-between items-center mb-12 pb-8 border-b">
            <div className="flex items-center gap-6">
              <div
                className={`w-7 h-7 rounded-full ${getStatusColor(
                  order.status
                )}`}
              />
              <div>
                <p className="text-xl text-gray-600 font-medium">
                  Status Saat Ini
                </p>
                <span
                  className={`inline-block mt-3 px-8 py-4 rounded-2xl text-white font-bold text-xl ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getDisplayStatus(order.status)}
                </span>
              </div>
            </div>

            {nextStatus && (
              <button
                onClick={() => handleStatusUpdate(nextStatus)}
                disabled={isUpdating}
                className="flex items-center gap-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-12 py-6 rounded-2xl font-bold text-xl transition transform hover:scale-105 shadow-xl"
              >
                {nextStatus === "shipped" ? (
                  <Truck className="w-8 h-8" />
                ) : (
                  <CheckCircle className="w-8 h-8" />
                )}
                <span>
                  {isUpdating
                    ? "Memperbarui..."
                    : `Ubah ke ${getDisplayStatus(nextStatus)}`}
                </span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <p className="text-gray-600 font-semibold text-lg mb-3">
                Pelanggan
              </p>
              <p className="text-3xl font-bold">{order.customer_name}</p>
              <p className="text-gray-500 mt-2">
                {new Date(order.created_at).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold text-lg mb-3">
                Alamat Pengiriman
              </p>
              <p className="text-xl text-gray-800">
                {order.shipping_address || "-"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-600 font-semibold text-lg mb-3">
                Total Pembayaran
              </p>
              <p className="text-4xl font-extrabold text-orange-600">
                {formatCurrency(order.total_amount)}
              </p>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-12">
            <h3 className="text-2xl font-bold mb-10">Item Pesanan</h3>
            <div className="space-y-8">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-8 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <h4 className="text-2xl font-semibold text-gray-800">
                      {item.product_name}
                    </h4>
                    <p className="text-lg text-gray-600 mt-2">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
