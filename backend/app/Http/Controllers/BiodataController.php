<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\Request;

class BiodataController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            "nama_lengkap" => "required|string",
            "email" => "required|email",
            "phone" => "required|numeric",
            "alamat" => "required|string",
            "tanggal_lahir" => "required|date",
        ]);

        // [PERBAIKAN] Ambil semua inputan
        $data = $request->all();

        // [PERBAIKAN] Masukkan ID user yang sedang login secara otomatis
        $data['user_id'] = $request->user()->id;

        // Cek apakah user ini sudah punya biodata sebelumnya? (Mencegah duplikat)
        $existingBiodata = Biodata::where('user_id', $data['user_id'])->first();
        if ($existingBiodata) {
            return response()->json(['message' => 'Biodata Anda sudah ada. Silakan edit saja.'], 400);
        }

        $biodata = Biodata::create($data);

        return response()->json(
            [
                "message" => "Pendaftaran Berhasil",
                "data" => $biodata,
            ],
            201
        );
    }

    // ... method update dan destroy biarkan atau sesuaikan validasinya ...

    public function update(Request $request, $id)
    {
        // ... kode lama ...
        $request->validate([
            "nama_lengkap" => "required|string",
            "email" => "required|email",
            "phone" => "required|numeric",
            "alamat" => "required|string",
            "tanggal_lahir" => "required|date",
        ]);

        $biodata = Biodata::findOrFail($id);
        $biodata->update($request->all());

        return response()->json([
            "message" => "Data Berhasil Diupdate",
            "data" => $biodata,
        ]);

    }

    public function destroy($id)
    {
        Biodata::findOrFail($id)->delete();

        return response()->json([
            "message" => "Data Berhasil Dihapus",
        ]);
    }
}
