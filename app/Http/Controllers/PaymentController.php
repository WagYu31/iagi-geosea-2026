<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Submission;
use App\Services\MidtransService;
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
        // DB override first, then config fallback
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
            // If already paid, reject
            if ($payment->isPaid()) {
                return response()->json([
                    'error' => 'This submission has already been paid.',
                ], 422);
            }

            // Always refresh: update amount + clear old snap_token to force fresh token
            $payment->update([
                'amount'     => $amount,
                'snap_token' => null,
            ]);
        } else {
            // Create new payment record
            $payment = Payment::create([
                'user_id'       => Auth::id(),
                'submission_id' => $request->submission_id,
                'amount'        => $amount,
                'status'        => 'pending',
                'verified'      => false,
            ]);
        }

        try {
            $result = $midtransService->createSnapToken($payment);

            return response()->json([
                'snap_token' => $result['snap_token'],
                'order_id'   => $result['order_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Snap token creation failed: ' . $e->getMessage());

            return response()->json([
                'error' => 'Failed to create payment. Please try again.',
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
     * Legacy: Store payment proof (manual upload).
     * Kept for backward compatibility.
     */
    public function store(Request $request)
    {
        $request->validate([
            'submission_id' => 'required|exists:submissions,id',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'amount' => 'required|numeric|min:0',
        ]);

        // Check if user owns the submission
        $submission = Submission::where('id', $request->submission_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Check if payment already exists for this submission
        $existingPayment = Payment::where('submission_id', $request->submission_id)->first();

        if ($existingPayment) {
            // Update existing payment
            if ($request->hasFile('payment_proof')) {
                // Delete old file if exists
                if ($existingPayment->payment_proof_url) {
                    Storage::disk('public')->delete($existingPayment->payment_proof_url);
                }

                $proofPath = $request->file('payment_proof')->store('payments/proofs', 'public');
                $existingPayment->update([
                    'payment_proof_url' => $proofPath,
                    'amount' => $request->amount,
                    'verified' => false, // Reset verification status
                    'verified_at' => null,
                ]);
            }

            return back()->with('success', 'Payment proof updated successfully! Waiting for admin verification.');
        }

        // Create new payment
        $proofPath = $request->file('payment_proof')->store('payments/proofs', 'public');

        Payment::create([
            'user_id' => Auth::id(),
            'submission_id' => $request->submission_id,
            'payment_proof_url' => $proofPath,
            'amount' => $request->amount,
            'verified' => false,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Payment proof uploaded successfully! Waiting for admin verification.');
    }

    public function destroy($id)
    {
        $payment = Payment::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Don't allow deleting paid Midtrans payments
        if ($payment->isMidtrans() && $payment->isPaid()) {
            return back()->withErrors(['error' => 'Cannot delete a completed Midtrans payment.']);
        }

        // Delete file
        if ($payment->payment_proof_url) {
            Storage::disk('public')->delete($payment->payment_proof_url);
        }

        $payment->delete();

        return back()->with('success', 'Payment deleted successfully.');
    }

    /**
     * Check payment status directly from Midtrans API.
     * Called by frontend after Snap onSuccess to ensure DB is updated
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

        // Query Midtrans API directly
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

            // Send confirmation email if just marked paid
            if ($shouldMarkPaid) {
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

            return response()->json(['status' => $updateData['status'] ?? $payment->status]);
        } catch (\Exception $e) {
            Log::error("Midtrans status check error for {$orderId}: " . $e->getMessage());
            return response()->json(['status' => $payment->status]);
        }
    }
}
