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
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { motion } from 'motion/react';

// ── ELEGANT REALTIME COUNT-UP ANIMATION COMPONENT ──
function AnimatedNumber({ value, format = 'number', prefix = '', suffix = '', duration = 1400, delay = 0 }) {
    const numericValue = useMemo(() => {
        if (typeof value === 'number') return isNaN(value) ? 0 : value;
        const parsed = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
        return isNaN(parsed) ? 0 : parsed;
    }, [value]);

    const [currentVal, setCurrentVal] = useState(0);

    useEffect(() => {
        let startTime = null;
        let animationFrame;
        const startVal = 0;
        const endVal = numericValue;

        if (endVal === 0) {
            setCurrentVal(0);
            return;
        }

        const timeoutId = setTimeout(() => {
            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                // Silk-smooth cubic ease out: starts with momentum and glides to a stop
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = startVal + (endVal - startVal) * easeProgress;
                setCurrentVal(current);

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(step);
                } else {
                    setCurrentVal(endVal);
                }
            };
            animationFrame = requestAnimationFrame(step);
        }, delay * 1000);

        return () => {
            clearTimeout(timeoutId);
            cancelAnimationFrame(animationFrame);
        };
    }, [numericValue, duration, delay]);

    if (format === 'currency') {
        const rounded = Math.round(currentVal);
        return (
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                {prefix}Rp {rounded.toLocaleString('id-ID')}{suffix}
            </span>
        );
    }

    if (format === 'decimal') {
        return (
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                {prefix}{currentVal.toFixed(1)}{suffix}
            </span>
        );
    }

    if (format === 'percent') {
        return (
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                {prefix}{Math.round(currentVal)}%{suffix}
            </span>
        );
    }

    return (
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {prefix}{Math.round(currentVal).toLocaleString('id-ID')}{suffix}
        </span>
    );
}

// ── ELEGANT REALTIME PROGRESS BAR ANIMATION ──
function AnimatedProgressBar({
    value = 0,
    color = '#0d7a6a',
    height = 6,
    borderRadius = 3,
    bg = null,
    delay = 0.1,
    duration = 1.3,
    sx = {}
}) {
    const isDark = useTheme().palette.mode === 'dark';
    const trackBg = bg || (isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0');
    const clampedVal = Math.max(0, Math.min(100, Number(value) || 0));

    return (
        <Box sx={{ width: '100%', height, borderRadius, bgcolor: trackBg, overflow: 'hidden', position: 'relative', ...sx }}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${clampedVal}%` }}
                transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    height: '100%',
                    borderRadius,
                    background: color,
                }}
            />
        </Box>
    );
}

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
    paymentAnalytics = {},
    visitorTicketAnalytics = {},
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

    // Helper formatters
    const formatIDR = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(val) || 0);
    };

    const formatNumber = (val) => {
        return new Intl.NumberFormat('id-ID').format(Number(val) || 0);
    };

    // Normalized stats for Payments & Visitor Tickets
    const payStats = {
        totalRevenue: paymentAnalytics?.totalRevenue || 0,
        paperRevenue: paymentAnalytics?.paperRevenue || 0,
        paperPaidCount: paymentAnalytics?.paperPaidCount || analytics?.verifiedPayments || 0,
        paperPendingCount: paymentAnalytics?.paperPendingCount ?? pendingPayments ?? 0,
        visitorRevenue: paymentAnalytics?.visitorRevenue || 0,
        visitorPaidCount: paymentAnalytics?.visitorPaidCount || 0,
        visitorPendingCount: paymentAnalytics?.visitorPendingCount || 0,
        visitorDebtCount: paymentAnalytics?.visitorDebtCount || 0,
        totalPendingCount: (paymentAnalytics?.totalPendingCount ?? pendingPayments) || 0,
    };

    const ticketStats = {
        totalVisitors: visitorTicketAnalytics?.totalVisitors || 0,
        checkedInCount: visitorTicketAnalytics?.checkedInCount || 0,
        notCheckedInCount: visitorTicketAnalytics?.notCheckedInCount || 0,
        exclusiveCount: visitorTicketAnalytics?.exclusiveCount || 0,
        nonExclusiveCount: visitorTicketAnalytics?.nonExclusiveCount || 0,
        pendingCount: visitorTicketAnalytics?.pendingCount || 0,
        checkInRate: visitorTicketAnalytics?.checkInRate || 0,
    };

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
            label: 'Visitor Tickets',
            href: route('admin.visitorTickets'),
            icon: <ConfirmationNumberRoundedIcon />,
            color: '#0284c7',
            bgColor: isDark ? 'rgba(2, 132, 199, 0.15)' : '#f0f9ff',
        },
        {
            label: 'Gate Scanner',
            href: route('admin.gateScanner'),
            icon: <QrCodeScannerRoundedIcon />,
            color: '#10b981',
            bgColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
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
        {
            label: 'Landing Page',
            href: '/',
            icon: <PublicRoundedIcon />,
            color: '#059669',
            bgColor: isDark ? 'rgba(5, 150, 105, 0.15)' : '#ecfdf5',
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
            'pending': { 
                bg: isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.08)', 
                color: '#d97706', 
                border: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.25)', 
                label: 'Pending' 
            },
            'under_review': { 
                bg: isDark ? 'rgba(37, 99, 235, 0.12)' : 'rgba(37, 99, 235, 0.08)', 
                color: '#2563eb', 
                border: isDark ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.25)', 
                label: 'In Review' 
            },
            'accepted': { 
                bg: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)', 
                color: '#059669', 
                border: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.25)', 
                label: 'Accepted' 
            },
            'rejected': { 
                bg: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)', 
                color: '#dc2626', 
                border: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)', 
                label: 'Rejected' 
            },
            'declined': { 
                bg: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)', 
                color: '#dc2626', 
                border: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)', 
                label: 'Declined' 
            },
        };
        return map[status] || { 
            bg: isDark ? 'rgba(107, 114, 128, 0.12)' : 'rgba(107, 114, 128, 0.08)', 
            color: '#64748b', 
            border: isDark ? 'rgba(107, 114, 128, 0.25)' : 'rgba(107, 114, 128, 0.2)', 
            label: status 
        };
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
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
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
                    <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Button
                            component={Link}
                            href={route('admin.payments')}
                            variant="outlined"
                            startIcon={<PaymentRoundedIcon sx={{ fontSize: 18 }} />}
                            sx={{
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)',
                                color: c.textPrimary,
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
                                px: 1.75,
                                py: 0.75,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                                '&:hover': {
                                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f8fafc',
                                    borderColor: '#d97706',
                                    color: '#d97706',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Payments
                            {payStats.totalPendingCount > 0 && (
                                <Box
                                    component="span"
                                    sx={{
                                        ml: 1,
                                        px: 0.75,
                                        py: 0.15,
                                        borderRadius: '999px',
                                        bgcolor: isDark ? 'rgba(217, 119, 6, 0.25)' : '#fef3c7',
                                        color: '#d97706',
                                        fontSize: '0.675rem',
                                        fontWeight: 800,
                                        border: '1px solid rgba(217, 119, 6, 0.3)',
                                    }}
                                >
                                    <AnimatedNumber value={payStats.totalPendingCount} delay={0.42} />
                                </Box>
                            )}
                        </Button>

                        <Button
                            component={Link}
                            href={route('admin.visitorTickets')}
                            variant="outlined"
                            startIcon={<ConfirmationNumberRoundedIcon sx={{ fontSize: 18, color: '#0284c7' }} />}
                            sx={{
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)',
                                color: c.textPrimary,
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
                                px: 1.75,
                                py: 0.75,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                                '&:hover': {
                                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f8fafc',
                                    borderColor: '#0284c7',
                                    color: '#0284c7',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Visitor Tickets
                        </Button>

                        <Button
                            component={Link}
                            href={route('admin.gateScanner')}
                            variant="outlined"
                            startIcon={<QrCodeScannerRoundedIcon sx={{ fontSize: 18, color: '#10b981' }} />}
                            sx={{
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)',
                                color: c.textPrimary,
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
                                px: 1.75,
                                py: 0.75,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                                '&:hover': {
                                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f8fafc',
                                    borderColor: '#10b981',
                                    color: '#10b981',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Gate Scanner
                        </Button>

                        <Button
                            component={Link}
                            href={route('admin.submissions')}
                            variant="contained"
                            startIcon={<ArticleRoundedIcon sx={{ fontSize: 18 }} />}
                            sx={{
                                background: 'linear-gradient(135deg, #064e3b 0%, #0d7a6a 100%)',
                                color: '#ffffff',
                                px: 2.2,
                                py: 0.75,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.825rem',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
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

                        <Button
                            component={Link}
                            href="/"
                            variant="outlined"
                            startIcon={<PublicRoundedIcon sx={{ fontSize: 18, color: '#10b981' }} />}
                            sx={{
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)',
                                color: c.textPrimary,
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
                                px: 1.75,
                                py: 0.75,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                                '&:hover': {
                                    bgcolor: isDark ? 'rgba(16, 185, 129, 0.08)' : '#ecfdf5',
                                    borderColor: '#10b981',
                                    color: '#059669',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Landing Page
                        </Button>
                    </Box>
                </Box>
                </motion.div>

                {/* ── 4-PILLAR MASTER KPI COMMAND GRID (Executive $50M Tier) ── */}
                <Grid container spacing={2.5} sx={{ mb: 3 }}>
                    {/* PILLAR 1: GROSS CONFERENCE REVENUE */}
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%' }}
                        >
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                p: 2.5,
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isDark ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    borderColor: isDark ? 'rgba(217, 119, 6, 0.4)' : '#fde68a',
                                    boxShadow: isDark ? '0 12px 28px rgba(0,0,0,0.4)' : '0 12px 28px rgba(217, 119, 6, 0.08)',
                                },
                            }}
                        >
                            {/* Top Accent Strip */}
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: 'linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #10b981 100%)',
                            }} />

                            <Box>
                                {/* Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '10px',
                                                bgcolor: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb',
                                                color: '#d97706',
                                                border: `1px solid ${isDark ? 'rgba(217, 119, 6, 0.3)' : '#fde68a'}`,
                                            }}
                                        >
                                            <AccountBalanceWalletRoundedIcon sx={{ fontSize: 20 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{
                                                fontFamily: '"Outfit", "Inter", sans-serif',
                                                fontSize: '0.68rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.07em',
                                                color: c.textMuted,
                                            }}>
                                                Conference Revenue
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box component="span" sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#10b981' }} />
                                                Verified Gross
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton
                                        component={Link}
                                        href={route('admin.payments')}
                                        size="small"
                                        sx={{
                                            color: c.textMuted,
                                            '&:hover': { color: '#d97706', bgcolor: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb' },
                                        }}
                                    >
                                        <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>

                                {/* Primary Metric Number */}
                                <Typography sx={{
                                    fontFamily: '"Outfit", "Inter", sans-serif',
                                    fontSize: { xs: '1.4rem', sm: '1.6rem' },
                                    fontWeight: 800,
                                    letterSpacing: '-0.025em',
                                    color: c.textPrimary,
                                    fontVariantNumeric: 'tabular-nums',
                                    lineHeight: 1.15,
                                    mt: 1,
                                    mb: 1.5,
                                fontFamily: '"Outfit", "Inter", sans-serif',
                                }}>
                                    <AnimatedNumber value={payStats.totalRevenue} format="currency" delay={0.52} />
                                </Typography>

                                {/* Breakdown Sub-Row */}
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 1,
                                    p: 1.2,
                                    borderRadius: '10px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder}`,
                                    mb: 1.5,
                                }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase' }}>
                                            Papers (<AnimatedNumber value={payStats.paperPaidCount} delay={0.56} />)
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: c.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                                            <AnimatedNumber value={payStats.paperRevenue} format="currency" delay={0.56} />
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase' }}>
                                            Tickets (<AnimatedNumber value={payStats.visitorPaidCount} delay={0.60} />)
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: c.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                                            <AnimatedNumber value={payStats.visitorRevenue} format="currency" delay={0.60} />
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Bottom Status / Quick Link */}
                            <Box
                                component={Link}
                                href={route('admin.payments')}
                                sx={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 1,
                                    borderRadius: '8px',
                                    bgcolor: payStats.totalPendingCount > 0
                                        ? (isDark ? 'rgba(217, 119, 6, 0.14)' : '#fffbeb')
                                        : (isDark ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5'),
                                    border: `1px solid ${payStats.totalPendingCount > 0
                                        ? (isDark ? 'rgba(217, 119, 6, 0.3)' : '#fde68a')
                                        : (isDark ? 'rgba(16, 185, 129, 0.25)' : '#a7f3d0')}`,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { opacity: 0.85 },
                                }}
                            >
                                <Typography sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    color: payStats.totalPendingCount > 0 ? '#d97706' : '#059669',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.75,
                                }}>
                                    {payStats.totalPendingCount > 0 ? (
                                        <>
                                            <WarningAmberRoundedIcon sx={{ fontSize: 15 }} />
                                            <span><strong><AnimatedNumber value={payStats.totalPendingCount} delay={0.64} /></strong> Pending Audit</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleRoundedIcon sx={{ fontSize: 15 }} />
                                            <span>100% Reconciled</span>
                                        </>
                                    )}
                                </Typography>
                                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: payStats.totalPendingCount > 0 ? '#b45309' : '#047857' }}>
                                    Review →
                                </Typography>
                            </Box>
                        </Card>
                        </motion.div>
                    </Grid>

                    {/* PILLAR 2: SCIENTIFIC PAPERS & SUBMISSIONS */}
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 0.60, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%' }}
                        >
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                p: 2.5,
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isDark ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    borderColor: isDark ? 'rgba(13, 122, 106, 0.4)' : '#a7f3d0',
                                    boxShadow: isDark ? '0 12px 28px rgba(0,0,0,0.4)' : '0 12px 28px rgba(13, 122, 106, 0.08)',
                                },
                            }}
                        >
                            {/* Top Accent Strip */}
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: 'linear-gradient(90deg, #094d42 0%, #0d7a6a 50%, #10b981 100%)',
                            }} />

                            <Box>
                                {/* Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '10px',
                                                bgcolor: isDark ? 'rgba(13, 122, 106, 0.15)' : '#ecfdf5',
                                                color: '#0d7a6a',
                                                border: `1px solid ${isDark ? 'rgba(13, 122, 106, 0.3)' : '#a7f3d0'}`,
                                            }}
                                        >
                                            <ArticleRoundedIcon sx={{ fontSize: 20 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{
                                                fontFamily: '"Outfit", "Inter", sans-serif',
                                                fontSize: '0.68rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.07em',
                                                color: c.textMuted,
                                            }}>
                                                Scientific Papers
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#0d7a6a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box component="span" sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#0d7a6a' }} />
                                                <AnimatedNumber value={submissionsPerTopic.length} delay={0.64} /> Sub-Themes
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton
                                        component={Link}
                                        href={route('admin.submissions')}
                                        size="small"
                                        sx={{
                                            color: c.textMuted,
                                            '&:hover': { color: '#0d7a6a', bgcolor: isDark ? 'rgba(13, 122, 106, 0.15)' : '#ecfdf5' },
                                        }}
                                    >
                                        <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>

                                {/* Primary Metric Number */}
                                <Typography sx={{
                                    fontFamily: '"Outfit", "Inter", sans-serif',
                                    fontSize: { xs: '1.4rem', sm: '1.6rem' },
                                    fontWeight: 800,
                                    letterSpacing: '-0.025em',
                                    color: c.textPrimary,
                                    fontVariantNumeric: 'tabular-nums',
                                    lineHeight: 1.15,
                                    mt: 1,
                                    mb: 1.5,
                                }}>
                                    <AnimatedNumber value={totalSubmissions} delay={0.64} /> <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Submissions</span>
                                </Typography>

                                {/* Acceptance / Breakdown Progress Bar */}
                                <Box sx={{ mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981' }}>
                                            <AnimatedNumber value={acceptedSubmissions} delay={0.68} /> Accepted (<AnimatedNumber value={totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0} format="decimal" suffix="%" delay={0.72} />)
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: c.textMuted }}>
                                            <AnimatedNumber value={rejectedSubmissions} delay={0.68} /> Rejected
                                        </Typography>
                                    </Box>
                                    <AnimatedProgressBar
                                        value={totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0}
                                        color="linear-gradient(90deg, #0d7a6a 0%, #10b981 100%)"
                                        height={7}
                                        borderRadius={4}
                                        delay={0.72}
                                    />
                                </Box>
                            </Box>

                            {/* Bottom Status / Quick Link */}
                            <Box
                                component={Link}
                                href={route('admin.submissions')}
                                sx={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 1,
                                    borderRadius: '8px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder}`,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { borderColor: '#0d7a6a', bgcolor: isDark ? 'rgba(13, 122, 106, 0.1)' : '#ecfdf5' },
                                }}
                            >
                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: c.textMuted }}>
                                    <AnimatedNumber value={totalOral} delay={0.76} /> Oral • <AnimatedNumber value={totalPoster} delay={0.76} /> Poster
                                </Typography>
                                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#0d7a6a' }}>
                                    Manage Papers →
                                </Typography>
                            </Box>
                        </Card>
                        </motion.div>
                    </Grid>

                    {/* PILLAR 3: DELEGATE PASSES & VENUE ATTENDANCE */}
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%' }}
                        >
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                p: 2.5,
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isDark ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    borderColor: isDark ? 'rgba(2, 132, 199, 0.4)' : '#bae6fd',
                                    boxShadow: isDark ? '0 12px 28px rgba(0,0,0,0.4)' : '0 12px 28px rgba(2, 132, 199, 0.08)',
                                },
                            }}
                        >
                            {/* Top Accent Strip */}
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 50%, #818cf8 100%)',
                            }} />

                            <Box>
                                {/* Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '10px',
                                                bgcolor: isDark ? 'rgba(2, 132, 199, 0.15)' : '#f0f9ff',
                                                color: '#0284c7',
                                                border: `1px solid ${isDark ? 'rgba(2, 132, 199, 0.3)' : '#bae6fd'}`,
                                            }}
                                        >
                                            <ConfirmationNumberRoundedIcon sx={{ fontSize: 20 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{
                                                fontFamily: '"Outfit", "Inter", sans-serif',
                                                fontSize: '0.68rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.07em',
                                                color: c.textMuted,
                                            }}>
                                                Delegate Passes
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box component="span" sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#0284c7' }} />
                                                Venue Access
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton
                                        component={Link}
                                        href={route('admin.visitorTickets')}
                                        size="small"
                                        sx={{
                                            color: c.textMuted,
                                            '&:hover': { color: '#0284c7', bgcolor: isDark ? 'rgba(2, 132, 199, 0.15)' : '#f0f9ff' },
                                        }}
                                    >
                                        <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>

                                {/* Primary Metric Number */}
                                <Typography sx={{
                                    fontFamily: '"Outfit", "Inter", sans-serif',
                                    fontSize: { xs: '1.4rem', sm: '1.6rem' },
                                    fontWeight: 800,
                                    letterSpacing: '-0.025em',
                                    color: c.textPrimary,
                                    fontVariantNumeric: 'tabular-nums',
                                    lineHeight: 1.15,
                                    mt: 1,
                                    mb: 1.5,
                                }}>
                                    <AnimatedNumber value={ticketStats.totalVisitors} delay={0.76} /> <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Tickets</span>
                                </Typography>

                                {/* Venue Attendance Progress Bar */}
                                <Box sx={{ mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#0284c7' }}>
                                            <AnimatedNumber value={ticketStats.checkedInCount} delay={0.80} /> Checked In (<AnimatedNumber value={ticketStats.checkInRate} format="decimal" suffix="%" delay={0.84} />)
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: c.textMuted }}>
                                            <AnimatedNumber value={ticketStats.notCheckedInCount} delay={0.80} /> Remaining
                                        </Typography>
                                    </Box>
                                    <AnimatedProgressBar
                                        value={Math.min(100, ticketStats.checkInRate)}
                                        color="linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)"
                                        height={7}
                                        borderRadius={4}
                                        delay={0.84}
                                    />
                                </Box>
                            </Box>

                            {/* Bottom Status / Gate Scanner Trigger */}
                            <Box
                                component={Link}
                                href={route('admin.gateScanner')}
                                sx={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 1,
                                    borderRadius: '8px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder}`,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { borderColor: '#0284c7', bgcolor: isDark ? 'rgba(2, 132, 199, 0.1)' : '#f0f9ff' },
                                }}
                            >
                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: c.textMuted, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <QrCodeScannerRoundedIcon sx={{ fontSize: 14, color: '#0284c7' }} />
                                    Gate Scanner
                                </Typography>
                                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#0284c7' }}>
                                    Open Scanner →
                                </Typography>
                            </Box>
                        </Card>
                        </motion.div>
                    </Grid>

                    {/* PILLAR 4: AUTHORS & EDITORIAL BACKLOG */}
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 0.84, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%' }}
                        >
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                p: 2.5,
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isDark ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    borderColor: isDark ? 'rgba(124, 58, 237, 0.4)' : '#ddd6fe',
                                    boxShadow: isDark ? '0 12px 28px rgba(0,0,0,0.4)' : '0 12px 28px rgba(124, 58, 237, 0.08)',
                                },
                            }}
                        >
                            {/* Top Accent Strip */}
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
                            }} />

                            <Box>
                                {/* Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '10px',
                                                bgcolor: isDark ? 'rgba(124, 58, 237, 0.15)' : '#f5f3ff',
                                                color: '#7c3aed',
                                                border: `1px solid ${isDark ? 'rgba(124, 58, 237, 0.3)' : '#ddd6fe'}`,
                                            }}
                                        >
                                            <PeopleRoundedIcon sx={{ fontSize: 20 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{
                                                fontFamily: '"Outfit", "Inter", sans-serif',
                                                fontSize: '0.68rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.07em',
                                                color: c.textMuted,
                                            }}>
                                                Authors & Community
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box component="span" sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#7c3aed' }} />
                                                Registered Talent
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton
                                        component={Link}
                                        href={route('admin.users')}
                                        size="small"
                                        sx={{
                                            color: c.textMuted,
                                            '&:hover': { color: '#7c3aed', bgcolor: isDark ? 'rgba(124, 58, 237, 0.15)' : '#f5f3ff' },
                                        }}
                                    >
                                        <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>

                                {/* Primary Metric Number */}
                                <Typography sx={{
                                    fontFamily: '"Outfit", "Inter", sans-serif',
                                    fontSize: { xs: '1.4rem', sm: '1.6rem' },
                                    fontWeight: 800,
                                    letterSpacing: '-0.025em',
                                    color: c.textPrimary,
                                    fontVariantNumeric: 'tabular-nums',
                                    lineHeight: 1.15,
                                    mt: 1,
                                    mb: 1.5,
                                }}>
                                    <AnimatedNumber value={totalUsers} delay={0.88} /> <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Authors</span>
                                </Typography>

                                {/* Sub-Metric Breakdown */}
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 1,
                                    p: 1.2,
                                    borderRadius: '10px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder}`,
                                    mb: 1.5,
                                }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase' }}>
                                            Students
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: c.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                                            <AnimatedNumber value={studentCount} delay={0.92} />
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase' }}>
                                            Professionals
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: c.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                                            <AnimatedNumber value={professionalCount} delay={0.92} />
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Bottom Status / Editorial Link */}
                            <Box
                                component={Link}
                                href={route('admin.submissions')}
                                sx={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 1,
                                    borderRadius: '8px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder}`,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { borderColor: '#7c3aed', bgcolor: isDark ? 'rgba(124, 58, 237, 0.1)' : '#f5f3ff' },
                                }}
                            >
                                <Typography sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    color: pendingReviews > 0 ? '#d97706' : '#7c3aed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}>
                                    {pendingReviews > 0 ? (
                                        <>
                                             ⚠️ <strong><AnimatedNumber value={pendingReviews} delay={0.96} /></strong> In Editorial Review
                                        </>
                                    ) : '✓ Pipeline Clear'}
                                </Typography>
                                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#7c3aed' }}>
                                    Review Flow →
                                </Typography>
                            </Box>
                        </Card>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* ── EXECUTIVE ACTION DOCK (Compact Linear / macOS Command Deck) ── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, delay: 0.96, ease: [0.22, 1, 0.36, 1] }}
                >
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: '14px',
                        border: `1px solid ${c.cardBorder}`,
                        bgcolor: c.cardBg,
                        mb: 3,
                        p: { xs: 1.5, sm: 1.75 },
                        boxShadow: isDark ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        mb: 1.25,
                    }}>
                        <Typography sx={{
                            fontFamily: '"Outfit", "Inter", sans-serif',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: c.textMuted,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#0d7a6a' }} />
                            Executive Quick Action Dock
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: c.textMuted }}>
                            Direct access to core conference management modules
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(2, 1fr)',
                            sm: 'repeat(4, 1fr)',
                            md: 'repeat(8, 1fr)',
                        },
                        gap: 1,
                    }}>
                        {quickActions.map((action, idx) => (
                            <Button
                                key={idx}
                                component={Link}
                                href={action.href}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    py: 1,
                                    px: 1.25,
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    border: `1px solid ${c.cardBorder}`,
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                                    color: c.textPrimary,
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        borderColor: action.color,
                                        bgcolor: action.bgColor,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 12px ${action.color}15`,
                                    },
                                }}
                            >
                                <Box sx={{ color: action.color, display: 'flex', alignItems: 'center' }}>
                                    {React.cloneElement(action.icon, { sx: { fontSize: 18 } })}
                                </Box>
                                <Typography sx={{
                                    fontWeight: 700,
                                    fontSize: '0.74rem',
                                    color: c.textPrimary,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                    {action.label}
                                </Typography>
                            </Button>
                        ))}
                    </Box>
                </Card>
                </motion.div>

                {/* ── ROW 4: Side-by-Side Analytics Cards (Website Visitors & Paper Submissions) ── */}
                <Grid container spacing={3} sx={{ mb: 3.5 }}>
                    {/* 1. Website Visitors Analytics Card */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 45 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 1.08, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%' }}
                        >
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
                                            <Typography sx={{
                                                fontFamily: '"Outfit", "Inter", sans-serif',
                                                fontWeight: 800,
                                                fontSize: '1.05rem',
                                                color: c.textPrimary,
                                                letterSpacing: '-0.015em',
                                            }}>
                                                Website Traffic
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', gap: 0.5,
                                                px: 0.85, py: 0.2,
                                                bgcolor: isDark ? 'rgba(16,185,129,0.12)' : '#ecfdf5',
                                                borderRadius: '999px',
                                                border: `1px solid ${isDark ? 'rgba(16,185,129,0.25)' : '#a7f3d0'}`,
                                            }}>
                                                <Box sx={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    bgcolor: '#10b981',
                                                    animation: 'pulseDot 2s infinite',
                                                    '@keyframes pulseDot': {
                                                        '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                                                        '50%': { opacity: 0.4, transform: 'scale(1.2)' },
                                                    },
                                                }} />
                                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                    Live Stream
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, mt: 0.25 }}>
                                            Landing page visits • Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Box>

                                    {/* Segmented Period Switcher (Apple / Linear Pill) */}
                                    <Box sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
                                        border: `1px solid ${c.cardBorder}`,
                                        borderRadius: '9999px',
                                        p: '3px',
                                        gap: 0.5,
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
                                                disableElevation
                                                sx={{
                                                    px: 1.6,
                                                    py: 0.4,
                                                    fontSize: '0.725rem',
                                                    fontWeight: 700,
                                                    textTransform: 'none',
                                                    minWidth: 'auto',
                                                    borderRadius: '9999px',
                                                    transition: 'all 0.2s ease',
                                                    ...(visitorPeriod === tab.key ? {
                                                        bgcolor: '#0d7a6a',
                                                        color: '#ffffff',
                                                        boxShadow: '0 2px 6px rgba(13,122,106,0.3)',
                                                        '&:hover': { bgcolor: '#094d42' },
                                                    } : {
                                                        color: c.textMuted,
                                                        '&:hover': {
                                                            color: c.textPrimary,
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                                                        },
                                                    }),
                                                }}
                                            >
                                                {tab.label}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Metric summaries in Outfit Font */}
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: 1,
                                    pt: 1.25,
                                    pb: 1.5,
                                    borderTop: `1px solid ${c.cardBorder}`,
                                    borderBottom: `1px solid ${c.cardBorder}`,
                                }}>
                                    {[
                                        { label: 'Today', value: liveStats.today || 0, color: '#0d7a6a' },
                                        { label: '7 Days', value: liveStats.last7days || 0, color: '#0284c7' },
                                        { label: '30 Days', value: liveStats.last30days || 0, color: '#2563eb' },
                                        { label: 'All Time', value: liveStats.total || 0, color: '#7c3aed' },
                                    ].map((m) => (
                                        <Box key={m.label} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                {m.label}
                                            </Typography>
                                            <Typography sx={{
                                                fontFamily: '"Outfit", "Inter", sans-serif',
                                                fontSize: { xs: '1.15rem', sm: '1.35rem' },
                                                fontWeight: 800,
                                                letterSpacing: '-0.02em',
                                                color: c.textPrimary,
                                                fontVariantNumeric: 'tabular-nums',
                                                lineHeight: 1.2,
                                                mt: 0.25,
                                            }}>
                                                <AnimatedNumber value={m.value} delay={1.14} />
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* Spline Area Chart */}
                            <Box sx={{ width: '100%', height: 260, px: 1, py: 1 }}>
                                {liveChartData.length > 0 ? (
                                    <motion.div
                                        key={visitorPeriod}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ width: '100%', height: '100%' }}
                                    >
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
                                                    <stop offset="0%" stopColor="#0d7a6a" stopOpacity={0.22} />
                                                    <stop offset="100%" stopColor="#0d7a6a" stopOpacity={0.0} />
                                                </linearGradient>
                                            </defs>
                                        </LineChart>
                                    </motion.div>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column' }}>
                                        <Typography sx={{ color: c.textMuted, fontSize: '0.8rem' }}>No visitor data for this period</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Card>
                        </motion.div>
                    </Grid>

                    {/* 2. Paper Submissions Status Pie Chart Card */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 45 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.85, delay: 1.20, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%' }}
                        >
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                overflow: 'hidden',
                                boxShadow: isDark ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
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
                                            <Typography sx={{
                                                fontFamily: '"Outfit", "Inter", sans-serif',
                                                fontWeight: 800,
                                                fontSize: '1.05rem',
                                                color: c.textPrimary,
                                                letterSpacing: '-0.015em',
                                            }}>
                                                Status Submission
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', gap: 0.5,
                                                px: 0.85, py: 0.2,
                                                bgcolor: isDark ? 'rgba(16,185,129,0.12)' : '#ecfdf5',
                                                borderRadius: '999px',
                                                border: `1px solid ${isDark ? 'rgba(16,185,129,0.25)' : '#a7f3d0'}`,
                                            }}>
                                                <Box sx={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    bgcolor: '#10b981',
                                                    animation: 'pulseDot 2s infinite',
                                                }} />
                                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                    <AnimatedNumber value={totalStatusCount || totalSubmissions} delay={1.24} /> Papers
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
                                        { label: 'Accepted', value: statusCounts.accepted || 0, color: '#10b981', status: 'accepted' },
                                        { label: 'In Review', value: statusCounts.under_review || 0, color: '#0284c7', status: 'under_review' },
                                        { label: 'Rejected', value: statusCounts.rejected || 0, color: '#ef4444', status: 'rejected' },
                                        { label: 'Pending', value: statusCounts.pending || 0, color: '#64748b', status: 'pending' },
                                    ].map((m) => (
                                        <Box
                                            key={m.label}
                                            component={Link}
                                            href={route('admin.submissions', { status: m.status })}
                                            sx={{
                                                textAlign: 'center',
                                                textDecoration: 'none',
                                                py: 0.85,
                                                px: 0.75,
                                                borderRadius: '10px',
                                                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                                                border: `1px solid ${c.cardBorder}`,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    borderColor: m.color,
                                                    boxShadow: `0 4px 12px ${m.color}15`,
                                                },
                                            }}
                                        >
                                            {/* Micro-accent top dot */}
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 0.5,
                                            }}>
                                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: m.color }} />
                                                <Typography sx={{ fontSize: '0.625rem', fontWeight: 800, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                    {m.label}
                                                </Typography>
                                            </Box>
                                            <Typography sx={{
                                                fontFamily: '"Outfit", "Inter", sans-serif',
                                                fontSize: { xs: '1.15rem', sm: '1.35rem' },
                                                fontWeight: 800,
                                                letterSpacing: '-0.02em',
                                                color: c.textPrimary,
                                                fontVariantNumeric: 'tabular-nums',
                                                lineHeight: 1.15,
                                                mt: 0.25,
                                            }}>
                                                <AnimatedNumber value={m.value} delay={1.26} />
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
                                                <motion.div
                                                    key={subLastUpdated.getTime()}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                                                    style={{ width: '100%', height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                                                >
                                                    <PieChart
                                                        hideLegend={true}
                                                        slots={{ legend: () => null }}
                                                        series={[{
                                                            data: activeStatusPieData,
                                                            innerRadius: 52,
                                                            outerRadius: 76,
                                                            paddingAngle: 3,
                                                            cornerRadius: 5,
                                                            highlightScope: { fade: 'global', highlight: 'item' },
                                                            faded: { innerRadius: 48, additionalRadius: -3, opacity: 0.35 },
                                                            valueFormatter: (item) => `${item.value} paper${item.value > 1 ? 's' : ''} (${totalStatusCount > 0 ? ((item.value / totalStatusCount) * 100).toFixed(1) : 0}%)`,
                                                        }]}
                                                        margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                                        height={190}
                                                        sx={{
                                                            '& .MuiChartsLegend-root': { display: 'none !important' },
                                                            '& .MuiPieArc-root': {
                                                                stroke: isDark ? '#1a1d27' : '#ffffff',
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
                                                        <Typography sx={{
                                                            fontFamily: '"Outfit", "Inter", sans-serif',
                                                            fontWeight: 900,
                                                            fontSize: '1.5rem',
                                                            letterSpacing: '-0.03em',
                                                            color: c.textPrimary,
                                                            lineHeight: 1,
                                                        }}>
                                                            <AnimatedNumber value={totalStatusCount} delay={1.26} />
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.625rem', color: c.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', mt: 0.25 }}>
                                                            Papers
                                                        </Typography>
                                                    </Box>
                                                </motion.div>
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
                                                    icon={<CheckCircleRoundedIcon sx={{ fontSize: '14px !important', color: '#059669 !important' }} />}
                                                    label={
                                                        <span>
                                                            Acceptance:{' '}
                                                            <AnimatedNumber
                                                                value={totalStatusCount > 0 ? (statusCounts.accepted / totalStatusCount) * 100 : 0}
                                                                format="decimal"
                                                                suffix="%"
                                                                delay={1.28}
                                                            />
                                                        </span>
                                                    }
                                                    sx={{
                                                        fontWeight: 700,
                                                        fontSize: '0.72rem',
                                                        bgcolor: isDark ? 'rgba(16,185,129,0.12)' : '#ecfdf5',
                                                        color: '#059669',
                                                        border: `1px solid ${isDark ? 'rgba(16,185,129,0.25)' : '#a7f3d0'}`,
                                                        height: 24,
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Grid>

                                    {/* Right Column: Detailed Status Breakdown Rows with Progress Bars */}
                                    <Grid size={{ xs: 12, sm: 7.5, md: 7.5 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.85 }}>
                                            {statusPieItems.map((item, idx) => {
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
                                                            py: 0.7,
                                                            borderRadius: '8px',
                                                            textDecoration: 'none',
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                                            border: `1px solid ${c.cardBorder}`,
                                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            '&:hover': {
                                                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                                                                borderColor: item.color,
                                                                boxShadow: `0 2px 8px ${item.color}15`,
                                                                transform: 'translateX(3px)',
                                                            },
                                                        }}
                                                    >
                                                        {/* Color Dot & Status Label */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 90 }}>
                                                            <Box sx={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                bgcolor: item.color,
                                                                boxShadow: `0 0 6px ${item.color}66`,
                                                                flexShrink: 0,
                                                            }} />
                                                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: c.textPrimary }}>
                                                                {item.label}
                                                            </Typography>
                                                        </Box>

                                                        {/* Mini Progress Bar */}
                                                        <Box sx={{ flex: 1, mx: 1.5, display: { xs: 'none', sm: 'block' } }}>
                                                            <AnimatedProgressBar
                                                                value={Number(pct)}
                                                                color={item.color}
                                                                height={5}
                                                                borderRadius={3}
                                                                delay={1.26 + idx * 0.04}
                                                            />
                                                        </Box>

                                                        {/* Count and Percentage Badge */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                            <Typography sx={{
                                                                fontSize: '0.82rem',
                                                                fontWeight: 800,
                                                                color: c.textPrimary,
                                                                fontVariantNumeric: 'tabular-nums',
                                                            }}>
                                                                <AnimatedNumber value={item.value} delay={1.26} />
                                                            </Typography>
                                                            <Typography sx={{
                                                                fontSize: '0.68rem',
                                                                fontWeight: 700,
                                                                color: c.textMuted,
                                                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                                                                px: 0.75,
                                                                py: 0.15,
                                                                borderRadius: '5px',
                                                                fontVariantNumeric: 'tabular-nums',
                                                            }}>
                                                                <AnimatedNumber value={Number(pct)} format="decimal" suffix="%" delay={1.28} />
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
                        </motion.div>
                    </Grid>
                </Grid>

                {/* ── ROW 5: Submissions per Topic Horizontal Bar Chart ── */}
                {submissionsPerTopic.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 1.34, ease: [0.22, 1, 0.36, 1] }}
                    >
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
                                    <motion.div
                                        key={`${chartType}-${chartOrientation}-${topicLimit}-${categoryFilter}`}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ width: '100%', height: '100%' }}
                                    >
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
                                    </motion.div>
                                </Box>
                            </Box>

                            {/* Stats Summary + Top Topic */}
                            <Grid container spacing={2} sx={{ mt: 1.5 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                                        borderRadius: '12px',
                                        border: `1px solid ${c.cardBorder}`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        height: '100%',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: isDark ? 'rgba(13, 122, 106, 0.4)' : '#a7f3d0',
                                            transform: 'translateY(-1px)',
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0d7a6a' }} />
                                            <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                Active Scientific Topics
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                            <Typography sx={{
                                                fontFamily: '"Outfit", "Inter", sans-serif',
                                                fontWeight: 800,
                                                fontSize: '1.65rem',
                                                color: c.textPrimary,
                                                fontVariantNumeric: 'tabular-nums',
                                                letterSpacing: '-0.02em',
                                                lineHeight: 1,
                                            }}>
                                                <AnimatedNumber value={submissionsPerTopic.length} delay={0.90} />
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, fontWeight: 500 }}>
                                                categorized tracks
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                                        borderRadius: '12px',
                                        border: `1px solid ${c.cardBorder}`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        height: '100%',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: isDark ? 'rgba(37, 99, 235, 0.4)' : '#bfdbfe',
                                            transform: 'translateY(-1px)',
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2563eb' }} />
                                            <Typography sx={{ fontSize: '0.7rem', color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                Cumulative Papers
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                            <Typography sx={{
                                                fontFamily: '"Outfit", "Inter", sans-serif',
                                                fontWeight: 800,
                                                fontSize: '1.65rem',
                                                color: c.textPrimary,
                                                fontVariantNumeric: 'tabular-nums',
                                                letterSpacing: '-0.02em',
                                                lineHeight: 1,
                                            }}>
                                                <AnimatedNumber value={submissionsPerTopic.reduce((sum, item) => sum + item.count, 0)} delay={1.42} />
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: c.textMuted, fontWeight: 500 }}>
                                                total registered
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    {submissionsPerTopic.length > 0 && (
                                        <Box sx={{
                                            p: 2,
                                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                                            borderRadius: '12px',
                                            border: `1px solid ${c.cardBorder}`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            height: '100%',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: isDark ? 'rgba(245, 158, 11, 0.4)' : '#fde68a',
                                                transform: 'translateY(-1px)',
                                            }
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                                                <Box sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    px: 0.9,
                                                    py: 0.2,
                                                    borderRadius: '6px',
                                                    bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7',
                                                    color: '#b45309',
                                                }}>
                                                    <EmojiEventsRoundedIcon sx={{ fontSize: 13 }} />
                                                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                        Most Popular Sub-Theme
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{
                                                    fontFamily: '"Outfit", "Inter", sans-serif',
                                                    fontWeight: 800,
                                                    fontSize: '0.8rem',
                                                    color: '#0d7a6a',
                                                    bgcolor: isDark ? 'rgba(13, 122, 106, 0.15)' : '#ecfdf5',
                                                    px: 0.8,
                                                    py: 0.2,
                                                    borderRadius: '6px',
                                                }}>
                                                    <AnimatedNumber value={submissionsPerTopic[0].count} delay={1.42} /> papers
                                                </Typography>
                                            </Box>
                                            <Typography sx={{
                                                fontFamily: '"Outfit", "Inter", sans-serif',
                                                fontWeight: 700,
                                                fontSize: '0.875rem',
                                                color: c.textPrimary,
                                                lineHeight: 1.3,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>
                                                {submissionsPerTopic[0].topic}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.72rem', color: c.textMuted, mt: 0.25 }}>
                                                #1 highest scientific submission density
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    </motion.div>
                )}

                {/* ── ROW 6: Materio Total Earning / Breakdown (5 cols) + Recent Submissions (7 cols) ── */}
                <Grid container spacing={3}>
                    {/* Materio Distribution Breakdown Card */}
                    <Grid size={{ xs: 12, lg: 5 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 1.48, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%' }}
                        >
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
                                        <Typography variant="h6" sx={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 800, fontSize: '1.05rem', color: c.textPrimary, letterSpacing: '-0.01em' }}>
                                            Category & Format Ratio
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.775rem' }}>
                                            Demographic distribution & session presentation formats
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        px: 1,
                                        py: 0.35,
                                        borderRadius: '8px',
                                        bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                                        border: `1px solid ${c.cardBorder}`,
                                    }}>
                                        <Typography sx={{ fontFamily: '"Outfit", "Inter", sans-serif', fontSize: '0.725rem', fontWeight: 700, color: c.textSecondary }}>
                                            <AnimatedNumber value={totalParticipantsCategorized} delay={1.52} /> Verified
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Participant Category Progress */}
                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1.75 }}>
                                    Participant Category Breakdown
                                </Typography>

                                <Stack spacing={2} sx={{ mb: 3 }}>
                                    {/* Student */}
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0891b2' }} />
                                                <Typography sx={{ fontSize: '0.825rem', fontWeight: 600, color: c.textPrimary }}>
                                                    Student
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                                                <Typography sx={{ fontFamily: '"Outfit", "Inter", sans-serif', fontSize: '0.875rem', fontWeight: 800, color: c.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                                                    <AnimatedNumber value={studentCount} delay={1.54} />
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.725rem', fontWeight: 600, color: c.textMuted }}>
                                                    (<AnimatedNumber value={totalParticipantsCategorized > 0 ? (studentCount / totalParticipantsCategorized) * 100 : 0} format="percent" delay={1.56} />)
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <AnimatedProgressBar
                                            value={totalParticipantsCategorized > 0 ? (studentCount / totalParticipantsCategorized) * 100 : 0}
                                            color="#0891b2"
                                            height={5}
                                            borderRadius={3}
                                            delay={1.54}
                                        />
                                    </Box>

                                    {/* Professional */}
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ea580c' }} />
                                                <Typography sx={{ fontSize: '0.825rem', fontWeight: 600, color: c.textPrimary }}>
                                                    Professional
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                                                <Typography sx={{ fontFamily: '"Outfit", "Inter", sans-serif', fontSize: '0.875rem', fontWeight: 800, color: c.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                                                    <AnimatedNumber value={professionalCount} delay={1.56} />
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.725rem', fontWeight: 600, color: c.textMuted }}>
                                                    (<AnimatedNumber value={totalParticipantsCategorized > 0 ? (professionalCount / totalParticipantsCategorized) * 100 : 0} format="percent" delay={1.58} />)
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <AnimatedProgressBar
                                            value={totalParticipantsCategorized > 0 ? (professionalCount / totalParticipantsCategorized) * 100 : 0}
                                            color="#ea580c"
                                            height={5}
                                            borderRadius={3}
                                            delay={1.56}
                                        />
                                    </Box>

                                    {/* International Delegate */}
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#7c3aed' }} />
                                                <Typography sx={{ fontSize: '0.825rem', fontWeight: 600, color: c.textPrimary }}>
                                                    International Delegate
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                                                <Typography sx={{ fontFamily: '"Outfit", "Inter", sans-serif', fontSize: '0.875rem', fontWeight: 800, color: c.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                                                    <AnimatedNumber value={internationalCount} delay={1.58} />
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.725rem', fontWeight: 600, color: c.textMuted }}>
                                                    (<AnimatedNumber value={totalParticipantsCategorized > 0 ? (internationalCount / totalParticipantsCategorized) * 100 : 0} format="percent" delay={1.60} />)
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <AnimatedProgressBar
                                            value={totalParticipantsCategorized > 0 ? (internationalCount / totalParticipantsCategorized) * 100 : 0}
                                            color="#7c3aed"
                                            height={5}
                                            borderRadius={3}
                                            delay={1.58}
                                        />
                                    </Box>
                                </Stack>

                                <Divider sx={{ my: 2.5, borderColor: c.cardBorder }} />

                                {/* Presentation Format */}
                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1.5 }}>
                                    Presentation Format Ratio
                                </Typography>

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                                        border: `1px solid ${c.cardBorder}`,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: isDark ? 'rgba(13, 122, 106, 0.4)' : '#a7f3d0',
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                            <Box sx={{
                                                width: 26,
                                                height: 26,
                                                borderRadius: '7px',
                                                bgcolor: isDark ? 'rgba(13, 122, 106, 0.15)' : '#ecfdf5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#0d7a6a',
                                            }}>
                                                <MicRoundedIcon sx={{ fontSize: 16 }} />
                                            </Box>
                                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: c.textPrimary }}>
                                                Oral Presentation
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                            <Typography sx={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 800, fontSize: '1.4rem', color: c.textPrimary, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                                                <AnimatedNumber value={totalOral} delay={1.62} />
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.725rem', fontWeight: 700, color: '#0d7a6a' }}>
                                                <AnimatedNumber value={totalPresentations > 0 ? (totalOral / totalPresentations) * 100 : 0} format="percent" delay={1.64} />
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                                        border: `1px solid ${c.cardBorder}`,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : '#c7d2fe',
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                            <Box sx={{
                                                width: 26,
                                                height: 26,
                                                borderRadius: '7px',
                                                bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#e0e7ff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#6366f1',
                                            }}>
                                                <ViewCompactRoundedIcon sx={{ fontSize: 16 }} />
                                            </Box>
                                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: c.textPrimary }}>
                                                Poster Presentation
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                            <Typography sx={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 800, fontSize: '1.4rem', color: c.textPrimary, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                                                <AnimatedNumber value={totalPoster} delay={1.62} />
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.725rem', fontWeight: 700, color: '#6366f1' }}>
                                                <AnimatedNumber value={totalPresentations > 0 ? (totalPoster / totalPresentations) * 100 : 0} format="percent" delay={1.64} />
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                        </motion.div>
                    </Grid>

                    {/* Materio Recent Submissions Card */}
                    <Grid size={{ xs: 12, lg: 7 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 1.62, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%' }}
                        >
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
                                        <Typography variant="h6" sx={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 800, fontSize: '1.05rem', color: c.textPrimary, letterSpacing: '-0.01em' }}>
                                            Recent Submissions
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.775rem' }}>
                                            Latest paper registrations waiting for editorial flow
                                        </Typography>
                                    </Box>
                                    <Button
                                        component={Link}
                                        href={route('admin.submissions')}
                                        size="small"
                                        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.775rem',
                                            color: '#0d7a6a',
                                            px: 1.5,
                                            py: 0.4,
                                            borderRadius: '8px',
                                            border: `1px solid ${c.cardBorder}`,
                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                            '&:hover': {
                                                bgcolor: isDark ? 'rgba(13, 122, 106, 0.15)' : '#ecfdf5',
                                                borderColor: '#0d7a6a',
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
                                                <motion.div
                                                    key={sub.id || idx}
                                                    initial={{ opacity: 0, x: -12 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5, delay: 1.68 + 0.05 * idx, ease: [0.22, 1, 0.36, 1] }}
                                                >
                                                <Box
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
                                                            width: 38,
                                                            height: 38,
                                                            borderRadius: '10px',
                                                            flexShrink: 0,
                                                            fontWeight: 800,
                                                            fontSize: '0.85rem',
                                                            fontFamily: '"Outfit", sans-serif',
                                                        }}
                                                    >
                                                        {(sub.user?.name || 'A').charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontFamily: '"Outfit", "Inter", sans-serif',
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
                                                            fontFamily: '"Outfit", "Inter", sans-serif',
                                                            height: 24,
                                                            borderRadius: '6px',
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                </Box>
                                                </motion.div>
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
                        </motion.div>
                    </Grid>
                </Grid>
            </Box>
        </SidebarLayout>
    );
}
