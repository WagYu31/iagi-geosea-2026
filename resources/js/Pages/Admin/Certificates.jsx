import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, TextField, InputAdornment, Select, MenuItem,
    FormControl, InputLabel, Avatar, useTheme, Dialog, DialogTitle, DialogContent,
    DialogActions, IconButton, Tooltip, Snackbar, Alert, Collapse,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function AdminCertificates({ submissions = {}, filters = {} }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [certStatus, setCertStatus] = useState(filters.cert_status || 'all');
    const [expandedRow, setExpandedRow] = useState(null);
    const [uploadDialog, setUploadDialog] = useState({ open: false, submissionId: null, submissionTitle: '' });
    const [uploadForm, setUploadForm] = useState({ file: null, certificate_type: 'participation', label: '' });
    const [uploading, setUploading] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, certId: null, label: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const fileRef = useRef(null);
    const searchTimeout = useRef(null);

    const submissionsData = submissions.data || [];
    const totalSubmissions = submissions.total || 0;
    const currentPage = submissions.current_page || 1;
    const lastPage = submissions.last_page || 1;

    const handleSearch = (value) => {
        setSearchTerm(value);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            router.get(route('admin.certificates'), { search: value, cert_status: certStatus === 'all' ? '' : certStatus }, { preserveState: true, replace: true });
        }, 400);
    };

    const handleCertStatusChange = (value) => {
        setCertStatus(value);
        router.get(route('admin.certificates'), { search: searchTerm, cert_status: value === 'all' ? '' : value }, { preserveState: true, replace: true });
    };

    const handleUpload = () => {
        if (!uploadForm.file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', uploadForm.file);
        formData.append('certificate_type', uploadForm.certificate_type);
        if (uploadForm.label) formData.append('label', uploadForm.label);

        router.post(route('admin.certificates.upload', uploadDialog.submissionId), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setUploading(false);
                setUploadDialog({ open: false, submissionId: null, submissionTitle: '' });
                setUploadForm({ file: null, certificate_type: 'participation', label: '' });
                setSnackbar({ open: true, message: 'Certificate uploaded successfully!', severity: 'success' });
            },
            onError: (errors) => {
                setUploading(false);
                setSnackbar({ open: true, message: errors.file || 'Upload failed', severity: 'error' });
            },
        });
    };

    const handleDelete = () => {
        router.delete(route('admin.certificates.delete', deleteDialog.certId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialog({ open: false, certId: null, label: '' });
                setSnackbar({ open: true, message: 'Certificate deleted', severity: 'success' });
            },
        });
    };

    const getTypeChip = (type) => {
        const map = {
            participation: { label: 'Participation', bg: isDark ? 'rgba(37,99,235,0.15)' : '#dbeafe', color: '#2563eb' },
            presenter: { label: 'Presenter', bg: isDark ? 'rgba(22,163,74,0.15)' : '#dcfce7', color: '#16a34a' },
            best_paper: { label: 'Best Paper', bg: isDark ? 'rgba(234,88,12,0.15)' : '#fff7ed', color: '#ea580c' },
        };
        const s = map[type] || map.participation;
        return <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24 }} />;
    };

    const cellSx = { borderBottom: `1px solid ${c.cardBorder}`, py: 1.5, fontSize: '0.825rem', color: c.textPrimary };
    const headCellSx = { ...cellSx, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: c.textMuted, bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb' };
    const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '10px', '& fieldset': { borderColor: c.cardBorder }, '&:hover fieldset': { borderColor: '#1abc9c' }, '&.Mui-focused fieldset': { borderColor: '#1abc9c' } } };
    const tealBtn = { background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)', '&:hover': { background: 'linear-gradient(135deg, #16a085 0%, #0d7a6a 100%)' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600, px: 3 };
    const dialogPaper = { sx: { borderRadius: '16px', bgcolor: c.cardBg, border: `1px solid ${c.cardBorder}` } };

    // Stats
    const withCerts = submissionsData.filter(s => s.certificates?.length > 0).length;
    const withoutCerts = submissionsData.length - withCerts;
    const totalCerts = submissionsData.reduce((sum, s) => sum + (s.certificates?.length || 0), 0);

    const stats = [
        { label: 'Accepted Submissions', value: totalSubmissions, icon: <WorkspacePremiumIcon />, color: '#1abc9c', bg: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5' },
        { label: 'With Certificate', value: withCerts, icon: <CheckCircleIcon />, color: '#16a34a', bg: isDark ? 'rgba(22,163,74,0.12)' : '#dcfce7' },
        { label: 'No Certificate', value: withoutCerts, icon: <HighlightOffIcon />, color: '#d97706', bg: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7' },
        { label: 'Certificates Uploaded', value: totalCerts, icon: <PictureAsPdfIcon />, color: '#2563eb', bg: isDark ? 'rgba(37,99,235,0.12)' : '#dbeafe' },
    ];

    return (
        <SidebarLayout>
            <Head title="Certificates" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: { xs: '1.5rem', sm: '1.85rem' }, letterSpacing: '-0.02em' }}>
                        Certificates 🏆
                    </Typography>
                    <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5 }}>Upload and manage certificates for accepted submissions only</Typography>
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                    {stats.map((s) => (
                        <Card key={s.label} elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, transition: 'all 0.25s', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 25px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}` } }}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar variant="rounded" sx={{ bgcolor: s.bg, width: 44, height: 44, borderRadius: '12px' }}>
                                        {React.cloneElement(s.icon, { sx: { color: s.color, fontSize: 22 } })}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>{s.label}</Typography>
                                        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: c.textPrimary, lineHeight: 1.2 }}>{s.value}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Search & Filter */}
                <Card elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, mb: 2.5 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField placeholder="Search by title, code, or author..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} size="small"
                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: c.textMuted, fontSize: 20 }} /></InputAdornment> }}
                                sx={{ flex: 1, minWidth: 250, ...inputSx, '& .MuiOutlinedInput-root': { ...inputSx['& .MuiOutlinedInput-root'], bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb' }, '& input': { color: c.textPrimary, fontSize: '0.85rem' } }}
                            />
                            <FormControl size="small" sx={{ minWidth: 180 }}>
                                <InputLabel sx={{ fontSize: '0.85rem' }}>Certificate Status</InputLabel>
                                <Select value={certStatus} label="Certificate Status" onChange={(e) => handleCertStatusChange(e.target.value)}
                                    sx={{ borderRadius: '10px', bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb', fontSize: '0.85rem', '& fieldset': { borderColor: c.cardBorder }, '&:hover fieldset': { borderColor: '#1abc9c' } }}>
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="has_certificate">Has Certificate</MenuItem>
                                    <MenuItem value="no_certificate">No Certificate</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card elevation={0} sx={{ borderRadius: '16px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {['#', 'Submission', 'Author', 'Certificates', 'Actions'].map(h => (
                                        <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissionsData.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} align="center" sx={cellSx}>
                                        <Box sx={{ py: 5 }}><WorkspacePremiumIcon sx={{ fontSize: 48, color: isDark ? '#374151' : '#d1d5db', mb: 1 }} /><Typography variant="body2" sx={{ color: c.textMuted }}>No submissions found</Typography></Box>
                                    </TableCell></TableRow>
                                ) : submissionsData.map((sub) => (
                                    <React.Fragment key={sub.id}>
                                        <TableRow hover sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb' } }}>
                                            <TableCell sx={{ ...cellSx, fontWeight: 600, color: c.textMuted, fontSize: '0.8rem', width: 60 }}>
                                                {sub.submission_code || `#${sub.id}`}
                                            </TableCell>
                                            <TableCell sx={{ ...cellSx, maxWidth: 300 }}>
                                                <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '0.825rem', maxWidth: 300 }}>{sub.title}</Typography>
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 30, height: 30, bgcolor: '#1abc9c', fontSize: '0.75rem', fontWeight: 700 }}>{(sub.user?.name || 'U').charAt(0)}</Avatar>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontSize: '0.825rem', color: c.textPrimary, fontWeight: 600 }}>{sub.user?.name || 'Unknown'}</Typography>
                                                        <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.7rem' }}>{sub.user?.email}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                {sub.certificates?.length > 0 ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip label={`${sub.certificates.length} certificate${sub.certificates.length > 1 ? 's' : ''}`} size="small"
                                                            sx={{ bgcolor: isDark ? 'rgba(22,163,74,0.15)' : '#dcfce7', color: '#16a34a', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24 }} />
                                                        <IconButton size="small" onClick={() => setExpandedRow(expandedRow === sub.id ? null : sub.id)}
                                                            sx={{ color: c.textMuted, '&:hover': { bgcolor: isDark ? 'rgba(26,188,156,0.1)' : '#ecfdf5' } }}>
                                                            {expandedRow === sub.id ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
                                                        </IconButton>
                                                    </Box>
                                                ) : (
                                                    <Chip label="No certificate" size="small" sx={{ bgcolor: isDark ? 'rgba(107,114,128,0.15)' : '#f3f4f6', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px', height: 24 }} />
                                                )}
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Button size="small" startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
                                                    onClick={() => setUploadDialog({ open: true, submissionId: sub.id, submissionTitle: sub.title })}
                                                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: 'white', ...tealBtn, px: 1.5, py: 0.5 }}>
                                                    Upload
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        {/* Expanded certificates detail */}
                                        {expandedRow === sub.id && sub.certificates?.length > 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} sx={{ py: 0, borderBottom: `1px solid ${c.cardBorder}` }}>
                                                    <Collapse in={expandedRow === sub.id} timeout="auto" unmountOnExit>
                                                        <Box sx={{ py: 2, px: 3, bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#f9fafb' }}>
                                                            <Typography variant="caption" sx={{ fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5, display: 'block' }}>
                                                                Uploaded Certificates
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                {sub.certificates.map((cert) => (
                                                                    <Box key={cert.id} sx={{
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                        p: 1.5, borderRadius: '10px',
                                                                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                                                                        border: `1px solid ${c.cardBorder}`,
                                                                    }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                            <PictureAsPdfIcon sx={{ color: '#dc2626', fontSize: 20 }} />
                                                                            <Box>
                                                                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.825rem', color: c.textPrimary }}>{cert.label}</Typography>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                                                                                    {getTypeChip(cert.certificate_type)}
                                                                                    <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.7rem' }}>
                                                                                        by {cert.uploader?.name || 'Admin'} • {new Date(cert.created_at).toLocaleDateString('id-ID')}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </Box>
                                                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                            <Tooltip title="Download">
                                                                                <IconButton size="small" component="a" href={`/storage/${cert.file_path}`} target="_blank"
                                                                                    sx={{ color: '#2563eb', '&:hover': { bgcolor: isDark ? 'rgba(37,99,235,0.1)' : '#dbeafe' } }}>
                                                                                    <DownloadIcon sx={{ fontSize: 18 }} />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="Delete">
                                                                                <IconButton size="small" onClick={() => setDeleteDialog({ open: true, certId: cert.id, label: cert.label })}
                                                                                    sx={{ color: isDark ? '#f87171' : '#ef4444', '&:hover': { bgcolor: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2' } }}>
                                                                                    <DeleteIcon sx={{ fontSize: 18 }} />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </Box>
                                                                    </Box>
                                                                ))}
                                                            </Box>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Pagination */}
                    {lastPage > 1 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5, borderTop: `1px solid ${c.cardBorder}`, bgcolor: isDark ? 'rgba(0,0,0,0.08)' : '#f9fafb' }}>
                            <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.8rem' }}>
                                Showing {((currentPage - 1) * 25) + 1}–{Math.min(currentPage * 25, totalSubmissions)} of {totalSubmissions}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {currentPage > 1 && (
                                    <Button size="small" onClick={() => router.get(route('admin.certificates'), { ...filters, page: currentPage - 1 }, { preserveState: true })}
                                        sx={{ minWidth: 36, borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', color: c.textMuted }}>‹ Prev</Button>
                                )}
                                {Array.from({ length: Math.min(lastPage, 7) }, (_, i) => {
                                    let page;
                                    if (lastPage <= 7) page = i + 1;
                                    else if (currentPage <= 4) page = i + 1;
                                    else if (currentPage >= lastPage - 3) page = lastPage - 6 + i;
                                    else page = currentPage - 3 + i;
                                    return (
                                        <Button key={page} size="small" onClick={() => router.get(route('admin.certificates'), { ...filters, page }, { preserveState: true })}
                                            sx={{ minWidth: 32, height: 32, borderRadius: '8px', fontWeight: page === currentPage ? 800 : 600, fontSize: '0.78rem',
                                                background: page === currentPage ? 'linear-gradient(135deg, #0d7a6a, #1abc9c)' : 'transparent',
                                                color: page === currentPage ? '#fff' : c.textMuted, '&:hover': { bgcolor: page === currentPage ? '#16a085' : 'rgba(26,188,156,0.08)' } }}>{page}</Button>
                                    );
                                })}
                                {currentPage < lastPage && (
                                    <Button size="small" onClick={() => router.get(route('admin.certificates'), { ...filters, page: currentPage + 1 }, { preserveState: true })}
                                        sx={{ minWidth: 36, borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', color: c.textMuted }}>Next ›</Button>
                                )}
                            </Box>
                        </Box>
                    )}
                </Card>
            </Box>

            {/* Upload Dialog */}
            <Dialog open={uploadDialog.open} onClose={() => { if (!uploading) setUploadDialog({ open: false, submissionId: null, submissionTitle: '' }); }} maxWidth="sm" fullWidth PaperProps={dialogPaper}>
                <DialogTitle sx={{ fontWeight: 700, color: c.textPrimary, borderBottom: `1px solid ${c.cardBorder}`, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: isDark ? 'rgba(26,188,156,0.12)' : '#ecfdf5', width: 40, height: 40, borderRadius: '10px' }}>
                            <CloudUploadIcon sx={{ color: '#1abc9c', fontSize: 22 }} />
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Upload Certificate</Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, display: 'block', maxWidth: 350 }} noWrap>{uploadDialog.submissionTitle}</Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    {/* File Drop Zone */}
                    <Box
                        onClick={() => fileRef.current?.click()}
                        sx={{
                            mt: 1, mb: 2.5, p: 3, borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                            border: `2px dashed ${uploadForm.file ? '#1abc9c' : c.cardBorder}`,
                            bgcolor: uploadForm.file ? (isDark ? 'rgba(26,188,156,0.05)' : '#ecfdf5') : (isDark ? 'rgba(0,0,0,0.1)' : '#f9fafb'),
                            transition: 'all 0.25s ease',
                            '&:hover': { borderColor: '#1abc9c', bgcolor: isDark ? 'rgba(26,188,156,0.08)' : '#ecfdf5' },
                        }}
                    >
                        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" hidden
                            onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })} />
                        {uploadForm.file ? (
                            <Box>
                                <PictureAsPdfIcon sx={{ fontSize: 36, color: '#1abc9c', mb: 0.5 }} />
                                <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary }}>{uploadForm.file.name}</Typography>
                                <Typography variant="caption" sx={{ color: c.textMuted }}>{(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB</Typography>
                            </Box>
                        ) : (
                            <Box>
                                <CloudUploadIcon sx={{ fontSize: 36, color: c.textMuted, mb: 0.5 }} />
                                <Typography variant="body2" sx={{ fontWeight: 600, color: c.textMuted }}>Click to select file</Typography>
                                <Typography variant="caption" sx={{ color: c.textMuted }}>PDF, JPG, PNG — Max 10MB</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Type & Label */}
                    <FormControl fullWidth sx={{ mb: 2, ...inputSx }}>
                        <InputLabel>Certificate Type</InputLabel>
                        <Select value={uploadForm.certificate_type} label="Certificate Type" onChange={(e) => setUploadForm({ ...uploadForm, certificate_type: e.target.value })} sx={{ borderRadius: '10px' }}>
                            <MenuItem value="participation">🎓 Certificate of Participation</MenuItem>
                            <MenuItem value="presenter">🎤 Certificate of Presenter</MenuItem>
                            <MenuItem value="best_paper">🏆 Best Paper Award</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField fullWidth label="Custom Label (optional)" value={uploadForm.label} onChange={(e) => setUploadForm({ ...uploadForm, label: e.target.value })}
                        placeholder="e.g. Certificate of Participation" sx={inputSx} size="small" />
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}` }}>
                    <Button onClick={() => setUploadDialog({ open: false, submissionId: null, submissionTitle: '' })} disabled={uploading}
                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: c.textMuted }}>Cancel</Button>
                    <Button onClick={handleUpload} variant="contained" disabled={!uploadForm.file || uploading}
                        sx={tealBtn}>{uploading ? 'Uploading...' : 'Upload Certificate'}</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, certId: null, label: '' })} PaperProps={dialogPaper}>
                <DialogTitle sx={{ fontWeight: 700, color: '#dc2626', borderBottom: `1px solid ${c.cardBorder}`, pb: 2 }}>Delete Certificate</DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    <Typography sx={{ color: c.textPrimary, mt: 1 }}>Are you sure you want to delete <strong>{deleteDialog.label}</strong>? This cannot be undone.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}` }}>
                    <Button onClick={() => setDeleteDialog({ open: false, certId: null, label: '' })} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: c.textMuted }}>Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '10px' }}>{snackbar.message}</Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
