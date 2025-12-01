<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ulasan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'barang_id',
        'rating',
        'komentar',
    ];

    // Relasi: Ulasan ini milik satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Ulasan ini untuk satu Barang
    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }
}