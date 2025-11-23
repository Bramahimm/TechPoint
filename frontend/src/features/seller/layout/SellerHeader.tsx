// src/features/seller/layout/SellerHeader.tsx
import React from "react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const SellerHeader: React.FC = () => {
  // TODO: Ambil nama toko dari context/API
  const shopName = "TechPoint Store BDL";

  return (
    <header className="flex justify-between items-center h-16 bg-white shadow-sm px-6 border-b">
      <h1 className="text-xl font-bold text-gray-800">
        <Link
          to="/seller/dashboard"
          className="text-orange-500 hover:text-orange-600 transition">
          {shopName}
        </Link>
      </h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 hidden sm:block">
          Selamat Datang, Penjual!
        </span>
        <button
          onClick={() => alert("Logout Seller...")}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500 transition">
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
};

export default SellerHeader;
