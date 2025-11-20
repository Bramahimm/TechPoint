import React, { createContext, useContext, useState, useEffect } from "react";

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

  useEffect(() => {
    if (token) {
      // TODO: fetch user profile dari backend Laravel
      setUser({ name: "Bram Ahimsa", email: "bram@example.com" });
    }
  }, [token]);

  const login = async (data: { email: string; password: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const fakeToken = "FAKE_TOKEN";
    localStorage.setItem("token", fakeToken);
    setToken(fakeToken);
    setUser({ name: "Bram", email: data.email });
  };

  const register = async (data: {
    nama: string;
    email: string;
    password: string;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Register data:", data);
  };

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
