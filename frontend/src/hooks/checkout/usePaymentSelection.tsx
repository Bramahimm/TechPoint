// src/hooks/checkout/usePaymentSelection.tsx

import { useState, useMemo } from "react";
import type { PaymentMethod, Bank, EWallet } from "@/types/checkout"; // Asumsi imports

export const usePaymentSelection = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [selectedEWallet, setSelectedEWallet] = useState<EWallet | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<string>("JNE"); // Asumsi default kurir

  const isPaymentValid = useMemo(() => {
    if (!selectedPaymentMethod) return false;

    switch (selectedPaymentMethod) {
      case "BANK_TRANSFER":
        return selectedBank !== null;
      case "E_WALLET":
        return selectedEWallet !== null;
      case "COD":
        return true; // COD selalu valid jika dipilih
      default:
        return false;
    }
  }, [selectedPaymentMethod, selectedBank, selectedEWallet]);

  return {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    selectedBank,
    setSelectedBank,
    selectedEWallet,
    setSelectedEWallet,
    selectedCourier,
    setSelectedCourier,
    isPaymentValid,
  };
};
