<?php
// app/Http/Controllers/Seller/SellerOrderController.php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellerOrderController extends Controller
{
    private function mapStatus($status)
    {
        return match ($status) {
            'pending'   => 'Menunggu Konfirmasi',
            'paid'      => 'Diproses',
            'shipped'   => 'Dikirim',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
            default     => 'Menunggu Konfirmasi',
        };
    }

    private function reverseMapStatus($frontendStatus)
    {
        return match ($frontendStatus) {
            'Menunggu Konfirmasi' => 'pending',
            'Diproses'            => 'paid',
            'Dikirim'             => 'shipped',
            'Selesai'             => 'completed',
            default               => 'pending',
        };
    }

    // GET /api/seller/orders → Daftar pesanan masuk ke toko seller
    public function index()
    {
        $user = Auth::user();

        // Pastikan user punya toko
        if (!$user?->toko) {
            return response()->json(['message' => 'Anda belum memiliki toko'], 403);
        }

        $orders = Transaksi::with(['user', 'details'])
            ->where('toko_id', $user->toko->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($t) {
                return [
                    'id'               => $t->id,
                    'invoice_number'   => $t->invoice_number,
                    'customer_name'    => $t->user->name,
                    'total_amount'     => (float) $t->total_harga,
                    'status'           => $this->mapStatus($t->status),
                    'created_at'       => $t->created_at->toIso8601String(),
                    'shipping_address' => $t->alamat_pengiriman,
                ];
            });

        return response()->json($orders); // ← langsung array, sama seperti buyer
    }

    // GET /api/seller/orders/{id} → Detail pesanan
    public function show($id)
    {
        $user = Auth::user();
        if (!$user?->toko) {
            return response()->json(['message' => 'Anda belum memiliki toko'], 403);
        }

        $transaksi = Transaksi::with(['user', 'details'])
            ->where('toko_id', $user->toko->id)
            ->findOrFail($id);

        return response()->json([
            'id'               => $transaksi->id,
            'invoice_number'   => $transaksi->invoice_number,
            'customer_name'    => $transaksi->user->name,
            'total_amount'     => (float) $transaksi->total_harga,
            'status'           => $this->mapStatus($transaksi->status),
            'created_at'       => $transaksi->created_at->toIso8601String(),
            'shipping_address' => $transaksi->alamat_pengiriman,
            'items'            => $transaksi->details->map(function ($d) {
                return [
                    'id'           => $d->id,
                    'product_name' => $d->nama_barang_snapshot,
                    'quantity'     => $d->jumlah,
                    'price'        => (float) $d->harga_satuan,
                ];
            })->toArray(),
        ]);
    }

    // PUT /api/seller/orders/{id}/status → Ubah status (hanya next step)
   public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:paid,shipped,completed'
    ]);

    $user = Auth::user();
    if (!$user?->toko) {
        return response()->json(['message' => 'Anda belum memiliki toko'], 403);
    }

    $order = Transaksi::where('toko_id', $user->toko->id)->findOrFail($id);

    // Langsung pakai status dari request
    $newStatus = $request->status;

    // Cek urutan yang benar
    $allowed = [
        'pending' => 'paid',
        'paid'    => 'shipped',
        'shipped' => 'completed',
    ];

    if (($allowed[$order->status] ?? null) !== $newStatus) {
        return response()->json(['message' => 'Urutan status tidak valid'], 422);
    }

    $order->update(['status' => $newStatus]);

    return response()->json([
        'message' => 'Status berhasil diubah',
        'status' => $newStatus
    ]);
  }
}