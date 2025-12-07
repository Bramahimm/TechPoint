// src/features/seller/Products/components/ProductFormHeader.tsx

import React from "react";

interface ProductFormHeaderProps {
  isEdit: boolean;
  productName: string;
}

const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({
  isEdit,
  productName,
}) => {
  return (
    <h2 className="text-3xl font-bold text-gray-900 border-b pb-4">
      {isEdit ? `Edit Produk: ${productName}` : "Tambah Produk Baru"}
    </h2>
  );
};

export default ProductFormHeader;
