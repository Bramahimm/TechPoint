<?php
// app/Http/Controllers/MidtransNotificationController.php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransNotificationController extends Controller {
    protected $midtransService;

    public function __construct(MidtransService $midtransService) {
        $this->midtransService = $midtransService;
    }

    /**
     * Endpoint: POST /api/payments/midtrans-notification
     * Menerima callback S2S dari Midtrans.
     */
    public function handleNotification(Request $request) {
        $notificationData = $request->all();

        try {
            // 1. Verifikasi dan dapatkan status respons dari Midtrans
            $statusResponse = $this->midtransService->handleNotification($notificationData);

            $orderId = $statusResponse->order_id;
            $transactionStatus = $statusResponse->transaction_status;
            $fraudStatus = $statusResponse->fraud_status;

            // 2. Cari Order di Database
            $order = Order::where('invoice_number', $orderId)->first();

            if (!$order) {
                return response('Order not found', 404);
            }

            // 3. Tentukan Status Pembayaran Baru
            $newStatus = $order->payment_status;

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'challenge') {
                    $newStatus = 'PROCESSING';
                } else if ($fraudStatus == 'accept') {
                    $newStatus = 'PAID';
                }
            } else if ($transactionStatus == 'settlement') {
                $newStatus = 'PAID';
            } else if ($transactionStatus == 'cancel' || $transactionStatus == 'expire') {
                $newStatus = 'EXPIRED';
            } else if ($transactionStatus == 'deny') {
                $newStatus = 'FAILED';
            } else if ($transactionStatus == 'pending') {
                $newStatus = 'PENDING';
            }

            // 4. Update Status Order (hanya jika status berubah)
            if ($order->payment_status != $newStatus) {
                $order->payment_status = $newStatus;
                $order->midtrans_transaction_id = $statusResponse->transaction_id;
                // ❗ Lakukan logika bisnis lain di sini (kurangi stok, kirim email)
                $order->save();
                Log::info("Order $orderId updated to status: $newStatus");
            }

            return response('OK', 200);
        } catch (\Exception $e) {
            Log::error("Midtrans Notification Error: " . $e->getMessage());
            return response('Error', 500);
        }
    }
}
