
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleAuthController;

Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])
    ->name('auth.google.redirect');

Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->name('auth.google.callback');

Route::post('/api/auth/google/token', [GoogleAuthController::class, 'handleToken'])
    ->name('auth.google.token');


Route::get('/{any}', function () {
    return view('welcome'); 
})->where('any', '.*');