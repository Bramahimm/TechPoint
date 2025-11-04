// src/utils/formatCurrency.ts

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return "Rp 0";

  return amount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
}
