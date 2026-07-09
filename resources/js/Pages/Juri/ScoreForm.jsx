import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Button, Slider, TextField,
    Stack, Divider, useTheme, Accordion, AccordionSummary, AccordionDetails,
    Alert, LinearProgress, Tooltip, Table, TableBody, TableCell, TableRow,
    TableContainer, TableHead, Paper, IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';

// ── ISO-Aligned Score Descriptors ──
const SCORE_DESCRIPTORS = [
    { range: '9–10', label: 'Exceptional', desc: 'Far exceeds expectations; demonstrates outstanding quality, originality, and scientific rigor', color: '#16a34a' },
    { range: '7–8', label: 'Good', desc: 'Meets and partially exceeds expectations; solid quality with minor improvements possible', color: '#2563eb' },
    { range: '5–6', label: 'Acceptable', desc: 'Meets minimum expectations; adequate quality but notable areas for improvement', color: '#d97706' },
    { range: '3–4', label: 'Below Standard', desc: 'Does not fully meet expectations; significant improvements required', color: '#ea580c' },
    { range: '1–2', label: 'Unsatisfactory', desc: 'Fails to meet expectations; fundamental deficiencies observed', color: '#dc2626' },
];

// ── Rubric Definitions (Oral Presentation — 55th PIT IAGI & GEOSEA XIX 2026) ──
const ORAL_RUBRIC = [
    {
        category: 'A. Presentation Delivery',
        weight: '30%',
        weightDecimal: 0.30,
        color: '#2563eb',
        items: [
            { field: 'time_management', label: 'A1. Time Management', weight: 0.05, desc: 'Adherence to allotted time; effective pacing and transitions between presentation segments' },
            { field: 'posture_professionalism', label: 'A2. Posture & Professionalism', weight: 0.10, desc: 'Professional demeanor, appropriate attire, confident body language and stage presence' },
            { field: 'communication_skills', label: 'A3. Communication Skills', weight: 0.15, desc: 'Clarity of articulation, audience engagement, appropriate eye contact, and effective use of verbal/non-verbal cues' },
        ],
    },
    {
        category: 'B. Presentation Content',
        weight: '50%',
        weightDecimal: 0.50,
        color: '#059669',
        items: [
            { field: 'scientific_substantiation', label: 'B1. Scientific Substantiation', weight: 0.15, desc: 'Strength of scientific foundation; proper use of data, evidence, references, and methodology to support claims' },
            { field: 'technical_contribution', label: 'B2. Technical/Scientific Contribution', weight: 0.10, desc: 'Significance of novel findings, technical advancement, or contribution to the field of geoscience' },
            { field: 'logical_organization', label: 'B3. Logical & Systematic Organization', weight: 0.10, desc: 'Well-structured presentation with clear introduction, methodology, results, discussion, and conclusion' },
            { field: 'visual_quality', label: 'B4. Visual Quality', weight: 0.05, desc: 'Quality of slides, charts, figures, and visual aids; readability and professional design standards' },
            { field: 'originality_innovation', label: 'B5. Originality & Innovation', weight: 0.10, desc: 'Degree of original approach, innovative methodologies, novel interpretation, or creative problem-solving' },
        ],
    },
    {
        category: 'C. Manuscript Quality',
        weight: '20%',
        weightDecimal: 0.20,
        color: '#d97706',
        items: [
            { field: 'manuscript_substantiation', label: 'C1. Scientific Substantiation', weight: 0.10, desc: 'Scientific rigor of the written manuscript; strength of evidence, methodology documentation, and data integrity' },
            { field: 'manuscript_writing', label: 'C2. Logical & Systematic Writing', weight: 0.10, desc: 'Writing clarity, grammatical accuracy, proper structure following scientific writing standards (IMRaD)' },
        ],
    },
];

const POSTER_RUBRIC = [
    {
        category: 'A. Poster Quality',
        weight: '55%',
        weightDecimal: 0.55,
        color: '#9333ea',
        items: [
            { field: 'poster_scientific_substantiation', label: 'A1. Scientific Substantiation', weight: 0.15, desc: 'Strength of scientific foundation; proper use of data, evidence, references, and methodology' },
            { field: 'practical_usefulness', label: 'A2. Practical Usefulness & Significance', weight: 0.10, desc: 'Real-world applicability, industry relevance, and potential impact of the research' },
            { field: 'poster_technical_contribution', label: 'A3. Technical/Scientific Contribution', weight: 0.10, desc: 'Significance of novel findings, advancement to the field of geoscience' },
            { field: 'poster_organization_design', label: 'A4. Poster Organization & Visual Design', weight: 0.10, desc: 'Layout, typography, color scheme, readability, information hierarchy, and professional design quality' },
            { field: 'poster_originality', label: 'A5. Originality & Authenticity', weight: 0.10, desc: 'Original approach, authentic data, proper attribution, and ethical research practices' },
        ],
    },
    {
        category: 'B. Presenter Quality',
        weight: '25%',
        weightDecimal: 0.25,
        color: '#2563eb',
        items: [
            { field: 'presentation_explanation', label: 'B1. Presentation & Explanation', weight: 0.10, desc: 'Clarity of verbal explanation, ability to engage visitors, and effective communication of key findings' },
            { field: 'subject_knowledge', label: 'B2. Subject Knowledge & Question Handling', weight: 0.15, desc: 'Depth of understanding, confidence in addressing questions, and ability to discuss beyond presented material' },
        ],
    },
    {
        category: 'C. Manuscript Quality',
        weight: '20%',
        weightDecimal: 0.20,
        color: '#d97706',
        items: [
            { field: 'manuscript_substantiation', label: 'C1. Scientific Substantiation', weight: 0.10, desc: 'Scientific rigor of the written manuscript; strength of evidence and methodology documentation' },
            { field: 'manuscript_writing', label: 'C2. Logical & Systematic Writing', weight: 0.10, desc: 'Writing clarity, grammatical accuracy, proper structure following scientific writing standards (IMRaD)' },
        ],
    },
];

function getInterpretation(score) {
    if (score >= 9.0) return { label: 'Exceptional', color: '#16a34a', bg: '#dcfce7', icon: '🏆' };
    if (score >= 7.0) return { label: 'Good', color: '#2563eb', bg: '#eff6ff', icon: '✅' };
    if (score >= 5.0) return { label: 'Acceptable', color: '#d97706', bg: '#fffbeb', icon: '📋' };
    if (score >= 3.0) return { label: 'Below Standard', color: '#ea580c', bg: '#fff7ed', icon: '⚠️' };
    return { label: 'Unsatisfactory', color: '#dc2626', bg: '#fef2f2', icon: '❌' };
}

function ScoreInput({ value, onChange, color, isDark, c }) {
    const numVal = parseInt(value) || 0;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, width: '100%' }}>
            <Box sx={{ flex: 1 }}>
                <Slider
                    value={numVal}
                    onChange={(e, val) => onChange(val)}
                    min={0}
                    max={10}
                    step={1}
                    marks={[
                        { value: 1, label: '1' },
                        { value: 3 },
                        { value: 5, label: '5' },
                        { value: 7 },
                        { value: 10, label: '10' },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(v) => {
                        if (v === 0) return 'Not scored';
                        if (v >= 9) return `${v} — Exceptional`;
                        if (v >= 7) return `${v} — Good`;
                        if (v >= 5) return `${v} — Acceptable`;
                        if (v >= 3) return `${v} — Below Standard`;
                        return `${v} — Unsatisfactory`;
                    }}
                    sx={{
                        color: color,
                        height: 6,
                        '& .MuiSlider-thumb': {
                            width: 22, height: 22,
                            bgcolor: '#fff',
                            border: `3px solid ${color}`,
                            boxShadow: `0 2px 6px ${color}30`,
                            '&:hover, &.Mui-focusVisible': { boxShadow: `0 0 0 6px ${color}15` },
                        },
                        '& .MuiSlider-track': { borderRadius: 3 },
                        '& .MuiSlider-rail': { opacity: 0.2 },
                        '& .MuiSlider-mark': { bgcolor: isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1', width: 2, height: 6 },
                        '& .MuiSlider-markLabel': { fontSize: '0.65rem', color: c.textSecondary },
                    }}
                />
            </Box>
            <TextField
                value={numVal || ''}
                onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!e.target.value) onChange(0);
                    else if (v >= 1 && v <= 10) onChange(v);
                }}
                type="number"
                inputProps={{ min: 1, max: 10, style: { textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' } }}
                size="small"
                sx={{
                    width: 60, flexShrink: 0,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px', height: 40,
                        bgcolor: numVal ? `${color}10` : 'transparent',
                        '& fieldset': { borderColor: numVal ? color : c.cardBorder },
                    },
                }}
            />
        </Box>
    );
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
        let filledCount = 0;
        let totalCount = 0;
        const categoryScores = {};

        rubric.forEach(cat => {
            let catScore = 0;
            let catTotal = 0;
            let catFilled = true;

            cat.items.forEach(item => {
                totalCount++;
                const val = parseInt(data[item.field]);
                if (!val || isNaN(val)) {
                    allFilled = false;
                    catFilled = false;
                    return;
                }
                filledCount++;
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

        return { total: Math.round(total * 100) / 100, allFilled, categoryScores, filledCount, totalCount };
    }, [data, rubric]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('juri.submissions.score', submission.id), { preserveScroll: true });
    };

    const interp = getInterpretation(liveScore.total);
    const isAlreadyScored = !!presentationScore.weighted_final_score;
    const totalCriteria = rubric.reduce((sum, cat) => sum + cat.items.length, 0);
    const completionPercent = Math.round((liveScore.filledCount / liveScore.totalCount) * 100);

    return (
        <SidebarLayout>
            <Head title={`Evaluation: ${submission.title}`} />

            <Box sx={{ p: { xs: 1.5, sm: 3 }, minHeight: '100vh', bgcolor: c.surfaceBg, maxWidth: 900, mx: 'auto' }}>

                {/* ── Header: Conference & Form Identity ── */}
                <Card elevation={0} sx={{
                    borderRadius: '16px', border: `1px solid ${c.cardBorder}`,
                    bgcolor: c.cardBg, mb: 2, overflow: 'hidden',
                }}>
                    <Box sx={{
                        background: 'linear-gradient(135deg, #0d4a3a 0%, #1a7a5a 50%, #0d4a3a 100%)',
                        py: { xs: 2, sm: 2.5 }, px: { xs: 2, sm: 3 },
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <Typography variant="overline" sx={{
                                    color: 'rgba(255,255,255,0.7)', fontWeight: 600,
                                    letterSpacing: '0.12em', fontSize: '0.65rem',
                                }}>
                                    55th PIT IAGI & GEOSEA XIX 2026
                                </Typography>
                                <Typography variant="h6" sx={{
                                    color: '#fff', fontWeight: 800,
                                    fontSize: { xs: '1rem', sm: '1.15rem' },
                                    letterSpacing: '-0.01em',
                                }}>
                                    {isOral ? 'Oral Presentation' : 'Poster Presentation'} Evaluation Form
                                </Typography>
                            </Box>
                            <Chip
                                icon={<VerifiedIcon sx={{ fontSize: 14, color: '#fff !important' }} />}
                                label={isOral ? 'ORAL' : 'POSTER'}
                                size="small"
                                sx={{
                                    fontWeight: 700, fontSize: '0.7rem',
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    color: '#fff', mt: 0.5,
                                    backdropFilter: 'blur(4px)',
                                }}
                            />
                        </Stack>
                    </Box>

                    {/* Submission Details */}
                    <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6rem' }}>
                                    Paper Title
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: c.textPrimary, mt: 0.25, lineHeight: 1.4 }}>
                                    {submission.title}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6rem' }}>
                                    Author(s)
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary, mt: 0.25 }}>
                                    {submission.user?.name || 'Unknown'}
                                </Typography>
                                {submission.co_authors && (
                                    <Typography variant="caption" sx={{ color: c.textSecondary }}>
                                        Co-authors: {submission.co_authors}
                                    </Typography>
                                )}
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6rem' }}>
                                    Evaluation Status
                                </Typography>
                                <Chip
                                    icon={isAlreadyScored ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : undefined}
                                    label={isAlreadyScored ? 'Scored — Editable' : 'Pending Evaluation'}
                                    size="small"
                                    sx={{
                                        display: 'flex', width: 'fit-content', mt: 0.5,
                                        fontWeight: 600, height: 24,
                                        bgcolor: isAlreadyScored
                                            ? (isDark ? 'rgba(22,163,74,0.12)' : '#dcfce7')
                                            : (isDark ? 'rgba(234,88,12,0.12)' : '#fff7ed'),
                                        color: isAlreadyScored ? '#16a34a' : '#ea580c',
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6rem' }}>
                                    Completion
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={completionPercent}
                                        sx={{
                                            height: 6, borderRadius: 3, flex: 1,
                                            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 3,
                                                bgcolor: completionPercent === 100 ? '#16a34a' : '#d97706',
                                            },
                                        }}
                                    />
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: c.textPrimary, minWidth: 45 }}>
                                        {liveScore.filledCount}/{liveScore.totalCount}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* ── Scoring Guide ── */}
                <Accordion
                    elevation={0}
                    sx={{
                        borderRadius: '14px !important', mb: 2,
                        border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg,
                        '&::before': { display: 'none' },
                    }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: { xs: 2, sm: 3 }, minHeight: 48, '& .MuiAccordionSummary-content': { my: 1 } }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AssignmentIcon sx={{ fontSize: 18, color: '#1abc9c' }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.85rem' }}>
                                Scoring Guidelines & Scale Reference
                            </Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 2.5, pt: 0 }}>
                        <Alert severity="info" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.78rem' }}>
                            Rate each criterion on a scale of <strong>1–10</strong>. Scores are multiplied by their respective weights to calculate the Weighted Final Score. All criteria must be scored before submission.
                        </Alert>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: c.textPrimary, py: 0.75 }}>SCALE</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: c.textPrimary, py: 0.75 }}>CLASSIFICATION</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: c.textPrimary, py: 0.75, display: { xs: 'none', sm: 'table-cell' } }}>DESCRIPTION</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {SCORE_DESCRIPTORS.map(d => (
                                        <TableRow key={d.range}>
                                            <TableCell sx={{ py: 0.75, border: 0 }}>
                                                <Chip label={d.range} size="small" sx={{ fontWeight: 700, bgcolor: `${d.color}12`, color: d.color, fontSize: '0.7rem', height: 22 }} />
                                            </TableCell>
                                            <TableCell sx={{ py: 0.75, border: 0, fontWeight: 600, color: d.color, fontSize: '0.78rem' }}>
                                                {d.label}
                                            </TableCell>
                                            <TableCell sx={{ py: 0.75, border: 0, fontSize: '0.72rem', color: c.textSecondary, display: { xs: 'none', sm: 'table-cell' } }}>
                                                {d.desc}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Weight Summary Table */}
                        <Typography variant="caption" sx={{ fontWeight: 700, color: c.textPrimary, mt: 2, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Weight Distribution
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {rubric.map(cat => (
                                <Chip
                                    key={cat.category}
                                    label={`${cat.category.split('. ')[1]} — ${cat.weight}`}
                                    size="small"
                                    sx={{
                                        fontWeight: 600, fontSize: '0.7rem',
                                        bgcolor: `${cat.color}10`, color: cat.color,
                                        border: `1px solid ${cat.color}30`,
                                    }}
                                />
                            ))}
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                {/* ── Live Score Preview — sticky on mobile ── */}
                <Card elevation={0} sx={{
                    borderRadius: '14px',
                    border: `2px solid ${liveScore.allFilled ? interp.color : c.cardBorder}`,
                    bgcolor: liveScore.allFilled ? (isDark ? `${interp.color}08` : interp.bg) : c.cardBg,
                    mb: 2,
                    position: { xs: 'sticky', sm: 'relative' },
                    top: { xs: 0 }, zIndex: { xs: 10 },
                    transition: 'all 0.4s ease',
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
                                <Typography variant="overline" sx={{ color: c.textSecondary, fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.6rem' }}>
                                    WEIGHTED FINAL SCORE
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                    <Typography sx={{
                                        fontWeight: 900, lineHeight: 1,
                                        fontSize: { xs: '2.2rem', sm: '2.6rem' },
                                        color: liveScore.allFilled ? interp.color : c.textSecondary,
                                        fontFamily: '"Inter", "Roboto", sans-serif',
                                    }}>
                                        {liveScore.allFilled ? liveScore.total.toFixed(2) : '—'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: c.textSecondary, fontWeight: 500 }}>/10.00</Typography>
                                </Box>
                                {liveScore.allFilled && (
                                    <Chip
                                        label={`${interp.icon} ${interp.label}`}
                                        size="small"
                                        sx={{ mt: 0.5, fontWeight: 700, bgcolor: `${interp.color}15`, color: interp.color }}
                                    />
                                )}
                            </Box>

                            {/* Category breakdown */}
                            <Stack spacing={0.75} sx={{ flex: 1, maxWidth: { sm: 320 } }}>
                                {rubric.map(cat => {
                                    const catScore = liveScore.categoryScores[cat.category];
                                    return (
                                        <Box key={cat.category}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: c.textSecondary, fontSize: '0.65rem' }}>
                                                    {cat.category.split('. ')[1]} ({cat.weight})
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: cat.color, fontSize: '0.65rem' }}>
                                                    {catScore?.filled ? `${catScore.percent.toFixed(0)}%` : '—'}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={catScore?.percent || 0}
                                                sx={{
                                                    height: 4, borderRadius: 2,
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                                                    '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: cat.color },
                                                }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>

                {/* ── Scoring Rubric Form ── */}
                <form onSubmit={handleSubmit}>
                    {rubric.map((cat) => (
                        <Accordion
                            key={cat.category}
                            defaultExpanded
                            elevation={0}
                            sx={{
                                borderRadius: '14px !important',
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
                                    bgcolor: isDark ? `${cat.color}08` : `${cat.color}05`,
                                    borderBottom: `1px solid ${c.cardBorder}`,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                                    <Box sx={{ width: 4, height: 36, borderRadius: 2, bgcolor: cat.color }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.9rem' }}>
                                            {cat.category}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.7rem' }}>
                                            Weight: {cat.weight} • {cat.items.length} criteria
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={cat.weight}
                                        size="small"
                                        sx={{ fontWeight: 700, bgcolor: `${cat.color}12`, color: cat.color, display: { xs: 'none', sm: 'flex' } }}
                                    />
                                </Box>
                            </AccordionSummary>

                            <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 2.5, pt: 2 }}>
                                <Stack spacing={3}>
                                    {cat.items.map((item, idx) => {
                                        const val = parseInt(data[item.field]) || 0;
                                        const itemInterp = val > 0 ? getInterpretation(val) : null;

                                        return (
                                            <Box key={item.field}>
                                                {/* Criterion header */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                    justifyContent: 'space-between',
                                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                                    mb: 1.5, gap: 0.5,
                                                }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.85rem' }}>
                                                                {item.label}
                                                            </Typography>
                                                            <Tooltip title={item.desc} arrow placement="top" enterTouchDelay={0}>
                                                                <InfoOutlinedIcon sx={{ fontSize: 15, color: c.textSecondary, cursor: 'help' }} />
                                                            </Tooltip>
                                                        </Box>
                                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.72rem', display: { xs: 'none', sm: 'block' } }}>
                                                            {item.desc}
                                                        </Typography>
                                                    </Box>
                                                    <Stack direction="row" spacing={0.75} alignItems="center" flexShrink={0}>
                                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 600, fontSize: '0.7rem' }}>
                                                            Weight: {(item.weight * 100).toFixed(0)}%
                                                        </Typography>
                                                        {val > 0 && (
                                                            <Chip
                                                                label={itemInterp.label}
                                                                size="small"
                                                                sx={{
                                                                    height: 20, fontSize: '0.6rem', fontWeight: 700,
                                                                    bgcolor: `${itemInterp.color}10`, color: itemInterp.color,
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>
                                                </Box>

                                                {/* Score Input */}
                                                <ScoreInput
                                                    value={data[item.field]}
                                                    onChange={(val) => setData(item.field, val)}
                                                    color={cat.color}
                                                    isDark={isDark}
                                                    c={c}
                                                />

                                                {val > 0 && (
                                                    <Typography variant="caption" sx={{ color: cat.color, fontWeight: 600, mt: 0.5, display: 'block', fontSize: '0.72rem' }}>
                                                        Weighted contribution: {(val * item.weight).toFixed(2)} pts ({((val * item.weight / 10) * 100).toFixed(1)}% of max)
                                                    </Typography>
                                                )}

                                                {errors[item.field] && (
                                                    <Typography variant="caption" sx={{ color: 'error.main', display: 'block' }}>
                                                        {errors[item.field]}
                                                    </Typography>
                                                )}

                                                {idx < cat.items.length - 1 && <Divider sx={{ mt: 2 }} />}
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    ))}

                    {/* ── Juri Notes ── */}
                    <Card elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, mb: 3 }}>
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.textPrimary, mb: 0.5 }}>
                                Evaluator Notes
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textSecondary, mb: 1.5, display: 'block', fontSize: '0.72rem' }}>
                                Optional. Provide constructive feedback, commendations, or specific recommendations for the presenter.
                            </Typography>
                            <TextField
                                multiline
                                rows={4}
                                fullWidth
                                placeholder="Enter evaluation notes here (optional)..."
                                value={data.juri_notes}
                                onChange={(e) => setData('juri_notes', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.85rem' } }}
                            />
                            {errors.juri_notes && (
                                <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>{errors.juri_notes}</Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* ── Submit ── */}
                    <Box sx={{
                        position: { xs: 'sticky', sm: 'relative' },
                        bottom: { xs: 0 }, bgcolor: c.surfaceBg,
                        py: { xs: 2, sm: 0 }, zIndex: { xs: 10 },
                    }}>
                        {!liveScore.allFilled && (
                            <Alert severity="warning" sx={{ mb: 1.5, borderRadius: '10px', fontSize: '0.78rem' }}>
                                {liveScore.totalCount - liveScore.filledCount} criteria remaining. All criteria must be scored before submission.
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing || !liveScore.allFilled}
                            startIcon={processing ? null : (isAlreadyScored ? <SaveIcon /> : <GavelIcon />)}
                            fullWidth
                            sx={{
                                background: liveScore.allFilled
                                    ? 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)'
                                    : '#94a3b8',
                                py: 1.5, borderRadius: '14px', textTransform: 'none',
                                fontWeight: 700, fontSize: '0.95rem',
                                boxShadow: liveScore.allFilled ? '0 4px 16px rgba(26, 188, 156, 0.35)' : 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)',
                                    boxShadow: '0 6px 24px rgba(26, 188, 156, 0.45)',
                                    transform: 'translateY(-1px)',
                                },
                                '&:disabled': { background: '#94a3b8', boxShadow: 'none', transform: 'none' },
                                transition: 'all 0.25s ease',
                            }}
                        >
                            {processing ? 'Submitting Evaluation...' : isAlreadyScored ? 'Update Evaluation' : 'Submit Evaluation'}
                        </Button>
                        <Typography variant="caption" sx={{ color: c.textSecondary, textAlign: 'center', mt: 1, display: 'block', fontSize: '0.68rem' }}>
                            By submitting, you confirm that this evaluation was conducted independently and objectively in accordance with the conference evaluation guidelines.
                        </Typography>
                    </Box>
                </form>
            </Box>
        </SidebarLayout>
    );
}
