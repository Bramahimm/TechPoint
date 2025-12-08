// src/components/checkout/PaymentCODOption.tsx

import React from "react";
import { CheckCircle, Truck } from "lucide-react";

interface PaymentCODOptionProps {
  isSelected: boolean;
  onSelect: () => void;
}

const PaymentCODOption: React.FC<PaymentCODOptionProps> = ({
  isSelected,
  onSelect,
}) => {
  return (
    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
      <h3 className="font-semibold text-gray-700">Bayar di Tempat (COD)</h3>
      <div
        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300 hover:bg-gray-50"
        }`}
        onClick={onSelect}>
        <div className="flex items-center gap-3">
          <Truck className="w-6 h-6 text-gray-600" />
          <span className="text-sm font-medium">Cash on Delivery</span>
        </div>
        {isSelected && <CheckCircle className="w-5 h-5 text-orange-500" />}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Bayar tunai saat barang diterima oleh kurir. Tersedia di area tertentu.
      </p>
    </div>
  );
};

export default PaymentCODOption;
