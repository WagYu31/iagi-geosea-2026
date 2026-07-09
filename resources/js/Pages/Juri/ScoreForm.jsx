import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Button, Slider, TextField,
    Stack, Divider, useTheme, Accordion, AccordionSummary, AccordionDetails,
    Alert, LinearProgress, Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// ── Rubric Definitions ──

const ORAL_RUBRIC = [
    {
        category: 'A. Presentation Delivery',
        weight: '30%',
        color: '#2563eb',
        items: [
            { field: 'time_management', label: 'A1. Time Management', weight: 0.05, desc: 'Effective use of allotted time, proper pacing' },
            { field: 'posture_professionalism', label: 'A2. Posture & Professionalism', weight: 0.10, desc: 'Professional appearance, confident body language' },
            { field: 'communication_skills', label: 'A3. Communication Skills', weight: 0.15, desc: 'Clear articulation, audience engagement, eye contact' },
        ],
    },
    {
        category: 'B. Presentation Content',
        weight: '50%',
        color: '#059669',
        items: [
            { field: 'scientific_substantiation', label: 'B1. Scientific Substantiation', weight: 0.15, desc: 'Strong scientific basis, proper data support' },
            { field: 'technical_contribution', label: 'B2. Technical/Scientific Contribution', weight: 0.10, desc: 'Novel findings, technical advancement' },
            { field: 'logical_organization', label: 'B3. Logical & Systematic Organization', weight: 0.10, desc: 'Well-structured, logical flow of content' },
            { field: 'visual_quality', label: 'B4. Visual Quality', weight: 0.05, desc: 'Slide design, charts, and visual aids quality' },
            { field: 'originality_innovation', label: 'B5. Originality & Innovation', weight: 0.10, desc: 'Original approach, innovative methods or ideas' },
        ],
    },
    {
        category: 'C. Manuscript Quality',
        weight: '20%',
        color: '#d97706',
        items: [
            { field: 'manuscript_substantiation', label: 'C1. Scientific Substantiation', weight: 0.10, desc: 'Manuscript scientific rigor and evidence' },
            { field: 'manuscript_writing', label: 'C2. Logical & Systematic Writing', weight: 0.10, desc: 'Writing clarity, structure, grammar' },
        ],
    },
];

const POSTER_RUBRIC = [
    {
        category: 'A. Poster Quality',
        weight: '55%',
        color: '#9333ea',
        items: [
            { field: 'poster_scientific_substantiation', label: 'A1. Scientific Substantiation', weight: 0.15, desc: 'Strong scientific basis, proper data support' },
            { field: 'practical_usefulness', label: 'A2. Practical Usefulness & Significance', weight: 0.10, desc: 'Real-world applicability and impact' },
            { field: 'poster_technical_contribution', label: 'A3. Technical/Scientific Contribution', weight: 0.10, desc: 'Novel findings, technical advancement' },
            { field: 'poster_organization_design', label: 'A4. Poster Organization & Visual Design', weight: 0.10, desc: 'Layout, typography, color scheme, readability' },
            { field: 'poster_originality', label: 'A5. Originality & Authenticity', weight: 0.10, desc: 'Original approach, authentic data' },
        ],
    },
    {
        category: 'B. Presenter Quality',
        weight: '25%',
        color: '#2563eb',
        items: [
            { field: 'presentation_explanation', label: 'B1. Presentation & Explanation', weight: 0.10, desc: 'Clear explanation, audience engagement' },
            { field: 'subject_knowledge', label: 'B2. Subject Knowledge & Question Handling', weight: 0.15, desc: 'Deep understanding, confident Q&A responses' },
        ],
    },
    {
        category: 'C. Manuscript Quality',
        weight: '20%',
        color: '#d97706',
        items: [
            { field: 'manuscript_substantiation', label: 'C1. Scientific Substantiation', weight: 0.10, desc: 'Manuscript scientific rigor and evidence' },
            { field: 'manuscript_writing', label: 'C2. Logical & Systematic Writing', weight: 0.10, desc: 'Writing clarity, structure, grammar' },
        ],
    },
];

const scoreLabels = {
    1: 'Poor', 2: 'Below Average', 3: 'Average', 4: 'Fair',
    5: 'Satisfactory', 6: 'Good', 7: 'Very Good', 8: 'Excellent',
    9: 'Outstanding', 10: 'Perfect',
};

function getInterpretation(score) {
    if (score >= 9.0) return { label: 'Outstanding', color: '#16a34a', bg: '#dcfce7' };
    if (score >= 8.0) return { label: 'Excellent', color: '#059669', bg: '#ecfdf5' };
    if (score >= 7.0) return { label: 'Very Good', color: '#2563eb', bg: '#eff6ff' };
    if (score >= 6.0) return { label: 'Good', color: '#7c3aed', bg: '#faf5ff' };
    if (score >= 5.0) return { label: 'Fair', color: '#d97706', bg: '#fffbeb' };
    return { label: 'Needs Improvement', color: '#dc2626', bg: '#fef2f2' };
}

export default function ScoreForm({ submission, presentationScore, oralWeights, posterWeights }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const isOral = presentationScore.rubric_type === 'oral';
    const rubric = isOral ? ORAL_RUBRIC : POSTER_RUBRIC;

    // Initialize form with existing scores
    const initialData = {};
    rubric.forEach(cat => {
        cat.items.forEach(item => {
            initialData[item.field] = presentationScore[item.field] || '';
        });
    });
    initialData.juri_notes = presentationScore.juri_notes || '';

    const { data, setData, post, processing, errors } = useForm(initialData);

    // ── Live weighted score calculation ──
    const liveScore = useMemo(() => {
        let total = 0;
        let allFilled = true;
        const categoryScores = {};

        rubric.forEach(cat => {
            let catScore = 0;
            let catTotal = 0;
            let catFilled = true;

            cat.items.forEach(item => {
                const val = parseInt(data[item.field]);
                if (!val || isNaN(val)) {
                    allFilled = false;
                    catFilled = false;
                    return;
                }
                total += val * item.weight;
                catScore += val * item.weight;
                catTotal += item.weight;
            });

            categoryScores[cat.category] = {
                score: catScore,
                maxScore: catTotal * 10,
                filled: catFilled,
                percent: catTotal > 0 ? (catScore / (catTotal * 10)) * 100 : 0,
            };
        });

        return { total: Math.round(total * 100) / 100, allFilled, categoryScores };
    }, [data, rubric]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('juri.submissions.score', submission.id), {
            preserveScroll: true,
        });
    };

    const interp = getInterpretation(liveScore.total);
    const isAlreadyScored = !!presentationScore.weighted_final_score;

    return (
        <SidebarLayout>
            <Head title={`Score: ${submission.title}`} />

            <Box sx={{ p: { xs: 1.5, sm: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Chip
                            label={isOral ? 'ORAL' : 'POSTER'}
                            size="small"
                            sx={{
                                fontWeight: 700, fontSize: '0.75rem',
                                bgcolor: isOral
                                    ? (isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff')
                                    : (isDark ? 'rgba(147,51,234,0.15)' : '#faf5ff'),
                                color: isOral ? '#2563eb' : '#9333ea',
                            }}
                        />
                        {isAlreadyScored && (
                            <Chip
                                icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                                label="Already Scored"
                                size="small"
                                sx={{ fontWeight: 600, bgcolor: isDark ? 'rgba(22,163,74,0.12)' : '#dcfce7', color: '#16a34a' }}
                            />
                        )}
                    </Stack>
                    <Typography variant="h5" sx={{
                        fontWeight: 800, color: c.textPrimary,
                        fontSize: { xs: '1.2rem', sm: '1.5rem' },
                        letterSpacing: '-0.02em',
                    }}>
                        {submission.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75 }}>
                        <PersonIcon sx={{ fontSize: 16, color: c.textSecondary }} />
                        <Typography variant="body2" sx={{ color: c.textSecondary }}>
                            {submission.user?.name || 'Unknown Author'}
                        </Typography>
                    </Stack>
                </Box>

                {/* Live Score Preview — sticky on mobile */}
                <Card elevation={0} sx={{
                    borderRadius: '16px',
                    border: `2px solid ${interp.color}40`,
                    bgcolor: isDark ? `${interp.color}10` : interp.bg,
                    mb: 3,
                    position: { xs: 'sticky', sm: 'relative' },
                    top: { xs: 0 },
                    zIndex: { xs: 10 },
                }}>
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: 2,
                        }}>
                            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                <Typography variant="overline" sx={{ color: c.textSecondary, fontWeight: 600, letterSpacing: 1 }}>
                                    WEIGHTED FINAL SCORE
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                    <Typography variant="h3" sx={{
                                        fontWeight: 900, color: interp.color,
                                        fontSize: { xs: '2.2rem', sm: '2.8rem' },
                                        lineHeight: 1,
                                    }}>
                                        {liveScore.allFilled ? liveScore.total.toFixed(2) : '—'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: c.textSecondary }}>/10.0</Typography>
                                </Box>
                                {liveScore.allFilled && (
                                    <Chip
                                        label={interp.label}
                                        size="small"
                                        sx={{
                                            mt: 0.5, fontWeight: 700, bgcolor: `${interp.color}20`, color: interp.color,
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Category breakdown */}
                            <Stack spacing={1} sx={{ flex: 1, maxWidth: { sm: 350 } }}>
                                {rubric.map(cat => {
                                    const catScore = liveScore.categoryScores[cat.category];
                                    return (
                                        <Box key={cat.category}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: c.textSecondary, fontSize: '0.7rem' }}>
                                                    {cat.category.split('. ')[1] || cat.category} ({cat.weight})
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: cat.color, fontSize: '0.7rem' }}>
                                                    {catScore?.filled ? `${(catScore.percent).toFixed(0)}%` : '—'}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={catScore?.percent || 0}
                                                sx={{
                                                    height: 5, borderRadius: 3,
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 3, bgcolor: cat.color,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>

                {/* Scoring Form */}
                <form onSubmit={handleSubmit}>
                    {rubric.map((cat, catIdx) => (
                        <Accordion
                            key={cat.category}
                            defaultExpanded
                            elevation={0}
                            sx={{
                                borderRadius: '16px !important',
                                border: `1px solid ${c.cardBorder}`,
                                bgcolor: c.cardBg,
                                mb: 2,
                                '&::before': { display: 'none' },
                                overflow: 'hidden',
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    px: { xs: 2, sm: 3 },
                                    '& .MuiAccordionSummary-content': { my: 1.5 },
                                    bgcolor: isDark ? `${cat.color}10` : `${cat.color}08`,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                                    <Box sx={{
                                        width: 4, height: 32, borderRadius: 2,
                                        bgcolor: cat.color,
                                    }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.95rem' }}>
                                            {cat.category}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: c.textSecondary }}>
                                            Weight: {cat.weight} · {cat.items.length} criteria
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={cat.weight}
                                        size="small"
                                        sx={{
                                            fontWeight: 700, bgcolor: `${cat.color}15`, color: cat.color,
                                            display: { xs: 'none', sm: 'flex' },
                                        }}
                                    />
                                </Box>
                            </AccordionSummary>

                            <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 2.5 }}>
                                <Stack spacing={3}>
                                    {cat.items.map((item, idx) => (
                                        <Box key={item.field}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                justifyContent: 'space-between',
                                                alignItems: { xs: 'flex-start', sm: 'center' },
                                                mb: 1,
                                                gap: 0.5,
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: c.textPrimary }}>
                                                        {item.label}
                                                    </Typography>
                                                    <Tooltip title={item.desc} arrow placement="top">
                                                        <InfoOutlinedIcon sx={{ fontSize: 16, color: c.textSecondary, cursor: 'help' }} />
                                                    </Tooltip>
                                                </Box>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="caption" sx={{ color: c.textSecondary }}>
                                                        Weight: {(item.weight * 100).toFixed(0)}%
                                                    </Typography>
                                                    <Chip
                                                        label={data[item.field] ? `${data[item.field]}/10` : '—'}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700, minWidth: 50,
                                                            bgcolor: data[item.field]
                                                                ? `${cat.color}15`
                                                                : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                                                            color: data[item.field] ? cat.color : c.textSecondary,
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>

                                            {/* Score Slider */}
                                            <Box sx={{ px: { xs: 0.5, sm: 1 } }}>
                                                <Slider
                                                    value={parseInt(data[item.field]) || 0}
                                                    onChange={(e, val) => setData(item.field, val)}
                                                    min={0}
                                                    max={10}
                                                    step={1}
                                                    marks={[
                                                        { value: 1, label: '1' },
                                                        { value: 5, label: '5' },
                                                        { value: 10, label: '10' },
                                                    ]}
                                                    valueLabelDisplay="auto"
                                                    valueLabelFormat={(v) => v > 0 ? `${v} - ${scoreLabels[v] || ''}` : 'Not scored'}
                                                    sx={{
                                                        color: cat.color,
                                                        height: 8,
                                                        '& .MuiSlider-thumb': {
                                                            width: 24, height: 24,
                                                            bgcolor: '#fff',
                                                            border: `3px solid ${cat.color}`,
                                                            boxShadow: `0 2px 8px ${cat.color}40`,
                                                            '&:hover, &.Mui-focusVisible': {
                                                                boxShadow: `0 0 0 8px ${cat.color}20`,
                                                            },
                                                        },
                                                        '& .MuiSlider-track': {
                                                            borderRadius: 4,
                                                        },
                                                        '& .MuiSlider-rail': {
                                                            opacity: 0.3,
                                                        },
                                                        '& .MuiSlider-mark': {
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1',
                                                            width: 2, height: 8,
                                                        },
                                                        '& .MuiSlider-markLabel': {
                                                            fontSize: '0.7rem',
                                                            color: c.textSecondary,
                                                        },
                                                    }}
                                                />
                                            </Box>

                                            {data[item.field] > 0 && (
                                                <Typography variant="caption" sx={{
                                                    color: cat.color, fontWeight: 600, pl: 1,
                                                }}>
                                                    {scoreLabels[data[item.field]]} — Weighted: {(data[item.field] * item.weight).toFixed(2)}
                                                </Typography>
                                            )}

                                            {errors[item.field] && (
                                                <Typography variant="caption" sx={{ color: 'error.main', pl: 1 }}>
                                                    {errors[item.field]}
                                                </Typography>
                                            )}

                                            {idx < cat.items.length - 1 && <Divider sx={{ mt: 2 }} />}
                                        </Box>
                                    ))}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    ))}

                    {/* Notes */}
                    <Card elevation={0} sx={{
                        borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, mb: 3,
                    }}>
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: c.textPrimary, mb: 1.5 }}>
                                📝 Juri Notes (Optional)
                            </Typography>
                            <TextField
                                multiline
                                rows={4}
                                fullWidth
                                placeholder="Add any notes or comments about this presentation..."
                                value={data.juri_notes}
                                onChange={(e) => setData('juri_notes', e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                }}
                            />
                            {errors.juri_notes && (
                                <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                                    {errors.juri_notes}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <Box sx={{
                        position: { xs: 'sticky', sm: 'relative' },
                        bottom: { xs: 0 },
                        bgcolor: c.surfaceBg,
                        py: { xs: 2, sm: 0 },
                        px: { xs: 0 },
                        zIndex: { xs: 10 },
                    }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            startIcon={processing ? null : (isAlreadyScored ? <SaveIcon /> : <GavelIcon />)}
                            fullWidth
                            sx={{
                                background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                                py: 1.5,
                                borderRadius: '14px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '1rem',
                                boxShadow: '0 4px 16px rgba(217, 119, 6, 0.35)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                                    boxShadow: '0 6px 24px rgba(217, 119, 6, 0.45)',
                                    transform: 'translateY(-1px)',
                                },
                                '&:disabled': {
                                    background: '#94a3b8',
                                },
                                transition: 'all 0.25s ease',
                            }}
                        >
                            {processing ? 'Submitting...' : isAlreadyScored ? 'Update Scores' : 'Submit Scores'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </SidebarLayout>
    );
}
