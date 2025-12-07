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

    public function show($id) {
        $product = Product::with(['toko', 'kategori'])->findOrFail($id);
        return response()->json($product);
    }
}
