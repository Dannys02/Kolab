<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Biodata extends Model
{
    use HasFactory; // Diambil dari file pertama

    protected $fillable = [
        // Gabungan dari kedua daftar fillable
        'user_id',      // Dari file 1
        'nama_lengkap',
        'email',
        'phone',
        'alamat',
        'tanggal_lahir' // Urutan tidak masalah, yang penting terdaftar
        // 'pilihan_program' (jika ada di controller, sebaiknya ditambahkan di sini, tapi saya ikuti yang ada di Model)
    ];

    /**
     * Relasi ke model User (Dari file pertama)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke model Tagihan (Dari file kedua)
     */
    public function tagihans()
    {
        // Pastikan kelas Tagihan sudah diimpor atau menggunakan namespace penuh jika diperlukan
        // Dalam konteks ini, asumsikan Tagihan ada di namespace App\Models;
        return $this->hasMany(Tagihan::class, 'biodata_id');
    }
}
