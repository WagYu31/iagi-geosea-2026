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
                            {reviews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            No submissions assigned yet.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reviews.map((review) => (
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
                                                    {review.originality_score ? 'Edit Review' : 'Submit Review'}
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
                        <FormControl fullWidth>
                            <InputLabel>Originality Score *</InputLabel>
                            <Select
                                value={scores.originality_score}
                                onChange={(e) => setScores({ ...scores, originality_score: e.target.value })}
                                label="Originality Score *"
                            >
                                <MenuItem value=""><em>Select score</em></MenuItem>
                                <MenuItem value={1}>1 - Poor</MenuItem>
                                <MenuItem value={2}>2 - Fair</MenuItem>
                                <MenuItem value={3}>3 - Good</MenuItem>
                                <MenuItem value={4}>4 - Very Good</MenuItem>
                                <MenuItem value={5}>5 - Excellent</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Relevance Score *</InputLabel>
                            <Select
                                value={scores.relevance_score}
                                onChange={(e) => setScores({ ...scores, relevance_score: e.target.value })}
                                label="Relevance Score *"
                            >
                                <MenuItem value=""><em>Select score</em></MenuItem>
                                <MenuItem value={1}>1 - Poor</MenuItem>
                                <MenuItem value={2}>2 - Fair</MenuItem>
                                <MenuItem value={3}>3 - Good</MenuItem>
                                <MenuItem value={4}>4 - Very Good</MenuItem>
                                <MenuItem value={5}>5 - Excellent</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Clarity Score *</InputLabel>
                            <Select
                                value={scores.clarity_score}
                                onChange={(e) => setScores({ ...scores, clarity_score: e.target.value })}
                                label="Clarity Score *"
                            >
                                <MenuItem value=""><em>Select score</em></MenuItem>
                                <MenuItem value={1}>1 - Poor</MenuItem>
                                <MenuItem value={2}>2 - Fair</MenuItem>
                                <MenuItem value={3}>3 - Good</MenuItem>
                                <MenuItem value={4}>4 - Very Good</MenuItem>
                                <MenuItem value={5}>5 - Excellent</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Methodology Score *</InputLabel>
                            <Select
                                value={scores.methodology_score}
                                onChange={(e) => setScores({ ...scores, methodology_score: e.target.value })}
                                label="Methodology Score *"
                            >
                                <MenuItem value=""><em>Select score</em></MenuItem>
                                <MenuItem value={1}>1 - Poor</MenuItem>
                                <MenuItem value={2}>2 - Fair</MenuItem>
                                <MenuItem value={3}>3 - Good</MenuItem>
                                <MenuItem value={4}>4 - Very Good</MenuItem>
                                <MenuItem value={5}>5 - Excellent</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Overall Score *</InputLabel>
                            <Select
                                value={scores.overall_score}
                                onChange={(e) => setScores({ ...scores, overall_score: e.target.value })}
                                label="Overall Score *"
                            >
                                <MenuItem value=""><em>Select score</em></MenuItem>
                                <MenuItem value={1}>1 - Poor</MenuItem>
                                <MenuItem value={2}>2 - Fair</MenuItem>
                                <MenuItem value={3}>3 - Good</MenuItem>
                                <MenuItem value={4}>4 - Very Good</MenuItem>
                                <MenuItem value={5}>5 - Excellent</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Comments"
                            multiline
                            rows={4}
                            fullWidth
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            required
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
