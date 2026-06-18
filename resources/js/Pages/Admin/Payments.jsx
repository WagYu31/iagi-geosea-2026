import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Avatar, Stack, Tooltip, useTheme, Tabs, Tab, TextField, InputAdornment,
    Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PaymentIcon from '@mui/icons-material/Payment';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';

export default function AdminPayments({ payments = {}, filters = {} }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const [proofDialog, setProofDialog] = useState({ open: false, payment: null });
    const [tabFilter, setTabFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || 'all');

    const searchTimer = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            router.get(route('admin.payments'), { 
                search: searchTerm || undefined, 
                category: categoryFilter !== 'all' ? categoryFilter : undefined 
            }, { preserveState: true, preserveScroll: true });
        }, 400);
        return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
    }, [searchTerm, categoryFilter]);

    const getCategoryChip = (category) => {
        if (!category) return null;
        const isStudent = category === 'Student';
        const isProfessional = category === 'Professional';
        const isIntl = category.includes('International') || category === 'International Delegate';
        
        let bg = isDark ? 'rgba(107,114,128,0.15)' : '#f3f4f6';
        let color = '#6b7280';
        
        if (isStudent) {
            bg = isDark ? 'rgba(59,130,246,0.15)' : '#dbeafe';
            color = '#2563eb';
        } else if (isProfessional) {
            bg = isDark ? 'rgba(147,51,234,0.15)' : '#f3e8ff';
            color = '#9333ea';
        } else if (isIntl) {
            bg = isDark ? 'rgba(234,88,12,0.15)' : '#fff7ed';
            color = '#ea580c';
        }
        
        return (
            <Chip 
                label={category} 
                size="small" 
                sx={{ 
                    bgcolor: bg, 
                    color: color, 
                    fontWeight: 600, 
                    fontSize: '0.65rem', 
                    borderRadius: '6px', 
                    height: 18,
                    mt: 0.5
                }} 
            />
        );
    };

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
    const handleDelete = (paymentId) => {
        if (confirm('⚠️ Delete this payment record?\n\nThe author will be able to re-submit payment for this submission.\n\nThis action cannot be undone.')) {
            router.delete(route('admin.payments.delete', paymentId), { preserveScroll: true });
        }
    };

    // payments is now a paginator object
    const paymentsData = payments.data || [];
    const totalPayments = payments.total || 0;
    const currentPage = payments.current_page || 1;
    const lastPage = payments.last_page || 1;

    // Stats (from current page only - for accurate counts, server-side would be ideal)
    const paidPayments = paymentsData.filter(p => p.status === 'paid' || p.verified);
    const pendingPaymentsArr = paymentsData.filter(p => p.status === 'pending' && !p.verified);
    const midtransPayments = paymentsData.filter(p => !!p.order_id);
    const manualPayments = paymentsData.filter(p => !p.order_id && !!p.payment_proof_url);
    const totalAmount = paidPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    // Filter payments by tab (from current page data)
    const filteredPayments = (() => {
        switch (tabFilter) {
            case 'midtrans': return midtransPayments;
            case 'manual': return manualPayments;
            case 'paid': return paidPayments;
            case 'pending': return pendingPaymentsArr;
            default: return paymentsData;
        }
    })();

    const cellSx = { borderBottom: `1px solid ${c.cardBorder}`, py: 1.5, fontSize: '0.825rem', color: c.textPrimary };
    const headCellSx = { ...cellSx, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: c.textMuted, bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb' };

    const stats = [
        { label: 'Total Revenue', value: `Rp ${totalAmount.toLocaleString('id-ID')}`, icon: <AccountBalanceWalletIcon />, color: '#1abc9c', bg: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5' },
        { label: 'Paid', value: paidPayments.length, icon: <CheckCircleIcon />, color: '#16a34a', bg: isDark ? 'rgba(22,163,74,0.12)' : '#dcfce7' },
        { label: 'Pending', value: pendingPaymentsArr.length, icon: <PendingActionsIcon />, color: '#d97706', bg: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7' },
        { label: 'Via Midtrans', value: midtransPayments.length, icon: <CreditCardIcon />, color: '#2563eb', bg: isDark ? 'rgba(37,99,235,0.12)' : '#dbeafe' },
    ];

    // Payment method helper
    const getMethodLabel = (p) => {
        if (p.gateway === 'manual') {
            return 'Manual Bank Transfer';
        }
        if (p.order_id) {
            const typeMap = {
                bank_transfer: 'Bank Transfer',
                gopay: 'GoPay',
                shopeepay: 'ShopeePay',
                qris: 'QRIS',
                credit_card: 'Credit Card',
                cstore: 'Convenience Store',
                echannel: 'Mandiri Bill',
            };
            return typeMap[p.payment_type] || p.payment_type || 'Midtrans';
        }
        return p.payment_proof_url ? 'Manual Bank Transfer' : 'N/A';
    };

    // Status chip
    const getStatusChip = (p) => {
        const isPaid = p.status === 'paid' || p.verified;
        const isFailed = p.status === 'failed' || p.status === 'expired';
        const isRefunded = p.status === 'refunded';

        if (isPaid) {
            return <Chip label="Paid" size="small" sx={{ bgcolor: isDark ? 'rgba(22,163,74,0.15)' : '#dcfce7', color: '#16a34a', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24 }} />;
        }
        if (isFailed) {
            return <Chip label={p.status === 'expired' ? 'Expired' : 'Failed'} size="small" sx={{ bgcolor: isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2', color: '#dc2626', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24 }} />;
        }
        if (isRefunded) {
            return <Chip label="Refunded" size="small" sx={{ bgcolor: isDark ? 'rgba(37,99,235,0.15)' : '#dbeafe', color: '#2563eb', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24 }} />;
        }
        // Pending
        const label = p.order_id ? 'Pending Payment' : 'Pending Verification';
        return <Chip label={label} size="small" sx={{ bgcolor: isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7', color: '#d97706', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24 }} />;
    };

    return (
        <SidebarLayout>
            <Head title="Manage Payments" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 3, gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
                            Manage Payments 💳
                        </Typography>
                        <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5 }}>{totalPayments} total payments</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField 
                            placeholder="Search payments..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            size="small"
                            InputProps={{ 
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: c.textMuted, fontSize: 18 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: c.textMuted, p: 0.5 }}>
                                            <CloseIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{ 
                                width: { xs: '100%', sm: 240, md: 280 },
                                '& .MuiOutlinedInput-root': { 
                                    borderRadius: '12px', 
                                    bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb',
                                    '& fieldset': { borderColor: c.cardBorder }, 
                                    '&:hover fieldset': { borderColor: '#1abc9c' }, 
                                    '&.Mui-focused fieldset': { borderColor: '#1abc9c' } 
                                }, 
                                '& input': { color: c.textPrimary, fontSize: '0.825rem', py: 1 } 
                            }}
                        />
                        <FormControl size="small" sx={{ minWidth: 160, width: { xs: '100%', sm: 'auto' } }}>
                            <InputLabel sx={{ fontSize: '0.85rem' }}>Category</InputLabel>
                            <Select
                                value={categoryFilter}
                                label="Category"
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                sx={{
                                    borderRadius: '12px',
                                    bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb',
                                    fontSize: '0.825rem',
                                    color: c.textPrimary,
                                    '& fieldset': { borderColor: c.cardBorder },
                                    '&:hover fieldset': { borderColor: '#1abc9c' },
                                    '&.Mui-focused fieldset': { borderColor: '#1abc9c' },
                                    '& .MuiSelect-select': { py: 1 },
                                }}
                            >
                                <MenuItem value="all">All Categories</MenuItem>
                                <MenuItem value="Student">Student</MenuItem>
                                <MenuItem value="Professional">Professional</MenuItem>
                                <MenuItem value="International Delegate">Professional and Non-IAGI member</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
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

                {/* Filter Tabs */}
                <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, overflow: 'hidden' }}>
                    <Box sx={{ borderBottom: `1px solid ${c.cardBorder}`, px: 2 }}>
                        <Tabs
                            value={tabFilter}
                            onChange={(_, v) => setTabFilter(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.8rem',
                                    color: c.textMuted,
                                    minHeight: 48,
                                    '&.Mui-selected': { color: '#1abc9c' },
                                },
                                '& .MuiTabs-indicator': { backgroundColor: '#1abc9c', height: 3, borderRadius: '3px 3px 0 0' },
                            }}
                        >
                            <Tab value="all" label={`All (${paymentsData.length})`} />
                            <Tab value="paid" label={`Paid (${paidPayments.length})`} />
                            <Tab value="pending" label={`Pending (${pendingPaymentsArr.length})`} />
                            <Tab value="midtrans" label={`Midtrans (${midtransPayments.length})`} />
                            <Tab value="manual" label={`Manual (${manualPayments.length})`} />
                        </Tabs>
                    </Box>

                    {/* Table */}
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {['ID', 'User', 'Submission', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => (
                                        <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPayments.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} align="center" sx={cellSx}>
                                        <Box sx={{ py: 5 }}><ReceiptLongIcon sx={{ fontSize: 48, color: isDark ? '#374151' : '#d1d5db', mb: 1 }} /><Typography variant="body2" sx={{ color: c.textMuted }}>No payments found</Typography></Box>
                                    </TableCell></TableRow>
                                ) : filteredPayments.map((p) => (
                                    <TableRow key={p.id} hover sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb' } }}>
                                        <TableCell sx={{ ...cellSx, fontWeight: 600, color: c.textMuted }}>#{p.id}</TableCell>
                                        <TableCell sx={cellSx}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ width: 34, height: 34, bgcolor: '#1abc9c', fontSize: '0.8rem', fontWeight: 700 }}>{(p.user?.name || 'U').charAt(0)}</Avatar>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary, fontSize: '0.85rem' }}>{p.user?.name || 'N/A'}</Typography>
                                                    <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.75rem' }}>{p.user?.email || ''}</Typography>
                                                    {getCategoryChip(p.user?.category)}
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
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {p.order_id ? (
                                                    <CreditCardIcon sx={{ fontSize: '0.85rem', color: '#2563eb' }} />
                                                ) : (
                                                    <CloudUploadIcon sx={{ fontSize: '0.85rem', color: '#6b7280' }} />
                                                )}
                                                <Typography sx={{ fontSize: '0.8rem', color: c.textSecondary }}>
                                                    {getMethodLabel(p)}
                                                </Typography>
                                            </Box>
                                            {p.transaction_id && (
                                                <Typography sx={{ fontSize: '0.65rem', color: c.textMuted, fontFamily: 'monospace', mt: 0.3 }}>
                                                    {p.transaction_id.substring(0, 20)}...
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            {getStatusChip(p)}
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: c.textMuted }}>
                                                {p.paid_at
                                                    ? new Date(p.paid_at).toLocaleDateString('id-ID')
                                                    : p.created_at
                                                        ? new Date(p.created_at).toLocaleDateString('id-ID')
                                                        : 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {/* View proof for manual payments */}
                                                {p.payment_proof_url && (
                                                    <Button size="small" startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />} onClick={() => setProofDialog({ open: true, payment: p })} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: '#2563eb', bgcolor: isDark ? 'rgba(37,99,235,0.1)' : '#dbeafe', '&:hover': { bgcolor: isDark ? 'rgba(37,99,235,0.2)' : '#bfdbfe' }, px: 1.5 }}>View</Button>
                                                )}
                                                {/* Verify/Reject buttons */}
                                                {!(p.status === 'paid' || p.verified) ? (
                                                    <>
                                                        {/* Only show verify for manual payments or pending Midtrans */}
                                                        {(!p.order_id || p.status === 'pending') && (
                                                            <Button size="small" startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />} onClick={() => handleVerify(p.id)} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: 'white', background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)' }, px: 1.5 }}>Verify</Button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <Button size="small" startIcon={<CancelIcon sx={{ fontSize: 16 }} />} onClick={() => handleReject(p.id)} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: isDark ? '#f87171' : '#dc2626', bgcolor: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', '&:hover': { bgcolor: isDark ? 'rgba(239,68,68,0.2)' : '#fecaca' }, px: 1.5 }}>Reject</Button>
                                                )}
                                                {/* Delete button */}
                                                <Tooltip title="Delete payment — author can re-pay" arrow>
                                                    <Button size="small" startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />} onClick={() => handleDelete(p.id)} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: isDark ? '#f87171' : '#dc2626', bgcolor: 'transparent', border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : '#fecaca'}`, '&:hover': { bgcolor: isDark ? 'rgba(239,68,68,0.12)' : '#fee2e2' }, px: 1, minWidth: 'auto' }}>
                                                        Delete
                                                    </Button>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Pagination Controls */}
                    {lastPage > 1 && (
                        <Box sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            px: 2.5, py: 1.5,
                            borderTop: `1px solid ${c.cardBorder}`,
                            bgcolor: isDark ? 'rgba(0,0,0,0.08)' : '#f9fafb',
                        }}>
                            <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                                Showing {((currentPage - 1) * 25) + 1}–{Math.min(currentPage * 25, totalPayments)} of {totalPayments}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {currentPage > 1 && (
                                    <Button size="small"
                                        onClick={() => router.get(route('admin.payments'), { page: currentPage - 1, search: searchTerm || undefined, category: categoryFilter !== 'all' ? categoryFilter : undefined }, { preserveState: true })}
                                        sx={{ minWidth: 36, borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', color: c.textMuted }}>
                                        ‹ Prev
                                    </Button>
                                )}
                                {Array.from({ length: Math.min(lastPage, 7) }, (_, i) => {
                                    let page;
                                    if (lastPage <= 7) page = i + 1;
                                    else if (currentPage <= 4) page = i + 1;
                                    else if (currentPage >= lastPage - 3) page = lastPage - 6 + i;
                                    else page = currentPage - 3 + i;
                                    return (
                                        <Button key={page} size="small"
                                            onClick={() => router.get(route('admin.payments'), { page, search: searchTerm || undefined, category: categoryFilter !== 'all' ? categoryFilter : undefined }, { preserveState: true })}
                                            sx={{
                                                minWidth: 32, height: 32, borderRadius: '8px',
                                                fontWeight: page === currentPage ? 800 : 600, fontSize: '0.78rem',
                                                background: page === currentPage ? 'linear-gradient(135deg, #0d7a6a, #1abc9c)' : 'transparent',
                                                color: page === currentPage ? '#fff' : c.textMuted,
                                                '&:hover': { bgcolor: page === currentPage ? '#16a085' : 'rgba(26,188,156,0.08)' },
                                            }}>{page}</Button>
                                    );
                                })}
                                {currentPage < lastPage && (
                                    <Button size="small"
                                        onClick={() => router.get(route('admin.payments'), { page: currentPage + 1, search: searchTerm || undefined, category: categoryFilter !== 'all' ? categoryFilter : undefined }, { preserveState: true })}
                                        sx={{ minWidth: 36, borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', color: c.textMuted }}>
                                        Next ›
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}
                </Card>
            </Box>

            {/* Proof Dialog */}
            <Dialog open={proofDialog.open} onClose={() => setProofDialog({ open: false, payment: null })} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px', bgcolor: c.cardBg, border: `1px solid ${c.cardBorder}` } }}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${c.cardBorder}`, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 40, height: 40, borderRadius: '10px' }}>
                            <ReceiptLongIcon sx={{ color: '#1abc9c', fontSize: 22 }} />
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary }}>Payment Details</Typography>
                    </Box>
                    <IconButton onClick={() => setProofDialog({ open: false, payment: null })} sx={{ color: c.textMuted }}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {proofDialog.payment && (
                        <Box>
                            <Box sx={{ mb: 3, p: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', borderRadius: '12px', border: `1px solid ${c.cardBorder}` }}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                                    {[
                                        { l: 'User / Participant', v: proofDialog.payment.user?.name },
                                        { l: 'User Category', v: proofDialog.payment.user?.category || '—' },
                                        { l: 'Submission Title', v: proofDialog.payment.submission?.title },
                                        { l: 'Total Amount', v: `Rp ${parseFloat(proofDialog.payment.amount || 0).toLocaleString('id-ID')}`, hl: true },
                                        { l: 'Payment Method', v: getMethodLabel(proofDialog.payment) },
                                        ...(proofDialog.payment.order_id ? [
                                            { l: 'Order ID', v: proofDialog.payment.order_id },
                                            { l: 'Transaction ID', v: proofDialog.payment.transaction_id || 'N/A' },
                                        ] : []),
                                    ].map((i) => (
                                        <Box key={i.l} sx={{ gridColumn: i.l === 'Submission Title' ? { sm: 'span 2' } : 'auto' }}>
                                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem', display: 'block', mb: 0.5 }}>{i.l}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: i.hl ? '#1abc9c' : c.textPrimary, fontSize: i.hl ? '1.05rem' : '0.85rem', fontFamily: i.l.includes('ID') ? 'monospace' : 'inherit' }}>{i.v}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            {proofDialog.payment.payment_proof_url && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.textPrimary, mb: 1, textAlign: 'left' }}>
                                        Receipt / Proof of Transfer:
                                    </Typography>
                                    {proofDialog.payment.payment_proof_url.toLowerCase().endsWith('.pdf') ? (
                                        <Box sx={{ 
                                            py: 4, px: 2, border: `2px dashed ${c.cardBorder}`, borderRadius: '12px', 
                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', 
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 
                                        }}>
                                            <Typography sx={{ fontSize: '3rem', lineHeight: 1 }}>📄</Typography>
                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: c.textPrimary }}>PDF Payment Proof Document</Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, maxWidth: '80%', mx: 'auto' }}>
                                                Click the button below to view or download the uploaded PDF transfer proof.
                                            </Typography>
                                            <Button 
                                                variant="contained" 
                                                component="a" 
                                                href={`/storage/${proofDialog.payment.payment_proof_url}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                sx={{ 
                                                    textTransform: 'none', borderRadius: '10px', fontWeight: 600, 
                                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                                    '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)' },
                                                    boxShadow: '0 4px 12px rgba(26,188,156,0.2)', color: 'white'
                                                }}
                                            >
                                                Open PDF Proof
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box sx={{ 
                                            position: 'relative', 
                                            borderRadius: '12px', 
                                            overflow: 'hidden', 
                                            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                                            bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                                            p: 1.5,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}>
                                            <Box sx={{ position: 'relative', width: '100%', maxHeight: '420px', overflow: 'hidden', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
                                                <img src={`/storage/${proofDialog.payment.payment_proof_url}`} alt="Payment Proof" style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '8px' }}
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<p style="padding:40px;text-align:center;color:#666">Unable to load. <a href="/storage/' + proofDialog.payment.payment_proof_url + '" target="_blank">Download</a></p>'; }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1.5, mt: 2, justifyContent: 'center', width: '100%' }}>
                                                <Button 
                                                    size="small" 
                                                    variant="outlined" 
                                                    component="a" 
                                                    href={`/storage/${proofDialog.payment.payment_proof_url}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    startIcon={<LaunchIcon />}
                                                    sx={{ 
                                                        textTransform: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
                                                        borderColor: '#1abc9c', color: '#1abc9c', 
                                                        '&:hover': { borderColor: '#16a085', bgcolor: 'rgba(26,188,156,0.04)' } 
                                                    }}
                                                >
                                                    Open Image in New Tab / Zoom
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            )}
                            {proofDialog.payment.support_document_url && (
                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.textPrimary, mb: 1, textAlign: 'left' }}>
                                        {proofDialog.payment.user?.category?.toLowerCase() === 'student' 
                                            ? 'Student ID Card / Proof:' 
                                            : 'IAGI Membership Card / Proof:'}
                                    </Typography>
                                    {proofDialog.payment.support_document_url.toLowerCase().endsWith('.pdf') ? (
                                        <Box sx={{ 
                                            py: 4, px: 2, border: `2px dashed ${c.cardBorder}`, borderRadius: '12px', 
                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', 
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 
                                        }}>
                                            <Typography sx={{ fontSize: '3rem', lineHeight: 1 }}>📄</Typography>
                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: c.textPrimary }}>PDF Support Document</Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, maxWidth: '80%', mx: 'auto' }}>
                                                Click the button below to view or download the uploaded PDF support document.
                                            </Typography>
                                            <Button 
                                                variant="contained" 
                                                component="a" 
                                                href={`/storage/${proofDialog.payment.support_document_url}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                sx={{ 
                                                    textTransform: 'none', borderRadius: '10px', fontWeight: 600, 
                                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                                    '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)' },
                                                    boxShadow: '0 4px 12px rgba(26,188,156,0.2)', color: 'white'
                                                }}
                                            >
                                                Open PDF Support Doc
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box sx={{ 
                                            position: 'relative', 
                                            borderRadius: '12px', 
                                            overflow: 'hidden', 
                                            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                                            bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                                            p: 1.5,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}>
                                            <Box sx={{ position: 'relative', width: '100%', maxHeight: '420px', overflow: 'hidden', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
                                                <img src={`/storage/${proofDialog.payment.support_document_url}`} alt="Support Document" style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '8px' }}
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<p style="padding:40px;text-align:center;color:#666">Unable to load. <a href="/storage/' + proofDialog.payment.support_document_url + '" target="_blank">Download</a></p>'; }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1.5, mt: 2, justifyContent: 'center', width: '100%' }}>
                                                <Button 
                                                    size="small" 
                                                    variant="outlined" 
                                                    component="a" 
                                                    href={`/storage/${proofDialog.payment.support_document_url}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    startIcon={<LaunchIcon />}
                                                    sx={{ 
                                                        textTransform: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
                                                        borderColor: '#1abc9c', color: '#1abc9c', 
                                                        '&:hover': { borderColor: '#16a085', bgcolor: 'rgba(26,188,156,0.04)' } 
                                                    }}
                                                >
                                                    Open Image in New Tab / Zoom
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}` }}>
                    {proofDialog.payment && !(proofDialog.payment.status === 'paid' || proofDialog.payment.verified) && (
                        <Button variant="contained" startIcon={<CheckCircleIcon />} onClick={() => { handleVerify(proofDialog.payment.id); setProofDialog({ open: false, payment: null }); }} sx={{ background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600, px: 3 }}>Verify Payment</Button>
                    )}
                    <Button onClick={() => setProofDialog({ open: false, payment: null })} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: c.textMuted }}>Close</Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
