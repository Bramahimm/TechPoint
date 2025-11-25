import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "@/components/layout/Footer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import TechPointLogo from "@/assets/images/Logo_TechPoint.webp";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({ nama: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { register } = useAuth(); // ambil register dari AuthContext
  const navigate = useNavigate(); // untuk redirect

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await register(form); // panggil register dari AuthContext
      setMessage("Registrasi berhasil! Silakan verifikasi email Anda.");
      setTimeout(() => navigate("/login"), 1500); // redirect ke login setelah sukses
    } catch {
      setMessage("Registrasi gagal, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex justify-center bg-orange-400 px-6 md:px-20 py-16">
        <div className="flex w-full max-w-7xl items-center justify-between gap-10">
          <div className="hidden md:flex flex-col items-center text-white w-1/2">
            <img
              src={TechPointLogo}
              alt="TechPoint"
              className="w-64 mb-6 drop-shadow-lg"
            />
            <p className="text-2xl">Temukan Barang Elektronik Murah</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-black">
              Register TechPoint
            </h2>
            {message && (
              <p
                className={`text-sm mb-4 ${
                  message.includes("berhasil")
                    ? "text-green-500"
                    : "text-red-500"
                }`}>
                {message}
              </p>
            )}
            <Input
              name="nama"
              type="text"
              placeholder="Nama Lengkap"
              value={form.nama}
              onChange={handleChange}
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Memproses..." : "Register"}
            </Button>
            <p className="text-sm text-center mt-4">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
