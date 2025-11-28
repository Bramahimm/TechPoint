// SidebarAdmin.tsx
import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/images/Logo_TechPoint.webp";

const SidebarAdmin = () => {
  const navigate = useNavigate();

  const menu = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users",      path: "/admin/users" },
    { label: "Products",   path: "/admin/products" },
    { label: "Orders",     path: "/admin/orders" },
  ];

  const handleLogout = () => {
    // Hapus token dari localStorage (sesuaikan key kalau kamu simpan di tempat lain)
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // kalau kamu simpan data user juga

    // Optional: panggil API logout kalau mau invalidate token di backend
    // axios.post('/api/logout') gak wajib karena Sanctum plain token gak perlu

    // Redirect ke halaman login
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-64 min-h-screen bg-[#0EA5E9] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 text-center">
        <img
          src={logo}
          alt="Techpoint Logo"
          className="h-28 w-auto mx-auto transition-all duration-300 hover:scale-110"
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 px-6">
        <div className="flex flex-col gap-3">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block py-3 px-4 rounded-lg transition ${
                  isActive
                    ? "bg-white/20 font-medium shadow-md"
                    : "hover:bg-white/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

    
      <div className="p-6 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-lg bg-gray-600 hover:bg-gray-700 transition font-medium flex items-center justify-center gap-2 shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Keluar
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;