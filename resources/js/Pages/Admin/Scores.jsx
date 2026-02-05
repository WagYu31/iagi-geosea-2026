import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
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
    TextField,
    InputAdornment,
    TableSortLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GradeIcon from '@mui/icons-material/Grade';

export default function AdminScores({ submissions = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('highest'); // 'highest', 'lowest', 'none'
    const [limitResults, setLimitResults] = useState('all'); // 'all', '50', '20', '10', '3'

    // Helper functions
    const calculateAverageScore = (reviews) => {
        if (!reviews || reviews.length === 0) return 'N/A';
        const validReviews = reviews.filter(r => r.overall_score);
        if (validReviews.length === 0) return 'N/A';

        // Calculate average of all 5 categories per reviewer, then average across reviewers
        const totalAvg = validReviews.reduce((sum, r) => {
            const originality = parseInt(r.originality_score || 0, 10);
            const relevance = parseInt(r.relevance_score || 0, 10);
            const clarity = parseInt(r.clarity_score || 0, 10);
            const methodology = parseInt(r.methodology_score || 0, 10);
            const overall = parseInt(r.overall_score || 0, 10);
            const reviewerAvg = (originality + relevance + clarity + methodology + overall) / 5;
            return sum + reviewerAvg;
        }, 0) / validReviews.length;

        return totalAvg.toFixed(1);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return 'success';
            case 'rejected': return 'error';
            case 'under_review':
            case 'under review': return 'info';
            case 'revision_required_phase1':
            case 'revision_required_phase2': return 'warning';
            default: return 'default';
        }
    };

    // Filter submissions
    let filteredSubmissions = submissions.filter(submission =>
        submission.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort submissions by average score
    if (sortOrder !== 'none') {
        filteredSubmissions = [...filteredSubmissions].sort((a, b) => {
            const avgA = calculateAverageScore(a.reviews);
            const avgB = calculateAverageScore(b.reviews);

            // Handle N/A scores (put them at the end)
            if (avgA === 'N/A' && avgB === 'N/A') return 0;
            if (avgA === 'N/A') return 1;
            if (avgB === 'N/A') return -1;

            const scoreA = parseFloat(avgA);
            const scoreB = parseFloat(avgB);

            return sortOrder === 'highest' ? scoreB - scoreA : scoreA - scoreB;
        });
    }

    // Apply limit to results
    const totalFiltered = filteredSubmissions.length;
    if (limitResults !== 'all') {
        filteredSubmissions = filteredSubmissions.slice(0, parseInt(limitResults));
    }

    return (
        <SidebarLayout>
            <Head title="Daftar Nilai" />

            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <GradeIcon sx={{ fontSize: 40, color: '#006838' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#006838' }}>
                        Daftar Nilai (Scores)
                    </Typography>
                </Box>

                {/* Search and Sort Controls */}
                <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            fullWidth
                            placeholder="Search by title or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ flex: 1, minWidth: 300 }}
                        />
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Sort by Score</InputLabel>
                            <Select
                                value={sortOrder}
                                label="Sort by Score"
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <MenuItem value="highest">Highest to Lowest</MenuItem>
                                <MenuItem value="lowest">Lowest to Highest</MenuItem>
                                <MenuItem value="none">No Sorting</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 160 }}>
                            <InputLabel>Show Top</InputLabel>
                            <Select
                                value={limitResults}
                                label="Show Top"
                                onChange={(e) => setLimitResults(e.target.value)}
                            >
                                <MenuItem value="all">All ({totalFiltered})</MenuItem>
                                <MenuItem value="50">Top 50</MenuItem>
                                <MenuItem value="20">Top 20</MenuItem>
                                <MenuItem value="10">Top 10</MenuItem>
                                <MenuItem value="3">Top 3</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Paper>

                {/* Scores Table */}
                <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Reviewers</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }} align="center">Average Score</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Scores Detail</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSubmissions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">
                                                No submissions found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSubmissions.map((submission) => {
                                        const avgScore = calculateAverageScore(submission.reviews);
                                        const validReviews = submission.reviews?.filter(r => r.overall_score) || [];

                                        return (
                                            <TableRow key={submission.id} hover>
                                                <TableCell>#{submission.id}</TableCell>
                                                <TableCell sx={{ maxWidth: 300 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {submission.title}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{submission.user?.name || 'Unknown'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={submission.status}
                                                        size="small"
                                                        color={getStatusColor(submission.status)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {submission.reviews?.length || 0} assigned
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {validReviews.length} completed
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {avgScore !== 'N/A' ? (
                                                        <Box
                                                            sx={{
                                                                display: 'inline-flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                bgcolor: avgScore >= 70 ? '#d4edda' : avgScore >= 50 ? '#fff3cd' : '#f8d7da',
                                                                color: avgScore >= 70 ? '#155724' : avgScore >= 50 ? '#856404' : '#721c24',
                                                                px: 2,
                                                                py: 1,
                                                                borderRadius: 1,
                                                                minWidth: 80,
                                                            }}
                                                        >
                                                            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                                                                {avgScore}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Chip label="No Scores" size="small" variant="outlined" />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {validReviews.length > 0 ? (
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                            {validReviews.map((review, idx) => {
                                                                const reviewerAvg = (
                                                                    (parseInt(review.originality_score || 0, 10) +
                                                                        parseInt(review.relevance_score || 0, 10) +
                                                                        parseInt(review.clarity_score || 0, 10) +
                                                                        parseInt(review.methodology_score || 0, 10) +
                                                                        parseInt(review.overall_score || 0, 10)) / 5
                                                                ).toFixed(1);
                                                                return (
                                                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 80 }}>
                                                                            Reviewer {idx + 1}:
                                                                        </Typography>
                                                                        <Chip
                                                                            label={reviewerAvg}
                                                                            size="small"
                                                                            sx={{
                                                                                bgcolor: reviewerAvg >= 4 ? '#e8f5e9' : reviewerAvg >= 3 ? '#fff9c4' : '#ffebee',
                                                                                color: reviewerAvg >= 4 ? '#2e7d32' : reviewerAvg >= 3 ? '#f57c00' : '#c62828',
                                                                                fontWeight: 600,
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                );
                                                            })}
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                            No scores yet
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Summary Stats */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, flex: 1, minWidth: 200 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Total Submissions
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#006838' }}>
                            {submissions.length}
                        </Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, flex: 1, minWidth: 200 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            With Scores
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                            {submissions.filter(s => s.reviews?.some(r => r.overall_score)).length}
                        </Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, flex: 1, minWidth: 200 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Pending Review
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00' }}>
                            {submissions.filter(s => !s.reviews?.some(r => r.overall_score)).length}
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </SidebarLayout>
    );
}
