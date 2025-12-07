<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('conversation', function (Blueprint $table) {
<<<<<<< HEAD
            $table->id();
            // Relasi antara user (pembeli) dan toko (penjual)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('toko_id')->constrained('toko')->onDelete('cascade');
            $table->timestamps(); // Sesuai ERD: created_at
=======
            $table->uuid('id')->primary();

            // Rapikan pakai foreignUuid
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('toko_id')->constrained('toko')->onDelete('cascade');

            $table->timestamps();
>>>>>>> 1c1f00469ff9d80460dcda467a83a5167f203fc4
        });
    }

    public function down(): void {
        Schema::dropIfExists('conversation');
    }
};