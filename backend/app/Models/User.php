<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <--- WAJIB DITAMBAHKAN

class User extends Authenticatable
{
    // Tambahkan HasApiTokens di sini agar bisa createToken()
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users'; // Memastikan tabel yang dipakai benar 'users'

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama',      // Pastikan ini 'nama' (sesuai database), bukan 'name'
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

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // --- RELASI (SAYA PERTAHANKAN KODINGAN ANDA) ---

    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    public function toko()
    {
        return $this->hasOne(Toko::class);
    }

    public function keranjang()
    {
        return $this->hasMany(Keranjang::class);
    }

    public function transaksi()
    {
        return $this->hasMany(Transaksi::class);
    }

    public function ulasan()
    {
        return $this->hasMany(Ulasan::class);
    }

    public function conversation()
    {
        return $this->hasMany(Conversation::class);
    }

    public function message()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }
}