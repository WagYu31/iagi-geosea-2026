<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'full_name' => 'required|string|max:255',
            'affiliation' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:255',
            'category' => 'required|in:Student,Professional,International Delegate',
        ]);

        $user = User::create([
            'name' => $request->email, // Use email as name since form doesn't have separate name field
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'full_name' => $request->full_name,
            'affiliation' => $request->affiliation,
            'whatsapp' => $request->whatsapp,
            'category' => $request->category,
        ]);

        event(new Registered($user));

        return redirect()->route('login')->with('flash.success', 'Registration successful! Please log in.');
    }
}
