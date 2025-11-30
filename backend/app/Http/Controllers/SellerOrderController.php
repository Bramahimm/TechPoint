<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Illuminate\Http\Request;
use App\Models\DetailTransaksi;
use Illuminate\Support\Facades\auth;

class SellerOrderController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if (!$user->toko) {
            return response()->json(['message' => 'Anda belum memiliki toko'], 403);
        }

        $tokoId = $user->toko->id;

        // Ambil Transaksi yang memiliki DetailTransaksi -> Barang -> milik Toko ini
        $orders = Transaksi::whereHas('detailTransaksi.barang', function ($query) use ($tokoId) {
            $query->where('toko_id', $tokoId);
        })
        ->with(['user']) // Load data pembeli
        ->orderBy('created_at', 'desc')
        ->get();

        // Mapping data agar sesuai dengan frontend OrderListPage.tsx
        $data = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'invoice_number' => $order->invoice_code ?? 'INV-' . $order->id,
                'customer_name' => $order->user->nama ?? 'Guest', // Sesuaikan nama kolom di tabel users
                'total_amount' => $order->total_harga,
                'status' => $order->status, // Pastikan value status sesuai dengan frontend
                'created_at' => $order->created_at,
            ];
        });

        return response()->json($data, 200);
    }

    // GET: /api/seller/orders/{id}
    // Menampilkan detail pesanan spesifik
    public function show($id)
    {
        $tokoId = Auth::user()->toko->id;

        // Ambil transaksi spesifik
        $order = Transaksi::with(['user', 'detailTransaksi.barang'])
            ->where('id', $id)
            ->firstOrFail();

        // Filter item hanya yang milik toko ini (jika 1 transaksi bisa beli dari banyak toko)
        $itemsMilikToko = $order->detailTransaksi->filter(function ($detail) use ($tokoId) {
            return $detail->barang->toko_id == $tokoId;
        });

        // Mapping Detail
        $mappedItems = $itemsMilikToko->map(function ($detail) {
            return [
                'id' => $detail->id,
                'product_name' => $detail->barang->nama,
                'quantity' => $detail->jumlah,
                'price' => $detail->harga_satuan, // Pastikan ada kolom ini di detail_transaksi
            ];
        });

        $response = [
            'id' => $order->id,
            'invoice_number' => $order->invoice_code ?? 'INV-' . $order->id,
            'status' => $order->status,
            'customer_name' => $order->user->nama,
            'shipping_address' => $order->alamat_pengiriman ?? 'Alamat tidak tersedia',
            'total_amount' => $order->total_harga, // Note: ini total global transaksi, mungkin perlu dihitung ulang per toko jika multi-vendor
            'created_at' => $order->created_at,
            'items' => $mappedItems->values(),
        ];

        return response()->json($response, 200);
    }

    // POST: /api/seller/orders/{id}/status
    // Update Status Pesanan
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:Menunggu Konfirmasi,Diproses,Dikirim,Selesai,Dibatalkan'
        ]);

        $order = Transaksi::findOrFail($id);
        
        // Update status
        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Status berhasil diperbarui',
            'status' => $order->status
        ], 200);
    }
}
