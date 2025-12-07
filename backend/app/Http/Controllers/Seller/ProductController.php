<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller {

    public function index() {
        $user = Auth::user();
        $toko = $user->toko;

        if (!$toko) {
            return response()->json(['message' => 'Anda belum memiliki toko'], 403);
        }

        $products = $toko->products()
            ->with('kategori')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Daftar produk seller berhasil dimuat',
            'data' => $products
        ], 200);
    }

    public function store(Request $request) {
        $request->validate([
            'nama' => 'required|string|max:255',
            'harga' => 'required|numeric|min:1000',
            'stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'kategori_id' => 'nullable|exists:kategori,id',
            'gambar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $toko = Auth::user()->toko;
        if (!$toko) {
            return response()->json(['message' => 'Buat toko terlebih dahulu'], 403);
        }

        $path = $request->file('gambar')->store('produk', 'public');

        $product = $toko->products()->create([
            'kategori_id' => $request->kategori_id,
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'gambar' => $path,
        ]);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'data' => $product->load('kategori')
        ], 201);
    }
    public function update(Request $request, $id) {
        $product = Auth::user()->toko->products()->findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'stok' => 'required|integer',
            'deskripsi' => 'nullable|string',
            'kategori_id' => 'nullable|exists:kategori,id',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            if ($product->gambar) {
                Storage::disk('public')->delete($product->gambar);
            }
            $path = $request->file('gambar')->store('produk', 'public');
            $product->gambar = $path;
        }

        $product->update($request->only([
            'nama',
            'deskripsi',
            'harga',
            'stok',
            'kategori_id'
        ]));

        return response()->json([
            'message' => 'Produk diperbarui',
            'data' => $product->load('kategori')
        ]);
    }
    public function destroy($id) {
        $product = Auth::user()->toko->products()->findOrFail($id);

        if ($product->gambar) {
            Storage::disk('public')->delete($product->gambar);
        }

        $product->delete();

        return response()->json(['message' => 'Produk dihapus']);
    }

    public function show($id) {
        $product = Auth::user()->toko->products()->with('kategori')->findOrFail($id);
        return response()->json($product);
    }
}
