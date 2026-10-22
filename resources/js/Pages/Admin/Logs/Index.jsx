import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Stack,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Alert,
    Avatar,
    Grid,
    CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import ShieldIcon from '@mui/icons-material/Shield';
import PersonIcon from '@mui/icons-material/Person';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import TerminalIcon from '@mui/icons-material/Terminal';
import StorageIcon from '@mui/icons-material/Storage';

export default function LogsIndex({
    logs = {},
    stats = {},
    gapAnalysis = {},
    systemLogs = {},
    filters = {},
}) {
    const [currentTab, setCurrentTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [actionFilter, setActionFilter] = useState(filters.action || 'all');
    const [dateFilter, setDateFilter] = useState(filters.date || 'all');

    // Snapshot Detail Modal
    const [snapshotModal, setSnapshotModal] = useState({
        open: false,
        log: null,
    });
    const [copiedJson, setCopiedJson] = useState(false);

    // Clear system log confirm dialog
    const [clearLogDialogOpen, setClearLogDialogOpen] = useState(false);
    const [clearingLog, setClearingLog] = useState(false);

    // System log filter level
    const [sysLogLevel, setSysLogLevel] = useState('ALL');

    // Handle filter submit
    const applyFilters = (newFilters = {}) => {
        router.get(
            route('admin.logs'),
            {
                search: newFilters.search !== undefined ? newFilters.search : searchTerm,
                action: newFilters.action !== undefined ? newFilters.action : actionFilter,
                date: newFilters.date !== undefined ? newFilters.date : dateFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleActionChange = (val) => {
        setActionFilter(val);
        applyFilters({ action: val });
    };

    const handleDateChange = (val) => {
        setDateFilter(val);
        applyFilters({ date: val });
    };

    const handlePageChange = (event, newPage) => {
        router.get(
            route('admin.logs'),
            {
                ...filters,
                page: newPage + 1,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleClearSystemLog = () => {
        setClearingLog(true);
        router.post(
            route('admin.logs.clearSystem'),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setClearingLog(false);
                    setClearLogDialogOpen(false);
                },
            }
        );
    };

    const copySnapshotJson = () => {
        if (!snapshotModal.log?.snapshot) return;
        navigator.clipboard.writeText(JSON.stringify(snapshotModal.log.snapshot, null, 2));
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
    };

    // Helper for action badge colors
    const getActionBadge = (action) => {
        const act = (action || '').toLowerCase();
        if (act.includes('delete')) {
            return {
                label: '🗑️ Hapus Data',
                bg: '#fee2e2',
                color: '#b91c1c',
                border: '#fca5a5',
            };
        }
        if (act.includes('verify')) {
            return {
                label: '✅ Verifikasi',
                bg: '#dcfce7',
                color: '#15803d',
                border: '#86efac',
            };
        }
        if (act.includes('reject')) {
            return {
                label: '❌ Tolak Pembayaran',
                bg: '#fee2e2',
                color: '#991b1b',
                border: '#fca5a5',
            };
        }
        if (act.includes('category')) {
            return {
                label: '🏷️ Ubah Kategori',
                bg: '#ede9fe',
                color: '#6d28d9',
                border: '#c4b5fd',
            };
        }
        if (act.includes('debt')) {
            return {
                label: '⚠️ Status Hutang',
                bg: '#fef3c7',
                color: '#b45309',
                border: '#fde68a',
            };
        }
        if (act.includes('create')) {
            return {
                label: '➕ Registrasi Onsite',
                bg: '#ecfeff',
                color: '#0e7490',
                border: '#a5f3fc',
            };
        }
        if (act.includes('status') || act.includes('checkin')) {
            return {
                label: '🔄 Ubah Status',
                bg: '#e0f2fe',
                color: '#0369a1',
                border: '#7dd3fc',
            };
        }
        return {
            label: action,
            bg: '#f1f5f9',
            color: '#475569',
            border: '#cbd5e1',
        };
    };

    // Filter system logs by level
    const filteredSysEntries = (systemLogs.entries || []).filter((entry) => {
        if (sysLogLevel === 'ALL') return true;
        if (sysLogLevel === 'ERROR') return ['ERROR', 'CRITICAL', 'ALERT', 'EMERGENCY'].includes(entry.level);
        return entry.level === sysLogLevel;
    });

    const logsData = logs.data || [];
    const totalLogs = logs.total || 0;
    const currentPage = (logs.current_page || 1) - 1;
    const perPage = logs.per_page || 25;

    const ticketGaps = gapAnalysis.ticket_stats?.gaps || [];
    const paymentGaps = gapAnalysis.payment_stats?.gaps || [];
    const totalDetectedGaps = ticketGaps.length + paymentGaps.length;

    return (
        <SidebarLayout>
            <Head title="System & Audit Logs - PIT IAGI & GEOSEA 2026" />

            <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: { xs: 2.5, md: 4 } }}>
                <Container maxWidth="xl">
                    {/* ─── HEADER ─── */}
                    <Box sx={{ mb: 3.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#fef3c7', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <HistoryIcon sx={{ color: '#b45309', fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                                            System & Audit Logs
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                            Pantau riwayat audit data terhapus, verifikasi pembayaran, perubahan tiket, deteksi nomor bolong, & server log.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<RefreshIcon />}
                                    onClick={() => router.reload()}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        borderRadius: '10px',
                                        borderColor: '#cbd5e1',
                                        color: '#334155',
                                        bgcolor: '#ffffff',
                                        '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' },
                                    }}
                                >
                                    Refresh
                                </Button>
                                <Button
                                    component="a"
                                    href={route('admin.logs.downloadSystem')}
                                    variant="contained"
                                    size="small"
                                    startIcon={<DownloadIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 800,
                                        borderRadius: '10px',
                                        bgcolor: '#094d42',
                                        '&:hover': { bgcolor: '#0b5d50' },
                                        boxShadow: '0 4px 12px rgba(9, 77, 66, 0.2)',
                                    }}
                                >
                                    Download Laravel Log
                                </Button>
                            </Stack>
                        </Box>
                    </Box>

                    {/* ─── SUMMARY KPI CARDS ─── */}
                    <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                        {/* 1. Total Activity */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Card elevation={0} sx={{ p: 2.2, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            Total Aktivitas Log
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mt: 0.5 }}>
                                            {stats.totalLogs || 0}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <StorageIcon />
                                    </Box>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 700, mt: 1, display: 'block' }}>
                                    Tercatat otomatis di database
                                </Typography>
                            </Card>
                        </Grid>

                        {/* 2. Deletions (Data Terhapus) */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Card elevation={0} sx={{ p: 2.2, borderRadius: '16px', border: '1.5px solid #fecaca', bgcolor: '#fff5f5', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.05)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            Data Terhapus (Trash)
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#991b1b', mt: 0.5 }}>
                                            {stats.deletedCount || 0}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <DeleteForeverIcon />
                                    </Box>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 700, mt: 1, display: 'block' }}>
                                    Snapshot data tersimpan di log
                                </Typography>
                            </Card>
                        </Grid>

                        {/* 3. Gap Analysis */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Card elevation={0} sx={{ p: 2.2, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            Deteksi Nomor Bolong
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: totalDetectedGaps > 0 ? '#d97706' : '#15803d', mt: 0.5 }}>
                                            {totalDetectedGaps}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: totalDetectedGaps > 0 ? '#fef3c7' : '#dcfce7', color: totalDetectedGaps > 0 ? '#b45309' : '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FindInPageIcon />
                                    </Box>
                                </Box>
                                <Typography variant="caption" sx={{ color: totalDetectedGaps > 0 ? '#b45309' : '#15803d', fontWeight: 700, mt: 1, display: 'block' }}>
                                    {totalDetectedGaps > 0 ? `${ticketGaps.length} tiket & ${paymentGaps.length} invoice bolong` : 'Urutan ID database lengkap'}
                                </Typography>
                            </Card>
                        </Grid>

                        {/* 4. Server Log File */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Card elevation={0} sx={{ p: 2.2, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            File Server Log
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mt: 0.5 }}>
                                            {systemLogs.size_formatted || '0 B'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <TerminalIcon />
                                    </Box>
                                </Box>
                                <Typography variant="caption" sx={{ color: systemLogs.error_count > 0 ? '#dc2626' : '#15803d', fontWeight: 700, mt: 1, display: 'block' }}>
                                    {systemLogs.error_count || 0} Error terdeteksi di log
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* ─── MAIN TABS ─── */}
                    <Paper elevation={0} sx={{ borderRadius: '18px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <Box sx={{ borderBottom: '1px solid #e2e8f0', bgcolor: '#ffffff', px: 2, pt: 1 }}>
                            <Tabs
                                value={currentTab}
                                onChange={(e, val) => setCurrentTab(val)}
                                sx={{
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontWeight: 800,
                                        fontSize: '0.9rem',
                                        minHeight: 48,
                                        px: 2.5,
                                    },
                                    '& .Mui-selected': {
                                        color: '#094d42 !important',
                                    },
                                    '& .MuiTabs-indicator': {
                                        bgcolor: '#094d42',
                                        height: 3,
                                        borderRadius: '3px 3px 0 0',
                                    },
                                }}
                            >
                                <Tab label={`📋 Log Aktivitas & Data Terhapus (${totalLogs})`} />
                                <Tab label={`🔍 Detektor Data Terhapus / Gap Checker (${totalDetectedGaps})`} />
                                <Tab label={`💻 Server System Log (${systemLogs.size_formatted || '0 B'})`} />
                            </Tabs>
                        </Box>

                        {/* ══════════════════════════════════════════════════════════
                            TAB 0: LOG AKTIVITAS & DATA TERHAPUS
                        ══════════════════════════════════════════════════════════ */}
                        {currentTab === 0 && (
                            <Box sx={{ p: { xs: 2, md: 3 } }}>
                                {/* Filter Bar */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', gap: 1, minWidth: { xs: '100%', sm: 320 } }}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            placeholder="Cari deskripsi, kode tiket, admin, IP..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#f8fafc' } }}
                                        />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                bgcolor: '#094d42',
                                                '&:hover': { bgcolor: '#0b5d50' },
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                fontWeight: 800,
                                                px: 2.5,
                                            }}
                                        >
                                            Cari
                                        </Button>
                                    </Box>

                                    {/* Action Chips Filter */}
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.8 }}>
                                        {[
                                            { id: 'all', label: 'Semua Log' },
                                            { id: 'deletions', label: '🗑️ Data Terhapus', color: '#fee2e2', textColor: '#b91c1c' },
                                            { id: 'payments', label: '💳 Pembayaran & Hutang' },
                                            { id: 'category', label: '🏷️ Ubah Kategori' },
                                            { id: 'status', label: '🔄 Status & Check-In' },
                                            { id: 'create', label: '➕ Onsite Baru' },
                                        ].map((chip) => {
                                            const isSelected = actionFilter === chip.id;
                                            return (
                                                <Chip
                                                    key={chip.id}
                                                    label={chip.label}
                                                    onClick={() => handleActionChange(chip.id)}
                                                    variant={isSelected ? 'filled' : 'outlined'}
                                                    sx={{
                                                        fontWeight: isSelected ? 800 : 600,
                                                        fontSize: '0.78rem',
                                                        bgcolor: isSelected ? (chip.color || '#094d42') : 'transparent',
                                                        color: isSelected ? (chip.textColor || '#ffffff') : '#475569',
                                                        borderColor: isSelected ? 'transparent' : '#cbd5e1',
                                                        '&:hover': { bgcolor: isSelected ? (chip.color || '#0b5d50') : '#f1f5f9' },
                                                    }}
                                                />
                                            );
                                        })}
                                    </Stack>
                                </Box>

                                {/* Activity Logs Table */}
                                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
                                    <Table sx={{ minWidth: 750 }}>
                                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.76rem', textTransform: 'uppercase', py: 1.5 }}>Waktu</TableCell>
                                                <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.76rem', textTransform: 'uppercase', py: 1.5 }}>Aktor (Admin)</TableCell>
                                                <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.76rem', textTransform: 'uppercase', py: 1.5 }}>Aksi</TableCell>
                                                <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.76rem', textTransform: 'uppercase', py: 1.5 }}>Modul & Kode</TableCell>
                                                <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.76rem', textTransform: 'uppercase', py: 1.5 }}>Deskripsi Lengkap</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.76rem', textTransform: 'uppercase', py: 1.5 }}>Snapshot Data</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {logsData.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                            <HistoryIcon sx={{ fontSize: 44, color: '#cbd5e1' }} />
                                                            <Typography variant="body1" sx={{ fontWeight: 800, color: '#64748b' }}>
                                                                Belum ada riwayat aktivitas log yang cocok
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                                Setiap aksi hapus, verifikasi, atau ubah kategori tiket akan otomatis tercatat di sini.
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                logsData.map((log) => {
                                                    const badge = getActionBadge(log.action);
                                                    const isDeletion = (log.action || '').includes('delete');
                                                    return (
                                                        <TableRow
                                                            key={log.id}
                                                            hover
                                                            sx={{
                                                                bgcolor: isDeletion ? 'rgba(254, 242, 242, 0.4)' : 'inherit',
                                                                '&:hover': { bgcolor: isDeletion ? '#fee2e2 !important' : '#f8fafc !important' },
                                                            }}
                                                        >
                                                            {/* Waktu */}
                                                            <TableCell sx={{ py: 1.5 }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.8rem' }}>
                                                                    {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                                                                    {new Date(log.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </Typography>
                                                            </TableCell>

                                                            {/* Aktor / Admin */}
                                                            <TableCell sx={{ py: 1.5 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#094d42', fontWeight: 800 }}>
                                                                        {(log.user_name || 'A')[0]}
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.8rem', lineHeight: 1.2 }}>
                                                                            {log.user_name || 'Admin'}
                                                                        </Typography>
                                                                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                                                                            {log.ip_address || '-'}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>

                                                            {/* Aksi Badge */}
                                                            <TableCell sx={{ py: 1.5 }}>
                                                                <Chip
                                                                    label={badge.label}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: badge.bg,
                                                                        color: badge.color,
                                                                        border: `1px solid ${badge.border}`,
                                                                        fontWeight: 800,
                                                                        fontSize: '0.7rem',
                                                                        height: 24,
                                                                    }}
                                                                />
                                                            </TableCell>

                                                            {/* Modul & Kode Target */}
                                                            <TableCell sx={{ py: 1.5 }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#094d42', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                                                                    {log.target_code || '-'}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'capitalize' }}>
                                                                    {log.module ? log.module.replace('_', ' ') : 'general'}
                                                                </Typography>
                                                            </TableCell>

                                                            {/* Deskripsi */}
                                                            <TableCell sx={{ py: 1.5, maxWidth: 360 }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', fontSize: '0.82rem', lineHeight: 1.4 }}>
                                                                    {log.description}
                                                                </Typography>
                                                            </TableCell>

                                                            {/* Snapshot Button */}
                                                            <TableCell align="center" sx={{ py: 1.5 }}>
                                                                {log.snapshot ? (
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                                                                        onClick={() => setSnapshotModal({ open: true, log })}
                                                                        sx={{
                                                                            textTransform: 'none',
                                                                            fontSize: '0.74rem',
                                                                            fontWeight: 800,
                                                                            borderRadius: '8px',
                                                                            py: 0.3,
                                                                            px: 1.2,
                                                                            color: isDeletion ? '#b91c1c' : '#094d42',
                                                                            borderColor: isDeletion ? '#fca5a5' : '#86efac',
                                                                            bgcolor: isDeletion ? '#fff5f5' : '#f0fdf4',
                                                                            '&:hover': {
                                                                                bgcolor: isDeletion ? '#fee2e2' : '#dcfce7',
                                                                                borderColor: isDeletion ? '#ef4444' : '#094d42',
                                                                            },
                                                                        }}
                                                                    >
                                                                        Snapshot Data
                                                                    </Button>
                                                                ) : (
                                                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                                        -
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

                                {/* Pagination */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <TablePagination
                                        component="div"
                                        count={totalLogs}
                                        page={currentPage}
                                        onPageChange={handlePageChange}
                                        rowsPerPage={perPage}
                                        rowsPerPageOptions={[25]}
                                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count} log`}
                                    />
                                </Box>
                            </Box>
                        )}

                        {/* ══════════════════════════════════════════════════════════
                            TAB 1: DETEKTOR DATA TERHAPUS / GAP CHECKER
                        ══════════════════════════════════════════════════════════ */}
                        {currentTab === 1 && (
                            <Box sx={{ p: { xs: 2, md: 3.5 } }}>
                                <Alert severity="info" sx={{ mb: 3, borderRadius: '12px', border: '1px solid #bae6fd', bgcolor: '#f0f9ff' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0369a1', mb: 0.3 }}>
                                        Cara Kerja Detektor Urutan ID (Database Gap Analysis):
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#334155', lineHeight: 1.5, display: 'block' }}>
                                        Di database MySQL, kolom <strong>ID tiket</strong> dan <strong>ID invoice</strong> bertambah otomatis secara berurutan (1, 2, 3, 4, ...). Jika ada nomor ID yang terlewati / melompat (misal dari #12 langsung ke #14), berarti data pada ID #13 pernah dibuat dan kemudian dihapus dari database. Sistem di bawah ini mendeteksi seluruh ID yang hilang tersebut.
                                    </Typography>
                                </Alert>

                                <Grid container spacing={3}>
                                    {/* 1. Missing Ticket IDs */}
                                    <Grid item xs={12} md={6}>
                                        <Card elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                                        🎫 ID Tiket Pengunjung yang Hilang
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                        Rentang ID: {gapAnalysis.ticket_stats?.min_id || 1} - {gapAnalysis.ticket_stats?.max_id || 0} (Total aktif: {gapAnalysis.ticket_stats?.count || 0})
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={`${ticketGaps.length} ID Bolong`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: ticketGaps.length > 0 ? '#fee2e2' : '#dcfce7',
                                                        color: ticketGaps.length > 0 ? '#b91c1c' : '#15803d',
                                                        fontWeight: 900,
                                                    }}
                                                />
                                            </Box>

                                            {ticketGaps.length === 0 ? (
                                                <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                                                    <CheckCircleIcon sx={{ fontSize: 38, color: '#10b981', mb: 1 }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                                        Urutan ID Tiket Utuh (Tidak Ada Celah)
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                        Seluruh nomor ID tiket 1 s/d {gapAnalysis.ticket_stats?.max_id} ada di database.
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Stack spacing={1.5} sx={{ maxHeight: 420, overflowY: 'auto', pr: 0.5 }}>
                                                    {ticketGaps.map((gap, idx) => (
                                                        <Box
                                                            key={idx}
                                                            sx={{
                                                                p: 1.8,
                                                                borderRadius: '12px',
                                                                border: '1.5px solid #fecaca',
                                                                bgcolor: '#fff5f5',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#b91c1c', fontFamily: 'monospace' }}>
                                                                    ID Tiket Hilang: #{gap.missing_id}
                                                                </Typography>
                                                                {gap.matched_log ? (
                                                                    <Box sx={{ mt: 0.5 }}>
                                                                        <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 700, display: 'block' }}>
                                                                            {gap.matched_log.description}
                                                                        </Typography>
                                                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                                            Dihapus oleh: {gap.matched_log.deleted_by} • {gap.matched_log.deleted_at}
                                                                        </Typography>
                                                                    </Box>
                                                                ) : (
                                                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.3 }}>
                                                                        Terhapus sebelum logging diaktifkan (riwayat manual/hard delete terdahulu).
                                                                    </Typography>
                                                                )}
                                                            </Box>

                                                            {gap.matched_log?.snapshot && (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() => setSnapshotModal({ open: true, log: gap.matched_log })}
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontWeight: 800,
                                                                        fontSize: '0.72rem',
                                                                        color: '#b91c1c',
                                                                        borderColor: '#fca5a5',
                                                                        bgcolor: '#ffffff',
                                                                    }}
                                                                >
                                                                    Lihat Data
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            )}
                                        </Card>
                                    </Grid>

                                    {/* 2. Missing Payment IDs */}
                                    <Grid item xs={12} md={6}>
                                        <Card elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                                        💳 ID Pembayaran / Invoice yang Hilang
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                        Max ID: {gapAnalysis.payment_stats?.max_id || 0} (Total aktif: {gapAnalysis.payment_stats?.count || 0})
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={`${paymentGaps.length} Invoice Bolong`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: paymentGaps.length > 0 ? '#fef3c7' : '#dcfce7',
                                                        color: paymentGaps.length > 0 ? '#b45309' : '#15803d',
                                                        fontWeight: 900,
                                                    }}
                                                />
                                            </Box>

                                            {paymentGaps.length === 0 ? (
                                                <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                                                    <CheckCircleIcon sx={{ fontSize: 38, color: '#10b981', mb: 1 }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                                        Urutan Invoice Utuh (Tidak Ada Celah)
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                        Seluruh nomor urut pembayaran 1 s/d {gapAnalysis.payment_stats?.max_id} ada di database.
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Stack spacing={1.5} sx={{ maxHeight: 420, overflowY: 'auto', pr: 0.5 }}>
                                                    {paymentGaps.map((gap, idx) => (
                                                        <Box
                                                            key={idx}
                                                            sx={{
                                                                p: 1.8,
                                                                borderRadius: '12px',
                                                                border: '1.5px solid #fed7aa',
                                                                bgcolor: '#fff7ed',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#c2410c', fontFamily: 'monospace' }}>
                                                                    ID Invoice Hilang: #{gap.missing_id}
                                                                </Typography>
                                                                {gap.matched_log ? (
                                                                    <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 700, display: 'block', mt: 0.5 }}>
                                                                        {gap.matched_log.description}
                                                                    </Typography>
                                                                ) : (
                                                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.3 }}>
                                                                        Terhapus saat pembersihan orphan payment atau hard delete manual.
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            )}
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* ══════════════════════════════════════════════════════════
                            TAB 2: SERVER SYSTEM LOGS (laravel.log)
                        ══════════════════════════════════════════════════════════ */}
                        {currentTab === 2 && (
                            <Box sx={{ p: { xs: 2, md: 3.5 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                            Riwayat Server Log File (storage/logs/laravel.log)
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            Ukuran File: <strong>{systemLogs.size_formatted}</strong> • Terakhir diperbarui: <strong>{systemLogs.last_modified || '-'}</strong>
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        {/* Level Filter */}
                                        <Stack direction="row" spacing={0.8}>
                                            {['ALL', 'ERROR', 'WARNING', 'INFO'].map((lvl) => (
                                                <Chip
                                                    key={lvl}
                                                    label={lvl}
                                                    size="small"
                                                    onClick={() => setSysLogLevel(lvl)}
                                                    variant={sysLogLevel === lvl ? 'filled' : 'outlined'}
                                                    sx={{
                                                        fontWeight: 800,
                                                        fontSize: '0.72rem',
                                                        bgcolor: sysLogLevel === lvl ? (lvl === 'ERROR' ? '#fee2e2' : '#094d42') : 'transparent',
                                                        color: sysLogLevel === lvl ? (lvl === 'ERROR' ? '#b91c1c' : '#ffffff') : '#64748b',
                                                        borderColor: sysLogLevel === lvl ? 'transparent' : '#cbd5e1',
                                                    }}
                                                />
                                            ))}
                                        </Stack>

                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<CleaningServicesIcon />}
                                            onClick={() => setClearLogDialogOpen(true)}
                                            sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '8px' }}
                                        >
                                            Bersihkan Log
                                        </Button>
                                    </Stack>
                                </Box>

                                {filteredSysEntries.length === 0 ? (
                                    <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                                        <TerminalIcon sx={{ fontSize: 44, color: '#94a3b8', mb: 1 }} />
                                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                            Tidak Ada Pesan Log Pada Level Ini
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            File log dalam keadaan bersih atau tidak ada entri baru.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={1.5} sx={{ maxHeight: 600, overflowY: 'auto' }}>
                                        {filteredSysEntries.map((entry, idx) => {
                                            const isErr = ['ERROR', 'CRITICAL', 'ALERT', 'EMERGENCY'].includes(entry.level);
                                            const isWarn = entry.level === 'WARNING';
                                            return (
                                                <Paper
                                                    key={idx}
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        border: `1px solid ${isErr ? '#fecaca' : isWarn ? '#fed7aa' : '#e2e8f0'}`,
                                                        bgcolor: isErr ? '#fff5f5' : isWarn ? '#fffbeb' : '#ffffff',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Chip
                                                                label={entry.level}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 900,
                                                                    fontSize: '0.68rem',
                                                                    height: 20,
                                                                    bgcolor: isErr ? '#fee2e2' : isWarn ? '#fef3c7' : '#e0f2fe',
                                                                    color: isErr ? '#b91c1c' : isWarn ? '#b45309' : '#0369a1',
                                                                }}
                                                            />
                                                            <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', fontWeight: 700 }}>
                                                                {entry.timestamp}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                                            {entry.environment}
                                                        </Typography>
                                                    </Box>

                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-word' }}>
                                                        {entry.message}
                                                    </Typography>

                                                    {entry.trace && (
                                                        <Box sx={{ mt: 1, p: 1.2, borderRadius: '8px', bgcolor: '#0f172a', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.72rem', overflowX: 'auto', maxHeight: 120 }}>
                                                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{entry.trace}</pre>
                                                        </Box>
                                                    )}
                                                </Paper>
                                            );
                                        })}
                                    </Stack>
                                )}
                            </Box>
                        )}
                    </Paper>
                </Container>
            </Box>

            {/* ══════════════════════════════════════════════════════════
                MODAL: SNAPSHOT DATA LENGKAP
            ══════════════════════════════════════════════════════════ */}
            <Dialog
                open={snapshotModal.open}
                onClose={() => setSnapshotModal({ open: false, log: null })}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: '18px' } }}
            >
                <DialogTitle sx={{ fontWeight: 900, color: '#0f172a', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StorageIcon sx={{ color: '#094d42' }} />
                        Snapshot Data Rekaman Log
                    </Box>
                    <IconButton size="small" onClick={() => setSnapshotModal({ open: false, log: null })}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: 2.5 }}>
                    {snapshotModal.log && (
                        <Box>
                            <Alert severity="warning" sx={{ mb: 2.5, borderRadius: '10px' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                    {snapshotModal.log.description}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                    Aksi: <strong>{snapshotModal.log.action}</strong> • Aktor: <strong>{snapshotModal.log.user_name || 'Admin'}</strong>
                                </Typography>
                            </Alert>

                            {/* Human readable view if ticket snapshot */}
                            {snapshotModal.log.snapshot?.ticket && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                                        Informasi Tiket yang Terhapus:
                                    </Typography>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 700 }}>NAMA PESERTA</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>{snapshotModal.log.snapshot.ticket.visitor_name}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 700 }}>KODE TIKET</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 900, color: '#094d42', fontFamily: 'monospace' }}>{snapshotModal.log.snapshot.ticket.ticket_code}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 700 }}>EMAIL</Typography>
                                                <Typography variant="body2" sx={{ color: '#334155' }}>{snapshotModal.log.snapshot.ticket.visitor_email}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 700 }}>INSTANSI / PERUSAHAAN</Typography>
                                                <Typography variant="body2" sx={{ color: '#334155' }}>{snapshotModal.log.snapshot.ticket.visitor_institution || '-'}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 700 }}>KATEGORI TIKET</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0284c7' }}>{snapshotModal.log.snapshot.ticket.visitor_type}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 700 }}>HARGA / NILAI</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#094d42', fontFamily: 'monospace' }}>
                                                    Rp {Number(snapshotModal.log.snapshot.ticket.individual_price || 0).toLocaleString('id-ID')}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Box>
                            )}

                            {/* Human readable view if payment snapshot */}
                            {snapshotModal.log.snapshot?.payment && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                                        Informasi Invoice / Pembayaran Terkait:
                                    </Typography>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 700 }}>KODE PEMBAYARAN / INVOICE</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 900, color: '#094d42', fontFamily: 'monospace' }}>
                                                    {snapshotModal.log.snapshot.payment.payment_code}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 700 }}>TOTAL TAGIHAN</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#094d42', fontFamily: 'monospace' }}>
                                                    Rp {Number(snapshotModal.log.snapshot.payment.total_amount || 0).toLocaleString('id-ID')}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Box>
                            )}

                            {/* Raw JSON Snapshot */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                    Raw JSON Payload Snapshot:
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<ContentCopyIcon sx={{ fontSize: 15 }} />}
                                    onClick={copySnapshotJson}
                                    sx={{ textTransform: 'none', fontWeight: 800, fontSize: '0.72rem', color: '#094d42' }}
                                >
                                    {copiedJson ? 'Tersalin! ✅' : 'Salin JSON'}
                                </Button>
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    bgcolor: '#0f172a',
                                    color: '#38bdf8',
                                    fontFamily: 'monospace',
                                    fontSize: '0.78rem',
                                    overflowX: 'auto',
                                    maxHeight: 260,
                                }}
                            >
                                <pre style={{ margin: 0 }}>
                                    {JSON.stringify(snapshotModal.log.snapshot, null, 2)}
                                </pre>
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <Button onClick={() => setSnapshotModal({ open: false, log: null })} sx={{ textTransform: 'none', fontWeight: 800, color: '#64748b' }}>
                        Tutup
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ══════════════════════════════════════════════════════════
                MODAL: KONFIRMASI BERSIHKAN SYSTEM LOG
            ══════════════════════════════════════════════════════════ */}
            <Dialog open={clearLogDialogOpen} onClose={() => !clearingLog && setClearLogDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon sx={{ color: '#d97706' }} />
                    Bersihkan File Server Log?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5 }}>
                        Tindakan ini akan mengosongkan isi file <strong>storage/logs/laravel.log</strong> saat ini. Riwayat log aktivitas database tidak akan terpengaruh.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setClearLogDialogOpen(false)} disabled={clearingLog} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b' }}>
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleClearSystemLog}
                        disabled={clearingLog}
                        startIcon={clearingLog ? <CircularProgress size={16} /> : <CleaningServicesIcon />}
                        sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '8px' }}
                    >
                        {clearingLog ? 'Membersihkan...' : 'Ya, Bersihkan Log'}
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
