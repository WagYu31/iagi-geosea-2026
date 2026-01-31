import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Page Title - Responsive */}
            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
                <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold"
                    style={{ color: '#111827' }}
                >
                    Welcome Back
                </h2>
                <p
                    className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base"
                    style={{ color: '#6b7280' }}
                >
                    Sign in to access your account
                </p>
            </div>

            {/* Status Message - Responsive */}
            {status && (
                <div
                    className="mb-3 sm:mb-4 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium"
                    style={{
                        backgroundColor: 'rgba(26, 188, 156, 0.1)',
                        color: '#0d7a6a',
                        border: '1px solid rgba(26, 188, 156, 0.3)',
                    }}
                >
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                {/* Email Field - Responsive */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email Address"
                        className="text-xs sm:text-sm"
                        style={{
                            color: '#374151',
                            fontWeight: '600',
                        }}
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 sm:mt-2 block w-full text-sm sm:text-base"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        style={{
                            borderRadius: '10px',
                            borderColor: errors.email ? '#ef4444' : '#d1d5db',
                            paddingTop: '0.625rem',
                            paddingBottom: '0.625rem',
                        }}
                    />

                    <InputError message={errors.email} className="mt-1 sm:mt-2 text-xs sm:text-sm" />
                </div>

                {/* Password Field - Responsive */}
                <div className="mt-3 sm:mt-4 md:mt-5">
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="text-xs sm:text-sm"
                        style={{
                            color: '#374151',
                            fontWeight: '600',
                        }}
                    />

                    <div className="relative">
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="mt-1 sm:mt-2 block w-full pr-10 sm:pr-12 text-sm sm:text-base"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            style={{
                                borderRadius: '10px',
                                borderColor: errors.password ? '#ef4444' : '#d1d5db',
                                paddingTop: '0.625rem',
                                paddingBottom: '0.625rem',
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 focus:outline-none transition-colors duration-200"
                            style={{
                                color: '#9ca3af',
                                marginTop: '0.125rem',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#0d7a6a'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-1 sm:mt-2 text-xs sm:text-sm" />
                </div>

                {/* Remember Me & Forgot Password - Responsive Stack on Mobile */}
                <div className="mt-3 sm:mt-4 md:mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="w-4 h-4 sm:w-auto sm:h-auto"
                        />
                        <span
                            className="ms-2 text-xs sm:text-sm"
                            style={{ color: '#6b7280' }}
                        >
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs sm:text-sm font-medium transition-colors duration-200"
                            style={{ color: '#0d7a6a' }}
                            onMouseEnter={(e) => e.target.style.color = '#1abc9c'}
                            onMouseLeave={(e) => e.target.style.color = '#0d7a6a'}
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Login Button - Responsive */}
                <button
                    type="submit"
                    disabled={processing}
                    className="mt-4 sm:mt-5 md:mt-6 w-full font-bold text-white transition-all duration-300 text-xs sm:text-sm md:text-base"
                    style={{
                        backgroundColor: processing ? '#9ca3af' : '#1abc9c',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '50px',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 16px rgba(26, 188, 156, 0.3)',
                        cursor: processing ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                        if (!processing) {
                            e.target.style.backgroundColor = '#16a085';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 24px rgba(26, 188, 156, 0.4)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!processing) {
                            e.target.style.backgroundColor = '#1abc9c';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 16px rgba(26, 188, 156, 0.3)';
                        }
                    }}
                >
                    {processing ? 'Signing in...' : 'Sign In'}
                </button>

                {/* Register Link - Responsive */}
                <div className="mt-4 sm:mt-5 md:mt-6 text-center">
                    <span className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                        Don't have an account?{' '}
                    </span>
                    <Link
                        href={route('register')}
                        className="font-semibold transition-colors duration-200 text-xs sm:text-sm"
                        style={{
                            color: '#0d7a6a',
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#1abc9c'}
                        onMouseLeave={(e) => e.target.style.color = '#0d7a6a'}
                    >
                        Create an account
                    </Link>
                </div>
            </form>

            {/* Responsive Media Query Styles */}
            <style>{`
                /* Mobile First - Default Styles Above */
                
                /* Small devices (landscape phones, 640px and up) */
                @media (min-width: 640px) {
                    .login-button {
                        padding: 0.875rem 1.5rem;
                    }
                }
                
                /* Medium devices (tablets, 768px and up) */
                @media (min-width: 768px) {
                    .login-button {
                        padding: 1rem 2rem;
                    }
                }
                
                /* Large devices (desktops, 1024px and up) */
                @media (min-width: 1024px) {
                    .login-input {
                        padding-top: 0.75rem;
                        padding-bottom: 0.75rem;
                    }
                }
            `}</style>
        </GuestLayout>
    );
}
