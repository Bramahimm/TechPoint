<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;

class AuthController extends Controller
{
    // --- REGISTER ---
    public function register(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'pembeli', // Default
        ]);

        // Kirim email verifikasi (tetap jalan di background/log)
        event(new Registered($user));

        // ✨ TAMBAHAN: Buat Token agar langsung login setelah daftar (API Style)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Register berhasil. Silakan cek email untuk verifikasi.',
            'data' => $user,
            'access_token' => $token, // <--- Penting buat Frontend
            'token_type' => 'Bearer'
        ], 201);
    }

    // --- LOGIN ---
    public function login(Request $request)
    {
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


        // verivikasi email
        
        if (!$user->hasVerifiedEmail()) {
            // Hapus token yang mungkin terbuat (logout paksa)
            $user->tokens()->delete(); 
            return response()->json([
                'message' => 'Email belum diverifikasi. Silakan cek email atau klik Resend Verification.'
            ], 403);
        }
    

        // ✨ BAGIAN TOKEN (Pengganti Session untuk API)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user->only(['id', 'nama', 'email', 'role']),
            'access_token' => $token, // <--- Kunci masuk
            'token_type' => 'Bearer'
        ]);
    }

    // --- LOGOUT ---
    public function logout(Request $request)
    {
        // Hapus token saat ini (API Style)
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }


        return response()->json(['message' => 'Logout berhasil']);
    }

    // --- PROFILE ---
    public function userProfile(Request $request)
    {
        return response()->json($request->user()->only(['id', 'nama', 'email', 'role', 'email_verified_at']));
    }


    public function verifyEmail(Request $request, string $id, $hash)
    {
        $user = User::where('id', $id)->firstOrFail();

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Link tidak valid'], 400);
        }

        if ($user->hasVerifiedEmail()) {
            // Redirect ke frontend kalau sudah verifikasi
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/login?verified=true');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Redirect ke frontend setelah sukses
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/login?verified=true');
    }

    public function resendVerification(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email sudah diverifikasi']);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Link verifikasi telah dikirim ulang ke email Anda.']);
    }
}