// src/features/shop/ProductShowcase.tsx

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService"; 
import type { Product } from "@/types/product";
import { FaStar } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import { Link } from "react-router-dom";

export default function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Gagal memuat produk. Silakan coba lagi.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Tampilkan Loading State
  if (loading) {
    return (
      <section className="py-12 text-center">
        <p className="text-gray-600">Memuat produk...</p>
      </section>
    );
  }

  // Tampilkan Error State
  if (error) {
    return (
      <section className="py-12 text-center">
        <p className="text-red-500 font-semibold">{error}</p>
      </section>
    );
  }

  // Tampilkan Not Found State
  if (products.length === 0) {
    return (
      <section className="py-12 text-center">
        <p className="text-gray-500">
          Belum ada produk yang tersedia saat ini.
        </p>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="md:px-40 px-4">
        <h2 className="text-2xl font-bold mb-6">Produk Unggulan</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <Link
              to={`/product/${product.slug}`}
              key={product.id}
              className="relative group bg-white shadow-md rounded-xl overflow-hidden cursor-pointer 
                                transition-all duration-300 ease-in-out 
                                hover:shadow-lg hover:-translate-y-1">
              <img
                src={product.gambar_url || "https://via.placeholder.com/150"}
                alt={product.nama}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{product.nama}</h3>
                <p className="text-blue-600 font-bold mt-1">
                  {formatCurrency(product.harga)}
                </p>
                <div className="flex items-center mt-2 text-yellow-400 text-sm">
                  <FaStar /> <span className="ml-1">4.5</span>
                  {/* Dummy rating */}
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {/* Menambahkan informasi Toko dari relasi */}
                  Oleh: {product.toko.nama_toko}
                </p>
              </div>

              {/* Footer Lihat Detail */}
              <div
                className="absolute bottom-0 left-0 w-full bg-blue-500 text-white 
                                    text-center text-sm font-bold p-2 
                                    transform translate-y-full 
                                    group-hover:translate-y-0 
                                    transition-transform duration-300 ease-in-out">
                Lihat Detail
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
