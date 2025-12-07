<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('barang', function (Blueprint $table) {
<<<<<<< HEAD
            $table->id();
            $table->foreignId('toko_id')->constrained('toko')->onDelete('cascade');
            $table->foreignId('kategori_id')->constrained('kategori')->onDelete('set null')->nullable();
=======
            $table->uuid('id')->primary();
            $table->foreignUuid('toko_id')->constrained('toko')->onDelete('cascade');
            $table->foreignUuid('kategori_id')->nullable()->constrained('kategori')->onDelete('set null');
>>>>>>> 1c1f00469ff9d80460dcda467a83a5167f203fc4
            $table->string('nama');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->decimal('harga', 10, 2);
            $table->integer('stok');
            $table->string('gambar')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('barang');
    }
};
