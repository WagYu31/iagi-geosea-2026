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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// Category config
const CATEGORIES = {
    'professional': {
        label: 'Professional & IAGI Member',
        short: 'Professional',
        desc: 'For IAGI-registered professionals',
        color: '#6366f1',
        lightColor: '#a5b4fc',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
    'international': {
        label: 'International Delegate',
        short: 'International',
        desc: 'For non-IAGI international participants',
        color: '#ec4899',
        lightColor: '#f9a8d4',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    },
    'student': {
        label: 'Student',
        short: 'Student',
        desc: 'For active university students',
        color: '#0ea5e9',
        lightColor: '#67e8f9',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
    },
};

const CAT_ICONS = {
    'professional': BusinessCenterIcon,
    'international': PublicIcon,
    'student': SchoolIcon,
};

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

    // Normalize pricing keys to lowercase
    const pricing = {};
    if (rawPricing && typeof rawPricing === 'object') {
        Object.keys(rawPricing).forEach(k => {
            pricing[k.toLowerCase()] = rawPricing[k];
        });
    }

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const getSubFee = (sub) => {
        if (!sub || !sub.participant_category) return null;
        return pricing[sub.participant_category.toLowerCase()] || null;
    };

    const getSubCat = (sub) => {
        if (!sub || !sub.participant_category) return null;
        return CATEGORIES[sub.participant_category.toLowerCase()] || null;
    };

    const submissionsNeedingPayment = submissions.filter(sub => {
        const payment = payments.find(p => p.submission_id === sub.id);
        const isAccepted = sub.status && sub.status.toLowerCase() === 'accepted';
        return isAccepted && (!payment || (!payment.verified && payment.status !== 'paid'));
    });

    const handleOpenDialog = (sub) => { setSelectedSubmission(sub); setOpenDialog(true); };
    const handleCloseDialog = () => { setOpenDialog(false); setSelectedSubmission(null); };

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
            if (window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: () => { setSnackbar({ open: true, message: 'Payment successful!', severity: 'success' }); setTimeout(() => router.reload(), 1500); },
                    onPending: () => { setSnackbar({ open: true, message: 'Payment pending.', severity: 'info' }); setTimeout(() => router.reload(), 1500); },
                    onError: () => { setSnackbar({ open: true, message: 'Payment failed.', severity: 'error' }); setTimeout(() => router.reload(), 1500); },
                    onClose: () => { setSnackbar({ open: true, message: 'Payment cancelled.', severity: 'info' }); router.reload(); },
                });
            } else throw new Error('Snap not loaded.');
        } catch (e) { setSnackbar({ open: true, message: e.message, severity: 'error' }); }
        finally { setPaymentLoading(false); }
    };

    const fmtRp = (n) => {
        try { return 'Rp ' + parseFloat(n).toLocaleString('id-ID'); }
        catch(e) { return 'Rp ' + n; }
    };

    const getStatusChip = (p) => {
        const isPaid = p.status === 'paid' || p.verified;
        const isPending = p.status === 'pending' || (!p.verified && p.status !== 'failed' && p.status !== 'expired');
        if (isPaid) return <Chip label="Paid" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: '20px', bgcolor: isDark ? 'rgba(5,150,105,0.12)' : '#ecfdf5', color: '#059669' }} />;
        if (p.status === 'failed' || p.status === 'expired') return <Chip label={p.status === 'failed' ? 'Failed' : 'Expired'} size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: '20px', bgcolor: isDark ? 'rgba(220,38,38,0.12)' : '#fef2f2', color: '#dc2626' }} />;
        return <Chip label="Pending" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: '20px', bgcolor: isDark ? 'rgba(217,119,6,0.12)' : '#fffbeb', color: '#d97706' }} />;
    };

    const getMethod = (p) => {
        if (!p.order_id) return 'Manual';
        const map = { bank_transfer: 'Bank Transfer', gopay: 'GoPay', shopeepay: 'ShopeePay', qris: 'QRIS', credit_card: 'Credit Card', cstore: 'Minimarket', echannel: 'Mandiri Bill' };
        return map[p.payment_type] || 'Midtrans';
    };

    const selFee = selectedSubmission ? getSubFee(selectedSubmission) : null;
    const selCat = selectedSubmission ? getSubCat(selectedSubmission) : null;
    const totalPaid = payments.filter(p => p.status === 'paid' || p.verified).length;
    const totalPending = submissionsNeedingPayment.length;

    return (
        <SidebarLayout>
            <Head title="Payments" />
            <Box component="main" sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: '1280px', mx: 'auto' }}>

                {/* ═══ HERO ═══ */}
                <Box sx={{
                    mb: 4, p: { xs: 3, md: 5 }, borderRadius: '24px', position: 'relative', overflow: 'hidden',
                    background: isDark
                        ? 'linear-gradient(160deg, #0f1419 0%, #1a2332 40%, #0d2818 100%)'
                        : 'linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 40%, #f0fdfa 60%, #eff6ff 100%)',
                    border: `1px solid ${isDark ? 'rgba(26,188,156,0.1)' : 'rgba(26,188,156,0.15)'}`,
                }}>
                    {/* Decorative circles */}
                    <Box sx={{ position: 'absolute', top: '10%', right: '5%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,188,156,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <Box sx={{ position: 'absolute', bottom: '10%', left: '10%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 6 }, alignItems: { md: 'center' } }}>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.5, py: 0.5, borderRadius: '20px', bgcolor: isDark ? 'rgba(26,188,156,0.1)' : 'rgba(26,188,156,0.08)', border: `1px solid ${isDark ? 'rgba(26,188,156,0.15)' : 'rgba(26,188,156,0.12)'}`, mb: 2 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#1abc9c' }} />
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

                        {/* Quick stats */}
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Box sx={{ minWidth: 100, p: 2, borderRadius: '16px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'white', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                                <AccessTimeIcon sx={{ fontSize: 18, color: '#f59e0b', mb: 0.5 }} />
                                <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: c.textPrimary, lineHeight: 1 }}>{totalPending}</Typography>
                                <Typography sx={{ fontSize: '0.68rem', color: c.textMuted, fontWeight: 600 }}>Pending</Typography>
                            </Box>
                            <Box sx={{ minWidth: 100, p: 2, borderRadius: '16px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'white', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                                <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#10b981', mb: 0.5 }} />
                                <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: c.textPrimary, lineHeight: 1 }}>{totalPaid}</Typography>
                                <Typography sx={{ fontSize: '0.68rem', color: c.textMuted, fontWeight: 600 }}>Completed</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* ═══ PRICING CARDS ═══ */}
                <Box sx={{ mb: 4 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: c.textPrimary, mb: 2 }}>Registration Fees</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                        {Object.keys(pricing).map((catKey) => {
                            const amount = pricing[catKey];
                            const cat = CATEGORIES[catKey] || { label: catKey, short: catKey, desc: '', color: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)' };
                            const isActive = submissionsNeedingPayment.some(s => s.participant_category && s.participant_category.toLowerCase() === catKey);

                            return (
                                <Card key={catKey} elevation={0} sx={{
                                    borderRadius: '20px', position: 'relative', overflow: 'visible',
                                    border: isActive ? `2px solid ${cat.color}` : `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
                                    bgcolor: isDark ? '#111827' : '#fff',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 16px 48px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)'}` },
                                }}>
                                    {/* Top accent bar */}
                                    <Box sx={{ height: 4, background: cat.gradient, borderRadius: '20px 20px 0 0' }} />

                                    {/* Active badge */}
                                    {isActive && (
                                        <Box sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', px: 1.5, py: 0.4, borderRadius: '20px', background: cat.gradient, zIndex: 2 }}>
                                            <Typography sx={{ fontSize: '0.58rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                                                ★ Your Submission
                                            </Typography>
                                        </Box>
                                    )}

                                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                        <Box sx={{ width: 56, height: 56, borderRadius: '16px', mx: 'auto', mb: 2, bgcolor: isDark ? `${cat.color}10` : `${cat.color}08`, border: `1px solid ${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CatIcon category={catKey} size={26} color={isDark ? (cat.lightColor || cat.color) : cat.color} />
                                        </Box>

                                        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: c.textPrimary, mb: 0.3 }}>{cat.label}</Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, mb: 2.5 }}>{cat.desc || 'Registration fee'}</Typography>

                                        <Box>
                                            <Typography component="span" sx={{ fontSize: '0.8rem', fontWeight: 600, color: c.textMuted }}>IDR </Typography>
                                            <Typography component="span" sx={{ fontWeight: 900, fontSize: '1.8rem', letterSpacing: '-0.03em', color: isActive ? cat.color : c.textPrimary }}>
                                                {parseFloat(amount).toLocaleString('id-ID')}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: '0.65rem', color: c.textMuted, mt: 0.5 }}>per participant</Typography>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                </Box>

                {/* ═══ ACTION REQUIRED ═══ */}
                {submissionsNeedingPayment.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: c.textPrimary }}>Action Required</Typography>
                            <Chip label={submissionsNeedingPayment.length} size="small" sx={{ height: 20, fontWeight: 800, fontSize: '0.65rem', bgcolor: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7', color: '#d97706', borderRadius: '6px' }} />
                        </Box>

                        <Stack spacing={1.5}>
                            {submissionsNeedingPayment.map((sub) => {
                                const fee = getSubFee(sub);
                                const cat = getSubCat(sub);
                                return (
                                    <Paper key={sub.id} elevation={0} sx={{
                                        borderRadius: '16px', overflow: 'hidden',
                                        border: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
                                        bgcolor: isDark ? '#111827' : '#fff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { borderColor: cat ? cat.color : '#1abc9c', boxShadow: `0 8px 32px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)'}`, transform: 'translateY(-2px)' },
                                    }}>
                                        <Box sx={{ height: 3, background: cat ? cat.gradient : 'linear-gradient(90deg, #1abc9c, #16a085)' }} />

                                        <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, gap: 2 }}>
                                            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: isDark ? 'rgba(26,188,156,0.06)' : '#f0fdf9', display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <CatIcon category={sub.participant_category} size={22} color={cat ? cat.color : '#1abc9c'} />
                                            </Box>

                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: c.textPrimary, mb: 0.5 }} noWrap>{sub.title}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                                    {cat && (
                                                        <Chip label={cat.short} size="small" sx={{ height: 22, fontWeight: 700, fontSize: '0.62rem', borderRadius: '6px', bgcolor: isDark ? `${cat.color}15` : `${cat.color}08`, color: isDark ? (cat.lightColor || cat.color) : cat.color }} />
                                                    )}
                                                    <Typography sx={{ fontSize: '0.75rem', color: c.textMuted }}>
                                                        {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                                                {fee && (
                                                    <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                                                        <Typography sx={{ fontSize: '0.6rem', color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</Typography>
                                                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: isDark ? '#34d399' : '#059669', letterSpacing: '-0.02em' }}>{fmtRp(fee)}</Typography>
                                                    </Box>
                                                )}
                                                <Button
                                                    variant="contained"
                                                    endIcon={<ArrowForwardIcon />}
                                                    onClick={() => handleOpenDialog(sub)}
                                                    disabled={!fee}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                                        boxShadow: '0 4px 16px rgba(5,150,105,0.25)',
                                                        '&:hover': { background: 'linear-gradient(135deg, #047857 0%, #059669 100%)', boxShadow: '0 8px 28px rgba(5,150,105,0.35)' },
                                                        '&:disabled': { background: isDark ? '#1f2937' : '#e5e7eb', boxShadow: 'none' },
                                                        textTransform: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', px: 3, py: 1.2, whiteSpace: 'nowrap',
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

                {/* ═══ PAYMENT HISTORY ═══ */}
                <Paper elevation={0} sx={{ borderRadius: '20px', overflow: 'hidden', border: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`, bgcolor: isDark ? '#111827' : '#fff' }}>
                    <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: `1px solid ${isDark ? '#1f2937' : '#f3f4f6'}` }}>
                        <Box sx={{ p: 0.8, borderRadius: '10px', bgcolor: isDark ? 'rgba(26,188,156,0.08)' : '#f0fdf9', display: 'flex' }}>
                            <ReceiptLongIcon sx={{ color: '#1abc9c', fontSize: 20 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: c.textPrimary, lineHeight: 1.2 }}>Payment History</Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: c.textMuted }}>{payments.length > 0 ? `${payments.length} transaction${payments.length > 1 ? 's' : ''}` : 'No transactions yet'}</Typography>
                        </Box>
                    </Box>

                    {payments.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: { xs: 8, md: 12 }, px: 3 }}>
                            <Box sx={{
                                width: 96, height: 96, borderRadius: '28px', mx: 'auto', mb: 4,
                                background: isDark ? 'rgba(26,188,156,0.05)' : 'linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)',
                                border: `2px dashed ${isDark ? 'rgba(26,188,156,0.15)' : '#a7f3d0'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <ReceiptLongIcon sx={{ color: isDark ? 'rgba(26,188,156,0.3)' : '#86efac', fontSize: 42 }} />
                            </Box>
                            <Typography sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '1.2rem', mb: 0.8 }}>No Transactions Yet</Typography>
                            <Typography sx={{ color: c.textMuted, fontSize: '0.85rem', maxWidth: 400, mx: 'auto', lineHeight: 1.7 }}>
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
                                                    <TableCell key={i} sx={{ fontWeight: 700, fontSize: '0.65rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', py: 1.5, borderBottom: `1px solid ${isDark ? '#1f2937' : '#f3f4f6'}`, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#fafafa' }}>{h}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {payments.map((p) => {
                                                const pCatKey = (p.submission && p.submission.participant_category) ? p.submission.participant_category.toLowerCase() : '';
                                                const pCat = CATEGORIES[pCatKey] || null;
                                                return (
                                                    <TableRow key={p.id} sx={{
                                                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' },
                                                        '&:last-child td': { borderBottom: 'none' },
                                                        '& td': { borderBottom: `1px solid ${isDark ? '#1f2937' : '#f3f4f6'}`, py: 2, color: c.textSecondary },
                                                    }}>
                                                        <TableCell><Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: c.textPrimary, maxWidth: 280 }} noWrap>{(p.submission && p.submission.title) || '—'}</Typography></TableCell>
                                                        <TableCell>
                                                            {pCat
                                                                ? <Chip label={pCat.short} size="small" sx={{ height: 22, fontWeight: 700, fontSize: '0.6rem', borderRadius: '6px', bgcolor: isDark ? `${pCat.color}15` : `${pCat.color}08`, color: isDark ? (pCat.lightColor || pCat.color) : pCat.color }} />
                                                                : <Typography sx={{ fontSize: '0.8rem', color: c.textMuted }}>—</Typography>
                                                            }
                                                        </TableCell>
                                                        <TableCell><Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: isDark ? '#34d399' : '#059669' }}>{p.amount ? fmtRp(p.amount) : '—'}</Typography></TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                                                {p.order_id ? <CreditCardIcon sx={{ fontSize: 13, color: c.textMuted }} /> : <CloudUploadIcon sx={{ fontSize: 13, color: c.textMuted }} />}
                                                                <Typography sx={{ fontSize: '0.78rem' }}>{getMethod(p)}</Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{getStatusChip(p)}</TableCell>
                                                        <TableCell><Typography sx={{ fontSize: '0.78rem', color: c.textMuted }}>{(p.paid_at || p.created_at) ? new Date(p.paid_at || p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</Typography></TableCell>
                                                        <TableCell align="right">
                                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                                {p.payment_proof_url && (
                                                                    <IconButton size="small" href={'/storage/' + p.payment_proof_url} target="_blank" sx={{ color: '#0d7a6a' }}><VisibilityIcon sx={{ fontSize: 16 }} /></IconButton>
                                                                )}
                                                                {p.order_id && (p.status === 'failed' || p.status === 'expired') && (
                                                                    <Button size="small" variant="outlined" onClick={() => { var sub = submissions.find(function(s) { return s.id === p.submission_id; }); if (sub) handleOpenDialog(sub); }}
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

                            {/* Mobile Cards */}
                            <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2 }}>
                                <Stack spacing={1.5}>
                                    {payments.map((p) => {
                                        var pCatKey = (p.submission && p.submission.participant_category) ? p.submission.participant_category.toLowerCase() : '';
                                        var pCat = CATEGORIES[pCatKey] || null;
                                        return (
                                            <Card key={p.id} variant="outlined" sx={{ borderRadius: '14px', border: '1px solid ' + (isDark ? '#1f2937' : '#e5e7eb') }}>
                                                <CardContent sx={{ p: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: isDark ? '#34d399' : '#059669' }}>{p.amount ? fmtRp(p.amount) : '—'}</Typography>
                                                        {getStatusChip(p)}
                                                    </Box>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: c.textPrimary, mb: 0.5 }}>{(p.submission && p.submission.title) || '—'}</Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {pCat ? <Chip label={pCat.short} size="small" sx={{ height: 20, fontWeight: 700, fontSize: '0.6rem', borderRadius: '6px', bgcolor: isDark ? pCat.color + '15' : pCat.color + '08', color: isDark ? (pCat.lightColor || pCat.color) : pCat.color }} /> : <Box />}
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

            {/* ═══ CHECKOUT DIALOG ═══ */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', bgcolor: isDark ? '#111827' : '#fff' } }}>
                <Box sx={{ px: 3, py: 3.5, background: isDark ? 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' : 'linear-gradient(135deg, #059669 0%, #34d399 100%)', position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />
                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.2, py: 0.3, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.15)', mb: 1.5 }}>
                                <LockIcon sx={{ fontSize: 11, color: 'white' }} />
                                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Secure Payment</Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.3rem', color: 'white' }}>Checkout</Typography>
                            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', mt: 0.3 }}>Powered by Midtrans</Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <DialogContent sx={{ p: 3 }}>
                    {selectedSubmission && (
                        <React.Fragment>
                            <Box sx={{ mb: 2.5, p: 2, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f9fafb', borderRadius: '14px', border: '1px solid ' + (isDark ? '#1f2937' : '#f3f4f6') }}>
                                <Typography sx={{ fontSize: '0.62rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, mb: 0.5 }}>Paper</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: c.textPrimary, lineHeight: 1.4 }}>{selectedSubmission.title}</Typography>
                            </Box>

                            <Box sx={{ p: 2.5, borderRadius: '14px', mb: 2.5, background: isDark ? 'rgba(5,150,105,0.04)' : '#f0fdf4', border: '1px solid ' + (isDark ? 'rgba(5,150,105,0.12)' : '#d1fae5') }}>
                                <Typography sx={{ fontSize: '0.65rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, mb: 2 }}>Order Summary</Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: c.textMuted }}>Category</Typography>
                                    {selCat
                                        ? <Chip label={selCat.label} size="small" sx={{ height: 24, fontWeight: 600, fontSize: '0.68rem', borderRadius: '6px', bgcolor: isDark ? selCat.color + '15' : selCat.color + '08', color: isDark ? (selCat.lightColor || selCat.color) : selCat.color }} />
                                        : <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: c.textPrimary }}>{selectedSubmission.participant_category || '—'}</Typography>
                                    }
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: c.textMuted }}>Participant</Typography>
                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: c.textPrimary }}>{user ? user.name : '—'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: c.textMuted }}>Registration Fee</Typography>
                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: c.textPrimary }}>{selFee ? fmtRp(selFee) : '—'}</Typography>
                                </Box>

                                <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(5,150,105,0.1)' : '#d1fae5', borderStyle: 'dashed' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: c.textPrimary }}>Total</Typography>
                                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: isDark ? '#34d399' : '#059669', letterSpacing: '-0.03em' }}>
                                        {selFee ? fmtRp(selFee) : '—'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                {[
                                    { label: 'Bank VA', icon: AccountBalanceIcon },
                                    { label: 'QRIS', icon: CreditCardIcon },
                                    { label: 'Card', icon: CreditCardIcon },
                                ].map((m) => (
                                    <Box key={m.label} sx={{ textAlign: 'center' }}>
                                        <Box sx={{ width: 42, height: 42, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb', border: '1px solid ' + (isDark ? '#1f2937' : '#e5e7eb'), mx: 'auto', mb: 0.5 }}>
                                            <m.icon sx={{ fontSize: 16, color: c.textMuted }} />
                                        </Box>
                                        <Typography sx={{ fontSize: '0.6rem', color: c.textMuted, fontWeight: 600 }}>{m.label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </React.Fragment>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1.5 }}>
                    <Button onClick={handleCloseDialog} disabled={paymentLoading} sx={{ color: c.textMuted, textTransform: 'none', fontWeight: 600, borderRadius: '12px', px: 2.5 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleMidtransPayment} disabled={paymentLoading || !selFee}
                        startIcon={paymentLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <LockIcon sx={{ fontSize: 15 }} />}
                        sx={{
                            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                            boxShadow: '0 4px 16px rgba(5,150,105,0.3)',
                            '&:hover': { boxShadow: '0 8px 28px rgba(5,150,105,0.4)' },
                            '&:disabled': { background: isDark ? '#1f2937' : '#e5e7eb', color: c.textMuted, boxShadow: 'none' },
                            textTransform: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', px: 3.5, py: 1.3,
                        }}
                    >
                        {paymentLoading ? 'Processing...' : ('Pay ' + (selFee ? fmtRp(selFee) : ''))}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem' }}>{snackbar.message}</Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
