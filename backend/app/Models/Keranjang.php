<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // <--- WAJIB

class Keranjang extends Model
{
    use HasFactory, HasUuids; // <--- WAJIB

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $table = 'keranjang';

    protected $fillable = [
        'user_id',
        'barang_id',
        'jumlah',
        'varian',      // Tambahan
        'is_selected'  // Tambahan
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }
}