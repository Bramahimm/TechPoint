<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->uuid('id')->primary(); // Primary key UUID

            // transaksi_id → UUID (karena tabel transaksi pakai UUID)
            $table->uuid('transaksi_id');
            $table->foreign('transaksi_id')
                ->references('id')
                ->on('transaksi')
                ->onDelete('cascade');

            // barang_id → UUID (karena tabel barang sekarang pakai UUID)
            $table->uuid('barang_id');
            $table->foreign('barang_id')
                ->references('id')
                ->on('barang')
                ->onDelete('cascade');

            $table->integer('jumlah');
            $table->decimal('harga_satuan', 12, 2);
            $table->timestamps(); 
        });
    }

    public function down(): void {
        Schema::dropIfExists('detail_transaksi');
    }
};
