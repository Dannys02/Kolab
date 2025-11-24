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
        $table->foreignId('biodata_id')->constrained('biodatas')->onDelete('cascade');
        $table->string('judul'); // Contoh: "Uang Pangkal", "SPP Maret"
        $table->decimal('jumlah', 10, 2); // Contoh: 2500000.00
        $table->string('status')->default('Belum Lunas')->nullable(); // Lunas / Belum Lunas
        $table->date('jatuh_tempo');
            $table->timestamps();
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
