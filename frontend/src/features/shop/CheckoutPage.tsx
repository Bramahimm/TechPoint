// src/features/shop/CheckoutPage.tsx (REVISI FINAL INTEGRASI)

import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// --- Hooks & Utils ---
import { useCheckoutData } from "@/hooks/checkout/useCheckoutData";
import { useCheckoutComputation } from "@/hooks/checkout/useCheckoutComputation";
import { usePaymentSelection } from "@/hooks/checkout/usePaymentSelection";
import handleError from "@/utils/handleError";

// --- Components ---
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutProductList from "@/components/checkout/CheckoutProductList";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import CheckoutSubmitButton from "@/components/checkout/CheckoutSubmitButton";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import CheckoutAddressForm from "@/components/checkout/CheckoutAddressForm";
import CheckoutSkeleton from "@/components/checkout/CheckoutSkeleton";

import api from "@/services/api";
import type { CheckoutItem, AddressState } from "@/types/checkout";

// --- Deklarasi global Midtrans Snap ---
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: any) => void;
          onPending: (result: any) => void;
          onError: (result: any) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Ambil data checkout dari localStorage
  const {
    items: initialCartItems,
    isLoading: isDataLoading,
    isRedirecting,
  } = useCheckoutData("techpoint_checkout_items");

  // 2. State Alamat Pengiriman
  const [addressState, setAddressState] = useState<AddressState>({
    receiverName: "Budi Santoso",
    phone: "08123456789",
    fullAddress: "Jl. Merdeka No. 10",
    kecamatan: "Jakarta Pusat",
  });

  const handleAddressChange = useCallback((field: string, value: string) => {
    setAddressState((prev) => ({ ...prev, [field]: value }));
  }, []);

  // 3. State Pembayaran & Kurir
  const {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    selectedBank,
    setSelectedBank,
    selectedEWallet,
    setSelectedEWallet,
    selectedCourier,
    setSelectedCourier,
    isPaymentValid,
  } = usePaymentSelection();

  // 4. Perhitungan Checkout
  const {
    subtotal,
    discountTotal,
    shippingCost,
    finalTotal,
    processedItems,
    isStockValid,
  } = useCheckoutComputation({
    cartItems: (initialCartItems as CheckoutItem[]) || [],
    selectedKecamatan: addressState.kecamatan,
  });

  // 5. Validasi Form
  const isFormValid = useMemo(() => {
    return (
      addressState.receiverName.trim() !== "" &&
      addressState.phone.trim() !== "" &&
      addressState.fullAddress.trim() !== "" &&
      addressState.kecamatan.trim() !== "" &&
      isPaymentValid &&
      isStockValid &&
      finalTotal > 0
    );
  }, [addressState, isPaymentValid, isStockValid, finalTotal]);

  // 6. Submit Order
  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error(
        "Harap lengkapi semua data alamat dan pilih metode pembayaran/kurir yang valid."
      );
      return;
    }

    if (!isStockValid) {
      toast.error(
        "Beberapa produk memiliki stok kurang dari yang diminta. Harap perbarui kuantitas."
      );
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(
      "Membuat pesanan dan mengarahkan ke pembayaran..."
    );

    // Payload API
    const orderPayload = {
      items: processedItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_order: item.harga,
        name: item.nama,
        variant: item.variant,
      })),

      shipping_address: {
        ...addressState,
        courier_method: selectedCourier,
        shipping_cost: shippingCost,
      },

      payment_details: {
        method: selectedPaymentMethod,
        sub_method:
          selectedPaymentMethod === "BANK_TRANSFER"
            ? selectedBank
            : selectedEWallet,
      },

      financial_summary: {
        subtotal,
        discount: discountTotal,
        shipping_cost: shippingCost,
        grand_total: finalTotal,
      },
    };

    try {
      // 1. Kirim Order ke Backend
      const response = await api.post("/orders", orderPayload);
      const { invoice_number, snap_token } = response.data;

      toast.dismiss(loadingToast);

      if (!snap_token || !window.snap) {
        throw new Error("Midtrans Snap library tidak dimuat.");
      }

      // 2. Hapus cart dari localStorage
      localStorage.removeItem("techpoint_checkout_items");

      // 3. Panggil Snap
      window.snap.pay(snap_token, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil diproses.");
        },
        onPending: () => {
          toast.success("Menunggu pembayaran Anda.");
          navigate("/order/pending", {
            state: { invoiceNumber: invoice_number },
          });
        },
        onError: () => {
          toast.error("Pembayaran gagal. Status order akan diperbarui.");
          navigate("/orders");
        },
        onClose: () => {
          toast("Jendela pembayaran ditutup. Cek status order.");
          navigate("/orders");
        },
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      handleError(error);
      toast.error("Gagal memproses Checkout. Pastikan Anda sudah login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Loading ---
  if (isDataLoading || isRedirecting) {
    return <CheckoutSkeleton />;
  }

  const safeItems = initialCartItems ?? [];
  if (safeItems.length === 0) {
    return (
      <div className="text-center py-20 min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-3">
          Tidak ada Item untuk Checkout
        </h1>
        <button
          onClick={() => navigate("/cart")}
          className="text-blue-600 hover:underline">
          Kembali ke Keranjang
        </button>
      </div>
    );
  }

  // --- Render Utama ---
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <CheckoutHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom kiri */}
        <div className="lg:col-span-2 space-y-6">
          <CheckoutAddressForm
            addressState={addressState}
            onFieldChange={handleAddressChange}
            selectedCourier={selectedCourier}
            setSelectedCourier={setSelectedCourier}
            selectedKecamatan={addressState.kecamatan}
          />

          <CheckoutProductList items={processedItems} />

          <PaymentMethodSelector
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
            selectedEWallet={selectedEWallet}
            setSelectedEWallet={setSelectedEWallet}
            isPaymentValid={isPaymentValid}
          />
        </div>

        {/* Kolom kanan */}
        <div className="lg:col-span-1 lg:sticky lg:top-6 self-start">
          <CheckoutSummary
            subtotalItems={subtotal}
            totalDiscount={discountTotal}
            shippingCost={shippingCost}
            finalTotal={finalTotal}
            isStockValid={isStockValid}
          />

          <CheckoutSubmitButton
            finalTotal={finalTotal}
            isPaymentValid={isFormValid}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
