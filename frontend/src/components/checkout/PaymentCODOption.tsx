// src/components/checkout/PaymentCODOption.tsx
import React from "react";

const PaymentCODOption: React.FC = () => (
  <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-yellow-50">
    <p className="font-semibold text-sm mb-1 text-yellow-800">
      Detail Cash On Delivery (COD)
    </p>
    <p className="text-sm text-yellow-700">
      Bayar tunai kepada kurir saat barang sampai di alamat Anda. Pastikan total
      tagihan sudah disiapkan.
    </p>
  </div>
);

export default PaymentCODOption;
