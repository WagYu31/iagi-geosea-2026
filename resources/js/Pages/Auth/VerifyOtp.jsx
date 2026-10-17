import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SecurityIcon from '@mui/icons-material/Security';
import GuestLayout from '@/Layouts/GuestLayout';
import { motion } from 'motion/react';

export default function VerifyOtp({ maskedPhone, remainingSeconds = 300, status, devOtp, isManualMode }) {
    const [timeLeft, setTimeLeft] = useState(remainingSeconds);
    const [resendCooldown, setResendCooldown] = useState(45);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    const { post: postResend, processing: resending } = useForm();
    const { post: postCancel } = useForm();

    const tealPrimary = '#0d9488';
    const emeraldAccent = '#34d399';
    const tealDark = '#094d42';

    // Countdown for OTP expiration
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Cooldown for resend button
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Sync digits with form data.otp
    useEffect(() => {
        const fullOtp = otpDigits.join('');
        setData('otp', fullOtp);
        // Auto submit when all 6 digits entered
        if (fullOtp.length === 6 && !processing) {
            post(route('2fa.submit'));
        }
    }, [otpDigits]);

    const handleDigitChange = (index, value) => {
        // Only accept numbers
        const cleanValue = value.replace(/[^0-9]/g, '');

        if (!cleanValue) {
            const newDigits = [...otpDigits];
            newDigits[index] = '';
            setOtpDigits(newDigits);
            return;
        }

        // Handle Paste of multiple digits
        if (cleanValue.length > 1) {
            const pasted = cleanValue.slice(0, 6).split('');
            const newDigits = [...otpDigits];
            pasted.forEach((char, idx) => {
                if (idx < 6) newDigits[idx] = char;
            });
            setOtpDigits(newDigits);
            const nextFocus = Math.min(5, pasted.length);
            inputRefs.current[nextFocus]?.focus();
            return;
        }

        const newDigits = [...otpDigits];
        newDigits[index] = cleanValue;
        setOtpDigits(newDigits);

        // Move to next input box automatically
        if (index < 5 && cleanValue) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = (e) => {
        e.preventDefault();
        if (resendCooldown > 0 || resending) return;

        postResend(route('2fa.resend'), {
            onSuccess: () => {
                setResendCooldown(45);
                setTimeLeft(300);
                setOtpDigits(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            },
        });
    };

    const handleCancel = (e) => {
        e.preventDefault();
        postCancel(route('2fa.cancel'));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <GuestLayout wide={false}>
            <Head title="Two-Factor Authentication - PIT IAGI - GEOSEA 2026" />

            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                sx={{
                    width: '100%',
                    bgcolor: '#ffffff',
                    borderRadius: '24px',
                    p: { xs: 3, sm: 4.5 },
                    boxShadow: '0 25px 80px -15px rgba(0, 0, 0, 0.65), 0 0 50px -10px rgba(20, 184, 166, 0.25)',
                    border: '1.5px solid rgba(255, 255, 255, 0.25)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Top Glowing Green Accent Beam */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #0d9488 0%, #34d399 50%, #2dd4bf 100%)',
                    }}
                />

                {/* Animated WhatsApp / Security Icon Medallion */}
                <Box
                    component={motion.div}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 72,
                        height: 72,
                        borderRadius: '22px',
                        background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(13, 148, 136, 0.25) 100%)',
                        border: '1.5px solid rgba(37, 211, 102, 0.4)',
                        boxShadow: '0 8px 25px rgba(37, 211, 102, 0.25)',
                        mb: 2.5,
                        position: 'relative',
                    }}
                >
                    <WhatsAppIcon sx={{ fontSize: 38, color: '#25D366' }} />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -4,
                            right: -4,
                            bgcolor: tealPrimary,
                            borderRadius: '50%',
                            p: 0.5,
                            display: 'flex',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                    >
                        <SecurityIcon sx={{ fontSize: 14, color: '#ffffff' }} />
                    </Box>
                </Box>

                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontWeight: 900,
                        color: '#0f172a',
                        fontSize: { xs: '1.35rem', sm: '1.6rem' },
                        letterSpacing: '-0.02em',
                        mb: 1,
                    }}
                >
                    Two-Factor Authentication
                </Typography>

                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                        maxWidth: '380px',
                        mx: 'auto',
                        mb: 2,
                    }}
                >
                    Untuk keamanan maksimal akun Admin, kami telah mengirimkan 6 digit kode OTP ke WhatsApp Anda:
                </Typography>

                {/* Masked Phone Pill */}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: 'rgba(37, 211, 102, 0.08)',
                        border: '1px solid rgba(37, 211, 102, 0.3)',
                        borderRadius: '9999px',
                        px: 2.2,
                        py: 0.7,
                        mb: 3,
                    }}
                >
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#25D366', boxShadow: '0 0 8px #25D366' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#094d42', letterSpacing: '0.04em' }}>
                        {maskedPhone}
                    </Typography>
                </Box>

                {/* Success Status Alert */}
                {status && (
                    <Alert severity="success" sx={{ mb: 2.5, borderRadius: '12px', fontSize: '0.84rem' }}>
                        {status}
                    </Alert>
                )}

                {/* Error Alert */}
                {errors.otp && (
                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px', fontSize: '0.84rem' }}>
                        {errors.otp}
                    </Alert>
                )}

                {/* Developer / Manual Mode Hint Box */}
                {isManualMode && devOtp && (
                    <Box
                        sx={{
                            mb: 3,
                            p: 1.5,
                            borderRadius: '12px',
                            bgcolor: '#f0fdf4',
                            border: '1px dashed #86efac',
                            textAlign: 'center',
                        }}
                    >
                        <Typography sx={{ fontSize: '0.74rem', color: '#166534', fontWeight: 600 }}>
                            🛠️ DEV / MANUAL MODE OTP:
                        </Typography>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803d', letterSpacing: '0.25em' }}>
                            {devOtp}
                        </Typography>
                    </Box>
                )}

                {/* 6-Segmented Digit Input Boxes */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(route('2fa.submit'));
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: { xs: 1, sm: 1.5 },
                            mb: 3,
                        }}
                    >
                        {otpDigits.map((digit, index) => (
                            <Box
                                key={index}
                                component="input"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                ref={(el) => (inputRefs.current[index] = el)}
                                onChange={(e) => handleDigitChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                autoFocus={index === 0}
                                disabled={processing}
                                sx={{
                                    width: { xs: 44, sm: 52 },
                                    height: { xs: 52, sm: 60 },
                                    borderRadius: '14px',
                                    border: '2px solid',
                                    borderColor: digit ? tealPrimary : '#e2e8f0',
                                    bgcolor: digit ? 'rgba(13, 148, 136, 0.04)' : '#f8fafc',
                                    textAlign: 'center',
                                    fontSize: { xs: '1.4rem', sm: '1.65rem' },
                                    fontWeight: 800,
                                    color: '#0f172a',
                                    outline: 'none',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: digit ? '0 0 0 3px rgba(13, 148, 136, 0.15)' : 'none',
                                    '&:focus': {
                                        borderColor: tealPrimary,
                                        bgcolor: '#ffffff',
                                        boxShadow: '0 0 0 4px rgba(13, 148, 136, 0.18)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            />
                        ))}
                    </Box>

                    {/* Expiration Timer Indicator */}
                    <Typography
                        sx={{
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: timeLeft > 60 ? '#64748b' : '#ef4444',
                            mb: 3,
                        }}
                    >
                        {timeLeft > 0 ? (
                            <>Kode kedaluwarsa dalam: <Box component="span" sx={{ fontWeight: 800 }}>{formatTime(timeLeft)}</Box></>
                        ) : (
                            '⚠️ Kode telah kedaluwarsa. Silakan kirim ulang.'
                        )}
                    </Typography>

                    {/* Primary Verify CTA Button */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={processing || data.otp.length !== 6 || timeLeft <= 0}
                        startIcon={
                            processing ? (
                                <CircularProgress size={18} sx={{ color: 'white' }} />
                            ) : null
                        }
                        sx={{
                            py: 1.4,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.96rem',
                            background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 50%, #059669 100%)',
                            boxShadow: '0 10px 24px -5px rgba(9, 77, 66, 0.45)',
                            color: '#ffffff',
                            transition: 'all 0.25s ease',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #0d7a6a 0%, #059669 100%)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        {processing ? 'Memverifikasi...' : 'Verifikasi & Masuk Dashboard'}
                    </Button>
                </form>

                {/* Resend & Cancel Actions */}
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                    <Button
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || resending}
                        startIcon={<ReplayIcon sx={{ fontSize: 17 }} />}
                        sx={{
                            textTransform: 'none',
                            color: resendCooldown > 0 ? '#94a3b8' : tealPrimary,
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            '&:hover': { bgcolor: alpha(tealPrimary, 0.08) },
                        }}
                    >
                        {resendCooldown > 0 ? `Kirim Ulang (${resendCooldown}s)` : 'Kirim Ulang OTP'}
                    </Button>

                    <Box sx={{ width: 1, height: 16, bgcolor: '#e2e8f0' }} />

                    <Button
                        onClick={handleCancel}
                        startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            textTransform: 'none',
                            color: '#64748b',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            '&:hover': { color: '#0f172a' },
                        }}
                    >
                        Batal
                    </Button>
                </Stack>
            </Box>
        </GuestLayout>
    );
}
