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
            
            // Jika ada upaya mengubah pilihan_program, pastikan tidak sudah ter-set
            if ($request->has('pilihan_program')) {
                // jika sudah ada pilihan dan user bukan admin, tolak
                if ($existingBiodata->pilihan_program && !$user->hasRole('admin')) {
                    return response()->json(["message" => "Pilihan program sudah diset dan tidak dapat diubah. Hubungi admin."], 403);
                }
            }

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

        // Protect pilihan_program from being changed by non-admins once set
        if ($request->has('pilihan_program')) {
            if ($biodata->pilihan_program && !$request->user()->hasRole('admin')) {
                return response()->json(["message" => "Pilihan program sudah diset dan tidak dapat diubah oleh user."], 403);
            }
        }

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

    /**
     * Force set pilihan_program by admin.
     * Route: POST /api/admin/biodata/{id}/force-set-program
     */
    public function forceSetProgram(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->hasRole('admin')) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $request->validate([
            'pilihan_program' => 'required|string'
        ]);

        $biodata = Biodata::findOrFail($id);
        $biodata->pilihan_program = $request->pilihan_program;
        $biodata->save();

        return response()->json([
            'message' => 'Pilihan program berhasil diperbarui oleh admin',
            'data' => $biodata->fresh(),
        ]);
    }
}
