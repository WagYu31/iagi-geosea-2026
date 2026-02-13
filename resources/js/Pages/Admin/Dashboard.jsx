import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Head } from '@inertiajs/react';
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
    Chip,
    Divider,
    Stack,
    LinearProgress,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
    Tooltip,
    useTheme,
} from '@mui/material';
import { Link } from '@inertiajs/react';
import ArticleIcon from '@mui/icons-material/Article';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GetAppIcon from '@mui/icons-material/GetApp';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

export default function AdminDashboard({ analytics, recentSubmissions = [], pendingPayments = 0, submissionsPerTopic = [], participantStats = {}, submissionsPerTopicByParticipant = [], visitorAnalytics = {}, dailyVisitors = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const [categoryFilter, setCategoryFilter] = useState('all');
    const [participantFilter, setParticipantFilter] = useState('all');

    // Visitor analytics state with auto-refresh
    const [visitorPeriod, setVisitorPeriod] = useState('30d');
    const [liveStats, setLiveStats] = useState(visitorAnalytics);
    const [liveChartData, setLiveChartData] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshTimerRef = useRef(null);

    const fetchVisitorData = useCallback((period) => {
        setIsRefreshing(true);
        fetch(`/admin/visitor-analytics?period=${period}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        })
            .then(res => {
                if (!res.ok) throw new Error('API error');
                return res.json();
            })
            .then(data => {
                if (data?.stats) setLiveStats(data.stats);
                setLiveChartData(data?.chartData || []);
                setLastUpdated(new Date());
                setIsRefreshing(false);
            })
            .catch(() => setIsRefreshing(false));
    }, []);

    useEffect(() => {
        fetchVisitorData(visitorPeriod);
        refreshTimerRef.current = setInterval(() => fetchVisitorData(visitorPeriod), 10000);
        return () => clearInterval(refreshTimerRef.current);
    }, [visitorPeriod, fetchVisitorData]);

    const handlePeriodChange = (period) => {
        setVisitorPeriod(period);
    };

    // Submission analytics state with auto-refresh
    const [subPeriod, setSubPeriod] = useState('30d');
    const [subStats, setSubStats] = useState({ today: 0, last7days: 0, last30days: 0, total: analytics?.totalSubmissions || 0 });
    const [subChartData, setSubChartData] = useState([]);
    const [subLastUpdated, setSubLastUpdated] = useState(new Date());
    const [isSubRefreshing, setIsSubRefreshing] = useState(false);
    const subRefreshTimerRef = useRef(null);

    const fetchSubData = useCallback((period) => {
        setIsSubRefreshing(true);
        fetch(`/admin/submission-analytics?period=${period}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        })
            .then(res => {
                if (!res.ok) throw new Error('API error');
                return res.json();
            })
            .then(data => {
                if (data?.stats) setSubStats(data.stats);
                setSubChartData(data?.chartData || []);
                setSubLastUpdated(new Date());
                setIsSubRefreshing(false);
            })
            .catch(() => setIsSubRefreshing(false));
    }, []);

    useEffect(() => {
        fetchSubData(subPeriod);
        subRefreshTimerRef.current = setInterval(() => fetchSubData(subPeriod), 15000);
        return () => clearInterval(subRefreshTimerRef.current);
    }, [subPeriod, fetchSubData]);

    const handleSubPeriodChange = (period) => {
        setSubPeriod(period);
    };

    const totalSubmissions = analytics?.totalSubmissions || 0;
    const pendingReviews = analytics?.pendingReviews || 0;
    const verifiedPayments = analytics?.verifiedPayments || 0;
    const acceptedSubmissions = analytics?.acceptedSubmissions || 0;
    const rejectedSubmissions = analytics?.rejectedSubmissions || 0;
    const totalUsers = analytics?.totalUsers || 0;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Stat cards config
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
            title: 'Pending Reviews',
            value: pendingReviews,
            icon: <PendingIcon />,
            color: '#ea580c',
            bgColor: isDark ? 'rgba(234, 88, 12, 0.12)' : '#fff7ed',
            trend: 'Pending',
        },
        {
            title: 'Verified Payments',
            value: verifiedPayments,
            icon: <PaymentIcon />,
            color: '#2563eb',
            bgColor: isDark ? 'rgba(37, 99, 235, 0.12)' : '#eff6ff',
            trend: 'Verified',
        },
        {
            title: 'Total Authors',
            value: totalUsers,
            icon: <PeopleIcon />,
            color: '#9333ea',
            bgColor: isDark ? 'rgba(147, 51, 234, 0.12)' : '#faf5ff',
            trend: 'Authors',
        },
    ];

    // Quick actions config
    const quickActions = [
        {
            label: 'Workflow Control',
            href: route('admin.submissions'),
            icon: <AssignmentIcon />,
            color: '#1abc9c',
            bgColor: isDark ? 'rgba(26, 188, 156, 0.12)' : '#ecfdf5',
            primary: true,
        },
        {
            label: 'Reviewer Assignment',
            href: route('admin.submissions'),
            icon: <DescriptionIcon />,
            color: '#0891b2',
            bgColor: isDark ? 'rgba(8, 145, 178, 0.12)' : '#ecfeff',
        },
        {
            label: 'Database Export',
            href: route('admin.export'),
            icon: <GetAppIcon />,
            color: '#2563eb',
            bgColor: isDark ? 'rgba(37, 99, 235, 0.12)' : '#eff6ff',
        },
        {
            label: 'Payment Validation',
            href: route('admin.payments'),
            icon: <PaymentIcon />,
            color: '#ea580c',
            bgColor: isDark ? 'rgba(234, 88, 12, 0.12)' : '#fff7ed',
        },
        {
            label: 'Manage Users',
            href: route('admin.users'),
            icon: <PeopleIcon />,
            color: '#9333ea',
            bgColor: isDark ? 'rgba(147, 51, 234, 0.12)' : '#faf5ff',
        },
        {
            label: 'Landing Settings',
            href: route('admin.settings'),
            icon: <SettingsIcon />,
            color: '#6b7280',
            bgColor: isDark ? 'rgba(107, 114, 128, 0.12)' : '#f3f4f6',
        },
    ];

    // Filter submissions by presentation category and participant category
    const filteredSubmissionsPerTopic = useMemo(() => {
        const dataSource = submissionsPerTopicByParticipant;
        if (!dataSource || dataSource.length === 0) return [];

        let filtered = dataSource;
        if (participantFilter !== 'all') {
            filtered = dataSource.map(item => ({
                ...item,
                count: item[participantFilter] || 0
            })).filter(item => item.count > 0);
        }

        if (categoryFilter !== 'all') {
            const countKey = `${categoryFilter}_count`;
            filtered = filtered.map(item => ({
                ...item,
                count: item[countKey] || 0
            })).filter(item => item.count > 0);
        }

        return filtered;
    }, [submissionsPerTopic, submissionsPerTopicByParticipant, categoryFilter, participantFilter]);

    const getStatusChip = (status) => {
        const map = {
            'pending': { bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7', color: '#d97706', label: 'Pending' },
            'under_review': { bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe', color: '#2563eb', label: 'In Review' },
            'accepted': { bg: isDark ? 'rgba(22, 163, 74, 0.15)' : '#dcfce7', color: '#16a34a', label: 'Accepted' },
            'rejected': { bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', color: '#dc2626', label: 'Rejected' },
            'declined': { bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', color: '#dc2626', label: 'Declined' },
        };
        return map[status] || { bg: isDark ? 'rgba(107, 114, 128, 0.15)' : '#f3f4f6', color: '#6b7280', label: status };
    };

    const toggleSx = (selectedColor) => ({
        px: { xs: 1.5, sm: 2.5 },
        py: 0.8,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: { xs: '0.75rem', sm: '0.8rem' },
        borderRadius: '8px !important',
        border: 'none !important',
        color: c.textSecondary,
        '&.Mui-selected': {
            backgroundColor: selectedColor,
            color: 'white',
            boxShadow: `0 2px 8px ${selectedColor}40`,
            '&:hover': {
                backgroundColor: selectedColor,
                opacity: 0.9,
            },
        },
    });

    return (
        <SidebarLayout>
            <Head title="Admin Dashboard" />

            <Box sx={{
                p: { xs: 2, sm: 3, md: 3.5 },
                minHeight: '100vh',
                bgcolor: c.surfaceBg,
            }}>
                {/* Header Section */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    mb: 3.5,
                    gap: 2,
                }}>
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: c.textPrimary,
                                fontSize: { xs: '1.5rem', sm: '1.85rem' },
                                letterSpacing: '-0.02em',
                                lineHeight: 1.2,
                            }}
                        >
                            Admin Dashboard 🛡️
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: c.textSecondary,
                                mt: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.75,
                                fontSize: '0.875rem',
                            }}
                        >
                            <CalendarTodayIcon sx={{ fontSize: 15 }} />
                            {formattedDate}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button
                            component={Link}
                            href={route('admin.submissions')}
                            variant="contained"
                            startIcon={<AssignmentIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                px: 3,
                                py: 1.2,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                boxShadow: '0 4px 14px rgba(26, 188, 156, 0.35)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)',
                                    boxShadow: '0 6px 20px rgba(26, 188, 156, 0.45)',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.25s ease',
                            }}
                        >
                            Manage Papers
                        </Button>
                    </Box>
                </Box>

                {/* Stat Cards */}
                <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                    {statCards.map((card, index) => (
                        <Grid size={{ xs: 6, sm: 6, lg: 3 }} key={index}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: '16px',
                                    border: `1px solid ${c.cardBorder}`,
                                    bgcolor: c.cardBg,
                                    height: '100%',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        borderColor: card.color,
                                        boxShadow: `0 8px 25px ${card.color}18`,
                                        transform: 'translateY(-3px)',
                                    },
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: card.color,
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease',
                                    },
                                    '&:hover::after': {
                                        opacity: 1,
                                    },
                                }}
                            >
                                <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: card.bgColor,
                                                width: { xs: 40, sm: 48 },
                                                height: { xs: 40, sm: 48 },
                                                borderRadius: '12px',
                                            }}
                                            variant="rounded"
                                        >
                                            {React.cloneElement(card.icon, { sx: { color: card.color, fontSize: { xs: 20, sm: 24 } } })}
                                        </Avatar>
                                        <Chip
                                            label={card.trend}
                                            size="small"
                                            sx={{
                                                bgcolor: card.bgColor,
                                                color: card.color,
                                                fontWeight: 700,
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
                                            mb: 0.25,
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
                                            fontWeight: 500,
                                            fontSize: { xs: '0.75rem', sm: '0.825rem' },
                                        }}
                                    >
                                        {card.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Visitor Analytics — Google Analytics Style */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: '12px',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#dadce0'}`,
                        bgcolor: c.cardBg,
                        mb: 3.5,
                        overflow: 'hidden',
                    }}
                >
                    {/* GA Header */}
                    <Box sx={{
                        px: { xs: 2, sm: 3 },
                        pt: { xs: 2, sm: 2.5 },
                        pb: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1,
                    }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: c.textPrimary }}>
                                    Website Visitors
                                </Typography>
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', gap: 0.5,
                                    px: 1, py: 0.25,
                                    bgcolor: isDark ? 'rgba(34,197,94,0.15)' : '#f0fdf4',
                                    borderRadius: '4px',
                                    border: `1px solid ${isDark ? 'rgba(34,197,94,0.3)' : '#bbf7d0'}`,
                                }}>
                                    <Box sx={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        bgcolor: '#22c55e',
                                        animation: 'gaPulse 2s ease-in-out infinite',
                                        '@keyframes gaPulse': {
                                            '0%, 100%': { opacity: 1 },
                                            '50%': { opacity: 0.4 },
                                        },
                                    }} />
                                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        Live
                                    </Typography>
                                </Box>
                                {isRefreshing && (
                                    <Box sx={{
                                        width: 14, height: 14, borderRadius: '50%',
                                        border: '2px solid #1a73e8',
                                        borderTopColor: 'transparent',
                                        animation: 'gaSpin 0.8s linear infinite',
                                        '@keyframes gaSpin': { to: { transform: 'rotate(360deg)' } },
                                    }} />
                                )}
                            </Box>
                            <Typography sx={{ fontSize: '0.72rem', color: c.textMuted }}>
                                Landing page traffic · Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </Typography>
                        </Box>
                        {/* Period pills */}
                        <Box sx={{
                            display: 'flex',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#dadce0'}`,
                            borderRadius: '8px',
                            overflow: 'hidden',
                        }}>
                            {[
                                { key: 'today', label: 'Today' },
                                { key: '7d', label: '7 days' },
                                { key: '30d', label: '30 days' },
                            ].map((tab, i) => (
                                <Button
                                    key={tab.key}
                                    size="small"
                                    onClick={() => handlePeriodChange(tab.key)}
                                    sx={{
                                        px: { xs: 1.5, sm: 2 }, py: 0.5,
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        minWidth: 'auto',
                                        borderRadius: 0,
                                        borderRight: i < 2 ? `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#dadce0'}` : 'none',
                                        ...(visitorPeriod === tab.key ? {
                                            bgcolor: isDark ? 'rgba(66,133,244,0.15)' : '#e8f0fe',
                                            color: '#1a73e8',
                                        } : {
                                            color: c.textMuted,
                                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fa' },
                                        }),
                                    }}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* GA Metric Cards Row */}
                    <Box sx={{
                        display: 'flex',
                        px: { xs: 1, sm: 3 },
                        pt: 2.5,
                        pb: 0,
                        gap: 0,
                        overflowX: 'auto',
                    }}>
                        {[
                            { key: 'today', label: 'Today', value: liveStats.today || 0, color: '#1a73e8' },
                            { key: '7d', label: 'Last 7 days', value: liveStats.last7days || 0, color: '#e8710a' },
                            { key: '30d', label: 'Last 30 days', value: liveStats.last30days || 0, color: '#1e8e3e' },
                            { key: 'all', label: 'All time', value: liveStats.total || 0, color: '#9334e6' },
                        ].map((metric) => (
                            <Box
                                key={metric.key}
                                onClick={() => metric.key !== 'all' && handlePeriodChange(metric.key)}
                                sx={{
                                    flex: 1,
                                    minWidth: 110,
                                    px: 2,
                                    py: 1.5,
                                    cursor: metric.key !== 'all' ? 'pointer' : 'default',
                                    borderBottom: `3px solid ${visitorPeriod === metric.key ? metric.color : 'transparent'
                                        }`,
                                    transition: 'all 0.15s ease',
                                    '&:hover': metric.key !== 'all' ? {
                                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
                                    } : {},
                                }}
                            >
                                <Typography sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 500,
                                    color: visitorPeriod === metric.key ? metric.color : c.textMuted,
                                    mb: 0.5,
                                    whiteSpace: 'nowrap',
                                }}>
                                    {metric.label}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '1.75rem',
                                    fontWeight: 700,
                                    color: visitorPeriod === metric.key ? metric.color : c.textPrimary,
                                    lineHeight: 1,
                                    letterSpacing: '-0.02em',
                                }}>
                                    {metric.value.toLocaleString()}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Divider */}
                    <Box sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'}`, mx: { xs: 1, sm: 3 } }} />

                    {/* GA Chart Area */}
                    <Box sx={{
                        width: '100%',
                        height: { xs: 260, sm: 340 },
                        px: { xs: 0.5, sm: 1 },
                        pt: 1,
                        pb: 1,
                    }}>
                        {liveChartData.length > 0 ? (
                            <LineChart
                                xAxis={[{
                                    data: liveChartData.map((d, i) => i),
                                    scaleType: 'point',
                                    valueFormatter: (idx) => liveChartData[idx]?.label || '',
                                    tickLabelStyle: {
                                        fontSize: 10,
                                        fontWeight: 500,
                                        fill: isDark ? '#9ca3af' : '#80868b',
                                    },
                                }]}
                                yAxis={[{
                                    tickMinStep: 1,
                                    tickLabelStyle: {
                                        fontSize: 10,
                                        fontWeight: 500,
                                        fill: isDark ? '#9ca3af' : '#80868b',
                                    },
                                }]}
                                series={[{
                                    data: liveChartData.map(d => d.count),
                                    color: visitorPeriod === '7d' ? '#e8710a' : visitorPeriod === 'today' ? '#1a73e8' : '#1e8e3e',
                                    area: true,
                                    curve: 'catmullRom',
                                    showMark: liveChartData.length <= 15,
                                    valueFormatter: (value) => `${value} visitor${value !== 1 ? 's' : ''}`,
                                }]}
                                grid={{ horizontal: true }}
                                margin={{ top: 20, bottom: 35, left: 45, right: 20 }}
                                slotProps={{
                                    legend: { hidden: true },
                                }}
                                sx={{
                                    '& .MuiChartsAxis-tickLabel': {
                                        fill: isDark ? '#9ca3af' : '#80868b',
                                        fontWeight: 500,
                                    },
                                    '& .MuiChartsAxis-line': {
                                        stroke: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6',
                                        strokeWidth: 1,
                                    },
                                    '& .MuiChartsAxis-tick': { stroke: 'transparent' },
                                    '& .MuiChartsGrid-line': {
                                        stroke: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6',
                                        strokeWidth: 1,
                                    },
                                    '& .MuiAreaElement-root': {
                                        fill: visitorPeriod === '7d'
                                            ? 'url(#gaGradientOrange)'
                                            : visitorPeriod === 'today'
                                                ? 'url(#gaGradientBlue)'
                                                : 'url(#gaGradientGreen)',
                                        opacity: 1,
                                    },
                                    '& .MuiLineElement-root': {
                                        strokeWidth: 2.5,
                                    },
                                    '& .MuiMarkElement-root': {
                                        strokeWidth: 2,
                                        r: 3.5,
                                        fill: isDark ? '#1e1e1e' : '#fff',
                                    },
                                }}
                            >
                                <defs>
                                    <linearGradient id="gaGradientBlue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1a73e8" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#1a73e8" stopOpacity={0.01} />
                                    </linearGradient>
                                    <linearGradient id="gaGradientOrange" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#e8710a" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#e8710a" stopOpacity={0.01} />
                                    </linearGradient>
                                    <linearGradient id="gaGradientGreen" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1e8e3e" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#1e8e3e" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                            </LineChart>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 1.5 }}>
                                <BarChartIcon sx={{ fontSize: 48, color: c.textMuted, opacity: 0.3 }} />
                                <Typography sx={{ color: c.textMuted, fontSize: '0.85rem', fontWeight: 500 }}>
                                    No data available for this period
                                </Typography>
                                <Typography sx={{ color: c.textMuted, fontSize: '0.72rem', opacity: 0.7 }}>
                                    Visitor data will appear here as traffic comes in
                                </Typography>
                            </Box>
                        )}
                    </Box>

                </Card>

                {/* Submission Analytics — Google Analytics Style */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: '12px',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#dadce0'}`,
                        bgcolor: c.cardBg,
                        mb: 3.5,
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        px: { xs: 2, sm: 3 },
                        pt: { xs: 2, sm: 2.5 },
                        pb: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1,
                    }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: c.textPrimary }}>
                                    Paper Submissions
                                </Typography>
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', gap: 0.5,
                                    px: 1, py: 0.25,
                                    bgcolor: isDark ? 'rgba(14,165,233,0.15)' : '#f0f9ff',
                                    borderRadius: '4px',
                                    border: `1px solid ${isDark ? 'rgba(14,165,233,0.3)' : '#bae6fd'}`,
                                }}>
                                    <Box sx={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        bgcolor: '#0ea5e9',
                                        animation: 'gaPulse 2s ease-in-out infinite',
                                    }} />
                                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        Live
                                    </Typography>
                                </Box>
                                {isSubRefreshing && (
                                    <Box sx={{
                                        width: 14, height: 14, borderRadius: '50%',
                                        border: '2px solid #0ea5e9',
                                        borderTopColor: 'transparent',
                                        animation: 'gaSpin 0.8s linear infinite',
                                    }} />
                                )}
                            </Box>
                            <Typography sx={{ fontSize: '0.72rem', color: c.textMuted }}>
                                Submission activity · Updated {subLastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </Typography>
                        </Box>
                        {/* Period pills */}
                        <Box sx={{
                            display: 'flex',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#dadce0'}`,
                            borderRadius: '8px',
                            overflow: 'hidden',
                        }}>
                            {[
                                { key: 'today', label: 'Today' },
                                { key: '7d', label: '7 days' },
                                { key: '30d', label: '30 days' },
                            ].map((tab, i) => (
                                <Button
                                    key={tab.key}
                                    size="small"
                                    onClick={() => handleSubPeriodChange(tab.key)}
                                    sx={{
                                        px: { xs: 1.5, sm: 2 }, py: 0.5,
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        minWidth: 'auto',
                                        borderRadius: 0,
                                        borderRight: i < 2 ? `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#dadce0'}` : 'none',
                                        ...(subPeriod === tab.key ? {
                                            bgcolor: isDark ? 'rgba(14,165,233,0.15)' : '#e0f2fe',
                                            color: '#0284c7',
                                        } : {
                                            color: c.textMuted,
                                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fa' },
                                        }),
                                    }}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* Metric Cards Row */}
                    <Box sx={{
                        display: 'flex',
                        px: { xs: 1, sm: 3 },
                        pt: 2.5,
                        pb: 0,
                        gap: 0,
                        overflowX: 'auto',
                    }}>
                        {[
                            { key: 'today', label: 'Today', value: subStats.today || 0, color: '#0284c7' },
                            { key: '7d', label: 'Last 7 days', value: subStats.last7days || 0, color: '#d97706' },
                            { key: '30d', label: 'Last 30 days', value: subStats.last30days || 0, color: '#059669' },
                            { key: 'all', label: 'Total', value: subStats.total || 0, color: '#dc2626' },
                        ].map((metric) => (
                            <Box
                                key={metric.key}
                                onClick={() => metric.key !== 'all' && handleSubPeriodChange(metric.key)}
                                sx={{
                                    flex: 1,
                                    minWidth: 110,
                                    px: 2,
                                    py: 1.5,
                                    cursor: metric.key !== 'all' ? 'pointer' : 'default',
                                    borderBottom: `3px solid ${subPeriod === metric.key ? metric.color : 'transparent'
                                        }`,
                                    transition: 'all 0.15s ease',
                                    '&:hover': metric.key !== 'all' ? {
                                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
                                    } : {},
                                }}
                            >
                                <Typography sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 500,
                                    color: subPeriod === metric.key ? metric.color : c.textMuted,
                                    mb: 0.5,
                                    whiteSpace: 'nowrap',
                                }}>
                                    {metric.label}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '1.75rem',
                                    fontWeight: 700,
                                    color: subPeriod === metric.key ? metric.color : c.textPrimary,
                                    lineHeight: 1,
                                    letterSpacing: '-0.02em',
                                }}>
                                    {metric.value.toLocaleString()}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Divider */}
                    <Box sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'}`, mx: { xs: 1, sm: 3 } }} />

                    {/* Chart Area */}
                    <Box sx={{
                        width: '100%',
                        height: { xs: 260, sm: 340 },
                        px: { xs: 0.5, sm: 1 },
                        pt: 1,
                        pb: 1,
                    }}>
                        {subChartData.length > 0 ? (
                            <LineChart
                                xAxis={[{
                                    data: subChartData.map((d, i) => i),
                                    scaleType: 'point',
                                    valueFormatter: (idx) => subChartData[idx]?.label || '',
                                    tickLabelStyle: {
                                        fontSize: 10,
                                        fontWeight: 500,
                                        fill: isDark ? '#9ca3af' : '#80868b',
                                    },
                                }]}
                                yAxis={[{
                                    tickMinStep: 1,
                                    tickLabelStyle: {
                                        fontSize: 10,
                                        fontWeight: 500,
                                        fill: isDark ? '#9ca3af' : '#80868b',
                                    },
                                }]}
                                series={[{
                                    data: subChartData.map(d => d.count),
                                    color: subPeriod === '7d' ? '#d97706' : subPeriod === 'today' ? '#0284c7' : '#059669',
                                    area: true,
                                    curve: 'catmullRom',
                                    showMark: subChartData.length <= 15,
                                    valueFormatter: (value) => `${value} submission${value !== 1 ? 's' : ''}`,
                                }]}
                                grid={{ horizontal: true }}
                                margin={{ top: 20, bottom: 35, left: 45, right: 20 }}
                                slotProps={{
                                    legend: { hidden: true },
                                }}
                                sx={{
                                    '& .MuiChartsAxis-tickLabel': {
                                        fill: isDark ? '#9ca3af' : '#80868b',
                                        fontWeight: 500,
                                    },
                                    '& .MuiChartsAxis-line': {
                                        stroke: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6',
                                        strokeWidth: 1,
                                    },
                                    '& .MuiChartsAxis-tick': { stroke: 'transparent' },
                                    '& .MuiChartsGrid-line': {
                                        stroke: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6',
                                        strokeWidth: 1,
                                    },
                                    '& .MuiAreaElement-root': {
                                        fill: subPeriod === '7d'
                                            ? 'url(#subGradientAmber)'
                                            : subPeriod === 'today'
                                                ? 'url(#subGradientTeal)'
                                                : 'url(#subGradientEmerald)',
                                        opacity: 1,
                                    },
                                    '& .MuiLineElement-root': {
                                        strokeWidth: 2.5,
                                    },
                                    '& .MuiMarkElement-root': {
                                        strokeWidth: 2,
                                        r: 3.5,
                                        fill: isDark ? '#1e1e1e' : '#fff',
                                    },
                                }}
                            >
                                <defs>
                                    <linearGradient id="subGradientTeal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0284c7" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#0284c7" stopOpacity={0.01} />
                                    </linearGradient>
                                    <linearGradient id="subGradientAmber" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#d97706" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#d97706" stopOpacity={0.01} />
                                    </linearGradient>
                                    <linearGradient id="subGradientEmerald" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#059669" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#059669" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                            </LineChart>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 1.5 }}>
                                <DescriptionIcon sx={{ fontSize: 48, color: c.textMuted, opacity: 0.3 }} />
                                <Typography sx={{ color: c.textMuted, fontSize: '0.85rem', fontWeight: 500 }}>
                                    No submission data for this period
                                </Typography>
                                <Typography sx={{ color: c.textMuted, fontSize: '0.72rem', opacity: 0.7 }}>
                                    Submission data will appear here as papers are submitted
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Card>

                {/* Pending Payments Alert */}
                {pendingPayments > 0 && (
                    <Card
                        elevation={0}
                        sx={{
                            mb: 3.5,
                            borderRadius: '16px',
                            border: `2px solid ${isDark ? 'rgba(234, 88, 12, 0.3)' : '#fed7aa'}`,
                            bgcolor: isDark ? 'rgba(234, 88, 12, 0.08)' : '#fffbeb',
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#fff7ed',
                                            width: 48,
                                            height: 48,
                                            borderRadius: '12px',
                                        }}
                                        variant="rounded"
                                    >
                                        <WarningAmberIcon sx={{ color: '#ea580c', fontSize: 24 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, color: '#ea580c', fontSize: '0.95rem' }}>
                                            Pending Payment Verifications
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                                            {pendingPayments} payment{pendingPayments > 1 ? 's' : ''} waiting for verification
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    component={Link}
                                    href={route('admin.payments')}
                                    variant="contained"
                                    size="small"
                                    endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                                    sx={{
                                        bgcolor: '#ea580c',
                                        '&:hover': {
                                            bgcolor: '#c2410c',
                                            transform: 'translateY(-1px)',
                                        },
                                        borderRadius: '10px',
                                        px: 2.5,
                                        py: 1,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '0.8rem',
                                        transition: 'all 0.25s ease',
                                    }}
                                >
                                    Review Now
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: '16px',
                        border: `1px solid ${c.cardBorder}`,
                        bgcolor: c.cardBg,
                        mb: 3.5,
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                fontSize: '1rem',
                                color: c.textPrimary,
                                mb: 2.5,
                            }}
                        >
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            {quickActions.map((action, idx) => (
                                <Grid size={{ xs: 6, sm: 4, md: 4 }} key={idx}>
                                    <Button
                                        component={Link}
                                        href={action.href}
                                        fullWidth
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1,
                                            py: { xs: 2, sm: 2.5 },
                                            px: 1.5,
                                            borderRadius: '14px',
                                            textTransform: 'none',
                                            border: `1px solid ${c.cardBorder}`,
                                            bgcolor: c.cardBg,
                                            color: c.textPrimary,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                borderColor: action.color,
                                                bgcolor: action.bgColor,
                                                transform: 'translateY(-3px)',
                                                boxShadow: `0 8px 20px ${action.color}18`,
                                            },
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: '12px',
                                                bgcolor: action.bgColor,
                                            }}
                                            variant="rounded"
                                        >
                                            {React.cloneElement(action.icon, { sx: { color: action.color, fontSize: 22 } })}
                                        </Avatar>
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: { xs: '0.75rem', sm: '0.825rem' },
                                                color: c.textPrimary,
                                                textAlign: 'center',
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {action.label}
                                        </Typography>
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Main Content: Chart + Recent Submissions */}
                <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                    {/* Submissions per Topic Chart */}
                    <Grid size={{ xs: 12 }}>
                        {submissionsPerTopic.length > 0 && (
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: '16px',
                                    border: `1px solid ${c.cardBorder}`,
                                    bgcolor: c.cardBg,
                                }}
                            >
                                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                    {/* Chart Header */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: isDark ? 'rgba(26, 188, 156, 0.12)' : '#ecfdf5',
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: '12px',
                                                }}
                                                variant="rounded"
                                            >
                                                <BarChartIcon sx={{ color: '#1abc9c', fontSize: 24 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary, mb: 0.25 }}>
                                                    Submissions per Topic
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                                                    Distribution by research sub-theme
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Filters */}
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5, mb: 2.5 }}>
                                        <ToggleButtonGroup
                                            value={categoryFilter}
                                            exclusive
                                            onChange={(e, v) => v !== null && setCategoryFilter(v)}
                                            size="small"
                                            sx={{ bgcolor: isDark ? c.cardBg : '#f9fafb', borderRadius: 2, border: `1px solid ${c.cardBorder}`, '& .MuiToggleButton-root': { border: 'none' } }}
                                        >
                                            <ToggleButton value="all" sx={toggleSx('#1abc9c')}>
                                                <FilterListIcon sx={{ mr: 0.5, fontSize: 16 }} /> All
                                            </ToggleButton>
                                            <ToggleButton value="oral_presentation" sx={toggleSx('#2563eb')}>
                                                🎤 Oral
                                            </ToggleButton>
                                            <ToggleButton value="poster_presentation" sx={toggleSx('#9333ea')}>
                                                📋 Poster
                                            </ToggleButton>
                                        </ToggleButtonGroup>

                                        <ToggleButtonGroup
                                            value={participantFilter}
                                            exclusive
                                            onChange={(e, v) => v !== null && setParticipantFilter(v)}
                                            size="small"
                                            sx={{ bgcolor: isDark ? c.cardBg : '#f9fafb', borderRadius: 2, border: `1px solid ${c.cardBorder}`, '& .MuiToggleButton-root': { border: 'none' } }}
                                        >
                                            <ToggleButton value="all" sx={toggleSx('#1abc9c')}>
                                                👥 All
                                            </ToggleButton>
                                            <ToggleButton value="student_count" sx={toggleSx('#0891b2')}>
                                                🎓 Student
                                            </ToggleButton>
                                            <ToggleButton value="professional_count" sx={toggleSx('#ea580c')}>
                                                💼 Pro
                                            </ToggleButton>
                                            <ToggleButton value="international_count" sx={toggleSx('#7c3aed')}>
                                                🌍 Int'l
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>

                                    {/* Chart */}
                                    <Box sx={{
                                        width: '100%',
                                        height: Math.max(400, filteredSubmissionsPerTopic.length * 70),
                                        bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#ffffff',
                                        borderRadius: '12px',
                                        p: { xs: 1, sm: 2 },
                                        border: `1px solid ${c.cardBorder}`,
                                    }}>
                                        <BarChart
                                            dataset={filteredSubmissionsPerTopic}
                                            layout="horizontal"
                                            yAxis={[{
                                                scaleType: 'band',
                                                dataKey: 'topic',
                                                tickLabelStyle: {
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    fill: isDark ? '#d1d5db' : '#1f2937',
                                                    textAnchor: 'end',
                                                },
                                            }]}
                                            xAxis={[{
                                                tickLabelStyle: {
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    fill: isDark ? '#9ca3af' : '#6b7280',
                                                },
                                            }]}
                                            series={[
                                                {
                                                    dataKey: 'count',
                                                    label: categoryFilter === 'all' ? 'Total' :
                                                        categoryFilter === 'oral_presentation' ? 'Oral' : 'Poster',
                                                    color: categoryFilter === 'all' ? '#059669' :
                                                        categoryFilter === 'oral_presentation' ? '#2563eb' : '#9333ea',
                                                    valueFormatter: (value) => `${value} paper${value > 1 ? 's' : ''}`,
                                                },
                                            ]}
                                            margin={{ top: 30, bottom: 50, left: 150, right: 60 }}
                                            grid={{ horizontal: true }}
                                            slotProps={{
                                                legend: {
                                                    direction: 'row',
                                                    position: { vertical: 'top', horizontal: 'right' },
                                                    padding: 0,
                                                    itemMarkWidth: 10,
                                                    itemMarkHeight: 10,
                                                    markGap: 6,
                                                    itemGap: 10,
                                                    labelStyle: {
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        fill: isDark ? '#d1d5db' : '#1f2937',
                                                    },
                                                },
                                                bar: { rx: 6, ry: 6 },
                                            }}
                                            sx={{
                                                '& .MuiChartsAxis-tickLabel': { fill: isDark ? '#d1d5db' : '#1f2937', fontWeight: 600 },
                                                '& .MuiChartsAxis-line': { stroke: isDark ? '#374151' : '#d1d5db', strokeWidth: 1.5 },
                                                '& .MuiChartsAxis-tick': { stroke: isDark ? '#374151' : '#d1d5db', strokeWidth: 1.5 },
                                                '& .MuiChartsGrid-line': { stroke: isDark ? '#1f2937' : '#f3f4f6', strokeDasharray: '5 5' },
                                                '& .MuiBarElement-root': {
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': { opacity: 0.85 },
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Stats Summary + Top Topic */}
                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        <Grid size={{ xs: 6, sm: 4 }}>
                                            <Box sx={{
                                                p: 2,
                                                bgcolor: isDark ? 'rgba(22, 163, 74, 0.08)' : '#ecfdf5',
                                                borderRadius: '12px',
                                                border: `1px solid ${isDark ? 'rgba(22, 163, 74, 0.2)' : '#a7f3d0'}`,
                                                textAlign: 'center',
                                            }}>
                                                <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#16a34a' }}>
                                                    {submissionsPerTopic.length}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, fontWeight: 500 }}>
                                                    Topics
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 4 }}>
                                            <Box sx={{
                                                p: 2,
                                                bgcolor: isDark ? 'rgba(37, 99, 235, 0.08)' : '#eff6ff',
                                                borderRadius: '12px',
                                                border: `1px solid ${isDark ? 'rgba(37, 99, 235, 0.2)' : '#93c5fd'}`,
                                                textAlign: 'center',
                                            }}>
                                                <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#2563eb' }}>
                                                    {submissionsPerTopic.reduce((sum, item) => sum + item.count, 0)}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, fontWeight: 500 }}>
                                                    Total Papers
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            {submissionsPerTopic.length > 0 && (
                                                <Box sx={{
                                                    p: 2,
                                                    background: isDark
                                                        ? 'linear-gradient(135deg, rgba(13, 122, 106, 0.2), rgba(26, 188, 156, 0.15))'
                                                        : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                                                    borderRadius: '12px',
                                                    border: `1px solid ${isDark ? 'rgba(26, 188, 156, 0.2)' : '#a7f3d0'}`,
                                                    textAlign: 'center',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                                                        <EmojiEventsIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                                                        <Typography sx={{ fontSize: '0.7rem', color: '#1abc9c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            Top Topic
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: c.textPrimary, lineHeight: 1.3 }}>
                                                        {submissionsPerTopic[0].topic}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.7rem', color: c.textMuted }}>
                                                        {submissionsPerTopic[0].count} papers
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>

                    {/* Recent Submissions */}
                    <Grid size={{ xs: 12 }}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary, mb: 0.5 }}>
                                            Recent Submissions
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                                            Latest paper submissions across all users
                                        </Typography>
                                    </Box>
                                    <Button
                                        component={Link}
                                        href={route('admin.submissions')}
                                        size="small"
                                        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            color: '#1abc9c',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                bgcolor: isDark ? 'rgba(26, 188, 156, 0.1)' : '#ecfdf5',
                                            },
                                        }}
                                    >
                                        View All
                                    </Button>
                                </Box>

                                {recentSubmissions.length > 0 ? (
                                    <Stack spacing={0} divider={<Divider sx={{ borderColor: c.cardBorder }} />}>
                                        {recentSubmissions.map((sub, idx) => {
                                            const status = getStatusChip(sub.status);
                                            return (
                                                <Box
                                                    key={sub.id || idx}
                                                    component={Link}
                                                    href={route('admin.submissions')}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        py: 1.5,
                                                        px: 1,
                                                        borderRadius: '10px',
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                                                        },
                                                    }}
                                                >
                                                    <Avatar
                                                        variant="rounded"
                                                        sx={{
                                                            bgcolor: isDark ? '#1f2937' : '#f3f4f6',
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: '10px',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <DescriptionIcon sx={{ color: '#6b7280', fontSize: 20 }} />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: c.textPrimary,
                                                                fontSize: '0.85rem',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            {sub.title || 'Untitled Paper'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.75rem' }}>
                                                            by {sub.user?.name || 'Unknown'} • {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={status.label}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: status.bg,
                                                            color: status.color,
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                            height: 24,
                                                            borderRadius: '6px',
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <DescriptionIcon sx={{ fontSize: 48, color: isDark ? '#374151' : '#d1d5db', mb: 1 }} />
                                        <Typography variant="body2" sx={{ color: c.textMuted }}>
                                            No submissions yet
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </SidebarLayout >
    );
}
