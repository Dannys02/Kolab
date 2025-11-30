<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tagihans', function (Blueprint $table) {
            $table->id();
            // Kunci asing yang menghubungkan ke tabel 'biodatas'
            $table->foreignId('biodata_id')->constrained('biodatas')->onDelete('cascade');
            
            $table->string('judul'); // Contoh: "Uang Pangkal", "SPP Maret"
            $table->decimal('jumlah', 10, 2); // Jumlah tagihan, max 10 digit, 2 di belakang koma
            
            // Status Tagihan: default 'Belum Lunas' dan diizinkan NULL
            $table->string('status')->default('Belum Lunas')->nullable(); 
            
            $table->date('jatuh_tempo'); // Tanggal Batas Pembayaran
            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tagihans');
    }
};
