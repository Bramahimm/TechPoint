// src/features/seller/Products/components/ProductImageUpload.tsx

import React from "react";

interface ProductImageUploadProps {
  isEdit: boolean;
  previewUrl: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  isEdit,
  previewUrl,
  handleFileChange,
  errors,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Gambar Produk <span className="text-red-500">*</span> (JPG/PNG/WEBP, max
        2MB)
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
        // name 'gambar' dipakai di FormData, tidak perlu di sini
        required={!isEdit}
      />
      {errors.gambar && <p className="text-red-500 text-sm">{errors.gambar}</p>}

      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Pratinjau Gambar:</p>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-64 h-64 object-cover rounded-lg border border-gray-200 shadow"
          />
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
