<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('admins', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id'); // ← UUID, bukan unsignedBigInteger
            $table->string('nip')->unique()->nullable();
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }
};
