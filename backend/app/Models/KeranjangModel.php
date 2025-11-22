<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keranjang extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'barang_id',
        'jumlah',
    ];

    // Relasi: Item keranjang ini milik satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Item keranjang ini merujuk ke satu Barang
    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }
}