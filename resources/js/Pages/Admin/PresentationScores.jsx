import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Stack, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Collapse, IconButton, Avatar, Button, Grid, Divider,
    Paper, Tooltip, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput,
    Snackbar, Alert, AvatarGroup
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarIcon from '@mui/icons-material/Star';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ViewListIcon from '@mui/icons-material/ViewList';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

// Curated modern avatar gradients (21st.dev inspired)
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

function JuriScoreCard({ score, isOral, isDark, bdr, submissionId, onRemoveJuri }) {
    const [showDetail, setShowDetail] = useState(false);
    const hasScored = !!score.weighted_final_score;
    const finalScore = hasScored ? parseFloat(score.weighted_final_score).toFixed(2) : null;
    const interp = hasScored ? getInterpretation(parseFloat(finalScore)) : null;
    const avatarGrad = getAvatarGradient(score.juri?.name || 'Juri');

    return (
        <Paper elevation={0} sx={{
            p: 2.2, 
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
                        width: 42, 
                        height: 42, 
                        fontSize: '0.92rem', 
                        background: avatarGrad, 
                        color: '#ffffff', 
                        fontWeight: 800,
                        border: '1.5px solid #ffffff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}>
                        {(score.juri?.name || 'J').charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.90rem' }}>
                                {score.juri?.name || 'Juri Panelis'}
                            </Typography>
                            {score.juri?.role && (
                                <Chip 
                                    label={score.juri.role} 
                                    size="small" 
                                    sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#f1f5f9', color: '#475569' }} 
                                />
                            )}
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem', fontFamily: 'monospace', display: 'block' }}>
                            {score.juri?.email || '—'}
                            {score.juri?.affiliation && ` • ${score.juri.affiliation}`}
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
                                label="Draft (Tersimpan)" 
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

                    {hasScored ? (
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
                    ) : (
                        <Tooltip title="Batalkan / Hapus Penugasan Juri ini">
                            <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => onRemoveJuri(submissionId, score.juri_id, score.juri?.name)}
                                sx={{ 
                                    bgcolor: '#fef2f2', 
                                    border: '1px solid #fecaca',
                                    '&:hover': { bgcolor: '#fee2e2' } 
                                }}
                            >
                                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>

            <Collapse in={showDetail && hasScored} timeout="auto" unmountOnExit>
                <CriterionBreakdown score={score} isOral={isOral} isDark={isDark} bdr={bdr} />
            </Collapse>
        </Paper>
    );
}

function SubmissionRow({ submission, isDark, c, bdr, onAssignJuriClick, onRemoveJuri }) {
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
        px: 2.2, 
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
                <TableCell sx={{ width: 44, ...cellSx, textAlign: 'center', pr: 0 }}>
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
                <TableCell sx={{ ...cellSx, width: '40%' }}>
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
                                        fontWeight: 900, 
                                        bgcolor: '#0f172a', 
                                        color: '#ffffff', 
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
                <TableCell align="center" sx={{ ...cellSx, width: '10%' }}>
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

                {/* ASSIGNED JURIS AVATARS & PROGRESS */}
                <TableCell sx={{ ...cellSx, width: '22%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Chip
                                label={`${scoredScores.length} / ${scores.length} Selesai`}
                                size="small"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: '0.70rem',
                                    bgcolor: isFullyEvaluated ? '#ecfdf5' : isPartiallyEvaluated ? '#fffbeb' : '#f1f5f9',
                                    color: isFullyEvaluated ? '#047857' : isPartiallyEvaluated ? '#b45309' : '#64748b',
                                    border: '1px solid',
                                    borderColor: isFullyEvaluated ? '#a7f3d0' : isPartiallyEvaluated ? '#fde68a' : '#e2e8f0',
                                    height: 22,
                                    borderRadius: '6px'
                                }}
                            />
                            {scores.length < 5 && (
                                <Tooltip title="Tambah / Tugaskan Juri ke Paper Ini">
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => { e.stopPropagation(); onAssignJuriClick(submission); }}
                                        sx={{ color: '#0d9488', p: 0.4, '&:hover': { bgcolor: '#f0fdf4' } }}
                                    >
                                        <PersonAddIcon sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>

                        {/* Avatar Group of Assigned Juris */}
                        {scores.length > 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.70rem', fontWeight: 800 } }}>
                                    {scores.map(s => {
                                        const scored = !!s.weighted_final_score;
                                        return (
                                            <Tooltip key={s.id} title={`${s.juri?.name || 'Juri'} (${scored ? 'Sudah dinilai' : 'Belum dinilai'})`}>
                                                <Avatar 
                                                    sx={{ 
                                                        background: getAvatarGradient(s.juri?.name), 
                                                        border: scored ? '2px solid #10b981 !important' : '2px solid #ffffff !important' 
                                                    }}
                                                >
                                                    {(s.juri?.name || 'J').charAt(0).toUpperCase()}
                                                </Avatar>
                                            </Tooltip>
                                        );
                                    })}
                                </AvatarGroup>
                                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.70rem', fontWeight: 600 }}>
                                    {scores.map(s => s.juri?.name?.split(' ')[0]).join(', ')}
                                </Typography>
                            </Box>
                        ) : (
                            <Button 
                                size="small" 
                                variant="text" 
                                startIcon={<PersonAddIcon sx={{ fontSize: 15 }} />}
                                onClick={() => onAssignJuriClick(submission)}
                                sx={{ textTransform: 'none', fontSize: '0.72rem', color: '#0d9488', fontWeight: 700, p: 0 }}
                            >
                                Tugaskan Juri
                            </Button>
                        )}
                    </Box>
                </TableCell>

                {/* AVERAGE SCORE */}
                <TableCell align="center" sx={{ ...cellSx, width: '14%' }}>
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
                            label="Menunggu Nilai" 
                            size="small" 
                            sx={{ height: 24, fontSize: '0.68rem', fontWeight: 700, bgcolor: '#f1f5f9', color: '#94a3b8' }} 
                        />
                    )}
                </TableCell>

                {/* ACTION TRIGGER */}
                <TableCell align="right" sx={{ ...cellSx, width: '14%' }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
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
                                bgcolor: open ? '#ecfdf4' : '#ffffff',
                                '&:hover': { bgcolor: '#f0fdf4', borderColor: '#0d9488' }
                            }}
                        >
                            {open ? 'Tutup ▴' : `Lihat Juri (${scores.length}) ▾`}
                        </Button>
                    </Stack>
                </TableCell>
            </TableRow>

            {/* EXPANDED: PER-JURI SCORES CARD LIST */}
            <TableRow sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc' }}>
                <TableCell sx={{ py: 0, px: 2.2, borderBottom: open ? `1px solid ${bdr}` : 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2.5, px: { xs: 1, sm: 2 } }}>
                            
                            {/* Paper summary strip */}
                            <Box sx={{ 
                                mb: 2, 
                                p: 1.8, 
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
                                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.86rem' }}>
                                        Daftar Evaluasi Juri untuk: "{submission.title}"
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem' }}>
                                        Presenter: <strong>{presenterName}</strong> ({presenterEmail}) &bull; Sesi <strong>{isOral ? 'Oral' : 'Poster'}</strong>
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                                        onClick={() => onAssignJuriClick(submission)}
                                        sx={{ 
                                            textTransform: 'none', 
                                            fontSize: '0.74rem', 
                                            fontWeight: 800, 
                                            borderRadius: '8px',
                                            bgcolor: '#094d42',
                                            '&:hover': { bgcolor: '#063d34' }
                                        }}
                                    >
                                        + Tugaskan Juri
                                    </Button>

                                    {avgScore ? (
                                        <Chip 
                                            label={`Rata-Rata: ${avgScore} (${interp.label})`} 
                                            size="small" 
                                            sx={{ bgcolor: interp.bg, color: interp.color, border: `1px solid ${interp.border}`, fontWeight: 900, fontFamily: 'monospace', height: 28 }} 
                                        />
                                    ) : (
                                        <Chip label="Belum Ada Nilai Selesai" size="small" sx={{ bgcolor: '#f1f5f9', color: '#94a3b8', fontWeight: 700 }} />
                                    )}
                                </Box>
                            </Box>

                            {/* Juri Cards Grid */}
                            {scores.length === 0 ? (
                                <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#ffffff', borderRadius: '12px', border: `1px dashed ${bdr}` }}>
                                    <PersonIcon sx={{ fontSize: 36, color: '#94a3b8', mb: 1 }} />
                                    <Typography sx={{ color: '#64748b', fontSize: '0.84rem', fontWeight: 700, mb: 1.5 }}>
                                        Belum ada juri yang ditugaskan ke paper ini.
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        startIcon={<PersonAddIcon />}
                                        onClick={() => onAssignJuriClick(submission)}
                                        sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.78rem' }}
                                    >
                                        Tugaskan Juri Sekarang
                                    </Button>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {scores.map(score => (
                                        <Grid item xs={12} md={scores.length === 1 ? 12 : 6} key={score.id}>
                                            <JuriScoreCard 
                                                score={score} 
                                                isOral={isOral} 
                                                isDark={isDark} 
                                                bdr={bdr} 
                                                submissionId={submission.id}
                                                onRemoveJuri={onRemoveJuri}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

// ═══ LEADERBOARD VIEW COMPONENT (Top Ranked Presentations) ═══
function LeaderboardView({ submissions, bdr, isDark }) {
    const scoredSubmissions = submissions
        .map(sub => {
            const scores = sub.presentation_scores || [];
            const scored = scores.filter(s => s.weighted_final_score);
            const avg = scored.length > 0
                ? parseFloat((scored.reduce((sum, s) => sum + parseFloat(s.weighted_final_score), 0) / scored.length).toFixed(2))
                : null;
            return {
                ...sub,
                avgScore: avg,
                scoredCount: scored.length,
                totalJuri: scores.length,
                isNominated: scores.some(s => s.is_nominated_best),
                nominationCat: scores.find(s => s.is_nominated_best)?.nomination_category || 'Nominasi Juara'
            };
        })
        .filter(sub => sub.avgScore !== null)
        .sort((a, b) => b.avgScore - a.avgScore);

    const oralLeaderboard = scoredSubmissions.filter(s => s.category_submission?.toLowerCase().includes('oral'));
    const posterLeaderboard = scoredSubmissions.filter(s => !s.category_submission?.toLowerCase().includes('oral'));

    const [leadCategory, setLeadCategory] = useState('all');
    const displayList = leadCategory === 'oral' ? oralLeaderboard : leadCategory === 'poster' ? posterLeaderboard : scoredSubmissions;

    return (
        <Box>
            {/* Category Filter Pills for Leaderboard */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Button 
                    size="small" 
                    onClick={() => setLeadCategory('all')}
                    sx={{ 
                        borderRadius: '10px', 
                        textTransform: 'none', 
                        fontWeight: leadCategory === 'all' ? 800 : 600,
                        bgcolor: leadCategory === 'all' ? '#094d42' : '#ffffff',
                        color: leadCategory === 'all' ? '#ffffff' : '#475569',
                        border: '1px solid',
                        borderColor: leadCategory === 'all' ? '#094d42' : '#e2e8f0',
                        px: 2
                    }}
                >
                    Semua Kategori ({scoredSubmissions.length})
                </Button>
                <Button 
                    size="small" 
                    onClick={() => setLeadCategory('oral')}
                    sx={{ 
                        borderRadius: '10px', 
                        textTransform: 'none', 
                        fontWeight: leadCategory === 'oral' ? 800 : 600,
                        bgcolor: leadCategory === 'oral' ? '#1d4ed8' : '#ffffff',
                        color: leadCategory === 'oral' ? '#ffffff' : '#475569',
                        border: '1px solid',
                        borderColor: leadCategory === 'oral' ? '#1d4ed8' : '#e2e8f0',
                        px: 2
                    }}
                >
                    Presentasi Oral ({oralLeaderboard.length})
                </Button>
                <Button 
                    size="small" 
                    onClick={() => setLeadCategory('poster')}
                    sx={{ 
                        borderRadius: '10px', 
                        textTransform: 'none', 
                        fontWeight: leadCategory === 'poster' ? 800 : 600,
                        bgcolor: leadCategory === 'poster' ? '#7c3aed' : '#ffffff',
                        color: leadCategory === 'poster' ? '#ffffff' : '#475569',
                        border: '1px solid',
                        borderColor: leadCategory === 'poster' ? '#7c3aed' : '#e2e8f0',
                        px: 2
                    }}
                >
                    Presentasi Poster ({posterLeaderboard.length})
                </Button>
            </Box>

            {/* Podium / Top 3 Highlight Cards */}
            {displayList.length >= 3 && (
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    {/* Rank 2 (Silver) */}
                    <Grid item xs={12} sm={4}>
                        <Paper elevation={0} sx={{ 
                            p: 2.5, 
                            borderRadius: '16px', 
                            border: '1px solid #cbd5e1', 
                            bgcolor: '#f8fafc',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                                <Typography sx={{ fontSize: '1.8rem', lineHeight: 1 }}>🥈</Typography>
                            </Box>
                            <Chip label="Peringkat #2" size="small" sx={{ fontWeight: 800, bgcolor: '#e2e8f0', color: '#475569', mb: 1.5 }} />
                            <Typography sx={{ fontWeight: 900, fontSize: '0.90rem', color: '#0f172a', mb: 0.8, lineHeight: 1.3 }}>
                                {displayList[1].title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
                                {displayList[1].author_full_name || displayList[1].user?.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Chip label={displayList[1].category_submission?.includes('Oral') ? 'Oral' : 'Poster'} size="small" />
                                <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#334155', fontFamily: 'monospace' }}>
                                    {displayList[1].avgScore}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Rank 1 (Gold) */}
                    <Grid item xs={12} sm={4}>
                        <Paper elevation={0} sx={{ 
                            p: 2.8, 
                            borderRadius: '18px', 
                            border: '2px solid #f59e0b', 
                            bgcolor: '#fffbeb',
                            position: 'relative',
                            boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.25)',
                            transform: { sm: 'scale(1.03)' }
                        }}>
                            <Box sx={{ position: 'absolute', top: 14, right: 14 }}>
                                <Typography sx={{ fontSize: '2.2rem', lineHeight: 1 }}>🥇</Typography>
                            </Box>
                            <Chip label="🏆 Juara 1 (Tertinggi)" size="small" sx={{ fontWeight: 900, bgcolor: '#f59e0b', color: '#ffffff', mb: 1.5 }} />
                            <Typography sx={{ fontWeight: 900, fontSize: '0.98rem', color: '#78350f', mb: 0.8, lineHeight: 1.3 }}>
                                {displayList[0].title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#b45309', display: 'block', mb: 1.5, fontWeight: 700 }}>
                                {displayList[0].author_full_name || displayList[0].user?.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Chip label={displayList[0].category_submission?.includes('Oral') ? 'Oral' : 'Poster'} size="small" sx={{ bgcolor: '#fde68a', color: '#78350f', fontWeight: 800 }} />
                                <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#b45309', fontFamily: 'monospace' }}>
                                    {displayList[0].avgScore}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Rank 3 (Bronze) */}
                    <Grid item xs={12} sm={4}>
                        <Paper elevation={0} sx={{ 
                            p: 2.5, 
                            borderRadius: '16px', 
                            border: '1px solid #fed7aa', 
                            bgcolor: '#fff7ed',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                                <Typography sx={{ fontSize: '1.8rem', lineHeight: 1 }}>🥉</Typography>
                            </Box>
                            <Chip label="Peringkat #3" size="small" sx={{ fontWeight: 800, bgcolor: '#ffedd5', color: '#c2410c', mb: 1.5 }} />
                            <Typography sx={{ fontWeight: 900, fontSize: '0.90rem', color: '#0f172a', mb: 0.8, lineHeight: 1.3 }}>
                                {displayList[2].title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
                                {displayList[2].author_full_name || displayList[2].user?.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Chip label={displayList[2].category_submission?.includes('Oral') ? 'Oral' : 'Poster'} size="small" />
                                <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#c2410c', fontFamily: 'monospace' }}>
                                    {displayList[2].avgScore}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Leaderboard Table */}
            <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${bdr}`, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ width: 80, fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'center' }}>Rank</TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase' }}>Judul Paper & Presenter</TableCell>
                                <TableCell align="center" sx={{ width: 120, fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase' }}>Kategori</TableCell>
                                <TableCell align="center" sx={{ width: 150, fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase' }}>Evaluator</TableCell>
                                <TableCell align="center" sx={{ width: 150, fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase' }}>Nilai Rata-Rata</TableCell>
                                <TableCell align="center" sx={{ width: 160, fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase' }}>Predikat / Grade</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayList.map((item, index) => {
                                const interp = getInterpretation(item.avgScore);
                                const isOral = item.category_submission?.toLowerCase().includes('oral');
                                return (
                                    <TableRow key={item.id} hover sx={{ bgcolor: index === 0 ? '#fffbeb' : index === 1 ? '#f8fafc' : index === 2 ? '#fff7ed' : 'inherit' }}>
                                        <TableCell align="center">
                                            <Typography sx={{ fontWeight: 900, fontSize: index < 3 ? '1.1rem' : '0.85rem', color: index === 0 ? '#b45309' : '#0f172a' }}>
                                                {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                                                <Typography sx={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                                                    {item.title}
                                                </Typography>
                                                {item.isNominated && (
                                                    <Chip 
                                                        icon={<EmojiEventsIcon sx={{ fontSize: '13px !important' }} />}
                                                        label={item.nominationCat} 
                                                        size="small" 
                                                        sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#fef3c7', color: '#b45309' }} 
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                {item.author_full_name || item.user?.name} {item.affiliation && `• ${item.affiliation}`}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip 
                                                label={isOral ? 'ORAL' : 'POSTER'} 
                                                size="small" 
                                                sx={{ 
                                                    fontWeight: 800, 
                                                    fontSize: '0.68rem', 
                                                    bgcolor: isOral ? '#eff6ff' : '#f5f3ff', 
                                                    color: isOral ? '#1d4ed8' : '#7c3aed' 
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
                                                {item.scoredCount} / {item.totalJuri} Juri
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: interp.color, fontFamily: 'monospace' }}>
                                                {item.avgScore}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip 
                                                label={interp.label} 
                                                size="small" 
                                                sx={{ bgcolor: interp.bg, color: interp.color, border: `1px solid ${interp.border}`, fontWeight: 800 }} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}

export default function PresentationScores({ submissions, availableJuris = [] }) {
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
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'leaderboard'
    
    // Assign Juri Modal State
    const [assignModal, setAssignModal] = useState({ open: false, submission: null, selectedJuriIds: [], loading: false, error: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

    // ── Open Assign Juri Modal ──
    const handleOpenAssign = (submission) => {
        const currentlyAssigned = (submission.presentation_scores || []).map(s => s.juri_id);
        setAssignModal({
            open: true,
            submission,
            selectedJuriIds: currentlyAssigned,
            loading: false,
            error: ''
        });
    };

    // ── Submit Juri Assignment ──
    const handleSaveJuriAssignment = () => {
        if (!assignModal.submission) return;
        const subId = assignModal.submission.id;
        const currentAssigned = (assignModal.submission.presentation_scores || []).map(s => s.juri_id);
        const newlySelected = assignModal.selectedJuriIds.filter(id => !currentAssigned.includes(id));

        if (newlySelected.length === 0) {
            setAssignModal({ ...assignModal, error: 'Silakan pilih setidaknya satu juri baru untuk ditugaskan.' });
            return;
        }

        setAssignModal(prev => ({ ...prev, loading: true, error: '' }));
        router.post(route('admin.submissions.assignJuri', subId), {
            juri_ids: newlySelected
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAssignModal({ open: false, submission: null, selectedJuriIds: [], loading: false, error: '' });
                setSnackbar({ open: true, message: `Berhasil menugaskan juri ke paper!`, severity: 'success' });
            },
            onError: (err) => {
                setAssignModal(prev => ({ ...prev, loading: false, error: err.error || 'Gagal menugaskan juri.' }));
            }
        });
    };

    // ── Remove Juri Assignment ──
    const handleRemoveJuri = (submissionId, juriId, juriName) => {
        if (!confirm(`Hapus penugasan juri "${juriName}" dari paper ini?`)) return;

        router.delete(route('admin.submissions.removeJuri', { submissionId, juriId }), {
            preserveScroll: true,
            onSuccess: () => {
                setSnackbar({ open: true, message: `Penugasan juri "${juriName}" berhasil dihapus.`, severity: 'success' });
            },
            onError: (err) => {
                setSnackbar({ open: true, message: err.error || 'Gagal menghapus penugasan juri.', severity: 'error' });
            }
        });
    };

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
        px: 2.2, 
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
                            width: 46, 
                            height: 46, 
                            borderRadius: '14px', 
                            background: 'linear-gradient(135deg, #094d42 0%, #0d9488 100%)', 
                            color: '#ffffff', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)'
                        }}>
                            <GavelIcon sx={{ fontSize: 26 }} />
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: c.textPrimary, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                                    Presentation Scores (JURI) ⚖️
                                </Typography>
                                <Chip 
                                    label="Live Rubric & Jury Panel" 
                                    size="small" 
                                    sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 800, fontSize: '0.68rem', height: 20, border: '1px solid #a7f3d0' }} 
                                />
                            </Box>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.78rem', display: 'block', mt: 0.3 }}>
                                Rekapitulasi penilaian presentasi oral & poster oleh Juri Panelis, penugasan juri, dan leaderboard juara
                            </Typography>
                        </Box>
                    </Box>

                    {/* View Mode Toggle & Export Button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        {/* Segmented View Mode Toggle */}
                        <Box sx={{ 
                            display: 'flex', 
                            bgcolor: '#f1f5f9', 
                            p: 0.4, 
                            borderRadius: '12px', 
                            border: '1px solid #e2e8f0' 
                        }}>
                            <Button
                                size="small"
                                onClick={() => setViewMode('list')}
                                startIcon={<ViewListIcon sx={{ fontSize: 18 }} />}
                                sx={{
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: viewMode === 'list' ? 900 : 700,
                                    bgcolor: viewMode === 'list' ? '#ffffff' : 'transparent',
                                    color: viewMode === 'list' ? '#094d42' : '#64748b',
                                    boxShadow: viewMode === 'list' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                                    px: 1.8,
                                    py: 0.6
                                }}
                            >
                                Daftar Paper
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setViewMode('leaderboard')}
                                startIcon={<LeaderboardIcon sx={{ fontSize: 18 }} />}
                                sx={{
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: viewMode === 'leaderboard' ? 900 : 700,
                                    bgcolor: viewMode === 'leaderboard' ? '#ffffff' : 'transparent',
                                    color: viewMode === 'leaderboard' ? '#b45309' : '#64748b',
                                    boxShadow: viewMode === 'leaderboard' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                                    px: 1.8,
                                    py: 0.6
                                }}
                            >
                                🏆 Leaderboard Juara
                            </Button>
                        </Box>

                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
                            onClick={exportToCSV}
                            sx={{
                                borderColor: bdr, 
                                color: c.textPrimary, 
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                                px: 2.2, 
                                py: 0.9, 
                                borderRadius: '12px', 
                                textTransform: 'none', 
                                fontWeight: 800, 
                                fontSize: '0.80rem', 
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                '&:hover': { borderColor: '#0d9488', bgcolor: isDark ? 'rgba(13,148,136,0.1)' : '#f0fdf4', color: '#094d42' }, 
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Export CSV
                        </Button>
                    </Box>
                </Box>

                {/* 2. STATS KPI OVERVIEW CARDS (Full-Width Responsive 4-Grid) */}
                <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                    {/* Card 1: Assigned Submissions */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.5, 
                            borderRadius: '16px', 
                            border: `1px solid ${bdr}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            transition: 'all 0.25s ease',
                            cursor: 'pointer',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}
                        onClick={() => { setViewMode('list'); setFilter('all'); }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Paper Dipresentasikan
                                </Typography>
                                <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AssignmentIcon sx={{ fontSize: 19 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e3a8a', letterSpacing: '-0.02em', mb: 0.5 }}>
                                {allSubmissions.length} <Typography component="span" sx={{ fontSize: '0.82rem', fontWeight: 700, color: c.textSecondary }}>Paper</Typography>
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.74rem' }}>
                                {oralCount} Presentasi Oral &bull; {posterCount} Poster
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Card 2: Completed Evaluations */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.5, 
                            borderRadius: '16px', 
                            border: `1px solid ${bdr}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            transition: 'all 0.25s ease',
                            cursor: 'pointer',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}
                        onClick={() => { setViewMode('list'); setFilter('completed'); }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Evaluasi Selesai
                                </Typography>
                                <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AssignmentTurnedInIcon sx={{ fontSize: 19 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46', letterSpacing: '-0.02em', mb: 0.5 }}>
                                {completedAssignments} <Typography component="span" sx={{ fontSize: '0.80rem', fontWeight: 700, color: '#059669' }}>/ {totalAssignments} Slot</Typography>
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <Box sx={{ flex: 1, height: 5, bgcolor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                                    <Box sx={{ width: `${completionPercent}%`, height: '100%', bgcolor: '#10b981', borderRadius: 2 }} />
                                </Box>
                                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 900, fontSize: '0.74rem' }}>
                                    {completionPercent}%
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Card 3: Pending Evaluations */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.5, 
                            borderRadius: '16px', 
                            border: `1px solid ${bdr}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            transition: 'all 0.25s ease',
                            cursor: 'pointer',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}
                        onClick={() => { setViewMode('list'); setFilter('pending'); }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Menunggu Penilaian
                                </Typography>
                                <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <PendingActionsIcon sx={{ fontSize: 19 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#92400e', letterSpacing: '-0.02em', mb: 0.5 }}>
                                {pendingAssignments} <Typography component="span" sx={{ fontSize: '0.82rem', fontWeight: 700, color: c.textSecondary }}>Slot Juri</Typography>
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.74rem' }}>
                                Menunggu input nilai rubrik oleh juri
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Card 4: Nominations */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.5, 
                            borderRadius: '16px', 
                            border: `1px solid ${bdr}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            transition: 'all 0.25s ease',
                            cursor: 'pointer',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}
                        onClick={() => { setViewMode('leaderboard'); }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Kandidat Juara
                                </Typography>
                                <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <EmojiEventsIcon sx={{ fontSize: 19 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#78350f', letterSpacing: '-0.02em', mb: 0.5 }}>
                                {nominatedCount} <Typography component="span" sx={{ fontSize: '0.82rem', fontWeight: 700, color: c.textSecondary }}>Nominasi</Typography>
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.74rem' }}>
                                Klik untuk melihat Leaderboard Juara &bull; 🏆
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* 3. CONTENT AREA (SWITCH BETWEEN LIST VIEW & LEADERBOARD VIEW) */}
                {viewMode === 'leaderboard' ? (
                    <LeaderboardView submissions={allSubmissions} bdr={bdr} isDark={isDark} />
                ) : (
                    <>
                        {/* TOOLBAR & FILTER PILLS */}
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
                                    placeholder="Cari judul paper, nama presenter, kode, atau topik..." 
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
                                        maxWidth: { xs: '100%', md: 450 },
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
                                                    py: 0.6,
                                                    px: 1.5,
                                                    borderRadius: '10px',
                                                    textTransform: 'none',
                                                    fontSize: '0.78rem',
                                                    fontWeight: isActive ? 900 : 700,
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

                        {/* PRESENTATION SCORES TABLE */}
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
                                    <Typography sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.96rem' }}>
                                        Daftar Penilaian Presentasi & Rubrik Juri
                                    </Typography>
                                    <Chip 
                                        label={`${filteredSubmissions.length} Paper`} 
                                        size="small" 
                                        sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 800, fontSize: '0.72rem', height: 22 }} 
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
                                        Coba ubah kata kunci pencarian atau ganti filter kategori / status di atas.
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
                                    <Table sx={{ minWidth: 900 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ ...headCellSx, width: 44, pr: 0 }} />
                                                <TableCell sx={{ ...headCellSx, width: '40%' }}>Informasi Paper & Presenter</TableCell>
                                                <TableCell align="center" sx={{ ...headCellSx, width: '10%' }}>Kategori</TableCell>
                                                <TableCell sx={{ ...headCellSx, width: '22%' }}>Tim Juri Evaluator</TableCell>
                                                <TableCell align="center" sx={{ ...headCellSx, width: '14%' }}>Nilai Rata-Rata</TableCell>
                                                <TableCell align="right" sx={{ ...headCellSx, width: '14%' }}>Aksi</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredSubmissions.map(sub => (
                                                <SubmissionRow 
                                                    key={sub.id} 
                                                    submission={sub} 
                                                    isDark={isDark} 
                                                    c={c} 
                                                    bdr={bdr} 
                                                    onAssignJuriClick={handleOpenAssign}
                                                    onRemoveJuri={handleRemoveJuri}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Card>
                    </>
                )}

                {/* 4. MODAL ASSIGN JURI (TUGASKAN JURI) */}
                <Dialog 
                    open={assignModal.open} 
                    onClose={() => !assignModal.loading && setAssignModal({ open: false, submission: null, selectedJuriIds: [], loading: false, error: '' })} 
                    maxWidth="sm" 
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '20px',
                            p: 1
                        }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a', pb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <PersonAddIcon sx={{ color: '#0d9488' }} />
                            Tugaskan Juri Panelis ke Paper
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 1.5 }}>
                        {assignModal.submission && (
                            <Box sx={{ p: 1.8, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                                    <Chip 
                                        label={assignModal.submission.category_submission?.includes('Oral') ? 'ORAL' : 'POSTER'} 
                                        size="small" 
                                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#eff6ff', color: '#1d4ed8' }} 
                                    />
                                    {assignModal.submission.submission_code && (
                                        <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#64748b' }}>
                                            [{assignModal.submission.submission_code}]
                                        </Typography>
                                    )}
                                </Box>
                                <Typography sx={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a', lineHeight: 1.35, mb: 0.5 }}>
                                    {assignModal.submission.title}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                    Presenter: {assignModal.submission.author_full_name || assignModal.submission.user?.name}
                                </Typography>
                            </Box>
                        )}

                        {assignModal.error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.82rem' }}>
                                {assignModal.error}
                            </Alert>
                        )}

                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, fontSize: '0.84rem' }}>
                            Pilih Juri yang Ingin Ditugaskan (Maksimal 5 Juri):
                        </Typography>

                        <FormControl fullWidth size="small">
                            <InputLabel id="select-juri-label">Pilih Juri</InputLabel>
                            <Select
                                labelId="select-juri-label"
                                multiple
                                value={assignModal.selectedJuriIds}
                                onChange={(e) => {
                                    const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                                    setAssignModal({ ...assignModal, selectedJuriIds: value });
                                }}
                                input={<OutlinedInput label="Pilih Juri" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((val) => {
                                            const juri = availableJuris.find(j => j.id === val);
                                            return (
                                                <Chip 
                                                    key={val} 
                                                    label={juri?.name || `ID ${val}`} 
                                                    size="small" 
                                                    sx={{ height: 24, fontSize: '0.72rem', fontWeight: 700 }}
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                                sx={{ borderRadius: '12px' }}
                            >
                                {availableJuris.length === 0 ? (
                                    <MenuItem disabled>Tidak ada juri terdaftar di sistem</MenuItem>
                                ) : (
                                    availableJuris.map((juri) => {
                                        const alreadyAssigned = (assignModal.submission?.presentation_scores || []).some(s => s.juri_id === juri.id);
                                        return (
                                            <MenuItem key={juri.id} value={juri.id} disabled={alreadyAssigned}>
                                                <Checkbox checked={assignModal.selectedJuriIds.indexOf(juri.id) > -1} />
                                                <ListItemText 
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                                                                {juri.name}
                                                            </Typography>
                                                            {alreadyAssigned && (
                                                                <Chip label="Sudah Ditugaskan" size="small" sx={{ height: 18, fontSize: '0.62rem', bgcolor: '#ecfdf5', color: '#047857' }} />
                                                            )}
                                                        </Box>
                                                    } 
                                                    secondary={`${juri.role} • ${juri.email}`} 
                                                />
                                            </MenuItem>
                                        );
                                    })
                                )}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                        <Button 
                            onClick={() => setAssignModal({ open: false, submission: null, selectedJuriIds: [], loading: false, error: '' })}
                            disabled={assignModal.loading}
                            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, color: '#64748b' }}
                        >
                            Batal
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleSaveJuriAssignment}
                            disabled={assignModal.loading}
                            sx={{ 
                                borderRadius: '10px', 
                                textTransform: 'none', 
                                fontWeight: 800,
                                bgcolor: '#094d42',
                                '&:hover': { bgcolor: '#063d34' }
                            }}
                        >
                            {assignModal.loading ? 'Menyimpan...' : 'Tugaskan Juri'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* 5. SNACKBAR FEEDBACK */}
                <Snackbar 
                    open={snackbar.open} 
                    autoHideDuration={4000} 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '12px', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </SidebarLayout>
    );
}
