import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Dialog, DialogContent,
    DialogActions, IconButton, Stack, Card, CardContent, useTheme,
    CircularProgress, Snackbar, Alert, Divider, LinearProgress, Tooltip,
    Fade, Zoom,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PublicIcon from '@mui/icons-material/Public';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockIcon from '@mui/icons-material/Lock';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';

/* ─── Category config ─── */
const CATEGORIES = {
    'professional': {
        label: 'Professional & IAGI Member',
        short: 'Professional',
        desc: 'For IAGI-registered professionals',
        color: '#6366f1',
        lightColor: '#a5b4fc',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        bgGlow: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
    },
    'international': {
        label: 'International Delegate',
        short: 'International',
        desc: 'For non-IAGI international participants',
        color: '#ec4899',
        lightColor: '#f9a8d4',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        bgGlow: 'radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.12) 0%, transparent 70%)',
    },
    'student': {
        label: 'Student',
        short: 'Student',
        desc: 'For active university students',
        color: '#0ea5e9',
        lightColor: '#67e8f9',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
        bgGlow: 'radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.12) 0%, transparent 70%)',
    },
};

const CAT_ICONS = { 'professional': BusinessCenterIcon, 'international': PublicIcon, 'student': SchoolIcon };

function CatIcon({ category, size = 24, color }) {
    const Icon = CAT_ICONS[(category || '').toLowerCase()] || PaymentIcon;
    return <Icon sx={{ fontSize: size, color: color || '#6b7280' }} />;
}

/* ─── Animated counter ─── */
function AnimatedCount({ target }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (target === 0) { setCount(0); return; }
        let start = 0;
        const step = Math.max(1, Math.ceil(target / 20));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
        }, 40);
        return () => clearInterval(timer);
    }, [target]);
    return <>{count}</>;
}

/* ─── Glowing orb background ─── */
const GlowOrb = ({ size, color, top, left, right, bottom, blur = 80 }) => (
    <Box sx={{
        position: 'absolute', width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`, pointerEvents: 'none', opacity: 0.5,
        top, left, right, bottom,
    }} />
);

export default function Index({ payments = [], submissions = [], midtrans_client_key, pricing: rawPricing = {} }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const { auth } = usePage().props;
    const user = auth?.user;

    const pricing = {};
    if (rawPricing && typeof rawPricing === 'object') {
        Object.keys(rawPricing).forEach(k => { pricing[k.toLowerCase()] = rawPricing[k]; });
    }

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const getSubFee = (sub) => (!sub || !sub.participant_category) ? null : (pricing[sub.participant_category.toLowerCase()] || null);
    const getSubCat = (sub) => (!sub || !sub.participant_category) ? null : (CATEGORIES[sub.participant_category.toLowerCase()] || null);

    const submissionsNeedingPayment = submissions.filter(sub => {
        const payment = payments.find(p => p.submission_id === sub.id);
        const isAccepted = sub.status && sub.status.toLowerCase() === 'accepted';
        return isAccepted && (!payment || (!payment.verified && payment.status !== 'paid'));
    });

    const handleOpenDialog = (sub) => { setSelectedSubmission(sub); setOpenDialog(true); };
    const handleCloseDialog = () => { setOpenDialog(false); setSelectedSubmission(null); };

    const waitForSnap = () => new Promise((resolve, reject) => {
        if (window.snap) return resolve(window.snap);
        let tries = 0;
        const interval = setInterval(() => {
            if (window.snap) { clearInterval(interval); resolve(window.snap); }
            if (++tries > 50) { clearInterval(interval); reject(new Error('Midtrans Snap failed to load. Please refresh.')); }
        }, 200);
    });

    const handleMidtransPayment = async () => {
        if (!selectedSubmission) return;
        const fee = getSubFee(selectedSubmission);
        if (!fee) { setSnackbar({ open: true, message: 'Fee not determined. Check category.', severity: 'warning' }); return; }
        setPaymentLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(route('payments.createSnapToken'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
                body: JSON.stringify({ submission_id: selectedSubmission.id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Payment failed');
            handleCloseDialog();
            const snap = await waitForSnap();
            snap.pay(data.snap_token, {
                onSuccess: (result) => { console.log('Midtrans success:', result); setSnackbar({ open: true, message: '✅ Payment successful! Redirecting...', severity: 'success' }); setTimeout(() => router.reload(), 1500); },
                onPending: (result) => { console.log('Midtrans pending:', result); setSnackbar({ open: true, message: '⏳ Payment pending. Complete your payment.', severity: 'info' }); setTimeout(() => router.reload(), 1500); },
                onError: (result) => { console.error('Midtrans error:', result); setSnackbar({ open: true, message: 'Payment failed: ' + (result?.status_message || 'Unknown error'), severity: 'error' }); setTimeout(() => router.reload(), 2000); },
                onClose: () => { setSnackbar({ open: true, message: 'Payment window closed.', severity: 'info' }); router.reload(); },
            });
        } catch (e) { console.error('Payment error:', e); setSnackbar({ open: true, message: e.message, severity: 'error' }); }
        finally { setPaymentLoading(false); }
    };

    const fmtRp = (n) => { try { return 'Rp ' + parseFloat(n).toLocaleString('id-ID'); } catch { return 'Rp ' + n; } };

    const getStatusChip = (p) => {
        const isPaid = p.status === 'paid' || p.verified;
        if (isPaid) return <Chip icon={<CheckCircleOutlineIcon sx={{ fontSize: 14 }} />} label="Paid" size="small" sx={{ fontWeight: 700, fontSize: '0.68rem', borderRadius: '20px', bgcolor: isDark ? 'rgba(5,150,105,0.15)' : '#ecfdf5', color: '#059669', '.MuiChip-icon': { color: '#059669' } }} />;
        if (p.status === 'failed' || p.status === 'expired') return <Chip label={p.status === 'failed' ? 'Failed' : 'Expired'} size="small" sx={{ fontWeight: 700, fontSize: '0.68rem', borderRadius: '20px', bgcolor: isDark ? 'rgba(220,38,38,0.15)' : '#fef2f2', color: '#dc2626' }} />;
        return <Chip icon={<AccessTimeIcon sx={{ fontSize: 14 }} />} label="Pending" size="small" sx={{ fontWeight: 700, fontSize: '0.68rem', borderRadius: '20px', bgcolor: isDark ? 'rgba(217,119,6,0.15)' : '#fffbeb', color: '#d97706', '.MuiChip-icon': { color: '#d97706' } }} />;
    };

    const getMethod = (p) => {
        if (!p.order_id) return 'Manual Upload';
        const map = { bank_transfer: 'Bank Transfer', gopay: 'GoPay', shopeepay: 'ShopeePay', qris: 'QRIS', credit_card: 'Credit Card', cstore: 'Minimarket', echannel: 'Mandiri Bill' };
        return map[p.payment_type] || 'Midtrans';
    };

    const selFee = selectedSubmission ? getSubFee(selectedSubmission) : null;
    const selCat = selectedSubmission ? getSubCat(selectedSubmission) : null;
    const totalPaid = payments.filter(p => p.status === 'paid' || p.verified).length;
    const totalPending = submissionsNeedingPayment.length;
    const totalAll = payments.length;
    const progressPercent = totalAll > 0 ? Math.round((totalPaid / totalAll) * 100) : 0;

    /* ─── Shared card hover style ─── */
    const glassCard = {
        borderRadius: '24px',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        bgcolor: isDark ? 'rgba(17,24,39,0.7)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.5)' : '0 24px 64px rgba(0,0,0,0.08)',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
    };

    return (
        <SidebarLayout>
            <Head title="Payment Center | IAGI-GEOSEA 2026" />
            <Box component="main" role="main" aria-label="Payment Center" sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: '1280px', mx: 'auto' }}>

                {/* ═══════════════════════════════════════════
                    HERO SECTION — Animated gradient + glassmorphism
                ═══════════════════════════════════════════ */}
                <Fade in={mounted} timeout={800}>
                    <Box sx={{
                        mb: 5, p: { xs: 3, sm: 4, md: 5 }, borderRadius: '28px', position: 'relative', overflow: 'hidden',
                        background: isDark
                            ? 'linear-gradient(160deg, #0a0f1a 0%, #0d1f2d 30%, #0a1628 60%, #0f1419 100%)'
                            : 'linear-gradient(160deg, #ecfdf5 0%, #f0fdf4 25%, #eff6ff 50%, #faf5ff 75%, #fff7ed 100%)',
                        border: `1px solid ${isDark ? 'rgba(26,188,156,0.08)' : 'rgba(26,188,156,0.12)'}`,
                        '@keyframes floatOrb': {
                            '0%, 100%': { transform: 'translate(0, 0)' },
                            '33%': { transform: 'translate(15px, -10px)' },
                            '66%': { transform: 'translate(-10px, 8px)' },
                        },
                    }}>
                        {/* Animated decorative orbs */}
                        <GlowOrb size={300} color={isDark ? 'rgba(26,188,156,0.08)' : 'rgba(26,188,156,0.12)'} top="-10%" right="0%" />
                        <GlowOrb size={200} color={isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.08)'} bottom="-5%" left="5%" />
                        <GlowOrb size={150} color={isDark ? 'rgba(236,72,153,0.04)' : 'rgba(236,72,153,0.06)'} top="20%" right="30%" />

                        {/* Subtle grid pattern overlay */}
                        <Box sx={{
                            position: 'absolute', inset: 0, opacity: isDark ? 0.03 : 0.04,
                            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                            backgroundSize: '48px 48px', pointerEvents: 'none',
                        }} />

                        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 6 }, alignItems: { md: 'center' } }}>
                            <Box sx={{ flex: 1 }}>
                                {/* Badge */}
                                <Box sx={{
                                    display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 2, py: 0.6, borderRadius: '24px',
                                    bgcolor: isDark ? 'rgba(26,188,156,0.08)' : 'rgba(26,188,156,0.06)',
                                    border: `1px solid ${isDark ? 'rgba(26,188,156,0.12)' : 'rgba(26,188,156,0.1)'}`,
                                    mb: 2.5, backdropFilter: 'blur(10px)',
                                }}>
                                    <ShieldIcon sx={{ fontSize: 14, color: '#1abc9c' }} />
                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1abc9c', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                        Secure Payment Gateway
                                    </Typography>
                                </Box>

                                <Typography component="h1" sx={{
                                    fontWeight: 900, color: c.textPrimary,
                                    fontSize: { xs: '2rem', sm: '2.6rem', md: '3rem' },
                                    letterSpacing: '-0.04em', lineHeight: 1.05, mb: 1.5,
                                    background: isDark ? 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)' : 'linear-gradient(135deg, #111827 0%, #374151 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                }}>
                                    Payment Center
                                </Typography>
                                <Typography sx={{ color: c.textMuted, fontSize: { xs: '0.88rem', md: '1rem' }, maxWidth: 480, lineHeight: 1.8 }}>
                                    Complete your conference registration fee securely via bank transfer, e-wallet, QRIS, or credit card.
                                </Typography>

                                {/* Trust badges */}
                                <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                                    {[
                                        { icon: VerifiedIcon, label: 'SSL Encrypted' },
                                        { icon: SecurityIcon, label: 'PCI DSS' },
                                        { icon: ShieldIcon, label: 'ISO 27001' },
                                    ].map((badge) => (
                                        <Tooltip key={badge.label} title={badge.label} arrow>
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', gap: 0.5, px: 1.2, py: 0.4,
                                                borderRadius: '8px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                                            }}>
                                                <badge.icon sx={{ fontSize: 12, color: isDark ? '#64748b' : '#94a3b8' }} />
                                                <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: isDark ? '#64748b' : '#94a3b8', letterSpacing: '0.02em' }}>{badge.label}</Typography>
                                            </Box>
                                        </Tooltip>
                                    ))}
                                </Box>
                            </Box>

                            {/* Stats cards */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {[
                                    { icon: AccessTimeIcon, count: totalPending, label: 'Pending', color: '#f59e0b', bg: isDark ? 'rgba(245,158,11,0.06)' : '#fffbeb' },
                                    { icon: CheckCircleOutlineIcon, count: totalPaid, label: 'Completed', color: '#10b981', bg: isDark ? 'rgba(16,185,129,0.06)' : '#ecfdf5' },
                                ].map((stat) => (
                                    <Zoom key={stat.label} in={mounted} timeout={600}>
                                        <Box sx={{
                                            minWidth: 110, p: 2.5, borderRadius: '20px',
                                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'white',
                                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                                            backdropFilter: 'blur(12px)',
                                            textAlign: 'center',
                                            transition: 'all 0.3s ease',
                                            '&:hover': { transform: 'scale(1.05)', boxShadow: `0 12px 36px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)'}` },
                                        }}>
                                            <Box sx={{ width: 36, height: 36, borderRadius: '12px', bgcolor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1 }}>
                                                <stat.icon sx={{ fontSize: 18, color: stat.color }} />
                                            </Box>
                                            <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', color: c.textPrimary, lineHeight: 1 }}>
                                                <AnimatedCount target={stat.count} />
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, fontWeight: 600, mt: 0.3 }}>{stat.label}</Typography>
                                        </Box>
                                    </Zoom>
                                ))}
                            </Box>
                        </Box>

                        {/* Progress bar */}
                        {totalAll > 0 && (
                            <Box sx={{ position: 'relative', zIndex: 1, mt: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: c.textMuted }}>Payment Progress</Typography>
                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: isDark ? '#34d399' : '#059669' }}>{progressPercent}%</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate" value={progressPercent}
                                    sx={{
                                        height: 6, borderRadius: 3,
                                        bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 3,
                                            background: 'linear-gradient(90deg, #059669 0%, #34d399 50%, #10b981 100%)',
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </Fade>

                {/* ═══════════════════════════════════════════
                    PRICING CARDS — Glassmorphism
                ═══════════════════════════════════════════ */}
                <Box sx={{ mb: 5 }} role="region" aria-label="Registration Fees">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Box sx={{ width: 4, height: 28, borderRadius: 2, background: 'linear-gradient(180deg, #059669 0%, #34d399 100%)' }} />
                        <Typography component="h2" sx={{ fontWeight: 800, fontSize: '1.15rem', color: c.textPrimary }}>Registration Fees</Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                        {Object.keys(pricing).map((catKey, idx) => {
                            const amount = pricing[catKey];
                            const cat = CATEGORIES[catKey] || { label: catKey, short: catKey, desc: '', color: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)', bgGlow: '' };
                            const isActive = submissionsNeedingPayment.some(s => s.participant_category && s.participant_category.toLowerCase() === catKey);

                            return (
                                <Fade key={catKey} in={mounted} timeout={600 + idx * 200}>
                                    <Card elevation={0} sx={{
                                        ...glassCard,
                                        position: 'relative', overflow: 'visible',
                                        border: isActive ? `2px solid ${cat.color}` : glassCard.border,
                                        '&:hover': {
                                            ...glassCard['&:hover'],
                                            '& .pricing-glow': { opacity: 1 },
                                        },
                                    }}>
                                        {/* Top glow on hover */}
                                        <Box className="pricing-glow" sx={{
                                            position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                                            background: cat.bgGlow, borderRadius: '24px 24px 0 0',
                                            opacity: 0, transition: 'opacity 0.5s ease', pointerEvents: 'none',
                                        }} />

                                        {/* Top gradient accent */}
                                        <Box sx={{ height: 4, background: cat.gradient, borderRadius: '24px 24px 0 0' }} />

                                        {/* Active badge */}
                                        {isActive && (
                                            <Box sx={{
                                                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', px: 2, py: 0.5, borderRadius: '24px',
                                                background: cat.gradient, zIndex: 2,
                                                boxShadow: `0 4px 16px ${cat.color}40`,
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <StarIcon sx={{ fontSize: 11, color: 'white' }} />
                                                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                                                        Your Submission
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}

                                        <CardContent sx={{ p: 3.5, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                            {/* Icon */}
                                            <Box sx={{
                                                width: 64, height: 64, borderRadius: '20px', mx: 'auto', mb: 2.5,
                                                background: isDark ? `linear-gradient(135deg, ${cat.color}15, ${cat.color}08)` : `linear-gradient(135deg, ${cat.color}10, ${cat.color}05)`,
                                                border: `1px solid ${cat.color}20`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': { transform: 'rotate(5deg) scale(1.05)' },
                                            }}>
                                                <CatIcon category={catKey} size={28} color={isDark ? (cat.lightColor || cat.color) : cat.color} />
                                            </Box>

                                            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: c.textPrimary, mb: 0.5 }}>{cat.label}</Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, mb: 3, lineHeight: 1.5 }}>{cat.desc || 'Registration fee'}</Typography>

                                            {/* Price */}
                                            <Box sx={{
                                                py: 2, px: 2, borderRadius: '16px', mb: 1,
                                                bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}`,
                                            }}>
                                                <Typography component="span" sx={{ fontSize: '0.85rem', fontWeight: 600, color: c.textMuted }}>IDR </Typography>
                                                <Typography component="span" sx={{
                                                    fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.04em',
                                                    color: isActive ? cat.color : c.textPrimary,
                                                    fontVariantNumeric: 'tabular-nums',
                                                }}>
                                                    {parseFloat(amount).toLocaleString('id-ID')}
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: '0.68rem', color: c.textMuted, fontWeight: 500 }}>per participant</Typography>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            );
                        })}
                    </Box>
                </Box>

                {/* ═══════════════════════════════════════════
                    ACTION REQUIRED
                ═══════════════════════════════════════════ */}
                {submissionsNeedingPayment.length > 0 && (
                    <Box sx={{ mb: 5 }} role="region" aria-label="Action Required">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Box sx={{ width: 4, height: 28, borderRadius: 2, background: 'linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%)' }} />
                            <Typography component="h2" sx={{ fontWeight: 800, fontSize: '1.15rem', color: c.textPrimary }}>Action Required</Typography>
                            <Chip label={submissionsNeedingPayment.length} size="small" sx={{
                                height: 22, fontWeight: 800, fontSize: '0.68rem', borderRadius: '8px',
                                bgcolor: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7', color: '#d97706',
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
                            }} />
                        </Box>

                        <Stack spacing={2}>
                            {submissionsNeedingPayment.map((sub, idx) => {
                                const fee = getSubFee(sub);
                                const cat = getSubCat(sub);
                                return (
                                    <Fade key={sub.id} in={mounted} timeout={600 + idx * 150}>
                                        <Paper elevation={0} sx={{
                                            ...glassCard,
                                            overflow: 'hidden', position: 'relative',
                                            '&:hover': {
                                                ...glassCard['&:hover'],
                                                borderColor: cat ? cat.color : '#1abc9c',
                                                '& .action-gradient': { opacity: 1 },
                                            },
                                        }}>
                                            {/* Left accent */}
                                            <Box sx={{
                                                position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                                                background: cat ? cat.gradient : 'linear-gradient(180deg, #1abc9c, #16a085)',
                                            }} />

                                            {/* Hover gradient */}
                                            <Box className="action-gradient" sx={{
                                                position: 'absolute', inset: 0,
                                                background: cat?.bgGlow || 'radial-gradient(ellipse at 0% 50%, rgba(26,188,156,0.05) 0%, transparent 60%)',
                                                opacity: 0, transition: 'opacity 0.5s ease', pointerEvents: 'none',
                                            }} />

                                            <Box sx={{
                                                px: { xs: 2.5, md: 4 }, py: { xs: 2.5, md: 3 },
                                                display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, gap: 2.5,
                                                position: 'relative', zIndex: 1,
                                            }}>
                                                {/* Icon */}
                                                <Box sx={{
                                                    width: 52, height: 52, borderRadius: '16px',
                                                    background: isDark ? 'rgba(26,188,156,0.06)' : 'linear-gradient(135deg, #f0fdf9, #ecfdf5)',
                                                    display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                    border: `1px solid ${isDark ? 'rgba(26,188,156,0.1)' : 'rgba(26,188,156,0.15)'}`,
                                                }}>
                                                    <CatIcon category={sub.participant_category} size={24} color={cat ? cat.color : '#1abc9c'} />
                                                </Box>

                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: c.textPrimary, mb: 0.5 }} noWrap>{sub.title}</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                                        {cat && (
                                                            <Chip label={cat.short} size="small" sx={{
                                                                height: 24, fontWeight: 700, fontSize: '0.65rem', borderRadius: '8px',
                                                                bgcolor: isDark ? `${cat.color}18` : `${cat.color}0a`, color: isDark ? (cat.lightColor || cat.color) : cat.color,
                                                                border: `1px solid ${cat.color}20`,
                                                            }} />
                                                        )}
                                                        <Typography sx={{ fontSize: '0.75rem', color: c.textMuted }}>
                                                            {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                                                    {fee && (
                                                        <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                                                            <Typography sx={{ fontSize: '0.62rem', color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amount</Typography>
                                                            <Typography sx={{ fontSize: '1.15rem', fontWeight: 900, color: isDark ? '#34d399' : '#059669', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{fmtRp(fee)}</Typography>
                                                        </Box>
                                                    )}
                                                    <Button
                                                        variant="contained" endIcon={<ArrowForwardIcon />}
                                                        onClick={() => handleOpenDialog(sub)} disabled={!fee}
                                                        aria-label={`Pay now for ${sub.title}`}
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                                            boxShadow: '0 6px 24px rgba(5,150,105,0.3)',
                                                            '&:hover': { background: 'linear-gradient(135deg, #047857 0%, #059669 100%)', boxShadow: '0 12px 36px rgba(5,150,105,0.4)', transform: 'translateY(-1px)' },
                                                            '&:disabled': { background: isDark ? '#1f2937' : '#e5e7eb', boxShadow: 'none' },
                                                            '&:focus-visible': { outline: '3px solid #059669', outlineOffset: '2px' },
                                                            textTransform: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '0.88rem', px: 3.5, py: 1.3, whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        Pay Now
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Fade>
                                );
                            })}
                        </Stack>
                    </Box>
                )}

                {/* ═══════════════════════════════════════════
                    PAYMENT HISTORY
                ═══════════════════════════════════════════ */}
                <Paper elevation={0} sx={{
                    ...glassCard,
                    overflow: 'hidden',
                }} role="region" aria-label="Payment History">
                    {/* Header */}
                    <Box sx={{
                        px: 3.5, py: 3,
                        display: 'flex', alignItems: 'center', gap: 2,
                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                        background: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.01)',
                    }}>
                        <Box sx={{
                            p: 1, borderRadius: '14px',
                            background: isDark ? 'rgba(26,188,156,0.08)' : 'linear-gradient(135deg, #f0fdf9, #ecfdf5)',
                            border: `1px solid ${isDark ? 'rgba(26,188,156,0.1)' : 'rgba(26,188,156,0.12)'}`,
                            display: 'flex',
                        }}>
                            <ReceiptLongIcon sx={{ color: '#1abc9c', fontSize: 22 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography component="h2" sx={{ fontWeight: 800, fontSize: '1.08rem', color: c.textPrimary, lineHeight: 1.2 }}>Payment History</Typography>
                            <Typography sx={{ fontSize: '0.72rem', color: c.textMuted }}>{payments.length > 0 ? `${payments.length} transaction${payments.length > 1 ? 's' : ''} recorded` : 'No transactions yet'}</Typography>
                        </Box>
                        {totalPaid > 0 && (
                            <Chip icon={<TrendingUpIcon sx={{ fontSize: 14 }} />} label={`${totalPaid} completed`} size="small" sx={{
                                fontWeight: 700, fontSize: '0.68rem', borderRadius: '10px',
                                bgcolor: isDark ? 'rgba(5,150,105,0.12)' : '#ecfdf5', color: '#059669',
                                '.MuiChip-icon': { color: '#059669' },
                            }} />
                        )}
                    </Box>

                    {payments.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: { xs: 10, md: 14 }, px: 3 }}>
                            <Box sx={{
                                width: 100, height: 100, borderRadius: '32px', mx: 'auto', mb: 4,
                                background: isDark ? 'rgba(26,188,156,0.04)' : 'linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)',
                                border: `2px dashed ${isDark ? 'rgba(26,188,156,0.12)' : '#a7f3d0'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <ReceiptLongIcon sx={{ color: isDark ? 'rgba(26,188,156,0.25)' : '#86efac', fontSize: 44 }} />
                            </Box>
                            <Typography sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '1.3rem', mb: 1, letterSpacing: '-0.02em' }}>No Transactions Yet</Typography>
                            <Typography sx={{ color: c.textMuted, fontSize: '0.88rem', maxWidth: 420, mx: 'auto', lineHeight: 1.8 }}>
                                Your payment history will appear here once you complete a registration payment through Midtrans.
                            </Typography>
                        </Box>
                    ) : (
                        <React.Fragment>
                            {/* Desktop Table */}
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {['Submission', 'Category', 'Amount', 'Method', 'Status', 'Date', ''].map((h, i) => (
                                                    <TableCell key={i} sx={{
                                                        fontWeight: 700, fontSize: '0.67rem', color: c.textMuted, textTransform: 'uppercase',
                                                        letterSpacing: '0.1em', py: 1.8,
                                                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                                                        bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(249,250,251,0.8)',
                                                    }}>{h}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {payments.map((p) => {
                                                const pCatKey = (p.submission && p.submission.participant_category) ? p.submission.participant_category.toLowerCase() : '';
                                                const pCat = CATEGORIES[pCatKey] || null;
                                                return (
                                                    <TableRow key={p.id} sx={{
                                                        transition: 'background 0.2s ease',
                                                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' },
                                                        '&:last-child td': { borderBottom: 'none' },
                                                        '& td': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}`, py: 2.2, color: c.textSecondary },
                                                    }}>
                                                        <TableCell><Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: c.textPrimary, maxWidth: 280 }} noWrap>{(p.submission && p.submission.title) || '—'}</Typography></TableCell>
                                                        <TableCell>
                                                            {pCat
                                                                ? <Chip label={pCat.short} size="small" sx={{ height: 24, fontWeight: 700, fontSize: '0.63rem', borderRadius: '8px', bgcolor: isDark ? `${pCat.color}15` : `${pCat.color}0a`, color: isDark ? (pCat.lightColor || pCat.color) : pCat.color, border: `1px solid ${pCat.color}18` }} />
                                                                : <Typography sx={{ fontSize: '0.82rem', color: c.textMuted }}>—</Typography>
                                                            }
                                                        </TableCell>
                                                        <TableCell><Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: isDark ? '#34d399' : '#059669', fontVariantNumeric: 'tabular-nums' }}>{p.amount ? fmtRp(p.amount) : '—'}</Typography></TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                                {p.order_id ? <CreditCardIcon sx={{ fontSize: 14, color: c.textMuted }} /> : <AccountBalanceWalletIcon sx={{ fontSize: 14, color: c.textMuted }} />}
                                                                <Typography sx={{ fontSize: '0.8rem' }}>{getMethod(p)}</Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{getStatusChip(p)}</TableCell>
                                                        <TableCell><Typography sx={{ fontSize: '0.8rem', color: c.textMuted }}>{(p.paid_at || p.created_at) ? new Date(p.paid_at || p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</Typography></TableCell>
                                                        <TableCell align="right">
                                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                                {p.payment_proof_url && (
                                                                    <IconButton size="small" href={'/storage/' + p.payment_proof_url} target="_blank" aria-label="View payment proof" sx={{ color: '#0d7a6a' }}><VisibilityIcon sx={{ fontSize: 16 }} /></IconButton>
                                                                )}
                                                                {p.order_id && (p.status === 'failed' || p.status === 'expired') && (
                                                                    <Button size="small" variant="outlined" onClick={() => { const sub = submissions.find(s => s.id === p.submission_id); if (sub) handleOpenDialog(sub); }}
                                                                        sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', color: c.textPrimary, borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.72rem', px: 1.5, '&:hover': { borderColor: '#059669', color: '#059669' }, '&:focus-visible': { outline: '3px solid #059669', outlineOffset: '2px' } }}>
                                                                        Retry
                                                                    </Button>
                                                                )}
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            {/* Mobile Cards */}
                            <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2.5 }}>
                                <Stack spacing={2}>
                                    {payments.map((p) => {
                                        const pCatKey = (p.submission && p.submission.participant_category) ? p.submission.participant_category.toLowerCase() : '';
                                        const pCat = CATEGORIES[pCatKey] || null;
                                        return (
                                            <Card key={p.id} elevation={0} sx={{
                                                borderRadius: '18px', overflow: 'hidden',
                                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                                                bgcolor: isDark ? 'rgba(17,24,39,0.5)' : 'rgba(255,255,255,0.8)',
                                                backdropFilter: 'blur(12px)',
                                            }}>
                                                <Box sx={{ height: 3, background: pCat ? pCat.gradient : 'linear-gradient(90deg, #1abc9c, #16a085)' }} />
                                                <CardContent sx={{ p: 2.5 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                        <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: isDark ? '#34d399' : '#059669', fontVariantNumeric: 'tabular-nums' }}>{p.amount ? fmtRp(p.amount) : '—'}</Typography>
                                                        {getStatusChip(p)}
                                                    </Box>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: c.textPrimary, mb: 0.8 }}>{(p.submission && p.submission.title) || '—'}</Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {pCat ? <Chip label={pCat.short} size="small" sx={{ height: 22, fontWeight: 700, fontSize: '0.62rem', borderRadius: '6px', bgcolor: isDark ? pCat.color + '15' : pCat.color + '08', color: isDark ? (pCat.lightColor || pCat.color) : pCat.color }} /> : <Box />}
                                                        <Typography sx={{ fontSize: '0.72rem', color: c.textMuted }}>{(p.paid_at || p.created_at) ? new Date(p.paid_at || p.created_at).toLocaleDateString('id-ID') : '—'}</Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        </React.Fragment>
                    )}
                </Paper>
            </Box>

            {/* ═══════════════════════════════════════════
                CHECKOUT DIALOG — Premium glassmorphism
            ═══════════════════════════════════════════ */}
            <Dialog
                open={openDialog} onClose={handleCloseDialog}
                maxWidth="sm" fullWidth
                aria-labelledby="checkout-dialog-title"
                PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', bgcolor: isDark ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(24px)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` } }}
            >
                {/* Dialog header */}
                <Box sx={{
                    px: 3.5, py: 4, position: 'relative', overflow: 'hidden',
                    background: isDark ? 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)' : 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                }}>
                    <GlowOrb size={150} color="rgba(255,255,255,0.06)" top="-30%" right="-10%" blur={40} />
                    <GlowOrb size={100} color="rgba(255,255,255,0.04)" bottom="-20%" left="10%" blur={30} />
                    <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, px: 1.5, py: 0.4, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', mb: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <LockIcon sx={{ fontSize: 12, color: 'white' }} />
                                <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Payment</Typography>
                            </Box>
                            <Typography id="checkout-dialog-title" sx={{ fontWeight: 900, fontSize: '1.4rem', color: 'white', letterSpacing: '-0.02em' }}>Checkout</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', mt: 0.5 }}>Powered by Midtrans</Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} size="small" aria-label="Close checkout" sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <DialogContent sx={{ p: 3.5 }}>
                    {selectedSubmission && (
                        <React.Fragment>
                            {/* Paper info */}
                            <Box sx={{
                                mb: 3, p: 2.5, borderRadius: '16px',
                                bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f9fafb',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                            }}>
                                <Typography sx={{ fontSize: '0.62rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, mb: 0.5 }}>Paper</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: c.textPrimary, lineHeight: 1.5 }}>{selectedSubmission.title}</Typography>
                            </Box>

                            {/* Order summary */}
                            <Box sx={{
                                p: 3, borderRadius: '18px', mb: 3,
                                background: isDark ? 'rgba(5,150,105,0.04)' : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                                border: `1px solid ${isDark ? 'rgba(5,150,105,0.1)' : '#d1fae5'}`,
                            }}>
                                <Typography sx={{ fontSize: '0.67rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, mb: 2.5 }}>Order Summary</Typography>

                                {[
                                    { label: 'Category', value: selCat ? <Chip label={selCat.label} size="small" sx={{ height: 26, fontWeight: 600, fontSize: '0.7rem', borderRadius: '8px', bgcolor: isDark ? selCat.color + '15' : selCat.color + '0a', color: isDark ? (selCat.lightColor || selCat.color) : selCat.color, border: `1px solid ${selCat.color}18` }} /> : selectedSubmission.participant_category || '—' },
                                    { label: 'Participant', value: user ? user.name : '—' },
                                    { label: 'Registration Fee', value: selFee ? fmtRp(selFee) : '—' },
                                ].map((row) => (
                                    <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8 }}>
                                        <Typography sx={{ fontSize: '0.85rem', color: c.textMuted }}>{row.label}</Typography>
                                        {typeof row.value === 'string' ? <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: c.textPrimary }}>{row.value}</Typography> : row.value}
                                    </Box>
                                ))}

                                <Divider sx={{ my: 2.5, borderColor: isDark ? 'rgba(5,150,105,0.08)' : '#d1fae5', borderStyle: 'dashed' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: c.textPrimary }}>Total</Typography>
                                    <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#34d399' : '#059669', letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
                                        {selFee ? fmtRp(selFee) : '—'}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Payment methods */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5 }}>
                                {[
                                    { label: 'Bank VA', icon: AccountBalanceIcon },
                                    { label: 'QRIS', icon: QrCode2Icon },
                                    { label: 'Card', icon: CreditCardIcon },
                                    { label: 'E-Wallet', icon: AccountBalanceWalletIcon },
                                ].map((m) => (
                                    <Tooltip key={m.label} title={m.label} arrow>
                                        <Box sx={{
                                            textAlign: 'center',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': { transform: 'translateY(-2px)' },
                                        }}>
                                            <Box sx={{
                                                width: 46, height: 46, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                                                mx: 'auto', mb: 0.5,
                                                transition: 'all 0.2s ease',
                                                '&:hover': { borderColor: '#059669', bgcolor: isDark ? 'rgba(5,150,105,0.06)' : '#f0fdf4' },
                                            }}>
                                                <m.icon sx={{ fontSize: 18, color: c.textMuted }} />
                                            </Box>
                                            <Typography sx={{ fontSize: '0.62rem', color: c.textMuted, fontWeight: 600 }}>{m.label}</Typography>
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Box>
                        </React.Fragment>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3.5, pb: 3.5, pt: 1, gap: 1.5 }}>
                    <Button onClick={handleCloseDialog} disabled={paymentLoading} sx={{ color: c.textMuted, textTransform: 'none', fontWeight: 600, borderRadius: '14px', px: 3, '&:focus-visible': { outline: '3px solid #059669', outlineOffset: '2px' } }}>Cancel</Button>
                    <Button variant="contained" onClick={handleMidtransPayment} disabled={paymentLoading || !selFee}
                        startIcon={paymentLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <LockIcon sx={{ fontSize: 15 }} />}
                        aria-label={`Pay ${selFee ? fmtRp(selFee) : ''}`}
                        sx={{
                            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                            boxShadow: '0 6px 24px rgba(5,150,105,0.35)',
                            '&:hover': { boxShadow: '0 12px 36px rgba(5,150,105,0.45)', transform: 'translateY(-1px)' },
                            '&:disabled': { background: isDark ? '#1f2937' : '#e5e7eb', color: c.textMuted, boxShadow: 'none' },
                            '&:focus-visible': { outline: '3px solid #059669', outlineOffset: '2px' },
                            textTransform: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '0.92rem', px: 4, py: 1.4,
                        }}
                    >
                        {paymentLoading ? 'Processing...' : ('Pay ' + (selFee ? fmtRp(selFee) : ''))}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '14px', fontWeight: 600, fontSize: '0.88rem', backdropFilter: 'blur(12px)' }}>{snackbar.message}</Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
