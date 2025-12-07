// src/features/seller/Products/ProductCard.tsx

import React from "react";
import type { Product } from "@/types/product";
import { Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const primaryImage =
    product.gambar_url ||
    "https://via.placeholder.com/150/EEEEEE?text=No+Image";

  const categoryName = product.kategori?.nama || "Tidak Terkategori";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full max-w-[240px]">
      <img
        src={primaryImage}
        alt={product.nama}
        className="w-full h-36 object-cover"
      />

      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-base font-semibold line-clamp-2 mb-1">
          {product.nama}
        </h3>

        <p className="text-lg font-bold text-orange-600 mb-2">
          {formatCurrency(product.harga)}
        </p>

        <div className="text-xs text-gray-500 space-y-0.5 mt-auto">
          <p>
            Stok:{" "}
            <span className="font-medium text-gray-700">{product.stok}</span>
          </p>
          <p>
            Kategori:{" "}
            <span className="font-medium text-gray-700">{categoryName}</span>
          </p>
          <p>
            Status:{" "}
            <span
              className={`font-medium ${
                product.stok > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {product.stok > 0 ? "Aktif" : "Habis"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex border-t text-sm">
        <Link
          to={`/seller/products/edit/${product.id}`}
          className="flex-1 flex justify-center items-center py-2 text-blue-600 hover:bg-blue-50 transition"
        >
          <Edit className="w-4 h-4 mr-1" /> Edit
        </Link>
        <button
          onClick={() => onDelete(product.id)}
          className="flex-1 flex justify-center items-center py-2 text-red-600 hover:bg-red-50 transition border-l"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Hapus
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
