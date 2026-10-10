import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, TextField, InputAdornment, Select, MenuItem,
    FormControl, InputLabel, Avatar, useTheme, Button, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, Divider,
    Menu, CircularProgress, Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import GradeIcon from '@mui/icons-material/Grade';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import TuneIcon from '@mui/icons-material/Tune';
import MicIcon from '@mui/icons-material/Mic';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import axios from 'axios';

/* ────────────────────────────────────────────────────────────
   Taste-Skill & 21st.dev Style Constants & Interpretation
   ──────────────────────────────────────────────────────────── */
const getScoreTier = (scoreNum, isDark) => {
    if (scoreNum === null || isNaN(scoreNum)) {
        return {
            tier: 'Unscored',
            color: '#9ca3af',
            bg: isDark ? 'rgba(156, 163, 175, 0.12)' : '#f3f4f6',
            border: isDark ? 'rgba(156, 163, 175, 0.25)' : '#e5e7eb',
        };
    }
    if (scoreNum >= 4.5) {
        return {
            tier: 'Exceptional (Top 10%)',
            color: '#059669',
            bg: isDark ? 'rgba(5, 150, 105, 0.18)' : '#ecfdf5',
            border: isDark ? 'rgba(16, 185, 129, 0.35)' : '#a7f3d0',
        };
    }
    if (scoreNum >= 3.8) {
        return {
            tier: 'Strong / High Quality',
            color: '#0284c7',
            bg: isDark ? 'rgba(2, 132, 199, 0.18)' : '#f0f9ff',
            border: isDark ? 'rgba(56, 189, 248, 0.35)' : '#bae6fd',
        };
    }
    if (scoreNum >= 3.0) {
        return {
            tier: 'Good / Standard',
            color: '#2563eb',
            bg: isDark ? 'rgba(37, 99, 235, 0.18)' : '#eff6ff',
            border: isDark ? 'rgba(96, 165, 250, 0.35)' : '#bfdbfe',
        };
    }
    if (scoreNum >= 2.5) {
        return {
            tier: 'Borderline / Needs Revision',
            color: '#d97706',
            bg: isDark ? 'rgba(217, 119, 6, 0.18)' : '#fffbeb',
            border: isDark ? 'rgba(245, 158, 11, 0.35)' : '#fde68a',
        };
    }
    return {
        tier: 'Below Standard / Reject',
        color: '#dc2626',
        bg: isDark ? 'rgba(220, 38, 38, 0.18)' : '#fef2f2',
        border: isDark ? 'rgba(248, 113, 113, 0.35)' : '#fecaca',
    };
};

const getRecommendationBadge = (rec, isDark) => {
    const r = (rec || '').toLowerCase().trim();
    if (r.includes('accept') && (r.includes('oral') || r === 'oral')) {
        return { label: 'Accept as Oral', color: '#059669', bg: isDark ? 'rgba(5, 150, 105, 0.15)' : '#ecfdf5', border: '#a7f3d0' };
    }
    if (r.includes('accept') && (r.includes('poster') || r === 'poster')) {
        return { label: 'Accept as Poster', color: '#0284c7', bg: isDark ? 'rgba(2, 132, 199, 0.15)' : '#f0f9ff', border: '#bae6fd' };
    }
    if (r.includes('accept')) {
        return { label: 'Accepted', color: '#16a34a', bg: isDark ? 'rgba(22, 163, 74, 0.15)' : '#dcfce7', border: '#bbf7d0' };
    }
    if (r.includes('revision') || r.includes('revise')) {
        return { label: 'Revision Required', color: '#d97706', bg: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb', border: '#fde68a' };
    }
    if (r.includes('reject')) {
        return { label: 'Rejected', color: '#dc2626', bg: isDark ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2', border: '#fecaca' };
    }
    return { label: rec || 'Undecided', color: '#6b7280', bg: isDark ? 'rgba(107, 114, 128, 0.15)' : '#f3f4f6', border: '#e5e7eb' };
};

const calculateSingleReviewAvg = (r) => {
    if (!r || r.overall_score === null || r.overall_score === undefined) return null;
    const o = parseFloat(r.originality_score) || 0;
    const rel = parseFloat(r.relevance_score) || 0;
    const cl = parseFloat(r.clarity_score) || 0;
    const m = parseFloat(r.methodology_score) || 0;
    const ov = parseFloat(r.overall_score) || 0;
    return ((o + rel + cl + m + ov) / 5.0).toFixed(2);
};

const calculateSubmissionAvg = (reviews) => {
    if (!reviews || reviews.length === 0) return null;
    const valid = reviews.filter(r => r.overall_score !== null && r.overall_score !== undefined);
    if (valid.length === 0) return null;
    const sum = valid.reduce((acc, r) => {
        const val = parseFloat(calculateSingleReviewAvg(r));
        return acc + (isNaN(val) ? 0 : val);
    }, 0);
    return (sum / valid.length).toFixed(2);
};

export default function AdminScores({
    submissions = {},
    topics = [],
    stats = {},
    filters = {},
}) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    // Search and filter states initialized from props
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [presentationFilter, setPresentationFilter] = useState(filters.presentation || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [topicFilter, setTopicFilter] = useState(filters.topic || 'all');
    const [scoringStatusFilter, setScoringStatusFilter] = useState(filters.scoring_status || 'all');
    const [sortOrder, setSortOrder] = useState(filters.sort || 'highest');
    const [perPage, setPerPage] = useState(filters.per_page || 25);

    // Detail Inspection Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // Exporting dropdown state
    const [exportAnchorEl, setExportAnchorEl] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportingType, setExportingType] = useState('');

    // Debounce search input to server
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            applyFilters({ search: searchQuery });
        }, 450);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Apply filters helper using Inertia
    const applyFilters = (override = {}) => {
        const queryParams = {
            search: override.search !== undefined ? override.search : searchQuery,
            presentation: override.presentation !== undefined ? override.presentation : presentationFilter,
            status: override.status !== undefined ? override.status : statusFilter,
            topic: override.topic !== undefined ? override.topic : topicFilter,
            scoring_status: override.scoring_status !== undefined ? override.scoring_status : scoringStatusFilter,
            sort: override.sort !== undefined ? override.sort : sortOrder,
            per_page: override.per_page !== undefined ? override.per_page : perPage,
            page: override.page !== undefined ? override.page : 1,
        };

        // Remove default 'all' or empty strings to keep URL tidy
        const cleanParams = {};
        Object.entries(queryParams).forEach(([k, v]) => {
            if (v !== '' && v !== 'all' && !(k === 'sort' && v === 'highest') && !(k === 'per_page' && v === 25)) {
                cleanParams[k] = v;
            } else if (k === 'page' && v > 1) {
                cleanParams[k] = v;
            }
        });

        router.get(route('admin.scores'), cleanParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setPresentationFilter('all');
        setStatusFilter('all');
        setTopicFilter('all');
        setScoringStatusFilter('all');
        setSortOrder('highest');
        setPerPage(25);
        router.get(route('admin.scores'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Submissions pagination & list
    const submissionsList = submissions.data || [];
    const totalSubmissions = submissions.total || 0;
    const currentPage = submissions.current_page || 1;
    const lastPage = submissions.last_page || 1;
    const fromIndex = submissions.from || 0;
    const toIndex = submissions.to || 0;

    // Active filters count
    const activeFiltersCount = [
        searchQuery ? 1 : 0,
        presentationFilter !== 'all' ? 1 : 0,
        statusFilter !== 'all' ? 1 : 0,
        topicFilter !== 'all' ? 1 : 0,
        scoringStatusFilter !== 'all' ? 1 : 0,
        sortOrder !== 'highest' ? 1 : 0,
        perPage !== 25 ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    // Status chip mapping
    const getStatusChip = (status) => {
        const map = {
            accepted: { bg: isDark ? 'rgba(22,163,74,0.18)' : '#dcfce7', color: '#16a34a', border: '#86efac' },
            rejected: { bg: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2', color: '#dc2626', border: '#fca5a5' },
            under_review: { bg: isDark ? 'rgba(37,99,235,0.18)' : '#dbeafe', color: '#2563eb', border: '#93c5fd' },
            'under review': { bg: isDark ? 'rgba(37,99,235,0.18)' : '#dbeafe', color: '#2563eb', border: '#93c5fd' },
            revision_required_phase1: { bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', color: '#d97706', border: '#fde68a' },
            revision_required_phase2: { bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', color: '#d97706', border: '#fde68a' },
        };
        return map[status?.toLowerCase()] || {
            bg: isDark ? 'rgba(107,114,128,0.15)' : '#f3f4f6',
            color: '#6b7280',
            border: '#e5e7eb',
        };
    };

    // Full CSV Exporter
    const handleTriggerExport = async (type) => {
        setExportAnchorEl(null);
        setIsExporting(true);
        setExportingType(type);

        try {
            const params = {
                export: type === 'all' ? 'all_scores' : 'filtered',
                search: searchQuery,
                presentation: presentationFilter,
                status: statusFilter,
                topic: topicFilter,
                scoring_status: scoringStatusFilter,
                sort: sortOrder,
            };

            const response = await axios.get(route('admin.scores'), { params });
            const subsToExport = response.data?.submissions || [];

            if (subsToExport.length === 0) {
                alert('No submission data available to export.');
                setIsExporting(false);
                return;
            }

            // Determine maximum number of reviewers for headers
            const maxReviewers = Math.max(
                ...subsToExport.map(s => s.reviews?.length || 0),
                1
            );

            // Build CSV Header
            const headers = [
                'ID',
                'Submission Code',
                'Title',
                'Topic / Theme',
                'Author Full Name',
                'Submitter Name',
                'Email',
                'Affiliation / Organization',
                'Presentation Preference',
                'Submission Status',
                'Assigned Reviewers',
                'Completed Reviews',
                'Overall Consensus Avg Score (1-5)',
                'Score Tier & Evaluation Status',
            ];

            for (let i = 1; i <= maxReviewers; i++) {
                headers.push(
                    `Reviewer ${i} Name`,
                    `Reviewer ${i} Email`,
                    `Reviewer ${i} Overall Avg Score`,
                    `Reviewer ${i} Originality`,
                    `Reviewer ${i} Relevance`,
                    `Reviewer ${i} Clarity`,
                    `Reviewer ${i} Methodology`,
                    `Reviewer ${i} Overall Score`,
                    `Reviewer ${i} Recommendation`,
                    `Reviewer ${i} Comments`,
                    `Reviewer ${i} Phase 2 Recommendation`,
                    `Reviewer ${i} Phase 2 Comments`
                );
            }

            // Build CSV Rows
            const rows = subsToExport.map((sub) => {
                const subAvg = calculateSubmissionAvg(sub.reviews);
                const validReviews = sub.reviews?.filter(r => r.overall_score !== null && r.overall_score !== undefined) || [];
                const tierInfo = getScoreTier(subAvg ? parseFloat(subAvg) : null, isDark);

                const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;

                const row = [
                    sub.id,
                    escape(sub.submission_code || `id-${sub.id}`),
                    escape(sub.title || 'Untitled'),
                    escape(sub.topic || sub.paper_theme || '-'),
                    escape(sub.author_full_name || sub.user?.name || '-'),
                    escape(sub.user?.name || '-'),
                    escape(sub.user?.email || '-'),
                    escape(sub.affiliation || sub.institute_organization || sub.user?.affiliation || '-'),
                    escape(sub.presentation_preference || '-'),
                    escape(sub.status || '-'),
                    sub.reviews?.length || 0,
                    validReviews.length,
                    subAvg !== null ? subAvg : 'N/A',
                    escape(tierInfo.tier),
                ];

                for (let i = 0; i < maxReviewers; i++) {
                    const r = sub.reviews?.[i];
                    if (r) {
                        const rAvg = calculateSingleReviewAvg(r);
                        row.push(
                            escape(r.reviewer?.name || `Reviewer ${i + 1}`),
                            escape(r.reviewer?.email || ''),
                            rAvg !== null ? rAvg : 'N/A',
                            r.originality_score !== null ? r.originality_score : '',
                            r.relevance_score !== null ? r.relevance_score : '',
                            r.clarity_score !== null ? r.clarity_score : '',
                            r.methodology_score !== null ? r.methodology_score : '',
                            r.overall_score !== null ? r.overall_score : '',
                            escape(r.recommendation || ''),
                            escape(r.comments || ''),
                            escape(r.recommendation_phase2 || ''),
                            escape(r.comments_phase2 || '')
                        );
                    } else {
                        row.push('', '', '', '', '', '', '', '', '', '', '', '');
                    }
                }

                return row.join(',');
            });

            // Generate Downloadable CSV with UTF-8 BOM
            const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            const dateStr = new Date().toISOString().slice(0, 10);
            link.download = `iagi_geosea_2026_scores_${type}_${dateStr}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Export error:', err);
            alert('An error occurred while generating the export. Please try again.');
        } finally {
            setIsExporting(false);
            setExportingType('');
        }
    };

    // Card and cell styling tokens
    const cellSx = {
        borderBottom: `1px solid ${c.cardBorder}`,
        py: 1.8,
        px: 2,
        fontSize: '0.84rem',
        color: c.textPrimary,
    };

    const headCellSx = {
        ...cellSx,
        fontWeight: 800,
        fontSize: '0.72rem',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: c.textMuted,
        bgcolor: isDark ? 'rgba(15, 23, 42, 0.7)' : '#f8fafc',
    };

    const inputControlSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#ffffff',
            '& fieldset': { borderColor: c.cardBorder },
            '&:hover fieldset': { borderColor: '#10b981' },
            '&.Mui-focused fieldset': { borderColor: '#10b981' },
        },
    };

    return (
        <SidebarLayout>
            <Head title="Scientific Scores & Rankings • 55th PIT IAGI & GEOSEA 2026" />

            <Box sx={{
                p: { xs: 1.5, sm: 2.5, md: 3.5 },
                minHeight: '100vh',
                bgcolor: c.surfaceBg,
                maxWidth: '1680px',
                mx: 'auto',
            }}>
                {/* ── HERO BANNER: 21st.dev Glassmorphic Header ── */}
                <Box sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: { xs: '20px', sm: '24px' },
                    p: { xs: 2.2, sm: 3, md: 3.8 },
                    mb: { xs: 2.5, sm: 3.5 },
                    background: isDark
                        ? 'linear-gradient(135deg, #022019 0%, #031c17 40%, #051410 100%)'
                        : 'linear-gradient(135deg, #094d42 0%, #063830 50%, #03241f 100%)',
                    color: '#ffffff',
                    boxShadow: '0 20px 45px -15px rgba(3, 36, 31, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                }}>
                    {/* Ambient Glow Circles */}
                    <Box sx={{
                        position: 'absolute',
                        top: -70,
                        right: -70,
                        width: 280,
                        height: 280,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: -50,
                        left: '25%',
                        width: 220,
                        height: 220,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(2, 132, 199, 0.18) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Live Badges */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.8,
                                px: 1.4,
                                py: 0.4,
                                borderRadius: '20px',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.18)',
                                fontSize: { xs: '0.65rem', sm: '0.72rem' },
                                fontWeight: 800,
                                letterSpacing: '0.04em',
                                color: '#a7f3d0',
                                textTransform: 'uppercase',
                            }}>
                                <Box sx={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: '50%',
                                    bgcolor: '#10b981',
                                    boxShadow: '0 0 8px #10b981',
                                }} />
                                Scientific Review & Scoring Intelligence
                            </Box>
                            <Box sx={{
                                px: 1.2,
                                py: 0.4,
                                borderRadius: '20px',
                                bgcolor: 'rgba(217, 119, 6, 0.22)',
                                border: '1px solid rgba(245, 158, 11, 0.4)',
                                fontSize: { xs: '0.65rem', sm: '0.72rem' },
                                fontWeight: 800,
                                color: '#fde68a',
                                letterSpacing: '0.04em',
                            }}>
                                55th PIT IAGI & GEOSEA XIX 2026
                            </Box>
                        </Box>

                        {/* Title & Subtitle */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'flex-start', md: 'center' },
                            justifyContent: 'space-between',
                            gap: 2,
                            mb: 2.5,
                        }}>
                            <Box>
                                <Typography variant="h3" sx={{
                                    fontWeight: 900,
                                    letterSpacing: '-0.03em',
                                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.45rem' },
                                    lineHeight: 1.2,
                                    color: '#ffffff',
                                    mb: 0.8,
                                }}>
                                    Scores & Evaluation Rankings 📊
                                </Typography>
                                <Typography variant="body1" sx={{
                                    color: 'rgba(255, 255, 255, 0.84)',
                                    fontSize: { xs: '0.82rem', sm: '0.94rem' },
                                    maxWidth: 750,
                                    lineHeight: 1.5,
                                }}>
                                    Comprehensive evaluation dashboard tracking peer-review scores, reviewer consensus, rubric distributions, and final recommendation rankings for all scientific submissions.
                                </Typography>
                            </Box>

                            {/* Export Dropdown Button */}
                            <Box>
                                <Button
                                    variant="contained"
                                    onClick={(e) => setExportAnchorEl(e.currentTarget)}
                                    disabled={isExporting}
                                    startIcon={isExporting ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <FileDownloadIcon />}
                                    sx={{
                                        bgcolor: '#10b981',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        px: 2.8,
                                        py: 1.2,
                                        boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.45)',
                                        '&:hover': { bgcolor: '#059669' },
                                    }}
                                >
                                    {isExporting ? `Exporting (${exportingType})...` : 'Export Scores'}
                                </Button>
                                <Menu
                                    anchorEl={exportAnchorEl}
                                    open={Boolean(exportAnchorEl)}
                                    onClose={() => setExportAnchorEl(null)}
                                    PaperProps={{
                                        sx: {
                                            borderRadius: '14px',
                                            boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
                                            border: `1px solid ${c.cardBorder}`,
                                            bgcolor: c.cardBg,
                                            p: 0.5,
                                            minWidth: 240,
                                        },
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => handleTriggerExport('all')}
                                        sx={{ borderRadius: '10px', py: 1.2, fontSize: '0.85rem', fontWeight: 600, color: c.textPrimary }}
                                    >
                                        <FileDownloadIcon sx={{ fontSize: 18, mr: 1.5, color: '#10b981' }} />
                                        Export All Submissions (Full DB)
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleTriggerExport('filtered')}
                                        sx={{ borderRadius: '10px', py: 1.2, fontSize: '0.85rem', fontWeight: 600, color: c.textPrimary }}
                                    >
                                        <FilterListIcon sx={{ fontSize: 18, mr: 1.5, color: '#0284c7' }} />
                                        Export Current Filtered Results
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>

                        {/* Top KPI Metrics embedded in Hero */}
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                            gap: { xs: 1.2, sm: 1.8 },
                        }}>
                            {[
                                {
                                    label: 'Total Submissions',
                                    val: stats.total || 0,
                                    sub: `${stats.oral_count || 0} Oral • ${stats.poster_count || 0} Poster`,
                                    color: '#67e8f9',
                                },
                                {
                                    label: 'Scored / Evaluated',
                                    val: stats.with_scores || 0,
                                    sub: `${Math.round(((stats.with_scores || 0) / Math.max(stats.total || 1, 1)) * 100)}% progress`,
                                    color: '#6ee7b7',
                                },
                                {
                                    label: 'Pending Reviews',
                                    val: stats.pending || 0,
                                    sub: stats.pending === 0 ? 'All reviewed! 🎉' : 'Action required',
                                    color: '#fde047',
                                },
                                {
                                    label: 'Conference Average',
                                    val: stats.conference_avg ? `${stats.conference_avg} / 5.0` : 'N/A',
                                    sub: `${stats.completed_reviews || 0} total reviews`,
                                    color: '#c4b5fd',
                                },
                            ].map((m, idx) => (
                                <Box key={idx} sx={{
                                    p: { xs: 1.4, sm: 1.8 },
                                    borderRadius: { xs: '14px', sm: '16px' },
                                    bgcolor: 'rgba(0, 0, 0, 0.28)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}>
                                    <Typography variant="caption" sx={{
                                        color: 'rgba(255, 255, 255, 0.72)',
                                        display: 'block',
                                        fontSize: { xs: '0.62rem', sm: '0.7rem' },
                                        fontWeight: 800,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                    }}>
                                        {m.label}
                                    </Typography>
                                    <Typography variant="h5" sx={{
                                        fontWeight: 900,
                                        color: m.color,
                                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                        mt: 0.3,
                                        fontFamily: 'monospace',
                                        lineHeight: 1.1,
                                    }}>
                                        {m.val}
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontSize: { xs: '0.65rem', sm: '0.72rem' },
                                        mt: 0.4,
                                        display: 'block',
                                    }}>
                                        {m.sub}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* ── FILTER & SEARCH HUB: 21st.dev Component ── */}
                <Card elevation={0} sx={{
                    borderRadius: '18px',
                    border: `1px solid ${c.cardBorder}`,
                    bgcolor: c.cardBg,
                    mb: 3,
                    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 6px 20px rgba(0,0,0,0.03)',
                }}>
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                        {/* Quick Presentation Segmented Tabs (Oral / Poster / All) */}
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2.2,
                        }}>
                            {[
                                { id: 'all', label: 'All Submissions', icon: null, count: stats.total || 0 },
                                { id: 'oral', label: 'Oral Presentations', icon: <MicIcon sx={{ fontSize: 16 }} />, count: stats.oral_count || 0 },
                                { id: 'poster', label: 'Poster Presentations', icon: <WallpaperIcon sx={{ fontSize: 16 }} />, count: stats.poster_count || 0 },
                            ].map((tab) => {
                                const isActive = presentationFilter === tab.id;
                                return (
                                    <Button
                                        key={tab.id}
                                        onClick={() => {
                                            setPresentationFilter(tab.id);
                                            applyFilters({ presentation: tab.id });
                                        }}
                                        startIcon={tab.icon}
                                        sx={{
                                            borderRadius: '12px',
                                            px: { xs: 1.5, sm: 2 },
                                            py: 0.8,
                                            fontWeight: isActive ? 800 : 600,
                                            fontSize: '0.82rem',
                                            textTransform: 'none',
                                            bgcolor: isActive
                                                ? (isDark ? 'rgba(16, 185, 129, 0.22)' : '#ecfdf5')
                                                : (isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc'),
                                            color: isActive
                                                ? (isDark ? '#34d399' : '#059669')
                                                : c.textMuted,
                                            border: `1px solid ${isActive ? (isDark ? 'rgba(52, 211, 153, 0.45)' : '#a7f3d0') : c.cardBorder}`,
                                            boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none',
                                            '&:hover': {
                                                bgcolor: isActive
                                                    ? (isDark ? 'rgba(16, 185, 129, 0.28)' : '#d1fae5')
                                                    : (isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'),
                                            },
                                        }}
                                    >
                                        {tab.label}
                                        <Chip
                                            size="small"
                                            label={tab.count}
                                            sx={{
                                                ml: 1,
                                                height: 20,
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                bgcolor: isActive
                                                    ? (isDark ? 'rgba(16, 185, 129, 0.35)' : '#10b981')
                                                    : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'),
                                                color: isActive ? '#ffffff' : c.textPrimary,
                                            }}
                                        />
                                    </Button>
                                );
                            })}
                        </Box>

                        {/* Search & Select Row */}
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: '1fr 1fr',
                                md: '2.4fr 1.2fr 1.2fr 1.4fr 1.2fr 1.3fr',
                            },
                            gap: 1.5,
                            alignItems: 'center',
                        }}>
                            {/* Search Field */}
                            <TextField
                                fullWidth
                                placeholder="Search by title, code, author, topic..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: c.textMuted, fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery ? (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setSearchQuery('')}>
                                                <ClearIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null,
                                }}
                                sx={{ ...inputControlSx, '& input': { color: c.textPrimary, fontSize: '0.85rem' } }}
                            />

                            {/* Presentation Filter Dropdown */}
                            <FormControl size="small" sx={inputControlSx}>
                                <InputLabel sx={{ color: c.textMuted, fontSize: '0.82rem' }}>Presentation</InputLabel>
                                <Select
                                    value={presentationFilter}
                                    label="Presentation"
                                    onChange={(e) => {
                                        setPresentationFilter(e.target.value);
                                        applyFilters({ presentation: e.target.value });
                                    }}
                                    sx={{ color: c.textPrimary, fontSize: '0.82rem' }}
                                >
                                    <MenuItem value="all">All Types</MenuItem>
                                    <MenuItem value="oral">🎤 Oral</MenuItem>
                                    <MenuItem value="poster">🖼️ Poster</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Scoring Status Filter */}
                            <FormControl size="small" sx={inputControlSx}>
                                <InputLabel sx={{ color: c.textMuted, fontSize: '0.82rem' }}>Scoring Status</InputLabel>
                                <Select
                                    value={scoringStatusFilter}
                                    label="Scoring Status"
                                    onChange={(e) => {
                                        setScoringStatusFilter(e.target.value);
                                        applyFilters({ scoring_status: e.target.value });
                                    }}
                                    sx={{ color: c.textPrimary, fontSize: '0.82rem' }}
                                >
                                    <MenuItem value="all">All Scoring States</MenuItem>
                                    <MenuItem value="scored">Scored / Finalized</MenuItem>
                                    <MenuItem value="pending">Pending Review</MenuItem>
                                    <MenuItem value="multi_reviewer">Multi-Reviewer (2+)</MenuItem>
                                    <MenuItem value="unassigned">Unassigned (0 Reviewer)</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Topic / Theme Filter */}
                            <FormControl size="small" sx={inputControlSx}>
                                <InputLabel sx={{ color: c.textMuted, fontSize: '0.82rem' }}>Scientific Topic</InputLabel>
                                <Select
                                    value={topicFilter}
                                    label="Scientific Topic"
                                    onChange={(e) => {
                                        setTopicFilter(e.target.value);
                                        applyFilters({ topic: e.target.value });
                                    }}
                                    sx={{ color: c.textPrimary, fontSize: '0.82rem' }}
                                >
                                    <MenuItem value="all">All Scientific Topics</MenuItem>
                                    {topics.map((t, idx) => (
                                        <MenuItem key={idx} value={t}>
                                            <Typography variant="body2" noWrap sx={{ fontSize: '0.82rem', maxWidth: 280 }}>
                                                {t}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Submission Status Filter */}
                            <FormControl size="small" sx={inputControlSx}>
                                <InputLabel sx={{ color: c.textMuted, fontSize: '0.82rem' }}>Submission Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Submission Status"
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        applyFilters({ status: e.target.value });
                                    }}
                                    sx={{ color: c.textPrimary, fontSize: '0.82rem' }}
                                >
                                    <MenuItem value="all">All Statuses</MenuItem>
                                    <MenuItem value="accepted">Accepted</MenuItem>
                                    <MenuItem value="under_review">Under Review</MenuItem>
                                    <MenuItem value="revision_required_phase1">Revision Phase 1</MenuItem>
                                    <MenuItem value="revision_required_phase2">Revision Phase 2</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Sort by Score / Date */}
                            <FormControl size="small" sx={inputControlSx}>
                                <InputLabel sx={{ color: c.textMuted, fontSize: '0.82rem' }}>Sort Order</InputLabel>
                                <Select
                                    value={sortOrder}
                                    label="Sort Order"
                                    onChange={(e) => {
                                        setSortOrder(e.target.value);
                                        applyFilters({ sort: e.target.value });
                                    }}
                                    sx={{ color: c.textPrimary, fontSize: '0.82rem' }}
                                >
                                    <MenuItem value="highest">Highest Score First</MenuItem>
                                    <MenuItem value="lowest">Lowest Score First</MenuItem>
                                    <MenuItem value="latest">Newest Submissions</MenuItem>
                                    <MenuItem value="oldest">Oldest Submissions</MenuItem>
                                    <MenuItem value="title_asc">Title (A → Z)</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Active Filters bar & Per Page */}
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1.5,
                            mt: 2,
                            pt: 1.8,
                            borderTop: `1px solid ${c.cardBorder}`,
                        }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    Active Filters ({activeFiltersCount}):
                                </Typography>
                                {searchQuery && (
                                    <Chip
                                        size="small"
                                        label={`Search: "${searchQuery}"`}
                                        onDelete={() => setSearchQuery('')}
                                        sx={{ borderRadius: '8px', fontSize: '0.72rem', bgcolor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5', color: '#059669' }}
                                    />
                                )}
                                {presentationFilter !== 'all' && (
                                    <Chip
                                        size="small"
                                        label={`Type: ${presentationFilter === 'oral' ? 'Oral Presentation' : 'Poster Presentation'}`}
                                        onDelete={() => {
                                            setPresentationFilter('all');
                                            applyFilters({ presentation: 'all' });
                                        }}
                                        sx={{ borderRadius: '8px', fontSize: '0.72rem', bgcolor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5', color: '#059669' }}
                                    />
                                )}
                                {scoringStatusFilter !== 'all' && (
                                    <Chip
                                        size="small"
                                        label={`Score State: ${scoringStatusFilter}`}
                                        onDelete={() => {
                                            setScoringStatusFilter('all');
                                            applyFilters({ scoring_status: 'all' });
                                        }}
                                        sx={{ borderRadius: '8px', fontSize: '0.72rem', bgcolor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff', color: '#2563eb' }}
                                    />
                                )}
                                {topicFilter !== 'all' && (
                                    <Chip
                                        size="small"
                                        label={`Topic: ${topicFilter}`}
                                        onDelete={() => {
                                            setTopicFilter('all');
                                            applyFilters({ topic: 'all' });
                                        }}
                                        sx={{ borderRadius: '8px', fontSize: '0.72rem', bgcolor: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb', color: '#d97706' }}
                                    />
                                )}
                                {statusFilter !== 'all' && (
                                    <Chip
                                        size="small"
                                        label={`Status: ${statusFilter}`}
                                        onDelete={() => {
                                            setStatusFilter('all');
                                            applyFilters({ status: 'all' });
                                        }}
                                        sx={{ borderRadius: '8px', fontSize: '0.72rem' }}
                                    />
                                )}
                                {activeFiltersCount > 0 && (
                                    <Button
                                        size="small"
                                        onClick={handleResetFilters}
                                        sx={{
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            color: '#ef4444',
                                            textTransform: 'none',
                                            p: '2px 8px',
                                        }}
                                    >
                                        Reset All
                                    </Button>
                                )}
                            </Box>

                            {/* Per page selector & result count */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.78rem' }}>
                                    Showing <strong>{fromIndex}–{toIndex}</strong> of <strong>{totalSubmissions}</strong>
                                </Typography>
                                <FormControl size="small" sx={{ minWidth: 90, ...inputControlSx }}>
                                    <Select
                                        value={perPage}
                                        onChange={(e) => {
                                            setPerPage(e.target.value);
                                            applyFilters({ per_page: e.target.value });
                                        }}
                                        sx={{ fontSize: '0.78rem', height: 32 }}
                                    >
                                        <MenuItem value={15}>15 / page</MenuItem>
                                        <MenuItem value={25}>25 / page</MenuItem>
                                        <MenuItem value={50}>50 / page</MenuItem>
                                        <MenuItem value={100}>100 / page</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* ── SUBMISSIONS SCORES TABLE: Luxury Taste-Skill UI ── */}
                <Card elevation={0} sx={{
                    borderRadius: '20px',
                    border: `1px solid ${c.cardBorder}`,
                    bgcolor: c.cardBg,
                    overflow: 'hidden',
                    boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.25)' : '0 8px 30px rgba(0,0,0,0.04)',
                }}>
                    <TableContainer>
                        <Table size="medium">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ ...headCellSx, width: 60 }}>#</TableCell>
                                    <TableCell sx={headCellSx}>Paper / Submission</TableCell>
                                    <TableCell sx={headCellSx}>Author & Affiliation</TableCell>
                                    <TableCell sx={headCellSx}>Status</TableCell>
                                    <TableCell sx={headCellSx}>Reviewers Consensus</TableCell>
                                    <TableCell align="center" sx={headCellSx}>Avg Score (1–5)</TableCell>
                                    <TableCell align="center" sx={{ ...headCellSx, width: 110 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissionsList.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                                                <AssessmentIcon sx={{ fontSize: 56, color: isDark ? '#374151' : '#cbd5e1' }} />
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary }}>
                                                    No submissions found
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: c.textMuted, maxWidth: 400 }}>
                                                    No papers match your current search query or filter criteria. Try resetting the filters or broadening your terms.
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={handleResetFilters}
                                                    sx={{ mt: 1, textTransform: 'none', borderRadius: '10px', fontWeight: 700 }}
                                                >
                                                    Reset Filters
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    submissionsList.map((sub, idx) => {
                                        const globalIndex = fromIndex + idx;
                                        const subAvg = calculateSubmissionAvg(sub.reviews);
                                        const scoreNum = subAvg !== null ? parseFloat(subAvg) : null;
                                        const tier = getScoreTier(scoreNum, isDark);
                                        const statusStyle = getStatusChip(sub.status);
                                        const validReviews = sub.reviews?.filter(r => r.overall_score !== null && r.overall_score !== undefined) || [];

                                        return (
                                            <TableRow
                                                key={sub.id}
                                                hover
                                                sx={{
                                                    transition: 'background-color 0.15s ease',
                                                    '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.025)' : '#f8fafc' },
                                                }}
                                            >
                                                {/* Rank Index */}
                                                <TableCell sx={{ ...cellSx, fontWeight: 800, color: c.textMuted, fontSize: '0.8rem' }}>
                                                    {globalIndex}
                                                </TableCell>

                                                {/* Title & Metadata */}
                                                <TableCell sx={{ ...cellSx, maxWidth: 380 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.4 }}>
                                                        <Chip
                                                            size="small"
                                                            label={sub.submission_code || `ID-${sub.id}`}
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '0.68rem',
                                                                fontWeight: 800,
                                                                fontFamily: 'monospace',
                                                                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                                                                color: c.textPrimary,
                                                            }}
                                                        />
                                                        {(sub.topic || sub.paper_theme) && (
                                                            <Chip
                                                                size="small"
                                                                label={sub.topic || sub.paper_theme}
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.66rem',
                                                                    fontWeight: 700,
                                                                    bgcolor: isDark ? 'rgba(56, 189, 248, 0.12)' : '#e0f2fe',
                                                                    color: '#0284c7',
                                                                    maxWidth: 220,
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 800,
                                                            color: c.textPrimary,
                                                            fontSize: '0.88rem',
                                                            lineHeight: 1.35,
                                                            mb: 0.3,
                                                        }}
                                                    >
                                                        {sub.title || 'Untitled Submission'}
                                                    </Typography>
                                                    {sub.presentation_preference && (
                                                        <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.72rem' }}>
                                                            Pref: <strong style={{ color: c.textPrimary }}>{sub.presentation_preference}</strong>
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* Author & Affiliation */}
                                                <TableCell sx={cellSx}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3 }}>
                                                        <Avatar sx={{
                                                            width: 34,
                                                            height: 34,
                                                            bgcolor: '#094d42',
                                                            color: '#a7f3d0',
                                                            fontWeight: 800,
                                                            fontSize: '0.8rem',
                                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                                        }}>
                                                            {(sub.author_full_name || sub.user?.name || 'A').charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Box sx={{ maxWidth: 220 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: c.textPrimary }} noWrap>
                                                                {sub.author_full_name || sub.user?.name || 'Unknown Author'}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.72rem', display: 'block' }} noWrap>
                                                                {sub.affiliation || sub.institute_organization || sub.user?.affiliation || 'No institution listed'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                {/* Submission Status */}
                                                <TableCell sx={cellSx}>
                                                    <Chip
                                                        label={sub.status ? sub.status.replace(/_/g, ' ') : 'Pending'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: statusStyle.bg,
                                                            color: statusStyle.color,
                                                            border: `1px solid ${statusStyle.border || 'transparent'}`,
                                                            fontWeight: 800,
                                                            fontSize: '0.72rem',
                                                            textTransform: 'capitalize',
                                                            borderRadius: '8px',
                                                            height: 24,
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* Reviewers Consensus & Badges */}
                                                <TableCell sx={cellSx}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                            <Typography variant="caption" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.76rem' }}>
                                                                {validReviews.length}/{sub.reviews?.length || 0} Evaluated
                                                            </Typography>
                                                            {sub.reviews?.length >= 2 && (
                                                                <Chip
                                                                    size="small"
                                                                    label="2+ Juri"
                                                                    sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}
                                                                />
                                                            )}
                                                        </Box>

                                                        {/* Individual Reviewer Mini-Pills */}
                                                        {validReviews.length > 0 ? (
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                                                                {validReviews.map((r, rIdx) => {
                                                                    const rAvg = calculateSingleReviewAvg(r);
                                                                    const rTier = getScoreTier(rAvg ? parseFloat(rAvg) : null, isDark);
                                                                    return (
                                                                        <Tooltip key={r.id || rIdx} title={`${r.reviewer?.name || `Reviewer ${rIdx + 1}`}: ${rAvg}/5.0 • ${r.recommendation || 'No recommendation'}`} arrow>
                                                                            <Box sx={{
                                                                                display: 'inline-flex',
                                                                                alignItems: 'center',
                                                                                gap: 0.5,
                                                                                px: 0.8,
                                                                                py: 0.2,
                                                                                borderRadius: '6px',
                                                                                bgcolor: rTier.bg,
                                                                                border: `1px solid ${rTier.border}`,
                                                                                fontSize: '0.68rem',
                                                                                fontWeight: 700,
                                                                                color: rTier.color,
                                                                                cursor: 'pointer',
                                                                            }}>
                                                                                <span>R{rIdx + 1}:</span>
                                                                                <strong>{rAvg}</strong>
                                                                            </Box>
                                                                        </Tooltip>
                                                                    );
                                                                })}
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="caption" sx={{ color: c.textMuted, fontStyle: 'italic', fontSize: '0.72rem' }}>
                                                                Awaiting review
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>

                                                {/* Final Average Score Card */}
                                                <TableCell align="center" sx={cellSx}>
                                                    {scoreNum !== null ? (
                                                        <Box sx={{
                                                            display: 'inline-flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            px: 1.8,
                                                            py: 0.8,
                                                            borderRadius: '12px',
                                                            bgcolor: tier.bg,
                                                            border: `1px solid ${tier.border}`,
                                                            minWidth: 75,
                                                        }}>
                                                            <Typography sx={{
                                                                fontWeight: 900,
                                                                fontSize: '1.25rem',
                                                                lineHeight: 1,
                                                                color: tier.color,
                                                                fontFamily: 'monospace',
                                                            }}>
                                                                {subAvg}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{
                                                                fontSize: '0.62rem',
                                                                fontWeight: 800,
                                                                color: tier.color,
                                                                mt: 0.3,
                                                                letterSpacing: '0.02em',
                                                            }}>
                                                                {scoreNum >= 4.5 ? 'TOP 10%' : scoreNum >= 3.8 ? 'STRONG' : scoreNum >= 3.0 ? 'GOOD' : 'BORDERLINE'}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Chip
                                                            label="Not Scored"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: isDark ? 'rgba(156, 163, 175, 0.1)' : '#f3f4f6',
                                                                color: c.textMuted,
                                                                fontWeight: 700,
                                                                fontSize: '0.72rem',
                                                                borderRadius: '8px',
                                                                height: 26,
                                                            }}
                                                        />
                                                    )}
                                                </TableCell>

                                                {/* Detail Modal Action */}
                                                <TableCell align="center" sx={cellSx}>
                                                    <Tooltip title="View Detailed Evaluations & Rubrics" arrow>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                setSelectedSubmission(sub);
                                                                setDetailModalOpen(true);
                                                            }}
                                                            startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                                                            sx={{
                                                                borderRadius: '10px',
                                                                textTransform: 'none',
                                                                fontWeight: 700,
                                                                fontSize: '0.78rem',
                                                                color: isDark ? '#34d399' : '#059669',
                                                                borderColor: isDark ? 'rgba(52, 211, 153, 0.4)' : '#a7f3d0',
                                                                '&:hover': {
                                                                    bgcolor: isDark ? 'rgba(52, 211, 153, 0.1)' : '#ecfdf5',
                                                                    borderColor: '#10b981',
                                                                },
                                                            }}
                                                        >
                                                            Inspect
                                                        </Button>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* ── PAGINATION CONTROLS ── */}
                    {lastPage > 1 && (
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1.5,
                            px: 3,
                            py: 2,
                            borderTop: `1px solid ${c.cardBorder}`,
                            bgcolor: isDark ? 'rgba(0, 0, 0, 0.15)' : '#f9fafb',
                        }}>
                            <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.82rem' }}>
                                Showing <strong>{fromIndex}</strong> to <strong>{toIndex}</strong> of <strong>{totalSubmissions}</strong> submissions
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <Button
                                    size="small"
                                    disabled={currentPage <= 1}
                                    onClick={() => applyFilters({ page: currentPage - 1 })}
                                    sx={{
                                        minWidth: 40,
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        color: c.textPrimary,
                                        border: `1px solid ${c.cardBorder}`,
                                    }}
                                >
                                    ‹ Prev
                                </Button>

                                {Array.from({ length: Math.min(lastPage, 7) }, (_, i) => {
                                    let pageNum;
                                    if (lastPage <= 7) pageNum = i + 1;
                                    else if (currentPage <= 4) pageNum = i + 1;
                                    else if (currentPage >= lastPage - 3) pageNum = lastPage - 6 + i;
                                    else pageNum = currentPage - 3 + i;

                                    const isCurrent = pageNum === currentPage;
                                    return (
                                        <Button
                                            key={pageNum}
                                            size="small"
                                            onClick={() => applyFilters({ page: pageNum })}
                                            sx={{
                                                minWidth: 34,
                                                height: 34,
                                                borderRadius: '8px',
                                                fontWeight: isCurrent ? 900 : 600,
                                                fontSize: '0.8rem',
                                                background: isCurrent ? 'linear-gradient(135deg, #094d42, #10b981)' : 'transparent',
                                                color: isCurrent ? '#ffffff' : c.textPrimary,
                                                border: isCurrent ? 'none' : `1px solid ${c.cardBorder}`,
                                                '&:hover': {
                                                    bgcolor: isCurrent ? '#094d42' : isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                },
                                            }}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}

                                <Button
                                    size="small"
                                    disabled={currentPage >= lastPage}
                                    onClick={() => applyFilters({ page: currentPage + 1 })}
                                    sx={{
                                        minWidth: 40,
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        color: c.textPrimary,
                                        border: `1px solid ${c.cardBorder}`,
                                    }}
                                >
                                    Next ›
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Card>

                {/* ── DETAILED EVALUATION MODAL: 21st.dev Dialog ── */}
                <Dialog
                    open={detailModalOpen}
                    onClose={() => setDetailModalOpen(false)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '24px',
                            bgcolor: c.cardBg,
                            border: `1px solid ${c.cardBorder}`,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
                            overflow: 'hidden',
                        },
                    }}
                >
                    {selectedSubmission && (
                        <>
                            {/* Modal Header */}
                            <DialogTitle sx={{
                                p: { xs: 2, sm: 3 },
                                background: isDark
                                    ? 'linear-gradient(135deg, #031c17 0%, #062b23 100%)'
                                    : 'linear-gradient(135deg, #094d42 0%, #063830 100%)',
                                color: '#ffffff',
                                borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Chip
                                                size="small"
                                                label={selectedSubmission.submission_code || `ID-${selectedSubmission.id}`}
                                                sx={{
                                                    fontFamily: 'monospace',
                                                    fontWeight: 800,
                                                    fontSize: '0.72rem',
                                                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                                                    color: '#a7f3d0',
                                                }}
                                            />
                                            {(selectedSubmission.topic || selectedSubmission.paper_theme) && (
                                                <Chip
                                                    size="small"
                                                    label={selectedSubmission.topic || selectedSubmission.paper_theme}
                                                    sx={{
                                                        fontWeight: 700,
                                                        fontSize: '0.7rem',
                                                        bgcolor: 'rgba(56, 189, 248, 0.2)',
                                                        color: '#7dd3fc',
                                                    }}
                                                />
                                            )}
                                            <Chip
                                                size="small"
                                                label={selectedSubmission.status}
                                                sx={{
                                                    fontWeight: 800,
                                                    fontSize: '0.7rem',
                                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                    color: '#ffffff',
                                                    textTransform: 'capitalize',
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.3, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                                            {selectedSubmission.title}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        onClick={() => setDetailModalOpen(false)}
                                        sx={{ color: 'rgba(255, 255, 255, 0.8)', '&:hover': { color: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)' } }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </DialogTitle>

                            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                                {/* Author & Consensus Summary Banner */}
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' },
                                    gap: 2,
                                    p: 2,
                                    borderRadius: '16px',
                                    bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                                    border: `1px solid ${c.cardBorder}`,
                                    mb: 3,
                                }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            Author Details
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary, mt: 0.2 }}>
                                            {selectedSubmission.author_full_name || selectedSubmission.user?.name || 'Unknown Author'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem', mt: 0.2 }}>
                                            {selectedSubmission.affiliation || selectedSubmission.institute_organization || selectedSubmission.user?.affiliation || 'No Affiliation'} • {selectedSubmission.user?.email || '-'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: { xs: 'flex-start', sm: 'flex-end' },
                                        justifyContent: 'center',
                                    }}>
                                        <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            Consensus Score
                                        </Typography>
                                        {calculateSubmissionAvg(selectedSubmission.reviews) !== null ? (
                                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#10b981', fontFamily: 'monospace', lineHeight: 1.1 }}>
                                                {calculateSubmissionAvg(selectedSubmission.reviews)} <span style={{ fontSize: '0.9rem', color: c.textMuted }}>/ 5.0</span>
                                            </Typography>
                                        ) : (
                                            <Typography variant="body2" sx={{ color: c.textMuted, fontStyle: 'italic', mt: 0.5 }}>
                                                Not Evaluated Yet
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                {/* Reviewers Breakdowns */}
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: c.textPrimary, mb: 1.8, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FactCheckIcon sx={{ color: '#10b981', fontSize: 20 }} />
                                    Reviewer Rubrics & Qualitative Evaluations ({selectedSubmission.reviews?.length || 0})
                                </Typography>

                                {(!selectedSubmission.reviews || selectedSubmission.reviews.length === 0) ? (
                                    <Box sx={{ p: 4, textAlign: 'center', borderRadius: '16px', bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#f9fafb', border: `1px dashed ${c.cardBorder}` }}>
                                        <PendingActionsIcon sx={{ fontSize: 40, color: c.textMuted, mb: 1 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: c.textPrimary }}>
                                            No reviewers have been assigned to this paper.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={2.5}>
                                        {selectedSubmission.reviews.map((r, rIdx) => {
                                            const rAvg = calculateSingleReviewAvg(r);
                                            const rTier = getScoreTier(rAvg ? parseFloat(rAvg) : null, isDark);
                                            const recBadge = getRecommendationBadge(r.recommendation, isDark);

                                            return (
                                                <Card key={r.id || rIdx} elevation={0} sx={{
                                                    borderRadius: '16px',
                                                    border: `1px solid ${c.cardBorder}`,
                                                    bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : '#ffffff',
                                                    overflow: 'hidden',
                                                }}>
                                                    {/* Reviewer Header */}
                                                    <Box sx={{
                                                        p: 2,
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: 1.5,
                                                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                                                        borderBottom: `1px solid ${c.cardBorder}`,
                                                    }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                            <Avatar sx={{ width: 36, height: 36, bgcolor: '#0284c7', fontSize: '0.85rem', fontWeight: 800 }}>
                                                                {(r.reviewer?.name || `R${rIdx + 1}`).charAt(0)}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: c.textPrimary }}>
                                                                    {r.reviewer?.name || `Reviewer ${rIdx + 1}`}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.72rem' }}>
                                                                    {r.reviewer?.affiliation || r.reviewer?.email || 'Peer Reviewer'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {r.recommendation && (
                                                                <Chip
                                                                    label={recBadge.label}
                                                                    size="small"
                                                                    sx={{
                                                                        fontWeight: 800,
                                                                        fontSize: '0.72rem',
                                                                        bgcolor: recBadge.bg,
                                                                        color: recBadge.color,
                                                                        border: `1px solid ${recBadge.border}`,
                                                                    }}
                                                                />
                                                            )}
                                                            <Box sx={{
                                                                px: 1.5,
                                                                py: 0.4,
                                                                borderRadius: '10px',
                                                                bgcolor: rTier.bg,
                                                                border: `1px solid ${rTier.border}`,
                                                                textAlign: 'center',
                                                            }}>
                                                                <Typography sx={{ fontWeight: 900, color: rTier.color, fontFamily: 'monospace', fontSize: '1rem', lineHeight: 1 }}>
                                                                    {rAvg !== null ? `${rAvg} / 5.0` : 'Pending'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    <CardContent sx={{ p: 2.2 }}>
                                                        {/* 5-Criteria Progress Bars */}
                                                        <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', mb: 1.2 }}>
                                                            Rubric Breakdown (Scale 1 – 5)
                                                        </Typography>
                                                        <Box sx={{
                                                            display: 'grid',
                                                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                                            gap: 1.5,
                                                            mb: 2,
                                                        }}>
                                                            {[
                                                                { label: 'Originality & Novelty', val: r.originality_score },
                                                                { label: 'Relevance to Theme', val: r.relevance_score },
                                                                { label: 'Clarity of Presentation', val: r.clarity_score },
                                                                { label: 'Methodology & Rigor', val: r.methodology_score },
                                                                { label: 'Overall Scientific Merit', val: r.overall_score },
                                                            ].map((crit, cIdx) => {
                                                                const numVal = parseFloat(crit.val) || 0;
                                                                const percent = Math.min((numVal / 5.0) * 100, 100);
                                                                return (
                                                                    <Box key={cIdx} sx={{ p: 1.2, borderRadius: '10px', bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f8fafc', border: `1px solid ${c.cardBorder}` }}>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                                            <Typography variant="caption" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.74rem' }}>
                                                                                {crit.label}
                                                                            </Typography>
                                                                            <Typography variant="caption" sx={{ fontWeight: 900, fontFamily: 'monospace', color: numVal > 0 ? '#10b981' : c.textMuted }}>
                                                                                {crit.val !== null && crit.val !== undefined ? `${crit.val} / 5` : 'N/A'}
                                                                            </Typography>
                                                                        </Box>
                                                                        <LinearProgress
                                                                            variant="determinate"
                                                                            value={percent}
                                                                            sx={{
                                                                                height: 6,
                                                                                borderRadius: 3,
                                                                                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                                                                                '& .MuiLinearProgress-bar': {
                                                                                    borderRadius: 3,
                                                                                    background: numVal >= 4 ? 'linear-gradient(90deg, #059669, #10b981)' : numVal >= 3 ? 'linear-gradient(90deg, #2563eb, #38bdf8)' : 'linear-gradient(90deg, #d97706, #f59e0b)',
                                                                                },
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                );
                                                            })}
                                                        </Box>

                                                        {/* Qualitative Comments Block */}
                                                        {r.comments ? (
                                                            <Box sx={{
                                                                p: 1.8,
                                                                borderRadius: '12px',
                                                                bgcolor: isDark ? 'rgba(0,0,0,0.25)' : '#f8fafc',
                                                                borderLeft: '4px solid #10b981',
                                                                mb: r.reviewed_file ? 1.5 : 0,
                                                            }}>
                                                                <Typography variant="caption" sx={{ fontWeight: 800, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', mb: 0.5 }}>
                                                                    Reviewer Feedback / Comments:
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: c.textPrimary, fontSize: '0.84rem', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                                                                    {r.comments}
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="caption" sx={{ color: c.textMuted, fontStyle: 'italic' }}>
                                                                No written comments provided.
                                                            </Typography>
                                                        )}

                                                        {/* Download Reviewed File Attachment */}
                                                        {r.reviewed_file && (
                                                            <Box sx={{ mt: 1.5 }}>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    component="a"
                                                                    href={`/storage/${r.reviewed_file}`}
                                                                    target="_blank"
                                                                    download
                                                                    startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                                                                    sx={{
                                                                        borderRadius: '8px',
                                                                        textTransform: 'none',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.78rem',
                                                                    }}
                                                                >
                                                                    Download Reviewed Annotated File
                                                                </Button>
                                                            </Box>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </Stack>
                                )}
                            </DialogContent>

                            <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}`, bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc' }}>
                                <Button
                                    onClick={() => setDetailModalOpen(false)}
                                    sx={{ fontWeight: 800, color: c.textMuted, textTransform: 'none', px: 2.5 }}
                                >
                                    Close
                                </Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>
            </Box>
        </SidebarLayout>
    );
}
