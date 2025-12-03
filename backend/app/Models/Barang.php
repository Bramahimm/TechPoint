<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; 

class Barang extends Model
{
    use HasFactory, HasUuids; 

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $table = 'barang'; 

    protected $fillable = [
        'toko_id',
        'kategori_id',
        'nama',
        'deskripsi',
        'harga',
        'stok',
        'gambar', 
    ];

    // Relasi: Barang ini milik satu Toko
    public function toko()
    {
        return $this->belongsTo(Toko::class);
    }

    // Relasi: Barang ini masuk dalam satu Kategori
    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }

    // Relasi: Barang ini ada di banyak Keranjang
    public function keranjang()
    {
        return $this->hasMany(Keranjang::class);
    }

    // Relasi: Barang ini punya banyak Ulasan
    public function ulasan()
    {
        return $this->hasMany(Ulasan::class);
    }
}