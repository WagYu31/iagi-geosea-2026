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
    Select,
    MenuItem,
    Checkbox,
    Toolbar,
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
    Divider,
    Alert,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function AdminSubmissions({ submissions = [], reviewers = [] }) {
    const [selected, setSelected] = useState([]);
    const [bulkStatus, setBulkStatus] = useState('');
    const [assignDialog, setAssignDialog] = useState({ open: false, submission: null });
    const [selectedReviewers, setSelectedReviewers] = useState([]);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelected(submissions.map(s => s.id));
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
        }, {
            preserveScroll: true,
        });
    };

    const handleBulkUpdate = () => {
        if (selected.length > 0 && bulkStatus) {
            router.post(route('admin.submissions.bulkUpdate'), {
                submission_ids: selected,
                status: bulkStatus,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSelected([]);
                    setBulkStatus('');
                },
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

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'default',
            'under_review': 'info',
            'revision_required_phase1': 'warning',
            'revision_required_phase2': 'warning',
            'accepted': 'success',
            'rejected': 'error',
        };
        return colors[status] || 'default';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'pending': 'Pending',
            'under_review': 'Under Review',
            'revision_required_phase1': 'Revision Phase 1',
            'revision_required_phase2': 'Revision Phase 2',
            'accepted': 'Accepted',
            'rejected': 'Rejected',
        };
        return labels[status] || status;
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

    return (
        <SidebarLayout>
            <Head title="Manage Submissions" />

            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1abc9c' }}>
                        Manage Submissions
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleExport}
                        sx={{
                            backgroundColor: '#1abc9c',
                            '&:hover': { backgroundColor: '#16a085' },
                        }}
                    >
                        Export to CSV
                    </Button>
                </Box>

                {/* Bulk Actions Toolbar */}
                {selected.length > 0 && (
                    <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#f8f9fa' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {selected.length} selected
                            </Typography>
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <InputLabel>Bulk Update Status</InputLabel>
                                <Select
                                    value={bulkStatus}
                                    onChange={(e) => setBulkStatus(e.target.value)}
                                    label="Bulk Update Status"
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
                                sx={{
                                    backgroundColor: '#1abc9c',
                                    '&:hover': { backgroundColor: '#16a085' },
                                }}
                            >
                                Update {selected.length} Submissions
                            </Button>
                        </Box>
                    </Paper>
                )}

                {/* Submissions Table */}
                <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < submissions.length}
                                            checked={submissions.length > 0 && selected.length === submissions.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Topic</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Reviewers</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                                No submissions found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    submissions.map((submission) => {
                                        const isItemSelected = isSelected(submission.id);
                                        const assignedReviewers = submission.reviews || [];
                                        const reviewerCount = assignedReviewers.length;

                                        return (
                                            <TableRow key={submission.id} hover selected={isItemSelected}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        onChange={() => handleSelectOne(submission.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>{submission.id}</TableCell>
                                                <TableCell>{submission.title || 'N/A'}</TableCell>
                                                <TableCell>{submission.user?.name || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2">
                                                            {submission.user?.whatsapp || 'N/A'}
                                                        </Typography>
                                                        {submission.user?.whatsapp && (
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleSendWhatsApp(submission)}
                                                                sx={{
                                                                    color: '#25D366',
                                                                    '&:hover': { backgroundColor: '#25D36620' }
                                                                }}
                                                                title="Kirim Notifikasi via WhatsApp"
                                                            >
                                                                <WhatsAppIcon sx={{ fontSize: 20 }} />
                                                            </IconButton>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{submission.paper_sub_theme || submission.topic || 'N/A'}</TableCell>
                                                <TableCell>
                                                    {new Date(submission.created_at).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false,
                                                        timeZone: 'Asia/Jakarta'
                                                    }).replace(',', '')}
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={submission.status || 'pending'}
                                                        onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                                                        size="small"
                                                        sx={{ minWidth: 150 }}
                                                    >
                                                        <MenuItem value="pending">Pending</MenuItem>
                                                        <MenuItem value="under_review">Under Review</MenuItem>
                                                        <MenuItem value="revision_required_phase1">Revision Phase 1</MenuItem>
                                                        <MenuItem value="revision_required_phase2">Revision Phase 2</MenuItem>
                                                        <MenuItem value="accepted">Accepted</MenuItem>
                                                        <MenuItem value="rejected">Rejected</MenuItem>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={submission.payment?.verified ? 'Paid' : 'Unpaid'}
                                                        color={submission.payment?.verified ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {reviewerCount > 0 ? (
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1abc9c' }}>
                                                                <PeopleIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                                                                Reviewers: {reviewerCount}/5
                                                            </Typography>
                                                            {assignedReviewers.map((review) => (
                                                                <Box
                                                                    key={review.id}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 0.5,
                                                                        backgroundColor: '#f5f5f5',
                                                                        padding: '4px 8px',
                                                                        borderRadius: 1,
                                                                    }}
                                                                >
                                                                    <Typography variant="caption" sx={{ flex: 1, fontSize: '0.75rem' }}>
                                                                        {review.reviewer?.name || 'Unknown'}
                                                                    </Typography>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleRemoveReviewer(submission.id, review.reviewer_id)}
                                                                        sx={{
                                                                            padding: '2px',
                                                                            '&:hover': { color: 'error.main' }
                                                                        }}
                                                                    >
                                                                        <DeleteIcon sx={{ fontSize: 14 }} />
                                                                    </IconButton>
                                                                </Box>
                                                            ))}
                                                            {reviewerCount < 5 && (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    startIcon={<PersonAddIcon />}
                                                                    onClick={() => handleAssignReviewer(submission)}
                                                                    sx={{
                                                                        color: '#1abc9c',
                                                                        borderColor: '#1abc9c',
                                                                        fontSize: '0.7rem',
                                                                        mt: 0.5
                                                                    }}
                                                                >
                                                                    Add More
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    ) : (
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<PersonAddIcon />}
                                                            onClick={() => handleAssignReviewer(submission)}
                                                            sx={{ color: '#1abc9c', borderColor: '#1abc9c' }}
                                                        >
                                                            Assign
                                                        </Button>
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
            </Box>

            {/* Assign Multiple Reviewers Dialog */}
            <Dialog
                open={assignDialog.open}
                onClose={() => setAssignDialog({ open: false, submission: null })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Assign Reviewers
                    {assignDialog.submission && (
                        <Typography variant="caption" display="block" color="text.secondary">
                            Current: {assignDialog.submission.reviews?.length || 0}/5 |
                            Adding: {selectedReviewers.length} |
                            Total: {(assignDialog.submission.reviews?.length || 0) + selectedReviewers.length}/5
                        </Typography>
                    )}
                </DialogTitle>
                <DialogContent>
                    {assignDialog.submission && (
                        <>
                            <Box sx={{ mb: 3, mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Submission:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {assignDialog.submission.title}
                                </Typography>
                            </Box>

                            {/* Currently Assigned Reviewers */}
                            {assignDialog.submission.reviews && assignDialog.submission.reviews.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                        Currently Assigned:
                                    </Typography>
                                    <List dense>
                                        {assignDialog.submission.reviews.map((review) => (
                                            <ListItem key={review.id} sx={{ bgcolor: '#f5f5f5', mb: 0.5, borderRadius: 1 }}>
                                                <ListItemText
                                                    primary={review.reviewer?.name || 'Unknown'}
                                                    secondary={review.reviewer?.email}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}

                            {/* Reviewers to Add */}
                            {selectedReviewers.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#1abc9c' }}>
                                        Selected to Add:
                                    </Typography>
                                    <List dense>
                                        {selectedReviewers.map((id) => {
                                            const reviewer = reviewers.find(r => r.id === id);
                                            return (
                                                <ListItem key={id} sx={{ bgcolor: '#e8f5e9', mb: 0.5, borderRadius: 1 }}>
                                                    <ListItemText
                                                        primary={reviewer?.name || 'Unknown'}
                                                        secondary={reviewer?.email}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            edge="end"
                                                            size="small"
                                                            onClick={() => handleRemoveSelectedReviewer(id)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Box>
                            )}

                            {/* Available Reviewers to Select */}
                            {(assignDialog.submission.reviews?.length || 0) + selectedReviewers.length < 5 ? (
                                <FormControl fullWidth>
                                    <InputLabel>Select Reviewer to Add</InputLabel>
                                    <Select
                                        value=""
                                        onChange={(e) => handleAddReviewer(e.target.value)}
                                        label="Select Reviewer to Add"
                                    >
                                        {getAvailableReviewers().length === 0 ? (
                                            <MenuItem disabled>No more reviewers available</MenuItem>
                                        ) : (
                                            getAvailableReviewers().map((reviewer) => (
                                                <MenuItem key={reviewer.id} value={reviewer.id}>
                                                    {reviewer.name} ({reviewer.email})
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            ) : (
                                <Alert severity="info">
                                    Maximum of 5 reviewers reached
                                </Alert>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setAssignDialog({ open: false, submission: null });
                        setSelectedReviewers([]);
                    }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssignSubmit}
                        variant="contained"
                        disabled={selectedReviewers.length === 0}
                        sx={{
                            backgroundColor: '#1abc9c',
                            '&:hover': { backgroundColor: '#16a085' },
                        }}
                    >
                        Assign {selectedReviewers.length} Reviewer(s)
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
