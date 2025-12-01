<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Validation\ValidationException;

class GoogleAuthController extends Controller {

  public function redirect() {

    return Socialite::driver('google')
      ->stateless()
      ->redirect();
  }


  public function callback() {
    try {
      // Socialite akan menukar kode otorisasi menjadi data user
      $googleUser = Socialite::driver('google')->stateless()->user();


      return $this->processUserLogin($googleUser);
    } catch (\Exception $e) {
      Log::error('Socialite Redirect Failed', ['error' => $e->getMessage()]);
      return redirect()->to(env('FRONTEND_URL', 'http://localhost:5173') . '/login?error=google_failed');
    }
  }

  public function handleToken(Request $request) {
    $request->validate([
      'credential' => 'required|string',
    ]);

    $token = $request->input('credential');

    try {
      $googleUser = Socialite::driver('google')->userFromToken($token);

      $this->processUserLogin($googleUser);

      return response()->json([
        'message' => 'Login Google berhasil',
        'user' => Auth::user()->only(['id', 'nama', 'email', 'role', 'email_verified_at'])
      ]);
    } catch (\Exception $e) {
      Log::error('GSI Token Verification Failed', ['error' => $e->getMessage()]);
      return response()->json([
        'message' => 'Login Google gagal: ' . $e->getMessage()
      ], 401);
    }
  }

  protected function processUserLogin(\Laravel\Socialite\Contracts\User $googleUser) {
    $user = User::where('email', $googleUser->email)->first();

    if (!$user) {
      // 1. REGISTER BARU
      $user = User::create([
        'nama' => $googleUser->name ?? 'User Google',
        'email' => $googleUser->email,
        'password' => Hash::make(bin2hex(random_bytes(16))), // Password dummy
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

    return $user;
  }
}
