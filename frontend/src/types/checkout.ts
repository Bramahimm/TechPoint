// Asumsi Types yang Dibutuhkan
export interface CheckoutItem {
  product_id: string; // UUID
  nama: string;
  harga: number;
  quantity: number;
  gambar_url: string;
  variant?: string;
  // Data lain yang diperlukan untuk payload Midtrans
}

export interface AddressState {
  receiverName: string;
  phone: string;
  fullAddress: string;
  kecamatan: string;
}

export type PaymentMethod = "BANK_TRANSFER" | "E_WALLET" | "COD";
export type Bank = "BCA" | "BNI" | "BRI" | "MANDIRI";
export type EWallet = "OVO" | "DANA" | "GOPAY" | "SHOPEEPAY";
