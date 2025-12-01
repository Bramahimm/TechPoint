import { useState } from "react";
import { Link } from "react-router-dom";

import Footer from "@/components/layout/Footer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import TechPointLogo from "@/assets/images/Logo_TechPoint.webp";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { register } = useAuth(); // ambil register dari AuthContext

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await register({
        nama: form.nama,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      setMessage(
        "Registrasi berhasil! Silakan cek email Anda untuk verifikasi."
      );
    } catch (err: any) {
      console.error("REGISTER ERROR:", err);
      const errorMsg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat()[0] ||
        "Registrasi gagal, coba lagi.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex justify-center bg-orange-500 px-6 md:px-20 py-16">
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
              <>
                {message.includes("berhasil") ? (
                  <div className="text-center space-y-4 p-4">
                    <p className="text-green-600 font-semibold text-lg pb-4">
                      {message}
                    </p>
                    <Link to="/login">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 text-sm">
                        Kembali Login
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 text-center font-medium">
                    {message}
                  </p>
                )}
              </>
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
            <Input
              name="password_confirmation"
              type="password"
              placeholder="Ulangi Password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition transform hover:scale-105 font-bold"
              disabled={loading}>
              {loading ? "Memproses..." : "Register"}
            </Button>
            <p className="text-sm text-center mt-4">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
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
