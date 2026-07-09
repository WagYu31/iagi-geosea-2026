import React, { useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Button, TextField,
    Stack, useTheme, Alert, LinearProgress, Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/* ────────────────────────────────────────────
   ISO Color System — Professional Muted Palette
   ──────────────────────────────────────────── */
const ISO = {
    navy: '#1b2a4a',
    navyLight: '#2d4373',
    slate: '#475569',
    slateLight: '#64748b',
    accent: '#0f766e',        // teal — primary action
    accentLight: '#14b8a6',
    sectionA: '#1e3a5f',      // deep blue
    sectionB: '#1a4731',      // deep green
    sectionC: '#5c3d1f',      // deep brown
    exceptional: '#047857',
    good: '#1d4ed8',
    acceptable: '#b45309',
    belowStd: '#c2410c',
    unsatisfactory: '#b91c1c',
    border: '#d1d5db',
    borderDark: 'rgba(255,255,255,0.1)',
    headerBg: '#f8f9fa',
    headerBgDark: 'rgba(255,255,255,0.03)',
};

/* ──────── Rubric Data ──────── */
const ORAL_RUBRIC = [
    {
        id: 'A', category: 'Presentation Delivery', weight: '30%',
        sectionColor: ISO.sectionA,
        items: [
            { field: 'time_management', code: 'A1', label: 'Time Management', weight: 5, desc: 'Adherence to allotted time, effective pacing and transitions between segments' },
            { field: 'posture_professionalism', code: 'A2', label: 'Posture & Professionalism', weight: 10, desc: 'Professional demeanor, appropriate attire, confident body language and stage presence' },
            { field: 'communication_skills', code: 'A3', label: 'Communication Skills', weight: 15, desc: 'Clarity of articulation, audience engagement, eye contact, verbal and non-verbal cues' },
        ],
    },
    {
        id: 'B', category: 'Presentation Content', weight: '50%',
        sectionColor: ISO.sectionB,
        items: [
            { field: 'scientific_substantiation', code: 'B1', label: 'Scientific Substantiation', weight: 15, desc: 'Scientific foundation strength, proper use of data, evidence, references, and methodology' },
            { field: 'technical_contribution', code: 'B2', label: 'Technical / Scientific Contribution', weight: 10, desc: 'Significance of novel findings, technical advancement, contribution to geoscience' },
            { field: 'logical_organization', code: 'B3', label: 'Logical & Systematic Organization', weight: 10, desc: 'Clear structure: introduction, methodology, results, discussion, and conclusion' },
            { field: 'visual_quality', code: 'B4', label: 'Visual Quality', weight: 5, desc: 'Slide design, charts, figures quality, readability, and professional design standards' },
            { field: 'originality_innovation', code: 'B5', label: 'Originality & Innovation', weight: 10, desc: 'Original approach, innovative methodology, novel interpretation, creative problem-solving' },
        ],
    },
    {
        id: 'C', category: 'Manuscript Quality', weight: '20%',
        sectionColor: ISO.sectionC,
        items: [
            { field: 'manuscript_substantiation', code: 'C1', label: 'Scientific Substantiation', weight: 10, desc: 'Manuscript scientific rigor, evidence strength, methodology documentation, data integrity' },
            { field: 'manuscript_writing', code: 'C2', label: 'Logical & Systematic Writing', weight: 10, desc: 'Writing clarity, grammatical accuracy, proper structure following IMRaD standards' },
        ],
    },
];

const POSTER_RUBRIC = [
    {
        id: 'A', category: 'Poster Quality', weight: '55%',
        sectionColor: ISO.sectionA,
        items: [
            { field: 'poster_scientific_substantiation', code: 'A1', label: 'Scientific Substantiation', weight: 15, desc: 'Scientific foundation, data, evidence, references, and methodology' },
            { field: 'practical_usefulness', code: 'A2', label: 'Practical Usefulness & Significance', weight: 10, desc: 'Real-world applicability, industry relevance, and research impact' },
            { field: 'poster_technical_contribution', code: 'A3', label: 'Technical / Scientific Contribution', weight: 10, desc: 'Novel findings, advancement to the geoscience field' },
            { field: 'poster_organization_design', code: 'A4', label: 'Poster Organization & Visual Design', weight: 10, desc: 'Layout, typography, color scheme, readability, information hierarchy' },
            { field: 'poster_originality', code: 'A5', label: 'Originality & Authenticity', weight: 10, desc: 'Original approach, authentic data, proper attribution, ethical practices' },
        ],
    },
    {
        id: 'B', category: 'Presenter Quality', weight: '25%',
        sectionColor: ISO.sectionB,
        items: [
            { field: 'presentation_explanation', code: 'B1', label: 'Presentation & Explanation', weight: 10, desc: 'Clarity of verbal explanation, visitor engagement, key findings communication' },
            { field: 'subject_knowledge', code: 'B2', label: 'Subject Knowledge & Question Handling', weight: 15, desc: 'Depth of understanding, confidence in Q&A, discussion beyond material' },
        ],
    },
    {
        id: 'C', category: 'Manuscript Quality', weight: '20%',
        sectionColor: ISO.sectionC,
        items: [
            { field: 'manuscript_substantiation', code: 'C1', label: 'Scientific Substantiation', weight: 10, desc: 'Scientific rigor, evidence, methodology documentation' },
            { field: 'manuscript_writing', code: 'C2', label: 'Logical & Systematic Writing', weight: 10, desc: 'Writing clarity, grammar, IMRaD structure compliance' },
        ],
    },
];

function getGrade(score) {
    if (score >= 9) return { label: 'Exceptional', color: ISO.exceptional };
    if (score >= 7) return { label: 'Good', color: ISO.good };
    if (score >= 5) return { label: 'Acceptable', color: ISO.acceptable };
    if (score >= 3) return { label: 'Below Standard', color: ISO.belowStd };
    return { label: 'Unsatisfactory', color: ISO.unsatisfactory };
}

/* ────────────────────────────────
   MAIN COMPONENT
   ──────────────────────────────── */
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
        const catScores = {};
        rubric.forEach(cat => {
            let ws = 0, filled = true;
            cat.items.forEach(item => {
                totalCount++;
                const v = parseInt(data[item.field]);
                if (!v || isNaN(v)) { allFilled = false; filled = false; return; }
                filledCount++;
                const weighted = v * (item.weight / 100);
                total += weighted;
                ws += weighted;
            });
            const maxW = cat.items.reduce((s, i) => s + (10 * i.weight / 100), 0);
            catScores[cat.id] = { ws, maxW, filled, pct: maxW ? (ws / maxW) * 100 : 0 };
        });
        return { total: Math.round(total * 100) / 100, allFilled, catScores, filledCount, totalCount };
    }, [data, rubric]);

    const handleSubmit = (e) => { e.preventDefault(); post(route('juri.submissions.score', submission.id), { preserveScroll: true }); };
    const isEditing = !!presentationScore.weighted_final_score;
    const grade = getGrade(liveScore.total);

    // ── styling tokens ──
    const bdr = isDark ? ISO.borderDark : ISO.border;
    const hBg = isDark ? ISO.headerBgDark : ISO.headerBg;

    const fontDoc = '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif';

    return (
        <SidebarLayout>
            <Head title={`Evaluation — ${submission.title}`} />
            <Box sx={{ p: { xs: 1, sm: 2.5 }, minHeight: '100vh', bgcolor: isDark ? c.surfaceBg : '#f1f5f9' }}>
                <Box sx={{ maxWidth: 780, mx: 'auto', fontFamily: fontDoc }}>

                    {/* ═══════════════════════════════════
                        DOCUMENT CONTAINER
                       ═══════════════════════════════════ */}
                    <Box sx={{
                        bgcolor: c.cardBg,
                        borderRadius: '8px',
                        border: `1px solid ${bdr}`,
                        boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
                        overflow: 'hidden',
                    }}>

                        {/* ──── Document Title Banner ──── */}
                        <Box sx={{
                            background: isDark
                                ? `linear-gradient(135deg, ${ISO.navy}, #0f1b33)`
                                : `linear-gradient(135deg, ${ISO.navy} 0%, ${ISO.navyLight} 100%)`,
                            px: { xs: 3, sm: 4 },
                            py: { xs: 2.5, sm: 3 },
                        }}>
                            <Typography sx={{
                                color: 'rgba(255,255,255,0.5)', fontWeight: 500,
                                fontSize: '0.6rem', letterSpacing: '0.2em',
                                textTransform: 'uppercase', fontFamily: fontDoc,
                            }}>
                                55th PIT IAGI & GEOSEA XIX 2026
                            </Typography>
                            <Typography sx={{
                                color: '#fff', fontWeight: 700,
                                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                                mt: 0.5, fontFamily: fontDoc,
                                letterSpacing: '-0.015em',
                            }}>
                                {isOral ? 'Oral Presentation' : 'Poster Presentation'} — Evaluation Form
                            </Typography>
                        </Box>

                        {/* ──── Metadata Section ──── */}
                        <Box sx={{ borderBottom: `1px solid ${bdr}` }}>
                            {/* Row 1: Title */}
                            <Box sx={{ px: { xs: 3, sm: 4 }, py: 1.75, borderBottom: `1px solid ${bdr}` }}>
                                <Typography sx={{ fontSize: '0.58rem', fontWeight: 600, color: ISO.slateLight, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: fontDoc }}>
                                    Paper Title
                                </Typography>
                                <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: c.textPrimary, mt: 0.3, lineHeight: 1.45, fontFamily: fontDoc }}>
                                    {submission.title}
                                </Typography>
                            </Box>
                            {/* Row 2: 2-col */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                                {[
                                    { label: 'Author(s)', value: submission.user?.name || '—' },
                                    { label: 'Presentation Type', value: isOral ? 'Oral Presentation' : 'Poster Presentation' },
                                ].map((f, i) => (
                                    <Box key={i} sx={{
                                        px: { xs: 3, sm: 4 }, py: 1.5,
                                        borderRight: { xs: 'none', sm: i === 0 ? `1px solid ${bdr}` : 'none' },
                                        borderBottom: { xs: `1px solid ${bdr}`, sm: 'none' },
                                    }}>
                                        <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: ISO.slateLight, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: fontDoc }}>{f.label}</Typography>
                                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: c.textPrimary, mt: 0.2, fontFamily: fontDoc }}>{f.value}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* ──── Scoring Scale Legend ──── */}
                        <Box sx={{ px: { xs: 3, sm: 4 }, py: 1.5, bgcolor: hBg, borderBottom: `1px solid ${bdr}` }}>
                            <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: ISO.slate, textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1, fontFamily: fontDoc }}>
                                Scoring Scale
                            </Typography>
                            <Box sx={{ display: 'flex', gap: { xs: 0, sm: 0.5 }, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                                {[
                                    { r: '9–10', l: 'Exceptional', c: ISO.exceptional, bg: '#ecfdf5' },
                                    { r: '7–8', l: 'Good', c: ISO.good, bg: '#eff6ff' },
                                    { r: '5–6', l: 'Acceptable', c: ISO.acceptable, bg: '#fffbeb' },
                                    { r: '3–4', l: 'Below Std.', c: ISO.belowStd, bg: '#fff7ed' },
                                    { r: '1–2', l: 'Unsatisfactory', c: ISO.unsatisfactory, bg: '#fef2f2' },
                                ].map((s, i) => (
                                    <Box key={i} sx={{
                                        flex: { xs: '0 0 calc(50% - 4px)', sm: 1 },
                                        textAlign: 'center',
                                        py: 0.75, px: 0.5,
                                        borderRadius: '6px',
                                        bgcolor: isDark ? `${s.c}10` : s.bg,
                                        mr: { xs: i % 2 === 0 ? 1 : 0, sm: 0 },
                                        mb: { xs: 0.75, sm: 0 },
                                    }}>
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: s.c, lineHeight: 1, fontFamily: fontDoc }}>{s.r}</Typography>
                                        <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: s.c, mt: 0.2, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: fontDoc }}>{s.l}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* ──── LIVE SCORE PANEL ──── */}
                        <Box sx={{
                            px: { xs: 3, sm: 4 }, py: 2,
                            borderBottom: `2px solid ${liveScore.allFilled ? grade.color : bdr}`,
                            position: { xs: 'sticky', sm: 'relative' },
                            top: { xs: 0 }, zIndex: { xs: 10 },
                            bgcolor: c.cardBg,
                            transition: 'border-color 0.3s ease',
                        }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 3 }, alignItems: { sm: 'center' } }}>
                                {/* Score number */}
                                <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, minWidth: { sm: 160 } }}>
                                    <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: ISO.slateLight, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: fontDoc }}>
                                        Weighted Final Score
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, justifyContent: { xs: 'center', sm: 'flex-start' }, mt: 0.25 }}>
                                        <Typography sx={{
                                            fontWeight: 800, fontSize: { xs: '2.2rem', sm: '2.6rem' }, lineHeight: 1,
                                            color: liveScore.allFilled ? grade.color : ISO.slateLight,
                                            fontFamily: fontDoc, fontVariantNumeric: 'tabular-nums',
                                        }}>
                                            {liveScore.allFilled ? liveScore.total.toFixed(2) : '—'}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: ISO.slateLight, fontFamily: fontDoc, fontWeight: 500 }}>/10</Typography>
                                    </Box>
                                    {liveScore.allFilled && (
                                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: grade.color, mt: 0.2, fontFamily: fontDoc }}>{grade.label}</Typography>
                                    )}
                                </Box>
                                {/* Category bars */}
                                <Box sx={{ flex: 1 }}>
                                    <Stack spacing={0.6}>
                                        {rubric.map(cat => {
                                            const cs = liveScore.catScores[cat.id];
                                            return (
                                                <Box key={cat.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, color: ISO.slateLight, width: { xs: 90, sm: 140 }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: fontDoc }}>
                                                        {cat.id}. {cat.category} ({cat.weight})
                                                    </Typography>
                                                    <LinearProgress variant="determinate" value={cs?.pct || 0} sx={{
                                                        flex: 1, height: 5, borderRadius: 3,
                                                        bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#e2e8f0',
                                                        '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: cat.sectionColor, transition: 'transform 0.3s ease' },
                                                    }} />
                                                    <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: cs?.filled ? cat.sectionColor : ISO.slateLight, width: 32, textAlign: 'right', fontFamily: fontDoc }}>
                                                        {cs?.filled ? `${cs.pct.toFixed(0)}%` : '—'}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                    {/* Completion bar */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                                        <LinearProgress variant="determinate" value={(liveScore.filledCount / liveScore.totalCount) * 100}
                                            sx={{ flex: 1, height: 3, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#e2e8f0',
                                                '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: liveScore.allFilled ? ISO.exceptional : ISO.slateLight } }} />
                                        <Typography sx={{ fontSize: '0.55rem', color: ISO.slateLight, fontWeight: 600, fontFamily: fontDoc }}>
                                            {liveScore.filledCount}/{liveScore.totalCount}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* ═══════════════════════════════════
                            EVALUATION CRITERIA
                           ═══════════════════════════════════ */}
                        <form onSubmit={handleSubmit}>
                            {rubric.map((cat) => (
                                <Box key={cat.id}>
                                    {/* Section Header */}
                                    <Box sx={{
                                        px: { xs: 3, sm: 4 }, py: 1.25,
                                        bgcolor: isDark ? `${cat.sectionColor}15` : `${cat.sectionColor}08`,
                                        borderBottom: `1px solid ${bdr}`,
                                        borderTop: `1px solid ${bdr}`,
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: '6px',
                                                bgcolor: cat.sectionColor,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.75rem', fontFamily: fontDoc }}>{cat.id}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: c.textPrimary, fontFamily: fontDoc }}>
                                                    {cat.category}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.58rem', color: ISO.slateLight, fontFamily: fontDoc }}>
                                                    {cat.items.length} criteria
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            px: 1.5, py: 0.5, borderRadius: '6px',
                                            bgcolor: isDark ? `${cat.sectionColor}20` : `${cat.sectionColor}10`,
                                        }}>
                                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: cat.sectionColor, fontFamily: fontDoc }}>
                                                {cat.weight}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* ── DESKTOP: Table header ── */}
                                    <Box sx={{
                                        display: { xs: 'none', sm: 'grid' },
                                        gridTemplateColumns: '1fr 70px 80px 80px',
                                        gap: 0,
                                        px: 4, py: 0.75,
                                        bgcolor: hBg,
                                        borderBottom: `1px solid ${bdr}`,
                                    }}>
                                        {['Criterion', 'Weight', 'Score', 'Weighted'].map(h => (
                                            <Typography key={h} sx={{
                                                fontSize: '0.52rem', fontWeight: 700, color: ISO.slateLight,
                                                textTransform: 'uppercase', letterSpacing: '0.15em',
                                                textAlign: h !== 'Criterion' ? 'center' : 'left',
                                                fontFamily: fontDoc,
                                            }}>
                                                {h}
                                            </Typography>
                                        ))}
                                    </Box>

                                    {/* ── Criteria Rows ── */}
                                    {cat.items.map((item, idx) => {
                                        const val = parseInt(data[item.field]) || 0;
                                        const weighted = val ? (val * item.weight / 100).toFixed(2) : null;
                                        const g = val ? getGrade(val) : null;
                                        const isLast = idx === cat.items.length - 1;

                                        return (
                                            <Box key={item.field} sx={{ borderBottom: isLast ? 'none' : `1px solid ${bdr}` }}>
                                                {/* ── DESKTOP ROW ── */}
                                                <Box sx={{
                                                    display: { xs: 'none', sm: 'grid' },
                                                    gridTemplateColumns: '1fr 70px 80px 80px',
                                                    alignItems: 'center',
                                                    px: 4, py: 1.75,
                                                    bgcolor: val ? (isDark ? `${cat.sectionColor}05` : `${cat.sectionColor}02`) : 'transparent',
                                                    transition: 'background 0.2s ease',
                                                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' },
                                                }}>
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                            <Typography sx={{
                                                                fontSize: '0.58rem', fontWeight: 800, color: cat.sectionColor,
                                                                bgcolor: isDark ? `${cat.sectionColor}15` : `${cat.sectionColor}08`,
                                                                px: 0.75, py: 0.15, borderRadius: '4px',
                                                                fontFamily: fontDoc,
                                                            }}>
                                                                {item.code}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: c.textPrimary, fontFamily: fontDoc }}>
                                                                {item.label}
                                                            </Typography>
                                                            <Tooltip title={item.desc} arrow enterTouchDelay={0}>
                                                                <InfoOutlinedIcon sx={{ fontSize: 14, color: ISO.slateLight, cursor: 'help', '&:hover': { color: ISO.accent } }} />
                                                            </Tooltip>
                                                        </Box>
                                                        <Typography sx={{ fontSize: '0.68rem', color: ISO.slateLight, mt: 0.3, pl: 4, fontFamily: fontDoc, lineHeight: 1.4 }}>
                                                            {item.desc}
                                                        </Typography>
                                                    </Box>
                                                    {/* Weight */}
                                                    <Typography sx={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: cat.sectionColor, fontFamily: fontDoc }}>
                                                        {item.weight}%
                                                    </Typography>
                                                    {/* Score Input */}
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <TextField
                                                            value={val || ''}
                                                            onChange={(e) => {
                                                                const v = parseInt(e.target.value);
                                                                if (!e.target.value) setData(item.field, 0);
                                                                else if (v >= 1 && v <= 10) setData(item.field, v);
                                                            }}
                                                            type="number"
                                                            placeholder="—"
                                                            inputProps={{ min: 1, max: 10, style: { textAlign: 'center', fontWeight: 800, fontSize: '1.05rem', fontFamily: fontDoc } }}
                                                            size="small"
                                                            sx={{
                                                                width: 58,
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: '8px', height: 42,
                                                                    bgcolor: val ? (isDark ? `${g.color}12` : `${g.color}06`) : 'transparent',
                                                                    '& fieldset': { borderColor: val ? g.color : bdr, borderWidth: val ? 2 : 1 },
                                                                    '&:hover fieldset': { borderColor: cat.sectionColor },
                                                                    '&.Mui-focused fieldset': { borderColor: cat.sectionColor, borderWidth: 2 },
                                                                },
                                                                '& input': { color: val ? g.color : c.textPrimary },
                                                                '& input::placeholder': { color: ISO.slateLight, opacity: 1 },
                                                            }}
                                                        />
                                                    </Box>
                                                    {/* Weighted Score */}
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        {weighted ? (
                                                            <>
                                                                <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: g.color, fontFamily: fontDoc }}>{weighted}</Typography>
                                                                <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: g.color, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: fontDoc }}>{g.label}</Typography>
                                                            </>
                                                        ) : (
                                                            <Typography sx={{ fontSize: '0.82rem', color: ISO.slateLight, fontFamily: fontDoc }}>—</Typography>
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* ── MOBILE ROW ── */}
                                                <Box sx={{
                                                    display: { xs: 'block', sm: 'none' },
                                                    px: 3, py: 2,
                                                    bgcolor: val ? (isDark ? `${cat.sectionColor}05` : `${cat.sectionColor}02`) : 'transparent',
                                                }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                        <Box sx={{ flex: 1, pr: 1 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                                                                <Typography sx={{
                                                                    fontSize: '0.55rem', fontWeight: 800, color: cat.sectionColor,
                                                                    bgcolor: `${cat.sectionColor}10`, px: 0.5, py: 0.1, borderRadius: '3px', fontFamily: fontDoc,
                                                                }}>{item.code}</Typography>
                                                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: c.textPrimary, fontFamily: fontDoc }}>
                                                                    {item.label}
                                                                </Typography>
                                                            </Box>
                                                            <Typography sx={{ fontSize: '0.68rem', color: ISO.slateLight, lineHeight: 1.4, fontFamily: fontDoc }}>{item.desc}</Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            px: 1, py: 0.3, borderRadius: '5px',
                                                            bgcolor: `${cat.sectionColor}10`, flexShrink: 0,
                                                        }}>
                                                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: cat.sectionColor, fontFamily: fontDoc }}>{item.weight}%</Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* Mobile score input */}
                                                    <Box sx={{
                                                        display: 'flex', alignItems: 'center', gap: 1.5,
                                                        p: 1.5, borderRadius: '8px',
                                                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                                        border: `1px solid ${val ? g?.color || bdr : bdr}`,
                                                        transition: 'border-color 0.2s ease',
                                                    }}>
                                                        <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: ISO.slateLight, textTransform: 'uppercase', fontFamily: fontDoc, minWidth: 42 }}>
                                                            Score
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 0.5, flex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                                                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                                                <Box
                                                                    key={n}
                                                                    onClick={() => setData(item.field, n)}
                                                                    sx={{
                                                                        width: 30, height: 30,
                                                                        borderRadius: '6px',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        cursor: 'pointer',
                                                                        fontWeight: 800, fontSize: '0.78rem',
                                                                        fontFamily: fontDoc,
                                                                        border: `1.5px solid ${val === n ? getGrade(n).color : (isDark ? 'rgba(255,255,255,0.08)' : '#d1d5db')}`,
                                                                        bgcolor: val === n ? (isDark ? `${getGrade(n).color}20` : `${getGrade(n).color}10`) : 'transparent',
                                                                        color: val === n ? getGrade(n).color : ISO.slateLight,
                                                                        transition: 'all 0.15s ease',
                                                                        '&:active': { transform: 'scale(0.92)' },
                                                                    }}
                                                                >
                                                                    {n}
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    </Box>

                                                    {val > 0 && (
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: g.color, fontFamily: fontDoc }}>{g.label}</Typography>
                                                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: cat.sectionColor, fontFamily: fontDoc }}>Weighted: {weighted}</Typography>
                                                        </Box>
                                                    )}
                                                    {errors[item.field] && <Typography sx={{ fontSize: '0.65rem', color: ISO.unsatisfactory, mt: 0.5 }}>{errors[item.field]}</Typography>}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            ))}

                            {/* ──── Evaluator Notes ──── */}
                            <Box sx={{ borderTop: `1px solid ${bdr}` }}>
                                <Box sx={{ px: { xs: 3, sm: 4 }, py: 1, bgcolor: hBg, borderBottom: `1px solid ${bdr}` }}>
                                    <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: ISO.slate, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: fontDoc }}>
                                        Evaluator Notes
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.52rem', color: ISO.slateLight, fontFamily: fontDoc }}>
                                        Optional — Provide constructive feedback or recommendations for the presenter
                                    </Typography>
                                </Box>
                                <Box sx={{ px: { xs: 3, sm: 4 }, py: 2 }}>
                                    <TextField
                                        multiline rows={3} fullWidth
                                        placeholder="Enter evaluation notes..."
                                        value={data.juri_notes}
                                        onChange={(e) => setData('juri_notes', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '6px', fontSize: '0.82rem', fontFamily: fontDoc,
                                                '& fieldset': { borderColor: bdr },
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* ──── Submit Section ──── */}
                            <Box sx={{
                                borderTop: `1px solid ${bdr}`,
                                px: { xs: 3, sm: 4 }, py: 2.5,
                                bgcolor: hBg,
                                position: { xs: 'sticky', sm: 'relative' },
                                bottom: { xs: 0 }, zIndex: { xs: 10 },
                            }}>
                                {!liveScore.allFilled && (
                                    <Alert severity="warning" sx={{ mb: 2, borderRadius: '6px', fontSize: '0.75rem', py: 0.5,
                                        '& .MuiAlert-message': { fontFamily: fontDoc } }}>
                                        <strong>{liveScore.totalCount - liveScore.filledCount} criteria remaining.</strong> All criteria must be scored.
                                    </Alert>
                                )}
                                <Button
                                    type="submit" variant="contained" fullWidth
                                    disabled={processing || !liveScore.allFilled}
                                    startIcon={processing ? null : (isEditing ? <SaveIcon /> : <CheckCircleIcon />)}
                                    sx={{
                                        background: liveScore.allFilled
                                            ? `linear-gradient(135deg, ${ISO.navy} 0%, ${ISO.navyLight} 100%)`
                                            : '#94a3b8',
                                        py: 1.5, borderRadius: '8px', textTransform: 'none',
                                        fontWeight: 700, fontSize: '0.88rem',
                                        fontFamily: fontDoc, letterSpacing: '0.01em',
                                        boxShadow: liveScore.allFilled ? '0 2px 8px rgba(27,42,74,0.3)' : 'none',
                                        '&:hover': { background: `linear-gradient(135deg, ${ISO.navyLight} 0%, ${ISO.navy} 100%)` },
                                        '&:disabled': { background: '#94a3b8', boxShadow: 'none' },
                                    }}
                                >
                                    {processing ? 'Submitting...' : isEditing ? 'Update Evaluation' : 'Submit Evaluation'}
                                </Button>
                                <Typography sx={{ fontSize: '0.55rem', color: ISO.slateLight, textAlign: 'center', mt: 1.5, lineHeight: 1.5, fontFamily: fontDoc }}>
                                    By submitting, you confirm this evaluation was conducted independently and objectively
                                    in accordance with the 55th PIT IAGI & GEOSEA XIX 2026 evaluation guidelines.
                                </Typography>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Box>
        </SidebarLayout>
    );
}
