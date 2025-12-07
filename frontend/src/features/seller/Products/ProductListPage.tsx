// src/features/seller/Products/ProductListPage.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import ProductCard from "./ProductCard";
import { getSellerProducts, deleteProduct } from "@/services/productService";
import type { Product } from "@/types/product";
import { toast } from "react-hot-toast";

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSellerProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id: string) => {
    const productToDelete = products.find((p) => p.id === id);
    if (!productToDelete) return;

    if (
      !window.confirm(`Yakin ingin menghapus produk "${productToDelete.nama}"?`)
    )
      return;

    const loadingToast = toast.loading(
      `Menghapus produk ${productToDelete.nama}...`
    );

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Produk berhasil dihapus!", { id: loadingToast });
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
      toast.error("Gagal menghapus produk. Coba lagi.", { id: loadingToast });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat Daftar Produk...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Produk Saya ({products.length})
        </h2>
        <Link
          to="/seller/products/add"
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Produk Baru</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Belum ada produk terdaftar. Mulai jual dengan menambahkan produk baru!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
