<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // WAJIB

class Transaksi extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'transaksi';

    protected $fillable = [
        'user_id',
        'toko_id',
        'invoice_number',
        'total_harga',
        'status',
        'alamat_pengiriman'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function toko()
    {
        return $this->belongsTo(Toko::class);
    }

    public function details() // Ganti nama relasi biar lebih umum
    {
        return $this->hasMany(DetailTransaksi::class, 'transaksi_id');
    }
}