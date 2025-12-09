// src/components/payment/MidtransStatusHandler.tsx

import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const MidtransStatusHandler: React.FC = () => {
  const navigate = useNavigate();
  // Ambil nomor invoice dari path /order/status/INV-XXXXX
  const { invoiceNumber } = useParams<{ invoiceNumber: string }>();
  // Ambil status dari query string ?status=success
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const transactionStatus = searchParams.get("transaction_status"); // Midtrans sering menggunakan ini

  useEffect(() => {
    let toastMessage: string;

    // Cek status dari query parameter
    if (
      status === "success" ||
      transactionStatus === "capture" ||
      transactionStatus === "settlement"
    ) {
      toastMessage = `✅ Pembayaran untuk pesanan #${invoiceNumber} berhasil dikonfirmasi!`;
      toast.success(toastMessage);
    } else if (status === "pending" || transactionStatus === "pending") {
      toastMessage = `⌛ Pesanan #${invoiceNumber} menunggu pembayaran. Cek detail instruksi.`;
      // Gunakan toast biasa karena status masih pending
      toast(toastMessage);
    } else if (
      status === "failed" ||
      transactionStatus === "failure" ||
      transactionStatus === "expire"
    ) {
      toastMessage = `❌ Pembayaran untuk pesanan #${invoiceNumber} gagal atau kadaluarsa.`;
      toast.error(toastMessage);
    } else {
      toastMessage = "Status pembayaran tidak diketahui. Cek riwayat pesanan.";
      toast(toastMessage);
    }

    // Langsung redirect ke halaman riwayat pesanan
    // Status riwayat akan diperbarui oleh Notification Handler di Laravel
    navigate("/orders", { replace: true });
  }, [navigate, status, transactionStatus, invoiceNumber]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <p className="text-lg font-medium text-gray-700">
        Memproses status pembayaran... Mohon tunggu sebentar.
      </p>
    </div>
  );
};

export default MidtransStatusHandler;
