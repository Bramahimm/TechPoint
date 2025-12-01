<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    use HasFactory;

    // Nama tabel 'kategoris' sudah jamak, jadi tidak perlu protected $table
    
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