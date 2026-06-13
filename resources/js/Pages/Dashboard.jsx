import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Paper,
    Avatar,
    LinearProgress,
    Chip,
    IconButton,
    Divider,
    Stack,
    alpha,
    useTheme,
    Snackbar,
    Alert,
} from '@mui/material';
import { Link } from '@inertiajs/react';
import ArticleIcon from '@mui/icons-material/Article';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { PieChart } from '@mui/x-charts/PieChart';
import CoachMark from '@/Components/CoachMark';

export default function Dashboard({ submissions = [], user }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const { flash } = usePage().props;
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

    useEffect(() => {
        if (flash?.error) {
            setSnackbar({ open: true, message: flash.error, severity: 'error' });
        }
    }, [flash?.error]);

    const totalSubmissions = submissions.length;
    const paidSubmissions = submissions.filter(s => s.payment_status === 'paid').length;
    const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
    const acceptedSubmissions = submissions.filter(s => s.status === 'accepted').length;
    const underReviewSubmissions = submissions.filter(s => s.status === 'under_review').length;
    const rejectedSubmissions = submissions.filter(s => ['rejected', 'declined'].includes(s.status)).length;
    const paymentProgress = totalSubmissions > 0 ? (paidSubmissions / totalSubmissions) * 100 : 0;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Stat cards data
    const statCards = [
        {
            title: 'Total Submissions',
            value: totalSubmissions,
            icon: <ArticleIcon />,
            color: '#1abc9c',
            bgColor: isDark ? 'rgba(26, 188, 156, 0.12)' : '#ecfdf5',
            trend: 'Total',
        },
        {
            title: 'Accepted Papers',
            value: acceptedSubmissions,
            icon: <CheckCircleIcon />,
            color: '#16a34a',
            bgColor: isDark ? 'rgba(22, 163, 74, 0.12)' : '#dcfce7',
            trend: 'Accepted',
        },
        {
            title: 'Under Review',
            value: pendingSubmissions,
            icon: <PendingIcon />,
            color: '#ea580c',
            bgColor: isDark ? 'rgba(234, 88, 12, 0.12)' : '#fff7ed',
            trend: 'Pending',
        },
        {
            title: 'Payment Completed',
            value: paidSubmissions,
            icon: <PaymentIcon />,
            color: '#2563eb',
            bgColor: isDark ? 'rgba(37, 99, 235, 0.12)' : '#eff6ff',
            trend: `${Math.round(paymentProgress)}%`,
        },
    ];

    // Pie chart data for submission status
    const pieData = totalSubmissions > 0
        ? [
            { id: 0, value: acceptedSubmissions, label: 'Accepted', color: '#16a34a' },
            { id: 1, value: pendingSubmissions, label: 'Pending', color: '#f59e0b' },
            { id: 2, value: underReviewSubmissions, label: 'In Review', color: '#3b82f6' },
            { id: 3, value: rejectedSubmissions, label: 'Rejected', color: '#ef4444' },
        ].filter(d => d.value > 0)
        : [{ id: 0, value: 1, label: 'No Data', color: '#e5e7eb' }];

    // Recent submissions (last 5)
    const recentSubmissions = [...submissions]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    const getStatusColor = (status) => {
        const map = {
            'pending': { bg: c.chipAmberBg, color: c.chipAmberText, label: 'Pending' },
            'under_review': { bg: c.chipBlueBg, color: c.chipBlueText, label: 'In Review' },
            'accepted': { bg: c.chipGreenBg, color: c.chipGreenText, label: 'Accepted' },
            'rejected': { bg: c.chipRedBg, color: c.chipRedText, label: 'Rejected' },
            'declined': { bg: c.chipRedBg, color: c.chipRedText, label: 'Declined' },
            'revision_required_phase1': { bg: c.chipAmberBg, color: c.chipAmberText, label: 'Revision' },
            'revision_required_phase2': { bg: c.chipAmberBg, color: c.chipAmberText, label: 'Revision' },
        };
        return map[status] || { bg: c.chipGrayBg, color: c.chipGrayText, label: status };
    };

    return (
        <SidebarLayout>
            <Head title="Dashboard" />

            <Box component="main" role="main" aria-label="Dashboard" sx={{
                p: { xs: 2, sm: 3.5 },
                minHeight: '100vh',
                bgcolor: c.surfaceBg,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '40%',
                    height: '40%',
                    background: 'radial-gradient(circle, rgba(26,188,156,0.05) 0%, rgba(26,188,156,0) 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '50%',
                    height: '50%',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.03) 0%, rgba(37,99,235,0) 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }
            }}>
                {/* Header Section */}
                <Box sx={{
                    position: 'relative',
                    borderRadius: '20px',
                    p: { xs: 3, sm: 4 },
                    mb: 4,
                    background: isDark
                        ? 'linear-gradient(135deg, rgba(13, 122, 106, 0.15) 0%, rgba(26, 188, 156, 0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(13, 122, 106, 0.06) 0%, rgba(32, 201, 151, 0.03) 100%)',
                    border: `1px solid ${isDark ? 'rgba(26, 188, 156, 0.15)' : 'rgba(13, 122, 106, 0.1)'}`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 3,
                    zIndex: 1,
                }}>
                    <Box sx={{ zIndex: 1 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: c.textPrimary,
                                fontSize: { xs: '1.6rem', sm: '2rem' },
                                letterSpacing: '-0.02em',
                                lineHeight: 1.2,
                                mb: 1,
                            }}
                        >
                            Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: c.textSecondary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: '0.875rem',
                            }}
                        >
                            <CalendarTodayIcon sx={{ fontSize: 16, color: '#1abc9c' }} />
                            {formattedDate}
                        </Typography>
                    </Box>
                    <Button
                        id="dashboard-submit-btn"
                        component={Link}
                        href={route('submissions.index')}
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                            px: 3.5,
                            py: 1.5,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            zIndex: 1,
                            boxShadow: '0 6px 20px rgba(26, 188, 156, 0.35)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)',
                                boxShadow: '0 8px 24px rgba(26, 188, 156, 0.45)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.25s ease',
                        }}
                    >
                        Submit New Paper
                    </Button>
                    {/* Decorative radial glows inside banner */}
                    <Box sx={{
                        position: 'absolute',
                        right: '-5%',
                        top: '-20%',
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(26, 188, 156, 0.15) 0%, rgba(26, 188, 156, 0) 70%)',
                        filter: 'blur(10px)',
                        pointerEvents: 'none',
                    }} />
                </Box>

                {/* Stat Cards */}
                <Grid id="dashboard-stats" container spacing={2.5} sx={{ mb: 4 }} role="region" aria-label="Submission Statistics">
                    {statCards.map((card, index) => (
                        <Grid size={{ xs: 6, sm: 6, lg: 3 }} key={index}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: '20px',
                                    border: isDark 
                                        ? '1px solid rgba(255, 255, 255, 0.06)' 
                                        : `1px solid ${alpha(card.color, 0.15)}`,
                                    bgcolor: isDark ? 'rgba(26, 29, 39, 0.6)' : '#ffffff',
                                    backdropFilter: 'blur(20px)',
                                    height: '100%',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        borderColor: card.color,
                                        boxShadow: isDark 
                                            ? `0 12px 30px rgba(0,0,0,0.4), 0 0 20px ${alpha(card.color, 0.15)}`
                                            : `0 12px 30px ${alpha(card.color, 0.12)}`,
                                        transform: 'translateY(-4px)',
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: `linear-gradient(90deg, ${alpha(card.color, 0.2)} 0%, ${card.color} 50%, ${alpha(card.color, 0.2)} 100%)`,
                                        opacity: 0.4,
                                        transition: 'all 0.3s ease',
                                    },
                                    '&:hover::before': {
                                        height: '4px',
                                        opacity: 1,
                                    }
                                }}
                            >
                                <CardContent sx={{ p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: { xs: 2.5, sm: 3 } } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: card.bgColor,
                                                width: { xs: 44, sm: 52 },
                                                height: { xs: 44, sm: 52 },
                                                borderRadius: '14px',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                transform: 'scale(1)',
                                                '.MuiCard-root:hover &': {
                                                    transform: 'scale(1.08) rotate(3deg)',
                                                }
                                            }}
                                            variant="rounded"
                                        >
                                            {React.cloneElement(card.icon, { sx: { color: card.color, fontSize: { xs: 22, sm: 26 } }, 'aria-hidden': true })}
                                        </Avatar>
                                        <Chip
                                            label={card.trend}
                                            size="small"
                                            sx={{
                                                bgcolor: card.bgColor,
                                                color: card.color,
                                                fontWeight: 800,
                                                fontSize: '0.7rem',
                                                height: 24,
                                                borderRadius: '6px',
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 800,
                                            color: c.textPrimary,
                                            mb: 0.5,
                                            fontSize: { xs: '1.75rem', sm: '2.25rem' },
                                            lineHeight: 1,
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        {card.value}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: c.textMuted,
                                            fontWeight: 600,
                                            fontSize: { xs: '0.75rem', sm: '0.825rem' },
                                        }}
                                    >
                                        {card.title}
                                    </Typography>
                                    {card.title === 'Payment Completed' && (
                                        <LinearProgress
                                            variant="determinate"
                                            value={paymentProgress}
                                            sx={{
                                                mt: 2,
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: isDark ? '#374151' : '#e5e7eb',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: card.color,
                                                    borderRadius: 3,
                                                },
                                            }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {/* Main Content Grid */}
                <Grid container spacing={2.5} sx={{ mb: 4 }} zIndex={1} position="relative">
                    {/* Chart Section */}
                    <Grid size={{ xs: 12, lg: 5 }} role="region" aria-label="Submission Overview Chart">
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: '20px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: isDark ? 'rgba(26, 29, 39, 0.6)' : '#ffffff',
                                backdropFilter: 'blur(20px)',
                                height: '100%',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.3)' : '0 12px 30px rgba(0,0,0,0.04)',
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(13, 122, 106, 0.15)',
                                }
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: c.textPrimary,
                                        mb: 0.5,
                                    }}
                                >
                                    Submission Overview
                                </Typography>
                                <Typography variant="body2" sx={{ color: c.textMuted, mb: 2.5, fontSize: '0.8rem' }}>
                                    Status distribution of your papers
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: 220,
                                }}>
                                    {totalSubmissions > 0 ? (
                                        <PieChart
                                            series={[{
                                                data: pieData,
                                                innerRadius: 55,
                                                outerRadius: 90,
                                                paddingAngle: 3,
                                                cornerRadius: 6,
                                                cx: 95,
                                            }]}
                                            width={320}
                                            height={220}
                                            slotProps={{
                                                legend: {
                                                    direction: 'column',
                                                    position: { vertical: 'middle', horizontal: 'right' },
                                                    padding: 0,
                                                    itemMarkWidth: 10,
                                                    itemMarkHeight: 10,
                                                    markGap: 6,
                                                    itemGap: 10,
                                                    labelStyle: {
                                                        fontSize: 13,
                                                        fontWeight: 500,
                                                        fill: c.textPrimary,
                                                    },
                                                },
                                            }}
                                        />
                                    ) : (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <DescriptionIcon sx={{ fontSize: 48, color: isDark ? '#374151' : '#d1d5db', mb: 1 }} />
                                            <Typography variant="body2" sx={{ color: c.textMuted }}>
                                                No submissions yet
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Submissions */}
                    <Grid size={{ xs: 12, lg: 7 }} role="region" aria-label="Recent Submissions">
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: '20px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: isDark ? 'rgba(26, 29, 39, 0.6)' : '#ffffff',
                                backdropFilter: 'blur(20px)',
                                height: '100%',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.3)' : '0 12px 30px rgba(0,0,0,0.04)',
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(13, 122, 106, 0.15)',
                                }
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                color: c.textPrimary,
                                                mb: 0.5,
                                            }}
                                        >
                                            Recent Submissions
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                                            Your latest paper submissions
                                        </Typography>
                                    </Box>
                                    <Button
                                        component={Link}
                                        href={route('submissions.index')}
                                        size="small"
                                        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                            color: '#1abc9c',
                                            borderRadius: '8px',
                                            px: 2,
                                            py: 0.75,
                                            bgcolor: isDark ? 'rgba(26,188,156,0.08)' : 'rgba(26,188,156,0.04)',
                                            border: `1px solid ${isDark ? 'rgba(26,188,156,0.2)' : 'rgba(26,188,156,0.1)'}`,
                                            '&:hover': {
                                                bgcolor: '#1abc9c',
                                                color: '#ffffff',
                                                borderColor: '#1abc9c',
                                                transform: 'translateY(-1px)',
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        View All
                                    </Button>
                                </Box>

                                {recentSubmissions.length > 0 ? (
                                    <Stack spacing={0.75} divider={<Divider sx={{ borderColor: c.cardBorder, opacity: 0.5 }} />} role="list" aria-label="Recent paper submissions">
                                        {recentSubmissions.map((sub, idx) => {
                                            const status = getStatusColor(sub.status);
                                            return (
                                                <Box
                                                    key={sub.id || idx}
                                                    component={Link}
                                                    href={route('submissions.show', sub.id)}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        py: 1.5,
                                                        px: 1.5,
                                                        borderRadius: '12px',
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        '&:hover': {
                                                            bgcolor: c.rowHover,
                                                            transform: 'translateX(6px)',
                                                        },
                                                    }}
                                                >
                                                    <Avatar
                                                        variant="rounded"
                                                        sx={{
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                                            width: 44,
                                                            height: 44,
                                                            borderRadius: '12px',
                                                            flexShrink: 0,
                                                            border: `1px solid ${c.cardBorder}`,
                                                            transition: 'all 0.3s ease',
                                                            '.MuiBox-root:hover &': {
                                                                bgcolor: isDark ? 'rgba(26, 188, 156, 0.12)' : '#ecfdf5',
                                                                borderColor: '#1abc9c',
                                                            }
                                                        }}
                                                    >
                                                        <DescriptionIcon sx={{ 
                                                            color: isDark ? '#9ca3af' : '#6b7280', 
                                                            fontSize: 22,
                                                            transition: 'all 0.3s ease',
                                                            '.MuiBox-root:hover &': {
                                                                color: '#1abc9c',
                                                            }
                                                        }} />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 700,
                                                                color: c.textPrimary,
                                                                fontSize: '0.875rem',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                mb: 0.25,
                                                            }}
                                                        >
                                                            {sub.title || 'Untitled Paper'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.75rem', fontWeight: 500 }}>
                                                            {sub.submission_code || '—'} • {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={status.label}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: status.bg,
                                                            color: status.color,
                                                            fontWeight: 800,
                                                            fontSize: '0.65rem',
                                                            height: 24,
                                                            borderRadius: '6px',
                                                            flexShrink: 0,
                                                            border: `1px solid ${status.color}33`,
                                                            letterSpacing: '0.02em',
                                                            textTransform: 'uppercase',
                                                        }}
                                                    />
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 6 }}>
                                        <DescriptionIcon sx={{ fontSize: 48, color: isDark ? '#374151' : '#d1d5db', mb: 1.5 }} />
                                        <Typography variant="body2" sx={{ color: c.textMuted }}>
                                            No submissions yet
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Quick Actions Title */}
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 700, 
                        fontSize: '1.05rem', 
                        color: c.textPrimary, 
                        mb: 2.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        zIndex: 1,
                        position: 'relative'
                    }}
                >
                    ⚡ Quick Actions
                </Typography>
                
                {/* Quick Actions Grid */}
                <Grid id="dashboard-quick-actions" container spacing={2.5} sx={{ mb: 4 }} zIndex={1} position="relative">
                    {/* Submit Paper Tile */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                            component={Link}
                            href={route('submissions.index')}
                            elevation={0}
                            sx={{
                                borderRadius: '20px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: isDark ? 'rgba(26,29,39,0.6)' : '#ffffff',
                                backdropFilter: 'blur(20px)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                p: 3,
                                gap: 2.5,
                                height: '100%',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    borderColor: '#1abc9c',
                                    boxShadow: isDark 
                                        ? '0 12px 30px rgba(26,188,156,0.12)' 
                                        : '0 12px 30px rgba(26,188,156,0.08)',
                                }
                            }}
                        >
                            <Box sx={{
                                width: 52, height: 52,
                                borderRadius: '14px',
                                bgcolor: isDark ? 'rgba(26, 188, 156, 0.12)' : '#ecfdf5',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#1abc9c',
                                transition: 'all 0.3s ease',
                                '.MuiCard-root:hover &': {
                                    bgcolor: '#1abc9c',
                                    color: '#ffffff',
                                }
                            }}>
                                <AddIcon sx={{ fontSize: 26 }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.95rem', mb: 0.5 }}>
                                    Submit New Paper
                                </Typography>
                                <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem', fontWeight: 500 }}>
                                    Start your research submission
                                </Typography>
                            </Box>
                            <ArrowForwardIcon className="action-arrow" sx={{
                                color: c.textMuted,
                                fontSize: 20,
                                transition: 'all 0.3s ease',
                                '.MuiCard-root:hover &': {
                                    color: '#1abc9c',
                                    transform: 'translateX(4px)',
                                }
                            }} />
                        </Card>
                    </Grid>

                    {/* View All Submissions Tile */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                            component={Link}
                            href={route('submissions.index')}
                            elevation={0}
                            sx={{
                                borderRadius: '20px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: isDark ? 'rgba(26,29,39,0.6)' : '#ffffff',
                                backdropFilter: 'blur(20px)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                p: 3,
                                gap: 2.5,
                                height: '100%',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    borderColor: '#1abc9c',
                                    boxShadow: isDark 
                                        ? '0 12px 30px rgba(26,188,156,0.12)' 
                                        : '0 12px 30px rgba(26,188,156,0.08)',
                                }
                            }}
                        >
                            <Box sx={{
                                width: 52, height: 52,
                                borderRadius: '14px',
                                bgcolor: isDark ? 'rgba(26, 188, 156, 0.12)' : '#ecfdf5',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#1abc9c',
                                transition: 'all 0.3s ease',
                                '.MuiCard-root:hover &': {
                                    bgcolor: '#1abc9c',
                                    color: '#ffffff',
                                }
                            }}>
                                <ListAltIcon sx={{ fontSize: 26 }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.95rem', mb: 0.5 }}>
                                    View All Submissions
                                </Typography>
                                <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem', fontWeight: 500 }}>
                                    Monitor status of active papers
                                </Typography>
                            </Box>
                            <ArrowForwardIcon className="action-arrow" sx={{
                                color: c.textMuted,
                                fontSize: 20,
                                transition: 'all 0.3s ease',
                                '.MuiCard-root:hover &': {
                                    color: '#1abc9c',
                                    transform: 'translateX(4px)',
                                }
                            }} />
                        </Card>
                    </Grid>

                    {/* Manage Payments Tile */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                            component={Link}
                            href={route('payments.index')}
                            elevation={0}
                            sx={{
                                borderRadius: '20px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: isDark ? 'rgba(26,29,39,0.6)' : '#ffffff',
                                backdropFilter: 'blur(20px)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                p: 3,
                                gap: 2.5,
                                height: '100%',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    borderColor: '#2563eb',
                                    boxShadow: isDark 
                                        ? '0 12px 30px rgba(37,99,235,0.12)' 
                                        : '0 12px 30px rgba(37,99,235,0.08)',
                                }
                            }}
                        >
                            <Box sx={{
                                width: 52, height: 52,
                                borderRadius: '14px',
                                bgcolor: isDark ? 'rgba(37, 99, 235, 0.12)' : '#eff6ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: isDark ? '#60a5fa' : '#2563eb',
                                transition: 'all 0.3s ease',
                                '.MuiCard-root:hover &': {
                                    bgcolor: '#2563eb',
                                    color: '#ffffff',
                                }
                            }}>
                                <AccountBalanceWalletIcon sx={{ fontSize: 26 }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.95rem', mb: 0.5 }}>
                                    Manage Payments
                                </Typography>
                                <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem', fontWeight: 500 }}>
                                    Complete payment & view invoices
                                </Typography>
                            </Box>
                            <ArrowForwardIcon className="action-arrow" sx={{
                                color: c.textMuted,
                                fontSize: 20,
                                transition: 'all 0.3s ease',
                                '.MuiCard-root:hover &': {
                                    color: '#2563eb',
                                    transform: 'translateX(4px)',
                                }
                            }} />
                        </Card>
                    </Grid>
                </Grid>

                {/* Welcome Message for New Users */}
                {submissions.length === 0 && (
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: '16px',
                            border: `2px dashed ${isDark ? '#374151' : '#e5e7eb'}`,
                            bgcolor: c.surfaceBg,
                            textAlign: 'center',
                        }}
                    >
                        <CardContent sx={{ py: 6, px: 4 }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '20px',
                                    bgcolor: isDark ? 'rgba(26, 188, 156, 0.1)' : '#ecfdf5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 2.5,
                                }}
                            >
                                <DescriptionIcon sx={{ fontSize: 40, color: '#1abc9c' }} />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: c.textPrimary,
                                    mb: 1,
                                    fontSize: '1.15rem',
                                }}
                            >
                                Ready to submit your first paper?
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: c.textSecondary,
                                    mb: 3,
                                    maxWidth: '500px',
                                    mx: 'auto',
                                    lineHeight: 1.6,
                                }}
                            >
                                Get started with IAGI-GEOSEA 2026! Click the button above to submit your paper and join the conference.
                            </Typography>
                            <Button
                                component={Link}
                                href={route('submissions.index')}
                                variant="contained"
                                startIcon={<AddIcon />}
                                sx={{
                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                    px: 4,
                                    py: 1.2,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 14px rgba(26, 188, 156, 0.35)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)',
                                        boxShadow: '0 6px 20px rgba(26, 188, 156, 0.45)',
                                    },
                                }}
                            >
                                Submit Your First Paper
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </Box>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} role="alert">
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '10px', fontWeight: 600 }} role="alert">{snackbar.message}</Alert>
            </Snackbar>

            {/* Coach Mark - Guided Tour */}
            <CoachMark
                tourId="dashboard-author"
                steps={[
                    {
                        target: '#dashboard-submit-btn',
                        title: '📝 Submit New Paper',
                        description: 'Start here! Click this button to go to the submission page and submit your paper for the conference.',
                        position: 'bottom',
                    },
                    {
                        target: '#dashboard-stats',
                        title: '📊 Your Statistics',
                        description: 'Track your progress at a glance — total submissions, accepted papers, reviews in progress, and payment status.',
                        position: 'bottom',
                    },
                    {
                        target: '#dashboard-quick-actions',
                        title: '⚡ Quick Actions',
                        description: 'Use these shortcuts to quickly navigate to submissions, view all papers, or manage your payments.',
                        position: 'top',
                    },
                ]}
            />
        </SidebarLayout>
    );
}
