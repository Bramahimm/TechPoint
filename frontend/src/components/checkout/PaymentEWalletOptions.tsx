// src/components/checkout/PaymentEWalletOptions.tsx

import React from "react";
import { CheckCircle } from "lucide-react";
import type { EWallet } from "@/types/checkout";

interface PaymentEWalletOptionsProps {
  selectedEWallet: EWallet | null;
  setSelectedEWallet: (wallet: EWallet) => void;
}

const eWallets: { key: EWallet; name: string; iconUrl: string }[] = [
  { key: "GOPAY", name: "GoPay", iconUrl: "gopay.svg" },
  { key: "OVO", name: "OVO", iconUrl: "ovo.svg" },
  { key: "DANA", name: "DANA", iconUrl: "dana.svg" },
  // { key: 'SHOPEEPAY', name: 'ShopeePay', iconUrl: 'shopeepay.svg' }, // Midtrans default hanya mendukung Gopay
];

const PaymentEWalletOptions: React.FC<PaymentEWalletOptionsProps> = ({
  selectedEWallet,
  setSelectedEWallet,
}) => {
  return (
    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
      <h3 className="font-semibold text-gray-700">Pilih E-Wallet</h3>
      {eWallets.map((wallet) => (
        <div
          key={wallet.key}
          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
            selectedEWallet === wallet.key
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => setSelectedEWallet(wallet.key)}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center border rounded-md">
              <span className="text-xs font-bold">{wallet.key}</span>
            </div>
            <span className="text-sm font-medium">{wallet.name}</span>
          </div>
          {selectedEWallet === wallet.key && (
            <CheckCircle className="w-5 h-5 text-orange-500" />
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentEWalletOptions;
