<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellerOrderController extends Controller {
    
    // GET /api/seller/orders (Lihat semua pesanan yang masuk ke toko saya)
    public function index() {
        $user = Auth::user();

        // Cek apakah user punya toko
        if (!$user->toko) {
            return response()->json(['message' => 'Anda belum memiliki toko'], 403);
        }

        $tokoId = $user->toko->id;

        // Ambil Transaksi yang memiliki toko_id sesuai toko user
        // (Karena di tabel transaksi sekarang sudah ada kolom toko_id, jadi lebih mudah)
        $orders = Transaksi::where('toko_id', $tokoId)
            ->with(['user']) // Load data pembeli
            ->orderBy('created_at', 'desc')
            ->get();

        // Mapping data biar sesuai dengan frontend
        $data = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'invoice_number' => $order->invoice_number, // Sudah pakai invoice_number
                'customer_name' => $order->user ? $order->user->nama : 'Guest',
                'total_amount' => $order->total_harga, // Sudah pakai total_harga
                'status' => $order->status,
                'created_at' => $order->created_at,
            ];
        });

        return response()->json($data, 200);
    }

    // GET /api/seller/orders/{id} (Detail Pesanan)
    public function show($id) {
        $user = Auth::user();

        if (!$user->toko) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        // Ambil transaksi spesifik milik toko ini
        $order = Transaksi::with(['user', 'details.barang']) // Pakai relasi 'details'
            ->where('id', $id)
            ->where('toko_id', $user->toko->id) // Pastikan hanya bisa lihat order tokonya sendiri
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        // Mapping Detail Barang
        $mappedItems = $order->details->map(function ($detail) {
            return [
                'id' => $detail->id,
                'product_name' => $detail->nama_barang_snapshot, // Pakai snapshot nama barang
                'quantity' => $detail->jumlah,
                'price' => $detail->harga_satuan,
                'image' => $detail->gambar_snapshot
            ];
        });

        $response = [
            'id' => $order->id,
            'invoice_number' => $order->invoice_number,
            'status' => $order->status,
            'customer_name' => $order->user->nama,
            'shipping_address' => $order->alamat_pengiriman ?? 'Alamat tidak tersedia',
            'total_amount' => $order->total_harga,
            'created_at' => $order->created_at,
            'items' => $mappedItems,
        ];

        return response()->json($response, 200);
    }

    // PUT /api/seller/orders/{id}/status (Update Status Pesanan)
    public function updateStatus(Request $request, $id) {
        // Validasi status sesuai ENUM di database
        $request->validate([
            'status' => 'required|string|in:pending,paid,shipped,completed,cancelled'
        ]);

        $user = Auth::user();

        // Cari order milik toko ini
        $order = Transaksi::where('id', $id)
            ->where('toko_id', $user->toko->id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        // Update status
        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Status berhasil diperbarui',
            'status' => $order->status
        ], 200);
    }
}