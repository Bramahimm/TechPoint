<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class KeranjangController extends Controller {
    /**
     * Format data item keranjang agar konsisten untuk frontend.
     */
    private function formatKeranjangItemResponse(Keranjang $item) {
        $product = $item->barang;
        if (!$product) return null;

        return [
            'id' => $item->id,
            'product_id' => $item->barang_id,
            'nama' => $product->nama,
            'harga' => (float) $product->harga,
            'original_price' => (float) $product->original_price,
            'quantity' => $item->jumlah,
            'stock' => $product->stok,
            'gambar_url' => $product->gambar_url,
            'variant' => $item->varian,
            'is_selected' => (bool) $item->is_selected,
        ];
    }

    /**
     * Mengambil seluruh item keranjang user.
     */
    public function index() {
        $userId = Auth::id();

        $items = Keranjang::with('barang.toko')
            ->where('user_id', $userId)
            ->get();

        $data = $items->map(function ($item) {
            return $this->formatKeranjangItemResponse($item);
        })->filter()->values();

        return response()->json(['data' => $data], 200);
    }

    /**
     * Menambah item ke dalam keranjang.
     */
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|uuid|exists:barang,id',
            'quantity' => 'required|integer|min:1',
            'varian' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(
                ['errors' => $validator->errors()],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $userId = Auth::id();
        $barangId = $request->product_id;

        // Cek apakah item dengan varian sama sudah ada
        $existingItem = Keranjang::where('user_id', $userId)
            ->where('barang_id', $barangId)
            ->where('varian', $request->varian)
            ->first();

        if ($existingItem) {
            $existingItem->jumlah += $request->quantity;
            $existingItem->save();
            $item = $existingItem;
        } else {
            $item = Keranjang::create([
                'user_id' => $userId,
                'barang_id' => $barangId,
                'jumlah' => $request->quantity,
                'varian' => $request->varian,
                'is_selected' => true,
            ]);
        }

        $item->load('barang.toko');

        return response()->json([
            'message' => 'Barang berhasil ditambahkan ke keranjang',
            'data' => $this->formatKeranjangItemResponse($item),
        ], Response::HTTP_CREATED);
    }

    /**
     * Mengubah jumlah atau status item keranjang.
     */
    public function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'jumlah' => 'nullable|integer|min:1',
            'is_selected' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(
                ['errors' => $validator->errors()],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $keranjang = Keranjang::with('barang')
            ->where('user_id', Auth::id())
            ->where('id', $id)
            ->first();

        if (!$keranjang) {
            return response()->json(
                ['message' => 'Item tidak ditemukan'],
                Response::HTTP_NOT_FOUND
            );
        }

        $keranjang->update($request->only(['jumlah', 'is_selected']));

        return response()->json([
            'message' => 'Keranjang berhasil diperbarui',
            'data' => $this->formatKeranjangItemResponse($keranjang),
        ], Response::HTTP_OK);
    }

    /**
     * Menghapus item dari keranjang.
     */
    public function destroy($id) {
        $keranjang = Keranjang::where('user_id', Auth::id())
            ->where('id', $id)
            ->first();

        if (!$keranjang) {
            return response()->json(
                ['message' => 'Item tidak ditemukan'],
                Response::HTTP_NOT_FOUND
            );
        }

        $keranjang->delete();

        return response()->noContent();
    }
}
