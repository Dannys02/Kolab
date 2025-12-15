<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BiodataController extends Controller
{
    public function store(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(["message" => "Unauthorized"], 401);
            }

            // 1. CARI BIODATA (Logika Cerdas)
            // Cari berdasarkan user_id DULU
            $existingBiodata = Biodata::where('user_id', $user->id)->first();

            // Jika tidak ketemu, cari berdasarkan EMAIL (Kasus dibuatkan Admin)
            if (!$existingBiodata) {
                $existingBiodata = Biodata::where('email', $user->email)->first();
                
                // Jika ketemu via email, update user_id nya jadi milik user yang login (KLAIM DATA)
                if ($existingBiodata) {
                    $existingBiodata->user_id = $user->id;
                    $existingBiodata->save();
                }
            }

            if ($existingBiodata) {
                // ==========================
                // LOGIKA UPDATE
                // ==========================
                
                $request->validate([
                    'pilihan_program' => 'string|nullable',
                    // Validasi lain tidak wajib agar user bisa update parsial
                ]);
                
                // LOGIKA KUNCI PROGRAM (Agar user bisa pilih program walau dibuatkan admin)
                if ($request->has('pilihan_program')) {
                    $isAdmin = (isset($user->role) && $user->role === 'admin');
                    
                    // Ambil program lama
                    $programLama = $existingBiodata->pilihan_program ? trim($existingBiodata->pilihan_program) : null;
                    
                    // Program dianggap "Belum Dipilih" jika: Null, Kosong, Strip, atau kata-kata default
                    $ignoredValues = ['', '-', 'null', 'belum memilih', 'belum dipilih', 'pilih program', 'tidak ada'];
                    
                    $isTerkunci = !is_null($programLama) && 
                                  !in_array(strtolower($programLama), $ignoredValues);

                    // Jika sudah terkunci & bukan admin & mencoba ganti program -> Error
                    if ($isTerkunci && !$isAdmin) {
                        if (strtolower($request->pilihan_program) !== strtolower($programLama)) {
                            return response()->json([
                                "message" => "Pilihan program sudah dikunci ($programLama). Hubungi admin untuk ubah."
                            ], 403);
                        }
                    }
                }
                
                // Filter hanya data yang dikirim yang diupdate
                $dataToUpdate = array_filter($request->all(), function($value) {
                    return !is_null($value);
                });

                $existingBiodata->update($dataToUpdate);
                
                return response()->json([
                    "message" => "Data Berhasil Diupdate",
                    "data" => $existingBiodata->fresh(),
                ], 200);

            } else {
                // ==========================
                // LOGIKA CREATE (Benar-benar User Baru)
                // ==========================
                
                // Cek apakah email sudah dipakai orang lain (untuk mencegah error 500 Duplicate)
                if (Biodata::where('email', $request->email)->exists()) {
                    return response()->json([
                        "message" => "Email ini sudah terdaftar pada biodata lain. Hubungi admin."
                    ], 409);
                }

                $data = $request->all();
                $data['user_id'] = $user->id;

                // Pastikan program NULL jika kosong
                if (empty($data['pilihan_program'])) {
                    $data['pilihan_program'] = null;
                }

                $biodata = Biodata::create($data);

                return response()->json([
                    "message" => "Pendaftaran Berhasil",
                    "data" => $biodata,
                ], 201);
            }

        } catch (\Throwable $e) {
            Log::error("Biodata Error: " . $e->getMessage());
            return response()->json([
                "message" => "Terjadi kesalahan server.",
                "error_detail" => $e->getMessage()
            ], 500);
        }
    }

    // Method lain (Destroy, Admin Update, dll) biarkan sama
    public function destroy($id) {
        Biodata::findOrFail($id)->delete();
        return response()->json(["message" => "Dihapus"]);
    }
    
    public function update(Request $request, $id) {
       $biodata = Biodata::findOrFail($id);
       $biodata->update($request->all());
       return response()->json(["message" => "Update Sukses", "data" => $biodata]);
    }

    public function forceSetProgram(Request $request, $id) {
        $request->validate(['pilihan_program' => 'required']);
        $biodata = Biodata::findOrFail($id);
        $biodata->pilihan_program = $request->pilihan_program;
        $biodata->save();
        return response()->json(['message' => 'Sukses', 'data' => $biodata]);
    }
}