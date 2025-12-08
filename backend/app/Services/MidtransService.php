<?php

// app/Services/MidtransService.php

namespace App\Services;

use Midtrans\Snap;
use Midtrans\Config;
use Midtrans\Notification;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class MidtransService {
    public function __construct() {
        // Pastikan env MIDTRANS_IS_PRODUCTION menjadi boolean
        Config::$isProduction = config('app.env') === 'production'
            || filter_var(env('MIDTRANS_IS_PRODUCTION'), FILTER_VALIDATE_BOOLEAN);

        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$clientKey = env('MIDTRANS_CLIENT_KEY');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    /**
     * Membuat transaksi SNAP baru.
     * @param \App\Models\Order $order
     * @return object Midtrans Snap Response
     */
    public function createTransaction(Order $order) {
        $payload = $this->buildSnapPayload($order);

        // Memanggil Midtrans Snap API
        return Snap::createTransaction($payload);
    }

    /**
     * Membangun payload yang diperlukan oleh Midtrans Snap.
     */
    private function buildSnapPayload(Order $order) {
        $shipping = (array) $order->shipping_address;
        $financial = (array) $order->financial_summary;
        $items = (array) $order->items;

        // Mapping item details ke format Midtrans
        $itemDetails = array_map(function ($item) {
            $name = $item['name'] ?? 'Produk Default';
            $variant = $item['variant'] ?? null;
            $price = $item['price_at_order'] ?? 0;
            $quantity = $item['quantity'] ?? 1;

            // Gunakan Str::uuid() jika product_id tidak tersedia
            $id = $item['product_id'] ?? (string) Str::uuid();

            return [
                'id' => $id,
                'price' => (int) round($price),
                'quantity' => (int) $quantity,
                'name' => $variant ? $name . ' (' . $variant . ')' : $name,
            ];
        }, $items);

        // Tambahkan biaya pengiriman
        $courier = $shipping['courier_method'] ?? 'Unknown';
        $itemDetails[] = [
            'id' => 'SHIPPING',
            'price' => (int) round($financial['shipping_cost'] ?? 0),
            'quantity' => 1,
            'name' => "Biaya Kirim ({$courier})",
        ];

        return [
            'transaction_details' => [
                'order_id' => $order->invoice_number,
                'gross_amount' => (int) round($financial['grand_total'] ?? 0),
            ],
            'customer_details' => [
                'first_name' => $shipping['receiverName'] ?? 'Pembeli',
                'phone' => $shipping['phone'] ?? '0800000000',
                'email' => Auth::user()->email ?? 'dummy@techpoint.test',
                'billing_address' => [
                    'address' => $shipping['fullAddress'] ?? 'Alamat Default',
                    'city' => $shipping['kecamatan'] ?? 'Kota Default',
                    'phone' => $shipping['phone'] ?? '0800000000',
                    'country_code' => 'IDN',
                ],
            ],
            'item_details' => $itemDetails,
            'callbacks' => [
                'finish' => URL::to("/order/status/{$order->invoice_number}?status=success"),
                'error' => URL::to("/order/status/{$order->invoice_number}?status=error"),
                'pending' => URL::to("/order/status/{$order->invoice_number}?status=pending"),
            ],
        ];
    }

    /**
     * Memproses notifikasi S2S dari Midtrans.
     * @param array $notificationData
     * @return Notification
     */
    public function handleNotification(array $notificationData) {
        return new Notification($notificationData);
    }
}
