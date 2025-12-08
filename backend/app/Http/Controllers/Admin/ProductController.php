<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller
{
   public function index()
{
    $products = Product::with(['toko' => function ($query) {
        $query->select('id', 'nama_toko');
    }])
    ->select('id', 'nama', 'harga', 'stok', 'toko_id')
    ->orderBy('created_at', 'desc')
    ->paginate(20);

    return response()->json([
        'data' => $products
    ]);
}
public function destroy($id)
{
    try {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal menghapus produk: ' . $e->getMessage()
        ], 500);
    }
}
}