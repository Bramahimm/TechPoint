import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/api";

interface User {
  id?: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: {
    nama: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const isAuthenticated = !!token;

  // === 1. Fetch current user jika ada token ===
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Laravel Sanctum: /api/user
        setUser(res.data);
      } catch (err) {
        console.error("Gagal ambil profil:", err);
        logout(); // token invalid → logout
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // === 2. Login ===
  const login = async (data: { email: string; password: string }) => {
    const res = await api.post("/login", data);

    const token = res.data.access_token;
    localStorage.setItem("token", token);
    setToken(token);

    // Ambil data user
    const userRes = await api.get("/profile");
    setUser(userRes.data);
  };

  // === 3. Register ===
  const register = async (data: {
    nama: string;
    email: string;
    password: string;
  }) => {
    const res = await api.post("/register", data);
    return res.data;
  };

  // === 4. Logout ===
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
