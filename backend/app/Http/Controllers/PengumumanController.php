<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PengumumanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Ambil semua pengumuman aktif untuk user (siswa)
            $pengumumans = Pengumuman::where('is_active', true)
                ->with('user:id,name')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'message' => 'Data pengumuman berhasil diambil',
                'data' => $pengumumans
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'judul' => 'required|string|max:255',
                'isi' => 'required|string',
                'is_active' => 'nullable|boolean'
            ]);

            $pengumuman = Pengumuman::create([
                'user_id' => Auth::id(),
                'judul' => $request->judul,
                'isi' => $request->isi,
                'is_active' => $request->has('is_active') ? (bool)$request->is_active : true
            ]);

            return response()->json([
                'message' => 'Pengumuman berhasil dibuat',
                'data' => $pengumuman->load('user:id,name')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $pengumuman = Pengumuman::with('user:id,name')->findOrFail($id);

            return response()->json([
                'message' => 'Data pengumuman berhasil diambil',
                'data' => $pengumuman
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'judul' => 'required|string|max:255',
                'isi' => 'required|string',
                'is_active' => 'nullable|boolean'
            ]);

            $pengumuman = Pengumuman::findOrFail($id);
            $updateData = [
                'judul' => $request->judul,
                'isi' => $request->isi,
            ];
            
            if ($request->has('is_active')) {
                $updateData['is_active'] = (bool)$request->is_active;
            }
            
            $pengumuman->update($updateData);

            return response()->json([
                'message' => 'Pengumuman berhasil diupdate',
                'data' => $pengumuman->load('user:id,name')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $pengumuman = Pengumuman::findOrFail($id);
            $pengumuman->delete();

            return response()->json([
                'message' => 'Pengumuman berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all pengumuman for admin (including inactive)
     */
    public function indexAdmin()
    {
        try {
            $pengumumans = Pengumuman::with('user:id,name')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'message' => 'Data pengumuman berhasil diambil',
                'data' => $pengumumans
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}

