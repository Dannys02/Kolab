<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Biodata extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'email',
        'phone',
        'alamat',
        'tanggal_lahir',
        'pilihan_program'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
