// src/components/checkout/CheckoutSubmitButton.tsx

import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { ShoppingBag } from "lucide-react";

interface CheckoutSubmitButtonProps {
  finalTotal: number;
  isPaymentValid: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const CheckoutSubmitButton: React.FC<CheckoutSubmitButtonProps> = ({
  finalTotal,
  isPaymentValid,
  isSubmitting,
  onSubmit,
}) => {
  const isDisabled = !isPaymentValid || isSubmitting || finalTotal <= 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-4 sticky bottom-0 md:static">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-600">Total Pembayaran</span>
        <span className="text-xl font-bold text-orange-600">
          {formatCurrency(finalTotal)}
        </span>
      </div>

      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className={`w-full py-3 rounded-lg flex items-center justify-center font-bold text-lg transition-colors 
          ${
            isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}>
        <ShoppingBag className="w-5 h-5 mr-2" />
        {isSubmitting ? "Memproses Pesanan..." : "Buat Pesanan"}
      </button>

      {!isPaymentValid && !isSubmitting && (
        <p className="text-xs text-red-500 mt-2 text-center">
          Harap lengkapi alamat dan metode pembayaran.
        </p>
      )}
    </div>
  );
};

export default CheckoutSubmitButton;
