// src/features/seller/SellerRouter.tsx
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import SellerHeader from "./layout/SellerHeader";
import SellerSidebar from "./layout/SellerSidebar";

// Import halaman-halaman
import SellerDashboardPage from "./Dashboard/SellerDashboardPage";
import ProductListPage from "./Products/ProductListPage";
import ProductFormPage from "./Products/ProductFormPage";
import OrderListPage from "./Orders/OrderListPage";
import OrderDetailPage from "./Orders/OrderDetailPage";

// Komponen Layout Seller
const SellerLayout: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <SellerHeader />
    <div className="flex flex-grow overflow-hidden">
      <SellerSidebar />
      <main className="flex-grow p-6 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  </div>
);


const SellerRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SellerLayout />}>
        <Route index element={<SellerDashboardPage />} />
        <Route path="dashboard" element={<SellerDashboardPage />} />

        <Route path="products" element={<ProductListPage />} />
        <Route path="products/add" element={<ProductFormPage />} />
        <Route path="products/edit/:id" element={<ProductFormPage />} />

        <Route path="orders" element={<OrderListPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
      </Route>
    </Routes>
  );
};

export default SellerRouter;
