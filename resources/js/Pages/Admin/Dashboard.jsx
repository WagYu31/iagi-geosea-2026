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
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import ViewWeekRoundedIcon from '@mui/icons-material/ViewWeekRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';

export default function AdminDashboard({
    analytics,
    recentSubmissions = [],
    pendingPayments = 0,
    submissionsPerTopic = [],
    participantStats = {},
    submissionsPerTopicByParticipant = [],
    visitorAnalytics = {},
    dailyVisitors = [],
    submissionStatusCounts = {},
}) {
    const { auth } = usePage().props;
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const [categoryFilter, setCategoryFilter] = useState('all');
    const [participantFilter, setParticipantFilter] = useState('all');

    // Topic chart customizer state (Chart type, orientation, and limit)
    const [chartType, setChartType] = useState('bar'); // 'area' | 'bar'
    const [chartOrientation, setChartOrientation] = useState('landscape'); // 'landscape' | 'horizontal'
    const [topicLimit, setTopicLimit] = useState(15); // 10 | 15 | 'all'

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

    // Submission status state with initial fallback & live auto-refresh
    const [statusCounts, setStatusCounts] = useState(() => ({
        pending: submissionStatusCounts?.pending ?? analytics?.pendingReviews ?? 0,
        under_review: submissionStatusCounts?.under_review ?? 0,
        revision_required_phase1: submissionStatusCounts?.revision_required_phase1 ?? 0,
        revision_required_phase2: submissionStatusCounts?.revision_required_phase2 ?? 0,
        accepted: submissionStatusCounts?.accepted ?? analytics?.acceptedSubmissions ?? 0,
        rejected: submissionStatusCounts?.rejected ?? analytics?.rejectedSubmissions ?? 0,
        deletion_requested: submissionStatusCounts?.deletion_requested ?? 0,
        all: submissionStatusCounts?.all ?? analytics?.totalSubmissions ?? 0,
    }));
    const [subLastUpdated, setSubLastUpdated] = useState(new Date());
    const [isSubRefreshing, setIsSubRefreshing] = useState(false);
    const subRefreshTimerRef = useRef(null);

    const fetchSubStatusData = useCallback(() => {
        setIsSubRefreshing(true);
        fetch('/admin/submission-analytics', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        })
            .then(res => {
                if (!res.ok) throw new Error('API error');
                return res.json();
            })
            .then(data => {
                if (data?.statusCounts) {
                    setStatusCounts(data.statusCounts);
                }
                setSubLastUpdated(new Date());
                setIsSubRefreshing(false);
            })
            .catch(() => setIsSubRefreshing(false));
    }, []);

    useEffect(() => {
        fetchSubStatusData();
        subRefreshTimerRef.current = setInterval(fetchSubStatusData, 60000);
        return () => clearInterval(subRefreshTimerRef.current);
    }, [fetchSubStatusData]);

    const statusPieItems = useMemo(() => {
        return [
            { id: 'accepted', label: 'Accepted', value: statusCounts.accepted || 0, color: '#10b981' },
            { id: 'rejected', label: 'Rejected', value: statusCounts.rejected || 0, color: '#ef4444' },
            { id: 'under_review', label: 'In Review', value: statusCounts.under_review || 0, color: '#0284c7' },
            { id: 'pending', label: 'Pending', value: statusCounts.pending || 0, color: '#64748b' },
            ...(statusCounts.revision_required_phase1 > 0 ? [
                { id: 'revision_required_phase1', label: 'Revision P1', value: statusCounts.revision_required_phase1, color: '#f59e0b' }
            ] : []),
            ...(statusCounts.revision_required_phase2 > 0 ? [
                { id: 'revision_required_phase2', label: 'Revision P2', value: statusCounts.revision_required_phase2, color: '#ea580c' }
            ] : []),
            ...(statusCounts.deletion_requested > 0 ? [
                { id: 'deletion_requested', label: 'Delete Req.', value: statusCounts.deletion_requested, color: '#94a3b8' }
            ] : []),
        ];
    }, [statusCounts]);

    const activeStatusPieData = useMemo(() => {
        return statusPieItems.filter(item => item.value > 0);
    }, [statusPieItems]);

    const totalStatusCount = useMemo(() => {
        return statusPieItems.reduce((acc, curr) => acc + curr.value, 0);
    }, [statusPieItems]);

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

    // Apply topic limit for landscape display
    const displayTopics = useMemo(() => {
        let data = filteredSubmissionsPerTopic;
        if (topicLimit !== 'all') {
            data = data.slice(0, Number(topicLimit));
        }
        return data;
    }, [filteredSubmissionsPerTopic, topicLimit]);

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

                {/* ── ROW 1: Conference Statistics Overview Banner ── */}
                <Grid container spacing={3} sx={{ mb: 3.5 }}>
                    <Grid size={{ xs: 12 }}>
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

                    {/* 2. Paper Submissions Status Pie Chart Card */}
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
                            <Box sx={{ p: { xs: 2.5, sm: 3 }, pb: 2 }}>
                                {/* Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '1.025rem', color: c.textPrimary }}>
                                                Status Submission
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', gap: 0.5,
                                                px: 0.85, py: 0.2,
                                                bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                                                borderRadius: '6px',
                                                border: `1px solid ${isDark ? 'rgba(16,185,129,0.3)' : '#a7f3d0'}`,
                                            }}>
                                                <Box sx={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    bgcolor: '#10b981',
                                                    animation: 'pulseDot 2s infinite',
                                                }} />
                                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                                                    {totalStatusCount || totalSubmissions} Papers
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, mt: 0.25 }}>
                                            Paper status breakdown • Updated {subLastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Box>

                                    {/* Action buttons */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Tooltip title="Refresh Status Submission">
                                            <IconButton
                                                size="small"
                                                onClick={fetchSubStatusData}
                                                disabled={isSubRefreshing}
                                                sx={{
                                                    p: 0.6,
                                                    borderRadius: '8px',
                                                    border: `1px solid ${c.cardBorder}`,
                                                    bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                                                    color: c.textMuted,
                                                    '&:hover': { color: '#0d7a6a', bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' },
                                                }}
                                            >
                                                <RefreshRoundedIcon sx={{ fontSize: 16, animation: isSubRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                                            </IconButton>
                                        </Tooltip>

                                        <Button
                                            component={Link}
                                            href={route('admin.submissions')}
                                            size="small"
                                            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />}
                                            sx={{
                                                px: 1.5,
                                                py: 0.45,
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                textTransform: 'none',
                                                borderRadius: '8px',
                                                border: `1px solid ${c.cardBorder}`,
                                                bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                                                color: c.textPrimary,
                                                '&:hover': {
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                    borderColor: '#0d7a6a',
                                                    color: '#0d7a6a',
                                                },
                                            }}
                                        >
                                            Kelola
                                        </Button>
                                    </Box>
                                </Box>

                                {/* 4 Key Status Metric Cards (Accepted, In Review, Rejected, Pending) */}
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: 1.25,
                                    pt: 1.25,
                                    pb: 1.5,
                                    borderTop: `1px solid ${c.cardBorder}`,
                                    borderBottom: `1px solid ${c.cardBorder}`,
                                }}>
                                    {[
                                        { label: 'Accepted', value: statusCounts.accepted || 0, color: '#10b981', bg: isDark ? 'rgba(16,185,129,0.12)' : '#ecfdf5', border: isDark ? 'rgba(16,185,129,0.25)' : '#a7f3d0', status: 'accepted' },
                                        { label: 'In Review', value: statusCounts.under_review || 0, color: '#0284c7', bg: isDark ? 'rgba(2,132,199,0.12)' : '#f0f9ff', border: isDark ? 'rgba(2,132,199,0.25)' : '#bae6fd', status: 'under_review' },
                                        { label: 'Rejected', value: statusCounts.rejected || 0, color: '#ef4444', bg: isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2', border: isDark ? 'rgba(239,68,68,0.25)' : '#fecaca', status: 'rejected' },
                                        { label: 'Pending', value: statusCounts.pending || 0, color: '#64748b', bg: isDark ? 'rgba(100,116,139,0.12)' : '#f8fafc', border: isDark ? 'rgba(100,116,139,0.25)' : '#e2e8f0', status: 'pending' },
                                    ].map((m) => (
                                        <Box
                                            key={m.label}
                                            component={Link}
                                            href={route('admin.submissions', { status: m.status })}
                                            sx={{
                                                textAlign: 'center',
                                                textDecoration: 'none',
                                                py: 0.75,
                                                px: 0.5,
                                                borderRadius: '10px',
                                                bgcolor: m.bg,
                                                border: `1px solid ${m.border}`,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 4px 12px ${m.color}22`,
                                                },
                                            }}
                                        >
                                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: m.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                {m.label}
                                            </Typography>
                                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: m.color, lineHeight: 1.15, mt: 0.25 }}>
                                                {m.value.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Side-by-Side Donut & Detailed Status Breakdown Rows */}
                                <Grid container spacing={2} sx={{ alignItems: 'center', mt: 0.5 }}>
                                    {/* Left Column: Centered Donut Chart with Inner Metric & Acceptance Badge */}
                                    <Grid size={{ xs: 12, sm: 4.5, md: 4.5 }}>
                                        <Box sx={{ position: 'relative', width: '100%', height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {activeStatusPieData.length > 0 ? (
                                                <>
                                                    <PieChart
                                                        hideLegend={true}
                                                        slots={{ legend: () => null }}
                                                        series={[{
                                                            data: activeStatusPieData,
                                                            innerRadius: 50,
                                                            outerRadius: 76,
                                                            paddingAngle: 3,
                                                            cornerRadius: 5,
                                                            highlightScope: { fade: 'global', highlight: 'item' },
                                                            faded: { innerRadius: 46, additionalRadius: -3, opacity: 0.35 },
                                                            valueFormatter: (item) => `${item.value} paper${item.value > 1 ? 's' : ''} (${totalStatusCount > 0 ? ((item.value / totalStatusCount) * 100).toFixed(1) : 0}%)`,
                                                        }]}
                                                        margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                                        height={190}
                                                        sx={{
                                                            '& .MuiChartsLegend-root': { display: 'none !important' },
                                                            '& .MuiPieArc-root': {
                                                                stroke: isDark ? '#1e293b' : '#ffffff',
                                                                strokeWidth: 2.5,
                                                            },
                                                        }}
                                                    />
                                                    {/* Center Donut Hole Content */}
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        textAlign: 'center',
                                                        pointerEvents: 'none',
                                                    }}>
                                                        <Typography sx={{ fontWeight: 900, fontSize: '1.35rem', color: c.textPrimary, lineHeight: 1 }}>
                                                            {totalStatusCount}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.625rem', color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', mt: 0.25 }}>
                                                            Papers
                                                        </Typography>
                                                    </Box>
                                                </>
                                            ) : (
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 1 }}>
                                                    <PieChartRoundedIcon sx={{ fontSize: 40, color: c.textMuted, opacity: 0.4 }} />
                                                    <Typography sx={{ color: c.textMuted, fontSize: '0.8rem' }}>No submission status data</Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Acceptance Rate pill under Donut */}
                                        {totalStatusCount > 0 && (
                                            <Box sx={{ textAlign: 'center', mt: 0.5 }}>
                                                <Chip
                                                    size="small"
                                                    icon={<CheckCircleRoundedIcon sx={{ fontSize: '14px !important' }} />}
                                                    label={`Acceptance: ${((statusCounts.accepted / totalStatusCount) * 100).toFixed(1)}%`}
                                                    sx={{
                                                        fontWeight: 700,
                                                        fontSize: '0.72rem',
                                                        bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                                                        color: '#059669',
                                                        border: `1px solid ${isDark ? 'rgba(16,185,129,0.3)' : '#a7f3d0'}`,
                                                        height: 24,
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Grid>

                                    {/* Right Column: Detailed Status Breakdown Rows with Progress Bars */}
                                    <Grid size={{ xs: 12, sm: 7.5, md: 7.5 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.9 }}>
                                            {statusPieItems.map((item) => {
                                                const pct = totalStatusCount > 0 ? ((item.value / totalStatusCount) * 100).toFixed(1) : '0';
                                                return (
                                                    <Box
                                                        key={item.id}
                                                        component={Link}
                                                        href={route('admin.submissions', { status: item.id })}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            px: 1.5,
                                                            py: 0.75,
                                                            borderRadius: '10px',
                                                            textDecoration: 'none',
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                                            border: `1px solid ${c.cardBorder}`,
                                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            '&:hover': {
                                                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
                                                                borderColor: item.color,
                                                                boxShadow: `0 2px 8px ${item.color}18`,
                                                                transform: 'translateX(3px)',
                                                            },
                                                        }}
                                                    >
                                                        {/* Color Dot & Status Label */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 90 }}>
                                                            <Box sx={{
                                                                width: 9,
                                                                height: 9,
                                                                borderRadius: '50%',
                                                                bgcolor: item.color,
                                                                boxShadow: `0 0 6px ${item.color}88`,
                                                                flexShrink: 0,
                                                            }} />
                                                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: c.textPrimary }}>
                                                                {item.label}
                                                            </Typography>
                                                        </Box>

                                                        {/* Mini Progress Bar */}
                                                        <Box sx={{ flex: 1, mx: 1.5, display: { xs: 'none', sm: 'block' } }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={Number(pct)}
                                                                sx={{
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                                                                    '& .MuiLinearProgress-bar': {
                                                                        bgcolor: item.color,
                                                                        borderRadius: 3,
                                                                    },
                                                                }}
                                                            />
                                                        </Box>

                                                        {/* Count and Percentage Badge */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: c.textPrimary }}>
                                                                {item.value.toLocaleString()}
                                                            </Typography>
                                                            <Typography sx={{
                                                                fontSize: '0.68rem',
                                                                fontWeight: 700,
                                                                color: c.textMuted,
                                                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                                                                px: 0.75,
                                                                py: 0.2,
                                                                borderRadius: '5px',
                                                            }}>
                                                                {pct}%
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Grid>
                                </Grid>
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
                            {/* Chart Header & Toggles */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2.5 }}>
                                {/* Top Controls Row */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
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
                                            {chartType === 'area' ? (
                                                <ShowChartRoundedIcon sx={{ fontSize: 24 }} />
                                            ) : (
                                                <BarChartRoundedIcon sx={{ fontSize: 24 }} />
                                            )}
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

                                    {/* TIPE GRAFIK & ORIENTASI TOGGLE (Materio Style Pill) */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                        {/* Tipe Grafik Toggle */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: isDark ? '#94a3b8' : '#8896a6', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                                TIPE GRAFIK:
                                            </Typography>
                                            <Box sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#eef2f6',
                                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#dce3eb'}`,
                                                borderRadius: '9999px',
                                                p: '3px',
                                                gap: 0.5,
                                            }}>
                                                <Button
                                                    size="small"
                                                    onClick={() => setChartType('area')}
                                                    disableElevation
                                                    sx={{
                                                        borderRadius: '9999px',
                                                        px: 2,
                                                        py: 0.5,
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        fontSize: '0.82rem',
                                                        lineHeight: 1.4,
                                                        color: chartType === 'area' ? '#ffffff' : (isDark ? '#cbd5e1' : '#334155'),
                                                        bgcolor: chartType === 'area' ? '#0d7a6a' : 'transparent',
                                                        boxShadow: chartType === 'area' ? '0 2px 6px rgba(13,122,106,0.35)' : 'none',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            bgcolor: chartType === 'area' ? '#094d42' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                                                        },
                                                    }}
                                                >
                                                    Area / Garis
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={() => setChartType('bar')}
                                                    disableElevation
                                                    sx={{
                                                        borderRadius: '9999px',
                                                        px: 2,
                                                        py: 0.5,
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        fontSize: '0.82rem',
                                                        lineHeight: 1.4,
                                                        color: chartType === 'bar' ? '#ffffff' : (isDark ? '#cbd5e1' : '#334155'),
                                                        bgcolor: chartType === 'bar' ? '#0d7a6a' : 'transparent',
                                                        boxShadow: chartType === 'bar' ? '0 2px 6px rgba(13,122,106,0.35)' : 'none',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            bgcolor: chartType === 'bar' ? '#094d42' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                                                        },
                                                    }}
                                                >
                                                    Batang (Bar)
                                                </Button>
                                            </Box>
                                        </Box>

                                        {/* Orientasi (for Bar Chart) */}
                                        {chartType === 'bar' && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: isDark ? '#94a3b8' : '#8896a6', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                                    ORIENTASI:
                                                </Typography>
                                                <Box sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#eef2f6',
                                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#dce3eb'}`,
                                                    borderRadius: '9999px',
                                                    p: '3px',
                                                    gap: 0.5,
                                                }}>
                                                    <Button
                                                        size="small"
                                                        onClick={() => setChartOrientation('landscape')}
                                                        disableElevation
                                                        sx={{
                                                            borderRadius: '9999px',
                                                            px: 1.75,
                                                            py: 0.5,
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            fontSize: '0.8rem',
                                                            lineHeight: 1.4,
                                                            color: chartOrientation === 'landscape' ? '#ffffff' : (isDark ? '#cbd5e1' : '#334155'),
                                                            bgcolor: chartOrientation === 'landscape' ? '#0d7a6a' : 'transparent',
                                                            boxShadow: chartOrientation === 'landscape' ? '0 2px 6px rgba(13,122,106,0.35)' : 'none',
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                bgcolor: chartOrientation === 'landscape' ? '#094d42' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                                                            },
                                                        }}
                                                    >
                                                        Landscape
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        onClick={() => setChartOrientation('horizontal')}
                                                        disableElevation
                                                        sx={{
                                                            borderRadius: '9999px',
                                                            px: 1.75,
                                                            py: 0.5,
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            fontSize: '0.8rem',
                                                            lineHeight: 1.4,
                                                            color: chartOrientation === 'horizontal' ? '#ffffff' : (isDark ? '#cbd5e1' : '#334155'),
                                                            bgcolor: chartOrientation === 'horizontal' ? '#0d7a6a' : 'transparent',
                                                            boxShadow: chartOrientation === 'horizontal' ? '0 2px 6px rgba(13,122,106,0.35)' : 'none',
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                bgcolor: chartOrientation === 'horizontal' ? '#094d42' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                                                            },
                                                        }}
                                                    >
                                                        Horizontal
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>

                                {/* Second Controls Row: Presentation, Participant, and Limit filters */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, pt: 1, borderTop: `1px solid ${c.cardBorder}` }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                                        {/* Oral / Poster filter */}
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

                                        {/* Participant Category filter */}
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

                                    {/* Topic Limit Selector */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography sx={{ fontSize: '0.725rem', fontWeight: 700, color: c.textMuted }}>
                                            TAMPILKAN:
                                        </Typography>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                                            border: `1px solid ${c.cardBorder}`,
                                            borderRadius: '8px',
                                            p: 0.25,
                                        }}>
                                            {[
                                                { val: 10, label: 'Top 10' },
                                                { val: 15, label: 'Top 15' },
                                                { val: 'all', label: `Semua (${filteredSubmissionsPerTopic.length})` },
                                            ].map((lim) => (
                                                <Button
                                                    key={lim.val}
                                                    size="small"
                                                    onClick={() => setTopicLimit(lim.val)}
                                                    sx={{
                                                        px: 1.25,
                                                        py: 0.3,
                                                        fontSize: '0.725rem',
                                                        fontWeight: 700,
                                                        textTransform: 'none',
                                                        minWidth: 'auto',
                                                        borderRadius: '6px',
                                                        ...(topicLimit === lim.val ? {
                                                            bgcolor: '#0d7a6a',
                                                            color: '#ffffff',
                                                            '&:hover': { bgcolor: '#094d42' }
                                                        } : {
                                                            color: c.textMuted,
                                                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' },
                                                        }),
                                                    }}
                                                >
                                                    {lim.label}
                                                </Button>
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Chart Display Container */}
                            <Box sx={{
                                width: '100%',
                                bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#ffffff',
                                borderRadius: '14px',
                                p: { xs: 1, sm: 2 },
                                border: `1px solid ${c.cardBorder}`,
                                overflowX: (chartType === 'area' || (chartType === 'bar' && chartOrientation === 'landscape')) && topicLimit === 'all' && displayTopics.length > 15 ? 'auto' : 'visible',
                                ...(chartType === 'bar' && chartOrientation === 'horizontal' ? {
                                    maxHeight: 520,
                                    overflowY: 'auto',
                                } : {}),
                            }}>
                                <Box sx={{
                                    minWidth: (chartType === 'area' || (chartType === 'bar' && chartOrientation === 'landscape')) && topicLimit === 'all' && displayTopics.length > 15 
                                        ? Math.max(900, displayTopics.length * 48) 
                                        : '100%',
                                    height: chartType === 'bar' && chartOrientation === 'horizontal' 
                                        ? Math.max(380, displayTopics.length * 40)
                                        : 420,
                                }}>
                                    {displayTopics.length === 0 ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column' }}>
                                            <Typography sx={{ color: c.textMuted, fontSize: '0.85rem' }}>No topic submissions matching current filter</Typography>
                                        </Box>
                                    ) : chartType === 'area' ? (
                                        /* ── Line / Area Chart (Landscape) ── */
                                        <LineChart
                                            xAxis={[{
                                                data: displayTopics.map((_, i) => i),
                                                scaleType: 'point',
                                                valueFormatter: (idx) => displayTopics[idx]?.topic || '',
                                                tickLabelStyle: {
                                                    angle: -30,
                                                    textAnchor: 'end',
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    fill: isDark ? '#d1d5db' : '#334155',
                                                },
                                            }]}
                                            yAxis={[{
                                                tickMinStep: 1,
                                                tickLabelStyle: {
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    fill: isDark ? '#9ca3af' : '#64748b',
                                                },
                                            }]}
                                            series={[{
                                                data: displayTopics.map(d => d.count),
                                                label: categoryFilter === 'all' ? 'Total Papers' :
                                                    categoryFilter === 'oral_presentation' ? 'Oral Presentations' : 'Poster Presentations',
                                                color: categoryFilter === 'all' ? '#0d7a6a' :
                                                    categoryFilter === 'oral_presentation' ? '#2563eb' : '#7c3aed',
                                                area: true,
                                                curve: 'catmullRom',
                                                showMark: true,
                                                valueFormatter: (value) => `${value} paper${value > 1 ? 's' : ''}`,
                                            }]}
                                            margin={{ top: 25, bottom: 95, left: 55, right: 30 }}
                                            grid={{ horizontal: true, vertical: true }}
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
                                            }}
                                            sx={{
                                                '& .MuiChartsAxis-tickLabel': { fill: isDark ? '#d1d5db' : '#334155', fontWeight: 600 },
                                                '& .MuiChartsAxis-line': { stroke: c.cardBorder, strokeWidth: 1 },
                                                '& .MuiChartsGrid-line': { stroke: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', strokeDasharray: '4 4' },
                                                '& .MuiAreaElement-root': {
                                                    fill: 'url(#dashboardTopicLineGradient)',
                                                    opacity: 1,
                                                },
                                                '& .MuiLineElement-root': { strokeWidth: 3 },
                                                '& .MuiMarkElement-root': { strokeWidth: 2, r: 4, fill: isDark ? '#1a1d27' : '#ffffff' },
                                            }}
                                        >
                                            <defs>
                                                <linearGradient id="dashboardTopicLineGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={categoryFilter === 'all' ? '#0d7a6a' : categoryFilter === 'oral_presentation' ? '#2563eb' : '#7c3aed'} stopOpacity={0.35} />
                                                    <stop offset="100%" stopColor={categoryFilter === 'all' ? '#0d7a6a' : categoryFilter === 'oral_presentation' ? '#2563eb' : '#7c3aed'} stopOpacity={0.02} />
                                                </linearGradient>
                                            </defs>
                                        </LineChart>
                                    ) : chartOrientation === 'landscape' ? (
                                        /* ── Bar Chart Landscape (Vertical Columns) ── */
                                        <BarChart
                                            dataset={displayTopics}
                                            xAxis={[{
                                                scaleType: 'band',
                                                dataKey: 'topic',
                                                tickLabelStyle: {
                                                    angle: -30,
                                                    textAnchor: 'end',
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    fill: isDark ? '#d1d5db' : '#334155',
                                                },
                                            }]}
                                            yAxis={[{
                                                tickMinStep: 1,
                                                tickLabelStyle: {
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    fill: isDark ? '#9ca3af' : '#64748b',
                                                },
                                            }]}
                                            series={[{
                                                dataKey: 'count',
                                                label: categoryFilter === 'all' ? 'Total Papers' :
                                                    categoryFilter === 'oral_presentation' ? 'Oral Presentations' : 'Poster Presentations',
                                                color: categoryFilter === 'all' ? '#0d7a6a' :
                                                    categoryFilter === 'oral_presentation' ? '#2563eb' : '#7c3aed',
                                                valueFormatter: (value) => `${value} paper${value > 1 ? 's' : ''}`,
                                            }]}
                                            margin={{ top: 25, bottom: 95, left: 55, right: 30 }}
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
                                                '& .MuiChartsAxis-tickLabel': { fill: isDark ? '#d1d5db' : '#334155', fontWeight: 600 },
                                                '& .MuiChartsAxis-line': { stroke: c.cardBorder, strokeWidth: 1 },
                                                '& .MuiChartsGrid-line': { stroke: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', strokeDasharray: '4 4' },
                                            }}
                                        />
                                    ) : (
                                        /* ── Bar Chart Horizontal (Horizontal Bars) ── */
                                        <BarChart
                                            dataset={displayTopics}
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
                                            series={[{
                                                dataKey: 'count',
                                                label: categoryFilter === 'all' ? 'Total Papers' :
                                                    categoryFilter === 'oral_presentation' ? 'Oral Presentations' : 'Poster Presentations',
                                                color: categoryFilter === 'all' ? '#0d7a6a' :
                                                    categoryFilter === 'oral_presentation' ? '#2563eb' : '#7c3aed',
                                                valueFormatter: (value) => `${value} paper${value > 1 ? 's' : ''}`,
                                            }]}
                                            margin={{ top: 25, bottom: 45, left: 160, right: 40 }}
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
                                    )}
                                </Box>
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
