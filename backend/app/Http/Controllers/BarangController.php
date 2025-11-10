<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BarangController extends Controller
{
    // Menampilkan semua barang milik toko user
    public function index()
    {
        $toko_id = Auth::user()->toko->id;
        // $barangs = Barang::where('toko_id', $toko_id)->get();
        // return view('barang.index', compact('barangs'));
    }

    // Menampilkan form tambah barang
    public function create()
    {
        $kategoris = Kategori::all();
        // return view('barang.create', compact('kategoris'));
    }

    // Menyimpan barang baru
    public function store(Request $request)
    {
        // Validasi
        $toko_id = Auth::user()->toko->id;
        // Barang::create([ 'toko_id' => $toko_id, ...data_lain ]);
        // Redirect ke barang.index
    }

    // Menampilkan detail satu barang (untuk pembeli)
    public function show(Barang $barang)
    {
        // return view('barang.show', compact('barang'));
    }

    // Menampilkan form edit barang
    public function edit(Barang $barang)
    {
        // Otorisasi: Cek jika barang ini milik user
        // if ($barang->toko_id !== Auth::user()->toko->id) { abort(403); }
        // return view('barang.edit', compact('barang'));
    }

    // Update barang
    public function update(Request $request, Barang $barang)
    {
        // Otorisasi
        // Validasi
        // $barang->update([...]);
        // Redirect
    }

    // Hapus barang
    public function destroy(Barang $barang)
    {
        // Otorisasi
        // $barang->delete();
        // Redirect
    }
}