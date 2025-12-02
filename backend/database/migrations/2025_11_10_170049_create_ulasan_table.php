<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('ulasan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Gunakan foreignUuid agar seragam
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('barang_id')->constrained('barang')->onDelete('cascade');
            
            $table->integer('rating'); // Skala 1-5
            $table->text('komentar')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('ulasan');
    }
};