// src/components/cart/CartItemCard.tsx
import React from "react";
import type { CartItemState } from "@/types/cart";
import { Trash2, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency"; 
import { updateCartItemQuantity, removeCartItem } from "@/services/cartService"; // Import dari service

interface CartItemCardProps {
  item: CartItemState;
  onCheckboxChange: (id: number, isChecked: boolean) => void;
  onUpdateQuantity: (id: number, newQty: number) => void;
  onRemoveItem: (id: number) => void;
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

    // Memanggil API melalui CartService
    try {
      await updateCartItemQuantity(item.id, safeQty);
      // Update state lokal setelah sukses
      onUpdateQuantity(item.id, safeQty);
    } catch (error) {
      console.error("Gagal mengubah kuantitas:", error);
      // Menggunakan util untuk menangani error bisa diterapkan di sini
    }
  };

  const handleRemove = async () => {
    if (
      !window.confirm(`Yakin ingin menghapus ${item.name} dari keranjang?`) ||
      isProcessing
    )
      return;

    // Memanggil API melalui CartService
    try {
      await removeCartItem(item.id);
      // Update state lokal setelah sukses
      onRemoveItem(item.id);
    } catch (error) {
      console.error("Gagal menghapus item:", error);
    }
  };

  const discountAmount = item.original_price
    ? item.original_price - item.price
    : 0;
  const hasDiscount = discountAmount > 0;
  const displayDiscountPercent =
    item.discount_percent ||
    (hasDiscount
      ? Math.round((discountAmount / item.original_price!) * 100)
      : 0);

  return (
    <div className="flex flex-col md:flex-row p-4 border border-gray-200 rounded-lg shadow-sm bg-white gap-4">
      {/* Kolom Kiri: Checkbox, Gambar, Detail Produk */}
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
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded flex-shrink-0"
          />

          <div className="flex flex-col min-w-0">
            {/* Nama Produk */}
            <h3 className="text-base font-semibold line-clamp-2">
              {item.name}
            </h3>

            {/* Varian */}
            {item.variant && (
              <p className="text-sm text-gray-500 mt-1">
                Varian: {item.variant}
              </p>
            )}

            {/* Produk Serupa Dropdown (Dummy) */}
            <div className="flex items-center text-sm text-blue-600 mt-2 cursor-pointer hover:underline">
              Produk Serupa <ChevronDown className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Harga, Kuantitas, Aksi */}
      <div className="flex items-center justify-between md:justify-end md:gap-8 w-full md:w-auto mt-2 md:mt-0">
        {/* Harga */}
        <div className="flex flex-col items-end text-right min-w-[100px]">
          {hasDiscount && (
            <p className="text-xs text-gray-500 line-through">
              {formatCurrency(item.original_price!)}
            </p>
          )}
          <p className="text-base font-bold text-orange-600">
            {formatCurrency(item.price)}
          </p>
          {hasDiscount && (
            <span className="text-xs text-red-500 bg-red-100 px-1 rounded">
              {displayDiscountPercent}%
            </span>
          )}
        </div>

        {/* Quantity Controls */}
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

        {/* Tombol Hapus */}
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
