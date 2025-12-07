import { Routes, Route } from "react-router-dom";

// USER PAGES
import HomePage from "@/features/shop/HomePage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import ProfilePage from "@/features/user/ProfilePage";
import CartPage from "@/features/shop/CartPage";
import CheckoutPage from "@/features/shop/CheckoutPage";

import OrderPage from "@/features/user/OrderPage";
import SellerRouter from "@/features/seller/SellerRouter";
import TokoCreationPage from "@/features/seller/Toko/TokoCreationPage";
import SellerLayoutWrapper from "@/features/seller/SellerLayoutWrapper";

// ADMIN PAGES ← SEMUA IMPORT SUDAH DITAMBAHIN
import AdminLayout from "@/components/layout/AdminLayout";
import DashboardPage from "@/features/admin/DashboardPage";
import UsersPage from "@/features/admin/UsersPage";
import ProductsPage from "@/features/admin/ProductsPage";
import OrdersPage from "@/features/admin/OrdersPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* PROTECTED USER */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <HomePage />
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

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <DashboardPage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <UsersPage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminLayout>
            <ProductsPage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminLayout>
            <OrdersPage />
          </AdminLayout>
        }
      />
    </Routes>
  );
}
