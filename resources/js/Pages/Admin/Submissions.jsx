import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import Draggable from 'react-draggable';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Typography,
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
    Select,
    MenuItem,
    Checkbox,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Alert,
    InputAdornment,
    Avatar,
    Tooltip,
    Stack,
    Paper,
    Popover,
    useTheme,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';

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

const getThemeFromSubTheme = (subTheme) => {
    if (!subTheme) return 'N/A';
    for (const [theme, subs] of Object.entries(themeSubThemes)) {
        if (subs.includes(subTheme) || theme === subTheme) return theme;
    }
    return subTheme;
};

export default function AdminSubmissions({ submissions = [], reviewers = [] }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const [selected, setSelected] = useState([]);
    const [bulkStatus, setBulkStatus] = useState('');
    const [assignDialog, setAssignDialog] = useState({ open: false, submission: null });
    const [selectedReviewers, setSelectedReviewers] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [presentationFilter, setPresentationFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [coAuthorPopover, setCoAuthorPopover] = useState(null);

    // Filter submissions
    const filteredSubmissions = submissions.filter(submission => {
        const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
        const matchesPresentation = presentationFilter === 'all' || submission.presentation_preference === presentationFilter;
        const matchesSearch = searchTerm === '' ||
            submission.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesPresentation && matchesSearch;
    });

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelected(filteredSubmissions.map(s => s.id));
        } else {
            setSelected([]);
        }
    };

    const handleSelectOne = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleStatusChange = (submissionId, newStatus) => {
        router.patch(route('admin.submissions.updateStatus', submissionId), {
            status: newStatus,
        }, { preserveScroll: true });
    };

    const handleBulkUpdate = () => {
        if (selected.length > 0 && bulkStatus) {
            router.post(route('admin.submissions.bulkUpdate'), {
                submission_ids: selected,
                status: bulkStatus,
            }, {
                preserveScroll: true,
                onSuccess: () => { setSelected([]); setBulkStatus(''); },
            });
        }
    };

    const handleAssignReviewer = (submission) => {
        setAssignDialog({ open: true, submission });
        setSelectedReviewers([]);
    };

    const handleAddReviewer = (reviewerId) => {
        if (!selectedReviewers.includes(reviewerId)) {
            const currentCount = assignDialog.submission?.reviews?.length || 0;
            if (currentCount + selectedReviewers.length < 5) {
                setSelectedReviewers([...selectedReviewers, reviewerId]);
            }
        }
    };

    const handleRemoveSelectedReviewer = (reviewerId) => {
        setSelectedReviewers(selectedReviewers.filter(id => id !== reviewerId));
    };

    const handleAssignSubmit = () => {
        if (selectedReviewers.length > 0 && assignDialog.submission) {
            router.post(route('admin.submissions.assignReviewer', assignDialog.submission.id), {
                reviewer_ids: selectedReviewers,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setAssignDialog({ open: false, submission: null });
                    setSelectedReviewers([]);
                },
            });
        }
    };

    const handleRemoveReviewer = (submissionId, reviewerId) => {
        if (confirm('Are you sure you want to remove this reviewer?')) {
            router.delete(route('admin.submissions.removeReviewer', { submissionId, reviewerId }), {
                preserveScroll: true,
            });
        }
    };

    const handleExport = () => {
        window.location.href = route('admin.submissions.export');
    };

    const getStatusChip = (status) => {
        const map = {
            'pending': { bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7', color: '#d97706', label: 'Pending' },
            'under_review': { bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe', color: '#2563eb', label: 'In Review' },
            'revision_required_phase1': { bg: isDark ? 'rgba(234, 88, 12, 0.15)' : '#fff7ed', color: '#ea580c', label: 'Revision P1' },
            'revision_required_phase2': { bg: isDark ? 'rgba(234, 88, 12, 0.15)' : '#fff7ed', color: '#ea580c', label: 'Revision P2' },
            'accepted': { bg: isDark ? 'rgba(22, 163, 74, 0.15)' : '#dcfce7', color: '#16a34a', label: 'Accepted' },
            'rejected': { bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', color: '#dc2626', label: 'Rejected' },
        };
        return map[status] || { bg: isDark ? 'rgba(107, 114, 128, 0.15)' : '#f3f4f6', color: '#6b7280', label: status };
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const getAvailableReviewers = () => {
        if (!assignDialog.submission) return reviewers;
        const assignedIds = (assignDialog.submission.reviews || []).map(r => r.reviewer_id);
        return reviewers.filter(r => !assignedIds.includes(r.id) && !selectedReviewers.includes(r.id));
    };

    const generateWhatsAppMessage = (submission) => {
        const statusMessages = {
            'pending': "Status submission Anda telah diubah menjadi *Pending*.\n\nSubmission akan segera ditinjau oleh tim kami.",
            'under_review': "Status submission Anda telah diubah menjadi *Under Review*.\n\nSubmission Anda sedang dalam proses peninjauan oleh reviewer.",
            'revision_required_phase1': "Status submission Anda telah diubah menjadi *Revision Phase 1*.\n\nSilakan lakukan revisi sesuai dengan komentar reviewer.",
            'revision_required_phase2': "Status submission Anda telah diubah menjadi *Revision Phase 2*.\n\nSilakan lakukan revisi tambahan sesuai dengan komentar reviewer.",
            'accepted': "🎉 *Selamat!* 🎉\n\nSubmission Anda telah *DITERIMA* (Accepted).\n\nTerima kasih atas kontribusi Anda dalam konferensi ini.",
            'rejected': "Status submission Anda telah diubah menjadi *Rejected*.\n\nMohon maaf submission Anda tidak dapat diterima kali ini. Terima kasih atas partisipasi Anda.",
        };
        const statusText = statusMessages[submission.status] || "Status submission Anda telah diperbarui.";
        let message = "*IAGI-GEOSEA 2026 - Notification*\n\n";
        message += `Halo *${submission.user?.name}*,\n\n`;
        message += `Submission ID: *${submission.id}*\n`;
        message += `Judul: *${submission.title}*\n\n`;
        message += `${statusText}\n\n`;
        message += "Silakan login ke dashboard Anda untuk informasi lebih lanjut.\n\n";
        message += "Terima kasih,\n";
        message += "Tim IAGI-GEOSEA 2026";
        return message;
    };

    const handleSendWhatsApp = (submission) => {
        if (!submission.user?.whatsapp) {
            alert('User tidak memiliki nomor WhatsApp!');
            return;
        }
        const message = generateWhatsAppMessage(submission);
        const phoneNumber = submission.user.whatsapp.replace(/^0/, '62').replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Common cell styling
    const cellSx = {
        borderBottom: `1px solid ${c.cardBorder}`,
        py: 1.5,
        fontSize: '0.825rem',
        color: c.textPrimary,
    };
    const headCellSx = {
        ...cellSx,
        fontWeight: 700,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: c.textMuted,
        bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb',
    };

    return (
        <SidebarLayout>
            <Head title="Manage Submissions" />

            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 3,
                    gap: 2,
                }}>
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: c.textPrimary,
                                fontSize: { xs: '1.5rem', sm: '1.85rem' },
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Manage Submissions 📄
                        </Typography>
                        <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5, fontSize: '0.85rem' }}>
                            {submissions.length} total submissions
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleExport}
                        sx={{
                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                            px: 3,
                            py: 1.2,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            boxShadow: '0 4px 14px rgba(26, 188, 156, 0.35)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)',
                                boxShadow: '0 6px 20px rgba(26, 188, 156, 0.45)',
                                transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.25s ease',
                        }}
                    >
                        Export CSV
                    </Button>
                </Box>

                {/* Search & Filter Bar */}
                <Card elevation={0} sx={{
                    borderRadius: '14px',
                    border: `1px solid ${c.cardBorder}`,
                    bgcolor: c.cardBg,
                    mb: 2.5,
                }}>
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                            <TextField
                                placeholder="Search by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: c.textMuted, fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    flex: 1,
                                    minWidth: 220,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb',
                                        '& fieldset': { borderColor: c.cardBorder },
                                        '&:hover fieldset': { borderColor: '#1abc9c' },
                                        '&.Mui-focused fieldset': { borderColor: '#1abc9c' },
                                    },
                                    '& input': { color: c.textPrimary, fontSize: '0.85rem' },
                                }}
                            />
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel sx={{ fontSize: '0.85rem' }}>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Status"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    sx={{
                                        borderRadius: '10px',
                                        bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb',
                                        fontSize: '0.85rem',
                                        '& fieldset': { borderColor: c.cardBorder },
                                    }}
                                >
                                    <MenuItem value="all">All ({submissions.length})</MenuItem>
                                    <MenuItem value="pending">Pending ({submissions.filter(s => s.status === 'pending').length})</MenuItem>
                                    <MenuItem value="under_review">In Review ({submissions.filter(s => s.status === 'under_review').length})</MenuItem>
                                    <MenuItem value="revision_required_phase1">Revision P1 ({submissions.filter(s => s.status === 'revision_required_phase1').length})</MenuItem>
                                    <MenuItem value="revision_required_phase2">Revision P2 ({submissions.filter(s => s.status === 'revision_required_phase2').length})</MenuItem>
                                    <MenuItem value="accepted">Accepted ({submissions.filter(s => s.status === 'accepted').length})</MenuItem>
                                    <MenuItem value="rejected">Rejected ({submissions.filter(s => s.status === 'rejected').length})</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel sx={{ fontSize: '0.85rem' }}>Type</InputLabel>
                                <Select
                                    value={presentationFilter}
                                    label="Type"
                                    onChange={(e) => setPresentationFilter(e.target.value)}
                                    sx={{
                                        borderRadius: '10px',
                                        bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb',
                                        fontSize: '0.85rem',
                                        '& fieldset': { borderColor: c.cardBorder },
                                    }}
                                >
                                    <MenuItem value="all">All ({submissions.length})</MenuItem>
                                    <MenuItem value="Oral Presentation">Oral ({submissions.filter(s => s.presentation_preference === 'Oral Presentation').length})</MenuItem>
                                    <MenuItem value="Poster Presentation">Poster ({submissions.filter(s => s.presentation_preference === 'Poster Presentation').length})</MenuItem>
                                </Select>
                            </FormControl>
                            <Chip
                                label={`${filteredSubmissions.length} of ${submissions.length}`}
                                size="small"
                                sx={{
                                    bgcolor: isDark ? 'rgba(26, 188, 156, 0.12)' : '#ecfdf5',
                                    color: '#1abc9c',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    borderRadius: '8px',
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selected.length > 0 && (
                    <Card elevation={0} sx={{
                        borderRadius: '14px',
                        border: `2px solid ${isDark ? 'rgba(26, 188, 156, 0.3)' : '#a7f3d0'}`,
                        bgcolor: isDark ? 'rgba(26, 188, 156, 0.06)' : '#ecfdf5',
                        mb: 2.5,
                    }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Chip
                                    label={`${selected.length} selected`}
                                    sx={{
                                        bgcolor: '#1abc9c',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                    }}
                                />
                                <FormControl size="small" sx={{ minWidth: 180 }}>
                                    <InputLabel sx={{ fontSize: '0.85rem' }}>Bulk Update</InputLabel>
                                    <Select
                                        value={bulkStatus}
                                        onChange={(e) => setBulkStatus(e.target.value)}
                                        label="Bulk Update"
                                        sx={{ borderRadius: '10px', fontSize: '0.85rem' }}
                                    >
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="under_review">Under Review</MenuItem>
                                        <MenuItem value="revision_required_phase1">Revision Phase 1</MenuItem>
                                        <MenuItem value="revision_required_phase2">Revision Phase 2</MenuItem>
                                        <MenuItem value="accepted">Accepted</MenuItem>
                                        <MenuItem value="rejected">Rejected</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    onClick={handleBulkUpdate}
                                    disabled={!bulkStatus}
                                    size="small"
                                    sx={{
                                        bgcolor: '#1abc9c',
                                        '&:hover': { bgcolor: '#16a085' },
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 2.5,
                                    }}
                                >
                                    Apply
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Submissions Table */}
                <Card elevation={0} sx={{
                    borderRadius: '16px',
                    border: `1px solid ${c.cardBorder}`,
                    bgcolor: c.cardBg,
                    overflow: 'hidden',
                }}>
                    <TableContainer sx={{ maxHeight: '75vh' }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox" sx={headCellSx}>
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < filteredSubmissions.length}
                                            checked={filteredSubmissions.length > 0 && selected.length === filteredSubmissions.length}
                                            onChange={handleSelectAll}
                                            sx={{ '&.Mui-checked': { color: '#1abc9c' }, '&.MuiCheckbox-indeterminate': { color: '#1abc9c' } }}
                                        />
                                    </TableCell>
                                    <TableCell sx={headCellSx}>ID</TableCell>
                                    <TableCell sx={headCellSx}>Title</TableCell>
                                    <TableCell sx={headCellSx}>Name</TableCell>
                                    <TableCell sx={headCellSx}>Author</TableCell>
                                    <TableCell sx={headCellSx}>Co-Authors</TableCell>
                                    <TableCell sx={headCellSx}>Phone</TableCell>
                                    <TableCell sx={headCellSx}>Email</TableCell>
                                    <TableCell sx={headCellSx}>Paper Theme</TableCell>
                                    <TableCell sx={headCellSx}>Paper Sub Theme</TableCell>
                                    <TableCell sx={headCellSx}>Type</TableCell>
                                    <TableCell sx={headCellSx}>Submitted</TableCell>
                                    <TableCell sx={headCellSx}>Status</TableCell>
                                    <TableCell sx={headCellSx}>Payment</TableCell>
                                    <TableCell sx={headCellSx}>Reviewers</TableCell>
                                    <TableCell sx={headCellSx}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSubmissions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={15} align="center" sx={cellSx}>
                                            <Box sx={{ py: 5 }}>
                                                <DescriptionIcon sx={{ fontSize: 48, color: isDark ? '#374151' : '#d1d5db', mb: 1 }} />
                                                <Typography variant="body2" sx={{ color: c.textMuted }}>
                                                    No submissions found
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSubmissions.map((submission) => {
                                        const isItemSelected = isSelected(submission.id);
                                        const assignedReviewers = submission.reviews || [];
                                        const reviewerCount = assignedReviewers.length;
                                        const status = getStatusChip(submission.status);

                                        return (
                                            <TableRow
                                                key={submission.id}
                                                hover
                                                selected={isItemSelected}
                                                sx={{
                                                    '&:hover': {
                                                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb',
                                                    },
                                                    '&.Mui-selected': {
                                                        bgcolor: isDark ? 'rgba(26, 188, 156, 0.06)' : '#ecfdf5',
                                                        '&:hover': {
                                                            bgcolor: isDark ? 'rgba(26, 188, 156, 0.1)' : '#d1fae5',
                                                        },
                                                    },
                                                }}
                                            >
                                                <TableCell padding="checkbox" sx={cellSx}>
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        onChange={() => handleSelectOne(submission.id)}
                                                        sx={{ '&.Mui-checked': { color: '#1abc9c' } }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ ...cellSx, fontWeight: 600, color: c.textMuted, fontSize: '0.8rem' }}>
                                                    #{submission.id}
                                                </TableCell>
                                                <TableCell sx={{ ...cellSx, fontWeight: 600, maxWidth: 200 }}>
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: 600,
                                                        color: c.textPrimary,
                                                        fontSize: '0.825rem',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: 200,
                                                    }}>
                                                        {submission.title || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={cellSx}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.825rem', color: c.textPrimary }}>
                                                        {submission.author_full_name || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={cellSx}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.825rem', color: c.textPrimary }}>
                                                        {submission.user?.name || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={cellSx}>
                                                    {(() => {
                                                        const coAuthors = [];
                                                        for (let i = 1; i <= 5; i++) {
                                                            const name = submission[`co_author_${i}`];
                                                            const institute = submission[`co_author_${i}_institute`];
                                                            if (name && name.trim()) {
                                                                coAuthors.push({ name, institute: institute || '-' });
                                                            }
                                                        }
                                                        if (coAuthors.length === 0) {
                                                            return (
                                                                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: c.textMuted, fontStyle: 'italic' }}>
                                                                    —
                                                                </Typography>
                                                            );
                                                        }
                                                        return (
                                                            <Chip
                                                                id={`co-authors-${submission.id}`}
                                                                icon={<PeopleIcon sx={{ fontSize: 13 }} />}
                                                                label={`${coAuthors.length}`}
                                                                size="small"
                                                                onClick={(e) => {
                                                                    const chipId = `co-authors-${submission.id}`;
                                                                    if (coAuthorPopover?.id === chipId) {
                                                                        setCoAuthorPopover(null);
                                                                    } else {
                                                                        setCoAuthorPopover({ id: chipId, anchorEl: e.currentTarget, coAuthors });
                                                                    }
                                                                }}
                                                                sx={{
                                                                    bgcolor: isDark ? 'rgba(59, 130, 246, 0.12)' : '#dbeafe',
                                                                    color: '#3b82f6',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.7rem',
                                                                    borderRadius: '6px',
                                                                    height: 24,
                                                                    cursor: 'pointer',
                                                                    '& .MuiChip-icon': { color: '#3b82f6' },
                                                                }}
                                                            />
                                                        );
                                                    })()}
                                                </TableCell>
                                                <TableCell sx={cellSx}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: c.textMuted }}>
                                                            {submission.user?.whatsapp || 'N/A'}
                                                        </Typography>
                                                        {submission.user?.whatsapp && (
                                                            <Tooltip title="Send WhatsApp Notification">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleSendWhatsApp(submission)}
                                                                    sx={{
                                                                        color: '#25D366',
                                                                        p: 0.5,
                                                                        '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.1)' }
                                                                    }}
                                                                >
                                                                    <WhatsAppIcon sx={{ fontSize: 18 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={cellSx}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.8rem', color: c.textMuted }}>
                                                        {submission.user?.email || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...cellSx, maxWidth: 130 }}>
                                                    <Typography variant="body2" sx={{
                                                        fontSize: '0.75rem',
                                                        color: '#1abc9c',
                                                        fontWeight: 600,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}>
                                                        {getThemeFromSubTheme(submission.paper_sub_theme || submission.topic)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ ...cellSx, maxWidth: 150 }}>
                                                    <Typography variant="body2" sx={{
                                                        fontSize: '0.8rem',
                                                        color: c.textPrimary,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}>
                                                        {submission.paper_sub_theme || submission.topic || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={cellSx}>
                                                    <Chip
                                                        label={submission.presentation_preference === 'Oral Presentation' ? 'Oral' : submission.presentation_preference === 'Poster Presentation' ? 'Poster' : 'N/A'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: submission.presentation_preference === 'Oral Presentation'
                                                                ? (isDark ? 'rgba(37, 99, 235, 0.15)' : '#dbeafe')
                                                                : submission.presentation_preference === 'Poster Presentation'
                                                                    ? (isDark ? 'rgba(147, 51, 234, 0.15)' : '#f3e8ff')
                                                                    : (isDark ? 'rgba(107, 114, 128, 0.15)' : '#f3f4f6'),
                                                            color: submission.presentation_preference === 'Oral Presentation'
                                                                ? '#2563eb'
                                                                : submission.presentation_preference === 'Poster Presentation'
                                                                    ? '#9333ea'
                                                                    : '#6b7280',
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                            borderRadius: '6px',
                                                            height: 24,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={cellSx}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: c.textMuted }}>
                                                        {new Date(submission.created_at).toLocaleDateString('en-GB', {
                                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                                            hour: '2-digit', minute: '2-digit', hour12: false,
                                                            timeZone: 'Asia/Jakarta'
                                                        }).replace(',', '')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={cellSx}>
                                                    <Select
                                                        value={submission.status || 'pending'}
                                                        onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                                                        size="small"
                                                        sx={{
                                                            minWidth: 130,
                                                            borderRadius: '8px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 600,
                                                            bgcolor: status.bg,
                                                            color: status.color,
                                                            '& .MuiSelect-select': { py: 0.75 },
                                                            '& fieldset': { borderColor: 'transparent' },
                                                            '&:hover fieldset': { borderColor: status.color },
                                                        }}
                                                    >
                                                        <MenuItem value="pending" sx={{ fontSize: '0.85rem' }}>Pending</MenuItem>
                                                        <MenuItem value="under_review" sx={{ fontSize: '0.85rem' }}>Under Review</MenuItem>
                                                        <MenuItem value="revision_required_phase1" sx={{ fontSize: '0.85rem' }}>Revision P1</MenuItem>
                                                        <MenuItem value="revision_required_phase2" sx={{ fontSize: '0.85rem' }}>Revision P2</MenuItem>
                                                        <MenuItem value="accepted" sx={{ fontSize: '0.85rem' }}>Accepted</MenuItem>
                                                        <MenuItem value="rejected" sx={{ fontSize: '0.85rem' }}>Rejected</MenuItem>
                                                    </Select>
                                                </TableCell>
                                                <TableCell sx={cellSx}>
                                                    <Chip
                                                        label={submission.payment?.verified ? 'Paid' : 'Unpaid'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: submission.payment?.verified
                                                                ? (isDark ? 'rgba(22, 163, 74, 0.15)' : '#dcfce7')
                                                                : (isDark ? 'rgba(107, 114, 128, 0.15)' : '#f3f4f6'),
                                                            color: submission.payment?.verified ? '#16a34a' : '#6b7280',
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                            borderRadius: '6px',
                                                            height: 24,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={cellSx}>
                                                    {reviewerCount > 0 ? (
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                            <Chip
                                                                icon={<PeopleIcon sx={{ fontSize: 14 }} />}
                                                                label={`${reviewerCount}/5`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: isDark ? 'rgba(26, 188, 156, 0.12)' : '#ecfdf5',
                                                                    color: '#1abc9c',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.7rem',
                                                                    borderRadius: '6px',
                                                                    height: 24,
                                                                    '& .MuiChip-icon': { color: '#1abc9c' },
                                                                }}
                                                            />
                                                            {assignedReviewers.map((review) => (
                                                                <Box
                                                                    key={review.id}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 0.5,
                                                                        bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb',
                                                                        px: 1,
                                                                        py: 0.25,
                                                                        borderRadius: '6px',
                                                                    }}
                                                                >
                                                                    <Typography variant="caption" sx={{
                                                                        flex: 1,
                                                                        fontSize: '0.7rem',
                                                                        color: c.textPrimary,
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                    }}>
                                                                        {review.reviewer?.name || 'Unknown'}
                                                                    </Typography>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleRemoveReviewer(submission.id, review.reviewer_id)}
                                                                        sx={{ p: '2px', '&:hover': { color: '#dc2626' } }}
                                                                    >
                                                                        <DeleteIcon sx={{ fontSize: 12 }} />
                                                                    </IconButton>
                                                                </Box>
                                                            ))}
                                                            {reviewerCount < 5 && (
                                                                <Button
                                                                    size="small"
                                                                    startIcon={<PersonAddIcon sx={{ fontSize: 14 }} />}
                                                                    onClick={() => handleAssignReviewer(submission)}
                                                                    sx={{
                                                                        color: '#1abc9c',
                                                                        fontSize: '0.65rem',
                                                                        textTransform: 'none',
                                                                        fontWeight: 600,
                                                                        px: 1,
                                                                        py: 0.25,
                                                                        minWidth: 0,
                                                                        borderRadius: '6px',
                                                                        '&:hover': { bgcolor: isDark ? 'rgba(26, 188, 156, 0.1)' : '#ecfdf5' },
                                                                    }}
                                                                >
                                                                    Add
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    ) : (
                                                        <Button
                                                            size="small"
                                                            startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                                                            onClick={() => handleAssignReviewer(submission)}
                                                            sx={{
                                                                color: '#1abc9c',
                                                                fontSize: '0.75rem',
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                borderRadius: '8px',
                                                                px: 1.5,
                                                                '&:hover': { bgcolor: isDark ? 'rgba(26, 188, 156, 0.1)' : '#ecfdf5' },
                                                            }}
                                                        >
                                                            Assign
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                <TableCell sx={cellSx}>
                                                    <Tooltip title="Delete submission">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this submission? This action cannot be undone and will delete all related reviews and payments.')) {
                                                                    router.delete(route('admin.submissions.delete', submission.id), {
                                                                        preserveScroll: true,
                                                                    });
                                                                }
                                                            }}
                                                            sx={{
                                                                color: isDark ? '#f87171' : '#ef4444',
                                                                '&:hover': {
                                                                    bgcolor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2',
                                                                },
                                                            }}
                                                        >
                                                            <DeleteIcon sx={{ fontSize: 20 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Box>

            {/* Assign Reviewers Dialog */}
            <Dialog
                open={assignDialog.open}
                onClose={() => setAssignDialog({ open: false, submission: null })}
                maxWidth="sm"
                fullWidth
                PaperComponent={(props) => (
                    <Draggable handle="#assign-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                        <Paper {...props} />
                    </Draggable>
                )}
                PaperProps={{
                    sx: {
                        borderRadius: { xs: 0, sm: '16px' },
                        bgcolor: c.cardBg,
                        border: { xs: 'none', sm: `1px solid ${c.cardBorder}` },
                        m: { xs: 0, sm: 3 },
                        maxHeight: { xs: '100vh', sm: '85vh' },
                        height: { xs: '100vh', sm: 'auto' },
                        width: { xs: '100vw', sm: undefined },
                    }
                }}
            >
                <DialogTitle
                    id="assign-dialog-title"
                    sx={{
                        pb: 1,
                        fontWeight: 700,
                        color: c.textPrimary,
                        borderBottom: `1px solid ${c.cardBorder}`,
                        position: 'sticky',
                        top: 0,
                        bgcolor: c.cardBg,
                        zIndex: 1,
                        cursor: 'move',
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                bgcolor: isDark ? 'rgba(26, 188, 156, 0.12)' : '#ecfdf5',
                                width: 40,
                                height: 40,
                                borderRadius: '10px',
                            }}
                        >
                            <PersonAddIcon sx={{ color: '#1abc9c', fontSize: 22 }} />
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: c.textPrimary }}>
                                Assign Reviewers
                            </Typography>
                            {assignDialog.submission && (
                                <Typography variant="caption" sx={{ color: c.textMuted }}>
                                    {assignDialog.submission.reviews?.length || 0}/5 assigned • Adding {selectedReviewers.length}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    {assignDialog.submission && (
                        <>
                            <Box sx={{
                                mb: 2.5,
                                mt: 1,
                                p: 2,
                                bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb',
                                borderRadius: '10px',
                                border: `1px solid ${c.cardBorder}`,
                            }}>
                                <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Submission
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary, mt: 0.5 }}>
                                    {assignDialog.submission.title}
                                </Typography>
                            </Box>

                            {/* Currently Assigned */}
                            {assignDialog.submission.reviews && assignDialog.submission.reviews.length > 0 && (
                                <Box sx={{ mb: 2.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                                        Currently Assigned
                                    </Typography>
                                    <Stack spacing={0.75}>
                                        {assignDialog.submission.reviews.map((review) => (
                                            <Box key={review.id} sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                p: 1.5,
                                                bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#f9fafb',
                                                borderRadius: '10px',
                                                border: `1px solid ${c.cardBorder}`,
                                            }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1abc9c', fontSize: '0.8rem', fontWeight: 700 }}>
                                                    {(review.reviewer?.name || 'U').charAt(0)}
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary, fontSize: '0.85rem' }}>
                                                        {review.reviewer?.name || 'Unknown'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.75rem' }}>
                                                        {review.reviewer?.email}
                                                    </Typography>
                                                    {review.reviewer?.affiliation && (
                                                        <Typography variant="caption" sx={{ color: '#1abc9c', fontSize: '0.7rem', display: 'block' }}>
                                                            {review.reviewer.affiliation}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {/* Selected to Add */}
                            {selectedReviewers.length > 0 && (
                                <Box sx={{ mb: 2.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1abc9c', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                                        Selected to Add
                                    </Typography>
                                    <Stack spacing={0.75}>
                                        {selectedReviewers.map((id) => {
                                            const reviewer = reviewers.find(r => r.id === id);
                                            return (
                                                <Box key={id} sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 1.5,
                                                    bgcolor: isDark ? 'rgba(26, 188, 156, 0.08)' : '#ecfdf5',
                                                    borderRadius: '10px',
                                                    border: `1px solid ${isDark ? 'rgba(26, 188, 156, 0.2)' : '#a7f3d0'}`,
                                                }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#16a34a', fontSize: '0.8rem', fontWeight: 700 }}>
                                                        {(reviewer?.name || 'U').charAt(0)}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary, fontSize: '0.85rem' }}>
                                                            {reviewer?.name || 'Unknown'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.75rem' }}>
                                                            {reviewer?.email}
                                                        </Typography>
                                                        {reviewer?.affiliation && (
                                                            <Typography variant="caption" sx={{ color: '#1abc9c', fontSize: '0.7rem', display: 'block' }}>
                                                                {reviewer.affiliation}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveSelectedReviewer(id)}
                                                        sx={{ '&:hover': { color: '#dc2626' } }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </Box>
                            )}

                            {/* Reviewer Select */}
                            {(assignDialog.submission.reviews?.length || 0) + selectedReviewers.length < 5 ? (
                                <FormControl fullWidth>
                                    <InputLabel>Select Reviewer to Add</InputLabel>
                                    <Select
                                        value=""
                                        onChange={(e) => handleAddReviewer(e.target.value)}
                                        label="Select Reviewer to Add"
                                        sx={{ borderRadius: '10px' }}
                                    >
                                        {getAvailableReviewers().length === 0 ? (
                                            <MenuItem disabled>No more reviewers available</MenuItem>
                                        ) : (
                                            getAvailableReviewers().map((reviewer) => (
                                                <MenuItem key={reviewer.id} value={reviewer.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                                        {reviewer.name} ({reviewer.email})
                                                    </Typography>
                                                    {reviewer.affiliation && (
                                                        <Typography sx={{ fontSize: '0.75rem', color: '#1abc9c', mt: 0.25 }}>
                                                            {reviewer.affiliation}
                                                        </Typography>
                                                    )}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            ) : (
                                <Alert severity="info" sx={{ borderRadius: '10px' }}>
                                    Maximum of 5 reviewers reached
                                </Alert>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1.5, borderTop: `1px solid ${c.cardBorder}` }}>
                    <Button
                        onClick={() => {
                            setAssignDialog({ open: false, submission: null });
                            setSelectedReviewers([]);
                        }}
                        sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600,
                            color: c.textMuted,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssignSubmit}
                        variant="contained"
                        disabled={selectedReviewers.length === 0}
                        sx={{
                            background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)',
                            },
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                        }}
                    >
                        Assign {selectedReviewers.length} Reviewer{selectedReviewers.length !== 1 ? 's' : ''}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Co-Authors Popover */}
            <Popover
                open={Boolean(coAuthorPopover)}
                anchorEl={coAuthorPopover?.anchorEl}
                onClose={() => { }}
                disableAutoFocus
                disableEnforceFocus
                disableRestoreFocus
                style={{ pointerEvents: 'none' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                    style: { pointerEvents: 'auto' },
                    sx: {
                        bgcolor: '#1e293b',
                        borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                        p: 2,
                        minWidth: 220,
                        maxWidth: 350,
                    }
                }}
            >
                {coAuthorPopover?.coAuthors && (
                    <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', mb: 1, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Co-Authors ({coAuthorPopover.coAuthors.length})
                        </Typography>
                        <Stack spacing={1}>
                            {coAuthorPopover.coAuthors.map((ca, idx) => (
                                <Box key={idx}>
                                    <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#fff' }}>
                                        {idx + 1}. {ca.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', pl: 1.5 }}>
                                        {ca.institute}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Popover>

        </SidebarLayout>
    );
}
