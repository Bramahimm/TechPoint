<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller {
    public function handleToken(Request $request) {
        $request->validate(['credential' => 'required|string']);

        try {
            $googleUser = Socialite::driver('google')->stateless()->userFromToken($request->credential);

            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                $user = User::create([
                    'nama' => $googleUser->name ?? 'Google User',
                    'email' => $googleUser->email,
                    'password' => Hash::make(Str::random(24)),
                    'role' => 'pembeli',
                    'email_verified_at' => now(),
                ]);
            } else {
                if (!$user->email_verified_at) {
                    $user->email_verified_at = now();
                    $user->save();
                }
            }

            Auth::guard('web')->login($user, true);

            return response()->json(['message' => 'Login Google berhasil']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Token Google tidak valid',
                'error' => $e->getMessage()
            ], 401);
        }
    }


    public function redirect() {
        return Socialite::driver('google')->redirect();
    }

    public function callback() {
        // opsional, untuk OAuth tradisional
    }
}
