import api from "./api";
import type { Review, ReviewPayload } from "@/types/product";

// Ambil semua ulasan untuk produk tertentu
export const getProductReviews = async (productId: string): Promise<Review[]> => {
  const response = await api.get(`/products/${productId}/ulasan`);
  return response.data;
};

// Kirim ulasan baru
export const createReview = async (data: ReviewPayload): Promise<Review> => {
  // Backend route: POST /ulasan
  const response = await api.post("/ulasan", data);
  return response.data;
};