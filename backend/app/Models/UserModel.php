<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relasi: User punya satu profil Admin
    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    // Relasi: User punya satu Toko (jika dia penjual)
    public function toko()
    {
        return $this->hasOne(Toko::class);
    }

    // Relasi: User punya banyak barang di keranjang
    public function keranjang()
    {
        return $this->hasMany(Keranjang::class);
    }

    // Relasi: User punya banyak transaksi
    public function transaksi()
    {
        return $this->hasMany(Transaksi::class);
    }

    // Relasi: User punya banyak ulasan
    public function ulasan()
    {
        return $this->hasMany(Ulasan::class);
    }

    // Relasi: User punya banyak percakapan (sebagai pembeli)
    public function conversation()
    {
        return $this->hasMany(Conversation::class);
    }

    // Relasi: User (bisa pembeli/penjual) mengirim banyak pesan
    public function message()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }
}