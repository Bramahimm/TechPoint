<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; 

class Ulasan extends Model
{
    use HasFactory, HasUuids; 

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'ulasan';

    protected $fillable = [
        'user_id',
        'barang_id',
        'rating',
        'komentar',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->belongsTo(Product::class);
    }
}