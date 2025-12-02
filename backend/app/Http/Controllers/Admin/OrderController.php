<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
{
    $orders = \App\Models\Transaksi::with('user')->orderBy('created_at', 'desc')->paginate(20);
    return response()->json($orders);
}
}
