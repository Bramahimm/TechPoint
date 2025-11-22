import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CartItem } from "@/types/cart"; // Asumsi CartItem ada di sini

export interface CheckoutDataResult {
  items: CartItem[] | null;
  isLoading: boolean;
  isRedirecting: boolean;
}

/**
 * Hook untuk memuat data item checkout, memprioritaskan data dari state navigasi,
 * atau fallback ke localStorage, serta menangani redirect jika data hilang.
 * * @param localStorageKey Kunci yang digunakan untuk menyimpan data fallback di localStorage.
 */
export const useCheckoutData = (
  localStorageKey: string
): CheckoutDataResult => {
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    let itemsFromSource: CartItem[] | null = null;
    const itemsFromNavigation = location.state?.items as CartItem[] | undefined;

    // 1. Prioritas: Data dari State Navigasi (paling baru dari CartPage)
    if (itemsFromNavigation && itemsFromNavigation.length > 0) {
      itemsFromSource = itemsFromNavigation;
      // Simpan ke LocalStorage sebagai fallback jika halaman di-refresh
      localStorage.setItem(
        localStorageKey,
        JSON.stringify(itemsFromNavigation)
      );
    } else {
      // 2. Fallback: Data dari LocalStorage (jika halaman di-refresh)
      const storedData = localStorage.getItem(localStorageKey);
      if (storedData) {
        try {
          itemsFromSource = JSON.parse(storedData) as CartItem[];
        } catch (e) {
          console.error("Error parsing data from localStorage:", e);
          localStorage.removeItem(localStorageKey);
        }
      }
    }

    // 3. Validasi dan Redirect
    if (!itemsFromSource || itemsFromSource.length === 0) {
      setIsRedirecting(true);
      setIsLoading(false);

      // Redirect setelah sedikit delay
      setTimeout(() => {
        alert(
          "Sesi checkout berakhir atau tidak ada item yang valid. Anda dialihkan kembali ke keranjang."
        );
        navigate("/cart", { replace: true });
      }, 50);

      return; // Hentikan eksekusi logic di bawah
    }

    // 4. Data valid, set state
    setItems(itemsFromSource);
    setIsLoading(false);
  }, [location.state, navigate, localStorageKey]);

  return { items, isLoading, isRedirecting };
};
