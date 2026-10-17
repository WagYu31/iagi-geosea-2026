import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Avatar, Stack, Tooltip, useTheme, Tabs, Tab, TextField, InputAdornment,
    Select, MenuItem, FormControl, InputLabel, Paper,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';

export default function AdminPayments({ payments = {}, stats = {}, filters = {} }) {
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

    // Berry-styled user category pill chip
    const getCategoryChip = (category) => {
        if (!category) return null;
        const isStudent = category === 'Student';
        const isProfessional = category === 'Professional';
        const isIntl = category.includes('International') || category === 'International Delegate';
        
        let bg = isDark ? 'rgba(107,114,128,0.15)' : '#f1f5f9';
        let color = isDark ? '#94a3b8' : '#64748b';
        let border = isDark ? 'rgba(148,163,184,0.2)' : '#e2e8f0';
        
        if (isStudent) {
            bg = isDark ? 'rgba(59,130,246,0.15)' : '#eff6ff';
            color = isDark ? '#60a5fa' : '#2563eb';
            border = isDark ? 'rgba(59,130,246,0.3)' : '#bfdbfe';
        } else if (isProfessional) {
            bg = isDark ? 'rgba(139,92,246,0.15)' : '#f5f3ff';
            color = isDark ? '#a78bfa' : '#7c3aed';
            border = isDark ? 'rgba(139,92,246,0.3)' : '#ddd6fe';
        } else if (isIntl) {
            bg = isDark ? 'rgba(249,115,22,0.15)' : '#fff7ed';
            color = isDark ? '#fb923c' : '#ea580c';
            border = isDark ? 'rgba(249,115,22,0.3)' : '#fed7aa';
        }
        
        return (
            <Chip 
                label={category} 
                size="small" 
                sx={{ 
                    bgcolor: bg, 
                    color: color, 
                    border: `1px solid ${border}`,
                    fontWeight: 600, 
                    fontSize: '0.675rem', 
                    borderRadius: '8px', 
                    height: 20,
                    mt: 0.5,
                    px: 0.5,
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

    // payments is an Inertia paginator object
    const paymentsData = payments.data || [];
    const totalPayments = payments.total || 0;
    const currentPage = payments.current_page || 1;
    const lastPage = payments.last_page || 1;

    // Filter payments by tab (from current page data)
    const paidPayments = paymentsData.filter(p => p.status === 'paid' || p.verified);
    const pendingPaymentsArr = paymentsData.filter(p => p.status === 'pending' && !p.verified);
    const midtransPayments = paymentsData.filter(p => !!p.order_id);
    const manualPayments = paymentsData.filter(p => !p.order_id && !!p.payment_proof_url);

    const filteredPayments = (() => {
        switch (tabFilter) {
            case 'midtrans': return midtransPayments;
            case 'manual': return manualPayments;
            case 'paid': return paidPayments;
            case 'pending': return pendingPaymentsArr;
            default: return paymentsData;
        }
    })();

    const cellSx = { 
        borderBottom: `1px solid ${c.cardBorder}`, 
        py: 2, 
        px: 2,
        fontSize: '0.825rem', 
        color: c.textPrimary,
        verticalAlign: 'middle',
    };
    const headCellSx = { 
        ...cellSx, 
        fontWeight: 700, 
        fontSize: '0.725rem', 
        textTransform: 'uppercase', 
        letterSpacing: '0.06em', 
        color: c.textMuted, 
        bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
        borderBottom: `1px solid ${c.cardBorder}`,
    };

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

    // Berry Status Chip with dot indicator
    const getStatusChip = (p) => {
        const isPaid = p.status === 'paid' || p.verified;
        const isFailed = p.status === 'failed' || p.status === 'expired';
        const isRefunded = p.status === 'refunded';

        if (isPaid) {
            return (
                <Chip 
                    icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', ml: 1, mr: -0.5 }} />}
                    label="Paid" 
                    size="small" 
                    sx={{ 
                        bgcolor: isDark ? 'rgba(16,185,129,0.12)' : '#ecfdf5', 
                        color: isDark ? '#34d399' : '#059669', 
                        border: `1px solid ${isDark ? 'rgba(16,185,129,0.25)' : '#a7f3d0'}`,
                        fontWeight: 700, 
                        fontSize: '0.725rem', 
                        borderRadius: '8px', 
                        height: 26,
                        px: 0.5,
                    }} 
                />
            );
        }
        if (isFailed) {
            return (
                <Chip 
                    icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ef4444', ml: 1, mr: -0.5 }} />}
                    label={p.status === 'expired' ? 'Expired' : 'Failed'} 
                    size="small" 
                    sx={{ 
                        bgcolor: isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2', 
                        color: isDark ? '#f87171' : '#dc2626', 
                        border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : '#fecaca'}`,
                        fontWeight: 700, 
                        fontSize: '0.725rem', 
                        borderRadius: '8px', 
                        height: 26,
                        px: 0.5,
                    }} 
                />
            );
        }
        if (isRefunded) {
            return (
                <Chip 
                    icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#3b82f6', ml: 1, mr: -0.5 }} />}
                    label="Refunded" 
                    size="small" 
                    sx={{ 
                        bgcolor: isDark ? 'rgba(59,130,246,0.12)' : '#eff6ff', 
                        color: isDark ? '#60a5fa' : '#2563eb', 
                        border: `1px solid ${isDark ? 'rgba(59,130,246,0.25)' : '#bfdbfe'}`,
                        fontWeight: 700, 
                        fontSize: '0.725rem', 
                        borderRadius: '8px', 
                        height: 26,
                        px: 0.5,
                    }} 
                />
            );
        }
        // Pending
        const label = p.order_id ? 'Pending Payment' : 'Pending Verification';
        return (
            <Chip 
                icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#f59e0b', ml: 1, mr: -0.5 }} />}
                label={label} 
                size="small" 
                sx={{ 
                    bgcolor: isDark ? 'rgba(245,158,11,0.12)' : '#fffbeb', 
                    color: isDark ? '#fbbf24' : '#d97706', 
                    border: `1px solid ${isDark ? 'rgba(245,158,11,0.25)' : '#fde68a'}`,
                    fontWeight: 700, 
                    fontSize: '0.725rem', 
                    borderRadius: '8px', 
                    height: 26,
                    px: 0.5,
                }} 
            />
        );
    };

    // User avatar color picker based on name string
    const getAvatarBg = (name = '') => {
        const colors = [
            'linear-gradient(135deg, #0d7a6a, #10b981)',
            'linear-gradient(135deg, #2563eb, #38bdf8)',
            'linear-gradient(135deg, #7c3aed, #a855f7)',
            'linear-gradient(135deg, #ea580c, #f59e0b)',
            'linear-gradient(135deg, #059669, #34d399)',
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <SidebarLayout>
            <Head title="Manage Payments" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                
                {/* ── Berry Modern Header & Controls Bar ── */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'stretch', md: 'center' }, 
                    mb: 3.5, 
                    gap: 2.5 
                }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar 
                                variant="rounded" 
                                sx={{ 
                                    width: 42, 
                                    height: 42, 
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
                                    color: '#ffffff',
                                    boxShadow: '0 4px 14px rgba(13,122,106,0.25)',
                                }}
                            >
                                <AccountBalanceWalletRoundedIcon sx={{ fontSize: 24 }} />
                            </Avatar>
                            <Box>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: c.textPrimary, 
                                        fontSize: { xs: '1.4rem', sm: '1.75rem' }, 
                                        letterSpacing: '-0.025em',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Manage Payments
                                </Typography>
                                <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.825rem', mt: 0.25 }}>
                                    Review, verify, and reconcile delegate registration payments across all gateways
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Controls */}
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Berry Search Input */}
                        <TextField 
                            placeholder="Search payments, delegate name, email..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            size="small"
                            InputProps={{ 
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRoundedIcon sx={{ color: c.textMuted, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: c.textMuted, p: 0.5 }}>
                                            <CloseRoundedIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{ 
                                width: { xs: '100%', sm: 260, md: 300 },
                                '& .MuiOutlinedInput-root': { 
                                    borderRadius: '12px', 
                                    bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#ffffff',
                                    boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                                    transition: 'all 0.2s ease',
                                    '& fieldset': { borderColor: c.cardBorder }, 
                                    '&:hover fieldset': { borderColor: '#0d7a6a' }, 
                                    '&.Mui-focused fieldset': { borderColor: '#0d7a6a', borderWidth: 1.5 } 
                                }, 
                                '& input': { color: c.textPrimary, fontSize: '0.825rem', py: 1.1 } 
                            }}
                        />

                        {/* Category Dropdown */}
                        <FormControl size="small" sx={{ minWidth: 170, width: { xs: '100%', sm: 'auto' } }}>
                            <InputLabel sx={{ fontSize: '0.85rem' }}>Category</InputLabel>
                            <Select
                                value={categoryFilter}
                                label="Category"
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                sx={{
                                    borderRadius: '12px',
                                    bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#ffffff',
                                    boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                                    fontSize: '0.825rem',
                                    color: c.textPrimary,
                                    '& fieldset': { borderColor: c.cardBorder },
                                    '&:hover fieldset': { borderColor: '#0d7a6a' },
                                    '&.Mui-focused fieldset': { borderColor: '#0d7a6a', borderWidth: 1.5 },
                                    '& .MuiSelect-select': { py: 1.1 },
                                }}
                            >
                                <MenuItem value="all">All Categories</MenuItem>
                                <MenuItem value="Student">Student</MenuItem>
                                <MenuItem value="Professional">Professional</MenuItem>
                                <MenuItem value="International Delegate">International Delegate</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Berry Gradient Download CSV Button */}
                        <Button
                            component="a"
                            href={route('admin.payments.export')}
                            startIcon={<DownloadRoundedIcon sx={{ fontSize: 18 }} />}
                            sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.825rem',
                                color: 'white',
                                background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 50%, #10b981 100%)',
                                '&:hover': { 
                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 6px 20px rgba(13,122,106,0.3)',
                                },
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 14px rgba(13,122,106,0.25)',
                                px: 2.75,
                                py: 1.1,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Download CSV
                        </Button>
                    </Box>
                </Box>

                {/* ── Berry Signature Stat Cards with Concentric Radial Watermarks ── */}
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1.4fr 1fr 1fr 1fr' }, 
                    gap: 2.5, 
                    mb: 3.5 
                }}>
                    {/* 1. Hero Berry Earning Card (Total Revenue) */}
                    <Card 
                        elevation={0} 
                        sx={{ 
                            borderRadius: '16px', 
                            background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 55%, #14b8a6 100%)',
                            color: '#ffffff',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 8px 24px -4px rgba(13,122,106,0.35)',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                                transform: 'translateY(-3px)',
                                boxShadow: '0 12px 28px -4px rgba(13,122,106,0.45)',
                            },
                            // Berry Signature Concentric Radial Circles
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: 220,
                                height: 220,
                                background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 70%, transparent 100%)',
                                borderRadius: '50%',
                                top: -65,
                                right: -75,
                                pointerEvents: 'none',
                                zIndex: 1,
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: 220,
                                height: 220,
                                background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.01) 70%, transparent 100%)',
                                borderRadius: '50%',
                                top: -125,
                                right: -15,
                                pointerEvents: 'none',
                                zIndex: 1,
                            }
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2.5, sm: 3 }, position: 'relative', zIndex: 2, '&:last-child': { pb: { xs: 2.5, sm: 3 } } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Avatar 
                                    variant="rounded" 
                                    sx={{ 
                                        bgcolor: 'rgba(255, 255, 255, 0.2)', 
                                        backdropFilter: 'blur(8px)',
                                        color: '#ffffff',
                                        width: 46, 
                                        height: 46, 
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                    }}
                                >
                                    <AccountBalanceWalletRoundedIcon sx={{ fontSize: 24 }} />
                                </Avatar>
                                <Chip 
                                    label="ALL TIME" 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: 'rgba(255, 255, 255, 0.2)', 
                                        backdropFilter: 'blur(8px)',
                                        color: '#ffffff', 
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        fontWeight: 700, 
                                        fontSize: '0.675rem', 
                                        letterSpacing: '0.05em',
                                        borderRadius: '8px', 
                                        height: 22,
                                    }} 
                                />
                            </Box>
                            <Typography 
                                sx={{ 
                                    fontWeight: 800, 
                                    fontSize: { xs: '1.45rem', sm: '1.75rem', md: '1.9rem' }, 
                                    color: '#ffffff', 
                                    lineHeight: 1.15,
                                    letterSpacing: '-0.02em',
                                    mb: 0.75,
                                }}
                            >
                                Rp {Number(stats.totalRevenue || 0).toLocaleString('id-ID')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: 'rgba(255, 255, 255, 0.85)', 
                                        fontWeight: 600, 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.06em', 
                                        fontSize: '0.725rem' 
                                    }}
                                >
                                    Total Revenue Verified
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.18)', borderRadius: '6px', px: 0.75, py: 0.2 }}>
                                    <TrendingUpRoundedIcon sx={{ fontSize: 13, color: '#ffffff', mr: 0.25 }} />
                                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#ffffff' }}>Active</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* 2. Berry Card - Paid */}
                    <Card 
                        elevation={0} 
                        sx={{ 
                            borderRadius: '16px', 
                            border: `1px solid ${c.cardBorder}`, 
                            bgcolor: c.cardBg, 
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: isDark ? 'none' : '0 4px 18px rgba(0,0,0,0.04)',
                            transition: 'all 0.3s ease', 
                            '&:hover': { 
                                transform: 'translateY(-3px)', 
                                boxShadow: `0 10px 24px ${isDark ? 'rgba(0,0,0,0.35)' : 'rgba(16,185,129,0.12)'}`,
                                borderColor: isDark ? 'rgba(16,185,129,0.4)' : '#a7f3d0',
                            },
                            // Watermark concentric circles
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: 170,
                                height: 170,
                                background: isDark 
                                    ? 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)'
                                    : 'radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 70%)',
                                borderRadius: '50%',
                                top: -55,
                                right: -55,
                                pointerEvents: 'none',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: 170,
                                height: 170,
                                background: isDark
                                    ? 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)'
                                    : 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
                                borderRadius: '50%',
                                top: -95,
                                right: -15,
                                opacity: 0.6,
                                pointerEvents: 'none',
                            }
                        }}
                    >
                        <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 2, '&:last-child': { pb: 2.5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Avatar 
                                    variant="rounded" 
                                    sx={{ 
                                        bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5', 
                                        color: '#10b981',
                                        width: 44, 
                                        height: 44, 
                                        borderRadius: '12px',
                                        border: `1px solid ${isDark ? 'rgba(16,185,129,0.25)' : '#d1fae5'}`,
                                    }}
                                >
                                    <CheckCircleRoundedIcon sx={{ fontSize: 24 }} />
                                </Avatar>
                                <Chip 
                                    label="COMPLETED" 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: isDark ? 'rgba(16,185,129,0.12)' : '#ecfdf5', 
                                        color: isDark ? '#34d399' : '#059669', 
                                        fontWeight: 700, 
                                        fontSize: '0.65rem', 
                                        borderRadius: '6px', 
                                        height: 20 
                                    }} 
                                />
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.65rem', color: c.textPrimary, lineHeight: 1.1, mb: 0.5 }}>
                                {stats.paidCount || 0}
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                                Paid Transactions
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* 3. Berry Card - Pending */}
                    <Card 
                        elevation={0} 
                        sx={{ 
                            borderRadius: '16px', 
                            border: `1px solid ${c.cardBorder}`, 
                            bgcolor: c.cardBg, 
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: isDark ? 'none' : '0 4px 18px rgba(0,0,0,0.04)',
                            transition: 'all 0.3s ease', 
                            '&:hover': { 
                                transform: 'translateY(-3px)', 
                                boxShadow: `0 10px 24px ${isDark ? 'rgba(0,0,0,0.35)' : 'rgba(245,158,11,0.12)'}`,
                                borderColor: isDark ? 'rgba(245,158,11,0.4)' : '#fde68a',
                            },
                            // Watermark concentric circles
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: 170,
                                height: 170,
                                background: isDark 
                                    ? 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)'
                                    : 'radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%)',
                                borderRadius: '50%',
                                top: -55,
                                right: -55,
                                pointerEvents: 'none',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: 170,
                                height: 170,
                                background: isDark
                                    ? 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)'
                                    : 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
                                borderRadius: '50%',
                                top: -95,
                                right: -15,
                                opacity: 0.6,
                                pointerEvents: 'none',
                            }
                        }}
                    >
                        <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 2, '&:last-child': { pb: 2.5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Avatar 
                                    variant="rounded" 
                                    sx={{ 
                                        bgcolor: isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb', 
                                        color: '#f59e0b',
                                        width: 44, 
                                        height: 44, 
                                        borderRadius: '12px',
                                        border: `1px solid ${isDark ? 'rgba(245,158,11,0.25)' : '#fde68a'}`,
                                    }}
                                >
                                    <PendingActionsRoundedIcon sx={{ fontSize: 24 }} />
                                </Avatar>
                                <Chip 
                                    label="ACTION REQUIRED" 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: isDark ? 'rgba(245,158,11,0.12)' : '#fffbeb', 
                                        color: isDark ? '#fbbf24' : '#d97706', 
                                        fontWeight: 700, 
                                        fontSize: '0.65rem', 
                                        borderRadius: '6px', 
                                        height: 20 
                                    }} 
                                />
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.65rem', color: c.textPrimary, lineHeight: 1.1, mb: 0.5 }}>
                                {stats.pendingCount || 0}
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                                Pending Review
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* 4. Berry Card - Via Midtrans */}
                    <Card 
                        elevation={0} 
                        sx={{ 
                            borderRadius: '16px', 
                            border: `1px solid ${c.cardBorder}`, 
                            bgcolor: c.cardBg, 
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: isDark ? 'none' : '0 4px 18px rgba(0,0,0,0.04)',
                            transition: 'all 0.3s ease', 
                            '&:hover': { 
                                transform: 'translateY(-3px)', 
                                boxShadow: `0 10px 24px ${isDark ? 'rgba(0,0,0,0.35)' : 'rgba(37,99,235,0.12)'}`,
                                borderColor: isDark ? 'rgba(37,99,235,0.4)' : '#bfdbfe',
                            },
                            // Watermark concentric circles
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: 170,
                                height: 170,
                                background: isDark 
                                    ? 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)'
                                    : 'radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 70%)',
                                borderRadius: '50%',
                                top: -55,
                                right: -55,
                                pointerEvents: 'none',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: 170,
                                height: 170,
                                background: isDark
                                    ? 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)'
                                    : 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
                                borderRadius: '50%',
                                top: -95,
                                right: -15,
                                opacity: 0.6,
                                pointerEvents: 'none',
                            }
                        }}
                    >
                        <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 2, '&:last-child': { pb: 2.5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Avatar 
                                    variant="rounded" 
                                    sx={{ 
                                        bgcolor: isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff', 
                                        color: '#3b82f6',
                                        width: 44, 
                                        height: 44, 
                                        borderRadius: '12px',
                                        border: `1px solid ${isDark ? 'rgba(37,99,235,0.25)' : '#dbeafe'}`,
                                    }}
                                >
                                    <CreditCardRoundedIcon sx={{ fontSize: 24 }} />
                                </Avatar>
                                <Chip 
                                    label="GATEWAY" 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: isDark ? 'rgba(37,99,235,0.12)' : '#eff6ff', 
                                        color: isDark ? '#60a5fa' : '#2563eb', 
                                        fontWeight: 700, 
                                        fontSize: '0.65rem', 
                                        borderRadius: '6px', 
                                        height: 20 
                                    }} 
                                />
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.65rem', color: c.textPrimary, lineHeight: 1.1, mb: 0.5 }}>
                                {stats.midtransCount || 0}
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                                Via Midtrans
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* ── Berry MainCard: Filter Tabs & Data Table ── */}
                <Card 
                    elevation={0} 
                    sx={{ 
                        borderRadius: '16px', 
                        border: `1px solid ${c.cardBorder}`, 
                        bgcolor: c.cardBg, 
                        overflow: 'hidden',
                        boxShadow: isDark ? 'none' : '0 4px 20px -2px rgba(0,0,0,0.05)',
                    }}
                >
                    {/* Berry Segmented Tabs Bar */}
                    <Box sx={{ 
                        borderBottom: `1px solid ${c.cardBorder}`, 
                        px: { xs: 1.5, sm: 2.5 },
                        pt: 1,
                        bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#ffffff',
                    }}>
                        <Tabs
                            value={tabFilter}
                            onChange={(_, v) => setTabFilter(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                minHeight: 48,
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.825rem',
                                    color: c.textMuted,
                                    minHeight: 48,
                                    py: 1.25,
                                    px: 2,
                                    mr: 1,
                                    borderRadius: '8px 8px 0 0',
                                    transition: 'all 0.2s ease',
                                    '&.Mui-selected': { 
                                        color: '#0d7a6a',
                                        fontWeight: 700,
                                    },
                                    '&:hover': {
                                        color: '#0d7a6a',
                                    }
                                },
                                '& .MuiTabs-indicator': { 
                                    backgroundColor: '#0d7a6a', 
                                    height: 3, 
                                    borderRadius: '3px 3px 0 0',
                                },
                            }}
                        >
                            <Tab 
                                value="all" 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span>All</span>
                                        <Chip 
                                            label={totalPayments} 
                                            size="small" 
                                            sx={{ 
                                                height: 20, 
                                                fontSize: '0.7rem', 
                                                fontWeight: 700, 
                                                bgcolor: tabFilter === 'all' ? (isDark ? 'rgba(13,122,106,0.25)' : '#ecfdf5') : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'), 
                                                color: tabFilter === 'all' ? '#0d7a6a' : c.textMuted,
                                            }} 
                                        />
                                    </Box>
                                } 
                            />
                            <Tab 
                                value="paid" 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span>Paid</span>
                                        <Chip 
                                            label={stats.paidCount || 0} 
                                            size="small" 
                                            sx={{ 
                                                height: 20, 
                                                fontSize: '0.7rem', 
                                                fontWeight: 700, 
                                                bgcolor: tabFilter === 'paid' ? (isDark ? 'rgba(16,185,129,0.25)' : '#ecfdf5') : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'), 
                                                color: tabFilter === 'paid' ? '#059669' : c.textMuted,
                                            }} 
                                        />
                                    </Box>
                                } 
                            />
                            <Tab 
                                value="pending" 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span>Pending</span>
                                        <Chip 
                                            label={stats.pendingCount || 0} 
                                            size="small" 
                                            sx={{ 
                                                height: 20, 
                                                fontSize: '0.7rem', 
                                                fontWeight: 700, 
                                                bgcolor: tabFilter === 'pending' ? (isDark ? 'rgba(245,158,11,0.25)' : '#fffbeb') : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'), 
                                                color: tabFilter === 'pending' ? '#d97706' : c.textMuted,
                                            }} 
                                        />
                                    </Box>
                                } 
                            />
                            <Tab 
                                value="midtrans" 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span>Midtrans</span>
                                        <Chip 
                                            label={stats.midtransCount || 0} 
                                            size="small" 
                                            sx={{ 
                                                height: 20, 
                                                fontSize: '0.7rem', 
                                                fontWeight: 700, 
                                                bgcolor: tabFilter === 'midtrans' ? (isDark ? 'rgba(37,99,235,0.25)' : '#eff6ff') : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'), 
                                                color: tabFilter === 'midtrans' ? '#2563eb' : c.textMuted,
                                            }} 
                                        />
                                    </Box>
                                } 
                            />
                            <Tab 
                                value="manual" 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span>Manual</span>
                                        <Chip 
                                            label={stats.manualCount || 0} 
                                            size="small" 
                                            sx={{ 
                                                height: 20, 
                                                fontSize: '0.7rem', 
                                                fontWeight: 700, 
                                                bgcolor: tabFilter === 'manual' ? (isDark ? 'rgba(13,122,106,0.25)' : '#ecfdf5') : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'), 
                                                color: tabFilter === 'manual' ? '#0d7a6a' : c.textMuted,
                                            }} 
                                        />
                                    </Box>
                                } 
                            />
                        </Tabs>
                    </Box>

                    {/* Berry Table Container */}
                    <TableContainer>
                        <Table sx={{ minWidth: 950 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ ...headCellSx, width: '6%' }}>ID</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: '25%' }}>Participant</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: '22%' }}>Submission</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: '13%' }}>Amount</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: '14%' }}>Method</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: '10%' }}>Status</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: '9%' }}>Date</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: '11%', textAlign: 'center' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                            <Avatar 
                                                variant="rounded" 
                                                sx={{ 
                                                    width: 56, 
                                                    height: 56, 
                                                    borderRadius: '16px', 
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9', 
                                                    color: c.textMuted, 
                                                    mx: 'auto', 
                                                    mb: 1.5 
                                                }}
                                            >
                                                <ReceiptLongRoundedIcon sx={{ fontSize: 32 }} />
                                            </Avatar>
                                            <Typography variant="body1" sx={{ fontWeight: 700, color: c.textPrimary, mb: 0.5 }}>
                                                No payment records found
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem', maxWidth: 360, mx: 'auto' }}>
                                                Try adjusting your search criteria or switching to a different filter tab above.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((p) => (
                                        <TableRow 
                                            key={p.id} 
                                            hover 
                                            sx={{ 
                                                transition: 'background-color 0.15s ease',
                                                '&:hover': { 
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.025)' : '#f8fafc',
                                                },
                                            }}
                                        >
                                            {/* ID */}
                                            <TableCell sx={{ ...cellSx, fontFamily: 'monospace', fontWeight: 700, color: c.textMuted, fontSize: '0.8rem' }}>
                                                #{p.id}
                                            </TableCell>

                                            {/* Participant User */}
                                            <TableCell sx={cellSx}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                                                    <Avatar 
                                                        variant="rounded" 
                                                        sx={{ 
                                                            width: 38, 
                                                            height: 38, 
                                                            borderRadius: '10px',
                                                            background: getAvatarBg(p.user?.name || ''), 
                                                            fontSize: '0.85rem', 
                                                            fontWeight: 800,
                                                            color: '#ffffff',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                        }}
                                                    >
                                                        {(p.user?.name || 'U').charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                fontWeight: 700, 
                                                                color: c.textPrimary, 
                                                                fontSize: '0.85rem',
                                                                lineHeight: 1.25,
                                                            }}
                                                        >
                                                            {p.user?.name || 'N/A'}
                                                        </Typography>
                                                        <Typography 
                                                            variant="caption" 
                                                            sx={{ 
                                                                color: c.textMuted, 
                                                                fontSize: '0.75rem',
                                                                mt: 0.25,
                                                            }}
                                                        >
                                                            {p.user?.email || ''}
                                                        </Typography>
                                                        {getCategoryChip(p.user?.category)}
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Submission */}
                                            <TableCell sx={cellSx}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                    <ArticleRoundedIcon sx={{ fontSize: 16, color: c.textMuted, mt: 0.2, flexShrink: 0 }} />
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            fontWeight: 600, 
                                                            fontSize: '0.825rem', 
                                                            color: c.textPrimary,
                                                            lineHeight: 1.35,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                        title={p.submission?.title || 'N/A'}
                                                    >
                                                        {p.submission?.title || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            {/* Amount */}
                                            <TableCell sx={cellSx}>
                                                <Typography 
                                                    sx={{ 
                                                        fontWeight: 800, 
                                                        color: '#0d7a6a', 
                                                        fontSize: '0.925rem',
                                                        letterSpacing: '-0.01em',
                                                    }}
                                                >
                                                    {p.amount ? `Rp ${parseFloat(p.amount).toLocaleString('id-ID')}` : 'N/A'}
                                                </Typography>
                                            </TableCell>

                                            {/* Payment Method */}
                                            <TableCell sx={cellSx}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {p.order_id ? (
                                                        <Avatar variant="rounded" sx={{ width: 26, height: 26, borderRadius: '6px', bgcolor: isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff', color: '#2563eb' }}>
                                                            <CreditCardRoundedIcon sx={{ fontSize: 15 }} />
                                                        </Avatar>
                                                    ) : (
                                                        <Avatar variant="rounded" sx={{ width: 26, height: 26, borderRadius: '6px', bgcolor: isDark ? 'rgba(107,114,128,0.15)' : '#f1f5f9', color: '#64748b' }}>
                                                            <CloudUploadRoundedIcon sx={{ fontSize: 15 }} />
                                                        </Avatar>
                                                    )}
                                                    <Box>
                                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: c.textPrimary }}>
                                                            {getMethodLabel(p)}
                                                        </Typography>
                                                        {p.transaction_id && (
                                                            <Typography sx={{ fontSize: '0.675rem', color: c.textMuted, fontFamily: 'monospace' }}>
                                                                {p.transaction_id.substring(0, 16)}...
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell sx={cellSx}>
                                                {getStatusChip(p)}
                                            </TableCell>

                                            {/* Date */}
                                            <TableCell sx={cellSx}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                    <CalendarTodayRoundedIcon sx={{ fontSize: 13, color: c.textMuted }} />
                                                    <Typography variant="body2" sx={{ fontSize: '0.78rem', color: c.textMuted, fontWeight: 500 }}>
                                                        {p.paid_at
                                                            ? new Date(p.paid_at).toLocaleDateString('id-ID')
                                                            : p.created_at
                                                                ? new Date(p.created_at).toLocaleDateString('id-ID')
                                                                : 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            {/* Berry Styled Action Buttons */}
                                            <TableCell sx={{ ...cellSx, textAlign: 'center' }}>
                                                <Box sx={{ display: 'inline-flex', gap: 0.75, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                    {/* View proof for manual payments */}
                                                    {p.payment_proof_url && (
                                                        <Button 
                                                            size="small" 
                                                            startIcon={<VisibilityRoundedIcon sx={{ fontSize: 15 }} />} 
                                                            onClick={() => setProofDialog({ open: true, payment: p })} 
                                                            sx={{ 
                                                                borderRadius: '8px', 
                                                                textTransform: 'none', 
                                                                fontWeight: 700, 
                                                                fontSize: '0.75rem', 
                                                                color: '#2563eb', 
                                                                bgcolor: isDark ? 'rgba(37,99,235,0.12)' : '#eff6ff', 
                                                                border: `1px solid ${isDark ? 'rgba(37,99,235,0.25)' : '#dbeafe'}`,
                                                                '&:hover': { 
                                                                    bgcolor: isDark ? 'rgba(37,99,235,0.22)' : '#dbeafe',
                                                                    borderColor: '#bfdbfe',
                                                                }, 
                                                                px: 1.25,
                                                                py: 0.4,
                                                            }}
                                                        >
                                                            View
                                                        </Button>
                                                    )}

                                                    {/* Verify or Reject buttons */}
                                                    {!(p.status === 'paid' || p.verified) ? (
                                                        <>
                                                            {(!p.order_id || p.status === 'pending') && (
                                                                <Button 
                                                                    size="small" 
                                                                    startIcon={<CheckCircleRoundedIcon sx={{ fontSize: 15 }} />} 
                                                                    onClick={() => handleVerify(p.id)} 
                                                                    sx={{ 
                                                                        borderRadius: '8px', 
                                                                        textTransform: 'none', 
                                                                        fontWeight: 700, 
                                                                        fontSize: '0.75rem', 
                                                                        color: 'white', 
                                                                        background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 50%, #10b981 100%)', 
                                                                        boxShadow: '0 2px 8px rgba(13,122,106,0.25)',
                                                                        '&:hover': { 
                                                                            background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)',
                                                                            boxShadow: '0 4px 12px rgba(13,122,106,0.35)',
                                                                        }, 
                                                                        px: 1.25,
                                                                        py: 0.4,
                                                                    }}
                                                                >
                                                                    Verify
                                                                </Button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <Button 
                                                            size="small" 
                                                            startIcon={<CancelRoundedIcon sx={{ fontSize: 15 }} />} 
                                                            onClick={() => handleReject(p.id)} 
                                                            sx={{ 
                                                                borderRadius: '8px', 
                                                                textTransform: 'none', 
                                                                fontWeight: 700, 
                                                                fontSize: '0.75rem', 
                                                                color: isDark ? '#f87171' : '#dc2626', 
                                                                bgcolor: isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2', 
                                                                border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : '#fee2e2'}`,
                                                                '&:hover': { 
                                                                    bgcolor: isDark ? 'rgba(239,68,68,0.2)' : '#fee2e2',
                                                                }, 
                                                                px: 1.25,
                                                                py: 0.4,
                                                            }}
                                                        >
                                                            Reject
                                                        </Button>
                                                    )}

                                                    {/* Delete button */}
                                                    <Tooltip title="Delete payment — author can re-pay" arrow>
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => handleDelete(p.id)} 
                                                            sx={{ 
                                                                borderRadius: '8px', 
                                                                color: isDark ? '#f87171' : '#ef4444', 
                                                                border: `1px solid ${isDark ? 'rgba(239,68,68,0.2)' : '#fecaca'}`, 
                                                                p: 0.6,
                                                                '&:hover': { 
                                                                    bgcolor: isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2',
                                                                } 
                                                            }}
                                                        >
                                                            <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* ── Berry Pagination Footer ── */}
                    {lastPage > 1 && (
                        <Box sx={{
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' }, 
                            justifyContent: 'space-between',
                            px: 3, 
                            py: 2,
                            borderTop: `1px solid ${c.cardBorder}`,
                            bgcolor: isDark ? 'rgba(0,0,0,0.12)' : '#fafbfc',
                            gap: 1.5,
                        }}>
                            <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                                Showing <strong>{((currentPage - 1) * 25) + 1}</strong>–<strong>{Math.min(currentPage * 25, totalPayments)}</strong> of <strong>{totalPayments}</strong> entries
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                                {currentPage > 1 && (
                                    <Button 
                                        size="small"
                                        onClick={() => router.get(route('admin.payments'), { page: currentPage - 1, search: searchTerm || undefined, category: categoryFilter !== 'all' ? categoryFilter : undefined }, { preserveState: true })}
                                        sx={{ 
                                            minWidth: 40, 
                                            borderRadius: '8px', 
                                            textTransform: 'none', 
                                            fontWeight: 700, 
                                            fontSize: '0.8rem', 
                                            color: c.textPrimary,
                                            border: `1px solid ${c.cardBorder}`,
                                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9' },
                                            px: 1.5,
                                            py: 0.5,
                                        }}
                                    >
                                        Previous
                                    </Button>
                                )}
                                
                                {Array.from({ length: Math.min(lastPage, 7) }, (_, i) => {
                                    let page;
                                    if (lastPage <= 7) page = i + 1;
                                    else if (currentPage <= 4) page = i + 1;
                                    else if (currentPage >= lastPage - 3) page = lastPage - 6 + i;
                                    else page = currentPage - 3 + i;
                                    
                                    const isCurrent = page === currentPage;
                                    return (
                                        <Button 
                                            key={page} 
                                            size="small"
                                            onClick={() => router.get(route('admin.payments'), { page, search: searchTerm || undefined, category: categoryFilter !== 'all' ? categoryFilter : undefined }, { preserveState: true })}
                                            sx={{
                                                minWidth: 34, 
                                                height: 34, 
                                                borderRadius: '8px',
                                                fontWeight: isCurrent ? 800 : 600, 
                                                fontSize: '0.8rem',
                                                background: isCurrent ? 'linear-gradient(135deg, #094d42 0%, #0d7a6a 50%, #10b981 100%)' : (isDark ? 'rgba(255,255,255,0.03)' : '#ffffff'),
                                                color: isCurrent ? '#ffffff' : c.textPrimary,
                                                border: isCurrent ? 'none' : `1px solid ${c.cardBorder}`,
                                                boxShadow: isCurrent ? '0 2px 8px rgba(13,122,106,0.3)' : 'none',
                                                '&:hover': { 
                                                    background: isCurrent ? 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)' : (isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'),
                                                },
                                            }}
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}

                                {currentPage < lastPage && (
                                    <Button 
                                        size="small"
                                        onClick={() => router.get(route('admin.payments'), { page: currentPage + 1, search: searchTerm || undefined, category: categoryFilter !== 'all' ? categoryFilter : undefined }, { preserveState: true })}
                                        sx={{ 
                                            minWidth: 40, 
                                            borderRadius: '8px', 
                                            textTransform: 'none', 
                                            fontWeight: 700, 
                                            fontSize: '0.8rem', 
                                            color: c.textPrimary,
                                            border: `1px solid ${c.cardBorder}`,
                                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9' },
                                            px: 1.5,
                                            py: 0.5,
                                        }}
                                    >
                                        Next
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}
                </Card>
            </Box>

            {/* ── Berry Proof of Payment Dialog ── */}
            <Dialog 
                open={proofDialog.open} 
                onClose={() => setProofDialog({ open: false, payment: null })} 
                maxWidth="md" 
                fullWidth 
                PaperProps={{ 
                    sx: { 
                        borderRadius: '20px', 
                        bgcolor: c.cardBg, 
                        border: `1px solid ${c.cardBorder}`,
                        boxShadow: '0 20px 45px -10px rgba(0,0,0,0.25)',
                    } 
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderBottom: `1px solid ${c.cardBorder}`, 
                    px: 3,
                    py: 2.25 
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar 
                            variant="rounded" 
                            sx={{ 
                                background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)', 
                                color: '#ffffff',
                                width: 42, 
                                height: 42, 
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(13,122,106,0.25)',
                            }}
                        >
                            <ReceiptLongRoundedIcon sx={{ fontSize: 22 }} />
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: c.textPrimary, letterSpacing: '-0.01em' }}>
                                Payment Verification Details
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.75rem' }}>
                                Transaction ID #{proofDialog.payment?.id || ''}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton 
                        onClick={() => setProofDialog({ open: false, payment: null })} 
                        sx={{ 
                            color: c.textMuted,
                            borderRadius: '10px',
                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9' }
                        }}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    {proofDialog.payment && (
                        <Box>
                            {/* Summary Metadata Card */}
                            <Box sx={{ 
                                mb: 3, 
                                p: 2.5, 
                                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', 
                                borderRadius: '14px', 
                                border: `1px solid ${c.cardBorder}` 
                            }}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                                    {[
                                        { l: 'Participant Name', v: proofDialog.payment.user?.name },
                                        { l: 'Category', v: proofDialog.payment.user?.category || '—' },
                                        { l: 'Submission Title', v: proofDialog.payment.submission?.title },
                                        { l: 'Total Payable Amount', v: `Rp ${parseFloat(proofDialog.payment.amount || 0).toLocaleString('id-ID')}`, hl: true },
                                        { l: 'Payment Channel', v: getMethodLabel(proofDialog.payment) },
                                        ...(proofDialog.payment.order_id ? [
                                            { l: 'Order ID', v: proofDialog.payment.order_id },
                                            { l: 'Transaction ID', v: proofDialog.payment.transaction_id || 'N/A' },
                                        ] : []),
                                    ].map((i) => (
                                        <Box key={i.l} sx={{ gridColumn: i.l === 'Submission Title' ? { sm: 'span 2' } : 'auto' }}>
                                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.675rem', display: 'block', mb: 0.5 }}>
                                                {i.l}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: i.hl ? '#0d7a6a' : c.textPrimary, fontSize: i.hl ? '1.15rem' : '0.875rem', fontFamily: i.l.includes('ID') ? 'monospace' : 'inherit' }}>
                                                {i.v}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* Proof Image / PDF Document */}
                            {proofDialog.payment.payment_proof_url && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: c.textPrimary, mb: 1.5, textAlign: 'left', fontSize: '0.9rem' }}>
                                        Receipt / Proof of Transfer:
                                    </Typography>
                                    {proofDialog.payment.payment_proof_url.toLowerCase().endsWith('.pdf') ? (
                                        <Box sx={{ 
                                            py: 4, px: 2, 
                                            border: `2px dashed ${c.cardBorder}`, 
                                            borderRadius: '14px', 
                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            gap: 1.5 
                                        }}>
                                            <Typography sx={{ fontSize: '2.75rem', lineHeight: 1 }}>📄</Typography>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: c.textPrimary }}>PDF Payment Proof Document</Typography>
                                            <Typography sx={{ fontSize: '0.775rem', color: c.textMuted, maxWidth: '80%', mx: 'auto', textAlign: 'center' }}>
                                                Click the button below to view or download the uploaded PDF transfer proof document.
                                            </Typography>
                                            <Button 
                                                variant="contained" 
                                                component="a" 
                                                href={`/storage/${proofDialog.payment.payment_proof_url}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                startIcon={<LaunchRoundedIcon sx={{ fontSize: 16 }} />}
                                                sx={{ 
                                                    textTransform: 'none', 
                                                    borderRadius: '10px', 
                                                    fontWeight: 700, 
                                                    fontSize: '0.825rem',
                                                    background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
                                                    '&:hover': { background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)' },
                                                    boxShadow: '0 4px 14px rgba(13,122,106,0.25)', 
                                                    color: 'white',
                                                    px: 3,
                                                    py: 1,
                                                    mt: 1,
                                                }}
                                            >
                                                Open PDF Document
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box sx={{ 
                                            position: 'relative', 
                                            borderRadius: '14px', 
                                            overflow: 'hidden', 
                                            border: `1px solid ${c.cardBorder}`,
                                            bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}>
                                            <Box sx={{ position: 'relative', width: '100%', maxHeight: '420px', overflow: 'hidden', borderRadius: '10px', display: 'flex', justifyContent: 'center' }}>
                                                <img 
                                                    src={`/storage/${proofDialog.payment.payment_proof_url}`} 
                                                    alt="Payment Proof" 
                                                    style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '10px' }}
                                                    onError={(e) => { 
                                                        e.target.style.display = 'none'; 
                                                        e.target.parentElement.innerHTML = '<p style="padding:40px;text-align:center;color:#666">Unable to load image preview. <a href="/storage/' + proofDialog.payment.payment_proof_url + '" target="_blank">Download File</a></p>'; 
                                                    }}
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
                                                    startIcon={<LaunchRoundedIcon sx={{ fontSize: 16 }} />}
                                                    sx={{ 
                                                        textTransform: 'none', 
                                                        borderRadius: '10px', 
                                                        fontSize: '0.8rem', 
                                                        fontWeight: 700,
                                                        borderColor: '#0d7a6a', 
                                                        color: '#0d7a6a', 
                                                        '&:hover': { borderColor: '#10b981', bgcolor: 'rgba(13,122,106,0.06)' } 
                                                    }}
                                                >
                                                    Open Fullscreen / Zoom
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Optional Support Document (e.g. Student ID or IAGI Membership) */}
                            {proofDialog.payment.support_document_url && (
                                <Box sx={{ mt: 3.5 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: c.textPrimary, mb: 1.5, textAlign: 'left', fontSize: '0.9rem' }}>
                                        {proofDialog.payment.user?.category?.toLowerCase() === 'student' 
                                            ? 'Student ID Card / Proof of Enrollment:' 
                                            : 'IAGI Membership Card / Proof:'}
                                    </Typography>
                                    {proofDialog.payment.support_document_url.toLowerCase().endsWith('.pdf') ? (
                                        <Box sx={{ 
                                            py: 4, px: 2, 
                                            border: `2px dashed ${c.cardBorder}`, 
                                            borderRadius: '14px', 
                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            gap: 1.5 
                                        }}>
                                            <Typography sx={{ fontSize: '2.75rem', lineHeight: 1 }}>📄</Typography>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: c.textPrimary }}>PDF Support Document</Typography>
                                            <Typography sx={{ fontSize: '0.775rem', color: c.textMuted, maxWidth: '80%', mx: 'auto', textAlign: 'center' }}>
                                                Click the button below to view or download the uploaded PDF support document.
                                            </Typography>
                                            <Button 
                                                variant="contained" 
                                                component="a" 
                                                href={`/storage/${proofDialog.payment.support_document_url}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                startIcon={<LaunchRoundedIcon sx={{ fontSize: 16 }} />}
                                                sx={{ 
                                                    textTransform: 'none', 
                                                    borderRadius: '10px', 
                                                    fontWeight: 700, 
                                                    fontSize: '0.825rem',
                                                    background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
                                                    '&:hover': { background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)' },
                                                    boxShadow: '0 4px 14px rgba(13,122,106,0.25)', 
                                                    color: 'white',
                                                    px: 3,
                                                    py: 1,
                                                    mt: 1,
                                                }}
                                            >
                                                Open PDF Support Doc
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box sx={{ 
                                            position: 'relative', 
                                            borderRadius: '14px', 
                                            overflow: 'hidden', 
                                            border: `1px solid ${c.cardBorder}`,
                                            bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}>
                                            <Box sx={{ position: 'relative', width: '100%', maxHeight: '420px', overflow: 'hidden', borderRadius: '10px', display: 'flex', justifyContent: 'center' }}>
                                                <img 
                                                    src={`/storage/${proofDialog.payment.support_document_url}`} 
                                                    alt="Support Document" 
                                                    style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '10px' }}
                                                    onError={(e) => { 
                                                        e.target.style.display = 'none'; 
                                                        e.target.parentElement.innerHTML = '<p style="padding:40px;text-align:center;color:#666">Unable to load document preview. <a href="/storage/' + proofDialog.payment.support_document_url + '" target="_blank">Download File</a></p>'; 
                                                    }}
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
                                                    startIcon={<LaunchRoundedIcon sx={{ fontSize: 16 }} />}
                                                    sx={{ 
                                                        textTransform: 'none', 
                                                        borderRadius: '10px', 
                                                        fontSize: '0.8rem', 
                                                        fontWeight: 700,
                                                        borderColor: '#0d7a6a', 
                                                        color: '#0d7a6a', 
                                                        '&:hover': { borderColor: '#10b981', bgcolor: 'rgba(13,122,106,0.06)' } 
                                                    }}
                                                >
                                                    Open Fullscreen / Zoom
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2.75, borderTop: `1px solid ${c.cardBorder}` }}>
                    {proofDialog.payment && !(proofDialog.payment.status === 'paid' || proofDialog.payment.verified) && (
                        <Button 
                            variant="contained" 
                            startIcon={<CheckCircleRoundedIcon />} 
                            onClick={() => { 
                                handleVerify(proofDialog.payment.id); 
                                setProofDialog({ open: false, payment: null }); 
                            }} 
                            sx={{ 
                                background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 50%, #10b981 100%)', 
                                '&:hover': { background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)' }, 
                                borderRadius: '10px', 
                                textTransform: 'none', 
                                fontWeight: 700, 
                                fontSize: '0.825rem',
                                px: 3.5,
                                py: 0.9,
                                boxShadow: '0 4px 14px rgba(13,122,106,0.25)',
                            }}
                        >
                            Verify Payment
                        </Button>
                    )}
                    <Button 
                        onClick={() => setProofDialog({ open: false, payment: null })} 
                        sx={{ 
                            borderRadius: '10px', 
                            textTransform: 'none', 
                            fontWeight: 700, 
                            fontSize: '0.825rem',
                            color: c.textMuted,
                            px: 2.5,
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
