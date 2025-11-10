<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('invoice_number')->unique();
            $table->decimal('total_harga', 12, 2);
            $table->string('status')->default('pending');
            $table->timestamps(); // Sesuai ERD: created_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
