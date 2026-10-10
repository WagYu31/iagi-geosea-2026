import React, { useState } from 'react';
import {
    Box, Typography, Grid, Chip, Button, Collapse, Stack, useTheme,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const ORAL_CRITERIA = [
    { cat: 'A. Delivery (30%)', color: '#0284c7', items: [
        { label: 'Time Management', key: 'time_management', weight: '5%' },
        { label: 'Posture & Professionalism', key: 'posture_professionalism', weight: '10%' },
        { label: 'Communication Skills', key: 'communication_skills', weight: '15%' },
    ]},
    { cat: 'B. Content (50%)', color: '#059669', items: [
        { label: 'Scientific Rigor', key: 'scientific_substantiation', weight: '15%' },
        { label: 'Technical Contribution', key: 'technical_contribution', weight: '10%' },
        { label: 'Logical Organization', key: 'logical_organization', weight: '10%' },
        { label: 'Visual Quality & Media', key: 'visual_quality', weight: '5%' },
        { label: 'Originality & Innovation', key: 'originality_innovation', weight: '10%' },
    ]},
    { cat: 'C. Manuscript (20%)', color: '#d97706', items: [
        { label: 'Scientific Depth', key: 'manuscript_substantiation', weight: '10%' },
        { label: 'Writing & Structure', key: 'manuscript_writing', weight: '10%' },
    ]},
];

const POSTER_CRITERIA = [
    { cat: 'A. Poster Quality (55%)', color: '#0284c7', items: [
        { label: 'Scientific Substantiation', key: 'poster_scientific_substantiation', weight: '15%' },
        { label: 'Practical Usefulness', key: 'practical_usefulness', weight: '10%' },
        { label: 'Technical Contribution', key: 'poster_technical_contribution', weight: '10%' },
        { label: 'Design & Visual Hierarchy', key: 'poster_organization_design', weight: '10%' },
        { label: 'Originality & Authenticity', key: 'poster_originality', weight: '10%' },
    ]},
    { cat: 'B. Presenter Quality (25%)', color: '#059669', items: [
        { label: 'Poster Explanation', key: 'presentation_explanation', weight: '10%' },
        { label: 'Subject Knowledge & Q&A', key: 'subject_knowledge', weight: '15%' },
    ]},
    { cat: 'C. Manuscript (20%)', color: '#d97706', items: [
        { label: 'Manuscript Rigor', key: 'manuscript_substantiation', weight: '10%' },
        { label: 'Systematic Writing', key: 'manuscript_writing', weight: '10%' },
    ]},
];

export default function RubricBreakdownCard({ score, rubricType = 'oral' }) {
    const theme = useTheme();
    const c = theme.palette.custom || {};
    const isDark = theme.palette.mode === 'dark';
    const [open, setOpen] = useState(false);

    if (!score) return null;

    const isOral = String(rubricType).toLowerCase() === 'oral';
    const criteriaGroups = isOral ? ORAL_CRITERIA : POSTER_CRITERIA;
    const isNominated = Boolean(score.is_nominated_best);
    const nominationCategory = score.nomination_category || (isOral ? 'Best Oral Presentation' : 'Best Poster Presentation');

    return (
        <Box sx={{
            mt: 1.2,
            borderRadius: '12px',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}`,
            overflow: 'hidden',
        }}>
            {/* Header toggle button */}
            <Box
                onClick={() => setOpen(!open)}
                sx={{
                    p: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    bgcolor: open ? (isDark ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9') : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
                    },
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="caption" sx={{
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        color: c.textPrimary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                    }}>
                        Rincian Nilai Rubrik ({isOral ? 'Oral' : 'Poster'})
                    </Typography>

                    {isNominated && (
                        <Chip
                            icon={<EmojiEventsIcon sx={{ fontSize: '12px !important', color: '#f59e0b !important' }} />}
                            label={`🏆 ${nominationCategory}`}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7',
                                color: '#b45309',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                            }}
                        />
                    )}
                </Stack>

                <Button
                    size="small"
                    endIcon={open ? <ExpandLessIcon sx={{ fontSize: 14 }} /> : <ExpandMoreIcon sx={{ fontSize: 14 }} />}
                    sx={{
                        textTransform: 'none',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: c.textSecondary,
                        p: 0,
                        minWidth: 0,
                    }}
                >
                    {open ? 'Sembunyikan' : 'Lihat Detail'}
                </Button>
            </Box>

            {/* Collapsible Content */}
            <Collapse in={open}>
                <Box sx={{ p: 1.5, pt: 1, borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0'}` }}>
                    <Stack spacing={1.5}>
                        {criteriaGroups.map((group, gIdx) => (
                            <Box key={gIdx}>
                                <Typography variant="caption" sx={{
                                    fontWeight: 800,
                                    fontSize: '0.68rem',
                                    color: group.color,
                                    textTransform: 'uppercase',
                                    display: 'block',
                                    mb: 0.6,
                                }}>
                                    {group.cat}
                                </Typography>
                                <Grid container spacing={1}>
                                    {group.items.map((item) => {
                                        const rawVal = score[item.key];
                                        const hasVal = rawVal !== null && rawVal !== undefined && rawVal !== '';
                                        return (
                                            <Grid item xs={6} sm={4} key={item.key}>
                                                <Box sx={{
                                                    p: 0.8,
                                                    borderRadius: '8px',
                                                    bgcolor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#ffffff',
                                                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9'}`,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}>
                                                    <Typography variant="caption" sx={{
                                                        fontSize: '0.68rem',
                                                        color: c.textSecondary,
                                                        pr: 0.5,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                        {item.label}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{
                                                        fontSize: '0.76rem',
                                                        fontWeight: 900,
                                                        fontFamily: 'monospace',
                                                        color: hasVal ? group.color : '#94a3b8',
                                                    }}>
                                                        {hasVal ? `${rawVal}/10` : '—'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Box>
                        ))}

                        {/* Juri Evaluator Notes */}
                        {score.juri_notes && (
                            <Box sx={{
                                mt: 1,
                                p: 1.2,
                                borderRadius: '8px',
                                bgcolor: isDark ? 'rgba(5, 150, 105, 0.08)' : '#f0fdf4',
                                border: '1px solid rgba(5, 150, 105, 0.2)',
                            }}>
                                <Typography variant="caption" sx={{
                                    fontWeight: 800,
                                    color: '#059669',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    fontSize: '0.68rem',
                                    mb: 0.3,
                                }}>
                                    <RateReviewIcon sx={{ fontSize: 13 }} />
                                    Catatan Juri / Evaluator Notes:
                                </Typography>
                                <Typography variant="caption" sx={{
                                    fontSize: '0.74rem',
                                    color: isDark ? '#cbd5e1' : '#334155',
                                    fontStyle: 'italic',
                                    lineHeight: 1.45,
                                    display: 'block',
                                }}>
                                    "{score.juri_notes}"
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Collapse>
        </Box>
    );
}
