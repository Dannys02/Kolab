<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApiToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Ambil token dari header request bernama 'X-API-TOKEN'
        $tokenInput = $request->header('X-API-TOKEN');

        // 2. Ambil kunci asli dari .env
        $tokenAsli = env('API_SECRET_KEY');

        // 3. Cek apakah cocok
        if ($tokenInput !== $tokenAsli) {
            return response()->json([
                'message' => 'Akses Ditolak! Token Rahasia Salah.',
            ], 403);
        }

        return $next($request);
    }
}
