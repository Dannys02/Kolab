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
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('biodata_id')->constrained('biodatas')->onDelete('cascade');
        // Opsional: Hubungkan ke tagihan mana pembayaran ini
        $table->foreignId('tagihan_id')->nullable()->constrained('tagihans');
        $table->decimal('jumlah_bayar', 10, 2);
        $table->date('tanggal_bayar');
        $table->string('metode')->default('Cash'); // Cash / Transfer
        $table->string('status')->default('BelumLunas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};
