<?php

use Illuminate\Support\Facades\Route;

// Bisa kosong, atau hanya untuk view Blade kalau ada
Route::get('/', function () {
    return view('welcome');
});
