<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use Illuminate\Http\Request;

class TransaksiController extends Controller
{
    public function index()
    {
        return Transaksi::orderBy('tanggal', 'desc')->get();
    }

    public function pemasukan()
    {
        return Transaksi::where('tipe', 'pemasukan')->orderBy('tanggal', 'desc')->get();
    }

    public function pengeluaran()
    {
        return Transaksi::where('tipe', 'pengeluaran')->orderBy('tanggal', 'desc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipe' => 'required|in:pemasukan,pengeluaran',
            'deskripsi' => 'required|string',
            'jumlah' => 'required|numeric',
            'tanggal' => 'required|date',
        ]);

        return Transaksi::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $transaksi = Transaksi::findOrFail($id);
        $transaksi->update([
            'tanggal' => $request->tanggal,
            'deskripsi' => $request->deskripsi,
            'jumlah' => $request->jumlah,
        ]);

        return response()->json(['message' => 'updated']);
    }

    public function destroy($id)
    {
        $transaksi = Transaksi::findOrFail($id);
        $transaksi->delete();
        return response()->noContent();
    }
}
