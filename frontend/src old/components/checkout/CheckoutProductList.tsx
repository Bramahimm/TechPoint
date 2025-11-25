// src/components/checkout/CheckoutProductList.tsx
import React from "react";
import type { CheckoutItem } from "@/hooks/checkout/useCheckoutCalculation";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProductListProps {
  items: CheckoutItem[];
}

const CheckoutProductList: React.FC<ProductListProps> = ({ items }) => (
  <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
    <h2 className="text-xl font-semibold text-gray-700 border-b pb-3">
      Daftar Produk ({items.length})
    </h2>
    {items.map((item) => (
      <div
        key={item.id}
        className="flex gap-4 items-center border-b last:border-b-0 py-2">
        {/* Gambar */}
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 object-cover rounded flex-shrink-0"
        />

        {/* Detail Produk */}
        <div className="flex-grow min-w-0">
          <p className="font-medium line-clamp-1">{item.name}</p>
          {item.variant && (
            <p className="text-sm text-gray-500">Varian: {item.variant}</p>
          )}
        </div>

        {/* Harga dan Qty */}
        <div className="flex flex-col items-end text-sm">
          <p className="text-gray-600">
            {item.quantity} x {formatCurrency(item.price)}
          </p>
          <p className="font-semibold text-orange-600">
            {formatCurrency(item.subtotal)}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default CheckoutProductList;
