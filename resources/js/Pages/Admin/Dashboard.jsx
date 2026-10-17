import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
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
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import ViewCompactRoundedIcon from '@mui/icons-material/ViewCompactRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

export default function AdminDashboard({
    analytics,
    recentSubmissions = [],
    pendingPayments = 0,
    submissionsPerTopic = [],
    participantStats = {},
    submissionsPerTopicByParticipant = [],
    visitorAnalytics = {},
    dailyVisitors = []
}) {
    const { auth } = usePage().props;
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const adminName = auth?.user?.name ? auth.user.name.split(' ')[0] : 'Admin';

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
        refreshTimerRef.current = setInterval(() => fetchVisitorData(visitorPeriod), 60000);
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
        subRefreshTimerRef.current = setInterval(() => fetchSubData(subPeriod), 60000);
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

    // Quick actions config
    const quickActions = [
        {
            label: 'Workflow Control',
            href: route('admin.submissions'),
            icon: <AssignmentRoundedIcon />,
            color: '#0d7a6a',
            bgColor: isDark ? 'rgba(13, 122, 106, 0.15)' : '#ecfdf5',
        },
        {
            label: 'Reviewer Assignment',
            href: route('admin.submissions'),
            icon: <DescriptionRoundedIcon />,
            color: '#0891b2',
            bgColor: isDark ? 'rgba(8, 145, 178, 0.15)' : '#ecfeff',
        },
        {
            label: 'Database Export',
            href: route('admin.export'),
            icon: <GetAppRoundedIcon />,
            color: '#2563eb',
            bgColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff',
        },
        {
            label: 'Payment Validation',
            href: route('admin.payments'),
            icon: <PaymentRoundedIcon />,
            color: '#ea580c',
            bgColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#fff7ed',
        },
        {
            label: 'Manage Users',
            href: route('admin.users'),
            icon: <PeopleRoundedIcon />,
            color: '#7c3aed',
            bgColor: isDark ? 'rgba(124, 58, 237, 0.15)' : '#f5f3ff',
        },
        {
            label: 'Landing Settings',
            href: route('admin.settings'),
            icon: <SettingsRoundedIcon />,
            color: '#64748b',
            bgColor: isDark ? 'rgba(100, 116, 139, 0.15)' : '#f1f5f9',
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
            'pending': { bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb', color: '#d97706', border: '#fde68a', label: 'Pending' },
            'under_review': { bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff', color: '#2563eb', border: '#bfdbfe', label: 'In Review' },
            'accepted': { bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5', color: '#059669', border: '#a7f3d0', label: 'Accepted' },
            'rejected': { bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'Rejected' },
            'declined': { bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'Declined' },
        };
        return map[status] || { bg: isDark ? 'rgba(107, 114, 128, 0.15)' : '#f1f5f9', color: '#64748b', border: '#e2e8f0', label: status };
    };

    const toggleSx = (selectedColor) => ({
        px: { xs: 1.5, sm: 2 },
        py: 0.6,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: { xs: '0.725rem', sm: '0.775rem' },
        borderRadius: '8px !important',
        border: 'none !important',
        color: c.textSecondary,
        transition: 'all 0.2s ease',
        '&.Mui-selected': {
            backgroundColor: selectedColor,
            color: 'white',
            boxShadow: `0 2px 8px ${selectedColor}40`,
            '&:hover': {
                backgroundColor: selectedColor,
            },
        },
    });

    // Participant category numbers
    const studentCount = participantStats?.student || 0;
    const professionalCount = participantStats?.professional || 0;
    const internationalCount = participantStats?.international || 0;
    const totalParticipantsCategorized = studentCount + professionalCount + internationalCount || 1;

    // Presentation format breakdown
    const totalOral = submissionsPerTopic.reduce((acc, curr) => acc + (curr.oral_presentation_count || 0), 0);
    const totalPoster = submissionsPerTopic.reduce((acc, curr) => acc + (curr.poster_presentation_count || 0), 0);
    const totalPresentations = totalOral + totalPoster || 1;

    return (
        <SidebarLayout>
            <Head title="Admin Dashboard" />

            <Box sx={{
                p: { xs: 2, sm: 3, md: 3.5 },
                minHeight: '100vh',
                bgcolor: c.surfaceBg,
            }}>
                {/* ── Materio Header & Primary Action ── */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 3.5,
                    gap: 2,
                }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                                variant="rounded"
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
                                    color: '#ffffff',
                                    boxShadow: '0 4px 14px rgba(13,122,106,0.25)',
                                }}
                            >
                                <BarChartRoundedIcon sx={{ fontSize: 24 }} />
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        color: c.textPrimary,
                                        fontSize: { xs: '1.45rem', sm: '1.75rem' },
                                        letterSpacing: '-0.025em',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Admin Dashboard
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: c.textMuted,
                                        mt: 0.25,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    <CalendarTodayRoundedIcon sx={{ fontSize: 14 }} />
                                    {formattedDate} • 55th PIT IAGI & GEOSEA XIX 2026
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Button
                            component={Link}
                            href={route('admin.submissions')}
                            variant="contained"
                            startIcon={<AssignmentRoundedIcon sx={{ fontSize: 18 }} />}
                            sx={{
                                background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 50%, #10b981 100%)',
                                px: 2.75,
                                py: 1,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                boxShadow: '0 4px 14px rgba(13, 122, 106, 0.25)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)',
                                    boxShadow: '0 6px 18px rgba(13, 122, 106, 0.35)',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Manage Papers
                        </Button>
                    </Box>
                </Box>

                {/* ── ROW 1: Materio Iconic Trophy Card (4 cols) + Materio Statistics Card (8 cols) ── */}
                <Grid container spacing={3} sx={{ mb: 3.5 }}>
                    {/* Materio Trophy Card */}
                    <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: isDark ? 'none' : '0 4px 20px -2px rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 8px 25px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(13,122,106,0.12)'}`,
                                },
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 }, position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: '1.1rem',
                                                color: c.textPrimary,
                                                letterSpacing: '-0.01em',
                                            }}
                                        >
                                            Welcome, {adminName}! 🎉
                                        </Typography>
                                        <Chip
                                            label="MILESTONE"
                                            size="small"
                                            sx={{
                                                bgcolor: isDark ? 'rgba(13,122,106,0.2)' : '#ecfdf5',
                                                color: '#0d7a6a',
                                                border: `1px solid ${isDark ? 'rgba(13,122,106,0.35)' : '#a7f3d0'}`,
                                                fontWeight: 800,
                                                fontSize: '0.65rem',
                                                borderRadius: '6px',
                                                height: 20,
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.825rem', lineHeight: 1.5, mb: 2, pr: { sm: 10, md: 0, lg: 8 } }}>
                                        Outstanding participation progress! <strong>{verifiedPayments}</strong> payments verified with active submissions across all categories.
                                    </Typography>
                                    
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: { xs: '1.65rem', sm: '1.85rem' },
                                                color: '#0d7a6a',
                                                lineHeight: 1.1,
                                                letterSpacing: '-0.02em',
                                            }}
                                        >
                                            {totalSubmissions} Papers
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.75rem', fontWeight: 600 }}>
                                            Total registered research submissions
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ pt: 1 }}>
                                    <Button
                                        component={Link}
                                        href={route('admin.submissions')}
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                            color: '#ffffff',
                                            background: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 100%)',
                                            boxShadow: '0 4px 12px rgba(13,122,106,0.25)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #0d7a6a 0%, #10b981 100%)',
                                            },
                                            px: 2.5,
                                            py: 0.8,
                                        }}
                                    >
                                        View Submissions
                                    </Button>
                                </Box>

                                {/* Decorative Materio Trophy Vector Graphic */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: { xs: 15, sm: 20 },
                                        bottom: { xs: 10, sm: 15 },
                                        pointerEvents: 'none',
                                        zIndex: 1,
                                        opacity: { xs: 0.25, sm: 0.95 },
                                        filter: 'drop-shadow(0 4px 14px rgba(245, 158, 11, 0.25))',
                                    }}
                                >
                                    <svg width="105" height="105" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="50" cy="50" r="45" fill="url(#trophyBgGlow)" />
                                        <path d="M30 25H70V45C70 56.0457 61.0457 65 50 65C38.9543 65 30 56.0457 30 45V25Z" fill="url(#trophyGold)" />
                                        <path d="M30 30H20C17.2386 30 15 32.2386 15 35V38C15 44.6274 20.3726 50 27 50H30.5" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                                        <path d="M70 30H80C82.7614 30 85 32.2386 85 35V38C85 44.6274 79.6274 50 73 50H69.5" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                                        <path d="M46 65H54V76H46V65Z" fill="#D97706" />
                                        <path d="M36 76H64C66.2091 76 68 77.7909 68 80V82C68 82.5523 67.5523 83 67 83H33C32.4477 83 32 82.5523 32 82V80C32 77.7909 33.7909 76 36 76Z" fill="#B45309" />
                                        <circle cx="50" cy="42" r="9" fill="#FEF3C7" />
                                        <polygon points="50,36 52.3,40.7 57.5,41.4 53.7,45.1 54.6,50.2 50,47.8 45.4,50.2 46.3,45.1 42.5,41.4 47.7,40.7" fill="#F59E0B" />
                                        <defs>
                                            <radialGradient id="trophyBgGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(45)">
                                                <stop stopColor="#FDE68A" stopOpacity="0.4" />
                                                <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
                                            </radialGradient>
                                            <linearGradient id="trophyGold" x1="30" y1="25" x2="70" y2="65" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#FDE68A" />
                                                <stop offset="0.5" stopColor="#F59E0B" />
                                                <stop offset="1" stopColor="#D97706" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Materio Statistics Card */}
                    <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                boxShadow: isDark ? 'none' : '0 4px 20px -2px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: { xs: 2.5, sm: 3 } } }}>
                                {/* Header */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: '1.05rem',
                                                color: c.textPrimary,
                                                letterSpacing: '-0.01em',
                                            }}
                                        >
                                            Conference Statistics Overview
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem', mt: 0.25 }}>
                                            Real-time key metrics across paper submissions & registration
                                        </Typography>
                                    </Box>
                                    <Chip
                                        icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', ml: 1, mr: -0.5 }} />}
                                        label="Live Sync"
                                        size="small"
                                        sx={{
                                            bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                                            color: isDark ? '#34d399' : '#059669',
                                            border: `1px solid ${isDark ? 'rgba(16,185,129,0.3)' : '#a7f3d0'}`,
                                            fontWeight: 700,
                                            fontSize: '0.675rem',
                                            borderRadius: '6px',
                                            height: 22,
                                        }}
                                    />
                                </Box>

                                {/* 4 Stat Items Grid */}
                                <Grid container spacing={2.5}>
                                    {/* 1. Total Submissions */}
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: '12px',
                                                    bgcolor: isDark ? 'rgba(13,122,106,0.18)' : '#ecfdf5',
                                                    color: '#0d7a6a',
                                                    border: `1px solid ${isDark ? 'rgba(13,122,106,0.3)' : '#a7f3d0'}`,
                                                }}
                                            >
                                                <ArticleRoundedIcon sx={{ fontSize: 24 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.45rem' }, color: c.textPrimary, lineHeight: 1.15 }}>
                                                    {totalSubmissions}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, fontSize: '0.75rem' }}>
                                                    Submissions
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* 2. Registered Authors */}
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: '12px',
                                                    bgcolor: isDark ? 'rgba(124,58,237,0.18)' : '#f5f3ff',
                                                    color: '#7c3aed',
                                                    border: `1px solid ${isDark ? 'rgba(124,58,237,0.3)' : '#ddd6fe'}`,
                                                }}
                                            >
                                                <PeopleRoundedIcon sx={{ fontSize: 24 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.45rem' }, color: c.textPrimary, lineHeight: 1.15 }}>
                                                    {totalUsers}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, fontSize: '0.75rem' }}>
                                                    Authors
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* 3. Verified Payments */}
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: '12px',
                                                    bgcolor: isDark ? 'rgba(16,185,129,0.18)' : '#ecfdf5',
                                                    color: '#10b981',
                                                    border: `1px solid ${isDark ? 'rgba(16,185,129,0.3)' : '#a7f3d0'}`,
                                                }}
                                            >
                                                <PaymentRoundedIcon sx={{ fontSize: 24 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.45rem' }, color: c.textPrimary, lineHeight: 1.15 }}>
                                                    {verifiedPayments}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, fontSize: '0.75rem' }}>
                                                    Verified Pay
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* 4. Pending Reviews */}
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: '12px',
                                                    bgcolor: isDark ? 'rgba(245,158,11,0.18)' : '#fffbeb',
                                                    color: '#f59e0b',
                                                    border: `1px solid ${isDark ? 'rgba(245,158,11,0.3)' : '#fde68a'}`,
                                                }}
                                            >
                                                <PendingActionsRoundedIcon sx={{ fontSize: 24 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.45rem' }, color: c.textPrimary, lineHeight: 1.15 }}>
                                                    {pendingReviews}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, fontSize: '0.75rem' }}>
                                                    Pending Review
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Additional mini status row */}
                                <Box sx={{ 
                                    mt: 3, 
                                    p: 1.75, 
                                    borderRadius: '12px', 
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: 1.5,
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                        <Typography sx={{ fontSize: '0.78rem', color: c.textPrimary, fontWeight: 600 }}>
                                            <strong>{acceptedSubmissions}</strong> Accepted papers published
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography sx={{ fontSize: '0.78rem', color: c.textMuted }}>
                                            Rejection rate: <strong>{totalSubmissions > 0 ? ((rejectedSubmissions / totalSubmissions) * 100).toFixed(1) : 0}%</strong>
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* ── ROW 2: Materio Pending Payments Alert Banner (if any) ── */}
                {pendingPayments > 0 && (
                    <Card
                        elevation={0}
                        sx={{
                            mb: 3.5,
                            borderRadius: '16px',
                            border: `1px solid ${isDark ? 'rgba(245, 158, 11, 0.4)' : '#fed7aa'}`,
                            bgcolor: isDark ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb',
                            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7',
                                            color: '#d97706',
                                            width: 44,
                                            height: 44,
                                            borderRadius: '12px',
                                            border: '1px solid rgba(245, 158, 11, 0.3)',
                                        }}
                                        variant="rounded"
                                    >
                                        <WarningAmberRoundedIcon sx={{ fontSize: 24 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ fontWeight: 800, color: '#d97706', fontSize: '0.95rem' }}>
                                            Pending Payment Verifications Required
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                                            <strong>{pendingPayments}</strong> payment receipt{pendingPayments > 1 ? 's are' : ' is'} waiting for admin manual verification.
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    component={Link}
                                    href={route('admin.payments')}
                                    variant="contained"
                                    size="small"
                                    endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                                    sx={{
                                        bgcolor: '#d97706',
                                        '&:hover': {
                                            bgcolor: '#b45309',
                                            transform: 'translateY(-1px)',
                                        },
                                        borderRadius: '8px',
                                        px: 2.5,
                                        py: 0.9,
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        fontSize: '0.8rem',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)',
                                    }}
                                >
                                    Review Now
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* ── ROW 3: Materio Quick Actions Shortcuts Grid ── */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: '16px',
                        border: `1px solid ${c.cardBorder}`,
                        bgcolor: c.cardBg,
                        mb: 3.5,
                        boxShadow: isDark ? 'none' : '0 4px 20px -2px rgba(0,0,0,0.05)',
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: '1rem',
                                        color: c.textPrimary,
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    Quick Management Shortcuts
                                </Typography>
                                <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.78rem' }}>
                                    Fast-track access to conference modules and controls
                                </Typography>
                            </Box>
                        </Box>

                        <Grid container spacing={2}>
                            {quickActions.map((action, idx) => (
                                <Grid size={{ xs: 6, sm: 4, md: 2 }} key={idx}>
                                    <Button
                                        component={Link}
                                        href={action.href}
                                        fullWidth
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1.25,
                                            py: { xs: 2, sm: 2.25 },
                                            px: 1.25,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            border: `1px solid ${c.cardBorder}`,
                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                                            color: c.textPrimary,
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                borderColor: action.color,
                                                bgcolor: action.bgColor,
                                                transform: 'translateY(-3px)',
                                                boxShadow: `0 8px 18px ${action.color}18`,
                                            },
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: '10px',
                                                bgcolor: action.bgColor,
                                                color: action.color,
                                                border: `1px solid ${action.color}25`,
                                            }}
                                            variant="rounded"
                                        >
                                            {React.cloneElement(action.icon, { sx: { fontSize: 22 } })}
                                        </Avatar>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: { xs: '0.725rem', sm: '0.78rem' },
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

                {/* ── ROW 4: Side-by-Side Analytics Cards (Website Visitors & Paper Submissions) ── */}
                <Grid container spacing={3} sx={{ mb: 3.5 }}>
                    {/* 1. Website Visitors Analytics Card */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                overflow: 'hidden',
                                boxShadow: isDark ? 'none' : '0 4px 20px -2px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box sx={{ p: { xs: 2.5, sm: 3 }, pb: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '1.025rem', color: c.textPrimary }}>
                                                Website Traffic
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', gap: 0.5,
                                                px: 0.85, py: 0.2,
                                                bgcolor: isDark ? 'rgba(34,197,94,0.15)' : '#f0fdf4',
                                                borderRadius: '6px',
                                                border: `1px solid ${isDark ? 'rgba(34,197,94,0.3)' : '#bbf7d0'}`,
                                            }}>
                                                <Box sx={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    bgcolor: '#22c55e',
                                                    animation: 'pulseDot 2s infinite',
                                                    '@keyframes pulseDot': {
                                                        '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                                                        '50%': { opacity: 0.4, transform: 'scale(1.2)' },
                                                    },
                                                }} />
                                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>
                                                    Live
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, mt: 0.25 }}>
                                            Landing page visits • Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Box>

                                    {/* Period Toggle */}
                                    <Box sx={{
                                        display: 'flex',
                                        border: `1px solid ${c.cardBorder}`,
                                        borderRadius: '8px',
                                        bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                                        p: 0.3,
                                    }}>
                                        {[
                                            { key: 'today', label: 'Today' },
                                            { key: '7d', label: '7D' },
                                            { key: '30d', label: '30D' },
                                        ].map((tab) => (
                                            <Button
                                                key={tab.key}
                                                size="small"
                                                onClick={() => handlePeriodChange(tab.key)}
                                                sx={{
                                                    px: 1.5, py: 0.35,
                                                    fontSize: '0.725rem',
                                                    fontWeight: 700,
                                                    textTransform: 'none',
                                                    minWidth: 'auto',
                                                    borderRadius: '6px',
                                                    ...(visitorPeriod === tab.key ? {
                                                        bgcolor: '#0d7a6a',
                                                        color: '#ffffff',
                                                        '&:hover': { bgcolor: '#094d42' }
                                                    } : {
                                                        color: c.textMuted,
                                                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' },
                                                    }),
                                                }}
                                            >
                                                {tab.label}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Metric summaries */}
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, pt: 1, pb: 1.5, borderTop: `1px solid ${c.cardBorder}`, borderBottom: `1px solid ${c.cardBorder}` }}>
                                    {[
                                        { label: 'Today', value: liveStats.today || 0, color: '#0d7a6a' },
                                        { label: '7 Days', value: liveStats.last7days || 0, color: '#0891b2' },
                                        { label: '30 Days', value: liveStats.last30days || 0, color: '#2563eb' },
                                        { label: 'All Time', value: liveStats.total || 0, color: '#7c3aed' },
                                    ].map((m) => (
                                        <Box key={m.label} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ fontSize: '0.675rem', fontWeight: 600, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                {m.label}
                                            </Typography>
                                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: m.color, lineHeight: 1.2 }}>
                                                {m.value.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* Chart */}
                            <Box sx={{ width: '100%', height: 260, px: 1, py: 1 }}>
                                {liveChartData.length > 0 ? (
                                    <LineChart
                                        xAxis={[{
                                            data: liveChartData.map((_, i) => i),
                                            scaleType: 'point',
                                            valueFormatter: (idx) => liveChartData[idx]?.label || '',
                                            tickLabelStyle: { fontSize: 10, fill: isDark ? '#9ca3af' : '#64748b' },
                                        }]}
                                        yAxis={[{
                                            tickMinStep: 1,
                                            tickLabelStyle: { fontSize: 10, fill: isDark ? '#9ca3af' : '#64748b' },
                                        }]}
                                        series={[{
                                            data: liveChartData.map(d => d.count),
                                            color: '#0d7a6a',
                                            area: true,
                                            curve: 'catmullRom',
                                            showMark: liveChartData.length <= 15,
                                            valueFormatter: (v) => `${v} visitors`,
                                        }]}
                                        grid={{ horizontal: true }}
                                        margin={{ top: 15, bottom: 30, left: 40, right: 15 }}
                                        slotProps={{ legend: { hidden: true } }}
                                        sx={{
                                            '& .MuiChartsAxis-line': { stroke: c.cardBorder },
                                            '& .MuiChartsGrid-line': { stroke: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9' },
                                            '& .MuiAreaElement-root': {
                                                fill: 'url(#materioVisitorGradient)',
                                            },
                                            '& .MuiLineElement-root': { strokeWidth: 2.5 },
                                        }}
                                    >
                                        <defs>
                                            <linearGradient id="materioVisitorGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#0d7a6a" stopOpacity={0.25} />
                                                <stop offset="100%" stopColor="#0d7a6a" stopOpacity={0.01} />
                                            </linearGradient>
                                        </defs>
                                    </LineChart>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column' }}>
                                        <Typography sx={{ color: c.textMuted, fontSize: '0.8rem' }}>No visitor data for this period</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Card>
                    </Grid>

                    {/* 2. Paper Submissions Analytics Card */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                overflow: 'hidden',
                                boxShadow: isDark ? 'none' : '0 4px 20px -2px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box sx={{ p: { xs: 2.5, sm: 3 }, pb: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '1.025rem', color: c.textPrimary }}>
                                                Submissions Velocity
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', gap: 0.5,
                                                px: 0.85, py: 0.2,
                                                bgcolor: isDark ? 'rgba(14,165,233,0.15)' : '#f0f9ff',
                                                borderRadius: '6px',
                                                border: `1px solid ${isDark ? 'rgba(14,165,233,0.3)' : '#bae6fd'}`,
                                            }}>
                                                <Box sx={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    bgcolor: '#0ea5e9',
                                                    animation: 'pulseDot 2s infinite',
                                                }} />
                                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
                                                    Live
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, mt: 0.25 }}>
                                            Paper submissions timeline • Updated {subLastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Box>

                                    {/* Period Toggle */}
                                    <Box sx={{
                                        display: 'flex',
                                        border: `1px solid ${c.cardBorder}`,
                                        borderRadius: '8px',
                                        bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                                        p: 0.3,
                                    }}>
                                        {[
                                            { key: 'today', label: 'Today' },
                                            { key: '7d', label: '7D' },
                                            { key: '30d', label: '30D' },
                                        ].map((tab) => (
                                            <Button
                                                key={tab.key}
                                                size="small"
                                                onClick={() => handleSubPeriodChange(tab.key)}
                                                sx={{
                                                    px: 1.5, py: 0.35,
                                                    fontSize: '0.725rem',
                                                    fontWeight: 700,
                                                    textTransform: 'none',
                                                    minWidth: 'auto',
                                                    borderRadius: '6px',
                                                    ...(subPeriod === tab.key ? {
                                                        bgcolor: '#0284c7',
                                                        color: '#ffffff',
                                                        '&:hover': { bgcolor: '#0369a1' }
                                                    } : {
                                                        color: c.textMuted,
                                                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' },
                                                    }),
                                                }}
                                            >
                                                {tab.label}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Metric summaries */}
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, pt: 1, pb: 1.5, borderTop: `1px solid ${c.cardBorder}`, borderBottom: `1px solid ${c.cardBorder}` }}>
                                    {[
                                        { label: 'Today', value: subStats.today || 0, color: '#0284c7' },
                                        { label: '7 Days', value: subStats.last7days || 0, color: '#ea580c' },
                                        { label: '30 Days', value: subStats.last30days || 0, color: '#10b981' },
                                        { label: 'Total', value: subStats.total || 0, color: '#7c3aed' },
                                    ].map((m) => (
                                        <Box key={m.label} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ fontSize: '0.675rem', fontWeight: 600, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                {m.label}
                                            </Typography>
                                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: m.color, lineHeight: 1.2 }}>
                                                {m.value.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* Chart */}
                            <Box sx={{ width: '100%', height: 260, px: 1, py: 1 }}>
                                {subChartData.length > 0 ? (
                                    <LineChart
                                        xAxis={[{
                                            data: subChartData.map((_, i) => i),
                                            scaleType: 'point',
                                            valueFormatter: (idx) => subChartData[idx]?.label || '',
                                            tickLabelStyle: { fontSize: 10, fill: isDark ? '#9ca3af' : '#64748b' },
                                        }]}
                                        yAxis={[{
                                            tickMinStep: 1,
                                            tickLabelStyle: { fontSize: 10, fill: isDark ? '#9ca3af' : '#64748b' },
                                        }]}
                                        series={[{
                                            data: subChartData.map(d => d.count),
                                            color: '#0284c7',
                                            area: true,
                                            curve: 'catmullRom',
                                            showMark: subChartData.length <= 15,
                                            valueFormatter: (v) => `${v} papers`,
                                        }]}
                                        grid={{ horizontal: true }}
                                        margin={{ top: 15, bottom: 30, left: 40, right: 15 }}
                                        slotProps={{ legend: { hidden: true } }}
                                        sx={{
                                            '& .MuiChartsAxis-line': { stroke: c.cardBorder },
                                            '& .MuiChartsGrid-line': { stroke: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9' },
                                            '& .MuiAreaElement-root': {
                                                fill: 'url(#materioSubGradient)',
                                            },
                                            '& .MuiLineElement-root': { strokeWidth: 2.5 },
                                        }}
                                    >
                                        <defs>
                                            <linearGradient id="materioSubGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#0284c7" stopOpacity={0.25} />
                                                <stop offset="100%" stopColor="#0284c7" stopOpacity={0.01} />
                                            </linearGradient>
                                        </defs>
                                    </LineChart>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column' }}>
                                        <Typography sx={{ color: c.textMuted, fontSize: '0.8rem' }}>No submission data for this period</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

                {/* ── ROW 5: Submissions per Topic Horizontal Bar Chart ── */}
                {submissionsPerTopic.length > 0 && (
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: '16px',
                            border: `1px solid ${c.cardBorder}`,
                            bgcolor: c.cardBg,
                            mb: 3.5,
                            boxShadow: isDark ? 'none' : '0 4px 20px -2px rgba(0,0,0,0.05)',
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                            {/* Chart Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: isDark ? 'rgba(13, 122, 106, 0.18)' : '#ecfdf5',
                                            color: '#0d7a6a',
                                            width: 44,
                                            height: 44,
                                            borderRadius: '12px',
                                            border: `1px solid ${isDark ? 'rgba(13, 122, 106, 0.3)' : '#a7f3d0'}`,
                                        }}
                                        variant="rounded"
                                    >
                                        <BarChartRoundedIcon sx={{ fontSize: 24 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: c.textPrimary, mb: 0.25 }}>
                                            Submissions per Scientific Topic
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                                            Distribution by technical sub-theme and presentation format
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Filters */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                    <ToggleButtonGroup
                                        value={categoryFilter}
                                        exclusive
                                        onChange={(_, v) => v !== null && setCategoryFilter(v)}
                                        size="small"
                                        sx={{ 
                                            bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', 
                                            borderRadius: '10px', 
                                            border: `1px solid ${c.cardBorder}`, 
                                            p: 0.3,
                                            '& .MuiToggleButton-root': { border: 'none' } 
                                        }}
                                    >
                                        <ToggleButton value="all" sx={toggleSx('#0d7a6a')}>
                                            <FilterListRoundedIcon sx={{ mr: 0.5, fontSize: 15 }} /> All
                                        </ToggleButton>
                                        <ToggleButton value="oral_presentation" sx={toggleSx('#2563eb')}>
                                            <MicRoundedIcon sx={{ mr: 0.5, fontSize: 15 }} /> Oral
                                        </ToggleButton>
                                        <ToggleButton value="poster_presentation" sx={toggleSx('#7c3aed')}>
                                            <ViewCompactRoundedIcon sx={{ mr: 0.5, fontSize: 15 }} /> Poster
                                        </ToggleButton>
                                    </ToggleButtonGroup>

                                    <ToggleButtonGroup
                                        value={participantFilter}
                                        exclusive
                                        onChange={(_, v) => v !== null && setParticipantFilter(v)}
                                        size="small"
                                        sx={{ 
                                            bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', 
                                            borderRadius: '10px', 
                                            border: `1px solid ${c.cardBorder}`, 
                                            p: 0.3,
                                            '& .MuiToggleButton-root': { border: 'none' } 
                                        }}
                                    >
                                        <ToggleButton value="all" sx={toggleSx('#0d7a6a')}>
                                            All
                                        </ToggleButton>
                                        <ToggleButton value="student_count" sx={toggleSx('#0891b2')}>
                                            <SchoolRoundedIcon sx={{ mr: 0.5, fontSize: 15 }} /> Student
                                        </ToggleButton>
                                        <ToggleButton value="professional_count" sx={toggleSx('#ea580c')}>
                                            <WorkRoundedIcon sx={{ mr: 0.5, fontSize: 15 }} /> Pro
                                        </ToggleButton>
                                        <ToggleButton value="international_count" sx={toggleSx('#7c3aed')}>
                                            <PublicRoundedIcon sx={{ mr: 0.5, fontSize: 15 }} /> Int'l
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                            </Box>

                            {/* Horizontal Bar Chart */}
                            <Box sx={{
                                width: '100%',
                                height: Math.max(420, filteredSubmissionsPerTopic.length * 68),
                                bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#ffffff',
                                borderRadius: '14px',
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
                                            fontSize: 12,
                                            fontWeight: 600,
                                            fill: isDark ? '#d1d5db' : '#1f2937',
                                            textAnchor: 'end',
                                        },
                                    }]}
                                    xAxis={[{
                                        tickLabelStyle: {
                                            fontSize: 11,
                                            fontWeight: 500,
                                            fill: isDark ? '#9ca3af' : '#6b7280',
                                        },
                                    }]}
                                    series={[
                                        {
                                            dataKey: 'count',
                                            label: categoryFilter === 'all' ? 'Total Papers' :
                                                categoryFilter === 'oral_presentation' ? 'Oral Presentations' : 'Poster Presentations',
                                            color: categoryFilter === 'all' ? '#0d7a6a' :
                                                categoryFilter === 'oral_presentation' ? '#2563eb' : '#7c3aed',
                                            valueFormatter: (value) => `${value} paper${value > 1 ? 's' : ''}`,
                                        },
                                    ]}
                                    margin={{ top: 25, bottom: 45, left: 160, right: 50 }}
                                    grid={{ horizontal: true }}
                                    slotProps={{
                                        legend: {
                                            direction: 'row',
                                            position: { vertical: 'top', horizontal: 'right' },
                                            padding: 0,
                                            itemMarkWidth: 10,
                                            itemMarkHeight: 10,
                                            markGap: 6,
                                            itemGap: 12,
                                            labelStyle: {
                                                fontSize: 12,
                                                fontWeight: 700,
                                                fill: isDark ? '#d1d5db' : '#1f2937',
                                            },
                                        },
                                        bar: { rx: 6, ry: 6 },
                                    }}
                                    sx={{
                                        '& .MuiChartsAxis-tickLabel': { fill: isDark ? '#d1d5db' : '#1f2937', fontWeight: 600 },
                                        '& .MuiChartsAxis-line': { stroke: c.cardBorder, strokeWidth: 1 },
                                        '& .MuiChartsGrid-line': { stroke: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', strokeDasharray: '4 4' },
                                    }}
                                />
                            </Box>

                            {/* Stats Summary + Top Topic */}
                            <Grid container spacing={2.5} sx={{ mt: 1.5 }}>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: isDark ? 'rgba(13, 122, 106, 0.1)' : '#ecfdf5',
                                        borderRadius: '12px',
                                        border: `1px solid ${isDark ? 'rgba(13, 122, 106, 0.25)' : '#a7f3d0'}`,
                                        textAlign: 'center',
                                    }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0d7a6a' }}>
                                            {submissionsPerTopic.length}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, fontWeight: 600 }}>
                                            Active Topics
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: isDark ? 'rgba(37, 99, 235, 0.1)' : '#eff6ff',
                                        borderRadius: '12px',
                                        border: `1px solid ${isDark ? 'rgba(37, 99, 235, 0.25)' : '#bfdbfe'}`,
                                        textAlign: 'center',
                                    }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#2563eb' }}>
                                            {submissionsPerTopic.reduce((sum, item) => sum + item.count, 0)}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, fontWeight: 600 }}>
                                            Cumulative Papers
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    {submissionsPerTopic.length > 0 && (
                                        <Box sx={{
                                            p: 2,
                                            bgcolor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb',
                                            borderRadius: '12px',
                                            border: `1px solid ${isDark ? 'rgba(245, 158, 11, 0.25)' : '#fde68a'}`,
                                            textAlign: 'center',
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                                                <EmojiEventsRoundedIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                                                <Typography sx={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    Most Popular Sub-Theme
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontWeight: 700, fontSize: '0.825rem', color: c.textPrimary, lineHeight: 1.3 }}>
                                                {submissionsPerTopic[0].topic}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.725rem', color: c.textMuted, mt: 0.25 }}>
                                                <strong>{submissionsPerTopic[0].count}</strong> papers registered
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* ── ROW 6: Materio Total Earning / Breakdown (5 cols) + Recent Submissions (7 cols) ── */}
                <Grid container spacing={3}>
                    {/* Materio Distribution Breakdown Card */}
                    <Grid size={{ xs: 12, lg: 5 }}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                boxShadow: isDark ? 'none' : '0 4px 20px -2px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.025rem', color: c.textPrimary }}>
                                            Category & Format Ratio
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.78rem' }}>
                                            Participant demographic & presentation breakdown
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Participant Category Progress */}
                                <Typography sx={{ fontSize: '0.725rem', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
                                    Participant Category Breakdown
                                </Typography>

                                <Stack spacing={2} sx={{ mb: 3 }}>
                                    {/* Student */}
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar variant="rounded" sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: isDark ? 'rgba(8, 145, 178, 0.15)' : '#ecfeff', color: '#0891b2' }}>
                                                    <SchoolRoundedIcon sx={{ fontSize: 14 }} />
                                                </Avatar>
                                                <Typography sx={{ fontSize: '0.825rem', fontWeight: 600, color: c.textPrimary }}>
                                                    Student
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: '0.825rem', fontWeight: 700, color: c.textPrimary }}>
                                                {studentCount} ({Math.round((studentCount / totalParticipantsCategorized) * 100)}%)
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(studentCount / totalParticipantsCategorized) * 100}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                '& .MuiLinearProgress-bar': { bgcolor: '#0891b2', borderRadius: 3 },
                                            }}
                                        />
                                    </Box>

                                    {/* Professional */}
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar variant="rounded" sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#fff7ed', color: '#ea580c' }}>
                                                    <WorkRoundedIcon sx={{ fontSize: 14 }} />
                                                </Avatar>
                                                <Typography sx={{ fontSize: '0.825rem', fontWeight: 600, color: c.textPrimary }}>
                                                    Professional
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: '0.825rem', fontWeight: 700, color: c.textPrimary }}>
                                                {professionalCount} ({Math.round((professionalCount / totalParticipantsCategorized) * 100)}%)
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(professionalCount / totalParticipantsCategorized) * 100}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                '& .MuiLinearProgress-bar': { bgcolor: '#ea580c', borderRadius: 3 },
                                            }}
                                        />
                                    </Box>

                                    {/* International Delegate */}
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar variant="rounded" sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: isDark ? 'rgba(124, 58, 237, 0.15)' : '#f5f3ff', color: '#7c3aed' }}>
                                                    <PublicRoundedIcon sx={{ fontSize: 14 }} />
                                                </Avatar>
                                                <Typography sx={{ fontSize: '0.825rem', fontWeight: 600, color: c.textPrimary }}>
                                                    International Delegate
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: '0.825rem', fontWeight: 700, color: c.textPrimary }}>
                                                {internationalCount} ({Math.round((internationalCount / totalParticipantsCategorized) * 100)}%)
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(internationalCount / totalParticipantsCategorized) * 100}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                '& .MuiLinearProgress-bar': { bgcolor: '#7c3aed', borderRadius: 3 },
                                            }}
                                        />
                                    </Box>
                                </Stack>

                                <Divider sx={{ my: 2.5, borderColor: c.cardBorder }} />

                                {/* Presentation Format */}
                                <Typography sx={{ fontSize: '0.725rem', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
                                    Presentation Format Ratio
                                </Typography>

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                    <Box sx={{ p: 1.75, borderRadius: '12px', bgcolor: isDark ? 'rgba(37,99,235,0.1)' : '#eff6ff', border: `1px solid ${isDark ? 'rgba(37,99,235,0.25)' : '#bfdbfe'}` }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <MicRoundedIcon sx={{ fontSize: 18, color: '#2563eb' }} />
                                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>
                                                Oral Presentation
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: c.textPrimary }}>
                                            {totalOral} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>({Math.round((totalOral / totalPresentations) * 100)}%)</span>
                                        </Typography>
                                    </Box>

                                    <Box sx={{ p: 1.75, borderRadius: '12px', bgcolor: isDark ? 'rgba(124,58,237,0.1)' : '#f5f3ff', border: `1px solid ${isDark ? 'rgba(124,58,237,0.25)' : '#ddd6fe'}` }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <ViewCompactRoundedIcon sx={{ fontSize: 18, color: '#7c3aed' }} />
                                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed' }}>
                                                Poster Presentation
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: c.textPrimary }}>
                                            {totalPoster} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>({Math.round((totalPoster / totalPresentations) * 100)}%)</span>
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Materio Recent Submissions Card */}
                    <Grid size={{ xs: 12, lg: 7 }}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                boxShadow: isDark ? 'none' : '0 4px 20px -2px rgba(0,0,0,0.05)',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.025rem', color: c.textPrimary }}>
                                            Recent Submissions
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.78rem' }}>
                                            Latest paper registrations waiting for editorial flow
                                        </Typography>
                                    </Box>
                                    <Button
                                        component={Link}
                                        href={route('admin.submissions')}
                                        size="small"
                                        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                            color: '#0d7a6a',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                bgcolor: isDark ? 'rgba(13, 122, 106, 0.15)' : '#ecfdf5',
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
                                                        py: 1.75,
                                                        px: 1,
                                                        borderRadius: '10px',
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.025)' : '#f8fafc',
                                                        },
                                                    }}
                                                >
                                                    <Avatar
                                                        variant="rounded"
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #0d7a6a, #10b981)',
                                                            color: '#ffffff',
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: '10px',
                                                            flexShrink: 0,
                                                            fontWeight: 800,
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        {(sub.user?.name || 'A').charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 700,
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
                                                            by <strong>{sub.user?.name || 'Unknown'}</strong> • {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={status.label}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: status.bg,
                                                            color: status.color,
                                                            border: `1px solid ${status.border}`,
                                                            fontWeight: 700,
                                                            fontSize: '0.7rem',
                                                            height: 24,
                                                            borderRadius: '8px',
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 5 }}>
                                        <DescriptionRoundedIcon sx={{ fontSize: 48, color: c.textMuted, opacity: 0.3, mb: 1 }} />
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontWeight: 500 }}>
                                            No recent submissions registered yet
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </SidebarLayout>
    );
}
