import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Stack, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Collapse, IconButton, Avatar, Button, Grid, Divider,
    Paper, Tooltip, LinearProgress
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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarIcon from '@mui/icons-material/Star';

// Curated 21st.dev avatar gradients
const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #094d42 0%, #0d9488 100%)', // Emerald Teal
    'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', // Deep Blue
    'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)', // Purple Violet
    'linear-gradient(135deg, #831843 0%, #db2777 100%)', // Rose Pink
    'linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)', // Teal Cyan
    'linear-gradient(135deg, #78350f 0%, #d97706 100%)', // Amber Bronze
    'linear-gradient(135deg, #0f172a 0%, #334155 100%)', // Slate Navy
    'linear-gradient(135deg, #065f46 0%, #10b981 100%)', // Mint Green
];

const getAvatarGradient = (str = '') => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
};

function getInterpretation(score) {
    if (score >= 9.0) return { label: 'Exceptional', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
    if (score >= 7.0) return { label: 'Good', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' };
    if (score >= 5.0) return { label: 'Acceptable', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    if (score >= 3.0) return { label: 'Below Standard', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' };
    return { label: 'Unsatisfactory', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
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
            mt: 2, 
            p: 2.2, 
            borderRadius: '12px',
            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
            border: `1px solid ${bdr}`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, pb: 1, borderBottom: `1px solid ${bdr}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 16, color: '#0d9488' }} />
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Rincian Skor Rubrik Penilaian ({isOral ? 'Oral Presentation' : 'Poster Presentation'})
                    </Typography>
                </Box>
                <Chip 
                    label={isOral ? '10 Parameter Penilaian' : '9 Parameter Penilaian'} 
                    size="small" 
                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#f1f5f9', color: '#475569' }} 
                />
            </Box>

            <Grid container spacing={1.5}>
                {list.map(c => {
                    const val = score[c.key];
                    const numVal = parseFloat(val) || 0;
                    return (
                        <Grid item xs={12} sm={6} md={4} key={c.key}>
                            <Box sx={{ 
                                p: 1.2, 
                                borderRadius: '10px', 
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', 
                                border: '1px solid',
                                borderColor: val ? '#e2e8f0' : '#f1f5f9'
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                                    <Typography sx={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', pr: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {c.label}
                                    </Typography>
                                    <Chip 
                                        label={c.weight} 
                                        size="small" 
                                        sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#e2e8f0', color: '#475569', borderRadius: '4px' }} 
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={val ? Math.min(100, (numVal / 10) * 100) : 0} 
                                        sx={{ 
                                            flex: 1, 
                                            height: 5, 
                                            borderRadius: 2, 
                                            bgcolor: '#e2e8f0',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: numVal >= 8 ? '#10b981' : numVal >= 6 ? '#3b82f6' : '#f59e0b',
                                                borderRadius: 2
                                            }
                                        }} 
                                    />
                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 900, color: val ? '#0f172a' : '#94a3b8', fontFamily: 'monospace', minWidth: 28, textAlign: 'right' }}>
                                        {val ? numVal.toFixed(1) : '—'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>

            {score.juri_notes && (
                <Box sx={{ 
                    mt: 2, 
                    p: 1.5, 
                    borderRadius: '10px', 
                    bgcolor: isDark ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb', 
                    border: '1px solid #fde68a',
                    display: 'flex',
                    gap: 1.2,
                    alignItems: 'flex-start'
                }}>
                    <FormatQuoteIcon sx={{ color: '#d97706', fontSize: 24, mt: -0.3, flexShrink: 0 }} />
                    <Box>
                        <Typography sx={{ fontWeight: 800, color: '#92400e', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.2 }}>
                            Catatan & Masukan Juri:
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', fontStyle: 'italic', color: '#78350f', lineHeight: 1.45 }}>
                            "{score.juri_notes}"
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

function JuriScoreCard({ score, isOral, isDark, bdr }) {
    const [showDetail, setShowDetail] = useState(false);
    const hasScored = !!score.weighted_final_score;
    const finalScore = hasScored ? parseFloat(score.weighted_final_score).toFixed(2) : null;
    const interp = hasScored ? getInterpretation(parseFloat(finalScore)) : null;
    const avatarGrad = getAvatarGradient(score.juri?.name || 'Juri');

    return (
        <Paper elevation={0} sx={{
            p: 2, 
            borderRadius: '14px',
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
            border: `1px solid ${score.is_nominated_best ? '#f59e0b' : bdr}`,
            boxShadow: score.is_nominated_best ? '0 4px 14px rgba(245, 158, 11, 0.15)' : '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease',
            '&:hover': { boxShadow: '0 6px 16px rgba(0,0,0,0.05)' }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ 
                        width: 40, 
                        height: 40, 
                        fontSize: '0.90rem', 
                        background: avatarGrad, 
                        color: '#ffffff', 
                        fontWeight: 800,
                        border: '1.5px solid #ffffff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}>
                        {(score.juri?.name || 'J').charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                                {score.juri?.name || 'Juri Panelis'}
                            </Typography>
                            <Chip 
                                label="Juri Evaluator" 
                                size="small" 
                                sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, bgcolor: '#f1f5f9', color: '#64748b' }} 
                            />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem', fontFamily: 'monospace' }}>
                            {score.juri?.email || '—'}
                        </Typography>
                    </Box>
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {score.is_nominated_best && (
                        <Chip
                            icon={<EmojiEventsIcon sx={{ fontSize: '14px !important', color: '#b45309 !important' }} />}
                            label={score.nomination_category || 'Nominasi Juara'}
                            size="small"
                            sx={{
                                height: 26,
                                fontSize: '0.70rem',
                                fontWeight: 900,
                                bgcolor: '#fef3c7',
                                color: '#b45309',
                                border: '1px solid #f59e0b',
                                boxShadow: '0 2px 6px rgba(245, 158, 11, 0.2)'
                            }}
                        />
                    )}

                    <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                        {hasScored ? (
                            <Box sx={{ 
                                px: 1.5, 
                                py: 0.5, 
                                borderRadius: '10px', 
                                bgcolor: interp.bg, 
                                border: `1px solid ${interp.border}`,
                                display: 'inline-block'
                            }}>
                                <Typography sx={{
                                    fontWeight: 900,
                                    fontSize: '1.05rem',
                                    color: interp.color,
                                    lineHeight: 1,
                                    fontFamily: 'monospace'
                                }}>
                                    {finalScore}
                                </Typography>
                                <Typography sx={{
                                    color: interp.color,
                                    fontWeight: 800,
                                    fontSize: '0.62rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em'
                                }}>
                                    {interp.label}
                                </Typography>
                            </Box>
                        ) : score.is_draft ? (
                            <Chip 
                                label="Draft (Disimpan)" 
                                size="small" 
                                sx={{
                                    bgcolor: '#fffbeb',
                                    color: '#d97706', 
                                    fontWeight: 800, 
                                    height: 24, 
                                    fontSize: '0.70rem',
                                    border: '1px solid #fde68a',
                                }} 
                            />
                        ) : (
                            <Chip 
                                label="⏳ Belum Dinilai" 
                                size="small" 
                                sx={{
                                    bgcolor: '#f1f5f9',
                                    color: '#64748b', 
                                    fontWeight: 800, 
                                    height: 24, 
                                    fontSize: '0.70rem',
                                    border: '1px solid #e2e8f0',
                                }} 
                            />
                        )}
                    </Box>

                    {hasScored && (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setShowDetail(!showDetail)}
                            sx={{ 
                                textTransform: 'none', 
                                fontSize: '0.72rem', 
                                fontWeight: 800,
                                borderRadius: '8px',
                                px: 1.5,
                                borderColor: '#cbd5e1',
                                color: '#334155',
                                bgcolor: showDetail ? '#f1f5f9' : '#ffffff',
                                '&:hover': { bgcolor: '#f8fafc', borderColor: '#0d9488', color: '#094d42' }
                            }}
                        >
                            {showDetail ? 'Tutup Rubrik ▴' : 'Lihat Rubrik ▾'}
                        </Button>
                    )}
                </Box>
            </Box>

            <Collapse in={showDetail && hasScored} timeout="auto" unmountOnExit>
                <CriterionBreakdown score={score} isOral={isOral} isDark={isDark} bdr={bdr} />
            </Collapse>
        </Paper>
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
    const hasNomination = scores.some(s => s.is_nominated_best);
    const nominationCategory = scores.find(s => s.is_nominated_best)?.nomination_category || 'Kandidat Juara';
    const isOral = submission.category_submission?.toLowerCase().includes('oral');

    // Presenter details
    const presenterName = submission.author_full_name || submission.user?.name || 'Author';
    const presenterEmail = submission.corresponding_author_email || submission.user?.email || '—';
    const presenterAffiliation = submission.affiliation || submission.institute_organization || submission.user?.affiliation || '';
    const presenterAvatarGrad = getAvatarGradient(presenterName);

    const isFullyEvaluated = scores.length > 0 && scoredScores.length === scores.length;
    const isPartiallyEvaluated = scoredScores.length > 0 && scoredScores.length < scores.length;

    const cellSx = { 
        borderBottom: `1px solid ${bdr}`, 
        py: 1.8, 
        px: 2, 
        fontSize: '0.825rem', 
        color: c.textPrimary,
        verticalAlign: 'middle'
    };

    return (
        <>
            <TableRow sx={{ 
                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }, 
                transition: 'background 0.15s ease',
                bgcolor: open ? (isDark ? 'rgba(13, 148, 136, 0.05)' : '#f0fdf4') : 'inherit'
            }}>
                {/* TOGGLE EXPAND BUTTON */}
                <TableCell sx={{ width: 48, ...cellSx, textAlign: 'center', pr: 0 }}>
                    <IconButton 
                        size="small" 
                        onClick={() => setOpen(!open)} 
                        sx={{ 
                            color: open ? '#094d42' : '#64748b',
                            bgcolor: open ? '#dcfce7' : 'transparent',
                            '&:hover': { bgcolor: '#e2e8f0' }
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>

                {/* PAPER & PRESENTER INFORMATION */}
                <TableCell sx={{ ...cellSx, minWidth: 320, maxWidth: 440 }}>
                    <Box>
                        {/* Topic / Sub-theme / Submission Code Tag */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.6, flexWrap: 'wrap' }}>
                            {submission.submission_code && (
                                <Chip 
                                    label={submission.submission_code} 
                                    size="small" 
                                    sx={{ 
                                        height: 20, 
                                        fontSize: '0.65rem', 
                                        fontWeight: 800, 
                                        bgcolor: '#f1f5f9', 
                                        color: '#334155', 
                                        fontFamily: 'monospace',
                                        borderRadius: '6px'
                                    }} 
                                />
                            )}
                            {(submission.paper_sub_theme || submission.topic || submission.paper_theme) && (
                                <Typography variant="caption" sx={{ color: '#0d9488', fontWeight: 800, fontSize: '0.70rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    {submission.paper_sub_theme || submission.topic || submission.paper_theme}
                                </Typography>
                            )}
                            {hasNomination && (
                                <Chip
                                    icon={<EmojiEventsIcon sx={{ fontSize: '13px !important', color: '#b45309 !important' }} />}
                                    label={nominationCategory}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.62rem',
                                        fontWeight: 900,
                                        bgcolor: '#fef3c7',
                                        color: '#b45309',
                                        border: '1px solid #f59e0b',
                                    }}
                                />
                            )}
                        </Box>

                        {/* Title */}
                        <Typography sx={{
                            fontWeight: 800, 
                            fontSize: '0.88rem', 
                            color: '#0f172a',
                            lineHeight: 1.35,
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            display: '-webkit-box', 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: 'vertical',
                            mb: 0.8
                        }}>
                            {submission.title}
                        </Typography>

                        {/* Presenter Info with Avatar */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ 
                                width: 26, 
                                height: 26, 
                                fontSize: '0.70rem', 
                                background: presenterAvatarGrad, 
                                fontWeight: 800,
                                color: '#ffffff'
                            }}>
                                {presenterName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                                    {presenterName}
                                    {presenterAffiliation && (
                                        <Typography component="span" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.74rem', ml: 0.8 }}>
                                            &bull; {presenterAffiliation}
                                        </Typography>
                                    )}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </TableCell>

                {/* TYPE (ORAL / POSTER) */}
                <TableCell align="center" sx={cellSx}>
                    <Chip
                        label={isOral ? 'ORAL' : 'POSTER'}
                        size="small"
                        sx={{
                            fontWeight: 900, 
                            fontSize: '0.70rem',
                            letterSpacing: '0.04em',
                            px: 1,
                            bgcolor: isOral ? '#eff6ff' : '#f5f3ff',
                            color: isOral ? '#1d4ed8' : '#7c3aed',
                            border: '1px solid',
                            borderColor: isOral ? '#bfdbfe' : '#ddd6fe',
                            borderRadius: '8px',
                            height: 26
                        }}
                    />
                </TableCell>

                {/* EVALUATION PROGRESS */}
                <TableCell align="center" sx={cellSx}>
                    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 0.6 }}>
                        <Chip
                            label={`${scoredScores.length} / ${scores.length} Juri`}
                            size="small"
                            sx={{
                                fontWeight: 800,
                                fontSize: '0.72rem',
                                bgcolor: isFullyEvaluated ? '#ecfdf5' : isPartiallyEvaluated ? '#fffbeb' : '#f1f5f9',
                                color: isFullyEvaluated ? '#047857' : isPartiallyEvaluated ? '#b45309' : '#64748b',
                                border: '1px solid',
                                borderColor: isFullyEvaluated ? '#a7f3d0' : isPartiallyEvaluated ? '#fde68a' : '#e2e8f0',
                                height: 24,
                                borderRadius: '8px'
                            }}
                        />
                        <Box sx={{ width: 80, height: 4, bgcolor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{ 
                                width: scores.length > 0 ? `${(scoredScores.length / scores.length) * 100}%` : '0%', 
                                height: '100%', 
                                bgcolor: isFullyEvaluated ? '#10b981' : '#f59e0b',
                                borderRadius: 2 
                            }} />
                        </Box>
                    </Box>
                </TableCell>

                {/* AVERAGE SCORE */}
                <TableCell align="center" sx={cellSx}>
                    {avgScore ? (
                        <Box sx={{ 
                            display: 'inline-block',
                            p: '4px 12px',
                            borderRadius: '10px',
                            bgcolor: interp.bg,
                            border: `1px solid ${interp.border}`
                        }}>
                            <Typography sx={{ fontWeight: 900, color: interp.color, fontSize: '1.05rem', lineHeight: 1, fontFamily: 'monospace' }}>
                                {avgScore}
                            </Typography>
                            <Typography sx={{ color: interp.color, fontWeight: 800, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {interp.label}
                            </Typography>
                        </Box>
                    ) : (
                        <Chip 
                            label="Menunggu" 
                            size="small" 
                            sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: '#f1f5f9', color: '#94a3b8' }} 
                        />
                    )}
                </TableCell>

                {/* ACTION TRIGGER */}
                <TableCell align="center" sx={cellSx}>
                    <Button
                        size="small"
                        onClick={() => setOpen(!open)}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            borderRadius: '8px',
                            borderColor: open ? '#0d9488' : '#e2e8f0',
                            color: open ? '#094d42' : '#334155',
                            bgcolor: open ? '#ecfdf5' : '#ffffff',
                            '&:hover': { bgcolor: '#f0fdf4', borderColor: '#0d9488' }
                        }}
                    >
                        {open ? 'Tutup ▴' : `Lihat Juri (${scores.length}) ▾`}
                    </Button>
                </TableCell>
            </TableRow>

            {/* EXPANDED: PER-JURI SCORES CARD LIST */}
            <TableRow sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc' }}>
                <TableCell sx={{ py: 0, px: 2, borderBottom: open ? `1px solid ${bdr}` : 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2.5, px: { xs: 1, sm: 2 } }}>
                            
                            {/* Paper summary strip */}
                            <Box sx={{ 
                                mb: 2, 
                                p: 1.5, 
                                borderRadius: '12px', 
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff', 
                                border: `1px solid ${bdr}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 1.5
                            }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.84rem' }}>
                                        Daftar Evaluasi Juri untuk: "{submission.title}"
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                                        Presenter: {presenterName} ({presenterEmail}) &bull; Sesi {isOral ? 'Oral' : 'Poster'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.72rem' }}>
                                        Nilai Rata-Rata Akhir:
                                    </Typography>
                                    {avgScore ? (
                                        <Chip 
                                            label={`${avgScore} • ${interp.label}`} 
                                            size="small" 
                                            sx={{ bgcolor: interp.bg, color: interp.color, border: `1px solid ${interp.border}`, fontWeight: 900, fontFamily: 'monospace' }} 
                                        />
                                    ) : (
                                        <Chip label="Belum Ada Nilai" size="small" sx={{ bgcolor: '#f1f5f9', color: '#94a3b8', fontWeight: 700 }} />
                                    )}
                                </Box>
                            </Box>

                            {/* Juri Cards Grid */}
                            {scores.length === 0 ? (
                                <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#ffffff', borderRadius: '12px', border: `1px dashed ${bdr}` }}>
                                    <Typography sx={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                                        Belum ada juri yang ditugaskan ke paper ini.
                                    </Typography>
                                </Box>
                            ) : (
                                <Stack spacing={1.5}>
                                    {scores.map(score => (
                                        <JuriScoreCard key={score.id} score={score} isOral={isOral} isDark={isDark} bdr={bdr} />
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
    const c = theme.palette.custom || {
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        surfaceBg: '#f8fafc',
        textPrimary: '#0f172a',
        textSecondary: '#64748b',
    };
    const isDark = theme.palette.mode === 'dark';
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const allSubmissions = submissions?.data || [];

    const filteredSubmissions = allSubmissions.filter(sub => {
        const title = sub.title?.toLowerCase() || '';
        const author = (sub.author_full_name || sub.user?.name || '').toLowerCase();
        const code = (sub.submission_code || '').toLowerCase();
        const topic = (sub.paper_sub_theme || sub.topic || sub.paper_theme || '').toLowerCase();
        const searchLow = search.toLowerCase();

        const matchesSearch = title.includes(searchLow) || author.includes(searchLow) || code.includes(searchLow) || topic.includes(searchLow);

        if (!matchesSearch) return false;

        const isOral = sub.category_submission?.toLowerCase().includes('oral');
        const scores = sub.presentation_scores || [];
        const scored = scores.filter(s => s.weighted_final_score);
        const isComplete = scores.length > 0 && scored.length === scores.length;
        const isNominated = scores.some(s => s.is_nominated_best);

        if (filter === 'all') return true;
        if (filter === 'oral') return isOral;
        if (filter === 'poster') return !isOral;
        if (filter === 'nominated') return isNominated;
        if (filter === 'completed') return isComplete;
        if (filter === 'pending') return !isComplete;
        return true;
    });

    const bdr = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';

    // Excel / CSV export function
    const exportToCSV = () => {
        const headers = [
            'ID',
            'Submission Code',
            'Paper Title',
            'Presenter Name',
            'Affiliation',
            'Submission Type',
            'Assigned Juris',
            'Completed Evaluations',
            'Average Final Score',
            'Grade Label',
            'Nominated Best',
            'Juri Breakdown (Name | Score | Notes)'
        ];

        const rows = filteredSubmissions.map(sub => {
            const scores = sub.presentation_scores || [];
            const scored = scores.filter(s => s.weighted_final_score);
            const total = scored.reduce((sum, s) => sum + parseFloat(s.weighted_final_score), 0);
            const avg = scored.length > 0 ? (total / scored.length).toFixed(2) : '—';
            const grade = scored.length > 0 ? getInterpretation(parseFloat(avg)).label : '—';
            const isNom = scores.some(s => s.is_nominated_best) ? 'Yes' : 'No';

            const detailStr = scores.map(s => {
                const finalS = s.weighted_final_score ? parseFloat(s.weighted_final_score).toFixed(2) : 'Pending';
                const notes = s.juri_notes ? ` - Notes: "${s.juri_notes.replace(/"/g, '""')}"` : '';
                return `[${s.juri?.name || 'Juri'}: ${finalS}${notes}]`;
            }).join('; ');

            return [
                sub.id,
                `"${sub.submission_code || ''}"`,
                `"${(sub.title || '').replace(/"/g, '""')}"`,
                `"${(sub.author_full_name || sub.user?.name || 'Unknown').replace(/"/g, '""')}"`,
                `"${(sub.affiliation || sub.institute_organization || sub.user?.affiliation || '').replace(/"/g, '""')}"`,
                sub.category_submission?.toLowerCase().includes('oral') ? 'Oral' : 'Poster',
                scores.length,
                scored.length,
                avg,
                grade,
                isNom,
                `"${detailStr}"`
            ].join(',');
        });

        const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `presentation_scores_iagi_geosea_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Calculate metrics
    const totalAssignments = allSubmissions.reduce((sum, s) => sum + (s.presentation_scores?.length || 0), 0);
    const completedAssignments = allSubmissions.reduce((sum, s) => sum + (s.presentation_scores?.filter(ps => ps.weighted_final_score)?.length || 0), 0);
    const pendingAssignments = totalAssignments - completedAssignments;
    const completionPercent = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

    const oralCount = allSubmissions.filter(s => s.category_submission?.toLowerCase().includes('oral')).length;
    const posterCount = allSubmissions.length - oralCount;
    const nominatedCount = allSubmissions.filter(s => s.presentation_scores?.some(ps => ps.is_nominated_best)).length;

    const quickPills = [
        { key: 'all', label: 'Semua Paper', count: allSubmissions.length },
        { key: 'oral', label: 'Oral', count: oralCount },
        { key: 'poster', label: 'Poster', count: posterCount },
        { key: 'nominated', label: '🏆 Nominasi Juara', count: nominatedCount },
        { key: 'completed', label: '✅ Selesai Dinilai' },
        { key: 'pending', label: '⏳ Belum Lengkap' },
    ];

    const headCellSx = { 
        borderBottom: `2px solid ${bdr}`, 
        py: 1.6, 
        px: 2, 
        fontSize: '0.72rem', 
        fontWeight: 800, 
        textTransform: 'uppercase', 
        letterSpacing: '0.06em', 
        color: '#64748b', 
        bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
        verticalAlign: 'middle'
    };

    return (
        <SidebarLayout>
            <Head title="Presentation Scores — IAGI & GEOSEA 2026" />

            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>

                {/* 1. TOP HEADER (21st.dev Style) */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', md: 'center' }, 
                    mb: 3, 
                    gap: 2 
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ 
                            width: 44, 
                            height: 44, 
                            borderRadius: '14px', 
                            background: 'linear-gradient(135deg, #094d42 0%, #0d9488 100%)', 
                            color: '#ffffff', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)'
                        }}>
                            <GavelIcon sx={{ fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: c.textPrimary, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                                    Presentation Scores ⚖️
                                </Typography>
                                <Chip 
                                    label="Jury Rubric Panel" 
                                    size="small" 
                                    sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 800, fontSize: '0.68rem', height: 20, border: '1px solid #a7f3d0' }} 
                                />
                            </Box>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.78rem', display: 'block', mt: 0.3 }}>
                                Rekapitulasi penilaian juri oral & poster, breakdown rubrik kriteria, dan masukan reviewer
                            </Typography>
                        </Box>
                    </Box>

                    {/* Export Action Button */}
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
                        onClick={exportToCSV}
                        sx={{
                            borderColor: bdr, 
                            color: c.textPrimary, 
                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                            px: 2.2, 
                            py: 1, 
                            borderRadius: '12px', 
                            textTransform: 'none', 
                            fontWeight: 700, 
                            fontSize: '0.82rem', 
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            '&:hover': { borderColor: '#0d9488', bgcolor: isDark ? 'rgba(13,148,136,0.1)' : '#f0fdf4', color: '#094d42' }, 
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Export Scores CSV
                    </Button>
                </Box>

                {/* 2. STATS KPI OVERVIEW CARDS (21st.dev & tasteskill.dev Inspired) */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {/* Card 1: Assigned Submissions */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.2, 
                            borderRadius: '16px', 
                            border: `1px solid ${bdr}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            transition: 'all 0.25s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Paper Dipresentasikan
                                </Typography>
                                <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AssignmentIcon sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e3a8a', letterSpacing: '-0.02em', mb: 0.5 }}>
                                {allSubmissions.length} <Typography component="span" sx={{ fontSize: '0.82rem', fontWeight: 700, color: c.textSecondary }}>Paper</Typography>
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.72rem' }}>
                                {oralCount} Presentasi Oral &bull; {posterCount} Poster
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Card 2: Completed Evaluations */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.2, 
                            borderRadius: '16px', 
                            border: `1px solid ${bdr}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            transition: 'all 0.25s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Evaluasi Selesai
                                </Typography>
                                <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AssignmentTurnedInIcon sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46', letterSpacing: '-0.02em', mb: 0.5 }}>
                                {completedAssignments} <Typography component="span" sx={{ fontSize: '0.80rem', fontWeight: 700, color: '#059669' }}>/ {totalAssignments}</Typography>
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <Box sx={{ flex: 1, height: 4, bgcolor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                                    <Box sx={{ width: `${completionPercent}%`, height: '100%', bgcolor: '#10b981', borderRadius: 2 }} />
                                </Box>
                                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800, fontSize: '0.72rem' }}>
                                    {completionPercent}%
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Card 3: Pending Evaluations */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.2, 
                            borderRadius: '16px', 
                            border: `1px solid ${bdr}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            transition: 'all 0.25s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Menunggu Penilaian
                                </Typography>
                                <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <PendingActionsIcon sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#92400e', letterSpacing: '-0.02em', mb: 0.5 }}>
                                {pendingAssignments} <Typography component="span" sx={{ fontSize: '0.82rem', fontWeight: 700, color: c.textSecondary }}>Slot Juri</Typography>
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.72rem' }}>
                                Menunggu input nilai rubrik oleh juri
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Card 4: Nominations */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.2, 
                            borderRadius: '16px', 
                            border: `1px solid ${bdr}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            transition: 'all 0.25s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Kandidat Juara
                                </Typography>
                                <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <EmojiEventsIcon sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#78350f', letterSpacing: '-0.02em', mb: 0.5 }}>
                                {nominatedCount} <Typography component="span" sx={{ fontSize: '0.82rem', fontWeight: 700, color: c.textSecondary }}>Nominasi</Typography>
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.72rem' }}>
                                Direkomendasikan juri untuk Best Presentation
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* 3. MODERN TOOLBAR & FILTER PILLS (Linear / 21st.dev Style) */}
                <Paper elevation={0} sx={{ 
                    p: 2, 
                    borderRadius: '16px', 
                    border: `1px solid ${bdr}`, 
                    bgcolor: c.cardBg, 
                    mb: 2.5,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}>
                        {/* Search Input */}
                        <TextField 
                            placeholder="Cari judul paper, nama presenter, atau topik..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            size="small"
                            InputProps={{ 
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: search ? (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearch('')} sx={{ color: '#94a3b8' }}>
                                            <CloseIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            }}
                            sx={{ 
                                flex: 1, 
                                maxWidth: { xs: '100%', md: 400 },
                                '& .MuiOutlinedInput-root': { 
                                    borderRadius: '12px', 
                                    bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#ffffff',
                                    '& fieldset': { borderColor: bdr }, 
                                    '&:hover fieldset': { borderColor: '#0d9488' }, 
                                    '&.Mui-focused fieldset': { borderColor: '#0d9488' } 
                                },
                                '& input': { fontSize: '0.85rem', fontWeight: 600 } 
                            }}
                        />

                        {/* Quick Filter Segmented Pills */}
                        <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', alignItems: 'center' }}>
                            {quickPills.map(p => {
                                const isActive = filter === p.key;
                                return (
                                    <Button
                                        key={p.key}
                                        size="small"
                                        onClick={() => setFilter(p.key)}
                                        sx={{
                                            py: 0.5,
                                            px: 1.4,
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            fontSize: '0.76rem',
                                            fontWeight: isActive ? 800 : 600,
                                            bgcolor: isActive 
                                                ? (isDark ? 'rgba(13, 148, 136, 0.25)' : '#094d42') 
                                                : (isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'),
                                            color: isActive ? '#ffffff' : c.textSecondary,
                                            border: '1px solid',
                                            borderColor: isActive ? '#094d42' : 'transparent',
                                            boxShadow: isActive ? '0 2px 6px rgba(9, 77, 66, 0.2)' : 'none',
                                            '&:hover': {
                                                bgcolor: isActive ? '#094d42' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                                                color: isActive ? '#ffffff' : c.textPrimary
                                            },
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        {p.label}
                                        {p.count !== undefined && (
                                            <Box 
                                                component="span" 
                                                sx={{ 
                                                    ml: 0.8, 
                                                    px: 0.8, 
                                                    py: 0.1, 
                                                    borderRadius: '6px', 
                                                    fontSize: '0.66rem',
                                                    bgcolor: isActive ? 'rgba(255,255,255,0.2)' : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'),
                                                    color: isActive ? '#ffffff' : '#64748b'
                                                }}
                                            >
                                                {p.count}
                                            </Box>
                                        )}
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>
                </Paper>

                {/* 4. PRESENTATION SCORES TABLE (tasteskill.dev High Taste UI) */}
                <Card elevation={0} sx={{ 
                    borderRadius: '18px', 
                    border: `1px solid ${bdr}`, 
                    bgcolor: c.cardBg, 
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -2px rgba(0,0,0,0.02)'
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        px: 2.8, 
                        py: 2, 
                        borderBottom: `1px solid ${bdr}`,
                        bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#ffffff'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Typography sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.94rem' }}>
                                Daftar Penilaian Presentasi & Rubrik Juri
                            </Typography>
                            <Chip 
                                label={`${filteredSubmissions.length} Data`} 
                                size="small" 
                                sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 800, fontSize: '0.70rem', height: 22 }} 
                            />
                        </Box>

                        {(search || filter !== 'all') && (
                            <Button 
                                size="small" 
                                onClick={() => { setSearch(''); setFilter('all'); }}
                                startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
                                sx={{ textTransform: 'none', fontSize: '0.74rem', color: '#0d9488', fontWeight: 700 }}
                            >
                                Reset Filter
                            </Button>
                        )}
                    </Box>

                    {filteredSubmissions.length === 0 ? (
                        <CardContent sx={{ textAlign: 'center', py: 8 }}>
                            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                <GavelIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
                            </Box>
                            <Typography sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.95rem', mb: 0.5 }}>
                                Tidak ada skor presentasi ditemukan
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textSecondary, display: 'block', maxWidth: 360, mx: 'auto', mb: 2 }}>
                                Coba ubah kata kunci pencarian atau ganti filter kategori / nominasi di atas.
                            </Typography>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={() => { setSearch(''); setFilter('all'); }}
                                sx={{ textTransform: 'none', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700 }}
                            >
                                Reset Filter
                            </Button>
                        </CardContent>
                    ) : (
                        <TableContainer sx={{ overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ ...headCellSx, width: 48, pr: 0 }} />
                                        <TableCell sx={{ ...headCellSx, width: '45%' }}>Informasi Paper & Presenter</TableCell>
                                        <TableCell align="center" sx={{ ...headCellSx, width: 120 }}>Kategori</TableCell>
                                        <TableCell align="center" sx={{ ...headCellSx, width: 150 }}>Progres Juri</TableCell>
                                        <TableCell align="center" sx={{ ...headCellSx, width: 150 }}>Rata-Rata Nilai</TableCell>
                                        <TableCell align="center" sx={{ ...headCellSx, width: 130 }}>Aksi</TableCell>
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
