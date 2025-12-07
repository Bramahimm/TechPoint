// src/features/seller/Products/ProductFormPage.tsx (FINAL REVISI)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSellerProductById, // Ubah ke seller service
  createProduct,
  updateProduct,
  getCategories,
} from "@/services/productService";
import type { ProductFormData, Product } from "@/types/product";
import ProductFormHeader from "./components/ProductFormHeader";
import ProductBasicInfo from "./components/ProductBasicInfo";
import ProductImageUpload from "./components/ProductImageUpload";
import ProductFormActions from "./components/ProductFormActions";

interface FormDataState {
  nama: string;
  harga: number;
  stok: number;
  deskripsi: string;
  kategori_id: string;
}

interface Category {
  id: string;
  nama: string;
}

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<FormDataState>({
    nama: "",
    harga: 0,
    stok: 0,
    deskripsi: "",
    kategori_id: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 1. Ambil Kategori dan Data Produk
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Ambil kategori dinamis
        const categoryData = await getCategories();
        setCategories(categoryData);

        // Ambil data produk jika dalam mode edit
        if (isEdit && id) {
          const product: Product = await getSellerProductById(id);

          // harus sesuai dengan data yang diambil dari API
          setFormData({
            nama: product.nama,
            harga: product.harga,
            stok: product.stok,
            deskripsi: product.deskripsi || "",
            kategori_id: product.kategori_id || "",
          });
          setPreviewUrl(product.gambar_url || "");
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
        alert("Gagal memuat data produk atau kategori.");
        navigate("/seller/products");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [id, isEdit, navigate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nama) newErrors.nama = "Nama produk wajib diisi";
    if (formData.harga < 1000) newErrors.harga = "Harga minimal Rp 1.000";
    if (formData.stok < 0) newErrors.stok = "Stok tidak boleh negatif";
    if (!formData.kategori_id && categories.length > 0)
      newErrors.kategori_id = "Kategori wajib dipilih";
    if (!isEdit && !selectedFile) newErrors.gambar = "Gambar wajib diunggah";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "harga" || name === "stok" ? Number(value) || 0 : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, gambar: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload: ProductFormData = {
        ...formData,
        gambar: selectedFile || undefined,
      };

      let updatedProduct;
      if (isEdit && id) {
        updatedProduct = await updateProduct(id, payload);
        alert(`Produk ${updatedProduct.nama} berhasil diperbarui!`);
      } else {
        updatedProduct = await createProduct(payload);
        alert(`Produk ${updatedProduct.nama} berhasil ditambahkan!`);
      }
      navigate("/seller/products");
    } catch (error: any) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message ||
          "Gagal menyimpan produk. Periksa koneksi atau validasi data."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Memuat data awal (Produk/Kategori)...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <ProductFormHeader isEdit={isEdit} productName={formData.nama} />

      <form onSubmit={handleSubmit} className="space-y-8">
        <ProductBasicInfo
          formData={formData as unknown as ProductFormData} 
          handleChange={handleChange}
          errors={errors}
          categories={categories} 
        />

        <ProductImageUpload
          isEdit={isEdit}
          previewUrl={previewUrl}
          handleFileChange={handleFileChange}
          errors={errors}
        />

        <ProductFormActions isEdit={isEdit} isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default ProductFormPage;
