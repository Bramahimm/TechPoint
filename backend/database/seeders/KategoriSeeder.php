<?php
// database/seeders/KategoriSeeder.php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str; // Diperlukan untuk UUID jika Model tidak otomatis

class KategoriSeeder extends Seeder
{
    public function run(): void
    {
        $kategoriData = [
            ['nama' => 'Laptop', 'deskripsi' => 'Laptop kerja dan gaming'],
            ['nama' => 'Smartphone', 'deskripsi' => 'HP Android dan iOS'],
            ['nama' => 'Kamera', 'deskripsi' => 'Kamera digital dan aksesoris'],
            ['nama' => 'Aksesoris', 'deskripsi' => 'Mouse, Keyboard, Headset'],
        ];

        foreach ($kategoriData as $k) {
            Kategori::create($k); 
        }
    }
}