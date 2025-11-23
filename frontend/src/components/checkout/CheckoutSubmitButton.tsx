// src/components/checkout/CheckoutSubmitButton.tsx
import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";

interface SubmitButtonProps {
  finalTotal: number;
  isPaymentValid: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const CheckoutSubmitButton: React.FC<SubmitButtonProps> = ({
  finalTotal,
  isPaymentValid,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <button
      onClick={onSubmit}
      disabled={!isPaymentValid || isSubmitting}
      className={`w-full py-4 mt-6 text-white font-extrabold text-lg rounded-xl transition-colors shadow-lg
                ${
                  isPaymentValid && !isSubmitting
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}>
      {isSubmitting
        ? "Memproses Pesanan..."
        : `Buat Pesanan (${formatCurrency(finalTotal)})`}
    </button>
  );
};

export default CheckoutSubmitButton;
