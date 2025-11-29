<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tagihan extends Model
{
    protected $fillable = [
        'biodata_id',
        'judul',
        'jumlah',
        'jatuh_tempo',
        'status'
    ];

    public function biodata()
    {
        return $this->belongsTo(\App\Models\Biodata::class, 'biodata_id');
    }
}
