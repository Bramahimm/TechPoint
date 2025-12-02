// src/services/productService.ts
import type { Product, ProductPayload } from "@/types/product";
import Produk1 from "@/assets/images/product4.webp";
import Produk2 from "@/assets/images/product5.webp";

const DUMMY_PRODUCTS: Product[] = [
  {
    id: "P001",
    name: "Laptop Gaming ROG Zephyrus",
    price: 18500000,
    stock: 5,
    description: "Laptop gaming high performance.",
    category: "Elektronik",
    images: [Produk1],
    status: "active",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "P002",
    name: "Keyboard Mechanical Logitech G Pro",
    price: 1800000,
    stock: 12,
    description: "Keyboard untuk pro player.",
    category: "Aksesoris",
    images: [Produk2],
    status: "active",
    created_at: new Date().toISOString(),
  },
];

// FUNGSI UTAMA UNTUK DUMMY
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let productsData = [...DUMMY_PRODUCTS];

// --- API SKELETON (Ganti dengan AXIOS) ---

export async function getProducts(): Promise<Product[]> {
  // TODO: Di sini nanti axios dipakai:
  // const response = await api.get("/products");
  // return response.data;
  await delay(300);
  return productsData;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  // TODO: Di sini nanti axios dipakai:
  // const response = await api.get(`/products/${id}`);
  // return response.data;
  await delay(300);
  return productsData.find((p) => p.id === id);
}

export async function createProduct(data: ProductPayload): Promise<Product> {
  // TODO: Di sini nanti axios dipakai:
  // const response = await api.post("/products", data);
  // return response.data;
  await delay(300);
  const newProduct: Product = {
    ...data,
    id: `P${Date.now()}`,
    status: "active",
    created_at: new Date().toISOString(),
  };
  productsData.push(newProduct);
  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<ProductPayload>
): Promise<Product> {
  // TODO: Di sini nanti axios dipakai:
  // const response = await api.put(`/products/${id}`, data);
  // return response.data;
  await delay(300);
  const index = productsData.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Produk tidak ditemukan");

  productsData[index] = { ...productsData[index], ...data, id };
  return productsData[index];
}

export async function deleteProduct(id: string): Promise<void> {
  // TODO: Di sini nanti axios dipakai:
  // await api.delete(`/products/${id}`);
  await delay(300);
  productsData = productsData.filter((p) => p.id !== id);
}
