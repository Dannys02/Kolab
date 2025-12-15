<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function biodataIndex() {
        $data = Biodata::all();
        
        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data siswa berhasil diambil',
            'data' => $data
        ], 200);
    }

    // --- TAMBAHAN UNTUK MEMPERBAIKI ERROR 404 PENGUMUMAN ---
    public function pengumuman() {
        // Mengembalikan array kosong agar frontend tidak error
        // Nanti bisa kamu isi logic ambil data dari database Pengumuman
        return response()->json([
            'status' => 'sukses',
            'data' => [] 
        ], 200);
    }

    // --- TAMBAHAN UNTUK MEMPERBAIKI ERROR 404 JADWAL ---
    public function jadwal() {
        // Mengembalikan array kosong agar frontend tidak error
        return response()->json([
            'status' => 'sukses',
            'data' => []
        ], 200);
    }
}