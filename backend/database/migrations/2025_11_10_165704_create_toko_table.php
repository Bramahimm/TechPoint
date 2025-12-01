<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('toko', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Kita pakai foreignUuid + unique (karena 1 user cuma boleh punya 1 toko)
            $table->foreignUuid('user_id')
                  ->unique() 
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->string('nama_toko');
            
            // --- INI YANG TADI HILANG ---
            $table->text('alamat'); 
            $table->string('no_telp')->nullable();
            // ----------------------------

            $table->text('deskripsi')->nullable();
            $table->string('logo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('toko');
    }
};