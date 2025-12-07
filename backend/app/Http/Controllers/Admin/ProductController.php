<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
{
    $products = \App\Models\Barang::with('user')->paginate(20);
    return response()->json($products);
}
}
