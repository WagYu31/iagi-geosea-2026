import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Stack, Select, MenuItem, FormControl, InputLabel, Avatar, Card,
    CardContent, useTheme, Divider, IconButton,
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function ReviewerSubmissions({ reviews = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const [reviewDialog, setReviewDialog] = useState({ open: false, review: null });
    const [scores, setScores] = useState({
        originality_score: 0,
        relevance_score: 0,
        clarity_score: 0,
        methodology_score: 0,
        overall_score: 0,
    });
    const [comments, setComments] = useState('');
    const [reviewStatusFilter, setReviewStatusFilter] = useState('all');

    const filteredReviews = reviews.filter(review => {
        if (reviewStatusFilter === 'all') return true;
        if (reviewStatusFilter === 'completed') return review.originality_score;
        if (reviewStatusFilter === 'pending') return !review.originality_score;
        return true;
    });

    const handleOpenReviewDialog = (review) => {
        setReviewDialog({ open: true, review });
        setScores({
            originality_score: review.originality_score || 0,
            relevance_score: review.relevance_score || 0,
            clarity_score: review.clarity_score || 0,
            methodology_score: review.methodology_score || 0,
            overall_score: review.overall_score || 0,
        });
        setComments(review.comments || '');
    };

    const handleCloseReviewDialog = () => {
        setReviewDialog({ open: false, review: null });
        setScores({ originality_score: 0, relevance_score: 0, clarity_score: 0, methodology_score: 0, overall_score: 0 });
        setComments('');
    };

    const handleSubmitReview = () => {
        if (reviewDialog.review) {
            router.post(route('reviewer.reviews.submit', reviewDialog.review.id), {
                ...scores, comments,
            }, { onSuccess: () => handleCloseReviewDialog() });
        }
    };

    const handleViewSubmission = (submissionId) => {
        router.get(route('reviewer.submissions.view', submissionId));
    };

    // Shared styles
    const selectSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa',
            '& fieldset': { borderColor: c.cardBorder },
            '&:hover fieldset': { borderColor: '#1abc9c' },
            '&.Mui-focused fieldset': { borderColor: '#1abc9c' },
        },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: c.cardBorder },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1abc9c' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1abc9c' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#1abc9c' },
        '& .MuiSelect-select': { color: c.textPrimary },
    };
    const tealBtnSx = {
        background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
        '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(26,188,156,0.35)' },
        borderRadius: '10px', textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 14px rgba(26,188,156,0.3)', transition: 'all 0.25s ease',
    };

    // Score fields config
    const scoreFields = [
        {
            key: 'originality_score', label: 'Originality Score',
            desc: 'Evaluates the novelty of the research question, approach, or findings. Does the submission add new knowledge to the field?',
            icon: '🔬',
            options: [
                { v: 1, t: '1 - Poor: Lacks originality. Merely repeats known concepts or previous work without any new contribution.' },
                { v: 2, t: '2 - Fair: Minimal originality. Offers only slight variations on existing knowledge or approaches.' },
                { v: 3, t: '3 - Good: Presents some new insights or perspectives, but the core contribution is incremental.' },
                { v: 4, t: '4 - Very Good: Demonstrates significant originality. Offers fresh insights, novel methods, or meaningful new findings.' },
                { v: 5, t: '5 - Excellent: Highly innovative and original. Represents a substantial or breakthrough contribution to the field.' },
            ],
        },
        {
            key: 'relevance_score', label: 'Relevance Score',
            desc: 'Evaluates how well the submission aligns with the conference theme and the specific sub-theme selected.',
            icon: '🎯',
            options: [
                { v: 1, t: '1 - Poor: Not relevant to the conference themes.' },
                { v: 2, t: '2 - Fair: Marginal relevance. Only tangentially related to the themes.' },
                { v: 3, t: '3 - Good: Relevant to the themes, but the connection could be stronger or more focused.' },
                { v: 4, t: '4 - Very Good: Highly relevant. Addresses the core aspects of the chosen sub-theme effectively.' },
                { v: 5, t: '5 - Excellent: Perfectly aligned. The topic is timely and critically important to the conference themes.' },
            ],
        },
        {
            key: 'clarity_score', label: 'Clarity Score',
            desc: 'Evaluates the quality of writing, organization, and presentation. Is the submission easy to understand?',
            icon: '✍️',
            options: [
                { v: 1, t: '1 - Poor: Very difficult to understand. Poorly organized with significant grammatical or structural errors.' },
                { v: 2, t: '2 - Fair: Understandable but difficult to follow. Suffers from lack of focus or frequent language errors.' },
                { v: 3, t: '3 - Good: Generally clear and organized. Minor ambiguities or rough transitions.' },
                { v: 4, t: '4 - Very Good: Well-written and clearly structured. Arguments are presented logically.' },
                { v: 5, t: '5 - Excellent: Exceptionally clear, concise, and well-polished.' },
            ],
        },
        {
            key: 'methodology_score', label: 'Methodology Score',
            desc: 'Evaluates the scientific rigor, appropriateness, and validity of the methods used to conduct the research.',
            icon: '⚙️',
            options: [
                { v: 1, t: '1 - Poor: Flawed methodology. The approach is unsuitable, leading to unreliable results.' },
                { v: 2, t: '2 - Fair: Questionable methodology. Significant limitations affecting validity.' },
                { v: 3, t: '3 - Good: Sound methodology. Standard approaches used appropriately.' },
                { v: 4, t: '4 - Very Good: Strong and rigorous methodology. Well-suited to answer research questions.' },
                { v: 5, t: '5 - Excellent: Flawless or innovative methodology. Sets a high standard.' },
            ],
        },
        {
            key: 'overall_score', label: 'Overall Score',
            desc: "A holistic assessment of the submission's quality and suitability for acceptance into the conference.",
            icon: '⭐',
            options: [
                { v: 1, t: '1 - Poor (Reject): Falls significantly below conference standards.' },
                { v: 2, t: '2 - Fair (Major Revisions): Requires major revisions; acceptance doubtful.' },
                { v: 3, t: '3 - Good (Acceptable): Meets basic standards but would benefit from revisions.' },
                { v: 4, t: '4 - Very Good (Recommended): Strong submission. Highly recommended.' },
                { v: 5, t: '5 - Excellent (Priority): Outstanding. Should be prioritized for acceptance.' },
            ],
        },
    ];

    return (
        <SidebarLayout>
            <Head title="Assigned Submissions" />

            <Box sx={{ p: { xs: 2, sm: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' },
                    mb: 3.5, gap: 2,
                }}>
                    <Box>
                        <Typography variant="h4" sx={{
                            fontWeight: 800, color: c.textPrimary,
                            fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em', lineHeight: 1.2,
                        }}>
                            Assigned Submissions 📋
                        </Typography>
                        <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5 }}>
                            Review and score papers assigned to you
                        </Typography>
                    </Box>
                </Box>

                {/* Filter Bar */}
                <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, mb: 2.5 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 36, height: 36, borderRadius: '10px' }}>
                                <FilterListIcon sx={{ color: '#1abc9c', fontSize: 20 }} />
                            </Avatar>
                            <FormControl size="small" sx={{ minWidth: 200, ...selectSx }}>
                                <InputLabel>Filter Review Status</InputLabel>
                                <Select
                                    value={reviewStatusFilter}
                                    label="Filter Review Status"
                                    onChange={(e) => setReviewStatusFilter(e.target.value)}
                                    sx={{ borderRadius: '10px' }}
                                >
                                    <MenuItem value="all">All ({reviews.length})</MenuItem>
                                    <MenuItem value="pending">Pending ({reviews.filter(r => !r.originality_score).length})</MenuItem>
                                    <MenuItem value="completed">Completed ({reviews.filter(r => r.originality_score).length})</MenuItem>
                                </Select>
                            </FormControl>
                            <Chip
                                label={`${filteredReviews.length} of ${reviews.length}`}
                                size="small"
                                sx={{
                                    bgcolor: isDark ? 'rgba(26,188,156,0.1)' : '#ecfdf5',
                                    color: '#1abc9c', fontWeight: 700, borderRadius: '8px',
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb' }}>
                                    {['Submission Code', 'Title', 'Sub Theme', 'Author', 'Category', 'Type', 'Submitted', 'Status', 'Review', 'Actions'].map((h) => (
                                        <TableCell key={h} sx={{ fontWeight: 700, color: c.textMuted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${c.cardBorder}`, py: 1.5 }}>
                                            {h}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredReviews.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                                            <AssignmentIcon sx={{ fontSize: 48, color: c.textMuted, mb: 1, opacity: 0.4 }} />
                                            <Typography variant="body2" sx={{ color: c.textMuted }}>No submissions found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredReviews.map((review) => (
                                        <TableRow key={review.id} sx={{
                                            transition: 'background 0.15s ease',
                                            '&:hover': { bgcolor: c.rowHover },
                                            '& td': { borderBottom: `1px solid ${c.cardBorder}`, py: 1.5, color: c.textPrimary, fontSize: '0.85rem' },
                                        }}>
                                            <TableCell>
                                                <Chip label={review.submission?.submission_code || 'N/A'} size="small"
                                                    sx={{ fontFamily: 'monospace', fontWeight: 700, bgcolor: isDark ? 'rgba(26,188,156,0.1)' : '#ecfdf5', color: '#1abc9c', borderRadius: '8px' }} />
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 200 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {review.submission?.title || 'Untitled'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: c.textSecondary, fontSize: '0.8rem' }}>
                                                    {review.submission?.paper_sub_theme || review.submission?.topic || '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: c.textPrimary }}>{review.submission?.user?.name || 'Unknown'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                {review.submission?.participant_category ? (
                                                    <Chip label={review.submission.participant_category.toUpperCase()} size="small"
                                                        sx={{
                                                            fontWeight: 600, fontSize: '0.65rem', borderRadius: '6px', height: 22,
                                                            bgcolor: review.submission.participant_category === 'student'
                                                                ? (isDark ? 'rgba(59,130,246,0.12)' : '#eff6ff') : review.submission.participant_category === 'professional'
                                                                    ? (isDark ? 'rgba(22,163,74,0.12)' : '#dcfce7') : (isDark ? 'rgba(147,51,234,0.12)' : '#f3e8ff'),
                                                            color: review.submission.participant_category === 'student'
                                                                ? (isDark ? '#93c5fd' : '#2563eb') : review.submission.participant_category === 'professional'
                                                                    ? (isDark ? '#86efac' : '#16a34a') : (isDark ? '#c4b5fd' : '#7c3aed'),
                                                        }} />
                                                ) : (
                                                    <Typography variant="body2" sx={{ color: c.textMuted }}>-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={review.submission?.category_submission || 'N/A'} size="small"
                                                    sx={{
                                                        fontWeight: 600, fontSize: '0.65rem', borderRadius: '6px', height: 22,
                                                        bgcolor: review.submission?.category_submission?.includes('Oral')
                                                            ? (isDark ? 'rgba(59,130,246,0.12)' : '#eff6ff') : (isDark ? 'rgba(236,72,153,0.12)' : '#fce4ec'),
                                                        color: review.submission?.category_submission?.includes('Oral')
                                                            ? (isDark ? '#93c5fd' : '#1565c0') : (isDark ? '#f9a8d4' : '#c2185b'),
                                                    }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.75rem' }}>
                                                    {review.submission?.created_at ? new Date(review.submission.created_at).toLocaleDateString('en-GB', {
                                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                                    }) : '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={review.submission?.status || 'pending'} size="small"
                                                    sx={{
                                                        fontWeight: 600, fontSize: '0.65rem', borderRadius: '6px', height: 22,
                                                        bgcolor: review.submission?.status === 'accepted' ? c.chipGreenBg : (isDark ? '#374151' : '#f3f4f6'),
                                                        color: review.submission?.status === 'accepted' ? c.chipGreenText : c.textMuted,
                                                    }} />
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={review.originality_score ? 'Completed' : 'Pending'} size="small"
                                                    sx={{
                                                        fontWeight: 700, fontSize: '0.65rem', borderRadius: '6px', height: 22,
                                                        bgcolor: review.originality_score ? c.chipGreenBg : c.chipAmberBg,
                                                        color: review.originality_score ? c.chipGreenText : c.chipAmberText,
                                                    }} />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Button size="small" variant="outlined"
                                                        startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                                                        onClick={() => handleViewSubmission(review.submission?.id)}
                                                        sx={{
                                                            color: '#1abc9c', borderColor: isDark ? 'rgba(26,188,156,0.3)' : '#d1fae5',
                                                            textTransform: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem',
                                                            '&:hover': { borderColor: '#1abc9c', bgcolor: isDark ? 'rgba(26,188,156,0.08)' : '#ecfdf5' },
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button size="small" variant="contained"
                                                        startIcon={<RateReviewIcon sx={{ fontSize: 16 }} />}
                                                        onClick={() => handleOpenReviewDialog(review)}
                                                        sx={{ ...tealBtnSx, px: 1.5, py: 0.5, fontSize: '0.75rem' }}
                                                    >
                                                        {review.originality_score ? 'Scoring' : 'Review'}
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Box>

            {/* ── Review Dialog ── */}
            <Dialog
                open={reviewDialog.open}
                onClose={handleCloseReviewDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        bgcolor: c.cardBg,
                        border: `1px solid ${c.cardBorder}`,
                        backgroundImage: 'none',
                    },
                }}
            >
                {/* Dialog Header */}
                <DialogTitle sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    px: 3, py: 2.5,
                    borderBottom: `1px solid ${c.cardBorder}`,
                    bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#f9fafb',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 42, height: 42, borderRadius: '12px' }}>
                            <RateReviewIcon sx={{ color: '#1abc9c', fontSize: 24 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '1.1rem', lineHeight: 1.2 }}>
                                Submit Review
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.75rem' }}>
                                {reviewDialog.review?.submission?.title ? `Reviewing: ${reviewDialog.review.submission.title.substring(0, 60)}...` : 'Score each category from 1-5'}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={handleCloseReviewDialog} sx={{ color: c.textMuted, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6' } }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ px: 3, py: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {scoreFields.map((field) => (
                            <Box key={field.key} sx={{
                                p: 2, borderRadius: '14px',
                                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
                                border: `1px solid ${c.cardBorder}`,
                                transition: 'border-color 0.2s ease',
                                '&:hover': { borderColor: '#1abc9c' },
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                    <Typography sx={{ fontSize: '1.1rem' }}>{field.icon}</Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.85rem' }}>
                                        {field.label} <span style={{ color: '#ef4444' }}>*</span>
                                    </Typography>
                                    {scores[field.key] > 0 && (
                                        <Chip label={`${scores[field.key]}/5`} size="small"
                                            sx={{
                                                ml: 'auto', fontWeight: 700, fontSize: '0.7rem', height: 22, borderRadius: '6px',
                                                bgcolor: scores[field.key] >= 4 ? c.chipGreenBg : scores[field.key] >= 3 ? c.chipAmberBg : (isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2'),
                                                color: scores[field.key] >= 4 ? c.chipGreenText : scores[field.key] >= 3 ? c.chipAmberText : (isDark ? '#fca5a5' : '#dc2626'),
                                            }}
                                        />
                                    )}
                                </Box>
                                <FormControl fullWidth size="small" sx={selectSx}>
                                    <Select
                                        value={scores[field.key]}
                                        onChange={(e) => setScores({ ...scores, [field.key]: e.target.value })}
                                        displayEmpty
                                        sx={{ borderRadius: '10px', bgcolor: c.cardBg }}
                                        MenuProps={{ PaperProps: { sx: { maxWidth: 600, bgcolor: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: '12px' } } }}
                                    >
                                        <MenuItem value={0} disabled><em style={{ color: c.textMuted }}>Select score</em></MenuItem>
                                        {field.options.map(opt => (
                                            <MenuItem key={opt.v} value={opt.v} sx={{ whiteSpace: 'normal', py: 1.5, fontSize: '0.82rem', color: c.textPrimary, borderRadius: '8px', mx: 0.5, '&:hover': { bgcolor: isDark ? 'rgba(26,188,156,0.08)' : '#f0fdf9' } }}>
                                                {opt.t}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: c.textMuted, fontSize: '0.72rem', lineHeight: 1.5, pl: 0.5 }}>
                                    {field.desc}
                                </Typography>
                            </Box>
                        ))}

                        {/* Comments */}
                        <Box sx={{
                            p: 2, borderRadius: '14px',
                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
                            border: `1px solid ${c.cardBorder}`,
                            '&:hover': { borderColor: '#1abc9c' },
                            transition: 'border-color 0.2s ease',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <Typography sx={{ fontSize: '1.1rem' }}>💬</Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: '0.85rem' }}>
                                    Comments <span style={{ color: '#ef4444' }}>*</span>
                                </Typography>
                            </Box>
                            <TextField
                                multiline rows={4} fullWidth value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Provide detailed feedback including strengths, weaknesses, and suggestions for improvement..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px', bgcolor: c.cardBg,
                                        '& fieldset': { borderColor: c.cardBorder },
                                        '&:hover fieldset': { borderColor: '#1abc9c' },
                                        '&.Mui-focused fieldset': { borderColor: '#1abc9c' },
                                    },
                                    '& textarea': { color: c.textPrimary, fontSize: '0.85rem' },
                                    '& textarea::placeholder': { color: c.textMuted, opacity: 1 },
                                }}
                            />
                        </Box>
                    </Box>
                </DialogContent>

                {/* Dialog Footer */}
                <DialogActions sx={{
                    px: 3, py: 2,
                    borderTop: `1px solid ${c.cardBorder}`,
                    bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#f9fafb',
                    gap: 1.5,
                }}>
                    <Button
                        onClick={handleCloseReviewDialog}
                        sx={{
                            textTransform: 'none', borderRadius: '10px', fontWeight: 600, px: 3,
                            color: c.textSecondary, border: `1px solid ${c.cardBorder}`,
                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', borderColor: c.textMuted },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmitReview}
                        variant="contained"
                        startIcon={<RateReviewIcon />}
                        disabled={
                            !scores.originality_score ||
                            !scores.relevance_score ||
                            !scores.clarity_score ||
                            !scores.methodology_score ||
                            !scores.overall_score ||
                            !comments
                        }
                        sx={{ ...tealBtnSx, px: 3, py: 1 }}
                    >
                        Submit Review
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
