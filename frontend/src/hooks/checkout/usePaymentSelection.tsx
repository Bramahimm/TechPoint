// src/hooks/checkout/usePaymentSelection.tsx

import { useState, useMemo } from "react";

import { BANK_OPTIONS, EWALLET_OPTIONS } from "@/utils/constants";

import type {
  PaymentMethod,
  BankOption,
  EWalletOption,
  LocalCourier,
} from "@/utils/constants";

// --------------------------------------
// INTERFACE FOR HOOK RESULT
// --------------------------------------

export interface PaymentSelectionResult {
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;

  selectedBank: BankOption | null;
  setSelectedBank: (bank: BankOption | null) => void;

  selectedEWallet: EWalletOption | null;
  setSelectedEWallet: (wallet: EWalletOption | null) => void;

  selectedCourier: LocalCourier | null;
  setSelectedCourier: (courier: LocalCourier | null) => void;

  isPaymentValid: boolean;
}

// --------------------------------------
// MAIN HOOK
// --------------------------------------

export const usePaymentSelection = (): PaymentSelectionResult => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);

  const [selectedEWallet, setSelectedEWallet] = useState<EWalletOption | null>(
    null
  );

  const [selectedCourier, setSelectedCourier] = useState<LocalCourier | null>(
    null
  );

  // -------------------------------
  // Handler: Set Payment Method
  // -------------------------------
  const handleSetPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);

    if (method === "COD") {
      setSelectedCourier("COD");
    } else {
      setSelectedCourier("Kurir Internal");
    }

    // Reset options
    setSelectedBank(null);
    setSelectedEWallet(null);
  };

  // -------------------------------
  // Validation Logic
  // -------------------------------
  const isPaymentValid = useMemo(() => {
    if (!selectedPaymentMethod) return false;

    if (
      selectedPaymentMethod === "BANK_TRANSFER" &&
      (selectedBank === null || !BANK_OPTIONS.includes(selectedBank))
    ) {
      return false;
    }

    if (
      selectedPaymentMethod === "E_WALLET" &&
      (selectedEWallet === null || !EWALLET_OPTIONS.includes(selectedEWallet))
    ) {
      return false;
    }

    if (!selectedCourier) return false;

    return true;
  }, [selectedPaymentMethod, selectedBank, selectedEWallet, selectedCourier]);

  // -------------------------------
  // Return
  // -------------------------------
  return {
    selectedPaymentMethod,
    setSelectedPaymentMethod: handleSetPaymentMethod,

    selectedBank,
    setSelectedBank,

    selectedEWallet,
    setSelectedEWallet,

    selectedCourier,
    setSelectedCourier,

    isPaymentValid,
  };
};
