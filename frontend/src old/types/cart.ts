// Definisi dasar item keranjang dari API Laravel
export interface CartItem {
  id: number;
  product_id: number; // Tambahkan product_id untuk identifikasi
  name: string;
  price: number; // Harga setelah diskon (harga final)
  original_price?: number; // Harga coret (sebelum diskon)
  quantity: number;
  image: string; // URL gambar produk
  variant?: string; // Varian produk misalnya warna biru, Ukuran L
  discount_percent?: number; // Persentase diskon opsional
}

// taambahan untuk state lokal di React
export interface CartItemState extends CartItem {
    isChecked: boolean; // Untuk kontrol checkbox di UI
}