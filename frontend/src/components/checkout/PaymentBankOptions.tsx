// src/components/checkout/PaymentBankOptions.tsx
import React from "react";
import type { BankOption } from "@/utils/constants";
import { BANK_OPTIONS } from "@/utils/constants";

interface BankOptionsProps {
  selectedBank: BankOption;
  setSelectedBank: (bank: BankOption) => void;
}

const PaymentBankOptions: React.FC<BankOptionsProps> = ({
  selectedBank,
  setSelectedBank,
}) => (
  <div className="mt-4 p-4 border rounded-lg bg-indigo-50 space-y-2">
    <p className="font-semibold text-sm mb-2">Pilih Bank Tujuan Transfer:</p>
    <div className="grid grid-cols-3 gap-2">
      {BANK_OPTIONS.map((bank) => (
        <button
          key={bank}
          onClick={() => setSelectedBank(bank)}
          className={`p-2 text-sm border rounded-lg transition-colors font-medium
                        ${
                          selectedBank === bank
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white hover:bg-gray-100"
                        }`}>
          {bank}
        </button>
      ))}
    </div>
  </div>
);

export default PaymentBankOptions;
