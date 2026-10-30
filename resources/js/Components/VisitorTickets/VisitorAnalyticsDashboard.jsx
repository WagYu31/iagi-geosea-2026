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
    Divider,
    Button,
    useTheme,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { motion } from 'motion/react';

// Icons
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import GroupWorkRoundedIcon from '@mui/icons-material/GroupWorkRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';

// Number Formatter Helper
const formatRupiah = (val) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
};

export default function VisitorAnalyticsDashboard({
    analytics = {},
    stats = {},
    isDark = false,
    onSwitchToTable = () => {},
    onTriggerGateScanner = () => {},
}) {
    const theme = useTheme();

    // Palette tokens tailored for executive aesthetics (21st.dev / tasteskill.dev)
    const cardBg = isDark ? '#141824' : '#ffffff';
    const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0';
    const textPrimary = isDark ? '#f8fafc' : '#0f172a';
    const textMuted = isDark ? '#94a3b8' : '#64748b';
    const surfaceHover = isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc';

    // Daily Trend Data formatting
    const dailyTrend = analytics.dailyTrend || [];
    const trendDates = dailyTrend.map((d) => d.date);
    const trendCounts = dailyTrend.map((d) => d.count);
    const totalTrendSum = trendCounts.reduce((acc, curr) => acc + curr, 0);
    const maxDaily = Math.max(...(trendCounts.length ? trendCounts : [0]));

    // Payment & Financial Health
    const paymentBreakdown = (analytics.paymentBreakdown || []).filter((p) => p.value > 0);
    const totalPaymentsCount = paymentBreakdown.reduce((acc, curr) => acc + curr.value, 0);
    const revenueBreakdown = analytics.revenueBreakdown || {};
    const paidRevenue = revenueBreakdown.paidRevenue || stats.totalRevenue || 0;
    const debtRevenue = revenueBreakdown.debtRevenue || 0;
    const pendingRevenue = revenueBreakdown.pendingRevenue || 0;

    // Categories Distribution
    const categoryDistribution = analytics.categoryDistribution || [];
    const topCategories = useMemo(() => {
        return [...categoryDistribution].slice(0, 8);
    }, [categoryDistribution]);

    // Top Institutions
    const topInstitutions = analytics.topInstitutions || [];
    const maxInstitutionCount = Math.max(...topInstitutions.map((i) => i.count), 1);

    // Gate & Email Readiness
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

    // Registration Source Distribution
    const sourceData = (analytics.sourceDistribution || []).filter((s) => s.value > 0);

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
            {/* ── TOP CONTROL BANNER & EXECUTIVE OVERVIEW ── */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 3,
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: '20px',
                    bgcolor: cardBg,
                    border: `1px solid ${cardBorder}`,
                    boxShadow: isDark
                        ? '0 10px 30px rgba(0,0,0,0.35)'
                        : '0 4px 20px rgba(15, 23, 42, 0.04)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
                                color: '#ffffff',
                                boxShadow: '0 6px 16px rgba(13, 122, 106, 0.3)',
                            }}
                        >
                            <TrendingUpRoundedIcon sx={{ fontSize: 22 }} />
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 900,
                                        letterSpacing: '-0.025em',
                                        color: textPrimary,
                                        fontSize: { xs: '1.2rem', sm: '1.4rem' },
                                    }}
                                >
                                    Visitor & Conference Analytics
                                </Typography>
                                <Chip
                                    label="REALTIME ENGINE"
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.06em',
                                        bgcolor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                                        color: '#10b981',
                                        border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : '#a7f3d0'}`,
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ color: textMuted, fontSize: '0.8rem', mt: 0.25 }}>
                                Comprehensive multi-dimensional intelligence: Registration velocity, gate check-in throughput, payment solvency, & corporate delegations.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                    <Button
                        variant="outlined"
                        onClick={onSwitchToTable}
                        startIcon={<ArrowOutwardRoundedIcon />}
                        sx={{
                            borderRadius: '12px',
                            fontWeight: 700,
                            textTransform: 'none',
                            fontSize: '0.82rem',
                            borderColor: cardBorder,
                            color: textPrimary,
                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                            '&:hover': {
                                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                                borderColor: '#0d7a6a',
                            },
                        }}
                    >
                        Buka Daftar Tiket (Tabel)
                    </Button>
                </Stack>
            </Box>

            {/* ── 5 EXECUTIVE KPI HIGHLIGHT CARDS ── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* 1. Total Registered Delegates */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 2.2,
                            borderRadius: '18px',
                            bgcolor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: '#059669',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(5, 150, 105, 0.12)',
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Total Registrations
                            </Typography>
                            <Box
                                sx={{
                                    p: 0.8,
                                    borderRadius: '10px',
                                    bgcolor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                                    color: '#059669',
                                }}
                            >
                                <PeopleAltRoundedIcon sx={{ fontSize: 20 }} />
                            </Box>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: '"Outfit", "Inter", sans-serif',
                                    fontSize: '1.85rem',
                                    fontWeight: 900,
                                    color: textPrimary,
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.03em',
                                }}
                            >
                                {Number(stats.totalVisitors || 0).toLocaleString('id-ID')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 1 }}>
                                <Chip
                                    label="100% Active"
                                    size="small"
                                    sx={{
                                        height: 18,
                                        fontSize: '0.62rem',
                                        fontWeight: 800,
                                        bgcolor: isDark ? 'rgba(16,185,129,0.12)' : '#dcfce7',
                                        color: '#15803d',
                                    }}
                                />
                                <Typography sx={{ fontSize: '0.72rem', color: textMuted }}>
                                    Delegates & Attendees
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* 2. Total Collected Revenue */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 2.2,
                            borderRadius: '18px',
                            bgcolor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: '#7c3aed',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.12)',
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Collected Revenue
                            </Typography>
                            <Box
                                sx={{
                                    p: 0.8,
                                    borderRadius: '10px',
                                    bgcolor: isDark ? 'rgba(124, 58, 237, 0.15)' : '#f5f3ff',
                                    color: '#7c3aed',
                                }}
                            >
                                <AccountBalanceWalletRoundedIcon sx={{ fontSize: 20 }} />
                            </Box>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: '"Outfit", "Inter", sans-serif',
                                    fontSize: '1.45rem',
                                    fontWeight: 900,
                                    color: '#7c3aed',
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.02em',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {formatRupiah(paidRevenue)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 1 }}>
                                <Typography sx={{ fontSize: '0.72rem', color: textMuted }}>
                                    Debt: <b style={{ color: '#ea580c' }}>{formatRupiah(debtRevenue)}</b>
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* 3. Gate Attendance Throughput */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 2.2,
                            borderRadius: '18px',
                            bgcolor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: '#0891b2',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(8, 145, 178, 0.12)',
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Gate Attendance
                            </Typography>
                            <Box
                                sx={{
                                    p: 0.8,
                                    borderRadius: '10px',
                                    bgcolor: isDark ? 'rgba(8, 145, 178, 0.15)' : '#ecfeff',
                                    color: '#0891b2',
                                }}
                            >
                                <HowToRegRoundedIcon sx={{ fontSize: 20 }} />
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography
                                    sx={{
                                        fontFamily: '"Outfit", "Inter", sans-serif',
                                        fontSize: '1.85rem',
                                        fontWeight: 900,
                                        color: textPrimary,
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {gate.checkedIn}
                                </Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: textMuted, fontWeight: 700 }}>
                                    / {gate.total} ({gate.percentage}%)
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 1.2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(100, Math.max(2, gate.percentage))}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: '#0891b2',
                                            borderRadius: 3,
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* 4. E-Ticket Delivery Success */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 2.2,
                            borderRadius: '18px',
                            bgcolor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: '#0d9488',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(13, 148, 136, 0.12)',
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                E-Ticket Delivery
                            </Typography>
                            <Box
                                sx={{
                                    p: 0.8,
                                    borderRadius: '10px',
                                    bgcolor: isDark ? 'rgba(13, 148, 136, 0.15)' : '#f0fdfa',
                                    color: '#0d9488',
                                }}
                            >
                                <MarkEmailReadRoundedIcon sx={{ fontSize: 20 }} />
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography
                                    sx={{
                                        fontFamily: '"Outfit", "Inter", sans-serif',
                                        fontSize: '1.85rem',
                                        fontWeight: 900,
                                        color: textPrimary,
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {email.sent}
                                </Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: textMuted, fontWeight: 700 }}>
                                    / {stats.totalVisitors || 0} ({email.percentage}%)
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 1.2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(100, Math.max(2, email.percentage))}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: '#0d9488',
                                            borderRadius: 3,
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* 5. Pending Verification & Debt Actions */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 2.2,
                            borderRadius: '18px',
                            bgcolor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: '#ea580c',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(234, 88, 12, 0.12)',
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Outstanding Action
                            </Typography>
                            <Box
                                sx={{
                                    p: 0.8,
                                    borderRadius: '10px',
                                    bgcolor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#fff7ed',
                                    color: '#ea580c',
                                }}
                            >
                                <WarningAmberRoundedIcon sx={{ fontSize: 20 }} />
                            </Box>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: '"Outfit", "Inter", sans-serif',
                                    fontSize: '1.85rem',
                                    fontWeight: 900,
                                    color: '#ea580c',
                                    lineHeight: 1.1,
                                }}
                            >
                                {stats.pendingVerificationCount || 0}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 1 }}>
                                <Chip
                                    label={`${stats.debtCount || 0} Debt Tickets`}
                                    size="small"
                                    sx={{
                                        height: 18,
                                        fontSize: '0.62rem',
                                        fontWeight: 800,
                                        bgcolor: isDark ? 'rgba(234, 88, 12, 0.12)' : '#ffedd5',
                                        color: '#c2410c',
                                    }}
                                />
                                <Typography sx={{ fontSize: '0.72rem', color: textMuted }}>
                                    Needs Audit
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── ROW 1: REGISTRATION VELOCITY (LINE/AREA) & PAYMENT DONUT ── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* 1. Daily Registration Velocity Curve */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, sm: 3 },
                            borderRadius: '20px',
                            bgcolor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            height: '100%',
                            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                        sx={{
                                            fontFamily: '"Outfit", "Inter", sans-serif',
                                            fontWeight: 800,
                                            fontSize: '1.1rem',
                                            color: textPrimary,
                                            letterSpacing: '-0.015em',
                                        }}
                                    >
                                        Daily Registration Velocity
                                    </Typography>
                                    <Chip
                                        label="Last 21 Days"
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                                            color: textMuted,
                                        }}
                                    />
                                </Box>
                                <Typography sx={{ fontSize: '0.78rem', color: textMuted, mt: 0.25 }}>
                                    Incoming participant influx curve over time with peak indicators.
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography sx={{ fontSize: '0.7rem', color: textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                                        Period Volume
                                    </Typography>
                                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: '#0d7a6a' }}>
                                        {totalTrendSum} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Delegates</span>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Chart Canvas */}
                        <Box sx={{ width: '100%', height: 320 }}>
                            {dailyTrend.length > 0 ? (
                                <LineChart
                                    xAxis={[{
                                        data: dailyTrend.map((_, i) => i),
                                        scaleType: 'point',
                                        valueFormatter: (idx) => dailyTrend[idx]?.date || '',
                                        tickLabelStyle: { fontSize: 10, fill: isDark ? '#9ca3af' : '#64748b' },
                                    }]}
                                    yAxis={[{
                                        tickMinStep: 1,
                                        tickLabelStyle: { fontSize: 10, fill: isDark ? '#9ca3af' : '#64748b' },
                                    }]}
                                    series={[{
                                        data: trendCounts,
                                        color: '#0d7a6a',
                                        area: true,
                                        curve: 'catmullRom',
                                        showMark: dailyTrend.length <= 25,
                                        valueFormatter: (v) => `${v} Delegates Registered`,
                                    }]}
                                    grid={{ horizontal: true }}
                                    margin={{ top: 20, bottom: 35, left: 45, right: 20 }}
                                    slotProps={{ legend: { hidden: true } }}
                                    sx={{
                                        '& .MuiChartsAxis-line': { stroke: cardBorder },
                                        '& .MuiChartsGrid-line': { stroke: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9' },
                                        '& .MuiAreaElement-root': {
                                            fill: 'url(#dailyVelocityGradient)',
                                        },
                                        '& .MuiLineElement-root': { strokeWidth: 3 },
                                    }}
                                >
                                    <defs>
                                        <linearGradient id="dailyVelocityGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#0d7a6a" stopOpacity={0.28} />
                                            <stop offset="100%" stopColor="#0d7a6a" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                </LineChart>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <Typography sx={{ color: textMuted, fontSize: '0.85rem' }}>No registration trend records yet</Typography>
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>

                {/* 2. Payment Solvency & Financial Health Donut */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, sm: 3 },
                            borderRadius: '20px',
                            bgcolor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            height: '100%',
                            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography
                                    sx={{
                                        fontFamily: '"Outfit", "Inter", sans-serif',
                                        fontWeight: 800,
                                        fontSize: '1.1rem',
                                        color: textPrimary,
                                        letterSpacing: '-0.015em',
                                    }}
                                >
                                    Payment Health
                                </Typography>
                                <Chip
                                    label={`${totalPaymentsCount} Invoices`}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        bgcolor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ecfdf5',
                                        color: '#059669',
                                    }}
                                />
                            </Box>
                            <Typography sx={{ fontSize: '0.78rem', color: textMuted, mb: 2 }}>
                                Invoice clearance ratio and verified settlements.
                            </Typography>

                            {/* Donut Chart with Centered Total */}
                            <Box sx={{ position: 'relative', width: '100%', height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {paymentBreakdown.length > 0 ? (
                                    <>
                                        <PieChart
                                            hideLegend={true}
                                            slots={{ legend: () => null }}
                                            series={[{
                                                data: paymentBreakdown,
                                                innerRadius: 58,
                                                outerRadius: 88,
                                                paddingAngle: 3,
                                                cornerRadius: 6,
                                                highlightScope: { fade: 'global', highlight: 'item' },
                                                valueFormatter: (item) => `${item.value} Invoices (${totalPaymentsCount > 0 ? ((item.value / totalPaymentsCount) * 100).toFixed(1) : 0}%)`,
                                            }]}
                                            margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                            height={210}
                                            sx={{
                                                '& .MuiChartsLegend-root': { display: 'none !important' },
                                                '& .MuiPieArc-root': {
                                                    stroke: isDark ? '#141824' : '#ffffff',
                                                    strokeWidth: 2.5,
                                                },
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                textAlign: 'center',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                SOLVENCY
                                            </Typography>
                                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
                                                {totalPaymentsCount > 0
                                                    ? `${Math.round(((paymentBreakdown.find((p) => p.label.includes('Approved'))?.value || 0) / totalPaymentsCount) * 100)}%`
                                                    : '0%'}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.62rem', color: textMuted, fontWeight: 600 }}>
                                                Settled
                                            </Typography>
                                        </Box>
                                    </>
                                ) : (
                                    <Typography sx={{ color: textMuted, fontSize: '0.85rem' }}>No payment records</Typography>
                                )}
                            </Box>
                        </Box>

                        {/* Breakdown Legend List */}
                        <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${cardBorder}` }}>
                            {paymentBreakdown.map((item) => (
                                <Box
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        py: 0.6,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: textPrimary }}>
                                            {item.label}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: textPrimary }}>
                                        {item.value}{' '}
                                        <span style={{ fontSize: '0.7rem', color: textMuted, fontWeight: 500 }}>
                                            ({totalPaymentsCount > 0 ? ((item.value / totalPaymentsCount) * 100).toFixed(0) : 0}%)
                                        </span>
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── ROW 2: PARTICIPANT CATEGORIES & TOP INSTITUTIONS ── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* 1. Top 10 Institutional & Corporate Delegations */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, sm: 3 },
                            borderRadius: '20px',
                            bgcolor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            height: '100%',
                            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BusinessRoundedIcon sx={{ color: '#0d7a6a', fontSize: 20 }} />
                                    <Typography
                                        sx={{
                                            fontFamily: '"Outfit", "Inter", sans-serif',
                                            fontWeight: 800,
                                            fontSize: '1.05rem',
                                            color: textPrimary,
                                            letterSpacing: '-0.015em',
                                        }}
                                    >
                                        Top 10 Delegations & Institutions
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontSize: '0.76rem', color: textMuted, mt: 0.25 }}>
                                    Leading corporate bodies, universities, and government agencies by delegate count.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Delegations Leaderboard */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mt: 2 }}>
                            {topInstitutions.length > 0 ? (
                                topInstitutions.map((inst, idx) => {
                                    const pct = Math.round((inst.count / maxInstitutionCount) * 100);
                                    const isTop3 = idx < 3;
                                    return (
                                        <Box
                                            key={inst.name}
                                            sx={{
                                                p: 1.25,
                                                px: 1.5,
                                                borderRadius: '12px',
                                                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                                border: `1px solid ${cardBorder}`,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.6,
                                                transition: 'all 0.15s ease',
                                                '&:hover': {
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                                                    borderColor: '#0d7a6a',
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0 }}>
                                                    <Box
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '6px',
                                                            bgcolor: isTop3
                                                                ? idx === 0
                                                                    ? '#f59e0b'
                                                                    : idx === 1
                                                                    ? '#94a3b8'
                                                                    : '#b45309'
                                                                : isDark
                                                                ? 'rgba(255,255,255,0.1)'
                                                                : '#e2e8f0',
                                                            color: isTop3 ? '#ffffff' : textMuted,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.72rem',
                                                            fontWeight: 900,
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {idx + 1}
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.84rem',
                                                            fontWeight: 700,
                                                            color: textPrimary,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {inst.name}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={`${inst.count} Delegasi`}
                                                    size="small"
                                                    sx={{
                                                        height: 22,
                                                        fontWeight: 800,
                                                        fontSize: '0.72rem',
                                                        bgcolor: isDark ? 'rgba(13, 122, 106, 0.2)' : '#e6f5f2',
                                                        color: '#0d7a6a',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={pct}
                                                sx={{
                                                    height: 4,
                                                    borderRadius: 2,
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: isTop3 ? '#0d7a6a' : '#3b82f6',
                                                        borderRadius: 2,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    );
                                })
                            ) : (
                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                    <Typography sx={{ color: textMuted, fontSize: '0.85rem' }}>Belum ada data institusi terdata</Typography>
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>

                {/* 2. Participant Categories Breakdown & Revenue Impact */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, sm: 3 },
                            borderRadius: '20px',
                            bgcolor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            height: '100%',
                            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LayersRoundedIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                                    <Typography
                                        sx={{
                                            fontFamily: '"Outfit", "Inter", sans-serif',
                                            fontWeight: 800,
                                            fontSize: '1.05rem',
                                            color: textPrimary,
                                            letterSpacing: '-0.015em',
                                        }}
                                    >
                                        Category Distribution & Revenue
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontSize: '0.76rem', color: textMuted, mt: 0.25 }}>
                                    Segmentation of participant categories with headcount and estimated contribution.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Category List */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mt: 2 }}>
                            {topCategories.map((cat, idx) => {
                                const maxCatCount = Math.max(...categoryDistribution.map((c) => c.count), 1);
                                const pct = Math.round((cat.count / maxCatCount) * 100);
                                return (
                                    <Box
                                        key={cat.visitor_type || idx}
                                        sx={{
                                            p: 1.2,
                                            px: 1.5,
                                            borderRadius: '12px',
                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                            border: `1px solid ${cardBorder}`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.5,
                                            transition: 'all 0.15s ease',
                                            '&:hover': {
                                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                                                borderColor: '#3b82f6',
                                            },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: textPrimary }}>
                                                {cat.label}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: textPrimary }}>
                                                    {cat.count} <span style={{ fontSize: '0.7rem', color: textMuted, fontWeight: 500 }}>Peserta</span>
                                                </Typography>
                                                {cat.est_revenue > 0 && (
                                                    <Chip
                                                        label={formatRupiah(cat.est_revenue)}
                                                        size="small"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: '0.68rem',
                                                            fontWeight: 800,
                                                            bgcolor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
                                                            color: '#2563eb',
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={pct}
                                            sx={{
                                                height: 4,
                                                borderRadius: 2,
                                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: '#3b82f6',
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── ROW 3: REGISTRATION SOURCE & OPERATIONAL READINESS ── */}
            <Grid container spacing={2.5}>
                {/* 1. Registration Channel Source Ratio */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, sm: 3 },
                            borderRadius: '20px',
                            bgcolor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            height: '100%',
                            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <GroupWorkRoundedIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                            <Typography
                                sx={{
                                    fontFamily: '"Outfit", "Inter", sans-serif',
                                    fontWeight: 800,
                                    fontSize: '1.05rem',
                                    color: textPrimary,
                                    letterSpacing: '-0.015em',
                                }}
                            >
                                Intake Channels Ratio
                            </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.76rem', color: textMuted, mb: 2 }}>
                            Online self-registration vs onsite desk vs corporate delegations.
                        </Typography>

                        <Box sx={{ position: 'relative', width: '100%', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {sourceData.length > 0 ? (
                                <PieChart
                                    hideLegend={true}
                                    slots={{ legend: () => null }}
                                    series={[{
                                        data: sourceData,
                                        innerRadius: 45,
                                        outerRadius: 72,
                                        paddingAngle: 3,
                                        cornerRadius: 5,
                                        valueFormatter: (item) => `${item.value} Peserta`,
                                    }]}
                                    margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                    height={180}
                                    sx={{
                                        '& .MuiPieArc-root': {
                                            stroke: isDark ? '#141824' : '#ffffff',
                                            strokeWidth: 2,
                                        },
                                    }}
                                />
                            ) : null}
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.2, mt: 1.5 }}>
                            {sourceData.map((src) => (
                                <Box
                                    key={src.id}
                                    sx={{
                                        p: 1,
                                        borderRadius: '10px',
                                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                        border: `1px solid ${cardBorder}`,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.2 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: src.color }} />
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: textMuted }}>
                                            {src.label}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: textPrimary, pl: 1.8 }}>
                                        {src.value}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>

                {/* 2. Operational Command & Gate Check-in Center */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, sm: 3 },
                            borderRadius: '20px',
                            bgcolor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            height: '100%',
                            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <QrCodeScannerRoundedIcon sx={{ color: '#0891b2', fontSize: 22 }} />
                                    <Typography
                                        sx={{
                                            fontFamily: '"Outfit", "Inter", sans-serif',
                                            fontWeight: 800,
                                            fontSize: '1.05rem',
                                            color: textPrimary,
                                            letterSpacing: '-0.015em',
                                        }}
                                    >
                                        Onsite Operational Readiness
                                    </Typography>
                                </Box>
                                <Chip
                                    label="VENUE PREPARED"
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.62rem',
                                        fontWeight: 800,
                                        bgcolor: isDark ? 'rgba(8, 145, 178, 0.15)' : '#ecfeff',
                                        color: '#0891b2',
                                    }}
                                />
                            </Box>
                            <Typography sx={{ fontSize: '0.76rem', color: textMuted, mb: 2.5 }}>
                                Realtime status of turnstile/barcode check-in counters and batch lanyard print readiness.
                            </Typography>

                            {/* Dual Gauge Comparison */}
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: '14px',
                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                            border: `1px solid ${cardBorder}`,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: textMuted, textTransform: 'uppercase', mb: 0.5 }}>
                                            Gate Check-In Throughput
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8, mb: 1 }}>
                                            <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: '#0891b2' }}>
                                                {gate.checkedIn}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.78rem', color: textMuted, fontWeight: 700 }}>
                                                / {gate.total} ({gate.percentage}%)
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(100, Math.max(3, gate.percentage))}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                                                '& .MuiLinearProgress-bar': { bgcolor: '#0891b2', borderRadius: 3 },
                                            }}
                                        />
                                        <Typography sx={{ fontSize: '0.7rem', color: textMuted, mt: 0.8 }}>
                                            {gate.notCheckedIn} delegates belum check-in
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: '14px',
                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                            border: `1px solid ${cardBorder}`,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: textMuted, textTransform: 'uppercase', mb: 0.5 }}>
                                            E-Ticket Email Delivery
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8, mb: 1 }}>
                                            <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: '#0d9488' }}>
                                                {email.sent}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.78rem', color: textMuted, fontWeight: 700 }}>
                                                / {stats.totalVisitors || 0} ({email.percentage}%)
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(100, Math.max(3, email.percentage))}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                                                '& .MuiLinearProgress-bar': { bgcolor: '#0d9488', borderRadius: 3 },
                                            }}
                                        />
                                        <Typography sx={{ fontSize: '0.7rem', color: textMuted, mt: 0.8 }}>
                                            {email.unsent} e-tickets antre dalam queue
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Quick Command Action Strip */}
                        <Box
                            sx={{
                                mt: 3,
                                pt: 2,
                                borderTop: `1px solid ${cardBorder}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: 1.5,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleRoundedIcon sx={{ color: '#10b981', fontSize: 18 }} />
                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: textPrimary }}>
                                    Lanyard template & QR payload siap dicetak massal
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                size="small"
                                onClick={onTriggerGateScanner}
                                startIcon={<QrCodeScannerRoundedIcon />}
                                sx={{
                                    bgcolor: '#0891b2',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: '0.78rem',
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(8, 145, 178, 0.25)',
                                    '&:hover': {
                                        bgcolor: '#0e7490',
                                    },
                                }}
                            >
                                Buka Gate Scanner
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
