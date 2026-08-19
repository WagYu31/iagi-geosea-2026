import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    IconButton,
    Tooltip,
    Pagination,
    Divider,
    RadioGroup,
    Radio,
    FormControlLabel,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PaidIcon from '@mui/icons-material/Paid';
import PeopleIcon from '@mui/icons-material/People';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function VisitorTicketsIndex({
    tickets = {},
    stats = {},
    settings = {},
    filters = {},
}) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const ticketsData = tickets.data || [];
    const totalItems = tickets.total || 0;
    const currentPage = tickets.current_page || 1;
    const lastPage = tickets.last_page || 1;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
    const [checkedInFilter, setCheckedInFilter] = useState(filters.checked_in || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Dialog states
    const [onsiteModalOpen, setOnsiteModalOpen] = useState(false);
    const [proofModal, setProofModal] = useState({ open: false, payment: null });
    const [rejectModal, setRejectModal] = useState({ open: false, paymentId: null, notes: '' });

    // Onsite Registration Form
    const { data: onsiteData, setData: setOnsiteData, post: postOnsite, processing: onsiteProcessing, reset: resetOnsite, errors: onsiteErrors } = useForm({
        visitor_name: '',
        visitor_email: '',
        visitor_phone: '',
        visitor_institution: '',
        visitor_type: 'non_exclusive',
        payment_status: 'paid_cash',
    });

    const searchTimer = useRef(null);
    const isFirstRender = useRef(true);

    const navigateFilters = (overrides = {}) => {
        const params = {
            search: overrides.search !== undefined ? overrides.search : searchTerm,
            type: overrides.type !== undefined ? overrides.type : typeFilter,
            checked_in: overrides.checked_in !== undefined ? overrides.checked_in : checkedInFilter,
            status: overrides.status !== undefined ? overrides.status : statusFilter,
            page: overrides.page || 1,
        };

        if (!params.search) delete params.search;
        if (params.type === 'all') delete params.type;
        if (params.checked_in === 'all') delete params.checked_in;
        if (params.status === 'all') delete params.status;
        if (params.page === 1) delete params.page;

        router.get(route('admin.visitorTickets'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            navigateFilters({ search: val, page: 1 });
        }, 400);
    };

    const handleTypeFilterChange = (val) => {
        setTypeFilter(val);
        navigateFilters({ type: val, page: 1 });
    };

    const handleCheckedInFilterChange = (val) => {
        setCheckedInFilter(val);
        navigateFilters({ checked_in: val, page: 1 });
    };

    const handleStatusFilterChange = (val) => {
        setStatusFilter(val);
        navigateFilters({ status: val, page: 1 });
    };

    const handlePageChange = (_, page) => {
        navigateFilters({ page });
    };

    const handleVerifyPayment = (paymentId) => {
        if (confirm('Verifikasi dan aktifkan tiket untuk pembayaran ini?')) {
            router.patch(route('admin.visitorTickets.verifyPayment', paymentId), {}, { preserveScroll: true });
        }
    };

    const handleRejectPaymentSubmit = () => {
        if (!rejectModal.paymentId) return;
        router.patch(route('admin.visitorTickets.rejectPayment', rejectModal.paymentId), { notes: rejectModal.notes }, {
            preserveScroll: true,
            onSuccess: () => setRejectModal({ open: false, paymentId: null, notes: '' }),
        });
    };

    const handleOnsiteSubmit = (e) => {
        e.preventDefault();
        postOnsite(route('admin.visitorTickets.onsite'), {
            preserveScroll: true,
            onSuccess: () => {
                setOnsiteModalOpen(false);
                resetOnsite();
            },
        });
    };

    const cellSx = { borderBottom: `1px solid ${c.cardBorder}`, py: 1.5, fontSize: '0.825rem', color: c.textPrimary };
    const headCellSx = { ...cellSx, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: c.textMuted, bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb' };

    const statCards = [
        { label: 'Total Pengunjung', value: stats.totalVisitors || 0, icon: <PeopleIcon />, color: '#10b981', bg: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ecfdf5' },
        { label: 'Exclusive (Paid)', value: stats.exclusivePaidCount || 0, icon: <StarIcon />, color: '#eab308', bg: isDark ? 'rgba(234, 179, 8, 0.12)' : '#fefce8' },
        { label: 'Non-Exclusive (Free)', value: stats.nonExclusiveCount || 0, icon: <ConfirmationNumberIcon />, color: '#3b82f6', bg: isDark ? 'rgba(59, 130, 246, 0.12)' : '#eff6ff' },
        { label: 'Checked In Gate', value: stats.checkedInCount || 0, icon: <HowToRegIcon />, color: '#06b6d4', bg: isDark ? 'rgba(6, 182, 212, 0.12)' : '#ecfeff' },
        { label: 'Pending Verif', value: stats.pendingVerificationCount || 0, icon: <PaidIcon />, color: '#f97316', bg: isDark ? 'rgba(249, 115, 22, 0.12)' : '#fff7ed' },
        { label: 'Total Revenue', value: `Rp ${Number(stats.totalRevenue || 0).toLocaleString('id-ID')}`, icon: <AccountBalanceWalletIcon />, color: '#8b5cf6', bg: isDark ? 'rgba(139, 92, 246, 0.12)' : '#f5f3ff' },
    ];

    return (
        <SidebarLayout>
            <Head title="Manajemen Tiket Penonton - Admin" />

            <Box sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
                {/* Header Title & Quick Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: c.textPrimary, letterSpacing: '-0.02em' }}>
                            Tiket Penonton 🎫
                        </Typography>
                        <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5 }}>
                            Kelola pendaftaran pengunjung Exclusive & Non-Exclusive, verifikasi pembayaran, dan cetak lanyard ID Card.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.5} flexWrap="wrap">
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={() => setOnsiteModalOpen(true)}
                            sx={{
                                bgcolor: '#10b981',
                                color: '#fff',
                                fontWeight: 700,
                                borderRadius: '12px',
                                textTransform: 'none',
                                px: 2.5,
                                py: 1,
                                '&:hover': { bgcolor: '#059669' },
                            }}
                        >
                            + Registrasi Onsite
                        </Button>
                        <Button
                            component={Link}
                            href={route('admin.gateScanner')}
                            variant="contained"
                            startIcon={<QrCodeScannerIcon />}
                            sx={{
                                bgcolor: '#06b6d4',
                                color: '#fff',
                                fontWeight: 700,
                                borderRadius: '12px',
                                textTransform: 'none',
                                px: 2.5,
                                py: 1,
                                '&:hover': { bgcolor: '#0891b2' },
                            }}
                        >
                            Gate Scanner
                        </Button>
                        <Button
                            component="a"
                            href={route('admin.visitorTickets.export')}
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            sx={{
                                borderColor: c.cardBorder,
                                color: c.textPrimary,
                                fontWeight: 600,
                                borderRadius: '12px',
                                textTransform: 'none',
                                px: 2,
                                py: 1,
                            }}
                        >
                            Export CSV
                        </Button>
                    </Stack>
                </Box>

                {/* Stat Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {statCards.map((s) => (
                        <Grid item xs={6} sm={4} md={2} key={s.label}>
                            <Card elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg }}>
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                        <Box sx={{ p: 0.8, borderRadius: '8px', bgcolor: s.bg, color: s.color, display: 'flex' }}>
                                            {s.icon}
                                        </Box>
                                        <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, fontSize: '0.7rem' }}>
                                            {s.label}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, fontSize: '1.1rem' }}>
                                        {s.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Filter Bar */}
                <Card elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, mb: 3 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    placeholder="Cari nama, email, kode tiket..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: c.textMuted, fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '10px',
                                            bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={2.5}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel sx={{ fontSize: '0.85rem' }}>Kategori</InputLabel>
                                    <Select
                                        value={typeFilter}
                                        label="Kategori"
                                        onChange={(e) => handleTypeFilterChange(e.target.value)}
                                        sx={{ borderRadius: '10px', fontSize: '0.85rem' }}
                                    >
                                        <MenuItem value="all">Semua Kategori</MenuItem>
                                        <MenuItem value="exclusive">Exclusive (VIP)</MenuItem>
                                        <MenuItem value="non_exclusive">Non-Exclusive (Free)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={2.5}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel sx={{ fontSize: '0.85rem' }}>Status Check-In</InputLabel>
                                    <Select
                                        value={checkedInFilter}
                                        label="Status Check-In"
                                        onChange={(e) => handleCheckedInFilterChange(e.target.value)}
                                        sx={{ borderRadius: '10px', fontSize: '0.85rem' }}
                                    >
                                        <MenuItem value="all">Semua Status</MenuItem>
                                        <MenuItem value="yes">Sudah Check-In</MenuItem>
                                        <MenuItem value="no">Belum Check-In</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel sx={{ fontSize: '0.85rem' }}>Status Tiket</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        label="Status Tiket"
                                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                                        sx={{ borderRadius: '10px', fontSize: '0.85rem' }}
                                    >
                                        <MenuItem value="all">Semua Status Tiket</MenuItem>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="pending">Pending (Menunggu Bayar)</MenuItem>
                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Tickets Table */}
                <Card elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={headCellSx}>KODE TIKET</TableCell>
                                    <TableCell sx={headCellSx}>PENGUNJUNG</TableCell>
                                    <TableCell sx={headCellSx}>KATEGORI</TableCell>
                                    <TableCell sx={headCellSx}>SUMBER</TableCell>
                                    <TableCell sx={headCellSx}>STATUS TIKET</TableCell>
                                    <TableCell sx={headCellSx}>PEMBAYARAN</TableCell>
                                    <TableCell sx={headCellSx}>CHECK-IN GATE</TableCell>
                                    <TableCell sx={{ ...headCellSx, textAlign: 'center' }}>AKSI</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ticketsData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ ...cellSx, py: 6, color: c.textMuted }}>
                                            <ConfirmationNumberIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1, display: 'block', mx: 'auto' }} />
                                            Belum ada data tiket penonton yang sesuai dengan filter.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ticketsData.map((t) => {
                                        const isExc = t.visitor_type === 'exclusive';
                                        return (
                                            <TableRow key={t.id} hover sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb' } }}>
                                                <TableCell sx={cellSx}>
                                                    <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: isExc ? '#eab308' : '#3b82f6' }}>
                                                        {t.ticket_code}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: c.textMuted }}>
                                                        {new Date(t.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: c.textPrimary }}>
                                                        {t.visitor_name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: c.textMuted, display: 'block' }}>
                                                        {t.visitor_email}
                                                    </Typography>
                                                    {t.visitor_institution && (
                                                        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, display: 'block' }}>
                                                            🏢 {t.visitor_institution}
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    <Chip
                                                        icon={isExc ? <StarIcon sx={{ fontSize: 13, color: '#000 !important' }} /> : undefined}
                                                        label={isExc ? 'EXCLUSIVE' : 'NON-EXCLUSIVE'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: isExc ? '#eab308' : 'rgba(59, 130, 246, 0.15)',
                                                            color: isExc ? '#000' : '#3b82f6',
                                                            fontWeight: 800,
                                                            fontSize: '0.65rem',
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    <Chip
                                                        label={t.registration_source === 'admin_onsite' ? 'Onsite (Admin)' : 'Online Web'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: t.registration_source === 'admin_onsite' ? 'rgba(147, 51, 234, 0.12)' : 'rgba(107, 114, 128, 0.12)',
                                                            color: t.registration_source === 'admin_onsite' ? '#9333ea' : '#6b7280',
                                                            fontWeight: 600,
                                                            fontSize: '0.65rem',
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    <Chip
                                                        label={t.status.toUpperCase()}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: t.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : t.status === 'pending' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                            color: t.status === 'active' ? '#10b981' : t.status === 'pending' ? '#eab308' : '#ef4444',
                                                            fontWeight: 700,
                                                            fontSize: '0.65rem',
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    {t.payment ? (
                                                        <Box>
                                                            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: c.textPrimary }}>
                                                                Rp {Number(t.payment.total_amount || 0).toLocaleString('id-ID')}
                                                            </Typography>
                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                <Chip
                                                                    label={t.payment.status.toUpperCase()}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 18,
                                                                        fontSize: '0.6rem',
                                                                        bgcolor: t.payment.status === 'approved' ? '#dcfce7' : t.payment.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                                                        color: t.payment.status === 'approved' ? '#166534' : t.payment.status === 'pending' ? '#92400e' : '#991b1b',
                                                                        fontWeight: 700,
                                                                    }}
                                                                />
                                                                {t.payment.proof_of_payment && (
                                                                    <Tooltip title="Lihat Bukti Transfer">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => setProofModal({ open: true, payment: t.payment })}
                                                                            sx={{ p: 0.2, color: '#3b82f6' }}
                                                                        >
                                                                            <VisibilityIcon sx={{ fontSize: 15 }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Stack>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                                                            GRATIS (Rp 0)
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    {t.checked_in ? (
                                                        <Box>
                                                            <Chip
                                                                icon={<CheckCircleIcon sx={{ fontSize: 13, color: '#10b981 !important' }} />}
                                                                label="CHECKED IN"
                                                                size="small"
                                                                sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 800, fontSize: '0.65rem' }}
                                                            />
                                                            <Typography variant="caption" sx={{ color: c.textMuted, display: 'block', fontSize: '0.65rem' }}>
                                                                {t.checked_in_at ? new Date(t.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: c.textMuted }}>Belum</Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell sx={{ ...cellSx, textAlign: 'center' }}>
                                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                                        {/* Verify/Reject for Pending Exclusive Payments */}
                                                        {t.payment && t.payment.status === 'pending' && (
                                                            <>
                                                                <Tooltip title="Setujui Pembayaran">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleVerifyPayment(t.payment.id)}
                                                                        sx={{ color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.1)', p: 0.6 }}
                                                                    >
                                                                        <CheckIcon sx={{ fontSize: 16 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Tolak Pembayaran">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => setRejectModal({ open: true, paymentId: t.payment.id, notes: '' })}
                                                                        sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)', p: 0.6 }}
                                                                    >
                                                                        <CloseIcon sx={{ fontSize: 16 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        )}

                                                        {/* Print Badge / Lanyard Card Button */}
                                                        <Tooltip title="Cetak Kartu Lanyard">
                                                            <IconButton
                                                                component="a"
                                                                href={route('admin.visitorTickets.printBadge', t.id)}
                                                                target="_blank"
                                                                size="small"
                                                                sx={{ color: '#8b5cf6', bgcolor: 'rgba(139, 92, 246, 0.1)', p: 0.6 }}
                                                            >
                                                                <PrintIcon sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {/* Open Public E-Ticket */}
                                                        <Tooltip title="Buka E-Tiket Digital">
                                                            <IconButton
                                                                component="a"
                                                                href={route('visitor.ticket.show', t.ticket_code)}
                                                                target="_blank"
                                                                size="small"
                                                                sx={{ color: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.1)', p: 0.6 }}
                                                            >
                                                                <VisibilityIcon sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    {totalItems > 0 && (
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${c.cardBorder}`, flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="caption" sx={{ color: c.textMuted }}>
                                Menampilkan halaman {currentPage} dari {lastPage} (Total {totalItems} pengunjung)
                            </Typography>
                            <Pagination
                                count={lastPage}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                size="small"
                            />
                        </Box>
                    )}
                </Card>
            </Box>

            {/* Modal: Quick Onsite Registration */}
            <Dialog open={onsiteModalOpen} onClose={() => setOnsiteModalOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleOnsiteSubmit}>
                    <DialogTitle sx={{ fontWeight: 800, color: c.textPrimary, borderBottom: `1px solid ${c.cardBorder}` }}>
                        👤 Registrasi Pengunjung Onsite
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2.5 }}>
                        <Typography variant="body2" sx={{ color: c.textMuted, mb: 2 }}>
                            Form bantuan pendaftaran langsung di lokasi acara (meja registrasi/lansia).
                        </Typography>

                        <Stack spacing={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Kategori Pengunjung</InputLabel>
                                <Select
                                    value={onsiteData.visitor_type}
                                    label="Kategori Pengunjung"
                                    onChange={(e) => setOnsiteData('visitor_type', e.target.value)}
                                >
                                    <MenuItem value="non_exclusive">Non-Exclusive (Gratis / Rp 0)</MenuItem>
                                    <MenuItem value="exclusive">Exclusive VIP (Rp {Number(settings.priceExclusive || 150000).toLocaleString('id-ID')})</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Nama Lengkap *"
                                value={onsiteData.visitor_name}
                                onChange={(e) => setOnsiteData('visitor_name', e.target.value)}
                                fullWidth
                                size="small"
                                required
                            />

                            <TextField
                                label="Email *"
                                type="email"
                                value={onsiteData.visitor_email}
                                onChange={(e) => setOnsiteData('visitor_email', e.target.value)}
                                fullWidth
                                size="small"
                                required
                            />

                            <TextField
                                label="No. WhatsApp / HP"
                                value={onsiteData.visitor_phone}
                                onChange={(e) => setOnsiteData('visitor_phone', e.target.value)}
                                fullWidth
                                size="small"
                            />

                            <TextField
                                label="Instansi / Perusahaan"
                                value={onsiteData.visitor_institution}
                                onChange={(e) => setOnsiteData('visitor_institution', e.target.value)}
                                fullWidth
                                size="small"
                            />

                            {onsiteData.visitor_type === 'exclusive' && (
                                <Box sx={{ p: 2, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', borderRadius: '10px', border: `1px solid ${c.cardBorder}` }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: c.textPrimary, display: 'block', mb: 1 }}>
                                        Status Pembayaran Onsite Exclusive:
                                    </Typography>
                                    <RadioGroup
                                        value={onsiteData.payment_status}
                                        onChange={(e) => setOnsiteData('payment_status', e.target.value)}
                                    >
                                        <FormControlLabel value="paid_cash" control={<Radio size="small" />} label="Lunas Tunai / Cash di Lokasi" />
                                        <FormControlLabel value="free_bypass" control={<Radio size="small" />} label="Gratis (VIP Invitation / Bypass)" />
                                        <FormControlLabel value="pending" control={<Radio size="small" />} label="Belum Lunas (Pending)" />
                                    </RadioGroup>
                                </Box>
                            )}
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${c.cardBorder}` }}>
                        <Button onClick={() => setOnsiteModalOpen(false)} sx={{ textTransform: 'none', color: c.textMuted }}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={onsiteProcessing}
                            sx={{ bgcolor: '#10b981', color: '#fff', fontWeight: 700, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#059669' } }}
                        >
                            {onsiteProcessing ? 'Menyimpan...' : 'Simpan & Terbitkan Tiket'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Modal: View Payment Proof */}
            <Dialog open={proofModal.open} onClose={() => setProofModal({ open: false, payment: null })} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: c.textPrimary }}>
                    Bukti Pembayaran: {proofModal.payment?.payment_code}
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
                    {proofModal.payment?.proof_of_payment ? (
                        <Box
                            component="img"
                            src={`/storage/${proofModal.payment.proof_of_payment}`}
                            alt="Bukti Transfer"
                            sx={{ maxWidth: '100%', maxHeight: 400, borderRadius: '8px', border: `1px solid ${c.cardBorder}` }}
                        />
                    ) : (
                        <Typography variant="body2" sx={{ color: c.textMuted }}>Tidak ada file gambar.</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setProofModal({ open: false, payment: null })}>Tutup</Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Reject Payment */}
            <Dialog open={rejectModal.open} onClose={() => setRejectModal({ open: false, paymentId: null, notes: '' })} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>Tolak Pembayaran</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        label="Alasan Penolakan"
                        value={rejectModal.notes}
                        onChange={(e) => setRejectModal({ ...rejectModal, notes: e.target.value })}
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        placeholder="Contoh: Nominal transfer kurang / bukti transfer buram"
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setRejectModal({ open: false, paymentId: null, notes: '' })}>Batal</Button>
                    <Button variant="contained" color="error" onClick={handleRejectPaymentSubmit}>
                        Tolak Pembayaran
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
