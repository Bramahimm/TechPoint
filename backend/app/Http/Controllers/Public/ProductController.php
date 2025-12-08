<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller {

    public function index(Request $request) {
        $products = Product::with(['toko', 'kategori'])
            ->where('stok', '>', 0)
            ->latest()
            ->paginate(20);

        return response()->json($products);
    }
    // app/Http/Controllers/ProductController.php (Public/Shop)

    // ...

    public function showBySlug(string $slug) {
        $product = Product::where('slug', $slug)
            ->with(['kategori', 'toko']) 
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Produk tidak ditemukan'], 404);
        }
        return response()->json($product->toArray());
    }

    public function show($id) {
        $product = Product::with(['toko', 'kategori'])->findOrFail($id);
        return response()->json($product);
    }
}
