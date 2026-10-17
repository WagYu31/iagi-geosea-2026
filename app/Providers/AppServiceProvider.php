<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\EmailSetting;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Enforce strong password policy across registration and reset passwords
        \Illuminate\Validation\Rules\Password::defaults(function () {
            return \Illuminate\Validation\Rules\Password::min(8)
                ->letters()
                ->numbers();
        });

        // Auto-apply SMTP settings from database
        try {
            $emailSettings = EmailSetting::getActive();
            if ($emailSettings) {
                $emailSettings->applyToConfig();
            }
        } catch (\Exception $e) {
            // Silently fail if table doesn't exist yet (during migrations)
        }
    }
}
