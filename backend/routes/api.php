<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// CSRF Cookie
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])
    ->middleware('web');

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/email/resend', [AuthController::class, 'resendVerification'])
    ->middleware('auth:sanctum'); // hanya yang sudah login tapi belum verif

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/user', [AuthController::class, 'userProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
