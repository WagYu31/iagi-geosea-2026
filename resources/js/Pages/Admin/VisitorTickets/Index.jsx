import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
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
    Menu,
    MenuItem,
    ListSubheader,
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
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BlockIcon from '@mui/icons-material/Block';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DiscountIcon from '@mui/icons-material/Discount';
import PercentIcon from '@mui/icons-material/Percent';

const CATEGORY_META = {
    // 1. Participant
    iagi_member_professional: {
        label: 'Participant - Professional (Member)',
        shortLabel: 'PRO (MEMBER)',
        bg: '#dcfce7',
        color: '#15803d',
        border: '#86efac',
    },
    non_iagi_member_professional: {
        label: 'Participant - Professional (Non-Member)',
        shortLabel: 'PRO (NON-MEMBER)',
        bg: '#e0f2fe',
        color: '#0369a1',
        border: '#7dd3fc',
    },
    iagi_member_expatriate: {
        label: 'Participant - Expatriate (Member)',
        shortLabel: 'EXPAT (MEMBER)',
        bg: '#ede9fe',
        color: '#6d28d9',
        border: '#c4b5fd',
    },
    non_iagi_member_expatriate: {
        label: 'Participant - Expatriate (Non-Member)',
        shortLabel: 'EXPAT (NON-MEMBER)',
        bg: '#ede9fe',
        color: '#5b21b6',
        border: '#c4b5fd',
    },
    student_undergraduate: {
        label: 'Participant - Student Undergraduate',
        shortLabel: 'STUDENT',
        bg: '#e0e7ff',
        color: '#3730a3',
        border: '#a5b4fc',
    },
    dosen: {
        label: 'Participant - Dosen',
        shortLabel: 'DOSEN',
        bg: '#fef3c7',
        color: '#b45309',
        border: '#fde68a',
    },


    // 2. Technical (Free / Invited)
    presenter: {
        label: 'Presenter',
        shortLabel: 'PRESENTER',
        bg: '#ecfdf5',
        color: '#004C23',
        border: '#a7f3d0',
    },
    student: {
        label: 'Presenter',
        shortLabel: 'PRESENTER',
        bg: '#ecfdf5',
        color: '#004C23',
        border: '#a7f3d0',
    },
    invited_speaker: {
        label: 'Invited Speaker',
        shortLabel: 'INVITED SPEAKER',
        bg: '#fdf2f8',
        color: '#9d174d',
        border: '#fbcfe8',
    },
    session_chair_judge: {
        label: 'Session Chair / Judge',
        shortLabel: 'CHAIR / JUDGE',
        bg: '#ecfeff',
        color: '#0e7490',
        border: '#a5f3fc',
    },
    session_chair: {
        label: 'Session Chair',
        shortLabel: 'CHAIR',
        bg: '#ecfeff',
        color: '#0e7490',
        border: '#a5f3fc',
    },
    judge: {
        label: 'Judge',
        shortLabel: 'JUDGE',
        bg: '#ecfeff',
        color: '#0e7490',
        border: '#a5f3fc',
    },
    oral: {
        label: 'Oral Presenter',
        shortLabel: 'ORAL PRESENTER',
        bg: '#f0fdfa',
        color: '#0f766e',
        border: '#99f6e4',
    },
    oral_presenter: {
        label: 'Oral Presenter',
        shortLabel: 'ORAL PRESENTER',
        bg: '#f0fdfa',
        color: '#0f766e',
        border: '#99f6e4',
    },
    poster: {
        label: 'Poster Presenter',
        shortLabel: 'POSTER PRESENTER',
        bg: '#fdf4ff',
        color: '#a21caf',
        border: '#f5d0fe',
    },
    poster_presenter: {
        label: 'Poster Presenter',
        shortLabel: 'POSTER PRESENTER',
        bg: '#fdf4ff',
        color: '#a21caf',
        border: '#f5d0fe',
    },

    // 3. Visitor
    non_exclusive: {
        label: 'Visitor Pass (Free)',
        shortLabel: 'VISITOR',
        bg: '#ecfdf5',
        color: '#047857',
        border: '#a7f3d0',
    },

    // 3. VIP
    vip: {
        label: 'VIP',
        shortLabel: 'VIP',
        bg: '#fef3c7',
        color: '#92400e',
        border: '#fde68a',
    },

    // 4. Keynote Speaker
    speaker: {
        label: 'Keynote Speaker',
        shortLabel: 'KEYNOTE SPEAKER',
        bg: '#fdf2f8',
        color: '#9d174d',
        border: '#fbcfe8',
    },
    keynote_speech: {
        label: 'Keynote Speaker',
        shortLabel: 'KEYNOTE SPEAKER',
        bg: '#fdf2f8',
        color: '#9d174d',
        border: '#fbcfe8',
    },
    keynote_speaker: {
        label: 'Keynote Speaker',
        shortLabel: 'KEYNOTE SPEAKER',
        bg: '#fdf2f8',
        color: '#9d174d',
        border: '#fbcfe8',
    },

    // 5. Panelist
    panelist: {
        label: 'Panelist',
        shortLabel: 'PANELIST',
        bg: '#f5f3ff',
        color: '#5b21b6',
        border: '#ddd6fe',
    },

    // 6. Moderator
    moderator: {
        label: 'Moderator',
        shortLabel: 'MODERATOR',
        bg: '#ecfeff',
        color: '#155e75',
        border: '#a5f3fc',
    },

    // 7. Exhibition
    exhibition: {
        label: 'Exhibition',
        shortLabel: 'EXHIBITION',
        bg: '#fff7ed',
        color: '#9a3412',
        border: '#fed7aa',
    },

    // 8. Committee
    committee: {
        label: 'Committee',
        shortLabel: 'COMMITTEE',
        bg: '#eff6ff',
        color: '#1e40af',
        border: '#bfdbfe',
    },

    // 9. Student Volunteer
    student_volunteer: {
        label: 'Student Volunteer',
        shortLabel: 'STUDENT VOLUNTEER',
        bg: '#f0fdf4',
        color: '#166534',
        border: '#bbf7d0',
    },

    // 10. Board
    board: {
        label: 'Board',
        shortLabel: 'BOARD',
        bg: '#fef3c7',
        color: '#b45309',
        border: '#fde68a',
    },

    // 11. Delegate
    sponsorship: {
        label: 'Delegate',
        shortLabel: 'DELEGATE',
        bg: '#ecfdf5',
        color: '#065f46',
        border: '#a7f3d0',
    },
    sponsor: {
        label: 'Delegate',
        shortLabel: 'DELEGATE',
        bg: '#ecfdf5',
        color: '#065f46',
        border: '#a7f3d0',
    },
    delegate: {
        label: 'Delegate',
        shortLabel: 'DELEGATE',
        bg: '#ecfdf5',
        color: '#065f46',
        border: '#a7f3d0',
    },

    // 12. Student Crowd
    student_crowd: {
        label: 'Student Crowd',
        shortLabel: 'STUDENT CROWD',
        bg: '#f0fdf4',
        color: '#15803d',
        border: '#86efac',
    },
};

const getCategoryMeta = (type) => CATEGORY_META[type] || CATEGORY_META.non_exclusive;

const CATEGORY_PRICES = {
    'iagi_member_professional': 3000000,
    'non_iagi_member_professional': 4000000,
    'iagi_member_expatriate': 6000000,
    'non_iagi_member_expatriate': 7000000,
    'student_undergraduate': 1000000,
    'dosen': 1500000,
    'exclusive': 500000,
    'non_exclusive': 0,
    'vip': 0,
    'speaker': 0,
    'keynote_speech': 0,
    'keynote_speaker': 0,
    'panelist': 0,
    'moderator': 0,
    'exhibition': 0,
    'committee': 0,
    'student_volunteer': 0,
    'board': 0,
    'sponsorship': 0,
    'sponsor': 0,
    'delegate': 0,
    'student_crowd': 0,
    'presenter': 0,
    'invited_speaker': 0,
    'student': 0,
    'session_chair_judge': 0,
    'session_chair': 0,
    'judge': 0,
    'oral': 0,
    'oral_presenter': 0,
    'poster': 0,
    'poster_presenter': 0,
};

export default function VisitorTicketsIndex({
    tickets = {},
    stats = {},
    settings = {},
    filters = {},
    occupiedUniqueCodes = [],
    unpaidExcelEmails = [],
    unpaidTicketIds = [],
}) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';

    const ticketsData = tickets.data || [];
    const totalItems = tickets.total || 0;
    const currentPage = tickets.current_page || 1;
    const lastPage = tickets.last_page || 1;

    const { auth } = usePage().props;
    const isScanner = auth?.user?.role?.toLowerCase() === 'scanner' || auth?.user?.role?.toLowerCase() === 'scaner';

    // Passcode Security for Visitor Tickets (Password: del08)
    const VISITOR_TICKETS_PASSCODE = 'del08';
    const [isUnlocked, setIsUnlocked] = useState(() => {
        if (typeof window !== 'undefined') {
            if (auth?.user?.role?.toLowerCase() === 'scanner' || auth?.user?.role?.toLowerCase() === 'scaner') {
                return true;
            }
            return sessionStorage.getItem('visitor_tickets_unlocked') === 'true';
        }
        return false;
    });
    const [directPasscode, setDirectPasscode] = useState('');
    const [directPasscodeError, setDirectPasscodeError] = useState('');
    const [showDirectPasscode, setShowDirectPasscode] = useState(false);

    const handleUnlockDirect = (e) => {
        if (e) e.preventDefault();
        if (directPasscode.trim() === VISITOR_TICKETS_PASSCODE) {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('visitor_tickets_unlocked', 'true');
            }
            setIsUnlocked(true);
            setDirectPasscodeError('');
            setDirectPasscode('');
        } else {
            setDirectPasscodeError('Sandi salah! Akses ditolak.');
            setDirectPasscode('');
        }
    };

    // When leaving the Visitor Tickets page, automatically re-lock it
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('visitor_tickets_unlocked');
            }
        };
    }, []);

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
    const [registrationTypeFilter, setRegistrationTypeFilter] = useState(filters.registration_type || 'all');
    const [checkedInFilter, setCheckedInFilter] = useState(filters.checked_in || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [debtFilter, setDebtFilter] = useState(filters.debt || 'all');
    const [emailSentFilter, setEmailSentFilter] = useState(filters.email_sent || 'all');
    const [unpaidExcelFilter, setUnpaidExcelFilter] = useState(filters.unpaid_excel || 'all');
    const [sentTicketIds, setSentTicketIds] = useState([]);

    // Multi-select state (persisted in localStorage so red mark doesn't disappear on refresh)
    const [selectedIds, setSelectedIds] = useState(() => {
        try {
            const saved = localStorage.getItem('visitor_tickets_selected_ids');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error('Failed to load selectedIds from localStorage', e);
        }
        return [];
    });

    useEffect(() => {
        try {
            localStorage.setItem('visitor_tickets_selected_ids', JSON.stringify(selectedIds));
        } catch (e) {
            console.error('Failed to save selectedIds to localStorage', e);
        }
    }, [selectedIds]);

    // Dialog states
    const [onsiteModalOpen, setOnsiteModalOpen] = useState(false);
    const [unpaidModalOpen, setUnpaidModalOpen] = useState(false);
    const [unpaidFile, setUnpaidFile] = useState(null);
    const [unpaidUploading, setUnpaidUploading] = useState(false);
    const [detailModal, setDetailModal] = useState({ open: false, ticket: null });
    const [editModal, setEditModal] = useState({ open: false, ticket: null });
    const [proofModal, setProofModal] = useState({ open: false, payment: null });
    const [debtApprovalModal, setDebtApprovalModal] = useState({ open: false, paymentId: null, debtNotes: '' });
    const [rejectModal, setRejectModal] = useState({ open: false, paymentId: null, notes: '' });
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [emailTargetMode, setEmailTargetMode] = useState('selected'); // 'selected' or 'filtered'
    const [emailSending, setEmailSending] = useState(false);
    const [bulkActionProcessing, setBulkActionProcessing] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Import Excel Modal state
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importSendEmail, setImportSendEmail] = useState(false);
    const [importProcessing, setImportProcessing] = useState(false);

    // Quick Status Popover Menus State
    const [ticketMenuAnchor, setTicketMenuAnchor] = useState(null);
    const [selectedTicketForStatus, setSelectedTicketForStatus] = useState(null);

    const [paymentMenuAnchor, setPaymentMenuAnchor] = useState(null);
    const [selectedPaymentForStatus, setSelectedPaymentForStatus] = useState(null);

    const [debtMenuAnchor, setDebtMenuAnchor] = useState(null);
    const [selectedPaymentForDebt, setSelectedPaymentForDebt] = useState(null);

    // Quick Category Popover Menus State
    const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
    const [selectedTicketForCategory, setSelectedTicketForCategory] = useState(null);

    const [quickDebtModal, setQuickDebtModal] = useState({
        open: false,
        payment: null,
        isDebt: true,
        debtNotes: '',
        processing: false,
    });

    // Proof & Debt Editing states (inside Proof Lightbox Modal)
    const [isEditingProof, setIsEditingProof] = useState(false);
    const [proofFile, setProofFile] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [editIsDebt, setEditIsDebt] = useState(false);
    const [editDebtNotes, setEditDebtNotes] = useState('');
    const [editStatus, setEditStatus] = useState('approved');
    const [editAdminNotes, setEditAdminNotes] = useState('');
    const [updatingProof, setUpdatingProof] = useState(false);
    const [onsiteProofPreview, setOnsiteProofPreview] = useState(null);

    // Onsite Registration Form
    const { data: onsiteData, setData: setOnsiteData, post: postOnsite, processing: onsiteProcessing, reset: resetOnsite, errors: onsiteErrors } = useForm({
        visitor_name: '',
        visitor_email: '',
        visitor_phone: '',
        visitor_institution: '',
        visitor_type: 'non_exclusive',
        payment_status: 'paid_cash',
        proof_of_payment: null,
        unique_code: 0,
        discount_type: 'none', // 'none' | 'nominal' | 'percent'
        discount_value: '',
        discount_notes: '',
    });

    // Edit Visitor & Group Registration Form
    const { data: editData, setData: setEditData, put: putEdit, processing: editProcessing, reset: resetEdit, errors: editErrors } = useForm({
        is_group_edit: true,
        visitor_name: '',
        visitor_email: '',
        visitor_phone: '',
        visitor_institution: '',
        visitor_type: 'non_exclusive',
        status: 'active',
        pic_name: '',
        pic_email: '',
        pic_phone: '',
        sync_pic_with_primary: false,
        recalculate_total: true,
        unique_code: 0,
        members: [],
        removed_ticket_ids: [],
    });

    const liveEditSubtotal = (editData.members || []).reduce((acc, m) => acc + (CATEGORY_PRICES[m.visitor_type] || 0), 0);
    const liveEditUniqueCode = Number(editData.unique_code !== undefined ? editData.unique_code : (editModal.ticket?.payment?.unique_code || 0));
    const liveEditTotal = liveEditSubtotal > 0 ? (liveEditSubtotal + liveEditUniqueCode) : 0;

    const liveOnsiteBasePrice = CATEGORY_PRICES[onsiteData.visitor_type] || 0;
    const liveOnsiteUniqueCode = parseInt(onsiteData.unique_code, 10) || 0;

    // Discount calculations (Rupiah or Percentage)
    const liveDiscountType = onsiteData.discount_type || 'none';
    const liveDiscountRawVal = parseFloat(onsiteData.discount_value) || 0;
    let liveDiscountAmount = 0;
    if (liveDiscountType === 'percent') {
        const clampedPct = Math.min(100, Math.max(0, liveDiscountRawVal));
        liveDiscountAmount = Math.round((liveOnsiteBasePrice * clampedPct) / 100);
    } else if (liveDiscountType === 'nominal') {
        liveDiscountAmount = Math.min(liveOnsiteBasePrice, Math.max(0, liveDiscountRawVal));
    }
    const livePriceAfterDiscount = Math.max(0, liveOnsiteBasePrice - liveDiscountAmount);
    const liveOnsiteTotal = livePriceAfterDiscount > 0 ? (livePriceAfterDiscount + liveOnsiteUniqueCode) : 0;

    const getNextAvailableUniqueCode = useCallback((occupied = []) => {
        const occupiedSet = new Set((occupied || []).map(Number));
        const available = [];
        for (let i = 101; i <= 999; i++) {
            if (!occupiedSet.has(i)) {
                available.push(i);
            }
        }
        if (available.length > 0) {
            return available[Math.floor(Math.random() * available.length)];
        }
        return Math.floor(1001 + Math.random() * 8998);
    }, []);

    // Automatically generate and assign collision-free unique code when modal opens or category changes
    useEffect(() => {
        if (onsiteModalOpen) {
            const basePrice = CATEGORY_PRICES[onsiteData.visitor_type] || 0;
            if (basePrice > 0) {
                if (!onsiteData.unique_code || onsiteData.unique_code === 0) {
                    const code = getNextAvailableUniqueCode(occupiedUniqueCodes);
                    setOnsiteData('unique_code', code);
                }
            } else {
                if (onsiteData.unique_code !== 0) {
                    setOnsiteData('unique_code', 0);
                }
            }
        }
    }, [onsiteModalOpen, onsiteData.visitor_type, occupiedUniqueCodes, getNextAvailableUniqueCode]);

    const searchTimer = useRef(null);

    const navigateFilters = (overrides = {}) => {
        const params = {
            search: overrides.search !== undefined ? overrides.search : searchTerm,
            type: overrides.type !== undefined ? overrides.type : typeFilter,
            registration_type: overrides.registration_type !== undefined ? overrides.registration_type : registrationTypeFilter,
            checked_in: overrides.checked_in !== undefined ? overrides.checked_in : checkedInFilter,
            status: overrides.status !== undefined ? overrides.status : statusFilter,
            debt: overrides.debt !== undefined ? overrides.debt : debtFilter,
            email_sent: overrides.email_sent !== undefined ? overrides.email_sent : emailSentFilter,
            page: overrides.page || 1,
        };

        if (!params.search) delete params.search;
        if (params.type === 'all') delete params.type;
        if (params.registration_type === 'all') delete params.registration_type;
        if (params.checked_in === 'all') delete params.checked_in;
        if (params.status === 'all') delete params.status;
        if (params.debt === 'all') delete params.debt;
        if (params.email_sent === 'all') delete params.email_sent;
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

    const handleRegistrationTypeFilterChange = (val) => {
        setRegistrationTypeFilter(val);
        navigateFilters({ registration_type: val, page: 1 });
    };

    const handleCheckedInFilterChange = (val) => {
        setCheckedInFilter(val);
        navigateFilters({ checked_in: val, page: 1 });
    };

    const handleStatusFilterChange = (val) => {
        setStatusFilter(val);
        navigateFilters({ status: val, page: 1 });
    };

    const handleDebtFilterChange = (val) => {
        setDebtFilter(val);
        navigateFilters({ debt: val, page: 1 });
    };

    const handleEmailSentFilterChange = (val) => {
        setEmailSentFilter(val);
        navigateFilters({ email_sent: val, page: 1 });
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setTypeFilter('all');
        setRegistrationTypeFilter('all');
        setCheckedInFilter('all');
        setStatusFilter('all');
        setDebtFilter('all');
        setEmailSentFilter('all');
        navigateFilters({ search: '', type: 'all', registration_type: 'all', checked_in: 'all', status: 'all', debt: 'all', email_sent: 'all', page: 1 });
    };

    const handlePageChange = (_, page) => {
        navigateFilters({ page });
    };

    // Quick Clickable Stat Card Filter
    const handleStatCardClick = (statKey) => {
        if (statKey === 'all') {
            handleResetFilters();
        } else if (statKey === 'email_sent') {
            setEmailSentFilter('sent');
            navigateFilters({ email_sent: 'sent', page: 1 });
        } else if (statKey === 'non_exclusive') {
            setTypeFilter('non_exclusive');
            navigateFilters({ type: 'non_exclusive', page: 1 });
        } else if (statKey === 'checked_in') {
            setCheckedInFilter('yes');
            navigateFilters({ checked_in: 'yes', page: 1 });
        } else if (statKey === 'pending') {
            setStatusFilter('pending');
            navigateFilters({ status: 'pending', page: 1 });
        } else if (statKey === 'debt') {
            setDebtFilter('debt');
            navigateFilters({ debt: 'debt', page: 1 });
        }
    };

    // Open Proof of Payment Lightbox Modal
    const handleOpenProofModal = (payment) => {
        setProofModal({ open: true, payment });
        setIsEditingProof(false);
        setProofFile(null);
        setProofPreview(null);
        setEditIsDebt(Boolean(payment?.is_debt));
        setEditDebtNotes(payment?.debt_notes || '');
        setEditStatus(payment?.status || 'approved');
        setEditAdminNotes(payment?.notes || '');
    };

    // Handle File upload change for proof
    const handleProofFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProofFile(file);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => setProofPreview(ev.target.result);
                reader.readAsDataURL(file);
            } else {
                setProofPreview(null);
            }
        }
    };

    // Handle updating payment proof & debt status submit
    const handleUpdatePaymentProofSubmit = (e) => {
        if (e) e.preventDefault();
        if (!proofModal.payment) return;

        setUpdatingProof(true);
        const formData = new FormData();
        if (proofFile) {
            formData.append('proof_of_payment', proofFile);
        }
        formData.append('is_debt', editIsDebt ? '1' : '0');
        formData.append('debt_notes', editDebtNotes || '');
        formData.append('notes', editAdminNotes || '');
        formData.append('status', editStatus || proofModal.payment.status);

        router.post(route('admin.visitorTickets.updatePaymentProof', proofModal.payment.id), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setUpdatingProof(false);
                setProofModal({ open: false, payment: null });
                setIsEditingProof(false);
                setProofFile(null);
                setProofPreview(null);
            },
            onError: () => {
                setUpdatingProof(false);
            }
        });
    };

    // Settle Debt Quick Action (Cabut Tag Hutang)
    const handleSettleDebtQuick = (paymentId) => {
        if (confirm('Clear INVOICE TAG and mark this payment as fully PAID?')) {
            router.patch(route('admin.visitorTickets.toggleDebt', paymentId), {
                is_debt: false,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setProofModal({ open: false, payment: null });
                }
            });
        }
    };

    // Handle Approval with Debt Tag Submit
    const handleVerifyWithDebtSubmit = () => {
        if (!debtApprovalModal.paymentId) return;
        router.patch(route('admin.visitorTickets.verifyPayment', debtApprovalModal.paymentId), {
            is_debt: true,
            debt_notes: debtApprovalModal.debtNotes,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setDebtApprovalModal({ open: false, paymentId: null, debtNotes: '' });
                setProofModal({ open: false, payment: null });
            }
        });
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
        if (confirm('Verify and activate ticket for this payment (Status: FULLY PAID)?')) {
            router.patch(route('admin.visitorTickets.verifyPayment', paymentId), {
                is_debt: false,
            }, {
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
        if (confirm(`Are you sure you want to delete visitor ticket "${name}"? This action cannot be undone.`)) {
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
        if (confirm(`Resend E-Ticket email to "${email}"?`)) {
            router.post(route('admin.visitorTickets.resendEmail', ticketId), {}, {
                preserveScroll: true,
            });
        }
    };

    // Category Quick Switch
    const handleOpenCategoryMenu = (e, ticket) => {
        e.stopPropagation();
        setCategoryMenuAnchor(e.currentTarget);
        setSelectedTicketForCategory(ticket);
    };

    const handleCloseCategoryMenu = () => {
        setCategoryMenuAnchor(null);
        setSelectedTicketForCategory(null);
    };

    const handleSelectCategory = (newType) => {
        if (!selectedTicketForCategory) return;
        const ticketId = selectedTicketForCategory.id;
        handleCloseCategoryMenu();
        router.patch(route('admin.visitorTickets.quickCategory', ticketId), {
            visitor_type: newType
        }, {
            preserveScroll: true,
        });
    };

    // Ticket Status Quick Switch
    const handleOpenTicketMenu = (e, ticket) => {
        e.stopPropagation();
        setTicketMenuAnchor(e.currentTarget);
        setSelectedTicketForStatus(ticket);
    };

    const handleCloseTicketMenu = () => {
        setTicketMenuAnchor(null);
        setSelectedTicketForStatus(null);
    };

    const handleSelectTicketStatus = (newStatus) => {
        if (!selectedTicketForStatus) return;
        const ticketId = selectedTicketForStatus.id;
        handleCloseTicketMenu();
        router.patch(route('admin.visitorTickets.quickStatus', ticketId), {
            status: newStatus
        }, {
            preserveScroll: true,
        });
    };

    // Payment Status Quick Switch
    const handleOpenPaymentMenu = (e, payment) => {
        e.stopPropagation();
        setPaymentMenuAnchor(e.currentTarget);
        setSelectedPaymentForStatus(payment);
    };

    const handleClosePaymentMenu = () => {
        setPaymentMenuAnchor(null);
        setSelectedPaymentForStatus(null);
    };

    const handleSelectPaymentStatus = (newStatus) => {
        if (!selectedPaymentForStatus) return;
        const paymentId = selectedPaymentForStatus.id;
        handleClosePaymentMenu();
        router.patch(route('admin.visitorTickets.quickPaymentStatus', paymentId), {
            status: newStatus
        }, {
            preserveScroll: true,
        });
    };

    // Debt Status Quick Switch
    const handleOpenDebtMenu = (e, payment) => {
        e.stopPropagation();
        setDebtMenuAnchor(e.currentTarget);
        setSelectedPaymentForDebt(payment);
    };

    const handleCloseDebtMenu = () => {
        setDebtMenuAnchor(null);
        setSelectedPaymentForDebt(null);
    };

    const handleQuickToggleDebt = (isDebt) => {
        if (!selectedPaymentForDebt) return;
        const paymentId = selectedPaymentForDebt.id;
        handleCloseDebtMenu();
        router.patch(route('admin.visitorTickets.toggleDebt', paymentId), {
            is_debt: isDebt,
            debt_notes: isDebt ? (selectedPaymentForDebt.debt_notes || 'Tanggungan Bendahara') : null,
        }, {
            preserveScroll: true,
        });
    };

    const handleOpenQuickDebtModal = (payment) => {
        handleCloseDebtMenu();
        handleClosePaymentMenu();
        setQuickDebtModal({
            open: true,
            payment,
            isDebt: Boolean(payment?.is_debt),
            debtNotes: payment?.debt_notes || '',
            processing: false,
        });
    };

    const handleSaveQuickDebtModal = () => {
        if (!quickDebtModal.payment) return;
        setQuickDebtModal(prev => ({ ...prev, processing: true }));
        router.patch(route('admin.visitorTickets.toggleDebt', quickDebtModal.payment.id), {
            is_debt: quickDebtModal.isDebt,
            debt_notes: quickDebtModal.debtNotes,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setQuickDebtModal({ open: false, payment: null, isDebt: true, debtNotes: '', processing: false });
            },
            onError: () => {
                setQuickDebtModal(prev => ({ ...prev, processing: false }));
            }
        });
    };

    const handleOpenEdit = (ticket) => {
        setEditModal({ open: true, ticket });

        const rawMembers = ticket.payment?.tickets && ticket.payment.tickets.length > 0
            ? [...ticket.payment.tickets]
            : [ticket];

        // Sort so is_group_leader is first, then id asc
        rawMembers.sort((a, b) => {
            if (a.is_group_leader && !b.is_group_leader) return -1;
            if (!a.is_group_leader && b.is_group_leader) return 1;
            return a.id - b.id;
        });

        const hasLeader = rawMembers.some(m => m.is_group_leader);
        const mappedMembers = rawMembers.map((m, idx) => ({
            id: m.id,
            ticket_code: m.ticket_code,
            visitor_name: m.visitor_name || '',
            visitor_email: m.visitor_email || '',
            visitor_phone: m.visitor_phone || '',
            visitor_institution: m.visitor_institution || '',
            visitor_type: m.visitor_type || 'non_exclusive',
            status: m.status || ticket.status || 'pending',
            is_group_leader: hasLeader ? Boolean(m.is_group_leader) : (idx === 0),
        }));

        const primaryMember = mappedMembers.find(m => m.is_group_leader) || mappedMembers[0];

        setEditData({
            is_group_edit: true,
            visitor_name: primaryMember?.visitor_name || ticket.visitor_name || '',
            visitor_email: primaryMember?.visitor_email || ticket.visitor_email || '',
            visitor_phone: primaryMember?.visitor_phone || ticket.visitor_phone || '',
            visitor_institution: primaryMember?.visitor_institution || ticket.visitor_institution || '',
            visitor_type: primaryMember?.visitor_type || ticket.visitor_type || 'non_exclusive',
            status: primaryMember?.status || ticket.status || 'active',
            pic_name: ticket.payment?.pic_name || primaryMember?.visitor_name || '',
            pic_email: ticket.payment?.pic_email || primaryMember?.visitor_email || '',
            pic_phone: ticket.payment?.pic_phone || primaryMember?.visitor_phone || '',
            pic_institution: ticket.payment?.pic_institution || primaryMember?.visitor_institution || '',
            unique_code: Number(ticket.payment?.unique_code || 0),
            sync_pic_with_primary: false,
            recalculate_total: true,
            members: mappedMembers,
            removed_ticket_ids: [],
        });
    };

    const handleMemberChange = (idx, field, value) => {
        setEditData(prev => {
            const updated = prev.members.map((m, i) => i === idx ? { ...m, [field]: value } : m);
            const isPrimary = updated[idx]?.is_group_leader || idx === 0;

            let picUpdates = {};
            if (isPrimary && prev.sync_pic_with_primary) {
                if (field === 'visitor_name') picUpdates.pic_name = value;
                if (field === 'visitor_email') picUpdates.pic_email = value;
                if (field === 'visitor_phone') picUpdates.pic_phone = value;
                if (field === 'visitor_institution') picUpdates.pic_institution = value;
            }

            return {
                ...prev,
                ...picUpdates,
                members: updated,
                ...(isPrimary ? {
                    visitor_name: updated[idx].visitor_name,
                    visitor_email: updated[idx].visitor_email,
                    visitor_phone: updated[idx].visitor_phone,
                    visitor_institution: updated[idx].visitor_institution,
                    visitor_type: updated[idx].visitor_type,
                    status: updated[idx].status,
                } : {})
            };
        });
    };

    const handleAddMember = () => {
        setEditData(prev => {
            const defaultInst = prev.pic_institution || prev.members[0]?.visitor_institution || '';
            const defaultCat = prev.members[0]?.visitor_type || 'non_iagi_member_professional';
            const defaultStatus = prev.members[0]?.status || 'pending';
            const newMember = {
                id: null,
                ticket_code: 'NEW TICKET (AUTO)',
                visitor_name: '',
                visitor_email: '',
                visitor_phone: '',
                visitor_institution: defaultInst,
                visitor_type: defaultCat,
                status: defaultStatus,
                is_group_leader: false,
            };
            return {
                ...prev,
                members: [...prev.members, newMember]
            };
        });
    };

    const handleRemoveMember = (idx) => {
        if (editData.members.length <= 1) {
            alert('Minimal harus ada 1 peserta dalam pendaftaran.');
            return;
        }
        setEditData(prev => {
            const target = prev.members[idx];
            const newMembers = prev.members.filter((_, i) => i !== idx);
            const newRemoved = target.id ? [...prev.removed_ticket_ids, target.id] : prev.removed_ticket_ids;

            if (target.is_group_leader && newMembers.length > 0) {
                newMembers[0].is_group_leader = true;
            }

            const primary = newMembers.find(m => m.is_group_leader) || newMembers[0];

            return {
                ...prev,
                members: newMembers,
                removed_ticket_ids: newRemoved,
                visitor_name: primary?.visitor_name || '',
                visitor_email: primary?.visitor_email || '',
                visitor_phone: primary?.visitor_phone || '',
                visitor_institution: primary?.visitor_institution || '',
                visitor_type: primary?.visitor_type || 'non_exclusive',
                status: primary?.status || 'active',
            };
        });
    };

    const handleSetGroupLeader = (idx) => {
        setEditData(prev => {
            const updated = prev.members.map((m, i) => ({
                ...m,
                is_group_leader: i === idx,
            }));
            const leader = updated.splice(idx, 1)[0];
            updated.unshift(leader);

            let picUpdates = {};
            if (prev.sync_pic_with_primary) {
                picUpdates = {
                    pic_name: leader.visitor_name,
                    pic_email: leader.visitor_email,
                    pic_phone: leader.visitor_phone,
                    pic_institution: leader.visitor_institution,
                };
            }

            return {
                ...prev,
                ...picUpdates,
                visitor_name: leader.visitor_name,
                visitor_email: leader.visitor_email,
                visitor_phone: leader.visitor_phone,
                visitor_institution: leader.visitor_institution,
                visitor_type: leader.visitor_type,
                status: leader.status,
                members: updated,
            };
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
                setOnsiteProofPreview(null);
                resetOnsite();
            },
        });
    };

    const handleImportSubmit = (e) => {
        e?.preventDefault();
        if (!importFile) {
            alert('Silakan pilih file Excel (.xlsx) atau CSV terlebih dahulu.');
            return;
        }

        setImportProcessing(true);
        const formData = new FormData();
        formData.append('file', importFile);
        formData.append('send_email', importSendEmail ? '1' : '0');

        router.post(route('admin.visitorTickets.import'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setImportProcessing(false);
                setImportModalOpen(false);
                setImportFile(null);
                setImportSendEmail(false);
            },
            onError: (err) => {
                setImportProcessing(false);
                const msg = err.file || Object.values(err)[0] || 'Gagal mengimpor file.';
                alert(msg);
            }
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

        let confirmMsg = `Execute bulk action for ${selectedIds.length} selected tickets?`;
        if (actionName === 'delete') confirmMsg = `WARNING: Are you sure you want to PERMANENTLY DELETE ${selectedIds.length} selected tickets?`;
        if (actionName === 'verify_payment') confirmMsg = `Verify payment for ${selectedIds.length} selected tickets?`;
        if (actionName === 'check_in') confirmMsg = `Perform bulk check-in for ${selectedIds.length} selected tickets?`;
        if (actionName === 'undo_check_in') confirmMsg = `Undo check-in for ${selectedIds.length} selected tickets?`;
        if (actionName === 'resend_email') confirmMsg = `Kirim / Resend E-Tiket ke ${selectedIds.length} email pengunjung yang dipilih?`;

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

    const handleOpenPrintBadges = (mode = 'selected') => {
        if (mode === 'selected') {
            if (selectedIds.length === 0) {
                alert('Pilih setidaknya 1 tiket untuk dicetak.');
                return;
            }
            window.open(route('admin.visitorTickets.printBadgesBulk', { ids: selectedIds.join(','), mode: 'selected' }), '_blank');
        } else {
            const params = { mode: 'filtered' };
            if (searchTerm) params.search = searchTerm;
            if (typeFilter !== 'all') params.type = typeFilter;
            if (checkedInFilter !== 'all') params.checked_in = checkedInFilter;
            if (statusFilter !== 'all') params.status = statusFilter;
            window.open(route('admin.visitorTickets.printBadgesBulk', params), '_blank');
        }
        setPrintModalOpen(false);
    };

    const handleSendBulkEmail = () => {
        const payload = { mode: emailTargetMode };
        if (emailTargetMode === 'exclude_selected') {
            payload.excluded_ids = selectedIds;
            if (searchTerm) payload.search = searchTerm;
            if (typeFilter !== 'all') payload.type = typeFilter;
            if (registrationTypeFilter !== 'all') payload.registration_type = registrationTypeFilter;
            if (checkedInFilter !== 'all') payload.checked_in = checkedInFilter;
            if (statusFilter !== 'all') payload.status = statusFilter;
            if (debtFilter !== 'all') payload.debt = debtFilter;
        } else if (emailTargetMode === 'selected') {
            if (selectedIds.length === 0) {
                alert('Pilih setidaknya 1 tiket untuk dikirimi email.');
                return;
            }
            payload.ticket_ids = selectedIds;
        } else {
            if (searchTerm) payload.search = searchTerm;
            if (typeFilter !== 'all') payload.type = typeFilter;
            if (registrationTypeFilter !== 'all') payload.registration_type = registrationTypeFilter;
            if (checkedInFilter !== 'all') payload.checked_in = checkedInFilter;
            if (statusFilter !== 'all') payload.status = statusFilter;
            if (debtFilter !== 'all') payload.debt = debtFilter;
        }

        setEmailSending(true);
        router.post(route('admin.visitorTickets.resendEmailsBulk'), payload, {
            preserveScroll: true,
            onFinish: () => {
                setEmailSending(false);
                setEmailModalOpen(false);
            },
        });
    };

    const generateWhatsAppUrl = (ticket) => {
        const phone = (ticket.visitor_phone || '').replace(/[^0-9]/g, '');
        const formattedPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone.startsWith('62') ? phone : '62' + phone;
        const ticketUrl = route('visitor.ticket.show', ticket.ticket_code);
        const catLabel = getCategoryMeta(ticket.visitor_type).label;
        const msg = encodeURIComponent(
            `Hello ${ticket.visitor_name},\n\nThank you for registering as *${catLabel}* for the *55th PIT IAGI & GEOSEA XIX 2026* Conference.\n\nHere is your official Digital E-Ticket & Lanyard Badge link:\n👉 ${ticketUrl}\n\n*Ticket Code:* ${ticket.ticket_code}\n\nPlease present the QR Code from the link above to the gate scanner staff upon arrival at the venue. See you there!\n\n_IAGI-GEOSEA 2026 Organizing Committee_`
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
        { key: 'all', label: 'Total Visitors', value: stats.totalVisitors || 0, icon: <PeopleIcon />, color: '#059669', shadow: '#047857', bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', badgeBg: '#10b981' },
        { key: 'email_sent', label: 'Email Tiket Terkirim', value: stats.emailSentCount || 0, icon: <EmailIcon />, color: '#0d9488', shadow: '#0f766e', bg: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', badgeBg: '#14b8a6' },
        { key: 'non_exclusive', label: 'Visitor Pass (Free)', value: stats.nonExclusiveCount || 0, icon: <ConfirmationNumberIcon />, color: '#0284c7', shadow: '#0369a1', bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', badgeBg: '#0ea5e9' },
        { key: 'checked_in', label: 'Checked-In Gate', value: stats.checkedInCount || 0, icon: <HowToRegIcon />, color: '#0891b2', shadow: '#0e7490', bg: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)', badgeBg: '#06b6d4' },
        { key: 'pending', label: 'Pending Verification', value: stats.pendingVerificationCount || 0, icon: <PaidIcon />, color: '#ea580c', shadow: '#c2410c', bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', badgeBg: '#f97316' },
        { key: 'debt', label: 'Outstanding Debt', value: `${stats.debtCount || 0} Tickets`, icon: <WarningAmberIcon />, color: '#d97706', shadow: '#b45309', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', badgeBg: '#f59e0b' },
        { key: 'revenue', label: 'Total Revenue', value: `Rp ${Number(stats.totalRevenue || 0).toLocaleString('id-ID')}`, icon: <AccountBalanceWalletIcon />, color: '#7c3aed', shadow: '#6d28d9', bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', badgeBg: '#8b5cf6' },
    ];

    const hasActiveFilters = searchTerm || typeFilter !== 'all' || registrationTypeFilter !== 'all' || checkedInFilter !== 'all' || statusFilter !== 'all' || debtFilter !== 'all' || emailSentFilter !== 'all';

    return (
        <SidebarLayout>
            <Head title="Visitor & Conference Tickets - Admin" />

            {/* Direct Access Passcode Dialog (If opened directly / refreshed) */}
            {!isUnlocked && (
                <Dialog
                    open={true}
                    disableEscapeKeyDown
                    PaperProps={{
                        sx: {
                            borderRadius: '24px',
                            p: 1.5,
                            maxWidth: '420px',
                            width: '100%',
                            boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
                            border: '1.5px solid rgba(16, 185, 129, 0.3)',
                            textAlign: 'center',
                        }
                    }}
                >
                    <DialogTitle sx={{ pt: 2, pb: 1 }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                bgcolor: 'rgba(16, 185, 129, 0.12)',
                                color: '#059669',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                                border: '2px solid rgba(16, 185, 129, 0.25)',
                            }}
                        >
                            <LockOutlinedIcon sx={{ fontSize: 32 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
                            Akses Menu Terproteksi
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.8, fontSize: '0.84rem' }}>
                            Halaman <b>Visitor Tickets</b> memerlukan otorisasi sandi. Silakan masukkan sandi untuk mengakses menu ini.
                        </Typography>
                    </DialogTitle>
                    <form onSubmit={handleUnlockDirect}>
                        <DialogContent sx={{ pt: 1, pb: 2.5 }}>
                            {directPasscodeError && (
                                <Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.82rem', textAlign: 'left' }}>
                                    {directPasscodeError}
                                </Alert>
                            )}
                            <TextField
                                autoFocus
                                fullWidth
                                size="small"
                                placeholder="Masukkan sandi..."
                                type={showDirectPasscode ? 'text' : 'password'}
                                value={directPasscode}
                                onChange={(e) => {
                                    setDirectPasscode(e.target.value);
                                    if (directPasscodeError) setDirectPasscodeError('');
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKeyIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                onClick={() => setShowDirectPasscode(!showDirectPasscode)}
                                                size="small"
                                            >
                                                {showDirectPasscode ? <VisibilityOff sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        bgcolor: '#f8fafc',
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#10b981',
                                            borderWidth: '2px',
                                        },
                                    },
                                }}
                            />
                        </DialogContent>
                        <DialogActions sx={{ px: 2, pb: 2, display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                            <Button
                                onClick={() => router.visit(isScanner ? route('admin.gateScanner') : route('admin.dashboard'))}
                                variant="outlined"
                                sx={{
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: '#64748b',
                                    borderColor: '#cbd5e1',
                                    px: 2.5,
                                    py: 1,
                                    '&:hover': { borderColor: '#94a3b8', bgcolor: 'transparent' },
                                }}
                            >
                                Kembali ke Dashboard
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    bgcolor: '#059669',
                                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                                    px: 3,
                                    py: 1,
                                    '&:hover': { bgcolor: '#047857' },
                                }}
                            >
                                Buka Akses
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            )}

            <Box sx={{
                py: 3,
                px: { xs: 2, sm: 3 },
                maxWidth: '1440px',
                mx: 'auto',
                filter: !isUnlocked ? 'blur(12px)' : 'none',
                pointerEvents: !isUnlocked ? 'none' : 'auto',
                userSelect: !isUnlocked ? 'none' : 'auto',
                transition: 'filter 0.3s ease',
            }}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                Visitor Tickets
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
                                    letterSpacing: '0.05em'
                                }}
                            />
                            <Tooltip title="Kunci menu ini kembali untuk proteksi">
                                <Button
                                    size="small"
                                    startIcon={<LockOutlinedIcon sx={{ fontSize: 14 }} />}
                                    onClick={() => {
                                        if (typeof window !== 'undefined') {
                                            sessionStorage.removeItem('visitor_tickets_unlocked');
                                        }
                                        setIsUnlocked(false);
                                    }}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '0.74rem',
                                        fontWeight: 700,
                                        borderRadius: '8px',
                                        color: '#64748b',
                                        border: '1px solid #e2e8f0',
                                        bgcolor: '#f8fafc',
                                        py: 0.2,
                                        px: 1,
                                        height: 22,
                                        '&:hover': {
                                            bgcolor: '#fee2e2',
                                            color: '#dc2626',
                                            borderColor: '#fca5a5',
                                        },
                                    }}
                                >
                                    Kunci Menu
                                </Button>
                            </Tooltip>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
                            Central command for visitor registrations, payment verification, lanyard ID badge printing, & gate check-in.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={() => setOnsiteModalOpen(true)}
                            sx={{
                                bgcolor: '#094d42',
                                color: '#ffffff',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                px: 2,
                                py: 1,
                                borderRadius: '12px',
                                textTransform: 'none',
                                boxShadow: '0 4px 0 #06332b, 0 8px 16px rgba(9,77,66,0.2)',
                                '&:hover': {
                                    bgcolor: '#0d6356',
                                    boxShadow: '0 2px 0 #06332b, 0 4px 8px rgba(9,77,66,0.2)',
                                    transform: 'translateY(2px)',
                                },
                                '&:active': {
                                    transform: 'translateY(4px)',
                                    boxShadow: 'none',
                                },
                                transition: 'all 0.12s ease',
                            }}
                        >
                            + Onsite Registration
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            onClick={() => setImportModalOpen(true)}
                            sx={{
                                bgcolor: '#0284c7',
                                color: '#ffffff',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                px: 2,
                                py: 1,
                                borderRadius: '12px',
                                textTransform: 'none',
                                boxShadow: '0 4px 0 #0369a1, 0 8px 16px rgba(2,132,199,0.2)',
                                '&:hover': {
                                    bgcolor: '#0369a1',
                                    boxShadow: '0 2px 0 #075985, 0 4px 8px rgba(2,132,199,0.2)',
                                    transform: 'translateY(2px)',
                                },
                                '&:active': {
                                    transform: 'translateY(4px)',
                                    boxShadow: 'none',
                                },
                                transition: 'all 0.12s ease',
                            }}
                        >
                            Import Excel / CSV
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={() => setPrintModalOpen(true)}
                            sx={{
                                bgcolor: '#7c3aed',
                                color: '#ffffff',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                px: 2,
                                py: 1,
                                borderRadius: '12px',
                                textTransform: 'none',
                                boxShadow: '0 4px 0 #6d28d9, 0 8px 16px rgba(124,58,237,0.2)',
                                '&:hover': {
                                    bgcolor: '#6d28d9',
                                    boxShadow: '0 2px 0 #5b21b6, 0 4px 8px rgba(124,58,237,0.2)',
                                    transform: 'translateY(2px)',
                                },
                                '&:active': {
                                    transform: 'translateY(4px)',
                                    boxShadow: 'none',
                                },
                                transition: 'all 0.12s ease',
                            }}
                        >
                            Print Badges
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={selectedIds.length > 0 ? <BlockIcon /> : <EmailIcon />}
                            onClick={() => {
                                setEmailTargetMode(selectedIds.length > 0 ? 'exclude_selected' : 'filtered');
                                setEmailModalOpen(true);
                            }}
                            sx={{
                                bgcolor: selectedIds.length > 0 ? '#d97706' : '#0284c7',
                                color: '#ffffff',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                px: 2,
                                py: 1,
                                borderRadius: '12px',
                                textTransform: 'none',
                                boxShadow: selectedIds.length > 0
                                    ? '0 4px 0 #b45309, 0 8px 16px rgba(217,119,6,0.2)'
                                    : '0 4px 0 #0369a1, 0 8px 16px rgba(2,132,199,0.2)',
                                '&:hover': {
                                    bgcolor: selectedIds.length > 0 ? '#b45309' : '#0369a1',
                                    boxShadow: selectedIds.length > 0
                                        ? '0 2px 0 #78350f, 0 4px 8px rgba(217,119,6,0.2)'
                                        : '0 2px 0 #075985, 0 4px 8px rgba(2,132,199,0.2)',
                                    transform: 'translateY(2px)',
                                },
                                '&:active': {
                                    transform: 'translateY(4px)',
                                    boxShadow: 'none',
                                },
                                transition: 'all 0.12s ease',
                            }}
                        >
                            {selectedIds.length > 0
                                ? `Resend E-Tickets (Lewati ${selectedIds.length} Merah)`
                                : 'Resend E-Tickets'}
                        </Button>

                        <Button
                            component={Link}
                            href={route('admin.gateScanner')}
                            variant="contained"
                            startIcon={<QrCodeScannerIcon />}
                            sx={{
                                bgcolor: '#0d9488',
                                color: '#ffffff',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                px: 2,
                                py: 1,
                                borderRadius: '12px',
                                textTransform: 'none',
                                boxShadow: '0 4px 0 #0f766e, 0 8px 16px rgba(13,148,136,0.2)',
                                '&:hover': {
                                    bgcolor: '#0f766e',
                                    boxShadow: '0 2px 0 #115e59, 0 4px 8px rgba(13,148,136,0.2)',
                                    transform: 'translateY(2px)',
                                },
                                '&:active': {
                                    transform: 'translateY(4px)',
                                    boxShadow: 'none',
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
                                color: '#334155',
                                borderColor: '#cbd5e1',
                                bgcolor: '#ffffff',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                px: 2,
                                py: 0.9,
                                borderRadius: '12px',
                                textTransform: 'none',
                                boxShadow: '0 3px 0 #cbd5e1',
                                '&:hover': {
                                    bgcolor: '#f8fafc',
                                    borderColor: '#94a3b8',
                                    transform: 'translateY(1px)',
                                    boxShadow: '0 2px 0 #cbd5e1',
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
                        gridTemplateColumns: {
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                            xl: 'repeat(7, 1fr)',
                        },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    {statCards.map((s) => {
                        const isCardActive = 
                            (s.key === 'all' && !hasActiveFilters) ||
                            (s.key === 'email_sent' && emailSentFilter === 'sent') ||
                            (s.key === 'non_exclusive' && typeFilter === 'non_exclusive') ||
                            (s.key === 'checked_in' && checkedInFilter === 'yes') ||
                            (s.key === 'pending' && statusFilter === 'pending') ||
                            (s.key === 'debt' && debtFilter === 'debt');

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
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)',
                                xl: '2fr 1.1fr 0.95fr 0.95fr 0.95fr 0.95fr 1fr auto',
                            },
                            gap: 1.5,
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            placeholder="Search name, email, ticket code, INVOICE / receipt no, institution..."
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
                                endAdornment: searchTerm ? (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => handleSearchChange('')} sx={{ p: 0.2 }}>
                                            <CloseIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null,
                            }}
                            sx={{
                                gridColumn: { sm: 'span 2', md: 'span 3', lg: 'span 1' },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    bgcolor: '#f8fafc',
                                    fontSize: '0.84rem',
                                },
                            }}
                        />

                        <FormControl size="small" fullWidth>
                            <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Category</InputLabel>
                            <Select
                                value={typeFilter}
                                label="Category"
                                onChange={(e) => handleTypeFilterChange(e.target.value)}
                                sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: '#f8fafc', fontWeight: 600 }}
                            >
                                <MenuItem value="all" sx={{ fontWeight: 700 }}>All Categories</MenuItem>

                                <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                    1. PARTICIPANT
                                </ListSubheader>
                                <MenuItem value="iagi_member_professional" sx={{ pl: 3, fontSize: '0.82rem' }}>• Professional (Member)</MenuItem>
                                <MenuItem value="non_iagi_member_professional" sx={{ pl: 3, fontSize: '0.82rem' }}>• Professional (Non-Member)</MenuItem>
                                <MenuItem value="iagi_member_expatriate" sx={{ pl: 3, fontSize: '0.82rem' }}>• Expatriate (Member)</MenuItem>
                                <MenuItem value="non_iagi_member_expatriate" sx={{ pl: 3, fontSize: '0.82rem' }}>• Expatriate (Non-Member)</MenuItem>
                                <MenuItem value="student_undergraduate" sx={{ pl: 3, fontSize: '0.82rem' }}>• Student Undergraduate</MenuItem>
                                <MenuItem value="dosen" sx={{ pl: 3, fontSize: '0.82rem' }}>• Dosen</MenuItem>

                                <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                    2. TECHNICAL
                                </ListSubheader>
                                <MenuItem value="presenter" sx={{ pl: 3, fontSize: '0.82rem' }}>1. 🎓 Presenter</MenuItem>
                                <MenuItem value="student" sx={{ display: 'none' }}>1. 🎓 Presenter</MenuItem>
                                <MenuItem value="invited_speaker" sx={{ pl: 3, fontSize: '0.82rem' }}>2. 🗣️ Invited Speaker</MenuItem>
                                <MenuItem value="session_chair_judge" sx={{ pl: 3, fontSize: '0.82rem' }}>3. ⚖️ Session Chair / Judge</MenuItem>
                                <MenuItem value="oral" sx={{ display: 'none' }}>Oral Presenter</MenuItem>
                                <MenuItem value="poster" sx={{ display: 'none' }}>Poster Presenter</MenuItem>

                                <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                    3. VISITOR
                                </ListSubheader>
                                <MenuItem value="non_exclusive" sx={{ pl: 3, fontSize: '0.82rem' }}>🎟️ Visitor Pass (Free)</MenuItem>

                                <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                    4. ROLES & INVITATIONS
                                </ListSubheader>
                                <MenuItem value="vip" sx={{ fontSize: '0.82rem' }}>3. ⭐ VIP</MenuItem>
                                <MenuItem value="speaker" sx={{ fontSize: '0.82rem' }}>4. 🎤 Keynote Speaker</MenuItem>
                                <MenuItem value="panelist" sx={{ fontSize: '0.82rem' }}>5. 👥 Panelist</MenuItem>
                                <MenuItem value="moderator" sx={{ fontSize: '0.82rem' }}>6. 🎯 Moderator</MenuItem>
                                <MenuItem value="exhibition" sx={{ fontSize: '0.82rem' }}>7. 🏛️ Exhibition</MenuItem>
                                <MenuItem value="committee" sx={{ fontSize: '0.82rem' }}>8. 👔 Committee</MenuItem>
                                <MenuItem value="student_volunteer" sx={{ fontSize: '0.82rem' }}>9. 🤝 Student Volunteer</MenuItem>
                                <MenuItem value="board" sx={{ fontSize: '0.82rem' }}>10. 🎖️ Board (Invited / Free)</MenuItem>
                                <MenuItem value="sponsorship" sx={{ fontSize: '0.82rem' }}>11. 💎 Delegate (Invited / Free)</MenuItem>
                                <MenuItem value="student_crowd" sx={{ fontSize: '0.82rem' }}>12. 🎓 Student Crowd (Invited / Free)</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                            <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Reg. Type</InputLabel>
                            <Select
                                value={registrationTypeFilter}
                                label="Reg. Type"
                                onChange={(e) => handleRegistrationTypeFilterChange(e.target.value)}
                                sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: '#f8fafc', fontWeight: 600 }}
                            >
                                <MenuItem value="all">All Types</MenuItem>
                                <MenuItem value="individual">👤 Individual</MenuItem>
                                <MenuItem value="mixed">🏢 Group / Mixed ({stats.groupRegistrationCount || 0})</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                            <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Gate Status</InputLabel>
                            <Select
                                value={checkedInFilter}
                                label="Gate Status"
                                onChange={(e) => handleCheckedInFilterChange(e.target.value)}
                                sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: '#f8fafc', fontWeight: 600 }}
                            >
                                <MenuItem value="all">All Statuses</MenuItem>
                                <MenuItem value="yes">✅ Checked In</MenuItem>
                                <MenuItem value="no">⏳ Not Checked In</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                            <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Ticket Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Ticket Status"
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: '#f8fafc', fontWeight: 600 }}
                            >
                                <MenuItem value="all">All Statuses</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="pending">Pending Payment</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                            <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Debt Status</InputLabel>
                            <Select
                                value={debtFilter}
                                label="Debt Status"
                                onChange={(e) => handleDebtFilterChange(e.target.value)}
                                sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: '#f8fafc', fontWeight: 600 }}
                            >
                                <MenuItem value="all">All Debt Statuses</MenuItem>
                                <MenuItem value="debt" sx={{ color: '#b45309', fontWeight: 800 }}>⚠️ Debt Tagged ({stats.debtCount || 0})</MenuItem>
                                <MenuItem value="no_debt" sx={{ color: '#15803d', fontWeight: 700 }}>✅ Fully Paid / Free</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                            <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Email Status</InputLabel>
                            <Select
                                value={emailSentFilter}
                                label="Email Status"
                                onChange={(e) => handleEmailSentFilterChange(e.target.value)}
                                sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: '#f8fafc', fontWeight: 600 }}
                            >
                                <MenuItem value="all">All Email Status</MenuItem>
                                <MenuItem value="sent" sx={{ color: '#0284c7', fontWeight: 700 }}>📨 Email Sent ({stats.emailSentCount || 0})</MenuItem>
                                <MenuItem value="not_sent" sx={{ color: '#64748b', fontWeight: 700 }}>⏳ Not Sent Yet ({stats.emailNotSentCount || 0})</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleResetFilters}
                            disabled={!hasActiveFilters}
                            startIcon={<RestartAltIcon />}
                            size="small"
                            sx={{
                                height: 40,
                                borderRadius: '10px',
                                borderColor: '#cbd5e1',
                                color: '#475569',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                whiteSpace: 'nowrap',
                                bgcolor: '#f8fafc',
                                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' },
                            }}
                        >
                            Reset
                        </Button>
                    </Box>
                </Paper>

                {/* FLOATING 3D BULK ACTION TOOLBAR */}
                {selectedIds.length > 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.6,
                            px: 2.5,
                            borderRadius: '16px',
                            bgcolor: '#0f172a',
                            color: '#ffffff',
                            mb: 2.5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1.5,
                            border: '2px solid #ef4444',
                            boxShadow: '0 4px 0 #991b1b, 0 12px 28px rgba(239,68,68,0.25)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                            <Chip
                                icon={<BlockIcon sx={{ fontSize: '14px !important', color: '#ffffff !important' }} />}
                                label={`${selectedIds.length} Baris Merah (Dilewati / Tidak Dikirim Email)`}
                                size="small"
                                sx={{ bgcolor: '#dc2626', color: '#ffffff', fontWeight: 900, fontSize: '0.75rem', px: 0.5 }}
                            />
                            <Button
                                size="small"
                                onClick={() => setSelectedIds([])}
                                startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                                sx={{
                                    color: '#fca5a5',
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    fontSize: '0.74rem',
                                    bgcolor: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid #b91c1c',
                                    borderRadius: '8px',
                                    px: 1.2,
                                    py: 0.3,
                                    '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.35)', color: '#ffffff' },
                                }}
                            >
                                Lepas Semua Tanda Merah
                            </Button>
                        </Box>

                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<BlockIcon />}
                                onClick={() => {
                                    setEmailTargetMode('exclude_selected');
                                    setEmailModalOpen(true);
                                }}
                                disabled={bulkActionProcessing}
                                sx={{
                                    bgcolor: '#dc2626',
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontWeight: 900,
                                    borderRadius: '10px',
                                    boxShadow: '0 3px 0 #991b1b',
                                    '&:hover': { bgcolor: '#b91c1c' },
                                }}
                            >
                                Kirim E-Tiket (Lewati {selectedIds.length} Baris Merah)
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<EmailIcon />}
                                onClick={() => {
                                    setEmailTargetMode('selected');
                                    setEmailModalOpen(true);
                                }}
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
                                Hanya Kirim ({selectedIds.length})
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<PrintIcon />}
                                onClick={() => handleOpenPrintBadges('selected')}
                                disabled={bulkActionProcessing}
                                sx={{
                                    bgcolor: '#7c3aed',
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontWeight: 900,
                                    borderRadius: '10px',
                                    boxShadow: '0 3px 0 #6d28d9',
                                    '&:hover': { bgcolor: '#6d28d9' },
                                }}
                            >
                                Print Badges ({selectedIds.length})
                            </Button>
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
                                Verify Payment
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<HowToRegIcon />}
                                onClick={() => handleBulkAction('check_in')}
                                disabled={bulkActionProcessing}
                                sx={{
                                    bgcolor: '#0d9488',
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontWeight: 900,
                                    borderRadius: '10px',
                                    boxShadow: '0 3px 0 #0f766e',
                                    '&:hover': { bgcolor: '#0f766e' },
                                }}
                            >
                                Bulk Check-In
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleBulkAction('undo_check_in')}
                                disabled={bulkActionProcessing}
                                sx={{ borderColor: '#64748b', color: '#cbd5e1', textTransform: 'none', fontWeight: 800, borderRadius: '10px' }}
                            >
                                Undo Check-In
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
                                Delete
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
                    {selectedIds.length > 0 && (
                        <Box
                            sx={{
                                px: 2.5,
                                py: 1.2,
                                bgcolor: '#fef2f2',
                                borderBottom: '1.5px solid #fecaca',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: 1,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.25)' }} />
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#991b1b', fontSize: '0.8rem' }}>
                                    Ada <strong>{selectedIds.length} baris berwarna merah</strong> (ditandai untuk dilewati / tidak menerima E-Tiket saat kirim email).
                                </Typography>
                            </Box>
                            <Button
                                size="small"
                                onClick={() => setSelectedIds([])}
                                startIcon={<CloseIcon sx={{ fontSize: 13 }} />}
                                sx={{
                                    textTransform: 'none',
                                    color: '#b91c1c',
                                    bgcolor: '#fee2e2',
                                    border: '1px solid #fca5a5',
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                    py: 0.2,
                                    px: 1.2,
                                    borderRadius: '6px',
                                    '&:hover': { bgcolor: '#fecaca', color: '#7f1d1d' },
                                }}
                            >
                                Lepas Semua Tanda Merah
                            </Button>
                        </Box>
                    )}

                    <TableContainer
                        sx={{
                            width: '100%',
                            overflowX: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            '&::-webkit-scrollbar': { height: 8 },
                            '&::-webkit-scrollbar-track': { bgcolor: '#f1f5f9' },
                            '&::-webkit-scrollbar-thumb': {
                                bgcolor: '#cbd5e1',
                                borderRadius: 4,
                                '&:hover': { bgcolor: '#94a3b8' },
                            },
                        }}
                    >
                        <Table size="small" sx={{ minWidth: 1250, tableLayout: 'auto' }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <TableCell padding="checkbox" sx={{ py: 1.5, px: 1.5, whiteSpace: 'nowrap' }}>
                                        <Tooltip title={selectedIds.length > 0 ? "Lepas semua tanda merah" : "Tandai semua baris (merah / lewati email)"} arrow>
                                            <Checkbox
                                                size="small"
                                                indeterminate={selectedIds.length > 0 && selectedIds.length < ticketsData.length}
                                                checked={ticketsData.length > 0 && selectedIds.length === ticketsData.length}
                                                onChange={handleSelectAll}
                                                sx={{
                                                    p: 0.5,
                                                    color: selectedIds.length > 0 ? '#ef4444' : '#94a3b8',
                                                    '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: '#dc2626' }
                                                }}
                                            />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>TICKET CODE</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>INVOICE / RECEIPT</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>PARTICIPANT / VISITOR</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>CATEGORY</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>SOURCE</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>TICKET STATUS</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>PAYMENT</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>CHECK-IN GATE</TableCell>
                                    <TableCell sx={{ fontWeight: 900, fontSize: '0.72rem', color: '#475569', letterSpacing: '0.05em', textAlign: 'center', whiteSpace: 'nowrap' }}>ACTIONS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ticketsData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" sx={{ py: 8, color: '#94a3b8' }}>
                                            <ConfirmationNumberIcon sx={{ fontSize: 50, opacity: 0.25, mb: 1, display: 'block', mx: 'auto' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b' }}>
                                                No visitor tickets match the selected filters.
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                Use the "+ Onsite Registration" button to add a new ticket.
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
                                                    borderLeft: isSelected ? '5px solid #ef4444 !important' : '5px solid transparent',
                                                    bgcolor: isSelected ? '#fef2f2 !important' : 'inherit',
                                                    transition: 'all 0.15s ease',
                                                    '&:hover': {
                                                        bgcolor: isSelected ? '#fee2e2 !important' : '#f8fafc',
                                                    },
                                                    '&.Mui-selected': {
                                                        bgcolor: '#fef2f2 !important',
                                                        '&:hover': { bgcolor: '#fee2e2 !important' },
                                                    },
                                                }}
                                            >
                                                <TableCell padding="checkbox" sx={{ py: 1.2, px: 1.5, whiteSpace: 'nowrap' }}>
                                                    <Tooltip title={isSelected ? "Klik untuk LEPAS tanda merah (izinkan kirim email)" : "Tandai MERAH (jangan kirim email ke tiket ini)"} arrow>
                                                        <Checkbox
                                                            size="small"
                                                            checked={isSelected}
                                                            onChange={() => handleSelectRow(t.id)}
                                                            sx={{
                                                                p: 0.5,
                                                                color: isSelected ? '#ef4444' : '#cbd5e1',
                                                                '&.Mui-checked': { color: '#dc2626' }
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </TableCell>

                                                {/* TICKET CODE */}
                                                <TableCell sx={{ py: 1.2, whiteSpace: 'nowrap' }}>
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
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {t.ticket_code}
                                                    </Box>
                                                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem', mt: 0.3, whiteSpace: 'nowrap' }}>
                                                        {new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </Typography>
                                                </TableCell>

                                                {/* INV / RECEIPT NO */}
                                                <TableCell sx={{ py: 1.2, whiteSpace: 'nowrap' }}>
                                                    {t.payment ? (
                                                        <Box>
                                                            <Tooltip title="Click to View Official Receipt" arrow>
                                                                <Box
                                                                    component="a"
                                                                    href={route('visitor.receipt.show', t.payment.payment_code)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    sx={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: 0.5,
                                                                        bgcolor: '#f8fafc',
                                                                        border: '1px solid #cbd5e1',
                                                                        color: '#094d42',
                                                                        px: 0.8,
                                                                        py: 0.35,
                                                                        borderRadius: '6px',
                                                                        fontFamily: 'monospace',
                                                                        fontWeight: 800,
                                                                        fontSize: '0.72rem',
                                                                        textDecoration: 'none',
                                                                        whiteSpace: 'nowrap',
                                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                                                        transition: 'all 0.15s ease',
                                                                        '&:hover': {
                                                                            bgcolor: '#f0fdf4',
                                                                            borderColor: '#10b981',
                                                                            color: '#047857',
                                                                            transform: 'translateY(-1px)',
                                                                            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.15)',
                                                                        }
                                                                    }}
                                                                >
                                                                    <ReceiptLongIcon sx={{ fontSize: 13, color: '#094d42' }} />
                                                                    <span>
                                                                        {(t.payment.receipt_no || t.receipt_no) ? (t.payment.receipt_no || t.receipt_no).replace('Receipt No. ', '') : t.payment.payment_code}
                                                                    </span>
                                                                </Box>
                                                            </Tooltip>
                                                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.67rem', mt: 0.3, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                                                                {t.payment.payment_code}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                                            -
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* PARTICIPANT / VISITOR */}
                                                <TableCell sx={{ py: 1.2, minWidth: 200 }}>
                                                    <Typography
                                                        variant="body2"
                                                        onClick={() => setDetailModal({ open: true, ticket: t })}
                                                        sx={{
                                                            fontWeight: 900,
                                                            color: isSelected ? '#991b1b' : '#0f172a',
                                                            cursor: 'pointer',
                                                            fontSize: '0.88rem',
                                                            '&:hover': { color: isSelected ? '#7f1d1d' : '#094d42', textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        {t.visitor_name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: isSelected ? '#b91c1c' : '#64748b', display: 'block', fontSize: '0.72rem' }}>
                                                        {t.visitor_email}
                                                    </Typography>
                                                    {isSelected && (
                                                        <Box sx={{ mt: 0.4 }}>
                                                            <Chip
                                                                icon={<BlockIcon sx={{ fontSize: '13px !important', color: '#b91c1c !important' }} />}
                                                                label="⛔ Tidak Dikirim Email"
                                                                size="small"
                                                                onDelete={() => handleSelectRow(t.id)}
                                                                deleteIcon={
                                                                    <Tooltip title="Klik untuk lepas tanda merah (tiket ini akan dikirimi email)" arrow>
                                                                        <CloseIcon sx={{ fontSize: '13px !important', color: '#b91c1c !important', '&:hover': { color: '#7f1d1d !important' } }} />
                                                                    </Tooltip>
                                                                }
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.65rem',
                                                                    fontWeight: 800,
                                                                    bgcolor: '#fee2e2',
                                                                    color: '#b91c1c',
                                                                    border: '1px solid #fca5a5',
                                                                    cursor: 'pointer',
                                                                    boxShadow: '0 1px 2px rgba(239,68,68,0.15)',
                                                                    '&:hover': { bgcolor: '#fecaca' },
                                                                }}
                                                            />
                                                        </Box>
                                                    )}
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.3, flexWrap: 'wrap', alignItems: 'center' }}>
                                                        {t.visitor_phone && (
                                                            <Typography variant="caption" sx={{ color: '#0369a1', fontSize: '0.68rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                                                📞 {t.visitor_phone}
                                                            </Typography>
                                                        )}
                                                        {t.visitor_institution && (
                                                            <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 700, fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
                                                                🏢 {t.visitor_institution}
                                                            </Typography>
                                                        )}
                                                        {t.payment?.is_mixed_category && (
                                                            <Chip
                                                                label={`GROUP: ${t.payment.pic_name || 'Corporate'}`}
                                                                size="small"
                                                                sx={{
                                                                    height: 18,
                                                                    fontSize: '0.60rem',
                                                                    fontWeight: 800,
                                                                    bgcolor: '#ede9fe',
                                                                    color: '#6d28d9',
                                                                    border: '1px solid #c4b5fd',
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </TableCell>

                                                {/* CATEGORY */}
                                                <TableCell sx={{ py: 1.2, whiteSpace: 'nowrap' }}>
                                                    <Tooltip title="Klik untuk ubah kategori pengunjung / peserta" arrow>
                                                        <Chip
                                                            icon={t.visitor_type === 'exclusive' ? <StarIcon sx={{ fontSize: 12, color: '#92400e !important' }} /> : undefined}
                                                            label={
                                                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4 }}>
                                                                    <span>{getCategoryMeta(t.visitor_type).shortLabel}</span>
                                                                    <span style={{ fontSize: '8px', opacity: 0.7 }}>▾</span>
                                                                </Box>
                                                            }
                                                            size="small"
                                                            onClick={(e) => handleOpenCategoryMenu(e, t)}
                                                            sx={{
                                                                bgcolor: getCategoryMeta(t.visitor_type).bg,
                                                                border: `1px solid ${getCategoryMeta(t.visitor_type).border}`,
                                                                color: getCategoryMeta(t.visitor_type).color,
                                                                fontWeight: 900,
                                                                fontSize: '0.65rem',
                                                                height: 22,
                                                                whiteSpace: 'nowrap',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s ease-in-out',
                                                                '&:hover': {
                                                                    transform: 'translateY(-1px)',
                                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                                                                    filter: 'brightness(0.96)',
                                                                },
                                                            }}
                                                        />
                                                    </Tooltip>
                                                    {t.individual_price && Number(t.individual_price) > 0 && (
                                                        <Typography variant="caption" sx={{ color: '#094d42', fontWeight: 800, fontSize: '0.67rem', display: 'block', mt: 0.3 }}>
                                                            Rp {Number(t.individual_price).toLocaleString('id-ID')}
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* SOURCE */}
                                                <TableCell sx={{ py: 1.2, whiteSpace: 'nowrap' }}>
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
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* TICKET STATUS */}
                                                <TableCell sx={{ py: 1.2, whiteSpace: 'nowrap' }}>
                                                    <Tooltip title="Klik untuk ubah status tiket langsung (ACTIVE / PENDING / CANCELLED)" arrow>
                                                        <Chip
                                                            label={
                                                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4 }}>
                                                                    <span>{t.status.toUpperCase()}</span>
                                                                    <span style={{ fontSize: '9px', opacity: 0.7 }}>▾</span>
                                                                </Box>
                                                            }
                                                            size="small"
                                                            onClick={(e) => handleOpenTicketMenu(e, t)}
                                                            sx={{
                                                                bgcolor: t.status === 'active' ? '#dcfce7' : t.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                                                border: `1px solid ${t.status === 'active' ? '#86efac' : t.status === 'pending' ? '#fde68a' : '#fca5a5'}`,
                                                                color: t.status === 'active' ? '#15803d' : t.status === 'pending' ? '#b45309' : '#b91c1c',
                                                                fontWeight: 900,
                                                                fontSize: '0.64rem',
                                                                height: 22,
                                                                cursor: 'pointer',
                                                                whiteSpace: 'nowrap',
                                                                transition: 'all 0.15s ease-in-out',
                                                                '&:hover': {
                                                                    transform: 'translateY(-1px)',
                                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                                                                    filter: 'brightness(0.96)',
                                                                },
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </TableCell>

                                                {/* PAYMENT */}
                                                <TableCell sx={{ py: 1.2, whiteSpace: 'nowrap' }}>
                                                    {t.payment ? (
                                                        <Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, flexWrap: 'nowrap' }}>
                                                                <Typography variant="caption" sx={{ fontWeight: 900, display: 'block', color: '#0f172a', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                                                    Rp {Number(t.payment.total_amount || 0).toLocaleString('id-ID')}
                                                                </Typography>
                                                                {Number(t.payment.unique_code || 0) > 0 && (
                                                                    <Tooltip title={`Termasuk Kode Unik Transfer: +Rp ${Number(t.payment.unique_code).toLocaleString('id-ID')}`} arrow>
                                                                        <Chip
                                                                            label={`+${t.payment.unique_code}`}
                                                                            size="small"
                                                                            sx={{
                                                                                height: 17,
                                                                                fontSize: '0.58rem',
                                                                                fontWeight: 900,
                                                                                bgcolor: '#eff6ff',
                                                                                color: '#1d4ed8',
                                                                                border: '1px solid #bfdbfe',
                                                                                px: 0.2,
                                                                                cursor: 'help',
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                                {Number(t.payment.discount_amount || 0) > 0 && (
                                                                    <Tooltip title={`Diskon: -Rp ${Number(t.payment.discount_amount).toLocaleString('id-ID')} (${t.payment.discount_type === 'percent' ? `${Number(t.payment.discount_value)}%` : 'Nominal'})${t.payment.discount_notes ? ` [${t.payment.discount_notes}]` : ''}`} arrow>
                                                                        <Chip
                                                                            label={`Diskon -${t.payment.discount_type === 'percent' ? `${Number(t.payment.discount_value)}%` : `Rp ${(Number(t.payment.discount_amount) / 1000).toLocaleString('id-ID')}k`}`}
                                                                            size="small"
                                                                            sx={{
                                                                                height: 17,
                                                                                fontSize: '0.58rem',
                                                                                fontWeight: 900,
                                                                                bgcolor: '#fef3c7',
                                                                                color: '#b45309',
                                                                                border: '1px solid #fde68a',
                                                                                px: 0.2,
                                                                                cursor: 'help',
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.2, flexWrap: 'wrap' }}>
                                                                <Tooltip title="Klik untuk ubah status pembayaran (Approved, Pending, Rejected)" arrow>
                                                                    <Chip
                                                                        label={
                                                                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4 }}>
                                                                                <span>{t.payment.status.toUpperCase()}</span>
                                                                                <span style={{ fontSize: '8px', opacity: 0.7 }}>▾</span>
                                                                            </Box>
                                                                        }
                                                                        size="small"
                                                                        onClick={(e) => handleOpenPaymentMenu(e, t.payment)}
                                                                        sx={{
                                                                            height: 20,
                                                                            fontSize: '0.58rem',
                                                                            bgcolor: t.payment.status === 'approved' ? '#dcfce7' : t.payment.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                                                            color: t.payment.status === 'approved' ? '#166534' : t.payment.status === 'pending' ? '#92400e' : '#991b1b',
                                                                            fontWeight: 900,
                                                                            border: `1px solid ${t.payment.status === 'approved' ? '#86efac' : t.payment.status === 'pending' ? '#fde68a' : '#fca5a5'}`,
                                                                            whiteSpace: 'nowrap',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.15s ease-in-out',
                                                                            '&:hover': {
                                                                                transform: 'translateY(-1px)',
                                                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                                                filter: 'brightness(0.96)',
                                                                            },
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                                {t.payment.is_debt ? (
                                                                    <Tooltip title={`⚠️ DEBT STATUS: ${t.payment.debt_notes || 'Kesepakatan Bendahara'}. Klik untuk kelola hutang / ubah catatan / tandai lunas.`} arrow>
                                                                        <Chip
                                                                            icon={<WarningAmberIcon sx={{ fontSize: '11px !important', color: '#92400e !important' }} />}
                                                                            label={
                                                                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3 }}>
                                                                                    <span>DEBT</span>
                                                                                    <span style={{ fontSize: '8px', opacity: 0.7 }}>▾</span>
                                                                                </Box>
                                                                            }
                                                                            size="small"
                                                                            onClick={(e) => handleOpenDebtMenu(e, t.payment)}
                                                                            sx={{
                                                                                height: 20,
                                                                                fontSize: '0.58rem',
                                                                                bgcolor: '#fef3c7',
                                                                                color: '#92400e',
                                                                                fontWeight: 900,
                                                                                border: '1px solid #f59e0b',
                                                                                cursor: 'pointer',
                                                                                whiteSpace: 'nowrap',
                                                                                transition: 'all 0.15s ease-in-out',
                                                                                '&:hover': {
                                                                                    bgcolor: '#fde68a',
                                                                                    transform: 'translateY(-1px)',
                                                                                    boxShadow: '0 2px 5px rgba(245, 158, 11, 0.25)',
                                                                                },
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                ) : t.payment.debt_settled_at ? (
                                                                    <Tooltip title={`Hutang telah dilunasi pada ${new Date(t.payment.debt_settled_at).toLocaleDateString('id-ID')}. Klik untuk opsi.`} arrow>
                                                                        <Chip
                                                                            icon={<TaskAltIcon sx={{ fontSize: '11px !important', color: '#15803d !important' }} />}
                                                                            label={
                                                                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3 }}>
                                                                                    <span>PAID</span>
                                                                                    <span style={{ fontSize: '8px', opacity: 0.7 }}>▾</span>
                                                                                </Box>
                                                                            }
                                                                            size="small"
                                                                            onClick={(e) => handleOpenDebtMenu(e, t.payment)}
                                                                            sx={{
                                                                                height: 20,
                                                                                fontSize: '0.56rem',
                                                                                bgcolor: '#f0fdf4',
                                                                                color: '#15803d',
                                                                                fontWeight: 800,
                                                                                border: '1px solid #bbf7d0',
                                                                                whiteSpace: 'nowrap',
                                                                                cursor: 'pointer',
                                                                                transition: 'all 0.15s ease-in-out',
                                                                                '&:hover': {
                                                                                    bgcolor: '#dcfce7',
                                                                                    transform: 'translateY(-1px)',
                                                                                },
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                ) : (
                                                                    <Tooltip title="Klik untuk tandai pembayaran ini sebagai HUTANG (DEBT)" arrow>
                                                                        <Chip
                                                                            label="+ DEBT"
                                                                            size="small"
                                                                            onClick={(e) => handleOpenDebtMenu(e, t.payment)}
                                                                            sx={{
                                                                                height: 18,
                                                                                fontSize: '0.52rem',
                                                                                bgcolor: 'transparent',
                                                                                color: '#94a3b8',
                                                                                fontWeight: 700,
                                                                                border: '1px dashed #cbd5e1',
                                                                                whiteSpace: 'nowrap',
                                                                                cursor: 'pointer',
                                                                                opacity: 0.7,
                                                                                transition: 'all 0.15s ease-in-out',
                                                                                '&:hover': {
                                                                                    opacity: 1,
                                                                                    color: '#d97706',
                                                                                    borderColor: '#f59e0b',
                                                                                    bgcolor: '#fffbeb',
                                                                                },
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                                <Tooltip title="Lihat Bukti Transfer & Detail Lengkap">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleOpenProofModal(t.payment)}
                                                                        sx={{ p: 0.2, color: t.payment.is_debt ? '#d97706' : '#0284c7' }}
                                                                    >
                                                                        <VisibilityIcon sx={{ fontSize: 15 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Stack>
                                                            {t.payment.is_debt && t.payment.debt_notes && (
                                                                <Typography variant="caption" sx={{ color: '#b45309', display: 'block', fontSize: '0.64rem', fontWeight: 600, mt: 0.2, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    📝 {t.payment.debt_notes}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800, fontSize: '0.76rem', whiteSpace: 'nowrap' }}>
                                                            FREE
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* CHECK-IN GATE 1-CLICK TOGGLE */}
                                                <TableCell sx={{ py: 1.2, whiteSpace: 'nowrap' }}>
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
                                                                    whiteSpace: 'nowrap',
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
                                                                whiteSpace: 'nowrap',
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
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem', mt: 0.3, whiteSpace: 'nowrap' }}>
                                                            {new Date(t.checked_in_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* 3D ACTION BUTTONS */}
                                                <TableCell sx={{ py: 1.2, textAlign: 'center', whiteSpace: 'nowrap', minWidth: 160 }}>
                                                    <Stack direction="row" spacing={0.4} justifyContent="center" sx={{ flexWrap: 'nowrap' }}>
                                                        {/* Verify/Reject for Pending Payments */}
                                                        {t.payment && t.payment.status === 'pending' && (
                                                            <>
                                                                <Tooltip title="Approve Payment">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleVerifyPayment(t.payment.id)}
                                                                        sx={{ color: '#10b981', bgcolor: '#ecfdf5', border: '1px solid #a7f3d0', p: 0.5, borderRadius: '8px' }}
                                                                    >
                                                                        <CheckIcon sx={{ fontSize: 15 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Reject Payment">
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
                                                        <Tooltip title="Full Details & QR Code">
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
                                                            <Tooltip title="Send E-Ticket via WhatsApp">
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
                                                            <Tooltip title={isSelected ? "Ditandai Merah: Dikecualikan dari kirim email massal (Klik jika tetap ingin kirim manual perorangan)" : "Send / Resend E-Ticket Email"}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleResendEmail(t.id, t.visitor_email)}
                                                                    sx={{
                                                                        color: isSelected ? '#ef4444' : '#0284c7',
                                                                        bgcolor: isSelected ? '#fef2f2' : '#f0f9ff',
                                                                        border: isSelected ? '1px dashed #f87171' : '1px solid #bae6fd',
                                                                        p: 0.5,
                                                                        borderRadius: '8px'
                                                                    }}
                                                                >
                                                                    <EmailIcon sx={{ fontSize: 15 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}

                                                        {/* Official Receipt */}
                                                        {t.payment && (
                                                            <Tooltip title="View Official Receipt">
                                                                <IconButton
                                                                    component="a"
                                                                    href={route('visitor.receipt.show', t.payment.payment_code)}
                                                                    target="_blank"
                                                                    size="small"
                                                                    sx={{ color: '#094d42', bgcolor: '#ecfdf5', border: '1px solid #a7f3d0', p: 0.5, borderRadius: '8px' }}
                                                                >
                                                                    <ReceiptLongIcon sx={{ fontSize: 15 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}

                                                        {/* Print Badge */}
                                                        <Tooltip title="Print Lanyard Badge">
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
                                                        <Tooltip title="Edit Visitor Details">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenEdit(t)}
                                                                sx={{ color: '#d97706', bgcolor: '#fffbeb', border: '1px solid #fde68a', p: 0.5, borderRadius: '8px' }}
                                                            >
                                                                <EditIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {/* Delete Visitor */}
                                                        <Tooltip title="Delete Ticket">
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
                                Showing page {currentPage} of {lastPage} &bull; Total {totalItems} registered visitors
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
                                    Visitor Ticket Details
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
                                        label={detailModal.ticket.checked_in ? 'CHECKED IN' : 'NOT CHECKED IN'}
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
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Full Name:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>{detailModal.ticket.visitor_name}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Email Address:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>{detailModal.ticket.visitor_email}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>WhatsApp / Phone Number:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>{detailModal.ticket.visitor_phone || '-'}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Institution / Organization:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>{detailModal.ticket.visitor_institution || '-'}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', pb: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Registration Date & Time:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                                        {new Date(detailModal.ticket.created_at).toLocaleString('en-GB')}
                                    </Typography>
                                </Box>

                                {detailModal.ticket.payment && (
                                    <Box sx={{ p: 2, bgcolor: detailModal.ticket.payment.is_debt ? '#fffbeb' : '#f0fdf4', borderRadius: '12px', border: `1.5px solid ${detailModal.ticket.payment.is_debt ? '#f59e0b' : '#bbf7d0'}` }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8, flexWrap: 'wrap', gap: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: detailModal.ticket.payment.is_debt ? '#92400e' : '#166534', display: 'block' }}>
                                                    Payment & Invoice Details:
                                                </Typography>
                                                {detailModal.ticket.payment.is_debt && (
                                                    <Chip
                                                        icon={<WarningAmberIcon sx={{ fontSize: '11px !important', color: '#92400e !important' }} />}
                                                        label="DEBT TAG"
                                                        size="small"
                                                        sx={{ height: 18, fontSize: '0.58rem', bgcolor: '#fef3c7', color: '#92400e', fontWeight: 900, border: '1px solid #f59e0b' }}
                                                    />
                                                )}
                                            </Box>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleOpenProofModal(detailModal.ticket.payment)}
                                                    startIcon={<VisibilityIcon sx={{ fontSize: 13 }} />}
                                                    sx={{
                                                        fontSize: '0.68rem',
                                                        py: 0.3,
                                                        px: 1.2,
                                                        textTransform: 'none',
                                                        fontWeight: 800,
                                                        borderColor: detailModal.ticket.payment.is_debt ? '#f59e0b' : '#cbd5e1',
                                                        color: detailModal.ticket.payment.is_debt ? '#92400e' : '#0284c7',
                                                        bgcolor: '#ffffff',
                                                    }}
                                                >
                                                    {detailModal.ticket.payment.is_debt ? 'Manage Debt / Proof' : 'View Proof'}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    component="a"
                                                    href={route('visitor.receipt.show', detailModal.ticket.payment.payment_code)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<ReceiptLongIcon sx={{ fontSize: 14 }} />}
                                                    sx={{
                                                        fontSize: '0.68rem',
                                                        py: 0.3,
                                                        px: 1.2,
                                                        textTransform: 'none',
                                                        fontWeight: 800,
                                                        borderColor: '#86efac',
                                                        color: '#15803d',
                                                        bgcolor: '#ffffff',
                                                        '&:hover': { bgcolor: '#dcfce7', borderColor: '#16a34a' }
                                                    }}
                                                >
                                                    Receipt / INVOICE
                                                </Button>
                                            </Stack>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: detailModal.ticket.payment.is_debt ? '#92400e' : '#065f46', fontWeight: 800, fontFamily: 'monospace', mb: 0.3 }}>
                                            {detailModal.ticket.payment.receipt_no || detailModal.ticket.receipt_no || 'Receipt Available'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: detailModal.ticket.payment.is_debt ? '#78350f' : '#166534', fontWeight: 600, display: 'block' }}>
                                            Payment Code: <strong>{detailModal.ticket.payment.payment_code}</strong> &bull; Total: <strong>Rp {Number(detailModal.ticket.payment.total_amount).toLocaleString('id-ID')}</strong>
                                            {Number(detailModal.ticket.payment.discount_amount || 0) > 0 && (
                                                <span> &bull; Diskon: <strong style={{ color: '#d97706' }}>-Rp {Number(detailModal.ticket.payment.discount_amount).toLocaleString('id-ID')} ({detailModal.ticket.payment.discount_type === 'percent' ? `${Number(detailModal.ticket.payment.discount_value)}%` : 'Nominal'}{detailModal.ticket.payment.discount_notes ? ` - ${detailModal.ticket.payment.discount_notes}` : ''})</strong></span>
                                            )}
                                            {Number(detailModal.ticket.payment.unique_code || 0) > 0 && (
                                                <span> &bull; Kode Unik: <strong style={{ color: '#1d4ed8' }}>+{detailModal.ticket.payment.unique_code}</strong></span>
                                            )} ({detailModal.ticket.payment.status.toUpperCase()})
                                        </Typography>
                                        {detailModal.ticket.payment.is_mixed_category && (
                                            <Box sx={{ mt: 1, p: 1.2, bgcolor: '#f5f3ff', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#6d28d9', display: 'block' }}>
                                                    🏢 CORPORATE / GROUP REGISTRATION (PIC DETAILS)
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#4c1d95', display: 'block', mt: 0.3 }}>
                                                    PIC: <strong>{detailModal.ticket.payment.pic_name}</strong> ({detailModal.ticket.payment.pic_institution || 'Corporate'}) &bull; {detailModal.ticket.payment.pic_email} &bull; {detailModal.ticket.payment.pic_phone || '-'}
                                                </Typography>
                                            </Box>
                                        )}
                                        {detailModal.ticket.payment.is_debt && detailModal.ticket.payment.debt_notes && (
                                            <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 700, display: 'block', mt: 0.5, bgcolor: '#fef3c7', p: 0.8, borderRadius: '6px' }}>
                                                📝 Debt Notes: "{detailModal.ticket.payment.debt_notes}"
                                            </Typography>
                                        )}
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
                                    {copySuccess ? 'Link Copied!' : 'Copy Link'}
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
                                        Send Email
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
                                    Print Badge
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
                                    {detailModal.ticket.checked_in ? 'Undo Check-In' : 'Check In Now'}
                                </Button>
                            </Box>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* MODAL 2: EDIT VISITOR DATA & GROUP PARTICIPANTS */}
            <Dialog 
                open={editModal.open} 
                onClose={() => setEditModal({ open: false, ticket: null })} 
                maxWidth="md" 
                fullWidth 
                PaperProps={{ 
                    sx: { 
                        borderRadius: '24px', 
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
                    } 
                }}
            >
                <form onSubmit={handleEditSubmit}>
                    <DialogTitle sx={{ p: 2.5, px: 3, bgcolor: '#ffffff', borderBottom: '1.5px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>✏️ Edit Registration & Participants</span>
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mt: 0.3 }}>
                                {editModal.ticket?.payment ? (
                                    <>
                                        Invoice: <strong>{(editModal.ticket.payment.receipt_no || editModal.ticket.payment.payment_code).replace('Receipt No. ', '')}</strong> • Code: {editModal.ticket.payment.payment_code} • {editData.members.length} Participant(s)
                                    </>
                                ) : (
                                    <>
                                        Single Participant • Code: {editModal.ticket?.ticket_code}
                                    </>
                                )}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setEditModal({ open: false, ticket: null })} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}>
                            <CloseIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f8fafc', maxHeight: '72vh', overflowY: 'auto' }}>
                        {/* INVOICE & PIC SUMMARY SECTION (IF PAYMENT EXISTS) */}
                        {editModal.ticket?.payment && (
                            <Box
                                sx={{
                                    p: 2.2,
                                    mb: 3,
                                    borderRadius: '16px',
                                    bgcolor: '#ffffff',
                                    border: '1.5px solid #e2e8f0',
                                    borderLeft: '5px solid #094d42',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip
                                            icon={<ReceiptLongIcon sx={{ fontSize: '14px !important', color: '#094d42 !important' }} />}
                                            label={(editModal.ticket.payment.receipt_no || editModal.ticket.payment.payment_code).replace('Receipt No. ', '')}
                                            size="small"
                                            sx={{
                                                bgcolor: '#ecfdf5',
                                                border: '1px solid #a7f3d0',
                                                color: '#065f46',
                                                fontWeight: 900,
                                                fontFamily: 'monospace',
                                                fontSize: '0.74rem',
                                            }}
                                        />
                                        <Chip
                                            label={editModal.ticket.payment.status.toUpperCase()}
                                            size="small"
                                            sx={{
                                                bgcolor: editModal.ticket.payment.status === 'approved' ? '#dcfce7' : editModal.ticket.payment.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                                border: `1px solid ${editModal.ticket.payment.status === 'approved' ? '#86efac' : editModal.ticket.payment.status === 'pending' ? '#fde68a' : '#fca5a5'}`,
                                                color: editModal.ticket.payment.status === 'approved' ? '#166534' : editModal.ticket.payment.status === 'pending' ? '#92400e' : '#991b1b',
                                                fontWeight: 900,
                                                fontSize: '0.68rem',
                                            }}
                                        />
                                        {editModal.ticket.payment.is_debt && (
                                            <Chip
                                                label="DEBT"
                                                size="small"
                                                sx={{ bgcolor: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', fontWeight: 900, fontSize: '0.68rem' }}
                                            />
                                        )}
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', fontSize: '0.68rem' }}>
                                            CURRENT INVOICE TOTAL
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 900,
                                                color: (editData.recalculate_total && liveEditTotal !== Number(editModal.ticket.payment.total_amount)) ? '#94a3b8' : '#094d42',
                                                fontSize: (editData.recalculate_total && liveEditTotal !== Number(editModal.ticket.payment.total_amount)) ? '0.85rem' : '1rem',
                                                fontFamily: 'monospace',
                                                textDecoration: (editData.recalculate_total && liveEditTotal !== Number(editModal.ticket.payment.total_amount)) ? 'line-through' : 'none',
                                            }}
                                        >
                                            Rp {Number(editModal.ticket.payment.total_amount || 0).toLocaleString('id-ID')}
                                        </Typography>
                                        {editData.recalculate_total && (
                                            <Box sx={{ mt: 0.3, display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: '#ecfdf5', px: 1, py: 0.25, borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                                                <Typography variant="caption" sx={{ color: '#047857', fontWeight: 900, fontSize: '0.76rem', fontFamily: 'monospace' }}>
                                                    Estimated New: Rp {liveEditTotal.toLocaleString('id-ID')}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 1.2, borderColor: '#f1f5f9' }} />

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={editData.recalculate_total}
                                                onChange={(e) => setEditData('recalculate_total', e.target.checked)}
                                                sx={{ color: '#094d42', '&.Mui-checked': { color: '#094d42' } }}
                                            />
                                        }
                                        label={
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', fontSize: '0.78rem' }}>
                                                Hitung ulang total tagihan otomatis
                                            </Typography>
                                        }
                                    />
                                </Box>

                                {/* KODE UNIK TRANSFER INPUT */}
                                <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                    <Box sx={{ minWidth: 160 }}>
                                        <TextField
                                            label="Kode Unik Transfer"
                                            type="number"
                                            size="small"
                                            value={editData.unique_code ?? 0}
                                            onChange={(e) => setEditData('unique_code', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">#</InputAdornment>,
                                            }}
                                            sx={{ bgcolor: '#ffffff', width: 160 }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: 200 }}>
                                        <Typography variant="caption" sx={{ color: '#334155', display: 'block', fontWeight: 800 }}>
                                            Kode Unik Transfer: <span style={{ color: '#1d4ed8' }}>+{liveEditUniqueCode}</span>
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                                            Subtotal: <strong>Rp {liveEditSubtotal.toLocaleString('id-ID')}</strong> + Kode Unik: <strong>Rp {liveEditUniqueCode.toLocaleString('id-ID')}</strong> = Estimasi Total: <strong style={{ color: '#094d42' }}>Rp {liveEditTotal.toLocaleString('id-ID')}</strong>
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* DEDICATED PIC / HRD / CORPORATE INVOICING SECTION */}
                                <Box sx={{ mt: 2, p: 2, bgcolor: '#ffffff', borderRadius: '12px', border: '1.5px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                <span>🏢 Data PIC / HRD Perusahaan (Penerima Invoice & Administrasi)</span>
                                            </Typography>
                                            <Chip
                                                label="Terpisah dari Peserta Delegasi"
                                                size="small"
                                                sx={{ bgcolor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', fontWeight: 800, fontSize: '0.68rem', height: 22 }}
                                            />
                                        </Box>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => {
                                                if (editData.members && editData.members[0]) {
                                                    setEditData(prev => ({
                                                        ...prev,
                                                        pic_name: prev.members[0].visitor_name || '',
                                                        pic_email: prev.members[0].visitor_email || '',
                                                        pic_phone: prev.members[0].visitor_phone || '',
                                                        pic_institution: prev.members[0].visitor_institution || '',
                                                        sync_pic_with_primary: false,
                                                    }));
                                                }
                                            }}
                                            sx={{
                                                textTransform: 'none',
                                                fontSize: '0.72rem',
                                                fontWeight: 700,
                                                borderColor: '#cbd5e1',
                                                color: '#475569',
                                                py: 0.3,
                                                px: 1.2,
                                                '&:hover': { borderColor: '#094d42', color: '#094d42', bgcolor: '#f0fdf4' }
                                            }}
                                        >
                                            📋 Salin dari Peserta #1
                                        </Button>
                                    </Box>

                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5, fontSize: '0.74rem', lineHeight: 1.5 }}>
                                        Kontak ini adalah <strong>PIC / HRD / Finance Perusahaan</strong> yang menerima tagihan invoice resmi, kwitansi, dan menangani revisi administrasi kantor (berdiri sendiri, terpisah dari 4 peserta delegasi).
                                    </Typography>

                                    <Grid container spacing={1.5}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Nama PIC / HRD *"
                                                size="small"
                                                fullWidth
                                                value={editData.pic_name || ''}
                                                onChange={(e) => setEditData('pic_name', e.target.value)}
                                                placeholder="cth: M. Reza Ramadhan / HRD"
                                                sx={{ bgcolor: '#ffffff' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Email PIC / HRD (Untuk Invoice & Bukti Resmi) *"
                                                size="small"
                                                fullWidth
                                                value={editData.pic_email || ''}
                                                onChange={(e) => setEditData('pic_email', e.target.value)}
                                                placeholder="cth: hrd.pepc@pertamina.com"
                                                helperText="Invoice & dokumen konfirmasi verifikasi dikirimkan ke email ini"
                                                sx={{ bgcolor: '#ffffff' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="WhatsApp / Telepon PIC"
                                                size="small"
                                                fullWidth
                                                value={editData.pic_phone || ''}
                                                onChange={(e) => setEditData('pic_phone', e.target.value)}
                                                placeholder="cth: 0812xxxxxxxx"
                                                sx={{ bgcolor: '#ffffff' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Instansi / Departemen Perusahaan *"
                                                size="small"
                                                fullWidth
                                                value={editData.pic_institution || ''}
                                                onChange={(e) => setEditData('pic_institution', e.target.value)}
                                                placeholder="cth: PT Pertamina EP Cepu (HC TAL)"
                                                sx={{ bgcolor: '#ffffff' }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        )}

                        {/* PARTICIPANT SECTION HEADER */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>👥 Participant Details</span>
                                <Chip
                                    label={`${editData.members.length} People`}
                                    size="small"
                                    sx={{ bgcolor: '#094d42', color: '#ffffff', fontWeight: 900, fontSize: '0.7rem', height: 22 }}
                                />
                            </Typography>

                            <Button
                                onClick={handleAddMember}
                                size="small"
                                startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                    background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)',
                                    border: '1.5px solid #a7f3d0',
                                    borderBottom: '3.5px solid #059669',
                                    color: '#065f46',
                                    fontSize: '0.78rem',
                                    fontWeight: 900,
                                    textTransform: 'none',
                                    borderRadius: '10px',
                                    px: 2,
                                    py: 0.6,
                                    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.15)',
                                    '&:hover': {
                                        background: 'linear-gradient(180deg, #d1fae5 0%, #a7f3d0 100%)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 8px rgba(5, 150, 105, 0.2)',
                                    },
                                    '&:active': { transform: 'translateY(1px)', borderBottom: '1px solid #059669' },
                                }}
                            >
                                + Add Another Participant
                            </Button>
                        </Box>

                        {/* PARTICIPANT CARDS */}
                        <Stack spacing={2.5}>
                            {editData.members.map((member, idx) => {
                                const isLeader = member.is_group_leader || idx === 0;
                                return (
                                    <Box
                                        key={idx}
                                        sx={{
                                            p: { xs: 2, sm: 2.8 },
                                            borderRadius: '20px',
                                            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                                            border: isLeader ? '1.5px solid #7dd3fc' : '1.5px solid #cbd5e1',
                                            borderBottom: isLeader ? '4.5px solid #0284c7' : '4.5px solid #94a3b8',
                                            boxShadow: isLeader
                                                ? '0 6px 20px -2px rgba(2, 132, 199, 0.12), inset 0 1px 0 #ffffff'
                                                : '0 6px 18px -2px rgba(15, 23, 42, 0.05), inset 0 1px 0 #ffffff',
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Card Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.2, flexWrap: 'wrap', gap: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip
                                                    label={isLeader ? 'Primary Registrant / Group Leader' : `Participant #${idx + 1}`}
                                                    size="small"
                                                    sx={{
                                                        background: isLeader 
                                                            ? 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)' 
                                                            : 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
                                                        border: isLeader ? '1.5px solid #7dd3fc' : '1.5px solid #cbd5e1',
                                                        borderBottom: isLeader ? '3px solid #0284c7' : '3px solid #94a3b8',
                                                        color: isLeader ? '#0369a1' : '#334155',
                                                        fontWeight: 900,
                                                        fontSize: '0.74rem',
                                                        height: 26,
                                                        px: 1,
                                                        borderRadius: '8px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                                                    }}
                                                />
                                                {member.id ? (
                                                    <Chip
                                                        label={member.ticket_code}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#f1f5f9',
                                                            border: '1px solid #cbd5e1',
                                                            color: '#475569',
                                                            fontFamily: 'monospace',
                                                            fontWeight: 800,
                                                            fontSize: '0.72rem',
                                                            height: 24,
                                                        }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="✨ New Participant"
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#fef3c7',
                                                            border: '1px solid #fde68a',
                                                            color: '#b45309',
                                                            fontWeight: 800,
                                                            fontSize: '0.7rem',
                                                            height: 24,
                                                        }}
                                                    />
                                                )}
                                                {CATEGORY_PRICES[member.visitor_type] > 0 ? (
                                                    <Chip
                                                        label={`Rp ${Number(CATEGORY_PRICES[member.visitor_type]).toLocaleString('id-ID')}`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#ecfdf5',
                                                            border: '1px solid #a7f3d0',
                                                            color: '#065f46',
                                                            fontFamily: 'monospace',
                                                            fontWeight: 900,
                                                            fontSize: '0.72rem',
                                                            height: 24,
                                                        }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="Free"
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#f8fafc',
                                                            border: '1px solid #e2e8f0',
                                                            color: '#64748b',
                                                            fontWeight: 800,
                                                            fontSize: '0.7rem',
                                                            height: 24,
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {!isLeader && (
                                                    <Button
                                                        onClick={() => handleSetGroupLeader(idx)}
                                                        size="small"
                                                        startIcon={<StarIcon sx={{ fontSize: 14, color: '#b45309' }} />}
                                                        sx={{
                                                            background: 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)',
                                                            border: '1px solid #fde68a',
                                                            borderBottom: '2.5px solid #f59e0b',
                                                            color: '#b45309',
                                                            fontSize: '0.72rem',
                                                            fontWeight: 800,
                                                            textTransform: 'none',
                                                            borderRadius: '8px',
                                                            px: 1.2,
                                                            py: 0.35,
                                                            boxShadow: '0 2px 4px rgba(245, 158, 11, 0.1)',
                                                            '&:hover': { background: '#fef3c7', transform: 'translateY(-1px)' },
                                                            '&:active': { transform: 'translateY(1px)' },
                                                        }}
                                                    >
                                                        Set as Leader
                                                    </Button>
                                                )}

                                                {editData.members.length > 1 && (
                                                    <Button
                                                        onClick={() => handleRemoveMember(idx)}
                                                        size="small"
                                                        startIcon={<DeleteOutlineIcon sx={{ fontSize: 15 }} />}
                                                        sx={{
                                                            background: 'linear-gradient(180deg, #fee2e2 0%, #fecaca 100%)',
                                                            border: '1px solid #fca5a5',
                                                            borderBottom: '2.5px solid #ef4444',
                                                            color: '#991b1b',
                                                            fontSize: '0.72rem',
                                                            fontWeight: 800,
                                                            textTransform: 'none',
                                                            borderRadius: '8px',
                                                            px: 1.4,
                                                            py: 0.35,
                                                            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.15)',
                                                            '&:hover': { background: 'linear-gradient(180deg, #fecaca 0%, #fca5a5 100%)', transform: 'translateY(-1px)' },
                                                            '&:active': { transform: 'translateY(1px)', borderBottom: '1px solid #ef4444' },
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>

                                        {/* Inputs 2x2 Grid */}
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Full Name *"
                                                    placeholder="e.g. Dr. John Doe, S.T., M.T."
                                                    value={member.visitor_name}
                                                    onChange={(e) => handleMemberChange(idx, 'visitor_name', e.target.value)}
                                                    fullWidth
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Box sx={{ p: 0.5, borderRadius: '6px', bgcolor: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center' }}>
                                                                    <PersonOutlineIcon sx={{ color: '#047857', fontSize: 16 }} />
                                                                </Box>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Email Address *"
                                                    type="email"
                                                    placeholder="e.g. john.doe@organization.com"
                                                    value={member.visitor_email}
                                                    onChange={(e) => handleMemberChange(idx, 'visitor_email', e.target.value)}
                                                    fullWidth
                                                    required
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Box sx={{ p: 0.5, borderRadius: '6px', bgcolor: '#f0f9ff', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center' }}>
                                                                    <EmailOutlinedIcon sx={{ color: '#0284c7', fontSize: 16 }} />
                                                                </Box>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="WhatsApp / Phone Number"
                                                    placeholder="e.g. +62 812 3456 7890"
                                                    value={member.visitor_phone}
                                                    onChange={(e) => handleMemberChange(idx, 'visitor_phone', e.target.value)}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Box sx={{ p: 0.5, borderRadius: '6px', bgcolor: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center' }}>
                                                                    <PhoneIphoneIcon sx={{ color: '#059669', fontSize: 16 }} />
                                                                </Box>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Institution / Company / University"
                                                    placeholder="e.g. Medco Energi / ITB / UGM"
                                                    value={member.visitor_institution}
                                                    onChange={(e) => handleMemberChange(idx, 'visitor_institution', e.target.value)}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Box sx={{ p: 0.5, borderRadius: '6px', bgcolor: '#f5f3ff', border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center' }}>
                                                                    <BusinessIcon sx={{ color: '#7c3aed', fontSize: 16 }} />
                                                                </Box>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Visitor Category</InputLabel>
                                                    <Select
                                                        value={member.visitor_type}
                                                        label="Visitor Category"
                                                        onChange={(e) => handleMemberChange(idx, 'visitor_type', e.target.value)}
                                                        renderValue={(selected) => {
                                                            const meta = getCategoryMeta(selected);
                                                            const price = CATEGORY_PRICES[selected];
                                                            return (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem' }} noWrap>
                                                                        {meta.label}
                                                                    </Typography>
                                                                    {price > 0 && (
                                                                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#094d42', fontFamily: 'monospace', fontSize: '0.74rem' }}>
                                                                            Rp {price.toLocaleString('id-ID')}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            );
                                                        }}
                                                    >
                                                        <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                                            1. PARTICIPANT (BERBAYAR)
                                                        </ListSubheader>
                                                        <MenuItem value="iagi_member_professional" sx={{ pl: 2.5, py: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#15803d', fontSize: '0.82rem' }}>
                                                                    • Professional (Member)
                                                                </Typography>
                                                                <Chip label="Rp 3.000.000" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 900, fontFamily: 'monospace', height: 20, fontSize: '0.68rem' }} />
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value="non_iagi_member_professional" sx={{ pl: 2.5, py: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', fontSize: '0.82rem' }}>
                                                                    • Professional (Non-Member)
                                                                </Typography>
                                                                <Chip label="Rp 4.000.000" size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 900, fontFamily: 'monospace', height: 20, fontSize: '0.68rem' }} />
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value="iagi_member_expatriate" sx={{ pl: 2.5, py: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#6d28d9', fontSize: '0.82rem' }}>
                                                                    • Expatriate (Member)
                                                                </Typography>
                                                                <Chip label="Rp 6.000.000" size="small" sx={{ bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 900, fontFamily: 'monospace', height: 20, fontSize: '0.68rem' }} />
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value="non_iagi_member_expatriate" sx={{ pl: 2.5, py: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#5b21b6', fontSize: '0.82rem' }}>
                                                                    • Expatriate (Non-Member)
                                                                </Typography>
                                                                <Chip label="Rp 7.000.000" size="small" sx={{ bgcolor: '#ede9fe', color: '#5b21b6', fontWeight: 900, fontFamily: 'monospace', height: 20, fontSize: '0.68rem' }} />
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value="student_undergraduate" sx={{ pl: 2.5, py: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#3730a3', fontSize: '0.82rem' }}>
                                                                    • Student Undergraduate
                                                                </Typography>
                                                                <Chip label="Rp 1.000.000" size="small" sx={{ bgcolor: '#e0e7ff', color: '#3730a3', fontWeight: 900, fontFamily: 'monospace', height: 20, fontSize: '0.68rem' }} />
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value="dosen" sx={{ pl: 2.5, py: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#b45309', fontSize: '0.82rem' }}>
                                                                    • Dosen
                                                                </Typography>
                                                                <Chip label="Rp 1.500.000" size="small" sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 900, fontFamily: 'monospace', height: 20, fontSize: '0.68rem' }} />
                                                            </Box>
                                                        </MenuItem>

                                                        <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                                            2. TECHNICAL (FREE / INVITED)
                                                        </ListSubheader>
                                                        <MenuItem value="presenter" sx={{ pl: 2.5, py: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#004C23', fontSize: '0.82rem' }}>
                                                                    1. 🎓 Presenter
                                                                </Typography>
                                                                <Chip label="Free" size="small" sx={{ bgcolor: '#ecfdf5', color: '#004C23', fontWeight: 900, height: 20, fontSize: '0.68rem' }} />
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value="student" sx={{ display: 'none' }}>1. 🎓 Presenter</MenuItem>
                                                        <MenuItem value="invited_speaker" sx={{ pl: 2.5, py: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#9d174d', fontSize: '0.82rem' }}>
                                                                    2. 🗣️ Invited Speaker
                                                                </Typography>
                                                                <Chip label="Free" size="small" sx={{ bgcolor: '#fdf2f8', color: '#9d174d', fontWeight: 900, height: 20, fontSize: '0.68rem' }} />
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value="session_chair_judge" sx={{ pl: 2.5, py: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0e7490', fontSize: '0.82rem' }}>
                                                                    3. ⚖️ Session Chair / Judge
                                                                </Typography>
                                                                <Chip label="Free" size="small" sx={{ bgcolor: '#ecfeff', color: '#0e7490', fontWeight: 900, height: 20, fontSize: '0.68rem' }} />
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value="oral" sx={{ display: 'none' }}>Oral Presenter</MenuItem>
                                                        <MenuItem value="poster" sx={{ display: 'none' }}>Poster Presenter</MenuItem>

                                                        <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                                            3. VISITOR PASS
                                                        </ListSubheader>
                                                        <MenuItem value="non_exclusive" sx={{ pl: 2.5, py: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#047857', fontSize: '0.82rem' }}>
                                                                    🎟️ Visitor Pass (Free)
                                                                </Typography>
                                                                <Chip label="Free" size="small" sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 900, height: 20, fontSize: '0.68rem' }} />
                                                            </Box>
                                                        </MenuItem>

                                                        <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                                            4. ROLES & INVITATIONS
                                                        </ListSubheader>
                                                        <MenuItem value="vip" sx={{ pl: 2.5, py: 0.8 }}>3. ⭐ VIP (Free)</MenuItem>
                                                        <MenuItem value="speaker" sx={{ pl: 2.5, py: 0.8 }}>4. 🎤 Keynote Speaker (Free)</MenuItem>
                                                        <MenuItem value="panelist" sx={{ pl: 2.5, py: 0.8 }}>5. 👥 Panelist (Free)</MenuItem>
                                                        <MenuItem value="moderator" sx={{ pl: 2.5, py: 0.8 }}>6. 🎯 Moderator (Free)</MenuItem>
                                                        <MenuItem value="exhibition" sx={{ pl: 2.5, py: 0.8 }}>7. 🏛️ Exhibition (Free)</MenuItem>
                                                        <MenuItem value="committee" sx={{ pl: 2.5, py: 0.8 }}>8. 👔 Committee (Free)</MenuItem>
                                                        <MenuItem value="student_volunteer" sx={{ pl: 2.5, py: 0.8 }}>9. 🤝 Student Volunteer (Free)</MenuItem>
                                                        <MenuItem value="board" sx={{ pl: 2.5, py: 0.8 }}>10. 🎖️ Board (Free)</MenuItem>
                                                        <MenuItem value="sponsorship" sx={{ pl: 2.5, py: 0.8 }}>11. 💎 Delegate (Free)</MenuItem>
                                                        <MenuItem value="student_crowd" sx={{ pl: 2.5, py: 0.8 }}>12. 🎓 Student Crowd (Free)</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Ticket Status</InputLabel>
                                                    <Select
                                                        value={member.status}
                                                        label="Ticket Status"
                                                        onChange={(e) => handleMemberChange(idx, 'status', e.target.value)}
                                                    >
                                                        <MenuItem value="active">Active</MenuItem>
                                                        <MenuItem value="pending">Pending Payment</MenuItem>
                                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ p: 2.5, px: 3, bgcolor: '#ffffff', borderTop: '1.5px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button onClick={() => setEditModal({ open: false, ticket: null })} sx={{ textTransform: 'none', color: '#64748b', fontWeight: 700 }}>
                            Cancel
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {editModal.ticket?.payment && editData.recalculate_total && (
                                <Chip
                                    label={`Est. Total: Rp ${liveEditTotal.toLocaleString('id-ID')}`}
                                    size="small"
                                    sx={{
                                        bgcolor: '#ecfdf5',
                                        border: '1px solid #a7f3d0',
                                        color: '#065f46',
                                        fontFamily: 'monospace',
                                        fontWeight: 900,
                                        fontSize: '0.74rem',
                                        height: 26,
                                    }}
                                />
                            )}
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800 }}>
                                {editData.members.length} participant(s) to save
                            </Typography>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={editProcessing}
                                startIcon={<SaveIcon />}
                                sx={{
                                    bgcolor: '#094d42',
                                    borderBottom: '3px solid #06332c',
                                    textTransform: 'none',
                                    fontWeight: 900,
                                    borderRadius: '10px',
                                    px: 3,
                                    py: 0.8,
                                    boxShadow: '0 4px 12px rgba(9, 77, 66, 0.25)',
                                    '&:hover': { bgcolor: '#0b5d50' },
                                }}
                            >
                                {editProcessing ? 'Saving Changes...' : 'Save All Changes'}
                            </Button>
                        </Box>
                    </DialogActions>
                </form>
            </Dialog>

            {/* MODAL 3: QUICK ONSITE REGISTRATION */}
            <Dialog 
                open={onsiteModalOpen} 
                onClose={() => setOnsiteModalOpen(false)} 
                maxWidth="md" 
                fullWidth 
                PaperProps={{ 
                    sx: { 
                        borderRadius: '24px', 
                        maxWidth: { xs: '95%', sm: '680px', md: '740px' },
                        overflow: 'hidden',
                        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.3)'
                    } 
                }}
            >
                <form onSubmit={handleOnsiteSubmit}>
                    {/* MODAL HEADER */}
                    <DialogTitle sx={{ p: 0, borderBottom: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2.2, sm: 3 }, py: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                                <Box sx={{ 
                                    width: 44, 
                                    height: 44, 
                                    borderRadius: '14px', 
                                    background: 'linear-gradient(135deg, #094d42 0%, #0d9488 100%)', 
                                    color: '#ffffff', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)'
                                }}>
                                    <PersonAddIcon sx={{ fontSize: 24 }} />
                                </Box>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                                            Registrasi Pengunjung Onsite
                                        </Typography>
                                        <Chip 
                                            label="Walk-in Desk" 
                                            size="small" 
                                            sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 800, fontSize: '0.68rem', height: 20, border: '1px solid #a7f3d0' }} 
                                        />
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block', mt: 0.3 }}>
                                        Pendaftaran langsung di venue — Tiket, Barcode & Kwitansi langsung terbit
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton 
                                size="small" 
                                onClick={() => { setOnsiteModalOpen(false); setOnsiteProofPreview(null); resetOnsite(); }}
                                sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a', bgcolor: '#f1f5f9' } }}
                            >
                                <CloseIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    {/* MODAL BODY */}
                    <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f8fafc', maxHeight: 'calc(85vh - 140px)', overflowY: 'auto' }}>
                        {/* CARD 1: DATA PENGUNJUNG */}
                        <Paper elevation={0} sx={{ p: 2.2, borderRadius: '16px', bgcolor: '#ffffff', border: '1px solid #e2e8f0', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.8 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <Box component="span" sx={{ width: 22, height: 22, borderRadius: '6px', bgcolor: '#e6f4f1', color: '#094d42', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900 }}>1</Box>
                                    Data & Kategori Pengunjung
                                </Typography>
                                {liveOnsiteBasePrice > 0 ? (
                                    <Chip 
                                        label={`Tarif: Rp ${liveOnsiteBasePrice.toLocaleString('id-ID')}`} 
                                        size="small" 
                                        sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 800, fontSize: '0.72rem', height: 22, border: '1px solid #bfdbfe' }} 
                                    />
                                ) : (
                                    <Chip 
                                        label="Akses Gratis (Rp 0)" 
                                        size="small" 
                                        sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 800, fontSize: '0.72rem', height: 22, border: '1px solid #a7f3d0' }} 
                                    />
                                )}
                            </Box>

                            <Stack spacing={1.8}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="visitor-cat-label" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Pilih Kategori Tiket / Visitor</InputLabel>
                                    <Select
                                        labelId="visitor-cat-label"
                                        value={onsiteData.visitor_type}
                                        label="Pilih Kategori Tiket / Visitor"
                                        onChange={(e) => setOnsiteData('visitor_type', e.target.value)}
                                        sx={{ borderRadius: '10px', fontSize: '0.88rem' }}
                                    >
                                        <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                            1. PARTICIPANT
                                        </ListSubheader>
                                        <MenuItem value="iagi_member_professional" sx={{ pl: 3 }}>• Professional (Member) - Rp 3.000.000</MenuItem>
                                        <MenuItem value="non_iagi_member_professional" sx={{ pl: 3 }}>• Professional (Non-Member) - Rp 4.000.000</MenuItem>
                                        <MenuItem value="iagi_member_expatriate" sx={{ pl: 3 }}>• Expatriate (Member) - Rp 6.000.000</MenuItem>
                                        <MenuItem value="non_iagi_member_expatriate" sx={{ pl: 3 }}>• Expatriate (Non-Member) - Rp 7.000.000</MenuItem>
                                        <MenuItem value="student_undergraduate" sx={{ pl: 3 }}>• Student Undergraduate - Rp 1.000.000</MenuItem>
                                        <MenuItem value="dosen" sx={{ pl: 3 }}>• Dosen - Rp 1.500.000</MenuItem>

                                        <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                            2. TECHNICAL
                                        </ListSubheader>
                                        <MenuItem value="presenter" sx={{ pl: 3 }}>1. 🎓 Presenter (Invited / Free)</MenuItem>
                                        <MenuItem value="student" sx={{ display: 'none' }}>1. 🎓 Presenter (Invited / Free)</MenuItem>
                                        <MenuItem value="invited_speaker" sx={{ pl: 3 }}>2. 🗣️ Invited Speaker (Invited / Free)</MenuItem>
                                        <MenuItem value="session_chair_judge" sx={{ pl: 3 }}>3. ⚖️ Session Chair / Judge (Invited / Free)</MenuItem>
                                        <MenuItem value="oral" sx={{ display: 'none' }}>Oral Presenter (Invited / Free)</MenuItem>
                                        <MenuItem value="poster" sx={{ display: 'none' }}>Poster Presenter (Invited / Free)</MenuItem>

                                        <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                            3. VISITOR
                                        </ListSubheader>
                                        <MenuItem value="non_exclusive" sx={{ pl: 3 }}>🎟️ Visitor Pass (Free / Rp 0)</MenuItem>

                                        <ListSubheader sx={{ fontWeight: 800, color: '#094d42', bgcolor: '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                            4. ROLES & INVITATIONS
                                        </ListSubheader>
                                        <MenuItem value="vip">3. ⭐ VIP (Invited / Free)</MenuItem>
                                        <MenuItem value="speaker">4. 🎤 Keynote Speaker (Invited / Free)</MenuItem>
                                        <MenuItem value="panelist">5. 👥 Panelist (Invited / Free)</MenuItem>
                                        <MenuItem value="moderator">6. 🎯 Moderator (Invited / Free)</MenuItem>
                                        <MenuItem value="exhibition">7. 🏛️ Exhibition (Invited / Free)</MenuItem>
                                        <MenuItem value="committee">8. 👔 Committee (Invited / Free)</MenuItem>
                                        <MenuItem value="student_volunteer">9. 🤝 Student Volunteer (Invited / Free)</MenuItem>
                                        <MenuItem value="board">10. 🎖️ Board (Invited / Free)</MenuItem>
                                        <MenuItem value="sponsorship">11. 💎 Delegate (Invited / Free)</MenuItem>
                                        <MenuItem value="student_crowd">12. 🎓 Student Crowd (Invited / Free)</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* 2-Column Responsive Grid for inputs */}
                                <Grid container spacing={1.5}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Nama Lengkap"
                                            placeholder="cth: Dr. Ir. Budi Santoso, M.T."
                                            value={onsiteData.visitor_name}
                                            onChange={(e) => setOnsiteData('visitor_name', e.target.value)}
                                            fullWidth
                                            size="small"
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonOutlineIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ bgcolor: '#ffffff' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Alamat Email"
                                            type="email"
                                            placeholder="budi@instansi.ac.id"
                                            value={onsiteData.visitor_email}
                                            onChange={(e) => setOnsiteData('visitor_email', e.target.value)}
                                            fullWidth
                                            size="small"
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ bgcolor: '#ffffff' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Nomor WhatsApp / HP"
                                            placeholder="081234567890"
                                            value={onsiteData.visitor_phone}
                                            onChange={(e) => setOnsiteData('visitor_phone', e.target.value)}
                                            fullWidth
                                            size="small"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIphoneIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ bgcolor: '#ffffff' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Instansi / Organisasi"
                                            placeholder="Universitas / Perusahaan / Lembaga"
                                            value={onsiteData.visitor_institution}
                                            onChange={(e) => setOnsiteData('visitor_institution', e.target.value)}
                                            fullWidth
                                            size="small"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BusinessIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ bgcolor: '#ffffff' }}
                                        />
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Paper>

                        {/* CARD 2: STATUS & RINCIAN PEMBAYARAN */}
                        <Paper elevation={0} sx={{ p: 2.2, borderRadius: '16px', bgcolor: '#ffffff', border: '1px solid #e2e8f0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <Box component="span" sx={{ width: 22, height: 22, borderRadius: '6px', bgcolor: '#e6f4f1', color: '#094d42', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900 }}>2</Box>
                                    Status & Metode Pembayaran
                                </Typography>
                            </Box>

                            {/* 3 Selectable Interactive Cards */}
                            <Grid container spacing={1.2}>
                                <Grid item xs={12} sm={4}>
                                    <Box 
                                        onClick={() => setOnsiteData('payment_status', 'paid_cash')}
                                        sx={{
                                            p: 1.4,
                                            borderRadius: '12px',
                                            border: '1.5px solid',
                                            borderColor: onsiteData.payment_status === 'paid_cash' ? '#10b981' : '#e2e8f0',
                                            bgcolor: onsiteData.payment_status === 'paid_cash' ? '#f0fdf4' : '#fafafa',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: onsiteData.payment_status === 'paid_cash' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.4,
                                            height: '100%',
                                            '&:hover': { borderColor: '#10b981', bgcolor: '#f0fdf4' }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                <PaidIcon sx={{ fontSize: 18, color: onsiteData.payment_status === 'paid_cash' ? '#059669' : '#64748b' }} />
                                                <Typography sx={{ fontWeight: 800, fontSize: '0.80rem', color: onsiteData.payment_status === 'paid_cash' ? '#065f46' : '#334155' }}>
                                                    Lunas Onsite
                                                </Typography>
                                            </Box>
                                            {onsiteData.payment_status === 'paid_cash' && (
                                                <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                            )}
                                        </Box>
                                        <Typography sx={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.3 }}>
                                            Cash / Mesin EDC / QRIS (Lunas)
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Box 
                                        onClick={() => setOnsiteData('payment_status', 'free_bypass')}
                                        sx={{
                                            p: 1.4,
                                            borderRadius: '12px',
                                            border: '1.5px solid',
                                            borderColor: onsiteData.payment_status === 'free_bypass' ? '#8b5cf6' : '#e2e8f0',
                                            bgcolor: onsiteData.payment_status === 'free_bypass' ? '#f5f3ff' : '#fafafa',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: onsiteData.payment_status === 'free_bypass' ? '0 4px 12px rgba(139, 92, 246, 0.15)' : 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.4,
                                            height: '100%',
                                            '&:hover': { borderColor: '#8b5cf6', bgcolor: '#f5f3ff' }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                <StarIcon sx={{ fontSize: 18, color: onsiteData.payment_status === 'free_bypass' ? '#7c3aed' : '#64748b' }} />
                                                <Typography sx={{ fontWeight: 800, fontSize: '0.80rem', color: onsiteData.payment_status === 'free_bypass' ? '#5b21b6' : '#334155' }}>
                                                    Gratis / VIP
                                                </Typography>
                                            </Box>
                                            {onsiteData.payment_status === 'free_bypass' && (
                                                <CheckCircleIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />
                                            )}
                                        </Box>
                                        <Typography sx={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.3 }}>
                                            Undangan VIP, Sponsor, Panitia
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Box 
                                        onClick={() => setOnsiteData('payment_status', 'pending')}
                                        sx={{
                                            p: 1.4,
                                            borderRadius: '12px',
                                            border: '1.5px solid',
                                            borderColor: onsiteData.payment_status === 'pending' ? '#f59e0b' : '#e2e8f0',
                                            bgcolor: onsiteData.payment_status === 'pending' ? '#fffbeb' : '#fafafa',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: onsiteData.payment_status === 'pending' ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.4,
                                            height: '100%',
                                            '&:hover': { borderColor: '#f59e0b', bgcolor: '#fffbeb' }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                <AccessTimeIcon sx={{ fontSize: 18, color: onsiteData.payment_status === 'pending' ? '#d97706' : '#64748b' }} />
                                                <Typography sx={{ fontWeight: 800, fontSize: '0.80rem', color: onsiteData.payment_status === 'pending' ? '#92400e' : '#334155' }}>
                                                    Belum Bayar
                                                </Typography>
                                            </Box>
                                            {onsiteData.payment_status === 'pending' && (
                                                <CheckCircleIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                            )}
                                        </Box>
                                        <Typography sx={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.3 }}>
                                            Pending (Menunggu Pembayaran)
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* IF CATEGORY IS PAID & NOT FREE BYPASS */}
                            {onsiteData.payment_status !== 'free_bypass' && liveOnsiteBasePrice > 0 && (
                                <Box sx={{ mt: 2.2 }}>
                                    {/* FITUR DISKON (SEGMENTED TABS) */}
                                    <Box sx={{ p: 1.8, bgcolor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1.2 }}>
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 0.6, fontSize: '0.78rem' }}>
                                                <DiscountIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                                Diskon Pembayaran Khusus (Opsional):
                                            </Typography>

                                            {/* Segmented Switch */}
                                            <Box sx={{ display: 'inline-flex', bgcolor: '#e2e8f0', p: '3px', borderRadius: '8px' }}>
                                                <Button
                                                    size="small"
                                                    onClick={() => setOnsiteData(prev => ({ ...prev, discount_type: 'none', discount_value: '' }))}
                                                    sx={{
                                                        py: 0.3, px: 1.2, minWidth: 0, fontSize: '0.72rem', textTransform: 'none', fontWeight: 800,
                                                        bgcolor: onsiteData.discount_type === 'none' ? '#ffffff' : 'transparent',
                                                        color: onsiteData.discount_type === 'none' ? '#0f172a' : '#64748b',
                                                        boxShadow: onsiteData.discount_type === 'none' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                                        borderRadius: '6px',
                                                        '&:hover': { bgcolor: onsiteData.discount_type === 'none' ? '#ffffff' : '#cbd5e1' }
                                                    }}
                                                >
                                                    Tanpa Diskon
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={() => setOnsiteData(prev => ({ ...prev, discount_type: 'nominal', discount_value: prev.discount_type === 'nominal' ? prev.discount_value : '' }))}
                                                    sx={{
                                                        py: 0.3, px: 1.2, minWidth: 0, fontSize: '0.72rem', textTransform: 'none', fontWeight: 800,
                                                        bgcolor: onsiteData.discount_type === 'nominal' ? '#0284c7' : 'transparent',
                                                        color: onsiteData.discount_type === 'nominal' ? '#ffffff' : '#64748b',
                                                        boxShadow: onsiteData.discount_type === 'nominal' ? '0 2px 4px rgba(2,132,199,0.25)' : 'none',
                                                        borderRadius: '6px',
                                                        '&:hover': { bgcolor: onsiteData.discount_type === 'nominal' ? '#0369a1' : '#cbd5e1' }
                                                    }}
                                                >
                                                    Potongan Rp
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={() => setOnsiteData(prev => ({ ...prev, discount_type: 'percent', discount_value: prev.discount_type === 'percent' ? prev.discount_value : '' }))}
                                                    sx={{
                                                        py: 0.3, px: 1.2, minWidth: 0, fontSize: '0.72rem', textTransform: 'none', fontWeight: 800,
                                                        bgcolor: onsiteData.discount_type === 'percent' ? '#7c3aed' : 'transparent',
                                                        color: onsiteData.discount_type === 'percent' ? '#ffffff' : '#64748b',
                                                        boxShadow: onsiteData.discount_type === 'percent' ? '0 2px 4px rgba(124,58,237,0.25)' : 'none',
                                                        borderRadius: '6px',
                                                        '&:hover': { bgcolor: onsiteData.discount_type === 'percent' ? '#6d28d9' : '#cbd5e1' }
                                                    }}
                                                >
                                                    Potongan %
                                                </Button>
                                            </Box>
                                        </Box>

                                        {onsiteData.discount_type !== 'none' && (
                                            <Box sx={{ mt: 1.2, pt: 1.2, borderTop: '1px dashed #cbd5e1' }}>
                                                <Grid container spacing={1.5} alignItems="center">
                                                    <Grid item xs={12} sm={4}>
                                                        <TextField
                                                            size="small"
                                                            fullWidth
                                                            type="number"
                                                            placeholder={onsiteData.discount_type === 'percent' ? 'cth: 20' : 'cth: 500000'}
                                                            value={onsiteData.discount_value}
                                                            onChange={(e) => {
                                                                const val = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0);
                                                                if (val === '') {
                                                                    setOnsiteData('discount_value', '');
                                                                } else {
                                                                    setOnsiteData('discount_value', onsiteData.discount_type === 'percent' ? Math.min(100, val) : Math.min(liveOnsiteBasePrice, val));
                                                                }
                                                            }}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Typography sx={{ 
                                                                            fontSize: '0.80rem', 
                                                                            fontWeight: 900, 
                                                                            color: onsiteData.discount_type === 'percent' ? '#7c3aed' : '#0284c7' 
                                                                        }}>
                                                                            {onsiteData.discount_type === 'percent' ? '%' : 'Rp'}
                                                                        </Typography>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            sx={{ bgcolor: '#ffffff' }}
                                                            inputProps={{ 
                                                                min: 0, 
                                                                max: onsiteData.discount_type === 'percent' ? 100 : liveOnsiteBasePrice,
                                                                style: { fontFamily: 'monospace', fontWeight: 800, fontSize: '0.90rem' } 
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={8}>
                                                        <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', alignItems: 'center' }}>
                                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.70rem', fontWeight: 700 }}>
                                                                Pilihan Cepat:
                                                            </Typography>
                                                            {onsiteData.discount_type === 'percent' ? (
                                                                [10, 20, 25, 50, 100].map(pct => (
                                                                    <Chip
                                                                        key={pct}
                                                                        label={pct === 100 ? '100% (Gratis)' : `${pct}%`}
                                                                        size="small"
                                                                        onClick={() => setOnsiteData('discount_value', pct)}
                                                                        sx={{
                                                                            cursor: 'pointer',
                                                                            fontWeight: 800,
                                                                            fontSize: '0.72rem',
                                                                            height: 26,
                                                                            bgcolor: Number(onsiteData.discount_value) === pct ? '#7c3aed' : '#ffffff',
                                                                            color: Number(onsiteData.discount_value) === pct ? '#ffffff' : '#6d28d9',
                                                                            border: `1px solid ${Number(onsiteData.discount_value) === pct ? '#7c3aed' : '#ddd6fe'}`,
                                                                            '&:hover': { bgcolor: '#ede9fe' }
                                                                        }}
                                                                    />
                                                                ))
                                                            ) : (
                                                                [100000, 250000, 500000, 750000, 1000000].filter(amt => amt <= liveOnsiteBasePrice).map(amt => (
                                                                    <Chip
                                                                        key={amt}
                                                                        label={`Rp ${(amt / 1000).toLocaleString('id-ID')}k`}
                                                                        size="small"
                                                                        onClick={() => setOnsiteData('discount_value', amt)}
                                                                        sx={{
                                                                            cursor: 'pointer',
                                                                            fontWeight: 800,
                                                                            fontSize: '0.72rem',
                                                                            height: 26,
                                                                            bgcolor: Number(onsiteData.discount_value) === amt ? '#0284c7' : '#ffffff',
                                                                            color: Number(onsiteData.discount_value) === amt ? '#ffffff' : '#0369a1',
                                                                            border: `1px solid ${Number(onsiteData.discount_value) === amt ? '#0284c7' : '#bae6fd'}`,
                                                                            '&:hover': { bgcolor: '#e0f2fe' }
                                                                        }}
                                                                    />
                                                                ))
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            size="small"
                                                            fullWidth
                                                            placeholder="Keterangan / Alasan Diskon (cth: Dosen Tamu / Mahasiswa Undangan / Kerjasama BEM)"
                                                            value={onsiteData.discount_notes}
                                                            onChange={(e) => setOnsiteData('discount_notes', e.target.value)}
                                                            sx={{ bgcolor: '#ffffff' }}
                                                            inputProps={{ style: { fontSize: '0.80rem' } }}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                {liveDiscountAmount > 0 && (
                                                    <Box sx={{ mt: 1.2, p: 1, bgcolor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                                                        <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 800, fontSize: '0.74rem' }}>
                                                            ✂️ Potongan Diskon Diterapkan: - Rp {liveDiscountAmount.toLocaleString('id-ID')}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#047857', fontWeight: 900, fontSize: '0.74rem' }}>
                                                            Tarif Bersih: Rp {livePriceAfterDiscount.toLocaleString('id-ID')}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        )}
                                    </Box>

                                    {/* BILLING / POS SUMMARY RECEIPT CARD */}
                                    <Box sx={{ 
                                        p: 2.2, 
                                        borderRadius: '16px', 
                                        background: 'linear-gradient(135deg, #094d42 0%, #064e3b 100%)', 
                                        color: '#ffffff',
                                        boxShadow: '0 10px 25px -5px rgba(9, 77, 66, 0.4)',
                                        mb: 2
                                    }}>
                                        {/* Breakdown List */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.74rem', fontWeight: 600 }}>
                                                Tarif Dasar Kategori Tiket
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#ffffff' }}>
                                                Rp {liveOnsiteBasePrice.toLocaleString('id-ID')}
                                            </Typography>
                                        </Box>

                                        {liveDiscountAmount > 0 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                                                <Typography variant="caption" sx={{ color: '#fde047', fontSize: '0.74rem', fontWeight: 700 }}>
                                                    Potongan Diskon ({liveDiscountType === 'percent' ? `${liveDiscountRawVal}%` : 'Nominal'})
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#fde047' }}>
                                                    - Rp {liveDiscountAmount.toLocaleString('id-ID')}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.74rem', fontWeight: 600 }}>
                                                    Kode Unik Transfer
                                                </Typography>
                                                {livePriceAfterDiscount > 0 ? (
                                                    <Chip 
                                                        label={`+ Rp ${liveOnsiteUniqueCode}`} 
                                                        size="small" 
                                                        sx={{ bgcolor: '#34d399', color: '#064e3b', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.72rem', height: 20 }} 
                                                    />
                                                ) : (
                                                    <Chip 
                                                        label="Rp 0 (Gratis)" 
                                                        size="small" 
                                                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 800, fontSize: '0.70rem', height: 20 }} 
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="caption" sx={{ color: '#a7f3d0', fontSize: '0.70rem', fontWeight: 700 }}>
                                                {livePriceAfterDiscount > 0 ? '🛡️ Terverifikasi Unik Otomatis' : '🎉 Diskon Penuh 100%'}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1.2 }} />

                                        {/* Final Total Row */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', display: 'block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em' }}>
                                                    TOTAL TAGIHAN ONSITE
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.66rem' }}>
                                                    {liveDiscountAmount > 0 
                                                        ? `(Rp ${liveOnsiteBasePrice.toLocaleString('id-ID')} - Diskon + Rp ${liveOnsiteUniqueCode})`
                                                        : `(Rp ${liveOnsiteBasePrice.toLocaleString('id-ID')} + Rp ${liveOnsiteUniqueCode})`}
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" sx={{ color: '#34d399', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '-0.02em', lineHeight: 1 }}>
                                                Rp {liveOnsiteTotal.toLocaleString('id-ID')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {/* UPLOAD BUKTI PEMBAYARAN */}
                            {onsiteData.payment_status !== 'free_bypass' && (
                                <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px dashed #cbd5e1' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block', mb: 0.8, fontSize: '0.78rem' }}>
                                        📎 Bukti Pembayaran / Struk (Opsional):
                                    </Typography>

                                    {!onsiteData.proof_of_payment ? (
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            fullWidth
                                            startIcon={<CloudUploadIcon sx={{ color: '#094d42' }} />}
                                            sx={{
                                                p: 1.2,
                                                textTransform: 'none',
                                                borderRadius: '10px',
                                                fontSize: '0.80rem',
                                                fontWeight: 700,
                                                borderStyle: 'dashed',
                                                borderWidth: '1.5px',
                                                borderColor: '#cbd5e1',
                                                color: '#334155',
                                                bgcolor: '#f8fafc',
                                                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#094d42' }
                                            }}
                                        >
                                            Pilih File Foto Struk EDC / Bukti Transfer / PDF
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*,application/pdf"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setOnsiteData('proof_of_payment', file);
                                                        if (file.type.startsWith('image/')) {
                                                            const reader = new FileReader();
                                                            reader.onload = (ev) => setOnsiteProofPreview(ev.target.result);
                                                            reader.readAsDataURL(file);
                                                        } else {
                                                            setOnsiteProofPreview(null);
                                                        }
                                                    }
                                                }}
                                            />
                                        </Button>
                                    ) : (
                                        <Box sx={{ 
                                            p: 1.2, 
                                            borderRadius: '10px', 
                                            bgcolor: '#f0fdf4', 
                                            border: '1px solid #86efac', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between',
                                            flexWrap: 'wrap',
                                            gap: 1
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                {onsiteProofPreview ? (
                                                    <Box sx={{ width: 44, height: 44, borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
                                                        <img src={onsiteProofPreview} alt="Preview Bukti" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </Box>
                                                ) : (
                                                    <ReceiptLongIcon sx={{ color: '#059669', fontSize: 28 }} />
                                                )}
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#065f46', fontSize: '0.80rem' }}>
                                                        {onsiteData.proof_of_payment.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#15803d', fontSize: '0.68rem' }}>
                                                        {(onsiteData.proof_of_payment.size / 1024).toFixed(1)} KB • Siap Diupload
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setOnsiteData('proof_of_payment', null);
                                                    setOnsiteProofPreview(null);
                                                }}
                                                startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                                                sx={{ textTransform: 'none', fontSize: '0.72rem', fontWeight: 700 }}
                                            >
                                                Hapus
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Paper>
                    </DialogContent>

                    {/* MODAL FOOTER */}
                    <DialogActions sx={{ 
                        px: { xs: 2.2, sm: 3 }, 
                        py: 2, 
                        borderTop: '1px solid #e2e8f0', 
                        bgcolor: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1.5
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <CheckCircleIcon sx={{ fontSize: 17, color: '#10b981' }} />
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.74rem' }}>
                                ID Badge & QR Code langsung terbit otomatis
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
                            <Button 
                                onClick={() => { setOnsiteModalOpen(false); setOnsiteProofPreview(null); resetOnsite(); }} 
                                sx={{ textTransform: 'none', color: '#64748b', fontWeight: 700, px: 2, borderRadius: '10px' }}
                            >
                                Batal
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                disabled={onsiteProcessing} 
                                sx={{ 
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                                    textTransform: 'none', 
                                    fontWeight: 900, 
                                    borderRadius: '10px',
                                    px: 2.8,
                                    py: 1,
                                    fontSize: '0.88rem',
                                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                                    '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
                                }}
                            >
                                {onsiteProcessing 
                                    ? 'Menerbitkan Tiket...' 
                                    : (liveOnsiteTotal > 0 
                                        ? `Terbitkan Tiket • Rp ${liveOnsiteTotal.toLocaleString('id-ID')}`
                                        : 'Terbitkan Tiket (Gratis)')}
                            </Button>
                        </Box>
                    </DialogActions>
                </form>
            </Dialog>


            {/* MODAL 3B: IMPORT EXCEL / CSV TICKETS (ESPECIALLY TECHNICAL) */}
            <Dialog 
                open={importModalOpen} 
                onClose={() => !importProcessing && setImportModalOpen(false)} 
                maxWidth="md" 
                fullWidth 
                PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}
            >
                <form onSubmit={handleImportSubmit}>
                    <DialogTitle sx={{ fontWeight: 900, color: '#0f172a', bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ bgcolor: '#e0f2fe', color: '#0284c7', p: 1, borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                                <CloudUploadIcon sx={{ fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2, color: '#0f172a' }}>
                                    Import Peserta / Technical (Excel & CSV)
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                    Upload data massal (misal 200 data Oral, Poster, Presenter, Student, Judge)
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={() => setImportModalOpen(false)} disabled={importProcessing} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3 }}>
                        {/* Step 1: Download Template Banner */}
                        <Box sx={{ p: 2.5, mb: 3, bgcolor: '#f0fdf4', borderRadius: '16px', border: '1.5px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ maxWidth: '480px' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#166534', mb: 0.5 }}>
                                    📥 Langkah 1: Download Format Template
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#15803d', fontSize: '0.84rem' }}>
                                    Gunakan template resmi agar susunan kolom sesuai (Nama Lengkap, Email, No HP, Institusi, Kategori).
                                </Typography>
                            </Box>
                            <Button
                                component="a"
                                href={route('admin.visitorTickets.importTemplate')}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                startIcon={<FileDownloadIcon />}
                                sx={{
                                    bgcolor: '#16a34a',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: '0.82rem',
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    px: 2,
                                    py: 0.9,
                                    boxShadow: '0 3px 0 #15803d, 0 6px 12px rgba(22,163,74,0.2)',
                                    '&:hover': {
                                        bgcolor: '#15803d',
                                    }
                                }}
                            >
                                Download Template (.csv)
                            </Button>
                        </Box>

                        {/* Guide on Technical Roles */}
                        <Box sx={{ p: 2, mb: 3, bgcolor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                💡 Aturan Penulisan Kolom "Kategori" (Role Technical):
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ p: 1, bgcolor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                                        <strong>1. 🎓 Presenter</strong>
                                        <div style={{ color: '#64748b' }}>Tulis: <code>Presenter</code></div>
                                        <div style={{ color: '#004C23', fontWeight: 700 }}>Badge: PRESENTER</div>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ p: 1, bgcolor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                                        <strong>2. 🗣️ Invited Speaker</strong>
                                        <div style={{ color: '#64748b' }}>Tulis: <code>Invited Speaker</code></div>
                                        <div style={{ color: '#9d174d', fontWeight: 700 }}>Badge: INVITED SPEAKER</div>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ p: 1, bgcolor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                                        <strong>3. ⚖️ Session Chair / Judge</strong>
                                        <div style={{ color: '#64748b' }}>Tulis: <code>Session Chair / Judge</code></div>
                                        <div style={{ color: '#0e7490', fontWeight: 700 }}>Badge: CHAIR / JUDGE</div>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Step 2: Upload File Area */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                            📁 Langkah 2: Upload File Excel (.xlsx) atau CSV
                        </Typography>
                        <Box
                            component="label"
                            sx={{
                                border: '2px dashed',
                                borderColor: importFile ? '#0284c7' : '#cbd5e1',
                                bgcolor: importFile ? '#f0f9ff' : '#fafafa',
                                borderRadius: '16px',
                                p: 3,
                                textAlign: 'center',
                                display: 'block',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: '#0284c7',
                                    bgcolor: '#f0f9ff',
                                }
                            }}
                        >
                            <input
                                type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xlsx, .xls, .txt"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImportFile(e.target.files[0]);
                                    }
                                }}
                            />
                            <CloudUploadIcon sx={{ fontSize: 44, color: importFile ? '#0284c7' : '#94a3b8', mb: 1 }} />
                            {importFile ? (
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#0369a1' }}>
                                        {importFile.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                        {(importFile.size / 1024).toFixed(1)} KB • Klik untuk ganti file
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
                                        Klik untuk memilih file Excel (.xlsx) atau CSV
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                        Mendukung hingga ribuan data sekaligus (maksimal 15 MB)
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Optional Email Checkbox */}
                        <Box sx={{ mt: 2.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={importSendEmail}
                                        onChange={(e) => setImportSendEmail(e.target.checked)}
                                        size="small"
                                        sx={{ color: '#094d42', '&.Mui-checked': { color: '#094d42' } }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', fontSize: '0.85rem' }}>
                                        Kirim notifikasi E-Tiket ke email peserta sekarang juga (Opsional)
                                    </Typography>
                                }
                            />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5, px: 1 }}>
                            *Untuk 200 data, disarankan uncheck agar import selesai instan (E-Tiket bisa dikirim massal nanti via tombol "Resend Emails").
                        </Typography>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                        <Button 
                            onClick={() => setImportModalOpen(false)} 
                            disabled={importProcessing} 
                            sx={{ color: '#64748b', textTransform: 'none', fontWeight: 700 }}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!importFile || importProcessing}
                            startIcon={importProcessing ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
                            sx={{
                                bgcolor: '#0284c7',
                                color: '#ffffff',
                                fontWeight: 800,
                                px: 3,
                                py: 1,
                                borderRadius: '10px',
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#0369a1' }
                            }}
                        >
                            {importProcessing ? 'Memproses Import...' : 'Mulai Import Data'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* MODAL 4: PROOF OF PAYMENT LIGHTBOX & DEBT MANAGEMENT */}
            <Dialog open={proofModal.open} onClose={() => setProofModal({ open: false, payment: null })} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '18px', overflow: 'hidden' } }}>
                {proofModal.payment && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, px: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                    📄 Payment Code: <span style={{ fontFamily: 'monospace' }}>{proofModal.payment.payment_code}</span>
                                </Typography>
                                <Chip
                                    label={proofModal.payment.status.toUpperCase()}
                                    size="small"
                                    sx={{
                                        height: 22,
                                        fontSize: '0.65rem',
                                        bgcolor: proofModal.payment.status === 'approved' ? '#dcfce7' : proofModal.payment.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                        color: proofModal.payment.status === 'approved' ? '#166534' : proofModal.payment.status === 'pending' ? '#92400e' : '#991b1b',
                                        fontWeight: 900,
                                        border: `1px solid ${proofModal.payment.status === 'approved' ? '#86efac' : proofModal.payment.status === 'pending' ? '#fde68a' : '#fca5a5'}`,
                                    }}
                                />
                                {proofModal.payment.is_debt ? (
                                    <Chip
                                        icon={<WarningAmberIcon sx={{ fontSize: '13px !important', color: '#92400e !important' }} />}
                                        label="⚠️ INVOICE TAG (OUTSTANDING)"
                                        size="small"
                                        sx={{
                                            height: 22,
                                            fontSize: '0.65rem',
                                            bgcolor: '#fef3c7',
                                            color: '#92400e',
                                            fontWeight: 900,
                                            border: '1px solid #f59e0b',
                                        }}
                                    />
                                ) : proofModal.payment.debt_settled_at ? (
                                    <Chip
                                        icon={<TaskAltIcon sx={{ fontSize: '13px !important', color: '#15803d !important' }} />}
                                        label="✅ PAID (INVOICE CLEARED)"
                                        size="small"
                                        sx={{
                                            height: 22,
                                            fontSize: '0.65rem',
                                            bgcolor: '#f0fdf4',
                                            color: '#15803d',
                                            fontWeight: 800,
                                            border: '1px solid #bbf7d0',
                                        }}
                                    />
                                ) : null}
                            </Box>
                            <IconButton onClick={() => setProofModal({ open: false, payment: null })} size="small">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent sx={{ p: 2.5, bgcolor: '#ffffff' }}>
                            {/* DEBT ALERT BANNER */}
                            {proofModal.payment.is_debt && (
                                <Box
                                    sx={{
                                        bgcolor: '#fffbeb',
                                        border: '1.5px solid #f59e0b',
                                        borderRadius: '12px',
                                        p: 2,
                                        mb: 2.5,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: 1.5,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 1.2, flex: 1, minWidth: 260 }}>
                                        <WarningAmberIcon sx={{ color: '#d97706', fontSize: 26, mt: 0.2 }} />
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#92400e', fontSize: '0.9rem' }}>
                                                Payment Status: INVOICE TAG / OUTSTANDING RECEIVABLE
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#78350f', fontWeight: 600, mt: 0.3, fontSize: '0.82rem' }}>
                                                {proofModal.payment.debt_notes ? `Outstanding Note: "${proofModal.payment.debt_notes}"` : 'Current proof is a chat/agreement with the secretariat.'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#a16207', display: 'block', fontSize: '0.74rem', mt: 0.5 }}>
                                                💡 Once the attendee has transferred the payment, click <strong>"Update Payment Status"</strong> below to upload the transfer slip and mark as fully paid.
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="success"
                                        startIcon={<TaskAltIcon />}
                                        onClick={() => handleSettleDebtQuick(proofModal.payment.id)}
                                        sx={{
                                            bgcolor: '#16a34a',
                                            fontWeight: 900,
                                            fontSize: '0.76rem',
                                            textTransform: 'none',
                                            borderRadius: '8px',
                                            whiteSpace: 'nowrap',
                                            boxShadow: '0 2px 0 #15803d',
                                            '&:hover': { bgcolor: '#15803d' },
                                        }}
                                    >
                                        Clear Invoice Tag (Mark as Paid)
                                    </Button>
                                </Box>
                            )}

                            {/* DEBT SETTLED INFO BANNER */}
                            {!proofModal.payment.is_debt && proofModal.payment.debt_settled_at && (
                                <Alert severity="success" sx={{ mb: 2.5, borderRadius: '10px', fontWeight: 600, fontSize: '0.82rem' }}>
                                    The invoice tag for this payment has been cleared and marked as Fully Paid on{' '}
                                    {new Date(proofModal.payment.debt_settled_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}.
                                </Alert>
                            )}

                            {/* PROOF IMAGE DISPLAY / PREVIEW */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    bgcolor: '#0f172a',
                                    borderRadius: '14px',
                                    textAlign: 'center',
                                    position: 'relative',
                                    mb: 2.5,
                                    border: '1px solid #334155',
                                }}
                            >
                                {proofPreview ? (
                                    <Box>
                                        <Chip
                                            label="New Proof Preview (Unsaved)"
                                            size="small"
                                            sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#f59e0b', color: '#000', fontWeight: 900, fontSize: '0.7rem' }}
                                        />
                                        <Box
                                            component="img"
                                            src={proofPreview}
                                            alt="New Payment Proof Preview"
                                            sx={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain', borderRadius: '8px', mt: 2 }}
                                        />
                                        <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', mt: 1 }}>
                                            Selected File: {proofFile?.name} ({(proofFile?.size / 1024).toFixed(0)} KB)
                                        </Typography>
                                    </Box>
                                ) : proofModal.payment.proof_of_payment ? (
                                    proofModal.payment.proof_of_payment.endsWith('.pdf') ? (
                                        <Box sx={{ py: 6 }}>
                                            <ReceiptLongIcon sx={{ fontSize: 60, color: '#38bdf8', mb: 1.5 }} />
                                            <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 700, mb: 1.5 }}>
                                                Payment Proof Document (PDF)
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                component="a"
                                                href={proofModal.payment.proof_of_payment?.startsWith('http') || proofModal.payment.proof_of_payment?.startsWith('/') 
                                                    ? proofModal.payment.proof_of_payment 
                                                    : `/storage/${proofModal.payment.proof_of_payment}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ bgcolor: '#0284c7', textTransform: 'none', fontWeight: 800, borderRadius: '8px' }}
                                            >
                                                Open Payment Proof PDF in New Tab
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box
                                            component="img"
                                            src={proofModal.payment.proof_of_payment?.startsWith('http') || proofModal.payment.proof_of_payment?.startsWith('/') 
                                                ? proofModal.payment.proof_of_payment 
                                                : `/storage/${proofModal.payment.proof_of_payment}`}
                                            alt="Payment Proof"
                                            sx={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                                        />
                                    )
                                ) : (
                                    <Box sx={{ py: 6, color: '#94a3b8' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            No payment proof file uploaded yet.
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>

                            {/* COLLAPSIBLE EDIT BUKTI & STATUS HUTANG FORM */}
                            <Box sx={{ mb: 1 }}>
                                <Button
                                    variant={isEditingProof ? 'contained' : 'outlined'}
                                    startIcon={<EditIcon />}
                                    onClick={() => setIsEditingProof(!isEditingProof)}
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 800,
                                        fontSize: '0.8rem',
                                        borderRadius: '10px',
                                        bgcolor: isEditingProof ? '#0f172a' : '#f8fafc',
                                        color: isEditingProof ? '#ffffff' : '#094d42',
                                        borderColor: '#cbd5e1',
                                        mb: 1.5,
                                    }}
                                >
                                    {isEditingProof ? 'Close Edit Panel' : '✏️ Update Payment Status'}
                                </Button>

                                {isEditingProof && (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.2,
                                            borderRadius: '14px',
                                            bgcolor: '#f8fafc',
                                            border: '1.5px solid #cbd5e1',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CloudUploadIcon sx={{ color: '#094d42', fontSize: 20 }} />
                                            Update Payment Status
                                        </Typography>

                                        <form onSubmit={handleUpdatePaymentProofSubmit}>
                                            <Stack spacing={2}>
                                                {/* File Upload input */}
                                                <Box>
                                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', display: 'block', mb: 0.5 }}>
                                                        Replace Transfer Proof File (JPG, PNG, PDF max 10MB)
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        component="label"
                                                        startIcon={<CloudUploadIcon />}
                                                        fullWidth
                                                        sx={{
                                                            py: 1.2,
                                                            borderStyle: 'dashed',
                                                            borderWidth: 2,
                                                            borderColor: '#94a3b8',
                                                            borderRadius: '10px',
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            color: '#334155',
                                                            bgcolor: '#ffffff',
                                                            '&:hover': { bgcolor: '#f1f5f9', borderColor: '#094d42' },
                                                        }}
                                                    >
                                                        {proofFile ? `Selected File: ${proofFile.name}` : 'Choose New Payment Proof File from Computer'}
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                                                            onChange={handleProofFileChange}
                                                        />
                                                    </Button>
                                                </Box>

                                                {/* Debt checkbox & notes */}
                                                <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: editIsDebt ? '#fffbeb' : '#ffffff', border: editIsDebt ? '1.5px solid #f59e0b' : '1px solid #e2e8f0' }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={editIsDebt}
                                                                onChange={(e) => setEditIsDebt(e.target.checked)}
                                                                sx={{ color: '#f59e0b', '&.Mui-checked': { color: '#d97706' } }}
                                                            />
                                                        }
                                                        label={
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 800, color: editIsDebt ? '#92400e' : '#1e293b' }}>
                                                                    Mark as DEBT TAG (Outstanding Receivable)
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                                                                    Check if the attendee has not fully settled payment yet (e.g. treasurer agreement chat / promise to pay onsite).
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />

                                                    {editIsDebt && (
                                                        <TextField
                                                            label="Debt Notes / Treasurer Agreement"
                                                            placeholder="e.g. WhatsApp agreement with Treasurer (Mrs. Ani), promised transfer by Sept 20, 2026"
                                                            value={editDebtNotes}
                                                            onChange={(e) => setEditDebtNotes(e.target.value)}
                                                            fullWidth
                                                            size="small"
                                                            multiline
                                                            rows={2}
                                                            sx={{ mt: 1.5, bgcolor: '#ffffff' }}
                                                        />
                                                    )}
                                                </Box>

                                                {/* Payment status selector */}
                                                <FormControl size="small" fullWidth>
                                                    <InputLabel>Payment Status</InputLabel>
                                                    <Select
                                                        value={editStatus}
                                                        label="Payment Status"
                                                        onChange={(e) => setEditStatus(e.target.value)}
                                                        sx={{ bgcolor: '#ffffff' }}
                                                    >
                                                        <MenuItem value="approved">✅ Approved (Ticket Active)</MenuItem>
                                                        <MenuItem value="pending">⏳ Pending Verification</MenuItem>
                                                        <MenuItem value="rejected">❌ Rejected</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                {/* Admin internal notes */}
                                                <TextField
                                                    label="Internal Admin Notes (Optional)"
                                                    placeholder="Additional internal committee notes..."
                                                    value={editAdminNotes}
                                                    onChange={(e) => setEditAdminNotes(e.target.value)}
                                                    fullWidth
                                                    size="small"
                                                    multiline
                                                    rows={2}
                                                    sx={{ bgcolor: '#ffffff' }}
                                                />

                                                {/* Submit Button */}
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
                                                    <Button
                                                        onClick={() => {
                                                            setIsEditingProof(false);
                                                            setProofFile(null);
                                                            setProofPreview(null);
                                                        }}
                                                        size="small"
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        disabled={updatingProof}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#094d42',
                                                            color: '#ffffff',
                                                            fontWeight: 900,
                                                            borderRadius: '8px',
                                                            textTransform: 'none',
                                                            px: 2.5,
                                                            '&:hover': { bgcolor: '#0d6356' }
                                                        }}
                                                    >
                                                        {updatingProof ? 'Saving...' : '💾 Save Proof & Status Changes'}
                                                    </Button>
                                                </Box>
                                            </Stack>
                                        </form>
                                    </Paper>
                                )}
                            </Box>
                        </DialogContent>

                        <DialogActions sx={{ p: 2, px: 2.5, justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc', flexWrap: 'wrap', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 900, color: '#d97706', fontSize: '0.9rem' }}>
                                        IDR {Number(proofModal.payment.total_amount || 0).toLocaleString('id-ID')}
                                    </Typography>
                                    {Number(proofModal.payment.unique_code || 0) > 0 && (
                                        <Typography variant="caption" sx={{ color: '#1d4ed8', fontWeight: 800, display: 'block', fontSize: '0.68rem' }}>
                                            Termasuk Kode Unik: +{proofModal.payment.unique_code}
                                        </Typography>
                                    )}
                                </Box>
                                <Button
                                    component="a"
                                    href={route('visitor.receipt.show', proofModal.payment.payment_code)}
                                    target="_blank"
                                    size="small"
                                    variant="outlined"
                                    startIcon={<ReceiptLongIcon />}
                                    sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '8px', color: '#094d42', borderColor: '#86efac', bgcolor: '#ffffff' }}
                                >
                                    Receipt & Invoice
                                </Button>
                            </Box>

                            {/* ACTIONS FOR PENDING STATUS */}
                            {proofModal.payment.status === 'pending' && (
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            setRejectModal({ open: true, paymentId: proofModal.payment.id, notes: '' });
                                        }}
                                        sx={{ textTransform: 'none', fontWeight: 800, borderRadius: '8px' }}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<WarningAmberIcon />}
                                        onClick={() => {
                                            setDebtApprovalModal({
                                                open: true,
                                                paymentId: proofModal.payment.id,
                                                debtNotes: proofModal.payment.debt_notes || 'Outstanding payment agreement with Secretariat',
                                            });
                                        }}
                                        sx={{
                                            bgcolor: '#d97706',
                                            color: '#ffffff',
                                            textTransform: 'none',
                                            fontWeight: 900,
                                            borderRadius: '8px',
                                            '&:hover': { bgcolor: '#b45309' },
                                        }}
                                    >
                                        Approve - Invoice
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleVerifyPayment(proofModal.payment.id)}
                                        sx={{ bgcolor: '#10b981', color: '#ffffff', textTransform: 'none', fontWeight: 900, borderRadius: '8px', '&:hover': { bgcolor: '#059669' } }}
                                    >
                                        Approve - Fully Paid
                                    </Button>
                                </Stack>
                            )}

                            {/* ACTIONS FOR APPROVED STATUS */}
                            {proofModal.payment.status === 'approved' && proofModal.payment.is_debt && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<TaskAltIcon />}
                                    onClick={() => handleSettleDebtQuick(proofModal.payment.id)}
                                    sx={{
                                        bgcolor: '#16a34a',
                                        textTransform: 'none',
                                        fontWeight: 900,
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 0 #15803d',
                                        '&:hover': { bgcolor: '#15803d' },
                                    }}
                                >
                                    Clear Invoice Tag (Mark as Paid)
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* MODAL 4B: APPROVE WITH DEBT TAG DIALOG */}
            <Dialog open={debtApprovalModal.open} onClose={() => setDebtApprovalModal({ open: false, paymentId: null, debtNotes: '' })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
                <DialogTitle sx={{ fontWeight: 900, color: '#92400e', display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fffbeb', borderBottom: '1px solid #fde68a' }}>
                    <WarningAmberIcon sx={{ color: '#d97706' }} />
                    OUTSTANDING PAYMENT VERIFICATION
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    <Typography variant="body2" sx={{ color: '#475569', mb: 2, lineHeight: 1.6 }}>
                        The participant ticket will be <strong>activated</strong>, and the <strong>E-Ticket QR Code</strong> will be sent directly to the participant’s email. The payment status will be marked as <strong>⚠️ OUTSTANDING VERIFICATION PAYMENT</strong> until the participant settles the payment and the admin uploads the original transfer receipt.
                    </Typography>

                    <TextField
                        label="Outstanding Payment Note with Secretariat *"
                        placeholder="e.g. Chat approval with Secretariat, promised payment date September 20, 2026"
                        value={debtApprovalModal.debtNotes}
                        onChange={(e) => setDebtApprovalModal(prev => ({ ...prev, debtNotes: e.target.value }))}
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        required
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <Button onClick={() => setDebtApprovalModal({ open: false, paymentId: null, debtNotes: '' })} sx={{ textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleVerifyWithDebtSubmit}
                        variant="contained"
                        startIcon={<WarningAmberIcon />}
                        sx={{
                            bgcolor: '#d97706',
                            color: '#ffffff',
                            textTransform: 'none',
                            fontWeight: 900,
                            borderRadius: '8px',
                            '&:hover': { bgcolor: '#b45309' },
                        }}
                    >
                        Approve - Invoice
                    </Button>
                </DialogActions>
            </Dialog>

            {/* MODAL 5: REJECT PAYMENT NOTES */}
            <Dialog open={rejectModal.open} onClose={() => setRejectModal({ open: false, paymentId: null, notes: '' })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
                <DialogTitle sx={{ fontWeight: 900, color: '#ef4444' }}>
                    Payment Rejection Reason
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        label="Rejection Note for Visitor"
                        placeholder="e.g. Payment amount does not match, receipt image is unclear, etc."
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
                        Cancel
                    </Button>
                    <Button onClick={handleRejectPaymentSubmit} variant="contained" color="error" sx={{ textTransform: 'none', fontWeight: 900, borderRadius: '8px' }}>
                        Reject Payment
                    </Button>
                </DialogActions>
            </Dialog>

            {/* MODAL 6: PRINT LANYARD BADGES (BULK / FILTERED) */}
            <Dialog open={printModalOpen} onClose={() => setPrintModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
                <DialogTitle sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PrintIcon sx={{ fontSize: 22 }} />
                    </Box>
                    Print Lanyard ID Badges
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#475569', mb: 2.5, lineHeight: 1.6 }}>
                        Pilih cakupan tiket yang ingin dicetak ke dalam kartu Lanyard Badge fisik (100mm × 158.6mm). Sistem akan otomatis menerapkan template badge sesuai kategori masing-masing pengunjung.
                    </Typography>

                    <Stack spacing={2}>
                        {/* Option 1: Selected Checkboxes */}
                        <Paper
                            onClick={() => selectedIds.length > 0 && handleOpenPrintBadges('selected')}
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: '14px',
                                border: selectedIds.length > 0 ? '2px solid #7c3aed' : '1.5px dashed #cbd5e1',
                                bgcolor: selectedIds.length > 0 ? '#f5f3ff' : '#f8fafc',
                                cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
                                opacity: selectedIds.length > 0 ? 1 : 0.6,
                                transition: 'all 0.2s ease',
                                '&:hover': selectedIds.length > 0 ? { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(124,58,237,0.15)' } : {},
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: selectedIds.length > 0 ? '#6d28d9' : '#64748b' }}>
                                        1. Cetak Tiket yang Dipilih ({selectedIds.length} Tiket)
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                        {selectedIds.length > 0 
                                            ? `Mencetak ${selectedIds.length} kartu lanyard dari baris tabel yang Anda centang.`
                                            : 'Centang checkbox pada tabel jika hanya ingin mencetak beberapa tiket tertentu.'}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    disabled={selectedIds.length === 0}
                                    onClick={(e) => { e.stopPropagation(); handleOpenPrintBadges('selected'); }}
                                    sx={{ bgcolor: '#7c3aed', fontWeight: 800, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#6d28d9' } }}
                                >
                                    Cetak ({selectedIds.length})
                                </Button>
                            </Box>
                        </Paper>

                        {/* Option 2: All Filtered Tickets */}
                        <Paper
                            onClick={() => handleOpenPrintBadges('filtered')}
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: '14px',
                                border: '2px solid #0284c7',
                                bgcolor: '#f0f9ff',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(2,132,199,0.15)' },
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ flex: 1, pr: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0369a1' }}>
                                        2. Cetak Keseluruhan Sesuai Filter ({totalItems} Tiket)
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                                        Mencetak semua data ({totalItems} tiket) dengan kriteria filter saat ini:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.8, mt: 0.8, flexWrap: 'wrap' }}>
                                        <Chip label={`Kategori: ${typeFilter === 'all' ? 'Semua' : (CATEGORY_META[typeFilter]?.shortLabel || typeFilter)}`} size="small" sx={{ fontSize: '0.68rem', height: 20, bgcolor: '#e0f2fe', color: '#0369a1' }} />
                                        <Chip label={`Gate: ${checkedInFilter === 'all' ? 'Semua' : checkedInFilter === 'yes' ? 'Checked In' : 'Belum Check In'}`} size="small" sx={{ fontSize: '0.68rem', height: 20, bgcolor: '#e0f2fe', color: '#0369a1' }} />
                                        <Chip label={`Status: ${statusFilter === 'all' ? 'Semua' : statusFilter.toUpperCase()}`} size="small" sx={{ fontSize: '0.68rem', height: 20, bgcolor: '#e0f2fe', color: '#0369a1' }} />
                                    </Box>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); handleOpenPrintBadges('filtered'); }}
                                    sx={{ bgcolor: '#0284c7', fontWeight: 800, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#0369a1' } }}
                                >
                                    Cetak Semua ({totalItems})
                                </Button>
                            </Box>
                        </Paper>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, px: 2.5, borderTop: '1px solid #e2e8f0' }}>
                    <Button onClick={() => setPrintModalOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>
                        Tutup
                    </Button>
                </DialogActions>
            </Dialog>

            {/* MODAL 7: BROADCAST / RESEND E-TICKETS EMAIL */}
            <Dialog open={emailModalOpen} onClose={() => !emailSending && setEmailModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
                <DialogTitle sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <EmailIcon sx={{ fontSize: 22 }} />
                    </Box>
                    Resend / Broadcast E-Ticket Emails
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#475569', mb: 2, lineHeight: 1.6 }}>
                        Kirimkan ulang email resmi E-Tiket (beserta QR Code dan instruksi check-in) ke pengunjung terdaftar. Email hanya akan dikirimkan ke tiket berstatus <strong>AKTIF</strong> yang memiliki alamat email valid.
                    </Typography>

                    <RadioGroup
                        value={emailTargetMode}
                        onChange={(e) => setEmailTargetMode(e.target.value)}
                        sx={{ mb: 2.5 }}
                    >
                        {selectedIds.length > 0 && (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    px: 2,
                                    mb: 1.5,
                                    borderRadius: '14px',
                                    border: emailTargetMode === 'exclude_selected' ? '2px solid #d97706' : '1px solid #e2e8f0',
                                    bgcolor: emailTargetMode === 'exclude_selected' ? '#fffbeb' : '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                                onClick={() => setEmailTargetMode('exclude_selected')}
                            >
                                <FormControlLabel
                                    value="exclude_selected"
                                    control={<Radio size="small" sx={{ color: '#d97706', '&.Mui-checked': { color: '#d97706' } }} />}
                                    label={
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400e' }}>
                                                    Kirim ke Semua, KECUALI yang Dicentang
                                                </Typography>
                                                <Chip
                                                    icon={<BlockIcon sx={{ fontSize: '13px !important', color: '#b45309 !important' }} />}
                                                    label={`${selectedIds.length} Dilewati`}
                                                    size="small"
                                                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}
                                                />
                                            </Box>
                                            <Typography variant="caption" sx={{ color: '#78350f', display: 'block', mt: 0.3 }}>
                                                E-Tiket akan dikirimkan ke semua pengunjung aktif, <strong>TETAPI {selectedIds.length} tiket yang Anda tandai/centang saat ini TIDAK AKAN menerima email</strong>.
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ width: '100%', m: 0 }}
                                />

                                {emailTargetMode === 'exclude_selected' && (
                                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px dashed #fde68a' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#b45309', display: 'block', mb: 0.8 }}>
                                            ⛔ {selectedIds.length} Tiket yang Dikecualikan (Tidak Dikirim):
                                        </Typography>
                                        <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap sx={{ maxHeight: 90, overflowY: 'auto' }}>
                                            {ticketsData.filter(t => selectedIds.includes(t.id)).slice(0, 10).map(t => (
                                                <Chip
                                                    key={t.id}
                                                    label={`${t.visitor_name} (${t.ticket_code})`}
                                                    size="small"
                                                    sx={{
                                                        height: 22,
                                                        fontSize: '0.68rem',
                                                        fontWeight: 700,
                                                        bgcolor: '#fee2e2',
                                                        color: '#b91c1c',
                                                        border: '1px solid #fca5a5',
                                                    }}
                                                />
                                            ))}
                                            {selectedIds.length > 10 && (
                                                <Chip
                                                    label={`+${selectedIds.length - 10} lainnya`}
                                                    size="small"
                                                    sx={{ height: 22, fontSize: '0.68rem', fontWeight: 800, bgcolor: '#fecaca', color: '#991b1b' }}
                                                />
                                            )}
                                        </Stack>
                                    </Box>
                                )}
                            </Paper>
                        )}

                        {selectedIds.length > 0 && (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    px: 2,
                                    mb: 1.5,
                                    borderRadius: '14px',
                                    border: emailTargetMode === 'selected' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                                    bgcolor: emailTargetMode === 'selected' ? '#f0f9ff' : '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                                onClick={() => setEmailTargetMode('selected')}
                            >
                                <FormControlLabel
                                    value="selected"
                                    control={<Radio size="small" />}
                                    label={
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                                Hanya Kirim ke Tiket yang Dicentang ({selectedIds.length} tiket)
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                Hanya mengirimkan E-Tiket ke {selectedIds.length} tiket yang dicentang di tabel saat ini.
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ width: '100%', m: 0 }}
                                />
                            </Paper>
                        )}

                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                px: 2,
                                borderRadius: '14px',
                                border: emailTargetMode === 'filtered' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                                bgcolor: emailTargetMode === 'filtered' ? '#f0f9ff' : '#ffffff',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                            onClick={() => setEmailTargetMode('filtered')}
                        >
                            <FormControlLabel
                                value="filtered"
                                control={<Radio size="small" />}
                                label={
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                            Kirim ke Semua Sesuai Filter ({totalItems} tiket terdaftar)
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            Mengirimkan ke semua tiket aktif tanpa ada yang dikecualikan.
                                        </Typography>
                                    </Box>
                                }
                                sx={{ width: '100%', m: 0 }}
                            />
                        </Paper>
                    </RadioGroup>

                    {selectedIds.length === 0 && (
                        <Alert severity="info" sx={{ mb: 2, borderRadius: '12px', fontSize: '0.8rem', bgcolor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                            💡 <strong>Ingin menandai/mengecualikan tiket tertentu agar TIDAK dikirim?</strong> Centang kotak tiket di tabel pengunjung terlebih dahulu, lalu klik tombol <strong>Resend E-Tickets</strong>.
                        </Alert>
                    )}

                    <Alert severity="warning" sx={{ borderRadius: '12px', fontSize: '0.8rem', bgcolor: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }}>
                        Pastikan konfigurasi SMTP di menu <strong>Email Settings</strong> sudah berstatus aktif dan teruji agar email terkirim dengan lancar tanpa terblokir.
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 2, px: 2.5, borderTop: '1px solid #e2e8f0', justifyContent: 'space-between' }}>
                    <Button onClick={() => setEmailModalOpen(false)} disabled={emailSending} sx={{ textTransform: 'none', color: '#64748b' }}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleSendBulkEmail}
                        disabled={emailSending || (emailTargetMode === 'selected' && selectedIds.length === 0)}
                        variant="contained"
                        startIcon={emailSending ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : (emailTargetMode === 'exclude_selected' ? <BlockIcon /> : <SendIcon />)}
                        sx={{
                            bgcolor: emailTargetMode === 'exclude_selected' ? '#d97706' : '#0284c7',
                            color: '#ffffff',
                            fontWeight: 900,
                            borderRadius: '10px',
                            textTransform: 'none',
                            px: 3,
                            boxShadow: emailTargetMode === 'exclude_selected' ? '0 3px 0 #b45309' : '0 3px 0 #0369a1',
                            '&:hover': { bgcolor: emailTargetMode === 'exclude_selected' ? '#b45309' : '#0369a1' },
                        }}
                    >
                        {emailSending
                            ? 'Sedang Mengirim...'
                            : emailTargetMode === 'exclude_selected'
                                ? `Kirim E-Tiket (Kecualikan ${selectedIds.length} Ditandai)`
                                : emailTargetMode === 'selected'
                                    ? `Kirim E-Tiket (${selectedIds.length} Tiket)`
                                    : `Kirim E-Tiket (${totalItems} Tiket)`}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* QUICK STATUS POPOVER 1: TICKET STATUS */}
            <Menu
                anchorEl={ticketMenuAnchor}
                open={Boolean(ticketMenuAnchor)}
                onClose={handleCloseTicketMenu}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        borderRadius: '14px',
                        minWidth: 260,
                        p: 0.5,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    }
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Ubah Status Tiket
                    </Typography>
                    {selectedTicketForStatus && (
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.2 }}>
                            {selectedTicketForStatus.ticket_code} ({selectedTicketForStatus.visitor_name})
                        </Typography>
                    )}
                </Box>

                <MenuItem
                    onClick={() => handleSelectTicketStatus('active')}
                    selected={selectedTicketForStatus?.status === 'active'}
                    sx={{
                        py: 1.2,
                        px: 2,
                        borderRadius: '8px',
                        m: 0.5,
                        gap: 1.5,
                        '&.Mui-selected': { bgcolor: '#f0fdf4' },
                        '&:hover': { bgcolor: '#f0fdf4' }
                    }}
                >
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#16a34a' }} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#166534' }}>
                            ACTIVE (Tiket Aktif)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#4b5563', display: 'block', fontSize: '0.72rem' }}>
                            Tiket aktif & otomatis kirim E-Tiket ke email
                        </Typography>
                    </Box>
                </MenuItem>

                <MenuItem
                    onClick={() => handleSelectTicketStatus('pending')}
                    selected={selectedTicketForStatus?.status === 'pending'}
                    sx={{
                        py: 1.2,
                        px: 2,
                        borderRadius: '8px',
                        m: 0.5,
                        gap: 1.5,
                        '&.Mui-selected': { bgcolor: '#fffbeb' },
                        '&:hover': { bgcolor: '#fffbeb' }
                    }}
                >
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#d97706' }} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400e' }}>
                            PENDING (Menunggu)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#4b5563', display: 'block', fontSize: '0.72rem' }}>
                            Menunggu proses pembayaran / verifikasi
                        </Typography>
                    </Box>
                </MenuItem>

                <MenuItem
                    onClick={() => handleSelectTicketStatus('cancelled')}
                    selected={selectedTicketForStatus?.status === 'cancelled'}
                    sx={{
                        py: 1.2,
                        px: 2,
                        borderRadius: '8px',
                        m: 0.5,
                        gap: 1.5,
                        '&.Mui-selected': { bgcolor: '#fef2f2' },
                        '&:hover': { bgcolor: '#fef2f2' }
                    }}
                >
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#dc2626' }} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#991b1b' }}>
                            CANCELLED (Dibatalkan)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#4b5563', display: 'block', fontSize: '0.72rem' }}>
                            Tiket dinonaktifkan / dibatalkan
                        </Typography>
                    </Box>
                </MenuItem>
            </Menu>

            {/* QUICK STATUS POPOVER 2: PAYMENT STATUS */}
            <Menu
                anchorEl={paymentMenuAnchor}
                open={Boolean(paymentMenuAnchor)}
                onClose={handleClosePaymentMenu}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        borderRadius: '14px',
                        minWidth: 280,
                        p: 0.5,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    }
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Ubah Status Pembayaran
                    </Typography>
                    {selectedPaymentForStatus && (
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.2 }}>
                            {selectedPaymentForStatus.payment_code} — Rp {Number(selectedPaymentForStatus.total_amount || 0).toLocaleString('id-ID')}
                        </Typography>
                    )}
                </Box>

                <MenuItem
                    onClick={() => handleSelectPaymentStatus('approved')}
                    selected={selectedPaymentForStatus?.status === 'approved'}
                    sx={{
                        py: 1.2,
                        px: 2,
                        borderRadius: '8px',
                        m: 0.5,
                        gap: 1.5,
                        '&.Mui-selected': { bgcolor: '#f0fdf4' },
                        '&:hover': { bgcolor: '#f0fdf4' }
                    }}
                >
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#166534' }}>
                            APPROVED (Lunas / Diverifikasi)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#4b5563', display: 'block', fontSize: '0.72rem' }}>
                            Verifikasi pembayaran & aktifkan tiket otomatis
                        </Typography>
                    </Box>
                </MenuItem>

                <MenuItem
                    onClick={() => handleSelectPaymentStatus('pending')}
                    selected={selectedPaymentForStatus?.status === 'pending'}
                    sx={{
                        py: 1.2,
                        px: 2,
                        borderRadius: '8px',
                        m: 0.5,
                        gap: 1.5,
                        '&.Mui-selected': { bgcolor: '#fffbeb' },
                        '&:hover': { bgcolor: '#fffbeb' }
                    }}
                >
                    <AccessTimeIcon sx={{ fontSize: 18, color: '#d97706' }} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400e' }}>
                            PENDING (Menunggu Pembayaran)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#4b5563', display: 'block', fontSize: '0.72rem' }}>
                            Kembalikan ke status belum lunas
                        </Typography>
                    </Box>
                </MenuItem>

                <MenuItem
                    onClick={() => handleSelectPaymentStatus('rejected')}
                    selected={selectedPaymentForStatus?.status === 'rejected'}
                    sx={{
                        py: 1.2,
                        px: 2,
                        borderRadius: '8px',
                        m: 0.5,
                        gap: 1.5,
                        '&.Mui-selected': { bgcolor: '#fef2f2' },
                        '&:hover': { bgcolor: '#fef2f2' }
                    }}
                >
                    <CloseIcon sx={{ fontSize: 18, color: '#dc2626' }} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#991b1b' }}>
                            REJECTED (Tolak Pembayaran)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#4b5563', display: 'block', fontSize: '0.72rem' }}>
                            Tolak bukti & batalkan tiket
                        </Typography>
                    </Box>
                </MenuItem>

                <Divider sx={{ my: 0.8 }} />

                <MenuItem
                    onClick={() => handleOpenQuickDebtModal(selectedPaymentForStatus)}
                    sx={{
                        py: 1,
                        px: 2,
                        borderRadius: '8px',
                        m: 0.5,
                        gap: 1.5,
                        '&:hover': { bgcolor: '#fffbeb' }
                    }}
                >
                    <WarningAmberIcon sx={{ fontSize: 18, color: '#d97706' }} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#92400e' }}>
                            {selectedPaymentForStatus?.is_debt ? 'Kelola / Ubah Catatan Hutang (DEBT)' : 'Tandai Sebagai Hutang (DEBT)'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontSize: '0.72rem' }}>
                            Atur tagihan tertunda / tanggungan sponsor
                        </Typography>
                    </Box>
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        const p = selectedPaymentForStatus;
                        handleClosePaymentMenu();
                        handleOpenProofModal(p);
                    }}
                    sx={{
                        py: 1,
                        px: 2,
                        borderRadius: '8px',
                        m: 0.5,
                        gap: 1.5,
                        '&:hover': { bgcolor: '#f0f9ff' }
                    }}
                >
                    <VisibilityIcon sx={{ fontSize: 18, color: '#0284c7' }} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0284c7' }}>
                            Lihat Bukti Transfer & Detail Lengkap
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontSize: '0.72rem' }}>
                            Buka modal bukti bayar & upload ulang struk
                        </Typography>
                    </Box>
                </MenuItem>
            </Menu>

            {/* QUICK STATUS POPOVER 3: DEBT ACTION MENU */}
            <Menu
                anchorEl={debtMenuAnchor}
                open={Boolean(debtMenuAnchor)}
                onClose={handleCloseDebtMenu}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        borderRadius: '14px',
                        minWidth: 280,
                        p: 0.5,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    }
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Status Hutang / Tagihan (DEBT)
                    </Typography>
                    {selectedPaymentForDebt && (
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.2 }}>
                            {selectedPaymentForDebt.payment_code}
                        </Typography>
                    )}
                </Box>

                {selectedPaymentForDebt?.is_debt ? (
                    <>
                        <MenuItem
                            onClick={() => handleQuickToggleDebt(false)}
                            sx={{
                                py: 1.2,
                                px: 2,
                                borderRadius: '8px',
                                m: 0.5,
                                gap: 1.5,
                                bgcolor: '#f0fdf4',
                                '&:hover': { bgcolor: '#dcfce7' }
                            }}
                        >
                            <TaskAltIcon sx={{ fontSize: 20, color: '#16a34a' }} />
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#166534' }}>
                                    Cabut Tag Hutang (Sudah Lunas)
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#4b5563', display: 'block', fontSize: '0.72rem' }}>
                                    Tandai hutang telah selesai dibayar
                                </Typography>
                            </Box>
                        </MenuItem>

                        <MenuItem
                            onClick={() => handleOpenQuickDebtModal(selectedPaymentForDebt)}
                            sx={{
                                py: 1.2,
                                px: 2,
                                borderRadius: '8px',
                                m: 0.5,
                                gap: 1.5,
                                '&:hover': { bgcolor: '#fffbeb' }
                            }}
                        >
                            <EditIcon sx={{ fontSize: 18, color: '#d97706' }} />
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400e' }}>
                                    Ubah Catatan Hutang (Notes)
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontSize: '0.72rem' }}>
                                    {selectedPaymentForDebt.debt_notes || 'Edit penanggung jawab / tempo bayar'}
                                </Typography>
                            </Box>
                        </MenuItem>
                    </>
                ) : (
                    <MenuItem
                        onClick={() => handleOpenQuickDebtModal(selectedPaymentForDebt)}
                        sx={{
                            py: 1.2,
                            px: 2,
                            borderRadius: '8px',
                            m: 0.5,
                            gap: 1.5,
                            bgcolor: '#fffbeb',
                            '&:hover': { bgcolor: '#fef3c7' }
                        }}
                    >
                        <WarningAmberIcon sx={{ fontSize: 20, color: '#d97706' }} />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400e' }}>
                                Tandai Sebagai HUTANG (DEBT)
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontSize: '0.72rem' }}>
                                Tandai tiket ini sebagai tanggungan kasbon/sponsor
                            </Typography>
                        </Box>
                    </MenuItem>
                )}

                <Divider sx={{ my: 0.8 }} />

                <MenuItem
                    onClick={() => {
                        const p = selectedPaymentForDebt;
                        handleCloseDebtMenu();
                        handleOpenProofModal(p);
                    }}
                    sx={{
                        py: 1,
                        px: 2,
                        borderRadius: '8px',
                        m: 0.5,
                        gap: 1.5,
                        '&:hover': { bgcolor: '#f0f9ff' }
                    }}
                >
                    <VisibilityIcon sx={{ fontSize: 18, color: '#0284c7' }} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0284c7' }}>
                            Lihat Bukti Transfer & Detail
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontSize: '0.72rem' }}>
                            Buka modal bukti bayar
                        </Typography>
                    </Box>
                </MenuItem>
            </Menu>

            {/* QUICK STATUS POPOVER 4: CATEGORY SWITCHER */}
            <Menu
                anchorEl={categoryMenuAnchor}
                open={Boolean(categoryMenuAnchor)}
                onClose={handleCloseCategoryMenu}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        borderRadius: '16px',
                        width: 320,
                        maxHeight: 460,
                        p: 0.5,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    }
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <Box sx={{ px: 2, py: 1.2, borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Ubah Kategori Pengunjung
                    </Typography>
                    {selectedTicketForCategory && (
                        <Box sx={{ mt: 0.4 }}>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }} noWrap>
                                {selectedTicketForCategory.visitor_name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#094d42', fontWeight: 800, fontFamily: 'monospace' }}>
                                {selectedTicketForCategory.ticket_code} • {getCategoryMeta(selectedTicketForCategory.visitor_type).label}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <ListSubheader sx={{ fontWeight: 900, color: '#094d42', bgcolor: '#f8fafc', lineHeight: '28px', fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                    1. PARTICIPANT (BERBAYAR)
                </ListSubheader>

                <MenuItem
                    onClick={() => handleSelectCategory('iagi_member_professional')}
                    selected={selectedTicketForCategory?.visitor_type === 'iagi_member_professional'}
                    sx={{ py: 0.8, px: 2, borderRadius: '8px', m: 0.3 }}
                >
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#15803d', fontSize: '0.8rem' }}>
                                Professional (Member)
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', fontFamily: 'monospace' }}>
                                Rp 3.000.000
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                            Kode: TKT-IPRO
                        </Typography>
                    </Box>
                </MenuItem>

                <MenuItem
                    onClick={() => handleSelectCategory('non_iagi_member_professional')}
                    selected={selectedTicketForCategory?.visitor_type === 'non_iagi_member_professional'}
                    sx={{ py: 0.8, px: 2, borderRadius: '8px', m: 0.3 }}
                >
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0369a1', fontSize: '0.8rem' }}>
                                Professional (Non-Member)
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', fontFamily: 'monospace' }}>
                                Rp 4.000.000
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                            Kode: TKT-NPRO
                        </Typography>
                    </Box>
                </MenuItem>

                <MenuItem
                    onClick={() => handleSelectCategory('iagi_member_expatriate')}
                    selected={selectedTicketForCategory?.visitor_type === 'iagi_member_expatriate'}
                    sx={{ py: 0.8, px: 2, borderRadius: '8px', m: 0.3 }}
                >
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6d28d9', fontSize: '0.8rem' }}>
                                Expatriate (Member)
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', fontFamily: 'monospace' }}>
                                Rp 6.000.000
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                            Kode: TKT-IEXP
                        </Typography>
                    </Box>
                </MenuItem>

                <MenuItem
                    onClick={() => handleSelectCategory('non_iagi_member_expatriate')}
                    selected={selectedTicketForCategory?.visitor_type === 'non_iagi_member_expatriate'}
                    sx={{ py: 0.8, px: 2, borderRadius: '8px', m: 0.3 }}
                >
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#5b21b6', fontSize: '0.8rem' }}>
                                Expatriate (Non-Member)
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', fontFamily: 'monospace' }}>
                                Rp 7.000.000
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                            Kode: TKT-NEXP
                        </Typography>
                    </Box>
                </MenuItem>

                <MenuItem
                    onClick={() => handleSelectCategory('student_undergraduate')}
                    selected={selectedTicketForCategory?.visitor_type === 'student_undergraduate'}
                    sx={{ py: 0.8, px: 2, borderRadius: '8px', m: 0.3 }}
                >
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#3730a3', fontSize: '0.8rem' }}>
                                Student Undergraduate
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', fontFamily: 'monospace' }}>
                                Rp 1.000.000
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                            Kode: TKT-STUD
                        </Typography>
                    </Box>
                </MenuItem>

                <MenuItem
                    onClick={() => handleSelectCategory('dosen')}
                    selected={selectedTicketForCategory?.visitor_type === 'dosen'}
                    sx={{ py: 0.8, px: 2, borderRadius: '8px', m: 0.3 }}
                >
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#b45309', fontSize: '0.8rem' }}>
                                Dosen
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', fontFamily: 'monospace' }}>
                                Rp 1.500.000
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                            Kode: TKT-DOSN
                        </Typography>
                    </Box>
                </MenuItem>

                <ListSubheader sx={{ fontWeight: 900, color: '#094d42', bgcolor: '#f8fafc', lineHeight: '28px', fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                    2. TECHNICAL (FREE / INVITED)
                </ListSubheader>

                {[
                    { type: 'presenter', label: '1. 🎓 Presenter', code: 'TKT-PRS', color: '#004C23' },
                    { type: 'invited_speaker', label: '2. 🗣️ Invited Speaker', code: 'TKT-ISPK', color: '#9d174d' },
                    { type: 'session_chair_judge', label: '3. ⚖️ Session Chair / Judge', code: 'TKT-JDG', color: '#0e7490' },
                ].map((item) => (
                    <MenuItem
                        key={item.type}
                        onClick={() => handleSelectCategory(item.type)}
                        selected={selectedTicketForCategory?.visitor_type === item.type}
                        sx={{ py: 0.7, px: 2, borderRadius: '8px', m: 0.3 }}
                    >
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: item.color, fontSize: '0.78rem' }}>
                                {item.label}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                                {item.code}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))}

                <ListSubheader sx={{ fontWeight: 900, color: '#094d42', bgcolor: '#f8fafc', lineHeight: '28px', fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                    3. VISITOR PASS
                </ListSubheader>

                <MenuItem
                    onClick={() => handleSelectCategory('non_exclusive')}
                    selected={selectedTicketForCategory?.visitor_type === 'non_exclusive'}
                    sx={{ py: 0.8, px: 2, borderRadius: '8px', m: 0.3 }}
                >
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#047857', fontSize: '0.8rem' }}>
                                🎟️ Visitor Pass (Free)
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#047857' }}>
                                Free
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                            Kode: TKT-VIS
                        </Typography>
                    </Box>
                </MenuItem>

                <ListSubheader sx={{ fontWeight: 900, color: '#094d42', bgcolor: '#f8fafc', lineHeight: '28px', fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                    4. ROLES & INVITATIONS (FREE)
                </ListSubheader>

                {[
                    { type: 'vip', label: '3. ⭐ VIP', code: 'TKT-VIP' },
                    { type: 'speaker', label: '4. 🎤 Keynote Speaker', code: 'TKT-SPK' },
                    { type: 'panelist', label: '5. 👥 Panelist', code: 'TKT-PNL' },
                    { type: 'moderator', label: '6. 🎯 Moderator', code: 'TKT-MOD' },
                    { type: 'exhibition', label: '7. 🏛️ Exhibition', code: 'TKT-EXH' },
                    { type: 'committee', label: '8. 👔 Committee', code: 'TKT-COM' },
                    { type: 'student_volunteer', label: '9. 🤝 Volunteer', code: 'TKT-VOL' },
                    { type: 'board', label: '10. 🎖️ Board', code: 'TKT-BRD' },
                    { type: 'sponsorship', label: '11. 💎 Delegate', code: 'TKT-DLG' },
                    { type: 'student_crowd', label: '12. 🎓 Student Crowd', code: 'TKT-CRWD' },
                ].map((item) => (
                    <MenuItem
                        key={item.type}
                        onClick={() => handleSelectCategory(item.type)}
                        selected={selectedTicketForCategory?.visitor_type === item.type}
                        sx={{ py: 0.6, px: 2, borderRadius: '8px', m: 0.3 }}
                    >
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.78rem' }}>
                                {item.label}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                                {item.code}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))}
            </Menu>

            {/* QUICK DEBT DIALOG */}
            <Dialog
                open={quickDebtModal.open}
                onClose={() => !quickDebtModal.processing && setQuickDebtModal({ open: false, payment: null, isDebt: true, debtNotes: '', processing: false })}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '16px', p: 1 }
                }}
            >
                <DialogTitle sx={{ pb: 1, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon sx={{ color: '#d97706' }} />
                    Kelola Status Hutang (DEBT)
                </DialogTitle>
                <DialogContent sx={{ pt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.85rem' }}>
                        Kode Pembayaran: <strong>{quickDebtModal.payment?.payment_code}</strong><br />
                        Total: <strong>Rp {Number(quickDebtModal.payment?.total_amount || 0).toLocaleString('id-ID')}</strong>
                    </Typography>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={quickDebtModal.isDebt}
                                onChange={(e) => setQuickDebtModal(prev => ({ ...prev, isDebt: e.target.checked }))}
                                sx={{ color: '#d97706', '&.Mui-checked': { color: '#d97706' } }}
                            />
                        }
                        label={
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: quickDebtModal.isDebt ? '#b45309' : '#64748b' }}>
                                Tandai Sebagai Hutang / Tanggungan (DEBT)
                            </Typography>
                        }
                        sx={{ mb: 1.5 }}
                    />

                    {quickDebtModal.isDebt && (
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Catatan Hutang (Debt Notes)"
                            placeholder="Contoh: Ditanggung PT Petrokimia / Janji bayar tgl 25 Okt / PIC: Pak Budi"
                            value={quickDebtModal.debtNotes}
                            onChange={(e) => setQuickDebtModal(prev => ({ ...prev, debtNotes: e.target.value }))}
                            helperText="Tuliskan nama instansi penanggung jawab, kontak PIC, atau batas waktu pelunasan."
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                }
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1, justifyContent: 'space-between' }}>
                    <Button
                        onClick={() => setQuickDebtModal({ open: false, payment: null, isDebt: true, debtNotes: '', processing: false })}
                        disabled={quickDebtModal.processing}
                        sx={{ textTransform: 'none', color: '#64748b', fontWeight: 700 }}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveQuickDebtModal}
                        disabled={quickDebtModal.processing}
                        startIcon={quickDebtModal.processing ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <CheckIcon />}
                        sx={{
                            bgcolor: '#d97706',
                            color: '#fff',
                            fontWeight: 800,
                            borderRadius: '10px',
                            textTransform: 'none',
                            px: 2.5,
                            '&:hover': { bgcolor: '#b45309' }
                        }}
                    >
                        {quickDebtModal.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarLayout>
    );
}
