// src/features/shop/CartPage.tsx

import { useState, useEffect, useCallback, useMemo } from "react";
// Import useNavigate dari react-router-dom
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import type { CartItemState } from "@/types/cart";
import { fetchCartItems, removeCartItem } from "@/services/cartService";
import { formatCurrency } from "@/utils/formatCurrency";
import handleError from "@/utils/handleError";

// Import Komponen Cart
import CartItemCard from "@/components/cart/CartItemCard";
import CartHeader from "@/components/cart/CartHeader";
import CartFooter from "@/components/cart/CartFooter";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Inisialisasi hook navigasi
  const navigate = useNavigate();

  // 1. Ambil Data Keranjang dari Backend
  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const dataCart = await fetchCartItems();
      setCartItems(dataCart.map((item) => ({ ...item, isChecked: true })));
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // 2. Fungsi Aksi Keranjang
  const handleUpdateQuantity = (id: number, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQty) } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckboxChange = (id: number, isChecked: boolean) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isChecked } : item))
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, isChecked: checked }))
    );
  };

  const handleRemoveSelected = async () => {
    // [Logic remove selected remains the same]
  };

  // 3. Perhitungan Total & Item Terpilih
  const selectedItems = useMemo(
    () => cartItems.filter((item) => item.isChecked),
    [cartItems]
  );

  const total = useMemo(
    () =>
      selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems]
  );

  const totalBeforeDiscount = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) =>
          sum + (item.original_price || item.price) * item.quantity,
        0
      ),
    [selectedItems]
  );

  // 4. FUNGSI CHECKOUT BARU
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Pilih setidaknya satu item untuk Checkout.");
      return;
    }

    // REDIRECT ke /checkout dan bawa data item terpilih melalui state
    navigate("/checkout", { state: { items: selectedItems } });
  };

  // 5. Render Halaman
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20 md:pb-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Keranjang Belanja
        </h1>

        {isLoading ? (
          <div className="text-center py-10">Memuat Keranjang...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-10 border rounded-lg bg-white">
            <p className="text-lg text-gray-600">
              Keranjang belanja Anda kosong.
            </p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Kiri: Daftar Item */}
            <div className="flex-grow md:w-8/12 space-y-4">
              <CartHeader
                totalItems={cartItems.length}
                selectedCount={selectedItems.length}
                onSelectAll={handleSelectAll}
                onRemoveSelected={handleRemoveSelected}
                onRemoveInactive={() =>
                  alert("Fitur Hapus produk tidak aktif (dummy).")
                }
                isProcessing={isProcessing}
              />

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onCheckboxChange={handleCheckboxChange}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </div>

            {/* Kanan: Ringkasan Total & Checkout (Sticky di Desktop) */}
            <div className="md:w-4/12 md:sticky md:top-6 self-start">
              <CartFooter
                selectedCount={selectedItems.length}
                subtotal={total}
                totalBeforeDiscount={totalBeforeDiscount}
                onCheckout={handleCheckout} // Panggil fungsi checkout yang baru
                isProcessing={isProcessing}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
