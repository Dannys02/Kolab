<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\KeuanganController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BiodataController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\TotalKasController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Di sini Anda dapat mendaftarkan rute API untuk aplikasi Anda. 
| Rute-rute ini dimuat oleh RouteServiceProvider dalam grup yang memiliki 
| middleware "api" secara default.
|
*/

// --- PUBLIC ROUTES (Tidak Butuh Login) ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/dashboard/index', [DashboardController::class, 'biodataIndex']); // Route ini tetap di luar, walau isinya sama dengan /dashboard-data

// --- PROTECTED ROUTES (BUTUH LOGIN) ---
Route::middleware('auth:sanctum')->group(function () {

    // User & Dashboard
    Route::get('/user', function (Request $request) {return $request->user();});
    Route::get('/dashboard-data', [DashboardController::class, 'biodataIndex']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ========= Edit & Hapus Akun ===================
    Route::put('/data/edit', [AuthController::class, 'update']);
    Route::delete('/data/destroy', [AuthController::class, 'destroy']);
    
    // Biodata (Admin)
    Route::post('/biodata', [BiodataController::class, 'store']);
    Route::put('/biodata/{id}', [BiodataController::class, 'update']);
    Route::delete('/biodata/{id}', [BiodataController::class, 'destroy']);

    // --- FITUR KEUANGAN & TAGIHAN ---

    // 1. [ADMIN/HYBRID] Lihat Keuangan Siswa (List semua atau Detail via ?biodata_id=X)
    Route::get('/keuangan', [KeuanganController::class, 'index']);

    // 2. [SISWA] Lihat Tagihan Saya Sendiri (Otomatis deteksi login)
    Route::get('/tagihan-siswa', [KeuanganController::class, 'getTagihanSiswa']);

    // 3. [ADMIN] Buat Tagihan Baru
    Route::post('/tagihan', [KeuanganController::class, 'store']);

    // 4. [ADMIN] Perbarui Tagihan yang Sudah Ada (Tambahan dari file kedua)
    Route::put('/tagihan/{id}', [KeuanganController::class, 'updateTagihan']); 
    
    // 5. [ADMIN] Hapus Tagihan (Tambahan dari file kedua)
    Route::delete('/tagihan/{id}', [KeuanganController::class, 'deleteTagihan']); 

    // 6. [ADMIN/SISWA] Catat Pembayaran
    Route::post('/pembayaran', [KeuanganController::class, 'storePembayaran']);

    // Total Kas (Admin Dashboard)
    Route::get('/total', [TotalKasController::class, 'index']);

    // --- PENGUMUMAN ---
    
    // [SISWA] Lihat pengumuman aktif
    Route::get('/pengumuman', [PengumumanController::class, 'index']);
    
    // [ADMIN] Manage pengumuman
    Route::get('/pengumuman/admin', [PengumumanController::class, 'indexAdmin']);
    Route::post('/pengumuman', [PengumumanController::class, 'store']);
    Route::put('/pengumuman/{id}', [PengumumanController::class, 'update']);
    Route::delete('/pengumuman/{id}', [PengumumanController::class, 'destroy']);
    
    // --- TRANSAKSI (PEMASUKAN & PENGELUARAN) ---
    Route::prefix('transaksi')->group(function () {
        Route::get('/', [TransaksiController::class, 'index']);
        Route::get('/pemasukan', [TransaksiController::class, 'pemasukan']);
        Route::get('/pengeluaran', [TransaksiController::class, 'pengeluaran']);
        Route::post('/', [TransaksiController::class, 'store']);
        // Semua rute update dan delete diletakkan di bawah POST/GET
        Route::put('/pemasukan/update/{id}', [TransaksiController::class, 'update']);
        Route::delete('/pemasukan/delete/{id}', [TransaksiController::class, 'destroy']);
    });
});
