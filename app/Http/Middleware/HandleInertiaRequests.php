<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'flash' => [
                'error' => fn () => $request->session()->get('error'),
                'success' => fn () => $request->session()->get('success'),
            ],
            'menuVisibility' => fn () => $this->getMenuVisibility(),
        ];
    }

    /**
     * Get menu visibility settings from DB with cache.
     */
    private function getMenuVisibility(): array
    {
        return Cache::remember('menu_visibility', 300, function () {
            $setting = \App\Models\LandingPageSetting::where('key', 'menu_visibility')->first();
            if ($setting) {
                $value = json_decode($setting->value, true);
                if (is_array($value)) return $value;
            }
            // Default: all menus visible
            return [
                'payments' => true,
                'certificates' => true,
            ];
        });
    }
}
