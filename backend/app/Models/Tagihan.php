<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tagihan extends Model
{
    // [FIX] Tambahkan ini agar data bisa masuk
    protected $fillable = [
        'biodata_id',
        'judul',
        'jumlah',
        'jatuh_tempo',
        'status'
    ];
    
}
