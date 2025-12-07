import SidebarAdmin from "@/components/layout/SidebarAdmin.tsx";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}