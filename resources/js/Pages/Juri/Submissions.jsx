import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Button, TextField,
    InputAdornment, Stack, useTheme, ToggleButtonGroup, ToggleButton, Grid, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

// ISO/Professional palette definitions
const COLOR_THEME = {
    primary: '#1b2a4a',
    primaryLight: '#2d4373',
    oral: '#1d4ed8',       // Blue for Oral
    poster: '#7c3aed',     // Purple for Poster
    exceptional: '#047857',
    good: '#1e40af',
    acceptable: '#b45309',
    belowStd: '#c2410c',
    unsatisfactory: '#b91c1c',
};

export default function JuriSubmissions({ scores = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredScores = scores.filter(score => {
        const title = score.submission?.title?.toLowerCase() || '';
        const author = score.submission?.user?.name?.toLowerCase() || '';
        const matchesSearch = title.includes(search.toLowerCase()) || author.includes(search.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'pending') return matchesSearch && !score.weighted_final_score;
        if (filter === 'scored') return matchesSearch && score.weighted_final_score;
        return matchesSearch;
    });

    const counts = {
        all: scores.length,
        pending: scores.filter(s => !s.weighted_final_score).length,
        scored: scores.filter(s => s.weighted_final_score).length,
    };

    const getInterpretation = (score) => {
        if (score >= 9.0) return { label: 'Exceptional', color: COLOR_THEME.exceptional, bg: isDark ? 'rgba(4,120,87,0.12)' : '#ecfdf5' };
        if (score >= 7.0) return { label: 'Good', color: COLOR_THEME.good, bg: isDark ? 'rgba(30,64,175,0.12)' : '#eff6ff' };
        if (score >= 5.0) return { label: 'Acceptable', color: COLOR_THEME.acceptable, bg: isDark ? 'rgba(180,83,9,0.12)' : '#fffbeb' };
        if (score >= 3.0) return { label: 'Below Std.', color: COLOR_THEME.belowStd, bg: isDark ? 'rgba(194,65,12,0.12)' : '#fff7ed' };
        return { label: 'Unsatisfactory', color: COLOR_THEME.unsatisfactory, bg: isDark ? 'rgba(185,28,28,0.12)' : '#fef2f2' };
    };

    const bdr = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
    const fontDoc = '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif';

    return (
        <SidebarLayout>
            <Head title="Assigned Presentations" />

            <Box sx={{ p: { xs: 2, sm: 3.5 }, minHeight: '100vh', bgcolor: isDark ? c.surfaceBg : '#f1f5f9', fontFamily: fontDoc }}>

                {/* ═══ Page Header ═══ */}
                <Box sx={{ mb: 3.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{
                            fontWeight: 800, color: c.textPrimary,
                            fontSize: { xs: '1.4rem', sm: '1.75rem' },
                            letterSpacing: '-0.02em', fontFamily: fontDoc,
                        }}>
                            Assigned Presentations ⚖️
                        </Typography>
                        <Typography variant="body2" sx={{ color: c.textSecondary, mt: 0.5, fontFamily: fontDoc }}>
                            Review, evaluate, and score the scientific presentations assigned to you
                        </Typography>
                    </Box>

                    {/* Quick Stats Overview */}
                    <Stack direction="row" spacing={1.5}>
                        {[
                            { label: 'Scored', count: counts.scored, color: COLOR_THEME.exceptional, icon: <TaskAltIcon sx={{ fontSize: 16 }} /> },
                            { label: 'Pending', count: counts.pending, color: '#d97706', icon: <PendingActionsIcon sx={{ fontSize: 16 }} /> }
                        ].map((stat, i) => (
                            <Box key={i} sx={{
                                px: 1.5, py: 0.75, borderRadius: '8px',
                                bgcolor: c.cardBg, border: `1px solid ${bdr}`,
                                display: 'flex', alignItems: 'center', gap: 1,
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', color: stat.color }}>{stat.icon}</Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</Typography>
                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: c.textPrimary, lineHeight: 1.1 }}>{stat.count}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Box>

                {/* ═══ Search & Filters ═══ */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2, mb: 4,
                    alignItems: { xs: 'stretch', md: 'center' }
                }}>
                    <TextField
                        placeholder="Search by paper title or author..."
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
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                bgcolor: c.cardBg,
                                '& fieldset': { borderColor: bdr },
                            },
                            maxWidth: { md: 380 },
                        }}
                    />

                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={(e, val) => val && setFilter(val)}
                        size="small"
                        sx={{
                            bgcolor: c.cardBg,
                            p: 0.5, borderRadius: '10px',
                            border: `1px solid ${bdr}`,
                            width: 'fit-content',
                            '& .MuiToggleButton-root': {
                                textTransform: 'none', fontWeight: 700,
                                borderRadius: '7px !important', px: { xs: 1.5, sm: 2.5 },
                                py: 0.75, border: 'none',
                                fontSize: '0.78rem',
                                fontFamily: fontDoc,
                                color: c.textSecondary,
                                '&.Mui-selected': {
                                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                                    color: COLOR_THEME.primaryLight,
                                },
                            },
                        }}
                    >
                        <ToggleButton value="all">All ({counts.all})</ToggleButton>
                        <ToggleButton value="pending">Pending ({counts.pending})</ToggleButton>
                        <ToggleButton value="scored">Scored ({counts.scored})</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* ═══ Presentations List Grid (2-Columns on Desktop) ═══ */}
                {filteredScores.length === 0 ? (
                    <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${bdr}`, bgcolor: c.cardBg }}>
                        <CardContent sx={{ textAlign: 'center', py: 8 }}>
                            <GavelIcon sx={{ fontSize: 48, color: c.textSecondary, opacity: 0.25, mb: 1.5 }} />
                            <Typography variant="body1" sx={{ color: c.textSecondary, fontWeight: 700, fontFamily: fontDoc }}>
                                No assignments found
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textSecondary, mt: 0.5, display: 'block', fontFamily: fontDoc }}>
                                {search ? 'Try adjusting your search query' : 'There are currently no presentations assigned to you.'}
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={2.5}>
                        {filteredScores.map((score) => {
                            const isScored = !!score.weighted_final_score;
                            const interp = isScored ? getInterpretation(parseFloat(score.weighted_final_score)) : null;
                            const isOral = score.rubric_type === 'oral';

                            return (
                                <Grid item xs={12} md={6} key={score.id}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: '12px',
                                            border: `1px solid ${bdr}`,
                                            bgcolor: c.cardBg,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.25s ease',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                left: 0, top: 0, bottom: 0,
                                                width: 4,
                                                bgcolor: isOral ? COLOR_THEME.oral : COLOR_THEME.poster,
                                            },
                                            '&:hover': {
                                                borderColor: isOral ? COLOR_THEME.oral : COLOR_THEME.poster,
                                                boxShadow: isDark ? 'none' : '0 4px 16px rgba(0,0,0,0.05)',
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Box>
                                                {/* Header Line: Category badge + Presentation ID */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Chip
                                                            label={isOral ? 'ORAL' : 'POSTER'}
                                                            size="small"
                                                            sx={{
                                                                height: 20, fontSize: '0.62rem', fontWeight: 800,
                                                                bgcolor: isOral ? 'rgba(29,78,216,0.08)' : 'rgba(124,58,237,0.08)',
                                                                color: isOral ? COLOR_THEME.oral : COLOR_THEME.poster,
                                                                borderRadius: '4px',
                                                            }}
                                                        />
                                                        <Typography sx={{ fontSize: '0.68rem', color: c.textSecondary, fontWeight: 500, fontFamily: fontDoc }}>
                                                            ID: #{score.submission_id}
                                                        </Typography>
                                                    </Stack>

                                                    {/* Status Badge */}
                                                    <Chip
                                                        label={isScored ? 'Scored' : 'Pending'}
                                                        size="small"
                                                        sx={{
                                                            height: 18, fontSize: '0.6rem', fontWeight: 700,
                                                            bgcolor: isScored ? 'rgba(4,120,87,0.08)' : 'rgba(217,119,6,0.08)',
                                                            color: isScored ? COLOR_THEME.exceptional : '#d97706',
                                                            borderRadius: '4px',
                                                        }}
                                                    />
                                                </Box>

                                                {/* Title */}
                                                <Typography sx={{
                                                    fontSize: '0.92rem', fontWeight: 700, color: c.textPrimary,
                                                    lineHeight: 1.45, mb: 2, fontFamily: fontDoc,
                                                    overflow: 'hidden', textOverflow: 'ellipsis',
                                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                    minHeight: '2.7rem',
                                                }}>
                                                    {score.submission?.title || 'Untitled Presentation'}
                                                </Typography>

                                                {/* Presenter Metadata */}
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: c.textSecondary }}>
                                                        <PersonIcon sx={{ fontSize: 16 }} />
                                                    </Box>
                                                    <Typography sx={{ fontSize: '0.78rem', color: c.textSecondary, fontWeight: 500, fontFamily: fontDoc }}>
                                                        {score.submission?.user?.name || 'Unknown Presenter'}
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            <Divider sx={{ my: 1.5, opacity: 0.6 }} />

                                            {/* Score display & Button alignment */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                                                {/* Weighted score or missing */}
                                                <Box>
                                                    {isScored ? (
                                                        <Box>
                                                            <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                Weighted Score
                                                            </Typography>
                                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.15 }}>
                                                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: interp.color, fontFamily: fontDoc }}>
                                                                    {parseFloat(score.weighted_final_score).toFixed(2)}
                                                                </Typography>
                                                                <Chip
                                                                    label={interp.label}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 18, fontSize: '0.55rem', fontWeight: 700,
                                                                        bgcolor: interp.bg, color: interp.color,
                                                                    }}
                                                                />
                                                            </Stack>
                                                        </Box>
                                                    ) : (
                                                        <Box>
                                                            <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                Evaluation
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '0.78rem', color: c.textSecondary, fontWeight: 600, mt: 0.2, fontFamily: fontDoc }}>
                                                                Not Scored Yet
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Action Button */}
                                                <Button
                                                    component={Link}
                                                    href={route('juri.submissions.view', score.submission_id)}
                                                    variant={isScored ? 'outlined' : 'contained'}
                                                    size="small"
                                                    endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                                                    sx={{
                                                        textTransform: 'none', fontWeight: 700,
                                                        borderRadius: '8px', px: 2, py: 0.75,
                                                        fontSize: '0.75rem',
                                                        fontFamily: fontDoc,
                                                        ...(isScored ? {
                                                            borderColor: bdr, color: c.textPrimary,
                                                            '&:hover': { borderColor: COLOR_THEME.primaryLight, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' },
                                                        } : {
                                                            background: `linear-gradient(135deg, ${COLOR_THEME.primary} 0%, ${COLOR_THEME.primaryLight} 100%)`,
                                                            color: '#fff',
                                                            '&:hover': { background: `linear-gradient(135deg, ${COLOR_THEME.primaryLight} 0%, ${COLOR_THEME.primary} 100%)` },
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
