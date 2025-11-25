// SidebarAdmin.tsx
import { NavLink } from "react-router-dom";
import logo from "@/assets/images/Logo_TechPoint.webp";   

const SidebarAdmin = () => {
  const menu = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users",      path: "/admin/users" },
    { label: "Products",   path: "/admin/products" },
    { label: "Orders",     path: "/admin/orders" },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#0EA5E9] text-white p-6">
      <div className="mb-10 flex justify-center">
        <img 
        src={logo} 
        alt="Techpoint Logo" 
        className="h-30 w-auto transition-all duration-300 hover:scale-110" 
        />
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-3">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `p-2 rounded transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SidebarAdmin;