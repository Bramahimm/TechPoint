import { Routes, Route } from "react-router-dom";

// USER PAGES
import HomePage from "@/features/shop/HomePage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
<<<<<<< HEAD

export default function AppRouter() {
  return (
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes (contoh untuk user yang sudah login) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div>Profile Page (akan diganti dengan ProfilePage.tsx)</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <div>Orders Page (akan diganti dengan OrdersPage.tsx)</div>
            </ProtectedRoute>
          }
        />
      </Routes>
=======
import ProfilePage from "@/features/user/ProfilePage";
import CartPage from "@/features/shop/CartPage";
import CheckoutPage from "@/features/shop/CheckoutPage";

import OrderPage from "@/features/user/OrderPage";
import SellerRouter from "@/features/seller/SellerRouter";
import TokoCreationPage from "@/features/seller/Toko/TokoCreationPage";
import SellerLayoutWrapper from "@/features/seller/SellerLayoutWrapper";

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
>>>>>>> 1c1f00469ff9d80460dcda467a83a5167f203fc4
  );
}
