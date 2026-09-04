<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitorTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'registered_by_admin_id',
        'registration_source',
        'visitor_name',
        'visitor_email',
        'visitor_phone',
        'visitor_institution',
        'ticket_code',
        'visitor_type',
        'is_group_leader',
        'group_code',
        'status',
        'checked_in',
        'checked_in_at',
        'checked_in_by_admin_id',
        'card_printed',
        'card_printed_at',
        'card_printed_by_admin_id',
    ];

    protected $casts = [
        'is_group_leader' => 'boolean',
        'checked_in' => 'boolean',
        'checked_in_at' => 'datetime',
        'card_printed' => 'boolean',
        'card_printed_at' => 'datetime',
    ];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(VisitorPayment::class, 'payment_id');
    }

    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by_admin_id');
    }

    public function checkedInBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_in_by_admin_id');
    }

    public function cardPrintedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'card_printed_by_admin_id');
    }

    /**
     * Generate unique ticket code
     */
    public static function generateTicketCode(string $type = 'non_exclusive'): string
    {
        $prefixMap = [
            'non_exclusive' => 'TKT-FREE',
            'exclusive' => 'TKT-VIP',
            'iagi_member_professional' => 'TKT-IPRO',
            'non_iagi_member_professional' => 'TKT-NPRO',
            'iagi_member_expatriate' => 'TKT-IEXP',
            'non_iagi_member_expatriate' => 'TKT-NEXP',
            'student_undergraduate' => 'TKT-STUD',
        ];

        $prefix = $prefixMap[$type] ?? 'TKT-VIS';
        $random = strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
        $code = "{$prefix}-" . date('y') . "-{$random}";
        
        while (self::where('ticket_code', $code)->exists()) {
            $random = strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
            $code = "{$prefix}-" . date('y') . "-{$random}";
        }
        
        return $code;
    }

    /**
     * Get human-readable category name
     */
    public function getCategoryLabelAttribute(): string
    {
        $map = [
            'iagi_member_professional' => 'IAGI Member Professional',
            'non_iagi_member_professional' => 'Non IAGI Member Professional',
            'iagi_member_expatriate' => 'IAGI Member Expatriate',
            'non_iagi_member_expatriate' => 'Non IAGI Member Expatriate',
            'student_undergraduate' => 'Student Undergraduate',
            'exclusive' => 'Visitor Exclusive (VIP)',
            'non_exclusive' => 'Visitor Non-Exclusive (Free)',
        ];

        return $map[$this->visitor_type] ?? ucwords(str_replace('_', ' ', $this->visitor_type));
    }
}
