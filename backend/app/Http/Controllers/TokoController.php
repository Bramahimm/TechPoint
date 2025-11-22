<?php

namespace App\Http\Controllers;

use App\Models\Toko;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TokoController extends Controller
{
    // Menampilkan form untuk membuat toko (Fitur 'Membuka Toko')
    public function create()
    {
        // return view('toko.create');
    }

    // Menyimpan toko baru ke database
    public function store(Request $request)
    {
        // Validasi
        // Toko::create([ 'user_id' => Auth::id(), ...data_lain ]);
        // Update role user menjadi 'penjual'
        // Redirect ke dashboard penjual
    }

    // Menampilkan dashboard toko milik user
    public function show()
    {
        $toko = Auth::user()->toko;
        // return view('toko.dashboard', compact('toko'));
    }

    // Menampilkan form untuk edit toko
    public function edit()
    {
        $toko = Auth::user()->toko;
        // return view('toko.edit', compact('toko'));
    }

    // Update data toko di database
    public function update(Request $request)
    {
        $toko = Auth::user()->toko;
        // Validasi
        // $toko->update([...]);
        // Redirect
    }
    
    // Method index, show(id), dan destroy mungkin tidak diperlukan
    // jika user hanya bisa mengelola 1 tokonya sendiri
}