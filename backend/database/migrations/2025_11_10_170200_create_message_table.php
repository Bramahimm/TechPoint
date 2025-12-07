<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('message', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Rapikan pakai foreignUuid
            $table->foreignUuid('conversation_id')->constrained('conversation')->onDelete('cascade');
            $table->foreignUuid('sender_id')->constrained('users')->onDelete('cascade');

            $table->text('pesan');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('message');
    }
};