import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TechPointLogo from "@/assets/images/Logo_TechPoint.webp";
import { useAuth } from "@/context/AuthContext"; // tambahkan

export default function LoginPage() {
  const [form, setform] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth(); // ambil login dari AuthContext
  const navigate = useNavigate(); // untuk redirect

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form); // panggil login dari AuthContext
      navigate("/"); // redirect setelah login sukses
    } catch {
      setError("login gagal, coba lagi!");
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

          {/* Form sebelah kanan */}
          <form
            className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
              Login TechPoint
            </h2>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <Input
              type="email"
              name="email"
              placeholder="Masukkan Email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="password"
              placeholder="Masukkan Password"
              value={form.password}
              onChange={handleChange}
            />

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
