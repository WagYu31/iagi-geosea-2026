import React, { useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Button, Slider, TextField,
    Stack, Divider, useTheme, Alert, LinearProgress, Tooltip,
    Table, TableBody, TableCell, TableRow, TableContainer, TableHead,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// ── Rubric Definitions ──
const ORAL_RUBRIC = [
    {
        category: 'A. Presentation Delivery',
        weight: '30%',
        color: '#1e40af',
        items: [
            { field: 'time_management', label: 'A1. Time Management', weight: 0.05, desc: 'Adherence to allotted time; effective pacing and transitions' },
            { field: 'posture_professionalism', label: 'A2. Posture & Professionalism', weight: 0.10, desc: 'Professional demeanor, appropriate attire, confident body language' },
            { field: 'communication_skills', label: 'A3. Communication Skills', weight: 0.15, desc: 'Clarity, audience engagement, eye contact, verbal/non-verbal cues' },
        ],
    },
    {
        category: 'B. Presentation Content',
        weight: '50%',
        color: '#065f46',
        items: [
            { field: 'scientific_substantiation', label: 'B1. Scientific Substantiation', weight: 0.15, desc: 'Strength of scientific foundation; data, evidence, methodology' },
            { field: 'technical_contribution', label: 'B2. Technical/Scientific Contribution', weight: 0.10, desc: 'Novel findings, technical advancement to geoscience' },
            { field: 'logical_organization', label: 'B3. Logical & Systematic Organization', weight: 0.10, desc: 'Well-structured with clear introduction, methods, results, conclusion' },
            { field: 'visual_quality', label: 'B4. Visual Quality', weight: 0.05, desc: 'Slide design, charts, figures quality and readability' },
            { field: 'originality_innovation', label: 'B5. Originality & Innovation', weight: 0.10, desc: 'Novel approach, innovative methodologies, creative problem-solving' },
        ],
    },
    {
        category: 'C. Manuscript Quality',
        weight: '20%',
        color: '#92400e',
        items: [
            { field: 'manuscript_substantiation', label: 'C1. Scientific Substantiation', weight: 0.10, desc: 'Manuscript scientific rigor, evidence, methodology documentation' },
            { field: 'manuscript_writing', label: 'C2. Logical & Systematic Writing', weight: 0.10, desc: 'Writing clarity, grammar, structure following IMRaD standards' },
        ],
    },
];

const POSTER_RUBRIC = [
    {
        category: 'A. Poster Quality',
        weight: '55%',
        color: '#6b21a8',
        items: [
            { field: 'poster_scientific_substantiation', label: 'A1. Scientific Substantiation', weight: 0.15, desc: 'Strength of scientific foundation; data, evidence, methodology' },
            { field: 'practical_usefulness', label: 'A2. Practical Usefulness & Significance', weight: 0.10, desc: 'Real-world applicability, industry relevance, research impact' },
            { field: 'poster_technical_contribution', label: 'A3. Technical/Scientific Contribution', weight: 0.10, desc: 'Novel findings, advancement to geoscience field' },
            { field: 'poster_organization_design', label: 'A4. Poster Organization & Visual Design', weight: 0.10, desc: 'Layout, typography, color scheme, readability, information hierarchy' },
            { field: 'poster_originality', label: 'A5. Originality & Authenticity', weight: 0.10, desc: 'Original approach, authentic data, proper attribution' },
        ],
    },
    {
        category: 'B. Presenter Quality',
        weight: '25%',
        color: '#1e40af',
        items: [
            { field: 'presentation_explanation', label: 'B1. Presentation & Explanation', weight: 0.10, desc: 'Clarity of verbal explanation, visitor engagement, key findings communication' },
            { field: 'subject_knowledge', label: 'B2. Subject Knowledge & Q&A', weight: 0.15, desc: 'Understanding depth, confidence in Q&A, ability to discuss beyond material' },
        ],
    },
    {
        category: 'C. Manuscript Quality',
        weight: '20%',
        color: '#92400e',
        items: [
            { field: 'manuscript_substantiation', label: 'C1. Scientific Substantiation', weight: 0.10, desc: 'Scientific rigor, evidence, methodology documentation' },
            { field: 'manuscript_writing', label: 'C2. Logical & Systematic Writing', weight: 0.10, desc: 'Writing clarity, grammar, IMRaD structure compliance' },
        ],
    },
];

function getInterpretation(score) {
    if (score >= 9.0) return { label: 'Exceptional', color: '#16a34a' };
    if (score >= 7.0) return { label: 'Good', color: '#1e40af' };
    if (score >= 5.0) return { label: 'Acceptable', color: '#d97706' };
    if (score >= 3.0) return { label: 'Below Standard', color: '#ea580c' };
    return { label: 'Unsatisfactory', color: '#dc2626' };
}

export default function ScoreForm({ submission, presentationScore }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const isOral = presentationScore.rubric_type === 'oral';
    const rubric = isOral ? ORAL_RUBRIC : POSTER_RUBRIC;

    const initialData = {};
    rubric.forEach(cat => cat.items.forEach(item => { initialData[item.field] = presentationScore[item.field] || ''; }));
    initialData.juri_notes = presentationScore.juri_notes || '';
    const { data, setData, post, processing, errors } = useForm(initialData);

    const liveScore = useMemo(() => {
        let total = 0, allFilled = true, filledCount = 0, totalCount = 0;
        const categoryScores = {};
        rubric.forEach(cat => {
            let catWeightedSum = 0, catFilled = true;
            cat.items.forEach(item => {
                totalCount++;
                const val = parseInt(data[item.field]);
                if (!val || isNaN(val)) { allFilled = false; catFilled = false; return; }
                filledCount++;
                total += val * item.weight;
                catWeightedSum += val * item.weight;
            });
            const catMaxWeighted = cat.items.reduce((s, i) => s + i.weight * 10, 0);
            categoryScores[cat.category] = {
                weightedSum: catWeightedSum,
                maxWeighted: catMaxWeighted,
                filled: catFilled,
                percent: catMaxWeighted > 0 ? (catWeightedSum / catMaxWeighted) * 100 : 0,
            };
        });
        return { total: Math.round(total * 100) / 100, allFilled, categoryScores, filledCount, totalCount };
    }, [data, rubric]);

    const handleSubmit = (e) => { e.preventDefault(); post(route('juri.submissions.score', submission.id), { preserveScroll: true }); };
    const interp = getInterpretation(liveScore.total);
    const isAlreadyScored = !!presentationScore.weighted_final_score;

    // ── Border styling helper ──
    const formBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
    const sectionBg = isDark ? 'rgba(255,255,255,0.02)' : '#fafbfc';

    return (
        <SidebarLayout>
            <Head title={`Evaluation — ${submission.title}`} />
            <Box sx={{ p: { xs: 1.5, sm: 3 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                <Box sx={{ maxWidth: 820, mx: 'auto' }}>

                    {/* ═══ DOCUMENT HEADER ═══ */}
                    <Box sx={{
                        border: formBorder,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        mb: 2.5,
                        bgcolor: c.cardBg,
                    }}>
                        {/* Title bar */}
                        <Box sx={{
                            background: isDark
                                ? 'linear-gradient(135deg, #0f3329 0%, #1a4a3a 100%)'
                                : 'linear-gradient(135deg, #0c4a3a 0%, #1a7a5a 50%, #0c4a3a 100%)',
                            px: { xs: 2.5, sm: 3.5 },
                            py: { xs: 2, sm: 2.5 },
                        }}>
                            <Typography sx={{
                                color: 'rgba(255,255,255,0.6)', fontWeight: 500,
                                fontSize: '0.68rem', letterSpacing: '0.15em',
                                textTransform: 'uppercase', mb: 0.5,
                            }}>
                                55th PIT IAGI & GEOSEA XIX 2026
                            </Typography>
                            <Typography sx={{
                                color: '#fff', fontWeight: 800,
                                fontSize: { xs: '1.05rem', sm: '1.25rem' },
                                letterSpacing: '-0.01em',
                            }}>
                                {isOral ? 'Oral Presentation' : 'Poster Presentation'} — Evaluation Form
                            </Typography>
                        </Box>

                        {/* Metadata grid */}
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            borderTop: formBorder,
                        }}>
                            {[
                                { label: 'Paper Title', value: submission.title, span: true },
                                { label: 'Author(s)', value: submission.user?.name || '—' },
                                { label: 'Category', value: isOral ? 'Oral Presentation' : 'Poster Presentation' },
                                { label: 'Submission ID', value: `#${submission.id}` },
                                { label: 'Status', value: isAlreadyScored ? '✓ Scored' : '○ Pending', color: isAlreadyScored ? '#16a34a' : '#d97706' },
                            ].map((field, i) => (
                                <Box key={i} sx={{
                                    px: { xs: 2.5, sm: 3 }, py: 1.5,
                                    borderBottom: formBorder,
                                    borderRight: { xs: 'none', sm: (i % 2 === 0 && !field.span) ? formBorder : 'none' },
                                    gridColumn: field.span ? { sm: '1 / -1' } : undefined,
                                }}>
                                    <Typography sx={{
                                        fontSize: '0.6rem', fontWeight: 600, color: c.textSecondary,
                                        textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.25,
                                    }}>
                                        {field.label}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: '0.82rem', fontWeight: 600,
                                        color: field.color || c.textPrimary,
                                        lineHeight: 1.4,
                                    }}>
                                        {field.value}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* ═══ SCORING SCALE REFERENCE ═══ */}
                    <Box sx={{
                        border: formBorder, borderRadius: '12px',
                        overflow: 'hidden', mb: 2.5, bgcolor: c.cardBg,
                    }}>
                        <Box sx={{
                            px: { xs: 2.5, sm: 3 }, py: 1.25,
                            bgcolor: sectionBg, borderBottom: formBorder,
                        }}>
                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: c.textPrimary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Scoring Scale Reference
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                        }}>
                            {[
                                { range: '9–10', label: 'Exceptional', color: '#16a34a' },
                                { range: '7–8', label: 'Good', color: '#1e40af' },
                                { range: '5–6', label: 'Acceptable', color: '#d97706' },
                                { range: '3–4', label: 'Below Std.', color: '#ea580c' },
                                { range: '1–2', label: 'Unsatisfactory', color: '#dc2626' },
                            ].map((s, i) => (
                                <Box key={i} sx={{
                                    flex: 1,
                                    textAlign: 'center',
                                    py: 1.25,
                                    px: 1,
                                    borderRight: { xs: 'none', sm: i < 4 ? formBorder : 'none' },
                                    borderBottom: { xs: i < 4 ? formBorder : 'none', sm: 'none' },
                                }}>
                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                                        {s.range}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, color: s.color, mt: 0.25, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                        {s.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* ═══ LIVE SCORE — sticky on mobile ═══ */}
                    <Box sx={{
                        border: `2px solid ${liveScore.allFilled ? interp.color : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0')}`,
                        borderRadius: '12px',
                        bgcolor: c.cardBg,
                        mb: 2.5,
                        position: { xs: 'sticky', sm: 'relative' },
                        top: { xs: 0 }, zIndex: { xs: 10 },
                        transition: 'border-color 0.4s ease',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' },
                        }}>
                            {/* Score display */}
                            <Box sx={{
                                px: { xs: 2.5, sm: 3 }, py: { xs: 1.5, sm: 2 },
                                borderRight: { xs: 'none', sm: formBorder },
                                borderBottom: { xs: formBorder, sm: 'none' },
                                textAlign: { xs: 'center', sm: 'left' },
                                minWidth: { sm: 200 },
                            }}>
                                <Typography sx={{ fontSize: '0.58rem', fontWeight: 600, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                    Weighted Final Score
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, justifyContent: { xs: 'center', sm: 'flex-start' }, mt: 0.25 }}>
                                    <Typography sx={{
                                        fontWeight: 900, fontSize: { xs: '2rem', sm: '2.4rem' }, lineHeight: 1,
                                        color: liveScore.allFilled ? interp.color : c.textSecondary,
                                        fontVariantNumeric: 'tabular-nums',
                                    }}>
                                        {liveScore.allFilled ? liveScore.total.toFixed(2) : '—'}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8rem', color: c.textSecondary }}>/10</Typography>
                                </Box>
                                {liveScore.allFilled && (
                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: interp.color, mt: 0.25 }}>
                                        {interp.label}
                                    </Typography>
                                )}
                            </Box>

                            {/* Category breakdown */}
                            <Box sx={{ flex: 1, px: { xs: 2.5, sm: 2.5 }, py: { xs: 1.5, sm: 1.5 } }}>
                                <Stack spacing={0.75}>
                                    {rubric.map(cat => {
                                        const cs = liveScore.categoryScores[cat.category];
                                        return (
                                            <Box key={cat.category} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: c.textSecondary, minWidth: { xs: 80, sm: 130 }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {cat.category.split('. ')[1]} ({cat.weight})
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={cs?.percent || 0}
                                                    sx={{
                                                        flex: 1, height: 6, borderRadius: 3,
                                                        bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
                                                        '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: cat.color, transition: 'transform 0.4s ease' },
                                                    }}
                                                />
                                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: cs?.filled ? cat.color : c.textSecondary, minWidth: 30, textAlign: 'right' }}>
                                                    {cs?.filled ? `${cs.percent.toFixed(0)}%` : '—'}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(liveScore.filledCount / liveScore.totalCount) * 100}
                                        sx={{
                                            flex: 1, height: 3, borderRadius: 2,
                                            bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
                                            '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: liveScore.allFilled ? '#16a34a' : '#94a3b8' },
                                        }}
                                    />
                                    <Typography sx={{ fontSize: '0.6rem', color: c.textSecondary, fontWeight: 600 }}>
                                        {liveScore.filledCount}/{liveScore.totalCount} scored
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* ═══ EVALUATION RUBRIC ═══ */}
                    <form onSubmit={handleSubmit}>
                        {rubric.map((cat) => (
                            <Box key={cat.category} sx={{
                                border: formBorder, borderRadius: '12px',
                                overflow: 'hidden', mb: 2.5, bgcolor: c.cardBg,
                            }}>
                                {/* Category header */}
                                <Box sx={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    px: { xs: 2.5, sm: 3 }, py: 1.25,
                                    bgcolor: isDark ? `${cat.color}12` : `${cat.color}08`,
                                    borderBottom: formBorder,
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 3, height: 28, borderRadius: 2, bgcolor: cat.color }} />
                                        <Box>
                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: c.textPrimary }}>
                                                {cat.category}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.62rem', color: c.textSecondary }}>
                                                {cat.items.length} criteria
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Chip
                                        label={cat.weight}
                                        size="small"
                                        sx={{ fontWeight: 800, fontSize: '0.72rem', bgcolor: `${cat.color}15`, color: cat.color, height: 26 }}
                                    />
                                </Box>

                                {/* Criteria — TABLE LAYOUT for desktop, STACKED for mobile */}
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em', py: 0.75, borderBottom: formBorder, display: { xs: 'none', sm: 'table-cell' } }}>
                                                    Criterion
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em', py: 0.75, width: 60, textAlign: 'center', borderBottom: formBorder, display: { xs: 'none', sm: 'table-cell' } }}>
                                                    Weight
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em', py: 0.75, width: 80, textAlign: 'center', borderBottom: formBorder, display: { xs: 'none', sm: 'table-cell' } }}>
                                                    Score (1-10)
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em', py: 0.75, width: 90, textAlign: 'center', borderBottom: formBorder, display: { xs: 'none', sm: 'table-cell' } }}>
                                                    Weighted
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cat.items.map((item, idx) => {
                                                const val = parseInt(data[item.field]) || 0;
                                                const weighted = (val * item.weight).toFixed(2);
                                                const itemInterp = val > 0 ? getInterpretation(val) : null;

                                                return (
                                                    <TableRow key={item.field} sx={{
                                                        '&:last-child td': { borderBottom: 0 },
                                                        bgcolor: val > 0 ? (isDark ? `${cat.color}04` : `${cat.color}02`) : 'transparent',
                                                        transition: 'background 0.3s ease',
                                                    }}>
                                                        {/* ── DESKTOP ROW ── */}
                                                        <TableCell sx={{
                                                            py: 1.5, borderBottom: idx < cat.items.length - 1 ? formBorder : 0,
                                                            display: { xs: 'none', sm: 'table-cell' },
                                                        }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: c.textPrimary }}>
                                                                    {item.label}
                                                                </Typography>
                                                                <Tooltip title={item.desc} arrow enterTouchDelay={0}>
                                                                    <InfoOutlinedIcon sx={{ fontSize: 14, color: c.textSecondary, cursor: 'help' }} />
                                                                </Tooltip>
                                                            </Box>
                                                            <Typography sx={{ fontSize: '0.68rem', color: c.textSecondary, mt: 0.25 }}>
                                                                {item.desc}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            textAlign: 'center', py: 1.5,
                                                            borderBottom: idx < cat.items.length - 1 ? formBorder : 0,
                                                            display: { xs: 'none', sm: 'table-cell' },
                                                        }}>
                                                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: cat.color }}>
                                                                {(item.weight * 100).toFixed(0)}%
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            textAlign: 'center', py: 1.5,
                                                            borderBottom: idx < cat.items.length - 1 ? formBorder : 0,
                                                            display: { xs: 'none', sm: 'table-cell' },
                                                        }}>
                                                            <TextField
                                                                value={val || ''}
                                                                onChange={(e) => {
                                                                    const v = parseInt(e.target.value);
                                                                    if (!e.target.value) setData(item.field, 0);
                                                                    else if (v >= 1 && v <= 10) setData(item.field, v);
                                                                }}
                                                                type="number"
                                                                inputProps={{ min: 1, max: 10, style: { textAlign: 'center', fontWeight: 800, fontSize: '1rem' } }}
                                                                size="small"
                                                                sx={{
                                                                    width: 64,
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderRadius: '8px', height: 40,
                                                                        bgcolor: val ? (isDark ? `${cat.color}15` : `${cat.color}08`) : 'transparent',
                                                                        '& fieldset': { borderColor: val ? cat.color : c.cardBorder, borderWidth: val ? 2 : 1 },
                                                                        '&:hover fieldset': { borderColor: cat.color },
                                                                        '&.Mui-focused fieldset': { borderColor: cat.color },
                                                                    },
                                                                    '& input': { color: val ? cat.color : c.textPrimary },
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            textAlign: 'center', py: 1.5,
                                                            borderBottom: idx < cat.items.length - 1 ? formBorder : 0,
                                                            display: { xs: 'none', sm: 'table-cell' },
                                                        }}>
                                                            {val > 0 ? (
                                                                <Box>
                                                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: cat.color }}>
                                                                        {weighted}
                                                                    </Typography>
                                                                    <Typography sx={{ fontSize: '0.58rem', fontWeight: 600, color: itemInterp.color }}>
                                                                        {itemInterp.label}
                                                                    </Typography>
                                                                </Box>
                                                            ) : (
                                                                <Typography sx={{ fontSize: '0.75rem', color: c.textSecondary }}>—</Typography>
                                                            )}
                                                        </TableCell>

                                                        {/* ── MOBILE ROW (stacked) ── */}
                                                        <TableCell sx={{
                                                            display: { xs: 'table-cell', sm: 'none' },
                                                            py: 2, px: 2,
                                                            borderBottom: idx < cat.items.length - 1 ? formBorder : 0,
                                                        }} colSpan={4}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                                <Box sx={{ flex: 1, pr: 1 }}>
                                                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: c.textPrimary }}>
                                                                        {item.label}
                                                                    </Typography>
                                                                    <Typography sx={{ fontSize: '0.68rem', color: c.textSecondary, mt: 0.25 }}>
                                                                        {item.desc}
                                                                    </Typography>
                                                                </Box>
                                                                <Chip
                                                                    label={`${(item.weight * 100).toFixed(0)}%`}
                                                                    size="small"
                                                                    sx={{ fontWeight: 700, fontSize: '0.65rem', bgcolor: `${cat.color}10`, color: cat.color, height: 22, flexShrink: 0 }}
                                                                />
                                                            </Box>

                                                            {/* Slider + number input for mobile */}
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Slider
                                                                        value={val}
                                                                        onChange={(e, v) => setData(item.field, v)}
                                                                        min={0} max={10} step={1}
                                                                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                                                                        valueLabelDisplay="auto"
                                                                        valueLabelFormat={(v) => v === 0 ? '—' : v}
                                                                        sx={{
                                                                            color: cat.color, height: 5,
                                                                            '& .MuiSlider-thumb': { width: 20, height: 20, bgcolor: '#fff', border: `2.5px solid ${cat.color}` },
                                                                            '& .MuiSlider-markLabel': { fontSize: '0.6rem', color: c.textSecondary },
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <TextField
                                                                    value={val || ''}
                                                                    onChange={(e) => {
                                                                        const v = parseInt(e.target.value);
                                                                        if (!e.target.value) setData(item.field, 0);
                                                                        else if (v >= 1 && v <= 10) setData(item.field, v);
                                                                    }}
                                                                    type="number"
                                                                    inputProps={{ min: 1, max: 10, style: { textAlign: 'center', fontWeight: 800, fontSize: '1rem' } }}
                                                                    size="small"
                                                                    sx={{
                                                                        width: 56, flexShrink: 0,
                                                                        '& .MuiOutlinedInput-root': {
                                                                            borderRadius: '8px', height: 38,
                                                                            '& fieldset': { borderColor: val ? cat.color : c.cardBorder, borderWidth: val ? 2 : 1 },
                                                                        },
                                                                        '& input': { color: val ? cat.color : c.textPrimary },
                                                                    }}
                                                                />
                                                            </Box>

                                                            {val > 0 && (
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
                                                                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: itemInterp.color }}>
                                                                        {itemInterp.label}
                                                                    </Typography>
                                                                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: cat.color }}>
                                                                        Weighted: {weighted}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {errors[item.field] && (
                                                                <Typography sx={{ fontSize: '0.7rem', color: '#dc2626', mt: 0.5 }}>{errors[item.field]}</Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        ))}

                        {/* ═══ EVALUATOR NOTES ═══ */}
                        <Box sx={{
                            border: formBorder, borderRadius: '12px',
                            overflow: 'hidden', mb: 2.5, bgcolor: c.cardBg,
                        }}>
                            <Box sx={{ px: { xs: 2.5, sm: 3 }, py: 1.25, bgcolor: sectionBg, borderBottom: formBorder }}>
                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: c.textPrimary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Evaluator Notes
                                </Typography>
                                <Typography sx={{ fontSize: '0.62rem', color: c.textSecondary, mt: 0.15 }}>
                                    Optional — Provide constructive feedback or recommendations
                                </Typography>
                            </Box>
                            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                                <TextField
                                    multiline rows={3} fullWidth
                                    placeholder="Enter evaluation notes here..."
                                    value={data.juri_notes}
                                    onChange={(e) => setData('juri_notes', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }}
                                />
                            </Box>
                        </Box>

                        {/* ═══ SUBMIT ═══ */}
                        <Box sx={{
                            position: { xs: 'sticky', sm: 'relative' },
                            bottom: { xs: 0 }, bgcolor: c.surfaceBg,
                            py: { xs: 1.5, sm: 0 }, zIndex: { xs: 10 },
                        }}>
                            {!liveScore.allFilled && (
                                <Alert severity="warning" sx={{ mb: 1.5, borderRadius: '10px', fontSize: '0.75rem', py: 0.5 }}>
                                    <strong>{liveScore.totalCount - liveScore.filledCount} criteria remaining.</strong> All criteria must be scored before submission.
                                </Alert>
                            )}
                            <Button
                                type="submit" variant="contained" fullWidth
                                disabled={processing || !liveScore.allFilled}
                                startIcon={processing ? null : (isAlreadyScored ? <SaveIcon /> : <CheckCircleIcon />)}
                                sx={{
                                    background: liveScore.allFilled ? 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)' : '#94a3b8',
                                    py: 1.5, borderRadius: '12px', textTransform: 'none',
                                    fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.01em',
                                    boxShadow: liveScore.allFilled ? '0 4px 16px rgba(26,188,156,0.3)' : 'none',
                                    '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)', transform: 'translateY(-1px)' },
                                    '&:disabled': { background: '#94a3b8', boxShadow: 'none', transform: 'none' },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {processing ? 'Submitting...' : isAlreadyScored ? 'Update Evaluation' : 'Submit Evaluation'}
                            </Button>
                            <Typography sx={{ fontSize: '0.6rem', color: c.textSecondary, textAlign: 'center', mt: 1, lineHeight: 1.4 }}>
                                By submitting, you confirm this evaluation was conducted independently and objectively in accordance with the conference evaluation guidelines.
                            </Typography>
                        </Box>
                    </form>
                </Box>
            </Box>
        </SidebarLayout>
    );
}
