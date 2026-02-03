import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    Button,
    Divider,
    TextField,
    Alert,
    Card,
    CardContent,
    Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function ViewSubmission({ submission, reviews = [], isReviewer = false }) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        title: submission.title || '',
        abstract: submission.abstract || '',
        full_paper_file: null,
        layouting_file: null,
        editor_feedback_file: null,
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        post(route('submissions.update', submission.id), {
            forceFormData: true,
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return 'success';
            case 'rejected': return 'error';
            case 'under_review':
            case 'under review': return 'info';
            case 'revision_required_phase1':
            case 'revision_required_phase2':
            case 'revision phase 1':
            case 'revision phase 2':
            case 'revision': return 'warning';
            default: return 'default';
        }
    };

    const needsRevision = ['revision', 'revision phase 1', 'revision phase 2', 'revision_required_phase1', 'revision_required_phase2'].includes(
        submission.status?.toLowerCase()
    );

    return (
        <SidebarLayout>
            <Head title={`Submission - ${submission.title}`} />

            <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.visit(isReviewer ? route('reviewer.submissions') : route('submissions.index'))}
                        sx={{ mb: 2, color: '#006838', textTransform: 'none' }}
                    >
                        BACK TO SUBMISSIONS
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#006838', mb: 0.5 }}>
                                Submission Details
                            </Typography>
                        </Box>
                        {!isEditing && needsRevision && !isReviewer && (
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={() => setIsEditing(true)}
                                sx={{
                                    backgroundColor: '#006838',
                                    '&:hover': { backgroundColor: '#004d28' },
                                    textTransform: 'none',
                                }}
                            >
                                Edit & Resubmit
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Revision Alert */}
                {needsRevision && reviews.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 3 }} icon={<CommentIcon />}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Revision Required
                        </Typography>
                        <Typography variant="body2">
                            Your submission needs revision. Please review the comments below and update your paper accordingly.
                        </Typography>
                    </Alert>
                )}

                {/* Edit Form */}
                {isEditing ? (
                    <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#006838', mb: 3 }}>
                            Edit Submission
                        </Typography>
                        <Box component="form" onSubmit={handleUpdate}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Paper Title *"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        error={!!errors.title}
                                        helperText={errors.title}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={8}
                                        label="Abstract *"
                                        value={data.abstract}
                                        onChange={(e) => setData('abstract', e.target.value)}
                                        error={!!errors.abstract}
                                        helperText={errors.abstract}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Box sx={{ border: '2px dashed #e0e0e0', borderRadius: 2, p: 2, textAlign: 'center', backgroundColor: '#fafafa' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                            Update Full Paper
                                        </Typography>
                                        <Button
                                            component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            size="small"
                                            sx={{ backgroundColor: '#006838', '&:hover': { backgroundColor: '#004d28' }, textTransform: 'none' }}
                                        >
                                            Choose File
                                            <VisuallyHiddenInput
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => setData('full_paper_file', e.target.files[0])}
                                            />
                                        </Button>
                                        {data.full_paper_file && (
                                            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#006838' }}>
                                                ✓ {data.full_paper_file.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Box sx={{ border: '2px dashed #e0e0e0', borderRadius: 2, p: 2, textAlign: 'center', backgroundColor: '#fafafa' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                            Update Layouting File
                                        </Typography>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<CloudUploadIcon />}
                                            size="small"
                                            sx={{ color: '#006838', borderColor: '#006838', textTransform: 'none' }}
                                        >
                                            Choose File
                                            <VisuallyHiddenInput
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => setData('layouting_file', e.target.files[0])}
                                            />
                                        </Button>
                                        {data.layouting_file && (
                                            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#006838' }}>
                                                ✓ {data.layouting_file.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Box sx={{ border: '2px dashed #e0e0e0', borderRadius: 2, p: 2, textAlign: 'center', backgroundColor: '#fafafa' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                            Update Editor Feedback
                                        </Typography>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<CloudUploadIcon />}
                                            size="small"
                                            sx={{ color: '#006838', borderColor: '#006838', textTransform: 'none' }}
                                        >
                                            Choose File
                                            <VisuallyHiddenInput
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => setData('editor_feedback_file', e.target.files[0])}
                                            />
                                        </Button>
                                        {data.editor_feedback_file && (
                                            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#006838' }}>
                                                ✓ {data.editor_feedback_file.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setIsEditing(false)}
                                            disabled={processing}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={processing}
                                            sx={{
                                                backgroundColor: '#006838',
                                                '&:hover': { backgroundColor: '#004d28' },
                                                textTransform: 'none',
                                            }}
                                        >
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                ) : (
                    <Stack spacing={{ xs: 3, md: 4 }}>
                        {/* SECTION 1: Status & Metadata */}
                        <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#006838', mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                    Submission Information
                                </Typography>

                                <Stack spacing={{ xs: 2, md: 2.5 }}>
                                    {/* Status */}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                            Status
                                        </Typography>
                                        <Chip
                                            label={submission.status || 'Pending'}
                                            color={getStatusColor(submission.status)}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>

                                    {/* Submission Code */}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                            Submission Code
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#006838', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                                            {submission.submission_code || 'N/A'}
                                        </Typography>
                                    </Box>

                                    {/* Submitted On */}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                            Submitted On
                                        </Typography>
                                        <Typography variant="body1">
                                            {new Date(submission.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                                timeZone: 'Asia/Jakarta'
                                            }).replace(',', '')}
                                        </Typography>
                                    </Box>

                                    {/* Category */}
                                    {submission.category && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                                Category
                                            </Typography>
                                            <Chip
                                                label={submission.category}
                                                sx={{
                                                    backgroundColor: '#e3f2fd',
                                                    color: '#1565c0',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                    )}

                                    {/* Presentation Type */}
                                    {submission.category_submission && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                                Presentation Type
                                            </Typography>
                                            <Typography variant="body1">
                                                {submission.category_submission}
                                            </Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* SECTION 2: Author Information */}
                        <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#006838', mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                    Author Information
                                </Typography>

                                <Stack spacing={{ xs: 2, md: 2.5 }}>
                                    {/* Main Author */}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                            Author Full Name
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {submission.author_full_name || submission.author}
                                        </Typography>
                                    </Box>

                                    {/* Institute */}
                                    {submission.institute_organization && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                                Institute / Organization
                                            </Typography>
                                            <Typography variant="body1">
                                                {submission.institute_organization}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Email */}
                                    {submission.corresponding_author_email && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                                Corresponding Author Email
                                            </Typography>
                                            <Typography variant="body1">
                                                {submission.corresponding_author_email}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Mobile */}
                                    {submission.mobile_number && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                                Mobile Number (WhatsApp)
                                            </Typography>
                                            <Typography variant="body1">
                                                {submission.mobile_number}
                                            </Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* SECTION 3: Co-Authors */}
                        {(submission.co_author_1 || submission.co_author_2 || submission.co_author_3 || submission.co_author_4 || submission.co_author_5) && (
                            <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#006838', mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                        Co-Authors
                                    </Typography>

                                    <Stack spacing={2}>
                                        {[1, 2, 3, 4, 5].map(num => {
                                            const coAuthor = submission[`co_author_${num}`];
                                            const coAuthorInstitute = submission[`co_author_${num}_institute`];

                                            if (!coAuthor) return null;

                                            return (
                                                <Box
                                                    key={num}
                                                    sx={{
                                                        p: 2,
                                                        backgroundColor: '#f9fafb',
                                                        borderRadius: 2,
                                                        border: '1px solid #e5e7eb'
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                                                        <PersonIcon sx={{ color: '#006838', fontSize: 20, mt: 0.5 }} />
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151', mb: 0.5 }}>
                                                                Co-Author {num}
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                                                                {coAuthor}
                                                            </Typography>
                                                            {coAuthorInstitute && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <BusinessIcon sx={{ color: '#6c757d', fontSize: 16 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {coAuthorInstitute}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}

                        {/* SECTION 4: Paper Details */}
                        <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#006838', mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                    Paper Details
                                </Typography>

                                <Stack spacing={{ xs: 2, md: 2.5 }}>
                                    {/* Paper Title */}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                            Paper Title
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', lineHeight: 1.4 }}>
                                            {submission.title}
                                        </Typography>
                                    </Box>

                                    {/* Sub Theme */}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                            Sub Theme
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#006838', fontWeight: 500 }}>
                                            {submission.paper_sub_theme || submission.topic}
                                        </Typography>
                                    </Box>

                                    {/* Abstract */}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                            Abstract
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                whiteSpace: 'pre-wrap',
                                                lineHeight: 1.7,
                                                maxWidth: '100%',
                                                color: '#2c2c2c',
                                                textAlign: 'justify'
                                            }}
                                        >
                                            {submission.abstract}
                                        </Typography>
                                    </Box>

                                    {/* Keywords */}
                                    {submission.keywords && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                                Keywords
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {submission.keywords.split(',').map((keyword, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={keyword.trim()}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#e8f5e9',
                                                            color: '#2e7d32',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* SECTION 5: Uploaded Files */}
                        <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#006838', mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                    Uploaded Files
                                </Typography>

                                <Stack spacing={1.5}>
                                    {submission.full_paper_file && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<DescriptionIcon />}
                                            endIcon={<DownloadIcon />}
                                            component="a"
                                            href={`/storage/${submission.full_paper_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            fullWidth
                                            sx={{
                                                justifyContent: 'space-between',
                                                textTransform: 'none',
                                                color: '#006838',
                                                borderColor: '#006838',
                                                py: 1.5,
                                                '&:hover': {
                                                    borderColor: '#004d28',
                                                    backgroundColor: 'rgba(0, 104, 56, 0.04)'
                                                }
                                            }}
                                        >
                                            Full Paper
                                        </Button>
                                    )}
                                    {submission.layouting_file && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<DescriptionIcon />}
                                            endIcon={<DownloadIcon />}
                                            component="a"
                                            href={`/storage/${submission.layouting_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            fullWidth
                                            sx={{
                                                justifyContent: 'space-between',
                                                textTransform: 'none',
                                                color: '#006838',
                                                borderColor: '#006838',
                                                py: 1.5,
                                                '&:hover': {
                                                    borderColor: '#004d28',
                                                    backgroundColor: 'rgba(0, 104, 56, 0.04)'
                                                }
                                            }}
                                        >
                                            Layouting File
                                        </Button>
                                    )}
                                    {submission.editor_feedback_file && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<DescriptionIcon />}
                                            endIcon={<DownloadIcon />}
                                            component="a"
                                            href={`/storage/${submission.editor_feedback_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            fullWidth
                                            sx={{
                                                justifyContent: 'space-between',
                                                textTransform: 'none',
                                                color: '#006838',
                                                borderColor: '#006838',
                                                py: 1.5,
                                                '&:hover': {
                                                    borderColor: '#004d28',
                                                    backgroundColor: 'rgba(0, 104, 56, 0.04)'
                                                }
                                            }}
                                        >
                                            Editor Feedback
                                        </Button>
                                    )}
                                    {!submission.full_paper_file && !submission.layouting_file && !submission.editor_feedback_file && (
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                                            No files uploaded
                                        </Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* SECTION 6: Reviews/Comments */}
                        {reviews.length > 0 && (
                            <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#fafbfc' }}>
                                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#006838', mb: 3, fontSize: { xs: '1rem', md: '1.25rem' }, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CommentIcon />
                                        Admin Comments & Feedback
                                    </Typography>

                                    {/* Final Average Score Summary Card */}
                                    {reviews.some(r => r.overall_score) && (
                                        <Box
                                            sx={{
                                                mb: 3,
                                                p: 2.5,
                                                background: 'linear-gradient(135deg, #006838 0%, #00854a 100%)',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0, 104, 56, 0.15)',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>
                                                Final Average Score
                                            </Typography>
                                            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                                                {(reviews.reduce((sum, r) => sum + parseInt(r.overall_score || 0, 10), 0) / reviews.filter(r => r.overall_score).length).toFixed(1)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                                                Based on {reviews.filter(r => r.overall_score).length} reviewer{reviews.filter(r => r.overall_score).length !== 1 ? 's' : ''}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Reviewers Grid */}
                                    <Grid container spacing={2.5}>
                                        {reviews.map((review, index) => {
                                            // Helper function to get status color
                                            const getRecommendationColor = (recommendation) => {
                                                if (!recommendation) return { bg: '#e0e0e0', text: '#666' };
                                                const rec = recommendation.toLowerCase();
                                                if (rec.includes('accept')) return { bg: '#d4edda', text: '#155724', label: 'Accepted' };
                                                if (rec.includes('reject')) return { bg: '#f8d7da', text: '#721c24', label: 'Rejected' };
                                                if (rec.includes('revision')) return { bg: '#fff3cd', text: '#856404', label: 'Revision Required' };
                                                if (rec.includes('minor')) return { bg: '#cfe2ff', text: '#084298', label: 'Minor Revision' };
                                                if (rec.includes('major')) return { bg: '#fff3cd', text: '#664d03', label: 'Major Revision' };
                                                return { bg: '#e7f3ff', text: '#0c5cb5', label: recommendation };
                                            };

                                            const statusInfo = getRecommendationColor(review.recommendation);

                                            return (
                                                <Grid item xs={12} md={6} key={review.id || index}>
                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            p: 2.5,
                                                            backgroundColor: '#ffffff',
                                                            borderRadius: 2,
                                                            border: '2px solid #e8eaed',
                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                                            transition: 'all 0.2s ease',
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            '&:hover': {
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                                                                transform: 'translateY(-2px)',
                                                                borderColor: '#006838'
                                                            }
                                                        }}
                                                    >
                                                        {/* Status Badge - Top Right */}
                                                        {review.recommendation && (
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 12,
                                                                    right: 12,
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                    backgroundColor: statusInfo.bg,
                                                                    borderRadius: 1,
                                                                    border: `1px solid ${statusInfo.text}40`
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        color: statusInfo.text,
                                                                        fontWeight: 700,
                                                                        fontSize: '0.65rem',
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: 0.3
                                                                    }}
                                                                >
                                                                    {statusInfo.label}
                                                                </Typography>
                                                            </Box>
                                                        )}

                                                        {/* Header with Avatar and Name */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pr: 10 }}>
                                                            <Box
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: '#006838',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flexShrink: 0
                                                                }}
                                                            >
                                                                <PersonIcon sx={{ color: '#fff', fontSize: 22 }} />
                                                            </Box>
                                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                        color: '#1a1a1a',
                                                                        lineHeight: 1.3,
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    {review.reviewer?.name || 'Admin'}
                                                                </Typography>
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        color: '#9ca3af',
                                                                        fontSize: '0.75rem',
                                                                        display: 'block'
                                                                    }}
                                                                >
                                                                    Reviewer #{index + 1}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        {/* Score Display - Prominent */}
                                                        {review.overall_score && (
                                                            <Box
                                                                sx={{
                                                                    mb: 2,
                                                                    p: 1.5,
                                                                    backgroundColor: review.overall_score >= 70 ? '#f0fdf4' : '#fef3c7',
                                                                    borderRadius: 1.5,
                                                                    border: `1px solid ${review.overall_score >= 70 ? '#86efac' : '#fde047'}`,
                                                                    textAlign: 'center'
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="h5"
                                                                    sx={{
                                                                        fontWeight: 800,
                                                                        color: review.overall_score >= 70 ? '#15803d' : '#ca8a04',
                                                                        letterSpacing: -0.5
                                                                    }}
                                                                >
                                                                    Score: {review.overall_score}
                                                                </Typography>
                                                            </Box>
                                                        )}

                                                        {/* Feedback Text */}
                                                        <Box sx={{ mb: 2, flex: 1 }}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: '#374151',
                                                                    lineHeight: 1.7,
                                                                    whiteSpace: 'pre-wrap',
                                                                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                                                    fontSize: '0.9rem'
                                                                }}
                                                            >
                                                                {review.comments || review.feedback || 'No feedback provided'}
                                                            </Typography>
                                                        </Box>

                                                        {/* Date - Subtle at Bottom */}
                                                        <Box
                                                            sx={{
                                                                pt: 2,
                                                                borderTop: '1px solid #e5e7eb',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: '#9ca3af',
                                                                    fontSize: '0.75rem',
                                                                    fontStyle: 'italic'
                                                                }}
                                                            >
                                                                Reviewed on {new Date(review.created_at).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                )}
            </Box>
        </SidebarLayout>
    );
}
