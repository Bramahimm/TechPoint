<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Keranjang extends Model
{
    use HasFactory, HasUuids; 

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $table = 'keranjang';

    protected $fillable = [
        'user_id',
        'barang_id',
        'jumlah',
        'varian',      
        'is_selected'  
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