import { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  nama: string;
  email: string;
  role: string;
  email_verified_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  register: (data: any) => Promise<any>;
  login: (data: { email: string; password: string }) => Promise<User>;
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
    await api.get("/sanctum/csrf-cookie");
  };

  const register = async (data: any) => {
    await getCsrf();
    const res = await api.post("/register", data);
    await checkAuth(); // otomatis login setelah register (opsional)
    return res.data;
  };

  // PERBAIKAN UTAMA: login sekarang RETURN user lengkap
  const login = async (data: { email: string; password: string }): Promise<User> => {
    await getCsrf();
    try {
      // 1. Login → dapat token dari Laravel Sanctum
      await api.post("/login", data);

      // 2. Ambil data user lengkap (termasuk role)
      const userResponse = await api.get("/user");
      const userData = userResponse.data as User;

      console.log("USER DARI BACKEND:", userData);   // <--- TAMBAHIN INI
    console.log("ROLE-nya adalah:", userData.role); // <--- DAN INI

      // 3. Simpan ke state
      setUser(userData);

      // 4. Return user biar bisa dipakai di LoginPage
      return userData;
    } catch (error: any) {
      // Tangani error yang sering muncul
      if (error.response?.status === 422) {
        throw new Error("Email atau password salah");
      }
      if (error.response?.status === 403) {
        throw new Error("EMAIL_NOT_VERIFIED");
      }
      throw new Error("Login gagal. Silakan coba lagi.");
    }
  };

  const resendVerification = async () => {
    await api.post("/email/resend");
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      // ignore error logout
    } finally {
      setUser(null);
      localStorage.removeItem("token"); // kalau kamu simpan manual
    }
  };

  const checkAuth = async () => {
    try {
      const res = await api.get("/user");
      setUser(res.data);
    } catch (error: any) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Cek auth saat aplikasi pertama kali dibuka
  useEffect(() => {
    const initializeAuth = async () => {

      if (user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get("/user");
        setUser(res.data);

        const urlParams = new URLSearchParams(window.location.search);
        const loginMethod = urlParams.get("login");

        if (loginMethod === "google") {
          window.history.replaceState({}, "", window.location.pathname);
          navigate("/dashboard", { replace: true });
        }
      } catch (error: any) {
        setUser(null);

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("error") === "google_failed") {
          window.history.replaceState({}, "", "/login");
          navigate("/login", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [user, navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        register,
        login,
        logout,
        resendVerification,
        checkAuth,
      }}
    >
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