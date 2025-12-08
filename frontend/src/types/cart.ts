export interface CartItem {
  id: string; 
  product_id: string; 
  nama: string; 
  harga: number; 
  original_price?: number;
  quantity: number;
  gambar_url: string; 
  variant?: string;
  discount_percent?: number;
}

export interface CartItemState extends CartItem {
  isChecked: boolean;
}
