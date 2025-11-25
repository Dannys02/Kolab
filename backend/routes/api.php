<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BiodataController;
use App\Http\Controllers\TotalKasController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\KeuanganController;
use App\Http\Controllers\Api\TransaksiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Route Public (Bisa diakses tanpa login)
Route::post('/login', [AuthController::class, 'login']);
// Ini menggunakan token Login Admin (Otomatis aman)
Route::middleware('auth:sanctum')->post('/biodata', [BiodataController::class, 'store']);

Route::put('/biodata/{id}', [BiodataController::class, 'update']);

Route::delete('/biodata/{id}', [BiodataController::class, 'destroy']);

// regster
Route::post('/register', [AuthController::class, 'register']);

// 2. Route Protected (Harus login/punya token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard-data', [DashboardController::class, 'index']);

    // Optional: Route untuk cek user yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/pembayaran', [KeuanganController::class, 'storePembayaran']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/keuangan', [KeuanganController::class, 'index']);

Route::post('/tagihan', [KeuanganController::class, 'store']);

Route::post('/contact', [ContactController::class, 'store']);

Route::get('/dashboard/index', [DashboardController::class, 'biodataIndex']);


Route::prefix('transaksi')->group(function () {
    Route::get('/', [TransaksiController::class, 'index']);
    Route::get('/pemasukan', [TransaksiController::class, 'pemasukan']);
    Route::get('/pengeluaran', [TransaksiController::class, 'pengeluaran']);
    Route::post('/', [TransaksiController::class, 'store']);
});


// ...
// Route TotalKas perlu dilindungi dengan Sanctum
Route::middleware('auth:sanctum')->get('/total', [TotalKasController::class, 'index']);
