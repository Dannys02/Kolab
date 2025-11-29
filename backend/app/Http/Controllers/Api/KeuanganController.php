<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Biodata;
use App\Models\Pembayaran;
use App\Models\Tagihan;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KeuanganController extends Controller
{
    // [ADMIN] Ambil data keuangan
    // Jika ada parameter ?biodata_id=X -> Tampilkan detail keuangan siswa tersebut
    // Jika TIDAK ADA parameter -> Tampilkan list semua tagihan (untuk Dashboard Admin)
    public function index(Request $request)
    {
        $biodataId = $request->query('biodata_id');

        // Skenario 1: Detail per Siswa
        if ($biodataId) {
            return $this->getDataKeuangan($biodataId);
        }

        // Skenario 2: List Semua Tagihan (Global) untuk Admin
        // Mengambil semua tagihan beserta nama siswanya, diurutkan dari yang jatuh tempo duluan
        $semuaTagihan = Tagihan::with('biodata') // Pastikan model Tagihan punya relasi public function biodata()
            ->orderBy('jatuh_tempo', 'asc')
            ->get();

        return response()->json($semuaTagihan);
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
        // Logika sederhana: Total Tagihan - Total Pembayaran
        // (Bisa dikembangkan lagi jika pembayaran per item tagihan)
        $sisaTagihan = $totalTagihan - $totalTerbayar;
        if ($sisaTagihan < 0) {
            $sisaTagihan = 0;
        }
        // Cegah minus jika overpay

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

        // 1. Catat ke Tabel Pembayaran
        $pembayaran = Pembayaran::create([
            'biodata_id' => $request->biodata_id,
            'jumlah_bayar' => $request->jumlah_bayar,
            'tanggal_bayar' => now()->toDateString(),
            'metode' => 'Transfer/Cash',
            'status' => 'Lunas',
        ]);

        $siswa = Biodata::find($request->biodata_id);
        $namaSiswa = $siswa ? $siswa->nama_lengkap : 'Siswa';

        // 2. Otomatis Masukkan ke Tabel Transaksi Admin (Sebagai Pemasukan)
        // [FIX] Mengubah 'status' jadi 'Lunas' agar tidak error undefined index
        Transaksi::create([
            'tipe' => 'pemasukan',
            'deskripsi' => "{$namaSiswa} telah membayar kas",
            'status' => 'Lunas',
            'jumlah' => $request->jumlah_bayar,
            'tanggal' => now()->toDateString(),
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil dicatat!',
            'data' => $pembayaran,
        ], 201);
    }
}
