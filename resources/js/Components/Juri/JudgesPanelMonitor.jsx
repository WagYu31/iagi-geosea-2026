import React, { useState } from 'react';
import {
    Box, Typography, Stack, Avatar, Chip, Tooltip, LinearProgress,
    Button, Collapse, useTheme,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';

/**
 * JudgesPanelMonitor
 * Real-time monitoring of fellow judges on the presentation panel (e.g. 3 judges panel)
 */
export default function JudgesPanelMonitor({
    presentationScores = [],
    currentJuriId,
    compact = false,
}) {
    const theme = useTheme();
    const c = theme.palette.custom || {};
    const isDark = theme.palette.mode === 'dark';
    const [expanded, setExpanded] = useState(false);
    const [forceReveal, setForceReveal] = useState(false);

    if (!presentationScores || presentationScores.length <= 1) {
        // Only 1 judge assigned or empty
        return null;
    }

    // Find current judge score
    const currentScore = presentationScores.find(s => String(s.juri_id) === String(currentJuriId));
    const currentJudgeScored = currentScore && currentScore.weighted_final_score !== null && !currentScore.is_draft;

    // Stats
    const totalJudges = presentationScores.length;
    const scoredJudges = presentationScores.filter(s => s.weighted_final_score !== null && !s.is_draft);
    const completedCount = scoredJudges.length;

    // Consensus Average Score
    const consensusAverage = completedCount > 0
        ? (scoredJudges.reduce((acc, s) => acc + parseFloat(s.weighted_final_score || 0), 0) / completedCount).toFixed(2)
        : null;

    const canSeeScores = currentJudgeScored || forceReveal;

    if (compact) {
        return (
            <Box sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                px: 1,
                py: 0.35,
                borderRadius: '8px',
                bgcolor: isDark ? 'rgba(59, 130, 246, 0.12)' : '#eff6ff',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                color: '#2563eb',
            }}>
                <GroupIcon sx={{ fontSize: 13 }} />
                <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: 800 }}>
                    Panel: {completedCount}/{totalJudges} Juri Selesai
                </Typography>
                {consensusAverage && canSeeScores && (
                    <Chip
                        label={`Avg: ${consensusAverage}`}
                        size="small"
                        sx={{
                            height: 16,
                            fontSize: '0.58rem',
                            fontWeight: 900,
                            bgcolor: '#2563eb',
                            color: '#ffffff',
                            borderRadius: '4px',
                        }}
                    />
                )}
            </Box>
        );
    }

    return (
        <Box sx={{
            borderRadius: '14px',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc',
            border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.25)' : '#bfdbfe'}`,
            p: 1.5,
            my: 1,
            boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(37, 99, 235, 0.04)',
        }}>
            {/* Header Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#dbeafe',
                        color: '#2563eb',
                    }}>
                        <GroupIcon sx={{ fontSize: 16 }} />
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{
                            fontWeight: 800,
                            color: isDark ? '#93c5fd' : '#1e40af',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            fontSize: '0.68rem',
                            display: 'block',
                        }}>
                            Dewan Juri Panel ({totalJudges} Juri)
                        </Typography>
                        <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.68rem' }}>
                            {completedCount === totalJudges ? 'Semua juri telah selesai menilai' : `${completedCount} dari ${totalJudges} juri telah submit penilaian`}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                    {consensusAverage && (
                        <Box sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: '6px',
                            bgcolor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                        }}>
                            <StarIcon sx={{ fontSize: 13, color: '#059669' }} />
                            <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669' }}>
                                Rata-rata: {canSeeScores ? `${consensusAverage} / 10` : '***'}
                            </Typography>
                        </Box>
                    )}

                    <Button
                        size="small"
                        onClick={() => setExpanded(!expanded)}
                        endIcon={expanded ? <ExpandLessIcon sx={{ fontSize: 14 }} /> : <ExpandMoreIcon sx={{ fontSize: 14 }} />}
                        sx={{
                            textTransform: 'none',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#2563eb',
                            py: 0.2,
                            px: 0.8,
                        }}
                    >
                        {expanded ? 'Tutup' : 'Lihat Status Juri'}
                    </Button>
                </Stack>
            </Box>

            {/* Progress bar */}
            <LinearProgress
                variant="determinate"
                value={(completedCount / totalJudges) * 100}
                sx={{
                    height: 4,
                    borderRadius: 2,
                    mt: 1.2,
                    mb: 0.5,
                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                        bgcolor: completedCount === totalJudges ? '#059669' : '#2563eb',
                        borderRadius: 2,
                    },
                }}
            />

            {/* Expanded List of Judges */}
            <Collapse in={expanded}>
                <Box sx={{ mt: 1.5, pt: 1, borderTop: `1px dashed ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>
                    {!canSeeScores && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 0.8,
                            mb: 1,
                            borderRadius: '8px',
                            bgcolor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                        }}>
                            <Typography variant="caption" sx={{ color: '#d97706', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LockIcon sx={{ fontSize: 13 }} />
                                <strong>Blind Review:</strong> Skor rekan juri terbuka setelah Anda menyelesaikan penilaian resmi.
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => setForceReveal(true)}
                                startIcon={<VisibilityIcon sx={{ fontSize: 12 }} />}
                                sx={{ textTransform: 'none', fontSize: '0.65rem', py: 0.1, px: 0.8, color: '#b45309' }}
                            >
                                Buka Langsung
                            </Button>
                        </Box>
                    )}

                    <Stack spacing={0.8}>
                        {presentationScores.map((ps, idx) => {
                            const isMe = String(ps.juri_id) === String(currentJuriId);
                            const hasSubmitted = ps.weighted_final_score !== null && !ps.is_draft;
                            const isDraft = Boolean(ps.is_draft);
                            const judgeName = isMe ? `${ps.juri?.name || 'Anda'} (Anda)` : (ps.juri?.name || `Juri ${idx + 1}`);

                            return (
                                <Box
                                    key={ps.id || idx}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 0.8,
                                        borderRadius: '8px',
                                        bgcolor: isMe
                                            ? (isDark ? 'rgba(5, 150, 105, 0.12)' : '#ecfdf5')
                                            : (isDark ? 'rgba(255,255,255,0.02)' : '#ffffff'),
                                        border: `1px solid ${isMe ? (isDark ? 'rgba(5, 150, 105, 0.3)' : '#a7f3d0') : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9')}`,
                                    }}
                                >
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                        <Avatar sx={{
                                            width: 24,
                                            height: 24,
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            bgcolor: isMe ? '#059669' : '#3b82f6',
                                            color: '#ffffff',
                                        }}>
                                            {judgeName.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="body2" sx={{
                                                fontSize: '0.76rem',
                                                fontWeight: isMe ? 800 : 600,
                                                color: isMe ? '#059669' : c.textPrimary,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {judgeName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontSize: '0.62rem', color: c.textSecondary }}>
                                                {isMe ? 'Lembar Penilaian Anda' : 'Rekan Dewan Juri'}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Box sx={{ textAlign: 'right' }}>
                                        {hasSubmitted ? (
                                            <Stack direction="row" spacing={0.6} alignItems="center">
                                                <CheckCircleIcon sx={{ fontSize: 13, color: '#059669' }} />
                                                <Typography variant="caption" sx={{
                                                    fontSize: '0.74rem',
                                                    fontWeight: 900,
                                                    fontFamily: 'monospace',
                                                    color: '#059669',
                                                }}>
                                                    {isMe || canSeeScores ? `${parseFloat(ps.weighted_final_score).toFixed(2)} pts` : 'Sudah Dinilai'}
                                                </Typography>
                                            </Stack>
                                        ) : isDraft ? (
                                            <Chip
                                                label="Draft Tersimpan"
                                                size="small"
                                                sx={{
                                                    height: 18,
                                                    fontSize: '0.6rem',
                                                    fontWeight: 700,
                                                    bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7',
                                                    color: '#d97706',
                                                }}
                                            />
                                        ) : (
                                            <Stack direction="row" spacing={0.4} alignItems="center">
                                                <HourglassEmptyIcon sx={{ fontSize: 12, color: '#94a3b8' }} />
                                                <Typography variant="caption" sx={{ fontSize: '0.68rem', color: c.textSecondary, fontStyle: 'italic' }}>
                                                    Belum Menilai
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            </Collapse>
        </Box>
    );
}
