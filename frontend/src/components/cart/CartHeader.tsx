// src/components/cart/CartHeader.tsx
import React from "react";
import { Trash2 } from "lucide-react";

interface CartHeaderProps {
  totalItems: number;
  selectedCount: number;
  onSelectAll: (checked: boolean) => void;
  onRemoveSelected: () => void;
  onRemoveInactive: () => void;
  isProcessing: boolean;
}

const CartHeader: React.FC<CartHeaderProps> = ({
  totalItems,
  selectedCount,
  onSelectAll,
  onRemoveSelected,
  onRemoveInactive,
  isProcessing,
}) => {
  const allSelected = totalItems > 0 && selectedCount === totalItems;
  const isAnySelected = selectedCount > 0;

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm rounded-t-lg">
      <div className="flex items-center gap-4">
        {/* Pilih Semua Checkbox */}
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          disabled={totalItems === 0 || isProcessing}
        />
        <label
          className="text-base font-semibold text-gray-700 cursor-pointer"
          onClick={() => onSelectAll(!allSelected)}>
          Pilih Semua ({selectedCount}/{totalItems})
        </label>
      </div>

      <div className="flex items-center gap-4">
        {/* Hapus Produk Tidak Aktif */}
        <button
          onClick={onRemoveInactive}
          className="text-gray-500 text-sm hover:text-gray-700 hidden sm:block"
          disabled={isProcessing}>
          Hapus produk tidak aktif
        </button>

        {/* Hapus Item Terpilih */}
        <button
          onClick={onRemoveSelected}
          className={`flex items-center gap-1 text-red-500 hover:text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!isAnySelected || isProcessing}>
          <Trash2 className="w-5 h-5" />
          <span className="hidden sm:block">Hapus</span>
        </button>
      </div>
    </div>
  );
};

export default CartHeader;
