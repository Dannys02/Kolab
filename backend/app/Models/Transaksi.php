<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $table = "transaksis";

    protected $fillable = 
    [
        'tipe',
        'deskripsi',
        'jumlah',
        'tanggal'
    ];
}
