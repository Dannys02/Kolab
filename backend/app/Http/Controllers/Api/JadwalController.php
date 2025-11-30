<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Jadwal;
use Illuminate\Validation\Rule;

class JadwalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jadwals = Jadwal::orderBy('hari')->get();
        return response()->json(['data' => $jadwals]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'hari' => 'required|string|max:50',
            'jam_mulai' => 'nullable|date_format:H:i',
            'jam_selesai' => 'nullable|date_format:H:i',
            'materi' => 'nullable|string',
            'lokasi' => 'nullable|string|max:191',
            'aktif' => ['nullable', Rule::in([0,1,true,false])],
        ]);

        $jadwal = Jadwal::create($validated);
        return response()->json(['data' => $jadwal], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $jadwal = Jadwal::findOrFail($id);
        return response()->json(['data' => $jadwal]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $jadwal = Jadwal::findOrFail($id);
        $validated = $request->validate([
            'hari' => 'required|string|max:50',
            'jam_mulai' => 'nullable|date_format:H:i',
            'jam_selesai' => 'nullable|date_format:H:i',
            'materi' => 'nullable|string',
            'lokasi' => 'nullable|string|max:191',
            'aktif' => ['nullable', Rule::in([0,1,true,false])],
        ]);
        $jadwal->update($validated);
        return response()->json(['data' => $jadwal]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $jadwal = Jadwal::findOrFail($id);
        $jadwal->delete();
        return response()->json(['message' => 'Jadwal dihapus']);
    }
}
