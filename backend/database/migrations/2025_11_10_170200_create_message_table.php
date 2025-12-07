<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('message', function (Blueprint $table) {
<<<<<<< HEAD
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversation')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade'); // Pengirim pesan
=======
            $table->uuid('id')->primary();

            // Rapikan pakai foreignUuid
            $table->foreignUuid('conversation_id')->constrained('conversation')->onDelete('cascade');
            $table->foreignUuid('sender_id')->constrained('users')->onDelete('cascade');

>>>>>>> 1c1f00469ff9d80460dcda467a83a5167f203fc4
            $table->text('pesan');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('message');
    }
};