<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\Request;

class BiodataController extends Controller
{
    public function store(Request $request)
    {
        // Validasi fleksibel: jika biodata sudah ada, hanya validasi field yang dikirim
        $user = $request->user();
        $existingBiodata = Biodata::where('user_id', $user->id)->first();
        
        if ($existingBiodata) {
            // Jika biodata sudah ada, ini adalah UPDATE (misal update pilihan_program)
            // Validasi hanya field yang dikirim
            $rules = [];
            if ($request->has('nama_lengkap')) $rules['nama_lengkap'] = 'string';
            if ($request->has('email')) $rules['email'] = 'email';
            if ($request->has('phone')) $rules['phone'] = 'numeric';
            if ($request->has('alamat')) $rules['alamat'] = 'string';
            if ($request->has('tanggal_lahir')) $rules['tanggal_lahir'] = 'date';
            if ($request->has('pilihan_program')) $rules['pilihan_program'] = 'string';
            
            $request->validate($rules);
            
            // Update biodata yang sudah ada
            $existingBiodata->update($request->all());
            
            return response()->json([
                "message" => "Data Berhasil Diupdate",
                "data" => $existingBiodata->fresh(),
            ], 200);
        } else {
            // Jika biodata belum ada, ini adalah CREATE (pendaftaran baru)
            $request->validate([
                "nama_lengkap" => "required|string",
                "email" => "required|email",
                "phone" => "required|numeric",
                "alamat" => "required|string",
                "tanggal_lahir" => "required|date",
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