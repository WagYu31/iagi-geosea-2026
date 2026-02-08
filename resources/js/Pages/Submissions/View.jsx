import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Paper, Grid, Chip, Button, Divider, TextField, Alert, Card,
    CardContent, Stack, Avatar, useTheme,
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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import CategoryIcon from '@mui/icons-material/Category';
import TagIcon from '@mui/icons-material/Tag';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
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
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

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
            onSuccess: () => setIsEditing(false),
        });
    };

    const needsRevision = ['revision', 'revision phase 1', 'revision phase 2', 'revision_required_phase1', 'revision_required_phase2'].includes(
        submission.status?.toLowerCase()
    );

    // Shared styles
    const cardSx = {
        borderRadius: '16px',
        border: `1px solid ${c.cardBorder}`,
        bgcolor: c.cardBg,
        overflow: 'hidden',
    };
    const sectionTitleSx = {
        fontWeight: 700,
        fontSize: '1rem',
        color: '#1abc9c',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        mb: 2.5,
    };
    const labelSx = {
        fontWeight: 600,
        textTransform: 'uppercase',
        fontSize: '0.7rem',
        letterSpacing: '0.08em',
        color: c.textMuted,
        mb: 0.5,
    };
    const inputSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa',
            '& fieldset': { borderColor: c.cardBorder },
            '&:hover fieldset': { borderColor: '#1abc9c' },
            '&.Mui-focused fieldset': { borderColor: '#1abc9c' },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#1abc9c' },
        '& input, & textarea': { color: c.textPrimary },
    };
    const tealBtnSx = {
        background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
        '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(26,188,156,0.35)' },
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1.2,
        boxShadow: '0 4px 14px rgba(26,188,156,0.3)',
        transition: 'all 0.25s ease',
    };

    // Status chip styling with theme support
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return { bg: c.chipGreenBg, color: c.chipGreenText, label: status };
            case 'rejected': return { bg: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2', color: isDark ? '#fca5a5' : '#dc2626', label: status };
            case 'under_review': case 'under review': return { bg: isDark ? 'rgba(59,130,246,0.15)' : '#eff6ff', color: isDark ? '#93c5fd' : '#2563eb', label: status };
            case 'revision_required_phase1': case 'revision_required_phase2': case 'revision phase 1': case 'revision phase 2': case 'revision':
                return { bg: c.chipAmberBg, color: c.chipAmberText, label: status };
            default: return { bg: isDark ? '#374151' : '#f3f4f6', color: c.textSecondary, label: status || 'Pending' };
        }
    };

    const statusConfig = getStatusConfig(submission.status);

    return (
        <SidebarLayout>
            <Head title={`Submission - ${submission.title}`} />

            <Box sx={{ p: { xs: 2, sm: 3.5 }, maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{ mb: 3.5 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.visit(isReviewer ? route('reviewer.submissions') : route('submissions.index'))}
                        sx={{
                            mb: 2,
                            color: '#1abc9c',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            borderRadius: '10px',
                            '&:hover': { bgcolor: isDark ? 'rgba(26,188,156,0.1)' : '#ecfdf5' },
                        }}
                    >
                        Back to Submissions
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    color: c.textPrimary,
                                    fontSize: { xs: '1.5rem', sm: '1.85rem' },
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.2,
                                }}
                            >
                                Submission Details 📄
                            </Typography>
                            <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <TagIcon sx={{ fontSize: 15 }} />
                                {submission.submission_code || 'N/A'}
                            </Typography>
                        </Box>
                        {!isEditing && needsRevision && !isReviewer && (
                            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsEditing(true)} sx={tealBtnSx}>
                                Edit & Resubmit
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Revision Alert */}
                {needsRevision && reviews.length > 0 && (
                    <Alert
                        severity="warning"
                        icon={<CommentIcon sx={{ color: '#f59e0b' }} />}
                        sx={{
                            mb: 3,
                            borderRadius: '14px',
                            border: `1px solid ${isDark ? 'rgba(245,158,11,0.3)' : '#fde68a'}`,
                            bgcolor: isDark ? 'rgba(245,158,11,0.08)' : '#fffbeb',
                            '& .MuiAlert-message': { color: c.textPrimary },
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: c.textPrimary }}>
                            Revision Required
                        </Typography>
                        <Typography variant="body2" sx={{ color: c.textSecondary }}>
                            Your submission needs revision. Please review the comments below and update your paper accordingly.
                        </Typography>
                    </Alert>
                )}

                {/* Edit Form */}
                {isEditing ? (
                    <Card elevation={0} sx={{ ...cardSx, mb: 3 }}>
                        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                            <Typography variant="h6" sx={sectionTitleSx}>
                                <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 36, height: 36, borderRadius: '10px' }}>
                                    <EditIcon sx={{ color: '#1abc9c', fontSize: 20 }} />
                                </Avatar>
                                Edit Submission
                            </Typography>
                            <Box component="form" onSubmit={handleUpdate}>
                                <Grid container spacing={3}>
                                    <Grid size={12}>
                                        <TextField fullWidth label="Paper Title *" value={data.title} onChange={(e) => setData('title', e.target.value)} error={!!errors.title} helperText={errors.title} required sx={inputSx} />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField fullWidth multiline rows={8} label="Abstract *" value={data.abstract} onChange={(e) => setData('abstract', e.target.value)} error={!!errors.abstract} helperText={errors.abstract} required sx={inputSx} />
                                    </Grid>

                                    {/* File uploads */}
                                    {[
                                        { key: 'full_paper_file', label: 'Update Full Paper', primary: true },
                                        { key: 'layouting_file', label: 'Update Layouting File' },
                                        { key: 'editor_feedback_file', label: 'Update Editor Feedback' },
                                    ].map((item) => (
                                        <Grid size={{ xs: 12, md: 4 }} key={item.key}>
                                            <Box sx={{
                                                border: `2px dashed ${c.cardBorder}`,
                                                borderRadius: '14px',
                                                p: 2.5,
                                                textAlign: 'center',
                                                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
                                                transition: 'all 0.2s ease',
                                                '&:hover': { borderColor: '#1abc9c', bgcolor: isDark ? 'rgba(26,188,156,0.05)' : '#f0fdf9' },
                                            }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: c.textPrimary, fontSize: '0.85rem' }}>
                                                    {item.label}
                                                </Typography>
                                                <Button
                                                    component="label"
                                                    variant={item.primary ? 'contained' : 'outlined'}
                                                    startIcon={<CloudUploadIcon />}
                                                    size="small"
                                                    sx={item.primary ? { ...tealBtnSx, px: 2, py: 0.8, fontSize: '0.8rem' } : {
                                                        color: '#1abc9c', borderColor: isDark ? 'rgba(26,188,156,0.3)' : '#d1fae5', textTransform: 'none', borderRadius: '10px', fontWeight: 600,
                                                        '&:hover': { borderColor: '#1abc9c', bgcolor: isDark ? 'rgba(26,188,156,0.08)' : '#ecfdf5' },
                                                    }}
                                                >
                                                    Choose File
                                                    <VisuallyHiddenInput type="file" accept=".pdf,.doc,.docx" onChange={(e) => setData(item.key, e.target.files[0])} />
                                                </Button>
                                                {data[item.key] && (
                                                    <Typography variant="caption" display="block" sx={{ mt: 1, color: '#1abc9c', fontWeight: 600 }}>
                                                        ✓ {data[item.key].name}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                    ))}

                                    <Grid size={12}>
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setIsEditing(false)}
                                                disabled={processing}
                                                sx={{
                                                    textTransform: 'none', borderRadius: '12px', fontWeight: 600, borderColor: c.cardBorder, color: c.textSecondary,
                                                    '&:hover': { borderColor: c.textMuted, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb' },
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" variant="contained" disabled={processing} sx={tealBtnSx}>
                                                {processing ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
                    <Stack spacing={2.5}>
                        {/* SECTION 1: Status & Metadata */}
                        <Card elevation={0} sx={cardSx}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography variant="h6" sx={sectionTitleSx}>
                                    <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 36, height: 36, borderRadius: '10px' }}>
                                        <InfoIcon sx={{ color: '#1abc9c', fontSize: 20 }} />
                                    </Avatar>
                                    Submission Information
                                </Typography>

                                <Grid container spacing={2.5}>
                                    {/* Status */}
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Typography sx={labelSx}>Status</Typography>
                                        <Chip
                                            label={statusConfig.label}
                                            sx={{ fontWeight: 700, bgcolor: statusConfig.bg, color: statusConfig.color, borderRadius: '8px', height: 28 }}
                                        />
                                    </Grid>
                                    {/* Submission Code */}
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Typography sx={labelSx}>Submission Code</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1abc9c', fontFamily: 'monospace', fontSize: '1.05rem' }}>
                                            {submission.submission_code || 'N/A'}
                                        </Typography>
                                    </Grid>
                                    {/* Submitted On */}
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Typography sx={labelSx}>Submitted On</Typography>
                                        <Typography variant="body2" sx={{ color: c.textPrimary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 14, color: c.textMuted }} />
                                            {new Date(submission.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                                hour12: false, timeZone: 'Asia/Jakarta'
                                            }).replace(',', '')}
                                        </Typography>
                                    </Grid>
                                    {/* Category */}
                                    {submission.category && (
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Typography sx={labelSx}>Category</Typography>
                                            <Chip
                                                label={submission.category}
                                                size="small"
                                                sx={{
                                                    bgcolor: isDark ? 'rgba(59,130,246,0.12)' : '#eff6ff',
                                                    color: isDark ? '#93c5fd' : '#2563eb',
                                                    fontWeight: 600,
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        </Grid>
                                    )}
                                    {/* Presentation Type */}
                                    {submission.category_submission && (
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Typography sx={labelSx}>Presentation Type</Typography>
                                            <Typography variant="body2" sx={{ color: c.textPrimary, fontWeight: 500 }}>
                                                {submission.category_submission}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* SECTION 2: Author Information */}
                        <Card elevation={0} sx={cardSx}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography variant="h6" sx={sectionTitleSx}>
                                    <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 36, height: 36, borderRadius: '10px' }}>
                                        <PersonIcon sx={{ color: '#1abc9c', fontSize: 20 }} />
                                    </Avatar>
                                    Author Information
                                </Typography>

                                <Grid container spacing={2.5}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography sx={labelSx}>Author Full Name</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: c.textPrimary }}>
                                            {submission.author_full_name || submission.author}
                                        </Typography>
                                    </Grid>
                                    {submission.institute_organization && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography sx={labelSx}>Institute / Organization</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                <BusinessIcon sx={{ fontSize: 16, color: c.textMuted }} />
                                                <Typography variant="body2" sx={{ color: c.textPrimary }}>{submission.institute_organization}</Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                    {submission.corresponding_author_email && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography sx={labelSx}>Corresponding Author Email</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                <EmailIcon sx={{ fontSize: 16, color: c.textMuted }} />
                                                <Typography variant="body2" sx={{ color: c.textPrimary }}>{submission.corresponding_author_email}</Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                    {submission.mobile_number && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography sx={labelSx}>Mobile Number (WhatsApp)</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                <PhoneIcon sx={{ fontSize: 16, color: c.textMuted }} />
                                                <Typography variant="body2" sx={{ color: c.textPrimary }}>{submission.mobile_number}</Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* SECTION 3: Co-Authors */}
                        {(submission.co_author_1 || submission.co_author_2 || submission.co_author_3 || submission.co_author_4 || submission.co_author_5) && (
                            <Card elevation={0} sx={cardSx}>
                                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                    <Typography variant="h6" sx={sectionTitleSx}>
                                        <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 36, height: 36, borderRadius: '10px' }}>
                                            <GroupIcon sx={{ color: '#1abc9c', fontSize: 20 }} />
                                        </Avatar>
                                        Co-Authors
                                    </Typography>

                                    <Grid container spacing={2}>
                                        {[1, 2, 3, 4, 5].map(num => {
                                            const coAuthor = submission[`co_author_${num}`];
                                            const coAuthorInstitute = submission[`co_author_${num}_institute`];
                                            if (!coAuthor) return null;
                                            return (
                                                <Grid size={{ xs: 12, sm: 6 }} key={num}>
                                                    <Box sx={{
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                                                        border: `1px solid ${c.cardBorder}`,
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: 1.5,
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': { borderColor: '#1abc9c', bgcolor: isDark ? 'rgba(26,188,156,0.05)' : '#f0fdf9' },
                                                    }}>
                                                        <Avatar sx={{
                                                            width: 36, height: 36,
                                                            bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5',
                                                            fontSize: '0.8rem', fontWeight: 700, color: '#1abc9c',
                                                        }}>
                                                            {num}
                                                        </Avatar>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary, mb: 0.25 }}>
                                                                {coAuthor}
                                                            </Typography>
                                                            {coAuthorInstitute && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <BusinessIcon sx={{ color: c.textMuted, fontSize: 14 }} />
                                                                    <Typography variant="caption" sx={{ color: c.textMuted }}>
                                                                        {coAuthorInstitute}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        {/* SECTION 4: Paper Details */}
                        <Card elevation={0} sx={cardSx}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography variant="h6" sx={sectionTitleSx}>
                                    <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 36, height: 36, borderRadius: '10px' }}>
                                        <DescriptionIcon sx={{ color: '#1abc9c', fontSize: 20 }} />
                                    </Avatar>
                                    Paper Details
                                </Typography>

                                <Stack spacing={2.5}>
                                    {/* Title */}
                                    <Box>
                                        <Typography sx={labelSx}>Paper Title</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: c.textPrimary, lineHeight: 1.4, fontSize: '1.05rem' }}>
                                            {submission.title}
                                        </Typography>
                                    </Box>

                                    {/* Sub Theme */}
                                    <Box>
                                        <Typography sx={labelSx}>Sub Theme</Typography>
                                        <Typography variant="body1" sx={{ color: '#1abc9c', fontWeight: 500 }}>
                                            {submission.paper_sub_theme || submission.topic}
                                        </Typography>
                                    </Box>

                                    {/* Abstract */}
                                    <Box>
                                        <Typography sx={labelSx}>Abstract</Typography>
                                        <Box sx={{
                                            p: 2.5,
                                            borderRadius: '12px',
                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
                                            border: `1px solid ${c.cardBorder}`,
                                        }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    whiteSpace: 'pre-wrap',
                                                    lineHeight: 1.8,
                                                    color: c.textPrimary,
                                                    textAlign: 'justify',
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                {submission.abstract}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Keywords */}
                                    {submission.keywords && (
                                        <Box>
                                            <Typography sx={labelSx}>Keywords</Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {submission.keywords.split(',').map((keyword, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={keyword.trim()}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: isDark ? 'rgba(26,188,156,0.1)' : '#ecfdf5',
                                                            color: '#1abc9c',
                                                            fontWeight: 600,
                                                            borderRadius: '8px',
                                                            fontSize: '0.75rem',
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
                        <Card elevation={0} sx={cardSx}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography variant="h6" sx={sectionTitleSx}>
                                    <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 36, height: 36, borderRadius: '10px' }}>
                                        <CloudUploadIcon sx={{ color: '#1abc9c', fontSize: 20 }} />
                                    </Avatar>
                                    Uploaded Files
                                </Typography>

                                <Stack spacing={1.5}>
                                    {[
                                        { file: submission.full_paper_file, label: 'Full Paper', icon: <DescriptionIcon /> },
                                        { file: submission.layouting_file, label: 'Layouting File', icon: <DescriptionIcon /> },
                                        { file: submission.editor_feedback_file, label: 'Editor Feedback', icon: <CommentIcon /> },
                                    ].filter(f => f.file).map((item, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outlined"
                                            startIcon={item.icon}
                                            endIcon={<DownloadIcon />}
                                            component="a"
                                            href={`/storage/${item.file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            fullWidth
                                            sx={{
                                                justifyContent: 'space-between',
                                                textTransform: 'none',
                                                color: '#1abc9c',
                                                borderColor: isDark ? 'rgba(26,188,156,0.2)' : '#d1fae5',
                                                borderRadius: '12px',
                                                py: 1.5,
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                bgcolor: isDark ? 'rgba(26,188,156,0.05)' : '#f0fdf9',
                                                '&:hover': {
                                                    borderColor: '#1abc9c',
                                                    bgcolor: isDark ? 'rgba(26,188,156,0.1)' : '#ecfdf5',
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 12px rgba(26,188,156,0.15)',
                                                },
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                    {!submission.full_paper_file && !submission.layouting_file && !submission.editor_feedback_file && (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <CloudUploadIcon sx={{ fontSize: 48, color: c.textMuted, mb: 1, opacity: 0.4 }} />
                                            <Typography variant="body2" sx={{ color: c.textMuted }}>No files uploaded</Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* SECTION 6: Reviews/Comments */}
                        {reviews.length > 0 && (
                            <Card elevation={0} sx={cardSx}>
                                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                    <Typography variant="h6" sx={sectionTitleSx}>
                                        <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 36, height: 36, borderRadius: '10px' }}>
                                            <CommentIcon sx={{ color: '#1abc9c', fontSize: 20 }} />
                                        </Avatar>
                                        Admin Comments & Feedback
                                    </Typography>

                                    {/* Final Average Score Summary */}
                                    {reviews.some(r => r.overall_score) && (
                                        <Box sx={{
                                            mb: 3,
                                            p: 3,
                                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                            borderRadius: '14px',
                                            boxShadow: '0 4px 20px rgba(26,188,156,0.25)',
                                            textAlign: 'center',
                                        }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1, fontSize: '0.7rem' }}>
                                                Final Average Score
                                            </Typography>
                                            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, mb: 0.5, fontSize: '2.5rem' }}>
                                                {(() => {
                                                    const validReviews = reviews.filter(r => r.overall_score);
                                                    if (validReviews.length === 0) return '0.0';
                                                    const totalAvg = validReviews.reduce((sum, r) => {
                                                        const o = parseInt(r.originality_score || 0, 10);
                                                        const re = parseInt(r.relevance_score || 0, 10);
                                                        const cl = parseInt(r.clarity_score || 0, 10);
                                                        const m = parseInt(r.methodology_score || 0, 10);
                                                        const ov = parseInt(r.overall_score || 0, 10);
                                                        return sum + ((o + re + cl + m + ov) / 5);
                                                    }, 0) / validReviews.length;
                                                    return totalAvg.toFixed(1);
                                                })()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                                                Based on {reviews.filter(r => r.overall_score).length} reviewer{reviews.filter(r => r.overall_score).length !== 1 ? 's' : ''}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Reviewers Grid */}
                                    <Grid container spacing={2.5}>
                                        {reviews.map((review, index) => {
                                            const getRecConfig = (rec) => {
                                                if (!rec) return { bg: isDark ? '#374151' : '#f3f4f6', color: c.textMuted, label: 'Pending' };
                                                const r = rec.toLowerCase();
                                                if (r.includes('accept')) return { bg: c.chipGreenBg, color: c.chipGreenText, label: 'Accepted' };
                                                if (r.includes('reject')) return { bg: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2', color: isDark ? '#fca5a5' : '#dc2626', label: 'Rejected' };
                                                if (r.includes('minor')) return { bg: isDark ? 'rgba(59,130,246,0.15)' : '#eff6ff', color: isDark ? '#93c5fd' : '#2563eb', label: 'Minor Revision' };
                                                if (r.includes('major') || r.includes('revision')) return { bg: c.chipAmberBg, color: c.chipAmberText, label: rec };
                                                return { bg: isDark ? 'rgba(59,130,246,0.15)' : '#eff6ff', color: isDark ? '#93c5fd' : '#2563eb', label: rec };
                                            };
                                            const recConfig = getRecConfig(review.recommendation);

                                            return (
                                                <Grid size={{ xs: 12, md: 6 }} key={review.id || index}>
                                                    <Box sx={{
                                                        p: 2.5,
                                                        borderRadius: '14px',
                                                        border: `1px solid ${c.cardBorder}`,
                                                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            borderColor: '#1abc9c',
                                                            boxShadow: `0 4px 16px ${isDark ? 'rgba(26,188,156,0.1)' : 'rgba(0,0,0,0.06)'}`,
                                                            transform: 'translateY(-2px)',
                                                        },
                                                    }}>
                                                        {/* Header */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                <Avatar sx={{
                                                                    width: 40, height: 40,
                                                                    bgcolor: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                                                    fontWeight: 700, fontSize: '0.85rem',
                                                                }}>
                                                                    {(review.reviewer?.name || 'A').charAt(0).toUpperCase()}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.textPrimary, lineHeight: 1.3 }}>
                                                                        {review.reviewer?.name || 'Admin'}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.7rem' }}>
                                                                        Reviewer #{index + 1}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            <Chip
                                                                label={recConfig.label}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: recConfig.bg,
                                                                    color: recConfig.color,
                                                                    fontWeight: 700,
                                                                    fontSize: '0.65rem',
                                                                    height: 24,
                                                                    borderRadius: '6px',
                                                                }}
                                                            />
                                                        </Box>

                                                        {/* Score */}
                                                        {review.overall_score && (() => {
                                                            const avgScore = (
                                                                (parseInt(review.originality_score || 0, 10) +
                                                                    parseInt(review.relevance_score || 0, 10) +
                                                                    parseInt(review.clarity_score || 0, 10) +
                                                                    parseInt(review.methodology_score || 0, 10) +
                                                                    parseInt(review.overall_score || 0, 10)) / 5
                                                            ).toFixed(1);
                                                            const isGood = avgScore >= 4;
                                                            return (
                                                                <Box sx={{
                                                                    mb: 2, p: 1.5, borderRadius: '10px', textAlign: 'center',
                                                                    bgcolor: isGood
                                                                        ? (isDark ? 'rgba(22,163,74,0.1)' : '#f0fdf4')
                                                                        : (isDark ? 'rgba(202,138,4,0.1)' : '#fffbeb'),
                                                                    border: `1px solid ${isGood
                                                                        ? (isDark ? 'rgba(22,163,74,0.2)' : '#86efac')
                                                                        : (isDark ? 'rgba(202,138,4,0.2)' : '#fde68a')}`,
                                                                }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                                        <StarIcon sx={{ fontSize: 18, color: isGood ? '#16a34a' : '#ca8a04' }} />
                                                                        <Typography variant="h6" sx={{
                                                                            fontWeight: 800,
                                                                            color: isGood ? (isDark ? '#4ade80' : '#15803d') : (isDark ? '#fbbf24' : '#ca8a04'),
                                                                        }}>
                                                                            Score: {avgScore}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            );
                                                        })()}

                                                        {/* Feedback */}
                                                        <Box sx={{ mb: 2, flex: 1 }}>
                                                            <Typography variant="body2" sx={{
                                                                color: c.textPrimary,
                                                                lineHeight: 1.7,
                                                                whiteSpace: 'pre-wrap',
                                                                fontSize: '0.85rem',
                                                            }}>
                                                                {review.comments || review.feedback || 'No feedback provided'}
                                                            </Typography>
                                                        </Box>

                                                        {/* Date */}
                                                        <Box sx={{ pt: 2, borderTop: `1px solid ${c.cardBorder}`, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <CalendarTodayIcon sx={{ fontSize: 13, color: c.textMuted }} />
                                                            <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.72rem', fontStyle: 'italic' }}>
                                                                Reviewed on {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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
