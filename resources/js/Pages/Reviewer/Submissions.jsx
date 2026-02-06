import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ReviewerSubmissions({ reviews = [] }) {
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

    // Filter reviews based on review status
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
        setScores({
            originality_score: 0,
            relevance_score: 0,
            clarity_score: 0,
            methodology_score: 0,
            overall_score: 0,
        });
        setComments('');
    };

    const handleSubmitReview = () => {
        if (reviewDialog.review) {
            router.post(route('reviewer.reviews.submit', reviewDialog.review.id), {
                ...scores,
                comments,
            }, {
                onSuccess: () => {
                    handleCloseReviewDialog();
                },
            });
        }
    };

    const handleViewSubmission = (submissionId) => {
        router.get(route('reviewer.submissions.view', submissionId));
    };

    return (
        <SidebarLayout>
            <Head title="Assigned Submissions" />

            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1abc9c', mb: 3 }}>
                    Assigned Submissions
                </Typography>

                {/* Review Status Filter */}
                <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Filter Review Status</InputLabel>
                            <Select
                                value={reviewStatusFilter}
                                label="Filter Review Status"
                                onChange={(e) => setReviewStatusFilter(e.target.value)}
                            >
                                <MenuItem value="all">All ({reviews.length})</MenuItem>
                                <MenuItem value="pending">Pending ({reviews.filter(r => !r.originality_score).length})</MenuItem>
                                <MenuItem value="completed">Completed ({reviews.filter(r => r.originality_score).length})</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="body2" color="text.secondary">
                            Showing {filteredReviews.length} of {reviews.length} submissions
                        </Typography>
                    </Box>
                </Paper>

                <TableContainer component={Paper} sx={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Submission Code</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Sub Theme</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Participant Category</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Presentation Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Submitted At</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Review Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredReviews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            No submissions found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredReviews.map((review) => (
                                    <TableRow key={review.id} hover>
                                        <TableCell>
                                            <Chip
                                                label={review.submission?.submission_code || 'N/A'}
                                                size="small"
                                                sx={{
                                                    fontFamily: 'monospace',
                                                    fontWeight: 600,
                                                    backgroundColor: '#e8f5e9',
                                                    color: '#2e7d32',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{review.submission?.title || 'Untitled'}</TableCell>
                                        <TableCell>{review.submission?.paper_sub_theme || review.submission?.topic || '-'}</TableCell>
                                        <TableCell>{review.submission?.user?.name || 'Unknown'}</TableCell>
                                        <TableCell>
                                            {review.submission?.participant_category ? (
                                                <Chip
                                                    label={review.submission.participant_category.toUpperCase()}
                                                    size="small"
                                                    color={
                                                        review.submission.participant_category === 'student' ? 'primary' :
                                                            review.submission.participant_category === 'professional' ? 'success' :
                                                                review.submission.participant_category === 'international' ? 'secondary' :
                                                                    'default'
                                                    }
                                                    sx={{ fontWeight: 500 }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={review.submission?.category_submission || 'N/A'}
                                                size="small"
                                                sx={{
                                                    backgroundColor: review.submission?.category_submission?.includes('Oral') ? '#e3f2fd' : '#fce4ec',
                                                    color: review.submission?.category_submission?.includes('Oral') ? '#1565c0' : '#c2185b',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {review.submission?.created_at ? new Date(review.submission.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            }).replace(',', '') : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={review.submission?.status || 'pending'}
                                                size="small"
                                                color={review.submission?.status === 'accepted' ? 'success' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={review.originality_score ? 'Completed' : 'Pending'}
                                                size="small"
                                                color={review.originality_score ? 'success' : 'warning'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => handleViewSubmission(review.submission?.id)}
                                                    sx={{ color: '#1abc9c', borderColor: '#1abc9c' }}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={<RateReviewIcon />}
                                                    onClick={() => handleOpenReviewDialog(review)}
                                                    sx={{
                                                        backgroundColor: '#1abc9c',
                                                        '&:hover': { backgroundColor: '#16a085' },
                                                    }}
                                                >
                                                    {review.originality_score ? 'Scoring Review' : 'Submit Review'}
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Review Dialog */}
            <Dialog open={reviewDialog.open} onClose={handleCloseReviewDialog} maxWidth="md" fullWidth>
                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                        {/* Originality Score */}
                        <FormControl fullWidth>
                            <InputLabel>Originality Score *</InputLabel>
                            <Select
                                value={scores.originality_score}
                                onChange={(e) => setScores({ ...scores, originality_score: e.target.value })}
                                label="Originality Score *"
                                MenuProps={{ PaperProps: { sx: { maxWidth: 600 } } }}
                            >
                                <MenuItem value=""><em>Select score</em></MenuItem>
                                <MenuItem value={1} sx={{ whiteSpace: 'normal' }}>1 - Poor: Lacks originality. Merely repeats known concepts or previous work without any new contribution.</MenuItem>
                                <MenuItem value={2} sx={{ whiteSpace: 'normal' }}>2 - Fair: Minimal originality. Offers only slight variations on existing knowledge or approaches.</MenuItem>
                                <MenuItem value={3} sx={{ whiteSpace: 'normal' }}>3 - Good: Presents some new insights or perspectives, but the core contribution is incremental.</MenuItem>
                                <MenuItem value={4} sx={{ whiteSpace: 'normal' }}>4 - Very Good: Demonstrates significant originality. Offers fresh insights, novel methods, or meaningful new findings.</MenuItem>
                                <MenuItem value={5} sx={{ whiteSpace: 'normal' }}>5 - Excellent: Highly innovative and original. Represents a substantial or breakthrough contribution to the field.</MenuItem>
                            </Select>
                            <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: 'text.secondary' }}>
                                Evaluates the novelty of the research question, approach, or findings. Does the submission add new knowledge to the field?
                            </Typography>
                        </FormControl>

                        {/* Relevance Score */}
                        <FormControl fullWidth>
                            <InputLabel>Relevance Score *</InputLabel>
                            <Select
                                value={scores.relevance_score}
                                onChange={(e) => setScores({ ...scores, relevance_score: e.target.value })}
                                label="Relevance Score *"
                                MenuProps={{ PaperProps: { sx: { maxWidth: 600 } } }}
                            >
                                <MenuItem value=""><em>Select score</em></MenuItem>
                                <MenuItem value={1} sx={{ whiteSpace: 'normal' }}>1 - Poor: Not relevant to the conference themes.</MenuItem>
                                <MenuItem value={2} sx={{ whiteSpace: 'normal' }}>2 - Fair: Marginal relevance. Only tangentially related to the themes, or the focus is too broad/narrow.</MenuItem>
                                <MenuItem value={3} sx={{ whiteSpace: 'normal' }}>3 - Good: Relevant to the themes, but the connection could be stronger or more focused.</MenuItem>
                                <MenuItem value={4} sx={{ whiteSpace: 'normal' }}>4 - Very Good: Highly relevant. Addresses the core aspects of the chosen sub-theme effectively.</MenuItem>
                                <MenuItem value={5} sx={{ whiteSpace: 'normal' }}>5 - Excellent: Perfectly aligned. The topic is timely and critically important to the conference themes.</MenuItem>
                            </Select>
                            <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: 'text.secondary' }}>
                                Evaluates how well the submission aligns with the conference theme and the specific sub-theme selected.
                            </Typography>
                        </FormControl>

                        {/* Clarity Score */}
                        <FormControl fullWidth>
                            <InputLabel>Clarity Score *</InputLabel>
                            <Select
                                value={scores.clarity_score}
                                onChange={(e) => setScores({ ...scores, clarity_score: e.target.value })}
                                label="Clarity Score *"
                                MenuProps={{ PaperProps: { sx: { maxWidth: 600 } } }}
                            >
                                <MenuItem value=""><em>Select score</em></MenuItem>
                                <MenuItem value={1} sx={{ whiteSpace: 'normal' }}>1 - Poor: Very difficult to understand. Poorly organized with significant grammatical or structural errors.</MenuItem>
                                <MenuItem value={2} sx={{ whiteSpace: 'normal' }}>2 - Fair: Understandable but difficult to follow. Suffers from lack of focus, poor flow, or frequent language errors.</MenuItem>
                                <MenuItem value={3} sx={{ whiteSpace: 'normal' }}>3 - Good: Generally clear and organized. The message is conveyed, though there may be minor ambiguities or rough transitions.</MenuItem>
                                <MenuItem value={4} sx={{ whiteSpace: 'normal' }}>4 - Very Good: Well-written and clearly structured. Arguments are presented logically and are easy to follow.</MenuItem>
                                <MenuItem value={5} sx={{ whiteSpace: 'normal' }}>5 - Excellent: Exceptionally clear, concise, and well-polished. The presentation enhances the content significantly.</MenuItem>
                            </Select>
                            <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: 'text.secondary' }}>
                                Evaluates the quality of writing, organization, and presentation. Is the submission easy to understand?
                            </Typography>
                        </FormControl>

                        {/* Methodology Score */}
                        <FormControl fullWidth>
                            <InputLabel>Methodology Score *</InputLabel>
                            <Select
                                value={scores.methodology_score}
                                onChange={(e) => setScores({ ...scores, methodology_score: e.target.value })}
                                label="Methodology Score *"
                                MenuProps={{ PaperProps: { sx: { maxWidth: 600 } } }}
                            >
                                <MenuItem value=""><em>Select score</em></MenuItem>
                                <MenuItem value={1} sx={{ whiteSpace: 'normal' }}>1 - Poor: Flawed methodology. The approach is unsuitable, leading to unreliable results.</MenuItem>
                                <MenuItem value={2} sx={{ whiteSpace: 'normal' }}>2 - Fair: Questionable methodology. Significant limitations or weaknesses in the design that affect the validity of findings.</MenuItem>
                                <MenuItem value={3} sx={{ whiteSpace: 'normal' }}>3 - Good: Sound methodology. Standard approaches are used appropriately, though there may be room for improvement.</MenuItem>
                                <MenuItem value={4} sx={{ whiteSpace: 'normal' }}>4 - Very Good: Strong and rigorous methodology. The design is well-suited to answer the research questions effectively.</MenuItem>
                                <MenuItem value={5} sx={{ whiteSpace: 'normal' }}>5 - Excellent: Flawless or innovative methodology. The research design is executed perfectly and may set a high standard.</MenuItem>
                            </Select>
                            <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: 'text.secondary' }}>
                                Evaluates the scientific rigor, appropriateness, and validity of the methods used to conduct the research.
                            </Typography>
                        </FormControl>

                        {/* Overall Score */}
                        <FormControl fullWidth>
                            <InputLabel>Overall Score *</InputLabel>
                            <Select
                                value={scores.overall_score}
                                onChange={(e) => setScores({ ...scores, overall_score: e.target.value })}
                                label="Overall Score *"
                                MenuProps={{ PaperProps: { sx: { maxWidth: 600 } } }}
                            >
                                <MenuItem value=""><em>Select score</em></MenuItem>
                                <MenuItem value={1} sx={{ whiteSpace: 'normal' }}>1 - Poor (Reject): The submission falls significantly below conference standards.</MenuItem>
                                <MenuItem value={2} sx={{ whiteSpace: 'normal' }}>2 - Fair (Major Revisions): Weak submission. Requires major revisions; acceptance is doubtful without substantial improvements.</MenuItem>
                                <MenuItem value={3} sx={{ whiteSpace: 'normal' }}>3 - Good (Acceptable): Meets the basic standards but would benefit from revisions before final acceptance.</MenuItem>
                                <MenuItem value={4} sx={{ whiteSpace: 'normal' }}>4 - Very Good (Recommended): Strong submission. A valuable contribution that is highly recommended for acceptance.</MenuItem>
                                <MenuItem value={5} sx={{ whiteSpace: 'normal' }}>5 - Excellent (Priority): Outstanding submission. A top-tier contribution that should be prioritized for acceptance and presentation.</MenuItem>
                            </Select>
                            <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: 'text.secondary' }}>
                                A holistic assessment of the submission's quality and suitability for acceptance into the conference.
                            </Typography>
                        </FormControl>

                        <TextField
                            label="Comments *"
                            multiline
                            rows={4}
                            fullWidth
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            required
                            helperText="Provide detailed feedback including strengths, weaknesses, and suggestions for improvement."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReviewDialog}>Cancel</Button>
                    <Button
                        onClick={handleSubmitReview}
                        variant="contained"
                        disabled={
                            !scores.originality_score ||
                            !scores.relevance_score ||
                            !scores.clarity_score ||
                            !scores.methodology_score ||
                            !scores.overall_score ||
                            !comments
                        }
                        sx={{
                            backgroundColor: '#1abc9c',
                            '&:hover': { backgroundColor: '#16a085' },
                        }}
                    >
                        Submit Review
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
