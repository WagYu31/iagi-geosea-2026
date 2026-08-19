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
}
