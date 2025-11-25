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

// ADMIN PAGES
import AdminLayout from "@/components/layout/AdminLayout";
import DashboardPage from "@/features/admin/DashboardPage";

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

      {/* ADMIN (tidak pakai ProtectedRoute dulu) */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <DashboardPage />
          </AdminLayout>
        }
      />
    </Routes>
  );
}
