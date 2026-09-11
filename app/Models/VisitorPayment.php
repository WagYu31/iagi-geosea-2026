<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitorPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_code',
        'payment_method',
        'total_members',
        'price_per_ticket',
        'unique_code',
        'total_amount',
        'proof_of_payment',
        'original_file_size_kb',
        'compressed_file_size_kb',
        'status',
        'verified_at',
        'verified_by_admin_id',
        'notes',
    ];

    protected $casts = [
        'price_per_ticket' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'verified_at' => 'datetime',
    ];

    public function tickets(): HasMany
    {
        return $this->hasMany(VisitorTicket::class, 'payment_id');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by_admin_id');
    }

    protected $appends = [
        'receipt_no',
        'category_label',
        'primary_registrant_name',
    ];

    public function getReceiptNoAttribute(): string
    {
        $num = str_pad((string) ($this->id ?? 1), 3, '0', STR_PAD_LEFT);
        $date = $this->created_at ?? now();
        $romanMonths = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
        ];
        $month = (int) $date->format('n');
        $romanMonth = $romanMonths[$month] ?? 'VIII';
        $year = $date->format('Y');

        return "Receipt No. {$num}/PIT55-GEOSEA/REC-R/{$romanMonth}/{$year}";
    }

    public function getCategoryLabelAttribute(): string
    {
        $ticket = $this->tickets()->first();
        if ($ticket) {
            return $ticket->category_label;
        }
        return 'Conference Pass';
    }

    public function getPrimaryRegistrantNameAttribute(): string
    {
        $ticket = $this->tickets()->first();
        return ($ticket && !empty($ticket->visitor_name)) ? $ticket->visitor_name : 'Registrant';
    }
}
