<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsSeller
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::user()->toko) {
            return response()->json(['message' => 'Akses ditolak. Anda bukan seller.'], 403);
        }

        return $next($request);
    }
}