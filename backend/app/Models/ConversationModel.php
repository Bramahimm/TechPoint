<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'toko_id',
    ];

    // Relasi: Percakapan ini milik satu User (pembeli)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Percakapan ini milik satu Toko (penjual)
    public function toko()
    {
        return $this->belongsTo(Toko::class);
    }

    // Relasi: Percakapan ini punya banyak Pesan
    public function message()
    {
        return $this->hasMany(Message::class);
    }
}