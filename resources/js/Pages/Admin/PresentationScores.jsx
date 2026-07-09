import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Stack, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    ToggleButtonGroup, ToggleButton, TextField, InputAdornment,
    Collapse, IconButton, Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GavelIcon from '@mui/icons-material/Gavel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonIcon from '@mui/icons-material/Person';

function getInterpretation(score) {
    if (score >= 9.0) return { label: 'Outstanding', color: '#16a34a' };
    if (score >= 8.0) return { label: 'Excellent', color: '#059669' };
    if (score >= 7.0) return { label: 'Very Good', color: '#2563eb' };
    if (score >= 6.0) return { label: 'Good', color: '#7c3aed' };
    if (score >= 5.0) return { label: 'Fair', color: '#d97706' };
    return { label: 'Needs Improvement', color: '#dc2626' };
}

function SubmissionRow({ submission, isDark, c }) {
    const [open, setOpen] = useState(false);
    const scores = submission.presentation_scores || [];
    const scoredScores = scores.filter(s => s.weighted_final_score);
    const avgScore = scoredScores.length > 0
        ? (scoredScores.reduce((sum, s) => sum + parseFloat(s.weighted_final_score), 0) / scoredScores.length).toFixed(2)
        : null;
    const interp = avgScore ? getInterpretation(parseFloat(avgScore)) : null;

    return (
        <>
            <TableRow sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' } }}>
                <TableCell sx={{ width: 48 }}>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: c.textPrimary, maxWidth: 300 }}>
                    <Typography variant="body2" sx={{
                        fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                        {submission.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: c.textSecondary }}>
                        {submission.user?.name || 'Unknown'}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Chip
                        label={submission.category_submission?.includes('Oral') ? 'ORAL' : 'POSTER'}
                        size="small"
                        sx={{
                            fontWeight: 700, fontSize: '0.65rem',
                            bgcolor: submission.category_submission?.includes('Oral')
                                ? (isDark ? 'rgba(37,99,235,0.12)' : '#eff6ff')
                                : (isDark ? 'rgba(147,51,234,0.12)' : '#faf5ff'),
                            color: submission.category_submission?.includes('Oral') ? '#2563eb' : '#9333ea',
                        }}
                    />
                </TableCell>
                <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {scoredScores.length} / {scores.length}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    {avgScore ? (
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 800, color: interp.color }}>
                                {avgScore}
                            </Typography>
                            <Typography variant="caption" sx={{ color: interp.color, fontWeight: 600 }}>
                                {interp.label}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body2" sx={{ color: c.textSecondary }}>—</Typography>
                    )}
                </TableCell>
            </TableRow>

            {/* Expanded: per-juri scores */}
            <TableRow>
                <TableCell sx={{ py: 0, border: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2, px: { xs: 0, sm: 2 } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: c.textPrimary }}>
                                Scores by Juri
                            </Typography>
                            {scores.length === 0 ? (
                                <Typography variant="body2" sx={{ color: c.textSecondary }}>
                                    No juris assigned yet
                                </Typography>
                            ) : (
                                <Stack spacing={1}>
                                    {scores.map(score => (
                                        <Box key={score.id} sx={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            p: 1.5, borderRadius: '10px',
                                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                            border: `1px solid ${c.cardBorder}`,
                                        }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: '#d9770620', color: '#d97706' }}>
                                                    {score.juri?.name?.[0] || 'J'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary }}>
                                                        {score.juri?.name || 'Unknown Juri'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: c.textSecondary }}>
                                                        {score.rubric_type?.toUpperCase() || ''}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            <Box sx={{ textAlign: 'right' }}>
                                                {score.weighted_final_score ? (
                                                    <>
                                                        <Typography variant="body2" sx={{
                                                            fontWeight: 800,
                                                            color: getInterpretation(parseFloat(score.weighted_final_score)).color,
                                                        }}>
                                                            {score.weighted_final_score}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{
                                                            color: getInterpretation(parseFloat(score.weighted_final_score)).color,
                                                            fontWeight: 600,
                                                        }}>
                                                            {getInterpretation(parseFloat(score.weighted_final_score)).label}
                                                        </Typography>
                                                    </>
                                                ) : (
                                                    <Chip label="Pending" size="small" sx={{
                                                        bgcolor: isDark ? 'rgba(234,88,12,0.12)' : '#fff7ed',
                                                        color: '#ea580c', fontWeight: 600, height: 22,
                                                    }} />
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function PresentationScores({ submissions }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const allSubmissions = submissions?.data || [];

    const filteredSubmissions = allSubmissions.filter(sub => {
        const title = sub.title?.toLowerCase() || '';
        const author = sub.user?.name?.toLowerCase() || '';
        const matchesSearch = title.includes(search.toLowerCase()) || author.includes(search.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'oral') return matchesSearch && sub.category_submission?.toLowerCase().includes('oral');
        if (filter === 'poster') return matchesSearch && !sub.category_submission?.toLowerCase().includes('oral');
        return matchesSearch;
    });

    return (
        <SidebarLayout>
            <Head title="Presentation Scores" />

            <Box sx={{ p: { xs: 2, sm: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{
                        fontWeight: 800, color: c.textPrimary,
                        fontSize: { xs: '1.5rem', sm: '1.85rem' },
                        letterSpacing: '-0.02em',
                    }}>
                        Presentation Scores ⚖️
                    </Typography>
                    <Typography variant="body2" sx={{ color: c.textSecondary, mt: 0.5 }}>
                        View and manage presentation scoring by Juris
                    </Typography>
                </Box>

                {/* Search & Filter */}
                <Box sx={{
                    display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2, mb: 3,
                }}>
                    <TextField
                        placeholder="Search by title or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: c.textSecondary }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: c.cardBg },
                            maxWidth: { sm: 350 },
                            width: '100%',
                        }}
                    />
                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={(e, val) => val && setFilter(val)}
                        size="small"
                        sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 600, borderRadius: '10px !important', px: 2, fontSize: '0.8rem' } }}
                    >
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="oral">Oral</ToggleButton>
                        <ToggleButton value="poster">Poster</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Table */}
                <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg }}>
                    {filteredSubmissions.length === 0 ? (
                        <CardContent sx={{ textAlign: 'center', py: 6 }}>
                            <GavelIcon sx={{ fontSize: 56, opacity: 0.3, color: c.textSecondary, mb: 1.5 }} />
                            <Typography variant="h6" sx={{ color: c.textSecondary, fontWeight: 600 }}>
                                No presentation scores found
                            </Typography>
                        </CardContent>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                                        <TableCell sx={{ width: 48 }} />
                                        <TableCell sx={{ fontWeight: 700, color: c.textPrimary }}>Submission</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: c.textPrimary }}>Type</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: c.textPrimary }}>Scored</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: c.textPrimary }}>Avg Score</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSubmissions.map(sub => (
                                        <SubmissionRow key={sub.id} submission={sub} isDark={isDark} c={c} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>
            </Box>
        </SidebarLayout>
    );
}
