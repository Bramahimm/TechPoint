<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('message', function (Blueprint $table) {
            // Primary key UUID
            $table->uuid('id')->primary();

            // conversation_id → UUID (karena tabel conversation juga pakai UUID)
            $table->uuid('conversation_id');
            $table->foreign('conversation_id')
                ->references('id')
                ->on('conversation')
                ->onDelete('cascade');

            // sender_id → UUID (karena tabel users pakai UUID)
            $table->uuid('sender_id');
            $table->foreign('sender_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->text('pesan');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('message');
    }
};
