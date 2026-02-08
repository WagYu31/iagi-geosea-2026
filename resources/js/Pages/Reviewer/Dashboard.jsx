import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Grid, Chip, Avatar, LinearProgress,
    Button, Stack, Divider, useTheme,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DescriptionIcon from '@mui/icons-material/Description';
import { PieChart } from '@mui/x-charts/PieChart';

export default function ReviewerDashboard({ analytics = {}, recentAssignments = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const totalAssigned = analytics.totalAssigned || 0;
    const completed = analytics.completed || 0;
    const pending = analytics.pending || 0;
    const completionRate = totalAssigned > 0 ? (completed / totalAssigned) * 100 : 0;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Stat cards data — same pattern as user Dashboard
    const statCards = [
        {
            title: 'Total Assigned',
            value: totalAssigned,
            icon: <AssignmentIcon />,
            color: '#1abc9c',
            bgColor: isDark ? 'rgba(26, 188, 156, 0.12)' : '#ecfdf5',
            trend: 'Total',
        },
        {
            title: 'Completed Reviews',
            value: completed,
            icon: <CheckCircleIcon />,
            color: '#16a34a',
            bgColor: isDark ? 'rgba(22, 163, 74, 0.12)' : '#dcfce7',
            trend: 'Done',
        },
        {
            title: 'Pending Reviews',
            value: pending,
            icon: <PendingIcon />,
            color: '#ea580c',
            bgColor: isDark ? 'rgba(234, 88, 12, 0.12)' : '#fff7ed',
            trend: 'Pending',
        },
        {
            title: 'Completion Rate',
            value: `${Math.round(completionRate)}%`,
            icon: <RateReviewIcon />,
            color: '#2563eb',
            bgColor: isDark ? 'rgba(37, 99, 235, 0.12)' : '#eff6ff',
            trend: 'Progress',
            showProgress: true,
        },
    ];

    // Pie chart data for review status
    const pieData = totalAssigned > 0
        ? [
            { id: 0, value: completed, label: 'Completed', color: '#16a34a' },
            { id: 1, value: pending, label: 'Pending', color: '#f59e0b' },
        ].filter(d => d.value > 0)
        : [{ id: 0, value: 1, label: 'No Data', color: '#e5e7eb' }];

    const getStatusChip = (review) => {
        if (review.originality_score) {
            return { bg: c.chipGreenBg, color: c.chipGreenText, label: 'Completed' };
        }
        return { bg: c.chipAmberBg, color: c.chipAmberText, label: 'Pending' };
    };

    return (
        <SidebarLayout>
            <Head title="Reviewer Dashboard" />

            <Box sx={{ p: { xs: 2, sm: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header Section — same as user Dashboard */}
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
                            Welcome, Reviewer! 👋
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
                    <Button
                        component={Link}
                        href={route('reviewer.submissions')}
                        variant="contained"
                        startIcon={<VisibilityIcon />}
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
                        View Submissions
                    </Button>
                </Box>

                {/* Stat Cards — identical style to user Dashboard */}
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
                                    {card.showProgress && (
                                        <LinearProgress
                                            variant="determinate"
                                            value={completionRate}
                                            sx={{
                                                mt: 1.5,
                                                height: 5,
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

                {/* Main Content Grid — Chart + Recent */}
                <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                    {/* Pie Chart */}
                    <Grid size={{ xs: 12, lg: 5 }}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                height: '100%',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary, mb: 0.5 }}>
                                    Review Overview
                                </Typography>
                                <Typography variant="body2" sx={{ color: c.textMuted, mb: 2, fontSize: '0.8rem' }}>
                                    Status distribution of your reviews
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220 }}>
                                    {totalAssigned > 0 ? (
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
                                            <DescriptionIcon sx={{ fontSize: 48, color: c.textMuted, mb: 1, opacity: 0.5 }} />
                                            <Typography variant="body2" sx={{ color: c.textMuted }}>
                                                No assignments yet
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Assignments */}
                    <Grid size={{ xs: 12, lg: 7 }}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: '16px',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                height: '100%',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary, mb: 0.5 }}>
                                            Recent Assignments
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                                            Your latest paper review assignments
                                        </Typography>
                                    </Box>
                                    <Button
                                        component={Link}
                                        href={route('reviewer.submissions')}
                                        size="small"
                                        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            color: '#1abc9c',
                                            borderRadius: '8px',
                                            '&:hover': { bgcolor: c.btnSoftBgHover },
                                        }}
                                    >
                                        View All
                                    </Button>
                                </Box>

                                {recentAssignments.length > 0 ? (
                                    <Stack spacing={0} divider={<Divider sx={{ borderColor: c.cardBorder }} />}>
                                        {recentAssignments.map((review, idx) => {
                                            const status = getStatusChip(review);
                                            return (
                                                <Box
                                                    key={review.id || idx}
                                                    component={Link}
                                                    href={route('reviewer.submissions.view', review.submission_id)}
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
                                                        '&:hover': { bgcolor: c.rowHover },
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
                                                            {review.submission?.title || 'Untitled Paper'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.75rem' }}>
                                                            {review.submission?.user?.name || 'Unknown'} • {review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                                                            {review.overall_score ? ` • Score: ${review.overall_score}/5` : ''}
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
                                        <DescriptionIcon sx={{ fontSize: 48, color: c.textMuted, mb: 1, opacity: 0.5 }} />
                                        <Typography variant="body2" sx={{ color: c.textMuted }}>
                                            No assignments yet
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Quick Actions — same as user Dashboard */}
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
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary, mb: 2.5 }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Button
                                    component={Link}
                                    href={route('reviewer.submissions')}
                                    variant="contained"
                                    fullWidth
                                    startIcon={<RateReviewIcon />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 20px rgba(26, 188, 156, 0.3)',
                                        },
                                        py: 1.8,
                                        textTransform: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        borderRadius: '12px',
                                        transition: 'all 0.25s ease',
                                        boxShadow: '0 2px 8px rgba(26, 188, 156, 0.2)',
                                    }}
                                >
                                    Review Submissions
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Button
                                    component={Link}
                                    href={route('profile.edit')}
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<PersonIcon />}
                                    sx={{
                                        color: '#1abc9c',
                                        borderColor: isDark ? 'rgba(209, 250, 229, 0.2)' : '#d1fae5',
                                        borderWidth: 2,
                                        bgcolor: isDark ? 'rgba(26, 188, 156, 0.08)' : '#f0fdf9',
                                        '&:hover': {
                                            borderColor: '#1abc9c',
                                            backgroundColor: isDark ? 'rgba(26, 188, 156, 0.15)' : '#ecfdf5',
                                            borderWidth: 2,
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(26, 188, 156, 0.15)',
                                        },
                                        py: 1.8,
                                        textTransform: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        borderRadius: '12px',
                                        transition: 'all 0.25s ease',
                                    }}
                                >
                                    My Profile
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Empty State for New Reviewers */}
                {totalAssigned === 0 && (
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
                                <RateReviewIcon sx={{ fontSize: 40, color: '#1abc9c' }} />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 700, color: c.textPrimary, mb: 1, fontSize: '1.15rem' }}
                            >
                                No assignments yet
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: c.textSecondary, mb: 3, maxWidth: '500px', mx: 'auto', lineHeight: 1.6 }}
                            >
                                You will be notified when papers are assigned to you for review. Check back later or contact the admin for more information.
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </SidebarLayout>
    );
}
