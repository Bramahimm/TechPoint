import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {  // PAKAI PROXY! Bukan localhost:8000
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setNama(data.nama || "");
          setEmail(data.email || "");
        } else {
          alert("Gagal memuat profil");
        }
      } catch (err) {
        alert("Gagal terhubung ke server");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleShowPasswordForm = () => {
    setPasswordLama("");
    setPasswordBaru("");
    setKonfirmasiPassword("");
    setShowPasswordForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi password kalau form muncul
    if (showPasswordForm) {
      if (!passwordLama) {
        alert("Password lama wajib diisi!");
        return;
      }
      if (!passwordBaru) {
        alert("Password baru tidak boleh kosong!");
        return;
      }
      if (passwordBaru !== konfirmasiPassword) {
        alert("Password baru dan konfirmasi tidak sama!");
        return;
      }
      if (passwordBaru.length < 8) {
        alert("Password baru minimal 8 karakter!");
        return;
      }
    }

    const body: any = { nama, email };

    // Hanya kirim password kalau user mau ganti
    if (showPasswordForm && passwordBaru) {
      body.password_lama = passwordLama;
      body.password_baru = passwordBaru;
    }

    try {
      const res = await fetch("/api/user/update", {  // PAKAI PROXY!
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal memperbarui profil");
        return;
      }

      alert("Profil berhasil diperbarui!");
      setShowPasswordForm(false);
      setPasswordLama("");
      setPasswordBaru("");
      setKonfirmasiPassword("");
      navigate("/profile");
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    }
  };

  if (loading) {
    return <p className="text-center mt-20 text-gray-600">Memuat profil...</p>;
  }

  return (
    <>
      {/* TRICK ANTI AUTOFILL — 100% AMPUH */}
      <div style={{ display: "none" }}>
        <input type="text" autoComplete="username" />
        <input type="password" autoComplete="current-password" />
        <input type="password" autoComplete="new-password" />
      </div>

      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Edit Profil
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          {/* Tombol Ganti Password */}
          {!showPasswordForm ? (
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={handleShowPasswordForm}
                className="text-blue-600 hover:text-blue-800 font-medium underline text-sm"
              >
                Ganti Password
              </button>
            </div>
          ) : (
            <div className="pt-6 border-t border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Ganti Password</h3>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  ✕ Batal
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Lama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordLama}
                    onChange={(e) => setPasswordLama(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Wajib diisi untuk konfirmasi"
                    autoComplete="off"
                    name="old-password"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    name="new-password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    value={konfirmasiPassword}
                    onChange={(e) => setKonfirmasiPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    autoComplete="new-password"
                    name="confirm-password"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tombol Aksi */}
          <div className="flex gap-3 pt-8">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition duration-200"
            >
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-medium transition duration-200"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </>
  );
}