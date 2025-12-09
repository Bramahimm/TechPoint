<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller {
    protected $midtransService;

    public function __construct(MidtransService $midtransService) {
        $this->midtransService = $midtransService;
    }

    /**
     * Endpoint: POST /api/orders
     * Membuat Order, menyimpan ke DB, dan membuat Midtrans Snap Transaction.
     */
    public function store(Request $request) {
        $user = Auth::user();

        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|uuid',
            'items.*.quantity' => 'required|integer|min:1',
            'financial_summary.grand_total' => 'required|numeric|min:1000',
        ]);

        $invoiceNumber = 'INV-' . date('YMD') . '-' . Str::random(6);

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
            Log::error("DB Error on Order Creation: " . $e->getMessage());
            return response()->json([
                'message' => 'Gagal menyimpan order ke database. Cek log error DB.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $snapResponse = $this->midtransService->createTransaction($order);

            $order->snap_token = $snapResponse->token;
            $order->save();

            return response()->json([
                'message' => 'Order berhasil dibuat, siap untuk pembayaran Midtrans.',
                'invoice_number' => $invoiceNumber,
                'snap_token' => $snapResponse->token,
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            $order->delete();
            Log::error("Midtrans Transaction Error: " . $e->getMessage());

            return response()->json([
                'message' => 'Gagal membuat transaksi Midtrans. Silakan coba lagi.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Endpoint: GET /api/orders (BARU - Riwayat Pesanan User)
     * Menampilkan daftar semua pesanan yang dimiliki user yang sedang login.
     */
    public function index(Request $request) {
        $user = Auth::user();

        $orders = Order::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $data = $orders->map(function ($order) {
            // Mapping data untuk tampilan daftar di frontend
            $financial = $order->financial_summary;

            return [
                'id' => $order->id,
                'invoice_number' => $order->invoice_number,
                'payment_status' => $order->payment_status,
                'total' => $financial['grand_total'] ?? 0,
                'created_at' => $order->created_at->format('d M Y H:i'),
                // Ambil 3 nama produk pertama untuk preview
                'product_preview' => implode(', ', array_slice(array_column($order->items, 'name'), 0, 3)),
                'total_items' => array_sum(array_column($order->items, 'quantity')),
            ];
        });

        return response()->json(['data' => $data], Response::HTTP_OK);
    }

    /**
     * Endpoint: GET /api/orders/{invoiceNumber}
     * Menampilkan detail order untuk halaman status. (Tidak berubah)
     */
    public function show(string $invoiceNumber) {
        $user = Auth::user();

        $order = Order::where('invoice_number', $invoiceNumber)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan atau bukan milik Anda.'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'invoice_number' => $order->invoice_number,
            'payment_status' => $order->payment_status,
            'financial_summary' => $order->financial_summary,

            'items' => array_map(function ($item) {
                return [
                    'name' => $item['name'] ?? 'Produk',
                    'quantity' => $item['quantity'],
                ];
            }, $order->items),
        ];

        return response()->json(['data' => $data], Response::HTTP_OK);
    }
}
