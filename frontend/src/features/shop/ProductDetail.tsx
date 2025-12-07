// src/features/shop/ProductDetail.tsx (Buat file baru ini di features/shop)
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "@/services/productService";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { MessageCircle, ShoppingCart } from "lucide-react";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then(setProduct)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <div className="text-center py-10">Memuat...</div>;
  if (!product)
    return (
      <div className="text-center py-10 text-red-500">
        Produk tidak ditemukan
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gambar Produk */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img
            src={product.imageUrl || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Detail Produk */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(product.price)}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Stok: {product.stock}</span>
            <span>
              Kategori: {product.category_id || "Tidak dikategorikan"}
            </span>
          </div>
          <p className="text-gray-700">{product.description}</p>

          {/* Tombol Aksi */}
          <div className="flex space-x-4">
            <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 mr-2" /> Beli Sekarang
            </button>
            <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition flex items-center justify-center">
              <MessageCircle className="w-5 h-5 mr-2" /> Chat Penjual
            </button>
          </div>
        </div>
      </div>

      {/* Deskripsi Tambahan atau Review (Dummy) */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Deskripsi Produk</h2>
        <p className="text-gray-600">
          {product.description || "Tidak ada deskripsi tambahan."}
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;
