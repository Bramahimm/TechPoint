// src/router/index.tsx (REVISI LENGKAP)

import { Routes, Route } from "react-router-dom";

// Layouts & Wrappers
import MainLayout from "@/components/layout/MainLayout"; // 👈 Digunakan sebagai layout utama
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import SellerLayoutWrapper from "@/features/seller/SellerLayoutWrapper";

// Public Pages
import HomePage from "@/features/shop/HomePage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ProductDetail from "@/features/shop/ProductDetail"; // Halaman Detail Produk

// User Pages
import ProfilePage from "@/features/user/ProfilePage";
import CartPage from "@/features/shop/CartPage";
import CheckoutPage from "@/features/shop/CheckoutPage";
import OrderPage from "@/features/user/OrderPage";

// Seller Pages (Inner Routes)
import TokoCreationPage from "@/features/seller/Toko/TokoCreationPage";
import SellerRouter from "@/features/seller/SellerRouter";

// Admin Pages
import DashboardPage from "@/features/admin/DashboardPage";
import UsersPage from "@/features/admin/UsersPage";
import ProductsPage from "@/features/admin/ProductsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/product/:slug" element={<ProductDetail />} />

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

      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}
