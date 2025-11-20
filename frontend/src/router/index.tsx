import { Routes, Route } from "react-router-dom";
import HomePage from "@/features/shop/HomePage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";

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
  );
}
