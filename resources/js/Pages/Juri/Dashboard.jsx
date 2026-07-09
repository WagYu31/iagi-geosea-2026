import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Grid, Chip, Avatar, LinearProgress,
    Button, Stack, Divider, useTheme,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';

export default function JuriDashboard({ analytics = {}, recentAssignments = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const totalAssigned = analytics.totalAssigned || 0;
    const completed = analytics.completed || 0;
    const pending = analytics.pending || 0;
    const completionRate = totalAssigned > 0 ? (completed / totalAssigned) * 100 : 0;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const statCards = [
        {
            title: 'Total Assigned',
            value: totalAssigned,
            icon: <GavelIcon />,
            color: '#d97706',
            bgColor: isDark ? 'rgba(217, 119, 6, 0.12)' : '#fffbeb',
            trend: 'Total',
        },
        {
            title: 'Scored',
            value: completed,
            icon: <CheckCircleIcon />,
            color: '#16a34a',
            bgColor: isDark ? 'rgba(22, 163, 74, 0.12)' : '#dcfce7',
            trend: 'Done',
        },
        {
            title: 'Pending',
            value: pending,
            icon: <PendingIcon />,
            color: '#ea580c',
            bgColor: isDark ? 'rgba(234, 88, 12, 0.12)' : '#fff7ed',
            trend: 'Pending',
        },
        {
            title: 'Completion',
            value: `${Math.round(completionRate)}%`,
            icon: <RateReviewIcon />,
            color: '#2563eb',
            bgColor: isDark ? 'rgba(37, 99, 235, 0.12)' : '#eff6ff',
            trend: 'Progress',
            showProgress: true,
        },
    ];

    const getStatusChip = (score) => {
        if (score.weighted_final_score) {
            return { bg: c.chipGreenBg, color: c.chipGreenText, label: 'Scored' };
        }
        return { bg: c.chipAmberBg, color: c.chipAmberText, label: 'Pending' };
    };

    return (
        <SidebarLayout>
            <Head title="Juri Dashboard" />

            <Box sx={{ p: { xs: 2, sm: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    mb: 3.5,
                    gap: 2,
                }}>
                    <Box>
                        <Typography variant="h4" sx={{
                            fontWeight: 800,
                            color: c.textPrimary,
                            fontSize: { xs: '1.5rem', sm: '1.85rem' },
                            letterSpacing: '-0.02em',
                            lineHeight: 1.2,
                        }}>
                            Welcome, Juri! ⚖️
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: c.textSecondary, mt: 0.5,
                            display: 'flex', alignItems: 'center', gap: 0.75,
                            fontSize: '0.875rem',
                        }}>
                            <CalendarTodayIcon sx={{ fontSize: 15 }} />
                            {formattedDate}
                        </Typography>
                    </Box>
                    <Button
                        component={Link}
                        href={route('juri.submissions')}
                        variant="contained"
                        startIcon={<VisibilityIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                            px: 3, py: 1.2, borderRadius: '12px',
                            textTransform: 'none', fontWeight: 600, fontSize: '0.9rem',
                            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                                boxShadow: '0 6px 20px rgba(217, 119, 6, 0.45)',
                                transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.25s ease',
                            width: { xs: '100%', md: 'auto' },
                        }}
                    >
                        View Assignments
                    </Button>
                </Box>

                {/* Stat Cards */}
                <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                    {statCards.map((card, index) => (
                        <Grid size={{ xs: 6, sm: 6, lg: 3 }} key={index}>
                            <Card elevation={0} sx={{
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
                                    bottom: 0, left: 0, right: 0, height: '3px',
                                    background: card.color, opacity: 0,
                                    transition: 'opacity 0.3s ease',
                                },
                                '&:hover::after': { opacity: 1 },
                            }}>
                                <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: card.bgColor,
                                                width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 },
                                                borderRadius: '12px',
                                            }}
                                            variant="rounded"
                                        >
                                            {React.cloneElement(card.icon, { sx: { color: card.color, fontSize: { xs: 20, sm: 24 } } })}
                                        </Avatar>
                                        <Chip label={card.trend} size="small" sx={{
                                            bgcolor: card.bgColor, color: card.color,
                                            fontWeight: 700, fontSize: '0.7rem', height: 24, borderRadius: '6px',
                                        }} />
                                    </Box>
                                    <Typography variant="h3" sx={{
                                        fontWeight: 800, color: c.textPrimary,
                                        fontSize: { xs: '1.4rem', sm: '1.75rem' },
                                        letterSpacing: '-0.02em', lineHeight: 1,
                                    }}>
                                        {card.value}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: c.textSecondary, fontSize: '0.8rem', mt: 0.5,
                                    }}>
                                        {card.title}
                                    </Typography>
                                    {card.showProgress && (
                                        <LinearProgress
                                            variant="determinate"
                                            value={completionRate}
                                            sx={{
                                                mt: 1.5, height: 6, borderRadius: 3,
                                                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 3,
                                                    background: `linear-gradient(90deg, ${card.color}, ${card.color}88)`,
                                                },
                                            }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Recent Assignments */}
                <Card elevation={0} sx={{
                    borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg,
                }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: c.textPrimary }}>
                                Recent Assignments
                            </Typography>
                            <Button component={Link} href={route('juri.submissions')}
                                endIcon={<ArrowForwardIcon />}
                                sx={{ textTransform: 'none', fontWeight: 600, color: '#d97706' }}>
                                View All
                            </Button>
                        </Box>

                        {recentAssignments.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4, color: c.textSecondary }}>
                                <GavelIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                                <Typography>No assignments yet</Typography>
                            </Box>
                        ) : (
                            <Stack divider={<Divider />} spacing={0}>
                                {recentAssignments.map((score) => {
                                    const status = getStatusChip(score);
                                    return (
                                        <Box
                                            key={score.id}
                                            component={Link}
                                            href={route('juri.submissions.view', score.submission_id)}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                alignItems: { xs: 'flex-start', sm: 'center' },
                                                justifyContent: 'space-between',
                                                py: 2, px: 1, gap: 1,
                                                textDecoration: 'none', color: 'inherit',
                                                borderRadius: '8px',
                                                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' },
                                                transition: 'background-color 0.2s ease',
                                            }}
                                        >
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="body2" sx={{
                                                    fontWeight: 600, color: c.textPrimary,
                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                }}>
                                                    {score.submission?.title || 'Untitled'}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                                    <PersonIcon sx={{ fontSize: 14, color: c.textSecondary }} />
                                                    <Typography variant="caption" sx={{ color: c.textSecondary }}>
                                                        {score.submission?.user?.name || 'Unknown'}
                                                    </Typography>
                                                    <Chip
                                                        label={score.rubric_type?.toUpperCase() || 'N/A'}
                                                        size="small"
                                                        sx={{
                                                            height: 20, fontSize: '0.65rem', fontWeight: 700,
                                                            bgcolor: score.rubric_type === 'oral'
                                                                ? (isDark ? 'rgba(37, 99, 235, 0.12)' : '#eff6ff')
                                                                : (isDark ? 'rgba(147, 51, 234, 0.12)' : '#faf5ff'),
                                                            color: score.rubric_type === 'oral' ? '#2563eb' : '#9333ea',
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {score.weighted_final_score && (
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#d97706' }}>
                                                        {score.weighted_final_score}
                                                    </Typography>
                                                )}
                                                <Chip
                                                    label={status.label}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: status.bg, color: status.color,
                                                        fontWeight: 600, fontSize: '0.7rem', height: 24,
                                                    }}
                                                />
                                            </Stack>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </SidebarLayout>
    );
}
