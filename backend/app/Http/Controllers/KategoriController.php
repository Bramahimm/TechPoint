<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    public function index()
    {
        // Asumsi tabel kategoris punya kolom 'nama'
        $kategori = Kategori::all(['id', 'nama']); 
        return response()->json($kategoris);
    }
}
