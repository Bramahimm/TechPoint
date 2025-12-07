<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('ulasan', function (Blueprint $table) {
<<<<<<< HEAD
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('barang_id')->constrained('barang')->onDelete('cascade');
            $table->tinyInteger('rating'); // 1-5
=======
            $table->uuid('id')->primary();
            
            // Gunakan foreignUuid agar seragam
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('barang_id')->constrained('barang')->onDelete('cascade');
            
            $table->integer('rating'); // Skala 1-5
>>>>>>> 1c1f00469ff9d80460dcda467a83a5167f203fc4
            $table->text('komentar')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('ulasan');
    }
};