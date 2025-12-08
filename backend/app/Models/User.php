<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Concerns\HasUuids;  


class User extends Authenticatable implements MustVerifyEmail {
    use HasApiTokens, HasFactory, Notifiable, HasUuids; 

    
    public $incrementing = false;     
    protected $keyType = 'string';    

    protected $table = 'users';

    protected $fillable = [
        'nama',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $appends = ['name'];

    public function getNameAttribute() {
        return $this->nama;
    }

    // Relasi tetap sama
    public function admin() {
        return $this->hasOne(Admin::class);
    }
    public function toko() {
        return $this->hasOne(Toko::class);
    }
    public function keranjang() {
        return $this->hasMany(Keranjang::class);
    }
    public function transaksi() {
        return $this->hasMany(Transaksi::class);
    }
    public function ulasan() {
        return $this->hasMany(Ulasan::class);
    }
    public function conversation() {
        return $this->hasMany(Conversation::class);
    }
    public function message() {
        return $this->hasMany(Message::class, 'sender_id');
    }
}
