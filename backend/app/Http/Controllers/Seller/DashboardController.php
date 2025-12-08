<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $toko = $user->toko;

        if (!$toko) {
            return response()->json(['message' => 'Anda belum memiliki toko'], 403);
        }

        // Total produk aktif milik seller
        $totalProducts = $toko->products()->count();

        // Hitung order berdasarkan status (dari tabel seller_orders atau orders)
        // Sesuaikan nama tabel & kolom status sesuai struktur DB kamu
        $orders = $toko->orders()->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $stats = [
            'total_produk' => $totalProducts,
            'pesanan_baru' => $orders->get('Menunggu Konfirmasi', 0),
            'diproses'     => $orders->get('Diproses', 0) + $orders->get('Menunggu Diproses', 0),
            'dikirim'      => $orders->get('Dikirim', 0),
            'selesai'      => $orders->get('Selesai', 0),
            'dibatalkan'   => $orders->get('Dibatalkan', 0),
        ];

        return response()->json([
            'message' => 'Dashboard data loaded successfully',
            'data'    => $stats
        ]);
    }
}