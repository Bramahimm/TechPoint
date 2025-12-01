<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->select('id', 'nama', 'email', 'role', 'email_verified_at', 'created_at')
            ->orderBy('created_at', 'desc');

        // Search
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(15);

        return response()->json([
            'message' => 'Data users berhasil diambil',
            'data' => $users
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Jangan izinkan admin hapus diri sendiri
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Tidak bisa menghapus akun sendiri!'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus']);
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:pembeli,penjual,admin'
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => 'Role berhasil diupdate',
            'data' => $user
        ]);
    }
}