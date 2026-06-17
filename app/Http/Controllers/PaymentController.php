<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Submission;
use App\Services\MidtransService;
use App\Services\XenditService;
use App\Mail\PaymentConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    /**
     * Get the active payment gateway from admin settings.
     */
    private function getActiveGateway(): string
    {
        $setting = \App\Models\LandingPageSetting::where('key', 'payment_gateway')->first();
        return $setting ? $setting->value : env('PAYMENT_GATEWAY', 'manual');
    }
    /**
     * Create a Snap token for Midtrans payment.
     *
     * Flow:
     * 1. Validate submission ownership and status
     * 2. Find or create Payment record
     * 3. Generate Snap token (or reuse existing pending one)
     * 4. Return snap_token to frontend
     */
    public function createSnapToken(Request $request, MidtransService $midtransService)
    {
        $request->validate([
            'submission_id' => 'required|exists:submissions,id',
        ]);

        // Verify user owns this submission
        $submission = Submission::where('id', $request->submission_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Only allow payment for accepted submissions
        if (strtolower($submission->status) !== 'accepted') {
            return response()->json([
                'error' => 'Payment is only available for accepted submissions.',
            ], 422);
        }

        // Determine amount from submission's participant category
        $pricingSetting = \App\Models\LandingPageSetting::where('key', 'registration_pricing')->first();
        $pricing = $pricingSetting 
            ? json_decode($pricingSetting->value, true) 
            : config('midtrans.pricing', []);
        $amount = $pricing[$submission->participant_category] ?? null;

        if (!$amount) {
            return response()->json([
                'error' => 'Unable to determine registration fee. Participant category "' . ($submission->participant_category ?? 'None') . '" is not recognized.',
            ], 422);
        }

        // Find existing payment or create new one
        $payment = Payment::where('submission_id', $request->submission_id)
            ->where('user_id', Auth::id())
            ->first();

        if ($payment) {
            if ($payment->isPaid()) {
                return response()->json([
                    'error' => 'This submission has already been paid.',
                ], 422);
            }
            $payment->update([
                'amount'     => $amount,
                'snap_token' => null,
            ]);
        } else {
            $payment = Payment::create([
                'user_id'       => Auth::id(),
                'submission_id' => $request->submission_id,
                'amount'        => $amount,
                'status'        => 'pending',
                'verified'      => false,
            ]);
        }

        // Check active gateway
        $gateway = $this->getActiveGateway();

        if ($gateway === 'xendit') {
            return $this->handleXenditPayment($payment, $request);
        }

        // Default: Midtrans
        return $this->handleMidtransPayment($payment, $request, $midtransService);
    }

    /**
     * Handle Midtrans payment flow (Snap token).
     */
    private function handleMidtransPayment(Payment $payment, Request $request, MidtransService $midtransService)
    {
        try {
            $enabledPayments = [];
            $paymentMethodMap = [
                'bank_transfer' => ['bca_va', 'bni_va', 'bri_va', 'echannel', 'permata_va', 'other_va'],
                'ewallet_qris'  => ['gopay', 'shopeepay', 'qris'],
                'credit_card'   => ['credit_card'],
                'cstore'        => ['indomaret', 'alfamart'],
            ];

            $paymentMethod = $request->input('payment_method');
            if ($paymentMethod && isset($paymentMethodMap[$paymentMethod])) {
                $enabledPayments = $paymentMethodMap[$paymentMethod];
            }

            $payment->update(['gateway' => 'midtrans']);
            $result = $midtransService->createSnapToken($payment, $enabledPayments);

            return response()->json([
                'gateway'    => 'midtrans',
                'snap_token' => $result['snap_token'],
                'order_id'   => $result['order_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Midtrans Snap token creation failed: ' . $e->getMessage(), [
                'payment_id' => $payment->id ?? null,
                'amount' => $payment->amount ?? null,
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error' => 'Failed to create payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle Xendit payment flow (Invoice redirect).
     */
    private function handleXenditPayment(Payment $payment, Request $request)
    {
        try {
            $xenditService = app(XenditService::class);
            $payment->update(['gateway' => 'xendit']);
            $result = $xenditService->createInvoice($payment);

            return response()->json([
                'gateway'     => 'xendit',
                'invoice_url' => $result['invoice_url'],
                'order_id'    => $result['order_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Xendit invoice creation failed: ' . $e->getMessage(), [
                'payment_id' => $payment->id ?? null,
                'amount' => $payment->amount ?? null,
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error' => 'Failed to create Xendit invoice: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle Midtrans webhook notification.
     *
     * This endpoint is called by Midtrans servers (not by users).
     * It must be publicly accessible (no auth) and excluded from CSRF.
     */
    public function handleNotification(Request $request, MidtransService $midtransService)
    {
        $payload = $request->all();

        Log::info('Midtrans notification received', ['order_id' => $payload['order_id'] ?? 'unknown']);

        try {
            $payment = $midtransService->handleNotification($payload);

            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('Midtrans notification error: ' . $e->getMessage());

            // Still return 200 to prevent Midtrans from retrying on known errors
            if ($e->getMessage() === 'Invalid signature') {
                return response()->json(['status' => 'invalid signature'], 401);
            }

            return response()->json(['status' => 'error'], 500);
        }
    }

    /**
     * Handle Xendit webhook notification.
     *
     * Called by Xendit servers when invoice status changes.
     * Must be publicly accessible (no auth) and excluded from CSRF.
     */
    public function handleXenditWebhook(Request $request)
    {
        $payload = $request->all();

        Log::info('Xendit notification received', [
            'external_id' => $payload['external_id'] ?? 'unknown',
            'status' => $payload['status'] ?? 'unknown',
        ]);

        // Verify webhook token if configured
        $webhookToken = config('xendit.webhook_token');
        if ($webhookToken && $request->header('X-CALLBACK-TOKEN') !== $webhookToken) {
            Log::warning('Invalid Xendit webhook token');
            return response()->json(['status' => 'invalid token'], 401);
        }

        try {
            $xenditService = app(XenditService::class);
            $payment = $xenditService->handleWebhook($payload);

            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('Xendit webhook error: ' . $e->getMessage());
            return response()->json(['status' => 'error'], 500);
        }
    }

    /**
     * Legacy: Store payment proof (manual upload).
     * Kept for backward compatibility.
     */
    public function store(Request $request)
    {
        // First retrieve the submission to determine if support document is required
        $request->validate([
            'submission_id' => 'required|exists:submissions,id',
        ]);

        // Check if user owns the submission
        $submission = Submission::where('id', $request->submission_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $category = strtolower($submission->participant_category ?? '');
        $needsSupportDoc = in_array($category, ['professional', 'student']);

        $rules = [
            'submission_id' => 'required|exists:submissions,id',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'amount' => 'required|numeric|min:0',
        ];

        $existingPayment = Payment::where('submission_id', $request->submission_id)->first();

        if ($needsSupportDoc) {
            if (!$existingPayment || !$existingPayment->support_document_url) {
                $rules['support_document'] = 'required|file|mimes:jpg,jpeg,png,pdf|max:5120';
            } else {
                $rules['support_document'] = 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120';
            }
        }

        $request->validate($rules);

        // Calculate amount deterministically with unique code starting with 5 (range 5001-5999)
        $pricingSetting = \App\Models\LandingPageSetting::where('key', 'registration_pricing')->first();
        $pricing = $pricingSetting 
            ? json_decode($pricingSetting->value, true) 
            : config('midtrans.pricing', []);
        $baseAmount = $pricing[$submission->participant_category] ?? null;

        if ($baseAmount) {
            $prefixSetting = \App\Models\LandingPageSetting::where('key', 'payment_unique_code_prefix')->first();
            $prefix = $prefixSetting ? (int)$prefixSetting->value : 5000;
            if ($prefix <= 0) {
                $prefix = 5000;
            }
            $uniqueCode = $prefix + ($submission->id % 999) + 1;
            $finalAmount = $baseAmount + $uniqueCode;
        } else {
            $finalAmount = $request->amount;
        }

        if ($existingPayment) {
            $updateData = [
                'amount' => $finalAmount,
                'gateway' => 'manual',
                'status' => 'pending',
                'verified' => false, // Reset verification status
                'verified_at' => null,
            ];

            // Update existing payment proof
            if ($request->hasFile('payment_proof')) {
                // Delete old file if exists
                if ($existingPayment->payment_proof_url) {
                    Storage::disk('public')->delete($existingPayment->payment_proof_url);
                }
                $updateData['payment_proof_url'] = $request->file('payment_proof')->store('payments/proofs', 'public');
            }

            // Update existing support document
            if ($request->hasFile('support_document')) {
                // Delete old file if exists
                if ($existingPayment->support_document_url) {
                    Storage::disk('public')->delete($existingPayment->support_document_url);
                }
                $updateData['support_document_url'] = $request->file('support_document')->store('payments/support_documents', 'public');
            }

            $existingPayment->update($updateData);

            return back()->with('success', 'Payment proof and support documents updated successfully! Waiting for admin verification.');
        }

        // Create new payment
        $proofPath = $request->file('payment_proof')->store('payments/proofs', 'public');
        $supportDocPath = null;
        if ($request->hasFile('support_document')) {
            $supportDocPath = $request->file('support_document')->store('payments/support_documents', 'public');
        }

        Payment::create([
            'user_id' => Auth::id(),
            'submission_id' => $request->submission_id,
            'payment_proof_url' => $proofPath,
            'support_document_url' => $supportDocPath,
            'amount' => $finalAmount,
            'gateway' => 'manual',
            'verified' => false,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Payment proof and support documents uploaded successfully! Waiting for admin verification.');
    }

    public function destroy($id)
    {
        $payment = Payment::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Don't allow deleting paid payments
        if ($payment->isPaid()) {
            return back()->withErrors(['error' => 'Cannot delete a completed payment.']);
        }

        // Delete files
        if ($payment->payment_proof_url) {
            Storage::disk('public')->delete($payment->payment_proof_url);
        }
        if ($payment->support_document_url) {
            Storage::disk('public')->delete($payment->support_document_url);
        }

        $payment->delete();

        return back()->with('success', 'Payment deleted successfully.');
    }

    /**
     * Check payment status directly from gateway API.
     * Called by frontend after payment to ensure DB is updated
     * even if webhook hasn't arrived yet.
     */
    public function checkPaymentStatus(Request $request)
    {
        $request->validate([
            'order_id' => 'required|string',
        ]);

        $orderId = $request->order_id;
        $payment = Payment::where('order_id', $orderId)
            ->where('user_id', Auth::id())
            ->first();

        if (!$payment) {
            return response()->json(['status' => 'not_found'], 404);
        }

        // Already paid? Skip API call
        if ($payment->status === 'paid') {
            return response()->json(['status' => 'paid']);
        }

        // Route to appropriate gateway checker
        if ($payment->isXendit()) {
            return $this->checkXenditStatus($payment);
        }

        return $this->checkMidtransStatus($payment, $orderId);
    }

    /**
     * Check Xendit invoice status.
     */
    private function checkXenditStatus(Payment $payment)
    {
        try {
            $invoiceId = $payment->snap_token; // we stored xendit invoice_id in snap_token
            if (!$invoiceId) {
                return response()->json(['status' => $payment->status]);
            }

            $xenditService = app(XenditService::class);
            $data = $xenditService->checkInvoiceStatus($invoiceId);

            if (!$data) {
                return response()->json(['status' => $payment->status]);
            }

            $xenditStatus = strtoupper($data['status'] ?? '');
            $updateData = [
                'payment_type' => $data['payment_method'] ?? $payment->payment_type,
                'transaction_id' => $data['id'] ?? $payment->transaction_id,
            ];

            $shouldMarkPaid = false;

            if (in_array($xenditStatus, ['PAID', 'SETTLED'])) {
                $updateData['status'] = 'paid';
                $updateData['paid_at'] = now();
                $updateData['verified'] = true;
                $updateData['verified_at'] = now();
                $shouldMarkPaid = true;
            } elseif ($xenditStatus === 'EXPIRED') {
                $updateData['status'] = 'failed';
                $updateData['snap_token'] = null;
            } elseif ($xenditStatus === 'PENDING') {
                $updateData['status'] = 'pending';
            }

            $payment->update($updateData);

            if ($shouldMarkPaid) {
                $this->sendPaymentEmail($payment);
            }

            return response()->json(['status' => $updateData['status'] ?? $payment->status]);
        } catch (\Exception $e) {
            Log::error("Xendit status check error: " . $e->getMessage());
            return response()->json(['status' => $payment->status]);
        }
    }

    /**
     * Check Midtrans transaction status.
     */
    private function checkMidtransStatus(Payment $payment, string $orderId)
    {
        try {
            $serverKey = config('midtrans.server_key');
            $isProduction = config('midtrans.is_production');
            $baseUrl = $isProduction
                ? 'https://api.midtrans.com/v2'
                : 'https://api.sandbox.midtrans.com/v2';

            $response = Http::withBasicAuth($serverKey, '')
                ->accept('application/json')
                ->get("{$baseUrl}/{$orderId}/status");

            if (!$response->ok()) {
                Log::warning("Midtrans status check failed for {$orderId}: HTTP {$response->status()}");
                return response()->json(['status' => $payment->status]);
            }

            $data = $response->json();
            $transactionStatus = $data['transaction_status'] ?? '';
            $fraudStatus = $data['fraud_status'] ?? 'accept';

            Log::info("Midtrans status check for {$orderId}: {$transactionStatus}");

            $updateData = [
                'payment_type' => $data['payment_type'] ?? $payment->payment_type,
                'transaction_id' => $data['transaction_id'] ?? $payment->transaction_id,
            ];

            $shouldMarkPaid = false;

            if ($transactionStatus === 'settlement' || ($transactionStatus === 'capture' && $fraudStatus === 'accept')) {
                $updateData['status'] = 'paid';
                $updateData['paid_at'] = now();
                $updateData['verified'] = true;
                $updateData['verified_at'] = now();
                $shouldMarkPaid = true;
            } elseif (in_array($transactionStatus, ['deny', 'cancel', 'expire'])) {
                $updateData['status'] = 'failed';
                $updateData['snap_token'] = null;
            } elseif ($transactionStatus === 'pending') {
                $updateData['status'] = 'pending';
            }

            $payment->update($updateData);

            if ($shouldMarkPaid) {
                $this->sendPaymentEmail($payment);
            }

            return response()->json(['status' => $updateData['status'] ?? $payment->status]);
        } catch (\Exception $e) {
            Log::error("Midtrans status check error for {$orderId}: " . $e->getMessage());
            return response()->json(['status' => $payment->status]);
        }
    }

    /**
     * Send payment confirmation email.
     */
    private function sendPaymentEmail(Payment $payment)
    {
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
}
