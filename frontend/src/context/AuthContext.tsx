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
  login: (data: any) => Promise<any>;
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
    return res.data;
  };

  const login = async (data: any) => {
    await getCsrf();
    try {
      const res = await api.post("/login", data);
      await checkAuth();
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("EMAIL_NOT_VERIFIED");
      }
      throw error;
    }
  };

  const resendVerification = async () => {
    await api.post("/email/resend");
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const res = await api.get("/user");
      setUser(res.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setUser(null);
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
