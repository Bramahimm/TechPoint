import React, { useState, useEffect } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { getProductReviews, createReview } from "@/services/reviewService";
import type { Review } from "@/types/product";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Form Input
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data ulasan saat komponen muncul
  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const data = await getProductReviews(productId);
      setReviews(data);
    } catch (error) {
      console.error("Gagal memuat ulasan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return toast.error("Komentar tidak boleh kosong");
    
    setIsSubmitting(true);
    try {
      await createReview({
        barang_id: productId,
        rating: ratingInput,
        komentar: commentInput
      });
      toast.success("Ulasan berhasil dikirim!");
      setCommentInput("");
      setRatingInput(5);
      loadReviews(); // Refresh daftar ulasan
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal mengirim ulasan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper untuk render bintang
  const renderStars = (count: number) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < count ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Ulasan Pembeli ({reviews.length})</h2>

      {/* --- FORM INPUT ULASAN --- */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-3">Tulis Ulasan Anda</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-3">
            <span className="mr-3 text-sm text-gray-600">Beri Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRatingInput(star)}
                className={`text-2xl focus:outline-none ${
                  star <= ratingInput ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
            rows={3}
            placeholder="Bagaimana kualitas produk ini? Ceritakan pengalaman Anda..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
          </button>
        </form>
      </div>

      {/* --- DAFTAR ULASAN --- */}
      {loading ? (
        <p className="text-gray-500">Memuat ulasan...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Belum ada ulasan untuk produk ini.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FaUserCircle className="text-gray-400 w-8 h-8 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-800">{review.user?.nama || "Pengguna"}</p>
                    <div className="flex text-sm text-yellow-400">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(review.created_at), "d MMMM yyyy", { locale: idLocale })}
                </span>
              </div>
              <p className="text-gray-700 mt-2">{review.komentar}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;