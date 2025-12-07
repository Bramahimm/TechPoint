// src/components/checkout/PaymentEWalletOptions.tsx
import React from "react";
import type { EWalletOption } from "@/utils/constants";
import { EWALLET_OPTIONS } from "@/utils/constants";
import { QrCode } from "lucide-react";

interface EWalletOptionsProps {
  selectedEWallet: EWalletOption | null;
  setSelectedEWallet: (wallet: EWalletOption |null) => void;
}

const PaymentEWalletOptions: React.FC<EWalletOptionsProps> = ({
  selectedEWallet,
  setSelectedEWallet,
}) => (
  <div className="mt-4 p-4 border rounded-lg bg-green-50 space-y-2">
    <p className="font-semibold text-sm mb-2">Pilih E-Wallet:</p>
    <div className="grid grid-cols-3 gap-2">
      {EWALLET_OPTIONS.map((wallet) => (
        <button
          key={wallet}
          onClick={() => setSelectedEWallet(wallet)}
          className={`p-2 text-sm border rounded-lg transition-colors font-medium flex items-center justify-center gap-1
                        ${
                          selectedEWallet === wallet
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white hover:bg-gray-100"
                        }`}>
          {wallet === "GOPAY" ? <QrCode className="w-4 h-4" /> : null}
          {wallet}
        </button>
      ))}
    </div>
  </div>
);

export default PaymentEWalletOptions;
