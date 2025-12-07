// src/types/product.ts
export interface Product {
  id: string;
  nama: string;
  slug: string; 
  deskripsi: string;
  harga: number;
  stok: number;
  toko_id: string;
  kategori_id?: string;
  toko: Toko; 
  kategori?: Kategori; 
  gambar?: string; 
  gambar_url: string;
  created_at: string;
  updated_at?: string;
}

export interface Toko {
  id: string;
  nama_toko: string; 
  alamat?: string;
  created_at: string;
}

export interface Kategori{
  id: string;
  nama: string;
}


export interface ProductFormData {
  nama: string;
  harga: number;
  stok: number;
  deskripsi: string;
  kategori_id: string;
  gambar?: File;
  _method?: 'PUT' | 'PATCH';
}

export type ProductPayload = Omit<Product, "id" | "created_at" | "status">;

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "Menunggu Konfirmasi"
  | "Diproses"
  | "Dikirim"
  | "Selesai"
  | "Dibatalkan";

export interface SellerOrder {
  id: string;
  invoice_number: string;
  customer_name: string;
  total_amount: number;
  status: OrderStatus;
  items: OrderItem[];
  shipping_address: string;
  created_at: string;
}
