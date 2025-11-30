<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\Request;

class BiodataController extends Controller
{
    /**
     * Metode Store/Update Hybrid:
     * 1. Jika Biodata belum ada untuk user ini, lakukan CREATE (Pendaftaran Baru).
     * 2. Jika Biodata sudah ada, lakukan UPDATE.
     */
    public function store(Request $request)
    {
        // 1. Ambil user yang sedang login dari token
        $user = $request->user(); 

        // 2. Cek apakah biodata sudah ada
        $existingBiodata = Biodata::where('user_id', $user->id)->first();
        
        if ($existingBiodata) {
            // --- LOGIKA UPDATE (Jika biodata sudah ada) ---

            // Validasi hanya field yang dikirim (fleksibel untuk partial update)
            $rules = [];
            if ($request->has('nama_lengkap')) $rules['nama_lengkap'] = 'nullable|string';
            if ($request->has('email')) $rules['email'] = 'nullable|email';
            if ($request->has('phone')) $rules['phone'] = 'nullable|numeric';
            if ($request->has('alamat')) $rules['alamat'] = 'nullable|string';
            if ($request->has('tanggal_lahir')) $rules['tanggal_lahir'] = 'nullable|date';
            if ($request->has('pilihan_program')) $rules['pilihan_program'] = 'nullable|string';
            
            $request->validate($rules);
            
            // Update data yang ada
            $existingBiodata->update($request->all());
            
            return response()->json([
                "message" => "Data Berhasil Diupdate",
                "data" => $existingBiodata->fresh(),
            ], 200);
            
        } else {
            // --- LOGIKA CREATE (Jika biodata belum ada) ---

            // Validasi wajib untuk pendaftaran awal
            $request->validate([
                "nama_lengkap" => "required|string",
                "email" => "required|email|unique:biodatas,email", // Tambahkan unique check
                "phone" => "required|numeric",
                "alamat" => "required|string",
                "tanggal_lahir" => "required|date",
                // 'pilihan_program' bisa menjadi opsional saat create
            ]);

            $data = $request->all();
            $data['user_id'] = $user->id;

            $biodata = Biodata::create($data);

            return response()->json([
                "message" => "Pendaftaran Berhasil",
                "data" => $biodata,
            ], 201);
        }
    }

// ----------------------------------------------------------------------

    /**
     * [ADMIN/LAMA] Metode Update standar berdasarkan ID (Tidak terikat User yang sedang login)
     */
    public function update(Request $request, $id)
    {
        // Validasi wajib (standar) untuk update penuh
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

// ----------------------------------------------------------------------

    /**
     * Metode Destroy standar berdasarkan ID
     */
    public function destroy($id)
    {
        Biodata::findOrFail($id)->delete();

        return response()->json([
            "message" => "Data Berhasil Dihapus",
        ]);
    }
}
