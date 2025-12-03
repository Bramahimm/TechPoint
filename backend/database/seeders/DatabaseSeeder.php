<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $kategori = [
            ['nama' => 'Laptop', 'deskripsi' => 'Laptop kerja dan gaming'],
            ['nama' => 'Smartphone', 'deskripsi' => 'HP Android dan iOS'],
            ['nama' => 'Kamera', 'deskripsi' => 'Kamera digital dan aksesoris'],
            ['nama' => 'Aksesoris', 'deskripsi' => 'Mouse, Keyboard, Headset'],
        ];

        foreach ($kategori as $k) {
            Kategori::create($k);
        }
    }
}