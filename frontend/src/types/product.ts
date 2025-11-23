// src/types/product.ts
// Asumsi file ini sudah ada, jika belum, buat.

export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    category: string;
    images: string[]; // URL gambar
    status: 'active' | 'inactive';
    created_at: string;
}

export type ProductPayload = Omit<Product, 'id' | 'created_at' | 'status'>;

export interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
}

export type OrderStatus = 'Menunggu Konfirmasi' | 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan';

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