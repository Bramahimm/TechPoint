import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TechPointLogo from "@/assets/images/Logo_TechPoint.webp";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

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
        navigate("/admin/dashboard"); // sesuaikan path kalau beda
      } else if (user.role === "penjual") {
        navigate("/seller/dashboard"); // kalau kamu punya
      } else {
        navigate("/"); // user biasa → homepage
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
            onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
              Login TechPoint
            </h2>
            {/* Pesan Error / Sukses */}
            {error && (
              <div
                className={`mb-6 p-4 rounded-xl text-center font-medium border ${
                  error.includes("dikirim ulang") ||
                  error.includes("Silakan cek email")
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-red-50 text-red-700 border-red-300"
                }`}>
                {error}
              </div>
            )}
            {/* Tombol Kirim Ulang */}
            {showResend && (
              <div className="text-center mb-6">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-orange-600 font-semibold underline hover:text-orange-700 transition">
                  Kirim Ulang Email Verifikasi
                </button>
              </div>
            )}
            <Input
              type="email"
              name="email"
              placeholder="Masukkan Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Masukkan Password"
              value={form.password}
              onChange={handleChange}
              required
              className="mb-6"
            />
            <Button
              type="submit"
              disabled={loading || !form.email || !form.password}
              className="w-full py-3 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? "Memproses..." : "Login"}
            </Button>
            <p className="text-right mt-4">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline text-sm">
                Lupa Password?
              </Link>
            </p>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Atau login dengan
                  </span>
                </div>
              </div>

              <GoogleLoginButton
                onSuccess={() => console.log("Google login success")}
                onError={() => setError("Login Google gagal. Coba lagi.")}
              />
            </div>
            <p className="text-center mt-8 text-gray-600 border-t pt-6">
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
