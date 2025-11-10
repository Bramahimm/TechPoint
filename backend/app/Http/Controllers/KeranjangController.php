<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KeranjangController extends Controller
{
    // Menampilkan isi keranjang milik user
    public function index()
    {
        $items = Keranjang::where('user_id', Auth::id())->with('barang')->get();
        // return view('keranjang.index', compact('items'));
    }

    // Menambah barang ke keranjang
    public function store(Request $request)
    {
        // Validasi (barang_id, jumlah)
        // Cek jika barang sudah ada di keranjang, update jumlah
        // Jika belum, buat baru
        // Keranjang::create([ 'user_id' => Auth::id(), ... ]);
        // Redirect
    }

    // Update jumlah barang di keranjang
    public function update(Request $request, Keranjang $keranjang)
    {
        // Otorisasi: cek $keranjang->user_id == Auth::id()
        // Validasi jumlah
        // $keranjang->update(['jumlah' => $request->jumlah]);
        // Redirect
    }

    // Hapus barang dari keranjang
    public function destroy(Keranjang $keranjang)
    {
        // Otorisasi
        $keranjang->delete();
        // Redirect
    }
}