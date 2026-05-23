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
    'professional': { label: 'Professional & IAGI Member', short: 'Professional', color: '#6366f1', lightColor: '#a5b4fc', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' },
    'international': { label: 'International Delegate', short: 'International', color: '#ec4899', lightColor: '#f9a8d4', gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' },
    'student': { label: 'Student', short: 'Student', color: '#0ea5e9', lightColor: '#67e8f9', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)' },
};
const CAT_ICONS = { 'professional': BusinessCenterIcon, 'international': PublicIcon, 'student': SchoolIcon };
function CatIcon({ category, size = 24, color }) {
    const Icon = CAT_ICONS[(category || '').toLowerCase()] || PaymentIcon;
    return <Icon sx={{ fontSize: size, color: color || '#6b7280' }} />;
}

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
                onSuccess: (result) => { setSnackbar({ open: true, message: '✅ Payment successful! Redirecting...', severity: 'success' }); setTimeout(() => router.reload(), 1500); },
                onPending: (result) => { setSnackbar({ open: true, message: '⏳ Payment pending. Complete your payment.', severity: 'info' }); setTimeout(() => router.reload(), 1500); },
                onError: (result) => { setSnackbar({ open: true, message: 'Payment failed: ' + (result?.status_message || 'Unknown error'), severity: 'error' }); setTimeout(() => router.reload(), 2000); },
                onClose: () => { setSnackbar({ open: true, message: 'Payment window closed.', severity: 'info' }); router.reload(); },
            });
        } catch (e) { setSnackbar({ open: true, message: e.message, severity: 'error' }); }
        finally { setPaymentLoading(false); }
    };

    const fmtRp = (n) => { try { return 'Rp ' + parseFloat(n).toLocaleString('id-ID'); } catch { return 'Rp ' + n; } };
    const fmtIdr = (n) => { try { return 'IDR ' + parseFloat(n).toLocaleString('id-ID'); } catch { return 'IDR ' + n; } };

    const getStatusChip = (p) => {
        const isPaid = p.status === 'paid' || p.verified;
        if (isPaid) return <Chip icon={<CheckCircleOutlineIcon sx={{ fontSize: 14 }} />} label="Paid" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', borderRadius: '20px', bgcolor: 'rgba(5,150,105,0.12)', color: '#059669', '.MuiChip-icon': { color: '#059669' } }} />;
        if (p.status === 'failed' || p.status === 'expired') return <Chip label={p.status === 'failed' ? 'Failed' : 'Expired'} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', borderRadius: '20px', bgcolor: 'rgba(220,38,38,0.12)', color: '#dc2626' }} />;
        return <Chip icon={<AccessTimeIcon sx={{ fontSize: 14 }} />} label="Pending" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', borderRadius: '20px', bgcolor: 'rgba(217,119,6,0.12)', color: '#d97706', '.MuiChip-icon': { color: '#d97706' } }} />;
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
    const totalAll = payments.length + submissionsNeedingPayment.length;
    const progressPercent = totalAll > 0 ? Math.round((totalPaid / totalAll) * 100) : 0;
    const totalActionAmount = submissionsNeedingPayment.reduce((sum, sub) => {
        const fee = getSubFee(sub);
        return sum + (fee ? parseFloat(fee) : 0);
    }, 0);

    /* ─── Shared styles ─── */
    const cardBase = {
        borderRadius: '20px',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        bgcolor: isDark ? 'rgba(17,24,39,0.6)' : 'white',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
    };

    return (
        <SidebarLayout>
            <Head title="Payment Center | IAGI-GEOSEA 2026" />
            <Box component="main" role="main" aria-label="Payment Center" sx={{ p: { xs: 2, sm: 3 }, maxWidth: '1320px', mx: 'auto' }}>

                {/* ════════════════════════════════════════════
                    HERO — Dark premium gradient with 3D card
                ════════════════════════════════════════════ */}
                <Fade in={mounted} timeout={600}>
                    <Box sx={{
                        mb: 3, borderRadius: '24px', position: 'relative', overflow: 'hidden',
                        background: 'linear-gradient(135deg, #0a1628 0%, #0d2b3e 30%, #0f3d4a 60%, #134e45 100%)',
                        border: '1px solid rgba(26,188,156,0.08)',
                        p: { xs: 3, md: 4 },
                    }}>
                        {/* Decorative orbs */}
                        <Box sx={{ position: 'absolute', top: '-15%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,188,156,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
                        <Box sx={{ position: 'absolute', bottom: '-10%', left: '5%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
                        {/* Grid overlay */}
                        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

                        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 3, lg: 4 }, alignItems: { lg: 'center' } }}>
                            {/* Left: Title */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography component="h1" sx={{
                                    fontWeight: 900, color: 'white',
                                    fontSize: { xs: '1.6rem', sm: '2rem', lg: '2.3rem' },
                                    letterSpacing: '-0.03em', lineHeight: 1.1, mb: 1.5,
                                }}>
                                    Premium Conference{'\n'}
                                    <Box component="span" sx={{ display: 'block' }}>Payment Center</Box>
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: { xs: '0.82rem', lg: '0.9rem' }, maxWidth: 400, lineHeight: 1.7 }}>
                                    Complete your conference registration fee securely via bank transfer, e-wallet, QRIS, or credit card.
                                </Typography>
                            </Box>

                            {/* Center: 3D Credit Card */}
                            <Fade in={mounted} timeout={900}>
                                <Box sx={{
                                    display: { xs: 'none', md: 'block' }, flexShrink: 0,
                                    perspective: '600px',
                                    '@keyframes cardTilt': {
                                        '0%, 100%': { transform: 'rotateY(-6deg) rotateX(3deg)' },
                                        '50%': { transform: 'rotateY(-2deg) rotateX(1deg) translateY(-4px)' },
                                    },
                                }}>
                                    <Box sx={{
                                        width: 220, height: 135, borderRadius: '16px', p: 2,
                                        background: 'linear-gradient(145deg, #134e45 0%, #0d3b35 50%, #0a2f2a 100%)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                                        animation: 'cardTilt 6s ease-in-out infinite',
                                        transformStyle: 'preserve-3d',
                                        position: 'relative', overflow: 'hidden',
                                        '&::before': {
                                            content: '""', position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
                                            background: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 60%)',
                                        },
                                    }}>
                                        {/* Top row: name + lock */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em' }}>IAGI CONFERENCE</Typography>
                                            <LockIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }} />
                                        </Box>
                                        {/* Chip */}
                                        <Box sx={{ width: 32, height: 24, borderRadius: '5px', background: 'linear-gradient(145deg, #fbbf24, #d97706)', mb: 2, boxShadow: '0 2px 6px rgba(251,191,36,0.25)', position: 'relative', '&::after': { content: '""', position: 'absolute', top: '35%', left: '15%', right: '15%', height: '1px', bgcolor: 'rgba(0,0,0,0.12)' } }} />
                                        {/* Card dots */}
                                        <Box sx={{ display: 'flex', gap: 1.2, mb: 1.5 }}>
                                            {[0,1,2,3].map(g => <Box key={g} sx={{ display: 'flex', gap: 0.3 }}>{[0,1,2,3].map(d => <Box key={d} sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: g < 3 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.5)' }} />)}</Box>)}
                                        </Box>
                                        {/* Valid */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography sx={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>VALID</Typography>
                                                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>12/26</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Fade>

                            {/* Right: Payment Methods + Trust */}
                            <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', gap: 1.5, flexShrink: 0 }}>
                                {/* Payment Methods Card */}
                                <Box sx={{
                                    p: 2, borderRadius: '16px',
                                    bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                                    backdropFilter: 'blur(12px)', minWidth: 200,
                                }}>
                                    <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.2, textAlign: 'center' }}>
                                        Payment Methods
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        {[
                                            { label: 'VISA', bg: '#1a1f71', color: 'white' },
                                            { label: 'MC', bg: '#eb001b', color: 'white', label2: true },
                                            { label: 'QRIS', bg: '#00a651', color: 'white' },
                                        ].map((brand, i) => (
                                            <Box key={i} sx={{
                                                px: 1.5, py: 0.8, borderRadius: '8px',
                                                bgcolor: brand.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                minWidth: 48,
                                                transition: 'transform 0.2s ease',
                                                '&:hover': { transform: 'scale(1.08)' },
                                            }}>
                                                <Typography sx={{ fontSize: '0.62rem', fontWeight: 900, color: brand.color, letterSpacing: brand.label === 'VISA' ? '0.08em' : '0.02em', fontStyle: brand.label === 'VISA' ? 'italic' : 'normal' }}>
                                                    {brand.label}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                                {/* Trust badges */}
                                <Box sx={{ display: 'flex', gap: 0.8, justifyContent: 'center' }}>
                                    {['SSL', 'PCI DSS', 'ISO 27001'].map((label) => (
                                        <Box key={label} sx={{
                                            px: 1, py: 0.5, borderRadius: '8px',
                                            bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                                            textAlign: 'center',
                                        }}>
                                            <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>{label}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                                {/* Progress */}
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography sx={{ fontSize: '0.58rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>Payment Progress</Typography>
                                        <Typography sx={{ fontSize: '0.58rem', fontWeight: 800, color: '#34d399' }}>{progressPercent}%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={progressPercent} sx={{
                                        height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)',
                                        '& .MuiLinearProgress-bar': { borderRadius: 2, background: 'linear-gradient(90deg, #059669, #34d399)' },
                                    }} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Fade>

                {/* ════════════════════════════════════════════
                    MIDDLE ROW — Pricing Cards + Action Required
                ════════════════════════════════════════════ */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: submissionsNeedingPayment.length > 0 ? '1fr 380px' : '1fr' }, gap: 3, mb: 3 }}>
                    {/* Pricing Cards */}
                    <Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: `repeat(${Object.keys(pricing).length || 3}, 1fr)` }, gap: 2 }}>
                            {Object.keys(pricing).map((catKey, idx) => {
                                const amount = pricing[catKey];
                                const cat = CATEGORIES[catKey] || { label: catKey, short: catKey, color: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)' };
                                const isActive = submissionsNeedingPayment.some(s => s.participant_category && s.participant_category.toLowerCase() === catKey);
                                return (
                                    <Fade key={catKey} in={mounted} timeout={500 + idx * 150}>
                                        <Card elevation={0} sx={{
                                            ...cardBase,
                                            position: 'relative',
                                            border: isActive ? `2px solid ${cat.color}` : cardBase.border,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': { transform: 'translateY(-4px)', boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.4)' : '0 16px 48px rgba(0,0,0,0.06)' },
                                        }}>
                                            <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                                {/* Icon */}
                                                <Box sx={{
                                                    width: 52, height: 52, borderRadius: '16px', mx: 'auto', mb: 2,
                                                    background: isDark ? `${cat.color}10` : `${cat.color}08`,
                                                    border: `1px solid ${cat.color}15`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <CatIcon category={catKey} size={24} color={isDark ? cat.lightColor || cat.color : cat.color} />
                                                </Box>
                                                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: c.textPrimary, mb: 2 }}>{cat.label}</Typography>

                                                {/* Active badge */}
                                                {isActive && (
                                                    <Box sx={{ mb: 1.5 }}>
                                                        <Chip label="YOUR SUBMISSION" size="small" sx={{
                                                            fontWeight: 800, fontSize: '0.58rem', borderRadius: '6px',
                                                            bgcolor: `${cat.color}15`, color: cat.color,
                                                            border: `1px solid ${cat.color}25`,
                                                            letterSpacing: '0.05em',
                                                        }} />
                                                    </Box>
                                                )}

                                                {/* Price */}
                                                <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: c.textPrimary, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                                                    {fmtIdr(amount)}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, mt: 0.3 }}>per participant</Typography>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* Action Required Panel */}
                    {submissionsNeedingPayment.length > 0 && (
                        <Fade in={mounted} timeout={800}>
                            <Paper elevation={0} sx={{ ...cardBase, display: 'flex', flexDirection: 'column' }}>
                                {/* Header */}
                                <Box sx={{
                                    px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: c.textPrimary }}>Action Required</Typography>
                                        <Chip label={submissionsNeedingPayment.length} size="small" sx={{
                                            height: 22, fontWeight: 800, fontSize: '0.68rem', borderRadius: '8px',
                                            bgcolor: isDark ? 'rgba(245,158,11,0.1)' : '#fef3c7', color: '#d97706',
                                        }} />
                                    </Box>
                                    {totalActionAmount > 0 && (
                                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: isDark ? '#34d399' : '#059669' }}>{fmtRp(totalActionAmount)}</Typography>
                                    )}
                                </Box>
                                {/* Items */}
                                <Box sx={{ flex: 1, overflow: 'auto' }}>
                                    {submissionsNeedingPayment.map((sub, idx) => {
                                        const fee = getSubFee(sub);
                                        const cat = getSubCat(sub);
                                        return (
                                            <Box key={sub.id} sx={{
                                                px: 3, py: 2.5,
                                                borderBottom: idx < submissionsNeedingPayment.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` : 'none',
                                                transition: 'background 0.2s',
                                                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' },
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    {/* Left: Title + desc */}
                                                    <Box sx={{ minWidth: 0, flex: 1, mr: 2 }}>
                                                        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: c.textPrimary, mb: 0.2 }} noWrap>
                                                            {sub.title} – {cat ? cat.short : ''}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.68rem', color: c.textMuted }} noWrap>
                                                            {sub.title} – {cat ? cat.short : ''} – {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </Typography>
                                                    </Box>
                                                    {/* Right: Price + button */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                                                        {fee && (
                                                            <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: c.textPrimary, display: { xs: 'none', sm: 'block' } }}>{fmtRp(fee)}</Typography>
                                                        )}
                                                        <Button
                                                            variant="contained" size="small"
                                                            onClick={() => handleOpenDialog(sub)} disabled={!fee}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #059669, #10b981)',
                                                                boxShadow: '0 4px 14px rgba(5,150,105,0.25)',
                                                                '&:hover': { background: 'linear-gradient(135deg, #047857, #059669)', boxShadow: '0 6px 20px rgba(5,150,105,0.35)' },
                                                                textTransform: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.78rem', px: 2.5, py: 0.6, whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Pay Now
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Paper>
                        </Fade>
                    )}
                </Box>

                {/* ════════════════════════════════════════════
                    PAYMENT HISTORY
                ════════════════════════════════════════════ */}
                <Paper elevation={0} sx={{ ...cardBase }} role="region" aria-label="Payment History">
                    <Box sx={{
                        px: 3, py: 2.5,
                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                    }}>
                        <Typography component="h2" sx={{ fontWeight: 800, fontSize: '1.05rem', color: c.textPrimary }}>Payment History</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: c.textMuted }}>{payments.length > 0 ? `${payments.length} transaction${payments.length > 1 ? 's' : ''} recorded` : 'No transactions yet'}</Typography>
                    </Box>

                    {payments.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
                            <Box sx={{ width: 80, height: 80, borderRadius: '24px', mx: 'auto', mb: 3, bgcolor: isDark ? 'rgba(26,188,156,0.04)' : '#f0fdf9', border: `2px dashed ${isDark ? 'rgba(26,188,156,0.1)' : '#a7f3d0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ReceiptLongIcon sx={{ color: isDark ? 'rgba(26,188,156,0.2)' : '#86efac', fontSize: 36 }} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '1.1rem', mb: 0.5 }}>No Transactions Yet</Typography>
                            <Typography sx={{ color: c.textMuted, fontSize: '0.85rem' }}>Your payment history will appear here.</Typography>
                        </Box>
                    ) : (
                        <React.Fragment>
                            {/* Desktop Table */}
                            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {['Submission', 'Category', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                                                    <TableCell key={h} sx={{
                                                        fontWeight: 700, fontSize: '0.67rem', color: c.textMuted, textTransform: 'uppercase',
                                                        letterSpacing: '0.1em', py: 1.5,
                                                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                                                        bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#fafafa',
                                                    }}>{h}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {payments.map((p) => {
                                                const pCatKey = (p.submission?.participant_category || '').toLowerCase();
                                                const pCat = CATEGORIES[pCatKey] || null;
                                                return (
                                                    <TableRow key={p.id} sx={{
                                                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' },
                                                        '&:last-child td': { borderBottom: 'none' },
                                                        '& td': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}`, py: 2, color: c.textSecondary },
                                                    }}>
                                                        <TableCell><Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: c.textPrimary }} noWrap>{p.submission?.title || '—'}</Typography></TableCell>
                                                        <TableCell><Typography sx={{ fontSize: '0.82rem' }}>{pCat ? pCat.short : '—'}</Typography></TableCell>
                                                        <TableCell><Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: isDark ? '#34d399' : '#059669', fontVariantNumeric: 'tabular-nums' }}>{p.amount ? fmtRp(p.amount) : '—'}</Typography></TableCell>
                                                        <TableCell><Typography sx={{ fontSize: '0.82rem' }}>{getMethod(p)}</Typography></TableCell>
                                                        <TableCell>{getStatusChip(p)}</TableCell>
                                                        <TableCell><Typography sx={{ fontSize: '0.8rem', color: c.textMuted }}>{(p.paid_at || p.created_at) ? new Date(p.paid_at || p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</Typography></TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            {/* Mobile Cards */}
                            <Box sx={{ display: { xs: 'block', lg: 'none' }, p: 2 }}>
                                <Stack spacing={1.5}>
                                    {payments.map((p) => {
                                        const pCat = CATEGORIES[(p.submission?.participant_category || '').toLowerCase()] || null;
                                        return (
                                            <Card key={p.id} elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`, bgcolor: isDark ? 'rgba(17,24,39,0.5)' : '#fafafa' }}>
                                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: isDark ? '#34d399' : '#059669' }}>{p.amount ? fmtRp(p.amount) : '—'}</Typography>
                                                        {getStatusChip(p)}
                                                    </Box>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: c.textPrimary, mb: 0.5 }} noWrap>{p.submission?.title || '—'}</Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography sx={{ fontSize: '0.72rem', color: c.textMuted }}>{pCat ? pCat.short : '—'} · {getMethod(p)}</Typography>
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

            {/* ════════════════════════════════════════════
                CHECKOUT DIALOG
            ════════════════════════════════════════════ */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', bgcolor: isDark ? 'rgba(17,24,39,0.95)' : 'white', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` } }}
            >
                <Box sx={{
                    px: 3.5, py: 3.5, position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #064e3b, #065f46, #047857)',
                }}>
                    <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.2, py: 0.3, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)', mb: 1.5 }}>
                                <LockIcon sx={{ fontSize: 11, color: 'white' }} />
                                <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Payment</Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.3rem', color: 'white' }}>Checkout</Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.08)' } }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
                <DialogContent sx={{ p: 3 }}>
                    {selectedSubmission && (
                        <>
                            <Box sx={{ mb: 2.5, p: 2, borderRadius: '14px', bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f9fafb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` }}>
                                <Typography sx={{ fontSize: '0.58rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, mb: 0.3 }}>Paper</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: c.textPrimary }}>{selectedSubmission.title}</Typography>
                            </Box>
                            <Box sx={{ p: 2.5, borderRadius: '16px', mb: 2.5, bgcolor: isDark ? 'rgba(5,150,105,0.04)' : '#f0fdf4', border: `1px solid ${isDark ? 'rgba(5,150,105,0.1)' : '#d1fae5'}` }}>
                                {[
                                    { label: 'Category', value: selCat?.label || selectedSubmission.participant_category || '—' },
                                    { label: 'Participant', value: user?.name || '—' },
                                    { label: 'Fee', value: selFee ? fmtRp(selFee) : '—' },
                                ].map(row => (
                                    <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.2 }}>
                                        <Typography sx={{ fontSize: '0.82rem', color: c.textMuted }}>{row.label}</Typography>
                                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: c.textPrimary }}>{row.value}</Typography>
                                    </Box>
                                ))}
                                <Divider sx={{ my: 1.5, borderColor: isDark ? 'rgba(5,150,105,0.08)' : '#d1fae5', borderStyle: 'dashed' }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 800, color: c.textPrimary }}>Total</Typography>
                                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: isDark ? '#34d399' : '#059669' }}>{selFee ? fmtRp(selFee) : '—'}</Typography>
                                </Box>
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={handleCloseDialog} disabled={paymentLoading} sx={{ color: c.textMuted, textTransform: 'none', fontWeight: 600, borderRadius: '12px', px: 3 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleMidtransPayment} disabled={paymentLoading || !selFee}
                        startIcon={paymentLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <LockIcon sx={{ fontSize: 15 }} />}
                        sx={{
                            background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 6px 20px rgba(5,150,105,0.3)',
                            '&:hover': { boxShadow: '0 10px 30px rgba(5,150,105,0.4)' },
                            '&:disabled': { background: isDark ? '#1f2937' : '#e5e7eb', boxShadow: 'none' },
                            textTransform: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', px: 3.5, py: 1.2,
                        }}
                    >
                        {paymentLoading ? 'Processing...' : ('Pay ' + (selFee ? fmtRp(selFee) : ''))}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}>{snackbar.message}</Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
