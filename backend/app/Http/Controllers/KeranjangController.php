<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KeranjangController extends Controller
{
    // GET: /api/keranjang
    // Dipanggil oleh: fetchCartItems() di CartPage.tsx
    public function index()
    {
        $userId = Auth::id();
        
        // Ambil keranjang user beserta data barangnya
        $items = Keranjang::with('barang')->where('user_id', $userId)->get();

        // Mapping data agar sesuai struktur JSON yang diminta React
        $data = $items->map(function ($item) {
            return [
                'id' => $item->id, // ID Keranjang
                'product_id' => $item->barang_id,
                'name' => $item->barang->nama,
                'price' => $item->barang->harga,
                'quantity' => $item->jumlah,
                'stock' => $item->barang->stok,
                'image' => $item->barang->gambar, // Pastikan ini URL gambar
                'is_selected' => $item->is_selected, // Dari migrasi sebelumnya
                'varian' => $item->varian,
            ];
        });

        return response()->json($data, 200);
    }

    // POST: /api/keranjang
    // Dipanggil saat tombol "Tambah ke Keranjang" ditekan
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'barang_id' => 'required|exists:barang,id',
            'jumlah' => 'required|integer|min:1',
            'varian' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $userId = Auth::id();

        // Cek apakah barang sudah ada di keranjang user?
        $existingItem = Keranjang::where('user_id', $userId)
            ->where('barang_id', $request->barang_id)
            ->where('varian', $request->varian) // Cek varian juga
            ->first();

        if ($existingItem) {
            // Update jumlah jika sudah ada
            $existingItem->jumlah += $request->jumlah;
            $existingItem->save();
        } else {
            // Buat baru jika belum ada
            Keranjang::create([
                'user_id' => $userId,
                'barang_id' => $request->barang_id,
                'jumlah' => $request->jumlah,
                'varian' => $request->varian,
                'is_selected' => true
            ]);
        }

        return response()->json(['message' => 'Barang berhasil masuk keranjang'], 201);
    }

    // PUT: /api/keranjang/{id}
    // Dipanggil oleh: handleUpdateQuantity() di CartPage.tsx
    public function update(Request $request, $id)
    {
        $keranjang = Keranjang::where('user_id', Auth::id())->where('id', $id)->first();

        if (!$keranjang) {
            return response()->json(['message' => 'Item tidak ditemukan'], 404);
        }

        $keranjang->update([
            'jumlah' => $request->jumlah
        ]);

        return response()->json(['message' => 'Jumlah berhasil diupdate'], 200);
    }

    // DELETE: /api/keranjang/{id}
    // Dipanggil oleh: handleRemoveItem() di CartPage.tsx
    public function destroy($id)
    {
        $keranjang = Keranjang::where('user_id', Auth::id())->where('id', $id)->first();

        if (!$keranjang) {
            return response()->json(['message' => 'Item tidak ditemukan'], 404);
        }

        $keranjang->delete();

        return response()->json(['message' => 'Item berhasil dihapus'], 200);
    }
}