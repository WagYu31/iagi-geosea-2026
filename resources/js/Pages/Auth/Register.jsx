import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        full_name: '',
        affiliation: '',
        whatsapp: '',
        category: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Page Title - Responsive */}
            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
                <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold"
                    style={{ color: '#111827' }}
                >
                    Create Account
                </h2>
                <p
                    className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base"
                    style={{ color: '#6b7280' }}
                >
                    Register for IAGI-GEOSEA 2026
                </p>
            </div>

            {/* Success Message */}
            {flash?.success && (
                <div
                    className="mb-3 sm:mb-4 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium"
                    style={{
                        backgroundColor: 'rgba(26, 188, 156, 0.1)',
                        color: '#0d7a6a',
                        border: '1px solid rgba(26, 188, 156, 0.3)',
                    }}
                >
                    {flash.success}
                </div>
            )}

            <form onSubmit={submit}>
                {/* Account Data Section */}
                <div className="mb-4 sm:mb-5">
                    <h3
                        className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4"
                        style={{
                            color: '#0d7a6a',
                            borderBottom: '2px solid rgba(26, 188, 156, 0.2)',
                            paddingBottom: '0.5rem',
                        }}
                    >
                        Account Information
                    </h3>

                    {/* Email */}
                    <div className="mb-3 sm:mb-4">
                        <InputLabel
                            htmlFor="email"
                            value="Email (Username)"
                            className="text-xs sm:text-sm"
                            style={{ color: '#374151', fontWeight: '600' }}
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
                            required
                        />
                        <InputError message={errors.email} className="mt-1 sm:mt-2 text-xs sm:text-sm" />
                    </div>

                    {/* Password */}
                    <div className="mb-3 sm:mb-4">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="text-xs sm:text-sm"
                            style={{ color: '#374151', fontWeight: '600' }}
                        />
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="mt-1 sm:mt-2 block w-full pr-10 sm:pr-12 text-sm sm:text-base"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                style={{
                                    borderRadius: '10px',
                                    borderColor: errors.password ? '#ef4444' : '#d1d5db',
                                    paddingTop: '0.625rem',
                                    paddingBottom: '0.625rem',
                                }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 focus:outline-none transition-colors duration-200"
                                style={{ color: '#9ca3af', marginTop: '0.125rem' }}
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

                    {/* Confirm Password */}
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                            className="text-xs sm:text-sm"
                            style={{ color: '#374151', fontWeight: '600' }}
                        />
                        <div className="relative">
                            <TextInput
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 sm:mt-2 block w-full pr-10 sm:pr-12 text-sm sm:text-base"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                style={{
                                    borderRadius: '10px',
                                    borderColor: errors.password_confirmation ? '#ef4444' : '#d1d5db',
                                    paddingTop: '0.625rem',
                                    paddingBottom: '0.625rem',
                                }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 focus:outline-none transition-colors duration-200"
                                style={{ color: '#9ca3af', marginTop: '0.125rem' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#0d7a6a'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                            >
                                {showConfirmPassword ? (
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
                        <InputError message={errors.password_confirmation} className="mt-1 sm:mt-2 text-xs sm:text-sm" />
                    </div>
                </div>

                {/* Profile Data Section */}
                <div className="mb-4 sm:mb-5">
                    <h3
                        className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4"
                        style={{
                            color: '#0d7a6a',
                            borderBottom: '2px solid rgba(26, 188, 156, 0.2)',
                            paddingBottom: '0.5rem',
                        }}
                    >
                        Profile Information
                    </h3>

                    {/* Full Name */}
                    <div className="mb-3 sm:mb-4">
                        <InputLabel
                            htmlFor="full_name"
                            value="Full Name (with title if any)"
                            className="text-xs sm:text-sm"
                            style={{ color: '#374151', fontWeight: '600' }}
                        />
                        <TextInput
                            id="full_name"
                            type="text"
                            name="full_name"
                            value={data.full_name}
                            className="mt-1 sm:mt-2 block w-full text-sm sm:text-base"
                            onChange={(e) => setData('full_name', e.target.value)}
                            style={{
                                borderRadius: '10px',
                                borderColor: errors.full_name ? '#ef4444' : '#d1d5db',
                                paddingTop: '0.625rem',
                                paddingBottom: '0.625rem',
                            }}
                            required
                        />
                        <InputError message={errors.full_name} className="mt-1 sm:mt-2 text-xs sm:text-sm" />
                    </div>

                    {/* Affiliation */}
                    <div className="mb-3 sm:mb-4">
                        <InputLabel
                            htmlFor="affiliation"
                            value="Affiliation/Institution"
                            className="text-xs sm:text-sm"
                            style={{ color: '#374151', fontWeight: '600' }}
                        />
                        <TextInput
                            id="affiliation"
                            type="text"
                            name="affiliation"
                            value={data.affiliation}
                            className="mt-1 sm:mt-2 block w-full text-sm sm:text-base"
                            onChange={(e) => setData('affiliation', e.target.value)}
                            style={{
                                borderRadius: '10px',
                                borderColor: errors.affiliation ? '#ef4444' : '#d1d5db',
                                paddingTop: '0.625rem',
                                paddingBottom: '0.625rem',
                            }}
                            required
                        />
                        <InputError message={errors.affiliation} className="mt-1 sm:mt-2 text-xs sm:text-sm" />
                    </div>

                    {/* WhatsApp */}
                    <div className="mb-3 sm:mb-4">
                        <InputLabel
                            htmlFor="whatsapp"
                            value="WhatsApp/Phone Number"
                            className="text-xs sm:text-sm"
                            style={{ color: '#374151', fontWeight: '600' }}
                        />
                        <TextInput
                            id="whatsapp"
                            type="text"
                            name="whatsapp"
                            value={data.whatsapp}
                            className="mt-1 sm:mt-2 block w-full text-sm sm:text-base"
                            onChange={(e) => setData('whatsapp', e.target.value)}
                            style={{
                                borderRadius: '10px',
                                borderColor: errors.whatsapp ? '#ef4444' : '#d1d5db',
                                paddingTop: '0.625rem',
                                paddingBottom: '0.625rem',
                            }}
                            required
                        />
                        <InputError message={errors.whatsapp} className="mt-1 sm:mt-2 text-xs sm:text-sm" />
                    </div>

                    {/* Category */}
                    <div>
                        <InputLabel
                            htmlFor="category"
                            value="Participant Category"
                            className="text-xs sm:text-sm"
                            style={{ color: '#374151', fontWeight: '600' }}
                        />
                        <select
                            id="category"
                            name="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="mt-1 sm:mt-2 block w-full text-sm sm:text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg shadow-sm"
                            style={{
                                borderRadius: '10px',
                                borderColor: errors.category ? '#ef4444' : '#d1d5db',
                                paddingTop: '0.625rem',
                                paddingBottom: '0.625rem',
                                paddingLeft: '0.75rem',
                                paddingRight: '0.75rem',
                            }}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Student">Student</option>
                            <option value="Professional">Professional</option>
                            <option value="International Delegate">International Delegate</option>
                        </select>
                        <InputError message={errors.category} className="mt-1 sm:mt-2 text-xs sm:text-sm" />
                    </div>
                </div>

                {/* Register Button */}
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
                    {processing ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Login Link */}
                <div className="mt-4 sm:mt-5 md:mt-6 text-center">
                    <span className="text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                        Already have an account?{' '}
                    </span>
                    <Link
                        href={route('login')}
                        className="font-semibold transition-colors duration-200 text-xs sm:text-sm"
                        style={{ color: '#0d7a6a' }}
                        onMouseEnter={(e) => e.target.style.color = '#1abc9c'}
                        onMouseLeave={(e) => e.target.style.color = '#0d7a6a'}
                    >
                        Sign in here
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
