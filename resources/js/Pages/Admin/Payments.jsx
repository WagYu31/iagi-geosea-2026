import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Avatar, Stack, Tooltip, useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function AdminPayments({ payments = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const [proofDialog, setProofDialog] = useState({ open: false, payment: null });

    const handleVerify = (paymentId) => {
        if (confirm('Are you sure you want to verify this payment?')) {
            router.patch(route('admin.payments.verify', paymentId), {}, { preserveScroll: true });
        }
    };
    const handleReject = (paymentId) => {
        if (confirm('Are you sure you want to reject this payment?')) {
            router.patch(route('admin.payments.reject', paymentId), {}, { preserveScroll: true });
        }
    };

    const verifiedCount = payments.filter(p => p.verified).length;
    const pendingCount = payments.filter(p => !p.verified).length;
    const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    const cellSx = { borderBottom: `1px solid ${c.cardBorder}`, py: 1.5, fontSize: '0.825rem', color: c.textPrimary };
    const headCellSx = { ...cellSx, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: c.textMuted, bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb' };

    const stats = [
        { label: 'Total Revenue', value: `Rp ${totalAmount.toLocaleString('id-ID')}`, icon: <AccountBalanceWalletIcon />, color: '#1abc9c', bg: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5' },
        { label: 'Verified', value: verifiedCount, icon: <CheckCircleIcon />, color: '#16a34a', bg: isDark ? 'rgba(22,163,74,0.12)' : '#dcfce7' },
        { label: 'Pending', value: pendingCount, icon: <PendingActionsIcon />, color: '#d97706', bg: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7' },
    ];

    return (
        <SidebarLayout>
            <Head title="Manage Payments" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
                        Manage Payments 💳
                    </Typography>
                    <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5 }}>{payments.length} total payments</Typography>
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                    {stats.map((s) => (
                        <Card key={s.label} elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, transition: 'all 0.25s', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 25px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}` } }}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar variant="rounded" sx={{ bgcolor: s.bg, width: 44, height: 44, borderRadius: '12px' }}>
                                        {React.cloneElement(s.icon, { sx: { color: s.color, fontSize: 22 } })}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>{s.label}</Typography>
                                        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: c.textPrimary, lineHeight: 1.2 }}>{s.value}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Table */}
                <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {['ID', 'User', 'Submission', 'Amount', 'Status', 'Uploaded', 'Actions'].map(h => (
                                        <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} align="center" sx={cellSx}>
                                        <Box sx={{ py: 5 }}><ReceiptLongIcon sx={{ fontSize: 48, color: isDark ? '#374151' : '#d1d5db', mb: 1 }} /><Typography variant="body2" sx={{ color: c.textMuted }}>No payments found</Typography></Box>
                                    </TableCell></TableRow>
                                ) : payments.map((p) => (
                                    <TableRow key={p.id} hover sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb' } }}>
                                        <TableCell sx={{ ...cellSx, fontWeight: 600, color: c.textMuted }}>#{p.id}</TableCell>
                                        <TableCell sx={cellSx}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ width: 34, height: 34, bgcolor: '#1abc9c', fontSize: '0.8rem', fontWeight: 700 }}>{(p.user?.name || 'U').charAt(0)}</Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary, fontSize: '0.85rem' }}>{p.user?.name || 'N/A'}</Typography>
                                                    <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.75rem' }}>{p.user?.email || ''}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ ...cellSx, maxWidth: 200 }}>
                                            <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '0.825rem', maxWidth: 200 }}>{p.submission?.title || 'N/A'}</Typography>
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Typography sx={{ fontWeight: 700, color: '#1abc9c', fontSize: '0.9rem' }}>{p.amount ? `Rp ${parseFloat(p.amount).toLocaleString('id-ID')}` : 'N/A'}</Typography>
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Chip label={p.verified ? 'Verified' : 'Pending'} size="small" sx={{ bgcolor: p.verified ? (isDark ? 'rgba(22,163,74,0.15)' : '#dcfce7') : (isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7'), color: p.verified ? '#16a34a' : '#d97706', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24 }} />
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: c.textMuted }}>{p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : 'N/A'}</Typography>
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {p.payment_proof_url && (
                                                    <Button size="small" startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />} onClick={() => setProofDialog({ open: true, payment: p })} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: '#2563eb', bgcolor: isDark ? 'rgba(37,99,235,0.1)' : '#dbeafe', '&:hover': { bgcolor: isDark ? 'rgba(37,99,235,0.2)' : '#bfdbfe' }, px: 1.5 }}>View</Button>
                                                )}
                                                {!p.verified ? (
                                                    <Button size="small" startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />} onClick={() => handleVerify(p.id)} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: 'white', background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)' }, px: 1.5 }}>Verify</Button>
                                                ) : (
                                                    <Button size="small" startIcon={<CancelIcon sx={{ fontSize: 16 }} />} onClick={() => handleReject(p.id)} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: isDark ? '#f87171' : '#dc2626', bgcolor: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', '&:hover': { bgcolor: isDark ? 'rgba(239,68,68,0.2)' : '#fecaca' }, px: 1.5 }}>Reject</Button>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Box>

            {/* Proof Dialog */}
            <Dialog open={proofDialog.open} onClose={() => setProofDialog({ open: false, payment: null })} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px', bgcolor: c.cardBg, border: `1px solid ${c.cardBorder}` } }}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${c.cardBorder}`, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 40, height: 40, borderRadius: '10px' }}>
                            <ReceiptLongIcon sx={{ color: '#1abc9c', fontSize: 22 }} />
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary }}>Payment Proof</Typography>
                    </Box>
                    <IconButton onClick={() => setProofDialog({ open: false, payment: null })} sx={{ color: c.textMuted }}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {proofDialog.payment && (
                        <Box>
                            <Box sx={{ mb: 2.5, p: 2, bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb', borderRadius: '12px', border: `1px solid ${c.cardBorder}` }}>
                                <Stack spacing={1.5}>
                                    {[{ l: 'User', v: proofDialog.payment.user?.name }, { l: 'Submission', v: proofDialog.payment.submission?.title }, { l: 'Amount', v: `Rp ${parseFloat(proofDialog.payment.amount || 0).toLocaleString('id-ID')}`, hl: true }].map((i) => (
                                        <Box key={i.l}>
                                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>{i.l}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: i.hl ? '#1abc9c' : c.textPrimary, fontSize: i.hl ? '1rem' : '0.85rem' }}>{i.v}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                            {proofDialog.payment.payment_proof_url && (
                                <Box sx={{ textAlign: 'center' }}>
                                    <img src={`/storage/${proofDialog.payment.payment_proof_url}`} alt="Payment Proof" style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '12px', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}
                                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<p style="padding:40px;text-align:center;color:#666">Unable to load. <a href="/storage/' + proofDialog.payment.payment_proof_url + '" target="_blank">Download</a></p>'; }}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}` }}>
                    {proofDialog.payment && !proofDialog.payment.verified && (
                        <Button variant="contained" startIcon={<CheckCircleIcon />} onClick={() => { handleVerify(proofDialog.payment.id); setProofDialog({ open: false, payment: null }); }} sx={{ background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600, px: 3 }}>Verify Payment</Button>
                    )}
                    <Button onClick={() => setProofDialog({ open: false, payment: null })} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: c.textMuted }}>Close</Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
