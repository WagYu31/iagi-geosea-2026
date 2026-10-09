import React, { useMemo, useState, useEffect } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Chip, Button, TextField,
    Stack, useTheme, Alert, LinearProgress, Tooltip,
    Snackbar, Dialog, DialogContent, Grid, Avatar, IconButton, Divider,
    Collapse,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MicIcon from '@mui/icons-material/Mic';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShieldIcon from '@mui/icons-material/Shield';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CircularProgress from '@mui/material/CircularProgress';

/* ────────────────────────────────────────────
   ISO & Conference Color Tokens (Taste-Skill)
   ──────────────────────────────────────────── */
const TOKENS = {
    brandDark: '#03241f',
    brandTeal: '#094d42',
    brandEmerald: '#059669',
    accentCyan: '#0284c7',
    exceptional: '#059669',
    good: '#2563eb',
    acceptable: '#d97706',
    belowStd: '#ea580c',
    unsatisfactory: '#dc2626',
};

/* ──────── Rubrics Definition ──────── */
const ORAL_RUBRIC = [
    {
        id: 'A',
        category: 'Presentation Delivery',
        weight: '30%',
        weightNum: 30,
        sectionColor: '#0284c7',
        items: [
            { field: 'time_management', code: 'A1', label: 'Time Management', weight: 5, desc: 'Adherence to allotted time, effective pacing, and fluid transitions between presentation sections.' },
            { field: 'posture_professionalism', code: 'A2', label: 'Posture & Professionalism', weight: 10, desc: 'Professional demeanor, appropriate dress code, stage presence, and confidence.' },
            { field: 'communication_skills', code: 'A3', label: 'Communication Skills', weight: 15, desc: 'Clarity of articulation, audience engagement, eye contact, and effective verbal/non-verbal delivery.' },
        ],
    },
    {
        id: 'B',
        category: 'Presentation Content',
        weight: '50%',
        weightNum: 50,
        sectionColor: '#059669',
        items: [
            { field: 'scientific_substantiation', code: 'B1', label: 'Scientific Substantiation', weight: 15, desc: 'Rigor of scientific foundation, valid use of empirical data, references, and robust methodology.' },
            { field: 'technical_contribution', code: 'B2', label: 'Technical / Scientific Contribution', weight: 10, desc: 'Significance of findings, new technological insights, or advancement to the geoscience discipline.' },
            { field: 'logical_organization', code: 'B3', label: 'Logical & Systematic Organization', weight: 10, desc: 'Structured narrative flow from context, problem statement, methodology, to results and conclusion.' },
            { field: 'visual_quality', code: 'B4', label: 'Visual Quality & Media', weight: 5, desc: 'Slide legibility, high-resolution figures, clear data visualizations, and professional typography.' },
            { field: 'originality_innovation', code: 'B5', label: 'Originality & Innovation', weight: 10, desc: 'Novel research approaches, innovative interpretation of geological data, or creative engineering solutions.' },
        ],
    },
    {
        id: 'C',
        category: 'Manuscript Quality',
        weight: '20%',
        weightNum: 20,
        sectionColor: '#d97706',
        items: [
            { field: 'manuscript_substantiation', code: 'C1', label: 'Manuscript Scientific Rigor', weight: 10, desc: 'Depth of evidence, comprehensive literature grounding, and analytical integrity in the written paper.' },
            { field: 'manuscript_writing', code: 'C2', label: 'Logical & Systematic Writing', weight: 10, desc: 'Clarity of prose, grammatical precision, adherence to IMRaD format, and academic formatting standards.' },
        ],
    },
];

const POSTER_RUBRIC = [
    {
        id: 'A',
        category: 'Poster Quality',
        weight: '55%',
        weightNum: 55,
        sectionColor: '#0284c7',
        items: [
            { field: 'poster_scientific_substantiation', code: 'A1', label: 'Scientific Substantiation', weight: 15, desc: 'Rigor of scientific background, empirical data integrity, and validity of applied research methodology.' },
            { field: 'practical_usefulness', code: 'A2', label: 'Practical Usefulness & Significance', weight: 10, desc: 'Real-world applicability, industrial relevance, and actionable outcomes for geoscience practitioners.' },
            { field: 'poster_technical_contribution', code: 'A3', label: 'Technical / Scientific Contribution', weight: 10, desc: 'Significance of findings, novel techniques, and contribution to advancing geological knowledge.' },
            { field: 'poster_organization_design', code: 'A4', label: 'Organization & Visual Hierarchy', weight: 10, desc: 'Information architecture, graphical balance, typography legibility, and high-impact visual design.' },
            { field: 'poster_originality', code: 'A5', label: 'Originality & Authenticity', weight: 10, desc: 'Unique experimental perspective, authentic primary data, and sound research ethics.' },
        ],
    },
    {
        id: 'B',
        category: 'Presenter Quality',
        weight: '25%',
        weightNum: 25,
        sectionColor: '#059669',
        items: [
            { field: 'presentation_explanation', code: 'B1', label: 'Poster Presentation & Explanation', weight: 10, desc: 'Concise explanation to judges/delegates, effective storytelling, and clarity of key discoveries.' },
            { field: 'subject_knowledge', code: 'B2', label: 'Subject Knowledge & Q&A Handling', weight: 15, desc: 'Depth of technical domain understanding, response agility during question-and-answer interactions.' },
        ],
    },
    {
        id: 'C',
        category: 'Manuscript Quality',
        weight: '20%',
        weightNum: 20,
        sectionColor: '#d97706',
        items: [
            { field: 'manuscript_substantiation', code: 'C1', label: 'Scientific Rigor in Manuscript', weight: 10, desc: 'Manuscript validity, citation integrity, and documented empirical findings.' },
            { field: 'manuscript_writing', code: 'C2', label: 'Logical & Systematic Writing', weight: 10, desc: 'Manuscript structure, adherence to IMRaD format, grammar accuracy, and clear conclusions.' },
        ],
    },
];

function getGradeTier(score) {
    if (score >= 9) return { label: 'Exceptional (Top 5%)', color: TOKENS.exceptional, bg: '#ecfdf5', border: '#a7f3d0' };
    if (score >= 7) return { label: 'Good / Strong', color: TOKENS.good, bg: '#eff6ff', border: '#bfdbfe' };
    if (score >= 5) return { label: 'Acceptable', color: TOKENS.acceptable, bg: '#fffbeb', border: '#fde68a' };
    if (score >= 3) return { label: 'Below Standard', color: TOKENS.belowStd, bg: '#fff7ed', border: '#fed7aa' };
    return { label: 'Unsatisfactory', color: TOKENS.unsatisfactory, bg: '#fef2f2', border: '#fecaca' };
}

export default function ScoreForm({ submission, presentationScore }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const isOral = presentationScore.rubric_type === 'oral';
    const rubric = isOral ? ORAL_RUBRIC : POSTER_RUBRIC;

    const { flash } = usePage().props;
    const [successDialog, setSuccessDialog] = useState({ open: false, score: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
    const [scaleRefOpen, setScaleRefOpen] = useState(false);

    // Initial form state
    const initialData = {};
    rubric.forEach(cat => cat.items.forEach(item => {
        initialData[item.field] = presentationScore[item.field] || '';
    }));
    initialData.juri_notes = presentationScore.juri_notes || '';

    const { data, setData, post, processing, errors } = useForm(initialData);

    // Live Score calculations
    const liveScore = useMemo(() => {
        let total = 0, allFilled = true, filledCount = 0, totalCount = 0;
        const catScores = {};

        rubric.forEach(cat => {
            let catWeightedScore = 0;
            let catFilled = true;

            cat.items.forEach(item => {
                totalCount++;
                const v = parseInt(data[item.field]);
                if (!v || isNaN(v)) {
                    allFilled = false;
                    catFilled = false;
                    return;
                }
                filledCount++;
                const weighted = v * (item.weight / 100);
                total += weighted;
                catWeightedScore += weighted;
            });

            const maxCategoryScore = cat.items.reduce((acc, i) => acc + (10 * i.weight / 100), 0);
            catScores[cat.id] = {
                ws: catWeightedScore,
                maxW: maxCategoryScore,
                filled: catFilled,
                pct: maxCategoryScore ? (catWeightedScore / maxCategoryScore) * 100 : 0,
            };
        });

        return {
            total: Math.round(total * 100) / 100,
            allFilled,
            catScores,
            filledCount,
            totalCount,
        };
    }, [data, rubric]);

    // Flash notifications
    useEffect(() => {
        if (flash?.success) {
            setSuccessDialog({ open: true, score: liveScore.total });
        }
        if (flash?.error) {
            setSnackbar({ open: true, message: flash.error, severity: 'error' });
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('juri.submissions.score', submission.id), {
            preserveScroll: true,
            onError: () => setSnackbar({
                open: true,
                message: 'Failed to submit score. Please check that all criteria have valid values between 1 and 10.',
                severity: 'error',
            }),
        });
    };

    const isEditing = !!presentationScore.weighted_final_score;
    const grade = getGradeTier(liveScore.total);
    const presenterName = submission.author_full_name || submission.user?.name || 'Author Not Provided';
    const institution = submission.institute_organization || submission.affiliation || 'Academic / Research Institution';
    const paperCode = submission.submission_code || `SUB-${submission.id}`;

    return (
        <SidebarLayout>
            <Head title={`Evaluation: ${submission.title} • 55th PIT IAGI & GEOSEA 2026`} />

            <Box sx={{
                p: { xs: 1.5, sm: 2.5, md: 4 },
                pb: { xs: 14, lg: 5 }, // Extra bottom padding on mobile so content is never covered by the floating bottom bar
                minHeight: '100vh',
                bgcolor: c.surfaceBg,
                maxWidth: '1600px',
                mx: 'auto',
            }}>
                {/* ── BREADCRUMB & BACK ACTION ── */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Button
                        component={Link}
                        href={route('juri.submissions')}
                        startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: { xs: '0.78rem', sm: '0.85rem' },
                            color: c.textSecondary,
                            borderRadius: '10px',
                            px: 1.2,
                            py: 0.5,
                            '&:hover': {
                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                                color: c.textPrimary,
                            },
                        }}
                    >
                        Back to Presentations
                    </Button>

                    <Chip
                        icon={<ShieldIcon sx={{ fontSize: '13px !important' }} />}
                        label="Confidential Rubric"
                        size="small"
                        sx={{
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            borderRadius: '8px',
                            bgcolor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ecfdf5',
                            color: '#059669',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                        }}
                    />
                </Box>

                {/* ── 21st.dev HERO BANNER DECK ── */}
                <Box sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: { xs: '18px', sm: '24px' },
                    p: { xs: 1.8, sm: 3, md: 4 },
                    mb: { xs: 2, sm: 3 },
                    background: isDark
                        ? 'linear-gradient(135deg, #052e25 0%, #031c17 50%, #02120e 100%)'
                        : 'linear-gradient(135deg, #094d42 0%, #063830 50%, #03241f 100%)',
                    color: '#ffffff',
                    boxShadow: '0 20px 45px -15px rgba(4, 41, 35, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: -70,
                        right: -70,
                        width: 220,
                        height: 220,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Badges strip */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                            <Chip
                                icon={isOral ? <MicIcon sx={{ fontSize: '13px !important' }} /> : <WallpaperIcon sx={{ fontSize: '13px !important' }} />}
                                label={isOral ? 'ORAL PRESENTATION' : 'POSTER PRESENTATION'}
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    borderRadius: '6px',
                                    bgcolor: isOral ? 'rgba(2, 132, 199, 0.25)' : 'rgba(147, 51, 234, 0.25)',
                                    color: isOral ? '#7dd3fc' : '#d8b4fe',
                                    border: `1px solid ${isOral ? '#38bdf8' : '#c084fc'}`,
                                }}
                            />
                            <Chip
                                label={paperCode}
                                size="small"
                                sx={{
                                    height: 22,
                                    fontFamily: 'monospace',
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    borderRadius: '6px',
                                    bgcolor: 'rgba(255, 255, 255, 0.12)',
                                    color: '#ffffff',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                }}
                            />
                            <Chip
                                label="PIT IAGI & GEOSEA 2026"
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: '0.66rem',
                                    fontWeight: 700,
                                    borderRadius: '6px',
                                    bgcolor: 'rgba(245, 158, 11, 0.2)',
                                    color: '#fde68a',
                                    border: '1px solid rgba(245, 158, 11, 0.35)',
                                }}
                            />
                        </Box>

                        {/* Title */}
                        <Typography variant="h4" sx={{
                            fontWeight: 900,
                            letterSpacing: '-0.025em',
                            fontSize: { xs: '1.15rem', sm: '1.65rem', md: '2.1rem' },
                            lineHeight: 1.3,
                            color: '#ffffff',
                            mb: { xs: 1.2, sm: 1.8 },
                            maxWidth: 1000,
                        }}>
                            {submission.title}
                        </Typography>

                        {/* Presenter details */}
                        <Stack direction="row" spacing={{ xs: 1.5, sm: 3 }} alignItems="center" flexWrap="wrap">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{
                                    width: { xs: 28, sm: 38 },
                                    height: { xs: 28, sm: 38 },
                                    bgcolor: isOral ? '#0284c7' : '#9333ea',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                    border: '2px solid rgba(255,255,255,0.3)',
                                }}>
                                    {presenterName.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', display: 'block', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                        Presenter
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: { xs: '0.82rem', sm: '0.92rem' } }}>
                                        {presenterName}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)', height: 24, my: 'auto' }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <SchoolIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', display: 'block', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                        Institution
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.92)', fontSize: { xs: '0.76rem', sm: '0.86rem' } }}>
                                        {institution}
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Box>
                </Box>

                {/* ── MOBILE-ONLY LIVE SCORE SUMMARY BANNER (Top Glance on Mobile) ── */}
                <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 2 }}>
                    <Card elevation={0} sx={{
                        borderRadius: '16px',
                        border: `1.5px solid ${liveScore.allFilled ? grade.border : c.cardBorder}`,
                        bgcolor: c.cardBg,
                        p: { xs: 1.4, sm: 2 },
                        boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.03)',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: '0.64rem', textTransform: 'uppercase' }}>
                                    Current Weighted Score
                                </Typography>
                                <Stack direction="row" alignItems="baseline" spacing={0.6} sx={{ mt: 0.1 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 900, color: liveScore.allFilled ? grade.color : c.textPrimary, fontFamily: 'monospace', fontSize: { xs: '1.4rem', sm: '1.8rem' } }}>
                                        {liveScore.allFilled ? liveScore.total.toFixed(2) : (liveScore.total > 0 ? liveScore.total.toFixed(2) : '—')}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: c.textSecondary }}>/10</Typography>
                                    {liveScore.total > 0 && (
                                        <Chip
                                            label={grade.label}
                                            size="small"
                                            sx={{
                                                height: 18,
                                                fontSize: '0.6rem',
                                                fontWeight: 800,
                                                bgcolor: grade.bg,
                                                color: grade.color,
                                                border: `1px solid ${grade.border}`,
                                                ml: 0.5,
                                            }}
                                        />
                                    )}
                                </Stack>
                            </Box>

                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: '0.64rem', textTransform: 'uppercase', display: 'block' }}>
                                    Criteria Scored
                                </Typography>
                                <Chip
                                    label={`${liveScore.filledCount} of ${liveScore.totalCount} completed`}
                                    size="small"
                                    sx={{
                                        mt: 0.3,
                                        fontWeight: 800,
                                        fontSize: '0.66rem',
                                        bgcolor: liveScore.allFilled ? '#ecfdf5' : 'rgba(245, 158, 11, 0.12)',
                                        color: liveScore.allFilled ? '#059669' : '#d97706',
                                    }}
                                />
                            </Box>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={(liveScore.filledCount / liveScore.totalCount) * 100}
                            sx={{
                                height: 4,
                                borderRadius: 2,
                                mt: 1.2,
                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 2,
                                    background: liveScore.allFilled
                                        ? 'linear-gradient(90deg, #059669 0%, #10b981 100%)'
                                        : 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)',
                                },
                            }}
                        />

                        {/* Expandable Category details on mobile */}
                        <Box sx={{ mt: 1.2, pt: 0.8, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                            <Button
                                size="small"
                                fullWidth
                                onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                                endIcon={mobileSummaryOpen ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                                sx={{ textTransform: 'none', fontSize: '0.72rem', fontWeight: 700, color: c.textSecondary, py: 0.1 }}
                            >
                                {mobileSummaryOpen ? 'Hide Category Breakdown' : 'View Category Breakdown'}
                            </Button>

                            <Collapse in={mobileSummaryOpen}>
                                <Stack spacing={0.8} sx={{ mt: 0.8, pt: 0.5 }}>
                                    {rubric.map(cat => {
                                        const catStat = liveScore.catScores[cat.id];
                                        return (
                                            <Box key={cat.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: c.textSecondary, fontSize: '0.7rem' }}>
                                                    {cat.id}. {cat.category} ({cat.weight})
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: cat.sectionColor, fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                                    {catStat?.ws.toFixed(2)} / {catStat?.maxW.toFixed(2)} pts ({Math.round(catStat?.pct || 0)}%)
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Collapse>
                        </Box>
                    </Card>
                </Box>

                {/* ── MAIN 2-COLUMN COCKPIT (Bento + Sticky Score HUD) ── */}
                <form id="evaluation-form" onSubmit={handleSubmit}>
                    <Grid container spacing={{ xs: 2, md: 3.5 }}>
                        {/* ── LEFT COLUMN: Rubric Criteria & Inputs ── */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Stack spacing={{ xs: 2, sm: 3 }}>
                                {/* Rubric Legend Bento Card - Collapsible on Mobile to Save Vertical Space! */}
                                <Card elevation={0} sx={{
                                    borderRadius: { xs: '16px', sm: '20px' },
                                    border: `1.5px solid ${c.cardBorder}`,
                                    bgcolor: c.cardBg,
                                    p: { xs: 1.4, sm: 2.2 },
                                    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)',
                                }}>
                                    <Box
                                        onClick={() => setScaleRefOpen(!scaleRefOpen)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            mb: { xs: scaleRefOpen ? 1.2 : 0, sm: 1.2 },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle2" sx={{
                                                fontWeight: 800,
                                                fontSize: { xs: '0.72rem', sm: '0.78rem' },
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                color: c.textSecondary,
                                            }}>
                                                10-Point Scoring Scale Reference
                                            </Typography>
                                            <Chip
                                                label={scaleRefOpen ? 'Hide' : 'Show'}
                                                size="small"
                                                sx={{
                                                    height: 18,
                                                    fontSize: '0.6rem',
                                                    fontWeight: 800,
                                                    display: { xs: 'inline-flex', sm: 'none' },
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                                                    color: c.textPrimary,
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton size="small" sx={{ display: { xs: 'inline-flex', sm: 'none' }, p: 0.2 }}>
                                                {scaleRefOpen ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
                                            </IconButton>
                                            <Tooltip title="Scores are normalized on a 1-10 integer scale per criterion, then multiplied by the assigned ISO weight to produce the weighted score." arrow>
                                                <IconButton size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                                                    <HelpOutlineIcon sx={{ fontSize: 16, color: c.textSecondary }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: { xs: scaleRefOpen ? 'block' : 'none', sm: 'block' } }}>
                                        <Grid container spacing={0.8} sx={{ mt: { xs: 0.5, sm: 0 } }}>
                                            {[
                                                { range: '9 – 10', label: 'Exceptional', color: TOKENS.exceptional, bg: isDark ? 'rgba(5, 150, 105, 0.15)' : '#ecfdf5', border: '#a7f3d0' },
                                                { range: '7 – 8', label: 'Good / Strong', color: TOKENS.good, bg: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff', border: '#bfdbfe' },
                                                { range: '5 – 6', label: 'Acceptable', color: TOKENS.acceptable, bg: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb', border: '#fde68a' },
                                                { range: '3 – 4', label: 'Below Std', color: TOKENS.belowStd, bg: isDark ? 'rgba(234, 88, 12, 0.15)' : '#fff7ed', border: '#fed7aa' },
                                                { range: '1 – 2', label: 'Unsatisfactory', color: TOKENS.unsatisfactory, bg: isDark ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2', border: '#fecaca' },
                                            ].map((tier, idx) => (
                                                <Grid size={{ xs: 4, sm: 2.4 }} key={idx}>
                                                    <Box sx={{
                                                        p: 0.8,
                                                        borderRadius: '10px',
                                                        textAlign: 'center',
                                                        bgcolor: tier.bg,
                                                        border: `1px solid ${tier.border}`,
                                                    }}>
                                                        <Typography variant="body2" sx={{
                                                            fontWeight: 900,
                                                            color: tier.color,
                                                            fontSize: '0.88rem',
                                                            lineHeight: 1.1,
                                                            fontFamily: 'monospace',
                                                        }}>
                                                            {tier.range}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{
                                                            color: tier.color,
                                                            fontSize: '0.62rem',
                                                            fontWeight: 700,
                                                            display: 'block',
                                                            mt: 0.2,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}>
                                                            {tier.label}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Card>


                                {/* ── CATEGORY BENTO SECTIONS ── */}
                                {rubric.map((cat) => {
                                    const catStat = liveScore.catScores[cat.id];
                                    return (
                                        <Card
                                            key={cat.id}
                                            elevation={0}
                                            sx={{
                                                borderRadius: { xs: '18px', sm: '24px' },
                                                border: `1.5px solid ${c.cardBorder}`,
                                                bgcolor: c.cardBg,
                                                overflow: 'hidden',
                                                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)',
                                            }}
                                        >
                                            {/* Section Header */}
                                            <Box sx={{
                                                p: { xs: 2, sm: 3 },
                                                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                                borderBottom: `1.5px solid ${c.cardBorder}`,
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 1.5,
                                            }}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Box sx={{
                                                        width: { xs: 36, sm: 42 },
                                                        height: { xs: 36, sm: 42 },
                                                        borderRadius: '10px',
                                                        bgcolor: `${cat.sectionColor}18`,
                                                        color: cat.sectionColor,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 900,
                                                        fontSize: { xs: '1.05rem', sm: '1.2rem' },
                                                        border: `1.5px solid ${cat.sectionColor}35`,
                                                    }}>
                                                        {cat.id}
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="h6" sx={{
                                                            fontWeight: 900,
                                                            color: c.textPrimary,
                                                            fontSize: { xs: '0.98rem', sm: '1.15rem' },
                                                            letterSpacing: '-0.015em',
                                                        }}>
                                                            {cat.category}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.72rem', fontWeight: 600 }}>
                                                            {cat.items.length} Criteria • Weight: <strong>{cat.weight}</strong>
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                {/* Category sub-score badge */}
                                                <Box sx={{
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: '10px',
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                                                    border: `1px solid ${c.cardBorder}`,
                                                    textAlign: 'right',
                                                }}>
                                                    <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                                                        Points
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 900, color: cat.sectionColor, fontFamily: 'monospace', fontSize: '0.88rem' }}>
                                                        {catStat?.ws.toFixed(2) || '0.00'} / {catStat?.maxW.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Criteria Items List */}
                                            <Stack divider={<Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }} />}>
                                                {cat.items.map((item) => {
                                                    const rawVal = parseInt(data[item.field]);
                                                    const hasVal = !isNaN(rawVal) && rawVal >= 1 && rawVal <= 10;
                                                    const weightedVal = hasVal ? (rawVal * item.weight / 100).toFixed(2) : null;
                                                    const itemGrade = hasVal ? getGradeTier(rawVal) : null;

                                                    return (
                                                        <Box
                                                            key={item.field}
                                                            sx={{
                                                                p: { xs: 2, sm: 3 },
                                                                bgcolor: hasVal
                                                                    ? (isDark ? `${cat.sectionColor}08` : `${cat.sectionColor}04`)
                                                                    : 'transparent',
                                                                transition: 'background 0.2s ease',
                                                            }}
                                                        >
                                                            {/* Top Info Row */}
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.4, flexWrap: 'wrap' }}>
                                                                        <Chip
                                                                            label={item.code}
                                                                            size="small"
                                                                            sx={{
                                                                                height: 20,
                                                                                fontWeight: 900,
                                                                                fontSize: '0.68rem',
                                                                                borderRadius: '6px',
                                                                                bgcolor: `${cat.sectionColor}15`,
                                                                                color: cat.sectionColor,
                                                                                border: `1px solid ${cat.sectionColor}30`,
                                                                            }}
                                                                        />
                                                                        <Typography variant="subtitle1" sx={{
                                                                            fontWeight: 800,
                                                                            color: c.textPrimary,
                                                                            fontSize: { xs: '0.88rem', sm: '0.98rem' },
                                                                        }}>
                                                                            {item.label}
                                                                        </Typography>
                                                                    </Box>

                                                                    <Typography variant="body2" sx={{
                                                                        color: c.textSecondary,
                                                                        fontSize: { xs: '0.78rem', sm: '0.82rem' },
                                                                        lineHeight: 1.45,
                                                                        maxWidth: 720,
                                                                    }}>
                                                                        {item.desc}
                                                                    </Typography>
                                                                </Box>

                                                                {/* Weight Badge */}
                                                                <Chip
                                                                    label={`${item.weight}%`}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 22,
                                                                        fontWeight: 800,
                                                                        fontSize: '0.7rem',
                                                                        borderRadius: '6px',
                                                                        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                                        color: c.textPrimary,
                                                                        flexShrink: 0,
                                                                    }}
                                                                />
                                                            </Box>

                                                            {/* ── ERGONOMIC SCORING SELECTOR (Mobile Optimized 2x5 Grid / Desktop Row) ── */}
                                                            <Box sx={{
                                                                mt: 1.8,
                                                                p: { xs: 1.4, sm: 1.8 },
                                                                borderRadius: '14px',
                                                                bgcolor: isDark ? 'rgba(0,0,0,0.25)' : '#f8fafc',
                                                                border: `1px solid ${hasVal ? (isDark ? 'rgba(16, 185, 129, 0.3)' : '#cbd5e1') : c.cardBorder}`,
                                                            }}>
                                                                {/* Mobile 2x5 Grid / Desktop 1x10 row */}
                                                                <Box sx={{
                                                                    display: 'grid',
                                                                    gridTemplateColumns: { xs: 'repeat(5, 1fr)', md: 'repeat(10, 1fr)' },
                                                                    gap: { xs: 0.8, sm: 1 },
                                                                    mb: 1.5,
                                                                }}>
                                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                                                                        const isSelected = rawVal === num;
                                                                        const numGrade = getGradeTier(num);
                                                                        return (
                                                                            <Box
                                                                                key={num}
                                                                                onClick={() => setData(item.field, num)}
                                                                                sx={{
                                                                                    height: { xs: 40, sm: 42 },
                                                                                    borderRadius: '10px',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    fontWeight: 900,
                                                                                    fontSize: { xs: '0.92rem', sm: '0.98rem' },
                                                                                    fontFamily: 'monospace',
                                                                                    cursor: 'pointer',
                                                                                    userSelect: 'none',
                                                                                    border: `1.5px solid ${isSelected ? numGrade.color : (isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1')}`,
                                                                                    bgcolor: isSelected
                                                                                        ? (isDark ? `${numGrade.color}25` : numGrade.bg)
                                                                                        : (isDark ? 'rgba(255,255,255,0.03)' : '#ffffff'),
                                                                                    color: isSelected ? numGrade.color : c.textSecondary,
                                                                                    boxShadow: isSelected ? `0 2px 10px ${numGrade.color}35` : 'none',
                                                                                    transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                                                                                    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                                    '&:hover': {
                                                                                        borderColor: numGrade.color,
                                                                                        color: numGrade.color,
                                                                                        bgcolor: isDark ? `${numGrade.color}15` : numGrade.bg,
                                                                                    },
                                                                                    '&:active': { transform: 'scale(0.92)' },
                                                                                }}
                                                                            >
                                                                                {num}
                                                                            </Box>
                                                                        );
                                                                    })}
                                                                </Box>

                                                                {/* Bottom Info & Numeric Manual Input Row */}
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    pt: 1,
                                                                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                                                                    gap: 1.5,
                                                                }}>
                                                                    {/* Weighted Score tag */}
                                                                    <Box>
                                                                        {hasVal ? (
                                                                            <Stack direction="row" spacing={0.8} alignItems="center">
                                                                                <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                                                                                    Weighted:
                                                                                </Typography>
                                                                                <Typography variant="body2" sx={{
                                                                                    fontWeight: 900,
                                                                                    color: itemGrade.color,
                                                                                    fontFamily: 'monospace',
                                                                                    fontSize: '0.9rem',
                                                                                }}>
                                                                                    +{weightedVal} pts
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={itemGrade.label}
                                                                                    size="small"
                                                                                    sx={{
                                                                                        height: 18,
                                                                                        fontSize: '0.62rem',
                                                                                        fontWeight: 800,
                                                                                        bgcolor: itemGrade.bg,
                                                                                        color: itemGrade.color,
                                                                                        border: `1px solid ${itemGrade.border}`,
                                                                                        borderRadius: '4px',
                                                                                    }}
                                                                                />
                                                                            </Stack>
                                                                        ) : (
                                                                            <Typography variant="caption" sx={{ color: c.textSecondary, fontStyle: 'italic', fontSize: '0.72rem' }}>
                                                                                Tap a score from 1 to 10
                                                                            </Typography>
                                                                        )}
                                                                    </Box>

                                                                    {/* Manual Input Fallback */}
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.68rem', display: { xs: 'none', sm: 'inline' } }}>
                                                                            Custom:
                                                                        </Typography>
                                                                        <TextField
                                                                            value={rawVal || ''}
                                                                            onChange={(e) => {
                                                                                const val = parseInt(e.target.value);
                                                                                if (!e.target.value) setData(item.field, '');
                                                                                else if (val >= 1 && val <= 10) setData(item.field, val);
                                                                            }}
                                                                            type="number"
                                                                            placeholder="-"
                                                                            size="small"
                                                                            inputProps={{
                                                                                min: 1,
                                                                                max: 10,
                                                                                style: {
                                                                                    textAlign: 'center',
                                                                                    fontWeight: 900,
                                                                                    fontSize: '0.95rem',
                                                                                    fontFamily: 'monospace',
                                                                                    padding: '4px 2px',
                                                                                },
                                                                            }}
                                                                            sx={{
                                                                                width: 48,
                                                                                '& .MuiOutlinedInput-root': {
                                                                                    borderRadius: '8px',
                                                                                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
                                                                                    '& fieldset': {
                                                                                        borderColor: hasVal ? itemGrade.color : c.cardBorder,
                                                                                        borderWidth: hasVal ? 2 : 1,
                                                                                    },
                                                                                },
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                </Box>
                                                            </Box>

                                                            {errors[item.field] && (
                                                                <Typography variant="caption" sx={{ color: '#dc2626', mt: 0.8, display: 'block', fontWeight: 600 }}>
                                                                    {errors[item.field]}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    );
                                                })}
                                            </Stack>
                                        </Card>
                                    );
                                })}

                                {/* Evaluator Qualitative Notes Bento Card */}
                                <Card elevation={0} sx={{
                                    borderRadius: { xs: '18px', sm: '24px' },
                                    border: `1.5px solid ${c.cardBorder}`,
                                    bgcolor: c.cardBg,
                                    p: { xs: 2, sm: 3 },
                                    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.02)',
                                }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                                        <RateReviewIcon sx={{ color: '#059669', fontSize: 22 }} />
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
                                                Evaluator Comments & Recommendations
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.72rem' }}>
                                                Provide constructive feedback or publication recommendations (Optional).
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        placeholder="Enter constructive notes for the committee and authors..."
                                        value={data.juri_notes}
                                        onChange={(e) => setData('juri_notes', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                fontSize: '0.86rem',
                                                lineHeight: 1.5,
                                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                                '& fieldset': { borderColor: c.cardBorder },
                                                '&:hover fieldset': { borderColor: '#059669' },
                                                '&.Mui-focused fieldset': { borderColor: '#059669', borderWidth: 2 },
                                            },
                                        }}
                                    />
                                </Card>
                            </Stack>
                        </Grid>

                        {/* ── RIGHT COLUMN: DESKTOP STICKY LIVE SCORING HUD COCKPIT ── */}
                        <Grid size={{ xs: 12, lg: 4 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
                            <Box sx={{
                                position: 'sticky',
                                top: 24,
                                zIndex: 10,
                            }}>
                                <Card elevation={0} sx={{
                                    borderRadius: '24px',
                                    border: `1.5px solid ${liveScore.allFilled ? grade.border : c.cardBorder}`,
                                    bgcolor: c.cardBg,
                                    overflow: 'hidden',
                                    boxShadow: liveScore.allFilled
                                        ? (isDark ? '0 12px 35px rgba(5, 150, 105, 0.25)' : '0 12px 35px rgba(5, 150, 105, 0.12)')
                                        : (isDark ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 25px rgba(0,0,0,0.04)'),
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}>
                                    {/* Top Cockpit Header */}
                                    <Box sx={{
                                        p: 3,
                                        background: liveScore.allFilled
                                            ? (isDark
                                                ? 'linear-gradient(135deg, #052e25 0%, #031c17 100%)'
                                                : 'linear-gradient(135deg, #094d42 0%, #059669 100%)')
                                            : (isDark
                                                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                                                : 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'),
                                        color: '#ffffff',
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}>
                                        <Typography variant="caption" sx={{
                                            color: 'rgba(255,255,255,0.7)',
                                            fontWeight: 800,
                                            letterSpacing: '0.12em',
                                            textTransform: 'uppercase',
                                            fontSize: '0.68rem',
                                            display: 'block',
                                            mb: 0.5,
                                        }}>
                                            Weighted Final Score
                                        </Typography>

                                        {/* Giant Score Value */}
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.8, my: 1 }}>
                                            <Typography variant="h2" sx={{
                                                fontWeight: 900,
                                                fontSize: '3.6rem',
                                                lineHeight: 1,
                                                fontFamily: 'monospace',
                                                letterSpacing: '-0.03em',
                                                color: liveScore.allFilled ? '#ffffff' : 'rgba(255,255,255,0.5)',
                                            }}>
                                                {liveScore.allFilled ? liveScore.total.toFixed(2) : '—'}
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
                                                /10
                                            </Typography>
                                        </Box>

                                        {/* Grade Classification Pill */}
                                        {liveScore.allFilled ? (
                                            <Chip
                                                icon={<StarIcon sx={{ fontSize: '14px !important', color: `${grade.color} !important` }} />}
                                                label={grade.label}
                                                size="small"
                                                sx={{
                                                    fontWeight: 900,
                                                    fontSize: '0.74rem',
                                                    bgcolor: '#ffffff',
                                                    color: grade.color,
                                                    borderRadius: '20px',
                                                    px: 1,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                }}
                                            />
                                        ) : (
                                            <Chip
                                                label={`${liveScore.totalCount - liveScore.filledCount} Criteria Left to Score`}
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: '0.7rem',
                                                    bgcolor: 'rgba(255,255,255,0.12)',
                                                    color: '#ffffff',
                                                    borderRadius: '20px',
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {/* Breakdown Bars */}
                                    <Box sx={{ p: 3 }}>
                                        {/* Completion progress */}
                                        <Box sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                                                <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                                                    Evaluation Progress
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: liveScore.allFilled ? '#059669' : c.textPrimary, fontFamily: 'monospace' }}>
                                                    {liveScore.filledCount} / {liveScore.totalCount} ({Math.round((liveScore.filledCount / liveScore.totalCount) * 100)}%)
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(liveScore.filledCount / liveScore.totalCount) * 100}
                                                sx={{
                                                    height: 7,
                                                    borderRadius: 4,
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                        background: liveScore.allFilled
                                                            ? 'linear-gradient(90deg, #059669 0%, #10b981 100%)'
                                                            : 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)',
                                                    },
                                                }}
                                            />
                                        </Box>

                                        <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }} />

                                        {/* Category Breakdown */}
                                        <Typography variant="subtitle2" sx={{
                                            fontWeight: 800,
                                            fontSize: '0.74rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em',
                                            color: c.textSecondary,
                                            mb: 1.5,
                                        }}>
                                            Category Points Breakdown
                                        </Typography>

                                        <Stack spacing={1.5} sx={{ mb: 3 }}>
                                            {rubric.map((cat) => {
                                                const catStat = liveScore.catScores[cat.id];
                                                return (
                                                    <Box key={cat.id}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                            <Typography variant="caption" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.75rem' }}>
                                                                {cat.id}. {cat.category} ({cat.weight})
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ fontWeight: 800, color: cat.sectionColor, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                                                {catStat?.ws.toFixed(2)} / {catStat?.maxW.toFixed(2)} pts
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={catStat?.pct || 0}
                                                            sx={{
                                                                height: 5,
                                                                borderRadius: 3,
                                                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                                                                '& .MuiLinearProgress-bar': {
                                                                    borderRadius: 3,
                                                                    bgcolor: cat.sectionColor,
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                );
                                            })}
                                        </Stack>

                                        {/* Unfilled Warning */}
                                        {!liveScore.allFilled && (
                                            <Alert
                                                severity="warning"
                                                sx={{
                                                    mb: 2.5,
                                                    borderRadius: '12px',
                                                    fontSize: '0.76rem',
                                                    '& .MuiAlert-message': { fontWeight: 600 },
                                                }}
                                            >
                                                <strong>{liveScore.totalCount - liveScore.filledCount} criteria remaining.</strong> Please select a score (1–10) for every item before submitting.
                                            </Alert>
                                        )}

                                        {/* Submit Action Button */}
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={processing || !liveScore.allFilled}
                                            startIcon={processing ? <CircularProgress size={18} color="inherit" /> : (isEditing ? <SaveIcon /> : <CheckCircleIcon />)}
                                            sx={{
                                                py: 1.6,
                                                borderRadius: '14px',
                                                textTransform: 'none',
                                                fontWeight: 800,
                                                fontSize: '0.92rem',
                                                letterSpacing: '0.01em',
                                                ...(liveScore.allFilled ? {
                                                    background: 'linear-gradient(135deg, #094d42 0%, #059669 100%)',
                                                    color: '#ffffff',
                                                    boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #063830 0%, #047857 100%)',
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 10px 28px rgba(5, 150, 105, 0.45)',
                                                    },
                                                } : {
                                                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                                                    color: c.textSecondary,
                                                }),
                                            }}
                                        >
                                            {processing
                                                ? 'Recording Evaluation...'
                                                : isEditing
                                                    ? 'Update Official Evaluation'
                                                    : 'Submit Official Evaluation'}
                                        </Button>

                                        {/* Compliance Guarantee */}
                                        <Typography variant="caption" sx={{
                                            display: 'block',
                                            textAlign: 'center',
                                            color: c.textSecondary,
                                            fontSize: '0.66rem',
                                            lineHeight: 1.45,
                                            mt: 2,
                                        }}>
                                            By submitting, you certify that this evaluation adheres to the official scientific scoring standards of the 55th PIT IAGI & GEOSEA XIX 2026.
                                        </Typography>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </form>

                {/* ── MOBILE-ONLY FLOATING DOCKED BOTTOM BAR (Instant Thumb Action) ── */}
                <Box sx={{
                    display: { xs: 'block', lg: 'none' },
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1100,
                    bgcolor: isDark ? 'rgba(3, 28, 23, 0.95)' : 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(16px)',
                    borderTop: `1.5px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : '#cbd5e1'}`,
                    boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.15)',
                    px: 2,
                    pt: 1.2,
                    pb: 'calc(10px + env(safe-area-inset-bottom, 14px))',
                }}>
                    <Box sx={{ maxWidth: '600px', mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                        {/* Score Glance */}
                        <Box sx={{ minWidth: 120 }}>
                            <Typography variant="caption" sx={{
                                color: c.textSecondary,
                                fontWeight: 700,
                                fontSize: '0.62rem',
                                textTransform: 'uppercase',
                                display: 'block',
                                lineHeight: 1,
                            }}>
                                Total Score
                            </Typography>
                            <Stack direction="row" alignItems="baseline" spacing={0.4} sx={{ mt: 0.2 }}>
                                <Typography variant="h5" sx={{
                                    fontWeight: 900,
                                    color: liveScore.allFilled ? grade.color : c.textPrimary,
                                    fontFamily: 'monospace',
                                    lineHeight: 1,
                                }}>
                                    {liveScore.allFilled ? liveScore.total.toFixed(2) : (liveScore.total > 0 ? liveScore.total.toFixed(2) : '—')}
                                </Typography>
                                <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: '0.7rem' }}>/10</Typography>
                            </Stack>
                            <Typography variant="caption" sx={{
                                color: liveScore.allFilled ? '#059669' : '#d97706',
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                display: 'block',
                                mt: 0.2,
                            }}>
                                {liveScore.allFilled ? 'All 10 Scored ✓' : `${liveScore.totalCount - liveScore.filledCount} left to score`}
                            </Typography>
                        </Box>

                        {/* Submit Button right at thumb's reach */}
                        <Button
                            type="submit"
                            form="evaluation-form"
                            variant="contained"
                            disabled={processing || !liveScore.allFilled}
                            startIcon={processing ? <CircularProgress size={16} color="inherit" /> : (isEditing ? <SaveIcon sx={{ fontSize: 18 }} /> : <CheckCircleIcon sx={{ fontSize: 18 }} />)}
                            sx={{
                                flex: 1,
                                py: 1.3,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 900,
                                fontSize: '0.86rem',
                                letterSpacing: '0.01em',
                                ...(liveScore.allFilled ? {
                                    background: 'linear-gradient(135deg, #094d42 0%, #059669 100%)',
                                    color: '#ffffff',
                                    boxShadow: '0 4px 16px rgba(5, 150, 105, 0.4)',
                                } : {
                                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                                    color: c.textSecondary,
                                }),
                            }}
                        >
                            {processing ? 'Saving...' : isEditing ? 'Update Evaluation' : 'Submit Evaluation'}
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* ═══ SUCCESS CELEBRATION MODAL ═══ */}
            <Dialog
                open={successDialog.open}
                onClose={() => setSuccessDialog({ ...successDialog, open: false })}
                PaperProps={{
                    sx: {
                        borderRadius: { xs: '20px', sm: '24px' },
                        maxWidth: 440,
                        width: '92%',
                        bgcolor: c.cardBg,
                        border: `1.5px solid ${c.cardBorder}`,
                        textAlign: 'center',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                    },
                }}
            >
                <Box sx={{
                    background: 'linear-gradient(135deg, #094d42 0%, #059669 100%)',
                    py: 3.5,
                    px: 2.5,
                    color: '#ffffff',
                }}>
                    <TaskAltIcon sx={{ fontSize: 56, mb: 1, color: '#a7f3d0' }} />
                    <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                        Evaluation Recorded!
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5, fontSize: '0.82rem' }}>
                        The scientific score for this presentation has been finalized.
                    </Typography>
                </Box>

                <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    {successDialog.score !== null && (
                        <Box sx={{
                            p: 2,
                            borderRadius: '16px',
                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                            border: `1px solid ${c.cardBorder}`,
                            mb: 2.5,
                        }}>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                                Final Recorded Score
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 900, color: '#059669', fontFamily: 'monospace', my: 0.5, fontSize: { xs: '2.2rem', sm: '3rem' } }}>
                                {successDialog.score.toFixed(2)}/10
                            </Typography>
                            <Chip
                                label={grade.label}
                                size="small"
                                sx={{
                                    fontWeight: 800,
                                    bgcolor: grade.bg,
                                    color: grade.color,
                                    border: `1px solid ${grade.border}`,
                                    borderRadius: '6px',
                                }}
                            />
                        </Box>
                    )}

                    <Stack spacing={1.2}>
                        <Button
                            fullWidth
                            variant="contained"
                            component={Link}
                            href={route('juri.submissions')}
                            sx={{
                                background: 'linear-gradient(135deg, #094d42 0%, #059669 100%)',
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 800,
                                py: 1.3,
                                color: '#ffffff',
                                boxShadow: '0 6px 18px rgba(5, 150, 105, 0.35)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #063830 0%, #047857 100%)',
                                },
                            }}
                        >
                            Return to Assigned Presentations
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => setSuccessDialog({ ...successDialog, open: false })}
                            sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 700,
                                borderColor: c.cardBorder,
                                color: c.textSecondary,
                            }}
                        >
                            Review & Keep Editing
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>

            {/* ═══ SNACKBAR FEEDBACK ═══ */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: '12px', fontWeight: 700 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
