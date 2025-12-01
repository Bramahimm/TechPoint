<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('toko_id');
            $table->string('nomor_transaksi')->unique();
            $table->decimal('total', 15, 2);
            $table->enum('status', ['pending', 'paid', 'shipped', 'completed', 'cancelled']);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('toko_id')->references('id')->on('toko')->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('transaksi');
    }
};
