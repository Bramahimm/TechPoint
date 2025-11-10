<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // Menampilkan dashboard admin
    public function index()
    {
        // Ambil data statistik: User::count(), Toko::count(), dll.
        // return view('admin.dashboard', compact('stats'));
    }
}