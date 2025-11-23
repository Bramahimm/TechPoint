import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Setup base URL agar tidak perlu ngetik ulang http://127.0.0.1:8000/api terus
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Pastikan port Laravel kamu 8000
  headers: {
    "Content-Type": "application/json",
  },
});

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

  // Function untuk set token ke header axios setiap kali ada request
  const setAxiosToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  // 1. Cek User saat aplikasi pertama kali dimuat (jika ada token tersimpan)
  useEffect(() => {
    if (token) {
      setAxiosToken(token);
      api
        .get("/user") // Request ke Laravel: Route::get('/user')
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          // Jika token expired/tidak valid, logout otomatis
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  // 2. Fungsi Login
  const login = async (data: { email: string; password: string }) => {
    try {
      // Request ke Laravel: Route::post('/login')
      const response = await api.post("/login", data);

      const { token, user } = response.data;

      // Simpan data
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      setAxiosToken(token);
    } catch (error: any) {
      // Lempar error agar bisa ditangkap di LoginPage.tsx
      throw new Error(error.response?.data?.message || "Login gagal");
    }
  };

  // 3. Fungsi Register
  const register = async (data: {
    nama: string;
    email: string;
    password: string;
  }) => {
    try {
      // Request ke Laravel: Route::post('/register')
      const response = await api.post("/register", {
        nama: data.nama,
        email: data.email,
        password: data.password,
      });

      // Opsional: Jika ingin langsung login setelah register
      // const { token, user } = response.data;
      // localStorage.setItem("token", token);
      // setToken(token);
      // setUser(user);

      console.log("Register Berhasil:", response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registrasi gagal");
    }
  };

  // 4. Fungsi Logout
  const logout = () => {
    // Request ke Laravel untuk hapus token di database (opsional tapi disarankan)
    if (token) {
      api.post("/logout").catch((err) => console.error(err));
    }

    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setAxiosToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
