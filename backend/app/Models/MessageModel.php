<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'pesan',
    ];

    // Relasi: Pesan ini milik satu Percakapan
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    // Relasi: Pesan ini dikirim oleh satu User
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}