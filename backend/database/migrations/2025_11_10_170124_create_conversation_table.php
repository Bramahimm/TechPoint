<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversation', function (Blueprint $table) {
            $table->id();
            // Relasi antara user (pembeli) dan toko (penjual)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('toko_id')->constrained('tokos')->onDelete('cascade');
            $table->timestamps(); // Sesuai ERD: created_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversation');
    }
};
