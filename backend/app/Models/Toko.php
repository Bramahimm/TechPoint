<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // <--- WAJIB ADA

class Toko extends Model
{
    use HasFactory, HasUuids; // <--- WAJIB DIPASANG

    // Agar Laravel tahu ID-nya bukan angka
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'toko'; // Pastikan nama tabel benar

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

    // Relasi: Toko punya banyak percakapan
    public function conversation()
    {
        return $this->hasMany(Conversation::class);
    }
}