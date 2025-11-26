<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Import Model yang dibutuhkan
use App\Models\User;
use App\Models\Barang;    // Asumsi nama model produk adalah Barang
use App\Models\Transaksi; // Asumsi nama model order adalah Transaksi

class DashboardController extends Controller
{
    // Menampilkan data statistik dashboard admin
    public function index()
    {
        // 1. Ambil data statistik dari Database
        $totalUsers = User::count();
        $totalProducts = Barang::count();
        $totalOrders = Transaksi::count(); // Atau logic lain, misal: Transaksi::where('status', 'paid')->count();

        // 2. Return JSON agar bisa dibaca oleh React
        return response()->json([
            'message' => 'Data dashboard berhasil diambil',
            'data' => [
                'total_users' => $totalUsers,
                'total_products' => $totalProducts,
                'total_orders' => $totalOrders,
            ]
        ], 200);
    }
}