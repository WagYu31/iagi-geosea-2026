<?php

namespace App\Mail;

use App\Models\VisitorTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VisitorTicketIssued extends Mailable
{
    use Queueable, SerializesModels;

    public $ticket;

    /**
     * Create a new message instance.
     */
    public function __construct(VisitorTicket $ticket)
    {
        $this->ticket = $ticket;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject("E-Tiket Konferensi PIT IAGI & GEOSEA 2026 - [{$this->ticket->ticket_code}]")
                    ->view('emails.visitor_ticket_issued');
    }
}
