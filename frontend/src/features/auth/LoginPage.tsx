import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TechPointLogo from "@/assets/images/Logo_TechPoint.webp";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);

  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowResend(false);

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.message === "EMAIL_NOT_VERIFIED") {
        setError("Email belum diverifikasi. Silakan cek email Anda.");
        setShowResend(true);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Email atau password salah");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification();
      setError("Link verifikasi telah dikirim ulang ke email Anda!");
      setShowResend(false);
    } catch {
      setError("Gagal mengirim ulang. Coba lagi nanti.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex justify-center bg-orange-500 px-6 md:px-20 py-16">
        <div className="flex w-full max-w-7xl items-center justify-between gap-10">
          {/* Kiri - Branding */}
          <div className="hidden md:flex flex-col items-center text-white w-1/2">
            <img
              src={TechPointLogo}
              alt="TechPoint"
              className="w-64 mb-6 drop-shadow-2xl"
            />
            <h1 className="text-4xl font-bold mb-3 drop-shadow-md">
              Selamat Datang di TechPoint
            </h1>
            <p className="text-xl text-center">
              Temukan Barang Elektronik Murah & Berkualitas
            </p>
          </div>

          {/* Form Login */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              Masuk ke Akun Anda
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
              className="mb-4"
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
              <Link
                to="/register"
                className="text-orange-600 font-bold hover:underline">
                Register Sekarang
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
