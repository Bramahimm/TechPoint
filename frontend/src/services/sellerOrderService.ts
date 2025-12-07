// src/services/sellerOrderService.ts
import type { SellerOrder, OrderStatus } from "@/types/product";
const DUMMY_ORDERS: SellerOrder[] = [
  {
    id: "ORD001",
    invoice_number: "TP-INV-202511001",
    customer_name: "Budi Santoso",
    total_amount: 2000000,
    status: "Menunggu Konfirmasi",
    items: [
      {
        id: 1,
        product_name: "Keyboard Mechanical",
        quantity: 1,
        price: 1800000,
      },
    ],
    shipping_address: "Rajabasa, Bandar Lampung",
    created_at: new Date().toISOString(),
  },
  {
    id: "ORD002",
    invoice_number: "TP-INV-202511002",
    customer_name: "Siti Aisyah",
    total_amount: 19500000,
    status: "Dikirim",
    items: [
      { id: 2, product_name: "Laptop ROG", quantity: 1, price: 18500000 },
    ],
    shipping_address: "Sukarame, Bandar Lampung",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
];

let ordersData = [...DUMMY_ORDERS];

// --- API SKELETON (Ganti dengan AXIOS) ---

export async function getSellerOrders(): Promise<SellerOrder[]> {
  // TODO: Di sini nanti axios dipakai:
  // const response = await api.get("/seller/orders");
  // return response.data;
  return ordersData;
}

export async function getOrderDetail(
  id: string
): Promise<SellerOrder | undefined> {
  // TODO: Di sini nanti axios dipakai:
  // const response = await api.get(`/seller/orders/${id}`);
  // return response.data;
  return ordersData.find((o) => o.id === id);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<SellerOrder> {
  // TODO: Di sini nanti axios dipakai:
  // const response = await api.put(`/seller/orders/${id}/status`, { status });
  // return response.data;
  const index = ordersData.findIndex((o) => o.id === id);
  if (index === -1) throw new Error("Pesanan tidak ditemukan");

  ordersData[index] = { ...ordersData[index], status };
  return ordersData[index];
}
