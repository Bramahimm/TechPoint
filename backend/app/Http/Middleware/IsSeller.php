<?php

// app/Http/Middleware/IsSeller.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsSeller {
    // app/Http/Middleware/IsSeller.php
    public function handle(Request $request, Closure $next): Response {
        $user = Auth::user();

        if (!$user || !$user->toko) { 
            return response()->json([
                'message' => 'Akses ditolak. Anda harus memiliki toko untuk mengakses halaman ini.'
            ], 403);
        }

        return $next($request);
    }
}
