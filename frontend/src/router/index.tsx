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
            <SellerRouter />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin>
          <AdminLayout>
            <DashboardPage />
          </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requireAdmin>
          <AdminLayout>
            <UsersPage />
          </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute requireAdmin>
          <AdminLayout>
            <ProductsPage />
          </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute requireAdmin>
          <AdminLayout>
            <OrdersPage />
          </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
