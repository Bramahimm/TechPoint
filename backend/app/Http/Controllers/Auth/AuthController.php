<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Menampilkan form registrasi
    public function showRegistrationForm()
    {
        // return view('auth.register');
    }

    // Memproses data registrasi
    public function register(Request $request)
    {
        // Validasi $request->validate([...])
        // Buat user baru
        // User::create([...])
        // Kirim email verifikasi
        // Login user
        // Redirect
    }

    // Menampilkan form login
    public function showLoginForm()
    {
        // return view('auth.login');
    }

    // Memproses data login
    public function login(Request $request)
    {
        // Validasi $request->validate([...])
        // Coba autentikasi Auth::attempt([...])
        // Jika sukses, redirect ke halaman intended
        // Jika gagal, kembali ke login dengan error
    }

    // Memproses logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        // Redirect ke home
    }

    // (Opsional) Menangani verifikasi email
    public function verifyEmail(Request $request)
    {
        // Logika untuk verifikasi email
    }
}