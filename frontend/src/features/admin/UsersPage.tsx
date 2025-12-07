import { useEffect, useState } from "react";
import AdminPageWrapper from "./AdminPageWrapper";
import api from "../../services/api";

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  created_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Pagination {
  current_page: number;
  from: number;
  to: number;
  total: number;
  links: PaginationLink[];
  data: User[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async (page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users", {
        params: { page, search: searchTerm },
      });

      setUsers(response.data.data.data);
      // Laravel pagination structure: response.data.data adalah object pagination
      setPagination(response.data.data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers(pagination?.current_page || 1, search);
      alert("User berhasil dihapus");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menghapus user");
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role: newRole });
      fetchUsers(pagination?.current_page || 1, search);
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengubah role");
    }
  };

  return (
    <AdminPageWrapper title="Manage Users">
      {/* Search + Refresh */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
        <button
          onClick={() => fetchUsers(1, search)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Loading atau Table */}
      {loading ? (
        <p className="text-center py-20 text-gray-500">Loading users...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bergabung
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {user.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:ring-2 focus:ring-blue-500 ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "penjual"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <option value="pembeli">Pembeli</option>
                        <option value="penjual">Penjual</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.total > 15 && (
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-700">
              <p>
                Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} user
              </p>
              <div className="flex gap-1 mt-3 sm:mt-0">
                {pagination.links?.map((link, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (link.url) {
                        const page = new URL(link.url).searchParams.get("page");
                        fetchUsers(page ? Number(page) : 1, search);
                      }
                    }}
                    disabled={!link.url}
                    className={`px-3 py-1 rounded ${
                      link.active
                        ? "bg-blue-600 text-white"
                        : link.url
                        ? "bg-white hover:bg-gray-200 border"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminPageWrapper>
  );
}