<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- IMPORT CONTROLLERS ---
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TokoController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\SellerOrderController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\UlasanController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController; // Import UserController Admin
use App\Http\Controllers\Auth\GoogleAuthController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (Tanpa Login)
|--------------------------------------------------------------------------
*/

// CSRF & Google Auth
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->middleware('web');
Route::get('auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('auth/google/callback', [GoogleAuthController::class, 'callback']);
Route::post('auth/google/token', [GoogleAuthController::class, 'handleToken']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Email Verification (Khusus yang sudah login tapi belum verify)
Route::post('/email/resend', [AuthController::class, 'resendVerification'])->middleware('auth:sanctum');
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->name('verification.verify')
    ->middleware(['signed', 'throttle:6,1']);

// Public Data
Route::get('/barang', [BarangController::class, 'index']); // Katalog
Route::get('/barang/{id}', [BarangController::class, 'show']); // Detail Barang
Route::get('/barang/{id}/ulasan', [UlasanController::class, 'index']); // Ulasan
Route::get('/kategori', [KategoriController::class, 'index']); // Kategori

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (Harus Login)
|--------------------------------------------------------------------------
*/
// middleware 'verified' opsional, jika ingin user wajib verifikasi email dulu
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    
    // --- User Profile ---
    Route::get('/user', [AuthController::class, 'userProfile']);
    Route::get('/profile', function (Request $request) { return $request->user(); });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/user/update', [AuthController::class, 'updateProfile']);
    



    // --- Toko (Shop Management) ---
    Route::get('/toko/me', [TokoController::class, 'show']);
    Route::post('/toko', [TokoController::class, 'store']);
    Route::put('/toko', [TokoController::class, 'update']);

    // --- Barang ---
    // Hanya bisa create/delete jika sudah punya toko (logika di controller)
    Route::post('/barang', [BarangController::class, 'store']);
    Route::put('/barang/{id}', [BarangController::class, 'update']);
    Route::delete('/barang/{id}', [BarangController::class, 'destroy']);

    // --- Keranjang ---
    Route::get('/keranjang', [KeranjangController::class, 'index']);
    Route::post('/keranjang', [KeranjangController::class, 'store']);
    Route::put('/keranjang/{id}', [KeranjangController::class, 'update']);
    Route::delete('/keranjang/{id}', [KeranjangController::class, 'destroy']);

    // --- Transaksi  ---
    Route::post('/checkout', [TransaksiController::class, 'store']);
    Route::get('/transaksi', [TransaksiController::class, 'index']);

    // --- Ulasan ---
    Route::post('/ulasan', [UlasanController::class, 'store']);

    // --- Chat ---
    Route::get('/chat', [ChatController::class, 'index']);
    Route::post('/chat/start', [ChatController::class, 'start']);
    Route::get('/chat/{id}', [ChatController::class, 'show']);
    Route::post('/chat/{id}/reply', [ChatController::class, 'reply']);

    // --- Seller Orders (Seller Side) ---
    Route::prefix('seller')->group(function () {
        Route::get('/orders', [SellerOrderController::class, 'index']);
        Route::get('/orders/{id}', [SellerOrderController::class, 'show']);
        Route::put('/orders/{id}/status', [SellerOrderController::class, 'updateStatus']);
    });

    // --- ADMIN DASHBOARD ---

    Route::prefix('admin')->middleware('admin')->group(function () {
        // Dashboard Stats
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        // User Management
        Route::get('/users', [UserController::class, 'index']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::patch('/users/{id}/role', [UserController::class, 'updateRole']);
        
        // Kategori Management (Admin Only)
        Route::post('/kategori', [KategoriController::class, 'store']);
        Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);
        Route::get('/products', [App\Http\Controllers\Admin\ProductController::class, 'index']);
        Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index']);
    });
});