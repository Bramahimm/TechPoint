import { createContext, useContext, useState, useEffect, useCallback } from "react"; // Tambah useCallback
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    nama: string;
    email: string;
    role: string;
    email_verified_at?: string | null;
    toko?: { id: string; nama_toko: string;} | null; 
    created_at: string;
    updated_at: string;
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