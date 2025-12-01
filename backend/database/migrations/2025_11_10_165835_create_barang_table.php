<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('barang', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('toko_id'); 
            $table->foreign('toko_id')
                ->references('id')
                ->on('toko')
                ->onDelete('cascade');

            $table->foreignId('kategori_id')
                ->nullable()
                ->constrained('kategori')
                ->onDelete('set null');

            $table->string('nama');
            $table->text('deskripsi');
            $table->decimal('harga', 10, 2);
            $table->integer('stok');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('barang');
    }
};
