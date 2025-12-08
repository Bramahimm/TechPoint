// src/components/checkout/PaymentBankOptions.tsx

import React from "react";
import { CheckCircle } from "lucide-react";
import type { Bank } from "@/types/checkout";

interface PaymentBankOptionsProps {
  selectedBank: Bank | null;
  setSelectedBank: (bank: Bank) => void;
  isPaymentValid: boolean;
}

const banks: { key: Bank; name: string; iconUrl: string }[] = [
  { key: "BCA", name: "Bank BCA", iconUrl: "bca.svg" },
  { key: "BNI", name: "Bank BNI", iconUrl: "bni.svg" },
  { key: "BRI", name: "Bank BRI", iconUrl: "bri.svg" },
  { key: "MANDIRI", name: "Bank Mandiri", iconUrl: "mandiri.svg" },
];

const PaymentBankOptions: React.FC<PaymentBankOptionsProps> = ({
  selectedBank,
  setSelectedBank,
}) => {
  return (
    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
      <h3 className="font-semibold text-gray-700">Pilih Bank Transfer</h3>
      {banks.map((bank) => (
        <div
          key={bank.key}
          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
            selectedBank === bank.key
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => setSelectedBank(bank.key)}>
          <div className="flex items-center gap-3">
            {/* Ganti dengan icon bank yang sebenarnya */}
            <div className="w-8 h-8 flex items-center justify-center border rounded-md">
              <span className="text-xs font-bold">{bank.key}</span>
            </div>
            <span className="text-sm font-medium">{bank.name}</span>
          </div>
          {selectedBank === bank.key && (
            <CheckCircle className="w-5 h-5 text-orange-500" />
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentBankOptions;
