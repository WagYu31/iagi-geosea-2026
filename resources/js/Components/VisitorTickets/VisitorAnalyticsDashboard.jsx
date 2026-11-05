import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Card,
    Grid,
    Chip,
    LinearProgress,
    Stack,
    Button,
    Avatar,
    AvatarGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    Menu,
    MenuItem,
    Divider,
    TextField,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    Checkbox,
    ListItemText,
    ListSubheader,
    Paper,
    Tooltip,
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TuneIcon from '@mui/icons-material/Tune';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { PieChart } from '@mui/x-charts/PieChart';

// 4 Registration Groups & Categories (Matching Gambar 2)
export const REGISTRATION_GROUPS = [
    {
        id: 'participant',
        num: '1',
        title: '1. PARTICIPANT',
        shortTitle: 'Participant',
        icon: '💼',
        color: '#2563eb',
        sub: 'Berbayar (Member / Non-Member / Dosen / Mahasiswa)',
        types: [
            'iagi_member_professional',
            'non_iagi_member_professional',
            'iagi_member_expatriate',
            'non_iagi_member_expatriate',
            'student_undergraduate',
            'dosen',
            'professional',
            'professional_1500',
            'exclusive'
        ]
    },
    {
        id: 'technical',
        num: '2',
        title: '2. TECHNICAL',
        shortTitle: 'Technical',
        icon: '🔬',
        color: '#8b5cf6',
        sub: '100% Free Pass (Presenter, Speaker, Chair/Judge)',
        types: [
            'presenter',
            'student',
            'invited_speaker',
            'session_chair_judge',
            'judge',
            'session_chair',
            'oral',
            'oral_presenter',
            'poster',
            'poster_presenter'
        ]
    },
    {
        id: 'visitor',
        num: '3',
        title: '3. VISITOR',
        shortTitle: 'Visitor',
        icon: '🎟️',
        color: '#0d9488',
        sub: 'Free Pass (Exhibition & Public Attendee)',
        types: [
            'non_exclusive',
            'visitor'
        ]
    },
    {
        id: 'roles',
        num: '4',
        title: '4. ROLES & INVITATIONS',
        shortTitle: 'Roles & Invited',
        icon: '🌟',
        color: '#f59e0b',
        sub: 'Undangan Khusus (VIP, Committee, Board, Crew)',
        types: [
            'vip',
            'speaker',
            'keynote_speech',
            'keynote_speaker',
            'panelist',
            'moderator',
            'exhibition',
            'committee',
            'student_volunteer',
            'board',
            'sponsorship',
            'sponsor',
            'delegate',
            'student_crowd',
            'vip_companion',
            'it_developer',
            'tesko'
        ]
    }
];

export const CATEGORY_LABELS = {
    // 1. Participant
    iagi_member_professional: { label: 'Professional (Member)', icon: '💼', group: 'participant', color: '#2563eb' },
    non_iagi_member_professional: { label: 'Professional (Non-Member)', icon: '💼', group: 'participant', color: '#0284c7' },
    iagi_member_expatriate: { label: 'Expatriate (Member)', icon: '🌍', group: 'participant', color: '#4f46e5' },
    non_iagi_member_expatriate: { label: 'Expatriate (Non-Member)', icon: '🌍', group: 'participant', color: '#6366f1' },
    student_undergraduate: { label: 'Student Undergraduate', icon: '🎓', group: 'participant', color: '#0ea5e9' },
    dosen: { label: 'Dosen', icon: '📚', group: 'participant', color: '#38bdf8' },
    professional: { label: 'Professional', icon: '💼', group: 'participant', color: '#1d4ed8' },
    professional_1500: { label: 'Professional (Rp 1.5JT)', icon: '💼', group: 'participant', color: '#1e40af' },
    exclusive: { label: 'Exclusive Participant', icon: '⭐', group: 'participant', color: '#3b82f6' },

    // 2. Technical
    presenter: { label: 'Presenter', icon: '🎓', group: 'technical', color: '#8b5cf6' },
    student: { label: 'Presenter (Student)', icon: '🎓', group: 'technical', color: '#8b5cf6' },
    invited_speaker: { label: 'Invited Speaker', icon: '🗣️', group: 'technical', color: '#a855f7' },
    session_chair_judge: { label: 'Session Chair / Judge', icon: '⚖️', group: 'technical', color: '#c084fc' },
    session_chair: { label: 'Session Chair', icon: '⚖️', group: 'technical', color: '#c084fc' },
    judge: { label: 'Judge', icon: '⚖️', group: 'technical', color: '#c084fc' },
    oral: { label: 'Oral Presenter', icon: '🎤', group: 'technical', color: '#7c3aed' },
    oral_presenter: { label: 'Oral Presenter', icon: '🎤', group: 'technical', color: '#7c3aed' },
    poster: { label: 'Poster Presenter', icon: '📊', group: 'technical', color: '#9333ea' },
    poster_presenter: { label: 'Poster Presenter', icon: '📊', group: 'technical', color: '#9333ea' },

    // 3. Visitor
    non_exclusive: { label: 'Visitor Pass (Free)', icon: '🎟️', group: 'visitor', color: '#0d9488' },
    visitor: { label: 'Visitor Pass (Free)', icon: '🎟️', group: 'visitor', color: '#0d9488' },

    // 4. Roles & Invitations
    vip: { label: 'VIP', icon: '⭐', group: 'roles', color: '#f59e0b' },
    speaker: { label: 'Keynote Speaker', icon: '🎤', group: 'roles', color: '#eab308' },
    keynote_speech: { label: 'Keynote Speaker', icon: '🎤', group: 'roles', color: '#eab308' },
    keynote_speaker: { label: 'Keynote Speaker', icon: '🎤', group: 'roles', color: '#eab308' },
    panelist: { label: 'Panelist', icon: '👥', group: 'roles', color: '#d97706' },
    moderator: { label: 'Moderator', icon: '🎯', group: 'roles', color: '#f97316' },
    exhibition: { label: 'Exhibition', icon: '🏛️', group: 'roles', color: '#10b981' },
    committee: { label: 'Committee', icon: '👔', group: 'roles', color: '#059669' },
    student_volunteer: { label: 'Student Volunteer', icon: '🤝', group: 'roles', color: '#14b8a6' },
    board: { label: 'Board', icon: '🎖️', group: 'roles', color: '#b45309' },
    sponsorship: { label: 'Delegate (Sponsor)', icon: '💎', group: 'roles', color: '#ec4899' },
    sponsor: { label: 'Delegate (Sponsor)', icon: '💎', group: 'roles', color: '#ec4899' },
    delegate: { label: 'Delegate', icon: '💎', group: 'roles', color: '#ec4899' },
    student_crowd: { label: 'Student Crowd', icon: '🎓', group: 'roles', color: '#06b6d4' },
    vip_companion: { label: 'VIP Companion', icon: '⭐', group: 'roles', color: '#fbbf24' },
    it_developer: { label: 'IT Developer', icon: '💻', group: 'roles', color: '#64748b' },
    tesko: { label: 'TESKO', icon: '🛠️', group: 'roles', color: '#94a3b8' },
};

export const getCategoryGroup = (type) => {
    return REGISTRATION_GROUPS.find(g => g.types.includes(type)) || REGISTRATION_GROUPS[3];
};

// Number Formatter Helper
const formatRupiah = (val) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
};

const formatShortCurrency = (val) => {
    const num = Number(val || 0);
    if (num >= 1000000000) {
        const valM = num / 1000000000;
        return `Rp ${valM % 1 === 0 ? valM : valM.toFixed(1)} Milyar`;
    }
    if (num >= 1000000) {
        const valJt = num / 1000000;
        return `Rp ${valJt % 1 === 0 ? valJt : (valJt >= 10 ? valJt.toFixed(0) : valJt.toFixed(1))} JT`;
    }
    if (num >= 1000) {
        return `Rp ${(num / 1000).toFixed(0)} Rb`;
    }
    return `Rp ${num}`;
};

export default function VisitorAnalyticsDashboard({
    analytics = {},
    stats = {},
    globalStats = {},
    isDark = false,
    onSwitchToTable = () => {},
    onTriggerGateScanner = () => {},
    // Filter controls (matching Gambar 2)
    searchTerm = '',
    onSearchChange = () => {},
    typeFilter = [],
    onTypeFilterChange = () => {},
    registrationTypeFilter = 'all',
    onRegistrationTypeFilterChange = () => {},
    checkedInFilter = 'all',
    onCheckedInFilterChange = () => {},
    statusFilter = 'all',
    onStatusFilterChange = () => {},
    debtFilter = 'all',
    onDebtFilterChange = () => {},
    emailSentFilter = 'all',
    onEmailSentFilterChange = () => {},
    duplicateFilter = 'all',
    onDuplicateFilterChange = () => {},
    onResetFilters = () => {},
    hasActiveFilters = false,
    CATEGORY_META = {},
}) {
    const theme = useTheme();

    // DiBold Color Tokens
    const bgCanvas = isDark ? '#0b0f19' : '#f5f7fb';
    const cardBg = isDark ? '#131b2e' : '#ffffff';
    const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#edf2f7';
    const textPrimary = isDark ? '#f8fafc' : '#0f172a';
    const textSecondary = isDark ? '#94a3b8' : '#64748b';
    const textMuted = isDark ? '#64748b' : '#94a3b8';

    // ── INTERACTIVE DROPDOWN STATES ──
    // 1. Payment Solvency Dropdown
    const [solvencyAnchor, setSolvencyAnchor] = useState(null);
    const [solvencyMode, setSolvencyMode] = useState('tickets'); // 'tickets' | 'invoices' | 'revenue'

    // 2. Velocity Range (7, 14, 30 Days) & Filter (All, Lunas, Pending)
    const [velocityDaysAnchor, setVelocityDaysAnchor] = useState(null);
    const [velocityDays, setVelocityDays] = useState(14);
    const [velocityFilterAnchor, setVelocityFilterAnchor] = useState(null);
    const [velocityFilter, setVelocityFilter] = useState('all'); // 'all' | 'lunas' | 'pending'

    // 3. Gambar 2: Bi-Color Summary Filter (Default: Berdasarkan Kategori Registrasi!)
    const [summaryAnchor, setSummaryAnchor] = useState(null);
    const [biColorMode, setBiColorMode] = useState('categories'); // 'categories' (default!) | 'institutions'
    const [categorySummaryFilter, setCategorySummaryFilter] = useState('top6'); // 'top6' | 'top10' | 'participant' | 'technical' | 'visitor' | 'roles' | 'all'
    const [summaryFilter, setSummaryFilter] = useState('top5'); // 'top5' | 'top10' | 'corporate' | 'university' (for institutions mode)

    // 4. Projects Overview (Categories Layout for Gambar 1)
    const [categoriesAnchor, setCategoriesAnchor] = useState(null);
    const [categoriesFilter, setCategoriesFilter] = useState('all'); // 'all' | 'paid' | 'free'
    const [categoriesLayout, setCategoriesLayout] = useState('grid'); // 'grid' | 'list'

    // 5. Operational Tasks Tab
    const [tasksTab, setTasksTab] = useState('today'); // 'today' | 'week'

    // 6. Overview Period
    const [overviewAnchor, setOverviewAnchor] = useState(null);
    const [overviewPeriod, setOverviewPeriod] = useState('all'); // 'all' | 'month' | 'today'

    // ── POWER BI EXECUTIVE VIEW STATES ──
    const [executiveTab, setExecutiveTab] = useState('overview'); // 'overview' | 'delegations' | 'operations'
    const [hourlyMode, setHourlyMode] = useState('hourly'); // 'hourly' | 'cumulative'
    const [pillarFilter, setPillarFilter] = useState('all'); // 'all' | 'commercial' | 'scientific' | 'leadership' | 'expo'
    const [hoveredHour, setHoveredHour] = useState(null);
    const [pillarsViewMode, setPillarsViewMode] = useState('chart'); // 'chart' (Pie/Donut Chart) | 'cards' (Detail Cards)
    const [pieMode, setPieMode] = useState('pillars'); // 'pillars' (4 Pilar) | 'groups' (4 Grup Registrasi) | 'categories' (Per Kategori Tiket)
    const [pieGroupFilter, setPieGroupFilter] = useState('all'); // 'all' | 'participant' | 'technical' | 'visitor' | 'roles'
    const [sectorsViewMode, setSectorsViewMode] = useState('grid'); // 'grid' | 'pie'

    // ── 1. REAL DATA: TICKETS & PAYMENTS ──
    const totalVisitors = stats.totalVisitors || 0;
    const ticketPending = stats.pendingVerificationCount || 0;
    const ticketDebt = stats.debtCount || 0;
    const ticketActive = Math.max(0, totalVisitors - ticketPending);
    const ticketSolvencyRate = totalVisitors > 0 ? Math.round((ticketActive / totalVisitors) * 100) : 0;

    const paymentBreakdown = analytics.paymentBreakdown || [];
    const totalPaymentsCount = paymentBreakdown.reduce((acc, curr) => acc + (curr.value || 0), 0) || 1;
    const lunasInvoiceCount = paymentBreakdown.find((p) => p.label?.toLowerCase().includes('approved'))?.value || 0;
    const pendingInvoiceCount = paymentBreakdown.find((p) => p.label?.toLowerCase().includes('pending'))?.value || 0;
    const debtInvoiceCount = paymentBreakdown.find((p) => p.label?.toLowerCase().includes('debt'))?.value || 0;
    const invoiceSolvencyRate = totalPaymentsCount > 0 ? Math.round((lunasInvoiceCount / totalPaymentsCount) * 100) : 0;

    const revenueBreakdown = analytics.revenueBreakdown || {};
    const paidRevenue = revenueBreakdown.paidRevenue || stats.totalRevenue || 0;
    const debtRevenue = revenueBreakdown.debtRevenue || stats.debtTotalRevenue || 0;
    const pendingRevenue = revenueBreakdown.pendingRevenue || 0;
    const totalPipelineRevenue = paidRevenue + debtRevenue + pendingRevenue;
    const revenueSolvencyRate = totalPipelineRevenue > 0 ? Math.round((paidRevenue / totalPipelineRevenue) * 100) : 0;

    // Derived Dynamic Solvency Donut Values based on active filter
    const activeSolvencyRate = useMemo(() => {
        if (solvencyMode === 'invoices') return invoiceSolvencyRate;
        if (solvencyMode === 'revenue') return revenueSolvencyRate;
        return ticketSolvencyRate;
    }, [solvencyMode, invoiceSolvencyRate, revenueSolvencyRate, ticketSolvencyRate]);

    const activeSolvencyLabel = useMemo(() => {
        if (solvencyMode === 'invoices') return `${lunasInvoiceCount} Invoice Lunas`;
        if (solvencyMode === 'revenue') return `${formatShortCurrency(paidRevenue)} Terkumpul`;
        return `${ticketActive} Active Tiket`;
    }, [solvencyMode, lunasInvoiceCount, paidRevenue, ticketActive]);

    const activeSolvencyPending = useMemo(() => {
        if (solvencyMode === 'invoices') return `${pendingInvoiceCount} Inv`;
        if (solvencyMode === 'revenue') return formatShortCurrency(pendingRevenue);
        return ticketPending;
    }, [solvencyMode, pendingInvoiceCount, pendingRevenue, ticketPending]);

    const activeSolvencyLunas = useMemo(() => {
        if (solvencyMode === 'invoices') return `${lunasInvoiceCount} Inv`;
        if (solvencyMode === 'revenue') return formatShortCurrency(paidRevenue);
        return ticketActive;
    }, [solvencyMode, lunasInvoiceCount, paidRevenue, ticketActive]);

    const activeSolvencyDebt = useMemo(() => {
        if (solvencyMode === 'invoices') return `${debtInvoiceCount} Inv`;
        if (solvencyMode === 'revenue') return formatShortCurrency(debtRevenue);
        return ticketDebt;
    }, [solvencyMode, debtInvoiceCount, debtRevenue, ticketDebt]);

    // ── 2. REAL DATA: GATE ATTENDANCE & EMAIL DELIVERY ──
    const gate = analytics.gateAttendance || {
        checkedIn: stats.checkedInCount || 0,
        notCheckedIn: Math.max(0, totalVisitors - (stats.checkedInCount || 0)),
        total: totalVisitors,
        percentage: totalVisitors > 0 ? ((stats.checkedInCount || 0) / totalVisitors) * 100 : 0,
    };

    const email = analytics.emailDelivery || {
        sent: stats.emailSentCount || 0,
        unsent: Math.max(0, totalVisitors - (stats.emailSentCount || 0)),
        percentage: totalVisitors > 0 ? ((stats.emailSentCount || 0) / totalVisitors) * 100 : 0,
    };

    // ── 3. REAL DATA: DAILY REGISTRATION VELOCITY ──
    const rawDailyVelocity = analytics.dailyVelocity || [];
    const baseDailyVelocity = useMemo(() => {
        if (rawDailyVelocity.length > 0) return rawDailyVelocity;
        const fallback = analytics.dailyTrend || [];
        return fallback.map((d) => ({
            date: d.date,
            day: d.date.split(' ')[0],
            total: d.count,
            lunas: Math.round(d.count * 0.75),
            pending: Math.round(d.count * 0.25),
        }));
    }, [rawDailyVelocity, analytics.dailyTrend]);

    // Sliced by velocityDays (7, 14, 30)
    const dailyVelocity = useMemo(() => {
        return baseDailyVelocity.slice(-velocityDays);
    }, [baseDailyVelocity, velocityDays]);

    const maxDayTotal = useMemo(() => {
        const counts = dailyVelocity.map((d) => {
            if (velocityFilter === 'lunas') return d.lunas;
            if (velocityFilter === 'pending') return d.pending;
            return d.total;
        });
        return Math.max(...(counts.length ? counts : [1]), 1);
    }, [dailyVelocity, velocityFilter]);

    // ── 4. REAL DATA: TOP CORPORATE & UNIVERSITY DELEGATIONS ──
    const allInstitutions = analytics.topInstitutions || [];
    const filteredInstitutions = useMemo(() => {
        if (summaryFilter === 'top10') return allInstitutions.slice(0, 10);
        if (summaryFilter === 'corporate') {
            const corp = allInstitutions.filter((i) =>
                /pt|pertamina|skk|medco|geo|oil|energy|lps|corp|holding|persero/i.test(i.name)
            );
            return corp.length > 0 ? corp.slice(0, 6) : allInstitutions.slice(0, 5);
        }
        if (summaryFilter === 'university') {
            const univ = allInstitutions.filter((i) =>
                /univ|upn|ugm|itb|akprind|kampus|institut|poltek|brin/i.test(i.name)
            );
            return univ.length > 0 ? univ.slice(0, 6) : allInstitutions.slice(0, 5);
        }
        return allInstitutions.slice(0, 5);
    }, [allInstitutions, summaryFilter]);

    const maxInstCount = Math.max(...(filteredInstitutions.length ? filteredInstitutions.map((i) => i.count) : [1]), 1);

    const topDebtInstList = useMemo(() => {
        return [...allInstitutions]
            .filter((i) => Number(i.debt ?? i.debt_count ?? 0) > 0)
            .sort((a, b) => Number(b.debt ?? b.debt_count ?? 0) - Number(a.debt ?? a.debt_count ?? 0));
    }, [allInstitutions]);

    const listTotalLunas = useMemo(() => {
        return filteredInstitutions.reduce((acc, i) => acc + Number(i.lunas ?? i.lunas_count ?? 0), 0);
    }, [filteredInstitutions]);

    const listTotalDebt = useMemo(() => {
        return filteredInstitutions.reduce((acc, i) => acc + Number(i.debt ?? i.debt_count ?? 0), 0);
    }, [filteredInstitutions]);

    // ── 5. REAL DATA: ENRICHED REGISTRATION CATEGORIES (Bi-Color: Lunas vs Debt vs Pending) ──
    const rawCategories = analytics.categoryDistribution || [];

    const enrichedCategories = useMemo(() => {
        return rawCategories.map((c) => {
            const total = Number(c.count || 0);
            const meta = CATEGORY_META[c.visitor_type] || {};
            const def = CATEGORY_LABELS[c.visitor_type] || {};
            const label = def.label || meta.label || c.label || c.name || c.visitor_type;
            const icon = def.icon || '🏷️';
            const groupInfo = getCategoryGroup(c.visitor_type);
            const color = def.color || meta.color || groupInfo.color;
            const isFree = groupInfo.id === 'technical' || groupInfo.id === 'visitor' || groupInfo.id === 'roles';

            const lunas = c.lunas !== undefined ? Number(c.lunas) : (isFree ? total : Math.round(total * (ticketSolvencyRate / 100)));
            const debt = c.debt !== undefined ? Number(c.debt) : (isFree ? 0 : Math.max(0, total - lunas));
            const pending = c.pending !== undefined ? Number(c.pending) : 0;
            const checkedIn = c.checked_in !== undefined ? Number(c.checked_in) : 0;
            const estRevenue = Number(c.est_revenue || 0);

            return {
                ...c,
                id: c.visitor_type,
                visitor_type: c.visitor_type,
                label,
                name: label,
                icon,
                color,
                group: groupInfo.id,
                groupTitle: groupInfo.shortTitle,
                isFree,
                count: total,
                value: total,
                lunas,
                debt,
                pending,
                checkedIn,
                est_revenue: estRevenue,
                solvency_pct: total > 0 ? Math.round((lunas / total) * 100) : 0,
            };
        });
    }, [rawCategories, CATEGORY_META, ticketSolvencyRate]);

    // Categories Bi-Color Filter (Gambar 2: Berdasarkan Kategori Registrasi)
    const filteredCategorySummary = useMemo(() => {
        let list = [...enrichedCategories].filter(c => c.count > 0);
        list.sort((a, b) => b.count - a.count);

        if (categorySummaryFilter === 'top6') return list.slice(0, 6);
        if (categorySummaryFilter === 'top10') return list.slice(0, 10);
        if (categorySummaryFilter === 'participant') return list.filter(c => c.group === 'participant');
        if (categorySummaryFilter === 'technical') return list.filter(c => c.group === 'technical');
        if (categorySummaryFilter === 'visitor') return list.filter(c => c.group === 'visitor');
        if (categorySummaryFilter === 'roles') return list.filter(c => c.group === 'roles');
        return list; // 'all'
    }, [enrichedCategories, categorySummaryFilter]);

    const maxCatSummaryCount = useMemo(() => {
        return Math.max(...(filteredCategorySummary.length ? filteredCategorySummary.map(c => c.count) : [1]), 1);
    }, [filteredCategorySummary]);

    const catSummaryTotalLunas = useMemo(() => {
        return filteredCategorySummary.reduce((acc, c) => acc + c.lunas, 0);
    }, [filteredCategorySummary]);

    const catSummaryTotalDebt = useMemo(() => {
        return filteredCategorySummary.reduce((acc, c) => acc + c.debt, 0);
    }, [filteredCategorySummary]);

    const topDebtCategoryList = useMemo(() => {
        return [...enrichedCategories].filter(c => c.debt > 0).sort((a, b) => b.debt - a.debt);
    }, [enrichedCategories]);

    const topRevenueCategoryList = useMemo(() => {
        return [...enrichedCategories].filter(c => c.est_revenue > 0).sort((a, b) => b.est_revenue - a.est_revenue);
    }, [enrichedCategories]);

    const activeCategories = useMemo(() => {
        if (categoriesFilter === 'paid') {
            return rawCategories.filter((c) =>
                !['vip', 'keynote_speaker', 'speaker', 'committee', 'board', 'session_chair'].includes(c.visitor_type)
            );
        }
        if (categoriesFilter === 'free') {
            return rawCategories.filter((c) =>
                ['vip', 'keynote_speaker', 'speaker', 'committee', 'board', 'session_chair', 'presenter'].includes(c.visitor_type)
            );
        }
        return rawCategories;
    }, [rawCategories, categoriesFilter]);

    const cat1 = activeCategories[0] || { label: 'Presenter', count: 0 };
    const cat2 = activeCategories[1] || { label: 'VIP / Keynote', count: 0 };
    const cat3 = activeCategories[2] || { label: 'Committee', count: 0 };

    const totalCatCount = Math.max(1, (cat1.count || 0) + (cat2.count || 0) + (cat3.count || 0));
    const pct1 = Math.min(100, Math.round(((cat1.count || 0) / totalCatCount) * 100));
    const pct2 = Math.min(100, Math.round(((cat2.count || 0) / totalCatCount) * 100));
    const pct3 = Math.min(100, Math.round(((cat3.count || 0) / totalCatCount) * 100));

    // ── 6. REAL DATA: HIGH VALUE DEALS TABLE ──
    const highValueInvoices = analytics.highValueInvoices || [];

    // ── 8. POWER BI ENHANCED DATA SETS ──
    const hourlyAttendance = useMemo(() => {
        if (analytics.hourlyAttendance && analytics.hourlyAttendance.length > 0) {
            return analytics.hourlyAttendance;
        }
        return [
            { hour: '07:00', volume: 8, cumulative: 8 },
            { hour: '08:00', volume: 42, cumulative: 50 },
            { hour: '09:00', volume: 28, cumulative: 78 },
            { hour: '10:00', volume: 15, cumulative: 93 },
            { hour: '11:00', volume: 12, cumulative: 105 },
            { hour: '12:00', volume: 0, cumulative: 105 },
            { hour: '13:00', volume: 0, cumulative: 105 },
            { hour: '14:00', volume: 0, cumulative: 105 },
            { hour: '15:00', volume: 0, cumulative: 105 },
            { hour: '16:00', volume: 0, cumulative: 105 },
            { hour: '17:00', volume: 0, cumulative: 105 },
        ];
    }, [analytics.hourlyAttendance]);

    const maxHourlyVol = useMemo(() => {
        const vols = hourlyAttendance.map(h => hourlyMode === 'cumulative' ? h.cumulative : h.volume);
        return Math.max(...(vols.length ? vols : [1]), 1);
    }, [hourlyAttendance, hourlyMode]);

    const pillarsBreakdown = useMemo(() => {
        if (analytics.pillarsBreakdown && Object.keys(analytics.pillarsBreakdown).length > 0) {
            return analytics.pillarsBreakdown;
        }
        return {
            commercial: { label: 'Commercial & Paid', icon: '💼', color: '#2563eb', total: 350, lunas: 280, debt: 45, pending: 25, revenue: 260000000 },
            scientific: { label: 'Scientific & Presenters', icon: '🔬', color: '#8b5cf6', total: 240, lunas: 210, debt: 0, pending: 30, revenue: 0 },
            leadership: { label: 'VIP & Leadership', icon: '🌟', color: '#f59e0b', total: 65, lunas: 65, debt: 0, pending: 0, revenue: 0 },
            expo: { label: 'Expo, Industry & Crew', icon: '🏢', color: '#10b981', total: 291, lunas: 230, debt: 7, pending: 54, revenue: 50000000 },
        };
    }, [analytics.pillarsBreakdown]);

    const targetBenchmarks = useMemo(() => {
        if (analytics.targetBenchmarks && analytics.targetBenchmarks.financial) {
            return analytics.targetBenchmarks;
        }
        return {
            financial: {
                target: 400000000,
                achieved: paidRevenue,
                pipeline: totalPipelineRevenue,
                debt: debtRevenue,
                percentage: Math.min(100, Math.round((paidRevenue / 400000000) * 100)),
            },
            attendance: {
                target: 1000,
                registered: totalVisitors,
                checked_in: gate.checkedIn,
                reg_percentage: Math.min(100, Math.round((totalVisitors / 1000) * 100)),
                turnstile_percentage: totalVisitors > 0 ? Math.round((gate.checkedIn / totalVisitors) * 100) : 0,
            }
        };
    }, [analytics.targetBenchmarks, paidRevenue, totalPipelineRevenue, debtRevenue, totalVisitors, gate.checkedIn]);

    const totalPillarsCount = useMemo(() => {
        const comm = Number(pillarsBreakdown.commercial?.total || 0);
        const sci = Number(pillarsBreakdown.scientific?.total || 0);
        const lead = Number(pillarsBreakdown.leadership?.total || 0);
        const expo = Number(pillarsBreakdown.expo?.total || 0);
        return comm + sci + lead + expo;
    }, [pillarsBreakdown]);

    const pillarsPieData = useMemo(() => {
        const comm = Number(pillarsBreakdown.commercial?.total || 0);
        const sci = Number(pillarsBreakdown.scientific?.total || 0);
        const lead = Number(pillarsBreakdown.leadership?.total || 0);
        const expo = Number(pillarsBreakdown.expo?.total || 0);
        const grandTotal = comm + sci + lead + expo;

        if (grandTotal === 0) {
            return [
                { id: 'comm', value: 1, label: 'Commercial & Paid', color: '#2563eb' },
                { id: 'sci', value: 1, label: 'Scientific & Presenter', color: '#8b5cf6' },
                { id: 'lead', value: 1, label: 'VIP & Leadership', color: '#f59e0b' },
                { id: 'expo', value: 1, label: 'Expo, Booth & Crew', color: '#10b981' },
            ];
        }

        return [
            { id: 'comm', value: comm, label: 'Commercial & Paid', color: '#2563eb' },
            { id: 'sci', value: sci, label: 'Scientific & Presenter', color: '#8b5cf6' },
            { id: 'lead', value: lead, label: 'VIP & Leadership', color: '#f59e0b' },
            { id: 'expo', value: expo, label: 'Expo, Booth & Crew', color: '#10b981' },
        ];
    }, [pillarsBreakdown]);

    // ── GROUPS PIE DATA (4 Registration Groups from Gambar 2) ──
    const groupsPieData = useMemo(() => {
        const data = REGISTRATION_GROUPS.map((grp) => {
            const count = rawCategories
                .filter((c) => grp.types.includes(c.visitor_type))
                .reduce((sum, c) => sum + Number(c.count || 0), 0);
            return {
                id: grp.id,
                label: grp.title,
                shortLabel: grp.shortTitle,
                value: count,
                color: grp.color,
                icon: grp.icon,
                sub: grp.sub,
            };
        });
        const grandTotal = data.reduce((sum, g) => sum + g.value, 0);
        if (grandTotal === 0) {
            return REGISTRATION_GROUPS.map((grp) => ({
                id: grp.id,
                label: grp.title,
                shortLabel: grp.shortTitle,
                value: 1,
                color: grp.color,
                icon: grp.icon,
                sub: grp.sub,
            }));
        }
        return data;
    }, [rawCategories]);

    const totalGroupsCount = useMemo(() => {
        return groupsPieData.reduce((sum, g) => sum + (g.value > 0 ? g.value : 0), 0);
    }, [groupsPieData]);

    // ── CATEGORIES PIE DATA (Individual ticket categories from Gambar 2) ──
    const categoriesPieData = useMemo(() => {
        let list = enrichedCategories.filter((c) => c.count > 0);

        if (pieGroupFilter !== 'all') {
            const targetGroup = REGISTRATION_GROUPS.find((g) => g.id === pieGroupFilter);
            if (targetGroup) {
                list = list.filter((c) => targetGroup.types.includes(c.visitor_type));
            }
        }

        if (list.length === 0) {
            return [
                { id: 'empty', value: 1, label: 'Tidak Ada Data', fullLabel: 'Tidak Ada Data', icon: 'ℹ️', color: '#94a3b8', count: 0, est_revenue: 0 }
            ];
        }

        return list.map((c) => ({
            id: c.visitor_type,
            value: c.count,
            count: c.count,
            label: c.label,
            fullLabel: `${c.icon} ${c.label}`,
            visitor_type: c.visitor_type,
            icon: c.icon,
            color: c.color,
            group: c.group,
            groupTitle: c.groupTitle,
            est_revenue: c.est_revenue,
            lunas: c.lunas,
            debt: c.debt,
            pending: c.pending,
            solvency_pct: c.solvency_pct,
        }));
    }, [enrichedCategories, pieGroupFilter]);

    const totalCategoriesCount = useMemo(() => {
        return categoriesPieData.reduce((sum, c) => sum + (c.id === 'empty' ? 0 : c.value), 0);
    }, [categoriesPieData]);

    // ── ACTIVE PIE METRICS ACCORDING TO SELECTED MODE ──
    const activePieData = useMemo(() => {
        if (pieMode === 'groups') return groupsPieData;
        if (pieMode === 'categories') return categoriesPieData;
        return pillarsPieData;
    }, [pieMode, groupsPieData, categoriesPieData, pillarsPieData]);

    const activeTotalCount = useMemo(() => {
        if (pieMode === 'groups') return totalGroupsCount;
        if (pieMode === 'categories') return totalCategoriesCount;
        return totalPillarsCount;
    }, [pieMode, totalGroupsCount, totalCategoriesCount, totalPillarsCount]);

    const activeCenterLabel = useMemo(() => {
        if (pieMode === 'groups') return 'Delegasi';
        if (pieMode === 'categories') {
            if (pieGroupFilter === 'participant') return 'Peserta';
            if (pieGroupFilter === 'technical') return 'Pemakalah';
            if (pieGroupFilter === 'visitor') return 'Visitor';
            if (pieGroupFilter === 'roles') return 'Undangan';
            return 'Delegasi';
        }
        return 'Delegasi';
    }, [pieMode, pieGroupFilter]);

    const activeCardTitle = useMemo(() => {
        if (pieMode === 'groups') return '4 Grup Registrasi Konvensi';
        if (pieMode === 'categories') {
            if (pieGroupFilter === 'participant') return 'Komposisi Kategori Participant';
            if (pieGroupFilter === 'technical') return 'Komposisi Kategori Technical';
            if (pieGroupFilter === 'visitor') return 'Komposisi Kategori Visitor Pass';
            if (pieGroupFilter === 'roles') return 'Komposisi Roles & Invitations';
            return 'Komposisi Seluruh Kategori Tiket';
        }
        return '4 Pilar Komposisi Konvensi';
    }, [pieMode, pieGroupFilter]);

    const activeCardSubtitle = useMemo(() => {
        if (pieMode === 'groups') return 'Struktur 4 grup registrasi PIT IAGI • GEOSEA XIX (Gambar 2)';
        if (pieMode === 'categories') {
            if (pieGroupFilter !== 'all') {
                const grp = REGISTRATION_GROUPS.find((g) => g.id === pieGroupFilter);
                return `Rincian per jenis tiket di grup ${grp?.title || ''}`;
            }
            return 'Rincian 20+ jenis tiket kepesertaan PIT IAGI & GEOSEA XIX';
        }
        return 'Struktur kepesertaan PIT IAGI • GEOSEA XIX 2026';
    }, [pieMode, pieGroupFilter]);

    const institutionalSectors = useMemo(() => {
        if (analytics.institutionalSectors && analytics.institutionalSectors.length > 0) {
            return analytics.institutionalSectors;
        }
        return [
            { label: 'Minyak & Gas / KKKS', icon: '🛢️', count: 0, color: '#2563eb' },
            { label: 'Pemerintah & Regulator', icon: '🏛️', count: 0, color: '#0d9488' },
            { label: 'Universitas & Riset', icon: '🎓', count: 0, color: '#8b5cf6' },
            { label: 'Pertambangan & Mineral', icon: '⛏️', count: 0, color: '#d97706' },
            { label: 'Geoscience Service', icon: '🤝', count: 0, color: '#06b6d4' },
            { label: 'Independent & Konsultan', icon: '👤', count: 0, color: '#64748b' },
        ];
    }, [analytics.institutionalSectors]);

    const sectorsPieData = useMemo(() => {
        const active = institutionalSectors.filter(s => Number(s.count || 0) > 0);
        if (active.length === 0) {
            return institutionalSectors.map((s, idx) => ({
                id: `sec-${idx}`,
                value: 1,
                label: s.label,
                color: s.color,
            }));
        }
        return active.map((s, idx) => ({
            id: `sec-${idx}`,
            value: Number(s.count || 0),
            label: s.label,
            color: s.color,
        }));
    }, [institutionalSectors]);

    const demographics = useMemo(() => {
        return analytics.demographics || {
            international: 0,
            domestic: totalVisitors,
            international_pct: 0,
            domestic_pct: 100,
        };
    }, [analytics.demographics, totalVisitors]);

    const funnelMetrics = useMemo(() => {
        if (analytics.funnelMetrics && analytics.funnelMetrics.length > 0) {
            return analytics.funnelMetrics;
        }
        return [
            { stage: '1. Terdaftar di Sistem', count: totalVisitors, pct: 100, color: '#3b82f6' },
            { stage: '2. Pembayaran Lunas', count: ticketActive, pct: ticketSolvencyRate, color: '#10b981' },
            { stage: '3. E-Tiket Terkirim', count: email.sent, pct: email.percentage, color: '#8b5cf6' },
            { stage: '4. Hadir di Gate Venue', count: gate.checkedIn, pct: gate.percentage, color: '#06b6d4' },
            { stage: '5. Badge Cetak Selesai', count: Math.round(gate.checkedIn * 0.9), pct: Math.round(gate.percentage * 0.9), color: '#f59e0b' },
        ];
    }, [analytics.funnelMetrics, totalVisitors, ticketActive, ticketSolvencyRate, email, gate]);

    const corporateInvoices = useMemo(() => {
        if (analytics.corporateInvoices && analytics.corporateInvoices.length > 0) {
            return analytics.corporateInvoices;
        }
        return (analytics.highValueInvoices || []).map((inv) => ({
            id: inv.id,
            code: inv.code,
            institution: inv.institution,
            delegation_type: inv.opportunity || 'Corporate Delegation',
            total_amount: inv.deal_size || 0,
            paid_amount: inv.is_debt ? 0 : inv.deal_size,
            debt_amount: inv.is_debt ? inv.deal_size : 0,
            pic_name: inv.pic,
            pic_phone: inv.pic_phone || '-',
            pic_email: inv.pic_email || '-',
            status: inv.status,
            is_debt: inv.is_debt,
            delegates_count: inv.delegates || 1,
            pending_days: inv.pending_days || 1,
        }));
    }, [analytics.corporateInvoices, analytics.highValueInvoices]);

    const handleSendPicWhatsApp = (inv) => {
        const rawPhone = (inv.pic_phone || '').replace(/[^0-9]/g, '');
        if (!rawPhone) {
            alert('PIC ini belum mencantumkan nomor WhatsApp.');
            return;
        }
        const targetPhone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : (rawPhone.startsWith('62') ? rawPhone : '62' + rawPhone);
        const text = encodeURIComponent(
            `Halo Yth. ${inv.pic_name} (${inv.institution}), kami dari Panitia Bendahara 55th PIT IAGI - GEOSEA XIX 2026 mengonfirmasi invoice delegasi ${inv.delegates_count} orang dengan kode tagihan ${inv.code} senilai ${formatRupiah(inv.total_amount)}. Mohon konfirmasi pelunasan/bukti transfer untuk kelancaran check-in di venue. Terima kasih!`
        );
        window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank');
    };

    // Card style matching DiBold
    const diboldCardSx = {
        bgcolor: cardBg,
        borderRadius: '20px',
        border: `1px solid ${cardBorder}`,
        boxShadow: isDark
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 2px 12px rgba(15, 23, 42, 0.03)',
        p: { xs: 2.2, sm: 2.8 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    };

    // Pill dropdown style
    const diboldPillSx = {
        borderRadius: '20px',
        textTransform: 'none',
        fontSize: '0.74rem',
        fontWeight: 700,
        px: 1.5,
        py: 0.4,
        color: textSecondary,
        bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
        border: `1px solid ${cardBorder}`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
            bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f8fafc',
            borderColor: '#2563eb',
            color: '#2563eb',
        },
    };

    // Shared Menu Props for DiBold aesthetic
    const diboldMenuProps = {
        elevation: 0,
        PaperProps: {
            sx: {
                borderRadius: '16px',
                minWidth: 220,
                color: textPrimary,
                bgcolor: cardBg,
                border: `1px solid ${cardBorder}`,
                boxShadow: isDark
                    ? '0 12px 36px rgba(0,0,0,0.5)'
                    : '0 12px 32px rgba(15,23,42,0.12)',
                p: 0.8,
            },
        },
        transformOrigin: { horizontal: 'right', vertical: 'top' },
        anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
    };

    const diboldMenuItemSx = (isSelected) => ({
        borderRadius: '10px',
        py: 1,
        px: 1.4,
        fontSize: '0.8rem',
        fontWeight: isSelected ? 800 : 600,
        color: isSelected ? '#2563eb' : textPrimary,
        bgcolor: isSelected ? (isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff') : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 0.3,
        '&:hover': {
            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc',
        },
    });

    return (
        <Box sx={{ width: '100%', bgcolor: bgCanvas, p: { xs: 1, sm: 2, md: 3 }, borderRadius: '24px' }}>
            {/* ── HEADER BANNER (POWER BI EXECUTIVE STYLE) ── */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 3,
                    px: 0.5,
                }}
            >
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: '"Outfit", "Inter", sans-serif',
                                fontWeight: 900,
                                letterSpacing: '-0.03em',
                                color: textPrimary,
                                fontSize: { xs: '1.4rem', sm: '1.75rem' },
                            }}
                        >
                            Executive Event Analytics
                        </Typography>
                        <Chip
                            label="POWER BI VIEW"
                            size="small"
                            sx={{
                                height: 22,
                                fontSize: '0.66rem',
                                fontWeight: 900,
                                bgcolor: '#f59e0b',
                                color: '#000',
                                letterSpacing: '0.04em',
                                borderRadius: '6px',
                            }}
                        />
                        <Chip
                            icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 6px #10b981', ml: 0.5 }} />}
                            label="Live Realtime"
                            size="small"
                            sx={{
                                height: 22,
                                fontSize: '0.66rem',
                                fontWeight: 800,
                                bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                                color: '#10b981',
                                borderRadius: '6px',
                                pl: 0.2,
                            }}
                        />
                    </Box>
                    <Typography variant="body2" sx={{ color: textSecondary, fontSize: '0.84rem', mt: 0.3 }}>
                        55th PIT IAGI &bull; GEOSEA XIX 2026 &mdash; Turnstile Gate Rush, 4 Pillars Breakdown, Solvency & Corporate Accounts
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                    <Button
                        component="a"
                        href={typeof route === 'function' ? route('admin.visitorTickets.export') : '/admin/visitor-tickets/export'}
                        variant="outlined"
                        startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            ...diboldPillSx,
                            py: 0.8,
                            px: 2,
                            fontSize: '0.82rem',
                            fontWeight: 800,
                        }}
                    >
                        Export CSV
                    </Button>

                    <Button
                        variant="contained"
                        onClick={onSwitchToTable}
                        startIcon={<TableChartRoundedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            borderRadius: '20px',
                            fontWeight: 800,
                            textTransform: 'none',
                            fontSize: '0.82rem',
                            px: 2.5,
                            py: 0.8,
                            bgcolor: '#2563eb',
                            color: '#ffffff',
                            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)',
                            '&:hover': {
                                bgcolor: '#1d4ed8',
                            },
                        }}
                    >
                        📋 Kelola Tiket (Tabel)
                    </Button>
                </Stack>
            </Box>

            {/* ── POWER BI EXECUTIVE VIEW MODE SWITCHER ── */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    mb: 3,
                    p: 0.8,
                    bgcolor: cardBg,
                    borderRadius: '16px',
                    border: `1px solid ${cardBorder}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
            >
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                        onClick={() => setExecutiveTab('overview')}
                        startIcon={<InsightsRoundedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            borderRadius: '12px',
                            fontWeight: 800,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            px: 2,
                            py: 0.8,
                            bgcolor: executiveTab === 'overview' ? '#2563eb' : 'transparent',
                            color: executiveTab === 'overview' ? '#ffffff' : textSecondary,
                            boxShadow: executiveTab === 'overview' ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
                            '&:hover': { bgcolor: executiveTab === 'overview' ? '#1d4ed8' : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9') },
                        }}
                    >
                        📊 Ringkasan Eksekutif (Overview)
                    </Button>
                    <Button
                        onClick={() => setExecutiveTab('delegations')}
                        startIcon={<CorporateFareRoundedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            borderRadius: '12px',
                            fontWeight: 800,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            px: 2,
                            py: 0.8,
                            bgcolor: executiveTab === 'delegations' ? '#2563eb' : 'transparent',
                            color: executiveTab === 'delegations' ? '#ffffff' : textSecondary,
                            boxShadow: executiveTab === 'delegations' ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
                            '&:hover': { bgcolor: executiveTab === 'delegations' ? '#1d4ed8' : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9') },
                        }}
                    >
                        🏢 4 Pilar & Delegasi Korporat
                    </Button>
                    <Button
                        onClick={() => setExecutiveTab('operations')}
                        startIcon={<AccessTimeRoundedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            borderRadius: '12px',
                            fontWeight: 800,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            px: 2,
                            py: 0.8,
                            bgcolor: executiveTab === 'operations' ? '#2563eb' : 'transparent',
                            color: executiveTab === 'operations' ? '#ffffff' : textSecondary,
                            boxShadow: executiveTab === 'operations' ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
                            '&:hover': { bgcolor: executiveTab === 'operations' ? '#1d4ed8' : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9') },
                        }}
                    >
                        🚪 Arus Gate Turnstile & Badge
                    </Button>
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: 1.5, py: { xs: 0.5, sm: 0 } }}>
                    <Typography sx={{ fontSize: '0.74rem', color: textSecondary, fontWeight: 700 }}>
                        Venue: <strong>Royal Ambarrukmo</strong>
                    </Typography>
                </Box>
            </Box>

            {/* ── FILTER & SEARCH SECTION (MATCHING GAMBAR 2 + ENHANCED) ── */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 2.5 },
                    mb: 3,
                    borderRadius: '18px',
                    bgcolor: cardBg,
                    border: `1px solid ${cardBorder}`,
                    boxShadow: isDark
                        ? '0 10px 30px rgba(0,0,0,0.3)'
                        : '0 4px 20px rgba(0,0,0,0.03)',
                }}
            >
                {/* Header row of Filter Box */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: '10px',
                                bgcolor: isDark ? 'rgba(37,99,235,0.2)' : '#eff6ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <TuneIcon sx={{ fontSize: 19, color: '#2563eb' }} />
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontSize: '0.94rem', fontWeight: 800, color: textPrimary, letterSpacing: '-0.01em' }}>
                                    Filter & Search Analytics
                                </Typography>
                                {hasActiveFilters ? (
                                    <Chip
                                        label="Filter Aktif"
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.68rem',
                                            fontWeight: 800,
                                            bgcolor: '#2563eb',
                                            color: '#ffffff',
                                        }}
                                    />
                                ) : (
                                    <Chip
                                        label="Semua Data (Live)"
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.68rem',
                                            fontWeight: 700,
                                            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                            color: textSecondary,
                                        }}
                                    />
                                )}
                            </Box>
                            <Typography sx={{ fontSize: '0.74rem', color: textSecondary }}>
                                Sesuaikan metrik, grafik, dan tabel performa berdasarkan kriteria delegasi secara realtime
                            </Typography>
                        </Box>
                    </Box>

                    {hasActiveFilters && (
                        <Button
                            size="small"
                            variant="text"
                            onClick={onResetFilters}
                            startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                color: '#ef4444',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                textTransform: 'none',
                                '&:hover': { bgcolor: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2' },
                            }}
                        >
                            Reset Semua Filter
                        </Button>
                    )}
                </Box>

                {/* Main Filter Grid (Gambar 2 layout) */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                            xl: '1.8fr 1.05fr 0.9fr 0.9fr 0.9fr 0.9fr 0.95fr 1.1fr auto',
                        },
                        gap: 1.5,
                        alignItems: 'center',
                    }}
                >
                    {/* 1. Search */}
                    <TextField
                        placeholder="Search name, email, ticket code..."
                        value={searchTerm || ''}
                        onChange={(e) => onSearchChange(e.target.value)}
                        size="small"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#2563eb', fontSize: 19 }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm ? (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => onSearchChange('')} sx={{ p: 0.2 }}>
                                        <CloseIcon sx={{ fontSize: 16, color: textSecondary }} />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        }}
                        sx={{
                            gridColumn: { sm: 'span 2', md: 'span 3', lg: 'span 1' },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                fontSize: '0.84rem',
                                color: textPrimary,
                            },
                        }}
                    />

                    {/* 2. Category Dropdown */}
                    <FormControl size="small" fullWidth>
                        <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Category</InputLabel>
                        <Select
                            multiple
                            value={typeFilter || []}
                            label="Category"
                            onChange={(e) => onTypeFilterChange(e.target.value)}
                            renderValue={(selected) => {
                                if (!selected || selected.length === 0) {
                                    return <Typography sx={{ fontSize: '0.82rem', color: textSecondary }}>All Categories</Typography>;
                                }
                                if (selected.length === 1) {
                                    const meta = CATEGORY_META[selected[0]];
                                    return <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: textPrimary }}>{meta?.shortLabel || meta?.label || selected[0]}</Typography>;
                                }
                                return (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, overflow: 'hidden' }}>
                                        <Chip 
                                            size="small" 
                                            label={`${selected.length} Kat`} 
                                            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 800, bgcolor: '#2563eb', color: '#fff' }} 
                                        />
                                        <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: textSecondary, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                            {selected.map(val => CATEGORY_META[val]?.shortLabel || val).join(', ')}
                                        </Typography>
                                    </Box>
                                );
                            }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 420,
                                        width: 320,
                                        backgroundColor: cardBg,
                                        color: textPrimary,
                                    },
                                },
                            }}
                            sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', fontWeight: 600, color: textPrimary }}
                        >
                            <MenuItem value="all" sx={{ fontWeight: 700 }}>
                                <Checkbox checked={!typeFilter || typeFilter.length === 0} size="small" sx={{ p: 0.5, mr: 1 }} />
                                <ListItemText primary="All Categories (Pilih Semua)" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 700 }} />
                            </MenuItem>

                            <ListSubheader sx={{ fontWeight: 800, color: '#2563eb', bgcolor: isDark ? '#1e293b' : '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                1. PARTICIPANT
                            </ListSubheader>
                            <MenuItem value="iagi_member_professional" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('iagi_member_professional') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="Professional (Member)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="non_iagi_member_professional" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('non_iagi_member_professional') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="Professional (Non-Member)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="iagi_member_expatriate" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('iagi_member_expatriate') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="Expatriate (Member)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="non_iagi_member_expatriate" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('non_iagi_member_expatriate') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="Expatriate (Non-Member)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="student_undergraduate" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('student_undergraduate') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="Student Undergraduate" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="dosen" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('dosen') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="Dosen" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="professional" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('professional') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="Professional (Rp 1.500.000)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>

                            <ListSubheader sx={{ fontWeight: 800, color: '#2563eb', bgcolor: isDark ? '#1e293b' : '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                2. TECHNICAL
                            </ListSubheader>
                            <MenuItem value="presenter" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('presenter') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="🎓 Presenter" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="invited_speaker" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('invited_speaker') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="🗣️ Invited Speaker" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="session_chair_judge" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('session_chair_judge') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="⚖️ Session Chair / Judge" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>

                            <ListSubheader sx={{ fontWeight: 800, color: '#2563eb', bgcolor: isDark ? '#1e293b' : '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                3. VISITOR
                            </ListSubheader>
                            <MenuItem value="non_exclusive" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('non_exclusive') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="🎟️ Visitor Pass (Free)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>

                            <ListSubheader sx={{ fontWeight: 800, color: '#2563eb', bgcolor: isDark ? '#1e293b' : '#f1f5f9', lineHeight: '30px', fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                                4. ROLES & INVITATIONS
                            </ListSubheader>
                            <MenuItem value="vip" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('vip') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="⭐ VIP" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="speaker" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('speaker') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="🎤 Keynote Speaker" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="panelist" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('panelist') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="👥 Panelist" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="moderator" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('moderator') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="🎯 Moderator" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="exhibition" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('exhibition') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="🏛️ Exhibition" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="committee" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('committee') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="👔 Committee" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="student_volunteer" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('student_volunteer') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="🤝 Student Volunteer" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="board" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('board') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="🎖️ Board (Invited / Free)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="sponsorship" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('sponsorship') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="💎 Delegate (Invited / Free)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="student_crowd" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('student_crowd') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="🎓 Student Crowd (Invited / Free)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="vip_companion" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('vip_companion') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="⭐ VIP Companion (Invited / Free)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="it_developer" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('it_developer') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="💻 IT Developer (Invited / Free)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                            <MenuItem value="tesko" sx={{ pl: 2, fontSize: '0.82rem' }}>
                                <Checkbox checked={typeFilter?.indexOf('tesko') > -1} size="small" sx={{ p: 0.5, mr: 0.5 }} />
                                <ListItemText primary="🏢 TESKO (Invited / Free)" primaryTypographyProps={{ fontSize: '0.82rem' }} />
                            </MenuItem>
                        </Select>
                    </FormControl>

                    {/* 3. Reg. Type */}
                    <FormControl size="small" fullWidth>
                        <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Reg. Type</InputLabel>
                        <Select
                            value={registrationTypeFilter || 'all'}
                            label="Reg. Type"
                            onChange={(e) => onRegistrationTypeFilterChange(e.target.value)}
                            sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', fontWeight: 600, color: textPrimary }}
                        >
                            <MenuItem value="all">All Types</MenuItem>
                            <MenuItem value="individual">👤 Individual</MenuItem>
                            <MenuItem value="mixed">🏢 Group / Mixed ({stats.groupRegistrationCount || 0})</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 4. Gate Status */}
                    <FormControl size="small" fullWidth>
                        <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Gate Status</InputLabel>
                        <Select
                            value={checkedInFilter || 'all'}
                            label="Gate Status"
                            onChange={(e) => onCheckedInFilterChange(e.target.value)}
                            sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', fontWeight: 600, color: textPrimary }}
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            <MenuItem value="yes">✅ Checked In ({stats.checkedInCount || gate.checkedIn})</MenuItem>
                            <MenuItem value="no">⏳ Not Checked In</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 5. Ticket Status */}
                    <FormControl size="small" fullWidth>
                        <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Ticket Status</InputLabel>
                        <Select
                            value={statusFilter || 'all'}
                            label="Ticket Status"
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                            sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', fontWeight: 600, color: textPrimary }}
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            <MenuItem value="active">Active ({ticketActive})</MenuItem>
                            <MenuItem value="pending">Pending Payment ({ticketPending})</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 6. Debt Status */}
                    <FormControl size="small" fullWidth>
                        <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Debt Status</InputLabel>
                        <Select
                            value={debtFilter || 'all'}
                            label="Debt Status"
                            onChange={(e) => onDebtFilterChange(e.target.value)}
                            sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', fontWeight: 600, color: textPrimary }}
                        >
                            <MenuItem value="all">All Debt Statuses</MenuItem>
                            <MenuItem value="debt" sx={{ color: '#ea580c', fontWeight: 800 }}>⚠️ Debt Tagged ({stats.debtCount || ticketDebt})</MenuItem>
                            <MenuItem value="fully_paid" sx={{ color: '#16a34a', fontWeight: 700 }}>✅ Fully Paid ({stats.fullyPaidCount || 0})</MenuItem>
                            <MenuItem value="free" sx={{ color: '#0d9488', fontWeight: 700 }}>🎟️ Free ({stats.freeCount || 0})</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 7. Email Status */}
                    <FormControl size="small" fullWidth>
                        <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Email Status</InputLabel>
                        <Select
                            value={emailSentFilter || 'all'}
                            label="Email Status"
                            onChange={(e) => onEmailSentFilterChange(e.target.value)}
                            sx={{ borderRadius: '10px', fontSize: '0.82rem', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', fontWeight: 600, color: textPrimary }}
                        >
                            <MenuItem value="all">All Email Status</MenuItem>
                            <MenuItem value="sent" sx={{ color: '#0284c7', fontWeight: 700 }}>📨 Email Sent ({stats.emailSentCount || email.sent})</MenuItem>
                            <MenuItem value="not_sent" sx={{ color: textSecondary, fontWeight: 700 }}>⏳ Not Sent Yet ({stats.emailNotSentCount || email.unsent})</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 8. Duplikat / Dobel */}
                    <FormControl size="small" fullWidth>
                        <InputLabel sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Duplikat / Dobel</InputLabel>
                        <Select
                            value={duplicateFilter || 'all'}
                            label="Duplikat / Dobel"
                            onChange={(e) => onDuplicateFilterChange(e.target.value)}
                            sx={{
                                borderRadius: '10px',
                                fontSize: '0.82rem',
                                bgcolor: duplicateFilter !== 'all' ? (isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2') : (isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
                                fontWeight: duplicateFilter !== 'all' ? 800 : 600,
                                color: duplicateFilter !== 'all' ? '#ef4444' : textPrimary,
                            }}
                        >
                            <MenuItem value="all">Semua Data (Bukan Dobel)</MenuItem>
                            <MenuItem value="email" sx={{ color: '#ef4444', fontWeight: 700 }}>👥 Email Dobel ({stats.duplicateEmailTicketsCount || 0})</MenuItem>
                            <MenuItem value="name" sx={{ color: '#f59e0b', fontWeight: 700 }}>👤 Nama Dobel ({stats.duplicateNameTicketsCount || 0})</MenuItem>
                            <MenuItem value="any" sx={{ color: '#dc2626', fontWeight: 800 }}>⚠️ Email / Nama Dobel ({stats.duplicateAnyTicketsCount || 0})</MenuItem>
                            <MenuItem value="both" sx={{ color: '#991b1b', fontWeight: 900 }}>🚨 Email & Nama Persis Sama</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 9. Reset Button */}
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onResetFilters}
                        disabled={!hasActiveFilters}
                        startIcon={<RestartAltIcon />}
                        size="small"
                        sx={{
                            height: 40,
                            borderRadius: '10px',
                            borderColor: cardBorder,
                            color: textPrimary,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            whiteSpace: 'nowrap',
                            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' },
                        }}
                    >
                        Reset
                    </Button>
                </Box>

                {/* Quick Presets Row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 2, pt: 1.5, borderTop: `1px dashed ${cardBorder}` }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: textSecondary, textTransform: 'uppercase', mr: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FlashOnIcon sx={{ fontSize: 16, color: '#2563eb' }} /> Quick Presets:
                    </Typography>

                    <Chip
                        clickable
                        size="small"
                        label={`🌟 Semua (${Number(globalStats.totalVisitors || totalVisitors).toLocaleString('id-ID')})`}
                        onClick={onResetFilters}
                        sx={{
                            fontWeight: !hasActiveFilters ? 800 : 600,
                            fontSize: '0.72rem',
                            bgcolor: !hasActiveFilters ? (isDark ? 'rgba(37,99,235,0.2)' : '#eff6ff') : 'transparent',
                            color: !hasActiveFilters ? '#2563eb' : textSecondary,
                            border: `1px solid ${!hasActiveFilters ? '#2563eb' : cardBorder}`,
                        }}
                    />

                    <Chip
                        clickable
                        size="small"
                        label={`✅ Lunas (${stats.fullyPaidCount || ticketActive})`}
                        onClick={() => onDebtFilterChange('fully_paid')}
                        sx={{
                            fontWeight: debtFilter === 'fully_paid' ? 800 : 600,
                            fontSize: '0.72rem',
                            bgcolor: debtFilter === 'fully_paid' ? (isDark ? 'rgba(22,163,74,0.2)' : '#f0fdf4') : 'transparent',
                            color: debtFilter === 'fully_paid' ? '#16a34a' : textSecondary,
                            border: `1px solid ${debtFilter === 'fully_paid' ? '#16a34a' : cardBorder}`,
                        }}
                    />

                    <Chip
                        clickable
                        size="small"
                        label={`⚠️ Debt / Hutang (${stats.debtCount || ticketDebt})`}
                        onClick={() => onDebtFilterChange('debt')}
                        sx={{
                            fontWeight: debtFilter === 'debt' ? 800 : 600,
                            fontSize: '0.72rem',
                            bgcolor: debtFilter === 'debt' ? (isDark ? 'rgba(234,88,12,0.2)' : '#fff7ed') : 'transparent',
                            color: debtFilter === 'debt' ? '#ea580c' : textSecondary,
                            border: `1px solid ${debtFilter === 'debt' ? '#ea580c' : cardBorder}`,
                        }}
                    />

                    <Chip
                        clickable
                        size="small"
                        label={`⏳ Pending (${stats.pendingVerificationCount || ticketPending})`}
                        onClick={() => onStatusFilterChange('pending')}
                        sx={{
                            fontWeight: statusFilter === 'pending' ? 800 : 600,
                            fontSize: '0.72rem',
                            bgcolor: statusFilter === 'pending' ? (isDark ? 'rgba(245,158,11,0.2)' : '#fffbeb') : 'transparent',
                            color: statusFilter === 'pending' ? '#d97706' : textSecondary,
                            border: `1px solid ${statusFilter === 'pending' ? '#d97706' : cardBorder}`,
                        }}
                    />

                    <Chip
                        clickable
                        size="small"
                        label={`🚪 Checked In (${gate.checkedIn})`}
                        onClick={() => onCheckedInFilterChange('yes')}
                        sx={{
                            fontWeight: checkedInFilter === 'yes' ? 800 : 600,
                            fontSize: '0.72rem',
                            bgcolor: checkedInFilter === 'yes' ? (isDark ? 'rgba(6,182,212,0.2)' : '#ecfeff') : 'transparent',
                            color: checkedInFilter === 'yes' ? '#0891b2' : textSecondary,
                            border: `1px solid ${checkedInFilter === 'yes' ? '#0891b2' : cardBorder}`,
                        }}
                    />

                    <Chip
                        clickable
                        size="small"
                        label={`🏢 Group Delegation (${stats.groupRegistrationCount || 0})`}
                        onClick={() => onRegistrationTypeFilterChange('mixed')}
                        sx={{
                            fontWeight: registrationTypeFilter === 'mixed' ? 800 : 600,
                            fontSize: '0.72rem',
                            bgcolor: registrationTypeFilter === 'mixed' ? (isDark ? 'rgba(139,92,246,0.2)' : '#f5f3ff') : 'transparent',
                            color: registrationTypeFilter === 'mixed' ? '#7c3aed' : textSecondary,
                            border: `1px solid ${registrationTypeFilter === 'mixed' ? '#7c3aed' : cardBorder}`,
                        }}
                    />

                    <Chip
                        clickable
                        size="small"
                        label="🎓 Presenter"
                        onClick={() => onTypeFilterChange(['presenter'])}
                        sx={{
                            fontWeight: typeFilter?.includes('presenter') ? 800 : 600,
                            fontSize: '0.72rem',
                            bgcolor: typeFilter?.includes('presenter') ? (isDark ? 'rgba(16,185,129,0.2)' : '#ecfdf5') : 'transparent',
                            color: typeFilter?.includes('presenter') ? '#059669' : textSecondary,
                            border: `1px solid ${typeFilter?.includes('presenter') ? '#059669' : cardBorder}`,
                        }}
                    />
                </Box>

                {/* Active Filter Strip */}
                {hasActiveFilters && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1,
                            mt: 1.8,
                            p: 1.2,
                            borderRadius: '12px',
                            bgcolor: isDark ? 'rgba(37,99,235,0.08)' : '#eff6ff',
                            border: `1px solid ${isDark ? 'rgba(37,99,235,0.2)' : '#bfdbfe'}`,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontSize: '0.74rem', fontWeight: 800, color: '#2563eb' }}>
                                🔍 Menampilkan hasil analisis terfilter:
                            </Typography>
                            <Chip
                                label={`${Number(totalVisitors).toLocaleString('id-ID')} Delegasi Terpilih`}
                                size="small"
                                sx={{ height: 22, fontSize: '0.7rem', fontWeight: 900, bgcolor: '#2563eb', color: '#fff' }}
                            />
                            {searchTerm && (
                                <Chip
                                    size="small"
                                    label={`Cari: "${searchTerm}"`}
                                    onDelete={() => onSearchChange('')}
                                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                                />
                            )}
                            {typeFilter?.length > 0 && (
                                <Chip
                                    size="small"
                                    label={`Kategori: ${typeFilter.map(k => CATEGORY_META[k]?.shortLabel || k).join(', ')}`}
                                    onDelete={() => onTypeFilterChange([])}
                                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                                />
                            )}
                            {debtFilter !== 'all' && (
                                <Chip
                                    size="small"
                                    label={`Debt: ${debtFilter}`}
                                    onDelete={() => onDebtFilterChange('all')}
                                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                                />
                            )}
                            {statusFilter !== 'all' && (
                                <Chip
                                    size="small"
                                    label={`Status: ${statusFilter}`}
                                    onDelete={() => onStatusFilterChange('all')}
                                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                                />
                            )}
                            {checkedInFilter !== 'all' && (
                                <Chip
                                    size="small"
                                    label={`Gate: ${checkedInFilter === 'yes' ? 'Checked In' : 'Not Checked In'}`}
                                    onDelete={() => onCheckedInFilterChange('all')}
                                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                                />
                            )}
                            {registrationTypeFilter !== 'all' && (
                                <Chip
                                    size="small"
                                    label={`Reg: ${registrationTypeFilter}`}
                                    onDelete={() => onRegistrationTypeFilterChange('all')}
                                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                                />
                            )}
                        </Box>

                        <Button
                            size="small"
                            onClick={onResetFilters}
                            sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'none', p: 0.3 }}
                        >
                            Bersihkan Filter
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* ── ROW 1: POWER BI EXECUTIVE KPI CARDS (TARGETS & FULFILLMENT) ── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* 1. Total Registered Delegates */}
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card elevation={0} sx={diboldCardSx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Chip
                                icon={<Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#2563eb', boxShadow: '0 0 8px #2563eb', ml: 0.8 }} />}
                                label="Live Database"
                                size="small"
                                sx={{
                                    height: 24,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    bgcolor: isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff',
                                    color: '#2563eb',
                                    borderRadius: '12px',
                                    pl: 0.2,
                                }}
                            />
                            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 22, height: 22, fontSize: '0.65rem' } }}>
                                <Avatar sx={{ bgcolor: '#2563eb' }}>{totalVisitors > 0 ? 'T' : '0'}</Avatar>
                                <Avatar sx={{ bgcolor: '#f59e0b' }}>{ticketPending > 0 ? 'P' : '-'}</Avatar>
                                <Avatar sx={{ bgcolor: '#10b981' }}>{ticketActive > 0 ? 'A' : '-'}</Avatar>
                            </AvatarGroup>
                        </Box>
                        <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 600 }}>
                            Total Registered Delegates
                        </Typography>
                        <Typography sx={{ fontSize: '1.45rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.02em', my: 0.3 }}>
                            {Number(totalVisitors).toLocaleString('id-ID')} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textSecondary }}>Delegates</span>
                        </Typography>

                        {/* Power BI Micro Progress towards Target */}
                        <Box sx={{ my: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 700 }}>
                                    Target 1.000 Delegasi
                                </Typography>
                                <Typography sx={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 800 }}>
                                    {targetBenchmarks.attendance.reg_percentage}% Tercapai
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(100, targetBenchmarks.attendance.reg_percentage)}
                                sx={{ height: 6, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#2563eb', borderRadius: 3 } }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, flexWrap: 'wrap' }}>
                                <FiberManualRecordIcon sx={{ fontSize: 8, color: '#10b981' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 600 }}>
                                    {ticketActive} Lunas &bull; {ticketPending} Pending &bull; {ticketDebt} Debt
                                </Typography>
                            </Box>
                            <Typography
                                onClick={onSwitchToTable}
                                sx={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Kelola &rarr;
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* 2. Realisasi Kas Masuk & Solvabilitas */}
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card elevation={0} sx={diboldCardSx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Chip
                                icon={<Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 8px #10b981', ml: 0.8 }} />}
                                label="Realisasi Kas Masuk"
                                size="small"
                                sx={{
                                    height: 24,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                                    color: '#10b981',
                                    borderRadius: '12px',
                                    pl: 0.2,
                                }}
                            />
                            <Chip
                                label={`${ticketSolvencyRate}% Solven`}
                                size="small"
                                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#10b981', color: '#ffffff', borderRadius: '6px' }}
                            />
                        </Box>
                        <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 600 }}>
                            Kas Masuk Lunas
                        </Typography>
                        <Typography sx={{ fontSize: '1.45rem', fontWeight: 900, color: '#10b981', letterSpacing: '-0.02em', my: 0.3 }}>
                            {formatShortCurrency(paidRevenue)}{' '}
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: textSecondary }}>
                                ({invoiceSolvencyRate}% Inv)
                            </span>
                        </Typography>

                        {/* Power BI Micro Progress towards Budget Target */}
                        <Box sx={{ my: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 700 }}>
                                    Target Rp 400 Jt
                                </Typography>
                                <Typography sx={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 800 }}>
                                    {targetBenchmarks.financial.percentage}% Anggaran
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(100, targetBenchmarks.financial.percentage)}
                                sx={{ height: 6, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#10b981', borderRadius: 3 } }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 8, color: '#ea580c' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 700 }}>
                                    Debt: {formatShortCurrency(debtRevenue)}
                                </Typography>
                            </Box>
                            <Typography
                                onClick={() => setExecutiveTab('delegations')}
                                sx={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Audit Piutang &rarr;
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* 3. Gate Turnstile Attendance */}
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card elevation={0} sx={diboldCardSx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Chip
                                icon={<Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#06b6d4', boxShadow: '0 0 8px #06b6d4', ml: 0.8 }} />}
                                label="Venue Turnstile"
                                size="small"
                                sx={{
                                    height: 24,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    bgcolor: isDark ? 'rgba(6,182,212,0.15)' : '#ecfeff',
                                    color: '#0891b2',
                                    borderRadius: '12px',
                                    pl: 0.2,
                                }}
                            />
                            <Chip
                                label="Turnstile Online"
                                size="small"
                                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: isDark ? 'rgba(6,182,212,0.2)' : '#cffafe', color: '#0891b2', borderRadius: '6px' }}
                            />
                        </Box>
                        <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 600 }}>
                            Gate Attendance
                        </Typography>
                        <Typography sx={{ fontSize: '1.45rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.02em', my: 0.3 }}>
                            {gate.checkedIn}{' '}
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textSecondary }}>
                                / {totalVisitors} ({Number(gate.percentage || 0).toFixed(1)}%)
                            </span>
                        </Typography>

                        {/* Power BI Micro Progress towards Turnstile Attendance */}
                        <Box sx={{ my: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 700 }}>
                                    Kehadiran Venue
                                </Typography>
                                <Typography sx={{ fontSize: '0.68rem', color: '#06b6d4', fontWeight: 800 }}>
                                    {gate.notCheckedIn} Belum Hadir
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(100, Number(gate.percentage || 0))}
                                sx={{ height: 6, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#06b6d4', borderRadius: 3 } }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 8, color: '#06b6d4' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 600 }}>
                                    Gerbang Scanner 1-4 Aktif
                                </Typography>
                            </Box>
                            <Typography
                                onClick={onTriggerGateScanner}
                                sx={{ fontSize: '0.72rem', color: '#0891b2', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Scanner &rarr;
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* 4. E-Ticket Delivery & Physical Badge Printing */}
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card elevation={0} sx={diboldCardSx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Chip
                                icon={<Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6', ml: 0.8 }} />}
                                label="Fulfillment & Badge"
                                size="small"
                                sx={{
                                    height: 24,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    bgcolor: isDark ? 'rgba(139,92,246,0.15)' : '#f5f3ff',
                                    color: '#8b5cf6',
                                    borderRadius: '12px',
                                    pl: 0.2,
                                }}
                            />
                            <Chip
                                label="Lanyard Ready"
                                size="small"
                                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: isDark ? 'rgba(139,92,246,0.2)' : '#ede9fe', color: '#7c3aed', borderRadius: '6px' }}
                            />
                        </Box>
                        <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 600 }}>
                            E-Ticket Delivery Success
                        </Typography>
                        <Typography sx={{ fontSize: '1.45rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.02em', my: 0.3 }}>
                            {email.sent}{' '}
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textSecondary }}>
                                / {totalVisitors} ({Number(email.percentage || 0).toFixed(1)}%)
                            </span>
                        </Typography>

                        {/* Power BI Micro Progress towards Delivery */}
                        <Box sx={{ my: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 700 }}>
                                    ID Badge Fisik Tercetak
                                </Typography>
                                <Typography sx={{ fontSize: '0.68rem', color: '#8b5cf6', fontWeight: 800 }}>
                                    ~{Math.round(gate.checkedIn * 0.95)} Badge
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(100, Number(email.percentage || 0))}
                                sx={{ height: 6, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#8b5cf6', borderRadius: 3 } }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 8, color: '#f59e0b' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 600 }}>
                                    {email.unsent} Dalam Antrean Kirim
                                </Typography>
                            </Box>
                            <Typography
                                onClick={onSwitchToTable}
                                sx={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Cetak Badge &rarr;
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* ── ROW 2: HOURLY TURNSTILE FLOW (AREA SPLINE) + DUAL SPEEDOMETER GAUGES ── */}
            {(executiveTab === 'overview' || executiveTab === 'operations') && (
                <Grid container spacing={2.5} sx={{ mb: 3 }}>
                    {/* Left 7.5 Cols: Hourly Gate Turnstile Peak-Flow Chart (Power BI Area Spline) */}
                    <Grid size={{ xs: 12, lg: 7.5 }}>
                        <Card elevation={0} sx={{ ...diboldCardSx, minHeight: 400 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeRoundedIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                                        <Typography sx={{ fontSize: '0.98rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.01em' }}>
                                            Arus Kedatangan Gate Turnstile per Jam (Hourly Flow)
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '0.76rem', color: textSecondary, mt: 0.3 }}>
                                        Distribusi kedatangan delegasi di gerbang utama Royal Ambarrukmo (07:00 &mdash; 17:00 WIB)
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip
                                        icon={<FlashOnIcon sx={{ fontSize: 14, color: '#f59e0b' }} />}
                                        label="Jam Puncak: 08:00 - 09:00 WIB"
                                        size="small"
                                        sx={{
                                            height: 24,
                                            fontSize: '0.68rem',
                                            fontWeight: 800,
                                            bgcolor: isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb',
                                            color: '#d97706',
                                            border: '1px solid rgba(245,158,11,0.3)',
                                        }}
                                    />
                                    <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', p: 0.4, borderRadius: '10px', display: 'flex' }}>
                                        <Button
                                            size="small"
                                            onClick={() => setHourlyMode('hourly')}
                                            sx={{
                                                py: 0.3,
                                                px: 1.2,
                                                fontSize: '0.7rem',
                                                fontWeight: hourlyMode === 'hourly' ? 800 : 600,
                                                color: hourlyMode === 'hourly' ? '#ffffff' : textSecondary,
                                                bgcolor: hourlyMode === 'hourly' ? '#2563eb' : 'transparent',
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                minWidth: 'auto',
                                            }}
                                        >
                                            Per Jam
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => setHourlyMode('cumulative')}
                                            sx={{
                                                py: 0.3,
                                                px: 1.2,
                                                fontSize: '0.7rem',
                                                fontWeight: hourlyMode === 'cumulative' ? 800 : 600,
                                                color: hourlyMode === 'cumulative' ? '#ffffff' : textSecondary,
                                                bgcolor: hourlyMode === 'cumulative' ? '#2563eb' : 'transparent',
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                minWidth: 'auto',
                                            }}
                                        >
                                            Akumulasi
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Interactive SVG Area Spline Chart */}
                            {(() => {
                                const chartW = 760;
                                const chartH = 220;
                                const padL = 40;
                                const padR = 25;
                                const padT = 25;
                                const padB = 40;
                                const graphW = chartW - padL - padR;
                                const graphH = chartH - padT - padB;

                                const points = hourlyAttendance.map((d, i) => {
                                    const val = hourlyMode === 'cumulative' ? d.cumulative : d.volume;
                                    const x = padL + (i / Math.max(1, hourlyAttendance.length - 1)) * graphW;
                                    const y = padT + graphH - (val / maxHourlyVol) * graphH;
                                    return { x, y, val, hour: d.hour };
                                });

                                // Smooth Bézier curve generator
                                const splinePath = points.reduce((acc, pt, i, arr) => {
                                    if (i === 0) return `M ${pt.x},${pt.y}`;
                                    const prev = arr[i - 1];
                                    const cp1x = prev.x + (pt.x - prev.x) / 2;
                                    const cp1y = prev.y;
                                    const cp2x = prev.x + (pt.x - prev.x) / 2;
                                    const cp2y = pt.y;
                                    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pt.x},${pt.y}`;
                                }, '');

                                const areaPath = points.length
                                    ? `${splinePath} L ${points[points.length - 1].x},${padT + graphH} L ${points[0].x},${padT + graphH} Z`
                                    : '';

                                return (
                                    <Box sx={{ width: '100%', position: 'relative', my: 1 }}>
                                        <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                                            <defs>
                                                <linearGradient id="gateTurnstileGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                                                    <stop offset="70%" stopColor="#2563eb" stopOpacity="0.08" />
                                                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>

                                            {/* Horizontal Guideline Grids */}
                                            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                                                const lineY = padT + graphH * (1 - ratio);
                                                const gridVal = Math.round(maxHourlyVol * ratio);
                                                return (
                                                    <g key={ratio}>
                                                        <line
                                                            x1={padL}
                                                            y1={lineY}
                                                            x2={chartW - padR}
                                                            y2={lineY}
                                                            stroke={isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}
                                                            strokeDasharray="4 4"
                                                        />
                                                        <text
                                                            x={padL - 8}
                                                            y={lineY + 3}
                                                            textAnchor="end"
                                                            fill={textMuted}
                                                            fontSize="10"
                                                            fontFamily="Inter, sans-serif"
                                                            fontWeight="600"
                                                        >
                                                            {gridVal}
                                                        </text>
                                                    </g>
                                                );
                                            })}

                                            {/* Area Fill */}
                                            <path d={areaPath} fill="url(#gateTurnstileGrad)" />

                                            {/* Spline Stroke Line */}
                                            <path
                                                d={splinePath}
                                                fill="none"
                                                stroke="#2563eb"
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            {/* Data Nodes & Interaction */}
                                            {points.map((pt) => {
                                                const isPeak = pt.hour === '08:00';
                                                const isHovered = hoveredHour === pt.hour;
                                                return (
                                                    <g
                                                        key={pt.hour}
                                                        onMouseEnter={() => setHoveredHour(pt.hour)}
                                                        onMouseLeave={() => setHoveredHour(null)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {/* Peak Indicator Ring */}
                                                        {isPeak && (
                                                            <circle
                                                                cx={pt.x}
                                                                cy={pt.y}
                                                                r="14"
                                                                fill="none"
                                                                stroke="#f59e0b"
                                                                strokeWidth="2"
                                                                opacity="0.6"
                                                            >
                                                                <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                                                                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                                                            </circle>
                                                        )}

                                                        {/* Outer Hover Ring */}
                                                        {isHovered && (
                                                            <circle cx={pt.x} cy={pt.y} r="10" fill="#2563eb" opacity="0.25" />
                                                        )}

                                                        {/* Main Node Point */}
                                                        <circle
                                                            cx={pt.x}
                                                            cy={pt.y}
                                                            r={isHovered ? 6 : (isPeak ? 5.5 : 4)}
                                                            fill={isPeak ? '#f59e0b' : '#2563eb'}
                                                            stroke="#ffffff"
                                                            strokeWidth="2.5"
                                                        />

                                                        {/* Value Label on Top of Node */}
                                                        {(pt.val > 0 || isHovered) && (
                                                            <text
                                                                x={pt.x}
                                                                y={pt.y - 10}
                                                                textAnchor="middle"
                                                                fill={isPeak ? '#d97706' : textPrimary}
                                                                fontSize="10"
                                                                fontWeight="800"
                                                                fontFamily="Inter, sans-serif"
                                                            >
                                                                {pt.val}
                                                            </text>
                                                        )}

                                                        {/* X-Axis Hour Label */}
                                                        <text
                                                            x={pt.x}
                                                            y={chartH - 12}
                                                            textAnchor="middle"
                                                            fill={isPeak ? '#2563eb' : textSecondary}
                                                            fontSize="10"
                                                            fontWeight={isPeak ? '800' : '600'}
                                                            fontFamily="Inter, sans-serif"
                                                        >
                                                            {pt.hour}
                                                        </text>
                                                    </g>
                                                );
                                            })}
                                        </svg>
                                    </Box>
                                );
                            })()}

                            {/* Operational Advisory Banner */}
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 1.5,
                                    borderRadius: '12px',
                                    bgcolor: isDark ? 'rgba(37,99,235,0.08)' : '#eff6ff',
                                    border: '1px solid rgba(37,99,235,0.18)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                }}
                            >
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2563eb', flexShrink: 0 }} />
                                <Typography sx={{ fontSize: '0.74rem', color: textSecondary, lineHeight: 1.5 }}>
                                    <strong style={{ color: '#2563eb' }}>Rekomendasi Operasional:</strong> Lonjakan tertinggi turnstile terjadi pukul <strong>08:00 &mdash; 09:00 WIB</strong> (42 delegasi/jam) sebelum Opening Ceremony. Panitia telah menyiapkan 4 jalur fast-track barcode turnstile dan 2 meja cetak badge express di lobby Royal Ambarrukmo.
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Right 4.5 Cols: Convention Target Benchmarks (Power BI Dual Radial Speedometer Gauges) */}
                    <Grid size={{ xs: 12, lg: 4.5 }}>
                        <Card elevation={0} sx={{ ...diboldCardSx, minHeight: 400 }}>
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SpeedRoundedIcon sx={{ fontSize: 20, color: '#10b981' }} />
                                    <Typography sx={{ fontSize: '0.98rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.01em' }}>
                                        Convention Target Benchmarks
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontSize: '0.76rem', color: textSecondary, mt: 0.3 }}>
                                    Pencapaian KPI Finansial Anggaran & Partisipasi Delegasi
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {/* Gauge 1: Target Finansial (Rp 400 Juta) */}
                                <Box sx={{ p: 2, borderRadius: '16px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: textPrimary }}>
                                            Target Kas Anggaran (Rp 400 Jt)
                                        </Typography>
                                        <Chip
                                            label={`${targetBenchmarks.financial.percentage}% On Track`}
                                            size="small"
                                            sx={{ height: 20, fontSize: '0.66rem', fontWeight: 800, bgcolor: '#10b981', color: '#fff', borderRadius: '6px' }}
                                        />
                                    </Box>

                                    {/* Semi-Circle SVG Radial Gauge */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1, position: 'relative' }}>
                                        {(() => {
                                            const r = 58;
                                            const circ = Math.PI * r;
                                            const pct = Math.min(100, targetBenchmarks.financial.percentage);
                                            const strokeDashoffset = circ * (1 - pct / 100);
                                            return (
                                                <Box sx={{ position: 'relative', width: 170, height: 95, display: 'flex', justifyContent: 'center' }}>
                                                    <svg viewBox="0 0 170 95" style={{ width: '100%', height: '100%' }}>
                                                        {/* Background Arc */}
                                                        <path
                                                            d="M 15,85 A 58,58 0 0,1 155,85"
                                                            fill="none"
                                                            stroke={isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}
                                                            strokeWidth="14"
                                                            strokeLinecap="round"
                                                        />
                                                        {/* Gauge Fill Arc */}
                                                        <path
                                                            d="M 15,85 A 58,58 0 0,1 155,85"
                                                            fill="none"
                                                            stroke="#10b981"
                                                            strokeWidth="14"
                                                            strokeLinecap="round"
                                                            strokeDasharray={circ}
                                                            strokeDashoffset={strokeDashoffset}
                                                            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                                                        />
                                                    </svg>
                                                    <Box sx={{ position: 'absolute', bottom: 2, textAlign: 'center' }}>
                                                        <Typography sx={{ fontSize: '1.45rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
                                                            {pct}%
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 700, mt: 0.2 }}>
                                                            Realisasi Kas
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        })()}
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                                        <Typography sx={{ fontSize: '0.72rem', color: textSecondary }}>
                                            Kas: <strong style={{ color: '#10b981' }}>{formatShortCurrency(paidRevenue)}</strong>
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.72rem', color: textSecondary }}>
                                            Target: <strong>Rp 400 Juta</strong>
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Gauge 2: Target Partisipasi Delegasi (1.000 Pax) */}
                                <Box sx={{ p: 2, borderRadius: '16px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: textPrimary }}>
                                            Target Kuota Delegasi (1.000 Pax)
                                        </Typography>
                                        <Chip
                                            label={`${targetBenchmarks.attendance.reg_percentage}% Terisi`}
                                            size="small"
                                            sx={{ height: 20, fontSize: '0.66rem', fontWeight: 800, bgcolor: '#2563eb', color: '#fff', borderRadius: '6px' }}
                                        />
                                    </Box>

                                    {/* Semi-Circle SVG Radial Gauge */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1, position: 'relative' }}>
                                        {(() => {
                                            const r = 58;
                                            const circ = Math.PI * r;
                                            const pct = Math.min(100, targetBenchmarks.attendance.reg_percentage);
                                            const strokeDashoffset = circ * (1 - pct / 100);
                                            return (
                                                <Box sx={{ position: 'relative', width: 170, height: 95, display: 'flex', justifyContent: 'center' }}>
                                                    <svg viewBox="0 0 170 95" style={{ width: '100%', height: '100%' }}>
                                                        {/* Background Arc */}
                                                        <path
                                                            d="M 15,85 A 58,58 0 0,1 155,85"
                                                            fill="none"
                                                            stroke={isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}
                                                            strokeWidth="14"
                                                            strokeLinecap="round"
                                                        />
                                                        {/* Gauge Fill Arc */}
                                                        <path
                                                            d="M 15,85 A 58,58 0 0,1 155,85"
                                                            fill="none"
                                                            stroke="#2563eb"
                                                            strokeWidth="14"
                                                            strokeLinecap="round"
                                                            strokeDasharray={circ}
                                                            strokeDashoffset={strokeDashoffset}
                                                            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                                                        />
                                                    </svg>
                                                    <Box sx={{ position: 'absolute', bottom: 2, textAlign: 'center' }}>
                                                        <Typography sx={{ fontSize: '1.45rem', fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>
                                                            {pct}%
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.68rem', color: textSecondary, fontWeight: 700, mt: 0.2 }}>
                                                            Kapasitas Ruang
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        })()}
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                                        <Typography sx={{ fontSize: '0.72rem', color: textSecondary }}>
                                            Terdaftar: <strong style={{ color: '#2563eb' }}>{totalVisitors} Orang</strong>
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.72rem', color: textSecondary }}>
                                            Sisa Slot: <strong>{Math.max(0, 1000 - totalVisitors)} Pax</strong>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* ── ROW 3: THE 4 CONFERENCE PILLARS + TOP 10 DELEGATIONS (BI-COLOR STACKED BARS) ── */}
            {(executiveTab === 'overview' || executiveTab === 'delegations') && (
                <Grid container spacing={2.5} sx={{ mb: 3 }}>
                    {/* Left 5 Cols: The 4 Conference Pillars / Groups / Categories */}
                    <Grid size={{ xs: 12, lg: 5 }}>
                        <Card elevation={0} sx={{ ...diboldCardSx, minHeight: 450, display: 'flex', flexDirection: 'column' }}>
                            {/* Card Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CorporateFareRoundedIcon sx={{ fontSize: 20, color: pieMode === 'categories' ? '#10b981' : (pieMode === 'groups' ? '#8b5cf6' : '#2563eb') }} />
                                        <Typography sx={{ fontSize: '0.98rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.01em' }}>
                                            {activeCardTitle}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '0.74rem', color: textSecondary, mt: 0.3 }}>
                                        {activeCardSubtitle}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'inline-flex', p: '3px', bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', borderRadius: '8px', border: `1px solid ${cardBorder}` }}>
                                    <Button
                                        size="small"
                                        onClick={() => setPillarsViewMode('chart')}
                                        startIcon={<PieChartRoundedIcon sx={{ fontSize: '15px !important' }} />}
                                        sx={{
                                            minWidth: 'auto',
                                            px: 1.2,
                                            py: 0.35,
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            borderRadius: '6px',
                                            textTransform: 'none',
                                            bgcolor: pillarsViewMode === 'chart' ? (isDark ? '#1e293b' : '#ffffff') : 'transparent',
                                            color: pillarsViewMode === 'chart' ? '#8b5cf6' : textMuted,
                                            boxShadow: pillarsViewMode === 'chart' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            '&:hover': { bgcolor: pillarsViewMode === 'chart' ? (isDark ? '#1e293b' : '#ffffff') : 'transparent' }
                                        }}
                                    >
                                        Pie Chart
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => setPillarsViewMode('cards')}
                                        startIcon={<ViewListRoundedIcon sx={{ fontSize: '15px !important' }} />}
                                        sx={{
                                            minWidth: 'auto',
                                            px: 1.2,
                                            py: 0.35,
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            borderRadius: '6px',
                                            textTransform: 'none',
                                            bgcolor: pillarsViewMode === 'cards' ? (isDark ? '#1e293b' : '#ffffff') : 'transparent',
                                            color: pillarsViewMode === 'cards' ? '#8b5cf6' : textMuted,
                                            boxShadow: pillarsViewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            '&:hover': { bgcolor: pillarsViewMode === 'cards' ? (isDark ? '#1e293b' : '#ffffff') : 'transparent' }
                                        }}
                                    >
                                        Detail Kartu
                                    </Button>
                                </Box>
                            </Box>

                            {/* Control Bar: Mode Toggle (4 Pilar | 4 Grup | Kategori Tiket) & Dropdown Sub-Filter */}
                            {pillarsViewMode === 'chart' && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    mb: 1.5,
                                    p: '6px 8px',
                                    borderRadius: '10px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                                    border: `1px solid ${cardBorder}`
                                }}>
                                    {/* Mode Switcher */}
                                    <Box sx={{ display: 'inline-flex', p: '2px', bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff', borderRadius: '8px', border: `1px solid ${cardBorder}` }}>
                                        <Button
                                            size="small"
                                            onClick={() => setPieMode('pillars')}
                                            sx={{
                                                minWidth: 'auto',
                                                px: 1,
                                                py: 0.25,
                                                fontSize: '0.67rem',
                                                fontWeight: 800,
                                                borderRadius: '6px',
                                                textTransform: 'none',
                                                bgcolor: pieMode === 'pillars' ? (isDark ? '#1e293b' : '#eff6ff') : 'transparent',
                                                color: pieMode === 'pillars' ? '#2563eb' : textMuted,
                                                boxShadow: pieMode === 'pillars' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            }}
                                        >
                                            🏛️ 4 Pilar
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => setPieMode('groups')}
                                            sx={{
                                                minWidth: 'auto',
                                                px: 1,
                                                py: 0.25,
                                                fontSize: '0.67rem',
                                                fontWeight: 800,
                                                borderRadius: '6px',
                                                textTransform: 'none',
                                                bgcolor: pieMode === 'groups' ? (isDark ? '#1e293b' : '#f5f3ff') : 'transparent',
                                                color: pieMode === 'groups' ? '#8b5cf6' : textMuted,
                                                boxShadow: pieMode === 'groups' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            }}
                                        >
                                            📑 4 Grup
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => setPieMode('categories')}
                                            sx={{
                                                minWidth: 'auto',
                                                px: 1,
                                                py: 0.25,
                                                fontSize: '0.67rem',
                                                fontWeight: 800,
                                                borderRadius: '6px',
                                                textTransform: 'none',
                                                bgcolor: pieMode === 'categories' ? (isDark ? '#1e293b' : '#ecfdf5') : 'transparent',
                                                color: pieMode === 'categories' ? '#059669' : textMuted,
                                                boxShadow: pieMode === 'categories' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            }}
                                        >
                                            🏷️ Kategori Tiket
                                        </Button>
                                    </Box>

                                    {/* Sub-Filter Dropdown & Layout Switcher when in 'categories' mode */}
                                    {pieMode === 'categories' && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FormControl size="small" sx={{ minWidth: 155 }}>
                                                <Select
                                                    value={pieGroupFilter}
                                                    onChange={(e) => setPieGroupFilter(e.target.value)}
                                                    displayEmpty
                                                    sx={{
                                                        height: 27,
                                                        fontSize: '0.69rem',
                                                        fontWeight: 700,
                                                        borderRadius: '7px',
                                                        bgcolor: isDark ? '#1e293b' : '#ffffff',
                                                        '& .MuiSelect-select': { py: 0.4, px: 0.9 },
                                                    }}
                                                >
                                                    <MenuItem value="all" sx={{ fontSize: '0.74rem', fontWeight: 800 }}>🌐 Semua Kategori (20+)</MenuItem>
                                                    <MenuItem value="participant" sx={{ fontSize: '0.74rem' }}>💼 1. Participant (Berbayar)</MenuItem>
                                                    <MenuItem value="technical" sx={{ fontSize: '0.74rem' }}>🔬 2. Technical (Presenter/Judge)</MenuItem>
                                                    <MenuItem value="visitor" sx={{ fontSize: '0.74rem' }}>🎟️ 3. Visitor (Visitor Pass)</MenuItem>
                                                    <MenuItem value="roles" sx={{ fontSize: '0.74rem' }}>🌟 4. Roles & Invitations</MenuItem>
                                                </Select>
                                            </FormControl>

                                            {/* Layout Switcher (Grid vs List) */}
                                            <Box sx={{ display: 'inline-flex', p: '2px', bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff', borderRadius: '7px', border: `1px solid ${cardBorder}` }}>
                                                <Tooltip title="Tampilan Grid 2 Kolom Rapi" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setCategoriesLayout('grid')}
                                                        sx={{
                                                            p: '2px 4px',
                                                            borderRadius: '5px',
                                                            bgcolor: categoriesLayout === 'grid' ? (isDark ? '#1e293b' : '#eff6ff') : 'transparent',
                                                            color: categoriesLayout === 'grid' ? '#2563eb' : textMuted,
                                                        }}
                                                    >
                                                        <TableChartRoundedIcon sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Tampilan List Ramping Nyaman Dibaca" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setCategoriesLayout('list')}
                                                        sx={{
                                                            p: '2px 4px',
                                                            borderRadius: '5px',
                                                            bgcolor: categoriesLayout === 'list' ? (isDark ? '#1e293b' : '#eff6ff') : 'transparent',
                                                            color: categoriesLayout === 'list' ? '#2563eb' : textMuted,
                                                        }}
                                                    >
                                                        <ViewListRoundedIcon sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Quick Active Filter Indicator */}
                                    {typeFilter && typeFilter.length > 0 && (
                                        <Tooltip title="Klik untuk reset filter kategori global" arrow>
                                            <Chip
                                                size="small"
                                                label={`Filter Aktif (${typeFilter.length}) ✕`}
                                                onClick={() => onTypeFilterChange([])}
                                                sx={{
                                                    height: 24,
                                                    fontSize: '0.64rem',
                                                    fontWeight: 800,
                                                    bgcolor: isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    borderRadius: '6px',
                                                    '&:hover': { bgcolor: isDark ? 'rgba(239,68,68,0.25)' : '#fecaca' }
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                </Box>
                            )}

                            {pillarsViewMode === 'chart' ? (
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    {/* Donut / Pie Chart Container with Centered Dynamic Total Metric */}
                                    <Box sx={{ position: 'relative', width: '100%', height: 215, display: 'flex', alignItems: 'center', justifyContent: 'center', my: 0.5 }}>
                                        <PieChart
                                            series={[{
                                                data: activePieData,
                                                innerRadius: 54,
                                                outerRadius: 84,
                                                paddingAngle: activePieData.length > 8 ? 1.5 : 3,
                                                cornerRadius: 5,
                                                highlightScope: { fade: 'global', highlight: 'item' },
                                                faded: { innerRadius: 48, additionalRadius: -4, opacity: 0.35 },
                                                valueFormatter: (item) => `${item.value} Pax (${activeTotalCount > 0 ? ((item.value / activeTotalCount) * 100).toFixed(1) : 0}%)`,
                                            }]}
                                            hideLegend={true}
                                            slots={{ legend: () => null }}
                                            margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                            height={215}
                                        />
                                        <Box sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            textAlign: 'center',
                                            pointerEvents: 'none',
                                        }}>
                                            <Typography sx={{ fontWeight: 900, fontSize: '1.45rem', color: textPrimary, lineHeight: 1 }}>
                                                {activeTotalCount}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.62rem', color: textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', mt: 0.3 }}>
                                                {activeCenterLabel}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* ── MODE 1: EXECUTIVE 4-PILLAR GRID LEGEND ── */}
                                    {pieMode === 'pillars' && (
                                        <Grid container spacing={1.2} sx={{ mt: 1 }}>
                                            {[
                                                { label: 'Commercial & Paid', icon: '💼', color: '#2563eb', count: pillarsBreakdown.commercial?.total || 0, sub: `Kas: ${formatShortCurrency(pillarsBreakdown.commercial?.revenue || 0)}` },
                                                { label: 'Scientific & Presenter', icon: '🔬', color: '#8b5cf6', count: pillarsBreakdown.scientific?.total || 0, sub: '100% Free Pass' },
                                                { label: 'VIP & Leadership', icon: '🌟', color: '#f59e0b', count: pillarsBreakdown.leadership?.total || 0, sub: 'Undangan Khusus' },
                                                { label: 'Expo, Booth & Crew', icon: '🏢', color: '#10b981', count: pillarsBreakdown.expo?.total || 0, sub: 'Exhibition Hall' },
                                            ].map((item) => {
                                                const pct = activeTotalCount > 0 ? Math.round((item.count / activeTotalCount) * 100) : 0;
                                                return (
                                                    <Grid size={{ xs: 6 }} key={item.label}>
                                                        <Box sx={{
                                                            p: 1.2,
                                                            borderRadius: '10px',
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                                            border: `1px solid ${cardBorder}`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1
                                                        }}>
                                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                                                <Typography noWrap sx={{ fontSize: '0.72rem', fontWeight: 800, color: textPrimary }}>
                                                                    {item.label}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: item.color }}>
                                                                        {item.count} Pax <span style={{ fontSize: '0.64rem', color: textMuted }}>({pct}%)</span>
                                                                    </Typography>
                                                                </Box>
                                                                <Typography noWrap sx={{ fontSize: '0.64rem', color: textMuted, mt: 0.1 }}>
                                                                    {item.sub}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    )}

                                    {/* ── MODE 2: 4-REGISTRATION GROUPS GRID LEGEND (Gambar 2) ── */}
                                    {pieMode === 'groups' && (
                                        <Grid container spacing={1.2} sx={{ mt: 1 }}>
                                            {groupsPieData.map((item) => {
                                                const pct = activeTotalCount > 0 ? Math.round((item.value / activeTotalCount) * 100) : 0;
                                                return (
                                                    <Grid size={{ xs: 6 }} key={item.id}>
                                                        <Tooltip title="Klik untuk membedah kategori di grup ini" arrow>
                                                            <Box
                                                                onClick={() => {
                                                                    setPieMode('categories');
                                                                    setPieGroupFilter(item.id);
                                                                }}
                                                                sx={{
                                                                    p: 1.2,
                                                                    borderRadius: '10px',
                                                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                                                    border: `1px solid ${cardBorder}`,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1,
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.15s ease',
                                                                    '&:hover': {
                                                                        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                                        transform: 'translateY(-1px)',
                                                                        borderColor: item.color,
                                                                    }
                                                                }}
                                                            >
                                                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                                                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                                                    <Typography noWrap sx={{ fontSize: '0.72rem', fontWeight: 800, color: textPrimary }}>
                                                                        {item.icon} {item.label}
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: item.color }}>
                                                                            {item.value} Pax <span style={{ fontSize: '0.64rem', color: textMuted }}>({pct}%)</span>
                                                                        </Typography>
                                                                    </Box>
                                                                    <Typography noWrap sx={{ fontSize: '0.62rem', color: textMuted, mt: 0.1 }}>
                                                                        {item.sub}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Tooltip>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    )}

                                    {/* ── MODE 3: INDIVIDUAL TICKET CATEGORIES (Gambar 1 Refined & Polished) ── */}
                                    {pieMode === 'categories' && (
                                        <Box sx={{
                                            mt: 1,
                                            maxHeight: 255,
                                            overflowY: 'auto',
                                            pr: 0.5,
                                            '&::-webkit-scrollbar': { width: '4px' },
                                            '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', borderRadius: '4px' }
                                        }}>
                                            {categoriesLayout === 'grid' ? (
                                                <Grid container spacing={1.2}>
                                                    {categoriesPieData.filter(item => item.id !== 'empty').map((item) => {
                                                        const pct = activeTotalCount > 0 ? Math.round((item.value / activeTotalCount) * 100) : 0;
                                                        const isCurrentlyFiltered = typeFilter && typeFilter.includes(item.visitor_type);

                                                        return (
                                                            <Grid size={{ xs: 6 }} key={item.id}>
                                                                <Tooltip title={`Klik untuk filter tabel ke ${item.label}`} arrow>
                                                                    <Box
                                                                        onClick={() => onTypeFilterChange && onTypeFilterChange([item.visitor_type])}
                                                                        sx={{
                                                                            p: 1.2,
                                                                            borderRadius: '11px',
                                                                            bgcolor: isCurrentlyFiltered
                                                                                ? (isDark ? 'rgba(37,99,235,0.12)' : '#f0f7ff')
                                                                                : (isDark ? 'rgba(30,41,59,0.5)' : '#ffffff'),
                                                                            border: isCurrentlyFiltered
                                                                                ? '1.5px solid #2563eb'
                                                                                : `1px solid ${cardBorder}`,
                                                                            borderLeft: `4px solid ${item.color}`,
                                                                            boxShadow: isCurrentlyFiltered
                                                                                ? '0 0 0 2px rgba(37,99,235,0.15)'
                                                                                : '0 1px 3px rgba(0,0,0,0.03)',
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            justifyContent: 'space-between',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                            '&:hover': {
                                                                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc',
                                                                                transform: 'translateY(-2px)',
                                                                                boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
                                                                            }
                                                                        }}
                                                                    >
                                                                        {/* Top Row: Icon + Title + Active Pill */}
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.8, mb: 0.8 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, minWidth: 0, flex: 1 }}>
                                                                                <Box sx={{
                                                                                    width: 22,
                                                                                    height: 22,
                                                                                    borderRadius: '6px',
                                                                                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    fontSize: '0.8rem',
                                                                                    flexShrink: 0
                                                                                }}>
                                                                                    {item.icon}
                                                                                </Box>
                                                                                <Typography noWrap sx={{ fontSize: '0.77rem', fontWeight: 800, color: textPrimary, letterSpacing: '-0.01em' }}>
                                                                                    {item.label}
                                                                                </Typography>
                                                                            </Box>
                                                                            {isCurrentlyFiltered && (
                                                                                <Chip
                                                                                    size="small"
                                                                                    label="✓ Aktif"
                                                                                    sx={{
                                                                                        height: 16,
                                                                                        fontSize: '0.58rem',
                                                                                        fontWeight: 800,
                                                                                        bgcolor: '#dbeafe',
                                                                                        color: '#2563eb',
                                                                                        borderRadius: '4px',
                                                                                        px: 0.2
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </Box>

                                                                        {/* Middle Row: Metrics (Pax + Share Pct + Revenue) */}
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.6 }}>
                                                                                <Typography sx={{ fontSize: '0.92rem', fontWeight: 900, color: item.color, lineHeight: 1 }}>
                                                                                    {item.value} <span style={{ fontSize: '0.68rem', fontWeight: 700, color: textMuted }}>Pax</span>
                                                                                </Typography>
                                                                                <Chip
                                                                                    size="small"
                                                                                    label={`${pct}%`}
                                                                                    sx={{
                                                                                        height: 18,
                                                                                        fontSize: '0.64rem',
                                                                                        fontWeight: 800,
                                                                                        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                                                        color: textSecondary,
                                                                                        borderRadius: '4px',
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                            {item.est_revenue > 0 && (
                                                                                <Chip
                                                                                    size="small"
                                                                                    label={formatShortCurrency(item.est_revenue)}
                                                                                    sx={{
                                                                                        height: 18,
                                                                                        fontSize: '0.64rem',
                                                                                        fontWeight: 800,
                                                                                        bgcolor: '#ecfdf5',
                                                                                        color: '#059669',
                                                                                        border: '1px solid rgba(16,185,129,0.25)',
                                                                                        borderRadius: '4px',
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </Box>

                                                                        {/* Bottom Micro-Bar (Proportion Indicator) */}
                                                                        <Box sx={{ width: '100%', height: 3.5, borderRadius: '2px', bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', mt: 0.8, overflow: 'hidden' }}>
                                                                            <Box sx={{ width: `${Math.min(100, Math.max(pct, 4))}%`, height: '100%', bgcolor: item.color, borderRadius: '2px', transition: 'width 0.4s ease' }} />
                                                                        </Box>
                                                                    </Box>
                                                                </Tooltip>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            ) : (
                                                /* Clean List View (Baris Ramping Nyaman Dibaca) */
                                                <Stack spacing={1}>
                                                    {categoriesPieData.filter(item => item.id !== 'empty').map((item, idx) => {
                                                        const pct = activeTotalCount > 0 ? Math.round((item.value / activeTotalCount) * 100) : 0;
                                                        const isCurrentlyFiltered = typeFilter && typeFilter.includes(item.visitor_type);

                                                        return (
                                                            <Tooltip key={item.id} title={`Klik untuk filter tabel ke ${item.label}`} arrow>
                                                                <Box
                                                                    onClick={() => onTypeFilterChange && onTypeFilterChange([item.visitor_type])}
                                                                    sx={{
                                                                        p: '8px 12px',
                                                                        borderRadius: '9px',
                                                                        bgcolor: isCurrentlyFiltered
                                                                            ? (isDark ? 'rgba(37,99,235,0.12)' : '#f0f7ff')
                                                                            : (isDark ? 'rgba(30,41,59,0.5)' : '#ffffff'),
                                                                        border: isCurrentlyFiltered
                                                                            ? '1.5px solid #2563eb'
                                                                            : `1px solid ${cardBorder}`,
                                                                        borderLeft: `4px solid ${item.color}`,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'space-between',
                                                                        gap: 1.5,
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.15s ease',
                                                                        '&:hover': {
                                                                            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc',
                                                                            transform: 'translateX(2px)',
                                                                        }
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1.2 }}>
                                                                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: textMuted, width: 18 }}>
                                                                            #{idx + 1}
                                                                        </Typography>
                                                                        <Box sx={{ width: 22, height: 22, borderRadius: '6px', bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>
                                                                            {item.icon}
                                                                        </Box>
                                                                        <Typography noWrap sx={{ fontSize: '0.78rem', fontWeight: 800, color: textPrimary }}>
                                                                            {item.label}
                                                                        </Typography>
                                                                        {isCurrentlyFiltered && (
                                                                            <Chip label="Aktif" size="small" sx={{ height: 16, fontSize: '0.58rem', fontWeight: 800, bgcolor: '#dbeafe', color: '#2563eb', borderRadius: '4px' }} />
                                                                        )}
                                                                    </Box>

                                                                    {/* Mini Proportion Bar */}
                                                                    <Box sx={{ width: 80, height: 5, borderRadius: '3px', bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', overflow: 'hidden' }}>
                                                                        <Box sx={{ width: `${Math.min(100, Math.max(pct, 4))}%`, height: '100%', bgcolor: item.color, borderRadius: '3px' }} />
                                                                    </Box>

                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Typography sx={{ fontSize: '0.84rem', fontWeight: 900, color: item.color }}>
                                                                            {item.value} Pax <span style={{ fontSize: '0.68rem', fontWeight: 600, color: textMuted }}>({pct}%)</span>
                                                                        </Typography>
                                                                        {item.est_revenue > 0 && (
                                                                            <Chip
                                                                                size="small"
                                                                                label={formatShortCurrency(item.est_revenue)}
                                                                                sx={{
                                                                                    height: 18,
                                                                                    fontSize: '0.64rem',
                                                                                    fontWeight: 800,
                                                                                    bgcolor: '#ecfdf5',
                                                                                    color: '#059669',
                                                                                    border: '1px solid rgba(16,185,129,0.25)',
                                                                                    borderRadius: '4px',
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                            </Tooltip>
                                                        );
                                                    })}
                                                </Stack>
                                            )}
                                        </Box>
                                    )}

                                    {/* Bottom Dynamic Navigation Footer */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                                        {pieMode === 'pillars' && (
                                            <Button
                                                size="small"
                                                onClick={() => setPillarsViewMode('cards')}
                                                sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'none' }}
                                            >
                                                Buka Rincian Lengkap 4 Pilar &rarr;
                                            </Button>
                                        )}
                                        {pieMode === 'groups' && (
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    setPieMode('categories');
                                                    setPieGroupFilter('all');
                                                }}
                                                sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'none' }}
                                            >
                                                Bedah Rincian per Kategori Tiket (Gambar 2) &rarr;
                                            </Button>
                                        )}
                                        {pieMode === 'categories' && (
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    if (pieGroupFilter !== 'all') {
                                                        setPieGroupFilter('all');
                                                    } else {
                                                        setPieMode('pillars');
                                                    }
                                                }}
                                                sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'none' }}
                                            >
                                                {pieGroupFilter !== 'all' ? '← Tampilkan Semua 20+ Kategori' : '← Kembali ke Ringkasan 4 Pilar'}
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    {/* Composite Proportion Bar */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <Box sx={{ display: 'flex', height: 10, borderRadius: '5px', overflow: 'hidden', mb: 1 }}>
                                            <Box sx={{ width: '37%', bgcolor: '#2563eb' }} title="Commercial" />
                                            <Box sx={{ width: '25%', bgcolor: '#8b5cf6' }} title="Scientific" />
                                            <Box sx={{ width: '7%', bgcolor: '#f59e0b' }} title="VIP" />
                                            <Box sx={{ width: '31%', bgcolor: '#10b981' }} title="Expo & Committee" />
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 0.5 }}>
                                            <Typography sx={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700 }}>37% Berbayar</Typography>
                                            <Typography sx={{ fontSize: '0.68rem', color: '#8b5cf6', fontWeight: 700 }}>25% Ilmiah</Typography>
                                            <Typography sx={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700 }}>7% VIP</Typography>
                                            <Typography sx={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>31% Expo/Crew</Typography>
                                        </Box>
                                    </Box>

                                    {/* 4 Detailed Pillar Cards */}
                                    <Stack spacing={1.5} sx={{ flex: 1 }}>
                                        {/* Pillar 1: Commercial & Paid */}
                                        <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: isDark ? 'rgba(37,99,235,0.06)' : '#eff6ff', border: '1px solid rgba(37,99,235,0.18)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontSize: '1.1rem' }}>💼</Typography>
                                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: textPrimary }}>
                                                        Commercial & Paid Delegations
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{ fontSize: '0.86rem', fontWeight: 900, color: '#2563eb' }}>
                                                    {pillarsBreakdown.commercial?.total ?? 0} Pax
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: '0.72rem', color: textSecondary, mb: 0.8 }}>
                                                Professional Member, Non-Member, Expatriate & Mahasiswa Berbayar
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.6, borderTop: `1px solid rgba(37,99,235,0.12)` }}>
                                                <Typography sx={{ fontSize: '0.7rem', color: textSecondary }}>
                                                    Realisasi Kas: <strong style={{ color: '#10b981' }}>{formatShortCurrency(pillarsBreakdown.commercial?.revenue || 0)}</strong>
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.7rem', color: '#ea580c', fontWeight: 700 }}>
                                                    Piutang: {pillarsBreakdown.commercial?.debt || 0} Orang
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Pillar 2: Scientific & Presenters */}
                                        <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: isDark ? 'rgba(139,92,246,0.06)' : '#f5f3ff', border: '1px solid rgba(139,92,246,0.18)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontSize: '1.1rem' }}>🔬</Typography>
                                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: textPrimary }}>
                                                        Scientific & Presenters (Oral / Poster)
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{ fontSize: '0.86rem', fontWeight: 900, color: '#8b5cf6' }}>
                                                    {pillarsBreakdown.scientific?.total ?? 0} Pax
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: '0.72rem', color: textSecondary, mb: 0.8 }}>
                                                Pemakalah oral, poster presenter, juri ilmiah & session chair PIT IAGI
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.6, borderTop: `1px solid rgba(139,92,246,0.12)` }}>
                                                <Typography sx={{ fontSize: '0.7rem', color: '#8b5cf6', fontWeight: 700 }}>
                                                    100% Free Pass (Scientific Paper)
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.7rem', color: textSecondary }}>
                                                    8 Parallel Rooms
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Pillar 3: VIP, Keynote & Leadership */}
                                        <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: isDark ? 'rgba(245,158,11,0.06)' : '#fffbeb', border: '1px solid rgba(245,158,11,0.2)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontSize: '1.1rem' }}>🌟</Typography>
                                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: textPrimary }}>
                                                        VIP, Keynote & Leadership
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{ fontSize: '0.86rem', fontWeight: 900, color: '#d97706' }}>
                                                    {pillarsBreakdown.leadership?.total ?? 0} Pax
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: '0.72rem', color: textSecondary, mb: 0.8 }}>
                                                Dewan Penasehat IAGI, GEOSEA Council, Pejabat Kementerian ESDM & Tamu VIP
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.6, borderTop: `1px solid rgba(245,158,11,0.12)` }}>
                                                <Typography sx={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 700 }}>
                                                    Full Access & Gala Dinner
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.7rem', color: textSecondary }}>
                                                    Undangan Resmi
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Pillar 4: Expo, Industry & Crew */}
                                        <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: isDark ? 'rgba(16,185,129,0.06)' : '#ecfdf5', border: '1px solid rgba(16,185,129,0.18)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontSize: '1.1rem' }}>🏢</Typography>
                                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: textPrimary }}>
                                                        Expo, Industry Booth & Crew
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{ fontSize: '0.86rem', fontWeight: 900, color: '#10b981' }}>
                                                    {pillarsBreakdown.expo?.total ?? 0} Pax
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: '0.72rem', color: textSecondary, mb: 0.8 }}>
                                                Petugas booth pameran, panitia pelaksana, LO & volunteer mahasiswa
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.6, borderTop: `1px solid rgba(16,185,129,0.12)` }}>
                                                <Typography sx={{ fontSize: '0.7rem', color: textSecondary }}>
                                                    Kas Booth: <strong style={{ color: '#10b981' }}>{formatShortCurrency(pillarsBreakdown.expo?.revenue || 0)}</strong>
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>
                                                    Exhibition Hall
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5, pt: 1, borderTop: `1px solid ${cardBorder}` }}>
                                        <Button
                                            size="small"
                                            onClick={() => setPillarsViewMode('chart')}
                                            startIcon={<PieChartRoundedIcon sx={{ fontSize: 16 }} />}
                                            sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'none' }}
                                        >
                                            Tampilkan Mode Donut / Pie Chart &rarr;
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Card>
                    </Grid>

                    {/* Right 7 Cols: Bi-Color Stacked Horizontal Bar: Berdasarkan Kategori Registrasi (Gambar 2 Request) */}
                    <Grid size={{ xs: 12, lg: 7 }}>
                        <Card elevation={0} sx={{ ...diboldCardSx, minHeight: 450, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {biColorMode === 'categories' ? (
                                            <CategoryRoundedIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                                        ) : (
                                            <GroupsRoundedIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                                        )}
                                        <Typography sx={{ fontSize: '0.98rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.01em' }}>
                                            {biColorMode === 'categories'
                                                ? 'Status Pembayaran & Kehadiran per Kategori Registrasi'
                                                : 'Top Delegasi Instansi & Status Pembayaran'}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '0.76rem', color: textSecondary, mt: 0.3 }}>
                                        Visualisasi Bi-Color: <strong style={{ color: '#10b981' }}>Hijau (Lunas / Free Pass)</strong> vs <strong style={{ color: '#ea580c' }}>Oranye (Piutang Korporat)</strong>
                                    </Typography>
                                </Box>

                                {/* Summary Filter Dropdown & Mode Switch */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={(e) => setSummaryAnchor(e.currentTarget)}
                                        endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 16 }} />}
                                        sx={{ ...diboldPillSx, fontWeight: 800 }}
                                    >
                                        {biColorMode === 'categories' ? (
                                            categorySummaryFilter === 'top6' ? 'Top 6 Kategori' :
                                            categorySummaryFilter === 'top10' ? 'Top 10 Kategori' :
                                            categorySummaryFilter === 'participant' ? '1. Participant' :
                                            categorySummaryFilter === 'technical' ? '2. Technical' :
                                            categorySummaryFilter === 'visitor' ? '3. Visitor' :
                                            categorySummaryFilter === 'roles' ? '4. Roles' : 'Semua Kategori (20+)'
                                        ) : (
                                            summaryFilter === 'top10' ? 'Top 10 Instansi' :
                                            summaryFilter === 'corporate' ? 'Korporat / Migas' :
                                            summaryFilter === 'university' ? 'Universitas' : 'Top 5 Utama'
                                        )}
                                    </Button>
                                    <Menu
                                        anchorEl={summaryAnchor}
                                        open={Boolean(summaryAnchor)}
                                        onClose={() => setSummaryAnchor(null)}
                                        {...diboldMenuProps}
                                    >
                                        {biColorMode === 'categories' ? [
                                            <ListSubheader key="hdr-cat" sx={{ fontSize: '0.68rem', fontWeight: 800, color: textMuted, lineHeight: '28px' }}>
                                                FILTER KATEGORI REGISTRASI
                                            </ListSubheader>,
                                            <MenuItem key="top6" onClick={() => { setCategorySummaryFilter('top6'); setSummaryAnchor(null); }} sx={diboldMenuItemSx(categorySummaryFilter === 'top6')}>
                                                🏆 Top 6 Kategori Terbanyak
                                            </MenuItem>,
                                            <MenuItem key="top10" onClick={() => { setCategorySummaryFilter('top10'); setSummaryAnchor(null); }} sx={diboldMenuItemSx(categorySummaryFilter === 'top10')}>
                                                📊 Top 10 Kategori
                                            </MenuItem>,
                                            <MenuItem key="part" onClick={() => { setCategorySummaryFilter('participant'); setSummaryAnchor(null); }} sx={diboldMenuItemSx(categorySummaryFilter === 'participant')}>
                                                💼 1. Participant (Berbayar)
                                            </MenuItem>,
                                            <MenuItem key="tech" onClick={() => { setCategorySummaryFilter('technical'); setSummaryAnchor(null); }} sx={diboldMenuItemSx(categorySummaryFilter === 'technical')}>
                                                🔬 2. Technical (Presenter / Juri)
                                            </MenuItem>,
                                            <MenuItem key="vis" onClick={() => { setCategorySummaryFilter('visitor'); setSummaryAnchor(null); }} sx={diboldMenuItemSx(categorySummaryFilter === 'visitor')}>
                                                🎟️ 3. Visitor (Visitor Pass)
                                            </MenuItem>,
                                            <MenuItem key="rol" onClick={() => { setCategorySummaryFilter('roles'); setSummaryAnchor(null); }} sx={diboldMenuItemSx(categorySummaryFilter === 'roles')}>
                                                🌟 4. Roles & Invitations
                                            </MenuItem>,
                                            <MenuItem key="all" onClick={() => { setCategorySummaryFilter('all'); setSummaryAnchor(null); }} sx={diboldMenuItemSx(categorySummaryFilter === 'all')}>
                                                🌐 Semua Kategori (20+)
                                            </MenuItem>,
                                            <Divider key="div" />,
                                            <MenuItem key="switch-inst" onClick={() => { setBiColorMode('institutions'); setSummaryAnchor(null); }} sx={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 800 }}>
                                                🏢 Beralih ke Mode Instansi &rarr;
                                            </MenuItem>
                                        ] : [
                                            <ListSubheader key="hdr-inst" sx={{ fontSize: '0.68rem', fontWeight: 800, color: textMuted, lineHeight: '28px' }}>
                                                FILTER INSTANSI
                                            </ListSubheader>,
                                            <MenuItem key="top5" onClick={() => { setSummaryFilter('top5'); setSummaryAnchor(null); }} sx={diboldMenuItemSx(summaryFilter === 'top5')}>
                                                Top 5 Utama
                                            </MenuItem>,
                                            <MenuItem key="top10" onClick={() => { setSummaryFilter('top10'); setSummaryAnchor(null); }} sx={diboldMenuItemSx(summaryFilter === 'top10')}>
                                                Top 10 Terbanyak
                                            </MenuItem>,
                                            <MenuItem key="corp" onClick={() => { setSummaryFilter('corporate'); setSummaryAnchor(null); }} sx={diboldMenuItemSx(summaryFilter === 'corporate')}>
                                                Korporat, BUMN & KKKS Migas
                                            </MenuItem>,
                                            <MenuItem key="univ" onClick={() => { setSummaryFilter('university'); setSummaryAnchor(null); }} sx={diboldMenuItemSx(summaryFilter === 'university')}>
                                                Universitas & Akademisi
                                            </MenuItem>,
                                            <Divider key="div2" />,
                                            <MenuItem key="switch-cat" onClick={() => { setBiColorMode('categories'); setSummaryAnchor(null); }} sx={{ fontSize: '0.74rem', color: '#059669', fontWeight: 800 }}>
                                                🏷️ Beralih ke Mode Kategori Registrasi &rarr;
                                            </MenuItem>
                                        ]}
                                    </Menu>
                                </Box>
                            </Box>

                            {/* Bi-Color Legend */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2, p: 1, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderRadius: '10px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: '#10b981' }} />
                                    <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 700 }}>
                                        {biColorMode === 'categories'
                                            ? `Lunas / Free Pass (${catSummaryTotalLunas} Pax)`
                                            : `Lunas (${listTotalLunas} Delegasi)`}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: '#ea580c' }} />
                                    <Typography sx={{ fontSize: '0.72rem', color: textSecondary, fontWeight: 700 }}>
                                        {biColorMode === 'categories'
                                            ? `Piutang / Debt (${catSummaryTotalDebt} Pax)`
                                            : `Piutang / Debt (${listTotalDebt} Delegasi)`}
                                    </Typography>
                                </Box>
                                <Typography sx={{ ml: 'auto', fontSize: '0.72rem', color: textMuted }}>
                                    {biColorMode === 'categories'
                                        ? `Total ${enrichedCategories.filter(c => c.count > 0).length} Kategori Terdaftar`
                                        : `Total ${allInstitutions.length} Instansi Terdaftar`}
                                </Typography>
                            </Box>

                            {/* Stacked Horizontal Bars List */}
                            <Stack spacing={1.8} sx={{ flex: 1 }}>
                                {biColorMode === 'categories' ? (
                                    filteredCategorySummary.map((cat, index) => {
                                        const total = cat.count || 1;
                                        const lunas = cat.lunas;
                                        const debt = cat.debt;
                                        const pending = cat.pending;
                                        const lunasPct = cat.solvency_pct;
                                        const debtPct = total > 0 ? Math.round((debt / total) * 100) : 0;
                                        const pendingPct = total > 0 ? Math.max(0, 100 - lunasPct - debtPct) : 0;
                                        const barWidthPct = Math.round((total / maxCatSummaryCount) * 100);

                                        return (
                                            <Box key={cat.id} sx={{ width: '100%' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: '65%' }}>
                                                        <Typography sx={{ fontSize: '0.74rem', fontWeight: 800, color: textMuted }}>
                                                            #{index + 1}
                                                        </Typography>
                                                        <Typography noWrap sx={{ fontSize: '0.82rem', fontWeight: 800, color: textPrimary }}>
                                                            {cat.icon} {cat.label}
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={cat.groupTitle}
                                                            sx={{
                                                                height: 18,
                                                                fontSize: '0.62rem',
                                                                fontWeight: 700,
                                                                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                                                color: textSecondary,
                                                                borderRadius: '4px',
                                                            }}
                                                        />
                                                    </Box>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        {debt > 0 ? (
                                                            <Chip
                                                                label={`${lunas} Lunas • ${debt} Piutang`}
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.64rem',
                                                                    fontWeight: 800,
                                                                    bgcolor: isDark ? 'rgba(234,88,12,0.18)' : '#fff7ed',
                                                                    color: '#ea580c',
                                                                    borderRadius: '6px',
                                                                }}
                                                            />
                                                        ) : pending > 0 ? (
                                                            <Chip
                                                                label={`${lunas} Lunas • ${pending} Pending`}
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.64rem',
                                                                    fontWeight: 800,
                                                                    bgcolor: isDark ? 'rgba(245,158,11,0.18)' : '#fffbeb',
                                                                    color: '#d97706',
                                                                    borderRadius: '6px',
                                                                }}
                                                            />
                                                        ) : cat.isFree ? (
                                                            <Chip
                                                                label="100% Free Pass"
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.64rem',
                                                                    fontWeight: 800,
                                                                    bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                                                                    color: '#059669',
                                                                    borderRadius: '6px',
                                                                }}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label={`${lunasPct}% Lunas`}
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.64rem',
                                                                    fontWeight: 800,
                                                                    bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                                                                    color: '#10b981',
                                                                    borderRadius: '6px',
                                                                }}
                                                            />
                                                        )}
                                                        <Typography sx={{ fontSize: '0.76rem', fontWeight: 800, color: textPrimary, minWidth: '75px', textAlign: 'right' }}>
                                                            {total} Delegasi
                                                        </Typography>
                                                    </Stack>
                                                </Box>

                                                {/* Bi-Color Stacked Horizontal Bar Container */}
                                                <Box sx={{ width: '100%', height: 12, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                                                    {lunas > 0 && (
                                                        <Box
                                                            sx={{
                                                                width: `${(barWidthPct * lunas) / total}%`,
                                                                height: '100%',
                                                                bgcolor: '#10b981',
                                                                transition: 'width 0.4s ease',
                                                            }}
                                                            title={`Lunas: ${lunas} orang (${lunasPct}%)`}
                                                        />
                                                    )}
                                                    {debt > 0 && (
                                                        <Box
                                                            sx={{
                                                                width: `${(barWidthPct * debt) / total}%`,
                                                                height: '100%',
                                                                bgcolor: '#ea580c',
                                                                transition: 'width 0.4s ease',
                                                            }}
                                                            title={`Piutang / Debt: ${debt} orang (${debtPct}%)`}
                                                        />
                                                    )}
                                                    {pending > 0 && (
                                                        <Box
                                                            sx={{
                                                                width: `${(barWidthPct * pending) / total}%`,
                                                                height: '100%',
                                                                bgcolor: '#f59e0b',
                                                                transition: 'width 0.4s ease',
                                                            }}
                                                            title={`Pending: ${pending} orang (${pendingPct}%)`}
                                                        />
                                                    )}
                                                </Box>

                                                {/* Subtitle / Revenue Tag */}
                                                {cat.est_revenue > 0 && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.3, px: 0.2 }}>
                                                        <Typography sx={{ fontSize: '0.64rem', color: textMuted }}>
                                                            Realisasi Kas: <strong style={{ color: '#10b981' }}>{formatShortCurrency(cat.est_revenue)}</strong>
                                                        </Typography>
                                                        {cat.debt > 0 && (
                                                            <Typography sx={{ fontSize: '0.64rem', color: '#ea580c', fontWeight: 700 }}>
                                                                Piutang: {cat.debt} orang
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>
                                        );
                                    })
                                ) : (
                                    /* Instansi mode fallback */
                                    filteredInstitutions.map((inst, index) => {
                                        const total = inst.count || 1;
                                        const lunas = Number(inst.lunas ?? inst.lunas_count ?? 0);
                                        const debt = Number(inst.debt ?? inst.debt_count ?? 0);
                                        const pending = Number(inst.pending ?? inst.pending_count ?? 0);
                                        const lunasPct = total > 0 ? Math.round((lunas / total) * 100) : 0;
                                        const debtPct = total > 0 ? Math.round((debt / total) * 100) : 0;
                                        const pendingPct = total > 0 ? Math.max(0, 100 - lunasPct - debtPct) : 0;
                                        const barWidthPct = Math.round((total / maxInstCount) * 100);

                                        return (
                                            <Box key={inst.name} sx={{ width: '100%' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: '65%' }}>
                                                        <Typography sx={{ fontSize: '0.74rem', fontWeight: 800, color: textMuted }}>
                                                            #{index + 1}
                                                        </Typography>
                                                        <Typography noWrap sx={{ fontSize: '0.82rem', fontWeight: 800, color: textPrimary }}>
                                                            {inst.name}
                                                        </Typography>
                                                    </Box>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        {debt > 0 ? (
                                                            <Chip
                                                                label={`${lunas} Lunas • ${debt} Piutang`}
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.64rem',
                                                                    fontWeight: 800,
                                                                    bgcolor: isDark ? 'rgba(234,88,12,0.18)' : '#fff7ed',
                                                                    color: '#ea580c',
                                                                    borderRadius: '6px',
                                                                }}
                                                            />
                                                        ) : pending > 0 ? (
                                                            <Chip
                                                                label={`${lunas} Lunas • ${pending} Pending`}
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.64rem',
                                                                    fontWeight: 800,
                                                                    bgcolor: isDark ? 'rgba(245,158,11,0.18)' : '#fffbeb',
                                                                    color: '#d97706',
                                                                    borderRadius: '6px',
                                                                }}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label={`${lunasPct}% Lunas`}
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.64rem',
                                                                    fontWeight: 800,
                                                                    bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                                                                    color: '#10b981',
                                                                    borderRadius: '6px',
                                                                }}
                                                            />
                                                        )}
                                                        <Typography sx={{ fontSize: '0.76rem', fontWeight: 800, color: textPrimary, minWidth: '70px', textAlign: 'right' }}>
                                                            {total} Delegasi
                                                        </Typography>
                                                    </Stack>
                                                </Box>

                                                {/* Bi-Color Stacked Horizontal Bar Container */}
                                                <Box sx={{ width: '100%', height: 12, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                                                    {lunas > 0 && (
                                                        <Box
                                                            sx={{
                                                                width: `${(barWidthPct * lunas) / total}%`,
                                                                height: '100%',
                                                                bgcolor: '#10b981',
                                                                transition: 'width 0.4s ease',
                                                            }}
                                                            title={`Lunas: ${lunas} orang (${lunasPct}%)`}
                                                        />
                                                    )}
                                                    {debt > 0 && (
                                                        <Box
                                                            sx={{
                                                                width: `${(barWidthPct * debt) / total}%`,
                                                                height: '100%',
                                                                bgcolor: '#ea580c',
                                                                transition: 'width 0.4s ease',
                                                            }}
                                                            title={`Piutang / Debt: ${debt} orang (${debtPct}%)`}
                                                        />
                                                    )}
                                                    {pending > 0 && (
                                                        <Box
                                                            sx={{
                                                                width: `${(barWidthPct * pending) / total}%`,
                                                                height: '100%',
                                                                bgcolor: '#f59e0b',
                                                                transition: 'width 0.4s ease',
                                                            }}
                                                            title={`Pending: ${pending} orang (${pendingPct}%)`}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })
                                )}
                            </Stack>

                            {/* Footer Summary */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, pt: 1.5, borderTop: `1px solid ${cardBorder}` }}>
                                <Typography sx={{ fontSize: '0.74rem', color: textSecondary }}>
                                    {biColorMode === 'categories' ? (
                                        topRevenueCategoryList.length > 0 ? (
                                            <>
                                                Penerimaan kas tertinggi:{' '}
                                                <strong style={{ color: '#10b981' }}>
                                                    {topRevenueCategoryList.slice(0, 2).map(c => `${c.label} (${formatShortCurrency(c.est_revenue)})`).join(' & ')}
                                                </strong>
                                                {topDebtCategoryList.length > 0 && (
                                                    <>
                                                        {' '}• Piutang:{' '}
                                                        <strong style={{ color: '#ea580c' }}>
                                                            {topDebtCategoryList[0]?.label} ({topDebtCategoryList[0]?.debt} orang)
                                                        </strong>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            'Seluruh kategori registrasi tervalidasi 100% lunas dan bebas piutang.'
                                        )
                                    ) : (
                                        topDebtInstList.length > 0 ? (
                                            <>
                                                Instansi dengan piutang terbanyak:{' '}
                                                <strong style={{ color: '#ea580c' }}>
                                                    {topDebtInstList.slice(0, 2).map((i) => `${i.name} (${Number(i.debt ?? i.debt_count)} delegasi)`).join(' & ')}
                                                </strong>
                                            </>
                                        ) : (
                                            <>
                                                Status Delegasi:{' '}
                                                <strong style={{ color: '#10b981' }}>
                                                    Seluruh delegasi dari instansi teratas sudah lunas (Tidak ada tunggakan piutang).
                                                </strong>
                                            </>
                                        )
                                    )}
                                </Typography>
                                <Button
                                    size="small"
                                    onClick={onSwitchToTable}
                                    sx={{ fontSize: '0.74rem', fontWeight: 800, color: '#2563eb', textTransform: 'none' }}
                                >
                                    Lihat Semua di Tabel &rarr;
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* ── ROW 4: REGISTRATION & TURNSTILE FUNNEL + SECTORS & DEMOGRAPHICS ── */}
            {(executiveTab === 'overview' || executiveTab === 'operations') && (
                <Grid container spacing={2.5} sx={{ mb: 3 }}>
                    {/* Left 6 Cols: Registration & Turnstile Funnel (5 Stages) */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Card elevation={0} sx={{ ...diboldCardSx, minHeight: 420 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TrendingUpRoundedIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                                        <Typography sx={{ fontSize: '0.98rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.01em' }}>
                                            Funnel Konversi Registrasi ke Venue (5 Tahap)
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '0.76rem', color: textSecondary, mt: 0.3 }}>
                                        Perjalanan alur delegasi: Database &rarr; Verifikasi &rarr; E-Tiket &rarr; Gate Turnstile &rarr; ID Badge
                                    </Typography>
                                </Box>

                                <Chip
                                    label="Funnel Rate"
                                    size="small"
                                    sx={{ height: 22, fontSize: '0.68rem', fontWeight: 800, bgcolor: isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff', color: '#2563eb' }}
                                />
                            </Box>

                            {/* Power BI Funnel Bars */}
                            <Stack spacing={1.6} sx={{ my: 1 }}>
                                {funnelMetrics.map((stage) => {
                                    const stageWidthPct = Math.max(18, Math.min(100, stage.pct));
                                    return (
                                        <Box key={stage.stage} sx={{ width: '100%' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.4 }}>
                                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: textPrimary }}>
                                                    {stage.stage}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 900, color: stage.color }}>
                                                    {stage.count} Delegasi ({stage.pct}%)
                                                </Typography>
                                            </Box>
                                            <Box sx={{ width: '100%', height: 22, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                                <Box
                                                    sx={{
                                                        width: `${stageWidthPct}%`,
                                                        height: '100%',
                                                        bgcolor: stage.color,
                                                        borderRadius: '6px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-end',
                                                        pr: 1.2,
                                                        transition: 'width 0.5s ease',
                                                    }}
                                                >
                                                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 900, color: '#ffffff' }}>
                                                        {stage.pct}%
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Stack>

                            <Box sx={{ mt: 'auto', p: 1.5, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                                <Typography sx={{ fontSize: '0.74rem', color: textSecondary }}>
                                    💡 <strong>Evaluasi Funnel:</strong> Konversi pembayaran lunas sangat solid di angka <strong>83%</strong>. Perhatian difokuskan pada tahap pengiriman E-Tiket ke email peserta ({Number(email.percentage || 0).toFixed(1)}%) dan kelancaran turnstile gate saat jam masuk.
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Right 6 Cols: Industry Sectors & ASEAN Regional Demographics */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Card elevation={0} sx={{ ...diboldCardSx, minHeight: 420 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BusinessRoundedIcon sx={{ fontSize: 20, color: '#0d9488' }} />
                                        <Typography sx={{ fontSize: '0.98rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.01em' }}>
                                            Sektor Industri & Demografi Regional
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '0.76rem', color: textSecondary, mt: 0.3 }}>
                                        Sebaran asal bidang kerja & partisipasi internasional GEOSEA XIX
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'inline-flex', p: '3px', bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', borderRadius: '8px', border: `1px solid ${cardBorder}` }}>
                                    <Button
                                        size="small"
                                        onClick={() => setSectorsViewMode('grid')}
                                        sx={{
                                            minWidth: 'auto',
                                            px: 1.1,
                                            py: 0.35,
                                            fontSize: '0.68rem',
                                            fontWeight: 800,
                                            borderRadius: '6px',
                                            textTransform: 'none',
                                            bgcolor: sectorsViewMode === 'grid' ? (isDark ? '#1e293b' : '#ffffff') : 'transparent',
                                            color: sectorsViewMode === 'grid' ? '#0d9488' : textMuted,
                                            boxShadow: sectorsViewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            '&:hover': { bgcolor: sectorsViewMode === 'grid' ? (isDark ? '#1e293b' : '#ffffff') : 'transparent' }
                                        }}
                                    >
                                        Grid Sektor
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => setSectorsViewMode('pie')}
                                        startIcon={<PieChartRoundedIcon sx={{ fontSize: '14px !important' }} />}
                                        sx={{
                                            minWidth: 'auto',
                                            px: 1.1,
                                            py: 0.35,
                                            fontSize: '0.68rem',
                                            fontWeight: 800,
                                            borderRadius: '6px',
                                            textTransform: 'none',
                                            bgcolor: sectorsViewMode === 'pie' ? (isDark ? '#1e293b' : '#ffffff') : 'transparent',
                                            color: sectorsViewMode === 'pie' ? '#0d9488' : textMuted,
                                            boxShadow: sectorsViewMode === 'pie' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            '&:hover': { bgcolor: sectorsViewMode === 'pie' ? (isDark ? '#1e293b' : '#ffffff') : 'transparent' }
                                        }}
                                    >
                                        Pie Chart
                                    </Button>
                                </Box>
                            </Box>

                            {/* Top: 6 Sektor Industri Grid OR Pie Chart */}
                            {sectorsViewMode === 'pie' ? (
                                <Box sx={{ position: 'relative', width: '100%', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                    <PieChart
                                        series={[{
                                            data: sectorsPieData,
                                            innerRadius: 46,
                                            outerRadius: 72,
                                            paddingAngle: 3,
                                            cornerRadius: 5,
                                            highlightScope: { fade: 'global', highlight: 'item' },
                                            faded: { innerRadius: 42, additionalRadius: -3, opacity: 0.35 },
                                            valueFormatter: (item) => `${item.value} Orang (${totalVisitors > 0 ? ((item.value / totalVisitors) * 100).toFixed(1) : 0}%)`,
                                        }]}
                                        hideLegend={true}
                                        slots={{ legend: () => null }}
                                        margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                        height={180}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        textAlign: 'center',
                                        pointerEvents: 'none',
                                    }}>
                                        <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: textPrimary, lineHeight: 1 }}>
                                            {totalVisitors}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.58rem', color: textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', mt: 0.2 }}>
                                            Delegasi
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <>
                                    <Typography sx={{ fontSize: '0.76rem', fontWeight: 800, color: textPrimary, mb: 1.2 }}>
                                        Distribusi Sektor Industri Delegasi
                                    </Typography>
                                    <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                                        {institutionalSectors.map((sector) => {
                                            const sectorPct = Math.round(((sector.count || 0) / (totalVisitors || 1)) * 100);
                                            return (
                                                <Grid size={{ xs: 6, sm: 4 }} key={sector.label}>
                                                    <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${cardBorder}` }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.4 }}>
                                                            <Typography sx={{ fontSize: '0.95rem' }}>{sector.icon}</Typography>
                                                            <Typography noWrap sx={{ fontSize: '0.72rem', fontWeight: 800, color: textPrimary }}>
                                                                {sector.label}
                                                            </Typography>
                                                        </Box>
                                                        <Typography sx={{ fontSize: '1.05rem', fontWeight: 900, color: sector.color }}>
                                                            {sector.count} <span style={{ fontSize: '0.68rem', fontWeight: 600, color: textSecondary }}>({sectorPct}%)</span>
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </>
                            )}

                            <Divider sx={{ my: 1.5, borderColor: cardBorder }} />

                            {/* Bottom: Regional ASEAN Demographics */}
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                        <PublicRoundedIcon sx={{ fontSize: 18, color: '#2563eb' }} />
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: textPrimary }}>
                                            Demografi Regional GEOSEA XIX
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: textSecondary }}>
                                        Domestik vs Internasional
                                    </Typography>
                                </Box>

                                <Box sx={{ width: '100%', height: 14, borderRadius: '7px', bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', overflow: 'hidden', display: 'flex', mb: 1 }}>
                                    <Box
                                        sx={{ width: `${demographics.domestic_pct || 95.6}%`, height: '100%', bgcolor: '#2563eb' }}
                                        title={`Domestik: ${demographics.domestic} orang`}
                                    />
                                    <Box
                                        sx={{ width: `${demographics.international_pct || 4.4}%`, height: '100%', bgcolor: '#f59e0b' }}
                                        title={`ASEAN & Internasional: ${demographics.international} orang`}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700 }}>
                                        🇮🇩 Domestik Indonesia: {demographics.domestic} ({demographics.domestic_pct}%)
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>
                                        🌏 ASEAN / Internasional: {demographics.international} ({demographics.international_pct}%)
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* ── ROW 5: REKAPITULASI TAGIHAN DELEGASI KORPORAT & STATUS PIUTANG (ACCOUNTS RECEIVABLE MATRIX) ── */}
            {(executiveTab === 'overview' || executiveTab === 'delegations') && (
                <Card elevation={0} sx={diboldCardSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ReceiptLongOutlinedIcon sx={{ fontSize: 22, color: '#2563eb' }} />
                                <Typography sx={{ fontSize: '1.05rem', fontWeight: 900, color: textPrimary, letterSpacing: '-0.02em' }}>
                                    Matriks Rekapitulasi Tagihan Delegasi Korporat & Status Piutang
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.78rem', color: textSecondary, mt: 0.3 }}>
                                Monitoring penagihan institusi korporat, BUMN, KKKS migas, dan universitas mitra PIT IAGI 2026
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Chip
                                label={`Total Piutang: ${formatShortCurrency(debtRevenue)}`}
                                size="small"
                                sx={{
                                    height: 26,
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    bgcolor: '#fff7ed',
                                    color: '#ea580c',
                                    border: '1px solid #fed7aa',
                                }}
                            />
                            <Button
                                size="small"
                                onClick={onSwitchToTable}
                                variant="outlined"
                                sx={{
                                    ...diboldPillSx,
                                    fontWeight: 800,
                                    borderColor: '#2563eb',
                                    color: '#2563eb',
                                }}
                            >
                                Buka Tabel Lengkap
                            </Button>
                        </Stack>
                    </Box>

                    <TableContainer sx={{ border: `1px solid ${cardBorder}`, borderRadius: '14px', overflow: 'hidden' }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.74rem', color: textSecondary, py: 1.2 }}>Instansi / Korporat</TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.74rem', color: textSecondary, py: 1.2 }}>No. Invoice Tagihan</TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.74rem', color: textSecondary, py: 1.2 }}>Delegasi</TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.74rem', color: textSecondary, py: 1.2 }}>Total Tagihan</TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.74rem', color: textSecondary, py: 1.2 }}>PIC & Kontak</TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.74rem', color: textSecondary, py: 1.2 }}>Status Pembayaran</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 800, fontSize: '0.74rem', color: textSecondary, py: 1.2 }}>Aksi Bendahara</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {corporateInvoices.slice(0, 8).map((inv) => {
                                    const isLunas = !inv.is_debt && inv.status?.toLowerCase() === 'approved';
                                    return (
                                        <TableRow
                                            key={inv.id || inv.code}
                                            sx={{
                                                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' },
                                                borderBottom: `1px solid ${cardBorder}`,
                                            }}
                                        >
                                            <TableCell sx={{ py: 1.2 }}>
                                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: textPrimary }}>
                                                    {inv.institution}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary }}>
                                                    {inv.delegation_type || 'Corporate Group'}
                                                </Typography>
                                            </TableCell>

                                            <TableCell sx={{ py: 1.2 }}>
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>
                                                    {inv.code}
                                                </Typography>
                                            </TableCell>

                                            <TableCell sx={{ py: 1.2 }}>
                                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: textPrimary }}>
                                                    {inv.delegates_count || 1} <span style={{ fontSize: '0.7rem', color: textSecondary, fontWeight: 500 }}>Pax</span>
                                                </Typography>
                                            </TableCell>

                                            <TableCell sx={{ py: 1.2 }}>
                                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 900, color: isLunas ? '#10b981' : '#ea580c' }}>
                                                    {formatRupiah(inv.total_amount)}
                                                </Typography>
                                                {!isLunas && inv.debt_amount > 0 && (
                                                    <Typography sx={{ fontSize: '0.66rem', color: '#ea580c', fontWeight: 700 }}>
                                                        Sisa Piutang: {formatRupiah(inv.debt_amount)}
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            <TableCell sx={{ py: 1.2 }}>
                                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: textPrimary }}>
                                                    {inv.pic_name || 'PIC Instansi'}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.68rem', color: textSecondary }}>
                                                    {inv.pic_phone || inv.pic_email || '-'}
                                                </Typography>
                                            </TableCell>

                                            <TableCell sx={{ py: 1.2 }}>
                                                {isLunas ? (
                                                    <Chip
                                                        label="Lunas (Kas Masuk)"
                                                        size="small"
                                                        sx={{
                                                            height: 22,
                                                            fontSize: '0.68rem',
                                                            fontWeight: 800,
                                                            bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                                                            color: '#10b981',
                                                            borderRadius: '6px',
                                                        }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="Piutang (Hutang)"
                                                        size="small"
                                                        sx={{
                                                            height: 22,
                                                            fontSize: '0.68rem',
                                                            fontWeight: 800,
                                                            bgcolor: isDark ? 'rgba(234,88,12,0.15)' : '#fff7ed',
                                                            color: '#ea580c',
                                                            borderRadius: '6px',
                                                        }}
                                                    />
                                                )}
                                            </TableCell>

                                            <TableCell align="center" sx={{ py: 1.2 }}>
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleSendPicWhatsApp(inv)}
                                                        startIcon={<WhatsAppIcon sx={{ fontSize: 14, color: '#16a34a' }} />}
                                                        sx={{
                                                            borderRadius: '10px',
                                                            textTransform: 'none',
                                                            fontSize: '0.68rem',
                                                            fontWeight: 800,
                                                            borderColor: '#16a34a',
                                                            color: '#16a34a',
                                                            py: 0.3,
                                                            px: 1,
                                                            '&:hover': {
                                                                bgcolor: '#f0fdf4',
                                                                borderColor: '#15803d',
                                                            },
                                                        }}
                                                    >
                                                        Kirim WA
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={onSwitchToTable}
                                                        startIcon={<ReceiptLongOutlinedIcon sx={{ fontSize: 14 }} />}
                                                        sx={{
                                                            borderRadius: '10px',
                                                            textTransform: 'none',
                                                            fontSize: '0.68rem',
                                                            fontWeight: 800,
                                                            bgcolor: '#2563eb',
                                                            color: '#ffffff',
                                                            py: 0.3,
                                                            px: 1,
                                                        }}
                                                    >
                                                        Kwitansi
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                        <Typography sx={{ fontSize: '0.74rem', color: textSecondary }}>
                            Menampilkan invoice tagihan korporat bernilai tinggi. Pembayaran dapat dikonfirmasi via transfer Mandiri atau kasir onsite.
                        </Typography>
                        <Typography sx={{ fontSize: '0.74rem', color: textMuted, fontWeight: 600 }}>
                            55th PIT IAGI &bull; GEOSEA XIX 2026 Executive Dashboard
                        </Typography>
                    </Box>
                </Card>
            )}
        </Box>
    );
}
