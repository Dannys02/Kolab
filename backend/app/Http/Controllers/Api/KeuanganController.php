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
  // [ADMIN] Ambil data keuangan berdasarkan ID Biodata Siswa (Query Param)
  public function index()
  {
    $data = Biodata::with("tagihans")->get();

    return response()->json($data);
  }

  // [SISWA] Ambil data tagihan untuk User yang sedang login
  public function getTagihanSiswa(Request $request)
  {
    $user = Auth::user();

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

    $keuanganData = $this->getDataKeuangan($biodata->id)->getOriginalContent();
    $keuanganData["biodata"] = $biodata;

    return response()->json($keuanganData);
  }

  // [HELPER] Fungsi Logika Utama Hitung Keuangan (Private)
  private function getDataKeuangan($biodataId)
  {
    $listTagihan = Tagihan::where("biodata_id", $biodataId)
      ->orderBy("jatuh_tempo", "desc")
      ->get();

    $totalTagihan = $listTagihan->sum("jumlah");

    $totalTerbayar = Pembayaran::where("biodata_id", $biodataId)->sum(
      "jumlah_bayar"
    );

    $sisaTagihan = $totalTagihan - $totalTerbayar;

    $riwayat = Pembayaran::where("biodata_id", $biodataId)
      ->orderBy("tanggal_bayar", "desc")
      ->take(10)
      ->get();

    return response()->json([
      "biodata_id" => $biodataId,
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

    Transaksi::create([
      "tipe" => "pemasukan",
      "deskripsi" => "Pembayaran kas dari {$namaSiswa}",
      "status" => $request->status,
      "jumlah" => $request->jumlah_bayar,
      "tanggal" => now()->toDateString(),
    ]);

    return response()->json(
      [
        "message" => "Pembayaran berhasil dicatat!",
        "data" => $pembayaran,
      ],
      201
    );
  }

  // [ADMIN] Perbarui Tagihan yang Sudah Ada
  public function updateTagihan(Request $request, $id)
  {
    $tagihan = Tagihan::findOrFail($id);

    $request->validate([
      // 🔥 PERBAIKAN VALIDASI: Jadikan biodata_id opsional jika tidak dikirim (nullable)
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

    return response()->json(
      [
        "message" => "Tagihan berhasil diperbarui!",
        "data" => $tagihan,
      ],
      200
    );
  }

  // Hapus Tagihan
  public function deleteTagihan($id)
  {
    Tagihan::findOrFail($id)->delete();
    return response()->json(["message" => "Tagihan berhasil dihapus"]);
  }
}