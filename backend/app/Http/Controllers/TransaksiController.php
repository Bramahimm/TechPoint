<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\DetailTransaksi;
use App\Models\Keranjang;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransaksiController extends Controller
{
    // POST /api/checkout
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // 1. Ambil item yang dipilih dari keranjang
        $keranjangItems = Keranjang::with('barang')
            ->where('user_id', $user->id)
            ->where('is_selected', true)
            ->get();

        if ($keranjangItems->isEmpty()) {
            return response()->json(['message' => 'Tidak ada barang yang dipilih'], 400);
        }

        // 2. Kelompokkan per Toko (Karena 1 transaksi per toko biasanya)
        // Sederhana dulu: Anggap 1x checkout bisa banyak toko, jadi kita bikin loop transaksi
        
        $groupedByToko = $keranjangItems->groupBy(function ($item) {
            return $item->barang->toko_id;
        });

        $createdTransactions = [];

        DB::beginTransaction(); // Mulai Transaksi Database (Safety)

        try {
            foreach ($groupedByToko as $tokoId => $items) {
                $totalHarga = 0;
                
                // Hitung total dulu
                foreach ($items as $item) {
                    $totalHarga += $item->barang->harga * $item->jumlah;
                }

                // A. Buat Header Transaksi
                $transaksi = Transaksi::create([
                    'user_id' => $user->id,
                    'toko_id' => $tokoId,
                    'invoice_number' => 'INV-' . strtoupper(Str::random(10)),
                    'total_harga' => $totalHarga,
                    'status' => 'pending',
                    'alamat_pengiriman' => $request->alamat_pengiriman ?? 'Alamat Default User',
                ]);

                // B. Buat Detail & Kurangi Stok
                foreach ($items as $item) {
                    DetailTransaksi::create([
                        'transaksi_id' => $transaksi->id,
                        'barang_id' => $item->barang_id,
                        'jumlah' => $item->jumlah,
                        'harga_satuan' => $item->barang->harga,
                        'nama_barang_snapshot' => $item->barang->nama,
                        'gambar_snapshot' => $item->barang->gambar,
                    ]);

                    // Kurangi stok barang
                    $barang = Barang::find($item->barang_id);
                    if ($barang) {
                        $barang->decrement('stok', $item->jumlah);
                    }
                }

                $createdTransactions[] = $transaksi;
            }

            // 3. Hapus item dari keranjang setelah berhasil checkout
            Keranjang::where('user_id', $user->id)->where('is_selected', true)->delete();

            DB::commit(); // Simpan Permanen

            return response()->json([
                'message' => 'Checkout berhasil',
                'data' => $createdTransactions
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Batalkan semua jika ada error
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    // GET /api/transaksi (History Belanja)
    public function index()
    {
        $transaksi = Transaksi::with(['toko', 'details'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($transaksi, 200);
    }
}