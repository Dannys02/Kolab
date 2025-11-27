<?php

namespace Database\Seeders;

use App\Models\TotalKas;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TotalKasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TotalKas::create(['amount' => 5000]);
    }
}
