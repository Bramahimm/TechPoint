// src/features/seller/Products/components/ProductBasicInfo.tsx

import React from "react";
import type { ProductFormData } from "@/types/product";

interface Category {
  id: string;
  nama: string;
}

interface ProductBasicInfoProps {
  formData: ProductFormData; // Menggunakan interface yang sudah direvisi
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  errors: { [key: string]: string };
  categories: Category[];
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  formData,
  handleChange,
  errors,
  categories,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Produk <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama" 
            value={formData.nama}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
          {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            name="kategori_id" 
            value={formData.kategori_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Harga (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="harga" 
            value={formData.harga}
            onChange={handleChange}
            min="1000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          {errors.harga && (
            <p className="text-red-500 text-sm">{errors.harga}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stok <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stok" 
            value={formData.stok}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          {errors.stok && <p className="text-red-500 text-sm">{errors.stok}</p>}
        </div>
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi Produk
        </label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none"
          placeholder="Jelaskan produk Anda secara detail..."
        />
      </div>
    </>
  );
};

export default ProductBasicInfo;
