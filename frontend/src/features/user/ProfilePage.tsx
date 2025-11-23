import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Profil Pengguna</h1>
        {user ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <p>
              <strong>Nama:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        ) : (
          <p>Data user tidak tersedia.</p>
        )}
      </div>
      <Footer />
    </>
  );
}
