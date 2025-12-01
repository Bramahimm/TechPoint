<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Toko;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    // GET /api/chat (List semua percakapan user)
    public function index()
    {
        $user = Auth::user();

        // Cari percakapan dimana user terlibat (sebagai pembeli ATAU pemilik toko)
        // anggap user sebagai pembeli dulu
        $conversations = Conversation::with(['toko', 'message' => function($query) {
                $query->latest()->first(); 
            }])
            ->where('user_id', $user->id)
            ->get();

        return response()->json($conversations, 200);
    }

    // POST /api/chat/start (Mulai chat dengan toko)
    public function start(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'toko_id' => 'required|exists:toko,id',
            'pesan' => 'required|string'
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $user = Auth::user();

        // Cek apakah percakapan sudah ada?
        $conversation = Conversation::firstOrCreate([
            'user_id' => $user->id,
            'toko_id' => $request->toko_id
        ]);

        // Kirim pesan pertama
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'pesan' => $request->pesan
        ]);

        return response()->json(['message' => 'Pesan terkirim', 'data' => $message], 201);
    }

    // GET /api/chat/{id} (Lihat isi chat spesifik)
    public function show($id)
    {
        $messages = Message::with('sender:id,nama') // Ambil nama pengirim
            ->where('conversation_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages, 200);
    }

    // POST /api/chat/{id}/reply (Balas pesan)
    public function reply(Request $request, $id)
    {
        $validator = Validator::make($request->all(), ['pesan' => 'required|string']);
        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $message = Message::create([
            'conversation_id' => $id,
            'sender_id' => Auth::id(),
            'pesan' => $request->pesan
        ]);

        return response()->json(['message' => 'Balasan terkirim', 'data' => $message], 201);
    }
}