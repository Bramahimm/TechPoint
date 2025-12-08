<?php

// app/Models/Order.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Order extends Model {
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'invoice_number',
        'payment_status',
        'snap_token',
        'midtrans_transaction_id',
        'items',
        'shipping_address',
        'payment_details',
        'financial_summary',
    ];

    // Casting JSON fields
    protected $casts = [
        'items' => 'array',
        'shipping_address' => 'array',
        'payment_details' => 'array',
        'financial_summary' => 'array',
    ];
}
