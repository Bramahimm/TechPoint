<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
    {
        Schema::create('message', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversation')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade'); // Pengirim pesan
            $table->text('pesan');
            $table->timestamps(); // Sesuai ERD: created_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message');
    }
};
