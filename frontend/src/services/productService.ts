// src/services/productService.ts

import api from "@/services/api";
import type { Product } from "@/types/product";

export interface ProductPayload {
  nama: string;
  harga: number;
  stok: number;
  deskripsi: string;
  kategori_id: string;
  gambar?: File;
  _method?: "PUT" | "PATCH";
}

interface ProductListResponse {
  message: string;
  data: Product[];
}

export const getSellerProducts = async (): Promise<Product[]> => {
  const response = await api.get<ProductListResponse>("/seller/products");
  return response.data.data;
};

interface ProductResponse {
  current_page: number;
  data: Product[];
  last_page: number;
  per_page: number;
  total: number;
}

interface Category {
  id: string;
  nama: string;
}

// FUNGSI PUBLIC (Tidak perlu autentikasi)

// DIUBAH: Sekarang support parameter kategori (opsional)
export const getProducts = async (
  params: Record<string, any> = {}
): Promise<ProductResponse> => {
  try {
    const response = await api.get<ProductResponse>("/products", { params });
    return response.data; // ← langsung return object pagination (data, current_page, dll)
  } catch (error) {
    console.error("Error fetching public products: ", error);
    throw error;
  }
};

// TAMBAHAN BARU: Fungsi khusus untuk homepage (biar lebih jelas)
export const getHomepageProducts = async (
  kategori?: string
): Promise<Product[]> => {
  const params = kategori && kategori !== "semua" ? { kategori } : {};
  const response = await getProducts(params);
  return response.data; // ← hanya ambil array produknya
};
export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await api.get(`/products/slug/${slug}`);
  return response.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/kategori");
  return response.data;
}

// FUNGSI SELLER (Membutuhkan Autentikasi dan Relasi Toko)

const createFormData = (data: ProductPayload) => {
  const formData = new FormData();

  formData.append("nama", data.nama);
  formData.append("harga", data.harga.toString());
  formData.append("stok", data.stok.toString());
  formData.append("deskripsi", data.deskripsi);
  formData.append("kategori_id", data.kategori_id);
  if (data.gambar) formData.append("gambar", data.gambar);

  if (data._method) formData.append("_method", data._method);

  return formData;
};

export async function getSellerProductById(id: string): Promise<Product> {
  const response = await api.get(`/seller/products/${id}`);
  return response.data;
}

export async function createProduct(data: ProductPayload): Promise<Product> {
  const formData = createFormData(data);

  const response = await api.post("/seller/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
}

export async function updateProduct(
  id: string,
  data: Partial<ProductPayload>
): Promise<Product> {
  const payloadWithMethod: ProductPayload = {
    nama: data.nama ?? "",
    harga: data.harga ?? 0,
    stok: data.stok ?? 0,
    deskripsi: data.deskripsi ?? "",
    kategori_id: data.kategori_id ?? "",
    gambar: data.gambar,
    _method: "PUT",
  };

  const formData = createFormData(payloadWithMethod);

  const response = await api.post(`/seller/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/seller/products/${id}`);
}
