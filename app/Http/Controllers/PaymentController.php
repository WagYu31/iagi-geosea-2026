<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
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
        ]);

        return back()->with('success', 'Payment proof uploaded successfully! Waiting for admin verification.');
    }

    public function destroy($id)
    {
        $payment = Payment::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Delete file
        if ($payment->payment_proof_url) {
            Storage::disk('public')->delete($payment->payment_proof_url);
        }

        $payment->delete();

        return back()->with('success', 'Payment deleted successfully.');
    }
}
