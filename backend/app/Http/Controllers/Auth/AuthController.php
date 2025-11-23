<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // --- FITUR REGISTER ---
    public function register(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            // Default role pembeli, tapi bisa diisi 'penjual' jika dikirim dari frontend
            'role' => 'nullable|string|in:pembeli,penjual,admin' 
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Buat User Baru ke Database
        $user = User::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'pembeli', // Default jadi pembeli jika kosong
        ]);

        // 3. Buat Token (Tiket Masuk)
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Kirim Respon Sukses
        return response()->json([
            'status' => 'success',
            'message' => 'Registrasi berhasil',
            'data' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ], 201);
    }

    // --- FITUR LOGIN ---
    public function login(Request $request)
    {
        // 1. Cek apakah email & password cocok
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau password salah'
            ], 401);
        }

        // 2. Ambil data user
        $user = User::where('email', $request->email)->firstOrFail();

        // 3. Buat Token baru
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Kirim Respon
        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil',
            'data' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    // --- FITUR LOGOUT ---
    public function logout(Request $request)
    {
        // Hapus token yang sedang dipakai (agar tidak bisa dipakai lagi)
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout berhasil'
        ]);
    }
}