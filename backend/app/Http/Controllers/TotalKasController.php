<?php

namespace App\Http\Controllers;

// Hapus use App\Models\TotalKas;

// Pastikan Anda mengimpor model Transaksi Anda
use App\Models\Transaksi; // Ganti dengan nama model transaksi yang benar jika berbeda
use Illuminate\Http\Request;

class TotalKasController extends Controller
{
    public function index()
    {
        // 1. Hitung total pemasukan
        $pemasukan = Transaksi::where('tipe', 'pemasukan')
                             ->sum('jumlah'); // Pastikan 'jumlah' adalah nama kolom jumlah

        // 2. Hitung total pengeluaran
        $pengeluaran = Transaksi::where('tipe', 'pengeluaran')
                               ->sum('jumlah');

        // 3. Hitung total kas bersih
        $total_kas_bersih = $pemasukan - $pengeluaran;

        return response()->json([
            'total_kas' => (int) $total_kas_bersih // Pastikan nilai dikembalikan sebagai angka
        ]);
    }
}
