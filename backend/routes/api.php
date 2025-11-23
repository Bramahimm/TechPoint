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

    // Toko (CRUD)
    Route::apiResource('toko', TokoController::class);

    // Barang (Sisanya: Create, Update, Delete)
    Route::post('/barang', [BarangController::class, 'store']);
    Route::put('/barang/{id}', [BarangController::class, 'update']);
    Route::delete('/barang/{id}', [BarangController::class, 'destroy']);

    // Keranjang
    Route::apiResource('keranjang', KeranjangController::class);

    // Admin Dashboard
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
    });
});