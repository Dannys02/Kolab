<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Biodata extends Model
{
    protected $fillable = [
        'nama_lengkap',
        'email',
        'phone',
        'tanggal_lahir',
        'alamat'
    ];

    public function tagihans()
    {
        return $this->hasMany(Tagihan::class, 'biodata_id');
    }
}
