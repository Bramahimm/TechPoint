<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- IMPORT CONTROLLER (Sesuaikan dengan lokasi file Anda) ---
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\TokoController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\MatakuliahController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==========================
// 1. PUBLIC ROUTES (Tanpa Login)
// ==========================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Tes untuk melihat daftar barang tanpa login (Opsional)
Route::get('/barang', [BarangController::class, 'index']);
Route::get('/barang/{id}', [BarangController::class, 'show']);


// ==========================
// 2. PROTECTED ROUTES (Harus Login / Punya Token)
// ==========================
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', function (Request $request) {
        return $request->user();
    });

    // --- Module: Toko (Seller) ---
    // Kita ubah dari apiResource menjadi manual agar URL-nya lebih jelas: '/toko/me'
    Route::get('/toko/me', [TokoController::class, 'show']); // Cek toko milik user login
    Route::post('/toko', [TokoController::class, 'store']);  // Buka toko baru
    Route::put('/toko', [TokoController::class, 'update']);  // Update info toko (opsional)

    // --- Module: Barang (Product Management) ---
    // Menambahkan GET /barang agar React bisa meload daftar produk
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