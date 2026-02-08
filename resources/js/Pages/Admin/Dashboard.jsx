import React, { useState, useMemo } from 'react';
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
import { BarChart } from '@mui/x-charts/BarChart';

export default function AdminDashboard({ analytics, recentSubmissions = [], pendingPayments = 0, submissionsPerTopic = [], participantStats = {}, submissionsPerTopicByParticipant = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const [categoryFilter, setCategoryFilter] = useState('all');
    const [participantFilter, setParticipantFilter] = useState('all');

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
            title: 'Total Users',
            value: totalUsers,
            icon: <PeopleIcon />,
            color: '#9333ea',
            bgColor: isDark ? 'rgba(147, 51, 234, 0.12)' : '#faf5ff',
            trend: 'Users',
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
        </SidebarLayout>
    );
}
