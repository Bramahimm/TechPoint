import React from "react";
import type { CartItemState } from "@/types/cart";
import { Trash2, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { updateCartItemQuantity, removeCartItem } from "@/services/cartService";
import { toast } from "react-hot-toast";

interface CartItemCardProps {
  item: CartItemState;
  onCheckboxChange: (id: string, isChecked: boolean) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  isProcessing: boolean;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onCheckboxChange,
  onUpdateQuantity,
  onRemoveItem,
  isProcessing,
}) => {
  const handleQuantityChange = async (newQty: number) => {
    const safeQty = Math.max(1, newQty);
    if (safeQty === item.quantity || isProcessing) return;

    const loadingToast = toast.loading("Mengubah kuantitas...");

    try {
      await updateCartItemQuantity(item.id, safeQty);
      onUpdateQuantity(item.id, safeQty);
      toast.success("Kuantitas berhasil diperbarui.", { id: loadingToast });
    } catch (error: any) {
      console.error("Gagal mengubah kuantitas:", error);
      toast.error(
        error.response?.data?.message || "Gagal mengubah kuantitas.",
        { id: loadingToast }
      );
    }
  };

  const handleRemove = async () => {
    if (
      !window.confirm(`Yakin ingin menghapus ${item.nama} dari keranjang?`) ||
      isProcessing
    )
      return;

    const loadingToast = toast.loading("Menghapus item...");

    try {
      await removeCartItem(item.id);
      onRemoveItem(item.id);
      toast.success("Item berhasil dihapus.", { id: loadingToast });
    } catch (error: any) {
      console.error("Gagal menghapus item:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus item.", {
        id: loadingToast,
      });
    }
  };

  const discountAmount = item.original_price
    ? item.original_price - item.harga
    : 0;

  const hasDiscount = discountAmount > 0;

  const displayDiscountPercent =
    item.discount_percent ||
    (hasDiscount
      ? Math.round((discountAmount / item.original_price!) * 100)
      : 0);

  return (
    <div className="flex flex-col md:flex-row p-4 border border-gray-200 rounded-lg shadow-sm bg-white gap-4">
      {/* Kolom Kiri */}
      <div className="flex items-start flex-grow">
        <input
          type="checkbox"
          checked={item.isChecked}
          onChange={(e) => onCheckboxChange(item.id, e.target.checked)}
          className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-1 mr-4 flex-shrink-0"
          disabled={isProcessing}
        />

        <div className="flex gap-4 flex-grow">
          <img
            src={item.gambar_url}
            alt={item.nama}
            className="w-16 h-16 object-cover rounded flex-shrink-0"
          />

          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-semibold line-clamp-2">
              {item.nama}
            </h3>

            {item.variant && (
              <p className="text-sm text-gray-500 mt-1">
                Varian: {item.variant}
              </p>
            )}

            <div className="flex items-center text-sm text-blue-600 mt-2 cursor-pointer hover:underline">
              Produk Serupa <ChevronDown className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan */}
      <div className="flex items-center justify-between md:justify-end md:gap-8 w-full md:w-auto mt-2 md:mt-0">
        <div className="flex flex-col items-end text-right min-w-[100px]">
          {hasDiscount && (
            <p className="text-xs text-gray-500 line-through">
              {formatCurrency(item.original_price!)}
            </p>
          )}

          <p className="text-base font-bold text-orange-600">
            {formatCurrency(item.harga)}
          </p>

          {hasDiscount && (
            <span className="text-xs text-red-500 bg-red-100 px-1 rounded">
              {displayDiscountPercent}%
            </span>
          )}
        </div>

        {/* Quantity Control */}
        <div className="flex items-center border border-gray-300 rounded-lg ml-4">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || isProcessing}
            className="p-1 w-8 h-8 flex items-center justify-center text-lg text-gray-700 disabled:opacity-50">
            -
          </button>

          <span className="p-1 w-8 h-8 flex items-center justify-center border-l border-r border-gray-300">
            {item.quantity}
          </span>

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isProcessing}
            className="p-1 w-8 h-8 flex items-center justify-center text-lg text-gray-700 disabled:opacity-50">
            +
          </button>
        </div>

        {/* Hapus */}
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 transition ml-4"
          disabled={isProcessing}>
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
