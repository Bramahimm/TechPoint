<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Menggunakan foreignUuid (Lebih rapi)
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('toko_id')->constrained('toko')->onDelete('cascade');
            
            // Perbaikan Nama Kolom agar sesuai Controller
            $table->string('invoice_number')->unique(); // Sebelumnya: nomor_transaksi
            $table->decimal('total_harga', 15, 2);      // Sebelumnya: total
            $table->enum('status', ['pending', 'paid', 'shipped', 'completed', 'cancelled'])->default('pending');
            
            // Tambahan Wajib
            $table->string('alamat_pengiriman');

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('transaksi');
    }
};