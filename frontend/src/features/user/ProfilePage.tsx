// src/pages/ProfilePage.tsx   (atau src/features/user/ProfilePage.tsx)
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const { user, checkAuth, isLoading: authLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [nama, setNama] = useState(user?.nama || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  // Kalau masih loading dari AuthContext
  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading profil...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600">Kamu belum login.</p>
        </div>
        <Footer />
      </>
    );
  }

  // Format tanggal bergabung
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Simpan perubahan nama
  const handleSaveProfile = async () => {
    if (!nama.trim() || nama.trim() === user.nama) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      await api.put("/profile/update", { nama: nama.trim() });
      toast.success("Nama berhasil diperbarui!");
      await checkAuth(); // refresh data user di context
      setIsEditing(false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Gagal memperbarui nama"
      );
    } finally {
      setLoading(false);
    }
  };

  // Ganti password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !newPasswordConfirmation) {
      toast.error("Semua kolom password harus diisi");
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      toast.error("Password baru dan konfirmasi tidak cocok");
      return;
    }

    setLoading(true);
    try {
      await api.post("/profile/change-password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      });
      toast.success("Password berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");
    } catch (err: any) {
      const msg =
        err.response?.data?.errors?.current_password?.[0] ||
        err.response?.data?.message ||
        "Gagal mengubah password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          Profil Pengguna
        </h1>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header Profil */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-10 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold border-4 border-white">
                {user.nama.charAt(0).toUpperCase()}
              </div>

              <div className="text-center sm:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="text-3xl font-bold bg-white/20 border-b-2 border-white/50 text-white placeholder-white/70 px-3 py-1 rounded focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <h2 className="text-3xl font-bold">{user.nama}</h2>
                )}
                <p className="text-blue-100 mt-1">{user.email}</p>
                <p className="text-sm mt-3 opacity-90">
                  Bergabung sejak {formatDate(user.created_at)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setNama(user.nama);
                      setIsEditing(false);
                    }}
                    className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading || !nama.trim()}
                    className="px-8 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setNama(user.nama);
                    setIsEditing(true);
                  }}
                  className="px-8 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100"
                >
                  Edit Profil
                </button>
              )}
            </div>
          </div>

          {/* Informasi Akun */}
          <div className="p-8 space-y-10">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Informasi Akun
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <div>
                  <span className="font-medium text-gray-600">Nama Lengkap</span>
                  <p className="mt-1 text-gray-900">{user.nama}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email</span>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Role</span>
                  <p className="mt-1 text-gray-900 capitalize">
                    {user.role === "pembeli" ? "Pembeli" : user.role}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status Email</span>
                  <p className="mt-1">
                    {user.email_verified_at ? (
                      <span className="text-green-600 font-medium">Terverifikasi</span>
                    ) : (
                      <span className="text-amber-600 font-medium">Belum diverifikasi</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Ganti Password */}
            <div className="border-t pt-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Ganti Password
              </h3>
              <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    value={newPasswordConfirmation}
                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {loading ? "Mengubah..." : "Ubah Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-center" />
    </>
  );
}