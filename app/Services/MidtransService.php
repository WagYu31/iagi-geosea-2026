<?php

namespace App\Services;

use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey    = config('midtrans.server_key');
        Config::$clientKey    = config('midtrans.client_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized  = config('midtrans.is_sanitized');
        Config::$is3ds        = config('midtrans.is_3ds');
    }

    /**
     * Create or reuse a Snap token for a payment.
     *
     * Implements the "Check-Reuse Snap Token" pattern:
     * If the payment already has a snap_token and is still pending,
     * return the existing token instead of creating a new one.
     */
    public function createSnapToken(Payment $payment): array
    {
        // Reuse existing token if still pending
        if ($payment->snap_token && $payment->status === 'pending') {
            Log::info("Reusing existing Snap token for payment #{$payment->id}");
            return [
                'snap_token' => $payment->snap_token,
                'order_id'   => $payment->order_id,
            ];
        }

        // Generate unique order ID: IAGI-{PaymentID}-{Timestamp}
        $orderId = 'IAGI-' . $payment->id . '-' . time();

        $params = [
            'transaction_details' => [
                'order_id'     => $orderId,
                'gross_amount' => (int) $payment->amount,
            ],
            'item_details' => [
                [
                    'id'       => 'REG-' . $payment->submission_id,
                    'price'    => (int) $payment->amount,
                    'quantity' => 1,
                    'name'     => 'Conference Registration - ' . ($payment->submission->title ?? 'Submission #' . $payment->submission_id),
                ],
            ],
            'customer_details' => [
                'first_name' => $payment->user->name ?? 'Participant',
                'email'      => $payment->user->email ?? '',
                'phone'      => $payment->user->whatsapp ?? '',
            ],
            'callbacks' => [
                'finish' => url('/payments'),
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);

            // Save token and order ID to database
            $payment->update([
                'snap_token' => $snapToken,
                'order_id'   => $orderId,
                'status'     => 'pending',
            ]);

            Log::info("Created Snap token for payment #{$payment->id}, order: {$orderId}");

            return [
                'snap_token' => $snapToken,
                'order_id'   => $orderId,
            ];
        } catch (\Exception $e) {
            Log::error("Failed to create Snap token for payment #{$payment->id}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle incoming Midtrans notification webhook.
     *
     * Implements:
     * 1. Signature verification (SHA512)
     * 2. Status mapping (settlement → paid, deny/cancel/expire → failed)
     * 3. Idempotent handling (skip if already paid)
     */
    public function handleNotification(array $payload): Payment
    {
        $orderId           = $payload['order_id'] ?? '';
        $statusCode        = $payload['status_code'] ?? '';
        $grossAmount       = $payload['gross_amount'] ?? '';
        $signatureKey      = $payload['signature_key'] ?? '';
        $transactionStatus = $payload['transaction_status'] ?? '';
        $fraudStatus       = $payload['fraud_status'] ?? 'accept';
        $paymentType       = $payload['payment_type'] ?? '';
        $transactionId     = $payload['transaction_id'] ?? '';

        // 1. Verify signature
        $serverKey = config('midtrans.server_key');
        $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        if ($expectedSignature !== $signatureKey) {
            Log::warning("Invalid Midtrans signature for order: {$orderId}");
            throw new \Exception('Invalid signature');
        }

        // 2. Find payment by order_id
        $payment = Payment::where('order_id', $orderId)->firstOrFail();

        // 3. Idempotent check — skip if already paid
        if ($payment->status === 'paid') {
            Log::info("Payment #{$payment->id} already paid, skipping webhook for order: {$orderId}");
            return $payment;
        }

        // 4. Map transaction status
        $updateData = [
            'payment_type'      => $paymentType,
            'transaction_id'    => $transactionId,
            'midtrans_response' => $payload,
        ];

        switch ($transactionStatus) {
            case 'capture':
                // For credit card, check fraud status
                if ($fraudStatus === 'accept') {
                    $updateData['status']   = 'paid';
                    $updateData['paid_at']  = now();
                    $updateData['verified'] = true;
                    $updateData['verified_at'] = now();
                } elseif ($fraudStatus === 'challenge') {
                    $updateData['status'] = 'pending';
                }
                break;

            case 'settlement':
                $updateData['status']   = 'paid';
                $updateData['paid_at']  = now();
                $updateData['verified'] = true;
                $updateData['verified_at'] = now();
                break;

            case 'pending':
                $updateData['status'] = 'pending';
                break;

            case 'deny':
            case 'cancel':
            case 'expire':
                $updateData['status']     = 'failed';
                $updateData['snap_token'] = null; // Allow fresh token on retry
                break;

            case 'refund':
            case 'partial_refund':
                $updateData['status'] = 'refunded';
                break;
        }

        $payment->update($updateData);

        Log::info("Webhook processed for payment #{$payment->id}: status={$transactionStatus}, mapped={$updateData['status']}");

        return $payment;
    }
}
