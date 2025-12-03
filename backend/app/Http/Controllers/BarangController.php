<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator; 
use Illuminate\Support\Facades\Storage;  

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

        // Ambil barang beserta data kategorinya (Eager Loading) agar nama kategori muncul
        $barangs = Barang::with('kategori')->where('toko_id', $user->toko->id)->get();

        // Format data untuk Frontend (ProductCard.tsx)
        $data = $barangs->map(function ($barang) {
            return [
                'id' => $barang->id,
                'name' => $barang->nama,
                'price' => $barang->harga,
                'stock' => $barang->stok,
                // Ambil nama kategori dari relasi, jika null tulis 'Uncategorized'
                'category' => $barang->kategori ? $barang->kategori->nama : 'Uncategorized',
                'status' => $barang->stok > 0 ? 'active' : 'inactive',
                'description' => $barang->deskripsi,
                // Pastikan gambar berupa URL lengkap
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
            'deskripsi' => 'nullable|string', 
            'kategori_id' => 'required|exists:kategori,id', 
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Upload Gambar
        $pathGambar = null;
        if ($request->hasFile('gambar')) {
            // Simpan di storage/app/public/products
            $path = $request->file('gambar')->store('products', 'public');
            // Generate URL lengkap
            $pathGambar = url('storage/' . $path);
        }

        // Simpan ke Database
        $barang = Barang::create([
            'toko_id' => Auth::user()->toko->id,
            'kategori_id' => $request->kategori_id, // <--- Sesuaikan dengan Model
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'gambar' => $pathGambar,
        ]);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan', 
            'data' => $barang
        ], 201);
    }

    // DELETE: /api/barang/{id}
    public function destroy($id)
    {
        $user = Auth::user();
        
        // Pastikan toko ada & barang milik toko tersebut
        if (!$user->toko) {
            return response()->json(['message' => 'Toko tidak ditemukan'], 404);
        }

        $barang = Barang::where('id', $id)
                        ->where('toko_id', $user->toko->id)
                        ->first();

        if (!$barang) {
            return response()->json(['message' => 'Produk tidak ditemukan'], 404);
        }

        // Hapus file gambar dari storage jika ada (Opsional tapi bersih)
        if ($barang->gambar) {
            // Kita perlu ambil path relatif dari URL (misal: products/foto.jpg)
            $relativePath = str_replace(url('storage/'), '', $barang->gambar);
            Storage::disk('public')->delete($relativePath);
        }

        $barang->delete();

        return response()->json(['message' => 'Produk berhasil dihapus'], 200);
    }
}