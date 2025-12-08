<?php

// database/migrations/2025_XX_XX_create_orders_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');

            $table->string('invoice_number')->unique();

            // Status Pembayaran
            $table->enum('payment_status', ['PENDING', 'PAID', 'FAILED', 'EXPIRED', 'PROCESSING'])->default('PENDING');

            // Midtrans Data
            $table->string('snap_token')->nullable();
            $table->string('midtrans_transaction_id')->nullable();

            // Payload Data (Disimpan sebagai JSON/TEXT)
            $table->json('items'); // Detail produk yang dipesan
            $table->json('shipping_address');
            $table->json('payment_details');
            $table->json('financial_summary'); // total, subtotal, shipping_cost

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('orders');
    }
};
