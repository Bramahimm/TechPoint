// src/features/seller/Orders/OrderListPage.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSellerOrders } from "@/services/sellerOrderService";
import type { SellerOrder } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { ChevronRight } from "lucide-react";

const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getSellerOrders();
        setOrders(data || []);
      } catch (error) {
        console.error("Gagal memuat pesanan:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Konversi status backend → teks Indo + warna
  const getStatusDisplay = (status: string) => {
    const map: Record<string, { text: string; color: string }> = {
      pending: {
        text: "Menunggu Konfirmasi",
        color: "bg-yellow-100 text-yellow-800",
      },
      paid: { text: "Diproses", color: "bg-blue-100 text-blue-800" },
      shipped: { text: "Dikirim", color: "bg-indigo-100 text-indigo-800" },
      completed: { text: "Selesai", color: "bg-green-100 text-green-800" },
    };
    return map[status] || { text: status, color: "bg-gray-100 text-gray-800" };
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 border-b pb-4">
        Pesanan Masuk ({orders.length})
      </h2>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {orders.length === 0 ? (
          <div className="p-16 text-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-6" />
            <p className="text-xl text-gray-500">Belum ada pesanan masuk</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const statusInfo = getStatusDisplay(order.status);

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-800">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/seller/orders/${order.id}`}
                        className="text-orange-600 hover:text-orange-800 font-medium flex items-center justify-end gap-1"
                      >
                        Detail <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;
