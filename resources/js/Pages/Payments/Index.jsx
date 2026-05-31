import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Dialog, DialogContent,
    DialogActions, IconButton, Stack, Card, CardContent, useTheme,
    CircularProgress, Snackbar, Alert, Divider, LinearProgress, Tooltip,
    Fade, Checkbox, FormControlLabel, Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/* ─── Payment Method config ─── */
const PAYMENT_METHODS = [
    {
        key: 'bank_transfer',
        label: 'Bank Transfer',
        description: 'Virtual Account (BCA, BNI, BRI, Mandiri, Permata)',
        icon: AccountBalanceIcon,
        lottieUrl: 'https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
        glowColor: 'rgba(59,130,246,0.35)',
        enabledPayments: ['bca_va', 'bni_va', 'bri_va', 'echannel', 'permata_va', 'other_va'],
        logos: ['BCA', 'BNI', 'BRI', 'Mandiri'],
    },
    {
        key: 'ewallet_qris',
        label: 'E-Wallet & QRIS',
        description: 'GoPay, ShopeePay, DANA, LinkAja, OVO via QRIS',
        icon: QrCode2Icon,
        lottieUrl: 'https://lottie.host/f2102e03-37cf-4ad0-b1af-d0e3ef52c6e6/SBRLNJbv4H.lottie',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
        glowColor: 'rgba(16,185,129,0.35)',
        enabledPayments: ['gopay', 'shopeepay', 'qris'],
        logos: ['GoPay', 'QRIS'],
    },
    {
        key: 'credit_card',
        label: 'Credit / Debit Card',
        description: 'Visa, Mastercard, JCB, American Express',
        icon: CreditCardIcon,
        lottieUrl: 'https://lottie.host/b7e8c80e-9840-4e9f-8b6a-dba54ddb02d5/jlFpQOlIWl.lottie',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)',
        glowColor: 'rgba(139,92,246,0.35)',
        enabledPayments: ['credit_card'],
        logos: ['Visa', 'MC', 'JCB'],
    },
    {
        key: 'cstore',
        label: 'Convenience Store',
        description: 'Pay at Indomaret or Alfamart',
        icon: StorefrontIcon,
        lottieUrl: 'https://lottie.host/ae78de72-b2f2-4e6d-8ed2-5cdd4f950cae/SgFKCL0bXh.lottie',
        color: '#f97316',
        gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
        glowColor: 'rgba(249,115,22,0.35)',
        enabledPayments: ['indomaret', 'alfamart'],
        logos: ['Indomaret', 'Alfamart'],
    },
];

/* ─── Category config ─── */
const CATEGORIES = {
    'professional': { 
        label: 'Professional & IAGI Member', 
        short: 'Professional', 
        color: '#6366f1', 
        lightColor: '#a5b4fc', 
        badgeBg: 'rgba(99,102,241,0.12)',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        description: 'For professionals and IAGI organization members',
        features: ['Full conference access', 'Networking sessions', 'Conference materials', 'Certificate of attendance'],
        recommended: true,
    },
    'international': { 
        label: 'International Delegate', 
        short: 'International', 
        color: '#ec4899', 
        lightColor: '#f9a8d4', 
        badgeBg: 'rgba(236,72,153,0.12)',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        description: 'For international participants (Non-IAGI)',
        features: ['Full conference access', 'Networking sessions', 'Conference materials', 'International delegate kit'],
    },
    'student': { 
        label: 'Student', 
        short: 'Student', 
        color: '#2563eb', 
        lightColor: '#93c5fd', 
        badgeBg: 'rgba(37,99,235,0.12)',
        gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        description: 'For undergraduate/postgraduate students',
        features: ['Full conference access', 'Student workshop', 'Conference materials', 'Student certificate'],
    },
};

const CAT_ICONS = { 
    'professional': BusinessCenterIcon, 
    'international': PublicIcon, 
    'student': SchoolIcon 
};

function CatIcon({ category, size = 20, color }) {
    const Icon = CAT_ICONS[(category || '').toLowerCase()] || PaymentIcon;
    return <Icon sx={{ fontSize: size, color: color || '#6b7280' }} />;
}

export default function Index({ payments = [], submissions = [], midtrans_client_key, pricing: rawPricing = {} }) {
    const theme = useTheme();
    const c = theme.palette.custom;
    const isDark = theme.palette.mode === 'dark';
    const { auth } = usePage().props;
    const user = auth?.user;

    const pricing = {};
    if (rawPricing && typeof rawPricing === 'object') {
        Object.keys(rawPricing).forEach(k => { pricing[k.toLowerCase()] = rawPricing[k]; });
    }

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [mounted, setMounted] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    useEffect(() => { setMounted(true); }, []);

    const getSubFee = (sub) => (!sub || !sub.participant_category) ? null : (pricing[sub.participant_category.toLowerCase()] || null);
    const getSubCat = (sub) => (!sub || !sub.participant_category) ? null : (CATEGORIES[sub.participant_category.toLowerCase()] || null);

    const isPaymentCompleted = (payment) => {
        if (!payment) return false;
        return payment.status === 'paid' || payment.verified == true || !!payment.paid_at;
    };

    // Helper: find payment for a submission (loose ID comparison to handle string/number)
    const findPaymentForSub = (subId) => payments.find(p => p.submission_id == subId);

    // All accepted submissions (both paid and unpaid) for the panel
    const acceptedSubmissions = submissions.filter(sub =>
        sub.status && sub.status.toLowerCase() === 'accepted'
    );

    // Only unpaid ones (for count + preventing double pay)
    const submissionsNeedingPayment = acceptedSubmissions.filter(sub => {
        return !isPaymentCompleted(findPaymentForSub(sub.id));
    });

    const handleOpenDialog = (sub) => {
        // Guard: prevent opening checkout for already-paid submissions
        const existingPayment = findPaymentForSub(sub.id);
        if (isPaymentCompleted(existingPayment)) {
            setSnackbar({ open: true, message: '✅ This submission has already been paid.', severity: 'info' });
            return;
        }
        setSelectedSubmission(sub);
        setAgreeTerms(false);
        setSelectedPaymentMethod(null);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => { setOpenDialog(false); setSelectedSubmission(null); setAgreeTerms(false); setSelectedPaymentMethod(null); };

    const waitForSnap = () => new Promise((resolve, reject) => {
        if (window.snap) return resolve(window.snap);
        let tries = 0;
        const interval = setInterval(() => {
            if (window.snap) { clearInterval(interval); resolve(window.snap); }
            if (++tries > 50) { clearInterval(interval); reject(new Error('Midtrans Snap failed to load. Please refresh.')); }
        }, 200);
    });

    const handleMidtransPayment = async () => {
        if (!selectedSubmission) return;
        const fee = getSubFee(selectedSubmission);
        if (!fee) { setSnackbar({ open: true, message: 'Fee not determined. Check category.', severity: 'warning' }); return; }
        setPaymentLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(route('payments.createSnapToken'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
                body: JSON.stringify({ 
                    submission_id: selectedSubmission.id,
                    payment_method: selectedPaymentMethod || null,
                }),
            });
            
            // Handle non-JSON response (e.g., 500 HTML error page)
            const contentType = res.headers.get('content-type') || '';
            let data;
            if (contentType.includes('application/json')) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error('Non-JSON response from snap-token:', res.status, text.substring(0, 500));
                throw new Error(`Server error (${res.status}). Check server logs.`);
            }
            
            if (!res.ok) {
                console.error('Snap token error:', res.status, data);
                throw new Error(data.error || data.message || `Payment failed (${res.status})`);
            }
            const currentOrderId = data.order_id;
            handleCloseDialog();
            const snap = await waitForSnap();

            // Helper: call backend to check & sync Midtrans status
            const syncPaymentStatus = async () => {
                try {
                    await fetch(route('payments.checkStatus'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
                        body: JSON.stringify({ order_id: currentOrderId }),
                    });
                } catch (err) { console.warn('Status sync failed:', err); }
            };

            snap.pay(data.snap_token, {
                onSuccess: async (result) => {
                    setSnackbar({ open: true, message: '✅ Payment successful! Updating status...', severity: 'success' });
                    await syncPaymentStatus();
                    setTimeout(() => router.reload(), 800);
                },
                onPending: (result) => {
                    setSnackbar({ open: true, message: '⏳ Payment pending. Complete your payment.', severity: 'info' });
                    setTimeout(() => router.reload(), 1500);
                },
                onError: (result) => {
                    setSnackbar({ open: true, message: 'Payment failed: ' + (result?.status_message || 'Unknown error'), severity: 'error' });
                    setTimeout(() => router.reload(), 2000);
                },
                onClose: async () => {
                    setSnackbar({ open: true, message: 'Checking payment status...', severity: 'info' });
                    await syncPaymentStatus();
                    setTimeout(() => router.reload(), 800);
                },
            });
        } catch (e) { setSnackbar({ open: true, message: e.message, severity: 'error' }); }
        finally { setPaymentLoading(false); }
    };

    const fmtRp = (n) => { try { return 'Rp ' + parseFloat(n).toLocaleString('id-ID'); } catch { return 'Rp ' + n; } };
    const fmtIdr = (n) => { try { return 'IDR ' + parseFloat(n).toLocaleString('id-ID'); } catch { return 'IDR ' + n; } };

    const getStatusChip = (p) => {
        const isPaid = p.status === 'paid' || p.verified;
        if (isPaid) return <Chip icon={<CheckCircleOutlineIcon sx={{ fontSize: 13, color: '#059669 !important' }} />} label="Paid" size="small" sx={{ fontWeight: 800, fontSize: '0.68rem', borderRadius: '20px', bgcolor: 'rgba(5,150,105,0.08)', color: '#059669', border: '1px solid rgba(5,150,105,0.12)' }} />;
        if (p.status === 'failed' || p.status === 'expired') return <Chip label={p.status === 'failed' ? 'Failed' : 'Expired'} size="small" sx={{ fontWeight: 800, fontSize: '0.68rem', borderRadius: '20px', bgcolor: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.12)' }} />;
        return <Chip icon={<AccessTimeIcon sx={{ fontSize: 13, color: '#d97706 !important' }} />} label="Pending" size="small" sx={{ fontWeight: 800, fontSize: '0.68rem', borderRadius: '20px', bgcolor: 'rgba(217,119,6,0.08)', color: '#d97706', border: '1px solid rgba(217,119,6,0.15)' }} />;
    };

    const getMethod = (p) => {
        if (!p.order_id) return 'Manual Upload';
        const map = { bank_transfer: 'Bank Transfer', gopay: 'GoPay', shopeepay: 'ShopeePay', qris: 'QRIS', credit_card: 'Credit Card', cstore: 'Minimarket', echannel: 'Mandiri Bill' };
        return map[p.payment_type] || 'Midtrans';
    };

    const selFee = selectedSubmission ? getSubFee(selectedSubmission) : null;
    const selCat = selectedSubmission ? getSubCat(selectedSubmission) : null;
    const totalPaid = payments.filter(p => p.status === 'paid' || p.verified).length;
    const totalPending = submissionsNeedingPayment.length;
    const totalAll = payments.length + submissionsNeedingPayment.length;
    const progressPercent = totalAll > 0 ? Math.round((totalPaid / totalAll) * 100) : 0;
    
    // First item's price for header, or total action amount
    const firstActionItemFee = submissionsNeedingPayment.length > 0 ? getSubFee(submissionsNeedingPayment[0]) : null;

    /* ─── Shared Card Style ─── */
    const cardBase = {
        borderRadius: '16px',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
        bgcolor: isDark ? 'rgba(17,24,39,0.65)' : 'white',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.02)',
    };

    return (
        <SidebarLayout>
            <Head title="Payment Center | IAGI-GEOSEA 2026" />
            <Box component="main" role="main" aria-label="Payment Center" sx={{ p: { xs: 2.5, sm: 3.5 }, maxWidth: '1440px', mx: 'auto', bgcolor: isDark ? '#0b0f17' : '#f4f6fa', minHeight: '100vh', transition: 'background-color 0.3s', pb: 6 }}>

                {/* ════════════════════════════════════════════
                    HERO — Premium Dark Teal Gradient (Stitch Mockup Match)
                ════════════════════════════════════════════ */}
                <Fade in={mounted} timeout={650}>
                    <Box sx={{
                        mb: 4, borderRadius: '20px', position: 'relative', overflow: 'hidden',
                        background: 'linear-gradient(to right, #0e3d3a 0%, #147060 25%, #1a8a7a 50%, #3bb99e 70%, #6dd4b8 85%, #a5e8d5 100%)',
                        boxShadow: '0 12px 36px rgba(12,46,53,0.15)',
                        p: { xs: 2.5, sm: 3, md: 3.5, lg: 5 },
                        border: '1px solid rgba(26,188,156,0.12)',
                    }}>
                        {/* === LARGE ARC / CIRCLE SHAPE === */}
                        <Box sx={{
                            position: 'absolute',
                            top: '-80%', left: '5%',
                            width: '75%', height: '260%',
                            borderRadius: '50%',
                            background: 'linear-gradient(160deg, rgba(14,61,58,0.85) 0%, rgba(20,112,96,0.5) 50%, rgba(59,185,158,0.2) 100%)',
                            boxShadow: '60px 0 120px -20px rgba(90,200,170,0.15)',
                            pointerEvents: 'none',
                        }} />
                        {/* Inner highlight on arc edge */}
                        <Box sx={{
                            position: 'absolute',
                            top: '-75%', left: '8%',
                            width: '70%', height: '250%',
                            borderRadius: '50%',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.05)',
                            pointerEvents: 'none',
                        }} />
                        {/* Bright mint glow (top-right corner) */}
                        <Box sx={{
                            position: 'absolute', top: '-60%', right: '-15%',
                            width: 650, height: 650, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(165,232,213,0.3) 0%, rgba(94,196,168,0.12) 40%, transparent 65%)',
                            filter: 'blur(30px)', pointerEvents: 'none',
                        }} />
                        
                        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 2, lg: 5 }, alignItems: 'center', justifyContent: 'space-between' }}>
                            {/* Column 1: Title and Subtitle */}
                            <Box sx={{ flex: 1.3, minWidth: 0 }}>
                                <Typography component="h1" sx={{
                                    fontWeight: 900, color: 'white',
                                    fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem', lg: '2.5rem' },
                                    letterSpacing: '-0.03em', lineHeight: 1.15, mb: 1.5,
                                    fontFamily: 'Inter, sans-serif',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                }}>
                                    Premium Conference
                                    <Box component="span" sx={{ display: 'block', mt: 0.5, color: '#2dd4bf' }}>Payment Center</Box>
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem', lg: '0.95rem' }, maxWidth: { xs: '100%', lg: 450 }, lineHeight: 1.6, fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>
                                    Complete your conference registration fee securely via bank transfer, e-wallet, QRIS, or credit card.
                                </Typography>
                            </Box>

                            {/* Column 2: 3D-like Frosted Glass Credit Card */}
                            <Box sx={{
                                flexShrink: 0,
                                perspective: '1000px',
                                display: { xs: 'none', lg: 'block' },
                            }}>
                                <Box sx={{
                                    width: 270, height: 168, borderRadius: '20px', p: 2.8,
                                    background: 'rgba(46, 204, 113, 0.15)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 60px -10px rgba(46, 204, 113, 0.12), inset 0 1px 0 rgba(255,255,255,0.15)',
                                    transition: 'all 0.5s ease',
                                    position: 'relative', overflow: 'hidden',
                                    transform: 'rotateY(-6deg) rotateX(3deg)',
                                    transformStyle: 'preserve-3d',
                                    '&::before': {
                                        content: '""', position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
                                        background: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 60%)',
                                    },
                                }}>
                                    {/* Card Name + Lock */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif' }}>IAGI CONFERENCE</Typography>
                                        <LockIcon sx={{ fontSize: 15, color: 'rgba(255,255,255,0.55)' }} />
                                    </Box>
                                    
                                    {/* Golden Metallic contact chip */}
                                    <Box sx={{
                                        width: 40, height: 30, borderRadius: '7px',
                                        background: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)',
                                        boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
                                        position: 'relative', overflow: 'hidden', mb: 2.5,
                                        border: '0.5px solid rgba(255,255,255,0.15)',
                                        '&::after': {
                                            content: '""', position: 'absolute', top: '35%', left: '15%', right: '15%', height: '1px', bgcolor: 'rgba(0,0,0,0.15)'
                                        }
                                    }} />

                                    {/* Card numbers dot matrix */}
                                    <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
                                        {[0,1,2,3].map(g => <Box key={g} sx={{ display: 'flex', gap: 0.4 }}>{[0,1,2,3].map(d => <Box key={d} sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: g < 3 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.65)' }} />)}</Box>)}
                                    </Box>

                                    {/* Card Valid + NFC Contactless icon */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.08em' }}>VALID</Typography>
                                            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700, mt: 0.1 }}>12/26</Typography>
                                        </Box>
                                        
                                        {/* NFC Contactless symbol */}
                                        <Box sx={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center' }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                                <path d="M8.5 16.5c-1.5-1.5-2.5-3.5-2.5-5.5s1-4 2.5-5.5"/>
                                                <path d="M12 19c-2.5-2-4-5-4-7.5s1.5-5.5 4-7.5"/>
                                                <path d="M15.5 21.5c-3.5-2.5-5.5-6.5-5.5-9.5s2-7 5.5-9.5"/>
                                            </svg>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Column 3: Payment Methods frosted card */}
                            <Box sx={{
                                flexShrink: 0,
                                width: 280,
                                display: { xs: 'none', lg: 'block' },
                                p: 3, borderRadius: '20px',
                                background: 'rgba(46, 204, 113, 0.12)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 40px -10px rgba(46, 204, 113, 0.08)',
                            }}>
                                <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', mb: 2, textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
                                    Payment Methods
                                </Typography>
                                
                                {/* Large Brand Logos */}
                                <Box sx={{ display: 'flex', gap: 1.2, justifyContent: 'center', mb: 2 }}>
                                    {/* VISA */}
                                    <Box sx={{ flex: 1, height: 38, borderRadius: '8px', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 1.2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                        <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#1a1f71', fontFamily: 'Inter, sans-serif', fontStyle: 'italic', letterSpacing: '-0.02em' }}>Visa</Typography>
                                    </Box>
                                    
                                    {/* MasterCard */}
                                    <Box sx={{ flex: 1, height: 38, borderRadius: '8px', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 1.2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                        <svg viewBox="0 0 80 48" style={{ height: 22, width: 'auto' }}>
                                            <circle cx="26" cy="24" r="18" fill="#eb001b" opacity="0.9" />
                                            <circle cx="54" cy="24" r="18" fill="#ff5f00" opacity="0.9" />
                                            <path d="M40 38c-3.5-3.2-5.6-7.8-5.6-12.8s2.1-9.6 5.6-12.8c3.5 3.2 5.6 7.8 5.6 12.8s-2.1 9.6-5.6 12.8z" fill="#f79e1b" />
                                        </svg>
                                    </Box>
                                    
                                    {/* QRIS */}
                                    <Box sx={{ flex: 1, height: 38, borderRadius: '8px', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 1.2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                        <Typography sx={{ fontWeight: 900, fontSize: '0.82rem', color: '#1F2937', fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}>QRIS</Typography>
                                    </Box>
                                </Box>

                                {/* Two-line Security Badges */}
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2.5 }}>
                                    {[
                                        { top: 'SSL', bottom: 'Encrypted' },
                                        { top: 'PCI', bottom: 'DSS' },
                                        { top: 'ISO', bottom: '27001' },
                                    ].map((badge) => (
                                        <Box key={badge.top} sx={{
                                            flex: 1, py: 0.8, borderRadius: '8px',
                                            bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                            textAlign: 'center',
                                        }}>
                                            <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)', lineHeight: 1.2, letterSpacing: '0.04em' }}>{badge.top}</Typography>
                                            <Typography sx={{ fontSize: '0.48rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', lineHeight: 1.2 }}>{badge.bottom}</Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Payment Progress */}
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>Payment Progress</Typography>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#2dd4bf', fontFamily: 'Inter, sans-serif' }}>{progressPercent}%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={progressPercent} sx={{
                                        height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)',
                                        '& .MuiLinearProgress-bar': { borderRadius: 3, background: 'linear-gradient(90deg, #10b981, #2dd4bf)' },
                                    }} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Fade>

                {/* ════════════════════════════════════════════
                    MIDDLE ROW — Pricing (Left) + Action (Right)
                ════════════════════════════════════════════ */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: submissionsNeedingPayment.length > 0 ? '1fr 380px' : '1fr' }, gap: 3, mb: 4 }}>
                    
                    {/* ─── Registration Tiers ─── */}
                    <Box>
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: { xs: '0.9rem', sm: '1.05rem' }, color: isDark ? '#f3f4f6' : '#111827', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>Registration Tiers</Typography>
                            <Box sx={{ flex: 1, height: 1, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb' }} />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: `repeat(${Object.keys(pricing).length || 3}, 1fr)` }, gap: 2 }}>
                            {Object.keys(pricing).map((catKey, idx) => {
                                const amount = pricing[catKey];
                                const cat = CATEGORIES[catKey] || { label: catKey, short: catKey, color: '#6b7280', badgeBg: 'rgba(107,114,128,0.1)', gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)', description: '', features: [] };
                                const isActive = submissionsNeedingPayment.some(s => s.participant_category && s.participant_category.toLowerCase() === catKey);
                                
                                return (
                                    <Fade key={catKey} in={mounted} timeout={450 + idx * 120}>
                                        <Card elevation={0} sx={{
                                            position: 'relative', overflow: 'hidden',
                                            borderRadius: '18px',
                                            border: isActive 
                                                ? `2px solid ${cat.color}` 
                                                : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'}`,
                                            bgcolor: isDark ? 'rgba(17,24,39,0.8)' : 'white',
                                            boxShadow: isActive 
                                                ? `0 0 0 3px ${cat.color}15, 0 10px 30px ${cat.color}10` 
                                                : (isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.03)'),
                                            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': { 
                                                transform: 'translateY(-6px)', 
                                                boxShadow: `0 20px 50px ${cat.color}12, 0 0 0 1px ${cat.color}25`,
                                            },
                                        }}>
                                            {/* ── Gradient Header Bar ── */}
                                            <Box sx={{ 
                                                height: 6, 
                                                background: cat.gradient,
                                                opacity: isActive ? 1 : 0.6,
                                            }} />
                                            
                                            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                                {/* Top section */}
                                                <Box sx={{ p: 3, pb: 2 }}>
                                                    {/* Recommended badge */}
                                                    {cat.recommended && (
                                                        <Box sx={{ 
                                                            display: 'inline-flex', alignItems: 'center', gap: 0.5, 
                                                            px: 1.2, py: 0.35, borderRadius: '20px', mb: 1.8,
                                                            background: cat.gradient,
                                                            boxShadow: `0 2px 8px ${cat.color}30`,
                                                        }}>
                                                            <StarIcon sx={{ fontSize: 11, color: 'white' }} />
                                                            <Typography sx={{ fontSize: '0.52rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif' }}>Recommended</Typography>
                                                        </Box>
                                                    )}

                                                    {/* Icon + Title */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                        <Box sx={{
                                                            width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 }, borderRadius: '12px',
                                                            background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}08)`,
                                                            border: `1.5px solid ${cat.color}20`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}>
                                                            <CatIcon category={catKey} size={22} color={cat.color} />
                                                        </Box>
                                                        <Box sx={{ minWidth: 0 }}>
                                                            <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: isDark ? '#f3f4f6' : '#111827', lineHeight: 1.25, fontFamily: 'Inter, sans-serif' }}>
                                                                {cat.label}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* Description */}
                                                    <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.72rem' }, color: isDark ? '#9ca3af' : '#6b7280', lineHeight: 1.5, mb: 1.5, fontFamily: 'Inter, sans-serif' }}>
                                                        {cat.description}
                                                    </Typography>

                                                    {/* Active Submission Indicator */}
                                                    {isActive && (
                                                        <Box sx={{ 
                                                            display: 'flex', alignItems: 'center', gap: 0.8, 
                                                            px: 1.5, py: 0.6, borderRadius: '8px',
                                                            bgcolor: `${cat.color}10`, border: `1px solid ${cat.color}25`,
                                                            mb: 2,
                                                        }}>
                                                            <Box sx={{ 
                                                                width: 7, height: 7, borderRadius: '50%', bgcolor: cat.color,
                                                                boxShadow: `0 0 6px ${cat.color}60`,
                                                                animation: 'pulse 2s infinite',
                                                            }} />
                                                            <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Inter, sans-serif' }}>
                                                                Your Submission
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    {/* Price */}
                                                    <Box sx={{ mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                                                            <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.25rem', sm: '1.5rem' }, color: isDark ? 'white' : '#111827', letterSpacing: '-0.03em', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
                                                                {fmtRp(amount)}
                                                            </Typography>
                                                        </Box>
                                                        <Typography sx={{ fontSize: '0.68rem', color: isDark ? '#6b7280' : '#9ca3af', mt: 0.3, fontFamily: 'Inter, sans-serif' }}>
                                                            per participant
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* ── Features ── */}
                                                <Box sx={{ 
                                                    px: 3, py: 2, 
                                                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'}`,
                                                    bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#fafbfd',
                                                }}>
                                                    <Typography sx={{ fontSize: '0.58rem', fontWeight: 800, color: isDark ? '#6b7280' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', mb: 1.2, fontFamily: 'Inter, sans-serif' }}>
                                                        What's included
                                                    </Typography>
                                                    {(cat.features || []).map((feature, fi) => (
                                                        <Box key={fi} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                                                            <CheckIcon sx={{ fontSize: 14, color: '#10b981' }} />
                                                            <Typography sx={{ fontSize: '0.72rem', color: isDark ? '#d1d5db' : '#4b5563', fontFamily: 'Inter, sans-serif' }}>
                                                                {feature}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* ─── Payment Status Panel ─── */}
                    {acceptedSubmissions.length > 0 && (
                        <Fade in={mounted} timeout={700}>
                            <Paper elevation={0} sx={{ 
                                borderRadius: '18px', overflow: 'hidden',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'}`,
                                bgcolor: isDark ? 'rgba(17,24,39,0.8)' : 'white',
                                boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.03)',
                                display: 'flex', flexDirection: 'column',
                                alignSelf: 'flex-start',
                            }}>
                                {/* Header */}
                                <Box sx={{
                                    px: 3, py: 2.5,
                                    background: submissionsNeedingPayment.length > 0
                                        ? (isDark 
                                            ? 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.04))' 
                                            : 'linear-gradient(135deg, #fffbeb, #fef3c7)')
                                        : (isDark
                                            ? 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04))'
                                            : 'linear-gradient(135deg, #ecfdf5, #d1fae5)'),
                                    borderBottom: `1px solid ${submissionsNeedingPayment.length > 0
                                        ? (isDark ? 'rgba(245,158,11,0.1)' : '#fde68a')
                                        : (isDark ? 'rgba(16,185,129,0.1)' : '#a7f3d0')}`,
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                        <Box sx={{ 
                                            width: 32, height: 32, borderRadius: '8px',
                                            bgcolor: submissionsNeedingPayment.length > 0
                                                ? (isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7')
                                                : (isDark ? 'rgba(16,185,129,0.15)' : '#d1fae5'),
                                            border: `1px solid ${submissionsNeedingPayment.length > 0
                                                ? (isDark ? 'rgba(245,158,11,0.2)' : '#fde68a')
                                                : (isDark ? 'rgba(16,185,129,0.2)' : '#a7f3d0')}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {submissionsNeedingPayment.length > 0
                                                ? <WarningAmberIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                                : <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                            }
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: submissionsNeedingPayment.length > 0 ? (isDark ? '#fbbf24' : '#92400e') : (isDark ? '#34d399' : '#065f46'), fontFamily: 'Inter, sans-serif' }}>
                                                {submissionsNeedingPayment.length > 0 ? 'Action Required' : 'Payment Status'}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.65rem', color: submissionsNeedingPayment.length > 0 ? (isDark ? '#d97706' : '#b45309') : (isDark ? '#6ee7b7' : '#047857'), fontFamily: 'Inter, sans-serif' }}>
                                                {submissionsNeedingPayment.length > 0
                                                    ? `${submissionsNeedingPayment.length} pending payment${submissionsNeedingPayment.length > 1 ? 's' : ''}`
                                                    : 'All payments completed ✓'
                                                }
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Submission Items */}
                                <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {acceptedSubmissions.map((sub) => {
                                        const fee = getSubFee(sub);
                                        const cat = getSubCat(sub);
                                        const payment = findPaymentForSub(sub.id);
                                        const isPaid = isPaymentCompleted(payment);

                                        return (
                                            <Box key={sub.id} sx={{
                                                p: 2.5, borderRadius: '14px',
                                                bgcolor: isPaid
                                                    ? (isDark ? 'rgba(16,185,129,0.04)' : '#f0fdf4')
                                                    : (isDark ? 'rgba(255,255,255,0.02)' : '#fafbfd'),
                                                border: `1px solid ${isPaid
                                                    ? (isDark ? 'rgba(16,185,129,0.12)' : '#bbf7d0')
                                                    : (isDark ? 'rgba(255,255,255,0.04)' : '#e5e7eb')}`,
                                                borderLeft: `4px solid ${isPaid ? '#10b981' : (cat?.color || '#6b7280')}`,
                                                transition: 'all 0.2s ease',
                                                '&:hover': { 
                                                    bgcolor: isPaid
                                                        ? (isDark ? 'rgba(16,185,129,0.06)' : '#ecfdf5')
                                                        : (isDark ? 'rgba(255,255,255,0.03)' : '#f5f6f8'),
                                                    boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
                                                },
                                            }}>
                                                {/* Title + Category */}
                                                <Box sx={{ mb: 1.5 }}>
                                                    <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: isDark ? '#f3f4f6' : '#111827', mb: 0.3, fontFamily: 'Inter, sans-serif' }} noWrap>
                                                        {sub.title}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: cat?.color || '#6b7280' }} />
                                                        <Typography sx={{ fontSize: '0.68rem', color: isDark ? '#9ca3af' : '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                                                            {cat ? cat.short : ''} · {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Price + Button/Badge */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: isDark ? 'white' : '#111827', fontVariantNumeric: 'tabular-nums', fontFamily: 'Inter, sans-serif' }}>
                                                        {fee ? fmtRp(fee) : '—'}
                                                    </Typography>
                                                    {isPaid ? (
                                                        <Chip
                                                            icon={<CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#059669 !important' }} />}
                                                            label="Paid"
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 800, fontSize: '0.72rem', borderRadius: '10px',
                                                                bgcolor: isDark ? 'rgba(16,185,129,0.12)' : '#d1fae5',
                                                                color: '#059669',
                                                                border: `1px solid ${isDark ? 'rgba(16,185,129,0.2)' : '#a7f3d0'}`,
                                                                px: 0.5,
                                                            }}
                                                        />
                                                    ) : (
                                                        <Button
                                                            variant="contained" size="small"
                                                            onClick={() => handleOpenDialog(sub)} disabled={!fee}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                boxShadow: '0 4px 14px rgba(16,185,129,0.2)',
                                                                '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 6px 18px rgba(16,185,129,0.3)' },
                                                                textTransform: 'none', borderRadius: '10px', fontWeight: 800, 
                                                                fontSize: '0.75rem', px: 2.5, py: 0.8,
                                                                fontFamily: 'Inter, sans-serif',
                                                            }}
                                                        >
                                                            Pay Now →
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Paper>
                        </Fade>
                    )}
                </Box>

                {/* ════════════════════════════════════════════
                    PAYMENT HISTORY TABLE
                ════════════════════════════════════════════ */}
                <Paper elevation={0} sx={{ 
                    borderRadius: '18px', overflow: 'hidden',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'}`,
                    bgcolor: isDark ? 'rgba(17,24,39,0.8)' : 'white',
                    boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.03)',
                }} role="region" aria-label="Payment History">
                    <Box sx={{
                        px: 3, py: 2.5,
                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb'}`,
                        background: isDark ? 'rgba(0,0,0,0.12)' : '#fafbfd',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ 
                                width: 36, height: 36, borderRadius: '10px',
                                bgcolor: isDark ? 'rgba(107,114,128,0.1)' : '#f1f5f9',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <ReceiptLongIcon sx={{ fontSize: 18, color: isDark ? '#6b7280' : '#94a3b8' }} />
                            </Box>
                            <Box>
                                <Typography component="h2" sx={{ fontWeight: 800, fontSize: '0.95rem', color: isDark ? '#f3f4f6' : '#111827', fontFamily: 'Inter, sans-serif' }}>Payment History</Typography>
                                <Typography sx={{ fontSize: '0.68rem', color: isDark ? '#9ca3af' : '#6b7280', mt: 0.1, fontFamily: 'Inter, sans-serif' }}>
                                    {payments.length > 0 ? `${payments.length} transaction${payments.length > 1 ? 's' : ''} recorded` : 'No transactions yet'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {payments.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
                            <Box sx={{ width: 68, height: 68, borderRadius: '16px', mx: 'auto', mb: 2.5, bgcolor: isDark ? 'rgba(26,188,156,0.03)' : '#f0fdf9', border: `1.5px dashed ${isDark ? 'rgba(26,188,156,0.1)' : '#a7f3d0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ReceiptLongIcon sx={{ color: isDark ? 'rgba(26,188,156,0.2)' : '#86efac', fontSize: 28 }} />
                            </Box>
                            <Typography sx={{ fontWeight: 800, color: isDark ? '#f3f4f6' : '#1f2937', fontSize: '0.98rem', mb: 0.5, fontFamily: 'Inter, sans-serif' }}>No Transactions Yet</Typography>
                            <Typography sx={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>Your payment history will appear here.</Typography>
                        </Box>
                    ) : (
                        <React.Fragment>
                            {/* Desktop Table View */}
                            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {['Submission', 'Category', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                                                    <TableCell key={h} sx={{
                                                        fontWeight: 800, fontSize: '0.64rem', color: isDark ? '#9ca3af' : '#6b7280', textTransform: 'uppercase',
                                                        letterSpacing: '0.1em', py: 2,
                                                        borderBottom: `1.5px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
                                                        bgcolor: isDark ? 'rgba(0,0,0,0.1)' : '#fafafa',
                                                        fontFamily: 'Inter, sans-serif'
                                                    }}>{h}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {payments.map((p) => {
                                                const pCatKey = (p.submission?.participant_category || '').toLowerCase();
                                                const pCat = CATEGORIES[pCatKey] || null;
                                                return (
                                                    <TableRow key={p.id} sx={{
                                                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' },
                                                        '&:last-child td': { borderBottom: 'none' },
                                                        '& td': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}`, py: 2, color: isDark ? '#d1d5db' : '#4b5563' },
                                                    }}>
                                                        <TableCell><Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: isDark ? '#f3f4f6' : '#1f2937' }} noWrap>{p.submission?.title || '—'}</Typography></TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: pCat?.color || '#6b7280', flexShrink: 0 }} />
                                                                <Typography sx={{ fontSize: '0.8rem', color: isDark ? '#d1d5db' : '#4b5563' }}>{pCat ? pCat.short : '—'}</Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell><Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: isDark ? '#f3f4f6' : '#1f2937', fontVariantNumeric: 'tabular-nums', fontFamily: 'Inter, sans-serif' }}>{p.amount ? fmtRp(p.amount) : '—'}</Typography></TableCell>
                                                        <TableCell><Typography sx={{ fontSize: '0.8rem' }}>{getMethod(p)}</Typography></TableCell>
                                                        <TableCell>{getStatusChip(p)}</TableCell>
                                                        <TableCell><Typography sx={{ fontSize: '0.78rem', color: isDark ? '#9ca3af' : '#6b7280', fontFamily: 'Inter, sans-serif' }}>{(p.paid_at || p.created_at) ? new Date(p.paid_at || p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</Typography></TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            
                            {/* Mobile Grid View */}
                            <Box sx={{ display: { xs: 'block', lg: 'none' }, p: 2 }}>
                                <Stack spacing={1.5}>
                                    {payments.map((p) => {
                                        const pCat = CATEGORIES[(p.submission?.participant_category || '').toLowerCase()] || null;
                                        return (
                                            <Card key={p.id} elevation={0} sx={{ borderRadius: '12px', border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, bgcolor: isDark ? 'rgba(17,24,39,0.5)' : '#fafafa' }}>
                                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: isDark ? '#34d399' : '#059669', fontFamily: 'Inter, sans-serif' }}>{p.amount ? fmtRp(p.amount) : '—'}</Typography>
                                                        {getStatusChip(p)}
                                                    </Box>
                                                    <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: isDark ? '#e5e7eb' : '#1f2937', mb: 0.5 }} noWrap>{p.submission?.title || '—'}</Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography sx={{ fontSize: '0.68rem', color: isDark ? '#9ca3af' : '#6b7280' }}>{pCat ? pCat.short : '—'} · {getMethod(p)}</Typography>
                                                        <Typography sx={{ fontSize: '0.68rem', color: isDark ? '#9ca3af' : '#6b7280', fontFamily: 'Inter, sans-serif' }}>{(p.paid_at || p.created_at) ? new Date(p.paid_at || p.created_at).toLocaleDateString('id-ID') : '—'}</Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        </React.Fragment>
                    )}
                </Paper>
            </Box>

            {/* ════════════════════════════════════════════
                CHECKOUT DIALOG
            ════════════════════════════════════════════ */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth
                PaperProps={{ sx: { 
                    borderRadius: '20px', overflow: 'hidden', 
                    bgcolor: isDark ? 'rgba(17,24,39,0.98)' : 'white', 
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                    boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
                } }}
            >
                {/* ─── Premium Header ─── */}
                <Box sx={{
                    px: 3.5, pt: 3, pb: 2.5, position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(145deg, #064e3b 0%, #065f46 35%, #047857 65%, #059669 100%)',
                }}>
                    <Box sx={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
                    <Box sx={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.02)' }} />
                    <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, px: 1.4, py: 0.4, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', mb: 1.2 }}>
                                <LockIcon sx={{ fontSize: 10, color: '#34d399' }} />
                                <Typography sx={{ fontSize: '0.5rem', fontWeight: 800, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: 'Inter, sans-serif' }}>Secure Payment</Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.3rem', color: 'white', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>Payment Checkout</Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', mt: 0.3, fontFamily: 'Inter, sans-serif' }}>
                                Order #{selectedSubmission ? `IAGI-${selectedSubmission.id}` : '---'}
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'rgba(255,255,255,0.4)', mt: -0.5, '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                            <CloseIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>
                </Box>

                <DialogContent sx={{ p: 0 }}>
                    {selectedSubmission && (
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: { md: 420 } }}>
                            
                            {/* ════════ LEFT COLUMN: Payment Methods ════════ */}
                            <Box sx={{ 
                                flex: '1 1 50%', 
                                px: 3, py: 2.5,
                                borderRight: { md: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}` },
                                borderBottom: { xs: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}`, md: 'none' },
                            }}>
                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: isDark ? '#d1d5db' : '#374151', mb: 1.5, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Select Payment Method
                                </Typography>
                                <Stack spacing={1}>
                                    {PAYMENT_METHODS.map((method) => {
                                        const isSelected = selectedPaymentMethod === method.key;
                                        const MethodIcon = method.icon;
                                        return (
                                            <Box
                                                key={method.key}
                                                onClick={() => setSelectedPaymentMethod(method.key)}
                                                sx={{
                                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                                    p: 1.5, borderRadius: '14px', cursor: 'pointer',
                                                    border: `1.5px solid ${isSelected
                                                        ? (isDark ? `${method.color}60` : `${method.color}50`)
                                                        : (isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0')}`,
                                                    bgcolor: isSelected
                                                        ? (isDark ? `${method.color}08` : `${method.color}06`)
                                                        : (isDark ? 'rgba(255,255,255,0.01)' : 'white'),
                                                    boxShadow: isSelected
                                                        ? `0 4px 16px ${method.glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`
                                                        : 'none',
                                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        borderColor: isSelected ? undefined : (isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1'),
                                                        bgcolor: isSelected ? undefined : (isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: isSelected ? undefined : '0 4px 12px rgba(0,0,0,0.06)',
                                                    },
                                                }}
                                            >
                                                {/* Radio with animated color */}
                                                {isSelected
                                                    ? <RadioButtonCheckedIcon sx={{ fontSize: 20, color: method.color, flexShrink: 0, filter: `drop-shadow(0 0 4px ${method.glowColor})` }} />
                                                    : <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: isDark ? '#4b5563' : '#cbd5e1', flexShrink: 0 }} />
                                                }
                                                {/* Premium Lottie icon box */}
                                                <Box sx={{
                                                    width: 48, height: 48, borderRadius: '14px',
                                                    background: isSelected ? method.gradient : (isDark ? `${method.color}10` : `${method.color}08`),
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                    boxShadow: isSelected
                                                        ? `0 6px 20px ${method.glowColor}`
                                                        : `0 2px 8px ${method.color}10`,
                                                    border: isSelected ? 'none' : `1px solid ${method.color}15`,
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    '&::after': isSelected ? {
                                                        content: '""', position: 'absolute', inset: 0,
                                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)',
                                                        borderRadius: '14px',
                                                    } : {},
                                                }}>
                                                    {method.lottieUrl ? (
                                                        <Box sx={{ 
                                                            width: 32, height: 32, position: 'relative', zIndex: 1,
                                                            filter: isSelected ? 'brightness(10) saturate(0)' : 'none',
                                                            transition: 'filter 0.3s ease',
                                                        }}>
                                                            <DotLottieReact
                                                                src={method.lottieUrl}
                                                                loop
                                                                autoplay
                                                                style={{ width: '100%', height: '100%' }}
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <MethodIcon sx={{ 
                                                            fontSize: 22, 
                                                            color: isSelected ? 'white' : method.color,
                                                            filter: isSelected ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' : 'none',
                                                            transition: 'all 0.25s ease',
                                                            position: 'relative', zIndex: 1,
                                                        }} />
                                                    )}
                                                </Box>
                                                {/* Label & description */}
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ 
                                                        fontSize: '0.8rem', fontWeight: 700, 
                                                        color: isSelected ? (isDark ? '#f3f4f6' : '#0f172a') : (isDark ? '#e5e7eb' : '#374151'),
                                                        fontFamily: 'Inter, sans-serif', lineHeight: 1.3,
                                                        transition: 'color 0.2s ease',
                                                    }}>
                                                        {method.label}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.6rem', color: isDark ? '#6b7280' : '#94a3b8', fontFamily: 'Inter, sans-serif', mt: 0.2 }} noWrap>
                                                        {method.description}
                                                    </Typography>
                                                </Box>
                                                {/* Brand logos */}
                                                <Box sx={{ display: 'flex', gap: 0.4, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 110 }}>
                                                    {method.logos.map(logo => (
                                                        <Box key={logo} sx={{
                                                            px: 0.8, py: 0.3, borderRadius: '5px', fontSize: '0.5rem',
                                                            fontWeight: 800, fontFamily: 'Inter, sans-serif',
                                                            bgcolor: isSelected
                                                                ? (isDark ? `${method.color}20` : `${method.color}10`)
                                                                : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                                                            color: isSelected ? method.color : (isDark ? '#9ca3af' : '#64748b'),
                                                            border: `1px solid ${isSelected ? `${method.color}25` : (isDark ? 'rgba(255,255,255,0.04)' : '#e2e8f0')}`,
                                                            transition: 'all 0.2s ease',
                                                        }}>{logo}</Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Stack>

                                {/* Security Badges */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                                    {[
                                        { icon: '🔒', text: '256-bit SSL' },
                                        { icon: '🛡️', text: 'PCI Certified' },
                                        { icon: '✓', text: 'Verified by Midtrans' },
                                    ].map(b => (
                                        <Box key={b.text} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Typography sx={{ fontSize: '0.55rem' }}>{b.icon}</Typography>
                                            <Typography sx={{ fontSize: '0.55rem', color: isDark ? '#6b7280' : '#94a3b8', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{b.text}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* ════════ RIGHT COLUMN: Order Summary ════════ */}
                            <Box sx={{ 
                                flex: '1 1 50%', 
                                px: 3, py: 2.5,
                                bgcolor: isDark ? 'rgba(255,255,255,0.01)' : '#fafbfc',
                                display: 'flex', flexDirection: 'column',
                            }}>
                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: isDark ? '#d1d5db' : '#374151', mb: 1.5, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Order Summary
                                </Typography>

                                {/* Paper / Submission Info */}
                                <Box sx={{ 
                                    mb: 2, p: 2, borderRadius: '12px', 
                                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'white', 
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`,
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{
                                            width: 40, height: 40, borderRadius: '10px',
                                            background: selCat ? `linear-gradient(135deg, ${selCat.color}15, ${selCat.color}08)` : 'rgba(107,114,128,0.1)',
                                            border: `1.5px solid ${selCat?.color || '#6b7280'}20`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <CatIcon category={selectedSubmission.participant_category} size={20} color={selCat?.color} />
                                        </Box>
                                        <Box sx={{ minWidth: 0, flex: 1 }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: isDark ? '#f3f4f6' : '#1f2937', fontFamily: 'Inter, sans-serif', mb: 0.2 }} noWrap>
                                                {selectedSubmission.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: selCat?.color || '#6b7280' }} />
                                                <Typography sx={{ fontSize: '0.65rem', color: isDark ? '#9ca3af' : '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                                                    {selCat?.label || selectedSubmission.participant_category || 'Unknown'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Receipt Breakdown */}
                                <Box sx={{ 
                                    borderRadius: '12px', overflow: 'hidden',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`,
                                    mb: 2,
                                }}>
                                    {[
                                        { label: 'Category', value: selCat?.short || selectedSubmission.participant_category || '—' },
                                        { label: 'Participant', value: user?.name || '—' },
                                        { label: 'Email', value: user?.email || '—' },
                                    ].map((row, i) => (
                                        <Box key={row.label} sx={{ 
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            px: 2, py: 1.2,
                                            bgcolor: i % 2 === 0 
                                                ? (isDark ? 'rgba(255,255,255,0.02)' : '#fafbfc') 
                                                : (isDark ? 'transparent' : 'white'),
                                            borderBottom: i < 2 ? `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9'}` : 'none',
                                        }}>
                                            <Typography sx={{ fontSize: '0.72rem', color: isDark ? '#9ca3af' : '#64748b', fontFamily: 'Inter, sans-serif' }}>{row.label}</Typography>
                                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: isDark ? '#e5e7eb' : '#1e293b', fontFamily: 'Inter, sans-serif' }}>{row.value}</Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Total Section */}
                                <Box sx={{ 
                                    p: 2, borderRadius: '12px',
                                    background: isDark 
                                        ? 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(16,185,129,0.04))' 
                                        : 'linear-gradient(135deg, #ecfdf5, #f0fdf4)',
                                    border: `1.5px solid ${isDark ? 'rgba(5,150,105,0.12)' : '#a7f3d0'}`,
                                    mb: 2,
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.6rem', color: isDark ? '#6ee7b7' : '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.1, fontFamily: 'Inter, sans-serif' }}>Total Amount</Typography>
                                            <Typography sx={{ fontSize: '0.62rem', color: isDark ? '#9ca3af' : '#6b7280', fontFamily: 'Inter, sans-serif' }}>Including all fees</Typography>
                                        </Box>
                                        <Typography sx={{ 
                                            fontSize: '1.5rem', fontWeight: 900, 
                                            color: isDark ? '#34d399' : '#047857',
                                            fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                                        }}>
                                            {selFee ? fmtRp(selFee) : '—'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Terms & Conditions */}
                                <Box sx={{
                                    p: 1.5, borderRadius: '10px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'white',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`,
                                    mb: 2,
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={agreeTerms}
                                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                                size="small"
                                                sx={{
                                                    color: isDark ? '#6b7280' : '#94a3b8',
                                                    '&.Mui-checked': { color: '#059669' },
                                                    p: 0.5,
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography sx={{
                                                fontSize: '0.65rem', color: isDark ? '#9ca3af' : '#64748b',
                                                fontFamily: 'Inter, sans-serif', lineHeight: 1.6, ml: 0.3,
                                            }}>
                                                I have read and agree to the{' '}
                                                <Link href="/privacy-policy" target="_blank" sx={{ color: '#059669', fontWeight: 700, textDecoration: 'underline', '&:hover': { color: '#10b981' } }}>Privacy Policy</Link>,{' '}
                                                <Link href="/terms-and-conditions" target="_blank" sx={{ color: '#059669', fontWeight: 700, textDecoration: 'underline', '&:hover': { color: '#10b981' } }}>Terms and Conditions</Link>{' '}and{' '}
                                                <Link href="/refund-policy" target="_blank" sx={{ color: '#059669', fontWeight: 700, textDecoration: 'underline', '&:hover': { color: '#10b981' } }}>Refund Policy</Link>.
                                            </Typography>
                                        }
                                        sx={{ alignItems: 'flex-start', m: 0, gap: 0 }}
                                    />
                                </Box>

                                {/* CTA Button */}
                                <Box sx={{ mt: 'auto' }}>
                                    <Button 
                                        variant="contained" 
                                        onClick={handleMidtransPayment} 
                                        disabled={paymentLoading || !selFee || !agreeTerms || !selectedPaymentMethod}
                                        fullWidth
                                        endIcon={paymentLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Box sx={{ fontSize: 16 }}>›</Box>}
                                        sx={{
                                            background: (agreeTerms && selectedPaymentMethod)
                                                ? 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)'
                                                : (isDark ? '#1f2937' : '#e2e8f0'),
                                            backgroundSize: '200% 100%',
                                            boxShadow: (agreeTerms && selectedPaymentMethod) ? '0 6px 20px rgba(5,150,105,0.25)' : 'none',
                                            '&:hover': { 
                                                backgroundPosition: '100% 0',
                                                boxShadow: '0 8px 28px rgba(5,150,105,0.35)',
                                            },
                                            '&:disabled': { background: isDark ? '#1f2937' : '#e2e8f0', boxShadow: 'none', color: isDark ? '#4b5563' : '#94a3b8' },
                                            textTransform: 'none', borderRadius: '12px', fontWeight: 800, 
                                            fontSize: '0.88rem', py: 1.5,
                                            fontFamily: 'Inter, sans-serif',
                                            letterSpacing: '-0.01em',
                                            transition: 'all 0.4s ease',
                                        }}
                                    >
                                        {paymentLoading ? 'Processing...' : 'Proceed to Secure Payment'}
                                    </Button>
                                    <Button 
                                        onClick={handleCloseDialog} 
                                        disabled={paymentLoading} 
                                        fullWidth
                                        sx={{ 
                                            mt: 1, color: isDark ? '#6b7280' : '#94a3b8', 
                                            textTransform: 'none', fontWeight: 600, fontSize: '0.75rem',
                                            '&:hover': { bgcolor: 'transparent', color: isDark ? '#9ca3af' : '#64748b' },
                                            fontFamily: 'Inter, sans-serif',
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem' }}>{snackbar.message}</Alert>
            </Snackbar>
        </SidebarLayout>
    );
}

