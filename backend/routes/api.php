<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TokoController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\SellerOrderController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\GoogleAuthController; 
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// CSRF Cookie
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])
    ->middleware('web');


Route::get('auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::post('auth/google/token', [GoogleAuthController::class, 'handleToken']);


// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/email/resend', [AuthController::class, 'resendVerification'])
    ->middleware('auth:sanctum'); // hanya yang sudah login tapi belum verif

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->name('verification.verify')
    ->middleware(['signed', 'throttle:6,1'])
    ->where('id', '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}');

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/user', [AuthController::class, 'userProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile
    Route::get('/profile', function (Request $request) {
        return $request->user();
    });

    Route::get('/toko/me', [TokoController::class, 'show']);   // Cek toko milik user login
    Route::post('/toko', [TokoController::class, 'store']);    // Buka toko baru
    Route::put('/toko', [TokoController::class, 'update']);    // Update info toko

    // --- Module: Barang (Product Management) ---
    Route::get('/barang', [BarangController::class, 'index']); // Get All My Products
    Route::post('/barang', [BarangController::class, 'store']); // Create
    Route::put('/barang/{id}', [BarangController::class, 'update']); // Update
    Route::delete('/barang/{id}', [BarangController::class, 'destroy']); // Delete

    // Keranjang
    Route::apiResource('keranjang', KeranjangController::class);

    // Kategori
    Route::get('/kategori', [KategoriController::class, 'index']);

    // Route Manajemen Pesanan Seller
    Route::get('/seller/orders', [SellerOrderController::class, 'index']);
    Route::get('/seller/orders/{id}', [SellerOrderController::class, 'show']);
    Route::post('/seller/orders/{id}/status', [SellerOrderController::class, 'updateStatus']);

    // Admin Dashboard
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
    });
});
