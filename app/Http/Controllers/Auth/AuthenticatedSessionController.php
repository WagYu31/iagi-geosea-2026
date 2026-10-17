<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // 2FA WhatsApp Enforcement for Admin
        if ($user && strtolower($user->role) === 'admin') {
            Auth::guard('web')->logout();

            $otp = (string) random_int(100000, 999999);
            $phone = $user->whatsapp ?: env('ADMIN_WHATSAPP', '628212226504');

            $request->session()->put('auth_2fa', [
                'user_id' => $user->id,
                'otp_hash' => \Illuminate\Support\Facades\Hash::make($otp),
                'expires_at' => now()->addMinutes(5)->timestamp,
                'last_sent_at' => now()->timestamp,
                'phone' => $phone,
                'remember' => $request->boolean('remember'),
                'dev_otp' => (config('app.debug') || env('WHATSAPP_MANUAL_MODE', true)) ? $otp : null,
            ]);

            // Dispatch OTP via WhatsApp
            if (!empty($phone)) {
                app(\App\Services\WhatsAppNotificationService::class)->sendOtp($phone, $otp);
            }

            return redirect()->route('2fa.verify');
        }

        $request->session()->regenerate();

        if (strtolower($user->role) === 'reviewer') {
            return redirect()->intended(route('reviewer.dashboard', absolute: false));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
