// src/features/shop/ProductShowcase.tsx

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import type { Product } from "@/types/product";
import { FaStar } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import { Link } from "react-router-dom";

const KATEGORI_LIST = [
  "semua",
  "Laptop",
  "Smartphone",
  "Kamera",
  "Aksesoris",
] as const;

export default function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");

  const fetchProducts = async (kategori: string) => {
    setLoading(true);
    try {
      const params = kategori !== "semua" ? { kategori } : {};
      const data: any = await getProducts(params);
      setProducts(data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  if (loading) return <div className="py-12 text-center">Memuat produk...</div>;
  if (error)
    return <div className="py-12 text-center text-red-500">{error}</div>;

  return (
    <section className="py-12 bg-gray-50">
      <div className="md:px-40 px-4">
        <h2 className="text-2xl font-bold mb-6">Produk Unggulan</h2>

        {/* Tab Horizontal Kategori */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {KATEGORI_LIST.map((kat) => (
            <button
              key={kat}
              onClick={() => setSelectedCategory(kat)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === kat
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}>
              {kat === "semua" ? "Semua Produk" : kat}
            </button>
          ))}
        </div>

        {/* Grid Produk */}
        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Belum ada produk di kategori ini.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map((product) => (
              <Link
                to={`/product/${product.slug}`}
                key={product.id}
                className="relative group bg-white shadow-md rounded-xl overflow-hidden cursor-pointer 
                  transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <img
                  src={product.gambar_url || "https://via.placeholder.com/150"}
                  alt={product.nama}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 line-clamp-2">
                    {product.nama}
                  </h3>
                  <p className="text-blue-600 font-bold mt-1">
                    {formatCurrency(product.harga)}
                  </p>
                  <div className="flex items-center mt-2 text-yellow-400 text-sm">
                    <FaStar /> <span className="ml-1">4.5</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    Oleh: {product.toko?.nama_toko || "Toko"}
                  </p>
                </div>

                <div
                  className="absolute bottom-0 left-0 w-full bg-blue-500 text-white text-center text-sm font-bold p-2 
                  transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  Lihat Detail
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
