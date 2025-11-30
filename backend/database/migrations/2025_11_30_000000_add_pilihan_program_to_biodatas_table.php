<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('biodatas', 'pilihan_program')) {
            Schema::table('biodatas', function (Blueprint $table) {
                $table->string('pilihan_program')->nullable()->after('tanggal_lahir');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasColumn('biodatas', 'pilihan_program')) {
            Schema::table('biodatas', function (Blueprint $table) {
                $table->dropColumn('pilihan_program');
            });
        }
    }
};
