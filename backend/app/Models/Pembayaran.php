<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    // Izinkan kolom ini diisi massal
    protected $fillable = [
        'biodata_id',
        'jumlah_bayar',
        'tanggal_bayar',
        'metode',
        'status',
        'bukti'
    ];

    // Relasi balik ke Biodata (Opsional, tapi berguna nanti)
    public function biodata()
    {
        return $this->belongsTo(Biodata::class);
    }
}