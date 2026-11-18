import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Box,
    Container,
    Typography,
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
    TextField,
    Tooltip,
    Collapse,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import VerifiedIcon from '@mui/icons-material/Verified';
import TuneIcon from '@mui/icons-material/Tune';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditCalendarIcon from '@mui/icons-material/CalendarMonth';

const CATEGORY_MAP = {
    // Roles & Invitations
    vip: { label: 'VIP', badge: 'VIP' },
    speaker: { label: 'Keynote Speaker', badge: 'KEYNOTE SPEAKER' },
    keynote_speech: { label: 'Keynote Speaker', badge: 'KEYNOTE SPEAKER' },
    keynote_speaker: { label: 'Keynote Speaker', badge: 'KEYNOTE SPEAKER' },
    panelist: { label: 'Panelist', badge: 'PANELIST' },
    moderator: { label: 'Moderator', badge: 'MODERATOR' },
    exhibition: { label: 'Exhibition', badge: 'EXHIBITION' },
    committee: { label: 'Committee', badge: 'COMMITTEE' },
    student_volunteer: { label: 'Student Volunteer', badge: 'STUDENT VOLUNTEER' },
    board: { label: 'Board', badge: 'BOARD' },
    sponsorship: { label: 'Delegate', badge: 'DELEGATE' },
    sponsor: { label: 'Delegate', badge: 'DELEGATE' },
    delegate: { label: 'Delegate', badge: 'DELEGATE' },
    student_crowd: { label: 'Student Crowd', badge: 'STUDENT CROWD' },
    vip_companion: { label: 'VIP Companion', badge: 'VIP COMPANION' },
    it_developer: { label: 'IT Developer', badge: 'IT DEVELOPER' },
    tesko: { label: 'TESKO', badge: 'TESKO' },

    // 1. Participant
    iagi_member_professional: { label: 'Professional (Member)', badge: 'PROFESSIONAL (MEMBER)' },
    non_iagi_member_professional: { label: 'Professional (Non-Member)', badge: 'PROFESSIONAL (NON-MEMBER)' },
    iagi_member_expatriate: { label: 'Expatriate (Member)', badge: 'EXPATRIATE (MEMBER)' },
    non_iagi_member_expatriate: { label: 'Expatriate (Non-Member)', badge: 'EXPATRIATE (NON-MEMBER)' },
    student_undergraduate: { label: 'Student Undergraduate', badge: 'STUDENT UNDERGRADUATE' },
    dosen: { label: 'Participant - Dosen', badge: 'PARTICIPANT: DOSEN' },
    professional: { label: 'Participant - Professional', badge: 'PARTICIPANT: PROFESSIONAL' },
    professional_1500: { label: 'Participant - Professional', badge: 'PARTICIPANT: PROFESSIONAL' },

    // 2. Technical
    presenter: { label: 'Presenter', badge: 'PRESENTER' },
    student: { label: 'Presenter', badge: 'PRESENTER' },
    invited_speaker: { label: 'Invited Speaker', badge: 'INVITED SPEAKER' },
    session_chair_judge: { label: 'Session Chair / Judge', badge: 'SESSION CHAIR / JUDGE' },
    session_chair: { label: 'Session Chair', badge: 'SESSION CHAIR' },
    judge: { label: 'Judge', badge: 'JUDGE' },
    oral: { label: 'Presenter', badge: 'PRESENTER' },
    oral_presenter: { label: 'Presenter', badge: 'PRESENTER' },
    poster: { label: 'Presenter', badge: 'PRESENTER' },
    poster_presenter: { label: 'Presenter', badge: 'PRESENTER' },

    // 3. Visitor
    non_exclusive: { label: 'Visitor Pass (Free)', badge: 'VISITOR PASS (FREE)' },
};

const CATEGORY_PRICES = {
    iagi_member_professional: 3000000,
    non_iagi_member_professional: 4000000,
    iagi_member_expatriate: 6000000,
    non_iagi_member_expatriate: 7000000,
    student_undergraduate: 1000000,
    dosen: 1500000,
    professional: 1500000,
    professional_1500: 1500000,
    exclusive: 500000,
};

function numberToWordsEn(num) {
    num = Math.floor(Math.abs(num));
    if (num === 0) return 'Zero';

    const ones = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = [
        '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];
    const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    function convertGroup(n) {
        let str = '';
        if (n >= 100) {
            str += ones[Math.floor(n / 100)] + ' Hundred';
            n %= 100;
            if (n > 0) str += ' ';
        }
        if (n >= 20) {
            str += tens[Math.floor(n / 10)];
            n %= 10;
            if (n > 0) str += ' ' + ones[n];
        } else if (n > 0) {
            str += ones[n];
        }
        return str;
    }

    let chunks = [];
    let scaleIndex = 0;
    while (num > 0) {
        const chunk = num % 1000;
        if (chunk !== 0) {
            const groupStr = convertGroup(chunk);
            const scaleStr = scales[scaleIndex];
            chunks.unshift(scaleStr ? `${groupStr} ${scaleStr}` : groupStr);
        }
        num = Math.floor(num / 1000);
        scaleIndex++;
    }

    return chunks.join(' ').trim();
}

export default function Receipt({
    payment = {},
    tickets = [],
    eventDate = '3 - 5 November 2026',
    eventVenue = 'Royal Ambarrukmo Yogyakarta',
    bankInfo = '',
}) {
    const isApproved = payment.status === 'approved';
    const isRejected = payment.status === 'rejected';
    const isPending = payment.status === 'pending' || !payment.status;

    const primaryTicket = tickets[0] || {};

    // Dynamically calculate accurate subtotal from each participant
    const rawCalculatedSubtotal = React.useMemo(() => {
        return (tickets || []).reduce((acc, t) => {
            const ind = Number(t.individual_price || 0);
            if (ind > 0) return acc + ind;
            const catPrice = CATEGORY_PRICES[t.visitor_type];
            if (catPrice !== undefined) return acc + catPrice;
            const fallbackPrice = Number(payment.price_per_ticket || 0);
            return acc + fallbackPrice;
        }, 0);
    }, [tickets, payment]);

    const storedSubtotal = Math.max(0, Number(payment.total_amount || 0) - Number(payment.unique_code || 0) + Number(payment.discount_amount || 0));
    const effectiveSubtotal = (rawCalculatedSubtotal > 0 && (tickets.length > 1 || storedSubtotal === 0) && rawCalculatedSubtotal > storedSubtotal)
        ? rawCalculatedSubtotal
        : (storedSubtotal > 0 ? storedSubtotal : rawCalculatedSubtotal);

    const discountAmount = Number(payment.discount_amount || 0);
    const uniqueCode = Number(payment.unique_code || 0);
    const totalAmount = Math.max(0, effectiveSubtotal - discountAmount) + uniqueCode;
    const amountInWords = totalAmount > 0 ? (numberToWordsEn(totalAmount).trim() + ' Rupiah') : 'Zero Rupiah';

    const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const MONTH_NAMES = [
        { num: 1, roman: 'I', labelEn: 'January', labelId: 'Januari' },
        { num: 2, roman: 'II', labelEn: 'February', labelId: 'Februari' },
        { num: 3, roman: 'III', labelEn: 'March', labelId: 'Maret' },
        { num: 4, roman: 'IV', labelEn: 'April', labelId: 'April' },
        { num: 5, roman: 'V', labelEn: 'May', labelId: 'Mei' },
        { num: 6, roman: 'VI', labelEn: 'June', labelId: 'Juni' },
        { num: 7, roman: 'VII', labelEn: 'July', labelId: 'Juli' },
        { num: 8, roman: 'VIII', labelEn: 'August', labelId: 'Agustus' },
        { num: 9, roman: 'IX', labelEn: 'September', labelId: 'September' },
        { num: 10, roman: 'X', labelEn: 'October', labelId: 'Oktober' },
        { num: 11, roman: 'XI', labelEn: 'November', labelId: 'November' },
        { num: 12, roman: 'XII', labelEn: 'December', labelId: 'Desember' },
    ];

    const pDate = React.useMemo(() => new Date(payment.created_at || Date.now()), [payment.created_at]);
    const pYear = pDate.getFullYear() || 2026;
    const pNum = String(payment.id || 1).padStart(3, '0');
    const defaultRomanMonth = ROMAN_MONTHS[pDate.getMonth()] || 'IX';
    const defaultBaseReceiptNo = payment.receipt_no || `Receipt No. ${pNum}/PIT-IAGI/PY-R/${defaultRomanMonth}/${pYear}`;

    // Extract Roman month from existing receipt number if available
    const detectedRomanMatch = defaultBaseReceiptNo.match(/\/([IVXLCDM]+)\/(\d{4})/i);
    const initialRoman = detectedRomanMatch ? detectedRomanMatch[1].toUpperCase() : defaultRomanMonth;
    const initialMonthIdx = ROMAN_MONTHS.indexOf(initialRoman) !== -1 ? ROMAN_MONTHS.indexOf(initialRoman) : pDate.getMonth();

    // Local customization state (purely for print / PDF, does NOT touch database)
    const [showCustomToolbar, setShowCustomToolbar] = React.useState(true);
    const [customMonthIdx, setCustomMonthIdx] = React.useState(null);
    const [customDateVal, setCustomDateVal] = React.useState('');
    const [customReceiptNo, setCustomReceiptNo] = React.useState('');
    const [customDateText, setCustomDateText] = React.useState('');

    const activeMonthIdx = customMonthIdx !== null 
        ? customMonthIdx 
        : (customDateVal ? new Date(customDateVal).getMonth() : initialMonthIdx);

    const activeRoman = ROMAN_MONTHS[activeMonthIdx] || defaultRomanMonth;

    const effectiveDateFormatted = React.useMemo(() => {
        if (customDateText) return customDateText;
        if (customDateVal) {
            const d = new Date(customDateVal);
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
            }
        }
        if (customMonthIdx !== null) {
            const y = pDate.getFullYear();
            const maxDays = new Date(y, customMonthIdx + 1, 0).getDate();
            const d = Math.min(pDate.getDate(), maxDays);
            const adjustedDate = new Date(y, customMonthIdx, d);
            return adjustedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        return pDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    }, [customDateText, customDateVal, customMonthIdx, pDate]);

    const effectiveReceiptNumber = React.useMemo(() => {
        if (customReceiptNo.trim()) {
            return customReceiptNo.trim();
        }
        if (customMonthIdx !== null || customDateVal) {
            if (/\/([IVXLCDM]+)\/(\d{4})/i.test(defaultBaseReceiptNo)) {
                return defaultBaseReceiptNo.replace(/\/([IVXLCDM]+)\/(\d{4})/i, `/${activeRoman}/$2`);
            }
        }
        return defaultBaseReceiptNo;
    }, [customReceiptNo, customMonthIdx, customDateVal, defaultBaseReceiptNo, activeRoman]);

    const cleanReceiptNumber = effectiveReceiptNumber.replace(/^Receipt No\.\s*/i, '');
    const headerReceiptNumber = effectiveReceiptNumber.startsWith('Receipt No.')
        ? effectiveReceiptNumber
        : `Receipt No. ${effectiveReceiptNumber}`;

    const isCustomized = customMonthIdx !== null || Boolean(customDateVal) || Boolean(customReceiptNo) || Boolean(customDateText);

    const handleSelectMonth = (monthIdx) => {
        setCustomMonthIdx(monthIdx);
        const y = pDate.getFullYear();
        const maxDays = new Date(y, monthIdx + 1, 0).getDate();
        const d = Math.min(pDate.getDate(), maxDays);
        const newDate = new Date(y, monthIdx, d);
        const isoDate = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
        setCustomDateVal(isoDate);
        setCustomDateText('');

        const targetRoman = ROMAN_MONTHS[monthIdx];
        const sourceReceipt = customReceiptNo.trim() || defaultBaseReceiptNo;
        if (/\/([IVXLCDM]+)\/(\d{4})/i.test(sourceReceipt)) {
            setCustomReceiptNo(sourceReceipt.replace(/\/([IVXLCDM]+)\/(\d{4})/i, `/${targetRoman}/$2`));
        }
    };

    const handleDateChange = (dateIso) => {
        setCustomDateVal(dateIso);
        setCustomDateText('');
        if (dateIso) {
            const d = new Date(dateIso);
            if (!isNaN(d.getTime())) {
                const mIdx = d.getMonth();
                setCustomMonthIdx(mIdx);
                const targetRoman = ROMAN_MONTHS[mIdx];
                const sourceReceipt = customReceiptNo.trim() || defaultBaseReceiptNo;
                if (/\/([IVXLCDM]+)\/(\d{4})/i.test(sourceReceipt)) {
                    setCustomReceiptNo(sourceReceipt.replace(/\/([IVXLCDM]+)\/(\d{4})/i, `/${targetRoman}/$2`));
                }
            }
        }
    };

    const handleResetCustom = () => {
        setCustomMonthIdx(null);
        setCustomDateVal('');
        setCustomReceiptNo('');
        setCustomDateText('');
    };

    const bankLines = React.useMemo(() => {
        if (!bankInfo || typeof bankInfo !== 'string') {
            return [
                { label: 'Bank', val: 'Mandiri' },
                { label: 'Account No', val: '1030099991461' },
                { label: 'Account Holder', val: 'IAGI' },
            ];
        }
        const lines = bankInfo.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) {
            return [
                { label: 'Bank', val: 'Mandiri' },
                { label: 'Account No', val: '1030099991461' },
                { label: 'Account Holder', val: 'IAGI' },
            ];
        }
        return lines.map(line => {
            const colonIdx = line.indexOf(':');
            if (colonIdx !== -1) {
                const label = line.substring(0, colonIdx).replace(/\.$/, '').trim();
                const val = line.substring(colonIdx + 1).trim();
                return { label, val };
            }
            return { label: '', val: line };
        });
    }, [bankInfo]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f1f5f9',
                py: { xs: 2, md: 5 },
                color: '#0f172a',
                '@media print': {
                    bgcolor: '#ffffff !important',
                    p: 0,
                    m: 0,
                    minHeight: 'auto',
                },
            }}
        >
            <Head title={`${headerReceiptNumber} - ${payment.payment_code || 'Official Receipt'}`}>
                <style>{`
                    @page {
                        size: A4 portrait;
                        margin: 8mm 10mm;
                    }
                    @media print {
                        html, body {
                            background-color: #ffffff !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            height: 100% !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .no-print {
                            display: none !important;
                        }
                        [contenteditable="true"] {
                            outline: none !important;
                            border: none !important;
                            box-shadow: none !important;
                            background: transparent !important;
                        }
                        .receipt-paper-box {
                            border: 1.5px solid #cbd5e1 !important;
                            border-radius: 16px !important;
                            padding: 22px 26px !important;
                            box-shadow: none !important;
                            margin: 0 auto !important;
                            max-width: 100% !important;
                            min-height: 268mm !important;
                            display: flex !important;
                            flex-direction: column !important;
                            justify-content: space-between !important;
                            box-sizing: border-box !important;
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                    }
                `}</style>
            </Head>

            <Container maxWidth="md" sx={{ '@media print': { maxWidth: '100% !important', p: '0 !important', m: '0 !important' } }}>
                {/* ACTION BAR (Hidden when printing) */}
                <Box
                    className="no-print"
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 2,
                        '@media print': { display: 'none !important' },
                    }}
                >
                    <Button
                        component={Link}
                        href={route('visitor.payment.status', payment.payment_code)}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: '#094d42',
                            fontWeight: 700,
                            bgcolor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            px: 2,
                            py: 0.8,
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#f8fafc', borderColor: '#094d42' },
                        }}
                    >
                        Back to Payment Status
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Button
                            variant={showCustomToolbar ? 'contained' : 'outlined'}
                            startIcon={<TuneIcon />}
                            onClick={() => setShowCustomToolbar(prev => !prev)}
                            sx={{
                                bgcolor: showCustomToolbar ? '#0f766e' : '#ffffff',
                                color: showCustomToolbar ? '#ffffff' : '#094d42',
                                borderColor: '#0f766e',
                                fontWeight: 700,
                                borderRadius: '10px',
                                textTransform: 'none',
                                px: 2,
                                py: 0.8,
                                '&:hover': {
                                    bgcolor: showCustomToolbar ? '#0d5d57' : '#f0fdf4',
                                    borderColor: '#094d42',
                                },
                            }}
                        >
                            {showCustomToolbar ? 'Tutup Panel Cetak' : '🎛️ Kustomisasi Cetak (Bulan / Tanggal)'}
                            {isCustomized && (
                                <Chip
                                    label="Aktif"
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        height: 20,
                                        fontSize: '0.65rem',
                                        fontWeight: 900,
                                        bgcolor: showCustomToolbar ? '#fef08a' : '#22c55e',
                                        color: showCustomToolbar ? '#854d0e' : '#ffffff',
                                    }}
                                />
                            )}
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                            sx={{
                                bgcolor: '#094d42',
                                color: '#ffffff',
                                fontWeight: 800,
                                borderRadius: '10px',
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                boxShadow: '0 4px 12px rgba(9, 77, 66, 0.3)',
                                '&:hover': { bgcolor: '#063830' },
                            }}
                        >
                            Print / Download PDF
                        </Button>
                    </Box>
                </Box>

                {/* CUSTOMIZATION TOOLBAR PANEL (Hidden when printing) */}
                <Collapse in={showCustomToolbar} className="no-print">
                    <Paper
                        elevation={0}
                        sx={{
                            mb: 3,
                            p: { xs: 2, sm: 2.5 },
                            borderRadius: '16px',
                            bgcolor: '#ffffff',
                            border: '1.5px solid #14b8a6',
                            boxShadow: '0 10px 25px -5px rgba(20, 184, 166, 0.15)',
                        }}
                    >
                        {/* Header of Toolbar */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TuneIcon sx={{ color: '#0f766e', fontSize: 24 }} />
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                                        Kustomisasi Cetak Nota / Receipt
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                                        ✓ Data di database web tetap asli & aman. Perubahan di panel ini hanya berlaku saat mencetak atau mengunduh PDF.
                                    </Typography>
                                </Box>
                            </Box>

                            {isCustomized && (
                                <Button
                                    size="small"
                                    startIcon={<RestartAltIcon />}
                                    onClick={handleResetCustom}
                                    sx={{
                                        color: '#dc2626',
                                        borderColor: '#fca5a5',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        fontSize: '0.78rem',
                                        '&:hover': { bgcolor: '#fef2f2', borderColor: '#ef4444' },
                                    }}
                                    variant="outlined"
                                >
                                    Reset ke Data Asli
                                </Button>
                            )}
                        </Box>

                        {/* Quick Month Switcher */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.8 }}>
                                1. Pilih Bulan Nota Cepat (Ubah Angka Romawi /X/ jadi /XI/ dsb secara otomatis):
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                {MONTH_NAMES.map((m, idx) => {
                                    const isSelected = activeMonthIdx === idx;
                                    return (
                                        <Button
                                            key={m.num}
                                            size="small"
                                            variant={isSelected ? 'contained' : 'outlined'}
                                            onClick={() => handleSelectMonth(idx)}
                                            sx={{
                                                py: 0.5,
                                                px: 1.2,
                                                minWidth: 62,
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontSize: '0.75rem',
                                                fontWeight: isSelected ? 800 : 600,
                                                bgcolor: isSelected ? '#094d42 !important' : '#f8fafc',
                                                color: isSelected ? '#ffffff !important' : '#334155',
                                                borderColor: isSelected ? '#094d42' : '#cbd5e1',
                                                '&:hover': {
                                                    bgcolor: isSelected ? '#063830' : '#e2e8f0',
                                                    borderColor: '#094d42',
                                                },
                                            }}
                                        >
                                            <strong>{m.roman}</strong> &bull; {m.labelId.substring(0, 3)}
                                        </Button>
                                    );
                                })}
                            </Box>
                        </Box>

                        {/* Detailed Controls: Date & Receipt No */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mb: 0.5 }}>
                                    2. Tanggal Transaksi (Date Created):
                                </Typography>
                                <TextField
                                    type="date"
                                    size="small"
                                    fullWidth
                                    value={customDateVal || (pDate.toISOString().split('T')[0])}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    sx={{
                                        bgcolor: '#f8fafc',
                                        borderRadius: '8px',
                                        '& input': { fontSize: '0.82rem', py: 0.9 },
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mb: 0.5 }}>
                                    3. Nomor Receipt (Bisa diedit bebas jika perlu):
                                </Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    value={effectiveReceiptNumber}
                                    onChange={(e) => setCustomReceiptNo(e.target.value)}
                                    placeholder="Contoh: Receipt No. 085/PIT-IAGI/PY-R/XI/2026"
                                    sx={{
                                        bgcolor: '#f8fafc',
                                        borderRadius: '8px',
                                        '& input': { fontSize: '0.82rem', py: 0.9, fontFamily: 'monospace', fontWeight: 700 },
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Inline Tip */}
                        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.8, bgcolor: '#f0fdf4', p: 1, borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                            <InfoOutlinedIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                            <Typography variant="caption" sx={{ color: '#15803d', fontSize: '0.73rem', lineHeight: 1.3 }}>
                                <strong>Tip Praktis:</strong> Anda juga bisa langsung <em>mengklik teks Receipt No atau Tanggal</em> pada lembar tanda terima di bawah untuk mengetik perubahannya secara instan sebelum mencetak.
                            </Typography>
                        </Box>
                    </Paper>
                </Collapse>

                {/* OFFICIAL INVOICE & RECEIPT DOCUMENT */}
                <Paper
                    elevation={0}
                    className="receipt-paper-box"
                    sx={{
                        p: { xs: 3, sm: 4.5 },
                        borderRadius: '20px',
                        bgcolor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.07)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: { sm: '750px', md: '820px' },
                        justifyContent: 'space-between',
                        '@media print': {
                            p: '22px 26px !important',
                            borderRadius: '16px !important',
                            border: '1.5px solid #cbd5e1 !important',
                            boxShadow: 'none !important',
                            minHeight: '268mm !important',
                            display: 'flex !important',
                            flexDirection: 'column !important',
                            justifyContent: 'space-between !important',
                            boxSizing: 'border-box !important',
                            breakInside: 'avoid !important',
                            pageBreakInside: 'avoid !important',
                        },
                    }}
                >
                    {/* TOP & MIDDLE CONTENT WRAPPER */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* HEADER */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: 2, pb: 2, borderBottom: '2px solid #094d42', position: 'relative', zIndex: 1, '@media print': { pb: 1.5, flexWrap: 'nowrap !important' } }}>
                            <Box sx={{ maxWidth: { xs: '100%', sm: '60%' } }}>
                                <Box sx={{ mb: 1 }}>
                                    <Box
                                        component="img"
                                        src="/images/iagi-geosea-logo-banner.png"
                                        alt="55th PIT IAGI & GEOSEA XIX 2026 - Annual Scientific Convention & Exhibition"
                                        sx={{
                                            height: { xs: 45, sm: 55, md: 62 },
                                            width: 'auto',
                                            maxWidth: '100%',
                                            objectFit: 'contain',
                                            display: 'block',
                                        }}
                                    />
                                </Box>
                                <Typography variant="caption" sx={{ color: '#475569', display: 'block', lineHeight: 1.4, fontSize: '0.72rem' }}>
                                    <strong>Venue:</strong> {eventVenue}<br />
                                    <strong>Date:</strong> {eventDate} &bull; Yogyakarta, Indonesia<br />
                                    <strong>Host:</strong> Ikatan Ahli Geologi Indonesia (IAGI) & GEOSEA
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, minWidth: 200 }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: '#094d42', letterSpacing: '-0.02em', mb: 0.3, fontSize: { xs: '1.2rem', sm: '1.4rem' } }}>
                                    OFFICIAL RECEIPT
                                </Typography>
                                <Tooltip title="Klik untuk edit teks nomor receipt langsung sebelum mencetak" arrow placement="top">
                                    <Typography
                                        variant="subtitle2"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const text = e.currentTarget.textContent?.trim();
                                            if (text) {
                                                setCustomReceiptNo(text);
                                            }
                                        }}
                                        sx={{
                                            fontWeight: 800,
                                            color: '#094d42',
                                            fontFamily: 'monospace',
                                            fontSize: '0.78rem',
                                            mb: 0.8,
                                            bgcolor: isCustomized ? '#ecfdf5' : '#f0fdf4',
                                            border: isCustomized ? '1.5px dashed #059669' : '1px solid #bbf7d0',
                                            px: 1,
                                            py: 0.2,
                                            borderRadius: '6px',
                                            display: 'inline-block',
                                            cursor: 'text',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: '#059669',
                                                bgcolor: '#dcfce7',
                                            },
                                            '@media print': {
                                                border: '1px solid #bbf7d0 !important',
                                                bgcolor: '#f0fdf4 !important',
                                            },
                                        }}
                                    >
                                        {headerReceiptNumber}
                                    </Typography>
                                </Tooltip>
                                
                                <div>
                                    <Chip
                                        label={isApproved ? 'VERIFIED / PAID' : isRejected ? 'REJECTED' : 'AWAITING VERIFICATION'}
                                        sx={{
                                            bgcolor: isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
                                            color: isApproved ? '#15803d' : isRejected ? '#b91c1c' : '#92400e',
                                            fontWeight: 900,
                                            fontSize: '0.72rem',
                                            border: `1.5px solid ${isApproved ? '#86efac' : isRejected ? '#fca5a5' : '#fde68a'}`,
                                            height: 24,
                                        }}
                                    />
                                </div>
                            </Box>
                        </Box>

                        {/* METADATA INFO BAR */}
                        <Box sx={{ py: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, position: 'relative', zIndex: 1, '@media print': { py: 1.2, gap: 1.5, gridTemplateColumns: '1fr 1fr !important' } }}>
                            <Box sx={{ p: 1.8, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', '@media print': { p: 1.4 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        {payment.is_mixed_category ? 'Billed To (PIC / Company):' : 'Billed To:'}
                                    </Typography>
                                    {payment.is_mixed_category && (
                                        <Chip label="GROUP / CORPORATE" size="small" sx={{ height: 18, fontSize: '0.60rem', fontWeight: 900, bgcolor: '#094d42', color: '#fff' }} />
                                    )}
                                </Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.90rem' }}>
                                    {payment.is_mixed_category ? (payment.pic_name || primaryTicket.visitor_name) : (primaryTicket.visitor_name || 'Registered Delegate')}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.78rem', mt: 0.2, lineHeight: 1.5 }}>
                                    <strong>Email:</strong> {payment.is_mixed_category ? (payment.pic_email || primaryTicket.visitor_email || '-') : (primaryTicket.visitor_email || '-')}<br />
                                    <strong>Phone / WA:</strong> {payment.is_mixed_category ? (payment.pic_phone || primaryTicket.visitor_phone || '-') : (primaryTicket.visitor_phone || '-')}<br />
                                    <strong>Institution:</strong> {payment.is_mixed_category ? (payment.pic_institution || primaryTicket.visitor_institution || 'Corporate / Group') : (primaryTicket.visitor_institution || primaryTicket.institution || 'Individual')}
                                </Typography>
                            </Box>

                            <Box sx={{ p: 1.8, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', '@media print': { p: 1.4 } }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 0.6 }}>
                                    Transaction Details:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.78rem', lineHeight: 1.5 }}>
                                    <strong>Receipt No:</strong>{' '}
                                    <Tooltip title="Klik untuk edit langsung nomor receipt" arrow>
                                        <span
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const text = e.currentTarget.textContent?.trim();
                                                if (text) {
                                                    setCustomReceiptNo(text);
                                                }
                                            }}
                                            style={{
                                                fontFamily: 'monospace',
                                                fontWeight: 800,
                                                color: '#094d42',
                                                cursor: 'text',
                                                padding: '1px 4px',
                                                borderRadius: '4px',
                                                border: isCustomized ? '1px dashed #059669' : '1px solid transparent',
                                                backgroundColor: isCustomized ? '#ecfdf5' : 'transparent',
                                            }}
                                        >
                                            {cleanReceiptNumber}
                                        </span>
                                    </Tooltip>
                                    <br />
                                    <strong>Payment Code:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0f172a' }}>{payment.payment_code}</span><br />
                                    <strong>Date Created:</strong>{' '}
                                    <Tooltip title="Klik untuk edit langsung teks tanggal" arrow>
                                        <span
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const text = e.currentTarget.textContent?.trim();
                                                if (text) {
                                                    setCustomDateText(text);
                                                }
                                            }}
                                            style={{
                                                cursor: 'text',
                                                padding: '1px 4px',
                                                borderRadius: '4px',
                                                border: isCustomized ? '1px dashed #059669' : '1px solid transparent',
                                                backgroundColor: isCustomized ? '#ecfdf5' : 'transparent',
                                            }}
                                        >
                                            {effectiveDateFormatted}
                                        </span>
                                    </Tooltip>
                                    <br />
                                    <strong>Method:</strong> {payment.payment_method === 'cash_onsite' ? 'Onsite Cash (Cash / EDC)' : 'Mandiri Bank Transfer'}<br />
                                    <strong>Status:</strong> {isApproved ? `Verified (${payment.verified_at ? new Date(payment.verified_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified'})` : 'Awaiting Treasury Confirmation'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* PARTICIPANTS & ITEMS TABLE */}
                        <Box sx={{ mt: 0.5, mb: 2, position: 'relative', zIndex: 1, '@media print': { mb: 1.5 } }}>
                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: '#094d42' }}>
                                        <TableRow>
                                            <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.75rem', py: 0.8 }}>NO</TableCell>
                                            <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.75rem', py: 0.8 }}>PARTICIPANT</TableCell>
                                            <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.75rem', py: 0.8 }}>TICKET CATEGORY</TableCell>
                                            <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.75rem', py: 0.8 }}>TICKET CODE</TableCell>
                                            <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.75rem', py: 0.8 }}>AMOUNT (IDR)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tickets.map((t, idx) => {
                                            const cat = CATEGORY_MAP[t.visitor_type] || CATEGORY_MAP.non_exclusive;
                                            const price = Number(t.individual_price && Number(t.individual_price) > 0 
                                                ? t.individual_price 
                                                : (CATEGORY_PRICES[t.visitor_type] || payment.price_per_ticket || (totalAmount / (tickets.length || 1))));
                                            return (
                                                <TableRow key={t.id || idx} sx={{ '&:nth-of-type(even)': { bgcolor: '#f8fafc' } }}>
                                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.76rem', py: { xs: 0.8, sm: 1 }, '@media print': { py: '4px !important' } }}>{idx + 1}</TableCell>
                                                    <TableCell sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.80rem', py: { xs: 0.8, sm: 1 }, '@media print': { py: '4px !important' } }}>
                                                        {t.visitor_name}
                                                        {t.visitor_institution && (
                                                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.68rem', lineHeight: 1.2 }}>
                                                                {t.visitor_institution}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell sx={{ py: { xs: 0.8, sm: 1 }, '@media print': { py: '4px !important' } }}>
                                                        <Chip
                                                            label={cat.label}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 800,
                                                                fontSize: '0.65rem',
                                                                bgcolor: '#f1f5f9',
                                                                color: '#334155',
                                                                height: 20,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#0284c7', fontSize: '0.76rem', py: { xs: 0.8, sm: 1 }, '@media print': { py: '4px !important' } }}>
                                                        {t.ticket_code}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem', py: { xs: 0.8, sm: 1 }, '@media print': { py: '4px !important' } }}>
                                                        IDR {price.toLocaleString('id-ID')}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {/* Breakdown Rows */}
                                        {Number(payment.discount_amount || 0) > 0 && (
                                            <TableRow sx={{ bgcolor: '#fffbeb' }}>
                                                <TableCell colSpan={4} align="right" sx={{ fontWeight: 700, color: '#b45309', fontSize: '0.76rem', py: 0.6 }}>
                                                    Special Discount ({payment.discount_type === 'percent' ? `${Number(payment.discount_value)}%` : 'Nominal'}{payment.discount_notes ? ` - ${payment.discount_notes}` : ''}):
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, color: '#b45309', fontSize: '0.76rem', py: 0.6 }}>
                                                    - IDR {Number(payment.discount_amount).toLocaleString('id-ID')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {Number(payment.unique_code || 0) > 0 && (
                                            <>
                                                <TableRow sx={{ bgcolor: '#fafafa' }}>
                                                    <TableCell colSpan={4} align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.76rem', py: 0.6 }}>
                                                        Subtotal ({tickets.length} Participants):
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.76rem', py: 0.6 }}>
                                                        IDR {effectiveSubtotal.toLocaleString('id-ID')}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ bgcolor: '#fafafa' }}>
                                                    <TableCell colSpan={4} align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.76rem', py: 0.6 }}>
                                                        Payment Unique Code:
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.76rem', py: 0.6 }}>
                                                        IDR {Number(payment.unique_code).toLocaleString('id-ID')}
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )}
                                        <TableRow sx={{ bgcolor: '#ecfdf5' }}>
                                            <TableCell
                                                colSpan={3}
                                                sx={{
                                                    py: 1.2,
                                                    px: { xs: 1.5, sm: 2 },
                                                    verticalAlign: 'middle',
                                                    textAlign: 'left',
                                                    '@media print': { py: '4px !important', px: '8px !important' },
                                                }}
                                            >
                                                <Box sx={{ textAlign: 'left' }}>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 900,
                                                            color: '#0f172a',
                                                            fontSize: '0.72rem',
                                                            letterSpacing: '0.04em',
                                                            textTransform: 'uppercase',
                                                            mb: 0.2,
                                                            '@media print': { fontSize: '0.66rem !important', mb: '1px !important' },
                                                        }}
                                                    >
                                                        BANK ACCOUNT
                                                    </Typography>
                                                    <Typography
                                                        component="div"
                                                        sx={{
                                                            fontSize: '0.73rem',
                                                            color: '#1e293b',
                                                            lineHeight: 1.4,
                                                            fontWeight: 600,
                                                            '@media print': { fontSize: '0.66rem !important', lineHeight: '1.25 !important' },
                                                        }}
                                                    >
                                                        {bankLines.map((b, i) => (
                                                            <div key={i}>
                                                                <span style={{ fontWeight: 600 }}>{b.label ? `${b.label} : ` : ''}</span>
                                                                <span style={{ fontWeight: 600 }}>{b.val}</span>
                                                            </div>
                                                        ))}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    fontWeight: 900,
                                                    color: '#094d42',
                                                    fontSize: '0.88rem',
                                                    py: 1,
                                                    verticalAlign: 'middle',
                                                    whiteSpace: 'nowrap',
                                                    '@media print': { py: '4px !important', fontSize: '0.82rem !important' },
                                                }}
                                            >
                                                TOTAL PAYMENT:
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    fontWeight: 900,
                                                    color: '#094d42',
                                                    fontSize: '0.98rem',
                                                    py: 1,
                                                    verticalAlign: 'middle',
                                                    whiteSpace: 'nowrap',
                                                    '@media print': { py: '4px !important', fontSize: '0.90rem !important' },
                                                }}
                                            >
                                                IDR {totalAmount.toLocaleString('id-ID')}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* OFFICIAL AMOUNT RECEIVED & PAYMENT DETAILS (PROFESSIONAL TYPOGRAPHIC BOX, NO ICONS) */}
                            <Box
                                sx={{
                                    mt: 1.4,
                                    p: { xs: 1.5, sm: 1.8 },
                                    bgcolor: '#f8fafc',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    '@media print': {
                                        mt: 1,
                                        p: 1.2,
                                        bgcolor: '#ffffff !important',
                                        border: '1px solid #cbd5e1 !important',
                                    },
                                }}
                            >
                                {/* 1. AMOUNT RECEIVED */}
                                <Box sx={{ pb: 1, mb: 1, borderBottom: '1px solid #e2e8f0', '@media print': { pb: 0.8, mb: 0.8 } }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 800,
                                            color: '#64748b',
                                            fontSize: '0.67rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            display: 'block',
                                            mb: 0.3,
                                        }}
                                    >
                                        Amount Received
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '0.80rem',
                                            color: '#0f172a',
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        {amountInWords}
                                    </Typography>
                                </Box>

                                {/* 2. PAYMENT FOR */}
                                <Box sx={{ pb: 1, mb: 1, borderBottom: '1px solid #e2e8f0', '@media print': { pb: 0.8, mb: 0.8 } }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 800,
                                            color: '#64748b',
                                            fontSize: '0.67rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            display: 'block',
                                            mb: 0.3,
                                        }}
                                    >
                                        Payment For
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.80rem',
                                            fontWeight: 500,
                                            color: '#334155',
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        Registration Payment for the
                                        <strong
                                            style={{
                                                display: 'block',
                                                fontWeight: 800,
                                                color: '#094d42',
                                                marginTop: '2px',
                                            }}
                                        >
                                            55th IAGI Annual Scientific Meeting & Convention and GEOSEA XIX Regional Congress 2026
                                        </strong>
                                    </Typography>
                                </Box>

                                {/* 3. PAYMENT REMINDER (NO ICON, SLEEK PROFESSIONAL CALLOUT) */}
                                <Box
                                    sx={{
                                        p: { xs: 1.1, sm: 1.3 },
                                        borderRadius: '8px',
                                        bgcolor: '#eff6ff',
                                        border: '1px solid #bfdbfe',
                                        borderLeft: '4px solid #0284c7',
                                        '@media print': {
                                            p: 0.9,
                                            bgcolor: '#f8fafc !important',
                                            border: '1px solid #cbd5e1 !important',
                                            borderLeft: '4px solid #094d42 !important',
                                        },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            color: '#0369a1',
                                            fontSize: '0.74rem',
                                            mb: 0.2,
                                            '@media print': { color: '#094d42 !important' },
                                        }}
                                    >
                                        Payment Reminder:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: '#334155',
                                            fontSize: '0.74rem',
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        Please complete the payment at least <strong>7 days prior to the convention</strong>.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* SIGNATURE & AUTHENTICITY FOOTER (Anchored cleanly at bottom) */}
                    <Box sx={{ 
                        mt: 'auto', pt: 2, borderTop: '1.5px solid #e2e8f0', 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
                        flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: 2, position: 'relative', zIndex: 1,
                        '@media print': {
                            mt: 'auto !important',
                            pt: '12px !important',
                            flexWrap: 'nowrap !important',
                            gap: '16px !important',
                            breakInside: 'avoid !important',
                            pageBreakInside: 'avoid !important',
                        }
                    }}>
                        {/* QR Authentication */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, maxWidth: { xs: '100%', sm: '50%' }, '@media print': { maxWidth: '50% !important' } }}>
                            <Box sx={{ p: 0.8, bgcolor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'inline-block', flexShrink: 0 }}>
                                <QRCodeSVG value={route('visitor.payment.status', payment.payment_code)} size={64} level="M" />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', display: 'block', fontSize: '0.72rem', mb: 0.2 }}>
                                    OFFICIAL DIGITAL VALIDATION
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', maxWidth: 220, fontSize: '0.65rem', lineHeight: 1.3 }}>
                                    Scan QR code to verify the authenticity of this official receipt and delegate ticket on the PIT IAGI 2026 portal.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Secretariat Stamp Area */}
                        <Box sx={{ textAlign: 'center', minWidth: { xs: 200, sm: 240 }, '@media print': { minWidth: '220px !important' } }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.72rem', display: 'block', mb: 0.3 }}>
                                {effectiveDateFormatted}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', display: 'block', fontSize: '0.74rem' }}>
                                Organizing Committee 55ᵀᴴ PIT IAGI-GEOSEA XIX 2026
                            </Typography>
                            
                            {/* Space for Wet Stamp & Manual Signature */}
                            <Box sx={{ height: { xs: 75, sm: 85 }, '@media print': { height: '75px !important' } }} />
                            
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.84rem', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                                Dwi Grevani Hayuti
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: '#059669', mt: 0.2 }}>
                                <VerifiedIcon sx={{ fontSize: 15 }} />
                                <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                                    Treasurer of IAGI
                                </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.62rem', display: 'block', mt: 0.2 }}>
                                This digital document is officially verified and valid without a wet signature.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
