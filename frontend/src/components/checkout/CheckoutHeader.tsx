// src/components/checkout/CheckoutHeader.tsx
import React from "react";
import { ShoppingBag } from "lucide-react";

const CheckoutHeader: React.FC = () => (
  <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3 border-b pb-4 mb-6">
    <ShoppingBag className="w-6 h-6 text-orange-500" />
    Checkout TechPoint
  </h1>
);

export default CheckoutHeader;
