
import React from "react";
import type {
  PaymentMethod,
  BankOption,
  EWalletOption,
} from "@/utils/constants";
import { PAYMENT_METHODS } from "@/utils/constants";
import PaymentBankOptions from "./PaymentBankOptions";
import PaymentEWalletOptions from "./PaymentEWalletOptions";
import PaymentCODOption from "./PaymentCODOption";
import { Banknote, Landmark, Wallet } from "lucide-react";

interface PaymentSelectorProps {
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;

  selectedBank: BankOption | null;
  setSelectedBank: (bank: BankOption | null) => void;

  selectedEWallet: EWalletOption | null;
  setSelectedEWallet: (wallet: EWalletOption | null) => void;
}


const iconMap: { [key: string]: React.ReactNode } = {
  Banknote: <Banknote className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
};

const PaymentMethodSelector: React.FC<PaymentSelectorProps> = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  selectedBank,
  setSelectedBank,
  selectedEWallet,
  setSelectedEWallet,
}) => {
  // --- Render Panel Detail Pembayaran ---
  const renderSubPaymentOptions = () => {
    switch (selectedPaymentMethod) {
      case "BANK_TRANSFER":
        return (
          <PaymentBankOptions
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
          />
        );
      case "E_WALLET":
        return (
          <PaymentEWalletOptions
            selectedEWallet={selectedEWallet}
            setSelectedEWallet={setSelectedEWallet}
          />
        );
      case "COD":
        return <PaymentCODOption />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 mb-4">
        Metode Pembayaran
      </h2>

      {/* Tab Header (Seperti Shopee) */}
      <div className="flex border-b border-gray-200">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedPaymentMethod === method.id;
          return (
            <button
              key={method.id}
              onClick={() => setSelectedPaymentMethod(method.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors
                                ${
                                  isSelected
                                    ? "text-orange-600 border-b-2 border-orange-600"
                                    : "text-gray-600 hover:text-orange-500"
                                }`}>
              {iconMap[method.icon]}
              {method.label}
            </button>
          );
        })}
      </div>

      {/* Panel Detail (Konten Tab) */}
      <div className="mt-4">{renderSubPaymentOptions()}</div>
    </div>
  );
};

export default PaymentMethodSelector;
