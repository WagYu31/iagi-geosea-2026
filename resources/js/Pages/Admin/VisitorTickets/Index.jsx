import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { useTheme } from '@mui/material/styles';
import { QRCodeSVG } from 'qrcode.react';
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
    Checkbox,
    Paper,
    Alert,
    CircularProgress,
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

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

    // Multi-select state
    const [selectedIds, setSelectedIds] = useState([]);

    // Dialog states
    const [onsiteModalOpen, setOnsiteModalOpen] = useState(false);
    const [detailModal, setDetailModal] = useState({ open: false, ticket: null });
    const [editModal, setEditModal] = useState({ open: false, ticket: null });
    const [proofModal, setProofModal] = useState({ open: false, payment: null });
    const [rejectModal, setRejectModal] = useState({ open: false, paymentId: null, notes: '' });
    const [bulkActionProcessing, setBulkActionProcessing] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Onsite Registration Form
    const { data: onsiteData, setData: setOnsiteData, post: postOnsite, processing: onsiteProcessing, reset: resetOnsite, errors: onsiteErrors } = useForm({
        visitor_name: '',
        visitor_email: '',
        visitor_phone: '',
        visitor_institution: '',
        visitor_type: 'non_exclusive',
        payment_status: 'paid_cash',
    });

    // Edit Visitor Form
    const { data: editData, setData: setEditData, put: putEdit, processing: editProcessing, reset: resetEdit, errors: editErrors } = useForm({
        visitor_name: '',
        visitor_email: '',
        visitor_phone: '',
        visitor_institution: '',
        status: 'active',
    });

    const searchTimer = useRef(null);

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

    // Quick Clickable Stat Card Filter
    const handleStatCardClick = (statKey) => {
        if (statKey === 'all') {
            setTypeFilter('all');
            setCheckedInFilter('all');
            setStatusFilter('all');
            navigateFilters({ type: 'all', checked_in: 'all', status: 'all', page: 1 });
        } else if (statKey === 'exclusive') {
            setTypeFilter('exclusive');
            navigateFilters({ type: 'exclusive', page: 1 });
        } else if (statKey === 'non_exclusive') {
            setTypeFilter('non_exclusive');
            navigateFilters({ type: 'non_exclusive', page: 1 });
        } else if (statKey === 'checked_in') {
            setCheckedInFilter('yes');
            navigateFilters({ checked_in: 'yes', page: 1 });
        } else if (statKey === 'pending') {
            setStatusFilter('pending');
            navigateFilters({ status: 'pending', page: 1 });
        }
    };

    // Single Ticket Actions
    const handleToggleCheckIn = (ticketId) => {
        router.patch(route('admin.visitorTickets.toggleCheckIn', ticketId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                if (detailModal.open && detailModal.ticket?.id === ticketId) {
                    setDetailModal(prev => ({
                        ...prev,
                        ticket: {
                            ...prev.ticket,
                            checked_in: !prev.ticket.checked_in,
                            checked_in_at: !prev.ticket.checked_in ? new Date().toISOString() : null,
                        }
                    }));
                }
            }
        });
    };

    const handleVerifyPayment = (paymentId) => {
        if (confirm('Verifikasi dan aktifkan tiket untuk pembayaran ini?')) {
            router.patch(route('admin.visitorTickets.verifyPayment', paymentId), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    setProofModal({ open: false, payment: null });
                }
            });
        }
    };

    const handleRejectPaymentSubmit = () => {
        if (!rejectModal.paymentId) return;
        router.patch(route('admin.visitorTickets.rejectPayment', rejectModal.paymentId), { notes: rejectModal.notes }, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectModal({ open: false, paymentId: null, notes: '' });
                setProofModal({ open: false, payment: null });
            },
        });
    };

    const handleDeleteVisitor = (ticketId, name) => {
        if (confirm(`Yakin ingin menghapus tiket pengunjung "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('admin.visitorTickets.destroy', ticketId), {
                preserveScroll: true,
                onSuccess: () => {
                    if (detailModal.open && detailModal.ticket?.id === ticketId) {
                        setDetailModal({ open: false, ticket: null });
                    }
                }
            });
        }
    };

    const handleOpenEdit = (ticket) => {
        setEditModal({ open: true, ticket });
        setEditData({
            visitor_name: ticket.visitor_name || '',
            visitor_email: ticket.visitor_email || '',
            visitor_phone: ticket.visitor_phone || '',
            visitor_institution: ticket.visitor_institution || '',
            status: ticket.status || 'active',
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editModal.ticket) return;
        putEdit(route('admin.visitorTickets.update', editModal.ticket.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditModal({ open: false, ticket: null });
                resetEdit();
            }
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

    // Multi-Select Handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(ticketsData.map(t => t.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkAction = (actionName) => {
        if (selectedIds.length === 0) return;

        let confirmMsg = `Jalankan aksi massal untuk ${selectedIds.length} tiket terpilih?`;
        if (actionName === 'delete') confirmMsg = `PERINGATAN: Yakin ingin MENGHAPUS ${selectedIds.length} tiket terpilih secara permanen?`;
        if (actionName === 'verify_payment') confirmMsg = `Verifikasi pembayaran untuk ${selectedIds.length} tiket terpilih?`;
        if (actionName === 'check_in') confirmMsg = `Lakukan Check-In massal untuk ${selectedIds.length} tiket terpilih?`;

        if (confirm(confirmMsg)) {
            setBulkActionProcessing(true);
            router.post(route('admin.visitorTickets.bulkAction'), {
                action: actionName,
                ticket_ids: selectedIds,
            }, {
                preserveScroll: true,
                onFinish: () => {
                    setBulkActionProcessing(false);
                    setSelectedIds([]);
                }
            });
        }
    };

    const generateWhatsAppUrl = (ticket) => {
        const phone = (ticket.visitor_phone || '').replace(/[^0-9]/g, '');
        const formattedPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone.startsWith('62') ? phone : '62' + phone;
        const ticketUrl = route('visitor.ticket.show', ticket.ticket_code);
        const msg = encodeURIComponent(
            `Halo Bapak/Ibu ${ticket.visitor_name},\n\nTerima kasih telah mendaftar sebagai *Visitor ${ticket.visitor_type === 'exclusive' ? 'Exclusive VIP' : 'Non-Exclusive'}* pada Konferensi *55th PIT IAGI & GEOSEA XIX 2026*.\n\nBerikut adalah link E-Tiket Digital & Kartu Lanyard resmi Anda:\n👉 ${ticketUrl}\n\n*Kode Tiket:* ${ticket.ticket_code}\n\nHarap tunjukkan QR Code pada link di atas kepada petugas di pintu masuk / gate scanner saat hari acara. Sampai jumpa di lokasi!\n\n_Sekretariat Panitia IAGI-GEOSEA 2026_`
        );
        return `https://wa.me/${formattedPhone}?text=${msg}`;
    };

    const copyTicketLink = (code) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(route('visitor.ticket.show', code));
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const cellSx = { borderBottom: `1px solid ${c.cardBorder}`, py: 1.2, px: 1.5, fontSize: '0.825rem', color: c.textPrimary };
    const headCellSx = { ...cellSx, fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: c.textMuted, bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f8fafc' };

    const statCards = [
        { key: 'all', label: 'Total Pengunjung', value: stats.totalVisitors || 0, icon: <PeopleIcon />, color: '#10b981', bg: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ecfdf5' },
        { key: 'exclusive', label: 'Exclusive (Paid)', value: stats.exclusivePaidCount || 0, icon: <StarIcon />, color: '#eab308', bg: isDark ? 'rgba(234, 179, 8, 0.12)' : '#fefce8' },
        { key: 'non_exclusive', label: 'Non-Exclusive (Free)', value: stats.nonExclusiveCount || 0, icon: <ConfirmationNumberIcon />, color: '#3b82f6', bg: isDark ? 'rgba(59, 130, 246, 0.12)' : '#eff6ff' },
        { key: 'checked_in', label: 'Checked In Gate', value: stats.checkedInCount || 0, icon: <HowToRegIcon />, color: '#06b6d4', bg: isDark ? 'rgba(6, 182, 212, 0.12)' : '#ecfeff' },
        { key: 'pending', label: 'Pending Verif', value: stats.pendingVerificationCount || 0, icon: <PaidIcon />, color: '#f97316', bg: isDark ? 'rgba(249, 115, 22, 0.12)' : '#fff7ed' },
        { key: 'revenue', label: 'Total Revenue', value: `Rp ${Number(stats.totalRevenue || 0).toLocaleString('id-ID')}`, icon: <AccountBalanceWalletIcon />, color: '#8b5cf6', bg: isDark ? 'rgba(139, 92, 246, 0.12)' : '#f5f3ff' },
    ];

    return (
        <SidebarLayout>
            <Head title="Manajemen Tiket Penonton - Admin" />

            <Box sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
                {/* Header Title & Quick Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: c.textPrimary, letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', sm: '1.85rem' } }}>
                            Tiket Penonton 🎫
                        </Typography>
                        <Typography variant="body2" sx={{ color: c.textMuted, mt: 0.5 }}>
                            Kelola pendaftaran pengunjung Exclusive & Non-Exclusive, verifikasi pembayaran, check-in gate, dan cetak ID Card.
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
                                fontWeight: 800,
                                borderRadius: '10px',
                                textTransform: 'none',
                                px: 2.2,
                                py: 0.9,
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
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
                                bgcolor: '#0284c7',
                                color: '#fff',
                                fontWeight: 800,
                                borderRadius: '10px',
                                textTransform: 'none',
                                px: 2.2,
                                py: 0.9,
                                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                                '&:hover': { bgcolor: '#0369a1' },
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
                                fontWeight: 700,
                                borderRadius: '10px',
                                textTransform: 'none',
                                px: 2,
                                py: 0.9,
                                '&:hover': { borderColor: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.05)' },
                            }}
                        >
                            Export CSV
                        </Button>
                    </Stack>
                </Box>

                {/* Clickable Stat Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {statCards.map((s) => (
                        <Grid item xs={6} sm={4} md={2} key={s.label}>
                            <Card
                                elevation={0}
                                onClick={() => handleStatCardClick(s.key)}
                                sx={{
                                    borderRadius: '14px',
                                    border: `1px solid ${c.cardBorder}`,
                                    bgcolor: c.cardBg,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        borderColor: s.color,
                                        boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 1.8, '&:last-child': { pb: 1.8 } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                                        <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: s.bg, color: s.color, display: 'flex' }}>
                                            {React.cloneElement(s.icon, { sx: { fontSize: 18 } })}
                                        </Box>
                                        <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700, fontSize: '0.68rem', lineHeight: 1.2 }}>
                                            {s.label}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 900, color: c.textPrimary, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
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
                                    placeholder="Cari nama, email, kode tiket, instansi..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: c.textMuted, fontSize: 18 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '10px',
                                            bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f8fafc',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={2.5}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel sx={{ fontSize: '0.82rem' }}>Kategori</InputLabel>
                                    <Select
                                        value={typeFilter}
                                        label="Kategori"
                                        onChange={(e) => handleTypeFilterChange(e.target.value)}
                                        sx={{ borderRadius: '10px', fontSize: '0.82rem' }}
                                    >
                                        <MenuItem value="all">Semua Kategori</MenuItem>
                                        <MenuItem value="exclusive">Exclusive (VIP)</MenuItem>
                                        <MenuItem value="non_exclusive">Non-Exclusive (Free)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={2.5}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel sx={{ fontSize: '0.82rem' }}>Status Check-In</InputLabel>
                                    <Select
                                        value={checkedInFilter}
                                        label="Status Check-In"
                                        onChange={(e) => handleCheckedInFilterChange(e.target.value)}
                                        sx={{ borderRadius: '10px', fontSize: '0.82rem' }}
                                    >
                                        <MenuItem value="all">Semua Status</MenuItem>
                                        <MenuItem value="yes">Sudah Check-In</MenuItem>
                                        <MenuItem value="no">Belum Check-In</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel sx={{ fontSize: '0.82rem' }}>Status Tiket</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        label="Status Tiket"
                                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                                        sx={{ borderRadius: '10px', fontSize: '0.82rem' }}
                                    >
                                        <MenuItem value="all">Semua Status Tiket</MenuItem>
                                        <MenuItem value="active">Active (Aktif)</MenuItem>
                                        <MenuItem value="pending">Pending (Menunggu Bayar)</MenuItem>
                                        <MenuItem value="cancelled">Cancelled (Batal)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* FLOATING BULK ACTION TOOLBAR */}
                {selectedIds.length > 0 && (
                    <Paper
                        elevation={4}
                        sx={{
                            p: 1.5,
                            px: 2.5,
                            borderRadius: '12px',
                            bgcolor: isDark ? '#1e293b' : '#0f172a',
                            color: '#ffffff',
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1.5,
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Chip
                                label={`${selectedIds.length} Dipilih`}
                                size="small"
                                sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 900 }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#cbd5e1', display: { xs: 'none', sm: 'block' } }}>
                                Aksi massal untuk tiket yang dicentang:
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<CheckIcon />}
                                onClick={() => handleBulkAction('verify_payment')}
                                disabled={bulkActionProcessing}
                                sx={{ bgcolor: '#10b981', textTransform: 'none', fontWeight: 800, borderRadius: '8px', '&:hover': { bgcolor: '#059669' } }}
                            >
                                Verifikasi Bayar
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<HowToRegIcon />}
                                onClick={() => handleBulkAction('check_in')}
                                disabled={bulkActionProcessing}
                                sx={{ bgcolor: '#0284c7', textTransform: 'none', fontWeight: 800, borderRadius: '8px', '&:hover': { bgcolor: '#0369a1' } }}
                            >
                                Check-In Massal
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleBulkAction('undo_check_in')}
                                disabled={bulkActionProcessing}
                                sx={{ borderColor: '#64748b', color: '#cbd5e1', textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
                            >
                                Batal Check-In
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                color="error"
                                startIcon={<DeleteOutlineIcon />}
                                onClick={() => handleBulkAction('delete')}
                                disabled={bulkActionProcessing}
                                sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '8px' }}
                            >
                                Hapus
                            </Button>
                        </Stack>
                    </Paper>
                )}

                {/* Tickets Table */}
                <Card elevation={0} sx={{ borderRadius: '14px', border: `1px solid ${c.cardBorder}`, bgcolor: c.cardBg, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox" sx={headCellSx}>
                                        <Checkbox
                                            size="small"
                                            indeterminate={selectedIds.length > 0 && selectedIds.length < ticketsData.length}
                                            checked={ticketsData.length > 0 && selectedIds.length === ticketsData.length}
                                            onChange={handleSelectAll}
                                            sx={{ p: 0.5 }}
                                        />
                                    </TableCell>
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
                                        <TableCell colSpan={9} align="center" sx={{ ...cellSx, py: 6, color: c.textMuted }}>
                                            <ConfirmationNumberIcon sx={{ fontSize: 44, opacity: 0.25, mb: 1, display: 'block', mx: 'auto' }} />
                                            Belum ada data tiket penonton yang sesuai dengan filter.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ticketsData.map((t) => {
                                        const isExc = t.visitor_type === 'exclusive';
                                        const isSelected = selectedIds.includes(t.id);
                                        return (
                                            <TableRow
                                                key={t.id}
                                                hover
                                                selected={isSelected}
                                                sx={{
                                                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb' },
                                                }}
                                            >
                                                <TableCell padding="checkbox" sx={cellSx}>
                                                    <Checkbox
                                                        size="small"
                                                        checked={isSelected}
                                                        onChange={() => handleSelectRow(t.id)}
                                                        sx={{ p: 0.5 }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: isExc ? '#d97706' : '#0284c7', fontSize: '0.84rem' }}>
                                                        {t.ticket_code}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: c.textMuted, fontSize: '0.7rem' }}>
                                                        {new Date(t.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    <Typography
                                                        variant="body2"
                                                        onClick={() => setDetailModal({ open: true, ticket: t })}
                                                        sx={{
                                                            fontWeight: 800,
                                                            color: c.textPrimary,
                                                            cursor: 'pointer',
                                                            '&:hover': { color: '#10b981', textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        {t.visitor_name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: c.textMuted, display: 'block', fontSize: '0.72rem' }}>
                                                        {t.visitor_email}
                                                    </Typography>
                                                    {t.visitor_phone && (
                                                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>
                                                            📞 {t.visitor_phone}
                                                        </Typography>
                                                    )}
                                                    {t.visitor_institution && (
                                                        <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, display: 'block', fontSize: '0.7rem' }}>
                                                            🏢 {t.visitor_institution}
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    <Chip
                                                        icon={isExc ? <StarIcon sx={{ fontSize: 12, color: '#92400e !important' }} /> : undefined}
                                                        label={isExc ? 'EXCLUSIVE' : 'NON-EXCLUSIVE'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: isExc ? '#fef3c7' : '#ecfdf5',
                                                            color: isExc ? '#92400e' : '#047857',
                                                            fontWeight: 900,
                                                            fontSize: '0.64rem',
                                                            height: 20,
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    <Chip
                                                        label={t.registration_source === 'admin_onsite' ? 'Onsite (Admin)' : 'Online Web'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: t.registration_source === 'admin_onsite' ? '#f5f3ff' : '#f1f5f9',
                                                            color: t.registration_source === 'admin_onsite' ? '#7c3aed' : '#475569',
                                                            fontWeight: 700,
                                                            fontSize: '0.64rem',
                                                            height: 20,
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    <Chip
                                                        label={t.status.toUpperCase()}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: t.status === 'active' ? '#dcfce7' : t.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                                            color: t.status === 'active' ? '#15803d' : t.status === 'pending' ? '#b45309' : '#b91c1c',
                                                            fontWeight: 800,
                                                            fontSize: '0.64rem',
                                                            height: 20,
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={cellSx}>
                                                    {t.payment ? (
                                                        <Box>
                                                            <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', color: c.textPrimary, fontSize: '0.78rem' }}>
                                                                Rp {Number(t.payment.total_amount || 0).toLocaleString('id-ID')}
                                                            </Typography>
                                                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.2 }}>
                                                                <Chip
                                                                    label={t.payment.status.toUpperCase()}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 18,
                                                                        fontSize: '0.58rem',
                                                                        bgcolor: t.payment.status === 'approved' ? '#dcfce7' : t.payment.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                                                        color: t.payment.status === 'approved' ? '#166534' : t.payment.status === 'pending' ? '#92400e' : '#991b1b',
                                                                        fontWeight: 800,
                                                                    }}
                                                                />
                                                                {t.payment.proof_of_payment && (
                                                                    <Tooltip title="Lihat Bukti Transfer">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => setProofModal({ open: true, payment: t.payment })}
                                                                            sx={{ p: 0.2, color: '#0284c7' }}
                                                                        >
                                                                            <VisibilityIcon sx={{ fontSize: 14 }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Stack>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, fontSize: '0.75rem' }}>
                                                            GRATIS
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* CHECK-IN GATE 1-CLICK TOGGLE */}
                                                <TableCell sx={cellSx}>
                                                    {t.checked_in ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                            <Chip
                                                                icon={<CheckCircleIcon sx={{ fontSize: 13, color: '#15803d !important' }} />}
                                                                label="CHECKED IN"
                                                                size="small"
                                                                onClick={() => handleToggleCheckIn(t.id)}
                                                                sx={{
                                                                    bgcolor: '#dcfce7',
                                                                    color: '#15803d',
                                                                    fontWeight: 900,
                                                                    fontSize: '0.62rem',
                                                                    height: 20,
                                                                    cursor: 'pointer',
                                                                    '&:hover': { bgcolor: '#bbf7d0' },
                                                                }}
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            disabled={t.status !== 'active'}
                                                            onClick={() => handleToggleCheckIn(t.id)}
                                                            sx={{
                                                                borderColor: '#cbd5e1',
                                                                color: '#475569',
                                                                fontSize: '0.68rem',
                                                                py: 0.2,
                                                                px: 1,
                                                                borderRadius: '6px',
                                                                textTransform: 'none',
                                                                fontWeight: 700,
                                                                '&:hover': { borderColor: '#10b981', color: '#10b981', bgcolor: 'rgba(16,185,129,0.05)' }
                                                            }}
                                                        >
                                                            Check In
                                                        </Button>
                                                    )}
                                                    {t.checked_in_at && (
                                                        <Typography variant="caption" sx={{ color: c.textMuted, display: 'block', fontSize: '0.65rem', mt: 0.2 }}>
                                                            {new Date(t.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* ACTION BUTTONS */}
                                                <TableCell sx={{ ...cellSx, textAlign: 'center' }}>
                                                    <Stack direction="row" spacing={0.4} justifyContent="center">
                                                        {/* Verify/Reject for Pending Payments */}
                                                        {t.payment && t.payment.status === 'pending' && (
                                                            <>
                                                                <Tooltip title="Setujui Pembayaran">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleVerifyPayment(t.payment.id)}
                                                                        sx={{ color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.1)', p: 0.5 }}
                                                                    >
                                                                        <CheckIcon sx={{ fontSize: 15 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Tolak Pembayaran">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => setRejectModal({ open: true, paymentId: t.payment.id, notes: '' })}
                                                                        sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)', p: 0.5 }}
                                                                    >
                                                                        <CloseIcon sx={{ fontSize: 15 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        )}

                                                        {/* Detail Modal */}
                                                        <Tooltip title="Detail Lengkap & QR Code">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => setDetailModal({ open: true, ticket: t })}
                                                                sx={{ color: '#0284c7', bgcolor: 'rgba(2, 132, 199, 0.1)', p: 0.5 }}
                                                            >
                                                                <VisibilityIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {/* WhatsApp Direct */}
                                                        {t.visitor_phone && (
                                                            <Tooltip title="Kirim E-Tiket via WhatsApp">
                                                                <IconButton
                                                                    component="a"
                                                                    href={generateWhatsAppUrl(t)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    size="small"
                                                                    sx={{ color: '#16a34a', bgcolor: 'rgba(22, 163, 74, 0.1)', p: 0.5 }}
                                                                >
                                                                    <WhatsAppIcon sx={{ fontSize: 15 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}

                                                        {/* Print Badge */}
                                                        <Tooltip title="Cetak Kartu Lanyard">
                                                            <IconButton
                                                                component="a"
                                                                href={route('admin.visitorTickets.printBadge', t.id)}
                                                                target="_blank"
                                                                size="small"
                                                                sx={{ color: '#8b5cf6', bgcolor: 'rgba(139, 92, 246, 0.1)', p: 0.5 }}
                                                            >
                                                                <PrintIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {/* Edit Visitor */}
                                                        <Tooltip title="Edit Data Pengunjung">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenEdit(t)}
                                                                sx={{ color: '#f59e0b', bgcolor: 'rgba(245, 158, 11, 0.1)', p: 0.5 }}
                                                            >
                                                                <EditIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {/* Delete Visitor */}
                                                        <Tooltip title="Hapus Tiket">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDeleteVisitor(t.id, t.visitor_name)}
                                                                sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)', p: 0.5 }}
                                                            >
                                                                <DeleteOutlineIcon sx={{ fontSize: 15 }} />
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
                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600 }}>
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

            {/* MODAL 1: COMPREHENSIVE VISITOR TICKET DETAIL */}
            <Dialog
                open={detailModal.open}
                onClose={() => setDetailModal({ open: false, ticket: null })}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '18px' } }}
            >
                {detailModal.ticket && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, borderBottom: `1px solid ${c.cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ConfirmationNumberIcon sx={{ color: '#094d42' }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: c.textPrimary }}>
                                    Detail Tiket Penonton
                                </Typography>
                            </Box>
                            <IconButton onClick={() => setDetailModal({ open: false, ticket: null })} size="small">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent sx={{ p: 3 }}>
                            {/* Top QR Code + Badge Box */}
                            <Box sx={{ textAlign: 'center', p: 2.5, bgcolor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', mb: 3 }}>
                                <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: '10px', width: 'fit-content', mx: 'auto', border: '1px solid #e2e8f0', mb: 1.5 }}>
                                    <QRCodeSVG value={detailModal.ticket.ticket_code} size={130} level="H" />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: 'monospace', color: '#094d42', letterSpacing: '0.05em' }}>
                                    {detailModal.ticket.ticket_code}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                                    <Chip
                                        label={detailModal.ticket.visitor_type === 'exclusive' ? 'EXCLUSIVE VIP' : 'NON-EXCLUSIVE'}
                                        size="small"
                                        sx={{
                                            bgcolor: detailModal.ticket.visitor_type === 'exclusive' ? '#fef3c7' : '#ecfdf5',
                                            color: detailModal.ticket.visitor_type === 'exclusive' ? '#92400e' : '#047857',
                                            fontWeight: 900,
                                        }}
                                    />
                                    <Chip
                                        label={detailModal.ticket.checked_in ? 'CHECKED IN' : 'BELUM CHECK IN'}
                                        size="small"
                                        sx={{
                                            bgcolor: detailModal.ticket.checked_in ? '#dcfce7' : '#f1f5f9',
                                            color: detailModal.ticket.checked_in ? '#15803d' : '#64748b',
                                            fontWeight: 800,
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Data Information Grid */}
                            <Stack spacing={1.8}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700 }}>Nama Lengkap:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: c.textPrimary }}>{detailModal.ticket.visitor_name}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700 }}>Email:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary }}>{detailModal.ticket.visitor_email}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700 }}>No. WhatsApp / HP:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary }}>{detailModal.ticket.visitor_phone || '-'}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700 }}>Instansi / Perusahaan:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary }}>{detailModal.ticket.visitor_institution || '-'}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700 }}>Waktu Registrasi:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: c.textPrimary }}>
                                        {new Date(detailModal.ticket.created_at).toLocaleString('id-ID')}
                                    </Typography>
                                </Box>

                                {detailModal.ticket.payment && (
                                    <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#166534', display: 'block', mb: 0.5 }}>
                                            Informasi Pembayaran:
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#166534', fontWeight: 600 }}>
                                            Kode: {detailModal.ticket.payment.payment_code} &bull; Total: Rp {Number(detailModal.ticket.payment.total_amount).toLocaleString('id-ID')} ({detailModal.ticket.payment.status.toUpperCase()})
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </DialogContent>

                        <DialogActions sx={{ p: 2, px: 2.5, borderTop: `1px solid ${c.cardBorder}`, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<ContentCopyIcon />}
                                    onClick={() => copyTicketLink(detailModal.ticket.ticket_code)}
                                    sx={{ textTransform: 'none', borderRadius: '8px' }}
                                >
                                    {copySuccess ? 'Link Tersalin!' : 'Salin Link E-Tiket'}
                                </Button>
                                {detailModal.ticket.visitor_phone && (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<WhatsAppIcon />}
                                        component="a"
                                        href={generateWhatsAppUrl(detailModal.ticket)}
                                        target="_blank"
                                        sx={{ bgcolor: '#16a34a', textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#15803d' } }}
                                    >
                                        WhatsApp
                                    </Button>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<PrintIcon />}
                                    component="a"
                                    href={route('admin.visitorTickets.printBadge', detailModal.ticket.id)}
                                    target="_blank"
                                    sx={{ bgcolor: '#8b5cf6', textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#7c3aed' } }}
                                >
                                    Cetak Lanyard
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleToggleCheckIn(detailModal.ticket.id)}
                                    sx={{
                                        bgcolor: detailModal.ticket.checked_in ? '#ef4444' : '#10b981',
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 800,
                                        '&:hover': { bgcolor: detailModal.ticket.checked_in ? '#dc2626' : '#059669' }
                                    }}
                                >
                                    {detailModal.ticket.checked_in ? 'Batal Check In' : 'Check In Sekarang'}
                                </Button>
                            </Box>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* MODAL 2: EDIT VISITOR DATA */}
            <Dialog open={editModal.open} onClose={() => setEditModal({ open: false, ticket: null })} maxWidth="sm" fullWidth>
                <form onSubmit={handleEditSubmit}>
                    <DialogTitle sx={{ fontWeight: 800, color: c.textPrimary, borderBottom: `1px solid ${c.cardBorder}` }}>
                        ✏️ Edit Data Pengunjung
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2.5 }}>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                label="Nama Lengkap *"
                                value={editData.visitor_name}
                                onChange={(e) => setEditData('visitor_name', e.target.value)}
                                fullWidth
                                size="small"
                                required
                            />
                            <TextField
                                label="Email *"
                                type="email"
                                value={editData.visitor_email}
                                onChange={(e) => setEditData('visitor_email', e.target.value)}
                                fullWidth
                                size="small"
                                required
                            />
                            <TextField
                                label="No. WhatsApp / HP"
                                value={editData.visitor_phone}
                                onChange={(e) => setEditData('visitor_phone', e.target.value)}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Instansi / Perusahaan"
                                value={editData.visitor_institution}
                                onChange={(e) => setEditData('visitor_institution', e.target.value)}
                                fullWidth
                                size="small"
                            />
                            <FormControl fullWidth size="small">
                                <InputLabel>Status Tiket</InputLabel>
                                <Select
                                    value={editData.status}
                                    label="Status Tiket"
                                    onChange={(e) => setEditData('status', e.target.value)}
                                >
                                    <MenuItem value="active">Active (Aktif)</MenuItem>
                                    <MenuItem value="pending">Pending (Menunggu Pembayaran)</MenuItem>
                                    <MenuItem value="cancelled">Cancelled (Dibatalkan)</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, borderTop: `1px solid ${c.cardBorder}` }}>
                        <Button onClick={() => setEditModal({ open: false, ticket: null })} sx={{ textTransform: 'none' }}>
                            Batal
                        </Button>
                        <Button type="submit" variant="contained" disabled={editProcessing} sx={{ bgcolor: '#10b981', textTransform: 'none', fontWeight: 800 }}>
                            {editProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* MODAL 3: QUICK ONSITE REGISTRATION */}
            <Dialog open={onsiteModalOpen} onClose={() => setOnsiteModalOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleOnsiteSubmit}>
                    <DialogTitle sx={{ fontWeight: 800, color: c.textPrimary, borderBottom: `1px solid ${c.cardBorder}` }}>
                        👤 Registrasi Pengunjung Onsite
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2.5 }}>
                        <Typography variant="body2" sx={{ color: c.textMuted, mb: 2, mt: 1 }}>
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
                    <DialogActions sx={{ p: 2, borderTop: `1px solid ${c.cardBorder}` }}>
                        <Button onClick={() => setOnsiteModalOpen(false)} sx={{ textTransform: 'none' }}>
                            Batal
                        </Button>
                        <Button type="submit" variant="contained" disabled={onsiteProcessing} sx={{ bgcolor: '#10b981', textTransform: 'none', fontWeight: 800 }}>
                            {onsiteProcessing ? 'Mendaftarkan...' : 'Terbitkan Tiket Onsite'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* MODAL 4: PROOF OF PAYMENT LIGHTBOX */}
            <Dialog open={proofModal.open} onClose={() => setProofModal({ open: false, payment: null })} maxWidth="md" fullWidth>
                {proofModal.payment && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: `1px solid ${c.cardBorder}` }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                📄 Bukti Transfer: {proofModal.payment.payment_code}
                            </Typography>
                            <IconButton onClick={() => setProofModal({ open: false, payment: null })} size="small">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: 2.5, textAlign: 'center', bgcolor: '#000' }}>
                            <Box
                                component="img"
                                src={proofModal.payment.proof_of_payment?.startsWith('http') || proofModal.payment.proof_of_payment?.startsWith('/') 
                                    ? proofModal.payment.proof_of_payment 
                                    : `/storage/${proofModal.payment.proof_of_payment}`}
                                alt="Bukti Transfer"
                                sx={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }}
                            />
                        </DialogContent>
                        <DialogActions sx={{ p: 2, justifyContent: 'space-between', borderTop: `1px solid ${c.cardBorder}` }}>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#d97706' }}>
                                Total Tagihan: Rp {Number(proofModal.payment.total_amount || 0).toLocaleString('id-ID')}
                            </Typography>
                            {proofModal.payment.status === 'pending' && (
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => {
                                            setRejectModal({ open: true, paymentId: proofModal.payment.id, notes: '' });
                                        }}
                                        sx={{ textTransform: 'none', fontWeight: 800 }}
                                    >
                                        Tolak
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleVerifyPayment(proofModal.payment.id)}
                                        sx={{ bgcolor: '#10b981', textTransform: 'none', fontWeight: 800, '&:hover': { bgcolor: '#059669' } }}
                                    >
                                        Setujui & Aktifkan Tiket
                                    </Button>
                                </Stack>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* MODAL 5: REJECT PAYMENT NOTES */}
            <Dialog open={rejectModal.open} onClose={() => setRejectModal({ open: false, paymentId: null, notes: '' })} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800, color: '#ef4444' }}>
                    Alasan Penolakan Pembayaran
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        label="Catatan Penolakan untuk Pengunjung"
                        placeholder="Contoh: Nominal transfer kurang, foto bukti buram, dll."
                        value={rejectModal.notes}
                        onChange={(e) => setRejectModal(prev => ({ ...prev, notes: e.target.value }))}
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setRejectModal({ open: false, paymentId: null, notes: '' })} sx={{ textTransform: 'none' }}>
                        Batal
                    </Button>
                    <Button onClick={handleRejectPaymentSubmit} variant="contained" color="error" sx={{ textTransform: 'none', fontWeight: 800 }}>
                        Tolak Pembayaran
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
