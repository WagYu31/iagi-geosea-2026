<?php

namespace App\Mail;

use App\Models\VisitorPayment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VisitorPaymentPending extends Mailable
{
    use Queueable, SerializesModels;

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
