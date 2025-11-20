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
}
