// src/features/shop/OrderStatusPage.tsx

import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, XCircle, ChevronLeft } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import api from "@/services/api"; // Asumsi Axios instance Anda

interface OrderDetail {
  invoice_number: string;
  payment_status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "PROCESSING";
  financial_summary: {
    grand_total: number;
  };
  items: Array<{ name: string; quantity: number }>;
}

const OrderStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Midtrans biasanya mengirim order_id melalui URL finish/error/pending
  const urlParams = new URLSearchParams(location.search);
  const midtransStatus = urlParams.get("status"); // success, error, or pending

  // Kita anggap invoice number dilewatkan melalui state atau params
  const invoiceNumber = location.state?.invoiceNumber || "INV-0000";

  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getIconAndColor = (status: string) => {
    switch (status) {
      case "PAID":
      case "success":
        return {
          Icon: CheckCircle,
          color: "text-green-500",
          title: "Pembayaran Berhasil",
        };
      case "PENDING":
      case "pending":
        return {
          Icon: Clock,
          color: "text-yellow-500",
          title: "Menunggu Pembayaran",
        };
      case "FAILED":
      case "error":
      case "EXPIRED":
        return {
          Icon: XCircle,
          color: "text-red-500",
          title: "Pembayaran Gagal/Kadaluarsa",
        };
      default:
        return {
          Icon: Clock,
          color: "text-gray-500",
          title: "Status Tidak Diketahui",
        };
    }
  };

  const fetchOrderDetail = async () => {
    if (!invoiceNumber || invoiceNumber === "INV-0000") {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Panggil API baru yang kita buat di backend
      const response = await api.get(`/orders/${invoiceNumber}`);
      setOrderDetail(response.data.data);
    } catch (error) {
      console.error("Gagal memuat detail order:", error);
      setOrderDetail(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Ambil detail status yang sebenarnya dari backend, bukan hanya dari URL Midtrans
    fetchOrderDetail();
  }, [invoiceNumber]);

  const { Icon, color, title } = getIconAndColor(
    orderDetail?.payment_status || midtransStatus || "PENDING"
  );

  if (isLoading) {
    return <div className="text-center py-20">Memuat detail pesanan...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 md:p-8 bg-white shadow-xl rounded-lg my-10">
      <div className="text-center mb-6">
        <Icon className={`w-16 h-16 mx-auto ${color}`} />
        <h1 className={`text-3xl font-bold mt-4 ${color}`}>{title}</h1>
        <p className="text-gray-600 mt-2">
          No. Invoice:{" "}
          <span className="font-mono font-semibold">{invoiceNumber}</span>
        </p>
      </div>

      {orderDetail ? (
        <>
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-3">Rincian Pembayaran</h2>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Bayar:</span>
              <span className="text-orange-600">
                {formatCurrency(orderDetail.financial_summary.grand_total)}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3 border-t pt-4">
              Detail Item
            </h2>
            {orderDetail.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm py-1 border-b last:border-b-0">
                <span>{item.name}</span>
                <span className="text-gray-600">x{item.quantity}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center p-5 bg-gray-50 rounded">
          <p className="text-red-500">
            Gagal memuat detail pesanan. Data di backend tidak ditemukan.
          </p>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center justify-center mx-auto text-blue-600 hover:text-blue-800 transition">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Lihat Riwayat Pesanan
        </button>
      </div>
    </div>
  );
};

export default OrderStatusPage;
