<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Biodata;
use App\Models\Pembayaran;
use App\Models\Tagihan;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// [Tambahan]

class KeuanganController extends Controller
{
    // [ADMIN] Ambil data keuangan berdasarkan ID Biodata Siswa (Query Param)
    public function index(Request $request)
    {
        $biodataId = $request->query('biodata_id');

        if (!$biodataId) {
            return response()->json(['message' => 'Biodata ID diperlukan'], 400);
        }

        return $this->getDataKeuangan($biodataId);
    }

    // [SISWA] Ambil data tagihan untuk User yang sedang login
    public function getTagihanSiswa(Request $request)
    {
        $user = Auth::user(); // Ambil user dari token

        // Cari Biodata berdasarkan email user yang login
        $biodata = Biodata::where('email', $user->email)->first();

        if (!$biodata) {
            return response()->json([
                'message' => 'Data biodata siswa tidak ditemukan untuk akun ini.',
                'total_tagihan' => 0,
                'riwayat' => [],
            ], 404);
        }

        return $this->getDataKeuangan($biodata->id);
    }

    // [HELPER] Fungsi Logika Utama Hitung Keuangan (Private)
    private function getDataKeuangan($biodataId)
    {
        // 1. Ambil Semua Tagihan (Detail)
        $listTagihan = Tagihan::where('biodata_id', $biodataId)
            ->orderBy('jatuh_tempo', 'desc')
            ->get();

        // 2. Hitung Total Tagihan (Hutang)
        $totalTagihan = $listTagihan->sum('jumlah');

        // 3. Hitung Total yang Sudah Dibayar
        $totalTerbayar = Pembayaran::where('biodata_id', $biodataId)->sum('jumlah_bayar');

        // 4. Sisa Tagihan (Yang harus dibayar)
        $sisaTagihan = $totalTagihan - $totalTerbayar;

        // 5. Ambil Riwayat Pembayaran
        $riwayat = Pembayaran::where('biodata_id', $biodataId)
            ->orderBy('tanggal_bayar', 'desc')
            ->take(10)
            ->get();

            $detailBiodata = Biodata::find($biodataId);

return response()->json([
    'biodata_id' => $biodataId,
    'biodata' => $detailBiodata, // <--- INI KUNCINYA AGAR DATA TIDAK HILANG
    'total_tagihan' => $sisaTagihan,
    'total_sudah_bayar' => $totalTerbayar,
    'list_tagihan' => $listTagihan,
    'riwayat' => $riwayat,
]);
    }

    // [ADMIN] Buat Tagihan Baru
    public function store(Request $request)
    {
        $request->validate([
            'biodata_id' => 'required|exists:biodatas,id',
            'judul' => 'required|string',
            'jumlah' => 'required|numeric',
            'jatuh_tempo' => 'required|date',
        ]);

        $tagihan = Tagihan::create([
            'biodata_id' => $request->biodata_id,
            'judul' => $request->judul,
            'jumlah' => $request->jumlah,
            'jatuh_tempo' => $request->jatuh_tempo,
            'status' => 'Belum Lunas',
        ]);

        return response()->json([
            'message' => 'Tagihan berhasil dibuat!',
            'data' => $tagihan,
        ], 201);
    }

    // [ADMIN/SISWA] Catat Pembayaran
    public function storePembayaran(Request $request)
    {
        $request->validate([
            'biodata_id' => 'required|exists:biodatas,id',
            'jumlah_bayar' => 'required|numeric|min:1000',
        ]);

        $pembayaran = Pembayaran::create([
            'biodata_id' => $request->biodata_id,
            'jumlah_bayar' => $request->jumlah_bayar,
            'tanggal_bayar' => now()->toDateString(),
            'metode' => 'Transfer/Cash', // Bisa diubah sesuai input
            'status' => 'Lunas',
        ]);

        // Opsional: Cek apakah tagihan lunas (Logic sederhana)
        // Disini kita hanya mencatat uang masuk, logika pelunasan per item tagihan
        // bisa ditambahkan jika sistemnya lebih kompleks.

        $siswa = Biodata::find($request->biodata_id);
        $namaSiswa = $siswa ? $siswa->nama_lengkap : 'Siswa';

// 3. [BARU] Otomatis Masukkan ke Tabel Transaksi Admin (Sebagai Pemasukan)
        Transaksi::create([
            'tipe' => 'pemasukan',
            'deskripsi' => "{$namaSiswa} telah membayar kas", // Format: "Arya telah membayar kas"
            'status' => $request->status,
            'jumlah' => $request->jumlah_bayar,
            'tanggal' => now()->toDateString(),
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil dicatat!',
            'data' => $pembayaran,
        ], 201);
    }
}
