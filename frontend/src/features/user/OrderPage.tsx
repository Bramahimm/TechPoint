import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function OrdersPage() {
  const orders = [
    { id: "ORD001", date: "2025-11-20", status: "Selesai", total: 250000 },
    { id: "ORD002", date: "2025-11-18", status: "Diproses", total: 150000 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Riwayat Pesanan</h1>
        <table className="w-full border-collapse border border-gray-200">
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">{order.date}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">
                  Rp {order.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <Footer />
    </div>
  );
}
