<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_name',
        'user_email',
        'action',
        'module',
        'description',
        'target_id',
        'target_code',
        'snapshot',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'snapshot' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Record a new activity / audit entry safely
     */
    public static function record(
        string $action,
        string $module,
        string $description,
        ?int $targetId = null,
        ?string $targetCode = null,
        ?array $snapshot = null
    ): ?self {
        try {
            // Auto ensure table exists to prevent errors prior to running migrations
            self::ensureTableExists();

            $user = Auth::user();
            $request = request();

            return self::create([
                'user_id' => $user?->id,
                'user_name' => $user?->name ?? 'System/Guest',
                'user_email' => $user?->email,
                'action' => $action,
                'module' => $module,
                'description' => $description,
                'target_id' => $targetId,
                'target_code' => $targetCode,
                'snapshot' => $snapshot,
                'ip_address' => $request ? $request->ip() : null,
                'user_agent' => $request ? substr($request->userAgent() ?? '', 0, 500) : null,
            ]);
        } catch (\Throwable $e) {
            Log::warning("Failed to record ActivityLog: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Ensure the activity_logs table exists
     */
    public static function ensureTableExists(): void
    {
        try {
            if (!Schema::hasTable('activity_logs')) {
                Schema::create('activity_logs', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('user_id')->nullable();
                    $table->string('user_name', 150)->nullable();
                    $table->string('user_email', 150)->nullable();
                    $table->string('action', 80);
                    $table->string('module', 60)->default('general');
                    $table->text('description');
                    $table->unsignedBigInteger('target_id')->nullable();
                    $table->string('target_code', 100)->nullable();
                    $table->json('snapshot')->nullable();
                    $table->string('ip_address', 45)->nullable();
                    $table->text('user_agent')->nullable();
                    $table->timestamps();

                    $table->index(['action', 'created_at']);
                    $table->index(['module', 'created_at']);
                    $table->index('target_code');
                });
            }
        } catch (\Throwable $e) {
            // Table may already exist or DB not ready
        }
    }
}
