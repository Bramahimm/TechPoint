<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\TokoController;
use App\Http\Controllers\Public\ProductController as PublicProductController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\SellerOrderController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\UlasanController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

Route::post('/auth/google/token', [GoogleAuthController::class, 'handleToken']);

// Auth biasa
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/email/resend', [AuthController::class, 'resendVerification'])
    ->middleware('auth:sanctum');

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->name('verification.verify')
    ->middleware(['signed', 'throttle:6,1']);

// PUBLIC ROUTES
Route::get('/products', [PublicProductController::class, 'index']);
Route::get('/products/{id}', [PublicProductController::class, 'show']);
Route::get('/products/slug/{slug}', [PublicProductController::class, 'showBySlug']);
Route::get('/products/{id}/ulasan', [UlasanController::class, 'index']);
Route::get('/kategori', [KategoriController::class, 'index']);

Route::middleware(['auth:sanctum', 'verified'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/toko/me', [TokoController::class, 'show']);
    Route::post('/toko', [TokoController::class, 'store']);
    Route::put('/toko', [TokoController::class, 'update']);

    Route::get('/cart', [KeranjangController::class, 'index']);
    Route::post('/cart', [KeranjangController::class, 'store']); 
    Route::put('/cart/{id}', [KeranjangController::class, 'update']); 
    Route::delete('/cart/{id}', [KeranjangController::class, 'destroy']); 

    Route::post('/checkout', [TransaksiController::class, 'store']);
    Route::get('/transaksi', [TransaksiController::class, 'index']);

    Route::post('/ulasan', [UlasanController::class, 'store']);

    Route::get('/chat', [ChatController::class, 'index']);
    Route::post('/chat/start', [ChatController::class, 'start']);
    Route::get('/chat/{id}', [ChatController::class, 'show']);
    Route::post('/chat/{id}/reply', [ChatController::class, 'reply']);

    Route::put('/profile/update', [App\Http\Controllers\ProfileController::class, 'update']);
    Route::post('/profile/change-password', [App\Http\Controllers\ProfileController::class, 'changePassword']);
    Route::get('/seller/dashboard/stats', [DashboardController::class, 'index']);

    // SELLER
    Route::prefix('seller')->name('seller.')->middleware('isSeller')->group(function () {
        Route::apiResource('products', SellerProductController::class)->except(['create', 'edit']);
        Route::get('/orders', [SellerOrderController::class, 'index']);
        Route::get('/orders/{id}', [SellerOrderController::class, 'show']);
        Route::put('/orders/{id}/status', [SellerOrderController::class, 'updateStatus']);
    });

    // ADMIN
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/users', [UserController::class, 'index']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::patch('/users/{id}/role', [UserController::class, 'updateRole']);
        Route::post('/kategori', [KategoriController::class, 'store']);
        Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);
        Route::get('/products', [App\Http\Controllers\Admin\ProductController::class, 'index']);
        Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index']);
    });
});
