<?php
// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;

class AuthController extends Controller {
  public function register(Request $request) {
    $request->validate([
      'nama' => 'required|string|max:255',
      'email' => 'required|email|unique:users,email',
      'password' => 'required|min:8|confirmed',
    ]);

    $user = User::create([
      'nama' => $request->nama,
      'email' => $request->email,
      'password' => Hash::make($request->password),
      'role' => 'pembeli',
    ]);

    // Kirim email verifikasi otomatis karena implements MustVerifyEmail
    event(new Registered($user));

    // JANGAN Auth::login($user); → dihapus!

    return response()->json([
      'message' => 'Register berhasil. Silakan cek email untuk verifikasi.'
    ], 201);
  }

  public function login(Request $request) {
    $request->validate([
      'email' => 'required|email',
      'password' => 'required',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
      throw ValidationException::withMessages([
        'email' => ['Email atau password salah.'],
      ]);
    }

    /** @var \App\Models\User $user */

    $user = Auth::user();
    if (!$user->hasVerifiedEmail()) {
      Auth::logout(); // logout dulu biar session bersih
      return response()->json([
        'message' => 'Email belum diverifikasi. Silakan cek email atau klik Resend Verification.'
      ], 403);
    }

    $request->session()->regenerate();

    return response()->json([
      'message' => 'Login berhasil',
      'user' => $user->only(['id', 'nama', 'email', 'role'])
    ]);
  }

  public function verifyEmail(Request $request, $id, $hash) {
    $user = User::findOrFail($id);

    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
      return response()->json(['message' => 'Link tidak valid'], 400);
    }

    if ($user->hasVerifiedEmail()) {
      return response()->json(['message' => 'Email sudah diverifikasi sebelumnya']);
    }

    if ($user->markEmailAsVerified()) {
      event(new Verified($user));
    }

    // Redirect ke frontend setelah verifikasi
    return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/login?verified=true');
  }

  public function resendVerification(Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
      return response()->json(['message' => 'Email sudah diverifikasi']);
    }

    $request->user()->sendEmailVerificationNotification();

    return response()->json(['message' => 'Link verifikasi telah dikirim ulang ke email Anda.']);
  }

  public function userProfile(Request $request) {
    return response()->json($request->user()->only(['id', 'nama', 'email', 'role', 'email_verified_at']));
  }

  public function logout(Request $request) {
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logout berhasil']);
  }
}
