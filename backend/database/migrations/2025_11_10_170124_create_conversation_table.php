<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('conversation', function (Blueprint $table) {
            $table->uuid('id')->primary(); // Primary key jadi UUID

            // user_id (pembeli) → UUID
            $table->uuid('user_id');
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            // toko_id → UUID (karena tabel toko juga pakai UUID)
            $table->uuid('toko_id');
            $table->foreign('toko_id')
                ->references('id')
                ->on('toko')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('conversation');
    }
};
