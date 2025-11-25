export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">Total Users: 0</div>
        <div className="bg-white p-4 rounded shadow">Total Orders: 0</div>
        <div className="bg-white p-4 rounded shadow">Total Products: 0</div>
      </div>
    </div>
  );
}
