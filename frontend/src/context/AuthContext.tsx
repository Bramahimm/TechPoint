<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Setup base URL agar tidak perlu ngetik ulang http://127.0.0.1:8000/api terus
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Pastikan port Laravel kamu 8000
  headers: {
    "Content-Type": "application/json",
  },
});
=======
import { createContext, useContext, useState, useEffect, useCallback } from "react"; // Tambah useCallback
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
>>>>>>> 1c1f00469ff9d80460dcda467a83a5167f203fc4

interface User {
    id: string;
    nama: string;
    email: string;
    role: string;
    email_verified_at?: string | null;
    toko?: { id: string; nama_toko: string;} | null; 
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    register: (data: any) => Promise<any>;
    login: (data: { email: string; password: string }) => Promise<User>;
    loginWithGoogle: () => Promise<void>; 
    logout: () => Promise<void>;
    resendVerification: () => Promise<void>;
    checkAuth: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const getCsrf = async () => {
        try {
            await api.get("/sanctum/csrf-cookie");
        } catch (error) {
            console.error("CSRF cookie gagal diambil, lanjutkan...", error);
        }
    };

<<<<<<< HEAD
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
=======
    const checkAuth = useCallback(async () => {
        try {
            const res = await api.get("/user");
            setUser(res.data);
        } catch (error: any) {
            setUser(null);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []); 

    const register = async (data: any) => {
        await getCsrf();
        const res = await api.post("/register", data);
        await checkAuth();
        return res.data;
    };

    const login = async (data: {
        email: string;
        password: string;
    }): Promise<User> => {
        await getCsrf();
        await api.post("/login", data); 
        await checkAuth(); 
        
        // Cek user setelah checkAuth selesai (user state akan terisi di dalam checkAuth)
        const currentUser = await api.get("/user").then(res => res.data as User);
        if (!currentUser) throw new Error("Login gagal");
        return currentUser; // Kembalikan user yang valid
    };

    const loginWithGoogle = async () => {
        // Logika redirect/callback Google, checkAuth akan dipanggil di callback
        await checkAuth(); 
        if (user) {
            navigate("/dashboard", { replace: true });
        }
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout gagal", error);
        } finally {
            setUser(null);
            navigate("/login", { replace: true });
        }
    };

    useEffect(() => {
        checkAuth();
    }, [checkAuth]); 

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                register,
                login,
                loginWithGoogle, 
                logout,
                resendVerification: async () => {
                    await api.post("/email/resend");
                },
                checkAuth,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
>>>>>>> 1c1f00469ff9d80460dcda467a83a5167f203fc4
