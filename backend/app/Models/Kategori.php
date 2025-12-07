<?php
// app/Models/Kategori.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategori extends Model {
    use HasFactory, HasUuids; 

    protected $table = 'kategori';

    protected $fillable = [
        'nama',
        'deskripsi',
    ];

    public function products() {
        return $this->hasMany(Product::class);
    }
}
