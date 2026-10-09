import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Grid, Chip, Avatar, LinearProgress,
    Button, Stack, Divider, useTheme, TextField, InputAdornment, IconButton,
    Tooltip,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Shield';
import SchoolIcon from '@mui/icons-material/School';
import MicIcon from '@mui/icons-material/Mic';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';

export default function JuriDashboard({ analytics = {}, recentAssignments = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const { auth } = usePage().props;
    const juriName = auth?.user?.name || 'Juri';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('all'); // all, pending, scored, oral, poster

    const totalAssigned = analytics.totalAssigned || recentAssignments.length || 0;
    const completed = analytics.completed || recentAssignments.filter(s => s.weighted_final_score !== null).length || 0;
    const pending = analytics.pending || recentAssignments.filter(s => s.weighted_final_score === null).length || 0;
    const completionRate = totalAssigned > 0 ? (completed / totalAssigned) * 100 : 0;
    
    // Derived or prop-provided counts
    const oralCount = analytics.oralCount ?? recentAssignments.filter(s => (s.rubric_type || '').toLowerCase() === 'oral').length;
    const posterCount = analytics.posterCount ?? recentAssignments.filter(s => (s.rubric_type || '').toLowerCase() === 'poster').length;
    
    const averageScore = useMemo(() => {
        if (analytics.averageScore) return Number(analytics.averageScore).toFixed(2);
        const scoredList = recentAssignments.filter(s => s.weighted_final_score !== null);
        if (scoredList.length === 0) return null;
        const sum = scoredList.reduce((acc, curr) => acc + parseFloat(curr.weighted_final_score || 0), 0);
        return (sum / scoredList.length).toFixed(2);
    }, [analytics.averageScore, recentAssignments]);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    // Score Performance Tier helper
    const getScoreTier = (scoreVal) => {
        const val = parseFloat(scoreVal);
        if (isNaN(val)) return null;
        if (val >= 9.0) return { label: 'Exceptional (Top 5%)', color: '#059669', bg: isDark ? 'rgba(5, 150, 105, 0.15)' : '#ecfdf5', border: '#a7f3d0' };
        if (val >= 7.0) return { label: 'Good / Strong', color: '#2563eb', bg: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff', border: '#bfdbfe' };
        if (val >= 5.0) return { label: 'Acceptable', color: '#d97706', bg: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb', border: '#fde68a' };
        return { label: 'Below Standard', color: '#dc2626', bg: isDark ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2', border: '#fecaca' };
    };

    // Filtered Assignments List
    const filteredAssignments = useMemo(() => {
        return recentAssignments.filter((score) => {
            const isScored = score.weighted_final_score !== null && score.weighted_final_score !== undefined;
            const rubric = (score.rubric_type || '').toLowerCase();
            const title = (score.submission?.title || '').toLowerCase();
            const author = (score.submission?.user?.name || score.submission?.author_full_name || '').toLowerCase();
            const code = (score.submission?.submission_code || `id-${score.submission_id}`).toLowerCase();

            // Tab filtering
            if (selectedTab === 'pending' && isScored) return false;
            if (selectedTab === 'scored' && !isScored) return false;
            if (selectedTab === 'oral' && rubric !== 'oral') return false;
            if (selectedTab === 'poster' && rubric !== 'poster') return false;

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return title.includes(q) || author.includes(q) || code.includes(q);
            }

            return true;
        });
    }, [recentAssignments, selectedTab, searchQuery]);

    // Stat Bento Cards Config
    const statCards = [
        {
            title: 'Assigned Presentations',
            value: totalAssigned,
            badge: 'TOTAL QUEUE',
            sub: `${oralCount} Oral • ${posterCount} Poster`,
            icon: <GavelIcon />,
            color: '#0284c7',
            bgGlow: 'radial-gradient(circle at top right, rgba(2, 132, 199, 0.12) 0%, transparent 70%)',
            borderColor: isDark ? 'rgba(2, 132, 199, 0.25)' : '#bae6fd',
        },
        {
            title: 'Evaluated & Scored',
            value: completed,
            badge: 'SUBMITTED',
            sub: averageScore ? `Avg Score: ${averageScore} / 10.00` : 'No scores yet',
            icon: <CheckCircleRoundedIcon />,
            color: '#10b981',
            bgGlow: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
            borderColor: isDark ? 'rgba(16, 185, 129, 0.25)' : '#a7f3d0',
        },
        {
            title: 'Awaiting Evaluation',
            value: pending,
            badge: pending === 0 ? 'COMPLETED' : 'IN QUEUE',
            sub: pending === 0 ? 'All caught up! 🎉' : `${pending} papers left to evaluate`,
            icon: <HourglassEmptyRoundedIcon />,
            color: '#f59e0b',
            bgGlow: 'radial-gradient(circle at top right, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
            borderColor: isDark ? 'rgba(245, 158, 11, 0.25)' : '#fde68a',
        },
        {
            title: 'Progress Rate',
            value: `${Math.round(completionRate)}%`,
            badge: completionRate === 100 ? '100% DONE' : 'IN PROGRESS',
            sub: `${completed} of ${totalAssigned} completed`,
            icon: <RateReviewIcon />,
            color: '#6366f1',
            bgGlow: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
            borderColor: isDark ? 'rgba(99, 102, 241, 0.25)' : '#c7d2fe',
            showProgress: true,
        },
    ];

    return (
        <SidebarLayout>
            <Head title="Juri Assessment Deck • 55th PIT IAGI & GEOSEA 2026" />

            <Box sx={{
                p: { xs: 2, sm: 3, md: 4 },
                minHeight: '100vh',
                bgcolor: c.surfaceBg,
                maxWidth: '1600px',
                mx: 'auto',
            }}>
                {/* ── HERO BANNER: 21st.dev Editorial Evaluation Deck ── */}
                <Box sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '24px',
                    p: { xs: 3, sm: 3.5, md: 4 },
                    mb: 3.5,
                    background: isDark
                        ? 'linear-gradient(135deg, #052e25 0%, #031c17 50%, #02120e 100%)'
                        : 'linear-gradient(135deg, #094d42 0%, #063830 50%, #03241f 100%)',
                    color: '#ffffff',
                    boxShadow: '0 20px 45px -15px rgba(4, 41, 35, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 3,
                }}>
                    {/* Background Decorative Mesh & Glow */}
                    <Box sx={{
                        position: 'absolute',
                        top: -60,
                        right: -60,
                        width: 260,
                        height: 260,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: -40,
                        left: '20%',
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Left Column: Greeting & Meta */}
                    <Box sx={{ position: 'relative', zIndex: 1, maxWidth: { md: '65%' } }}>
                        {/* Status Live Tag */}
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.8,
                                px: 1.5,
                                py: 0.4,
                                borderRadius: '20px',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                letterSpacing: '0.06em',
                                color: '#a7f3d0',
                                textTransform: 'uppercase',
                            }}>
                                <Box sx={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: '50%',
                                    bgcolor: '#10b981',
                                    boxShadow: '0 0 8px #10b981',
                                    animation: 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                        '0%': { transform: 'scale(0.95)', opacity: 0.8 },
                                        '50%': { transform: 'scale(1.3)', opacity: 1 },
                                        '100%': { transform: 'scale(0.95)', opacity: 0.8 },
                                    }
                                }} />
                                Scientific Jury Evaluation Deck
                            </Box>
                            <Box sx={{
                                px: 1.2,
                                py: 0.4,
                                borderRadius: '20px',
                                bgcolor: 'rgba(217, 119, 6, 0.2)',
                                border: '1px solid rgba(245, 158, 11, 0.35)',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                color: '#fde68a',
                                letterSpacing: '0.04em',
                            }}>
                                55th PIT IAGI & GEOSEA XIX
                            </Box>
                        </Box>

                        {/* Heading */}
                        <Typography variant="h3" sx={{
                            fontWeight: 900,
                            letterSpacing: '-0.03em',
                            fontSize: { xs: '1.75rem', sm: '2.15rem', md: '2.45rem' },
                            lineHeight: 1.15,
                            color: '#ffffff',
                            mb: 1,
                        }}>
                            Welcome, {juriName}! ⚖️
                        </Typography>

                        {/* Description */}
                        <Typography variant="body1" sx={{
                            color: 'rgba(255, 255, 255, 0.82)',
                            fontSize: { xs: '0.88rem', sm: '0.95rem' },
                            lineHeight: 1.5,
                            mb: 2,
                            fontWeight: 400,
                        }}>
                            Review presentations, record standardized rubric evaluations (Delivery, Scientific Content & Manuscript Quality), and submit formal marks.
                        </Typography>

                        {/* Submeta Pills */}
                        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: 1.2,
                                py: 0.4,
                                borderRadius: '8px',
                                bgcolor: 'rgba(255, 255, 255, 0.08)',
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 600,
                            }}>
                                <CalendarTodayIcon sx={{ fontSize: 14, color: '#34d399' }} />
                                {formattedDate}
                            </Box>
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: 1.2,
                                py: 0.4,
                                borderRadius: '8px',
                                bgcolor: 'rgba(255, 255, 255, 0.08)',
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 600,
                            }}>
                                <ShieldIcon sx={{ fontSize: 14, color: '#60a5fa' }} />
                                Blind Evaluation Integrity Protected
                            </Box>
                        </Stack>
                    </Box>

                    {/* Right Column: High-Impact CTAs */}
                    <Box sx={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: { xs: 'row', md: 'column' },
                        gap: 1.5,
                        width: { xs: '100%', md: 'auto' },
                        minWidth: { md: 240 },
                    }}>
                        <Button
                            component={Link}
                            href={route('juri.submissions')}
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                color: '#ffffff',
                                px: 3,
                                py: 1.3,
                                borderRadius: '14px',
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: '0.92rem',
                                letterSpacing: '0.01em',
                                boxShadow: '0 8px 24px rgba(217, 119, 6, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 28px rgba(217, 119, 6, 0.5)',
                                },
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                flex: 1,
                            }}
                        >
                            Open Scoring Deck
                        </Button>

                        <Box sx={{
                            p: 1.5,
                            borderRadius: '14px',
                            bgcolor: 'rgba(0, 0, 0, 0.25)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center',
                        }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>
                                EVALUATION TIMELINE
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#fde68a', fontWeight: 800, fontSize: '0.82rem', mt: 0.2 }}>
                                PIT IAGI 2026 Session 1
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ── BENTO METRIC CARDS (Taste-Skill 4-Col Grid) ── */}
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    {statCards.map((card, index) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                            <Card elevation={0} sx={{
                                borderRadius: '20px',
                                border: `1.5px solid ${card.borderColor}`,
                                bgcolor: c.cardBg,
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 18px rgba(0,0,0,0.03)',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: isDark ? `0 12px 30px ${card.color}25` : `0 12px 28px ${card.color}15`,
                                    borderColor: card.color,
                                },
                            }}>
                                {/* Subtle Ambient Radial Glow */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    height: '100%',
                                    background: card.bgGlow,
                                    pointerEvents: 'none',
                                }} />

                                <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1, '&:last-child': { pb: 2.5 } }}>
                                    {/* Top Bar: Icon + Badge */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: '12px',
                                            bgcolor: isDark ? `${card.color}18` : `${card.color}12`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: card.color,
                                            border: `1px solid ${card.color}35`,
                                        }}>
                                            {React.cloneElement(card.icon, { sx: { fontSize: 22 } })}
                                        </Box>

                                        <Chip
                                            label={card.badge}
                                            size="small"
                                            sx={{
                                                bgcolor: isDark ? `${card.color}20` : `${card.color}15`,
                                                color: card.color,
                                                fontWeight: 800,
                                                fontSize: '0.68rem',
                                                letterSpacing: '0.04em',
                                                height: 24,
                                                borderRadius: '8px',
                                                border: `1px solid ${card.color}30`,
                                            }}
                                        />
                                    </Box>

                                    {/* Numeric Metric */}
                                    <Typography variant="h3" sx={{
                                        fontWeight: 900,
                                        color: c.textPrimary,
                                        fontSize: { xs: '1.85rem', sm: '2.1rem' },
                                        letterSpacing: '-0.03em',
                                        lineHeight: 1.1,
                                        fontFeatureSettings: '"tnum"',
                                    }}>
                                        {card.value}
                                    </Typography>

                                    {/* Metric Label */}
                                    <Typography variant="body2" sx={{
                                        color: c.textPrimary,
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        mt: 0.6,
                                    }}>
                                        {card.title}
                                    </Typography>

                                    {/* Subtitle / Micro Indicator */}
                                    <Typography variant="caption" sx={{
                                        color: c.textSecondary,
                                        display: 'block',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        mt: 0.4,
                                    }}>
                                        {card.sub}
                                    </Typography>

                                    {/* Progress Bar (if applicable) */}
                                    {card.showProgress && (
                                        <Box sx={{ mt: 1.8 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={completionRate}
                                                sx={{
                                                    height: 7,
                                                    borderRadius: 4,
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                        background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ── 2-COLUMN BENTO SECTION ── */}
                <Grid container spacing={3}>
                    {/* LEFT COLUMN: Assigned Presentations (8 Cols) */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Card elevation={0} sx={{
                            borderRadius: '22px',
                            border: `1.5px solid ${c.cardBorder}`,
                            bgcolor: c.cardBg,
                            overflow: 'hidden',
                            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)',
                        }}>
                            {/* Card Header & Filter Bar */}
                            <Box sx={{
                                p: { xs: 2.5, sm: 3 },
                                borderBottom: `1px solid ${c.cardBorder}`,
                                bgcolor: isDark ? 'rgba(255,255,255,0.015)' : '#fafbfc',
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'space-between',
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    gap: 2,
                                    mb: 2.5,
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 800,
                                            color: c.textPrimary,
                                            fontSize: '1.15rem',
                                            letterSpacing: '-0.02em',
                                        }}>
                                            Assigned Presentations
                                        </Typography>
                                        <Chip
                                            label={`${filteredAssignments.length} Papers`}
                                            size="small"
                                            sx={{
                                                bgcolor: isDark ? 'rgba(9, 77, 66, 0.25)' : '#dcfce7',
                                                color: '#059669',
                                                fontWeight: 800,
                                                fontSize: '0.7rem',
                                                height: 22,
                                                borderRadius: '6px',
                                            }}
                                        />
                                    </Box>

                                    <Button
                                        component={Link}
                                        href={route('juri.submissions')}
                                        size="small"
                                        endIcon={<ArrowForwardIcon sx={{ fontSize: '15px !important' }} />}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            color: '#d97706',
                                            fontSize: '0.84rem',
                                            p: 0,
                                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                                        }}
                                    >
                                        View Full Table ({totalAssigned})
                                    </Button>
                                </Box>

                                {/* Search & Tab Filters */}
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
                                    <TextField
                                        placeholder="Search by title, author, or code..."
                                        size="small"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon sx={{ color: c.textSecondary, fontSize: 19 }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: searchQuery ? (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                                                        <ClearIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                            sx: {
                                                borderRadius: '12px',
                                                fontSize: '0.85rem',
                                                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                                            }
                                        }}
                                    />

                                    {/* Filter Pills */}
                                    <Stack direction="row" spacing={0.8} sx={{ width: { xs: '100%', sm: 'auto' }, overflowX: 'auto', pb: { xs: 0.5, sm: 0 } }}>
                                        {[
                                            { key: 'all', label: `All (${totalAssigned})` },
                                            { key: 'pending', label: `Pending (${pending})` },
                                            { key: 'scored', label: `Scored (${completed})` },
                                            { key: 'oral', label: `Oral (${oralCount})` },
                                            { key: 'poster', label: `Poster (${posterCount})` },
                                        ].map((tab) => {
                                            const active = selectedTab === tab.key;
                                            return (
                                                <Button
                                                    key={tab.key}
                                                    size="small"
                                                    onClick={() => setSelectedTab(tab.key)}
                                                    sx={{
                                                        textTransform: 'none',
                                                        borderRadius: '10px',
                                                        fontSize: '0.78rem',
                                                        fontWeight: active ? 800 : 600,
                                                        px: 1.5,
                                                        py: 0.6,
                                                        minWidth: 'fit-content',
                                                        bgcolor: active
                                                            ? (isDark ? '#059669' : '#094d42')
                                                            : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
                                                        color: active ? '#ffffff' : c.textSecondary,
                                                        '&:hover': {
                                                            bgcolor: active
                                                                ? (isDark ? '#047857' : '#063830')
                                                                : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                                                        },
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                >
                                                    {tab.label}
                                                </Button>
                                            );
                                        })}
                                    </Stack>
                                </Stack>
                            </Box>

                            {/* Presentation Cards List */}
                            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                                {filteredAssignments.length === 0 ? (
                                    <Box sx={{
                                        textAlign: 'center',
                                        py: 6,
                                        px: 2,
                                        borderRadius: '16px',
                                        border: `1px dashed ${c.cardBorder}`,
                                    }}>
                                        <GavelIcon sx={{ fontSize: 48, color: c.textSecondary, opacity: 0.35, mb: 1.5 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: c.textPrimary, mb: 0.5 }}>
                                            No presentations match your search or filter
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textSecondary, mb: 2, maxWidth: 400, mx: 'auto' }}>
                                            Try adjusting the search keywords or switch the filter tab back to "All".
                                        </Typography>
                                        {(searchQuery || selectedTab !== 'all') && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => { setSearchQuery(''); setSelectedTab('all'); }}
                                                sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 700 }}
                                            >
                                                Reset Filters
                                            </Button>
                                        )}
                                    </Box>
                                ) : (
                                    <Stack spacing={2}>
                                        {filteredAssignments.map((score) => {
                                            const sub = score.submission || {};
                                            const isScored = score.weighted_final_score !== null && score.weighted_final_score !== undefined;
                                            const isOral = (score.rubric_type || '').toLowerCase() === 'oral';
                                            const tier = isScored ? getScoreTier(score.weighted_final_score) : null;
                                            const presenterName = sub.author_full_name || sub.user?.name || 'Author Not Provided';
                                            const institution = sub.institute_organization || sub.affiliation || 'Institution / University';
                                            const paperCode = sub.submission_code || `SUB-${score.submission_id}`;
                                            const themeTopic = sub.paper_sub_theme || sub.topic || 'General Geology';

                                            return (
                                                <Box
                                                    key={score.id}
                                                    sx={{
                                                        borderRadius: '16px',
                                                        border: `1.5px solid ${isScored ? (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0') : (isDark ? 'rgba(245, 158, 11, 0.35)' : '#fde68a')}`,
                                                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                                                        p: { xs: 2, sm: 2.5 },
                                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        boxShadow: isScored ? 'none' : (isDark ? '0 4px 15px rgba(245, 158, 11, 0.08)' : '0 4px 15px rgba(245, 158, 11, 0.05)'),
                                                        '&:hover': {
                                                            borderColor: isOral ? '#0284c7' : '#9333ea',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: isDark
                                                                ? '0 8px 24px rgba(0,0,0,0.35)'
                                                                : '0 8px 24px rgba(0,0,0,0.06)',
                                                        },
                                                    }}
                                                >
                                                    {/* Top Badges Row */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        mb: 1.5,
                                                    }}>
                                                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                                            {/* Oral vs Poster Badge */}
                                                            <Chip
                                                                icon={isOral ? <MicIcon sx={{ fontSize: '14px !important' }} /> : <WallpaperIcon sx={{ fontSize: '14px !important' }} />}
                                                                label={isOral ? 'ORAL PRESENTATION' : 'POSTER PRESENTATION'}
                                                                size="small"
                                                                sx={{
                                                                    height: 24,
                                                                    fontSize: '0.68rem',
                                                                    fontWeight: 800,
                                                                    letterSpacing: '0.04em',
                                                                    borderRadius: '8px',
                                                                    bgcolor: isOral
                                                                        ? (isDark ? 'rgba(2, 132, 199, 0.18)' : '#e0f2fe')
                                                                        : (isDark ? 'rgba(147, 51, 234, 0.18)' : '#f3e8ff'),
                                                                    color: isOral ? '#0284c7' : '#9333ea',
                                                                    border: `1px solid ${isOral ? '#7dd3fc' : '#d8b4fe'}`,
                                                                }}
                                                            />

                                                            {/* Code Pill */}
                                                            <Chip
                                                                label={paperCode}
                                                                size="small"
                                                                sx={{
                                                                    height: 24,
                                                                    fontSize: '0.68rem',
                                                                    fontFamily: 'monospace',
                                                                    fontWeight: 800,
                                                                    borderRadius: '6px',
                                                                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                                    color: c.textSecondary,
                                                                }}
                                                            />

                                                            {/* Topic / Sub-theme */}
                                                            {themeTopic && (
                                                                <Chip
                                                                    label={themeTopic}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 24,
                                                                        fontSize: '0.68rem',
                                                                        fontWeight: 600,
                                                                        borderRadius: '6px',
                                                                        bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                                                                        color: c.textSecondary,
                                                                        maxWidth: 220,
                                                                        '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                                                                    }}
                                                                />
                                                            )}
                                                        </Stack>

                                                        {/* Status Pill on Right */}
                                                        {isScored ? (
                                                            <Box sx={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: 0.6,
                                                                px: 1.2,
                                                                py: 0.3,
                                                                borderRadius: '8px',
                                                                bgcolor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                                                                color: '#059669',
                                                                border: '1px solid #a7f3d0',
                                                                fontSize: '0.72rem',
                                                                fontWeight: 800,
                                                            }}>
                                                                <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />
                                                                SCORED
                                                            </Box>
                                                        ) : (
                                                            <Box sx={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: 0.6,
                                                                px: 1.2,
                                                                py: 0.3,
                                                                borderRadius: '8px',
                                                                bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb',
                                                                color: '#d97706',
                                                                border: '1px solid #fde68a',
                                                                fontSize: '0.72rem',
                                                                fontWeight: 800,
                                                            }}>
                                                                <HourglassEmptyRoundedIcon sx={{ fontSize: 13 }} />
                                                                AWAITING SCORE
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    {/* Title */}
                                                    <Typography
                                                        component={Link}
                                                        href={route('juri.submissions.view', score.submission_id)}
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 800,
                                                            color: c.textPrimary,
                                                            fontSize: { xs: '0.98rem', sm: '1.08rem' },
                                                            letterSpacing: '-0.015em',
                                                            lineHeight: 1.35,
                                                            display: 'block',
                                                            textDecoration: 'none',
                                                            mb: 1.5,
                                                            '&:hover': {
                                                                color: '#059669',
                                                                textDecoration: 'underline',
                                                            },
                                                        }}
                                                    >
                                                        {sub.title || 'Untitled Research Presentation'}
                                                    </Typography>

                                                    {/* Presenter & Meta Row */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: { xs: 'column', sm: 'row' },
                                                        justifyContent: 'space-between',
                                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                                        gap: 2,
                                                        pt: 1.5,
                                                        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}`,
                                                    }}>
                                                        {/* Presenter Info */}
                                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                                            <Avatar sx={{
                                                                width: 34,
                                                                height: 34,
                                                                fontSize: '0.8rem',
                                                                fontWeight: 800,
                                                                bgcolor: isOral ? '#0284c7' : '#9333ea',
                                                                color: '#ffffff',
                                                            }}>
                                                                {presenterName.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.84rem' }}>
                                                                    {presenterName}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: c.textSecondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <SchoolIcon sx={{ fontSize: 13 }} />
                                                                    {institution}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>

                                                        {/* Score or Action CTA */}
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                            width: { xs: '100%', sm: 'auto' },
                                                            justifyContent: { xs: 'space-between', sm: 'flex-end' },
                                                        }}>
                                                            {isScored ? (
                                                                <>
                                                                    <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.7rem', display: 'block', fontWeight: 600 }}>
                                                                            WEIGHTED SCORE
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                                                            <StarIcon sx={{ color: '#d97706', fontSize: 17 }} />
                                                                            <Typography variant="body1" sx={{ fontWeight: 900, color: '#d97706', fontSize: '1.05rem', fontFamily: 'monospace' }}>
                                                                                {score.weighted_final_score}
                                                                            </Typography>
                                                                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.75rem' }}>
                                                                                / 10.00
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>

                                                                    <Button
                                                                        component={Link}
                                                                        href={route('juri.submissions.view', score.submission_id)}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                                                                        sx={{
                                                                            borderRadius: '10px',
                                                                            textTransform: 'none',
                                                                            fontWeight: 700,
                                                                            fontSize: '0.8rem',
                                                                            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1',
                                                                            color: c.textPrimary,
                                                                            '&:hover': {
                                                                                borderColor: '#059669',
                                                                                color: '#059669',
                                                                                bgcolor: isDark ? 'rgba(5, 150, 105, 0.1)' : '#f0fdf4',
                                                                            }
                                                                        }}
                                                                    >
                                                                        Edit Score
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <Button
                                                                    component={Link}
                                                                    href={route('juri.submissions.view', score.submission_id)}
                                                                    size="small"
                                                                    variant="contained"
                                                                    endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                                                                    sx={{
                                                                        background: 'linear-gradient(135deg, #094d42 0%, #059669 100%)',
                                                                        borderRadius: '10px',
                                                                        textTransform: 'none',
                                                                        fontWeight: 800,
                                                                        fontSize: '0.82rem',
                                                                        px: 2.2,
                                                                        py: 0.8,
                                                                        boxShadow: '0 4px 12px rgba(9, 77, 66, 0.3)',
                                                                        '&:hover': {
                                                                            background: 'linear-gradient(135deg, #063830 0%, #047857 100%)',
                                                                            transform: 'translateY(-1px)',
                                                                            boxShadow: '0 6px 16px rgba(9, 77, 66, 0.4)',
                                                                        },
                                                                        width: { xs: '100%', sm: 'auto' },
                                                                    }}
                                                                >
                                                                    Evaluate Now
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                )}
                            </Box>
                        </Card>
                    </Grid>

                    {/* RIGHT COLUMN: Official Guidelines & Rubric Reference (4 Cols) */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Stack spacing={2.5}>
                            {/* Card 1: Official Evaluation Rubric Weights */}
                            <Card elevation={0} sx={{
                                borderRadius: '22px',
                                border: `1.5px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                p: 3,
                                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                    <WorkspacePremiumIcon sx={{ color: '#d97706', fontSize: 24 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '1.05rem' }}>
                                        Official Rubric Weights
                                    </Typography>
                                </Box>

                                <Typography variant="body2" sx={{ color: c.textSecondary, fontSize: '0.8rem', mb: 2.5, lineHeight: 1.45 }}>
                                    Scores are mathematically aggregated across 3 standardized dimensions based on rubric specifications:
                                </Typography>

                                <Stack spacing={2}>
                                    {/* Criteria 1: Oral Delivery / Poster Design */}
                                    <Box sx={{
                                        p: 1.8,
                                        borderRadius: '12px',
                                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                        border: `1px solid ${c.cardBorder}`,
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.82rem' }}>
                                                Presentation Quality & Delivery
                                            </Typography>
                                            <Chip label="40% Weight" size="small" sx={{
                                                bgcolor: isDark ? 'rgba(2, 132, 199, 0.2)' : '#e0f2fe',
                                                color: '#0284c7',
                                                fontWeight: 800,
                                                fontSize: '0.68rem',
                                                height: 20,
                                            }} />
                                        </Box>
                                        <Typography variant="caption" sx={{ color: c.textSecondary, display: 'block', fontSize: '0.72rem' }}>
                                            Oral: Time management, verbal clarity & slides.<br />
                                            Poster: Visual design, layout hierarchy & graphics.
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={40}
                                            sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#0284c7' } }}
                                        />
                                    </Box>

                                    {/* Criteria 2: Scientific Rigor & Contribution */}
                                    <Box sx={{
                                        p: 1.8,
                                        borderRadius: '12px',
                                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                        border: `1px solid ${c.cardBorder}`,
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.82rem' }}>
                                                Scientific Rigor & Content
                                            </Typography>
                                            <Chip label="40% Weight" size="small" sx={{
                                                bgcolor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#dcfce7',
                                                color: '#059669',
                                                fontWeight: 800,
                                                fontSize: '0.68rem',
                                                height: 20,
                                            }} />
                                        </Box>
                                        <Typography variant="caption" sx={{ color: c.textSecondary, display: 'block', fontSize: '0.72rem' }}>
                                            Oral: Data validity, technical contribution & novelty.<br />
                                            Poster: Presenter knowledge, defense & Q&A.
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={40}
                                            sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }}
                                        />
                                    </Box>

                                    {/* Criteria 3: Manuscript Quality */}
                                    <Box sx={{
                                        p: 1.8,
                                        borderRadius: '12px',
                                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                        border: `1px solid ${c.cardBorder}`,
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.82rem' }}>
                                                Manuscript Academic Quality
                                            </Typography>
                                            <Chip label="20% Weight" size="small" sx={{
                                                bgcolor: isDark ? 'rgba(217, 119, 6, 0.2)' : '#fef3c7',
                                                color: '#d97706',
                                                fontWeight: 800,
                                                fontSize: '0.68rem',
                                                height: 20,
                                            }} />
                                        </Box>
                                        <Typography variant="caption" sx={{ color: c.textSecondary, display: 'block', fontSize: '0.72rem' }}>
                                            Academic writing structure, references, abstract clarity, and formatting compliance.
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={20}
                                            sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#d97706' } }}
                                        />
                                    </Box>
                                </Stack>
                            </Card>

                            {/* Card 2: Standard Grading Scale */}
                            <Card elevation={0} sx={{
                                borderRadius: '22px',
                                border: `1.5px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                p: 3,
                                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                    <TrendingUpRoundedIcon sx={{ color: '#2563eb', fontSize: 24 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '1.05rem' }}>
                                        Grading Scale Standards
                                    </Typography>
                                </Box>

                                <Stack spacing={1.2}>
                                    {[
                                        { range: '9.00 – 10.00', label: 'Exceptional (Top 5%)', color: '#059669', bg: isDark ? 'rgba(5,150,105,0.15)' : '#ecfdf5' },
                                        { range: '7.00 – 8.99', label: 'Good / Strong Presentation', color: '#2563eb', bg: isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff' },
                                        { range: '5.00 – 6.99', label: 'Acceptable / Meets Standards', color: '#d97706', bg: isDark ? 'rgba(217,119,6,0.15)' : '#fffbeb' },
                                        { range: '< 5.00', label: 'Below Standard', color: '#dc2626', bg: isDark ? 'rgba(220,38,38,0.15)' : '#fef2f2' },
                                    ].map((tier, idx) => (
                                        <Box key={idx} sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 1.2,
                                            borderRadius: '10px',
                                            bgcolor: tier.bg,
                                        }}>
                                            <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace', color: tier.color, fontSize: '0.78rem' }}>
                                                {tier.range}
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: tier.color, fontSize: '0.74rem' }}>
                                                {tier.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Card>

                            {/* Card 3: Blind Judging Assurance */}
                            <Box sx={{
                                p: 2.5,
                                borderRadius: '18px',
                                bgcolor: isDark ? 'rgba(9, 77, 66, 0.15)' : '#f0fdf4',
                                border: '1px solid rgba(16, 185, 129, 0.25)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                            }}>
                                <ShieldIcon sx={{ color: '#059669', fontSize: 24, mt: 0.2 }} />
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? '#34d399' : '#065f46', fontSize: '0.85rem' }}>
                                        Confidentiality & Ethics
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#047857', display: 'block', mt: 0.3, lineHeight: 1.45 }}>
                                        All jury scores are cryptographically bound to session records. Evaluations remain confidential until ratified by the Scientific Committee.
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </SidebarLayout>
    );
}
