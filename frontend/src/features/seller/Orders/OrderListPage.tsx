// src/features/seller/Orders/OrderListPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSellerOrders } from "@/services/sellerOrderService";
import type { SellerOrder, OrderStatus } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { ChevronRight } from "lucide-react";

const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      // TODO: Hubungkan dengan axios: const data = await sellerOrderService.getSellerOrders();
      const data = await getSellerOrders();
      setOrders(data);
      setIsLoading(false);
    };
    loadOrders();
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Menunggu Konfirmasi":
        return "bg-yellow-100 text-yellow-800";
      case "Diproses":
        return "bg-blue-100 text-blue-800";
      case "Dikirim":
        return "bg-indigo-100 text-indigo-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat Daftar Pesanan...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 border-b pb-4">
        Pesanan Masuk ({orders.length})
      </h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            Tidak ada pesanan masuk.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
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
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/seller/orders/${order.id}`}
                      className="text-orange-600 hover:text-orange-800 flex justify-end items-center">
                      Detail <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;
