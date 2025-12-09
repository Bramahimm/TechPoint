// src/router/index.tsx (FINAL CHECKOUT ROUTES)

import { Routes, Route } from "react-router-dom";

// Layouts & Wrappers
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import SellerLayoutWrapper from "@/features/seller/SellerLayoutWrapper";

// Public Pages
import HomePage from "@/features/shop/HomePage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ProductDetail from "@/features/shop/ProductDetail";

// User Pages
import ProfilePage from "@/features/user/ProfilePage";
import CartPage from "@/features/shop/CartPage";
import CheckoutPage from "@/features/shop/CheckoutPage";
import OrderPage from "@/features/user/OrderPage";

// 💡 Impor Order Status
import OrderStatusPage from "@/features/shop/OrderStatusPage";

// Seller Pages
import TokoCreationPage from "@/features/seller/Toko/TokoCreationPage";
import SellerRouter from "@/features/seller/SellerRouter";

// Admin Pages
import DashboardPage from "@/features/admin/DashboardPage";
import UsersPage from "@/features/admin/UsersPage";
import ProductsPage from "@/features/admin/ProductsPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductDetail />} />

        {/* Midtrans Order Status Routes */}
        <Route path="/order/success" element={<OrderStatusPage />} />
        <Route path="/order/pending" element={<OrderStatusPage />} />
        <Route path="/order/error" element={<OrderStatusPage />} />
        <Route
          path="/order/status/:invoiceNumber"
          element={<OrderStatusPage />}
        />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        {/* 💡 Riwayat Pesanan */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Seller Routes */}
      <Route
        path="/seller/*"
        element={
          <ProtectedRoute>
            <SellerLayoutWrapper />
          </ProtectedRoute>
        }>
        <Route path="toko/create" element={<TokoCreationPage />} />
        <Route path="*" element={<SellerRouter />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}
