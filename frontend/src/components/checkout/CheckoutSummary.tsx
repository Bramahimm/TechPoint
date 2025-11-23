// src/components/checkout/CheckoutSummary.tsx
import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";

interface SummaryProps {
  subtotalItems: number;
  totalDiscount: number;
  shippingCost: number;
  finalTotal: number;
  isStockValid: boolean;
}

const CheckoutSummary: React.FC<SummaryProps> = ({
  subtotalItems,
  totalDiscount,
  shippingCost,
  finalTotal,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 mb-4">
      Ringkasan Pembayaran
    </h2>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Total Harga Barang</span>
        <span className="font-medium">{formatCurrency(subtotalItems)}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">Total Diskon Barang</span>
        <span className="font-medium text-red-500">
          - {formatCurrency(totalDiscount)}
        </span>
      </div>

      <div className="flex justify-between border-b pb-2">
        <span className="text-gray-600">Biaya Pengiriman</span>
        <span className="font-medium">{formatCurrency(shippingCost)}</span>
      </div>

      <div className="flex justify-between pt-2">
        <span className="text-lg font-bold">Total Akhir</span>
        <span className="text-xl font-bold text-orange-600">
          {formatCurrency(finalTotal)}
        </span>
      </div>
    </div>
  </div>
);

export default CheckoutSummary;
