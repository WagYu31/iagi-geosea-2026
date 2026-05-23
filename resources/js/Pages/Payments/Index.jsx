import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Alert,
    IconButton,
    Stack,
    Card,
    CardContent,
    useTheme,
    CircularProgress,
    Snackbar,
    Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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

    // Auto-determine amount from user category
    const userCategory = user?.category || '';
    const autoAmount = pricing[userCategory] || null;

    // Category display labels
    const categoryLabels = {
        'Professional': 'Professional & IAGI Member',
        'International Delegate': 'International Delegate (Non-IAGI)',
        'Student': 'Student',
    };

    // Get submissions that need payment (accepted but not paid)
    const submissionsNeedingPayment = submissions.filter(sub => {
        const payment = payments.find(p => p.submission_id === sub.id);
        const isAccepted = sub.status && sub.status.toLowerCase() === 'accepted';
        return isAccepted && (!payment || (!payment.verified && payment.status !== 'paid'));
    });

    const handleOpenDialog = (submission) => {
        setSelectedSubmission(submission);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSubmission(null);
    };

    /**
     * Midtrans Snap Payment Flow:
     * 1. Request snap_token from backend (amount auto-determined by category)
     * 2. Open Snap popup using window.snap.pay()
     * 3. Handle success/pending/error/close callbacks
     */
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
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    submission_id: selectedSubmission.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create payment');
            }

            handleCloseDialog();

            if (window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: function (result) {
                        setSnackbar({ open: true, message: '🎉 Payment successful! Your payment has been verified.', severity: 'success' });
                        setTimeout(() => router.reload(), 1500);
                    },
                    onPending: function (result) {
                        setSnackbar({ open: true, message: '⏳ Payment pending. Please complete your payment.', severity: 'info' });
                        setTimeout(() => router.reload(), 1500);
                    },
                    onError: function (result) {
                        setSnackbar({ open: true, message: '❌ Payment failed. Please try again.', severity: 'error' });
                        setTimeout(() => router.reload(), 1500);
                    },
                    onClose: function () {
                        setSnackbar({ open: true, message: 'Payment window closed. You can try again anytime.', severity: 'info' });
                        router.reload();
                    },
                });
            } else {
                throw new Error('Midtrans Snap is not loaded. Please refresh the page.');
            }
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'Something went wrong. Please try again.', severity: 'error' });
        } finally {
            setPaymentLoading(false);
        }
    };

    // Format currency
    const formatRp = (amount) => `Rp ${parseFloat(amount).toLocaleString('id-ID')}`;

    // Status chip styling
    const getStatusChip = (payment) => {
        if (payment.order_id) {
            const statusMap = {
                paid: { label: 'Paid', icon: <CheckCircleOutlineIcon sx={{ fontSize: '0.9rem' }} />, bg: '#ecfdf5', color: '#059669', border: '#d1fae5' },
                pending: { label: 'Pending Payment', icon: <AccessTimeIcon sx={{ fontSize: '0.9rem' }} />, bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
                failed: { label: 'Failed', icon: <ErrorOutlineIcon sx={{ fontSize: '0.9rem' }} />, bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
                expired: { label: 'Expired', icon: <ErrorOutlineIcon sx={{ fontSize: '0.9rem' }} />, bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
                refunded: { label: 'Refunded', icon: <ErrorOutlineIcon sx={{ fontSize: '0.9rem' }} />, bg: '#eff6ff', color: '#2563eb', border: '#dbeafe' },
            };
            const s = statusMap[payment.status] || statusMap.pending;
            return (
                <Chip icon={s.icon} label={s.label} size="small" sx={{
                    fontWeight: 700, fontSize: '0.65rem', borderRadius: '8px',
                    bgcolor: isDark ? `${s.color}18` : s.bg, color: s.color,
                    border: `1px solid ${isDark ? `${s.color}30` : s.border}`,
                    '& .MuiChip-icon': { color: s.color },
                }} />
            );
        }
        return (
            <Chip label={payment.verified ? 'Verified' : 'Pending Verification'} size="small" sx={{
                fontWeight: 700, fontSize: '0.65rem', borderRadius: '8px',
                ...(payment.verified ? {
                    bgcolor: isDark ? 'rgba(5,150,105,0.15)' : '#ecfdf5', color: '#059669',
                    border: `1px solid ${isDark ? 'rgba(5,150,105,0.3)' : '#d1fae5'}`,
                } : {
                    bgcolor: isDark ? 'rgba(217,119,6,0.15)' : '#fffbeb', color: '#d97706',
                    border: `1px solid ${isDark ? 'rgba(217,119,6,0.3)' : '#fde68a'}`,
                }),
            }} />
        );
    };

    const getPaymentMethod = (payment) => {
        if (payment.order_id) {
            const typeMap = { bank_transfer: 'Bank Transfer', gopay: 'GoPay', shopeepay: 'ShopeePay', qris: 'QRIS', credit_card: 'Credit Card', cstore: 'Convenience Store', echannel: 'Mandiri Bill' };
            return typeMap[payment.payment_type] || payment.payment_type || 'Midtrans';
        }
        return 'Manual Upload';
    };

    return (
        <SidebarLayout>
            <Head title="Payments" />

            <Box component="main" role="main" aria-label="Payments" sx={{ p: { xs: 2, sm: 3.5 }, maxWidth: '1400px', margin: '0 auto' }}>
                {/* Page Header */}
                <Box sx={{ mb: 3.5 }}>
                    <Typography sx={{ fontWeight: 800, color: c.textPrimary, fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        My Payments 💳
                    </Typography>
                    <Typography sx={{ color: c.textMuted, fontSize: '0.875rem', mt: 0.5 }}>
                        Pay for your accepted submissions securely via Midtrans
                    </Typography>
                </Box>

                {/* Registration Fee Info Card */}
                <Paper elevation={0} sx={{
                    p: { xs: 2, md: 2.5 },
                    mb: 3,
                    border: `1px solid ${isDark ? 'rgba(37,99,235,0.2)' : '#dbeafe'}`,
                    borderRadius: '14px',
                    bgcolor: isDark ? 'rgba(37,99,235,0.06)' : '#eff6ff',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <InfoOutlinedIcon sx={{ color: isDark ? '#93c5fd' : '#2563eb', fontSize: '1.1rem' }} />
                        <Typography sx={{ fontWeight: 700, color: isDark ? '#93c5fd' : '#1e40af', fontSize: '0.9rem' }}>
                            Registration Fee
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 3 } }}>
                        {Object.entries(pricing).map(([category, amount]) => (
                            <Box key={category} sx={{
                                display: 'flex', alignItems: 'center', gap: 1,
                                px: 1.5, py: 0.8, borderRadius: '10px',
                                bgcolor: userCategory === category
                                    ? (isDark ? 'rgba(26,188,156,0.15)' : 'rgba(26,188,156,0.1)')
                                    : 'transparent',
                                border: userCategory === category
                                    ? `2px solid ${isDark ? '#1abc9c' : '#0d7a6a'}`
                                    : '2px solid transparent',
                                transition: 'all 0.2s ease',
                            }}>
                                <PersonIcon sx={{ fontSize: '0.9rem', color: userCategory === category ? '#1abc9c' : (isDark ? '#6b7280' : '#9ca3af') }} />
                                <Box>
                                    <Typography sx={{ fontSize: '0.7rem', color: isDark ? '#9ca3af' : '#6b7280', fontWeight: 600 }}>
                                        {categoryLabels[category] || category}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: '0.95rem', fontWeight: 800, fontFamily: 'monospace',
                                        color: userCategory === category ? '#1abc9c' : (isDark ? '#d1d5db' : '#374151'),
                                    }}>
                                        {formatRp(amount)}
                                        {userCategory === category && (
                                            <Chip label="Your Fee" size="small" sx={{
                                                ml: 1, height: 18, fontSize: '0.6rem', fontWeight: 700,
                                                bgcolor: isDark ? 'rgba(26,188,156,0.2)' : '#ecfdf5',
                                                color: '#1abc9c', borderRadius: '4px',
                                            }} />
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Paper>

                {/* Submissions Needing Payment */}
                {submissionsNeedingPayment.length > 0 && (
                    <Paper elevation={0} sx={{
                        p: { xs: 2, md: 3 }, mb: 3,
                        border: `1px solid ${c.alertBorder}`, borderRadius: '16px', bgcolor: c.alertBg,
                        position: 'relative', overflow: 'hidden',
                        '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' },
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <WarningAmberRoundedIcon sx={{ color: '#d97706', fontSize: '1.2rem' }} />
                            <Typography sx={{ fontWeight: 700, color: isDark ? '#fbbf24' : '#92400e', fontSize: '0.95rem' }}>
                                Submissions Requiring Payment
                            </Typography>
                        </Box>
                        <Typography sx={{ color: isDark ? '#fcd34d' : '#a16207', fontSize: '0.8rem', mb: 2.5, pl: 3.5 }}>
                            Click "Pay Now" to securely pay via Midtrans (VA, e-wallet, credit card, QRIS)
                        </Typography>

                        <Stack spacing={1.5}>
                            {submissionsNeedingPayment.map((submission) => (
                                <Paper key={submission.id} elevation={0} sx={{
                                    p: { xs: 1.5, md: 2 },
                                    display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' },
                                    gap: { xs: 1.5, sm: 2 },
                                    border: `1px solid ${c.cardBorder}`, borderRadius: '12px', bgcolor: c.cardBg,
                                    maxWidth: '700px', transition: 'all 0.2s ease',
                                    '&:hover': { borderColor: c.cardBorderHover, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
                                }}>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: c.textPrimary, lineHeight: 1.3 }} noWrap>
                                            {submission.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, mt: 0.3 }}>
                                            Fee: <strong style={{ color: '#1abc9c' }}>{autoAmount ? formatRp(autoAmount) : 'Set category in profile'}</strong>
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<PaymentIcon sx={{ fontSize: '1rem !important' }} />}
                                        onClick={() => handleOpenDialog(submission)}
                                        disabled={!autoAmount}
                                        sx={{
                                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                            boxShadow: '0 4px 14px rgba(13, 122, 106, 0.25)',
                                            '&:hover': { background: 'linear-gradient(135deg, #0a6b5c 0%, #16a085 100%)', boxShadow: '0 6px 20px rgba(13, 122, 106, 0.35)' },
                                            '&:disabled': { background: isDark ? '#374151' : '#e5e7eb', color: c.textMuted, boxShadow: 'none' },
                                            textTransform: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.8rem',
                                            px: 2.5, py: 1, whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s ease',
                                        }}
                                    >
                                        Pay Now
                                    </Button>
                                </Paper>
                            ))}
                        </Stack>
                    </Paper>
                )}

                {/* Payment History */}
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: `1px solid ${c.cardBorder}`, borderRadius: '16px', bgcolor: c.cardBg }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ReceiptLongIcon sx={{ color: c.textMuted, fontSize: '1.1rem' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary }}>Payment History</Typography>
                    </Box>

                    {payments.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: { xs: 5, md: 8 }, px: 2 }}>
                            <Box sx={{
                                width: 80, height: 80, borderRadius: '50%',
                                bgcolor: isDark ? 'rgba(239,68,68,0.08)' : '#fef2f2',
                                border: `2px dashed ${isDark ? 'rgba(239,68,68,0.25)' : '#fecaca'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto', mb: 3, position: 'relative',
                            }}>
                                <ReceiptLongIcon sx={{ color: isDark ? '#f87171' : '#ef4444', fontSize: '2rem' }} />
                                <Box sx={{ position: 'absolute', width: '60%', height: '3px', bgcolor: isDark ? '#f87171' : '#ef4444', borderRadius: '2px', transform: 'rotate(-45deg)' }} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '1.1rem', mb: 1 }}>No Payment Required Yet</Typography>
                            <Typography sx={{ color: c.textMuted, fontSize: '0.85rem', maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
                                Payment will be required once the abstract has been confirmed as accepted and the participant is declared to have advanced to the next stage.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: c.headerBg }}>
                                                {['Submission', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => (
                                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: `2px solid ${c.cardBorder}` }}>{h}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {payments.map((payment) => (
                                                <TableRow key={payment.id} sx={{
                                                    transition: 'background-color 0.15s ease', '&:hover': { bgcolor: c.rowHover },
                                                    '& td': { borderBottom: `1px solid ${c.cardBorder}`, py: 1.8, fontSize: '0.85rem', color: c.textSecondary },
                                                }}>
                                                    <TableCell><Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: c.textPrimary }}>{payment.submission?.title || 'N/A'}</Typography></TableCell>
                                                    <TableCell><Typography sx={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: 'monospace' }}>{payment.amount ? formatRp(payment.amount) : 'N/A'}</Typography></TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            {payment.order_id ? <CreditCardIcon sx={{ fontSize: '0.9rem', color: '#6b7280' }} /> : <CloudUploadIcon sx={{ fontSize: '0.9rem', color: '#6b7280' }} />}
                                                            <Typography sx={{ fontSize: '0.8rem', color: c.textSecondary }}>{getPaymentMethod(payment)}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{getStatusChip(payment)}</TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ fontSize: '0.8rem', color: c.textSecondary }}>
                                                            {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString('id-ID') : payment.created_at ? new Date(payment.created_at).toLocaleDateString('id-ID') : 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            {payment.payment_proof_url && (
                                                                <Button size="small" variant="outlined" startIcon={<VisibilityIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                                    href={`/storage/${payment.payment_proof_url}`} target="_blank"
                                                                    sx={{ color: '#0d7a6a', borderColor: isDark ? 'rgba(209,250,229,0.2)' : '#d1fae5', bgcolor: isDark ? 'rgba(13,122,106,0.08)' : '#f0fdf4', borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', px: 1.5, '&:hover': { borderColor: '#0d7a6a', bgcolor: isDark ? 'rgba(13,122,106,0.15)' : '#ecfdf5' } }}>
                                                                    View Proof
                                                                </Button>
                                                            )}
                                                            {payment.order_id && (payment.status === 'failed' || payment.status === 'expired') && (
                                                                <Button size="small" variant="contained" startIcon={<PaymentIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                                    onClick={() => { const sub = submissions.find(s => s.id === payment.submission_id); if (sub) handleOpenDialog(sub); }}
                                                                    sx={{ background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', px: 1.5, boxShadow: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(13,122,106,0.3)' } }}>
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
                            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                <Stack spacing={1.5}>
                                    {payments.map((payment) => (
                                        <Card key={payment.id} variant="outlined" sx={{
                                            borderRadius: '16px', border: `1px solid ${c.cardBorder}`, transition: 'all 0.2s ease',
                                            '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.06)', borderColor: c.cardBorderHover },
                                        }}>
                                            <CardContent sx={{ p: 2.5 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                    <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem', color: c.textPrimary }}>
                                                        {payment.amount ? formatRp(payment.amount) : 'N/A'}
                                                    </Typography>
                                                    {getStatusChip(payment)}
                                                </Box>
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: c.textPrimary, mb: 0.3 }}>{payment.submission?.title || 'N/A'}</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                    <Typography sx={{ fontSize: '0.75rem', color: c.textMuted }}>{getPaymentMethod(payment)}</Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', color: c.textMuted }}>
                                                        {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString('id-ID') : payment.created_at ? new Date(payment.created_at).toLocaleDateString('id-ID') : 'N/A'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    {payment.payment_proof_url && (
                                                        <Button size="small" variant="outlined" fullWidth startIcon={<VisibilityIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                            href={`/storage/${payment.payment_proof_url}`} target="_blank"
                                                            sx={{ color: '#0d7a6a', borderColor: isDark ? 'rgba(209,250,229,0.2)' : '#d1fae5', bgcolor: isDark ? 'rgba(13,122,106,0.08)' : '#f0fdf4', borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', py: 0.8, '&:hover': { borderColor: '#0d7a6a' } }}>
                                                            View Proof
                                                        </Button>
                                                    )}
                                                    {payment.order_id && (payment.status === 'failed' || payment.status === 'expired') && (
                                                        <Button size="small" variant="contained" fullWidth startIcon={<PaymentIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                            onClick={() => { const sub = submissions.find(s => s.id === payment.submission_id); if (sub) handleOpenDialog(sub); }}
                                                            sx={{ background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', py: 0.8, boxShadow: 'none' }}>
                                                            Retry Payment
                                                        </Button>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </Box>
                        </>
                    )}
                </Paper>
            </Box>

            {/* Pay Now Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden', bgcolor: c.cardBg } }}>
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', color: 'white',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaymentIcon sx={{ fontSize: '1.3rem' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>Confirm Payment</Typography>
                    </Box>
                    <IconButton onClick={handleCloseDialog} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }} size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {selectedSubmission && (
                        <>
                            {/* Submission Info */}
                            <Box sx={{ mb: 2.5, p: 2, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f9fafb', borderRadius: '12px', border: `1px solid ${c.cardBorder}` }}>
                                <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, mb: 0.3 }}>Submission</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: c.textPrimary }}>{selectedSubmission.title}</Typography>
                            </Box>

                            {/* Payment Summary */}
                            <Box sx={{ p: 2.5, bgcolor: isDark ? 'rgba(26,188,156,0.08)' : '#f0fdf9', borderRadius: '12px', border: `1px solid ${isDark ? 'rgba(26,188,156,0.2)' : '#d1fae5'}` }}>
                                <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, mb: 1.5 }}>Payment Summary</Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography sx={{ fontSize: '0.85rem', color: c.textSecondary }}>Category</Typography>
                                    <Chip label={categoryLabels[userCategory] || userCategory || 'Not Set'} size="small" sx={{
                                        fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24,
                                        bgcolor: isDark ? 'rgba(26,188,156,0.15)' : '#ecfdf5', color: '#0d7a6a',
                                    }} />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography sx={{ fontSize: '0.85rem', color: c.textSecondary }}>Registration Fee</Typography>
                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: c.textPrimary, fontFamily: 'monospace' }}>
                                        {autoAmount ? formatRp(autoAmount) : 'N/A'}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 1.5, borderColor: isDark ? 'rgba(26,188,156,0.15)' : '#d1fae5' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: c.textPrimary }}>Total</Typography>
                                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#1abc9c', fontFamily: 'monospace' }}>
                                        {autoAmount ? formatRp(autoAmount) : 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Payment methods info */}
                            <Box sx={{ mt: 2.5, p: 2, bgcolor: isDark ? 'rgba(37,99,235,0.08)' : '#eff6ff', borderRadius: '12px', border: `1px solid ${isDark ? 'rgba(37,99,235,0.2)' : '#dbeafe'}` }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#93c5fd' : '#1e40af', mb: 0.5 }}>
                                    🔒 Secure Payment via Midtrans
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: isDark ? '#93c5fd' : '#3b82f6', lineHeight: 1.6 }}>
                                    <strong>Bank Transfer (VA)</strong> • <strong>GoPay</strong> • <strong>ShopeePay</strong> • <strong>QRIS</strong> • <strong>Credit Card</strong>
                                </Typography>
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, gap: 1 }}>
                    <Button onClick={handleCloseDialog} disabled={paymentLoading} sx={{ color: c.textMuted, textTransform: 'none', fontWeight: 600, borderRadius: '10px', px: 2.5 }}>Cancel</Button>
                    <Button
                        variant="contained" onClick={handleMidtransPayment}
                        disabled={paymentLoading || !autoAmount}
                        startIcon={paymentLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <PaymentIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                            boxShadow: '0 4px 14px rgba(13, 122, 106, 0.25)',
                            '&:hover': { boxShadow: '0 6px 20px rgba(13, 122, 106, 0.35)' },
                            '&:disabled': { background: isDark ? '#374151' : '#e5e7eb', color: c.textMuted, boxShadow: 'none' },
                            textTransform: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', px: 3, py: 1,
                        }}
                    >
                        {paymentLoading ? 'Processing...' : `Pay ${autoAmount ? formatRp(autoAmount) : ''}`}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '10px', fontWeight: 600 }}>{snackbar.message}</Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
