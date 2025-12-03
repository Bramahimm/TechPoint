<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('keranjang', function (Blueprint $table) {
            $table->uuid('id')->primary(); // Primary Key UUID

            // Foreign Key UUID yang rapi
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('barang_id')->constrained('barang')->onDelete('cascade');

            $table->integer('jumlah');
            
            // Tambahan kolom yang diminta Controller
            $table->string('varian')->nullable(); 
            $table->boolean('is_selected')->default(true); 

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('keranjang');
    }
};