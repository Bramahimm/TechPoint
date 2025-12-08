// src/components/checkout/PaymentMethodSelector.tsx

import React, { useState } from "react";
import { CreditCard, Wallet, Truck, CheckCircle } from "lucide-react";
import PaymentBankOptions from "./PaymentBankOptions";
import PaymentEWalletOptions from "./PaymentEWalletOptions";
import PaymentCODOption from "./PaymentCODOption";
import type { PaymentMethod, Bank, EWallet } from "@/types/checkout";

interface PaymentMethodSelectorProps {
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  selectedBank: Bank | null;
  setSelectedBank: (bank: Bank) => void;
  selectedEWallet: EWallet | null;
  setSelectedEWallet: (wallet: EWallet) => void;
  isPaymentValid: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  selectedBank,
  setSelectedBank,
  selectedEWallet,
  setSelectedEWallet,
}) => {
  const [openSection, setOpenSection] = useState<PaymentMethod | null>(
    selectedPaymentMethod
  );

  const toggleSection = (method: PaymentMethod) => {
    if (selectedPaymentMethod !== method) {
      setSelectedPaymentMethod(method);
      setOpenSection(method);
    } else {
      setOpenSection(openSection === method ? null : method);
    }
  };

  const isSelected = (method: PaymentMethod) =>
    selectedPaymentMethod === method;

  const isOpen = (method: PaymentMethod) => openSection === method;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Metode Pembayaran
      </h2>

      {/* 1. BANK TRANSFER */}
      <div className="mb-4 border rounded-lg overflow-hidden">
        <div
          className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${
            isSelected("BANK_TRANSFER")
              ? "bg-orange-100/50"
              : "hover:bg-gray-50"
          }`}
          onClick={() => toggleSection("BANK_TRANSFER")}>
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-gray-800">Bank Transfer</span>
          </div>

          {isSelected("BANK_TRANSFER") && selectedBank ? (
            <span className="text-sm font-semibold text-orange-600">
              {selectedBank}
            </span>
          ) : (
            <span className="text-xs text-gray-500">Pilih Bank &gt;</span>
          )}
        </div>

        {isOpen("BANK_TRANSFER") && (
          <div className="p-3 border-t bg-white">
            <PaymentBankOptions
              selectedBank={selectedBank}
              setSelectedBank={setSelectedBank}
              isPaymentValid={selectedBank !== null}
            />
          </div>
        )}
      </div>

      {/* 2. E-WALLET */}
      <div className="mb-4 border rounded-lg overflow-hidden">
        <div
          className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${
            isSelected("E_WALLET") ? "bg-orange-100/50" : "hover:bg-gray-50"
          }`}
          onClick={() => toggleSection("E_WALLET")}>
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-gray-800">E-Wallet</span>
          </div>

          {isSelected("E_WALLET") && selectedEWallet ? (
            <span className="text-sm font-semibold text-orange-600">
              {selectedEWallet}
            </span>
          ) : (
            <span className="text-xs text-gray-500">Pilih E-Wallet &gt;</span>
          )}
        </div>

        {isOpen("E_WALLET") && (
          <div className="p-3 border-t bg-white">
            <PaymentEWalletOptions
              selectedEWallet={selectedEWallet}
              setSelectedEWallet={setSelectedEWallet}
            />
          </div>
        )}
      </div>

      {/* 3. COD */}
      <div className="border rounded-lg overflow-hidden">
        <div
          className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${
            isSelected("COD") ? "bg-orange-100/50" : "hover:bg-gray-50"
          }`}
          onClick={() => toggleSection("COD")}>
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-800">
              Bayar di Tempat (COD)
            </span>
          </div>

          {isSelected("COD") ? (
            <CheckCircle className="w-5 h-5 text-orange-500" />
          ) : (
            <span className="text-xs text-gray-500">Pilih &gt;</span>
          )}
        </div>

        {/* ⬇ FIX: Komponen COD sekarang digunakan → ESLint OK */}
        {isOpen("COD") && (
          <div className="p-3 border-t bg-white">
            <PaymentCODOption
              isSelected={isSelected("COD")}
              onSelect={() => setSelectedPaymentMethod("COD")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
