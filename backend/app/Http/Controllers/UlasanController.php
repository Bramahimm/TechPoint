<?php

namespace App\Http\Controllers;

use App\Models\Ulasan;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UlasanController extends Controller
{
    // POST /api/ulasan (Beri Ulasan)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'barang_id' => 'required|exists:barang,id',
            'rating' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        // Cek apakah user sudah pernah review barang ini (Opsional: 1 user 1 review per barang)
        $existingReview = Ulasan::where('user_id', $user->id)
            ->where('barang_id', $request->barang_id)
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'Anda sudah mengulas barang ini'], 400);
        }

        $ulasan = Ulasan::create([
            'user_id' => $user->id,
            'barang_id' => $request->barang_id,
            'rating' => $request->rating,
            'komentar' => $request->komentar,
        ]);

        return response()->json(['message' => 'Ulasan berhasil dikirim', 'data' => $ulasan], 201);
    }

    // GET /api/barang/{id}/ulasan (Lihat ulasan suatu barang)
    public function index($barangId)
    {
        $ulasan = Ulasan::with('user:id,nama') // Ambil nama user saja
            ->where('barang_id', $barangId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($ulasan, 200);
    }
}