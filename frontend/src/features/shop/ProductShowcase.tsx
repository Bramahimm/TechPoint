import { useEffect, useState } from "react";
import { getFeaturedProducts } from "@/services/productServices";
import type { Product } from "@/services/productServices";
import { FaStar } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";

export default function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getFeaturedProducts().then(setProducts);
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="md:px-40 px-4">
        <h2 className="text-2xl font-bold mb-6">Produk Unggulan</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative group bg-white shadow-md rounded-xl overflow-hidden cursor-pointer 
                  transition-all duration-300 ease-in-out 
                  hover:shadow-lg hover:-translate-y-1">
              {/* Konten Produk */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-blue-600 font-bold mt-1">
                  {formatCurrency(product.price)}
                </p>
                <div className="flex items-center mt-2 text-yellow-400 text-sm">
                  {/* Pastikan Anda sudah mengimpor FaStar */}
                  <FaStar /> <span className="ml-1">{product.rating}</span>
                </div>
              </div>

              {/* Footer "Produk Serupa" yang Muncul Saat Hover */}
              <div
                className="absolute bottom-0 left-0 w-full bg-blue-500 text-white 
                    text-center text-sm font-bold p-2 
                    transform translate-y-full 
                    group-hover:translate-y-0 
                    transition-transform duration-300 ease-in-out">
                Produk Serupa
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
