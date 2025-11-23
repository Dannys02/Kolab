<?php

namespace App\Http\Controllers;

use App\Models\TotalKas;
use Illuminate\Http\Request;

class TotalKasController extends Controller
{
    public function index()
    {
        $total = TotalKas::first();

        return response()->json([
            'total_kas' => $total ? $total->amount : 0
        ]);
    }
}
