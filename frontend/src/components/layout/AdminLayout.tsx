
import { Outlet } from "react-router-dom";
import SidebarAdmin from "@/components/layout/SidebarAdmin";

// Hapus prop children dan interfacenya
export default function AdminLayout() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
