import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Button, TextField,
    InputAdornment, Stack, useTheme, Grid, Avatar, IconButton,
    LinearProgress, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import MicIcon from '@mui/icons-material/Mic';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import ShieldIcon from '@mui/icons-material/Shield';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function JuriSubmissions({ scores = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, scored, oral, poster

    // Derived statistics
    const totalCount = scores.length;
    const scoredCount = scores.filter(s => s.weighted_final_score !== null && s.weighted_final_score !== undefined).length;
    const pendingCount = totalCount - scoredCount;
    const oralCount = scores.filter(s => (s.rubric_type || '').toLowerCase() === 'oral').length;
    const posterCount = scores.filter(s => (s.rubric_type || '').toLowerCase() === 'poster').length;

    const completionRate = totalCount > 0 ? (scoredCount / totalCount) * 100 : 0;

    // Average Score
    const averageScore = useMemo(() => {
        const scored = scores.filter(s => s.weighted_final_score !== null);
        if (scored.length === 0) return null;
        const sum = scored.reduce((acc, curr) => acc + parseFloat(curr.weighted_final_score || 0), 0);
        return (sum / scored.length).toFixed(2);
    }, [scores]);

    // Interpretation Helper
    const getInterpretation = (score) => {
        const val = parseFloat(score);
        if (isNaN(val)) return null;
        if (val >= 9.0) return { label: 'Exceptional (Top 5%)', color: '#059669', bg: isDark ? 'rgba(5, 150, 105, 0.15)' : '#ecfdf5', border: '#a7f3d0' };
        if (val >= 7.0) return { label: 'Good / Strong', color: '#2563eb', bg: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff', border: '#bfdbfe' };
        if (val >= 5.0) return { label: 'Acceptable', color: '#d97706', bg: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb', border: '#fde68a' };
        return { label: 'Below Standard', color: '#dc2626', bg: isDark ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2', border: '#fecaca' };
    };

    // Filter Logic
    const filteredScores = useMemo(() => {
        return scores.filter((score) => {
            const isScored = score.weighted_final_score !== null && score.weighted_final_score !== undefined;
            const rubric = (score.rubric_type || '').toLowerCase();
            const title = (score.submission?.title || '').toLowerCase();
            const author = (score.submission?.user?.name || score.submission?.author_full_name || '').toLowerCase();
            const code = (score.submission?.submission_code || `id-${score.submission_id}`).toLowerCase();
            const affiliation = (score.submission?.institute_organization || score.submission?.affiliation || '').toLowerCase();

            // Tab Filter
            if (filter === 'pending' && isScored) return false;
            if (filter === 'scored' && !isScored) return false;
            if (filter === 'oral' && rubric !== 'oral') return false;
            if (filter === 'poster' && rubric !== 'poster') return false;

            // Search Filter
            if (search.trim()) {
                const q = search.toLowerCase();
                return title.includes(q) || author.includes(q) || code.includes(q) || affiliation.includes(q);
            }

            return true;
        });
    }, [scores, filter, search]);

    return (
        <SidebarLayout>
            <Head title="Assigned Presentations • 55th PIT IAGI & GEOSEA 2026" />

            <Box sx={{
                p: { xs: 1.5, sm: 2.5, md: 4 },
                minHeight: '100vh',
                bgcolor: c.surfaceBg,
                maxWidth: '1600px',
                mx: 'auto',
            }}>
                {/* ── HERO BANNER: 21st.dev Style Header ── */}
                <Box sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: { xs: '20px', sm: '24px' },
                    p: { xs: 2.2, sm: 3, md: 4 },
                    mb: { xs: 2, sm: 3 },
                    background: isDark
                        ? 'linear-gradient(135deg, #052e25 0%, #031c17 50%, #02120e 100%)'
                        : 'linear-gradient(135deg, #094d42 0%, #063830 50%, #03241f 100%)',
                    color: '#ffffff',
                    boxShadow: '0 20px 45px -15px rgba(4, 41, 35, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                }}>
                    {/* Ambient Glow Circles */}
                    <Box sx={{
                        position: 'absolute',
                        top: -60,
                        right: -60,
                        width: 240,
                        height: 240,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Live Status Badge */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.8, mb: { xs: 1, sm: 1.5 } }}>
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.8,
                                px: { xs: 1.2, sm: 1.5 },
                                py: 0.35,
                                borderRadius: '20px',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                fontSize: { xs: '0.64rem', sm: '0.72rem' },
                                fontWeight: 800,
                                letterSpacing: '0.04em',
                                color: '#a7f3d0',
                                textTransform: 'uppercase',
                            }}>
                                <Box sx={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: '50%',
                                    bgcolor: '#10b981',
                                    boxShadow: '0 0 8px #10b981',
                                }} />
                                Scientific Evaluation Portal
                            </Box>
                            <Box sx={{
                                px: { xs: 1, sm: 1.2 },
                                py: 0.35,
                                borderRadius: '20px',
                                bgcolor: 'rgba(217, 119, 6, 0.2)',
                                border: '1px solid rgba(245, 158, 11, 0.35)',
                                fontSize: { xs: '0.64rem', sm: '0.7rem' },
                                fontWeight: 800,
                                color: '#fde68a',
                                letterSpacing: '0.04em',
                            }}>
                                55th PIT IAGI & GEOSEA XIX 2026
                            </Box>
                        </Box>

                        {/* Title */}
                        <Typography variant="h3" sx={{
                            fontWeight: 900,
                            letterSpacing: '-0.03em',
                            fontSize: { xs: '1.35rem', sm: '1.9rem', md: '2.35rem' },
                            lineHeight: 1.2,
                            color: '#ffffff',
                            mb: { xs: 0.6, sm: 1 },
                        }}>
                            Assigned Presentations ⚖️
                        </Typography>

                        {/* Subtitle - visible on desktop, concise on mobile */}
                        <Typography variant="body1" sx={{
                            color: 'rgba(255, 255, 255, 0.82)',
                            fontSize: { xs: '0.78rem', sm: '0.92rem' },
                            lineHeight: 1.45,
                            mb: { xs: 1.5, sm: 2.5 },
                            maxWidth: 700,
                            display: { xs: 'none', sm: 'block' },
                        }}>
                            Review, evaluate, and submit rubric scores for your assigned scientific presentations. All evaluations are cryptographically secured and confidential.
                        </Typography>

                        {/* Metric Highlights in Hero (Compact on mobile) */}
                        <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }} sx={{ maxWidth: 850 }}>
                            {[
                                { label: 'Total Assigned', val: totalCount, sub: `${oralCount} Oral • ${posterCount} Poster`, color: '#67e8f9' },
                                { label: 'Scored & Finalized', val: scoredCount, sub: averageScore ? `Avg Score: ${averageScore}/10` : 'None scored yet', color: '#6ee7b7' },
                                { label: 'Awaiting Evaluation', val: pendingCount, sub: pendingCount === 0 ? 'All caught up! 🎉' : 'Action required', color: '#fde047' },
                                { label: 'Completion Rate', val: `${Math.round(completionRate)}%`, sub: `${scoredCount}/${totalCount} completed`, color: '#c4b5fd' },
                            ].map((m, idx) => (
                                <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                                    <Box sx={{
                                        p: { xs: 1.1, sm: 1.5 },
                                        borderRadius: { xs: '12px', sm: '14px' },
                                        bgcolor: 'rgba(0, 0, 0, 0.25)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', fontSize: { xs: '0.58rem', sm: '0.68rem' }, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                                            {m.label}
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: m.color, fontSize: { xs: '1.25rem', sm: '1.45rem' }, mt: 0.1, fontFamily: 'monospace', lineHeight: 1.1 }}>
                                            {m.val}
                                        </Typography>
                                        <Typography variant="caption" sx={{
                                            color: 'rgba(255,255,255,0.65)',
                                            fontSize: { xs: '0.62rem', sm: '0.7rem' },
                                            display: 'block',
                                            mt: 0.2,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {m.sub}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>

                {/* ── SEARCH & FILTER CONTROLS (21st.dev Style) ── */}
                <Card elevation={0} sx={{
                    borderRadius: { xs: '16px', sm: '20px' },
                    border: `1.5px solid ${c.cardBorder}`,
                    bgcolor: c.cardBg,
                    p: { xs: 1.5, sm: 2.2 },
                    mb: { xs: 2, sm: 3 },
                    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)',
                }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
                        {/* Live Search */}
                        <TextField
                            placeholder="Search title, author, institution, code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: c.textSecondary, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: search ? (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearch('')}>
                                            <ClearIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null,
                                sx: {
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                                }
                            }}
                            sx={{ minWidth: { md: 360 }, flex: { md: 1 } }}
                        />

                        {/* Filter Tabs with Smooth Touch Momentum Scrolling */}
                        <Stack
                            direction="row"
                            spacing={0.8}
                            sx={{
                                overflowX: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': { display: 'none' },
                                pb: { xs: 0.5, md: 0 },
                                width: { xs: '100%', md: 'auto' },
                                flexShrink: 0,
                            }}
                        >
                            {[
                                { key: 'all', label: `All (${totalCount})` },
                                { key: 'pending', label: `Pending (${pendingCount})` },
                                { key: 'scored', label: `Scored (${scoredCount})` },
                                { key: 'oral', label: `Oral (${oralCount})` },
                                { key: 'poster', label: `Poster (${posterCount})` },
                            ].map((tab) => {
                                const active = filter === tab.key;
                                return (
                                    <Button
                                        key={tab.key}
                                        size="small"
                                        onClick={() => setFilter(tab.key)}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: '10px',
                                            fontSize: '0.78rem',
                                            fontWeight: active ? 800 : 600,
                                            px: { xs: 1.5, sm: 1.8 },
                                            py: 0.7,
                                            minWidth: 'fit-content',
                                            flexShrink: 0,
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
                </Card>

                {/* ── PRESENTATIONS GRID (Bento Card Layout) ── */}
                {filteredScores.length === 0 ? (
                    <Card elevation={0} sx={{
                        borderRadius: '20px',
                        border: `1.5px dashed ${c.cardBorder}`,
                        bgcolor: c.cardBg,
                        p: { xs: 4, sm: 8 },
                        textAlign: 'center',
                    }}>
                        <GavelIcon sx={{ fontSize: 56, color: c.textSecondary, opacity: 0.3, mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, mb: 0.5 }}>
                            No Presentations Found
                        </Typography>
                        <Typography variant="body2" sx={{ color: c.textSecondary, maxWidth: 450, mx: 'auto', mb: 2.5 }}>
                            {search
                                ? `No presentations match your search query "${search}". Try searching with different keywords.`
                                : `There are currently no presentations matching the selected filter.`}
                        </Typography>
                        {(search || filter !== 'all') && (
                            <Button
                                variant="outlined"
                                onClick={() => { setSearch(''); setFilter('all'); }}
                                sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 700 }}
                            >
                                Reset Search & Filters
                            </Button>
                        )}
                    </Card>
                ) : (
                    <Grid container spacing={2.5}>
                        {filteredScores.map((score) => {
                            const sub = score.submission || {};
                            const isScored = score.weighted_final_score !== null && score.weighted_final_score !== undefined;
                            const isOral = (score.rubric_type || '').toLowerCase() === 'oral';
                            const tier = isScored ? getInterpretation(score.weighted_final_score) : null;
                            const presenterName = sub.author_full_name || sub.user?.name || 'Author Not Provided';
                            const institution = sub.institute_organization || sub.affiliation || 'Academic / Institution';
                            const paperCode = sub.submission_code || `SUB-${score.submission_id}`;
                            const subTheme = sub.paper_sub_theme || sub.topic || 'General Geology';

                            return (
                                <Grid size={{ xs: 12, md: 6, lg: 6 }} key={score.id}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: '20px',
                                            border: `1.5px solid ${isScored ? (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0') : (isDark ? 'rgba(245, 158, 11, 0.4)' : '#fde68a')}`,
                                            bgcolor: c.cardBg,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: isScored
                                                ? (isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 18px rgba(0,0,0,0.02)')
                                                : (isDark ? '0 4px 20px rgba(245, 158, 11, 0.1)' : '0 4px 18px rgba(245, 158, 11, 0.05)'),
                                            '&:hover': {
                                                borderColor: isOral ? '#0284c7' : '#9333ea',
                                                transform: 'translateY(-3px)',
                                                boxShadow: isDark
                                                    ? '0 12px 30px rgba(0,0,0,0.4)'
                                                    : '0 12px 28px rgba(0,0,0,0.06)',
                                            },
                                        }}
                                    >
                                        {/* Top Accent Strip */}
                                        <Box sx={{
                                            height: 4,
                                            background: isOral
                                                ? 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)'
                                                : 'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)',
                                        }} />

                                        <CardContent sx={{ p: { xs: 1.8, sm: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Box>
                                                {/* Category + Code + Status */}
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
                                                    <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
                                                        <Chip
                                                            icon={isOral ? <MicIcon sx={{ fontSize: '13px !important' }} /> : <WallpaperIcon sx={{ fontSize: '13px !important' }} />}
                                                            label={isOral ? 'ORAL' : 'POSTER'}
                                                            size="small"
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.66rem',
                                                                fontWeight: 800,
                                                                letterSpacing: '0.04em',
                                                                borderRadius: '6px',
                                                                bgcolor: isOral
                                                                    ? (isDark ? 'rgba(2, 132, 199, 0.18)' : '#e0f2fe')
                                                                    : (isDark ? 'rgba(147, 51, 234, 0.18)' : '#f3e8ff'),
                                                                color: isOral ? '#0284c7' : '#9333ea',
                                                                border: `1px solid ${isOral ? '#7dd3fc' : '#d8b4fe'}`,
                                                            }}
                                                        />

                                                        <Chip
                                                            label={paperCode}
                                                            size="small"
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.66rem',
                                                                fontFamily: 'monospace',
                                                                fontWeight: 800,
                                                                borderRadius: '6px',
                                                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                                color: c.textSecondary,
                                                            }}
                                                        />

                                                        {subTheme && (
                                                            <Chip
                                                                label={subTheme}
                                                                size="small"
                                                                sx={{
                                                                    height: 22,
                                                                    fontSize: '0.66rem',
                                                                    fontWeight: 600,
                                                                    borderRadius: '6px',
                                                                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                                                    color: c.textSecondary,
                                                                    maxWidth: { xs: 150, sm: 180 },
                                                                    '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>

                                                    {/* Status Badge */}
                                                    {isScored ? (
                                                        <Box sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            px: 1,
                                                            py: 0.3,
                                                            borderRadius: '6px',
                                                            bgcolor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                                                            color: '#059669',
                                                            border: '1px solid #a7f3d0',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 800,
                                                        }}>
                                                            <TaskAltIcon sx={{ fontSize: 13 }} />
                                                            SCORED
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            px: 1,
                                                            py: 0.3,
                                                            borderRadius: '6px',
                                                            bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb',
                                                            color: '#d97706',
                                                            border: '1px solid #fde68a',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 800,
                                                        }}>
                                                            <HourglassEmptyRoundedIcon sx={{ fontSize: 12 }} />
                                                            PENDING
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Title */}
                                                <Typography
                                                    component={Link}
                                                    href={route('juri.submissions.view', score.submission_id)}
                                                    variant="h6"
                                                    sx={{
                                                        fontSize: { xs: '0.94rem', sm: '1.08rem' },
                                                        fontWeight: 800,
                                                        color: c.textPrimary,
                                                        lineHeight: 1.35,
                                                        letterSpacing: '-0.015em',
                                                        mb: { xs: 1.2, sm: 2 },
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textDecoration: 'none',
                                                        minHeight: 'auto',
                                                        '&:hover': {
                                                            color: '#059669',
                                                            textDecoration: 'underline',
                                                        },
                                                    }}
                                                >
                                                    {sub.title || 'Untitled Scientific Presentation'}
                                                </Typography>

                                                {/* Author & Affiliation Details */}
                                                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: { xs: 1.5, sm: 2.2 } }}>
                                                    <Avatar sx={{
                                                        width: { xs: 32, sm: 38 },
                                                        height: { xs: 32, sm: 38 },
                                                        bgcolor: isOral ? '#0284c7' : '#9333ea',
                                                        color: '#ffffff',
                                                        fontSize: { xs: '0.78rem', sm: '0.85rem' },
                                                        fontWeight: 800,
                                                    }}>
                                                        {presenterName.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                                        <Typography variant="body2" sx={{
                                                            fontWeight: 700,
                                                            color: c.textPrimary,
                                                            fontSize: '0.84rem',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                            {presenterName}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{
                                                            color: c.textSecondary,
                                                            fontSize: '0.72rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                            <SchoolIcon sx={{ fontSize: 13, flexShrink: 0 }} />
                                                            {institution}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>

                                            <Divider sx={{ my: 1.5, opacity: 0.6 }} />

                                            {/* Bottom Score & Action Bar */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                pt: 0.5,
                                            }}>
                                                {/* Left: Score readout */}
                                                <Box>
                                                    {isScored ? (
                                                        <Box>
                                                            <Typography variant="caption" sx={{
                                                                color: c.textSecondary,
                                                                fontSize: '0.68rem',
                                                                fontWeight: 700,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.04em',
                                                                display: 'block',
                                                            }}>
                                                                Final Score
                                                            </Typography>
                                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.2 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                                                    <StarIcon sx={{ color: '#d97706', fontSize: 18 }} />
                                                                    <Typography variant="h6" sx={{
                                                                        fontWeight: 900,
                                                                        color: '#d97706',
                                                                        fontSize: '1.25rem',
                                                                        lineHeight: 1,
                                                                        fontFamily: 'monospace',
                                                                    }}>
                                                                        {parseFloat(score.weighted_final_score).toFixed(2)}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.72rem' }}>
                                                                        /10
                                                                    </Typography>
                                                                </Box>

                                                                {tier && (
                                                                    <Chip
                                                                        label={tier.label}
                                                                        size="small"
                                                                        sx={{
                                                                            height: 20,
                                                                            fontSize: '0.65rem',
                                                                            fontWeight: 800,
                                                                            bgcolor: tier.bg,
                                                                            color: tier.color,
                                                                            border: `1px solid ${tier.border}`,
                                                                            borderRadius: '6px',
                                                                        }}
                                                                    />
                                                                )}
                                                            </Stack>
                                                        </Box>
                                                    ) : (
                                                        <Box>
                                                            <Typography variant="caption" sx={{
                                                                color: c.textSecondary,
                                                                fontSize: '0.68rem',
                                                                fontWeight: 700,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.04em',
                                                                display: 'block',
                                                            }}>
                                                                Evaluation
                                                            </Typography>
                                                            <Typography variant="body2" sx={{
                                                                fontWeight: 700,
                                                                color: '#d97706',
                                                                fontSize: '0.84rem',
                                                                mt: 0.2,
                                                            }}>
                                                                Awaiting Evaluation
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Right: Action Button */}
                                                <Button
                                                    component={Link}
                                                    href={route('juri.submissions.view', score.submission_id)}
                                                    variant={isScored ? 'outlined' : 'contained'}
                                                    size="small"
                                                    startIcon={isScored ? <EditIcon sx={{ fontSize: 14 }} /> : undefined}
                                                    endIcon={!isScored ? <ArrowForwardIcon sx={{ fontSize: 14 }} /> : undefined}
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontWeight: 800,
                                                        borderRadius: '10px',
                                                        px: 2,
                                                        py: 0.8,
                                                        fontSize: '0.8rem',
                                                        ...(isScored ? {
                                                            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1',
                                                            color: c.textPrimary,
                                                            '&:hover': {
                                                                borderColor: '#059669',
                                                                color: '#059669',
                                                                bgcolor: isDark ? 'rgba(5, 150, 105, 0.1)' : '#f0fdf4',
                                                            }
                                                        } : {
                                                            background: 'linear-gradient(135deg, #094d42 0%, #059669 100%)',
                                                            color: '#ffffff',
                                                            boxShadow: '0 4px 14px rgba(9, 77, 66, 0.3)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #063830 0%, #047857 100%)',
                                                                transform: 'translateY(-1px)',
                                                                boxShadow: '0 6px 18px rgba(9, 77, 66, 0.4)',
                                                            },
                                                        }),
                                                    }}
                                                >
                                                    {isScored ? 'Edit Evaluation' : 'Evaluate Now'}
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        </SidebarLayout>
    );
}
