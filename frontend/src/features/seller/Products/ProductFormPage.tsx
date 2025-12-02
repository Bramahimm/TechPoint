// src/features/seller/Products/ProductFormPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  createProduct,
  updateProduct,
} from "@/services/productService";
import type { ProductPayload } from "@/types/product";

const DUMMY_CATEGORIES = [
  "Elektronik",
  "Aksesoris",
  "Perangkat Keras",
  "Software",
];

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Ambil ID jika sedang edit
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState<ProductPayload>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    category: DUMMY_CATEGORIES[0],
    images: [],
  });
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const loadProduct = async () => {
        // TODO: Hubungkan dengan axios: const data = await productService.getProductById(id!);
        const product = await getProductById(id!);
        if (product) {
          setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description,
            category: product.category,
            images: product.images,
          });
        } else {
          alert("Produk tidak ditemukan!");
          navigate("/seller/products");
        }
        setIsLoading(false);
      };
      loadProduct();
    }
  }, [isEdit, id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" || name === "price" || name === "stock"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Implementasi logika upload/pratinjau gambar (Max 3)
    // Saat ini hanya dummy URL:
    if (e.target.files && formData.images.length < 3) {
      alert(
        `Simulasi upload ${e.target.files.length} file. Fitur upload backend akan menggunakan FormData.`
      );
      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          "https://via.placeholder.com/100/CCCCCC?text=New+Pic",
        ],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let result;
      if (isEdit) {
        // TODO: Hubungkan dengan axios: result = await productService.updateProduct(id!, formData);
        result = await updateProduct(id!, formData);
        alert("Produk berhasil diperbarui!");
      } else {
        // TODO: Hubungkan dengan axios: result = await productService.createProduct(formData);
        result = await createProduct(formData);
        alert("Produk berhasil ditambahkan!");
      }
      navigate("/seller/products");
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert(
        `Gagal menyimpan produk. Error: ${
          error instanceof Error ? error.message : "Tidak dikenal"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat data produk...
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 border-b pb-4">
        {isEdit ? `Edit Produk: ${formData.name}` : "Tambah Produk Baru"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Dasar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Produk
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg bg-white"
              required
            >
              {DUMMY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga (Rp)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="1000"
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stok
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 p-2 rounded-lg resize-none"
            required
          />
        </div>

        {/* Upload Gambar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar Produk (Max 3)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            multiple
            disabled={formData.images.length >= 3}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          <div className="flex space-x-3 mt-4">
            {formData.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Pratinjau ${index + 1}`}
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400"
          >
            {isSubmitting
              ? "Menyimpan..."
              : isEdit
              ? "Simpan Perubahan"
              : "Tambahkan Produk"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
