<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BiodataController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\KeuanganController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Route Public (Bisa diakses tanpa login)
Route::post('/login', [AuthController::class, 'login']);
Route::middleware(['secret_guard'])->group(function () {

    Route::post('/biodata', [BiodataController::class, 'store']);
    // Route lain yang mau diproteksi...

});// Route pendaftaran siswa

// 2. Route Protected (Harus login/punya token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard-data', [DashboardController::class, 'index']);

    // Optional: Route untuk cek user yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/keuangan', [KeuanganController::class, 'index']);

Route::post('/tagihan', [KeuanganController::class, 'store']);
