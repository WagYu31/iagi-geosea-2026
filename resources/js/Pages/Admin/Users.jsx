import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Select, MenuItem, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, CircularProgress,
    Snackbar, Alert, Avatar, Tooltip, InputAdornment, FormControl, InputLabel,
    useTheme, Grid, Divider, Paper, Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PeopleIcon from '@mui/icons-material/People';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BusinessIcon from '@mui/icons-material/Business';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import RateReviewIcon from '@mui/icons-material/RateReview';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PersonIcon from '@mui/icons-material/Person';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

// High-taste avatar gradient presets (21st.dev inspired)
const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #094d42 0%, #0d9488 100%)', // Emerald Teal
    'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', // Deep Blue
    'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)', // Purple Violet
    'linear-gradient(135deg, #831843 0%, #db2777 100%)', // Rose Pink
    'linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)', // Teal Cyan
    'linear-gradient(135deg, #78350f 0%, #d97706 100%)', // Amber Bronze
    'linear-gradient(135deg, #0f172a 0%, #334155 100%)', // Slate Navy
    'linear-gradient(135deg, #065f46 0%, #10b981 100%)', // Mint Green
];

const getAvatarGradient = (str = '') => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
};

export default function AdminUsers({ users = {}, filters = {}, stats = {} }) {
    const theme = useTheme();
    const c = theme.palette.custom || {
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        surfaceBg: '#f8fafc',
        textPrimary: '#0f172a',
        textMuted: '#64748b',
    };
    const isDark = theme.palette.mode === 'dark';

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
    const [roleDialog, setRoleDialog] = useState({ open: false, user: null, newRole: null });
    const [editDialog, setEditDialog] = useState({ open: false, user: null, name: '', email: '', whatsapp: '', affiliation: '', category: '', password: '', confirmPassword: '', error: '' });
    const [createDialog, setCreateDialog] = useState({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', affiliation: '', whatsapp: '', error: '', showPassword: false, showConfirmPassword: false });
    const [loading, setLoading] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [copiedEmail, setCopiedEmail] = useState(null);

    // Debounced server-side search
    const searchTimer = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            router.get(route('admin.users'), { search: searchTerm || undefined, role: roleFilter !== 'all' ? roleFilter : undefined }, { preserveState: true, preserveScroll: true });
        }, 400);
        return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
    }, [searchTerm, roleFilter]);

    const handleRoleChange = (user, newRole) => {
        const oldRole = user.role || 'Author';
        if (newRole === 'Admin' || (oldRole === 'Admin' && newRole !== 'Admin')) {
            setRoleDialog({ open: true, user, newRole });
        } else {
            updateUserRole(user.id, newRole, user.name);
        }
    };

    const updateUserRole = (userId, newRole, userName) => {
        setLoading(userId);
        router.patch(route('admin.users.updateRole', userId), { role: newRole }, {
            preserveScroll: true, preserveState: false,
            onSuccess: () => { setLoading(null); setSnackbar({ open: true, message: `Berhasil mengubah role ${userName} menjadi ${newRole}`, severity: 'success' }); },
            onError: () => { setLoading(null); setSnackbar({ open: true, message: 'Gagal memperbarui role.', severity: 'error' }); }
        });
    };

    const handleRoleConfirm = () => {
        if (roleDialog.user) { updateUserRole(roleDialog.user.id, roleDialog.newRole, roleDialog.user.name); setRoleDialog({ open: false, user: null, newRole: null }); }
    };
    const handleDeleteClick = (user) => setDeleteDialog({ open: true, user });
    const handleDeleteConfirm = () => {
        if (deleteDialog.user) { router.delete(route('admin.users.delete', deleteDialog.user.id), { preserveScroll: true, onSuccess: () => setDeleteDialog({ open: false, user: null }) }); }
    };
    const handleEditClick = (user) => setEditDialog({ open: true, user, name: user.name || '', email: user.email || '', whatsapp: user.whatsapp || '', affiliation: user.affiliation || '', category: user.category || '', password: '', confirmPassword: '', error: '' });
    
    const handleProfileUpdate = () => {
        const { user, name, email, whatsapp, affiliation, category, password, confirmPassword } = editDialog;
        if (!name || !email) { setEditDialog({ ...editDialog, error: 'Nama dan email wajib diisi' }); return; }
        if (user?.role === 'Admin' && !whatsapp?.trim()) { setEditDialog({ ...editDialog, error: 'Nomor WhatsApp / Telepon wajib diisi untuk akun Admin (untuk OTP 2FA).' }); return; }
        if (password && password.length < 8) { setEditDialog({ ...editDialog, error: 'Password minimal 8 karakter' }); return; }
        if (password && password !== confirmPassword) { setEditDialog({ ...editDialog, error: 'Konfirmasi password tidak cocok' }); return; }
        setLoading(user.id);
        router.patch(route('admin.users.updateProfile', user.id), { name, email, whatsapp: whatsapp || null, affiliation: affiliation || null, category: category || null, password: password || null }, {
            preserveScroll: true,
            onSuccess: () => { setLoading(null); setEditDialog({ open: false, user: null, name: '', email: '', whatsapp: '', affiliation: '', category: '', password: '', confirmPassword: '', error: '' }); setSnackbar({ open: true, message: `Profil ${name} berhasil diperbarui`, severity: 'success' }); },
            onError: (errors) => { setLoading(null); setEditDialog({ ...editDialog, error: errors.email || errors.whatsapp || errors.name || errors.password || 'Gagal memperbarui profil.' }); }
        });
    };

    const handleCreateUser = () => {
        const { name, email, password, confirmPassword, role, affiliation, whatsapp } = createDialog;
        if (!name || !email || !password || !confirmPassword || !role) { setCreateDialog({ ...createDialog, error: 'Semua field wajib diisi' }); return; }
        if (role === 'Admin' && !whatsapp?.trim()) { setCreateDialog({ ...createDialog, error: 'Nomor WhatsApp / Telepon wajib diisi khusus akun Admin (untuk OTP 2FA).' }); return; }
        if (role === 'Reviewer' && !affiliation?.trim()) { setCreateDialog({ ...createDialog, error: 'Afiliasi/Institusi wajib diisi untuk akun Reviewer' }); return; }
        if (password.length < 8) { setCreateDialog({ ...createDialog, error: 'Password minimal 8 karakter' }); return; }
        if (password !== confirmPassword) { setCreateDialog({ ...createDialog, error: 'Konfirmasi password tidak cocok' }); return; }
        setLoading('creating');
        router.post(route('admin.users.create'), { name, email, password, role, affiliation, whatsapp: whatsapp || null }, {
            preserveScroll: true,
            onSuccess: () => { setLoading(null); setCreateDialog({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', affiliation: '', whatsapp: '', error: '', showPassword: false, showConfirmPassword: false }); setSnackbar({ open: true, message: `Pengguna ${name} berhasil dibuat`, severity: 'success' }); },
            onError: (errors) => { setLoading(null); setCreateDialog({ ...createDialog, error: errors.email || errors.whatsapp || errors.affiliation || errors.password || 'Gagal membuat pengguna baru.' }); }
        });
    };

    const handleToggleVerification = (user) => {
        const newStatus = !user.email_verified_at;
        setLoading(user.id);
        router.patch(route('admin.users.toggleVerification', user.id), { verify: newStatus }, {
            preserveScroll: true,
            onSuccess: () => { setLoading(null); setSnackbar({ open: true, message: `Status akun ${user.name} diubah menjadi ${newStatus ? 'Terverifikasi' : 'Belum Terverifikasi'}`, severity: 'success' }); },
            onError: () => { setLoading(null); setSnackbar({ open: true, message: 'Gagal mengubah status verifikasi.', severity: 'error' }); }
        });
    };

    const handleCopyEmail = (email) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    const usersData = users.data || [];
    const totalUsers = users.total || 0;
    const currentPage = users.current_page || 1;
    const lastPage = users.last_page || 1;
    const filteredUsers = usersData;

    // Real-time statistics from backend
    const safeStats = {
        total: stats.total !== undefined ? stats.total : totalUsers,
        verified: stats.verified !== undefined ? stats.verified : 0,
        unverified: stats.unverified !== undefined ? stats.unverified : 0,
        admins: stats.admins !== undefined ? stats.admins : 0,
        authors: stats.authors !== undefined ? stats.authors : 0,
        juris: (stats.juris || 0) + (stats.reviewers || 0),
        scanners: stats.scanners !== undefined ? stats.scanners : 0,
    };

    const verifiedPercent = safeStats.total > 0 ? Math.round((safeStats.verified / safeStats.total) * 100) : 0;

    const cellSx = { 
        borderBottom: `1px solid ${c.cardBorder}`, 
        py: 1.6, 
        px: 2, 
        fontSize: '0.825rem', 
        color: c.textPrimary,
        verticalAlign: 'middle'
    };
    
    const headCellSx = { 
        ...cellSx, 
        fontWeight: 800, 
        fontSize: '0.70rem', 
        textTransform: 'uppercase', 
        letterSpacing: '0.06em', 
        color: '#64748b', 
        bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
        borderBottom: `2px solid ${c.cardBorder}`,
        py: 1.4
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'Admin':
                return { 
                    bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', 
                    color: '#dc2626', 
                    border: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca',
                    icon: <AdminPanelSettingsIcon sx={{ fontSize: 13 }} /> 
                };
            case 'Reviewer':
                return { 
                    bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb', 
                    color: '#d97706', 
                    border: isDark ? 'rgba(245, 158, 11, 0.3)' : '#fde68a',
                    icon: <RateReviewIcon sx={{ fontSize: 13 }} /> 
                };
            case 'Juri':
                return { 
                    bg: isDark ? 'rgba(234, 88, 12, 0.15)' : '#fff7ed', 
                    color: '#ea580c', 
                    border: isDark ? 'rgba(234, 88, 12, 0.3)' : '#fed7aa',
                    icon: <CheckCircleIcon sx={{ fontSize: 13 }} /> 
                };
            case 'Scanner':
            case 'Scaner':
                return { 
                    bg: isDark ? 'rgba(6, 182, 212, 0.15)' : '#ecfeff', 
                    color: '#0891b2', 
                    border: isDark ? 'rgba(6, 182, 212, 0.3)' : '#a5f3fc',
                    icon: <QrCodeScannerIcon sx={{ fontSize: 13 }} /> 
                };
            default: // Author
                return { 
                    bg: isDark ? 'rgba(100, 116, 139, 0.12)' : '#f1f5f9', 
                    color: '#475569', 
                    border: isDark ? 'rgba(100, 116, 139, 0.25)' : '#cbd5e1',
                    icon: <PersonIcon sx={{ fontSize: 13 }} /> 
                };
        }
    };

    const dialogPaper = { 
        sx: { 
            borderRadius: '20px', 
            bgcolor: c.cardBg, 
            border: `1px solid ${c.cardBorder}`,
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
            overflow: 'hidden'
        } 
    };

    const inputSx = { 
        '& .MuiOutlinedInput-root': { 
            borderRadius: '12px', 
            bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#ffffff',
            '& fieldset': { borderColor: c.cardBorder }, 
            '&:hover fieldset': { borderColor: '#0d9488' }, 
            '&.Mui-focused fieldset': { borderColor: '#0d9488', borderWidth: '1.5px' } 
        } 
    };

    const primaryActionBtn = { 
        background: 'linear-gradient(135deg, #094d42 0%, #0d9488 100%)', 
        '&:hover': { background: 'linear-gradient(135deg, #063d34 0%, #094d42 100%)', transform: 'translateY(-1px)' }, 
        borderRadius: '12px', 
        textTransform: 'none', 
        fontWeight: 800, 
        px: 2.8, 
        py: 1, 
        boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    const quickRoles = [
        { key: 'all', label: 'Semua User', count: safeStats.total },
        { key: 'Author', label: 'Author', count: safeStats.authors },
        { key: 'Admin', label: 'Admin', count: safeStats.admins },
        { key: 'Juri', label: 'Juri / Reviewer', count: safeStats.juris },
        { key: 'Scanner', label: 'Scanner Gate', count: safeStats.scanners },
    ];

    return (
        <SidebarLayout>
            <Head title="User Management — IAGI & GEOSEA 2026" />
            
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 }, minHeight: '100vh', bgcolor: c.surfaceBg }}>
                
                {/* 1. TOP HEADER (21st.dev Style) */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', md: 'center' }, 
                    mb: 3, 
                    gap: 2 
                }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ 
                                width: 44, 
                                height: 44, 
                                borderRadius: '14px', 
                                background: 'linear-gradient(135deg, #094d42 0%, #0d9488 100%)', 
                                color: '#ffffff', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)'
                            }}>
                                <PeopleIcon sx={{ fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: c.textPrimary, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                                        User Management
                                    </Typography>
                                    <Chip 
                                        label="Live Database" 
                                        size="small" 
                                        sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 800, fontSize: '0.68rem', height: 20, border: '1px solid #a7f3d0' }} 
                                    />
                                </Box>
                                <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.78rem', display: 'block', mt: 0.3 }}>
                                    Kelola hak akses, status verifikasi akun, dan profil pengguna konferensi
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<DownloadIcon sx={{ fontSize: 18 }} />} 
                            onClick={() => window.location.href = route('admin.users.export')} 
                            sx={{ 
                                borderColor: c.cardBorder, 
                                color: c.textPrimary, 
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                                px: 2.2, 
                                py: 1, 
                                borderRadius: '12px', 
                                textTransform: 'none', 
                                fontWeight: 700, 
                                fontSize: '0.82rem', 
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                '&:hover': { borderColor: '#0d9488', bgcolor: isDark ? 'rgba(13,148,136,0.1)' : '#f0fdf4', color: '#094d42' }, 
                                transition: 'all 0.2s ease' 
                            }}
                        >
                            Export Excel
                        </Button>
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon sx={{ fontSize: 19 }} />} 
                            onClick={() => setCreateDialog({ open: true, name: '', email: '', password: '', confirmPassword: '', role: 'Author', affiliation: '', whatsapp: '', error: '', showPassword: false, showConfirmPassword: false })} 
                            sx={primaryActionBtn}
                        >
                            Tambah Pengguna
                        </Button>
                    </Box>
                </Box>

                {/* 2. STATS KPI OVERVIEW CARDS (21st.dev & tasteskill.dev Inspired) */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {/* Card 1: Total Users */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.2, 
                            borderRadius: '16px', 
                            border: `1px solid ${c.cardBorder}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.02)',
                            transition: 'all 0.25s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Total Pengguna
                                </Typography>
                                <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <PeopleIcon sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: c.textPrimary, letterSpacing: '-0.02em', mb: 0.5 }}>
                                {safeStats.total.toLocaleString('id-ID')}
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.72rem' }}>
                                Terdaftar di sistem IAGI & GEOSEA
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Card 2: Verified Users */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.2, 
                            borderRadius: '16px', 
                            border: `1px solid ${c.cardBorder}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.02)',
                            transition: 'all 0.25s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Terverifikasi
                                </Typography>
                                <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <VerifiedUserIcon sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46', letterSpacing: '-0.02em', mb: 0.5 }}>
                                {safeStats.verified.toLocaleString('id-ID')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <Box sx={{ flex: 1, height: 4, bgcolor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                                    <Box sx={{ width: `${verifiedPercent}%`, height: '100%', bgcolor: '#10b981', borderRadius: 2 }} />
                                </Box>
                                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800, fontSize: '0.72rem' }}>
                                    {verifiedPercent}%
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Card 3: Unverified Users */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.2, 
                            borderRadius: '16px', 
                            border: `1px solid ${c.cardBorder}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.02)',
                            transition: 'all 0.25s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Belum Verifikasi
                                </Typography>
                                <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <WarningAmberIcon sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#92400e', letterSpacing: '-0.02em', mb: 0.5 }}>
                                {safeStats.unverified.toLocaleString('id-ID')}
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.72rem' }}>
                                Email belum dikonfirmasi oleh user
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Card 4: Role Distribution */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={0} sx={{ 
                            p: 2.2, 
                            borderRadius: '16px', 
                            border: `1px solid ${c.cardBorder}`, 
                            bgcolor: c.cardBg,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.02)',
                            transition: 'all 0.25s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.06)' }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.70rem' }}>
                                    Struktur Akses
                                </Typography>
                                <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#5b21b6', letterSpacing: '-0.02em', mb: 0.5 }}>
                                {safeStats.admins} <Typography component="span" sx={{ fontSize: '0.82rem', fontWeight: 700, color: c.textMuted }}>Admin</Typography>
                            </Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.72rem' }}>
                                {safeStats.authors} Authors &bull; {safeStats.juris} Juri/Reviewer
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* 3. MODERN TOOLBAR & QUICK FILTER PILLS (Linear / 21st.dev Style) */}
                <Paper elevation={0} sx={{ 
                    p: 2, 
                    borderRadius: '16px', 
                    border: `1px solid ${c.cardBorder}`, 
                    bgcolor: c.cardBg, 
                    mb: 2.5,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}>
                        {/* Search Input */}
                        <TextField 
                            placeholder="Cari nama, email, afiliasi, atau instansi..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            size="small"
                            InputProps={{ 
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm ? (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: '#94a3b8' }}>
                                            <CloseIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            }}
                            sx={{ 
                                flex: 1, 
                                maxWidth: { xs: '100%', md: 400 },
                                ...inputSx, 
                                '& input': { fontSize: '0.85rem', fontWeight: 600 } 
                            }}
                        />

                        {/* Quick Role Segmented Chips */}
                        <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.72rem', display: { xs: 'none', lg: 'inline-block' }, mr: 0.5 }}>
                                Role:
                            </Typography>
                            {quickRoles.map(r => {
                                const isActive = roleFilter === r.key;
                                return (
                                    <Button
                                        key={r.key}
                                        size="small"
                                        onClick={() => setRoleFilter(r.key)}
                                        sx={{
                                            py: 0.5,
                                            px: 1.4,
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            fontSize: '0.76rem',
                                            fontWeight: isActive ? 800 : 600,
                                            bgcolor: isActive 
                                                ? (isDark ? 'rgba(13, 148, 136, 0.25)' : '#094d42') 
                                                : (isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'),
                                            color: isActive ? '#ffffff' : c.textMuted,
                                            border: '1px solid',
                                            borderColor: isActive ? '#094d42' : 'transparent',
                                            boxShadow: isActive ? '0 2px 6px rgba(9, 77, 66, 0.2)' : 'none',
                                            '&:hover': {
                                                bgcolor: isActive ? '#094d42' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                                                color: isActive ? '#ffffff' : c.textPrimary
                                            },
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        {r.label}
                                        {r.count !== undefined && (
                                            <Box 
                                                component="span" 
                                                sx={{ 
                                                    ml: 0.8, 
                                                    px: 0.8, 
                                                    py: 0.1, 
                                                    borderRadius: '6px', 
                                                    fontSize: '0.66rem',
                                                    bgcolor: isActive ? 'rgba(255,255,255,0.2)' : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'),
                                                    color: isActive ? '#ffffff' : '#64748b'
                                                }}
                                            >
                                                {r.count}
                                            </Box>
                                        )}
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>
                </Paper>

                {/* 4. USERS TABLE CARD (tasteskill.dev High Taste UI) */}
                <Card elevation={0} sx={{ 
                    borderRadius: '18px', 
                    border: `1px solid ${c.cardBorder}`, 
                    bgcolor: c.cardBg, 
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -2px rgba(0,0,0,0.02)'
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        px: 2.8, 
                        py: 2, 
                        borderBottom: `1px solid ${c.cardBorder}`,
                        bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#ffffff'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Typography sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.94rem' }}>
                                Daftar Pengguna Terdaftar
                            </Typography>
                            <Chip 
                                label={`${totalUsers} Total`} 
                                size="small" 
                                sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 800, fontSize: '0.70rem', height: 22 }} 
                            />
                        </Box>

                        {(searchTerm || roleFilter !== 'all') && (
                            <Button 
                                size="small" 
                                onClick={() => { setSearchTerm(''); setRoleFilter('all'); }}
                                startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
                                sx={{ textTransform: 'none', fontSize: '0.74rem', color: '#0d9488', fontWeight: 700 }}
                            >
                                Reset Filter
                            </Button>
                        )}
                    </Box>

                    <TableContainer sx={{ overflowX: 'auto' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ ...headCellSx, width: 260 }}>User & Identitas</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: 220 }}>Kontak & WhatsApp</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: 200 }}>Afiliasi / Instansi</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: 140 }}>Kategori</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: 130 }}>Hak Akses (Role)</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: 130 }}>Status Akun</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: 120 }}>Terdaftar</TableCell>
                                    <TableCell sx={{ ...headCellSx, width: 90, textAlign: 'center' }}>Aksi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                                                    <PersonOffIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
                                                </Box>
                                                <Typography sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.95rem', mb: 0.5 }}>
                                                    Tidak ada pengguna ditemukan
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: c.textMuted, maxWidth: 360, textAlign: 'center', mb: 2 }}>
                                                    Kriteria pencarian atau filter yang Anda pilih tidak cocok dengan data pengguna manapun.
                                                </Typography>
                                                <Button 
                                                    size="small" 
                                                    variant="outlined" 
                                                    onClick={() => { setSearchTerm(''); setRoleFilter('all'); }}
                                                    sx={{ textTransform: 'none', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700 }}
                                                >
                                                    Hapus Filter
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => {
                                        const rb = getRoleBadge(user.role || 'Author');
                                        const avatarGrad = getAvatarGradient(user.name || user.email || 'User');
                                        const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();

                                        return (
                                            <TableRow 
                                                key={user.id} 
                                                hover 
                                                sx={{ 
                                                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' },
                                                    transition: 'background-color 0.15s ease'
                                                }}
                                            >
                                                {/* USER & IDENTITAS */}
                                                <TableCell sx={cellSx}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar 
                                                            sx={{ 
                                                                width: 38, 
                                                                height: 38, 
                                                                background: avatarGrad, 
                                                                fontSize: '0.88rem', 
                                                                fontWeight: 800,
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                                                border: '1.5px solid #ffffff'
                                                            }}
                                                        >
                                                            {initial}
                                                        </Avatar>
                                                        <Box sx={{ minWidth: 0 }}>
                                                            <Typography sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '0.86rem', lineHeight: 1.25 }}>
                                                                {user.name}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 0.3 }}>
                                                                <Typography sx={{ fontSize: '0.76rem', color: c.textMuted, fontFamily: 'monospace' }}>
                                                                    {user.email}
                                                                </Typography>
                                                                <Tooltip title={copiedEmail === user.email ? "Disalin!" : "Salin Email"}>
                                                                    <IconButton 
                                                                        size="small" 
                                                                        onClick={() => handleCopyEmail(user.email)}
                                                                        sx={{ p: 0.2, color: copiedEmail === user.email ? '#10b981' : '#94a3b8' }}
                                                                    >
                                                                        {copiedEmail === user.email ? <CheckIcon sx={{ fontSize: 13 }} /> : <ContentCopyIcon sx={{ fontSize: 13 }} />}
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                {/* KONTAK & WHATSAPP */}
                                                <TableCell sx={cellSx}>
                                                    {user.whatsapp ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                            <Box 
                                                                component="a" 
                                                                href={`https://wa.me/${user.whatsapp.replace(/[^0-9]/g, '')}`} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                sx={{ 
                                                                    display: 'inline-flex', 
                                                                    alignItems: 'center', 
                                                                    gap: 0.6, 
                                                                    textDecoration: 'none',
                                                                    p: '4px 8px',
                                                                    borderRadius: '8px',
                                                                    bgcolor: isDark ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4',
                                                                    border: '1px solid #bbf7d0',
                                                                    '&:hover': { bgcolor: '#dcfce7' },
                                                                    transition: 'all 0.15s ease'
                                                                }}
                                                            >
                                                                <WhatsAppIcon sx={{ fontSize: 15, color: '#16a34a' }} />
                                                                <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, color: '#166534', fontFamily: 'monospace' }}>
                                                                    {user.whatsapp}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                                            Tidak tertera
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* AFILIASI / INSTANSI */}
                                                <TableCell sx={{ ...cellSx, maxWidth: 200 }}>
                                                    {user.affiliation ? (
                                                        <Tooltip title={user.affiliation}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                                <BusinessIcon sx={{ fontSize: 16, color: '#94a3b8', flexShrink: 0 }} />
                                                                <Typography sx={{ fontSize: '0.80rem', color: c.textPrimary, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {user.affiliation}
                                                                </Typography>
                                                            </Box>
                                                        </Tooltip>
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>—</Typography>
                                                    )}
                                                </TableCell>

                                                {/* KATEGORI */}
                                                <TableCell sx={cellSx}>
                                                    {user.category ? (
                                                        <Chip 
                                                            label={user.category === 'International Delegate' ? 'Non-IAGI Member' : user.category} 
                                                            size="small" 
                                                            sx={{
                                                                bgcolor: user.category === 'Student' 
                                                                    ? (isDark ? 'rgba(59,130,246,0.15)' : '#eff6ff') 
                                                                    : user.category === 'Professional' 
                                                                        ? (isDark ? 'rgba(147,51,234,0.15)' : '#f5f3ff') 
                                                                        : (isDark ? 'rgba(234,88,12,0.15)' : '#fff7ed'),
                                                                color: user.category === 'Student' ? '#1d4ed8' : user.category === 'Professional' ? '#6d28d9' : '#ea580c',
                                                                border: '1px solid',
                                                                borderColor: user.category === 'Student' ? '#bfdbfe' : user.category === 'Professional' ? '#ddd6fe' : '#fed7aa',
                                                                fontWeight: 700, 
                                                                fontSize: '0.68rem', 
                                                                borderRadius: '8px', 
                                                                height: 24,
                                                            }} 
                                                        />
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>—</Typography>
                                                    )}
                                                </TableCell>

                                                {/* ROLE ACCESS */}
                                                <TableCell sx={cellSx}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Select 
                                                            value={user.role || 'Author'} 
                                                            onChange={(e) => handleRoleChange(user, e.target.value)} 
                                                            size="small" 
                                                            disabled={loading === user.id}
                                                            sx={{ 
                                                                minWidth: 105, 
                                                                height: 28,
                                                                borderRadius: '8px', 
                                                                fontSize: '0.75rem', 
                                                                fontWeight: 800, 
                                                                bgcolor: rb.bg, 
                                                                color: rb.color, 
                                                                border: `1px solid ${rb.border}`,
                                                                '& .MuiSelect-select': { py: 0.4, px: 1, display: 'flex', alignItems: 'center', gap: 0.5 }, 
                                                                '& fieldset': { border: 'none' }, 
                                                                '&:hover': { opacity: 0.9 } 
                                                            }}
                                                        >
                                                            <MenuItem value="Author" sx={{ fontSize: '0.80rem', fontWeight: 600 }}>Author</MenuItem>
                                                            <MenuItem value="Reviewer" sx={{ fontSize: '0.80rem', fontWeight: 600 }}>Reviewer</MenuItem>
                                                            <MenuItem value="Juri" sx={{ fontSize: '0.80rem', fontWeight: 600 }}>Juri</MenuItem>
                                                            <MenuItem value="Scanner" sx={{ fontSize: '0.80rem', fontWeight: 600 }}>Scanner Gate</MenuItem>
                                                            <MenuItem value="Admin" sx={{ fontSize: '0.80rem', fontWeight: 800, color: '#dc2626' }}>👑 Admin</MenuItem>
                                                        </Select>
                                                        {loading === user.id && <CircularProgress size={16} sx={{ color: '#0d9488' }} />}
                                                    </Box>
                                                </TableCell>

                                                {/* ACCOUNT STATUS (21st.dev Pulse Dot) */}
                                                <TableCell sx={cellSx}>
                                                    <Tooltip title="Klik untuk beralih status verifikasi akun">
                                                        <Box
                                                            onClick={() => handleToggleVerification(user)}
                                                            sx={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: 0.8,
                                                                px: 1.2,
                                                                py: 0.4,
                                                                borderRadius: '9999px',
                                                                fontSize: '0.72rem',
                                                                fontWeight: 800,
                                                                cursor: 'pointer',
                                                                transition: 'all 0.18s ease',
                                                                border: '1px solid',
                                                                bgcolor: user.email_verified_at 
                                                                    ? (isDark ? 'rgba(16, 185, 129, 0.12)' : '#ecfdf5')
                                                                    : (isDark ? 'rgba(245, 158, 11, 0.12)' : '#fffbeb'),
                                                                color: user.email_verified_at ? '#059669' : '#d97706',
                                                                borderColor: user.email_verified_at ? '#a7f3d0' : '#fde68a',
                                                                '&:hover': {
                                                                    transform: 'translateY(-1px)',
                                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                                                                }
                                                            }}
                                                        >
                                                            <Box 
                                                                sx={{
                                                                    width: 7,
                                                                    height: 7,
                                                                    borderRadius: '50%',
                                                                    bgcolor: user.email_verified_at ? '#10b981' : '#f59e0b',
                                                                    boxShadow: user.email_verified_at 
                                                                        ? '0 0 0 2px rgba(16, 185, 129, 0.25)' 
                                                                        : '0 0 0 2px rgba(245, 158, 11, 0.25)',
                                                                }}
                                                            />
                                                            {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                        </Box>
                                                    </Tooltip>
                                                </TableCell>

                                                {/* TERDAFTAR */}
                                                <TableCell sx={cellSx}>
                                                    <Typography sx={{ fontSize: '0.78rem', color: c.textPrimary, fontWeight: 600 }}>
                                                        {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.68rem', color: c.textMuted }}>
                                                        {new Date(user.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                    </Typography>
                                                </TableCell>

                                                {/* AKSI */}
                                                <TableCell sx={{ ...cellSx, textAlign: 'center' }}>
                                                    <Box sx={{ display: 'flex', gap: 0.6, justifyContent: 'center' }}>
                                                        <Tooltip title="Edit Profil Pengguna">
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleEditClick(user)} 
                                                                sx={{ 
                                                                    color: '#0d9488', 
                                                                    bgcolor: isDark ? 'rgba(13,148,136,0.1)' : '#f0fdf4',
                                                                    border: '1px solid #bbf7d0',
                                                                    '&:hover': { bgcolor: '#dcfce7', transform: 'scale(1.05)' },
                                                                    transition: 'all 0.15s ease'
                                                                }}
                                                            >
                                                                <EditIcon sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Hapus Akun Pengguna">
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleDeleteClick(user)} 
                                                                sx={{ 
                                                                    color: '#dc2626', 
                                                                    bgcolor: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2',
                                                                    border: '1px solid #fecaca',
                                                                    '&:hover': { bgcolor: '#fee2e2', transform: 'scale(1.05)' },
                                                                    transition: 'all 0.15s ease'
                                                                }}
                                                            >
                                                                <DeleteIcon sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* PAGINATION CONTROLS */}
                    {lastPage > 1 && (
                        <Box sx={{
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            px: 2.8, 
                            py: 1.8,
                            borderTop: `1px solid ${c.cardBorder}`,
                            bgcolor: isDark ? 'rgba(0,0,0,0.08)' : '#fafafa',
                            gap: 1.5
                        }}>
                            <Typography variant="body2" sx={{ color: c.textMuted, fontSize: '0.78rem', fontWeight: 600 }}>
                                Menampilkan <strong>{((currentPage - 1) * 25) + 1}–{Math.min(currentPage * 25, totalUsers)}</strong> dari <strong>{totalUsers}</strong> pengguna
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                {currentPage > 1 && (
                                    <Button 
                                        size="small" 
                                        component="a" 
                                        href={`?page=${currentPage - 1}`}
                                        onClick={(e) => { e.preventDefault(); router.get(route('admin.users'), { page: currentPage - 1, search: searchTerm || undefined, role: roleFilter !== 'all' ? roleFilter : undefined }, { preserveState: true }); }}
                                        sx={{ minWidth: 36, borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', color: c.textMuted, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}
                                    >
                                        ‹ Prev
                                    </Button>
                                )}

                                {Array.from({ length: Math.min(lastPage, 7) }, (_, i) => {
                                    let page;
                                    if (lastPage <= 7) page = i + 1;
                                    else if (currentPage <= 4) page = i + 1;
                                    else if (currentPage >= lastPage - 3) page = lastPage - 6 + i;
                                    else page = currentPage - 3 + i;
                                    
                                    const isCurrent = page === currentPage;
                                    return (
                                        <Button 
                                            key={page} 
                                            size="small"
                                            onClick={() => router.get(route('admin.users'), { page, search: searchTerm || undefined, role: roleFilter !== 'all' ? roleFilter : undefined }, { preserveState: true })}
                                            sx={{
                                                minWidth: 32, 
                                                height: 32, 
                                                borderRadius: '8px',
                                                fontWeight: isCurrent ? 900 : 700, 
                                                fontSize: '0.76rem',
                                                background: isCurrent ? 'linear-gradient(135deg, #094d42 0%, #0d9488 100%)' : '#ffffff',
                                                color: isCurrent ? '#ffffff' : '#64748b',
                                                border: '1px solid',
                                                borderColor: isCurrent ? '#094d42' : '#e2e8f0',
                                                boxShadow: isCurrent ? '0 2px 6px rgba(13,148,136,0.3)' : 'none',
                                                '&:hover': { bgcolor: isCurrent ? '#094d42' : '#f1f5f9' },
                                            }}
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}

                                {currentPage < lastPage && (
                                    <Button 
                                        size="small"
                                        onClick={() => router.get(route('admin.users'), { page: currentPage + 1, search: searchTerm || undefined, role: roleFilter !== 'all' ? roleFilter : undefined }, { preserveState: true })}
                                        sx={{ minWidth: 36, borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', color: c.textMuted, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}
                                    >
                                        Next ›
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}
                </Card>
            </Box>

            {/* 5. DIALOGS */}

            {/* ROLE CONFIRM DIALOG */}
            <Dialog open={roleDialog.open} onClose={() => setRoleDialog({ open: false, user: null, newRole: null })} maxWidth="sm" fullWidth PaperProps={dialogPaper}>
                <DialogTitle sx={{ fontWeight: 900, color: '#dc2626', borderBottom: `1px solid ${c.cardBorder}`, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon sx={{ fontSize: 24, color: '#dc2626' }} />
                    Konfirmasi Perubahan Hak Akses Kritis
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    <Box sx={{ p: 2, bgcolor: isDark ? 'rgba(245,158,11,0.08)' : '#fff7ed', borderRadius: '12px', border: `1px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#fed7aa'}`, mb: 2, mt: 1 }}>
                        <Typography variant="body2" sx={{ color: c.textPrimary, mb: 0.5 }}><strong>Pengguna:</strong> {roleDialog.user?.name}</Typography>
                        <Typography variant="body2" sx={{ color: c.textPrimary, mb: 0.5 }}><strong>Role Sekarang:</strong> {roleDialog.user?.role || 'Author'}</Typography>
                        <Typography variant="body2" sx={{ color: c.textPrimary }}><strong>Role Baru:</strong> <span style={{ color: '#dc2626', fontWeight: 800 }}>{roleDialog.newRole}</span></Typography>
                    </Box>
                    <Alert severity="warning" sx={{ borderRadius: '12px', mb: 2, fontSize: '0.82rem' }}>
                        {roleDialog.newRole === 'Admin' 
                            ? <><strong>Perhatian:</strong> Pengguna ini akan mendapatkan akses penuh Administrator (termasuk kelola data rahasia dan verifikasi tiket/pembayaran).</> 
                            : <><strong>Perhatian:</strong> Hak akses administrator pengguna ini akan dicabut.</>}
                    </Alert>
                    {roleDialog.newRole === 'Admin' && !roleDialog.user?.whatsapp && (
                        <Alert severity="info" sx={{ borderRadius: '12px', mb: 2, fontSize: '0.80rem' }}>
                            <strong>Catatan OTP 2FA:</strong> Akun ini belum memiliki nomor WhatsApp/Telepon. Segera isi nomor WhatsApp setelah promosi role agar dapat login verifikasi OTP 2FA.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}`, bgcolor: '#f8fafc' }}>
                    <Button onClick={() => setRoleDialog({ open: false, user: null, newRole: null })} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, color: c.textMuted }}>
                        Batal
                    </Button>
                    <Button onClick={handleRoleConfirm} variant="contained" sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' }, borderRadius: '10px', textTransform: 'none', fontWeight: 800 }}>
                        Ya, Ubah Role
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DELETE USER DIALOG */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })} PaperProps={dialogPaper}>
                <DialogTitle sx={{ fontWeight: 900, color: '#dc2626', borderBottom: `1px solid ${c.cardBorder}`, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeleteIcon sx={{ fontSize: 24, color: '#dc2626' }} />
                    Hapus Akun Pengguna
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    <Typography sx={{ color: c.textPrimary, mt: 1, fontSize: '0.90rem' }}>
                        Apakah Anda yakin ingin menghapus akun pengguna <strong>{deleteDialog.user?.name}</strong>? Tindakan ini permanen dan tidak dapat dibatalkan.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}`, bgcolor: '#f8fafc' }}>
                    <Button onClick={() => setDeleteDialog({ open: false, user: null })} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, color: c.textMuted }}>
                        Batal
                    </Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' }, borderRadius: '10px', textTransform: 'none', fontWeight: 800 }}>
                        Hapus Akun
                    </Button>
                </DialogActions>
            </Dialog>

            {/* EDIT PROFILE DIALOG */}
            <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, user: null, name: '', email: '', whatsapp: '', affiliation: '', category: '', password: '', confirmPassword: '', error: '' })} maxWidth="sm" fullWidth PaperProps={dialogPaper}>
                <DialogTitle sx={{ fontWeight: 800, color: c.textPrimary, borderBottom: `1px solid ${c.cardBorder}`, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: '#ecfdf5', width: 42, height: 42, borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                            <EditIcon sx={{ color: '#094d42', fontSize: 22 }} />
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a' }}>Edit Profil Pengguna</Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted }}>{editDialog.user?.email}</Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    {editDialog.error && <Alert severity="error" sx={{ borderRadius: '12px', mb: 2, mt: 1, fontSize: '0.82rem' }}>{editDialog.error}</Alert>}
                    
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField 
                            fullWidth 
                            label="Nama Lengkap" 
                            value={editDialog.name} 
                            onChange={(e) => setEditDialog({ ...editDialog, name: e.target.value, error: '' })} 
                            size="small"
                            sx={inputSx} 
                            required 
                        />
                        <TextField
                            fullWidth
                            label={editDialog.user?.role === 'Admin' ? 'Nomor WhatsApp / Telepon * (Wajib untuk Admin OTP)' : 'Nomor WhatsApp / Telepon'}
                            value={editDialog.whatsapp}
                            onChange={(e) => setEditDialog({ ...editDialog, whatsapp: e.target.value, error: '' })}
                            size="small"
                            sx={inputSx}
                            placeholder="cth: 081234567890"
                            required={editDialog.user?.role === 'Admin'}
                            helperText={editDialog.user?.role === 'Admin' ? 'Wajib untuk Admin: nomor ini digunakan untuk verifikasi login OTP 2FA.' : 'Nomor WhatsApp aktif'}
                        />
                        <TextField 
                            fullWidth 
                            label="Afiliasi / Instansi / Kampus" 
                            value={editDialog.affiliation} 
                            onChange={(e) => setEditDialog({ ...editDialog, affiliation: e.target.value })} 
                            size="small"
                            sx={inputSx} 
                        />
                        <FormControl fullWidth size="small" sx={inputSx}>
                            <InputLabel>Kategori Kepesertaan</InputLabel>
                            <Select value={editDialog.category} label="Kategori Kepesertaan" onChange={(e) => setEditDialog({ ...editDialog, category: e.target.value })} sx={{ borderRadius: '12px' }}>
                                <MenuItem value=""><em>None / Default</em></MenuItem>
                                <MenuItem value="Student">Student</MenuItem>
                                <MenuItem value="Professional">Professional</MenuItem>
                                <MenuItem value="International Delegate">Professional and Non-IAGI member</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ borderTop: `1px solid ${c.cardBorder}`, pt: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: c.textPrimary, mb: 1.5, fontSize: '0.82rem' }}>
                                Ganti Password (Opsional)
                            </Typography>
                            <TextField 
                                fullWidth 
                                label="Password Baru" 
                                type="password" 
                                value={editDialog.password} 
                                onChange={(e) => setEditDialog({ ...editDialog, password: e.target.value, error: '' })} 
                                size="small"
                                sx={{ mb: 1.5, ...inputSx }} 
                                helperText="Kosongkan jika tidak ingin mengubah password. Minimal 8 karakter." 
                            />
                            <TextField 
                                fullWidth 
                                label="Konfirmasi Password Baru" 
                                type="password" 
                                value={editDialog.confirmPassword} 
                                onChange={(e) => setEditDialog({ ...editDialog, confirmPassword: e.target.value, error: '' })} 
                                size="small"
                                sx={inputSx} 
                            />
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}`, bgcolor: '#f8fafc' }}>
                    <Button onClick={() => setEditDialog({ open: false, user: null, name: '', email: '', whatsapp: '', affiliation: '', category: '', password: '', confirmPassword: '', error: '' })} disabled={loading === editDialog.user?.id} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, color: c.textMuted }}>
                        Batal
                    </Button>
                    <Button onClick={handleProfileUpdate} variant="contained" disabled={loading === editDialog.user?.id} sx={primaryActionBtn}>
                        {loading === editDialog.user?.id ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* CREATE USER DIALOG */}
            <Dialog open={createDialog.open} onClose={() => setCreateDialog({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', affiliation: '', whatsapp: '', error: '', showPassword: false, showConfirmPassword: false })} maxWidth="sm" fullWidth PaperProps={dialogPaper}>
                <DialogTitle sx={{ fontWeight: 800, color: c.textPrimary, borderBottom: `1px solid ${c.cardBorder}`, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: '#ecfdf5', width: 42, height: 42, borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                            <AddIcon sx={{ color: '#094d42', fontSize: 24 }} />
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a' }}>Buat Pengguna Baru</Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted }}>Tambahkan akun Author, Reviewer, Juri, Scanner, atau Admin</Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    {createDialog.error && <Alert severity="error" sx={{ borderRadius: '12px', mb: 2, mt: 1, fontSize: '0.82rem' }}>{createDialog.error}</Alert>}
                    
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField 
                            fullWidth 
                            label="Nama Lengkap *" 
                            value={createDialog.name} 
                            onChange={(e) => setCreateDialog({ ...createDialog, name: e.target.value, error: '' })} 
                            size="small"
                            sx={inputSx} 
                            required 
                            placeholder="cth: Dr. Ir. Budi Santoso"
                        />
                        <TextField 
                            fullWidth 
                            label="Email *" 
                            type="email" 
                            value={createDialog.email} 
                            onChange={(e) => setCreateDialog({ ...createDialog, email: e.target.value, error: '' })} 
                            size="small"
                            sx={inputSx} 
                            required 
                            placeholder="budi@instansi.ac.id"
                        />
                        <Grid container spacing={1.5}>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label="Password *" 
                                    type={createDialog.showPassword ? 'text' : 'password'} 
                                    value={createDialog.password} 
                                    onChange={(e) => setCreateDialog({ ...createDialog, password: e.target.value, error: '' })} 
                                    size="small"
                                    sx={inputSx} 
                                    helperText="Min. 8 karakter" 
                                    required
                                    InputProps={{ 
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setCreateDialog({ ...createDialog, showPassword: !createDialog.showPassword })} edge="end" size="small">
                                                    {createDialog.showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ) 
                                    }} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label="Konfirmasi Password *" 
                                    type={createDialog.showConfirmPassword ? 'text' : 'password'} 
                                    value={createDialog.confirmPassword} 
                                    onChange={(e) => setCreateDialog({ ...createDialog, confirmPassword: e.target.value, error: '' })} 
                                    size="small"
                                    sx={inputSx} 
                                    required
                                    InputProps={{ 
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setCreateDialog({ ...createDialog, showConfirmPassword: !createDialog.showConfirmPassword })} edge="end" size="small">
                                                    {createDialog.showConfirmPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ) 
                                    }} 
                                />
                            </Grid>
                        </Grid>
                        <FormControl fullWidth size="small" sx={inputSx}>
                            <InputLabel>Role Hak Akses *</InputLabel>
                            <Select value={createDialog.role} label="Role Hak Akses *" onChange={(e) => setCreateDialog({ ...createDialog, role: e.target.value, error: '' })} sx={{ borderRadius: '12px' }}>
                                <MenuItem value="Author">Author (Penulis Paper/Abstrak)</MenuItem>
                                <MenuItem value="Reviewer">Reviewer (Penilai Paper)</MenuItem>
                                <MenuItem value="Juri">Juri (Penilai Presentasi / Poster)</MenuItem>
                                <MenuItem value="Scanner">Scanner (Gate Attendance)</MenuItem>
                                <MenuItem value="Admin">Admin (Full Control System)</MenuItem>
                            </Select>
                        </FormControl>
                        {createDialog.role === 'Admin' && (
                            <TextField
                                fullWidth
                                label="Nomor Telepon / WhatsApp * (Wajib untuk OTP 2FA Admin)"
                                value={createDialog.whatsapp}
                                onChange={(e) => setCreateDialog({ ...createDialog, whatsapp: e.target.value, error: '' })}
                                size="small"
                                sx={inputSx}
                                placeholder="cth: 081234567890"
                                required
                                helperText="Khusus Admin: Wajib diisi untuk pengiriman kode verifikasi OTP 2FA WhatsApp saat login."
                            />
                        )}
                        <TextField 
                            fullWidth 
                            label={createDialog.role === 'Reviewer' ? 'Afiliasi / Institusi * (Wajib)' : 'Afiliasi / Institusi'} 
                            value={createDialog.affiliation} 
                            onChange={(e) => setCreateDialog({ ...createDialog, affiliation: e.target.value, error: '' })} 
                            size="small"
                            sx={inputSx} 
                            required={createDialog.role === 'Reviewer'} 
                            placeholder="Universitas / Perusahaan / Lembaga"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}`, bgcolor: '#f8fafc' }}>
                    <Button onClick={() => setCreateDialog({ open: false, name: '', email: '', password: '', confirmPassword: '', role: 'Author', affiliation: '', whatsapp: '', error: '', showPassword: false, showConfirmPassword: false })} disabled={loading === 'creating'} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, color: c.textMuted }}>
                        Batal
                    </Button>
                    <Button onClick={handleCreateUser} variant="contained" disabled={loading === 'creating'} sx={primaryActionBtn}>
                        {loading === 'creating' ? 'Membuat Pengguna...' : 'Buat Pengguna'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SNACKBAR FEEDBACK */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '12px', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SidebarLayout>
    );
}
