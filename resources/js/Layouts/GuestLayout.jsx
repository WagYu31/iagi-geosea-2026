import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center px-3 py-8 sm:px-6 sm:py-12 lg:px-8"
            style={{
                background: 'linear-gradient(135deg, #094d42 0%, #0a3d35 50%, #083a31 100%)',
                position: 'relative',
            }}
        >
            {/* Decorative Background Elements */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #0d7a6a 0%, #1abc9c 50%, #0d7a6a 100%)',
                }}
            />

            {/* Logo/Branding */}
            <div className="mb-6 sm:mb-8 md:mb-10 text-center">
                <Link href="/" className="inline-block">
                    {/* Logo - Responsive Sizes */}
                    <ApplicationLogo
                        className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mb-3 sm:mb-4 mx-auto transition-transform duration-300 hover:scale-110"
                        style={{ fill: '#4dd4ac' }}
                    />

                    {/* Title - Responsive Text Sizes */}
                    <h1
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 transition-colors duration-300 hover:opacity-90"
                        style={{
                            color: '#4dd4ac',
                            letterSpacing: '0.02em',
                        }}
                    >
                        PIT IAGI-GEOSEA <span style={{ color: '#1abc9c' }}>2026</span>
                    </h1>

                    {/* Subtitle - Responsive Text Sizes */}
                    <p
                        className="text-xs sm:text-sm md:text-base font-semibold"
                        style={{
                            color: 'rgba(255,255,255,0.7)',
                            letterSpacing: '0.1em',
                        }}
                    >
                        55TH EDITION
                    </p>
                </Link>
            </div>

            {/* Login Card - Responsive Width & Padding */}
            <div
                className="w-full overflow-hidden shadow-2xl sm:max-w-md md:max-w-lg lg:max-w-xl"
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
            >
                <style>{`
                    @media (min-width: 640px) {
                        .login-card {
                            border-radius: 20px;
                            padding: 2rem;
                        }
                    }
                    @media (min-width: 768px) {
                        .login-card {
                            border-radius: 24px;
                            padding: 2.5rem;
                        }
                    }
                    @media (min-width: 1024px) {
                        .login-card {
                            padding: 3rem;
                        }
                    }
                `}</style>
                <div className="login-card">
                    {children}
                </div>
            </div>

            {/* Footer Link - Responsive Text */}
            <div className="mt-4 sm:mt-6 md:mt-8 text-center">
                <Link
                    href="/"
                    className="text-xs sm:text-sm md:text-base font-medium transition-all duration-200 inline-flex items-center gap-2 hover:gap-3"
                    style={{
                        color: 'rgba(255,255,255,0.7)',
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#4dd4ac'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
                >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
