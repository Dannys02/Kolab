<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contact;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi
        $request->validate([
            'nama' => 'required|string',
            'email' => 'required|email',
            'subjek' => 'required|string',
            'pesan' => 'required|string',
        ]);

        // 2. Simpan ke Database
        $contact = Contact::create($request->all());

        // 3. Kirim Email ke Admin (Opsional - Codingan simpel tanpa buat Class Mail)
        // Ini akan mengirim email raw text ke admin
        try {
            Mail::raw("Ada pesan baru dari: " . $request->nama . "\n\nIsi Pesan:\n" . $request->pesan, function ($message) use ($request) {
                $message->to('gt1xtplayer@gmail.com') // Ganti email admin tujuan
                        ->subject('Pesan Baru Website SSB: ' . $request->subjek);
            });
        } catch (\Exception $e) {
            // Jika email gagal kirim, biarkan saja, yang penting data tersimpan di DB
        }

        return response()->json([
            'message' => 'Pesan Anda berhasil dikirim!',
            'data' => $contact
        ], 201);
    }
}