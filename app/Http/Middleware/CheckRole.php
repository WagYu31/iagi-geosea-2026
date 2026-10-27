<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $userRole = strtolower($request->user()->role ?? '');

        // Support multiple roles passed either as separate arguments or comma-separated
        $allowedRoles = [];
        foreach ($roles as $r) {
            foreach (explode(',', $r) as $subRole) {
                $sub = strtolower(trim($subRole));
                if ($sub !== '') {
                    $allowedRoles[] = $sub;
                }
            }
        }

        if (!in_array($userRole, $allowedRoles, true)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}

