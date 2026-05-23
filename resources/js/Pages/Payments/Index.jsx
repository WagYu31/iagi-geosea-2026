import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, IconButton, Stack, Card, CardContent, useTheme,
    CircularProgress, Snackbar, Alert, Divider, Avatar,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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

export default function Index({ payments = [], submissions = [], midtrans_client_key, pricing = {} }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const { auth } = usePage().props;
    const user = auth?.user;

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const userCategory = user?.category || '';
    const autoAmount = pricing[userCategory] || null;

    // Category config with icons, colors, and labels
    const categoryConfig = {
        'Professional': {
            label: 'Professional & IAGI Member',
            shortLabel: 'Professional',
            icon: <BusinessCenterIcon />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            lightBg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
            darkBg: 'linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(118,75,162,0.12) 100%)',
            color: '#764ba2',
            lightColor: '#8b5cf6',
        },
        'International Delegate': {
            label: 'International Delegate',
            shortLabel: 'International',
            icon: <PublicIcon />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            lightBg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
            darkBg: 'linear-gradient(135deg, rgba(240,147,251,0.12) 0%, rgba(245,87,108,0.12) 100%)',
            color: '#ec4899',
            lightColor: '#f472b6',
        },
        'Student': {
            label: 'Student',
            shortLabel: 'Student',
            icon: <SchoolIcon />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            lightBg: 'linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)',
            darkBg: 'linear-gradient(135deg, rgba(79,172,254,0.12) 0%, rgba(0,242,254,0.12) 100%)',
            color: '#0ea5e9',
            lightColor: '#38bdf8',
        },
    };

    // Get submissions that need payment
    const submissionsNeedingPayment = submissions.filter(sub => {
        const payment = payments.find(p => p.submission_id === sub.id);
        const isAccepted = sub.status && sub.status.toLowerCase() === 'accepted';
        return isAccepted && (!payment || (!payment.verified && payment.status !== 'paid'));
    });

    const handleOpenDialog = (submission) => { setSelectedSubmission(submission); setOpenDialog(true); };
    const handleCloseDialog = () => { setOpenDialog(false); setSelectedSubmission(null); };

    const handleMidtransPayment = async () => {
        if (!autoAmount) {
            setSnackbar({ open: true, message: 'Please set your participant category in Profile first.', severity: 'warning' });
            return;
        }
        setPaymentLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('payments.createSnapToken'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
                body: JSON.stringify({ submission_id: selectedSubmission.id }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create payment');
            handleCloseDialog();
            if (window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: (r) => { setSnackbar({ open: true, message: '🎉 Payment successful!', severity: 'success' }); setTimeout(() => router.reload(), 1500); },
                    onPending: (r) => { setSnackbar({ open: true, message: '⏳ Payment pending. Please complete your payment.', severity: 'info' }); setTimeout(() => router.reload(), 1500); },
                    onError: (r) => { setSnackbar({ open: true, message: '❌ Payment failed. Please try again.', severity: 'error' }); setTimeout(() => router.reload(), 1500); },
                    onClose: () => { setSnackbar({ open: true, message: 'Payment window closed.', severity: 'info' }); router.reload(); },
                });
            } else { throw new Error('Midtrans Snap not loaded. Please refresh.'); }
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'Something went wrong.', severity: 'error' });
        } finally { setPaymentLoading(false); }
    };

    const formatRp = (amount) => `Rp ${parseFloat(amount).toLocaleString('id-ID')}`;

    const getStatusChip = (payment) => {
        if (payment.order_id) {
            const m = { paid: { l: 'Paid', c: '#059669', bg: '#ecfdf5', i: <CheckCircleOutlineIcon sx={{ fontSize: 14 }} /> }, pending: { l: 'Pending', c: '#d97706', bg: '#fffbeb', i: <AccessTimeIcon sx={{ fontSize: 14 }} /> }, failed: { l: 'Failed', c: '#dc2626', bg: '#fef2f2', i: <ErrorOutlineIcon sx={{ fontSize: 14 }} /> }, expired: { l: 'Expired', c: '#dc2626', bg: '#fef2f2', i: <ErrorOutlineIcon sx={{ fontSize: 14 }} /> } };
            const s = m[payment.status] || m.pending;
            return <Chip icon={s.i} label={s.l} size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: '8px', bgcolor: isDark ? `${s.c}18` : s.bg, color: s.c, border: `1px solid ${s.c}30`, '& .MuiChip-icon': { color: s.c } }} />;
        }
        return <Chip label={payment.verified ? 'Verified' : 'Pending'} size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: '8px', bgcolor: payment.verified ? (isDark ? 'rgba(5,150,105,0.15)' : '#ecfdf5') : (isDark ? 'rgba(217,119,6,0.15)' : '#fffbeb'), color: payment.verified ? '#059669' : '#d97706' }} />;
    };

    const getPaymentMethod = (p) => {
        if (p.order_id) { const m = { bank_transfer: 'Bank Transfer', gopay: 'GoPay', shopeepay: 'ShopeePay', qris: 'QRIS', credit_card: 'Credit Card', cstore: 'Minimarket', echannel: 'Mandiri Bill' }; return m[p.payment_type] || p.payment_type || 'Midtrans'; }
        return 'Manual Upload';
    };

    const currentConfig = categoryConfig[userCategory] || {};

    return (
        <SidebarLayout>
            <Head title="Payments" />
            <Box component="main" sx={{ p: { xs: 2, sm: 3, md: 3.5 }, maxWidth: '1200px', margin: '0 auto' }}>

                {/* ─── HERO HEADER ─── */}
                <Box sx={{
                    mb: 4, p: { xs: 2.5, md: 4 }, borderRadius: '20px', position: 'relative', overflow: 'hidden',
                    background: isDark
                        ? 'linear-gradient(135deg, rgba(13,122,106,0.15) 0%, rgba(26,188,156,0.08) 100%)'
                        : 'linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 50%, #f0fdfa 100%)',
                    border: `1px solid ${isDark ? 'rgba(26,188,156,0.15)' : '#d1fae5'}`,
                }}>
                    {/* Decorative circles */}
                    <Box sx={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: isDark ? 'rgba(26,188,156,0.06)' : 'rgba(26,188,156,0.08)', pointerEvents: 'none' }} />
                    <Box sx={{ position: 'absolute', bottom: -20, right: 60, width: 80, height: 80, borderRadius: '50%', background: isDark ? 'rgba(26,188,156,0.04)' : 'rgba(26,188,156,0.05)', pointerEvents: 'none' }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography sx={{ fontWeight: 900, color: c.textPrimary, fontSize: { xs: '1.6rem', sm: '2rem' }, letterSpacing: '-0.03em', lineHeight: 1.1, mb: 0.5 }}>
                            Payment Center
                        </Typography>
                        <Typography sx={{ color: c.textMuted, fontSize: '0.9rem', mb: 3, maxWidth: 500 }}>
                            Complete your registration payment securely through Midtrans payment gateway
                        </Typography>

                        {/* Category & Fee Badge */}
                        {autoAmount && (
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 1.5,
                                px: 2, py: 1.2, borderRadius: '14px',
                                background: isDark ? currentConfig.darkBg : 'white',
                                border: `1px solid ${isDark ? `${currentConfig.color}30` : '#e5e7eb'}`,
                                boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.04)',
                            }}>
                                <Avatar sx={{
                                    width: 36, height: 36, borderRadius: '10px',
                                    background: currentConfig.gradient,
                                    '& svg': { fontSize: 18 },
                                }}>
                                    {currentConfig.icon}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontSize: '0.65rem', color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        Your Category
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: c.textPrimary, lineHeight: 1.2 }}>
                                        {currentConfig.shortLabel} — <span style={{ color: '#1abc9c' }}>{formatRp(autoAmount)}</span>
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* ─── PRICING CARDS ─── */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                    gap: 2, mb: 4,
                }}>
                    {Object.entries(pricing).map(([category, amount]) => {
                        const config = categoryConfig[category] || {};
                        const isActive = userCategory === category;
                        return (
                            <Card key={category} elevation={0} sx={{
                                borderRadius: '18px', position: 'relative', overflow: 'hidden',
                                border: isActive
                                    ? `2px solid ${config.color}`
                                    : `1px solid ${isDark ? '#2a2a2a' : '#e5e7eb'}`,
                                bgcolor: isDark ? '#1a1a1a' : '#fff',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                '&:hover': {
                                    transform: isActive ? 'scale(1.03)' : 'scale(1.01)',
                                    boxShadow: `0 12px 40px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'}`,
                                },
                            }}>
                                {/* Top gradient bar */}
                                <Box sx={{ height: 4, background: config.gradient }} />

                                {/* Active badge */}
                                {isActive && (
                                    <Box sx={{
                                        position: 'absolute', top: 16, right: 16,
                                        px: 1.2, py: 0.3, borderRadius: '6px',
                                        background: config.gradient,
                                        display: 'flex', alignItems: 'center', gap: 0.3,
                                    }}>
                                        <CheckCircleOutlineIcon sx={{ fontSize: 12, color: 'white' }} />
                                        <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Your Plan
                                        </Typography>
                                    </Box>
                                )}

                                <CardContent sx={{ p: 3, pt: 2.5 }}>
                                    {/* Icon */}
                                    <Avatar sx={{
                                        width: 48, height: 48, borderRadius: '14px', mb: 2,
                                        background: isDark ? config.darkBg : config.lightBg,
                                        border: `1px solid ${isDark ? `${config.color}25` : `${config.color}15`}`,
                                        '& svg': { fontSize: 24, color: isDark ? config.lightColor : config.color },
                                    }}>
                                        {config.icon}
                                    </Avatar>

                                    {/* Label */}
                                    <Typography sx={{
                                        fontWeight: 700, fontSize: '0.85rem', color: c.textPrimary, mb: 0.3, lineHeight: 1.3,
                                    }}>
                                        {config.label || category}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.72rem', color: c.textMuted, mb: 2 }}>
                                        Registration fee
                                    </Typography>

                                    {/* Price */}
                                    <Typography sx={{
                                        fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em',
                                        color: isActive ? config.color : c.textPrimary,
                                        fontFamily: '"Inter", monospace',
                                        lineHeight: 1,
                                    }}>
                                        {formatRp(amount)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Box>

                {/* ─── SUBMISSIONS NEEDING PAYMENT ─── */}
                {submissionsNeedingPayment.length > 0 && (
                    <Paper elevation={0} sx={{
                        p: 0, mb: 4, borderRadius: '18px', overflow: 'hidden',
                        border: `1px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#fde68a'}`,
                        bgcolor: isDark ? 'rgba(245,158,11,0.04)' : '#fffdf7',
                    }}>
                        {/* Header bar */}
                        <Box sx={{
                            px: 3, py: 2,
                            background: isDark ? 'rgba(245,158,11,0.08)' : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            borderBottom: `1px solid ${isDark ? 'rgba(245,158,11,0.15)' : '#fde68a'}`,
                        }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: isDark ? '#fbbf24' : '#92400e', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccessTimeIcon sx={{ fontSize: 18 }} />
                                Action Required — {submissionsNeedingPayment.length} submission{submissionsNeedingPayment.length > 1 ? 's' : ''} awaiting payment
                            </Typography>
                        </Box>

                        <Stack spacing={0} divider={<Divider sx={{ borderColor: isDark ? 'rgba(245,158,11,0.1)' : '#fef3c7' }} />}>
                            {submissionsNeedingPayment.map((submission) => (
                                <Box key={submission.id} sx={{
                                    px: 3, py: 2.5,
                                    display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' },
                                    gap: 2, transition: 'all 0.2s ease',
                                    '&:hover': { bgcolor: isDark ? 'rgba(245,158,11,0.03)' : 'rgba(245,158,11,0.03)' },
                                }}>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: c.textPrimary, lineHeight: 1.3, mb: 0.3 }} noWrap>
                                            {submission.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Typography sx={{ fontSize: '0.78rem', color: c.textMuted }}>
                                                {new Date(submission.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </Typography>
                                            {autoAmount && (
                                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1abc9c', fontFamily: 'monospace' }}>
                                                    {formatRp(autoAmount)}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem !important' }} />}
                                        onClick={() => handleOpenDialog(submission)}
                                        disabled={!autoAmount}
                                        sx={{
                                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                            boxShadow: '0 4px 16px rgba(13, 122, 106, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #0a6b5c 0%, #16a085 100%)',
                                                boxShadow: '0 6px 24px rgba(13, 122, 106, 0.4)',
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:disabled': { background: isDark ? '#374151' : '#e5e7eb', color: c.textMuted, boxShadow: 'none' },
                                            textTransform: 'none', borderRadius: '12px', fontWeight: 700,
                                            fontSize: '0.85rem', px: 3, py: 1.2, whiteSpace: 'nowrap',
                                            flexShrink: 0, transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        }}
                                    >
                                        Pay Now
                                    </Button>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                )}

                {/* ─── PAYMENT HISTORY ─── */}
                <Paper elevation={0} sx={{
                    borderRadius: '18px', overflow: 'hidden',
                    border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg,
                }}>
                    <Box sx={{
                        px: 3, py: 2.5,
                        borderBottom: `1px solid ${c.cardBorder}`,
                        display: 'flex', alignItems: 'center', gap: 1.5,
                    }}>
                        <Avatar sx={{
                            width: 32, height: 32, borderRadius: '8px',
                            bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#f0fdf9',
                        }}>
                            <ReceiptLongIcon sx={{ color: '#1abc9c', fontSize: 18 }} />
                        </Avatar>
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: c.textPrimary }}>
                            Payment History
                        </Typography>
                        {payments.length > 0 && (
                            <Chip label={payments.length} size="small" sx={{
                                height: 22, fontWeight: 700, fontSize: '0.7rem',
                                bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5',
                                color: '#1abc9c', borderRadius: '6px',
                            }} />
                        )}
                    </Box>

                    {payments.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 }, px: 3 }}>
                            {/* Empty state illustration */}
                            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3.5 }}>
                                <Box sx={{
                                    width: 100, height: 100, borderRadius: '24px', position: 'relative',
                                    background: isDark
                                        ? 'linear-gradient(135deg, rgba(26,188,156,0.08) 0%, rgba(26,188,156,0.03) 100%)'
                                        : 'linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)',
                                    border: `2px dashed ${isDark ? 'rgba(26,188,156,0.2)' : '#a7f3d0'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    mx: 'auto',
                                }}>
                                    <ReceiptLongIcon sx={{ color: isDark ? 'rgba(26,188,156,0.4)' : '#6ee7b7', fontSize: 40 }} />
                                </Box>
                                {/* Floating mini-icons */}
                                <Box sx={{ position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: '8px', bgcolor: isDark ? '#1a1a1a' : 'white', border: `1px solid ${isDark ? '#333' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                    <CreditCardIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                                </Box>
                                <Box sx={{ position: 'absolute', bottom: -4, left: -10, width: 24, height: 24, borderRadius: '6px', bgcolor: isDark ? '#1a1a1a' : 'white', border: `1px solid ${isDark ? '#333' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                    <QrCode2Icon sx={{ fontSize: 12, color: '#9ca3af' }} />
                                </Box>
                            </Box>

                            <Typography sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '1.15rem', mb: 0.8, letterSpacing: '-0.01em' }}>
                                No Payments Yet
                            </Typography>
                            <Typography sx={{ color: c.textMuted, fontSize: '0.85rem', maxWidth: 420, mx: 'auto', lineHeight: 1.7 }}>
                                Payment will appear here once your abstract is accepted. You'll be able to pay instantly via bank transfer, e-wallet, or QRIS.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {['Submission', 'Amount', 'Method', 'Status', 'Date', ''].map(h => (
                                                    <TableCell key={h} sx={{
                                                        fontWeight: 700, fontSize: '0.7rem', color: c.textMuted,
                                                        textTransform: 'uppercase', letterSpacing: '0.06em',
                                                        py: 1.5, borderBottom: `1px solid ${c.cardBorder}`,
                                                        bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#fafafa',
                                                    }}>{h}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {payments.map((payment) => (
                                                <TableRow key={payment.id} sx={{
                                                    transition: 'background-color 0.15s ease',
                                                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' },
                                                    '&:last-child td': { borderBottom: 'none' },
                                                    '& td': { borderBottom: `1px solid ${c.cardBorder}`, py: 2, fontSize: '0.85rem', color: c.textSecondary },
                                                }}>
                                                    <TableCell>
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: c.textPrimary }}>{payment.submission?.title || 'N/A'}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', fontFamily: '"Inter", monospace', color: '#1abc9c' }}>
                                                            {payment.amount ? formatRp(payment.amount) : 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            {payment.order_id ? <CreditCardIcon sx={{ fontSize: 14, color: '#6b7280' }} /> : <CloudUploadIcon sx={{ fontSize: 14, color: '#6b7280' }} />}
                                                            <Typography sx={{ fontSize: '0.8rem' }}>{getPaymentMethod(payment)}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{getStatusChip(payment)}</TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ fontSize: '0.8rem', color: c.textMuted }}>
                                                            {(payment.paid_at || payment.created_at) ? new Date(payment.paid_at || payment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                            {payment.payment_proof_url && (
                                                                <Button size="small" startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                                                                    href={`/storage/${payment.payment_proof_url}`} target="_blank"
                                                                    sx={{ color: '#0d7a6a', borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', px: 1.5, '&:hover': { bgcolor: isDark ? 'rgba(13,122,106,0.1)' : '#f0fdf4' } }}>
                                                                    Proof
                                                                </Button>
                                                            )}
                                                            {payment.order_id && ['failed', 'expired'].includes(payment.status) && (
                                                                <Button size="small" variant="contained" startIcon={<PaymentIcon sx={{ fontSize: 14 }} />}
                                                                    onClick={() => { const sub = submissions.find(s => s.id === payment.submission_id); if (sub) handleOpenDialog(sub); }}
                                                                    sx={{ background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', px: 1.5, boxShadow: 'none' }}>
                                                                    Retry
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            {/* Mobile Card View */}
                            <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2 }}>
                                <Stack spacing={1.5}>
                                    {payments.map((payment) => (
                                        <Card key={payment.id} variant="outlined" sx={{
                                            borderRadius: '14px', border: `1px solid ${c.cardBorder}`,
                                            transition: 'all 0.2s ease', '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.06)' },
                                        }}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography sx={{ fontWeight: 800, fontFamily: '"Inter", monospace', fontSize: '1rem', color: '#1abc9c' }}>
                                                        {payment.amount ? formatRp(payment.amount) : 'N/A'}
                                                    </Typography>
                                                    {getStatusChip(payment)}
                                                </Box>
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: c.textPrimary, mb: 0.3 }}>{payment.submission?.title || 'N/A'}</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                                    <Typography sx={{ fontSize: '0.75rem', color: c.textMuted }}>{getPaymentMethod(payment)}</Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', color: c.textMuted }}>
                                                        {(payment.paid_at || payment.created_at) ? new Date(payment.paid_at || payment.created_at).toLocaleDateString('id-ID') : '—'}
                                                    </Typography>
                                                </Box>
                                                {payment.order_id && ['failed', 'expired'].includes(payment.status) && (
                                                    <Button size="small" variant="contained" fullWidth endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                                                        onClick={() => { const sub = submissions.find(s => s.id === payment.submission_id); if (sub) handleOpenDialog(sub); }}
                                                        sx={{ background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', py: 0.8, boxShadow: 'none' }}>
                                                        Retry Payment
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </Box>
                        </>
                    )}
                </Paper>
            </Box>

            {/* ─── PAYMENT CONFIRMATION DIALOG ─── */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', bgcolor: c.cardBg, border: `1px solid ${c.cardBorder}` } }}>

                {/* Header */}
                <Box sx={{
                    background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                    px: 3, py: 3, position: 'relative', overflow: 'hidden',
                }}>
                    <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />
                    <Box sx={{ position: 'absolute', bottom: -30, right: 40, width: 60, height: 60, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />

                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <ShieldIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.9)' }} />
                                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>Secure Checkout</Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
                                Your payment is protected by Midtrans
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <DialogContent sx={{ p: 3 }}>
                    {selectedSubmission && (
                        <>
                            {/* Submission */}
                            <Box sx={{ mb: 2.5, p: 2, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f9fafb', borderRadius: '14px', border: `1px solid ${c.cardBorder}` }}>
                                <Typography sx={{ fontSize: '0.65rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, mb: 0.5 }}>Paper Title</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: c.textPrimary, lineHeight: 1.4 }}>{selectedSubmission.title}</Typography>
                            </Box>

                            {/* Order Summary */}
                            <Box sx={{
                                p: 2.5, borderRadius: '14px', mb: 2.5,
                                border: `1px solid ${isDark ? 'rgba(26,188,156,0.15)' : '#d1fae5'}`,
                                bgcolor: isDark ? 'rgba(26,188,156,0.04)' : '#f0fdf9',
                            }}>
                                <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, mb: 2 }}>Order Summary</Typography>

                                {[
                                    { label: 'Participant', value: user?.name || 'N/A' },
                                    { label: 'Category', value: categoryConfig[userCategory]?.label || userCategory || 'Not Set', chip: true },
                                    { label: 'Registration Fee', value: autoAmount ? formatRp(autoAmount) : '—' },
                                ].map((item) => (
                                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
                                        <Typography sx={{ fontSize: '0.82rem', color: c.textMuted }}>{item.label}</Typography>
                                        {item.chip ? (
                                            <Chip label={item.value} size="small" sx={{
                                                fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24,
                                                bgcolor: isDark ? `${currentConfig.color}15` : `${currentConfig.color}10`,
                                                color: isDark ? currentConfig.lightColor : currentConfig.color,
                                            }} />
                                        ) : (
                                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: c.textPrimary }}>{item.value}</Typography>
                                        )}
                                    </Box>
                                ))}

                                <Divider sx={{ my: 1.5, borderColor: isDark ? 'rgba(26,188,156,0.1)' : '#d1fae5' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: c.textPrimary }}>Total</Typography>
                                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: '#1abc9c', fontFamily: '"Inter", monospace', letterSpacing: '-0.02em' }}>
                                        {autoAmount ? formatRp(autoAmount) : '—'}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Payment methods */}
                            <Box sx={{
                                display: 'flex', justifyContent: 'center', gap: { xs: 1.5, sm: 2.5 }, py: 1, flexWrap: 'wrap',
                            }}>
                                {[
                                    { icon: <AccountBalanceIcon sx={{ fontSize: 18 }} />, label: 'Bank VA' },
                                    { icon: <QrCode2Icon sx={{ fontSize: 18 }} />, label: 'QRIS' },
                                    { icon: <CreditCardIcon sx={{ fontSize: 18 }} />, label: 'Card' },
                                    { icon: '💳', label: 'E-Wallet', isEmoji: true },
                                ].map((m) => (
                                    <Box key={m.label} sx={{ textAlign: 'center' }}>
                                        <Avatar sx={{
                                            width: 40, height: 40, borderRadius: '10px', mx: 'auto', mb: 0.5,
                                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                                            border: `1px solid ${isDark ? '#333' : '#e5e7eb'}`,
                                            fontSize: m.isEmoji ? 18 : 'inherit',
                                        }}>
                                            {m.isEmoji ? m.icon : React.cloneElement(m.icon, { sx: { ...m.icon.props.sx, color: c.textMuted } })}
                                        </Avatar>
                                        <Typography sx={{ fontSize: '0.6rem', color: c.textMuted, fontWeight: 600 }}>{m.label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
                    <Button onClick={handleCloseDialog} disabled={paymentLoading}
                        sx={{ color: c.textMuted, textTransform: 'none', fontWeight: 600, borderRadius: '12px', px: 3, fontSize: '0.85rem' }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleMidtransPayment}
                        disabled={paymentLoading || !autoAmount}
                        startIcon={paymentLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <LockIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                            boxShadow: '0 4px 16px rgba(13, 122, 106, 0.3)',
                            '&:hover': { boxShadow: '0 8px 28px rgba(13, 122, 106, 0.4)', transform: 'translateY(-1px)' },
                            '&:disabled': { background: isDark ? '#374151' : '#e5e7eb', color: c.textMuted, boxShadow: 'none' },
                            textTransform: 'none', borderRadius: '12px', fontWeight: 800,
                            fontSize: '0.9rem', px: 3.5, py: 1.3,
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        {paymentLoading ? 'Processing...' : `Pay ${autoAmount ? formatRp(autoAmount) : ''}`}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}>{snackbar.message}</Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
