import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    TextField,
    Grid,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Alert,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

const themes = [
    'Fundamental & Digital Geoscience',
    'Advanced Mining & Mineral Technology',
    'Petroleum Geoscience, Engineering and Management',
    'Engineering Geology, Environment and Geohazard',
    'Energy Transition & Sustainable Future',
    'Governance, Culture and Social Impact',
];

const themeSubThemes = {
    'Fundamental & Digital Geoscience': [
        'Geodynamics, Seismology, Petrology and Volcanology',
        'Sedimentology and Paleontology',
        'Pore Pressure and Geomechanics',
        'Remote Sensing',
        'Technology and Application of Big Data, Machine Learning and Artificial Intelligence in Geoscience',
        'Others'
    ],
    'Advanced Mining & Mineral Technology': [
        'Economic Minerals and Coal Exploration',
        'Economic Minerals and Coal Resources Conservation',
        'Economic Minerals Processing and Refining',
        'Mine Geology, Grade Control and Reconciliation',
        'Mine Geotechnical and Hydrogeology',
        'Geometallurgy',
        'Gemology',
        'Others'
    ],
    'Petroleum Geoscience, Engineering and Management': [
        'Petroleum Geoscience',
        'Petroleum Engineering and Production Technology',
        'Enhanced Oil/Gas Recovery',
        'Reservoir and Production Management',
        'Others'
    ],
    'Engineering Geology, Environment and Geohazard': [
        'Engineering Geology for Infrastructure Development',
        'Monitoring and Instrumentation in Geotechnical Projects',
        'Environmental Geology and Land Use Planning',
        'Geohazards and It\'s Risk Assessment, Mitigation and Prevention',
        'Others'
    ],
    'Energy Transition & Sustainable Future': [
        'Unconventional and Renewable Energy',
        'Geothermal',
        'CCS/CCUS',
        'Natural Hydrogen',
        'Others'
    ],
    'Governance, Culture and Social Impact': [
        'Energy and Economic Mineral Policies',
        'CSR and Social Impact',
        'Health, Safety and Environment (HSE)',
        'Geotourism and Geoheritage',
        'Geomithology',
        'Others'
    ]
};

export default function Submissions({ submissions = [], submissionStatus = { open: true, message: '' } }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const [showForm, setShowForm] = useState(false);
    const [showDeadlineDialog, setShowDeadlineDialog] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const MAX_WORDS = 400;

    const { data, setData, post, processing, errors, reset } = useForm({
        author_full_name: '',
        co_author_1: '',
        co_author_1_institute: '',
        co_author_2: '',
        co_author_2_institute: '',
        co_author_3: '',
        co_author_3_institute: '',
        co_author_4: '',
        co_author_4_institute: '',
        co_author_5: '',
        co_author_5_institute: '',
        mobile_number: '',
        corresponding_author_email: '',
        paper_theme: '',
        paper_sub_theme: '',
        category_submission: '',
        participant_category: '',
        title: '',
        abstract: '',
        keywords: '',
        layouting_file: null,
        editor_feedback_file: null,
        full_paper_file: null,
        institute_organization: '',
        submission_status: '', // Track submission status to control File Uploads visibility
        consent_agreed: false,
    });

    const handleAbstractChange = (e) => {
        const text = e.target.value;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const count = words.length;

        if (count <= MAX_WORDS) {
            setData('abstract', text);
            setWordCount(count);
        }
    };

    const handleThemeChange = (e) => {
        setData('paper_theme', e.target.value);
        // Clear sub-theme when theme changes
        setData('paper_sub_theme', '');
    };

    const handleNewSubmissionClick = () => {
        if (!submissionStatus.open) {
            setShowDeadlineDialog(true);
        } else {
            setShowForm(true);
        }
    };

    // Get available sub-themes based on selected theme
    const availableSubThemes = data.paper_theme ? (themeSubThemes[data.paper_theme] || []) : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('submissions.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setShowForm(false);
                setWordCount(0);
            },
        });
    };

    return (
        <SidebarLayout>
            <Head title="Submissions" />

            <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '1400px', margin: '0 auto' }}>
                {/* Page Header */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'center' },
                    mb: 3,
                    gap: 2
                }}>
                    <Box>
                        <Typography sx={{
                            fontWeight: 800,
                            color: c.textPrimary,
                            fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.75rem' },
                            letterSpacing: '-0.02em',
                            lineHeight: 1.2,
                        }}>
                            My Submissions
                        </Typography>
                        <Typography sx={{ color: c.textMuted, fontSize: '0.85rem', mt: 0.5 }}>
                            Manage and track your paper submissions
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={handleNewSubmissionClick}
                        sx={{
                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                            boxShadow: '0 4px 14px rgba(13, 122, 106, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #0a6b5c 0%, #16a085 100%)',
                                boxShadow: '0 6px 20px rgba(13, 122, 106, 0.4)',
                            },
                            textTransform: 'none',
                            px: 3,
                            py: 1.2,
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            minHeight: '44px',
                            width: { xs: '100%', sm: 'auto' },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        + New Submission
                    </Button>
                </Box>

                {/* Submissions Table */}
                <Paper elevation={0} sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    border: `1px solid ${c.cardBorder}`,
                    borderRadius: '16px',
                    bgcolor: c.cardBg,
                }}>
                    <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '1rem', color: c.textPrimary }}>
                        Submission List
                    </Typography>
                    {submissions.length === 0 ? (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            You haven't submitted any papers yet. Click "New Submission" to get started.
                        </Alert>
                    ) : (
                        <>
                            {/* Desktop/Tablet: Table View */}
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: c.headerBg }}>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: `2px solid ${c.cardBorder}` }}>Code</TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: `2px solid ${c.cardBorder}` }}>Title</TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: `2px solid ${c.cardBorder}` }}>Sub Theme</TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: `2px solid ${c.cardBorder}` }}>Category</TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: `2px solid ${c.cardBorder}` }}>Presentation</TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: `2px solid ${c.cardBorder}` }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: `2px solid ${c.cardBorder}` }}>Submitted</TableCell>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderBottom: `2px solid ${c.cardBorder}` }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {submissions.map((submission) => (
                                                <TableRow key={submission.id} sx={{
                                                    transition: 'background-color 0.15s ease',
                                                    '&:hover': { bgcolor: '#f9fafb' },
                                                    '& td': { borderBottom: '1px solid #f3f4f6', py: 1.8, fontSize: '0.85rem', color: '#374151' },
                                                }}>
                                                    <TableCell>
                                                        <Chip
                                                            label={submission.submission_code || 'N/A'}
                                                            size="small"
                                                            sx={{
                                                                fontFamily: 'monospace',
                                                                fontWeight: 700,
                                                                fontSize: '0.7rem',
                                                                bgcolor: '#ecfdf5',
                                                                color: '#059669',
                                                                border: '1px solid #d1fae5',
                                                                borderRadius: '8px',
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{submission.title}</TableCell>
                                                    <TableCell>{submission.paper_sub_theme || submission.topic}</TableCell>
                                                    <TableCell>
                                                        {submission.participant_category ? (
                                                            <Chip
                                                                label={submission.participant_category.toUpperCase()}
                                                                size="small"
                                                                color={
                                                                    submission.participant_category === 'student' ? 'primary' :
                                                                        submission.participant_category === 'professional' ? 'success' :
                                                                            submission.participant_category === 'international' ? 'secondary' :
                                                                                'default'
                                                                }
                                                                sx={{ fontWeight: 500 }}
                                                            />
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">-</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {submission.category_submission ? (
                                                            <Chip
                                                                label={submission.category_submission}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: submission.category_submission === 'Oral Presentation' ? '#eff6ff' : '#fdf4ff',
                                                                    color: submission.category_submission === 'Oral Presentation' ? '#2563eb' : '#9333ea',
                                                                    border: submission.category_submission === 'Oral Presentation' ? '1px solid #dbeafe' : '1px solid #f3e8ff',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.7rem',
                                                                    borderRadius: '8px',
                                                                }}
                                                            />
                                                        ) : (
                                                            <Typography variant="body2" sx={{ color: '#d1d5db' }}>—</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={submission.status?.replace(/_/g, ' ')}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 700,
                                                                fontSize: '0.65rem',
                                                                textTransform: 'capitalize',
                                                                borderRadius: '8px',
                                                                ...(submission.status === 'accepted' && {
                                                                    bgcolor: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5',
                                                                }),
                                                                ...(submission.status === 'rejected' && {
                                                                    bgcolor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                                                                }),
                                                                ...(submission.status === 'under_review' && {
                                                                    bgcolor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe',
                                                                }),
                                                                ...((submission.status === 'revision_required_phase1' || submission.status === 'revision_required_phase2' || submission.status === 'revision') && {
                                                                    bgcolor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a',
                                                                }),
                                                                ...(submission.status === 'pending' && {
                                                                    bgcolor: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb',
                                                                }),
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>
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
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 0.8 }}>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => router.visit(route('submissions.show', submission.id))}
                                                                sx={{
                                                                    color: '#0d7a6a',
                                                                    borderColor: '#d1fae5',
                                                                    bgcolor: '#f0fdf4',
                                                                    borderRadius: '8px',
                                                                    textTransform: 'none',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.75rem',
                                                                    px: 1.5,
                                                                    '&:hover': {
                                                                        borderColor: '#0d7a6a',
                                                                        bgcolor: '#ecfdf5',
                                                                    },
                                                                }}
                                                            >
                                                                View
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => {
                                                                    setData({
                                                                        ...submission,
                                                                        submission_status: submission.status,
                                                                    });
                                                                    setShowForm(true);
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                                                    boxShadow: 'none',
                                                                    borderRadius: '8px',
                                                                    textTransform: 'none',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.75rem',
                                                                    px: 1.5,
                                                                    '&:hover': {
                                                                        boxShadow: '0 2px 8px rgba(13, 122, 106, 0.3)',
                                                                    },
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            {/* Mobile: Card View */}
                            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                <Stack spacing={2}>
                                    {submissions.map((submission) => (
                                        <Card
                                            key={submission.id}
                                            variant="outlined"
                                            sx={{
                                                borderRadius: '14px',
                                                border: '1px solid #f0f0f0',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                                                    borderColor: '#e5e7eb',
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 2.5 }}>
                                                {/* Header Row: Code + Status */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                    <Chip
                                                        label={submission.submission_code || 'N/A'}
                                                        size="small"
                                                        sx={{
                                                            fontFamily: 'monospace',
                                                            fontWeight: 700,
                                                            fontSize: '0.7rem',
                                                            bgcolor: '#ecfdf5',
                                                            color: '#059669',
                                                            border: '1px solid #d1fae5',
                                                            borderRadius: '8px',
                                                        }}
                                                    />
                                                    <Chip
                                                        label={submission.status?.replace(/_/g, ' ')}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            fontSize: '0.65rem',
                                                            textTransform: 'capitalize',
                                                            borderRadius: '8px',
                                                            ...(submission.status === 'accepted' && {
                                                                bgcolor: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5',
                                                            }),
                                                            ...(submission.status === 'rejected' && {
                                                                bgcolor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                                                            }),
                                                            ...(submission.status === 'under_review' && {
                                                                bgcolor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe',
                                                            }),
                                                            ...((submission.status === 'revision_required_phase1' || submission.status === 'revision_required_phase2' || submission.status === 'revision') && {
                                                                bgcolor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a',
                                                            }),
                                                            ...(submission.status === 'pending' && {
                                                                bgcolor: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb',
                                                            }),
                                                        }}
                                                    />
                                                </Box>

                                                {/* Title */}
                                                <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.9rem', color: '#111827', lineHeight: 1.4 }}>
                                                    {submission.title}
                                                </Typography>

                                                {/* Sub Theme */}
                                                <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', mb: 2 }}>
                                                    {submission.paper_sub_theme || submission.topic || '—'}
                                                </Typography>

                                                {/* Action Buttons */}
                                                <Stack direction="row" spacing={1}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        onClick={() => router.visit(route('submissions.show', submission.id))}
                                                        sx={{
                                                            color: '#0d7a6a',
                                                            borderColor: '#d1fae5',
                                                            bgcolor: '#f0fdf4',
                                                            borderRadius: '10px',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            fontSize: '0.8rem',
                                                            py: 1,
                                                            '&:hover': {
                                                                borderColor: '#0d7a6a',
                                                                bgcolor: '#ecfdf5',
                                                            },
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        fullWidth
                                                        onClick={() => {
                                                            setData({
                                                                ...submission,
                                                                submission_status: submission.status,
                                                            });
                                                            setShowForm(true);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                                            boxShadow: 'none',
                                                            borderRadius: '10px',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            fontSize: '0.8rem',
                                                            py: 1,
                                                            '&:hover': {
                                                                boxShadow: '0 2px 8px rgba(13, 122, 106, 0.3)',
                                                            },
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </Box>
                        </>
                    )}
                </Paper>

                {/* Submit New Paper Form - MOBILE FIRST RESPONSIVE */}
                {showForm && (
                    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3, md: 4 }, border: '1px solid #f0f0f0', borderRadius: '16px' }}>
                        <Typography sx={{ fontWeight: 800, color: '#111827', mb: 0.5, fontSize: { xs: '1.25rem', md: '1.5rem' }, letterSpacing: '-0.02em' }}>
                            Submit New Paper
                        </Typography>
                        <Typography sx={{ mb: { xs: 3, md: 4 }, fontSize: { xs: '0.85rem', md: '0.9rem' }, color: '#9ca3af' }}>
                            Please fill in all required fields marked with an asterisk (*)
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={{ xs: 3, md: 4 }}>

                                {/* SECTION 1: Author Information */}
                                <Card variant="outlined" sx={{ borderRadius: '14px', border: '1px solid #f0f0f0' }}>
                                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0d7a6a', mb: 2, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                                            Author Information
                                        </Typography>

                                        <Stack spacing={{ xs: 2, md: 2.5 }}>
                                            <TextField
                                                fullWidth
                                                label="Author Full Name *"
                                                value={data.author_full_name}
                                                onChange={(e) => setData('author_full_name', e.target.value)}
                                                error={!!errors.author_full_name}
                                                helperText={errors.author_full_name}
                                                required
                                                InputProps={{
                                                    sx: {
                                                        minHeight: '44px',
                                                        fontSize: { xs: '16px', md: '1rem' }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Institute / Organization *"
                                                value={data.institute_organization}
                                                onChange={(e) => setData('institute_organization', e.target.value)}
                                                error={!!errors.institute_organization}
                                                helperText={errors.institute_organization}
                                                required
                                                InputProps={{
                                                    sx: {
                                                        minHeight: '44px',
                                                        fontSize: { xs: '16px', md: '1rem' }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Mobile Number (WhatsApp) *"
                                                value={data.mobile_number}
                                                onChange={(e) => setData('mobile_number', e.target.value)}
                                                error={!!errors.mobile_number}
                                                helperText={errors.mobile_number || "Must be connected to WhatsApp"}
                                                placeholder="+62xxx"
                                                required
                                                InputProps={{
                                                    sx: {
                                                        minHeight: '44px',
                                                        fontSize: { xs: '16px', md: '1rem' }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                type="email"
                                                label="Corresponding Author Email *"
                                                value={data.corresponding_author_email}
                                                onChange={(e) => setData('corresponding_author_email', e.target.value)}
                                                error={!!errors.corresponding_author_email}
                                                helperText={errors.corresponding_author_email}
                                                placeholder="email@example.com"
                                                required
                                                InputProps={{
                                                    sx: {
                                                        minHeight: '44px',
                                                        fontSize: { xs: '16px', md: '1rem' }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                }}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* SECTION 2: Co-Authors */}
                                <Card variant="outlined" sx={{ borderRadius: '14px', border: '1px solid #f0f0f0' }}>
                                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0d7a6a', mb: 1, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                                            Co-Authors (Optional)
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                            Add up to 5 co-authors with their institutions
                                        </Typography>

                                        <Stack spacing={{ xs: 2, md: 2.5 }}>
                                            {/* Co-Author 1 */}
                                            <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#374151', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                    Co-Author 1
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Full Name"
                                                        placeholder="Enter co-author name"
                                                        value={data.co_author_1}
                                                        onChange={(e) => setData('co_author_1', e.target.value)}
                                                        InputProps={{
                                                            sx: {
                                                                minHeight: '44px',
                                                                fontSize: { xs: '16px', md: '1rem' },
                                                                backgroundColor: '#fff'
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Institute/Organization"
                                                        placeholder="Enter institution"
                                                        value={data.co_author_1_institute}
                                                        onChange={(e) => setData('co_author_1_institute', e.target.value)}
                                                        InputProps={{
                                                            sx: {
                                                                minHeight: '44px',
                                                                fontSize: { xs: '16px', md: '1rem' },
                                                                backgroundColor: '#fff'
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>

                                            {/* Co-Author 2 */}
                                            <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#374151', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                    Co-Author 2
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Full Name"
                                                        placeholder="Enter co-author name"
                                                        value={data.co_author_2}
                                                        onChange={(e) => setData('co_author_2', e.target.value)}
                                                        InputProps={{
                                                            sx: {
                                                                minHeight: '44px',
                                                                fontSize: { xs: '16px', md: '1rem' },
                                                                backgroundColor: '#fff'
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Institute/Organization"
                                                        placeholder="Enter institution"
                                                        value={data.co_author_2_institute}
                                                        onChange={(e) => setData('co_author_2_institute', e.target.value)}
                                                        InputProps={{
                                                            sx: {
                                                                minHeight: '44px',
                                                                fontSize: { xs: '16px', md: '1rem' },
                                                                backgroundColor: '#fff'
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>

                                            {/* Co-Author 3 */}
                                            <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#374151', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                    Co-Author 3
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Full Name"
                                                        placeholder="Enter co-author name"
                                                        value={data.co_author_3}
                                                        onChange={(e) => setData('co_author_3', e.target.value)}
                                                        InputProps={{
                                                            sx: {
                                                                minHeight: '44px',
                                                                fontSize: { xs: '16px', md: '1rem' },
                                                                backgroundColor: '#fff'
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Institute/Organization"
                                                        placeholder="Enter institution"
                                                        value={data.co_author_3_institute}
                                                        onChange={(e) => setData('co_author_3_institute', e.target.value)}
                                                        InputProps={{
                                                            sx: {
                                                                minHeight: '44px',
                                                                fontSize: { xs: '16px', md: '1rem' },
                                                                backgroundColor: '#fff'
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>

                                            {/* Co-Author 4 */}
                                            <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#374151', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                    Co-Author 4
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Full Name"
                                                        placeholder="Enter co-author name"
                                                        value={data.co_author_4}
                                                        onChange={(e) => setData('co_author_4', e.target.value)}
                                                        InputProps={{
                                                            sx: {
                                                                minHeight: '44px',
                                                                fontSize: { xs: '16px', md: '1rem' },
                                                                backgroundColor: '#fff'
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Institute/Organization"
                                                        placeholder="Enter institution"
                                                        value={data.co_author_4_institute}
                                                        onChange={(e) => setData('co_author_4_institute', e.target.value)}
                                                        InputProps={{
                                                            sx: {
                                                                minHeight: '44px',
                                                                fontSize: { xs: '16px', md: '1rem' },
                                                                backgroundColor: '#fff'
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>

                                            {/* Co-Author 5 */}
                                            <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#374151', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                    Co-Author 5
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Full Name"
                                                        placeholder="Enter co-author name"
                                                        value={data.co_author_5}
                                                        onChange={(e) => setData('co_author_5', e.target.value)}
                                                        InputProps={{
                                                            sx: {
                                                                minHeight: '44px',
                                                                fontSize: { xs: '16px', md: '1rem' },
                                                                backgroundColor: '#fff'
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Institute/Organization"
                                                        placeholder="Enter institution"
                                                        value={data.co_author_5_institute}
                                                        onChange={(e) => setData('co_author_5_institute', e.target.value)}
                                                        InputProps={{
                                                            sx: {
                                                                minHeight: '44px',
                                                                fontSize: { xs: '16px', md: '1rem' },
                                                                backgroundColor: '#fff'
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* SECTION 3: Paper Details */}
                                <Card variant="outlined" sx={{ borderRadius: '14px', border: '1px solid #f0f0f0' }}>
                                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0d7a6a', mb: 2, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                                            Paper Details
                                        </Typography>

                                        <Stack spacing={{ xs: 2, md: 2.5 }}>
                                            {/* Category Submission - Full width vertical */}
                                            <TextField
                                                fullWidth
                                                select
                                                label="Presentation Type *"
                                                value={data.category_submission}
                                                onChange={(e) => setData('category_submission', e.target.value)}
                                                error={!!errors.category_submission}
                                                helperText={errors.category_submission || "Choose your presentation type"}
                                                required
                                                sx={{
                                                    minWidth: { xs: '100%', md: '200px' }
                                                }}
                                                InputProps={{
                                                    sx: {
                                                        minHeight: '44px',
                                                        height: '56px',
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        backgroundColor: '#fff',
                                                        '& .MuiSelect-select': {
                                                            paddingTop: '16px',
                                                            paddingBottom: '16px',
                                                            paddingLeft: '14px',
                                                            paddingRight: '32px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    sx: {
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        backgroundColor: '#fff',
                                                        px: 0.5,
                                                        '&.Mui-focused': {
                                                            color: '#1abc9c'
                                                        }
                                                    }
                                                }}
                                                SelectProps={{
                                                    displayEmpty: true,
                                                    native: false,
                                                    MenuProps: {
                                                        PaperProps: {
                                                            sx: {
                                                                minWidth: { xs: '250px', md: '280px' },
                                                                mt: 0.5,
                                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                            }
                                                        },
                                                        anchorOrigin: {
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        },
                                                        transformOrigin: {
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        },
                                                        sx: {
                                                            zIndex: 1300
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="" disabled sx={{ display: 'none' }}>
                                                    <em style={{ color: '#999' }}>Select Category</em>
                                                </MenuItem>
                                                <MenuItem
                                                    value="Oral Presentation"
                                                    sx={{
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        minWidth: { xs: '250px', md: '280px' },
                                                        whiteSpace: 'normal',
                                                        py: 1.5,
                                                        px: 2,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(26, 188, 156, 0.08)'
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: 'rgba(26, 188, 156, 0.12)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(26, 188, 156, 0.16)'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Oral Presentation
                                                </MenuItem>
                                                <MenuItem
                                                    value="Poster Presentation"
                                                    sx={{
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        minWidth: { xs: '250px', md: '280px' },
                                                        whiteSpace: 'normal',
                                                        py: 1.5,
                                                        px: 2,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(26, 188, 156, 0.08)'
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: 'rgba(26, 188, 156, 0.12)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(26, 188, 156, 0.16)'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Poster Presentation
                                                </MenuItem>
                                            </TextField>

                                            {/* Participant Category - Full width vertical */}
                                            <TextField
                                                fullWidth
                                                select
                                                label="Participant Category *"
                                                value={data.participant_category}
                                                onChange={(e) => setData('participant_category', e.target.value)}
                                                error={!!errors.participant_category}
                                                helperText={errors.participant_category || "Select your participant category"}
                                                required
                                                sx={{
                                                    minWidth: { xs: '100%', md: '200px' }
                                                }}
                                                InputProps={{
                                                    sx: {
                                                        minHeight: '44px',
                                                        height: '56px',
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        backgroundColor: '#fff',
                                                        '& .MuiSelect-select': {
                                                            paddingTop: '16px',
                                                            paddingBottom: '16px',
                                                            paddingLeft: '14px',
                                                            paddingRight: '32px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    sx: {
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        backgroundColor: '#fff',
                                                        px: 0.5,
                                                        '&.Mui-focused': {
                                                            color: '#1abc9c'
                                                        }
                                                    }
                                                }}
                                                SelectProps={{
                                                    displayEmpty: true,
                                                    native: false,
                                                    MenuProps: {
                                                        PaperProps: {
                                                            sx: {
                                                                minWidth: { xs: '250px', md: '280px' },
                                                                mt: 0.5,
                                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                            }
                                                        },
                                                        anchorOrigin: {
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        },
                                                        transformOrigin: {
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        },
                                                        sx: {
                                                            zIndex: 1300
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="" disabled sx={{ display: 'none' }}>
                                                    <em style={{ color: '#999' }}>Select Category</em>
                                                </MenuItem>
                                                <MenuItem
                                                    value="student"
                                                    sx={{
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        minWidth: { xs: '250px', md: '280px' },
                                                        whiteSpace: 'normal',
                                                        py: 1.5,
                                                        px: 2,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(26, 188, 156, 0.08)'
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: 'rgba(26, 188, 156, 0.12)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(26, 188, 156, 0.16)'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Student
                                                </MenuItem>
                                                <MenuItem
                                                    value="professional"
                                                    sx={{
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        minWidth: { xs: '250px', md: '280px' },
                                                        whiteSpace: 'normal',
                                                        py: 1.5,
                                                        px: 2,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(26, 188, 156, 0.08)'
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: 'rgba(26, 188, 156, 0.12)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(26, 188, 156, 0.16)'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Professional
                                                </MenuItem>
                                                <MenuItem
                                                    value="international"
                                                    sx={{
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        minWidth: { xs: '250px', md: '280px' },
                                                        whiteSpace: 'normal',
                                                        py: 1.5,
                                                        px: 2,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(26, 188, 156, 0.08)'
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: 'rgba(26, 188, 156, 0.12)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(26, 188, 156, 0.16)'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    International
                                                </MenuItem>
                                            </TextField>

                                            {/* Paper Theme - Full width vertical */}
                                            <TextField
                                                fullWidth
                                                select
                                                label="Paper Theme *"
                                                value={data.paper_theme}
                                                onChange={handleThemeChange}
                                                error={!!errors.paper_theme}
                                                helperText={errors.paper_theme || "Select the main theme of your paper"}
                                                required
                                                InputProps={{
                                                    sx: {
                                                        minHeight: '44px',
                                                        height: '56px',
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        backgroundColor: '#fff',
                                                        '& .MuiSelect-select': {
                                                            paddingTop: '16px',
                                                            paddingBottom: '16px',
                                                            paddingLeft: '14px',
                                                            paddingRight: '32px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    sx: {
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        backgroundColor: '#fff',
                                                        px: 0.5,
                                                        '&.Mui-focused': {
                                                            color: '#1abc9c'
                                                        }
                                                    }
                                                }}
                                                SelectProps={{
                                                    displayEmpty: true,
                                                    native: false,
                                                    MenuProps: {
                                                        PaperProps: {
                                                            sx: {
                                                                maxHeight: 300,
                                                                minWidth: { xs: '280px', md: '320px' },
                                                                mt: 0.5,
                                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                            }
                                                        },
                                                        anchorOrigin: {
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        },
                                                        transformOrigin: {
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        },
                                                        sx: {
                                                            zIndex: 1300
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="" disabled sx={{ display: 'none' }}>
                                                    <em style={{ color: '#999' }}>Select Theme</em>
                                                </MenuItem>
                                                {themes.map((theme) => (
                                                    <MenuItem
                                                        key={theme}
                                                        value={theme}
                                                        sx={{
                                                            fontSize: { xs: '16px', md: '1rem' },
                                                            minWidth: { xs: '280px', md: '320px' },
                                                            whiteSpace: 'normal',
                                                            py: 1.5,
                                                            px: 2,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(26, 188, 156, 0.08)'
                                                            },
                                                            '&.Mui-selected': {
                                                                backgroundColor: 'rgba(26, 188, 156, 0.12)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(26, 188, 156, 0.16)'
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {theme}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            {/* Paper Sub Theme - Full width vertical */}
                                            <TextField
                                                fullWidth
                                                select
                                                label="Paper Sub Theme *"
                                                value={data.paper_sub_theme}
                                                onChange={(e) => setData('paper_sub_theme', e.target.value)}
                                                error={!!errors.paper_sub_theme}
                                                helperText={errors.paper_sub_theme || (data.paper_theme ? "Select the sub-theme of your paper" : "Please select a theme first")}
                                                required
                                                disabled={!data.paper_theme}
                                                InputProps={{
                                                    sx: {
                                                        minHeight: '44px',
                                                        height: '56px',
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        backgroundColor: '#fff',
                                                        '& .MuiSelect-select': {
                                                            paddingTop: '16px',
                                                            paddingBottom: '16px',
                                                            paddingLeft: '14px',
                                                            paddingRight: '32px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    sx: {
                                                        fontSize: { xs: '16px', md: '1rem' },
                                                        backgroundColor: '#fff',
                                                        px: 0.5,
                                                        '&.Mui-focused': {
                                                            color: '#1abc9c'
                                                        }
                                                    }
                                                }}
                                                SelectProps={{
                                                    displayEmpty: true,
                                                    native: false,
                                                    MenuProps: {
                                                        PaperProps: {
                                                            sx: {
                                                                maxHeight: 300,
                                                                minWidth: { xs: '280px', md: '320px' },
                                                                mt: 0.5,
                                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                            }
                                                        },
                                                        anchorOrigin: {
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        },
                                                        transformOrigin: {
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        },
                                                        sx: {
                                                            zIndex: 1300
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="" disabled sx={{ display: 'none' }}>
                                                    <em style={{ color: '#999' }}>{data.paper_theme ? 'Select Sub-Theme' : 'Select a theme first'}</em>
                                                </MenuItem>
                                                {availableSubThemes.map((theme) => (
                                                    <MenuItem
                                                        key={theme}
                                                        value={theme}
                                                        sx={{
                                                            fontSize: { xs: '16px', md: '1rem' },
                                                            minWidth: { xs: '280px', md: '320px' },
                                                            whiteSpace: 'normal',
                                                            py: 1.5,
                                                            px: 2,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(26, 188, 156, 0.08)'
                                                            },
                                                            '&.Mui-selected': {
                                                                backgroundColor: 'rgba(26, 188, 156, 0.12)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(26, 188, 156, 0.16)'
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {theme}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            {/* Paper Title - Full width vertical */}
                                            <TextField
                                                fullWidth
                                                label="Paper Title *"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                error={!!errors.title}
                                                helperText={errors.title || "Enter a clear and descriptive title"}
                                                placeholder="Enter your paper title"
                                                required
                                                InputProps={{
                                                    sx: {
                                                        minHeight: '44px',
                                                        fontSize: { xs: '16px', md: '1rem' }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                }}
                                            />

                                            {/* Abstract - Full width vertical */}
                                            <Box sx={{ position: 'relative' }}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={6}
                                                    label="Abstract *"
                                                    value={data.abstract}
                                                    onChange={handleAbstractChange}
                                                    error={!!errors.abstract || wordCount > MAX_WORDS}
                                                    helperText={
                                                        errors.abstract ||
                                                        (wordCount > MAX_WORDS
                                                            ? `Word limit exceeded! Maximum ${MAX_WORDS} words allowed.`
                                                            : "Please provide a detailed abstract (max 400 words)")
                                                    }
                                                    placeholder="Enter your paper abstract here..."
                                                    required
                                                    InputProps={{
                                                        sx: {
                                                            fontSize: { xs: '16px', md: '1rem' },
                                                            pb: 3
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                    }}
                                                    FormHelperTextProps={{
                                                        sx: {
                                                            color: wordCount > MAX_WORDS ? '#d32f2f' : 'text.secondary'
                                                        }
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: { xs: '50px', md: '52px' },
                                                        right: '14px',
                                                        color: wordCount > MAX_WORDS ? '#d32f2f' : wordCount > MAX_WORDS * 0.9 ? '#f57c00' : '#666',
                                                        fontWeight: 600,
                                                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1
                                                    }}
                                                >
                                                    {wordCount}/{MAX_WORDS} words
                                                </Typography>
                                            </Box>

                                            {/* Keywords Field - Full width vertical */}
                                            <TextField
                                                fullWidth
                                                label="Keywords *"
                                                value={data.keywords}
                                                onChange={(e) => setData('keywords', e.target.value)}
                                                error={!!errors.keywords}
                                                helperText={errors.keywords || "Enter up to 5 keywords separated by commas (e.g., Geology, Tectonics, Indonesia)"}
                                                placeholder="e.g., Geology, Tectonics, Indonesia"
                                                required
                                                InputProps={{
                                                    sx: {
                                                        minHeight: '44px',
                                                        fontSize: { xs: '16px', md: '1rem' }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    sx: { fontSize: { xs: '16px', md: '1rem' } }
                                                }}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>


                                {/* SECTION 4: File Uploads - Only visible when status is 'accepted' */}
                                {data.submission_status === 'accepted' && (
                                    <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1abc9c', mb: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                                File Uploads
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                Upload your paper files (PDF, DOC, or DOCX format, max 10MB each)
                                            </Typography>

                                            <Grid container spacing={{ xs: 2, md: 3 }}>
                                                {/* Full Paper File */}
                                                <Grid item xs={12} md={4}>
                                                    <Box sx={{
                                                        border: '2px dashed #e0e0e0',
                                                        borderRadius: 2,
                                                        p: 2.5,
                                                        textAlign: 'center',
                                                        backgroundColor: '#fafafa',
                                                        minHeight: { xs: '120px', md: '140px' },
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                            Full Paper File *
                                                        </Typography>
                                                        <Button
                                                            component="label"
                                                            variant="contained"
                                                            startIcon={<CloudUploadIcon />}
                                                            fullWidth
                                                            sx={{
                                                                backgroundColor: '#1abc9c',
                                                                '&:hover': { backgroundColor: '#16a085' },
                                                                mb: 1,
                                                                minHeight: '44px',
                                                                fontSize: { xs: '0.875rem', md: '1rem' },
                                                            }}
                                                        >
                                                            Choose File
                                                            <VisuallyHiddenInput
                                                                type="file"
                                                                accept=".pdf,.doc,.docx"
                                                                onChange={(e) => setData('full_paper_file', e.target.files[0])}
                                                            />
                                                        </Button>
                                                        {data.full_paper_file && (
                                                            <Typography variant="caption" display="block" sx={{ color: '#1abc9c', fontWeight: 600, wordBreak: 'break-word', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                                                ✓ {data.full_paper_file.name}
                                                            </Typography>
                                                        )}
                                                        {errors.full_paper_file && (
                                                            <Typography variant="caption" color="error" display="block">
                                                                {errors.full_paper_file}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>

                                                {/* Layouting File */}
                                                <Grid item xs={12} md={4}>
                                                    <Box sx={{
                                                        border: '2px dashed #e0e0e0',
                                                        borderRadius: 2,
                                                        p: 2.5,
                                                        textAlign: 'center',
                                                        backgroundColor: '#fafafa',
                                                        minHeight: { xs: '120px', md: '140px' },
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                            Layouting File (Optional)
                                                        </Typography>
                                                        <Button
                                                            component="label"
                                                            variant="outlined"
                                                            startIcon={<CloudUploadIcon />}
                                                            fullWidth
                                                            sx={{
                                                                color: '#1abc9c',
                                                                borderColor: '#1abc9c',
                                                                '&:hover': { borderColor: '#16a085', backgroundColor: 'rgba(26, 188, 156, 0.04)' },
                                                                mb: 1,
                                                                minHeight: '44px',
                                                                fontSize: { xs: '0.875rem', md: '1rem' },
                                                            }}
                                                        >
                                                            Choose File
                                                            <VisuallyHiddenInput
                                                                type="file"
                                                                accept=".pdf,.doc,.docx"
                                                                onChange={(e) => setData('layouting_file', e.target.files[0])}
                                                            />
                                                        </Button>
                                                        {data.layouting_file && (
                                                            <Typography variant="caption" display="block" sx={{ color: '#1abc9c', fontWeight: 600, wordBreak: 'break-word', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                                                ✓ {data.layouting_file.name}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>

                                                {/* Editor Feedback File */}
                                                <Grid item xs={12} md={4}>
                                                    <Box sx={{
                                                        border: '2px dashed #e0e0e0',
                                                        borderRadius: 2,
                                                        p: 2.5,
                                                        textAlign: 'center',
                                                        backgroundColor: '#fafafa',
                                                        minHeight: { xs: '120px', md: '140px' },
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                            Editor Feedback (Optional)
                                                        </Typography>
                                                        <Button
                                                            component="label"
                                                            variant="outlined"
                                                            startIcon={<CloudUploadIcon />}
                                                            fullWidth
                                                            sx={{
                                                                color: '#1abc9c',
                                                                borderColor: '#1abc9c',
                                                                '&:hover': { borderColor: '#16a085', backgroundColor: 'rgba(26, 188, 156, 0.04)' },
                                                                mb: 1,
                                                                minHeight: '44px',
                                                                fontSize: { xs: '0.875rem', md: '1rem' },
                                                            }}
                                                        >
                                                            Choose File
                                                            <VisuallyHiddenInput
                                                                type="file"
                                                                accept=".pdf,.doc,.docx"
                                                                onChange={(e) => setData('editor_feedback_file', e.target.files[0])}
                                                            />
                                                        </Button>
                                                        {data.editor_feedback_file && (
                                                            <Typography variant="caption" display="block" sx={{ color: '#1abc9c', fontWeight: 600, wordBreak: 'break-word', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                                                ✓ {data.editor_feedback_file.name}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* SECTION 5: Terms & Conditions */}
                                <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                    <CardContent sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f8f9fa' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1abc9c', mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                            Terms & Conditions
                                        </Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={data.consent_agreed}
                                                    onChange={(e) => setData('consent_agreed', e.target.checked)}
                                                    sx={{
                                                        color: '#1abc9c',
                                                        '&.Mui-checked': { color: '#1abc9c' },
                                                        '& .MuiSvgIcon-root': { fontSize: { xs: 24, md: 28 } }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                    <strong>I hereby confirm that:</strong>
                                                    <br />
                                                    • All information provided is accurate and complete
                                                    <br />
                                                    • I have read and agree to the conference terms and conditions
                                                    <br />
                                                    • The submitted work is original and has not been published elsewhere
                                                    <br />
                                                    • I have obtained consent from all co-authors for this submission
                                                </Typography>
                                            }
                                        />
                                        {errors.consent_agreed && (
                                            <Typography variant="caption" color="error" display="block" sx={{ mt: 1, ml: 4 }}>
                                                {errors.consent_agreed}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Submit Buttons */}
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexDirection: { xs: 'column', sm: 'row' } }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            reset();
                                            setShowForm(false);
                                        }}
                                        disabled={processing}
                                        fullWidth={{ xs: true, sm: false }}
                                        sx={{
                                            color: '#666',
                                            borderColor: '#ccc',
                                            '&:hover': { borderColor: '#999' },
                                            px: 3,
                                            py: 1.5,
                                            minHeight: '48px',
                                            textTransform: 'none',
                                            fontSize: { xs: '1rem', md: '1rem' },
                                            minWidth: { sm: '120px' }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing || !data.consent_agreed}
                                        fullWidth={{ xs: true, sm: false }}
                                        sx={{
                                            backgroundColor: '#1abc9c',
                                            '&:hover': { backgroundColor: '#16a085' },
                                            '&:disabled': { backgroundColor: '#cccccc' },
                                            px: 4,
                                            py: 1.5,
                                            minHeight: '48px',
                                            textTransform: 'none',
                                            fontSize: { xs: '1rem', md: '1rem' },
                                            fontWeight: 600,
                                            minWidth: { sm: '180px' }
                                        }}
                                    >
                                        {processing ? 'Submitting...' : '✓ Submit Paper'}
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </Paper>
                )}
            </Box>

            {/* Deadline Dialog */}
            <Dialog
                open={showDeadlineDialog}
                onClose={() => setShowDeadlineDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ color: '#1abc9c', fontWeight: 'bold' }}>
                    Submission Closed
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {submissionStatus.message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowDeadlineDialog(false)}
                        sx={{
                            color: '#1abc9c',
                            '&:hover': {
                                backgroundColor: 'rgba(26, 188, 156, 0.04)',
                            },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
