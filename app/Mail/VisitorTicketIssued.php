<?php

namespace App\Mail;

use App\Models\VisitorTicket;
use App\Models\LandingPageSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VisitorTicketIssued extends Mailable
{
    use Queueable, SerializesModels;

    public $ticket;
    public $eventDate;
    public $eventVenue;

    /**
     * Create a new message instance.
     */
    public function __construct(VisitorTicket $ticket)
    {
        $this->ticket = $ticket;

        try {
            $settings = LandingPageSetting::whereIn('key', [
                'visitor_event_date',
                'visitor_event_venue',
            ])->pluck('value', 'key');

            $this->eventDate = $settings['visitor_event_date'] ?? '3 - 5 November 2026';
            $this->eventVenue = $settings['visitor_event_venue'] ?? 'Royal Ambarrukmo Yogyakarta';
        } catch (\Exception $e) {
            $this->eventDate = '3 - 5 November 2026';
            $this->eventVenue = 'Royal Ambarrukmo Yogyakarta';
        }
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject("Official E-Tiket & Access Pass PIT IAGI & GEOSEA 2026 - [{$this->ticket->ticket_code}]")
                    ->view('emails.visitor_ticket_issued', [
                        'ticket' => $this->ticket,
                        'eventDate' => $this->eventDate,
                        'eventVenue' => $this->eventVenue,
                    ]);
    }
}
