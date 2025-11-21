<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Role 'admin' DAN 'user' (Wajib dua-duanya)
        $roleAdmin = Role::firstOrCreate(['name' => 'admin']);
        $roleUser  = Role::firstOrCreate(['name' => 'user']); // <--- INI YANG KURANG TADI

        // 2. Buat Akun Admin
        // Gunakan firstOrCreate agar tidak error "Duplicate Entry" kalau di-seed ulang
        $admin = User::firstOrCreate(
            ['email' => 'admin@ssb.com'], // Cek dulu email ini ada ga?
            [
                'name' => 'Admin Sekolah',
                'password' => Hash::make('password123'), // Password default
            ]
        );

        // 3. Assign Role Spatie ke user ini
        $admin->assignRole($roleAdmin);
        
        // (Opsional) Buat 1 User Siswa Dummy buat ngetes Login User
        $siswa = User::firstOrCreate(
            ['email' => 'siswa@ssb.com'],
            [
                'name' => 'Siswa Contoh',
                'password' => Hash::make('password123'),
            ]
        );
        $siswa->assignRole($roleUser);
    }
}