<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // <--- WAJIB ADA

class Barang extends Model
{
    use HasFactory, HasUuids; // <--- WAJIB DIPASANG

    // Agar Laravel tahu ID-nya bukan angka
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $table = 'barangs'; // Cek di database, biasanya plural 'barangs' atau singular 'barang'?
    // Sesuai migrasi Anda: 'barang' (singular). Jadi kita paksa nama tabelnya:
    // (Jika di migrasi namanya Schema::create('barang', ...))

    protected $fillable = [
        'toko_id',
        'kategori_id',
        'nama',
        'deskripsi',
        'harga',
        'stok',
        'gambar', // Jangan lupa tambahkan ini agar upload gambar berhasil
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