import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

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
                {user.name?.[0]}
              </div>

              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Bergabung sejak: Januari 2025
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
                <span>{user.name}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Email</span>
                <span>{user.email}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Username</span>
                <span>user123</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Role</span>
                <span>Pengguna</span>
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
                <span>+62 812 3456 7890</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Alamat</span>
                <span>Jl. Mawar No. 10, Jakarta</span>
              </div>
            </div>

            {/* Tombol Edit */}
            <div className="mt-8">
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
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
