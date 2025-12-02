<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Toko extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'toko';

    protected $fillable = [
        'user_id',
        'nama_toko',
        'alamat',
        'no_telp',
        'deskripsi', // Tambahan sesuai migrasi
        'logo',      // Tambahan sesuai migrasi
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function barang()
    {
        return $this->hasMany(Barang::class);
    }

    public function conversation()
    {
        return $this->hasMany(Conversation::class);
    }
}