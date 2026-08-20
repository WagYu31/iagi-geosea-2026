<?php

namespace App\Mail;

use App\Models\VisitorPayment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VisitorPaymentPending extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 30;

    public $payment;

    /**
     * Create a new message instance.
     */
    public function __construct(VisitorPayment $payment)
    {
        $this->payment = $payment;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject("Menunggu Verifikasi Pembayaran Tiket PIT IAGI-GEOSEA 2026 - [{$this->payment->payment_code}]")
                    ->view('emails.visitor_payment_pending');
    }
}
