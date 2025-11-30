<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tagihan extends Model
{
    // Properti fillable yang dipertahankan dari kedua file
    protected $fillable = [
        'biodata_id',
        'judul',
        'jumlah',
        'jatuh_tempo',
        'status'
    ];

    /**
     * Relasi ke model Biodata
     */
    public function biodata()
    {
        // Menggunakan sintaks yang lebih ringkas dan otomatis menemukan kelas Biodata
        // Asumsi model Biodata berada dalam namespace App\Models
        return $this->belongsTo(Biodata::class, 'biodata_id');
    }
}
