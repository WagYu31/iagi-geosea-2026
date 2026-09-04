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
    vip: { label: 'VIP', badge: 'VIP GUEST' },
    speaker: { label: 'Speaker', badge: 'KEYNOTE / SPEAKER' },
    panelist: { label: 'Panelist', badge: 'PANELIST DELEGATE' },
    moderator: { label: 'Moderator', badge: 'SESSION MODERATOR' },
    exhibition: { label: 'Exhibition', badge: 'EXHIBITOR BOOTH' },
    committee: { label: 'Committee', badge: 'ORGANIZING COMMITTEE' },
    student_volunteer: { label: 'Student Volunteer', badge: 'STUDENT VOLUNTEER' },
    iagi_member_professional: { label: 'IAGI Member - Professional', badge: 'IAGI MEMBER' },
    non_iagi_member_professional: { label: 'Non IAGI Member - Professional', badge: 'NON-MEMBER PRO' },
    iagi_member_expatriate: { label: 'IAGI Member - Expatriate', badge: 'IAGI EXPATRIATE' },
    non_iagi_member_expatriate: { label: 'Non IAGI Member - Expatriate', badge: 'INTERNATIONAL DELEGATE' },
    student_undergraduate: { label: 'Student Undergraduate', badge: 'STUDENT PASS' },
    exclusive: { label: 'Visitor Exclusive (VIP)', badge: 'VIP PASS' },
    non_exclusive: { label: 'Visitor', badge: 'FREE PASS' },
};

function numberToWordsIndo(num) {
    num = Math.floor(Math.abs(num));
    const words = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
    
    if (num < 12) return words[num];
    if (num < 20) return numberToWordsIndo(num - 10) + ' Belas';
    if (num < 100) return numberToWordsIndo(Math.floor(num / 10)) + ' Puluh ' + words[num % 10];
    if (num < 200) return 'Seratus ' + numberToWordsIndo(num - 100);
    if (num < 1000) return numberToWordsIndo(Math.floor(num / 100)) + ' Ratus ' + numberToWordsIndo(num % 100);
    if (num < 2000) return 'Seribu ' + numberToWordsIndo(num - 1000);
    if (num < 1000000) return numberToWordsIndo(Math.floor(num / 1000)) + ' Ribu ' + numberToWordsIndo(num % 1000);
    if (num < 1000000000) return numberToWordsIndo(Math.floor(num / 1000000)) + ' Juta ' + numberToWordsIndo(num % 1000000);
    if (num < 1000000000000) return numberToWordsIndo(Math.floor(num / 1000000000)) + ' Milyar ' + numberToWordsIndo(num % 1000000000);
    return num.toString();
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
    const terbilangText = totalAmount > 0 ? (numberToWordsIndo(totalAmount).trim() + ' Rupiah') : 'Nol Rupiah';

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
            <Head title={`Kwitansi & Invoice: ${payment.payment_code || 'Official Receipt'}`} />

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
                            color: '#475569',
                            bgcolor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: '10px',
                            px: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                            '&:hover': { bgcolor: '#f8fafc', color: '#094d42' },
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
                            textTransform: 'none',
                            borderRadius: '10px',
                            px: 3,
                            py: 1,
                            boxShadow: '0 4px 12px rgba(9, 77, 66, 0.3)',
                            '&:hover': { bgcolor: '#063830' },
                        }}
                    >
                        🖨️ Cetak / Download PDF
                    </Button>
                </Box>

                {/* OFFICIAL INVOICE & KWITANSI DOCUMENT */}
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
                        {isApproved ? 'LUNAS / PAID' : isRejected ? 'REJECTED' : 'AWAITING PAYMENT'}
                    </Box>

                    {/* HEADER */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2.5, pb: 3, borderBottom: '2px solid #094d42', position: 'relative', zIndex: 1 }}>
                        <Box sx={{ maxWidth: { xs: '100%', sm: '60%' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: '#094d42', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.4rem' }}>
                                    🏛️
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#094d42', lineHeight: 1.15, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
                                        55th PIT IAGI & GEOSEA XIX 2026
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                                        ANNUAL SCIENTIFIC CONVENTION & EXHIBITION
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#475569', display: 'block', lineHeight: 1.4, fontSize: '0.75rem' }}>
                                <strong>Venue:</strong> {eventVenue}<br />
                                <strong>Date:</strong> {eventDate} &bull; Yogyakarta, Indonesia<br />
                                <strong>Host:</strong> Ikatan Ahli Geologi Indonesia (IAGI) & GEOSEA
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, minWidth: 200 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#094d42', letterSpacing: '-0.02em', mb: 0.5 }}>
                                OFFICIAL RECEIPT
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.82rem', mb: 1 }}>
                                KWITANSI PEMBAYARAN RESMI
                            </Typography>
                            
                            <Chip
                                label={isApproved ? '✅ LUNAS / VERIFIED' : isRejected ? '❌ REJECTED' : '⏳ MENUNGGU VERIFIKASI'}
                                sx={{
                                    bgcolor: isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
                                    color: isApproved ? '#15803d' : isRejected ? '#b91c1c' : '#92400e',
                                    fontWeight: 900,
                                    fontSize: '0.75rem',
                                    border: `1.5px solid ${isApproved ? '#86efac' : isRejected ? '#fca5a5' : '#fde68a'}`,
                                    height: 26,
                                }}
                            />
                        </Box>
                    </Box>

                    {/* METADATA INFO BAR */}
                    <Box sx={{ py: 2.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1 }}>
                                👤 Ditujukan Kepada (Billed To):
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.95rem' }}>
                                {primaryTicket.visitor_name || 'Peserta Terdaftar'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem', mt: 0.3 }}>
                                <strong>Email:</strong> {primaryTicket.visitor_email || '-'}<br />
                                <strong>Phone / WA:</strong> {primaryTicket.visitor_phone || '-'}<br />
                                <strong>Institusi:</strong> {primaryTicket.visitor_institution || primaryTicket.institution || 'Individual'}
                            </Typography>
                        </Box>

                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1 }}>
                                📄 Rincian Transaksi:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.6 }}>
                                <strong>No. Pembayaran:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0f172a' }}>{payment.payment_code}</span><br />
                                <strong>Tanggal Dibuat:</strong> {new Date(payment.created_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                                <strong>Metode:</strong> {payment.payment_method === 'cash_onsite' ? 'Tunai Onsite (Cash / EDC)' : 'Transfer Bank Mandiri'}<br />
                                <strong>Status:</strong> {isApproved ? `Diverifikasi (${payment.verified_at ? new Date(payment.verified_at).toLocaleDateString('id-ID') : 'Verified'})` : 'Menunggu Konfirmasi Bendahara'}
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
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', py: 1.2 }}>NAMA PESERTA / DELEGATE</TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', py: 1.2 }}>KATEGORI TIKET</TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', py: 1.2 }}>KODE TIKET</TableCell>
                                        <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', py: 1.2 }}>BIAYA (IDR)</TableCell>
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
                                                Kode Unik Pembayaran:
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem' }}>
                                                Rp {Number(payment.unique_code).toLocaleString('id-ID')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow sx={{ bgcolor: '#ecfdf5' }}>
                                        <TableCell colSpan={4} align="right" sx={{ fontWeight: 900, color: '#094d42', fontSize: '0.95rem', py: 1.5 }}>
                                            TOTAL PEMBAYARAN:
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 900, color: '#094d42', fontSize: '1.05rem', py: 1.5 }}>
                                            Rp {totalAmount.toLocaleString('id-ID')}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* TERBILANG BOX */}
                        <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.78rem' }}>
                                <strong>Terbilang:</strong> <em>"{terbilangText}"</em>
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
                                    🛡️ VALIDASI RESMI DIGITAL
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', maxWidth: 240, fontSize: '0.68rem', lineHeight: 1.35 }}>
                                    Scan QR code untuk memverifikasi keaslian kwitansi dan tiket peserta secara langsung di portal PIT IAGI 2026.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Secretariat Stamp Area */}
                        <Box sx={{ textAlign: 'center', minWidth: 220 }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.74rem', display: 'block', mb: 0.5 }}>
                                Yogyakarta, {new Date(payment.created_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#094d42', display: 'block', mb: 4 }}>
                                Panitia Pelaksana PIT IAGI & GEOSEA 2026
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: '#059669' }}>
                                <VerifiedIcon sx={{ fontSize: 18 }} />
                                <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '0.76rem', letterSpacing: '0.04em' }}>
                                    TREASURY SECRETARIAT
                                </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', display: 'block' }}>
                                Dokumen digital ini sah tanpa tanda tangan basah.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
