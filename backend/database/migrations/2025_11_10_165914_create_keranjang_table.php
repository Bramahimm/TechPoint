<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('keranjang', function (Blueprint $table) {
<<<<<<< HEAD
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('barang_id')->constrained('barang')->onDelete('cascade');
=======
            $table->uuid('id')->primary(); // Primary Key UUID

            // Foreign Key UUID yang rapi
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('barang_id')->constrained('barang')->onDelete('cascade');

>>>>>>> 1c1f00469ff9d80460dcda467a83a5167f203fc4
            $table->integer('jumlah');
            
            // Tambahan kolom yang diminta Controller
            $table->string('varian')->nullable(); 
            $table->boolean('is_selected')->default(true); 

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('keranjang');
    }
};