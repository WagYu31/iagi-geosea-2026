<?php

namespace App\Services;

use App\Models\Payment;
use App\Mail\PaymentConfirmation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class XenditService
{
    private string $secretKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->secretKey = config('xendit.secret_key');
        $isProduction = config('xendit.is_production', false);
        $this->baseUrl = 'https://api.xendit.co';
    }

    /**
     * Create a Xendit Invoice for payment.
     *
     * Returns an array with 'invoice_url' and 'order_id'.
     * The user is redirected to invoice_url to complete payment.
     */
    public function createInvoice(Payment $payment): array
    {
        $orderId = 'IAGI-' . $payment->id . '-' . time();

        // Truncate description to reasonable length
        $description = 'Conference Registration - ' . ($payment->submission->title ?? 'Submission #' . $payment->submission_id);
        if (strlen($description) > 200) {
            $description = substr($description, 0, 197) . '...';
        }

        $payload = [
            'external_id'      => $orderId,
            'amount'           => (int) $payment->amount,
            'description'      => $description,
            'currency'         => 'IDR',
            'invoice_duration'  => config('xendit.invoice_duration', 86400),
            'customer' => [
                'given_names' => $payment->user->name ?? 'Participant',
                'email'       => $payment->user->email ?? '',
                'mobile_number' => $payment->user->whatsapp ?? '',
            ],
            'success_redirect_url' => url('/payments?xendit_status=success&order_id=' . $orderId),
            'failure_redirect_url' => url('/payments?xendit_status=failed&order_id=' . $orderId),
            'items' => [
                [
                    'name'     => 'Conference Registration Fee',
                    'quantity' => 1,
                    'price'    => (int) $payment->amount,
                    'category' => $payment->submission->participant_category ?? 'registration',
                ],
            ],
        ];

        try {
            $response = Http::withBasicAuth($this->secretKey, '')
                ->accept('application/json')
                ->post("{$this->baseUrl}/v2/invoices", $payload);

            if (!$response->ok()) {
                Log::error("Xendit invoice creation failed: HTTP {$response->status()}", [
                    'payment_id' => $payment->id,
                    'body' => $response->body(),
                ]);
                throw new \Exception('Failed to create Xendit invoice: ' . ($response->json('message') ?? $response->body()));
            }

            $data = $response->json();

            // Save to payment record
            $payment->update([
                'snap_token' => $data['id'] ?? null,    // reuse snap_token field for xendit invoice ID
                'order_id'   => $orderId,
                'status'     => 'pending',
                'gateway'    => 'xendit',
            ]);

            Log::info("Created Xendit invoice for payment #{$payment->id}, order: {$orderId}", [
                'invoice_id'  => $data['id'] ?? 'unknown',
                'invoice_url' => $data['invoice_url'] ?? 'unknown',
            ]);

            return [
                'invoice_url' => $data['invoice_url'],
                'order_id'    => $orderId,
                'invoice_id'  => $data['id'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error("Xendit invoice creation error for payment #{$payment->id}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle Xendit webhook notification.
     *
     * Xendit sends POST with invoice data when status changes.
     * Key fields: external_id, status, paid_amount, payment_method, payment_channel
     */
    public function handleWebhook(array $payload): Payment
    {
        $externalId = $payload['external_id'] ?? '';
        $status     = $payload['status'] ?? '';
        $paidAmount = $payload['paid_amount'] ?? 0;
        $paymentMethod  = $payload['payment_method'] ?? '';
        $paymentChannel = $payload['payment_channel'] ?? '';

        // Find payment by order_id (external_id)
        $payment = Payment::where('order_id', $externalId)->firstOrFail();

        // Idempotent: skip if already paid
        if ($payment->status === 'paid') {
            Log::info("Payment #{$payment->id} already paid, skipping Xendit webhook for: {$externalId}");
            return $payment;
        }

        // Map Xendit status
        $updateData = [
            'payment_type'      => $paymentMethod . ($paymentChannel ? " ({$paymentChannel})" : ''),
            'transaction_id'    => $payload['id'] ?? null,
            'midtrans_response' => $payload, // reuse the JSON field for gateway response
        ];

        switch (strtoupper($status)) {
            case 'PAID':
            case 'SETTLED':
                $updateData['status']      = 'paid';
                $updateData['paid_at']     = now();
                $updateData['verified']    = true;
                $updateData['verified_at'] = now();
                break;

            case 'EXPIRED':
                $updateData['status']     = 'failed';
                $updateData['snap_token'] = null; // allow fresh invoice on retry
                break;

            case 'PENDING':
                $updateData['status'] = 'pending';
                break;

            default:
                Log::warning("Unknown Xendit status '{$status}' for payment #{$payment->id}");
                $updateData['status'] = 'pending';
                break;
        }

        $payment->update($updateData);

        Log::info("Xendit webhook processed for payment #{$payment->id}: status={$status}, mapped={$updateData['status']}");

        // Send confirmation email when paid
        if (isset($updateData['status']) && $updateData['status'] === 'paid') {
            try {
                $payment->load(['user', 'submission']);
                if ($payment->user && $payment->user->email) {
                    Mail::to($payment->user->email)->queue(new PaymentConfirmation($payment));
                    Log::info("Payment confirmation email queued for payment #{$payment->id}");
                }
            } catch (\Exception $e) {
                Log::error("Failed to queue email for payment #{$payment->id}: " . $e->getMessage());
            }
        }

        return $payment;
    }

    /**
     * Check invoice status from Xendit API.
     */
    public function checkInvoiceStatus(string $invoiceId): ?array
    {
        try {
            $response = Http::withBasicAuth($this->secretKey, '')
                ->accept('application/json')
                ->get("{$this->baseUrl}/v2/invoices/{$invoiceId}");

            if ($response->ok()) {
                return $response->json();
            }

            Log::warning("Xendit status check failed for invoice {$invoiceId}: HTTP {$response->status()}");
            return null;
        } catch (\Exception $e) {
            Log::error("Xendit status check error for invoice {$invoiceId}: " . $e->getMessage());
            return null;
        }
    }
}
