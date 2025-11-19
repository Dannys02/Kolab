<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tagihan;
use App\Models\Pembayaran;
use App\Models\Biodata;

class KeuanganController extends Controller
{
    // Ambil data keuangan berdasarkan ID Biodata Siswa
    public function index(Request $request)
    {
        // Nanti id ini bisa diambil dari request atau user yg login
        // Untuk testing, kita hardcode ambil siswa pertama dulu atau dari parameter
        $biodataId = $request->query('biodata_id');

        if(!$biodataId) {
             return response()->json(['message' => 'Biodata ID diperlukan'], 400);
        }

        // 1. Hitung Total Tagihan (Hutang)
        $totalTagihan = Tagihan::where('biodata_id', $biodataId)->sum('jumlah');

        // 2. Hitung Total yang Sudah Dibayar
        $totalTerbayar = Pembayaran::where('biodata_id', $biodataId)->sum('jumlah_bayar');

        // 3. Sisa Tagihan (Yang ditampilkan di kartu biru dashboard)
        $sisaTagihan = $totalTagihan - $totalTerbayar;

        // 4. Ambil Riwayat Pembayaran (List kanan dashboard)
        $riwayat = Pembayaran::where('biodata_id', $biodataId)
                    ->orderBy('tanggal_bayar', 'desc')
                    ->take(5) // Ambil 5 terakhir
                    ->get();

        return response()->json([
            'total_tagihan' => $sisaTagihan, // Angka besar di kartu biru
            'riwayat' => $riwayat // List di kanan
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'biodata_id' => 'required|exists:biodatas,id', // Pastikan siswa ada
            'judul'      => 'required|string',             // Contoh: "SPP Mei"
            'jumlah'     => 'required|numeric',            // Contoh: 500000
            'jatuh_tempo'=> 'required|date',               // Contoh: 2024-05-20
        ]);

        // 2. Simpan ke Database
        $tagihan = Tagihan::create([
            'biodata_id'  => $request->biodata_id,
            'judul'       => $request->judul,
            'jumlah'      => $request->jumlah,
            'jatuh_tempo' => $request->jatuh_tempo,
            'status'      => 'Belum Lunas' // Default status
        ]);

        return response()->json([
            'message' => 'Tagihan berhasil dibuat!',
            'data'    => $tagihan
        ], 201);
    }

     // [2] TAMBAHKAN FUNGSI INI DI PALING BAWAH CLASS
    public function storePembayaran(Request $request)
    {
        // Validasi input
        $request->validate([
            'biodata_id'   => 'required|exists:biodatas,id',
            'jumlah_bayar' => 'required|numeric|min:1000',
        ]);

        // Simpan ke database
        $pembayaran = Pembayaran::create([
            'biodata_id'   => $request->biodata_id,
            'jumlah_bayar' => $request->jumlah_bayar,
            'tanggal_bayar'=> now()->toDateString(), // Otomatis ambil tanggal hari ini
            'metode'       => 'Cash',
            'status'       => 'Lunas'
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil dicatat!',
            'data' => $pembayaran
        ], 201);
    }
}
