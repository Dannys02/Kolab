<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\Request;

class BiodataController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|numeric',
            'alamat' => 'required|string',
            'tanggal_lahir' => 'required|date'
        ]);

        $biodata = Biodata::create([
            'nama_lengkap' => $request->nama_lengkap,
            'email' => $request->email,
            'phone' => $request->phone,
            'alamat' => $request->alamat,
            'tanggal_lahir' => $request->tanggal_lahir
        ]);

        return response()->json([
            'message' => 'Pendaftaran Berhasil',
            'data' => $biodata
        ], 201);
    }
}
