<?php

namespace App\Http\Controllers;

use App\Models\Toko;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TokoController extends Controller
{
    // GET: /api/toko/me
    // Cek apakah user sudah punya toko
    public function show()
    {
        $user = Auth::user();
        
        if (!$user->toko) {
            return response()->json(['has_shop' => false, 'data' => null], 200);
        }

        return response()->json(['has_shop' => true, 'data' => $user->toko], 200);
    }

    // POST: /api/toko
    // Buat Toko Baru
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_toko' => 'required|string|unique:tokos,nama_toko|max:255',
            'alamat' => 'required|string',
            'deskripsi' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::user();

        // Cek jika sudah punya toko
        if ($user->toko) {
            return response()->json(['message' => 'Anda sudah memiliki toko'], 400);
        }

        $toko = Toko::create([
            'user_id' => $user->id,
            'nama_toko' => $request->nama_toko,
            'alamat' => $request->alamat,
            'deskripsi' => $request->deskripsi,
        ]);

        // Update Role User jadi penjual (jika pakai kolom role)
        $user->role = 'penjual';
        $user->save();

        return response()->json(['message' => 'Toko berhasil dibuat', 'data' => $toko], 201);
    }
}