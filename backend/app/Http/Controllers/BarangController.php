<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BarangController extends Controller
{
    // GET: /api/barang (Milik Toko Saya)
    public function index()
    {
        $user = Auth::user();
        
        // Cek apakah user punya toko
        if (!$user->toko) {
            return response()->json([], 200);
        }

        $barangs = Barang::where('toko_id', $user->toko->id)->get();

        // Format data untuk ProductCard.tsx
        $data = $barangs->map(function ($barang) {
            return [
                'id' => $barang->id,
                'name' => $barang->nama,
                'price' => $barang->harga,
                'stock' => $barang->stok,
                'category' => $barang->kategori, // Asumsi kolom kategori string
                'status' => $barang->stok > 0 ? 'active' : 'inactive', // Logic status sederhana
                // Ubah string gambar tunggal jadi array agar sesuai ProductCard
                'images' => $barang->gambar ? [$barang->gambar] : [] 
            ];
        });

        return response()->json($data, 200);
    }

    // POST: /api/barang (Tambah Barang Baru)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'stok' => 'required|integer',
            'kategori' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validasi Gambar
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Upload Gambar
        $pathGambar = null;
        if ($request->hasFile('gambar')) {
             // Simpan di storage/app/public/products
            $path = $request->file('gambar')->store('products', 'public');
            // Generate URL lengkap agar bisa diakses React
            $pathGambar = url('storage/' . $path); 
        }

        $barang = Barang::create([
            'toko_id' => Auth::user()->toko->id,
            'nama' => $request->nama,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'kategori' => $request->kategori,
            'gambar' => $pathGambar,
        ]);

        return response()->json(['message' => 'Produk berhasil ditambahkan', 'data' => $barang], 201);
    }

    // DELETE: /api/barang/{id}
    public function destroy($id)
    {
        $barang = Barang::where('id', $id)->where('toko_id', Auth::user()->toko->id)->first();

        if (!$barang) {
            return response()->json(['message' => 'Produk tidak ditemukan'], 404);
        }

        // Hapus file gambar jika ada (opsional, tapi disarankan)
        // Storage::disk('public')->delete(...) 

        $barang->delete();

        return response()->json(['message' => 'Produk berhasil dihapus'], 200);
    }
}