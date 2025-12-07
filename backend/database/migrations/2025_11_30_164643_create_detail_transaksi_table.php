<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('transaksi_id')->constrained('transaksi')->onDelete('cascade');
            $table->foreignUuid('barang_id')->constrained('barang')->onDelete('cascade');

            $table->integer('jumlah');
            $table->decimal('harga_satuan', 12, 2);
            $table->string('nama_barang_snapshot'); // Simpan nama barang saat beli (jaga2 kalau barang dihapus/diedit)
            $table->string('gambar_snapshot')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('detail_transaksi');
    }
};