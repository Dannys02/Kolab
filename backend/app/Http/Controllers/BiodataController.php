<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\Request;

class BiodataController extends Controller
{
  public function store(Request $request)
  {
    $request->validate([
      "nama_lengkap" => "required|string",
      "email" => "required|email",
      "phone" => "required|numeric",
      "alamat" => "required|string",
      "tanggal_lahir" => "required|date",
    ]);

    $biodata = Biodata::create($request->all());

    return response()->json(
      [
        "message" => "Pendaftaran Berhasil",
        "data" => $biodata,
      ],
      201
    );
  }

  public function update(Request $request, $id)
  {
    $request->validate([
      "nama_lengkap" => "required|string",
      "email" => "required|email",
      "phone" => "required|numeric",
      "alamat" => "required|string",
      "tanggal_lahir" => "required|date",
    ]);

    $biodata = Biodata::findOrFail($id);
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
}
