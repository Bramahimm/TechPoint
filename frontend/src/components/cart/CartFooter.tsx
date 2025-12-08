import React from "react";
import { formatCurrency } from "@/utils/formatCurrency"; // Import dari utils

interface CartFooterProps {
  selectedCount: number;
  subtotal: number;
  totalBeforeDiscount: number;
  onCheckout: () => void;
  isProcessing: boolean;
}

const CartFooter: React.FC<CartFooterProps> = ({
  selectedCount,
  subtotal,
  totalBeforeDiscount,
  onCheckout,
  isProcessing,
}) => {
  const discountTotal = totalBeforeDiscount - subtotal;
  const isReadyToCheckout = selectedCount > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-xl md:static md:border-none md:shadow-none md:mt-4">
      <div className="hidden md:flex flex-col p-4 border border-gray-200 rounded-lg bg-white shadow-sm space-y-2">
        <div className="flex justify-between items-center text-blue-600 font-semibold cursor-pointer">
          <span>🎁 Voucher TechPoint</span>
          <span>Pilih &gt;</span>
        </div>
        <div className="flex justify-between items-center text-blue-600 font-semibold cursor-pointer">
          <span>🚚 Pilihan Layanan Pengiriman</span>
          <span>Pilih &gt;</span>
        </div>
      </div>

      {/* Panel Total & Checkout */}
      <div className="flex items-center justify-between p-4 md:p-0">
        {/* Info Total (Mobile & Desktop) */}
        <div className="flex flex-col text-sm md:flex-row md:items-center md:gap-4">
          <p className="text-gray-700">Total Harga ({selectedCount} produk):</p>
          <p className="text-lg font-bold text-orange-600">
            {formatCurrency(subtotal)}
          </p>
        </div>

        {/* Tombol Checkout */}
        <button
          onClick={onCheckout}
          className={`px-6 py-3 text-white font-bold rounded-lg transition-colors 
            ${
              isReadyToCheckout
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          disabled={!isReadyToCheckout || isProcessing}
        >
          Checkout ({selectedCount})
        </button>
      </div>
    </div>
  );
};

export default CartFooter;
