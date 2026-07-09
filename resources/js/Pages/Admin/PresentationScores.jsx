import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Stack, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    ToggleButtonGroup, ToggleButton, TextField, InputAdornment,
    Collapse, IconButton, Avatar, Button, Grid, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GavelIcon from '@mui/icons-material/Gavel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const COLOR_THEME = {
    primary: '#1b2a4a',
    primaryLight: '#2d4373',
    oral: '#1d4ed8',
    poster: '#7c3aed',
    exceptional: '#047857',
    good: '#1e40af',
    acceptable: '#b45309',
    belowStd: '#c2410c',
    unsatisfactory: '#b91c1c',
    border: '#d1d5db',
    borderDark: 'rgba(255,255,255,0.08)',
};

function getInterpretation(score) {
    if (score >= 9.0) return { label: 'Exceptional', color: COLOR_THEME.exceptional };
    if (score >= 7.0) return { label: 'Good', color: COLOR_THEME.good };
    if (score >= 5.0) return { label: 'Acceptable', color: COLOR_THEME.acceptable };
    if (score >= 3.0) return { label: 'Below Standard', color: COLOR_THEME.belowStd };
    return { label: 'Unsatisfactory', color: COLOR_THEME.unsatisfactory };
}

// Helper to render criterion breakdown inside expanded rows
function CriterionBreakdown({ score, isOral, isDark, bdr }) {
    const oralCriteria = [
        { label: 'Time Management', key: 'time_management', weight: '5%' },
        { label: 'Posture & Professionalism', key: 'posture_professionalism', weight: '10%' },
        { label: 'Communication Skills', key: 'communication_skills', weight: '15%' },
        { label: 'Scientific Substantiation', key: 'scientific_substantiation', weight: '15%' },
        { label: 'Technical Contribution', key: 'technical_contribution', weight: '10%' },
        { label: 'Logical Organization', key: 'logical_organization', weight: '10%' },
        { label: 'Visual Quality', key: 'visual_quality', weight: '5%' },
        { label: 'Originality & Innovation', key: 'originality_innovation', weight: '10%' },
        { label: 'Manuscript Substantiation', key: 'manuscript_substantiation', weight: '10%' },
        { label: 'Manuscript Writing', key: 'manuscript_writing', weight: '10%' },
    ];

    const posterCriteria = [
        { label: 'Scientific Substantiation', key: 'poster_scientific_substantiation', weight: '15%' },
        { label: 'Practical Usefulness', key: 'practical_usefulness', weight: '10%' },
        { label: 'Technical Contribution', key: 'poster_technical_contribution', weight: '10%' },
        { label: 'Organization & Visual Design', key: 'poster_organization_design', weight: '10%' },
        { label: 'Originality & Authenticity', key: 'poster_originality', weight: '10%' },
        { label: 'Presentation & Explanation', key: 'presentation_explanation', weight: '10%' },
        { label: 'Subject Knowledge', key: 'subject_knowledge', weight: '15%' },
        { label: 'Manuscript Substantiation', key: 'manuscript_substantiation', weight: '10%' },
        { label: 'Manuscript Writing', key: 'manuscript_writing', weight: '10%' },
    ];

    const list = isOral ? oralCriteria : posterCriteria;

    return (
        <Box sx={{
            mt: 1.5, p: 2, borderRadius: '8px',
            bgcolor: isDark ? 'rgba(255,255,255,0.015)' : '#ffffff',
            border: `1px solid ${bdr}`,
        }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: COLOR_THEME.primaryLight, display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Criterion Score Breakdown
            </Typography>
            <Grid container spacing={1.5}>
                {list.map(c => {
                    const val = score[c.key];
                    return (
                        <Grid item xs={6} sm={4} md={3} key={c.key}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 0.75, borderBottom: `1px solid ${bdr}` }}>
                                <Typography sx={{ fontSize: '0.72rem', color: isDark ? '#94a3b8' : '#475569', pr: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    {c.label} ({c.weight})
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: val ? COLOR_THEME.primaryLight : '#94a3b8' }}>
                                    {val || '—'}
                                </Typography>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>
            {score.juri_notes && (
                <Box sx={{ mt: 1.5, pt: 1, borderTop: `1px dashed ${bdr}` }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: COLOR_THEME.primaryLight, display: 'block', mb: 0.25 }}>
                        Juri Notes:
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', fontStyle: 'italic', color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.4 }}>
                        "{score.juri_notes}"
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

function JuriScoreRow({ score, isOral, isDark, bdr }) {
    const [showDetail, setShowDetail] = useState(false);
    const hasScored = !!score.weighted_final_score;

    return (
        <Box sx={{
            p: 1.5, borderRadius: '8px',
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            border: `1px solid ${bdr}`,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: '#d9770620', color: '#d97706', fontWeight: 700 }}>
                        {score.juri?.name?.[0] || 'J'}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1b2a4a' }}>
                            {score.juri?.name || 'Unknown Juri'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {score.juri?.email || ''}
                        </Typography>
                    </Box>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                        {hasScored ? (
                            <>
                                <Typography variant="body2" sx={{
                                    fontWeight: 800,
                                    color: getInterpretation(parseFloat(score.weighted_final_score)).color,
                                }}>
                                    {parseFloat(score.weighted_final_score).toFixed(2)}
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
                                color: '#ea580c', fontWeight: 700, height: 20, fontSize: '0.62rem',
                            }} />
                        )}
                    </Box>
                    {hasScored && (
                        <Button
                            size="small"
                            onClick={() => setShowDetail(!showDetail)}
                            sx={{ textTransform: 'none', fontSize: '0.68rem', fontWeight: 700 }}
                        >
                            {showDetail ? 'Hide Details' : 'View Breakdown'}
                        </Button>
                    )}
                </Box>
            </Box>
            <Collapse in={showDetail && hasScored} timeout="auto" unmountOnExit>
                <CriterionBreakdown score={score} isOral={isOral} isDark={isDark} bdr={bdr} />
            </Collapse>
        </Box>
    );
}

function SubmissionRow({ submission, isDark, c, bdr }) {
    const [open, setOpen] = useState(false);
    const scores = submission.presentation_scores || [];
    const scoredScores = scores.filter(s => s.weighted_final_score);
    const avgScore = scoredScores.length > 0
        ? (scoredScores.reduce((sum, s) => sum + parseFloat(s.weighted_final_score), 0) / scoredScores.length).toFixed(2)
        : null;
    const interp = avgScore ? getInterpretation(parseFloat(avgScore)) : null;
    const isOral = submission.category_submission?.includes('Oral');

    return (
        <>
            <TableRow sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.015)' : '#f8fafc' }, transition: 'background 0.2s ease' }}>
                <TableCell sx={{ width: 48, borderBottom: `1px solid ${bdr}` }}>
                    <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: COLOR_THEME.primaryLight }}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: c.textPrimary, maxWidth: 300, borderBottom: `1px solid ${bdr}` }}>
                    <Typography sx={{
                        fontWeight: 700, fontSize: '0.85rem', color: '#1b2a4a',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                        {submission.title}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.72rem', mt: 0.25 }}>
                        {submission.user?.name || 'Unknown'}
                    </Typography>
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: `1px solid ${bdr}` }}>
                    <Chip
                        label={isOral ? 'ORAL' : 'POSTER'}
                        size="small"
                        sx={{
                            fontWeight: 800, fontSize: '0.62rem',
                            bgcolor: isOral ? 'rgba(29,78,216,0.08)' : 'rgba(124,58,237,0.08)',
                            color: isOral ? COLOR_THEME.oral : COLOR_THEME.poster,
                            borderRadius: '4px',
                        }}
                    />
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: `1px solid ${bdr}` }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#1b2a4a' }}>
                        {scoredScores.length} / {scores.length}
                    </Typography>
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: `1px solid ${bdr}` }}>
                    {avgScore ? (
                        <Box>
                            <Typography sx={{ fontWeight: 800, color: interp.color, fontSize: '1rem', lineHeight: 1.1 }}>
                                {avgScore}
                            </Typography>
                            <Typography sx={{ color: interp.color, fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                {interp.label}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</Typography>
                    )}
                </TableCell>
            </TableRow>

            {/* Expanded: per-juri scores list */}
            <TableRow sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.005)' : '#fafbfc' }}>
                <TableCell sx={{ py: 0, borderBottom: open ? `1px solid ${bdr}` : 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2.5, px: { xs: 1, sm: 3 } }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', mb: 1.5, color: '#1b2a4a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Juri Scoring Details
                            </Typography>
                            {scores.length === 0 ? (
                                <Typography sx={{ color: '#64748b', fontSize: '0.78rem' }}>
                                    No juris assigned to this submission yet.
                                </Typography>
                            ) : (
                                <Stack spacing={1.5}>
                                    {scores.map(score => (
                                        <JuriScoreRow key={score.id} score={score} isOral={isOral} isDark={isDark} bdr={bdr} />
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

    const bdr = isDark ? COLOR_THEME.borderDark : COLOR_THEME.border;
    const fontDoc = '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif';

    // ── Excel/CSV export function ──
    const exportToCSV = () => {
        const headers = [
            'ID',
            'Paper Title',
            'Presenter Name',
            'Submission Type',
            'Assigned Juris',
            'Completed Evaluations',
            'Average Final Score',
            'Grade Label',
            'Juri Breakdown (Name | Score | Notes)'
        ];

        const rows = filteredSubmissions.map(sub => {
            const scores = sub.presentation_scores || [];
            const scored = scores.filter(s => s.weighted_final_score);
            const total = scored.reduce((sum, s) => sum + parseFloat(s.weighted_final_score), 0);
            const avg = scored.length > 0 ? (total / scored.length).toFixed(2) : '—';
            const grade = scored.length > 0 ? getInterpretation(parseFloat(avg)).label : '—';

            // Compile a detail breakdown text for the cell
            const detailStr = scores.map(s => {
                const finalS = s.weighted_final_score ? parseFloat(s.weighted_final_score).toFixed(2) : 'Pending';
                const notes = s.juri_notes ? ` - Notes: "${s.juri_notes.replace(/"/g, '""')}"` : '';
                return `[${s.juri?.name || 'Juri'}: ${finalS}${notes}]`;
            }).join('; ');

            return [
                sub.id,
                `"${(sub.title || '').replace(/"/g, '""')}"`,
                `"${(sub.user?.name || 'Unknown').replace(/"/g, '""')}"`,
                sub.category_submission?.includes('Oral') ? 'Oral' : 'Poster',
                scores.length,
                scored.length,
                avg,
                grade,
                `"${detailStr}"`
            ].join(',');
        });

        const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `presentation_evaluation_scores_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Calculate quick stats
    const totalAssignments = allSubmissions.reduce((sum, s) => sum + (s.presentation_scores?.length || 0), 0);
    const completedAssignments = allSubmissions.reduce((sum, s) => sum + (s.presentation_scores?.filter(ps => ps.weighted_final_score)?.length || 0), 0);
    const pendingAssignments = totalAssignments - completedAssignments;

    return (
        <SidebarLayout>
            <Head title="Presentation Scores — Admin" />

            <Box sx={{ p: { xs: 2, sm: 3.5 }, minHeight: '100vh', bgcolor: isDark ? c.surfaceBg : '#f1f5f9', fontFamily: fontDoc }}>
                
                {/* ═══ Header Section ═══ */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 3.5, gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{
                            fontWeight: 800, color: c.textPrimary,
                            fontSize: { xs: '1.4rem', sm: '1.75rem' },
                            letterSpacing: '-0.02em', fontFamily: fontDoc,
                        }}>
                            Presentation Scores ⚖️
                        </Typography>
                        <Typography variant="body2" sx={{ color: c.textSecondary, mt: 0.5, fontFamily: fontDoc }}>
                            View and manage jury presentation scores, criterion breakdown, and feedback
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={exportToCSV}
                        sx={{
                            borderColor: bdr, color: COLOR_THEME.primaryLight,
                            textTransform: 'none', fontWeight: 700, borderRadius: '8px',
                            fontFamily: fontDoc, px: 2.5, py: 1,
                            bgcolor: c.cardBg,
                            '&:hover': { borderColor: COLOR_THEME.primary, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' },
                        }}
                    >
                        Export Scores CSV
                    </Button>
                </Box>

                {/* ═══ Analytics Summary Cards ═══ */}
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    {[
                        { label: 'Assigned Submissions', val: allSubmissions.length, icon: <AssignmentIcon />, color: COLOR_THEME.primaryLight, bg: isDark ? 'rgba(45,67,115,0.12)' : '#eff6ff' },
                        { label: 'Completed Evaluations', val: completedAssignments, icon: <AssignmentTurnedInIcon />, color: COLOR_THEME.exceptional, bg: isDark ? 'rgba(4,120,87,0.12)' : '#ecfdf5' },
                        { label: 'Pending Evaluations', val: pendingAssignments, icon: <PendingActionsIcon />, color: '#d97706', bg: isDark ? 'rgba(217,119,6,0.12)' : '#fffbeb' },
                    ].map((stat, i) => (
                        <Grid item xs={12} sm={4} key={i}>
                            <Card elevation={0} sx={{ border: `1px solid ${bdr}`, borderRadius: '12px', bgcolor: c.cardBg }}>
                                <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ width: 42, height: 42, borderRadius: '10px', bgcolor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {stat.icon}
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: fontDoc }}>
                                            {stat.label}
                                        </Typography>
                                        <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: c.textPrimary, fontFamily: fontDoc, lineHeight: 1.2 }}>
                                            {stat.val}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ═══ Search & Filters ═══ */}
                <Box sx={{
                    display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2, mb: 3.5,
                }}>
                    <TextField
                        placeholder="Search by title or presenter..."
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
                            '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: c.cardBg, '& fieldset': { borderColor: bdr } },
                            maxWidth: { sm: 350 },
                            width: '100%',
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
                            '& .MuiToggleButton-root': {
                                textTransform: 'none', fontWeight: 700,
                                borderRadius: '7px !important', px: 2.5,
                                fontSize: '0.78rem', fontFamily: fontDoc,
                                color: c.textSecondary, border: 'none',
                                '&.Mui-selected': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9', color: COLOR_THEME.primaryLight },
                            }
                        }}
                    >
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="oral">Oral</ToggleButton>
                        <ToggleButton value="poster">Poster</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* ═══ Scores Table ═══ */}
                <Card elevation={0} sx={{ borderRadius: '12px', border: `1px solid ${bdr}`, bgcolor: c.cardBg, overflow: 'hidden' }}>
                    {filteredSubmissions.length === 0 ? (
                        <CardContent sx={{ textAlign: 'center', py: 8 }}>
                            <GavelIcon sx={{ fontSize: 48, opacity: 0.25, color: c.textSecondary, mb: 1.5 }} />
                            <Typography sx={{ color: c.textSecondary, fontWeight: 700, fontFamily: fontDoc }}>
                                No presentation scores found
                            </Typography>
                        </CardContent>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }}>
                                    <TableRow>
                                        <TableCell sx={{ width: 50, borderBottom: `1px solid ${bdr}` }} />
                                        <TableCell sx={{ fontWeight: 700, color: '#1b2a4a', fontFamily: fontDoc, borderBottom: `1px solid ${bdr}` }}>Submission</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#1b2a4a', fontFamily: fontDoc, borderBottom: `1px solid ${bdr}` }}>Type</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#1b2a4a', fontFamily: fontDoc, borderBottom: `1px solid ${bdr}` }}>Evaluations</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#1b2a4a', fontFamily: fontDoc, borderBottom: `1px solid ${bdr}` }}>Avg Score</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSubmissions.map(sub => (
                                        <SubmissionRow key={sub.id} submission={sub} isDark={isDark} c={c} bdr={bdr} />
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
