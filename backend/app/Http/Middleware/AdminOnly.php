<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminOnly
{
    public function handle(Request $request, Closure $next)
    {
        if (auth('sanctum')->check() && auth('sanctum')->user()->role === 'admin') {
            return $next($request);
        }

        return response()->json(['message' => 'Akses ditolak. Hanya Admin!'], 403);
    }
}