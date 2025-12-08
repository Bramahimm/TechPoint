<?php
// app/Http/Controllers/OrderController.php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OrderController extends Controller {
    protected $midtransService;

    public function __construct(MidtransService $midtransService) {
        $this->midtransService = $midtransService;
    }

    /**
     * Endpoint: POST /api/orders (Membuat Order dan Snap Transaction)
     */
    public function store(Request $request) {
        $user = Auth::user();

        // Validasi Payload (Sesuai dengan frontend CheckoutPage.tsx)
        $request->validate([
            'items' => 'required|array',
            'financial_summary.grand_total' => 'required|numeric|min:1000',
            // ... (Tambahkan validasi mendetail lainnya)
        ]);

        // 1. Generate Invoice Number (Menggunakan format yang unik)
        $invoiceNumber = 'INV-' . date('YMD') . '-' . Str::random(6);

        // 2. Buat Order di Database (Status PENDING)
        $order = Order::create([
            'user_id' => $user->id,
            'invoice_number' => $invoiceNumber,
            'items' => $request->items,
            'shipping_address' => $request->shipping_address,
            'payment_details' => $request->payment_details,
            'financial_summary' => $request->financial_summary,
            'payment_status' => 'PENDING',
        ]);

        // 3. Buat Transaksi Midtrans SNAP
        try {
            $snapResponse = $this->midtransService->createTransaction($order);

            // 4. Simpan Snap Token
            $order->snap_token = $snapResponse->token;
            // Midtrans Transaction ID belum tentu tersedia di SNAP creation
            $order->save();

            // 5. Kirim Respons ke Frontend
            return response()->json([
                'message' => 'Order berhasil dibuat, siap untuk pembayaran Midtrans.',
                'invoice_number' => $invoiceNumber,
                'snap_token' => $snapResponse->token,
            ], 201);
        } catch (\Exception $e) {
            // Jika Midtrans gagal, hapus order yang baru dibuat
            $order->delete();
            return response()->json([
                'message' => 'Gagal membuat transaksi Midtrans. Coba lagi.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
