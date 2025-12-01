<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Biodata;
use App\Models\Pembayaran;
use App\Models\Tagihan;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule; // <-- TAMBAHKAN INI

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
    if ($request->has("biodata_id") && $request->biodata_id != null) {
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
      return response()->json(
        [
          "message" => "Data biodata siswa tidak ditemukan untuk akun ini.",
          "total_tagihan" => 0,
          "riwayat" => [],
        ],
        404
      );
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
    $totalTerbayar = Pembayaran::where("biodata_id", $biodataId)->sum(
      "jumlah_bayar"
    );

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

    return response()->json(
      [
        "message" => "Tagihan berhasil dibuat!",
        "data" => $tagihan,
      ],
      201
    );
  }

  // [ADMIN/SISWA] Catat Pembayaran
  public function storePembayaran(Request $request)
  {
    $request->validate([
      "biodata_id" => "required|exists:biodatas,id",
      "jumlah_bayar" => "required|numeric|min:1000",
      "metode" => "nullable|string",
    ]);

    // If metode is Transfer or Digital, require an upload proof
    $metode = $request->metode ?? "Cash";
    if (
      in_array(strtolower($metode), [
        "transfer",
        "digital",
        "e-wallet",
        "ewallet",
      ])
    ) {
      $request->validate([
        "bukti" => "required|file|mimes:jpg,jpeg,png,pdf|max:5120",
      ]);
    }

    $buktiPath = null;
    if ($request->hasFile("bukti")) {
      $buktiPath = $request->file("bukti")->store("pembayaran_bukti", "public");
    }

    $pembayaran = Pembayaran::create([
      "biodata_id" => $request->biodata_id,
      "jumlah_bayar" => $request->jumlah_bayar,
      "tanggal_bayar" => now()->toDateString(),
      "metode" => $metode,
      "status" => "Lunas",
      "bukti" => $buktiPath,
    ]);

    $siswa = Biodata::find($request->biodata_id);
    $namaSiswa = $siswa ? $siswa->nama_lengkap : "Siswa";

    // Mencatat ke Transaksi (Gabungan logic)
    Transaksi::create([
      "tipe" => "pemasukan",
      "deskripsi" => "{$namaSiswa} telah membayar kas",
      "status" => $request->status ?? "sukses",
      "jumlah" => $request->jumlah_bayar,
      "tanggal" => now()->toDateString(),
    ]);

    // If there's a stored bukti, also return a public URL (requires storage:link)
    $buktiUrl = $pembayaran->bukti ? Storage::url($pembayaran->bukti) : null;

    return response()->json(
      [
        "message" => "Pembayaran berhasil dicatat!",
        "data" => $pembayaran,
        "bukti_url" => $buktiUrl,
      ],
      201
    );
  }

// [ADMIN] Perbarui Tagihan yang Sudah Ada (Fitur Saya - Dipertahankan)
public function updateTagihan(Request $request, $id)
{
  $tagihan = Tagihan::findOrFail($id);

  $request->validate([
    // Hapus Validasi biodata_id (karena tidak diubah di blok update) // <--- PERHATIKAN INI
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
    // TIDAK ADA "biodata_id" // <--- TIDAK ADA DISINI
  ]);
  // ... respons
}


  // [ADMIN] Hapus Tagihan (Fitur Saya - Dipertahankan)
  public function deleteTagihan($id)
  {
    Tagihan::findOrFail($id)->delete();
    return response()->json(["message" => "Tagihan berhasil dihapus"]);
  }
}
