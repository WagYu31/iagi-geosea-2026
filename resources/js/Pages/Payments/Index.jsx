import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Dialog, DialogContent,
    DialogActions, IconButton, Stack, Card, CardContent, useTheme,
    CircularProgress, Snackbar, Alert, Divider, Avatar, Tooltip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PublicIcon from '@mui/icons-material/Public';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';

export default function Index({ payments = [], submissions = [], midtrans_client_key, pricing: rawPricing = {} }) {
    // Normalize pricing keys to lowercase to match categoryConfig
    const pricing = Object.fromEntries(
        Object.entries(rawPricing).map(([k, v]) => [k.toLowerCase(), v])
    );
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const { auth } = usePage().props;
    const user = auth?.user;

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const categoryConfig = {
        'professional': {
            label: 'Professional & IAGI Member',
            shortLabel: 'Professional',
            desc: 'For IAGI-registered professionals',
            icon: <BusinessCenterIcon />,
            gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
            softGradient: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)',
            accentBg: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)',
            color: '#6366f1',
            lightColor: '#a5b4fc',
            ring: 'rgba(99,102,241,0.15)',
        },
        'international': {
            label: 'International Delegate',
            shortLabel: 'International',
            desc: 'For non-IAGI international participants',
            icon: <PublicIcon />,
            gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)',
            softGradient: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(244,63,94,0.04) 100%)',
            accentBg: isDark ? 'rgba(236,72,153,0.06)' : 'rgba(236,72,153,0.04)',
            color: '#ec4899',
            lightColor: '#f9a8d4',
            ring: 'rgba(236,72,153,0.15)',
        },
        'student': {
            label: 'Student',
            shortLabel: 'Student',
            desc: 'For active university students',
            icon: <SchoolIcon />,
            gradient: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 50%, #38bdf8 100%)',
            softGradient: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(14,165,233,0.04) 100%)',
            accentBg: isDark ? 'rgba(6,182,212,0.06)' : 'rgba(6,182,212,0.04)',
            color: '#0ea5e9',
            lightColor: '#67e8f9',
            ring: 'rgba(6,182,212,0.15)',
        },
    };

    const getSubmissionFee = (sub) => pricing[(sub?.participant_category || '').toLowerCase()] || null;
    const getSubmissionCatConfig = (sub) => categoryConfig[(sub?.participant_category || '').toLowerCase()] || null;

    const submissionsNeedingPayment = submissions.filter(sub => {
        const payment = payments.find(p => p.submission_id === sub.id);
        const isAccepted = sub.status && sub.status.toLowerCase() === 'accepted';
        return isAccepted && (!payment || (!payment.verified && payment.status !== 'paid'));
    });

    const handleOpenDialog = (submission) => { setSelectedSubmission(submission); setOpenDialog(true); };
    const handleCloseDialog = () => { setOpenDialog(false); setSelectedSubmission(null); };

    const handleMidtransPayment = async () => {
        const fee = getSubmissionFee(selectedSubmission);
        if (!fee) { setSnackbar({ open: true, message: 'Unable to determine fee.', severity: 'warning' }); return; }
        setPaymentLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(route('payments.createSnapToken'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
                body: JSON.stringify({ submission_id: selectedSubmission.id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create payment');
            handleCloseDialog();
            if (window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: () => { setSnackbar({ open: true, message: '🎉 Payment successful!', severity: 'success' }); setTimeout(() => router.reload(), 1500); },
                    onPending: () => { setSnackbar({ open: true, message: '⏳ Payment pending.', severity: 'info' }); setTimeout(() => router.reload(), 1500); },
                    onError: () => { setSnackbar({ open: true, message: '❌ Payment failed.', severity: 'error' }); setTimeout(() => router.reload(), 1500); },
                    onClose: () => { setSnackbar({ open: true, message: 'Payment cancelled.', severity: 'info' }); router.reload(); },
                });
            } else throw new Error('Snap not loaded.');
        } catch (e) { setSnackbar({ open: true, message: e.message, severity: 'error' }); }
        finally { setPaymentLoading(false); }
    };

    const fmtRp = (n) => `Rp ${parseFloat(n).toLocaleString('id-ID')}`;

    const getStatusChip = (p) => {
        const map = {
            paid:    { l: 'Paid',    c: '#059669', bg: isDark ? 'rgba(5,150,105,0.12)' : '#ecfdf5', i: <CheckCircleIcon sx={{ fontSize: 13 }} /> },
            pending: { l: 'Pending', c: '#d97706', bg: isDark ? 'rgba(217,119,6,0.12)' : '#fffbeb', i: <AccessTimeIcon sx={{ fontSize: 13 }} /> },
            failed:  { l: 'Failed',  c: '#dc2626', bg: isDark ? 'rgba(220,38,38,0.12)' : '#fef2f2', i: <ErrorOutlineIcon sx={{ fontSize: 13 }} /> },
            expired: { l: 'Expired', c: '#dc2626', bg: isDark ? 'rgba(220,38,38,0.12)' : '#fef2f2', i: <ErrorOutlineIcon sx={{ fontSize: 13 }} /> },
        };
        if (p.order_id) {
            const s = map[p.status] || map.pending;
            return <Chip icon={s.i} label={s.l} size="small" sx={{ fontWeight: 700, fontSize: '0.62rem', borderRadius: '20px', bgcolor: s.bg, color: s.c, border: `1px solid ${s.c}20`, '& .MuiChip-icon': { color: s.c } }} />;
        }
        const v = p.verified;
        return <Chip icon={v ? <CheckCircleIcon sx={{ fontSize: 13 }}/> : <AccessTimeIcon sx={{ fontSize: 13 }}/>} label={v ? 'Verified' : 'Pending'} size="small" sx={{ fontWeight: 700, fontSize: '0.62rem', borderRadius: '20px', bgcolor: v ? (isDark ? 'rgba(5,150,105,0.12)' : '#ecfdf5') : (isDark ? 'rgba(217,119,6,0.12)' : '#fffbeb'), color: v ? '#059669' : '#d97706', '& .MuiChip-icon': { color: v ? '#059669' : '#d97706' } }} />;
    };

    const getMethod = (p) => {
        if (!p.order_id) return 'Manual';
        return { bank_transfer: 'Bank Transfer', gopay: 'GoPay', shopeepay: 'ShopeePay', qris: 'QRIS', credit_card: 'Credit Card', cstore: 'Minimarket', echannel: 'Mandiri Bill' }[p.payment_type] || 'Midtrans';
    };

    const selFee = selectedSubmission ? getSubmissionFee(selectedSubmission) : null;
    const selCat = selectedSubmission ? getSubmissionCatConfig(selectedSubmission) : null;

    // Stats
    const totalPaid = payments.filter(p => p.status === 'paid' || p.verified).length;
    const totalPending = submissionsNeedingPayment.length;

    return (
        <SidebarLayout>
            <Head title="Payments" />
            <Box component="main" sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: '1280px', mx: 'auto' }}>

                {/* ═══════════════════ HERO ═══════════════════ */}
                <Box sx={{
                    mb: 4, borderRadius: '24px', position: 'relative', overflow: 'hidden',
                    background: isDark
                        ? 'linear-gradient(160deg, #0f1419 0%, #1a2332 40%, #0d2818 100%)'
                        : 'linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 40%, #f0fdfa 60%, #eff6ff 100%)',
                    border: `1px solid ${isDark ? 'rgba(26,188,156,0.1)' : 'rgba(26,188,156,0.15)'}`,
                    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.03)',
                }}>
                    {/* Background decoration */}
                    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                        <Box sx={{ position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(26,188,156,0.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(26,188,156,0.08) 0%, transparent 70%)' }} />
                        <Box sx={{ position: 'absolute', bottom: '10%', left: '10%', width: 200, height: 200, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />
                        {/* Grid pattern */}
                        <Box sx={{ position: 'absolute', inset: 0, opacity: isDark ? 0.03 : 0.04, backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    </Box>

                    <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 3, md: 5 } }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 6 }, alignItems: { md: 'center' } }}>
                            {/* Left: Title */}
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.5, py: 0.5, borderRadius: '20px', bgcolor: isDark ? 'rgba(26,188,156,0.1)' : 'rgba(26,188,156,0.08)', border: `1px solid ${isDark ? 'rgba(26,188,156,0.15)' : 'rgba(26,188,156,0.12)'}`, mb: 2 }}>
                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#1abc9c', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
                                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#1abc9c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        Secure Payment Gateway
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontWeight: 900, color: c.textPrimary, fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' }, letterSpacing: '-0.04em', lineHeight: 1.05, mb: 1 }}>
                                    Payment Center
                                </Typography>
                                <Typography sx={{ color: c.textMuted, fontSize: { xs: '0.85rem', md: '0.95rem' }, maxWidth: 440, lineHeight: 1.7 }}>
                                    Complete your conference registration fee securely via bank transfer, e-wallet, QRIS, or credit card.
                                </Typography>
                            </Box>

                            {/* Right: Quick stats */}
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                {[
                                    { label: 'Pending', value: totalPending, icon: <AccessTimeIcon sx={{ fontSize: 18 }} />, color: '#f59e0b', bg: isDark ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.06)' },
                                    { label: 'Completed', value: totalPaid, icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />, color: '#10b981', bg: isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)' },
                                ].map((s) => (
                                    <Box key={s.label} sx={{
                                        minWidth: 110, p: 2, borderRadius: '16px',
                                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'white',
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.03)',
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                                            <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: s.bg, display: 'flex' }}>
                                                {React.cloneElement(s.icon, { sx: { ...s.icon.props.sx, color: s.color } })}
                                            </Box>
                                        </Box>
                                        <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: c.textPrimary, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</Typography>
                                        <Typography sx={{ fontSize: '0.68rem', color: c.textMuted, fontWeight: 600, mt: 0.3 }}>{s.label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* ═══════════════════ PRICING CARDS ═══════════════════ */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: c.textPrimary, letterSpacing: '-0.01em' }}>Registration Fees</Typography>
                        <Chip label="2026" size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 800, bgcolor: isDark ? 'rgba(26,188,156,0.1)' : '#ecfdf5', color: '#1abc9c', borderRadius: '4px' }} />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                        {Object.entries(pricing).map(([cat, amount]) => {
                            const cfg = categoryConfig[cat] || {};
                            const isActive = submissionsNeedingPayment.some(s => (s.participant_category || '').toLowerCase() === cat);
                            return (
                                <Card key={cat} elevation={0} sx={{
                                    borderRadius: '20px', position: 'relative', overflow: 'visible',
                                    border: isActive ? `2px solid ${cfg.color}` : `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
                                    bgcolor: isDark ? '#111827' : '#fff',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: isActive
                                            ? `0 20px 60px ${cfg.ring}, 0 0 0 1px ${cfg.color}30`
                                            : `0 16px 48px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)'}`,
                                    },
                                    ...(isActive && {
                                        boxShadow: `0 8px 32px ${cfg.ring}`,
                                    }),
                                }}>
                                    {/* Active tag */}
                                    {isActive && (
                                        <Box sx={{
                                            position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                                            px: 1.5, py: 0.4, borderRadius: '20px', background: cfg.gradient,
                                            boxShadow: `0 4px 14px ${cfg.ring}`,
                                            display: 'flex', alignItems: 'center', gap: 0.5, zIndex: 2,
                                        }}>
                                            <StarIcon sx={{ fontSize: 11, color: 'white' }} />
                                            <Typography sx={{ fontSize: '0.58rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                                                Your Submission
                                            </Typography>
                                        </Box>
                                    )}

                                    <CardContent sx={{ p: { xs: 2.5, md: 3 }, textAlign: 'center' }}>
                                        {/* Icon */}
                                        <Box sx={{
                                            width: 56, height: 56, borderRadius: '16px', mx: 'auto', mb: 2,
                                            background: cfg.softGradient,
                                            border: `1px solid ${isDark ? `${cfg.color}15` : `${cfg.color}10`}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': { transform: 'rotate(5deg) scale(1.05)' },
                                        }}>
                                            {cfg.icon ? React.cloneElement(cfg.icon, { sx: { fontSize: 26, color: isDark ? cfg.lightColor : cfg.color } }) : <PaymentIcon sx={{ fontSize: 26, color: c.textMuted }} />}
                                        </Box>

                                        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: c.textPrimary, mb: 0.3, lineHeight: 1.2 }}>
                                            {cfg.label || cat}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, mb: 2.5, lineHeight: 1.4 }}>
                                            {cfg.desc || 'Registration fee'}
                                        </Typography>

                                        {/* Price */}
                                        <Box sx={{ mb: 1 }}>
                                            <Typography component="span" sx={{ fontSize: '0.8rem', fontWeight: 600, color: c.textMuted, verticalAlign: 'super' }}>IDR</Typography>
                                            <Typography component="span" sx={{
                                                fontWeight: 900, fontSize: { xs: '1.6rem', md: '1.8rem' }, letterSpacing: '-0.03em',
                                                color: isActive ? cfg.color : c.textPrimary,
                                                mx: 0.5,
                                            }}>
                                                {parseFloat(amount).toLocaleString('id-ID')}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: '0.65rem', color: c.textMuted, fontWeight: 500 }}>per participant</Typography>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                </Box>

                {/* ═══════════════════ ACTION REQUIRED ═══════════════════ */}
                {submissionsNeedingPayment.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
                            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: c.textPrimary }}>Action Required</Typography>
                            <Chip label={submissionsNeedingPayment.length} size="small" sx={{ height: 20, fontWeight: 800, fontSize: '0.65rem', bgcolor: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7', color: '#d97706', borderRadius: '6px', minWidth: 24 }} />
                        </Box>

                        <Stack spacing={1.5}>
                            {submissionsNeedingPayment.map((sub) => {
                                const fee = getSubmissionFee(sub);
                                const catCfg = getSubmissionCatConfig(sub);
                                return (
                                    <Paper key={sub.id} elevation={0} sx={{
                                        p: 0, borderRadius: '16px', overflow: 'hidden',
                                        border: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
                                        bgcolor: isDark ? '#111827' : '#fff',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            borderColor: catCfg?.color || c.cardBorderHover,
                                            boxShadow: `0 8px 32px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)'}`,
                                            transform: 'translateY(-2px)',
                                        },
                                    }}>
                                        {/* Colored top accent */}
                                        <Box sx={{ height: 3, background: catCfg?.gradient || 'linear-gradient(90deg, #1abc9c, #16a085)' }} />

                                        <Box sx={{
                                            px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 },
                                            display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                                            alignItems: { sm: 'center' }, gap: 2,
                                        }}>
                                            {/* Icon */}
                                            <Box sx={{
                                                width: 44, height: 44, borderRadius: '12px',
                                                background: catCfg?.softGradient || 'rgba(26,188,156,0.06)',
                                                display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            }}>
                                                <DescriptionIcon sx={{ fontSize: 22, color: catCfg?.color || '#1abc9c' }} />
                                            </Box>

                                            {/* Info */}
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: c.textPrimary, lineHeight: 1.3, mb: 0.5 }} noWrap>
                                                    {sub.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                                    {catCfg && (
                                                        <Chip
                                                            icon={catCfg.icon ? React.cloneElement(catCfg.icon, { sx: { fontSize: '12px !important' } }) : undefined}
                                                            label={catCfg.shortLabel}
                                                            size="small"
                                                            sx={{
                                                                height: 22, fontWeight: 700, fontSize: '0.62rem', borderRadius: '6px',
                                                                bgcolor: catCfg.accentBg, color: isDark ? catCfg.lightColor : catCfg.color,
                                                                border: `1px solid ${isDark ? `${catCfg.color}20` : `${catCfg.color}15`}`,
                                                                '& .MuiChip-icon': { color: isDark ? catCfg.lightColor : catCfg.color },
                                                            }}
                                                        />
                                                    )}
                                                    <Typography sx={{ fontSize: '0.75rem', color: c.textMuted }}>
                                                        {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Amount + CTA */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 }, flexShrink: 0 }}>
                                                {fee && (
                                                    <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                                                        <Typography sx={{ fontSize: '0.6rem', color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</Typography>
                                                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: isDark ? '#34d399' : '#059669', fontFamily: '"Inter", system-ui', letterSpacing: '-0.02em' }}>
                                                            {fmtRp(fee)}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                <Button
                                                    variant="contained"
                                                    endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important', transition: 'transform 0.2s', }} />}
                                                    onClick={() => handleOpenDialog(sub)}
                                                    disabled={!fee}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                                                        boxShadow: '0 4px 16px rgba(5,150,105,0.25)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)',
                                                            boxShadow: '0 8px 28px rgba(5,150,105,0.35)',
                                                            transform: 'translateY(-1px)',
                                                            '& .MuiButton-endIcon svg': { transform: 'translateX(3px)' },
                                                        },
                                                        '&:disabled': { background: isDark ? '#1f2937' : '#e5e7eb', boxShadow: 'none' },
                                                        textTransform: 'none', borderRadius: '12px', fontWeight: 700,
                                                        fontSize: '0.85rem', px: 3, py: 1.2, whiteSpace: 'nowrap',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    }}
                                                >
                                                    Pay Now
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    </Box>
                )}

                {/* ═══════════════════ PAYMENT HISTORY ═══════════════════ */}
                <Paper elevation={0} sx={{
                    borderRadius: '20px', overflow: 'hidden',
                    border: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
                    bgcolor: isDark ? '#111827' : '#fff',
                    boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.02)',
                }}>
                    {/* Header */}
                    <Box sx={{
                        px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderBottom: `1px solid ${isDark ? '#1f2937' : '#f3f4f6'}`,
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ p: 0.8, borderRadius: '10px', bgcolor: isDark ? 'rgba(26,188,156,0.08)' : '#f0fdf9', display: 'flex' }}>
                                <ReceiptLongIcon sx={{ color: '#1abc9c', fontSize: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: c.textPrimary, lineHeight: 1.2 }}>Payment History</Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: c.textMuted }}>
                                    {payments.length > 0 ? `${payments.length} transaction${payments.length > 1 ? 's' : ''}` : 'No transactions yet'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {payments.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: { xs: 8, md: 12 }, px: 3 }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
                                {/* Main icon container */}
                                <Box sx={{
                                    width: 96, height: 96, borderRadius: '28px',
                                    background: isDark
                                        ? 'linear-gradient(135deg, rgba(26,188,156,0.06) 0%, rgba(26,188,156,0.02) 100%)'
                                        : 'linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)',
                                    border: `2px dashed ${isDark ? 'rgba(26,188,156,0.15)' : '#a7f3d0'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative',
                                }}>
                                    <ReceiptLongIcon sx={{ color: isDark ? 'rgba(26,188,156,0.3)' : '#86efac', fontSize: 42 }} />
                                </Box>
                                {/* Orbiting icons */}
                                {[
                                    { icon: <CreditCardIcon sx={{ fontSize: 12 }} />, top: -6, right: -6, size: 26 },
                                    { icon: <QrCode2Icon sx={{ fontSize: 10 }} />, bottom: 4, left: -8, size: 22 },
                                    { icon: <AccountBalanceIcon sx={{ fontSize: 10 }} />, top: 12, left: -10, size: 22 },
                                ].map((o, i) => (
                                    <Box key={i} sx={{
                                        position: 'absolute', ...o, width: o.size, height: o.size, borderRadius: '7px',
                                        bgcolor: isDark ? '#1f2937' : 'white',
                                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        '& svg': { color: '#9ca3af' },
                                    }}>{o.icon}</Box>
                                ))}
                            </Box>
                            <Typography sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '1.2rem', mb: 0.8, letterSpacing: '-0.02em' }}>
                                No Transactions Yet
                            </Typography>
                            <Typography sx={{ color: c.textMuted, fontSize: '0.85rem', maxWidth: 400, mx: 'auto', lineHeight: 1.7 }}>
                                Your payment history will appear here once you complete a registration payment through Midtrans.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Desktop */}
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {['Submission', 'Category', 'Amount', 'Method', 'Status', 'Date', ''].map(h => (
                                                    <TableCell key={h} sx={{
                                                        fontWeight: 700, fontSize: '0.65rem', color: c.textMuted,
                                                        textTransform: 'uppercase', letterSpacing: '0.08em',
                                                        py: 1.5, borderBottom: `1px solid ${isDark ? '#1f2937' : '#f3f4f6'}`,
                                                        bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#fafafa',
                                                    }}>{h}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {payments.map((p) => {
                                                const pCat = categoryConfig[(p.submission?.participant_category || '').toLowerCase()];
                                                return (
                                                    <TableRow key={p.id} sx={{
                                                        transition: 'background-color 0.2s ease',
                                                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' },
                                                        '&:last-child td': { borderBottom: 'none' },
                                                        '& td': { borderBottom: `1px solid ${isDark ? '#1f2937' : '#f3f4f6'}`, py: 2, color: c.textSecondary },
                                                    }}>
                                                        <TableCell>
                                                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: c.textPrimary, maxWidth: 280 }} noWrap>{p.submission?.title || '—'}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            {pCat ? (
                                                                <Chip
                                                                    icon={React.cloneElement(pCat.icon, { sx: { fontSize: '12px !important' } })}
                                                                    label={pCat.shortLabel} size="small"
                                                                    sx={{ height: 22, fontWeight: 700, fontSize: '0.6rem', borderRadius: '6px', bgcolor: pCat.accentBg, color: isDark ? pCat.lightColor : pCat.color, '& .MuiChip-icon': { color: isDark ? pCat.lightColor : pCat.color } }} />
                                                            ) : <Typography sx={{ fontSize: '0.8rem', color: c.textMuted }}>—</Typography>}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: isDark ? '#34d399' : '#059669', fontFamily: '"Inter", system-ui', letterSpacing: '-0.01em' }}>
                                                                {p.amount ? fmtRp(p.amount) : '—'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                                                {p.order_id ? <CreditCardIcon sx={{ fontSize: 13, color: c.textMuted }} /> : <CloudUploadIcon sx={{ fontSize: 13, color: c.textMuted }} />}
                                                                <Typography sx={{ fontSize: '0.78rem' }}>{getMethod(p)}</Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{getStatusChip(p)}</TableCell>
                                                        <TableCell>
                                                            <Typography sx={{ fontSize: '0.78rem', color: c.textMuted }}>
                                                                {(p.paid_at || p.created_at) ? new Date(p.paid_at || p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                                {p.payment_proof_url && (
                                                                    <Tooltip title="View Proof"><IconButton size="small" href={`/storage/${p.payment_proof_url}`} target="_blank" sx={{ color: '#0d7a6a', '&:hover': { bgcolor: isDark ? 'rgba(13,122,106,0.1)' : '#f0fdf4' } }}><VisibilityIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                                                )}
                                                                {p.order_id && ['failed', 'expired'].includes(p.status) && (
                                                                    <Button size="small" variant="outlined" onClick={() => { const sub = submissions.find(s => s.id === p.submission_id); if (sub) handleOpenDialog(sub); }}
                                                                        sx={{ borderColor: isDark ? '#1f2937' : '#e5e7eb', color: c.textPrimary, borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.72rem', px: 1.2, '&:hover': { borderColor: '#059669', color: '#059669' } }}>
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

                            {/* Mobile */}
                            <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2 }}>
                                <Stack spacing={1.5}>
                                    {payments.map((p) => {
                                        const pCat = categoryConfig[(p.submission?.participant_category || '').toLowerCase()];
                                        return (
                                            <Card key={p.id} variant="outlined" sx={{ borderRadius: '14px', border: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`, '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.04)' } }}>
                                                <CardContent sx={{ p: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: isDark ? '#34d399' : '#059669' }}>{p.amount ? fmtRp(p.amount) : '—'}</Typography>
                                                        {getStatusChip(p)}
                                                    </Box>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: c.textPrimary, mb: 0.5 }}>{p.submission?.title || '—'}</Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {pCat && <Chip icon={React.cloneElement(pCat.icon, { sx: { fontSize: '11px !important' } })} label={pCat.shortLabel} size="small" sx={{ height: 20, fontWeight: 700, fontSize: '0.6rem', borderRadius: '6px', bgcolor: pCat.accentBg, color: isDark ? pCat.lightColor : pCat.color, '& .MuiChip-icon': { color: isDark ? pCat.lightColor : pCat.color } }} />}
                                                        <Typography sx={{ fontSize: '0.72rem', color: c.textMuted }}>{(p.paid_at || p.created_at) ? new Date(p.paid_at || p.created_at).toLocaleDateString('id-ID') : '—'}</Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        </>
                    )}
                </Paper>
            </Box>

            {/* ═══════════════════ CHECKOUT DIALOG ═══════════════════ */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', bgcolor: isDark ? '#111827' : '#fff', border: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}` } }}>

                {/* Header */}
                <Box sx={{
                    px: 3, py: 3.5, position: 'relative', overflow: 'hidden',
                    background: isDark
                        ? 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)'
                        : 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                }}>
                    <Box sx={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                    <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />

                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, px: 1.2, py: 0.3, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.15)', mb: 1.5, backdropFilter: 'blur(4px)' }}>
                                <LockIcon sx={{ fontSize: 11, color: 'white' }} />
                                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    256-bit Encryption
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.3rem', color: 'white', letterSpacing: '-0.02em' }}>Secure Checkout</Typography>
                            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', mt: 0.3 }}>Powered by Midtrans Payment Gateway</Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <DialogContent sx={{ p: 3 }}>
                    {selectedSubmission && (
                        <>
                            {/* Paper info */}
                            <Box sx={{ mb: 2.5, p: 2, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f9fafb', borderRadius: '14px', border: `1px solid ${isDark ? '#1f2937' : '#f3f4f6'}` }}>
                                <Typography sx={{ fontSize: '0.62rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, mb: 0.5 }}>Paper</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: c.textPrimary, lineHeight: 1.4 }}>{selectedSubmission.title}</Typography>
                            </Box>

                            {/* Order */}
                            <Box sx={{
                                p: 2.5, borderRadius: '14px', mb: 2.5,
                                background: isDark ? 'rgba(5,150,105,0.04)' : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                                border: `1px solid ${isDark ? 'rgba(5,150,105,0.12)' : '#d1fae5'}`,
                            }}>
                                <Typography sx={{ fontSize: '0.65rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, mb: 2 }}>Order Summary</Typography>

                                {/* Category row */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: c.textMuted }}>Category</Typography>
                                    {selCat ? (
                                        <Chip icon={React.cloneElement(selCat.icon, { sx: { fontSize: '13px !important' } })} label={selCat.label} size="small"
                                            sx={{ height: 24, fontWeight: 600, fontSize: '0.68rem', borderRadius: '6px', bgcolor: selCat.accentBg, color: isDark ? selCat.lightColor : selCat.color, '& .MuiChip-icon': { color: isDark ? selCat.lightColor : selCat.color } }} />
                                    ) : <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: c.textPrimary }}>{selectedSubmission.participant_category || '—'}</Typography>}
                                </Box>

                                {/* Participant */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: c.textMuted }}>Participant</Typography>
                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: c.textPrimary }}>{user?.name || '—'}</Typography>
                                </Box>

                                {/* Fee */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: c.textMuted }}>Registration Fee</Typography>
                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: c.textPrimary, fontFamily: '"Inter", system-ui' }}>{selFee ? fmtRp(selFee) : '—'}</Typography>
                                </Box>

                                <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(5,150,105,0.1)' : '#d1fae5', borderStyle: 'dashed' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: c.textPrimary }}>Total</Typography>
                                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: isDark ? '#34d399' : '#059669', fontFamily: '"Inter", system-ui', letterSpacing: '-0.03em' }}>
                                        {selFee ? fmtRp(selFee) : '—'}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Methods */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pt: 0.5 }}>
                                {[
                                    { icon: <AccountBalanceIcon sx={{ fontSize: 16 }} />, label: 'Bank VA' },
                                    { icon: <QrCode2Icon sx={{ fontSize: 16 }} />, label: 'QRIS' },
                                    { icon: <CreditCardIcon sx={{ fontSize: 16 }} />, label: 'Card' },
                                ].map((m) => (
                                    <Tooltip key={m.label} title={m.label}>
                                        <Box sx={{
                                            width: 42, height: 42, borderRadius: '10px', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                                            border: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
                                            transition: 'all 0.2s', cursor: 'default',
                                            '&:hover': { borderColor: '#059669', bgcolor: isDark ? 'rgba(5,150,105,0.06)' : '#f0fdf4' },
                                            '& svg': { color: c.textMuted },
                                        }}>{m.icon}</Box>
                                    </Tooltip>
                                ))}
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1.5 }}>
                    <Button onClick={handleCloseDialog} disabled={paymentLoading}
                        sx={{ color: c.textMuted, textTransform: 'none', fontWeight: 600, borderRadius: '12px', px: 2.5 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleMidtransPayment}
                        disabled={paymentLoading || !selFee}
                        startIcon={paymentLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <LockIcon sx={{ fontSize: 15 }} />}
                        sx={{
                            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                            boxShadow: '0 4px 16px rgba(5,150,105,0.3)',
                            '&:hover': { boxShadow: '0 8px 28px rgba(5,150,105,0.4)', transform: 'translateY(-1px)' },
                            '&:disabled': { background: isDark ? '#1f2937' : '#e5e7eb', color: c.textMuted, boxShadow: 'none' },
                            textTransform: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', px: 3.5, py: 1.3,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        {paymentLoading ? 'Processing...' : `Pay ${selFee ? fmtRp(selFee) : ''}`}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem' }}>{snackbar.message}</Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
