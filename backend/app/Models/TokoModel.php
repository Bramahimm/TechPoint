<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Toko extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nama_toko',
        'alamat',
        'no_telp',
    ];

    // Relasi: Toko ini milik satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Toko punya banyak Barang
    public function barang()
    {
        return $this->hasMany(Barang::class);
    }

    // Relasi: Toko punya banyak percakapan (sebagai penjual)
    public function conversation()
    {
        return $this->hasMany(Conversation::class);
    }
}