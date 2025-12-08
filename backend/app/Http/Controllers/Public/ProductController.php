<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller {

public function index(Request $request)
{
    $query = Product::with(['kategori', 'toko']);

    if ($request->has('kategori') && $request->kategori !== 'semua') {
        $query->whereHas('kategori', function ($q) use ($request) {
            $q->where('nama', $request->kategori);
        });
    }

    $products = $query->paginate(20);
    return response()->json($products);
}

    public function show($id) {
        $product = Product::with(['toko', 'kategori'])->findOrFail($id);
        return response()->json($product);
    }
}
