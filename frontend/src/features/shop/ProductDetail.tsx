// src/features/shop/ProductDetail.tsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "@/services/productService";
import { addProductToCart } from "@/services/cartService";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import SuccessToast from "@/components/common/SuccessToast";
import { toast } from "react-hot-toast";
import ReviewSection from "./components/ReviewSection";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);

      try {
        const fetchedProduct = await getProductBySlug(slug as string);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Gagal memuat detail produk:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);

    try {
      await addProductToCart(product.id, 1);
      setShowSuccessToast(true);
    } catch (error: any) {
      console.error("Gagal menambahkan ke keranjang:", error);
      toast.error(
        error?.response?.data?.message ||
          "Gagal menambahkan ke keranjang. Harap login."
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Memuat...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-red-500">
        Produk tidak ditemukan.
      </div>
    );
  }

  const primaryImage =
    product.gambar_url ||
    "https://via.placeholder.com/400/EEEEEE?text=No+Image";

  const storeName = product.toko?.nama_toko || "Toko Tidak Dikenal";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {showSuccessToast && (
        <SuccessToast
          message="Produk berhasil ditambahkan ke keranjang belanja"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gambar Produk */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img
            src={primaryImage}
            alt={product.nama}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Detail Produk */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.nama}</h1>

          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(product.harga)}
          </p>

          <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
            <span className="font-semibold text-gray-700">
              Toko: {storeName}
            </span>
            <button className="text-blue-500 hover:underline text-sm">
              Lihat Toko
            </button>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Stok: {product.stok}</span>
            <span>
              Kategori: {product.kategori?.nama || "Tidak dikategorikan"}
            </span>
          </div>

          {/* Tombol Aksi */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stok === 0}
              className={`flex-1 text-white py-3 rounded-lg font-bold transition flex items-center justify-center ${
                isAddingToCart
                  ? "bg-gray-400"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isAddingToCart ? "Memproses..." : "Masukkan Keranjang"}
            </button>

            <button className="flex-1 border border-orange-500 text-orange-500 py-3 rounded-lg font-bold hover:bg-orange-50 transition flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 mr-2" /> Beli Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Deskripsi */}
      <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Deskripsi Produk</h2>
        <pre className="text-gray-700 whitespace-pre-wrap font-sans">
          {product.deskripsi || "Tidak ada deskripsi tambahan."}
        </pre>
      </div>

      {/* ✅ 2. INTEGRASI BAGIAN ULASAN DI SINI */}
      <ReviewSection productId={product.id} />
      
    </div>
  );
};

export default ProductDetail;
