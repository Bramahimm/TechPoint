// app/Http/Controllers/BarangController.php (Controller CRUD)
<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class BarangController extends Controller {
    public function index() {
        $products = Barang::with(['kategori', 'toko'])->paginate(20);
        return response()->json($products);
    }

    public function show($id) {
        $product = Barang::with(['kategori', 'toko'])->findOrFail($id);
        $product->imageUrl = $product->gambar ? asset('storage/' . $product->gambar) : null;
        return response()->json($product);
    }

    public function store(Request $request) {
        $user = Auth::user();
        if (!$user->toko) {
            return response()->json(['message' => 'Anda belum memiliki toko'], 403);
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga' => 'required|numeric|min:1000',
            'stok' => 'required|integer|min:0',
            'kategori_id' => 'nullable|uuid|exists:kategori,id',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $validated['toko_id'] = $user->toko->id;

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('public/produk');
            $validated['gambar'] = $path;
        }

        $product = Barang::create($validated);
        $product->imageUrl = $product->gambar ? asset('storage/' . $product->gambar) : null;

        return response()->json($product, 201);
    }

    public function update(Request $request, $id) {
        $product = Barang::findOrFail($id);
        $user = Auth::user();
        if ($product->toko_id !== $user->toko->id) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga' => 'sometimes|required|numeric|min:1000',
            'stok' => 'sometimes|required|integer|min:0',
            'kategori_id' => 'nullable|uuid|exists:kategori,id',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            if ($product->gambar) {
                Storage::delete($product->gambar);
            }
            $path = $request->file('gambar')->store('public/produk');
            $validated['gambar'] = $path;
        }

        $product->update($validated);
        $product->imageUrl = $product->gambar ? asset('storage/' . $product->gambar) : null;

        return response()->json($product);
    }

    public function destroy($id) {
        $product = Barang::findOrFail($id);
        $user = Auth::user();
        if ($product->toko_id !== $user->toko->id) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        if ($product->gambar) {
            Storage::delete($product->gambar);
        }

        $product->delete();
        return response()->json(['message' => 'Produk dihapus']);
    }
}
