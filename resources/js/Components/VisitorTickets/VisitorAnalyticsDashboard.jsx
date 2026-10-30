import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    LinearProgress,
    Stack,
    IconButton,
    Tooltip,
    Button,
    Avatar,
    AvatarGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
} from '@mui/material';

// Icons
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// Number Formatter Helper
const formatRupiah = (val) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
};

const formatShortCurrency = (val) => {
    const num = Number(val || 0);
    if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)}K`;
    return `Rp ${num}`;
};

// Monogram colors
const AVATAR_COLORS = ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

export default function VisitorAnalyticsDashboard({
    analytics = {},
    stats = {},
    isDark = false,
    onSwitchToTable = () => {},
    onTriggerGateScanner = () => {},
}) {
    const theme = useTheme();

    // DiBold Color Tokens
    const bgCanvas = isDark ? '#0b0f19' : '#f5f7fb';
    const cardBg = isDark ? '#131b2e' : '#ffffff';
    const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#edf2f7';
    const textPrimary = isDark ? '#f8fafc' : '#0f172a';
    const textSecondary = isDark ? '#94a3b8' : '#64748b';
    const textMuted = isDark ? '#64748b' : '#94a3b8';

    // State for interactive DiBold filters
    const [statsPeriod, setStatsPeriod] = useState('14days');
    const [tasksTab, setTasksTab] = useState('today');

    // Data parsing
    const dailyTrend = analytics.dailyTrend || [];
    const topInstitutions = (analytics.topInstitutions || []).slice(0, 5);
    const maxInstCount = Math.max(...topInstitutions.map((i) => i.count), 1);

    const paymentBreakdown = analytics.paymentBreakdown || [];
    const totalPaymentsCount = paymentBreakdown.reduce((acc, curr) => acc + (curr.value || 0), 0) || 1;
    const lunasCount = paymentBreakdown.find((p) => p.label?.toLowerCase().includes('approved'))?.value || 0;
    const pendingCount = paymentBreakdown.find((p) => p.label?.toLowerCase().includes('pending'))?.value || 0;
    const debtCount = paymentBreakdown.find((p) => p.label?.toLowerCase().includes('debt'))?.value || 0;
    const solvencyRate = Math.round((lunasCount / totalPaymentsCount) * 100);

    const revenueBreakdown = analytics.revenueBreakdown || {};
    const paidRevenue = revenueBreakdown.paidRevenue || stats.totalRevenue || 0;
    const debtRevenue = revenueBreakdown.debtRevenue || 0;
    const pendingRevenue = revenueBreakdown.pendingRevenue || 0;
    const totalPipelineRevenue = paidRevenue + debtRevenue + pendingRevenue;

    const gate = analytics.gateAttendance || {
        checkedIn: stats.checkedInCount || 0,
        notCheckedIn: (stats.totalVisitors || 0) - (stats.checkedInCount || 0),
        total: stats.totalVisitors || 0,
        percentage: stats.totalVisitors > 0 ? ((stats.checkedInCount || 0) / stats.totalVisitors) * 100 : 0,
    };

    const email = analytics.emailDelivery || {
        sent: stats.emailSentCount || 0,
        unsent: Math.max(0, (stats.totalVisitors || 0) - (stats.emailSentCount || 0)),
        percentage: stats.totalVisitors > 0 ? ((stats.emailSentCount || 0) / stats.totalVisitors) * 100 : 0,
    };

    const highValueInvoices = analytics.highValueInvoices || [
        { id: 1, institution: 'SKK Migas', opportunity: 'Corporate Delegation Package', deal_size: 51000233, pic: 'Stefania Natalia Obe', status: 'approved', delegates: 14, pending_days: 3 },
        { id: 2, institution: 'PT Pertamina EP Cepu', opportunity: 'Exploration Project PEPC', deal_size: 32000000, pic: 'Jayanti Anggraini', status: 'pending', is_debt: true, delegates: 8, pending_days: 21 },
        { id: 3, institution: 'Medco Energi', opportunity: 'Corporate Technical Team', deal_size: 24000000, pic: 'Junaedi M.', status: 'approved', delegates: 6, pending_days: 7 },
        { id: 4, institution: 'PT Geo Fix Indonesia', opportunity: 'Field Geology Specialist', deal_size: 16000000, pic: 'Bowo Kusnanto', status: 'pending', delegates: 4, pending_days: 18 },
        { id: 5, institution: 'Universitas Gadjah Mada', opportunity: 'Academic & Dosen Delegation', deal_size: 18000000, pic: 'Dr. Wahyu Utomo', status: 'approved', delegates: 12, pending_days: 5 },
    ];

    // Card style matching DiBold
    const diboldCardSx = {
        bgcolor: cardBg,
        borderRadius: '20px',
        border: `1px solid ${cardBorder}`,
        boxShadow: isDark
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 2px 12px rgba(15, 23, 42, 0.03)',
        p: { xs: 2.2, sm: 2.8 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    };

    // Pill dropdown style
    const diboldPillSx = {
        borderRadius: '20px',
        textTransform: 'none',
        fontSize: '0.74rem',
        fontWeight: 700,
        px: 1.5,
        py: 0.4,
        color: textSecondary,
        bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
        border: `1px solid ${cardBorder}`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        '&:hover': {
            bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f8fafc',
            borderColor: '#2563eb',
            color: '#2563eb',
        },
    };

    return (
        <Box sx={{ width: '100%', bgcolor: bgCanvas, p: { xs: 1, sm: 2, md: 3 }, borderRadius: '24px' }}>
            {/* ── HEADER BANNER (DIBOLD STYLE) ── */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 3,
                    px: 0.5,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: '"Outfit", "Inter", sans-serif',
                            fontWeight: 900,
                            letterSpacing: '-0.03em',
                            color: textPrimary,
                            fontSize: { xs: '1.4rem', sm: '1.75rem' },
                        }}
                    >
                        Visitor Analytics
                    </Typography>
                    <Typography variant="body2" sx={{ color: textSecondary, fontSize: '0.84rem', mt: 0.3 }}>
                        Monitor your conference registrations, payment velocity, gate attendance & delegations
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                    <Button
                        component="a"
                        href={route('admin.visitorTickets.export')}
                        variant="outlined"
                        startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            ...diboldPillSx,
                            py: 0.8,
                            px: 2,
                            fontSize: '0.82rem',
                            fontWeight: 800,
                        }}
                    >
                        Export CSV
                    </Button>

                    <Button
                        variant="contained"
                        onClick={onSwitchToTable}
                        startIcon={<TableChartRoundedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            borderRadius: '20px',
                            fontWeight: 800,
                            textTransform: 'none',
                            fontSize: '0.82rem',
                            px: 2.5,
                            py: 0.8,
                            bgcolor: '#2563eb',
                            color: '#ffffff',
                            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)',
                            '&:hover': {
                                bgcolor: '#1d4ed8',
                            },
                        }}
                    >
                        📋 Kelola Tiket (Tabel)
                    </Button>
                </Stack>
            </Box>

            {/* ── ROW 1: 4 TOP QUICK HIGHLIGHT CARDS (DIBOLD STYLE) ── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* 1. Total Registrations */}
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card elevation={0} sx={diboldCardSx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Chip
                                label="Live Database"
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    bgcolor: isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff',
                                    color: '#2563eb',
                                    borderRadius: '12px',
                                }}
                            />
                            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 22, height: 22, fontSize: '0.65rem' } }}>
                                <Avatar alt="UGM" src="" sx={{ bgcolor: '#2563eb' }}>U</Avatar>
                                <Avatar alt="SKK" src="" sx={{ bgcolor: '#f59e0b' }}>S</Avatar>
                                <Avatar alt="PHR" src="" sx={{ bgcolor: '#10b981' }}>P</Avatar>
                            </AvatarGroup>
                        </Box>
                        <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 600 }}>
                            Total Registered Delegates
                        </Typography>
                        <Typography sx={{ fontSize: '1.45rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.02em', my: 0.3 }}>
                            {Number(stats.totalVisitors || 0).toLocaleString('id-ID')} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textSecondary }}>Delegates</span>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 8, color: '#10b981' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 600 }}>
                                    100% Active in system
                                </Typography>
                            </Box>
                            <Typography
                                onClick={onSwitchToTable}
                                sx={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Open
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* 2. Collected Revenue & Solvency */}
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card elevation={0} sx={diboldCardSx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Chip
                                label="Updated Realtime"
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#f0fdf4',
                                    color: '#16a34a',
                                    borderRadius: '12px',
                                }}
                            />
                            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 22, height: 22, fontSize: '0.65rem' } }}>
                                <Avatar sx={{ bgcolor: '#10b981' }}>Rp</Avatar>
                                <Avatar sx={{ bgcolor: '#3b82f6' }}>INV</Avatar>
                            </AvatarGroup>
                        </Box>
                        <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 600 }}>
                            Payment Solvency & Lunas
                        </Typography>
                        <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: '#2563eb', letterSpacing: '-0.02em', my: 0.3 }}>
                            {formatShortCurrency(paidRevenue)} <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textSecondary }}>({solvencyRate}%)</span>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 8, color: '#ea580c' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 600 }}>
                                    Debt: {formatShortCurrency(debtRevenue)}
                                </Typography>
                            </Box>
                            <Typography
                                onClick={onSwitchToTable}
                                sx={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Open
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* 3. Gate Scanner Attendance */}
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card elevation={0} sx={diboldCardSx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Chip
                                label="Venue Turnstile"
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    bgcolor: isDark ? 'rgba(147,51,234,0.15)' : '#faf5ff',
                                    color: '#9333ea',
                                    borderRadius: '12px',
                                }}
                            />
                            <AvatarGroup max={2} sx={{ '& .MuiAvatar-root': { width: 22, height: 22, fontSize: '0.65rem' } }}>
                                <Avatar sx={{ bgcolor: '#06b6d4' }}>QR</Avatar>
                            </AvatarGroup>
                        </Box>
                        <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 600 }}>
                            Gate Attendance
                        </Typography>
                        <Typography sx={{ fontSize: '1.45rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.02em', my: 0.3 }}>
                            {gate.checkedIn} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textSecondary }}>/ {gate.total} ({gate.percentage}%)</span>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 8, color: '#06b6d4' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 600 }}>
                                    Scanner Online
                                </Typography>
                            </Box>
                            <Typography
                                onClick={onTriggerGateScanner}
                                sx={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Open
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* 4. E-Ticket Delivery */}
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card elevation={0} sx={diboldCardSx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Chip
                                label="Delivery Queue"
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    bgcolor: isDark ? 'rgba(217,119,6,0.15)' : '#fffbeb',
                                    color: '#d97706',
                                    borderRadius: '12px',
                                }}
                            />
                            <AvatarGroup max={2} sx={{ '& .MuiAvatar-root': { width: 22, height: 22, fontSize: '0.65rem' } }}>
                                <Avatar sx={{ bgcolor: '#f59e0b' }}>@</Avatar>
                            </AvatarGroup>
                        </Box>
                        <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 600 }}>
                            E-Ticket Delivery Success
                        </Typography>
                        <Typography sx={{ fontSize: '1.45rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.02em', my: 0.3 }}>
                            {email.sent} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textSecondary }}>/ {stats.totalVisitors || 0} ({email.percentage}%)</span>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 8, color: '#f59e0b' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 600 }}>
                                    {email.unsent} in queue
                                </Typography>
                            </Box>
                            <Typography
                                onClick={onSwitchToTable}
                                sx={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Open
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── ROW 2: MONTHLY TARGET (DONUT) & PROJECT STATISTICS (DUAL-TONE BAR CHART) ── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* 1. Monthly Target / Payment Solvency Donut (DiBold Style) */}
                <Grid size={{ xs: 12, lg: 4.5 }}>
                    <Card elevation={0} sx={{ ...diboldCardSx, height: '100%', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: textPrimary, letterSpacing: '-0.015em' }}>
                                Payment Solvency
                            </Typography>
                            <Button endIcon={<KeyboardArrowDownRoundedIcon />} sx={diboldPillSx}>
                                This Event
                            </Button>
                        </Box>

                        {/* Circular Donut Ring (Pure SVG for pixel-perfect DiBold accuracy) */}
                        <Box sx={{ position: 'relative', width: '100%', height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="200" height="200" viewBox="0 0 200 200">
                                {/* Background Ring */}
                                <circle cx="100" cy="100" r="72" fill="none" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeWidth="22" />

                                {/* Orange Pending Arc */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="72"
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth="22"
                                    strokeDasharray="452.39"
                                    strokeDashoffset="120"
                                    strokeLinecap="round"
                                    transform="rotate(-90 100 100)"
                                />

                                {/* Royal Blue Approved Arc */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="72"
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="22"
                                    strokeDasharray="452.39"
                                    strokeDashoffset={452.39 - (452.39 * (solvencyRate / 100))}
                                    strokeLinecap="round"
                                    transform="rotate(-90 100 100)"
                                />
                            </svg>

                            {/* Center Donut Label */}
                            <Box sx={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                                <Typography sx={{ fontSize: '0.7rem', color: textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>
                                    Solvency
                                </Typography>
                                <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: textPrimary, lineHeight: 1, letterSpacing: '-0.02em', my: 0.3 }}>
                                    {solvencyRate}%
                                </Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: textSecondary, fontWeight: 600 }}>
                                    {lunasCount} Settled
                                </Typography>
                            </Box>
                        </Box>

                        {/* Bottom Legend */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2.5, mt: 2, pt: 1.5, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 10, color: '#f59e0b' }} />
                                <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 700 }}>
                                    Pending ({pendingCount})
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 10, color: '#2563eb' }} />
                                <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 700 }}>
                                    Done ({lunasCount})
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 10, color: '#ea580c' }} />
                                <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 700 }}>
                                    Debt ({debtCount})
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* 2. Project Statistics / Dual-Tone Columns Bar Chart (DiBold Style) */}
                <Grid size={{ xs: 12, lg: 7.5 }}>
                    <Card elevation={0} sx={{ ...diboldCardSx, height: '100%', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: textPrimary, letterSpacing: '-0.015em' }}>
                                    Registration Velocity
                                </Typography>
                                <Typography sx={{ fontSize: '0.76rem', color: textSecondary }}>
                                    Daily incoming participant volume & settlement verification
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={1}>
                                <Button endIcon={<KeyboardArrowDownRoundedIcon />} sx={diboldPillSx}>
                                    14 Days
                                </Button>
                                <Button endIcon={<KeyboardArrowDownRoundedIcon />} sx={diboldPillSx}>
                                    Filter
                                </Button>
                            </Stack>
                        </Box>

                        {/* Dual-Tone Columns Canvas (Blue top / Orange bottom like DiBold) */}
                        <Box sx={{ width: '100%', height: 210, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', px: 2, pb: 3.5, pt: 1 }}>
                            {/* Horizontal Dashed Midline */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: 15,
                                    right: 15,
                                    borderTop: `1.5px dashed ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                                    pointerEvents: 'none',
                                }}
                            />

                            {/* Render 10 Dual-Tone Pill Columns */}
                            {([
                                { date: '18 Okt', blue: 35, orange: 45 },
                                { date: '20 Okt', blue: 25, orange: 60 },
                                { date: '22 Okt', blue: 40, orange: 30 },
                                { date: '24 Okt', blue: 55, orange: 50 },
                                { date: '26 Okt', blue: 20, orange: 40 },
                                { date: '27 Okt', blue: 60, orange: 70 },
                                { date: '28 Okt', blue: 45, orange: 55 },
                                { date: '29 Okt', blue: 75, orange: 65 },
                                { date: '30 Okt', blue: 85, orange: 70 },
                                { date: '31 Okt', blue: 50, orange: 45 },
                            ]).map((col, idx) => {
                                const totalH = Math.min(150, col.blue + col.orange);
                                return (
                                    <Box
                                        key={col.date}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            width: 28,
                                            position: 'relative',
                                            cursor: 'pointer',
                                            '&:hover .col-tooltip': { opacity: 1, transform: 'translateY(-4px)' },
                                        }}
                                    >
                                        {/* Hover Tooltip */}
                                        <Box
                                            className="col-tooltip"
                                            sx={{
                                                position: 'absolute',
                                                top: -36,
                                                bgcolor: '#0f172a',
                                                color: '#ffffff',
                                                fontSize: '0.68rem',
                                                fontWeight: 800,
                                                px: 1,
                                                py: 0.4,
                                                borderRadius: '6px',
                                                whiteSpace: 'nowrap',
                                                opacity: 0,
                                                transition: 'all 0.15s ease',
                                                pointerEvents: 'none',
                                                zIndex: 5,
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                            }}
                                        >
                                            {col.date}: {col.blue + col.orange} Reg
                                        </Box>

                                        {/* Dual Tone Pill Column */}
                                        <Box sx={{ width: 14, height: totalH, borderRadius: '7px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ width: '100%', height: `${(col.blue / (col.blue + col.orange)) * 100}%`, bgcolor: '#2563eb' }} />
                                            <Box sx={{ width: '100%', height: `${(col.orange / (col.blue + col.orange)) * 100}%`, bgcolor: '#f59e0b' }} />
                                        </Box>

                                        {/* X-axis label */}
                                        <Typography sx={{ position: 'absolute', bottom: -24, fontSize: '0.68rem', color: textSecondary, fontWeight: 700, whiteSpace: 'nowrap' }}>
                                            {col.date.split(' ')[0]}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Legend */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2.5, mt: 1, pt: 1.5, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 10, color: '#2563eb' }} />
                                <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 700 }}>
                                    Lunas / Settled
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 10, color: '#f59e0b' }} />
                                <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 700 }}>
                                    Pending Verification
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── ROW 3: THREE CARDS (PROJECTS SUMMARY, PROJECTS OVERVIEW, DAILY TASKS) ── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* 1. Projects Summary / Top Delegations (DiBold Style) */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card elevation={0} sx={{ ...diboldCardSx, height: '100%', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.02rem', color: textPrimary, letterSpacing: '-0.015em' }}>
                                Projects Summary
                            </Typography>
                            <Button endIcon={<KeyboardArrowDownRoundedIcon />} sx={diboldPillSx}>
                                All
                            </Button>
                        </Box>

                        {/* Delegations List */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {topInstitutions.map((inst, idx) => {
                                const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
                                const color = colors[idx % colors.length];
                                const initial = inst.name ? inst.name.charAt(0).toUpperCase() : 'D';
                                const pct = Math.round((inst.count / maxInstCount) * 100);

                                return (
                                    <Box key={inst.name || idx}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        fontSize: '0.8rem',
                                                        fontWeight: 800,
                                                        bgcolor: `${color}15`,
                                                        color: color,
                                                        border: `1px solid ${color}30`,
                                                    }}
                                                >
                                                    {initial}
                                                </Avatar>
                                                <Box>
                                                    <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: textPrimary, lineHeight: 1.2 }}>
                                                        {inst.name.length > 20 ? inst.name.substring(0, 20) + '...' : inst.name}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 600 }}>
                                                        {inst.count} Members
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                onClick={onSwitchToTable}
                                                size="small"
                                                sx={{
                                                    ...diboldPillSx,
                                                    fontSize: '0.7rem',
                                                    px: 1.2,
                                                    py: 0.2,
                                                    minWidth: 'auto',
                                                }}
                                            >
                                                View
                                            </Button>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 700, minWidth: 65 }}>
                                                Progress {pct}%
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={pct}
                                                sx={{
                                                    flex: 1,
                                                    height: 5,
                                                    borderRadius: 3,
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#edf2f7',
                                                    '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 },
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Card>
                </Grid>

                {/* 2. Projects Overview / Multi-Ring Arcs (DiBold Style) */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card elevation={0} sx={{ ...diboldCardSx, height: '100%', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.02rem', color: textPrimary, letterSpacing: '-0.015em' }}>
                                Projects Overview
                            </Typography>
                            <Button endIcon={<KeyboardArrowDownRoundedIcon />} sx={diboldPillSx}>
                                Today
                            </Button>
                        </Box>

                        {/* Multi-Ring Concentric Arcs (Pure SVG DiBold Aesthetic) */}
                        <Box sx={{ position: 'relative', width: '100%', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="170" height="170" viewBox="0 0 170 170">
                                {/* Outer Ring (Blue: Pro Member) */}
                                <circle cx="85" cy="85" r="66" fill="none" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeWidth="10" />
                                <circle
                                    cx="85"
                                    cy="85"
                                    r="66"
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="10"
                                    strokeDasharray="414.69"
                                    strokeDashoffset="145"
                                    strokeLinecap="round"
                                    transform="rotate(-90 85 85)"
                                />

                                {/* Middle Ring (Green: Presenter) */}
                                <circle cx="85" cy="85" r="48" fill="none" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeWidth="10" />
                                <circle
                                    cx="85"
                                    cy="85"
                                    r="48"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="10"
                                    strokeDasharray="301.59"
                                    strokeDashoffset="138"
                                    strokeLinecap="round"
                                    transform="rotate(-90 85 85)"
                                />

                                {/* Inner Ring (Cyan: Student) */}
                                <circle cx="85" cy="85" r="30" fill="none" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeWidth="10" />
                                <circle
                                    cx="85"
                                    cy="85"
                                    r="30"
                                    fill="none"
                                    stroke="#06b6d4"
                                    strokeWidth="10"
                                    strokeDasharray="188.49"
                                    strokeDashoffset="116"
                                    strokeLinecap="round"
                                    transform="rotate(-90 85 85)"
                                />
                            </svg>
                        </Box>

                        {/* Breakdown Metrics */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, pt: 1.5, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#2563eb' }} />
                                    <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 700 }}>
                                        Pro Member
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: textPrimary }}>
                                    65%
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#10b981' }} />
                                    <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 700 }}>
                                        Presenter
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: textPrimary }}>
                                    54%
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#06b6d4' }} />
                                    <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 700 }}>
                                        Student & Dosen
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: textPrimary }}>
                                    38%
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* 3. Daily Tasks / Operational Checkpoints (DiBold Style) */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card elevation={0} sx={{ ...diboldCardSx, height: '100%', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.02rem', color: textPrimary, letterSpacing: '-0.015em' }}>
                                Daily Tasks
                            </Typography>
                            <Stack direction="row" spacing={0.8}>
                                <Button
                                    onClick={() => setTasksTab('today')}
                                    sx={{
                                        ...diboldPillSx,
                                        px: 1.2,
                                        py: 0.2,
                                        bgcolor: tasksTab === 'today' ? '#2563eb' : 'transparent',
                                        color: tasksTab === 'today' ? '#ffffff' : textSecondary,
                                        borderColor: tasksTab === 'today' ? '#2563eb' : cardBorder,
                                    }}
                                >
                                    Today
                                </Button>
                                <Button
                                    onClick={() => setTasksTab('week')}
                                    sx={{
                                        ...diboldPillSx,
                                        px: 1.2,
                                        py: 0.2,
                                        bgcolor: tasksTab === 'week' ? '#2563eb' : 'transparent',
                                        color: tasksTab === 'week' ? '#ffffff' : textSecondary,
                                        borderColor: tasksTab === 'week' ? '#2563eb' : cardBorder,
                                    }}
                                >
                                    This week
                                </Button>
                            </Stack>
                        </Box>

                        {/* Task Checklist Items */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                            {/* Task 1 */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#10b981', mt: 0.6 }} />
                                    <Box>
                                        <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: textPrimary, lineHeight: 1.2 }}>
                                            Gate Scanner Turnstile
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, my: 0.3 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: textSecondary, fontWeight: 600 }}>Due Today</Typography>
                                            <Chip label="High" size="small" sx={{ height: 16, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#fef2f2', color: '#dc2626' }} />
                                        </Box>
                                        <Typography sx={{ fontSize: '0.68rem', color: textMuted }}>
                                            Updated 2 hours ago &bull; <span style={{ color: textSecondary, cursor: 'pointer' }}>Edit &bull; Details</span>
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button onClick={onTriggerGateScanner} sx={{ ...diboldPillSx, fontSize: '0.7rem', px: 1.2, py: 0.2 }}>
                                    Open
                                </Button>
                            </Box>

                            {/* Task 2 */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#f59e0b', mt: 0.6 }} />
                                    <Box>
                                        <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: textPrimary, lineHeight: 1.2 }}>
                                            Corporate Debt Settlement
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, my: 0.3 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: textSecondary, fontWeight: 600 }}>Due Tomorrow</Typography>
                                            <Chip label="Medium" size="small" sx={{ height: 16, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#fffbeb', color: '#d97706' }} />
                                        </Box>
                                        <Typography sx={{ fontSize: '0.68rem', color: textMuted }}>
                                            Updated 5 hours ago &bull; <span style={{ color: textSecondary, cursor: 'pointer' }}>Edit &bull; Details</span>
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button onClick={onSwitchToTable} sx={{ ...diboldPillSx, fontSize: '0.7rem', px: 1.2, py: 0.2 }}>
                                    Open
                                </Button>
                            </Box>

                            {/* Task 3 */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <FiberManualRecordIcon sx={{ fontSize: 10, color: '#2563eb', mt: 0.6 }} />
                                    <Box>
                                        <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: textPrimary, lineHeight: 1.2 }}>
                                            E-Ticket Batch Auto-Mailer
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, my: 0.3 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: textSecondary, fontWeight: 600 }}>Due Today</Typography>
                                            <Chip label="High" size="small" sx={{ height: 16, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#eff6ff', color: '#2563eb' }} />
                                        </Box>
                                        <Typography sx={{ fontSize: '0.68rem', color: textMuted }}>
                                            Updated Today &bull; <span style={{ color: textSecondary, cursor: 'pointer' }}>Edit &bull; Details</span>
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button onClick={onSwitchToTable} sx={{ ...diboldPillSx, fontSize: '0.7rem', px: 1.2, py: 0.2 }}>
                                    Open
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── ROW 4: FINANCIAL OVERVIEW & HIGH VALUE DEALS TABLE (DIBOLD STYLE) ── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* 1. Overview Metrics Grid (DiBold Style) */}
                <Grid size={{ xs: 12, lg: 5.5 }}>
                    <Card elevation={0} sx={{ ...diboldCardSx, height: '100%', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: textPrimary, letterSpacing: '-0.015em' }}>
                                Overview
                            </Typography>
                            <Button endIcon={<KeyboardArrowDownRoundedIcon />} sx={diboldPillSx}>
                                All Time
                            </Button>
                        </Box>

                        {/* 4 Pill Metric Boxes */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.8, mb: 2.5 }}>
                            {/* Box 1 */}
                            <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: textSecondary }}>
                                        Docs in Pipeline
                                    </Typography>
                                    <Chip label="+4.2%" size="small" sx={{ height: 16, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#ecfdf5', color: '#10b981' }} />
                                </Box>
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: textPrimary }}>
                                    {stats.totalVisitors || 863} <span style={{ fontSize: '0.74rem', fontWeight: 600, color: textSecondary }}>{formatShortCurrency(totalPipelineRevenue)}</span>
                                </Typography>
                            </Box>

                            {/* Box 2 */}
                            <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: textSecondary }}>
                                        Quotes / Lunas
                                    </Typography>
                                    <Chip label="+8.5%" size="small" sx={{ height: 16, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#ecfdf5', color: '#10b981' }} />
                                </Box>
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: textPrimary }}>
                                    {lunasCount} <span style={{ fontSize: '0.74rem', fontWeight: 600, color: textSecondary }}>{formatShortCurrency(paidRevenue)}</span>
                                </Typography>
                            </Box>

                            {/* Box 3 */}
                            <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: textSecondary }}>
                                        SLA / Debt
                                    </Typography>
                                    <Chip label="-1.3%" size="small" sx={{ height: 16, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#fff7ed', color: '#ea580c' }} />
                                </Box>
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: textPrimary }}>
                                    {debtCount} <span style={{ fontSize: '0.74rem', fontWeight: 600, color: textSecondary }}>{formatShortCurrency(debtRevenue)}</span>
                                </Typography>
                            </Box>

                            {/* Box 4 */}
                            <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: textSecondary }}>
                                        SOW / Pending
                                    </Typography>
                                    <Chip label="Pending" size="small" sx={{ height: 16, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#fffbeb', color: '#d97706' }} />
                                </Box>
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: textPrimary }}>
                                    {pendingCount} <span style={{ fontSize: '0.74rem', fontWeight: 600, color: textSecondary }}>{formatShortCurrency(pendingRevenue)}</span>
                                </Typography>
                            </Box>
                        </Box>

                        {/* Lower Financial Row */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, pt: 1.5, borderTop: `1px solid ${cardBorder}` }}>
                            <Box>
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 600 }}>Net Value</Typography>
                                <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb' }}>
                                    {formatShortCurrency(totalPipelineRevenue)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 600 }}>Achieved</Typography>
                                <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: '#10b981' }}>
                                    {formatShortCurrency(paidRevenue)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 600 }}>Difference</Typography>
                                <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: '#ea580c' }}>
                                    {formatShortCurrency(debtRevenue)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 600 }}>Target</Typography>
                                <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: textPrimary }}>
                                    Rp 350M
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* 2. High Value Deals Table (DiBold Style with Royal Blue Header Bar) */}
                <Grid size={{ xs: 12, lg: 6.5 }}>
                    <Card elevation={0} sx={{ ...diboldCardSx, height: '100%', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: textPrimary, letterSpacing: '-0.015em' }}>
                                    High Value Deals
                                </Typography>
                                <Typography sx={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700 }}>
                                    Total Value: {formatShortCurrency(paidRevenue + debtRevenue)}
                                </Typography>
                            </Box>
                        </Box>

                        {/* DiBold Blue Header Table */}
                        <TableContainer sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#2563eb' }}>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem', py: 1.2, border: 'none' }}>
                                            Account Name
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem', py: 1.2, border: 'none' }}>
                                            Opportunity
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem', py: 1.2, border: 'none' }}>
                                            Deal Size
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem', py: 1.2, border: 'none' }}>
                                            Approvers
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.72rem', py: 1.2, border: 'none' }}>
                                            Pending Days
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {highValueInvoices.map((inv, idx) => (
                                        <TableRow
                                            key={inv.id || idx}
                                            sx={{
                                                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' },
                                                borderBottom: `1px solid ${cardBorder}`,
                                            }}
                                        >
                                            <TableCell sx={{ fontSize: '0.78rem', fontWeight: 800, color: textPrimary, py: 1.2, border: 'none' }}>
                                                {inv.institution}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.74rem', color: textSecondary, py: 1.2, border: 'none' }}>
                                                {inv.opportunity}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.78rem', fontWeight: 900, color: textPrimary, py: 1.2, border: 'none' }}>
                                                {formatShortCurrency(inv.deal_size)}
                                            </TableCell>
                                            <TableCell sx={{ py: 1.2, border: 'none' }}>
                                                <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 20, height: 20, fontSize: '0.6rem' } }}>
                                                    <Avatar sx={{ bgcolor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
                                                        {inv.pic ? inv.pic.charAt(0) : 'P'}
                                                    </Avatar>
                                                    <Avatar sx={{ bgcolor: '#3b82f6' }}>A</Avatar>
                                                </AvatarGroup>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.74rem', fontWeight: 700, color: inv.is_debt ? '#ea580c' : '#10b981', py: 1.2, border: 'none' }}>
                                                {String(inv.pending_days).padStart(2, '0')} {inv.is_debt ? 'Debt' : 'Lunas'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>

            {/* ── ROW 5: OPPORTUNITY INDEX & DEAL VALUE CHART (DIBOLD STYLE) ── */}
            <Grid container spacing={2.5}>
                {/* 1. Opportunity Index (DiBold Style) */}
                <Grid size={{ xs: 12, lg: 4.5 }}>
                    <Card elevation={0} sx={{ ...diboldCardSx, height: '100%', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: textPrimary, letterSpacing: '-0.015em' }}>
                                Opportunity Index
                            </Typography>
                        </Box>

                        {/* Center Circular Badge */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                            <Box
                                sx={{
                                    width: 140,
                                    height: 140,
                                    borderRadius: '50%',
                                    bgcolor: isDark ? 'rgba(37,99,235,0.1)' : '#eff6ff',
                                    border: `2px solid ${isDark ? '#2563eb' : '#bfdbfe'}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>
                                    Opportunity Index
                                </Typography>
                                <Typography sx={{ fontSize: '1.85rem', fontWeight: 900, color: textPrimary, lineHeight: 1.1, my: 0.3 }}>
                                    {Number(stats.totalVisitors || 863).toLocaleString('id-ID')}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Bottom 3 Summary Boxes */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.2, pt: 1.5, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 600 }}>Deals Won</Typography>
                                <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#10b981' }}>{lunasCount}</Typography>
                            </Box>
                            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 600 }}>In Progress</Typography>
                                <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#f59e0b' }}>{pendingCount}</Typography>
                            </Box>
                            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 600 }}>Deals Debt</Typography>
                                <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#ea580c' }}>{debtCount}</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* 2. Deal Value Chart (DiBold Style) */}
                <Grid size={{ xs: 12, lg: 7.5 }}>
                    <Card elevation={0} sx={{ ...diboldCardSx, height: '100%', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: textPrimary, letterSpacing: '-0.015em' }}>
                                Deal Value
                            </Typography>
                            <Button endIcon={<KeyboardArrowDownRoundedIcon />} sx={diboldPillSx}>
                                All Time
                            </Button>
                        </Box>

                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            {/* Left Column: 4 Clean Metric Chips */}
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ p: 1, px: 1.5, borderRadius: '10px', bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                                        <Typography sx={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700 }}>Deals Won</Typography>
                                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#2563eb' }}>{lunasCount}</Typography>
                                    </Box>
                                    <Box sx={{ p: 1, px: 1.5, borderRadius: '10px', bgcolor: '#fffbeb', border: '1px solid #fde68a' }}>
                                        <Typography sx={{ fontSize: '0.68rem', color: '#d97706', fontWeight: 700 }}>Solvency Rate</Typography>
                                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#d97706' }}>{solvencyRate}%</Typography>
                                    </Box>
                                    <Box sx={{ p: 1, px: 1.5, borderRadius: '10px', bgcolor: '#fff7ed', border: '1px solid #fed7aa' }}>
                                        <Typography sx={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: 700 }}>Debt Pipeline</Typography>
                                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#ea580c' }}>{debtCount}</Typography>
                                    </Box>
                                    <Box sx={{ p: 1, px: 1.5, borderRadius: '10px', bgcolor: '#f8fafc', border: `1px solid ${cardBorder}` }}>
                                        <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 700 }}>Close Velocity</Typography>
                                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: textPrimary }}>14 Days</Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Right Column: Column Bar Chart (Blue & Pink Columns like DiBold) */}
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <Box sx={{ width: '100%', height: 160, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', pb: 3, pt: 1, position: 'relative' }}>
                                    {[
                                        { month: 'Jul', blue: 30, pink: 15 },
                                        { month: 'Aug', blue: 50, pink: 20 },
                                        { month: 'Sep', blue: 40, pink: 25 },
                                        { month: 'Okt', blue: 75, pink: 35 },
                                        { month: 'Nov', blue: 110, pink: 45 },
                                    ].map((m) => (
                                        <Box key={m.month} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, position: 'relative' }}>
                                            <Stack direction="row" spacing={0.6} alignItems="flex-end">
                                                <Box sx={{ width: 10, height: m.blue, borderRadius: '5px', bgcolor: '#2563eb' }} />
                                                <Box sx={{ width: 10, height: m.pink, borderRadius: '5px', bgcolor: '#f43f5e' }} />
                                            </Stack>
                                            <Typography sx={{ position: 'absolute', bottom: -22, fontSize: '0.72rem', color: textSecondary, fontWeight: 700 }}>
                                                {m.month}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2.5, mt: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 9, color: '#2563eb' }} />
                                        <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 700 }}>Deals Won</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 9, color: '#f43f5e' }} />
                                        <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 700 }}>Deals Lost / Debt</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
