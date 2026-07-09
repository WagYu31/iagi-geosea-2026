import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Button, TextField,
    InputAdornment, Stack, useTheme, ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
        if (score >= 9.0) return { label: 'Outstanding', color: '#16a34a' };
        if (score >= 8.0) return { label: 'Excellent', color: '#059669' };
        if (score >= 7.0) return { label: 'Very Good', color: '#2563eb' };
        if (score >= 6.0) return { label: 'Good', color: '#7c3aed' };
        if (score >= 5.0) return { label: 'Fair', color: '#d97706' };
        return { label: 'Needs Improvement', color: '#dc2626' };
    };

    return (
        <SidebarLayout>
            <Head title="Assigned Presentations" />

            <Box sx={{ p: { xs: 2, sm: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{
                        fontWeight: 800, color: c.textPrimary,
                        fontSize: { xs: '1.5rem', sm: '1.85rem' },
                        letterSpacing: '-0.02em',
                    }}>
                        Assigned Presentations ⚖️
                    </Typography>
                    <Typography variant="body2" sx={{ color: c.textSecondary, mt: 0.5 }}>
                        Score presentations assigned to you
                    </Typography>
                </Box>

                {/* Search & Filter — mobile-friendly */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2, mb: 3,
                }}>
                    <TextField
                        placeholder="Search by title or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="small"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: c.textSecondary }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                bgcolor: c.cardBg,
                            },
                            maxWidth: { sm: 400 },
                        }}
                    />
                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={(e, val) => val && setFilter(val)}
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                textTransform: 'none', fontWeight: 600,
                                borderRadius: '10px !important', px: 2,
                                fontSize: '0.8rem',
                            },
                        }}
                    >
                        <ToggleButton value="all">All ({counts.all})</ToggleButton>
                        <ToggleButton value="pending">Pending ({counts.pending})</ToggleButton>
                        <ToggleButton value="scored">Scored ({counts.scored})</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Submission Cards — card-based for mobile */}
                {filteredScores.length === 0 ? (
                    <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg }}>
                        <CardContent sx={{ textAlign: 'center', py: 6 }}>
                            <GavelIcon sx={{ fontSize: 56, opacity: 0.3, color: c.textSecondary, mb: 1.5 }} />
                            <Typography variant="h6" sx={{ color: c.textSecondary, fontWeight: 600 }}>
                                No presentations found
                            </Typography>
                            <Typography variant="body2" sx={{ color: c.textSecondary, mt: 0.5 }}>
                                {search ? 'Try adjusting your search' : 'No presentations have been assigned yet'}
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Stack spacing={2}>
                        {filteredScores.map((score) => {
                            const isScored = !!score.weighted_final_score;
                            const interp = isScored ? getInterpretation(parseFloat(score.weighted_final_score)) : null;

                            return (
                                <Card
                                    key={score.id}
                                    elevation={0}
                                    sx={{
                                        borderRadius: '16px',
                                        border: `1px solid ${c.cardBorder}`,
                                        bgcolor: c.cardBg,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: '#d97706',
                                            boxShadow: '0 4px 16px rgba(217, 119, 6, 0.1)',
                                            transform: { sm: 'translateY(-2px)' },
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            justifyContent: 'space-between',
                                            gap: 2,
                                        }}>
                                            {/* Left: Info */}
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="body1" sx={{
                                                    fontWeight: 700, color: c.textPrimary,
                                                    fontSize: '0.95rem',
                                                    overflow: 'hidden', textOverflow: 'ellipsis',
                                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                }}>
                                                    {score.submission?.title || 'Untitled'}
                                                </Typography>

                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <PersonIcon sx={{ fontSize: 14, color: c.textSecondary }} />
                                                        <Typography variant="caption" sx={{ color: c.textSecondary }}>
                                                            {score.submission?.user?.name || 'Unknown'}
                                                        </Typography>
                                                    </Stack>
                                                    <Chip
                                                        label={score.rubric_type?.toUpperCase() || 'N/A'}
                                                        size="small"
                                                        sx={{
                                                            height: 22, fontSize: '0.65rem', fontWeight: 700,
                                                            bgcolor: score.rubric_type === 'oral'
                                                                ? (isDark ? 'rgba(37, 99, 235, 0.12)' : '#eff6ff')
                                                                : (isDark ? 'rgba(147, 51, 234, 0.12)' : '#faf5ff'),
                                                            color: score.rubric_type === 'oral' ? '#2563eb' : '#9333ea',
                                                        }}
                                                    />
                                                    <Chip
                                                        label={isScored ? 'Scored' : 'Pending'}
                                                        size="small"
                                                        sx={{
                                                            height: 22, fontSize: '0.65rem', fontWeight: 700,
                                                            bgcolor: isScored
                                                                ? (isDark ? 'rgba(22, 163, 74, 0.12)' : '#dcfce7')
                                                                : (isDark ? 'rgba(234, 88, 12, 0.12)' : '#fff7ed'),
                                                            color: isScored ? '#16a34a' : '#ea580c',
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>

                                            {/* Right: Score + Action */}
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: { xs: 'row', sm: 'column' },
                                                alignItems: { xs: 'center', sm: 'flex-end' },
                                                justifyContent: { xs: 'space-between', sm: 'center' },
                                                gap: 1,
                                                width: { xs: '100%', sm: 'auto' },
                                            }}>
                                                {isScored && (
                                                    <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                                        <Typography variant="h5" sx={{
                                                            fontWeight: 800, color: interp.color,
                                                            fontSize: '1.3rem', lineHeight: 1,
                                                        }}>
                                                            {score.weighted_final_score}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: interp.color, fontWeight: 600 }}>
                                                            {interp.label}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                <Button
                                                    component={Link}
                                                    href={route('juri.submissions.view', score.submission_id)}
                                                    variant={isScored ? 'outlined' : 'contained'}
                                                    size="small"
                                                    endIcon={<ArrowForwardIcon />}
                                                    sx={{
                                                        textTransform: 'none', fontWeight: 600,
                                                        borderRadius: '10px', px: 2,
                                                        ...(isScored ? {
                                                            borderColor: '#d97706', color: '#d97706',
                                                            '&:hover': { borderColor: '#b45309', bgcolor: 'rgba(217,119,6,0.04)' },
                                                        } : {
                                                            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                                                            '&:hover': { background: 'linear-gradient(135deg, #b45309, #d97706)' },
                                                        }),
                                                        width: { xs: isScored ? 'auto' : '100%', sm: 'auto' },
                                                    }}
                                                >
                                                    {isScored ? 'Edit' : 'Score Now'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Stack>
                )}
            </Box>
        </SidebarLayout>
    );
}
