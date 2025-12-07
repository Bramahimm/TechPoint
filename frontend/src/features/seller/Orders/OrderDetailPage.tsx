// src/features/seller/Orders/OrderDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderDetail,
  updateOrderStatus,
} from "@/services/sellerOrderService";
import type { SellerOrder, OrderStatus } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { ChevronLeft, CheckCircle, Truck, RefreshCw } from "lucide-react";

const ORDER_STATUSES: OrderStatus[] = [
  "Menunggu Konfirmasi",
  "Diproses",
  "Dikirim",
  "Selesai",
];

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<SellerOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrder = async () => {
    setIsLoading(true);
    try {
      // TODO: Hubungkan dengan axios: const data = await sellerOrderService.getOrderDetail(id!);
      const data = await getOrderDetail(id!);
      setOrder(data || null);
    } catch (error) {
      console.error("Gagal memuat detail pesanan:", error);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order || isUpdating) return;
    if (
      !window.confirm(
        `Ubah status pesanan ${order.invoice_number} menjadi "${newStatus}"?`
      )
    )
      return;

    setIsUpdating(true);
    try {
      // TODO: Hubungkan dengan axios: const updated = await sellerOrderService.updateOrderStatus(id!, newStatus);
      const updated = await updateOrderStatus(id!, newStatus);
      setOrder(updated);
      alert(`Status pesanan berhasil diubah menjadi ${newStatus}`);
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
      alert("Gagal memperbarui status pesanan.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Menunggu Konfirmasi":
        return "bg-yellow-500";
      case "Diproses":
        return "bg-blue-500";
      case "Dikirim":
        return "bg-indigo-500";
      case "Selesai":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat Detail Pesanan...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10 text-red-500">
        Pesanan tidak ditemukan.
      </div>
    );
  }

  const currentStatusIndex = ORDER_STATUSES.indexOf(order.status);
  const nextStatus = ORDER_STATUSES[currentStatusIndex + 1];

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/seller/orders")}
        className="flex items-center text-orange-600 hover:underline mb-4">
        <ChevronLeft className="w-5 h-5 mr-1" /> Kembali ke Daftar Pesanan
      </button>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-4">
          Invoice: {order.invoice_number}
        </h2>

        {/* Status dan Aksi */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <span
              className={`h-3 w-3 rounded-full ${getStatusColor(
                order.status
              )}`}></span>
            <p className="text-lg font-semibold text-gray-700">
              Status Saat Ini:{" "}
              <span
                className={`${getStatusColor(
                  order.status
                )} text-white px-3 py-1 rounded-full text-sm`}>
                {order.status}
              </span>
            </p>
          </div>

          {nextStatus && (
            <button
              onClick={() => handleStatusUpdate(nextStatus)}
              disabled={isUpdating || order.status === "Selesai"}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400">
              {nextStatus === "Dikirim" ? (
                <Truck className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span>
                {isUpdating ? "Memperbarui..." : `Ubah ke ${nextStatus}`}
              </span>
            </button>
          )}
        </div>

        {/* Detail Pesanan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Pelanggan */}
          <div>
            <h3 className="text-md font-bold text-gray-800 mb-2">Pelanggan</h3>
            <p className="text-sm text-gray-600">Nama: {order.customer_name}</p>
            <p className="text-sm text-gray-600">
              Tanggal: {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Kolom Alamat */}
          <div className="md:col-span-1">
            <h3 className="text-md font-bold text-gray-800 mb-2">
              Alamat Pengiriman
            </h3>
            <p className="text-sm text-gray-600">{order.shipping_address}</p>
          </div>

          {/* Kolom Finansial */}
          <div>
            <h3 className="text-md font-bold text-gray-800 mb-2">
              Total Pembayaran
            </h3>
            <p className="text-xl font-extrabold text-orange-600">
              {formatCurrency(order.total_amount)}
            </p>
          </div>
        </div>

        {/* Detail Item */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Item Pesanan</h3>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-gray-700">{item.product_name}</span>
              <span className="text-sm text-gray-500">
                {item.quantity} x {formatCurrency(item.price)}
              </span>
              <span className="font-semibold">
                {formatCurrency(item.quantity * item.price)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
