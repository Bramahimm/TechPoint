import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/services/api";
import type { User } from "@/types/User";
import { useNavigate } from "react-router-dom";


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/user")
      .then(res => {
        setUser(res.data as User);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Memuat...</p>;

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Profil Pengguna
        </h1>

        {user ? (
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">

            {/* Header Profil */}
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold">
                {user.nama?.[0]}
              </div>

              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {user.nama}
                </p>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Bergabung sejak: {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}
                </p>
              </div>
            </div>

            <hr className="my-6" />

            {/* Info Akun */}
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Informasi Akun
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Nama Lengkap</span>
                <span>{user.nama}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Email</span>
                <span>{user.email}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Role</span>
                <span>{user.role}</span>
              </div>
            </div>

            <hr className="my-6" />

            {/* Info Kontak */}
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Informasi Kontak
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">No. Telepon</span>
                <span>-</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Alamat</span>
                <span>-</span>
              </div>
            </div>

            <div className="mt-8">
              <button 
              onClick={() => navigate("/profile/edit")} 
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                Edit Profil
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-lg">Data user tidak tersedia.</p>
        )}
      </div>

      <Footer />
    </>
  );
}
