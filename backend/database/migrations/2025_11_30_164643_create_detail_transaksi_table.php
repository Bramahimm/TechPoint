<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->id();
            // Hubungkan ke tabel transaksi utama
            $table->foreignId('transaksi_id')->constrained('transaksi')->onDelete('cascade');
            // Hubungkan ke barang yang dibeli
            $table->foreignId('barang_id')->constrained('barang')->onDelete('cascade');
            
            $table->integer('jumlah'); // Qty barang
            $table->decimal('harga_satuan', 12, 2); // Harga saat transaksi terjadi
        }); // Closing brace for up method
    }
    public function down(): void
    {
        Schema::dropIfExists('detail_transaksi');
    }
};
