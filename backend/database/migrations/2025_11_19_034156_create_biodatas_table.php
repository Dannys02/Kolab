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
        Schema::create('biodatas', function (Blueprint $table) {
        $table->id();
        $table->string('nama_lengkap')->nullable();
        $table->string('email')->unique()->nullable();
        $table->string('phone')->unique()->nullable(); // [FIX] Ganti integer jadi string
        $table->date('tanggal_lahir')->nullable(); // [FIX] Tambahkan ini agar sinkron dengan React
        $table->text('alamat')->nullable(); // [FIX] String -> text agar muat banyak
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biodatas');
    }
};
