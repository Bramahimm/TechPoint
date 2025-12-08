<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Transaksi;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            return response()->json([
                'total_users' => User::count(),
                'total_products' => Product::count(),
                'total_orders' => Transaksi::count(),
                'total_penjual' => User::where('role', 'penjual')->count(),
                'total_revenue' => Transaksi::whereIn('status', ['completed', 'complete', 'selesai', 'success'])
                    ->sum('total_harga') ?: 0,
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard error: ' . $e->getMessage());
            return response()->json([
                'total_users' => 0,
                'total_products' => 0,
                'total_orders' => 0,
                'total_penjual' => 0,
                'total_revenue' => 0,
            ]);
        }
    }
}