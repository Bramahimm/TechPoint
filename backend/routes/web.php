<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Models\Order; 
use Illuminate\Http\Request; // Import Request untuk membaca query parameter

Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])
    ->name('auth.google.redirect');

Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->name('auth.google.callback');

Route::post('/api/auth/google/token', [GoogleAuthController::class, 'handleToken'])
    ->name('auth.google.token');


Route::get('/', function () {
    return view('welcome');
});

// Handler untuk redirect Midtrans setelah pembayaran (Finish, Error, Pending)
// Sekarang mengarah ke http://localhost:5173/orders
Route::get('/order/status/{invoice_number}', function ($invoiceNumber, Request $request) {
    
    // Cari status order
    $order = Order::where('invoice_number', $invoiceNumber)->first();
    
    // Ambil status dari query parameter Midtrans (e.g., status=success)
    $status = $request->query('status', 'pending');
    
    // Menyiapkan base URL frontend yang baru
    $frontendUrl = "http://localhost:5173/orders";
    
    if ($order) {
        // Redirect ke halaman orders di frontend
        // Kita juga bisa meneruskan Invoice Number dan Status melalui Query Parameter
        return redirect()->away("{$frontendUrl}?invoice={$invoiceNumber}&status={$status}");
    }

    // Jika order tidak ditemukan, redirect ke halaman orders dengan pesan error
    return redirect()->away("{$frontendUrl}?msg=OrderNotFound"); 
});