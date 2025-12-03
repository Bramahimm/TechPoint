<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('barang', function (Blueprint $table) {
            // 1. Primary Key UUID
            $table->uuid('id')->primary();

            // 2. Relasi ke Toko (Pakai foreignUuid agar lebih rapi)
            $table->foreignUuid('toko_id')
                  ->constrained('toko') // Pastikan nama tabelnya 'toko'
                  ->onDelete('cascade');

            // 3. Relasi ke Kategori (INI YANG TADI SALAH)
            // Ubah dari foreignId (Angka) menjadi foreignUuid (String UUID)
            $table->foreignUuid('kategori_id')
                  ->nullable()
                  ->constrained('kategori') // Pastikan nama tabelnya 'kategori'
                  ->onDelete('set null');

            $table->string('nama');
            $table->text('deskripsi')->nullable(); // Sebaiknya nullable jaga-jaga kosong
            $table->decimal('harga', 10, 2);
            $table->integer('stok');
            $table->string('gambar')->nullable(); // Tambahkan ini untuk foto produk
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('barang');
    }
};