<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KategoriController extends Controller
{
    // GET /api/kategori
    public function index()
    {
        // Ambil semua data
        $kategori = Kategori::all(); 
        // Perbaikan: return variabel yang benar ($kategori)
        return response()->json($kategori, 200);
    }

    // POST /api/kategori (Untuk Admin/Isi Data)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|unique:kategori,nama|max:50',
            'deskripsi' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $kategori = Kategori::create([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
        ]);

        return response()->json([
            'message' => 'Kategori berhasil dibuat',
            'data' => $kategori
        ], 201);
    }
}