// Representasi item keranjang yang dikirim dari API Laravel
export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  original_price?: number;
  quantity: number;
  image: string;
  variant?: string;
  discount_percent?: number;
}

// Versi item keranjang untuk state React
export interface CartItemState extends CartItem {
  isChecked: boolean;
}
