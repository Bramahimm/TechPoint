// src/features/user/OrderPage.tsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import api from "@/services/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "react-hot-toast";

interface OrderSummary {
  id: string;
  invoice_number: string;
  payment_status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "PROCESSING";
  total: number;
  created_at: string;
  product_preview: string;
  total_items: number;
}

const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PAID":
        return { text: "PAID", color: "text-green-600", bg: "bg-green-100" };
      case "PENDING":
        return {
          text: "MENUNGGU BAYAR",
          color: "text-yellow-600",
          bg: "bg-yellow-100",
        };
      case "EXPIRED":
      case "FAILED":
        return { text: "BATAL/GAGAL", color: "text-red-600", bg: "bg-red-100" };
      case "PROCESSING":
        return { text: "DIPROSES", color: "text-blue-600", bg: "bg-blue-100" };
      default:
        return { text: status, color: "text-gray-600", bg: "bg-gray-200" };
    }
  };

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ data: OrderSummary[] }>("/orders");
      setOrders(response.data.data);
    } catch (error) {
      toast.error("Gagal memuat riwayat pesanan.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const renderOrderCard = (order: OrderSummary) => {
    const status = getStatusStyle(order.payment_status);

    return (
      <div
        key={order.id}
        className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-800">
              #{order.invoice_number}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.color} ${status.bg}`}>
              {status.text}
            </span>
          </div>
          <span className="text-sm text-gray-500">{order.created_at}</span>
        </div>

        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <p className="text-gray-700">
              {order.product_preview}{" "}
              {order.total_items > 3
                ? `dan ${order.total_items - 3} produk lainnya`
                : ""}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {order.total_items} jenis item
            </p>
          </div>
          <div className="text-right ml-4">
            <p className="text-base font-bold text-orange-600">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t text-right">
          <button
            onClick={() => navigate(`/orders/${order.invoice_number}`)} // ❗ Asumsi Anda akan membuat halaman detail order
            className="text-orange-500 hover:text-orange-600 font-medium text-sm transition">
            Lihat Detail &gt;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20 md:pb-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Riwayat Pesanan Saya
      </h1>

      {isLoading ? (
        <div className="text-center py-10">Memuat riwayat...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <p className="text-lg text-gray-600">Anda belum memiliki pesanan.</p>
        </div>
      ) : (
        <div className="space-y-4">{orders.map(renderOrderCard)}</div>
      )}
    </div>
  );
};

export default OrderPage;
