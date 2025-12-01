<?php

namespace App\Http\Controllers;

use App\Models\Toko;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;     

class TokoController extends Controller
{
    // GET: /api/toko/me
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

    // POST: /api/toko
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_toko' => 'required|string|unique:toko,nama_toko|max:255',
            'alamat' => 'required|string',
            'no_telp' => 'nullable|string|max:15',
            'deskripsi' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validasi Logo
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        if ($user->toko) {
            return response()->json(['message' => 'Anda sudah memiliki toko'], 400);
        }

        // Logic Upload Logo
        $pathLogo = null;
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('toko-logos', 'public');
            $pathLogo = url('storage/' . $path);
        }

        $toko = Toko::create([
            'user_id' => $user->id,
            'nama_toko' => $request->nama_toko,
            'alamat' => $request->alamat,
            'no_telp' => $request->no_telp,
            'deskripsi' => $request->deskripsi,
            'logo' => $pathLogo,
        ]);

        // Update Role User
        $user->role = 'penjual';
        $user->save();

        return response()->json([
            'message' => 'Toko berhasil dibuat', 
            'data' => $toko
        ], 201);
    }
    
    // PUT: /api/toko
    public function update(Request $request)
    {
        $user = Auth::user();
        
        if (!$user->toko) {
            return response()->json(['message' => 'Toko tidak ditemukan'], 404);
        }

        $toko = $user->toko;

        $validator = Validator::make($request->all(), [
            'nama_toko' => 'sometimes|string|max:255|unique:toko,nama_toko,' . $toko->id,
            'alamat' => 'sometimes|string',
            'no_telp' => 'nullable|string|max:15',
            'deskripsi' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $dataToUpdate = $request->only(['nama_toko', 'alamat', 'no_telp', 'deskripsi']);

        // Logic Update Logo (Hapus lama, upload baru)
        if ($request->hasFile('logo')) {
            // Hapus logo lama jika ada
            if ($toko->logo) {
                $oldPath = str_replace(url('storage/'), '', $toko->logo);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('logo')->store('toko-logos', 'public');
            $dataToUpdate['logo'] = url('storage/' . $path);
        }

        $toko->update($dataToUpdate);

        return response()->json([
            'message' => 'Toko berhasil diperbarui', 
            'data' => $toko
        ], 200);
    }
}