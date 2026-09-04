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
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';

const CATEGORY_META = {
    iagi_member_professional: {
        label: 'IAGI Member - Professional',
        shortLabel: 'IAGI PRO',
        bg: '#dcfce7',
        color: '#15803d',
        border: '#86efac',
    },
    non_iagi_member_professional: {
        label: 'Non IAGI Member - Professional',
        shortLabel: 'NON-IAGI PRO',
        bg: '#e0f2fe',
        color: '#0369a1',
        border: '#7dd3fc',
    },
    iagi_member_expatriate: {
        label: 'IAGI Member - Expatriate',
        shortLabel: 'IAGI EXPAT',
        bg: '#ede9fe',
        color: '#6d28d9',
        border: '#c4b5fd',
    },
    non_iagi_member_expatriate: {
        label: 'Non IAGI Member - Expatriate',
        shortLabel: 'NON-IAGI EXPAT',
        bg: '#ede9fe',
        color: '#5b21b6',
        border: '#c4b5fd',
    },
    student_undergraduate: {
        label: 'Student Undergraduate',
        shortLabel: 'STUDENT',
        bg: '#e0e7ff',
        color: '#3730a3',
        border: '#a5b4fc',
    },
    exclusive: {
        label: 'Visitor Exclusive (VIP)',
        shortLabel: 'EXCLUSIVE VIP',
        bg: '#fef3c7',
        color: '#92400e',
        border: '#fde68a',
    },
    non_exclusive: {
        label: 'Visitor Non-Exclusive',
        shortLabel: 'NON-EXCLUSIVE',
        bg: '#ecfdf5',
        color: '#047857',
        border: '#a7f3d0',
    },
};

const getCategoryMeta = (type) => CATEGORY_META[type] || CATEGORY_META.non_exclusive;

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

    const handleResetFilters = () => {
        setSearchTerm('');
        setTypeFilter('all');
        setCheckedInFilter('all');
        setStatusFilter('all');
        navigateFilters({ search: '', type: 'all', checked_in: 'all', status: 'all', page: 1 });
    };

    const handlePageChange = (_, page) => {
        navigateFilters({ page });
    };

    // Quick Clickable Stat Card Filter
    const handleStatCardClick = (statKey) => {
        if (statKey === 'all') {
            handleResetFilters();
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

    const handleResendEmail = (ticketId, email) => {
        if (confirm(`Kirim ulang E-Tiket ke email "${email}"?`)) {
            router.post(route('admin.visitorTickets.resendEmail', ticketId), {}, {
                preserveScroll: true,
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
        const catLabel = getCategoryMeta(ticket.visitor_type).label;
        const msg = encodeURIComponent(
            `Halo Bapak/Ibu ${ticket.visitor_name},\n\nTerima kasih telah mendaftar sebagai *${catLabel}* pada Konferensi *55th PIT IAGI & GEOSEA XIX 2026*.\n\nBerikut adalah link E-Tiket Digital & Kartu Lanyard resmi Anda:\n👉 ${ticketUrl}\n\n*Kode Tiket:* ${ticket.ticket_code}\n\nHarap tunjukkan QR Code pada link di atas kepada petugas di pintu masuk / gate scanner saat hari acara. Sampai jumpa di lokasi!\n\n_Sekretariat Panitia IAGI-GEOSEA 2026_`
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

    const statCards = [
        { key: 'all', label: 'Total Pengunjung', value: stats.totalVisitors || 0, icon: <PeopleIcon />, color: '#059669', shadow: '#047857', bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', badgeBg: '#10b981' },
        { key: 'exclusive', label: 'Exclusive (VIP)', value: stats.exclusivePaidCount || 0, icon: <StarIcon />, color: '#d97706', shadow: '#b45309', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', badgeBg: '#f59e0b' },
        { key: 'non_exclusive', label: 'Non-Exclusive (Free)', value: stats.nonExclusiveCount || 0, icon: <ConfirmationNumberIcon />, color: '#0284c7', shadow: '#0369a1', bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', badgeBg: '#0ea5e9' },
        { key: 'checked_in', label: 'Checked In Gate', value: stats.checkedInCount || 0, icon: <HowToRegIcon />, color: '#0891b2', shadow: '#0e7490', bg: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)', badgeBg: '#06b6d4' },
        { key: 'pending', label: 'Pending Verif', value: stats.pendingVerificationCount || 0, icon: <PaidIcon />, color: '#ea580c', shadow: '#c2410c', bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', badgeBg: '#f97316' },
        { key: 'revenue', label: 'Total Revenue', value: `Rp ${Number(stats.totalRevenue || 0).toLocaleString('id-ID')}`, icon: <AccountBalanceWalletIcon />, color: '#7c3aed', shadow: '#6d28d9', bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', badgeBg: '#8b5cf6' },
    ];

    const hasActiveFilters = searchTerm || typeFilter !== 'all' || checkedInFilter !== 'all' || statusFilter !== 'all';

    return (
        <SidebarLayout>
            <Head title="Manajemen Tiket Penonton - Admin" />

            <Box sx={{ py: 3, px: { xs: 2, sm: 3 }, maxWidth: '1440px', mx: 'auto' }}>
                {/* 3D HEADER & QUICK ACTION BAR */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        flexWrap: 'wrap',
                        gap: 2,
                        p: 2.2,
                        px: 3,
                        borderRadius: '18px',
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 0 #e2e8f0, 0 10px 25px rgba(0,0,0,0.03)',
                    }}
                >
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.4 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 900,
                                    color: '#0f172a',
                                    letterSpacing: '-0.03em',
                                    fontSize: { xs: '1.4rem', sm: '1.75rem' },
                                }}
                            >
                                Tiket Penonton
                            </Typography>
                            <Chip
                                label="LIVE SYSTEM"
                                size="small"
                                sx={{
                                    bgcolor: '#dcfce7',
                                    color: '#15803d',
                                    fontWeight: 900,
                                    fontSize: '0.65rem',
                                    height: 20,
                                    border: '1px solid #86efac',
                                }}
                            />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.84rem' }}>
                            Pusat kendali pendaftaran pengunjung, verifikasi pembayaran, cetak lanyard ID Card, & gate check-in.
                        </Typography>
                    </Box>

                    {/* 3D Tactile Action Buttons */}
                    <Stack direction="row" spacing={1.5} flexWrap="wrap">
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={() => setOnsiteModalOpen(true)}
                            sx={{
                                background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                                color: '#ffffff',
                                fontWeight: 900,
                                fontSize: '0.82rem',
                                borderRadius: '12px',
                                textTransform: 'none',
                                px: 2.2,
                                py: 1,
                                boxShadow: '0 4px 0 #047857, 0 8px 18px rgba(16, 185, 129, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(180deg, #34d399 0%, #047857 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 5px 0 #047857, 0 10px 20px rgba(16, 185, 129, 0.4)',
                                },
                                '&:active': {
                                    transform: 'translateY(3px)',
                                    boxShadow: '0 1px 0 #047857, 0 3px 6px rgba(16, 185, 129, 0.3)',
                                },
                                transition: 'all 0.12s ease',
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
                                background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                                color: '#ffffff',
                                fontWeight: 900,
                                fontSize: '0.82rem',
                                borderRadius: '12px',
                                textTransform: 'none',
                                px: 2.2,
                                py: 1,
                                boxShadow: '0 4px 0 #075985, 0 8px 18px rgba(2, 132, 199, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(180deg, #38bdf8 0%, #075985 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 5px 0 #075985, 0 10px 20px rgba(2, 132, 199, 0.4)',
                                },
                                '&:active': {
                                    transform: 'translateY(3px)',
                                    boxShadow: '0 1px 0 #075985, 0 3px 6px rgba(2, 132, 199, 0.3)',
                                },
                                transition: 'all 0.12s ease',
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
                                bgcolor: '#ffffff',
                                borderColor: '#cbd5e1',
                                color: '#334155',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                borderRadius: '12px',
                                textTransform: 'none',
                                px: 2,
                                py: 1,
                                boxShadow: '0 3px 0 #e2e8f0',
                                '&:hover': {
                                    borderColor: '#0f172a',
                                    bgcolor: '#f8fafc',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 0 #cbd5e1',
                                },
                                '&:active': {
                                    transform: 'translateY(2px)',
                                    boxShadow: '0 1px 0 #cbd5e1',
                                },
                                transition: 'all 0.12s ease',
                            }}
                        >
                            Export CSV
                        </Button>
                    </Stack>
                </Box>

                {/* 3D TACTILE STAT CARDS */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    {statCards.map((s) => {
                        const isCardActive = 
                            (s.key === 'exclusive' && typeFilter === 'exclusive') ||
                            (s.key === 'non_exclusive' && typeFilter === 'non_exclusive') ||
                            (s.key === 'checked_in' && checkedInFilter === 'yes') ||
                            (s.key === 'pending' && statusFilter === 'pending');

                        return (
                            <Paper
                                key={s.label}
                                elevation={0}
                                onClick={() => handleStatCardClick(s.key)}
                                sx={{
                                    p: 2,
                                    borderRadius: '16px',
                                    background: s.bg,
                                    border: `1.5px solid ${isCardActive ? s.color : '#e2e8f0'}`,
                                    boxShadow: isCardActive
                                        ? `0 4px 0 ${s.shadow}, 0 8px 20px rgba(0,0,0,0.08)`
                                        : `0 4px 0 #e2e8f0, 0 6px 15px rgba(0,0,0,0.02)`,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minHeight: 90,
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 6px 0 ${s.shadow}, 0 10px 22px rgba(0,0,0,0.08)`,
                                        borderColor: s.color,
                                    },
                                    '&:active': {
                                        transform: 'translateY(2px)',
                                        boxShadow: `0 2px 0 ${s.shadow}`,
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: '#475569',
                                            fontWeight: 800,
                                            fontSize: '0.68rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.02em',
                                            lineHeight: 1.2,
                                            flex: 1,
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {s.label}
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            minWidth: 28,
                                            flexShrink: 0,
                                            borderRadius: '8px',
                                            bgcolor: s.color,
                                            color: '#ffffff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: `0 2px 6px ${s.shadow}60`,
                                        }}
                                    >
                                        {React.cloneElement(s.icon, { sx: { fontSize: 16 } })}
                                    </Box>
                                </Box>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 900,
                                        color: '#0f172a',
                                        fontSize: s.key === 'revenue' ? { xs: '0.95rem', sm: '1.05rem', xl: '1.15rem' } : { xs: '1.25rem', sm: '1.45rem' },
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1.1,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {s.value}
                                </Typography>
                            </Paper>
                        );
                    })}
                </Box>

                {/* 3D TACTILE SEARCH & FILTER CONTROL BAR */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: '16px',
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 0 #e2e8f0, 0 8px 20px rgba(0,0,0,0.02)',
                        mb: 3,
                    }}
                >
                    <Grid container spacing={1.5} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                placeholder="Cari nama, email, kode tiket, instansi..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                size="small"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#094d42', fontSize: 19 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        bgcolor: '#f8fafc',
                                        fontSize: '0.84rem',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} md={2.2}>
                            <FormControl size="small" fullWidth>
                                <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Kategori</InputLabel>
                                <Select
                                    value={typeFilter}
                                    label="Kategori"
                                    onChange={(e) => handleTypeFilterChange(e.target.value)}
                                    sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: '#f8fafc', fontWeight: 600 }}
                                >
                                    <MenuItem value="all">Semua Kategori</MenuItem>
                                    <MenuItem value="iagi_member_professional">IAGI Member - Professional</MenuItem>
                                    <MenuItem value="non_iagi_member_professional">Non IAGI Member - Professional</MenuItem>
                                    <MenuItem value="iagi_member_expatriate">IAGI Member - Expatriate</MenuItem>
                                    <MenuItem value="non_iagi_member_expatriate">Non IAGI Member - Expatriate</MenuItem>
                                    <MenuItem value="student_undergraduate">Student Undergraduate</MenuItem>
                                    <MenuItem value="exclusive">⭐ Visitor Exclusive (VIP)</MenuItem>
                                    <MenuItem value="non_exclusive">🎟️ Visitor Non-Exclusive (Free)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} sm={3} md={2.2}>
                            <FormControl size="small" fullWidth>
                                <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Status Gate</InputLabel>
                                <Select
                                    value={checkedInFilter}
                                    label="Status Gate"
                                    onChange={(e) => handleCheckedInFilterChange(e.target.value)}
                                    sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: '#f8fafc', fontWeight: 600 }}
                                >
                                    <MenuItem value="all">Semua Status</MenuItem>
                                    <MenuItem value="yes">✅ Sudah Check-In</MenuItem>
                                    <MenuItem value="no">⏳ Belum Check-In</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} sm={3} md={2.2}>
                            <FormControl size="small" fullWidth>
                                <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Status Tiket</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Status Tiket"
                                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                                    sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: '#f8fafc', fontWeight: 600 }}
                                >
                                    <MenuItem value="all">Semua Status</MenuItem>
                                    <MenuItem value="active">Active (Aktif)</MenuItem>
                                    <MenuItem value="pending">Pending (Menunggu Bayar)</MenuItem>
                                    <MenuItem value="cancelled">Cancelled (Batal)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} sm={3} md={1.4}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleResetFilters}
                                disabled={!hasActiveFilters}
                                startIcon={<RestartAltIcon />}
                                size="small"
                                sx={{
                                    borderRadius: '10px',
                                    borderColor: '#cbd5e1',
                                    color: '#475569',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.78rem',
                                    py: 0.9,
                                    bgcolor: '#f8fafc',
                                    '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' },
                                }}
                            >
                                Reset
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* FLOATING 3D BULK ACTION TOOLBAR */}
                {selectedIds.length > 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.6,
                            px: 2.5,
                            borderRadius: '14px',
                            bgcolor: '#0f172a',
                            color: '#ffffff',
                            mb: 2.5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1.5,
                            border: '1.5px solid #334155',
                            boxShadow: '0 4px 0 #020617, 0 12px 24px rgba(0,0,0,0.2)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Chip
                                label={`${selectedIds.length} Tiket Dipilih`}
                                size="small"
                                sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 900, fontSize: '0.75rem' }}
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
                                sx={{
                                    bgcolor: '#10b981',
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontWeight: 900,
                                    borderRadius: '10px',
                                    boxShadow: '0 3px 0 #047857',
                                    '&:hover': { bgcolor: '#059669' },
                                }}
                            >
                                Verifikasi Bayar
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<HowToRegIcon />}
                                onClick={() => handleBulkAction('check_in')}
                                disabled={bulkActionProcessing}
                                sx={{
                                    bgcolor: '#0284c7',
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontWeight: 900,
                                    borderRadius: '10px',
                                    boxShadow: '0 3px 0 #0369a1',
                                    '&:hover': { bgcolor: '#0369a1' },
                                }}
                            >
                                Check-In Massal
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleBulkAction('undo_check_in')}
                                disabled={bulkActionProcessing}
                                sx={{ borderColor: '#64748b', color: '#cbd5e1', textTransform: 'none', fontWeight: 800, borderRadius: '10px' }}
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
                                sx={{ textTransform: 'none', fontWeight: 900, borderRadius: '10px', boxShadow: '0 3px 0 #991b1b' }}
                            >
                                Hapus
                            </Button>
                        </Stack>
                    </Paper>
                )}

                {/* 3D TACTILE TICKETS TABLE CONTAINER */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '18px',
                        bgcolor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        boxShadow: '0 4px 0 #e2e8f0, 0 12px 28px rgba(0,0,0,0.03)',
                        overflow: 'hidden',
                    }}
                >
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <TableCell padding="checkbox" sx={{ py: 1.5, px: 1.5 }}>
                                        <Checkbox
                                            size="small"
                                            indeterminate={selectedIds.length > 0 && selectedIds.length < ticketsData.length}
                                            checked={ticketsData.length > 0 && selectedIds.length === ticketsData.length}
                                            onChange={handleSelectAll}
                                            sx={{ p: 0.5, color: '#94a3b8', '&.Mui-checked': { color: '#094d42' } }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em' }}>KODE TIKET</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em' }}>PENGUNJUNG</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em' }}>KATEGORI</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em' }}>SUMBER</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em' }}>STATUS TIKET</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em' }}>PEMBAYARAN</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em' }}>CHECK-IN GATE</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em', textAlign: 'center' }}>AKSI</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ticketsData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center" sx={{ py: 8, color: '#94a3b8' }}>
                                            <ConfirmationNumberIcon sx={{ fontSize: 50, opacity: 0.25, mb: 1, display: 'block', mx: 'auto' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b' }}>
                                                Belum ada data tiket pengunjung yang sesuai dengan filter.
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                Gunakan tombol "Registrasi Onsite" untuk menambahkan tiket baru.
                                            </Typography>
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
                                                    borderBottom: '1px solid #f1f5f9',
                                                    '&:hover': { bgcolor: '#f8fafc' },
                                                    '&.Mui-selected': { bgcolor: '#f0fdf4 !important' },
                                                }}
                                            >
                                                <TableCell padding="checkbox" sx={{ py: 1.2, px: 1.5 }}>
                                                    <Checkbox
                                                        size="small"
                                                        checked={isSelected}
                                                        onChange={() => handleSelectRow(t.id)}
                                                        sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#094d42' } }}
                                                    />
                                                </TableCell>

                                                {/* KODE TIKET */}
                                                <TableCell sx={{ py: 1.2 }}>
                                                    <Box
                                                        sx={{
                                                            display: 'inline-block',
                                                            bgcolor: isExc ? '#fef3c7' : '#f0f9ff',
                                                            border: `1px solid ${isExc ? '#fde68a' : '#bae6fd'}`,
                                                            color: isExc ? '#92400e' : '#0369a1',
                                                            px: 1,
                                                            py: 0.3,
                                                            borderRadius: '6px',
                                                            fontFamily: 'monospace',
                                                            fontWeight: 900,
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        {t.ticket_code}
                                                    </Box>
                                                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem', mt: 0.3 }}>
                                                        {new Date(t.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </Typography>
                                                </TableCell>

                                                {/* PENGUNJUNG */}
                                                <TableCell sx={{ py: 1.2 }}>
                                                    <Typography
                                                        variant="body2"
                                                        onClick={() => setDetailModal({ open: true, ticket: t })}
                                                        sx={{
                                                            fontWeight: 900,
                                                            color: '#0f172a',
                                                            cursor: 'pointer',
                                                            fontSize: '0.88rem',
                                                            '&:hover': { color: '#094d42', textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        {t.visitor_name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                                                        {t.visitor_email}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.3, flexWrap: 'wrap' }}>
                                                        {t.visitor_phone && (
                                                            <Typography variant="caption" sx={{ color: '#0369a1', fontSize: '0.68rem', fontWeight: 700 }}>
                                                                📞 {t.visitor_phone}
                                                            </Typography>
                                                        )}
                                                        {t.visitor_institution && (
                                                            <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 700, fontSize: '0.68rem' }}>
                                                                🏢 {t.visitor_institution}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>

                                                {/* KATEGORI */}
                                                <TableCell sx={{ py: 1.2 }}>
                                                    <Chip
                                                        icon={t.visitor_type === 'exclusive' ? <StarIcon sx={{ fontSize: 12, color: '#92400e !important' }} /> : undefined}
                                                        label={getCategoryMeta(t.visitor_type).shortLabel}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: getCategoryMeta(t.visitor_type).bg,
                                                            border: `1px solid ${getCategoryMeta(t.visitor_type).border}`,
                                                            color: getCategoryMeta(t.visitor_type).color,
                                                            fontWeight: 900,
                                                            fontSize: '0.65rem',
                                                            height: 22,
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* SUMBER */}
                                                <TableCell sx={{ py: 1.2 }}>
                                                    <Chip
                                                        label={t.registration_source === 'admin_onsite' ? 'Onsite' : 'Online'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: t.registration_source === 'admin_onsite' ? '#f5f3ff' : '#f8fafc',
                                                            border: `1px solid ${t.registration_source === 'admin_onsite' ? '#ddd6fe' : '#e2e8f0'}`,
                                                            color: t.registration_source === 'admin_onsite' ? '#7c3aed' : '#475569',
                                                            fontWeight: 800,
                                                            fontSize: '0.65rem',
                                                            height: 20,
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* STATUS TIKET */}
                                                <TableCell sx={{ py: 1.2 }}>
                                                    <Chip
                                                        label={t.status.toUpperCase()}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: t.status === 'active' ? '#dcfce7' : t.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                                            border: `1px solid ${t.status === 'active' ? '#86efac' : t.status === 'pending' ? '#fde68a' : '#fca5a5'}`,
                                                            color: t.status === 'active' ? '#15803d' : t.status === 'pending' ? '#b45309' : '#b91c1c',
                                                            fontWeight: 900,
                                                            fontSize: '0.64rem',
                                                            height: 20,
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* PEMBAYARAN */}
                                                <TableCell sx={{ py: 1.2 }}>
                                                    {t.payment ? (
                                                        <Box>
                                                            <Typography variant="caption" sx={{ fontWeight: 900, display: 'block', color: '#0f172a', fontSize: '0.8rem' }}>
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
                                                                        fontWeight: 900,
                                                                        border: `1px solid ${t.payment.status === 'approved' ? '#86efac' : t.payment.status === 'pending' ? '#fde68a' : '#fca5a5'}`,
                                                                    }}
                                                                />
                                                                {t.payment.proof_of_payment && (
                                                                    <Tooltip title="Lihat Bukti Transfer">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => setProofModal({ open: true, payment: t.payment })}
                                                                            sx={{ p: 0.2, color: '#0284c7' }}
                                                                        >
                                                                            <VisibilityIcon sx={{ fontSize: 15 }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Stack>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800, fontSize: '0.76rem' }}>
                                                            GRATIS
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* CHECK-IN GATE 1-CLICK TOGGLE */}
                                                <TableCell sx={{ py: 1.2 }}>
                                                    {t.checked_in ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                            <Chip
                                                                icon={<CheckCircleIcon sx={{ fontSize: 13, color: '#15803d !important' }} />}
                                                                label="CHECKED IN"
                                                                size="small"
                                                                onClick={() => handleToggleCheckIn(t.id)}
                                                                sx={{
                                                                    bgcolor: '#dcfce7',
                                                                    border: '1px solid #86efac',
                                                                    color: '#15803d',
                                                                    fontWeight: 900,
                                                                    fontSize: '0.64rem',
                                                                    height: 22,
                                                                    boxShadow: '0 2px 0 #86efac',
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
                                                                color: '#334155',
                                                                fontSize: '0.7rem',
                                                                py: 0.3,
                                                                px: 1.2,
                                                                borderRadius: '8px',
                                                                textTransform: 'none',
                                                                fontWeight: 800,
                                                                bgcolor: '#f8fafc',
                                                                boxShadow: '0 2px 0 #e2e8f0',
                                                                '&:hover': {
                                                                    borderColor: '#10b981',
                                                                    color: '#10b981',
                                                                    bgcolor: '#f0fdf4',
                                                                    transform: 'translateY(-1px)',
                                                                    boxShadow: '0 3px 0 #86efac',
                                                                },
                                                                '&:active': {
                                                                    transform: 'translateY(1px)',
                                                                    boxShadow: '0 1px 0 #86efac',
                                                                }
                                                            }}
                                                        >
                                                            Check In
                                                        </Button>
                                                    )}
                                                    {t.checked_in_at && (
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem', mt: 0.3 }}>
                                                            {new Date(t.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* 3D ACTION BUTTONS */}
                                                <TableCell sx={{ py: 1.2, textAlign: 'center' }}>
                                                    <Stack direction="row" spacing={0.4} justifyContent="center">
                                                        {/* Verify/Reject for Pending Payments */}
                                                        {t.payment && t.payment.status === 'pending' && (
                                                            <>
                                                                <Tooltip title="Setujui Pembayaran">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleVerifyPayment(t.payment.id)}
                                                                        sx={{ color: '#10b981', bgcolor: '#ecfdf5', border: '1px solid #a7f3d0', p: 0.5, borderRadius: '8px' }}
                                                                    >
                                                                        <CheckIcon sx={{ fontSize: 15 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Tolak Pembayaran">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => setRejectModal({ open: true, paymentId: t.payment.id, notes: '' })}
                                                                        sx={{ color: '#ef4444', bgcolor: '#fef2f2', border: '1px solid #fecaca', p: 0.5, borderRadius: '8px' }}
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
                                                                sx={{ color: '#0284c7', bgcolor: '#f0f9ff', border: '1px solid #bae6fd', p: 0.5, borderRadius: '8px' }}
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
                                                                    sx={{ color: '#16a34a', bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', p: 0.5, borderRadius: '8px' }}
                                                                >
                                                                    <WhatsAppIcon sx={{ fontSize: 15 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}

                                                        {/* Email Resend Direct */}
                                                        {t.visitor_email && (
                                                            <Tooltip title="Kirim / Kirim Ulang E-Tiket ke Email">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleResendEmail(t.id, t.visitor_email)}
                                                                    sx={{ color: '#0284c7', bgcolor: '#f0f9ff', border: '1px solid #bae6fd', p: 0.5, borderRadius: '8px' }}
                                                                >
                                                                    <EmailIcon sx={{ fontSize: 15 }} />
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
                                                                sx={{ color: '#7c3aed', bgcolor: '#f5f3ff', border: '1px solid #ddd6fe', p: 0.5, borderRadius: '8px' }}
                                                            >
                                                                <PrintIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {/* Edit Visitor */}
                                                        <Tooltip title="Edit Data Pengunjung">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenEdit(t)}
                                                                sx={{ color: '#d97706', bgcolor: '#fffbeb', border: '1px solid #fde68a', p: 0.5, borderRadius: '8px' }}
                                                            >
                                                                <EditIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {/* Delete Visitor */}
                                                        <Tooltip title="Hapus Tiket">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDeleteVisitor(t.id, t.visitor_name)}
                                                                sx={{ color: '#ef4444', bgcolor: '#fef2f2', border: '1px solid #fecaca', p: 0.5, borderRadius: '8px' }}
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
                        <Box sx={{ p: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                                Menampilkan halaman {currentPage} dari {lastPage} &bull; Total {totalItems} pengunjung terdaftar
                            </Typography>
                            <Pagination
                                count={lastPage}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                size="small"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        borderRadius: '8px',
                                        fontWeight: 800,
                                    },
                                    '& .Mui-selected': {
                                        bgcolor: '#094d42 !important',
                                        color: '#ffffff',
                                    }
                                }}
                            />
                        </Box>
                    )}
                </Paper>
            </Box>

            {/* MODAL 1: COMPREHENSIVE VISITOR TICKET DETAIL */}
            <Dialog
                open={detailModal.open}
                onClose={() => setDetailModal({ open: false, ticket: null })}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    }
                }}
            >
                {detailModal.ticket && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, borderBottom: '1px solid #e2e8f0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ConfirmationNumberIcon sx={{ color: '#094d42' }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                    Detail Tiket Penonton
                                </Typography>
                            </Box>
                            <IconButton onClick={() => setDetailModal({ open: false, ticket: null })} size="small">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent sx={{ p: 3 }}>
                            {/* Top QR Code + Badge Box */}
                            <Box sx={{ textAlign: 'center', p: 2.5, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3 }}>
                                <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: '12px', width: 'fit-content', mx: 'auto', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', mb: 1.5 }}>
                                    <QRCodeSVG value={detailModal.ticket.ticket_code} size={130} level="H" />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: 'monospace', color: '#094d42', letterSpacing: '0.05em' }}>
                                    {detailModal.ticket.ticket_code}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                                    <Chip
                                        label={getCategoryMeta(detailModal.ticket.visitor_type).label}
                                        size="small"
                                        sx={{
                                            bgcolor: getCategoryMeta(detailModal.ticket.visitor_type).bg,
                                            color: getCategoryMeta(detailModal.ticket.visitor_type).color,
                                            border: `1px solid ${getCategoryMeta(detailModal.ticket.visitor_type).border}`,
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
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Nama Lengkap:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>{detailModal.ticket.visitor_name}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Email:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>{detailModal.ticket.visitor_email}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>No. WhatsApp / HP:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>{detailModal.ticket.visitor_phone || '-'}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Instansi / Perusahaan:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>{detailModal.ticket.visitor_institution || '-'}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Waktu Registrasi:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                                        {new Date(detailModal.ticket.created_at).toLocaleString('id-ID')}
                                    </Typography>
                                </Box>

                                {detailModal.ticket.payment && (
                                    <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#166534', display: 'block', mb: 0.5 }}>
                                            Informasi Pembayaran:
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#166534', fontWeight: 700 }}>
                                            Kode: {detailModal.ticket.payment.payment_code} &bull; Total: Rp {Number(detailModal.ticket.payment.total_amount).toLocaleString('id-ID')} ({detailModal.ticket.payment.status.toUpperCase()})
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </DialogContent>

                        <DialogActions sx={{ p: 2, px: 2.5, borderTop: '1px solid #e2e8f0', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<ContentCopyIcon />}
                                    onClick={() => copyTicketLink(detailModal.ticket.ticket_code)}
                                    sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}
                                >
                                    {copySuccess ? 'Link Tersalin!' : 'Salin Link'}
                                </Button>
                                {detailModal.ticket.visitor_phone && (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<WhatsAppIcon />}
                                        component="a"
                                        href={generateWhatsAppUrl(detailModal.ticket)}
                                        target="_blank"
                                        sx={{ bgcolor: '#16a34a', textTransform: 'none', borderRadius: '8px', fontWeight: 800, '&:hover': { bgcolor: '#15803d' } }}
                                    >
                                        WhatsApp
                                    </Button>
                                )}
                                {detailModal.ticket.visitor_email && (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<EmailIcon />}
                                        onClick={() => handleResendEmail(detailModal.ticket.id, detailModal.ticket.visitor_email)}
                                        sx={{ bgcolor: '#0284c7', textTransform: 'none', borderRadius: '8px', fontWeight: 800, '&:hover': { bgcolor: '#0369a1' } }}
                                    >
                                        Kirim Email
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
                                    sx={{ bgcolor: '#8b5cf6', textTransform: 'none', borderRadius: '8px', fontWeight: 800, '&:hover': { bgcolor: '#7c3aed' } }}
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
                                        fontWeight: 900,
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
            <Dialog open={editModal.open} onClose={() => setEditModal({ open: false, ticket: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
                <form onSubmit={handleEditSubmit}>
                    <DialogTitle sx={{ fontWeight: 900, color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>
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
                    <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                        <Button onClick={() => setEditModal({ open: false, ticket: null })} sx={{ textTransform: 'none' }}>
                            Batal
                        </Button>
                        <Button type="submit" variant="contained" disabled={editProcessing} sx={{ bgcolor: '#10b981', textTransform: 'none', fontWeight: 900, borderRadius: '8px' }}>
                            {editProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* MODAL 3: QUICK ONSITE REGISTRATION */}
            <Dialog open={onsiteModalOpen} onClose={() => setOnsiteModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
                <form onSubmit={handleOnsiteSubmit}>
                    <DialogTitle sx={{ fontWeight: 900, color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>
                        👤 Registrasi Pengunjung Onsite
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, mt: 1 }}>
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
                                    <MenuItem value="iagi_member_professional">IAGI Member - Professional (Rp 3.000.000)</MenuItem>
                                    <MenuItem value="non_iagi_member_professional">Non IAGI Member - Professional (Rp 4.000.000)</MenuItem>
                                    <MenuItem value="iagi_member_expatriate">IAGI Member - Expatriate (Rp 6.000.000)</MenuItem>
                                    <MenuItem value="non_iagi_member_expatriate">Non IAGI Member - Expatriate (Rp 7.000.000)</MenuItem>
                                    <MenuItem value="student_undergraduate">Student Undergraduate (Rp 1.000.000)</MenuItem>
                                    <MenuItem value="exclusive">Visitor Exclusive VIP (Rp 500.000)</MenuItem>
                                    <MenuItem value="non_exclusive">Visitor Non-Exclusive (Gratis / Rp 0)</MenuItem>
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

                            {onsiteData.visitor_type !== 'non_exclusive' && (
                                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block', mb: 1 }}>
                                        Status Pembayaran Onsite:
                                    </Typography>
                                    <RadioGroup
                                        value={onsiteData.payment_status}
                                        onChange={(e) => setOnsiteData('payment_status', e.target.value)}
                                    >
                                        <FormControlLabel value="paid_cash" control={<Radio size="small" />} label="Lunas Tunai / EDC / QRIS di Lokasi" />
                                        <FormControlLabel value="free_bypass" control={<Radio size="small" />} label="Gratis (VIP Invitation / Sponsor Bypass)" />
                                        <FormControlLabel value="pending" control={<Radio size="small" />} label="Belum Lunas (Pending)" />
                                    </RadioGroup>
                                </Box>
                            )}
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                        <Button onClick={() => setOnsiteModalOpen(false)} sx={{ textTransform: 'none' }}>
                            Batal
                        </Button>
                        <Button type="submit" variant="contained" disabled={onsiteProcessing} sx={{ bgcolor: '#10b981', textTransform: 'none', fontWeight: 900, borderRadius: '8px' }}>
                            {onsiteProcessing ? 'Mendaftarkan...' : 'Terbitkan Tiket Onsite'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* MODAL 4: PROOF OF PAYMENT LIGHTBOX */}
            <Dialog open={proofModal.open} onClose={() => setProofModal({ open: false, payment: null })} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
                {proofModal.payment && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                                📄 Bukti Transfer: {proofModal.payment.payment_code}
                            </Typography>
                            <IconButton onClick={() => setProofModal({ open: false, payment: null })} size="small">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: 2.5, textAlign: 'center', bgcolor: '#0f172a' }}>
                            <Box
                                component="img"
                                src={proofModal.payment.proof_of_payment?.startsWith('http') || proofModal.payment.proof_of_payment?.startsWith('/') 
                                    ? proofModal.payment.proof_of_payment 
                                    : `/storage/${proofModal.payment.proof_of_payment}`}
                                alt="Bukti Transfer"
                                sx={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                            />
                        </DialogContent>
                        <DialogActions sx={{ p: 2, justifyContent: 'space-between', borderTop: '1px solid #e2e8f0' }}>
                            <Typography variant="body2" sx={{ fontWeight: 900, color: '#d97706' }}>
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
                                        sx={{ textTransform: 'none', fontWeight: 900, borderRadius: '8px' }}
                                    >
                                        Tolak
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleVerifyPayment(proofModal.payment.id)}
                                        sx={{ bgcolor: '#10b981', textTransform: 'none', fontWeight: 900, borderRadius: '8px', '&:hover': { bgcolor: '#059669' } }}
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
            <Dialog open={rejectModal.open} onClose={() => setRejectModal({ open: false, paymentId: null, notes: '' })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
                <DialogTitle sx={{ fontWeight: 900, color: '#ef4444' }}>
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
                    <Button onClick={handleRejectPaymentSubmit} variant="contained" color="error" sx={{ textTransform: 'none', fontWeight: 900, borderRadius: '8px' }}>
                        Tolak Pembayaran
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
