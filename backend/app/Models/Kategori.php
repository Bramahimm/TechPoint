<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // <--- WAJIB

class Kategori extends Model
{
    use HasFactory, HasUuids; // <--- WAJIB

    // Karena ID-nya UUID, bukan angka
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'kategori'; 

    protected $fillable = [
        'nama',
        'deskripsi',
    ];

    // Relasi: Satu Kategori punya banyak Barang
    public function barang()
    {
        return $this->hasMany(Barang::class);
    }
}