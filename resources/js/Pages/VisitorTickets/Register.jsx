import React, { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Chip,
    Stack,
    Divider,
    IconButton,
    Alert,
    CircularProgress,
    Tooltip,
    Paper,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import StarIcon from '@mui/icons-material/Star';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SecurityIcon from '@mui/icons-material/Security';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import VerifiedIcon from '@mui/icons-material/Verified';
import SparklesIcon from '@mui/icons-material/AutoAwesome';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Register({
    priceExclusive = 150000,
    priceNonExclusive = 0,
    enabled = true,
    qrisImage = null,
    bankTransferInfo = '',
    eventDate = 'October 2026',
    eventVenue = 'Grand Ballroom Hotel Indonesia, Jakarta',
}) {
    const [visitorType, setVisitorType] = useState('non_exclusive');
    const [paymentMethod, setPaymentMethod] = useState('qris_indo');
    const [members, setMembers] = useState([
        { name: '', email: '', phone: '', institution: '' }
    ]);
    const [proofFile, setProofFile] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [compressionStats, setCompressionStats] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        visitor_type: 'non_exclusive',
        members: members,
        payment_method: 'qris_indo',
        proof_of_payment: null,
        original_file_size_kb: null,
        compressed_file_size_kb: null,
    });

    const handleTypeChange = (type) => {
        setVisitorType(type);
        setData('visitor_type', type);
    };

    const handleMemberChange = (index, field, value) => {
        const updated = [...members];
        updated[index][field] = value;
        setMembers(updated);
        setData('members', updated);
    };

    const addMember = () => {
        const updated = [...members, { name: '', email: '', phone: '', institution: '' }];
        setMembers(updated);
        setData('members', updated);
    };

    const removeMember = (index) => {
        if (members.length === 1) return;
        const updated = members.filter((_, i) => i !== index);
        setMembers(updated);
        setData('members', updated);
    };

    const handleCopyBankInfo = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(bankTransferInfo);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2500);
        }
    };

    // 3D Card Tilt on Mouse Move
    const handleCardMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x: x * 15, y: y * -15 });
    };

    const handleCardMouseLeave = () => {
        setMousePos({ x: 0, y: 0 });
    };

    // Client-side auto-image compression via HTML5 Canvas
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const originalSizeKb = Math.round(file.size / 1024);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const MAX_DIM = 1600;
                    if (width > height && width > MAX_DIM) {
                        height = Math.round((height * MAX_DIM) / width);
                        width = MAX_DIM;
                    } else if (height > MAX_DIM) {
                        width = Math.round((width * MAX_DIM) / height);
                        height = MAX_DIM;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Canvas compression failed'));
                                return;
                            }
                            const compressedSizeKb = Math.round(blob.size / 1024);
                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve({
                                file: compressedFile,
                                originalSizeKb,
                                compressedSizeKb,
                                previewUrl: URL.createObjectURL(blob),
                            });
                        },
                        'image/jpeg',
                        0.75
                    );
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setCompressing(true);
            const result = await compressImage(file);
            setProofFile(result.file);
            setProofPreview(result.previewUrl);
            setCompressionStats({
                original: result.originalSizeKb,
                compressed: result.compressedSizeKb,
            });
            setData((prev) => ({
                ...prev,
                proof_of_payment: result.file,
                original_file_size_kb: result.originalSizeKb,
                compressed_file_size_kb: result.compressedSizeKb,
            }));
        } catch (error) {
            console.error('Image compression failed:', error);
            alert('Gagal memproses gambar. Silakan coba file lain.');
        } finally {
            setCompressing(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        for (let i = 0; i < members.length; i++) {
            if (!members[i].name || !members[i].email) {
                alert(`Harap lengkapi Nama dan Email untuk Peserta #${i + 1}`);
                return;
            }
        }

        if (visitorType === 'exclusive' && !proofFile) {
            alert('Harap unggah bukti pembayaran untuk pendaftaran Visitor Exclusive.');
            return;
        }

        post(route('visitor.tickets.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const totalEstimate = visitorType === 'exclusive' ? priceExclusive * members.length : 0;
    const isExclusive = visitorType === 'exclusive';
    const primaryMember = members[0] || { name: '', institution: '' };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f6f5f3', // Clean stone background like tasteskill.dev
                color: '#0f172a',
                position: 'relative',
                py: { xs: 3, md: 6 },
            }}
        >
            <Head title="Registrasi Tiket Penonton - 55th PIT IAGI & GEOSEA 2026" />

            {/* Subtle background gradient pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                        radial-gradient(at 0% 0%, rgba(13, 148, 136, 0.05) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(245, 158, 11, 0.04) 0px, transparent 50%),
                        radial-gradient(at 50% 100%, rgba(13, 148, 136, 0.03) 0px, transparent 50%)
                    `,
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 4, md: 6 } }}>
                {/* Header Navigation Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        px: 3,
                        borderRadius: '16px',
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
                        mb: 4,
                    }}
                >
                    <Button
                        component={Link}
                        href="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: '#334155',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            borderRadius: '10px',
                            px: 2,
                            py: 0.8,
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            '&:hover': {
                                color: '#094d42',
                                bgcolor: '#f1f5f9',
                                borderColor: '#cbd5e1',
                            },
                        }}
                    >
                        Kembali ke Beranda
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Official Conference Portal &bull; PIT IAGI 2026
                        </Typography>
                    </Box>
                </Box>

                {/* Hero Title & Information */}
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 0.7,
                            borderRadius: '50px',
                            bgcolor: 'rgba(9, 77, 66, 0.08)',
                            border: '1px solid rgba(9, 77, 66, 0.15)',
                            mb: 2,
                        }}
                    >
                        <SparklesIcon sx={{ fontSize: 16, color: '#094d42' }} />
                        <Typography variant="caption" sx={{ color: '#094d42', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                            55th PIT IAGI & GEOSEA XIX 2026
                        </Typography>
                    </Box>

                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
                            letterSpacing: '-0.035em',
                            lineHeight: 1.15,
                            color: '#0f172a',
                            mb: 1.5,
                        }}
                    >
                        Registrasi Tiket Penonton
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: '#64748b',
                            maxWidth: 680,
                            mx: 'auto',
                            fontSize: { xs: '0.98rem', md: '1.08rem' },
                            lineHeight: 1.6,
                        }}
                    >
                        Dapatkan tiket resmi & QR Code digital untuk akses arena pameran geologi, sesi poster ilmiah, serta zona industri energi & mineral.
                    </Typography>

                    {/* Venue & Date Frosted Bar */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            gap: { xs: 2, sm: 3.5 },
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            bgcolor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            px: { xs: 2.5, sm: 3.5 },
                            py: 1.2,
                            mt: 3,
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon sx={{ fontSize: 18, color: '#0284c7' }} />
                            <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700, fontSize: '0.88rem' }}>
                                {eventDate}
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: '#e2e8f0', display: { xs: 'none', sm: 'block' } }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 18, color: '#e11d48' }} />
                            <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700, fontSize: '0.88rem' }}>
                                {eventVenue}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {!enabled ? (
                    <Alert
                        severity="warning"
                        sx={{
                            borderRadius: '16px',
                            bgcolor: '#fffbeb',
                            color: '#b45309',
                            border: '1px solid #fde68a',
                            p: 3,
                            fontSize: '1rem',
                        }}
                    >
                        Pendaftaran tiket penonton saat ini sedang ditutup oleh panitia.
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* 2-COLUMN BALANCED 3D DASHBOARD LAYOUT */}
                        <Grid container spacing={4} alignItems="flex-start">
                            {/* LEFT COLUMN: 3D INTERACTIVE PHYSICAL LANYARD BADGE */}
                            <Grid item xs={12} md={5} lg={4.5}>
                                <Box
                                    sx={{
                                        position: { md: 'sticky' },
                                        top: { md: 24 },
                                        bgcolor: '#ffffff',
                                        borderRadius: '24px',
                                        p: 3.5,
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 12px 35px -8px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
                                    }}
                                >
                                    <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                            <VisibilityIcon sx={{ fontSize: 16, color: isExclusive ? '#d97706' : '#059669' }} /> Live 3D Badge Preview
                                        </Typography>
                                        <Chip
                                            label={isExclusive ? 'VIP PASS' : 'FREE PASS'}
                                            size="small"
                                            sx={{
                                                bgcolor: isExclusive ? '#fef3c7' : '#ecfdf5',
                                                color: isExclusive ? '#b45309' : '#047857',
                                                fontWeight: 800,
                                                fontSize: '0.7rem',
                                                border: `1px solid ${isExclusive ? '#fde68a' : '#a7f3d0'}`,
                                            }}
                                        />
                                    </Box>

                                    {/* 3D Perspective Card Container */}
                                    <Box
                                        onMouseMove={handleCardMouseMove}
                                        onMouseLeave={handleCardMouseLeave}
                                        sx={{
                                            perspective: '1000px',
                                            cursor: 'pointer',
                                            my: 1,
                                        }}
                                    >
                                        {/* Lanyard Top Strap & Clip */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: -1.5, position: 'relative', zIndex: 3 }}>
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 22,
                                                    bgcolor: isExclusive ? '#d97706' : '#094d42',
                                                    borderRadius: '4px 4px 0 0',
                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    width: 18,
                                                    height: 12,
                                                    bgcolor: '#cbd5e1',
                                                    borderRadius: '2px',
                                                    border: '1px solid #94a3b8',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                }}
                                            />
                                        </Box>

                                        {/* Physical Lanyard Card 3D Body (TasteSkill White PVC Style) */}
                                        <Box
                                            sx={{
                                                transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
                                                transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
                                                borderRadius: '20px',
                                                bgcolor: '#ffffff',
                                                border: `2px solid ${isExclusive ? '#f59e0b' : '#10b981'}`,
                                                boxShadow: isExclusive
                                                    ? '0 20px 40px -10px rgba(245, 158, 11, 0.25), 0 8px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)'
                                                    : '0 20px 40px -10px rgba(16, 185, 129, 0.25), 0 8px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                p: 3,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {/* Hole Punch */}
                                            <Box
                                                sx={{
                                                    width: 28,
                                                    height: 6,
                                                    borderRadius: '4px',
                                                    bgcolor: '#e2e8f0',
                                                    border: '1px solid #cbd5e1',
                                                    mx: 'auto',
                                                    mb: 2,
                                                }}
                                            />

                                            {/* Event Header */}
                                            <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#094d42', fontSize: '0.72rem', display: 'block' }}>
                                                55TH PIT IAGI & GEOSEA 2026
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block', mb: 2 }}>
                                                ANNUAL SCIENTIFIC CONVENTION
                                            </Typography>

                                            {/* QR Code Center */}
                                            <Box
                                                sx={{
                                                    p: 1.5,
                                                    bgcolor: '#ffffff',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    width: 'fit-content',
                                                    mx: 'auto',
                                                    mb: 2,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                                }}
                                            >
                                                <QRCodeSVG
                                                    value="TKT-SAMPLE-PREVIEW"
                                                    size={120}
                                                    level="H"
                                                    includeMargin={false}
                                                />
                                            </Box>

                                            {/* Live Name & Institution */}
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 900,
                                                    color: '#0f172a',
                                                    lineHeight: 1.2,
                                                    mb: 0.3,
                                                    fontSize: '1.15rem',
                                                    minHeight: '1.4em',
                                                }}
                                            >
                                                {primaryMember.name || 'Nama Peserta'}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: isExclusive ? '#d97706' : '#0284c7',
                                                    fontSize: '0.82rem',
                                                    minHeight: '1.2em',
                                                    mb: 2,
                                                }}
                                            >
                                                {primaryMember.institution || 'Instansi / Universitas'}
                                            </Typography>

                                            {/* Bottom Pass Category Banner */}
                                            <Box
                                                sx={{
                                                    bgcolor: isExclusive ? '#f59e0b' : '#094d42',
                                                    color: '#ffffff',
                                                    py: 1,
                                                    borderRadius: '10px',
                                                    fontWeight: 900,
                                                    letterSpacing: '0.08em',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.82rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0.8,
                                                }}
                                            >
                                                {isExclusive && <StarIcon sx={{ fontSize: 16 }} />}
                                                {isExclusive ? 'VISITOR EXCLUSIVE (VIP)' : 'VISITOR NON-EXCLUSIVE'}
                                                {isExclusive && <StarIcon sx={{ fontSize: 16 }} />}
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Security & Verification Card */}
                                    <Box
                                        sx={{
                                            mt: 3,
                                            p: 2,
                                            borderRadius: '14px',
                                            bgcolor: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                        }}
                                    >
                                        <VerifiedIcon sx={{ color: '#059669', fontSize: 24 }} />
                                        <Typography variant="caption" sx={{ color: '#475569', lineHeight: 1.4, fontWeight: 500 }}>
                                            Kartu fisik & QR Code digital dapat ditukarkan langsung di loket pendaftaran gate saat hari acara.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* RIGHT COLUMN: STEP-BY-STEP FORM */}
                            <Grid item xs={12} md={7} lg={7.5}>
                                {/* STEP 1: CATEGORY SELECTION */}
                                <Box sx={{ mb: 4.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '10px',
                                                bgcolor: '#094d42',
                                                color: '#fff',
                                                fontSize: '0.9rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 900,
                                                boxShadow: '0 4px 10px rgba(9, 77, 66, 0.25)',
                                            }}
                                        >
                                            1
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                            Pilih Kategori Tiket
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2.5}>
                                        {/* Non-Exclusive Free Card */}
                                        <Grid item xs={12} sm={6}>
                                            <Box
                                                onClick={() => handleTypeChange('non_exclusive')}
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: '20px',
                                                    bgcolor: '#ffffff',
                                                    border: `2.5px solid ${visitorType === 'non_exclusive' ? '#10b981' : '#e2e8f0'}`,
                                                    boxShadow: visitorType === 'non_exclusive'
                                                        ? '0 12px 30px -5px rgba(16, 185, 129, 0.25), 0 4px 10px rgba(0,0,0,0.03)'
                                                        : '0 4px 15px rgba(0,0,0,0.04)',
                                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    p: 3,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    '&:hover': {
                                                        borderColor: '#10b981',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 12px 30px -5px rgba(16, 185, 129, 0.2)',
                                                    },
                                                }}
                                            >
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                        <Chip
                                                            label="FREE PASS"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#ecfdf5',
                                                                color: '#047857',
                                                                fontWeight: 900,
                                                                fontSize: '0.72rem',
                                                                border: '1px solid #a7f3d0',
                                                            }}
                                                        />
                                                        <Box
                                                            sx={{
                                                                width: 22,
                                                                height: 22,
                                                                borderRadius: '50%',
                                                                border: `2px solid ${visitorType === 'non_exclusive' ? '#10b981' : '#cbd5e1'}`,
                                                                bgcolor: visitorType === 'non_exclusive' ? '#10b981' : 'transparent',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            {visitorType === 'non_exclusive' && <CheckCircleIcon sx={{ fontSize: 15, color: '#fff' }} />}
                                                        </Box>
                                                    </Box>

                                                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5 }}>
                                                        Visitor Non-Exclusive
                                                    </Typography>
                                                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#059669', mb: 1.5 }}>
                                                        GRATIS <Typography component="span" variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>(Rp 0)</Typography>
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, mb: 2 }}>
                                                        Akses area pameran umum & poster presentation tanpa biaya registrasi.
                                                    </Typography>
                                                </Box>

                                                <Box>
                                                    <Divider sx={{ borderColor: '#f1f5f9', my: 1.5 }} />
                                                    <Stack spacing={0.8}>
                                                        <Typography variant="caption" sx={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 0.8, fontWeight: 600 }}>
                                                            <CheckCircleIcon sx={{ fontSize: 15, color: '#10b981' }} /> E-Tiket instan ber-QR Code
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 0.8, fontWeight: 600 }}>
                                                            <CheckCircleIcon sx={{ fontSize: 15, color: '#10b981' }} /> Cetak Kartu Lanyard di Gate
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        {/* Exclusive VIP Card */}
                                        <Grid item xs={12} sm={6}>
                                            <Box
                                                onClick={() => handleTypeChange('exclusive')}
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: '20px',
                                                    bgcolor: '#ffffff',
                                                    border: `2.5px solid ${visitorType === 'exclusive' ? '#f59e0b' : '#e2e8f0'}`,
                                                    boxShadow: visitorType === 'exclusive'
                                                        ? '0 12px 30px -5px rgba(245, 158, 11, 0.25), 0 4px 10px rgba(0,0,0,0.03)'
                                                        : '0 4px 15px rgba(0,0,0,0.04)',
                                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    p: 3,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    '&:hover': {
                                                        borderColor: '#f59e0b',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 12px 30px -5px rgba(245, 158, 11, 0.2)',
                                                    },
                                                }}
                                            >
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                        <Chip
                                                            icon={<StarIcon sx={{ fontSize: 13, color: '#000 !important' }} />}
                                                            label="EXCLUSIVE VIP"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#fef3c7',
                                                                color: '#92400e',
                                                                fontWeight: 900,
                                                                fontSize: '0.72rem',
                                                                border: '1px solid #fde68a',
                                                            }}
                                                        />
                                                        <Box
                                                            sx={{
                                                                width: 22,
                                                                height: 22,
                                                                borderRadius: '50%',
                                                                border: `2px solid ${visitorType === 'exclusive' ? '#f59e0b' : '#cbd5e1'}`,
                                                                bgcolor: visitorType === 'exclusive' ? '#f59e0b' : 'transparent',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            {visitorType === 'exclusive' && <CheckCircleIcon sx={{ fontSize: 15, color: '#fff' }} />}
                                                        </Box>
                                                    </Box>

                                                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5 }}>
                                                        Visitor Exclusive
                                                    </Typography>
                                                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#b45309', mb: 1.5 }}>
                                                        Rp {priceExclusive.toLocaleString('id-ID')} <Typography component="span" variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>/ org</Typography>
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, mb: 2 }}>
                                                        Akses VIP Plenary Session, VIP Lounge, Kartu Lanyard Gold, & Seminar Kit resmi.
                                                    </Typography>
                                                </Box>

                                                <Box>
                                                    <Divider sx={{ borderColor: '#f1f5f9', my: 1.5 }} />
                                                    <Stack spacing={0.8}>
                                                        <Typography variant="caption" sx={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 0.8, fontWeight: 600 }}>
                                                            <WorkspacePremiumIcon sx={{ fontSize: 15, color: '#d97706' }} /> Lanyard Desain Gold VIP
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 0.8, fontWeight: 600 }}>
                                                            <WorkspacePremiumIcon sx={{ fontSize: 15, color: '#d97706' }} /> Akses Plenary & VIP Lounge
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* STEP 2: VISITOR DATA (MULTI-MEMBER FORM) */}
                                <Box sx={{ mb: 4.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '10px',
                                                    bgcolor: '#094d42',
                                                    color: '#fff',
                                                    fontSize: '0.9rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 900,
                                                    boxShadow: '0 4px 10px rgba(9, 77, 66, 0.25)',
                                                }}
                                            >
                                                2
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                                Data Pengunjung {members.length > 1 && `(${members.length} Orang)`}
                                            </Typography>
                                        </Box>

                                        <Button
                                            startIcon={<PersonAddIcon />}
                                            onClick={addMember}
                                            sx={{
                                                color: '#094d42',
                                                bgcolor: '#f0fdf4',
                                                border: '1px dashed #86efac',
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                fontWeight: 800,
                                                fontSize: '0.82rem',
                                                px: 2,
                                                py: 0.8,
                                                '&:hover': {
                                                    bgcolor: '#dcfce7',
                                                    borderColor: '#22c55e',
                                                },
                                            }}
                                        >
                                            + Tambah Peserta
                                        </Button>
                                    </Box>

                                    <Stack spacing={2.5}>
                                        {members.map((member, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    borderRadius: '20px',
                                                    bgcolor: '#ffffff',
                                                    border: '1px solid #e2e8f0',
                                                    p: 3,
                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                        <Box
                                                            sx={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: '6px',
                                                                bgcolor: idx === 0 ? '#e0f2fe' : '#f1f5f9',
                                                                color: idx === 0 ? '#0284c7' : '#475569',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 900,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                                        </Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: idx === 0 ? '#0284c7' : '#334155' }}>
                                                            {idx === 0 ? 'Data Pemesan Utama / Ketua' : `Peserta #${idx + 1}`}
                                                        </Typography>
                                                    </Box>

                                                    {members.length > 1 && (
                                                        <IconButton
                                                            onClick={() => removeMember(idx)}
                                                            size="small"
                                                            sx={{
                                                                color: '#ef4444',
                                                                bgcolor: '#fef2f2',
                                                                borderRadius: '8px',
                                                                '&:hover': { bgcolor: '#fee2e2' },
                                                            }}
                                                        >
                                                            <DeleteOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>

                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Nama Lengkap *"
                                                            placeholder="Sesuai KTP / Paspor"
                                                            value={member.name}
                                                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                                            fullWidth
                                                            required
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    bgcolor: '#f8fafc',
                                                                    borderRadius: '10px',
                                                                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                                                                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                                                                },
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Alamat Email *"
                                                            type="email"
                                                            placeholder="contoh@gmail.com"
                                                            value={member.email}
                                                            onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                                            fullWidth
                                                            required
                                                            helperText="E-Tiket & QR Code dikirim ke sini"
                                                            FormHelperTextProps={{ sx: { color: '#64748b', fontSize: '0.72rem' } }}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    bgcolor: '#f8fafc',
                                                                    borderRadius: '10px',
                                                                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                                                                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                                                                },
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="No. WhatsApp / HP"
                                                            placeholder="0812xxxxxxxx"
                                                            value={member.phone}
                                                            onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                                                            fullWidth
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    bgcolor: '#f8fafc',
                                                                    borderRadius: '10px',
                                                                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                                                                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                                                                },
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Instansi / Universitas"
                                                            placeholder="Contoh: ITB / Pertamina"
                                                            value={member.institution}
                                                            onChange={(e) => handleMemberChange(idx, 'institution', e.target.value)}
                                                            fullWidth
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    bgcolor: '#f8fafc',
                                                                    borderRadius: '10px',
                                                                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                                                                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                                                                },
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>

                                {/* STEP 3: PAYMENT SECTION (EXCLUSIVE ONLY) */}
                                {visitorType === 'exclusive' && (
                                    <Box sx={{ mb: 4.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                            <Box
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '10px',
                                                    bgcolor: '#d97706',
                                                    color: '#fff',
                                                    fontSize: '0.9rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 900,
                                                    boxShadow: '0 4px 10px rgba(217, 119, 6, 0.25)',
                                                }}
                                            >
                                                3
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                                Pembayaran Tiket Exclusive
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                borderRadius: '20px',
                                                bgcolor: '#ffffff',
                                                border: '1.5px solid #fde68a',
                                                p: 3.5,
                                                boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                                            }}
                                        >
                                            {/* Total Summary Banner */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 3,
                                                    bgcolor: '#fffbeb',
                                                    border: '1px solid #fde68a',
                                                    p: 2.5,
                                                    borderRadius: '14px',
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800, display: 'block' }}>
                                                        Total Tagihan ({members.length} Tiket VIP)
                                                    </Typography>
                                                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#b45309', letterSpacing: '-0.02em', mt: 0.3 }}>
                                                        Rp {totalEstimate.toLocaleString('id-ID')}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label="Wajib Bayar"
                                                    size="small"
                                                    sx={{ bgcolor: '#d97706', color: '#fff', fontWeight: 900, fontSize: '0.75rem' }}
                                                />
                                            </Box>

                                            {/* Payment Method Selector */}
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1.5 }}>
                                                Pilih Metode Pembayaran:
                                            </Typography>

                                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                                <Grid item xs={12} sm={6}>
                                                    <Paper
                                                        onClick={() => {
                                                            setPaymentMethod('qris_indo');
                                                            setData('payment_method', 'qris_indo');
                                                        }}
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: '12px',
                                                            bgcolor: paymentMethod === 'qris_indo' ? '#f0fdf4' : '#f8fafc',
                                                            border: `2px solid ${paymentMethod === 'qris_indo' ? '#10b981' : '#e2e8f0'}`,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                            transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#dcfce7', display: 'flex' }}>
                                                            <QrCodeIcon sx={{ color: '#059669', fontSize: 24 }} />
                                                        </Box>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>QRIS Indonesia</Typography>
                                                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>BCA, Mandiri, GoPay, OVO, Dana</Typography>
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Paper
                                                        onClick={() => {
                                                            setPaymentMethod('foreign_bank_transfer');
                                                            setData('payment_method', 'foreign_bank_transfer');
                                                        }}
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: '12px',
                                                            bgcolor: paymentMethod === 'foreign_bank_transfer' ? '#f0f9ff' : '#f8fafc',
                                                            border: `2px solid ${paymentMethod === 'foreign_bank_transfer' ? '#0284c7' : '#e2e8f0'}`,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                            transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#e0f2fe', display: 'flex' }}>
                                                            <AccountBalanceIcon sx={{ color: '#0284c7', fontSize: 24 }} />
                                                        </Box>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>Bank Transfer</Typography>
                                                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Manual Transfer Bank IAGI</Typography>
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                            </Grid>

                                            {/* QRIS Display */}
                                            {paymentMethod === 'qris_indo' && (
                                                <Box
                                                    sx={{
                                                        textAlign: 'center',
                                                        p: 3,
                                                        bgcolor: '#f8fafc',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '16px',
                                                        mb: 3,
                                                    }}
                                                >
                                                    {qrisImage ? (
                                                        <Box
                                                            component="img"
                                                            src={qrisImage.startsWith('http') || qrisImage.startsWith('/') ? qrisImage : `/storage/${qrisImage}`}
                                                            alt="QRIS IAGI"
                                                            sx={{
                                                                maxWidth: 220,
                                                                borderRadius: '12px',
                                                                mx: 'auto',
                                                                mb: 2,
                                                                p: 1.5,
                                                                bgcolor: '#fff',
                                                                border: '1px solid #e2e8f0',
                                                                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                                                            }}
                                                        />
                                                    ) : (
                                                        <Box sx={{ p: 3, border: '2px dashed #cbd5e1', borderRadius: '12px', maxWidth: 220, mx: 'auto', mb: 2, bgcolor: '#fff' }}>
                                                            <QrCodeIcon sx={{ fontSize: 60, color: '#94a3b8' }} />
                                                            <Typography variant="caption" sx={{ display: 'block', color: '#64748b', mt: 1 }}>QRIS Resmi PIT IAGI 2026</Typography>
                                                        </Box>
                                                    )}
                                                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                                                        Scan kode QRIS di atas menggunakan aplikasi m-Banking atau E-Wallet pilihan Anda.
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Bank Transfer Info */}
                                            {paymentMethod === 'foreign_bank_transfer' && (
                                                <Box
                                                    sx={{
                                                        p: 3,
                                                        bgcolor: '#f8fafc',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '16px',
                                                        mb: 3,
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0284c7' }}>
                                                            Rekening Transfer Bank IAGI:
                                                        </Typography>
                                                        <Button
                                                            size="small"
                                                            startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                                                            onClick={handleCopyBankInfo}
                                                            sx={{
                                                                color: '#0284c7',
                                                                bgcolor: '#e0f2fe',
                                                                textTransform: 'none',
                                                                fontSize: '0.75rem',
                                                                borderRadius: '8px',
                                                                '&:hover': { bgcolor: '#bae6fd' },
                                                            }}
                                                        >
                                                            {copySuccess ? 'Tersalin!' : 'Salin Rekening'}
                                                        </Button>
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#0f172a',
                                                            whiteSpace: 'pre-line',
                                                            fontFamily: 'monospace',
                                                            bgcolor: '#ffffff',
                                                            p: 2,
                                                            borderRadius: '10px',
                                                            border: '1px solid #e2e8f0',
                                                            lineHeight: 1.7,
                                                        }}
                                                    >
                                                        {bankTransferInfo}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Upload Proof */}
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 0.5 }}>
                                                Unggah Bukti Pembayaran *
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
                                                Foto kamera HP berukuran besar akan otomatis dikompresi &lt; 500KB agar cepat terunggah.
                                            </Typography>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                style={{ display: 'none' }}
                                            />
                                            <input
                                                ref={cameraInputRef}
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                onChange={handleFileSelect}
                                                style={{ display: 'none' }}
                                            />

                                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<PhotoCameraIcon />}
                                                    onClick={() => cameraInputRef.current?.click()}
                                                    disabled={compressing}
                                                    sx={{
                                                        borderRadius: '10px',
                                                        borderColor: '#0284c7',
                                                        color: '#0284c7',
                                                        bgcolor: '#f0f9ff',
                                                        textTransform: 'none',
                                                        fontWeight: 800,
                                                        px: 2.5,
                                                        py: 1,
                                                        '&:hover': { borderColor: '#0369a1', bgcolor: '#e0f2fe' },
                                                    }}
                                                >
                                                    📷 Buka Kamera HP
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<CloudUploadIcon />}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={compressing}
                                                    sx={{
                                                        borderRadius: '10px',
                                                        borderColor: '#cbd5e1',
                                                        color: '#475569',
                                                        bgcolor: '#ffffff',
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        px: 2.5,
                                                        py: 1,
                                                        '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' },
                                                    }}
                                                >
                                                    📁 Pilih dari Galeri
                                                </Button>
                                            </Box>

                                            {compressing && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 2 }}>
                                                    <CircularProgress size={20} sx={{ color: '#10b981' }} />
                                                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
                                                        Mengompresi foto otomatis di browser...
                                                    </Typography>
                                                </Box>
                                            )}

                                            {proofPreview && (
                                                <Box
                                                    sx={{
                                                        mt: 2,
                                                        p: 2,
                                                        bgcolor: '#f0fdf4',
                                                        border: '1px solid #86efac',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={proofPreview}
                                                        alt="Bukti Transfer"
                                                        sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '8px', border: '1px solid #86efac' }}
                                                    />
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <CheckCircleIcon sx={{ fontSize: 16 }} /> Foto siap diunggah!
                                                        </Typography>
                                                        {compressionStats && (
                                                            <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.3 }}>
                                                                Ukuran asli: {compressionStats.original} KB &rarr; <strong>Tersimpan: {compressionStats.compressed} KB</strong> (Hemat {Math.round((1 - compressionStats.compressed / compressionStats.original) * 100)}%)
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                )}

                                {/* SUBMIT 3D PUSH BUTTON */}
                                <Box sx={{ mt: 4, mb: 3 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        disabled={processing || compressing}
                                        startIcon={processing ? <CircularProgress size={22} color="inherit" /> : <ConfirmationNumberIcon />}
                                        sx={{
                                            background: isExclusive 
                                                ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)' 
                                                : 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                                            color: '#ffffff',
                                            fontWeight: 900,
                                            fontSize: { xs: '1.05rem', md: '1.18rem' },
                                            py: 2,
                                            borderRadius: '16px',
                                            textTransform: 'none',
                                            letterSpacing: '0.01em',
                                            boxShadow: isExclusive
                                                ? '0 5px 0 #92400e, 0 12px 25px rgba(245, 158, 11, 0.35)'
                                                : '0 5px 0 #047857, 0 12px 25px rgba(16, 185, 129, 0.35)',
                                            '&:hover': {
                                                background: isExclusive
                                                    ? 'linear-gradient(180deg, #fbbf24 0%, #b45309 100%)'
                                                    : 'linear-gradient(180deg, #34d399 0%, #047857 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: isExclusive
                                                    ? '0 7px 0 #92400e, 0 15px 30px rgba(245, 158, 11, 0.45)'
                                                    : '0 7px 0 #047857, 0 15px 30px rgba(16, 185, 129, 0.45)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(4px)',
                                                boxShadow: isExclusive
                                                    ? '0 1px 0 #92400e, 0 4px 10px rgba(245, 158, 11, 0.3)'
                                                    : '0 1px 0 #047857, 0 4px 10px rgba(16, 185, 129, 0.3)',
                                            },
                                            transition: 'all 0.12s cubic-bezier(0.4, 0, 0.2, 1)',
                                        }}
                                    >
                                        {processing 
                                            ? 'Memproses Pendaftaran...' 
                                            : isExclusive 
                                                ? `Terbitkan Tiket VIP Exclusive (Rp ${totalEstimate.toLocaleString('id-ID')})` 
                                                : 'Terbitkan E-Tiket Gratis Sekarang'
                                        }
                                    </Button>

                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', textAlign: 'center', mt: 2, fontWeight: 600 }}>
                                        🔒 Data pengunjung & pembayaran terenkripsi aman &bull; Dikelola oleh Panitia Resmi 55th PIT IAGI & GEOSEA 2026
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Container>
        </Box>
    );
}
