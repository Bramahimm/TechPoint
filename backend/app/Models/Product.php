<?php
// app/Models/Product.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Product extends Model {
    use HasFactory, HasUuids;

    protected $table = 'barang';

    protected $fillable = [
        'toko_id',
        'kategori_id',
        'nama',
        'slug',
        'deskripsi',
        'harga',
        'stok',
        'gambar',
    ];

    protected $appends = ['gambar_url'];

    protected static function boot() {
        parent::boot();

        static::creating(function ($barang) {
            $slug = Str::slug($barang->nama);
            $originalSlug = $slug;
            $count = 1;

            while (static::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            $barang->slug = $slug;
        });
    }

    public function toko() {
        return $this->belongsTo(Toko::class);
    }

    public function kategori() {
        return $this->belongsTo(Kategori::class);
    }

    public function getGambarUrlAttribute(): ?string {
        if ($this->gambar) {
            $url = Storage::url($this->gambar);

            if (!Str::startsWith($url, 'http')) {
                return config('app.url') . $url;
            }
            return $url;
        }
        return null;
    }
}
