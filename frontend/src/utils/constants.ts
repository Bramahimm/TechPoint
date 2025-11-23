// src/utils/constants.ts

// --- INTERFACE & TYPES BARU YANG HARUS DI EXPORT ---

export type LocalCourier = "Kurir Internal" | "COD";

export type PaymentMethod = "COD" | "BANK_TRANSFER" | "E_WALLET";

export type BankOption = "BCA" | "BNI" | "BRI";

export type EWalletOption = "DANA" | "OVO" | "GOPAY";

// --- DATA GEOGRAFI LOKAL (BANDAR LAMPUNG) ---
export interface ShippingRate {
  kecamatan: string;
  rate: number;
}

// Data dummy ongkir per kecamatan di Bandar Lampung
export const BANDAR_LAMPUNG_SHIPPING: ShippingRate[] = [
  { kecamatan: "Rajabasa", rate: 10000 },
  { kecamatan: "Sukarame", rate: 12000 },
  { kecamatan: "Kedaton", rate: 10000 },
  { kecamatan: "Kemiling", rate: 15000 },
  { kecamatan: "Panjang", rate: 18000 },
  { kecamatan: "Enggal", rate: 10000 },
  { kecamatan: "Tanjung Karang Pusat", rate: 10000 },
  { kecamatan: "Teluk Betung Utara", rate: 11000 },
  { kecamatan: "Bumi Waras", rate: 13000 },
];

// --- DATA KURIR LOKAL ---
export const COURIER_OPTIONS: LocalCourier[] = ["Kurir Internal", "COD"];

// --- DATA PEMBAYARAN ---
// Catatan: Array PAYMENT_METHODS ini tetap menjadi nilai, bukan tipe
export const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  icon: string;
}[] = [
  { id: "COD", label: "Cash On Delivery", icon: "Banknote" },
  { id: "BANK_TRANSFER", label: "Transfer Bank", icon: "Landmark" },
  { id: "E_WALLET", label: "E-Wallet", icon: "Wallet" },
];

// Catatan: Array ini tetap menjadi nilai, bukan tipe
export const BANK_OPTIONS: BankOption[] = ["BCA", "BNI", "BRI"];

// Catatan: Array ini tetap menjadi nilai, bukan tipe
export const EWALLET_OPTIONS: EWalletOption[] = ["DANA", "OVO", "GOPAY"];
