import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TechPointLogo from "@/assets/images/Logo_TechPoint.webp";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(form); // sekarang langsung dapat object user + role

      // Redirect berdasarkan role
      if (user.role === "admin") {
        navigate("/admin/dashboard");        // sesuaikan path kalau beda
      } else if (user.role === "penjual") {
        navigate("/seller/dashboard");       // kalau kamu punya
      } else {
        navigate("/");                       // user biasa → homepage
      }
    } catch (err: any) {
      if (err.message === "EMAIL_NOT_VERIFIED") {
        setError("Email belum diverifikasi. Cek inbox atau folder spam.");
      } else {
        setError(err.message || "Login gagal. Email atau password salah.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex justify-center bg-orange-400 px-6 md:px-20 py-16">
        <div className="flex w-full max-w-7xl items-center justify-between gap-10">
          {/* Kiri */}
          <div className="hidden md:flex flex-col items-center text-white w-1/2">
            <img
              src={TechPointLogo}
              alt="TechPoint"
              className="w-64 mb-6 drop-shadow-lg"
            />
            <p className="text-2xl">Temukan Barang Elektronik Murah</p>
          </div>

          {/* Form kanan */}
          <form
            className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
              Login TechPoint
            </h2>

            {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

            <Input
              type="email"
              name="email"
              placeholder="Masukkan Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="mt-4">
              <Input
                type="password"
                name="password"
                placeholder="Masukkan Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Memproses..." : "Login"}
            </Button>

            <p className="text-sm text-center mt-4">
              Belum punya akun?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}