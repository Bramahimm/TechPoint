<?php
// app/Http/Controllers/OrderController.php (Revisi untuk Fix 'Log')

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log; // 💡 FIX: Import Facade Log

class OrderController extends Controller {
    protected $midtransService;

    public function __construct(MidtransService $midtransService) {
        $this->midtransService = $midtransService;
    }

    /**
     * Endpoint: POST /api/orders
     */
    public function store(Request $request) {
        $user = Auth::user();

        // 1. Validasi Payload
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|uuid',
            'items.*.quantity' => 'required|integer|min:1',
            'financial_summary.grand_total' => 'required|numeric|min:1000',
        ]);

        // 2. Generate Invoice Number
        $invoiceNumber = 'INV-' . date('YMD') . '-' . Str::random(6);

        // 3. Buat Order di Database (Status PENDING)
        try {
            $order = Order::create([
                'user_id' => $user->id,
                'invoice_number' => $invoiceNumber,

                'items' => $request->items,
                'shipping_address' => $request->shipping_address,
                'payment_details' => $request->payment_details,
                'financial_summary' => $request->financial_summary,

                'payment_status' => 'PENDING',
            ]);
        } catch (\Exception $e) {
            // Log::error akan berfungsi setelah diimpor
            Log::error("DB Error on Order Creation: " . $e->getMessage());
            return response()->json([
                'message' => 'Gagal menyimpan order ke database. Cek log error DB.',
            ], 500);
        }

        // 4. Buat Transaksi Midtrans SNAP
        try {
            $snapResponse = $this->midtransService->createTransaction($order);

            // 5. Simpan Snap Token
            $order->snap_token = $snapResponse->token;
            $order->save();

            // 6. Kirim Respons ke Frontend
            return response()->json([
                'message' => 'Order berhasil dibuat, siap untuk pembayaran Midtrans.',
                'invoice_number' => $invoiceNumber,
                'snap_token' => $snapResponse->token,
            ], 201);
        } catch (\Exception $e) {
            // Jika Midtrans gagal, hapus order yang baru dibuat
            $order->delete();
            Log::error("Midtrans Transaction Error: " . $e->getMessage());

            return response()->json([
                'message' => 'Gagal membuat transaksi Midtrans. Silakan coba lagi.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
