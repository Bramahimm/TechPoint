// src/features/seller/layout/SellerSidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

const SELLER_MENU = [
  { name: "Dashboard", path: "/seller/dashboard", icon: LayoutDashboard },
  { name: "Produk Saya", path: "/seller/products", icon: Package },
  { name: "Pesanan Masuk", path: "/seller/orders", icon: ShoppingCart },
];
const SellerSidebar: React.FC = () => {
  return (
    <aside className="w-60 bg-white border-r p-4 hidden md:block flex-shrink-0">
      <nav className="space-y-2">
        {SELLER_MENU.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors text-sm font-medium 
                                ${
                                  isActive
                                    ? "bg-orange-500 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`
              }>
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default SellerSidebar;
