import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import LoginIcon from '@mui/icons-material/Login';
import GuestLayout from '@/Layouts/GuestLayout';
import { motion, AnimatePresence } from 'motion/react';

export default function VerifyOtp({ maskedPhone, maskedEmail, channel = 'whatsapp', remainingSeconds = 300, status }) {
    const [timeLeft, setTimeLeft] = useState(remainingSeconds);
    const [resendCooldown, setResendCooldown] = useState(45);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    const { post: postResend, processing: resending } = useForm();
    const { post: postEmail, processing: sendingEmail } = useForm();
    const { post: postWhatsApp, processing: sendingWhatsApp } = useForm();
    const { post: postCancel } = useForm();

    const tealPrimary = '#0d9488';
    const emeraldPrimary = '#10b981';
    const tealDark = '#065f46';
    const isEmail = channel === 'email';

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

    // Reset countdown on new remainingSeconds from server
    useEffect(() => {
        setTimeLeft(remainingSeconds);
    }, [remainingSeconds]);

    // Sync digits with form data.otp and auto submit
    useEffect(() => {
        const fullOtp = otpDigits.join('');
        setData('otp', fullOtp);
        if (fullOtp.length === 6 && !processing) {
            post(route('2fa.submit'));
        }
    }, [otpDigits]);

    const handleDigitChange = (index, value) => {
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

        // Move to next input box
        if (index < 5 && cleanValue) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (!otpDigits[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleSwitchToEmail = (e) => {
        e.preventDefault();
        if (sendingEmail) return;

        postEmail(route('2fa.send-email'), {
            onSuccess: () => {
                setOtpDigits(['', '', '', '', '', '']);
                setResendCooldown(45);
                setTimeLeft(300);
                inputRefs.current[0]?.focus();
            },
        });
    };

    const handleSwitchToWhatsApp = (e) => {
        e.preventDefault();
        if (sendingWhatsApp) return;

        postWhatsApp(route('2fa.send-whatsapp'), {
            onSuccess: () => {
                setOtpDigits(['', '', '', '', '', '']);
                setResendCooldown(45);
                setTimeLeft(300);
                inputRefs.current[0]?.focus();
            },
        });
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
        <GuestLayout containerMaxWidth={{ xs: '100%', sm: '520px', md: '550px' }}>
            <Head title="Two-Factor Authentication - 55th PIT IAGI - GEOSEA XIX 2026" />

            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                sx={{ textAlign: 'center' }}
            >
                {/* Modern Medallion: WhatsApp or Email */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Box
                        component={motion.div}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                        sx={{
                            width: 72,
                            height: 72,
                            borderRadius: '22px',
                            background: isEmail
                                ? 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)'
                                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: '2px solid rgba(255, 255, 255, 0.9)',
                            boxShadow: isEmail
                                ? '0 12px 28px -4px rgba(13, 148, 136, 0.42), 0 0 0 1px rgba(13, 148, 136, 0.25)'
                                : '0 12px 28px -4px rgba(16, 185, 129, 0.42), 0 0 0 1px rgba(16, 185, 129, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transition: 'all 0.4s ease',
                        }}
                    >
                        {isEmail ? (
                            <EmailOutlinedIcon sx={{ fontSize: 38, color: '#ffffff' }} />
                        ) : (
                            <WhatsAppIcon sx={{ fontSize: 38, color: '#ffffff' }} />
                        )}

                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -4,
                                right: -4,
                                bgcolor: tealDark,
                                border: '2px solid #ffffff',
                                borderRadius: '50%',
                                p: 0.45,
                                display: 'flex',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                            }}
                        >
                            <SecurityIcon sx={{ fontSize: 13, color: '#34d399' }} />
                        </Box>
                    </Box>
                </Box>

                {/* Header Title & Subtitle */}
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontWeight: 900,
                        color: '#0f172a',
                        fontSize: { xs: '1.4rem', sm: '1.65rem' },
                        letterSpacing: '-0.025em',
                        lineHeight: 1.25,
                        mb: 0.8,
                    }}
                >
                    Two-Factor Authentication
                </Typography>

                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.88rem',
                        lineHeight: 1.55,
                        maxWidth: '390px',
                        mx: 'auto',
                        mb: 2,
                    }}
                >
                    {isEmail
                        ? 'Untuk keamanan akun Admin, kode OTP 6-digit telah dikirimkan ke Email Anda:'
                        : 'Untuk keamanan akun Admin, kode OTP 6-digit telah dikirimkan ke WhatsApp Anda:'}
                </Typography>

                {/* Verified Target Pill Badge */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1.2,
                            px: 2.2,
                            py: 0.8,
                            borderRadius: '9999px',
                            background: isEmail
                                ? 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(2, 132, 199, 0.06) 100%)'
                                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(13, 148, 136, 0.06) 100%)',
                            border: isEmail
                                ? '1.5px solid rgba(13, 148, 136, 0.28)'
                                : '1.5px solid rgba(16, 185, 129, 0.28)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        {/* Pulsing Dot */}
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: isEmail ? '#0d9488' : '#10b981',
                                boxShadow: isEmail
                                    ? '0 0 0 2px rgba(13, 148, 136, 0.25)'
                                    : '0 0 0 2px rgba(16, 185, 129, 0.25)',
                            }}
                        />
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: '0.88rem', sm: '0.94rem' },
                                color: isEmail ? '#0f766e' : '#065f46',
                                letterSpacing: '0.03em',
                                fontFamily: "'Outfit', 'Inter', monospace",
                            }}
                        >
                            {isEmail ? (maskedEmail || 'Email Terdaftar') : (maskedPhone || '+62 857-••••-3522')}
                        </Typography>
                    </Box>
                </Box>

                {/* Status & Error Alerts */}
                {status && (
                    <Alert
                        severity="success"
                        sx={{
                            mb: 2.5,
                            borderRadius: '12px',
                            fontSize: '0.84rem',
                            textAlign: 'left',
                            bgcolor: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #bbf7d0',
                        }}
                    >
                        {status}
                    </Alert>
                )}

                {errors.otp && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2.5,
                            borderRadius: '12px',
                            fontSize: '0.84rem',
                            textAlign: 'left',
                        }}
                    >
                        {errors.otp}
                    </Alert>
                )}

                {/* 6-Digit Segmented OTP Input Form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (data.otp.length === 6 && !processing) {
                            post(route('2fa.submit'));
                        }
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: { xs: 0.8, sm: 1.3 },
                            mb: 2.5,
                            mt: 1,
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
                                    width: { xs: 46, sm: 56 },
                                    height: { xs: 54, sm: 64 },
                                    borderRadius: '14px',
                                    border: '2px solid',
                                    borderColor: digit ? tealPrimary : '#e2e8f0',
                                    bgcolor: digit ? 'rgba(13, 148, 136, 0.05)' : '#f8fafc',
                                    textAlign: 'center',
                                    fontSize: { xs: '1.45rem', sm: '1.75rem' },
                                    fontWeight: 800,
                                    fontFamily: "'Outfit', 'Inter', monospace",
                                    color: '#0f172a',
                                    outline: 'none',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: digit ? '0 0 0 3px rgba(13, 148, 136, 0.12)' : 'none',
                                    '&:focus': {
                                        borderColor: tealPrimary,
                                        bgcolor: '#ffffff',
                                        boxShadow: '0 0 0 4px rgba(13, 148, 136, 0.18)',
                                        transform: 'translateY(-2px)',
                                    },
                                    '&:hover:not(:focus)': {
                                        borderColor: digit ? tealPrimary : '#cbd5e1',
                                    },
                                }}
                            />
                        ))}
                    </Box>

                    {/* Expiration Timer Indicator */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.8,
                            mb: 2.5,
                            color: timeLeft > 60 ? '#64748b' : '#ef4444',
                            fontSize: '0.84rem',
                            fontWeight: 600,
                        }}
                    >
                        <TimerOutlinedIcon sx={{ fontSize: 17 }} />
                        {timeLeft > 0 ? (
                            <Typography sx={{ fontSize: '0.84rem', color: 'inherit' }}>
                                Kode kedaluwarsa dalam:{' '}
                                <Box component="span" sx={{ fontWeight: 800, color: timeLeft > 60 ? '#0f172a' : '#ef4444' }}>
                                    {formatTime(timeLeft)}
                                </Box>
                            </Typography>
                        ) : (
                            <Typography sx={{ fontSize: '0.84rem', color: '#ef4444', fontWeight: 700 }}>
                                Kode telah kedaluwarsa. Silakan minta kode baru.
                            </Typography>
                        )}
                    </Box>

                    {/* Primary Verify CTA Button */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={processing || data.otp.length !== 6 || timeLeft <= 0}
                        endIcon={!processing && <LoginIcon sx={{ fontSize: 18 }} />}
                        startIcon={
                            processing ? (
                                <CircularProgress size={18} sx={{ color: 'white' }} />
                            ) : null
                        }
                        sx={{
                            py: 1.45,
                            borderRadius: '14px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.96rem',
                            letterSpacing: '0.01em',
                            background: 'linear-gradient(135deg, #094d42 0%, #0d9488 50%, #10b981 100%)',
                            boxShadow: '0 10px 24px -5px rgba(9, 77, 66, 0.45)',
                            color: '#ffffff',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #0d7a6a 0%, #059669 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 14px 28px -5px rgba(9, 77, 66, 0.55)',
                            },
                            '&:disabled': {
                                background: '#e2e8f0',
                                color: '#94a3b8',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        {processing ? 'Memverifikasi...' : 'Verifikasi & Masuk Dashboard'}
                    </Button>
                </form>

                {/* Alternative Channel Option Card (Email / WhatsApp Switcher) */}
                <Box
                    sx={{
                        mt: 2.8,
                        p: 1.8,
                        borderRadius: '14px',
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center',
                    }}
                >
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 1, fontWeight: 500 }}>
                        {isEmail
                            ? 'Ingin menerima kode verifikasi via WhatsApp?'
                            : 'Tidak menerima kode di WhatsApp atau WA sedang offline?'}
                    </Typography>

                    {isEmail ? (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleSwitchToWhatsApp}
                            disabled={sendingWhatsApp}
                            startIcon={
                                sendingWhatsApp ? (
                                    <CircularProgress size={14} sx={{ color: '#10b981' }} />
                                ) : (
                                    <WhatsAppIcon sx={{ fontSize: 17, color: '#10b981' }} />
                                )
                            }
                            sx={{
                                textTransform: 'none',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                color: '#065f46',
                                borderColor: 'rgba(16, 185, 129, 0.4)',
                                bgcolor: '#ffffff',
                                px: 2,
                                py: 0.6,
                                '&:hover': {
                                    bgcolor: 'rgba(16, 185, 129, 0.08)',
                                    borderColor: '#10b981',
                                },
                            }}
                        >
                            {sendingWhatsApp ? 'Mengirim ke WhatsApp...' : `Kirim Kode via WhatsApp (${maskedPhone || 'WhatsApp'})`}
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleSwitchToEmail}
                            disabled={sendingEmail}
                            startIcon={
                                sendingEmail ? (
                                    <CircularProgress size={14} sx={{ color: tealPrimary }} />
                                ) : (
                                    <EmailOutlinedIcon sx={{ fontSize: 17, color: tealPrimary }} />
                                )
                            }
                            sx={{
                                textTransform: 'none',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                color: '#0f766e',
                                borderColor: 'rgba(13, 148, 136, 0.4)',
                                bgcolor: '#ffffff',
                                px: 2,
                                py: 0.6,
                                '&:hover': {
                                    bgcolor: 'rgba(13, 148, 136, 0.08)',
                                    borderColor: '#0d9488',
                                },
                            }}
                        >
                            {sendingEmail ? 'Mengirim ke Email...' : `Kirim Kode Verifikasi via Email (${maskedEmail || 'Email'})`}
                        </Button>
                    )}
                </Box>

                {/* Resend & Cancel Actions */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mt: 2.5, pt: 0.5 }}
                >
                    <Button
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || resending}
                        startIcon={
                            resending ? (
                                <CircularProgress size={14} sx={{ color: tealPrimary }} />
                            ) : (
                                <ReplayIcon sx={{ fontSize: 17 }} />
                            )
                        }
                        sx={{
                            textTransform: 'none',
                            color: resendCooldown > 0 ? '#94a3b8' : tealPrimary,
                            fontWeight: 600,
                            fontSize: '0.84rem',
                            px: 1.5,
                            py: 0.6,
                            borderRadius: '10px',
                            '&:hover': { bgcolor: alpha(tealPrimary, 0.08) },
                            '&:disabled': { color: '#94a3b8' },
                        }}
                    >
                        {resendCooldown > 0 ? `Kirim Ulang (${resendCooldown}s)` : `Kirim Ulang ${isEmail ? 'Email' : 'OTP'}`}
                    </Button>

                    {/* Clean Vertical Divider */}
                    <Box
                        sx={{
                            width: '1px',
                            height: 18,
                            bgcolor: '#cbd5e1',
                            mx: { xs: 1.5, sm: 2 },
                            flexShrink: 0,
                        }}
                    />

                    <Button
                        onClick={handleCancel}
                        startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            textTransform: 'none',
                            color: '#64748b',
                            fontWeight: 600,
                            fontSize: '0.84rem',
                            px: 1.5,
                            py: 0.6,
                            borderRadius: '10px',
                            '&:hover': { color: '#0f172a', bgcolor: 'rgba(0,0,0,0.04)' },
                        }}
                    >
                        Batal & Keluar
                    </Button>
                </Stack>

                {/* Security Assurance Badge */}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.6,
                        mt: 3,
                        pt: 2,
                        borderTop: '1px solid #f1f5f9',
                        width: '100%',
                        justifyContent: 'center',
                    }}
                >
                    <ShieldOutlinedIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                    <Typography sx={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 500 }}>
                        Enkripsi End-to-End · Proteksi Akun Admin IAGI-GEOSEA 2026
                    </Typography>
                </Box>
            </Box>
        </GuestLayout>
    );
}
