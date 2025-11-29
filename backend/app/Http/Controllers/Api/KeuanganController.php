<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Biodata;
use App\Models\Pembayaran;
use App\Models\Tagihan;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class KeuanganController extends Controller
{
    /**
     * [ADMIN] Ambil data keuangan.
     * LOGIKA HYBRID:
     * 1. Jika ada parameter ?biodata_id=X, tampilkan detail keuangan siswa tersebut (Punya Teman).
     * 2. Jika tidak ada parameter, tampilkan list semua siswa dengan tagihannya (Punya Saya).
     */
    public function index(Request $request)
    {
        // Cek apakah ada request spesifik ID (Fitur Teman)
        if ($request->has('biodata_id') && $request->biodata_id != null) {
            return $this->getDataKeuangan($request->biodata_id);
        }

        // Jika tidak, kembalikan list semua data (Fitur Saya)
        $data = Biodata::with("tagihans")->get();
        return response()->json($data);
    }

    // [SISWA] Ambil data tagihan untuk User yang sedang login
    public function getTagihanSiswa(Request $request)
    {
        $user = Auth::user();

        // Cari Biodata berdasarkan email user yang login
        $biodata = Biodata::where("email", $user->email)->first();

        if (!$biodata) {
            return response()->json([
                "message" => "Data biodata siswa tidak ditemukan untuk akun ini.",
                "total_tagihan" => 0,
                "riwayat" => [],
            ], 404);
        }

        // Kita panggil helper, karena helper sekarang sudah mengembalikan object biodata (Punya Teman),
        // Kita tidak perlu lagi pakai getOriginalContent() yang rumit.
        return $this->getDataKeuangan($biodata->id);
    }

    // [HELPER] Fungsi Logika Utama Hitung Keuangan (Private)
    // Menggunakan versi Teman karena lebih lengkap (mengembalikan object biodata)
    private function getDataKeuangan($biodataId)
    {
        // 1. Ambil Semua Tagihan
        $listTagihan = Tagihan::where("biodata_id", $biodataId)
            ->orderBy("jatuh_tempo", "desc")
            ->get();

        // 2. Hitung Total Tagihan
        $totalTagihan = $listTagihan->sum("jumlah");

        // 3. Hitung Total yang Sudah Dibayar
        $totalTerbayar = Pembayaran::where("biodata_id", $biodataId)->sum("jumlah_bayar");

        // 4. Sisa Tagihan
        $sisaTagihan = $totalTagihan - $totalTerbayar;

        // 5. Ambil Riwayat
        $riwayat = Pembayaran::where("biodata_id", $biodataId)
            ->orderBy("tanggal_bayar", "desc")
            ->take(10)
            ->get();

        // 6. Ambil Detail Biodata (Fitur Teman - agar data biodata tidak hilang di FE)
        $detailBiodata = Biodata::find($biodataId);

        return response()->json([
            "biodata_id" => $biodataId,
            "biodata" => $detailBiodata, // <--- Penting: agar frontend User & Admin bisa baca profilnya
            "total_tagihan" => $sisaTagihan,
            "total_sudah_bayar" => $totalTerbayar,
            "list_tagihan" => $listTagihan,
            "riwayat" => $riwayat,
        ]);
    }

    // [ADMIN] Buat Tagihan Baru
    public function store(Request $request)
    {
        $request->validate([
            "biodata_id" => "required|exists:biodatas,id",
            "judul" => "required|string",
            "jumlah" => "required|numeric",
            "jatuh_tempo" => "required|date",
        ]);

        $tagihan = Tagihan::create([
            "biodata_id" => $request->biodata_id,
            "judul" => $request->judul,
            "jumlah" => $request->jumlah,
            "jatuh_tempo" => $request->jatuh_tempo,
            "status" => "Belum Lunas",
        ]);

        return response()->json([
            "message" => "Tagihan berhasil dibuat!",
            "data" => $tagihan,
        ], 201);
    }

    // [ADMIN/SISWA] Catat Pembayaran
    public function storePembayaran(Request $request)
    {
        $request->validate([
            "biodata_id" => "required|exists:biodatas,id",
            "jumlah_bayar" => "required|numeric|min:1000",
        ]);

        $pembayaran = Pembayaran::create([
            "biodata_id" => $request->biodata_id,
            "jumlah_bayar" => $request->jumlah_bayar,
            "tanggal_bayar" => now()->toDateString(),
            "metode" => "Transfer/Cash",
            "status" => "Lunas",
        ]);

        $siswa = Biodata::find($request->biodata_id);
        $namaSiswa = $siswa ? $siswa->nama_lengkap : "Siswa";

        // Mencatat ke Transaksi (Gabungan logic)
        Transaksi::create([
            "tipe" => "pemasukan",
            "deskripsi" => "Pembayaran kas dari {$namaSiswa}", // Format deskripsi punya Anda (tetap dipertahankan)
            "status" => $request->status ?? 'Lunas', // Safety jika status null
            "jumlah" => $request->jumlah_bayar,
            "tanggal" => now()->toDateString(),
        ]);

        return response()->json([
            "message" => "Pembayaran berhasil dicatat!",
            "data" => $pembayaran,
        ], 201);
    }

    // [ADMIN] Perbarui Tagihan yang Sudah Ada (Fitur Saya - Dipertahankan)
    public function updateTagihan(Request $request, $id)
    {
        $tagihan = Tagihan::findOrFail($id);

        $request->validate([
            "biodata_id" => [
                "nullable",
                "exists:biodatas,id",
                Rule::in([$tagihan->biodata_id]),
            ],
            "judul" => "required|string",
            "jumlah" => "required|numeric|min:0",
            "jatuh_tempo" => "required|date",
            "status" => [
                "nullable",
                "string",
                Rule::in(["Lunas", "Belum Lunas", "Dibatalkan"]),
            ],
        ]);

        $tagihan->update([
            "judul" => $request->judul,
            "jumlah" => $request->jumlah,
            "jatuh_tempo" => $request->jatuh_tempo,
            "status" => $request->status ?? $tagihan->status,
        ]);

        return response()->json([
            "message" => "Tagihan berhasil diperbarui!",
            "data" => $tagihan,
        ], 200);
    }

    // [ADMIN] Hapus Tagihan (Fitur Saya - Dipertahankan)
    public function deleteTagihan($id)
    {
        Tagihan::findOrFail($id)->delete();
        return response()->json(["message" => "Tagihan berhasil dihapus"]);
    }
}
