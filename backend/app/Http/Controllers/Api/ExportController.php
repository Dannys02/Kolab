<?php

namespace App\Http\Controllers\Api;

use App\Models\Biodata;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ExportController extends Controller
{
    /**
     * Get all registered students with their program choices
     * Endpoint: GET /api/export/siswa-program
     * Returns: JSON array of students with their data
     */
    public function getSiswaProgram(Request $request)
    {
        // Check if user is admin
        if (!$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $biodatas = Biodata::with('user')
            ->select('id', 'user_id', 'nama_lengkap', 'email', 'phone', 'alamat', 'tanggal_lahir', 'pilihan_program')
            ->orderBy('nama_lengkap', 'asc')
            ->get()
            ->map(function ($biodata) {
                return [
                    'id' => $biodata->id,
                    'nama_siswa' => $biodata->nama_lengkap,
                    'email_siswa' => $biodata->email,
                    'no_hp' => $biodata->phone,
                    'alamat' => $biodata->alamat,
                    'tanggal_lahir' => $biodata->tanggal_lahir,
                    'program_dipilih' => $biodata->pilihan_program ?? 'Belum Memilih',
                    'nama_akun' => $biodata->user->name ?? '-'
                ];
            });

        return response()->json([
            'message' => 'Data siswa berhasil diambil',
            'total' => $biodatas->count(),
            'data' => $biodatas
        ]);
    }

    /**
     * Get program summary: which program chosen by how many students
     * Endpoint: GET /api/export/ringkasan-program
     * Returns: Summary of program choices
     */
    public function getRingkasanProgram(Request $request)
    {
        // Check if user is admin
        if (!$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ringkasan = Biodata::select('pilihan_program')
            ->whereNotNull('pilihan_program')
            ->groupBy('pilihan_program')
            ->selectRaw('pilihan_program, COUNT(*) as jumlah_siswa')
            ->get();

        $belumMemilih = Biodata::whereNull('pilihan_program')->count();

        return response()->json([
            'message' => 'Ringkasan program berhasil diambil',
            'data' => $ringkasan,
            'belum_memilih' => $belumMemilih,
            'total_siswa' => Biodata::count()
        ]);
    }

    /**
     * Get list of students who chose a specific program
     * Endpoint: GET /api/export/program/{programId}/siswa
     * Returns: List of students for that program
     */
    public function getSiswaByProgram(Request $request, $programId)
    {
        // Check if user is admin
        if (!$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $siswa = Biodata::where('pilihan_program', $programId)
            ->with('user')
            ->select('id', 'user_id', 'nama_lengkap', 'email', 'phone', 'alamat', 'tanggal_lahir', 'pilihan_program')
            ->orderBy('nama_lengkap', 'asc')
            ->get()
            ->map(function ($biodata) {
                return [
                    'id' => $biodata->id,
                    'nama_siswa' => $biodata->nama_lengkap,
                    'email_siswa' => $biodata->email,
                    'no_hp' => $biodata->phone,
                    'alamat' => $biodata->alamat,
                    'tanggal_lahir' => $biodata->tanggal_lahir,
                    'program' => $biodata->pilihan_program,
                    'nama_akun' => $biodata->user->name ?? '-'
                ];
            });

        return response()->json([
            'message' => "Data siswa program {$programId} berhasil diambil",
            'program' => $programId,
            'jumlah' => $siswa->count(),
            'data' => $siswa
        ]);
    }
}
