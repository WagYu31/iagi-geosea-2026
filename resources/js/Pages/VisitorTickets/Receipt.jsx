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
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import VerifiedIcon from '@mui/icons-material/Verified';

const CATEGORY_MAP = {
    // Roles & Invitations
    vip: { label: 'VIP', badge: 'VIP' },
    speaker: { label: 'Speaker', badge: 'SPEAKER' },
    panelist: { label: 'Panelist', badge: 'PANELIST' },
    moderator: { label: 'Moderator', badge: 'MODERATOR' },
    exhibition: { label: 'Exhibition', badge: 'EXHIBITION' },
    committee: { label: 'Committee', badge: 'COMMITTEE' },
    student_volunteer: { label: 'Student Volunteer', badge: 'STUDENT VOLUNTEER' },

    // 1. Participant
    iagi_member_professional: { label: 'Professional (Member)', badge: 'PROFESSIONAL (MEMBER)' },
    non_iagi_member_professional: { label: 'Professional (Non-Member)', badge: 'PROFESSIONAL (NON-MEMBER)' },
    iagi_member_expatriate: { label: 'Expatriate (Member)', badge: 'EXPATRIATE (MEMBER)' },
    non_iagi_member_expatriate: { label: 'Expatriate (Non-Member)', badge: 'EXPATRIATE (NON-MEMBER)' },
    student_undergraduate: { label: 'Student Undergraduate', badge: 'STUDENT UNDERGRADUATE' },

    // 2. Visitor
    non_exclusive: { label: 'Visitor Pass (Free)', badge: 'VISITOR PASS (FREE)' },
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
    const totalAmount = Number(payment.total_amount || 0);
    const amountInWords = totalAmount > 0 ? (numberToWordsEn(totalAmount).trim() + ' Rupiah') : 'Zero Rupiah';

    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const pDate = new Date(payment.created_at || Date.now());
    const romanMonth = romanMonths[pDate.getMonth()] || 'VIII';
    const pYear = pDate.getFullYear() || 2026;
    const pNum = String(payment.id || 1).padStart(3, '0');
    const receiptNumber = payment.receipt_no || `Receipt No. ${pNum}/PIT55-GEOSEA/REC-R/${romanMonth}/${pYear}`;

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
                    bgcolor: '#ffffff',
                    p: 0,
                    minHeight: 'auto',
                },
            }}
        >
            <Head title={`${receiptNumber} - ${payment.payment_code || 'Official Receipt'}`} />

            <Container maxWidth="md">
                {/* ACTION BAR (Hidden when printing) */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        '@media print': { display: 'none' },
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
                        🖨️ Print / Download PDF
                    </Button>
                </Box>

                {/* OFFICIAL INVOICE & RECEIPT DOCUMENT */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: '20px',
                        bgcolor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.07)',
                        position: 'relative',
                        overflow: 'hidden',
                        '@media print': {
                            boxShadow: 'none',
                            border: 'none',
                            p: 0,
                            borderRadius: 0,
                        },
                    }}
                >
                    {/* WATERMARK */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '45%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(-30deg)',
                            fontSize: { xs: '3.5rem', sm: '5.5rem' },
                            fontWeight: 900,
                            color: isApproved ? 'rgba(16, 185, 129, 0.06)' : isRejected ? 'rgba(239, 68, 68, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                            userSelect: 'none',
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap',
                            zIndex: 0,
                            letterSpacing: '0.1em',
                        }}
                    >
                        {isApproved ? 'PAID / VERIFIED' : isRejected ? 'REJECTED' : 'AWAITING PAYMENT'}
                    </Box>

                    {/* HEADER */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2.5, pb: 3, borderBottom: '2px solid #094d42', position: 'relative', zIndex: 1 }}>
                        <Box sx={{ maxWidth: { xs: '100%', sm: '60%' } }}>
                            <Box sx={{ mb: 1.2 }}>
                                <Box
                                    component="img"
                                    src="/images/iagi-geosea-logo-banner.png"
                                    alt="55th PIT IAGI & GEOSEA XIX 2026 - Annual Scientific Convention & Exhibition"
                                    sx={{
                                        height: { xs: 50, sm: 62, md: 70 },
                                        width: 'auto',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                />
                            </Box>
                            <Typography variant="caption" sx={{ color: '#475569', display: 'block', lineHeight: 1.45, fontSize: '0.75rem' }}>
                                <strong>Venue:</strong> {eventVenue}<br />
                                <strong>Date:</strong> {eventDate} &bull; Yogyakarta, Indonesia<br />
                                <strong>Host:</strong> Ikatan Ahli Geologi Indonesia (IAGI) & GEOSEA
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, minWidth: 220 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#094d42', letterSpacing: '-0.02em', mb: 0.3 }}>
                                OFFICIAL RECEIPT
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 800,
                                    color: '#094d42',
                                    fontFamily: 'monospace',
                                    fontSize: '0.82rem',
                                    mb: 1,
                                    bgcolor: '#f0fdf4',
                                    border: '1px solid #bbf7d0',
                                    px: 1.2,
                                    py: 0.3,
                                    borderRadius: '6px',
                                    display: 'inline-block',
                                }}
                            >
                                {receiptNumber}
                            </Typography>
                            
                            <div>
                                <Chip
                                    label={isApproved ? '✅ VERIFIED / PAID' : isRejected ? '❌ REJECTED' : '⏳ AWAITING VERIFICATION'}
                                    sx={{
                                        bgcolor: isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
                                        color: isApproved ? '#15803d' : isRejected ? '#b91c1c' : '#92400e',
                                        fontWeight: 900,
                                        fontSize: '0.75rem',
                                        border: `1.5px solid ${isApproved ? '#86efac' : isRejected ? '#fca5a5' : '#fde68a'}`,
                                        height: 26,
                                    }}
                                />
                            </div>
                        </Box>
                    </Box>

                    {/* METADATA INFO BAR */}
                    <Box sx={{ py: 2.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1 }}>
                                👤 Billed To:
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.95rem' }}>
                                {primaryTicket.visitor_name || 'Registered Delegate'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem', mt: 0.3 }}>
                                <strong>Email:</strong> {primaryTicket.visitor_email || '-'}<br />
                                <strong>Phone / WA:</strong> {primaryTicket.visitor_phone || '-'}<br />
                                <strong>Institution:</strong> {primaryTicket.visitor_institution || primaryTicket.institution || 'Individual'}
                            </Typography>
                        </Box>

                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1 }}>
                                📄 Transaction Details:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.6 }}>
                                <strong>Receipt No:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#094d42' }}>{receiptNumber.replace(/^Receipt No\.\s*/i, '')}</span><br />
                                <strong>Payment Code:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0f172a' }}>{payment.payment_code}</span><br />
                                <strong>Date Created:</strong> {new Date(payment.created_at || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                                <strong>Method:</strong> {payment.payment_method === 'cash_onsite' ? 'Onsite Cash (Cash / EDC)' : 'Mandiri Bank Transfer'}<br />
                                <strong>Status:</strong> {isApproved ? `Verified (${payment.verified_at ? new Date(payment.verified_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified'})` : 'Awaiting Treasury Confirmation'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* PARTICIPANTS & ITEMS TABLE */}
                    <Box sx={{ mt: 1, mb: 3, position: 'relative', zIndex: 1 }}>
                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: '#094d42' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', py: 1.2 }}>NO</TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', py: 1.2 }}>PARTICIPANT</TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', py: 1.2 }}>TICKET CATEGORY</TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', py: 1.2 }}>TICKET CODE</TableCell>
                                        <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', py: 1.2 }}>AMOUNT (IDR)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tickets.map((t, idx) => {
                                        const cat = CATEGORY_MAP[t.visitor_type] || CATEGORY_MAP.non_exclusive;
                                        const price = Number(payment.price_per_ticket || (totalAmount / (tickets.length || 1)));
                                        return (
                                            <TableRow key={t.id || idx} sx={{ '&:nth-of-type(even)': { bgcolor: '#f8fafc' } }}>
                                                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{idx + 1}</TableCell>
                                                <TableCell sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.84rem' }}>
                                                    {t.visitor_name}
                                                    {t.visitor_institution && (
                                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                                                            {t.visitor_institution}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={cat.label}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 800,
                                                            fontSize: '0.68rem',
                                                            bgcolor: '#f1f5f9',
                                                            color: '#334155',
                                                            height: 22,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#0284c7', fontSize: '0.8rem' }}>
                                                    {t.ticket_code}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                                                    Rp {price.toLocaleString('id-ID')}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {/* Breakdown Rows */}
                                    {payment.unique_code > 0 && (
                                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                                            <TableCell colSpan={4} align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem' }}>
                                                Payment Unique Code:
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem' }}>
                                                Rp {Number(payment.unique_code).toLocaleString('id-ID')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow sx={{ bgcolor: '#ecfdf5' }}>
                                        <TableCell colSpan={4} align="right" sx={{ fontWeight: 900, color: '#094d42', fontSize: '0.95rem', py: 1.5 }}>
                                            TOTAL PAYMENT:
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 900, color: '#094d42', fontSize: '1.05rem', py: 1.5 }}>
                                            Rp {totalAmount.toLocaleString('id-ID')}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* TERBILANG & IN PAYMENT OF BOX */}
                        <Box sx={{ mt: 1.5, p: 1.8, bgcolor: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.78rem', display: 'block', mb: 0.8 }}>
                                <strong>Amount Received:</strong> <em>"{amountInWords}"</em>
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.78rem', display: 'block', lineHeight: 1.4 }}>
                                <strong>In Payment of:</strong> Registration Payment for the 55th IAGI Annual Scientific Meeting & Convention and GEOSEA XIX Regional Congress 2026
                            </Typography>
                        </Box>
                    </Box>

                    {/* SIGNATURE & AUTHENTICITY FOOTER */}
                    <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3, position: 'relative', zIndex: 1 }}>
                        {/* QR Authentication */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1, bgcolor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'inline-block' }}>
                                <QRCodeSVG value={route('visitor.payment.status', payment.payment_code)} size={74} level="M" />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', display: 'block', fontSize: '0.74rem' }}>
                                    🛡️ OFFICIAL DIGITAL VALIDATION
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', maxWidth: 240, fontSize: '0.68rem', lineHeight: 1.35 }}>
                                    Scan QR code to verify the authenticity of this official receipt and delegate ticket on the PIT IAGI 2026 portal.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Secretariat Stamp Area */}
                        <Box sx={{ textAlign: 'center', minWidth: { xs: 220, sm: 260 } }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.74rem', display: 'block', mb: 0.5 }}>
                                Yogyakarta, {new Date(payment.created_at || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', display: 'block' }}>
                                Organizing Committee 55ᵀᴴ PIT IAGI-GEOSEA XIX 2026
                            </Typography>
                            
                            {/* Space for Wet Stamp & Manual Signature */}
                            <Box sx={{ height: { xs: 75, sm: 85 } }} />
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: '#059669' }}>
                                <VerifiedIcon sx={{ fontSize: 18 }} />
                                <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '0.76rem', letterSpacing: '0.04em' }}>
                                    TREASURER SECRETARIAT
                                </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', display: 'block', mt: 0.3 }}>
                                This digital document is officially verified and valid without a wet signature.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
