<?php

namespace App\Http\Controllers;

use App\Models\Toko;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator; 

class TokoController extends Controller
{
    // GET: /api/toko/me (Lihat Toko Saya)
    public function show()
    {
        $user = Auth::user();

        if (!$user->toko) {
            return response()->json([
                'has_shop' => false, 
                'message' => 'User belum memiliki toko',
                'data' => null
            ], 200);
        }

        return response()->json([
            'has_shop' => true, 
            'data' => $user->toko
        ], 200);
    }

    // POST: /api/toko (Buka Toko Baru)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_toko' => 'required|string|unique:toko,nama_toko|max:255',
            'alamat' => 'required|string',
            'no_telp' => 'nullable|string|max:15' 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        // Cek jika user sudah punya toko (Satu user satu toko)
        if ($user->toko) {
            return response()->json(['message' => 'Anda sudah memiliki toko'], 400);
        }

        $toko = Toko::create([
            'user_id' => $user->id,
            'nama_toko' => $request->nama_toko,
            'alamat' => $request->alamat,
            'no_telp' => $request->no_telp, 
        ]);

        // Update Role User jadi 'penjual'
        $user->role = 'penjual';
        $user->save();

        return response()->json([
            'message' => 'Toko berhasil dibuat', 
            'data' => $toko
        ], 201);
    }
    
    // PUT: /api/toko (Update Data Toko)
    public function update(Request $request)
    {
        $user = Auth::user();
        
        if (!$user->toko) {
            return response()->json(['message' => 'Toko tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_toko' => 'sometimes|string|max:255|unique:toko,nama_toko,' . $user->toko->id,
            'alamat' => 'sometimes|string',
            'no_telp' => 'nullable|string|max:15'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->toko->update($request->only(['nama_toko', 'alamat', 'no_telp']));

        return response()->json([
            'message' => 'Toko berhasil diperbarui', 
            'data' => $user->toko
        ], 200);
    }
}