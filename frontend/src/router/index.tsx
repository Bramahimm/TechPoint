import { Routes, Route } from "react-router-dom";
// Import semua komponen yang sudah ada
import HomePage from "@/features/shop/HomePage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import ProfilePage from "@/features/user/ProfilePage";

import CartPage from "@/features/shop/CartPage";
// Import Halaman Checkout yang baru dibuat
import CheckoutPage from "@/features/shop/CheckoutPage";
import OrderPage from "@/features/user/OrderPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Cart dan Checkout biasanya memerlukan login, jadi diletakkan di ProtectedRoute */}

      {/* Protected Routes: Pengguna Harus Login */}
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

      {/* ROUTE BARU: Halaman Checkout */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      {/* Opsional: Tambahkan Route fallback 404 jika ada */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}
