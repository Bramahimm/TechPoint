// src/features/seller/Products/ProductCard.tsx
import React from "react";
import type { Product } from "@/types/product";
import { Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/utils/formatCurrency"; // Asumsi util sudah ada

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const firstImage =
    product.images[0] || "https://via.placeholder.com/150/EEEEEE?text=No+Image";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <img
        src={firstImage}
        alt={product.name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-xl font-bold text-orange-600 mb-2">
          {formatCurrency(product.price)}
        </p>

        <div className="text-sm text-gray-500 space-y-0.5 mt-auto">
          <p>
            Stok:{" "}
            <span className="font-medium text-gray-700">{product.stock}</span>
          </p>
          <p>
            Kategori:{" "}
            <span className="font-medium text-gray-700">
              {product.category}
            </span>
          </p>
          <p>
            Status:{" "}
            <span
              className={`font-medium ${
                product.status === "active" ? "text-green-500" : "text-red-500"
              }`}>
              {product.status}
            </span>
          </p>
        </div>
      </div>

      {/* Aksi */}
      <div className="flex border-t">
        <Link
          to={`/seller/products/edit/${product.id}`}
          className="flex-1 flex justify-center items-center py-2 text-blue-600 hover:bg-blue-50 transition">
          <Edit className="w-4 h-4 mr-1" /> Edit
        </Link>
        <button
          onClick={() => onDelete(product.id)}
          className="flex-1 flex justify-center items-center py-2 text-red-600 hover:bg-red-50 transition border-l">
          <Trash2 className="w-4 h-4 mr-1" /> Hapus
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
