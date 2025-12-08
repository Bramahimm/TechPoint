import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

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

// Asumsi Axios ada di services/api
import api from "@/services/api";

interface AddressState {
  receiverName: string;
  phone: string;
  fullAddress: string;
  kecamatan: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    items: initialCartItems,
    isLoading: isDataLoading,
    isRedirecting,
  } = useCheckoutData("techpoint_checkout_items"); // Pass key localStorage

  // 2. State Alamat Pengiriman
  const [addressState, setAddressState] = useState<AddressState>({
    receiverName: "",
    phone: "",
    fullAddress: "",
    kecamatan: "",
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

  // 4. Perhitungan (Memanggil hook dengan data terbaru)
  const {
    subtotal,
    discountTotal,
    shippingCost,
    finalTotal,
    processedItems,
    isStockValid,
  } = useCheckoutComputation({
    cartItems: initialCartItems || [],
    selectedKecamatan: addressState.kecamatan,
  });

  // --- VALIDASI DAN SUBMIT ---

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

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert(
        "Harap lengkapi semua data alamat dan pilih metode pembayaran/kurir yang valid."
      );
      return;
    }

    if (!isStockValid) {
      alert(
        "Beberapa produk memiliki stok kurang dari yang diminta. Harap perbarui kuantitas."
      );
      return;
    }

    setIsSubmitting(true);

    // Payload API
    const orderPayload = {
      // Mapping items ke format yang diterima backend
      items: processedItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_order: item.price,
        variant: item.variant,
      })),

      // Data Alamat
      shipping_address: {
        ...addressState,
        courier_method: selectedCourier,
        shipping_cost: shippingCost,
      },

      // Data Pembayaran
      payment_details: {
        method: selectedPaymentMethod,
        sub_method:
          selectedPaymentMethod === "BANK_TRANSFER"
            ? selectedBank
            : selectedEWallet,
      },

      // Rangkuman Finansial
      financial_summary: {
        subtotal: subtotal,
        discount: discountTotal,
        shipping_cost: shippingCost,
        grand_total: finalTotal,
      },
    };

    try {
      // 1. Panggil API POST /orders
      const response = await api.post("/orders", orderPayload);

      // 2. Hapus data dari localStorage setelah berhasil
      localStorage.removeItem("techpoint_checkout_items");

      // 3. Redirect ke halaman sukses
      const invoiceNumber = response.data.invoice_number || "INV-000000";
      navigate("/order/success", { state: { invoiceNumber } });
    } catch (error) {
      handleError(error);
      alert("Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Loading/Redirecting ---
  if (isDataLoading || isRedirecting) {
    return (
        <CheckoutSkeleton />
    );
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
          {/* Kolom Kiri: Alamat, Produk & Pembayaran */}
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
            />
          </div>

          {/* Kolom Kanan: Ringkasan & Tombol Submit */}
          <div className="lg:col-span-1 lg:sticky lg:top-6 self-start">
            <CheckoutSummary
              subtotalItems={subtotal} // Subtotal adalah harga nett
              totalDiscount={discountTotal}
              shippingCost={shippingCost}
              finalTotal={finalTotal}
              isStockValid={isStockValid} // Kirim status validasi stok
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
