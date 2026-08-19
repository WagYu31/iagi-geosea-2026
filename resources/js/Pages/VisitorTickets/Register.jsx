import React, { useState, useRef, useEffect } from 'react';
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
        setMousePos({ x: x * 18, y: y * -18 });
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
                background: 'radial-gradient(1200px circle at 50% -10%, #0c382e 0%, #061715 35%, #02090b 100%)',
                color: '#f8fafc',
                position: 'relative',
                overflow: 'hidden',
                py: { xs: 3, md: 6 },
            }}
        >
            <Head title="Registrasi Tiket Penonton - 55th PIT IAGI & GEOSEA 2026" />

            {/* Background 3D Grid & Ambient Lighting */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    top: '5%',
                    left: '15%',
                    width: '600px',
                    height: '450px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    top: '25%',
                    right: '10%',
                    width: '550px',
                    height: '450px',
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
                    filter: 'blur(90px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header Navigation Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        px: 2.5,
                        borderRadius: '20px',
                        bgcolor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        mb: 5,
                    }}
                >
                    <Button
                        component={Link}
                        href="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: '#e2e8f0',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            borderRadius: '12px',
                            px: 2,
                            py: 0.8,
                            bgcolor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                            '&:hover': {
                                color: '#10b981',
                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                borderColor: 'rgba(16, 185, 129, 0.4)',
                                transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s',
                        }}
                    >
                        Kembali ke Beranda
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                        <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Official Admission Portal &bull; PIT IAGI 2026
                        </Typography>
                    </Box>
                </Box>

                {/* Hero Title & Information */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1.2,
                            px: 2.2,
                            py: 0.8,
                            borderRadius: '50px',
                            bgcolor: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            backdropFilter: 'blur(16px)',
                            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            mb: 2.5,
                        }}
                    >
                        <SparklesIcon sx={{ fontSize: 16, color: '#34d399' }} />
                        <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                            55th PIT IAGI & GEOSEA XIX 2026
                        </Typography>
                    </Box>

                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
                            letterSpacing: '-0.035em',
                            lineHeight: 1.1,
                            background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 60%, #94a3b8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            mb: 1.8,
                        }}
                    >
                        Registrasi Tiket Penonton
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: '#94a3b8',
                            maxWidth: 680,
                            mx: 'auto',
                            fontSize: { xs: '0.98rem', md: '1.1rem' },
                            lineHeight: 1.6,
                        }}
                    >
                        Dapatkan tiket resmi & QR Code digital untuk akses arena pameran, sesi poster ilmiah, serta zona pameran industri energi & mineral se-Asia Tenggara.
                    </Typography>

                    {/* Venue & Date Frosted Bar */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            gap: { xs: 2, sm: 3.5 },
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            bgcolor: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '18px',
                            px: { xs: 2.5, sm: 3.5 },
                            py: 1.4,
                            mt: 3.5,
                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Box sx={{ p: 0.7, borderRadius: '10px', bgcolor: 'rgba(56, 189, 248, 0.18)', display: 'flex' }}>
                                <EventIcon sx={{ fontSize: 18, color: '#38bdf8' }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.88rem' }}>
                                {eventDate}
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.12)', display: { xs: 'none', sm: 'block' } }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Box sx={{ p: 0.7, borderRadius: '10px', bgcolor: 'rgba(244, 63, 94, 0.18)', display: 'flex' }}>
                                <LocationOnIcon sx={{ fontSize: 18, color: '#f43f5e' }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.88rem' }}>
                                {eventVenue}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {!enabled ? (
                    <Alert
                        severity="warning"
                        sx={{
                            borderRadius: '20px',
                            bgcolor: 'rgba(234, 179, 8, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid rgba(234, 179, 8, 0.3)',
                            p: 3,
                            fontSize: '1rem',
                        }}
                    >
                        Pendaftaran tiket penonton saat ini sedang ditutup oleh panitia.
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* 2-COLUMN 3D LAYOUT */}
                        <Grid container spacing={4} alignItems="flex-start">
                            {/* LEFT COLUMN: 3D INTERACTIVE TICKET PASS PREVIEW (STICKY) */}
                            <Grid item xs={12} lg={5} sx={{ position: { lg: 'sticky' }, top: { lg: 24 } }}>
                                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                        <VisibilityIcon sx={{ fontSize: 16, color: isExclusive ? '#fbbf24' : '#34d399' }} /> Live 3D Badge Preview
                                    </Typography>
                                    <Chip
                                        label={isExclusive ? 'VIP PASS' : 'FREE PASS'}
                                        size="small"
                                        sx={{
                                            bgcolor: isExclusive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                            color: isExclusive ? '#fbbf24' : '#34d399',
                                            fontWeight: 800,
                                            fontSize: '0.7rem',
                                            border: `1px solid ${isExclusive ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
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
                                    }}
                                >
                                    {/* Lanyard Top Strap & Clip */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: -1.5, position: 'relative', zIndex: 3 }}>
                                        <Box
                                            sx={{
                                                width: 38,
                                                height: 24,
                                                bgcolor: isExclusive ? '#b45309' : '#047857',
                                                borderRadius: '4px 4px 0 0',
                                                border: '2px solid rgba(255,255,255,0.2)',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                width: 20,
                                                height: 14,
                                                bgcolor: '#94a3b8',
                                                borderRadius: '3px',
                                                border: '1px solid #475569',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                                            }}
                                        />
                                    </Box>

                                    {/* Physical Lanyard Card 3D Body */}
                                    <Box
                                        sx={{
                                            transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
                                            transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
                                            borderRadius: '24px',
                                            background: isExclusive
                                                ? 'linear-gradient(165deg, #1e1b12 0%, #171206 50%, #0a0802 100%)'
                                                : 'linear-gradient(165deg, #071f1a 0%, #061618 50%, #020b0c 100%)',
                                            border: `2.5px solid ${isExclusive ? '#f59e0b' : '#10b981'}`,
                                            boxShadow: isExclusive
                                                ? '0 25px 50px -12px rgba(245, 158, 11, 0.35), 0 0 35px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
                                                : '0 25px 50px -12px rgba(16, 185, 129, 0.35), 0 0 35px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            p: 3,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {/* Holographic Sheen Layer */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: `radial-gradient(circle at ${mousePos.x * 2 + 50}% ${mousePos.y * -2 + 50}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
                                                pointerEvents: 'none',
                                            }}
                                        />

                                        {/* Hole Punch */}
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 7,
                                                borderRadius: '4px',
                                                bgcolor: 'rgba(0,0,0,0.8)',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                                mx: 'auto',
                                                mb: 2,
                                            }}
                                        />

                                        {/* Event Branding */}
                                        <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#cbd5e1', fontSize: '0.72rem', display: 'block' }}>
                                            55TH PIT IAGI & GEOSEA 2026
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block', mb: 2.5 }}>
                                            ANNUAL SCIENTIFIC CONVENTION
                                        </Typography>

                                        {/* QR Code Center */}
                                        <Box
                                            sx={{
                                                p: 1.8,
                                                bgcolor: '#ffffff',
                                                borderRadius: '16px',
                                                width: 'fit-content',
                                                mx: 'auto',
                                                mb: 2.5,
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                                            }}
                                        >
                                            <QRCodeSVG
                                                value="TKT-SAMPLE-PREVIEW"
                                                size={130}
                                                level="H"
                                                includeMargin={false}
                                            />
                                        </Box>

                                        {/* Live Name & Institution */}
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 900,
                                                color: '#ffffff',
                                                lineHeight: 1.2,
                                                mb: 0.5,
                                                fontSize: '1.25rem',
                                                minHeight: '1.5em',
                                            }}
                                        >
                                            {primaryMember.name || 'Nama Peserta'}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 700,
                                                color: isExclusive ? '#fbbf24' : '#38bdf8',
                                                fontSize: '0.85rem',
                                                minHeight: '1.2em',
                                                mb: 2,
                                            }}
                                        >
                                            {primaryMember.institution || 'Instansi / Universitas'}
                                        </Typography>

                                        {/* Bottom Pass Category Banner */}
                                        <Box
                                            sx={{
                                                bgcolor: isExclusive ? '#f59e0b' : '#10b981',
                                                color: isExclusive ? '#000' : '#fff',
                                                py: 1,
                                                borderRadius: '12px',
                                                fontWeight: 900,
                                                letterSpacing: '0.08em',
                                                textTransform: 'uppercase',
                                                fontSize: '0.85rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 0.8,
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                            }}
                                        >
                                            {isExclusive && <StarIcon sx={{ fontSize: 16 }} />}
                                            {isExclusive ? 'VISITOR EXCLUSIVE (VIP)' : 'VISITOR NON-EXCLUSIVE'}
                                            {isExclusive && <StarIcon sx={{ fontSize: 16 }} />}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Security Info Card */}
                                <Box
                                    sx={{
                                        mt: 3,
                                        p: 2,
                                        borderRadius: '14px',
                                        bgcolor: 'rgba(15, 23, 42, 0.5)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                    }}
                                >
                                    <VerifiedIcon sx={{ color: '#10b981', fontSize: 24 }} />
                                    <Typography variant="caption" sx={{ color: '#94a3b8', lineHeight: 1.4 }}>
                                        Kartu fisik & QR Code digital dapat ditukarkan langsung di loket pendaftaran gate saat hari acara.
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* RIGHT COLUMN: STEP-BY-STEP FORM */}
                            <Grid item xs={12} lg={7}>
                                {/* STEP 1: CATEGORY SELECTION */}
                                <Box sx={{ mb: 4.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                color: '#fff',
                                                fontSize: '0.9rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 900,
                                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                                            }}
                                        >
                                            1
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                                            Pilih Kategori Tiket
                                        </Typography>
                                    </Box>

                                    <Stack spacing={2.5}>
                                        {/* Non-Exclusive Free Card */}
                                        <Box
                                            onClick={() => handleTypeChange('non_exclusive')}
                                            sx={{
                                                cursor: 'pointer',
                                                borderRadius: '20px',
                                                bgcolor: visitorType === 'non_exclusive' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                                                border: `2.5px solid ${visitorType === 'non_exclusive' ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
                                                backdropFilter: 'blur(16px)',
                                                boxShadow: visitorType === 'non_exclusive'
                                                    ? '0 15px 35px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)'
                                                    : '0 6px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
                                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                p: 3,
                                                position: 'relative',
                                                '&:hover': {
                                                    borderColor: '#10b981',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 15px 35px rgba(16, 185, 129, 0.2)',
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                <Chip
                                                    label="FREE ENTRY PASS"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(16, 185, 129, 0.2)',
                                                        color: '#34d399',
                                                        fontWeight: 900,
                                                        fontSize: '0.72rem',
                                                        border: '1px solid rgba(16, 185, 129, 0.4)',
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        border: `2px solid ${visitorType === 'non_exclusive' ? '#10b981' : '#64748b'}`,
                                                        bgcolor: visitorType === 'non_exclusive' ? '#10b981' : 'transparent',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: visitorType === 'non_exclusive' ? '0 0 10px #10b981' : 'none',
                                                    }}
                                                >
                                                    {visitorType === 'non_exclusive' && <CheckCircleIcon sx={{ fontSize: 16, color: '#fff' }} />}
                                                </Box>
                                            </Box>

                                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', mb: 0.5 }}>
                                                Visitor Non-Exclusive
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#34d399', mb: 1.5 }}>
                                                GRATIS <Typography component="span" variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>(Free Pass)</Typography>
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, mb: 2 }}>
                                                Akses area pameran umum, poster presentation, dan booth exhibition tanpa dipungut biaya registrasi.
                                            </Typography>

                                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 1.5 }} />

                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                        <CheckCircleIcon sx={{ fontSize: 15, color: '#10b981' }} /> E-Tiket instan ber-QR Code
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                        <CheckCircleIcon sx={{ fontSize: 15, color: '#10b981' }} /> Cetak Kartu Lanyard di Gate
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        {/* Exclusive VIP Card */}
                                        <Box
                                            onClick={() => handleTypeChange('exclusive')}
                                            sx={{
                                                cursor: 'pointer',
                                                borderRadius: '20px',
                                                bgcolor: visitorType === 'exclusive' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                                                border: `2.5px solid ${visitorType === 'exclusive' ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)'}`,
                                                backdropFilter: 'blur(16px)',
                                                boxShadow: visitorType === 'exclusive'
                                                    ? '0 15px 35px rgba(245, 158, 11, 0.28), inset 0 1px 0 rgba(255,255,255,0.2)'
                                                    : '0 6px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
                                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                p: 3,
                                                position: 'relative',
                                                '&:hover': {
                                                    borderColor: '#f59e0b',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 15px 35px rgba(245, 158, 11, 0.2)',
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                <Chip
                                                    icon={<StarIcon sx={{ fontSize: 13, color: '#000 !important' }} />}
                                                    label="EXCLUSIVE VIP PASS"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#f59e0b',
                                                        color: '#000',
                                                        fontWeight: 900,
                                                        fontSize: '0.72rem',
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        border: `2px solid ${visitorType === 'exclusive' ? '#f59e0b' : '#64748b'}`,
                                                        bgcolor: visitorType === 'exclusive' ? '#f59e0b' : 'transparent',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: visitorType === 'exclusive' ? '0 0 10px #f59e0b' : 'none',
                                                    }}
                                                >
                                                    {visitorType === 'exclusive' && <CheckCircleIcon sx={{ fontSize: 16, color: '#000' }} />}
                                                </Box>
                                            </Box>

                                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', mb: 0.5 }}>
                                                Visitor Exclusive
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#fbbf24', mb: 1.5 }}>
                                                Rp {priceExclusive.toLocaleString('id-ID')} <Typography component="span" variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>/ orang</Typography>
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, mb: 2 }}>
                                                Akses menyeluruh Plenary Session, VIP Lounge, Exhibition, Kartu Lanyard Gold, serta Seminar Kit resmi.
                                            </Typography>

                                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 1.5 }} />

                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                        <WorkspacePremiumIcon sx={{ fontSize: 15, color: '#fbbf24' }} /> Kartu Lanyard Desain Gold VIP
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                        <WorkspacePremiumIcon sx={{ fontSize: 15, color: '#fbbf24' }} /> Akses Plenary & VIP Lounge
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Stack>
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
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    color: '#fff',
                                                    fontSize: '0.9rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 900,
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                                                }}
                                            >
                                                2
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                                                Data Pengunjung {members.length > 1 && `(${members.length} Orang)`}
                                            </Typography>
                                        </Box>

                                        <Button
                                            startIcon={<PersonAddIcon />}
                                            onClick={addMember}
                                            sx={{
                                                color: '#34d399',
                                                bgcolor: 'rgba(16, 185, 129, 0.12)',
                                                border: '1px dashed rgba(16, 185, 129, 0.4)',
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontWeight: 800,
                                                fontSize: '0.82rem',
                                                px: 2,
                                                py: 0.8,
                                                '&:hover': {
                                                    bgcolor: 'rgba(16, 185, 129, 0.22)',
                                                    borderColor: '#10b981',
                                                    transform: 'translateY(-1px)',
                                                },
                                                transition: 'all 0.2s',
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
                                                    bgcolor: 'rgba(15, 23, 42, 0.65)',
                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                    backdropFilter: 'blur(16px)',
                                                    p: 3,
                                                    boxShadow: '0 8px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                        <Box
                                                            sx={{
                                                                width: 26,
                                                                height: 26,
                                                                borderRadius: '8px',
                                                                bgcolor: idx === 0 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                                                color: idx === 0 ? '#38bdf8' : '#cbd5e1',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 900,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                                        </Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: idx === 0 ? '#38bdf8' : '#e2e8f0' }}>
                                                            {idx === 0 ? 'Data Pemesan Utama / Ketua' : `Peserta #${idx + 1}`}
                                                        </Typography>
                                                    </Box>

                                                    {members.length > 1 && (
                                                        <IconButton
                                                            onClick={() => removeMember(idx)}
                                                            size="small"
                                                            sx={{
                                                                color: '#f87171',
                                                                bgcolor: 'rgba(239, 68, 68, 0.12)',
                                                                borderRadius: '8px',
                                                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.25)' },
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
                                                                    bgcolor: 'rgba(30, 41, 59, 0.7)',
                                                                    color: '#fff',
                                                                    borderRadius: '12px',
                                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                                    '&:hover': { borderColor: 'rgba(16, 185, 129, 0.4)' },
                                                                    '&.Mui-focused': { borderColor: '#10b981', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.15)' },
                                                                },
                                                                '& .MuiInputLabel-root': { color: '#94a3b8' },
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
                                                                    bgcolor: 'rgba(30, 41, 59, 0.7)',
                                                                    color: '#fff',
                                                                    borderRadius: '12px',
                                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                                    '&:hover': { borderColor: 'rgba(16, 185, 129, 0.4)' },
                                                                    '&.Mui-focused': { borderColor: '#10b981', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.15)' },
                                                                },
                                                                '& .MuiInputLabel-root': { color: '#94a3b8' },
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
                                                                    bgcolor: 'rgba(30, 41, 59, 0.7)',
                                                                    color: '#fff',
                                                                    borderRadius: '12px',
                                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                                    '&:hover': { borderColor: 'rgba(16, 185, 129, 0.4)' },
                                                                    '&.Mui-focused': { borderColor: '#10b981', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.15)' },
                                                                },
                                                                '& .MuiInputLabel-root': { color: '#94a3b8' },
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
                                                                    bgcolor: 'rgba(30, 41, 59, 0.7)',
                                                                    color: '#fff',
                                                                    borderRadius: '12px',
                                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                                    '&:hover': { borderColor: 'rgba(16, 185, 129, 0.4)' },
                                                                    '&.Mui-focused': { borderColor: '#10b981', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.15)' },
                                                                },
                                                                '& .MuiInputLabel-root': { color: '#94a3b8' },
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
                                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                    color: '#000',
                                                    fontSize: '0.9rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 900,
                                                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                                                }}
                                            >
                                                3
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                                                Pembayaran Tiket Exclusive
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                borderRadius: '20px',
                                                bgcolor: 'rgba(15, 23, 42, 0.75)',
                                                border: '1.5px solid rgba(245, 158, 11, 0.3)',
                                                backdropFilter: 'blur(16px)',
                                                p: 3.5,
                                                boxShadow: '0 15px 35px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
                                            }}
                                        >
                                            {/* Total Summary Banner */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 3,
                                                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                                                    border: '1px solid rgba(245, 158, 11, 0.25)',
                                                    p: 2.5,
                                                    borderRadius: '16px',
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800, display: 'block' }}>
                                                        Total Pembayaran ({members.length} Tiket VIP)
                                                    </Typography>
                                                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#fbbf24', letterSpacing: '-0.02em', mt: 0.3 }}>
                                                        Rp {totalEstimate.toLocaleString('id-ID')}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label="Wajib Bayar"
                                                    size="small"
                                                    sx={{ bgcolor: '#fbbf24', color: '#000', fontWeight: 900, fontSize: '0.75rem' }}
                                                />
                                            </Box>

                                            {/* Payment Method Selector */}
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#e2e8f0', mb: 1.5 }}>
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
                                                            borderRadius: '14px',
                                                            bgcolor: paymentMethod === 'qris_indo' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                                                            border: `2px solid ${paymentMethod === 'qris_indo' ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                            transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(16, 185, 129, 0.2)', display: 'flex' }}>
                                                            <QrCodeIcon sx={{ color: '#34d399', fontSize: 24 }} />
                                                        </Box>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#fff' }}>QRIS Indonesia</Typography>
                                                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>BCA, Mandiri, GoPay, OVO, Dana</Typography>
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
                                                            borderRadius: '14px',
                                                            bgcolor: paymentMethod === 'foreign_bank_transfer' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                                                            border: `2px solid ${paymentMethod === 'foreign_bank_transfer' ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                            transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(56, 189, 248, 0.2)', display: 'flex' }}>
                                                            <AccountBalanceIcon sx={{ color: '#38bdf8', fontSize: 24 }} />
                                                        </Box>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#fff' }}>Bank Transfer / SWIFT</Typography>
                                                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Manual Transfer Bank IAGI</Typography>
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                            </Grid>

                                            {/* QRIS Display or Bank Info */}
                                            {paymentMethod === 'qris_indo' && (
                                                <Box
                                                    sx={{
                                                        textAlign: 'center',
                                                        p: 3,
                                                        bgcolor: 'rgba(30, 41, 59, 0.5)',
                                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                                        borderRadius: '16px',
                                                        mb: 3.5,
                                                    }}
                                                >
                                                    {qrisImage ? (
                                                        <Box
                                                            component="img"
                                                            src={qrisImage.startsWith('http') || qrisImage.startsWith('/') ? qrisImage : `/storage/${qrisImage}`}
                                                            alt="QRIS IAGI"
                                                            sx={{
                                                                maxWidth: 240,
                                                                borderRadius: '12px',
                                                                mx: 'auto',
                                                                mb: 2,
                                                                p: 1.5,
                                                                bgcolor: '#fff',
                                                                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                                            }}
                                                        />
                                                    ) : (
                                                        <Box sx={{ p: 4, border: '2px dashed #475569', borderRadius: '12px', maxWidth: 240, mx: 'auto', mb: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
                                                            <QrCodeIcon sx={{ fontSize: 70, color: '#64748b' }} />
                                                            <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', mt: 1 }}>QRIS Resmi PIT IAGI 2026</Typography>
                                                        </Box>
                                                    )}
                                                    <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                                                        Scan kode QRIS di atas menggunakan aplikasi m-Banking atau E-Wallet pilihan Anda.
                                                    </Typography>
                                                </Box>
                                            )}

                                            {paymentMethod === 'foreign_bank_transfer' && (
                                                <Box
                                                    sx={{
                                                        p: 3,
                                                        bgcolor: 'rgba(30, 41, 59, 0.5)',
                                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                                        borderRadius: '16px',
                                                        mb: 3.5,
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#38bdf8' }}>
                                                            Rekening Transfer Bank IAGI:
                                                        </Typography>
                                                        <Button
                                                            size="small"
                                                            startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                                                            onClick={handleCopyBankInfo}
                                                            sx={{
                                                                color: '#38bdf8',
                                                                bgcolor: 'rgba(56, 189, 248, 0.1)',
                                                                textTransform: 'none',
                                                                fontSize: '0.75rem',
                                                                borderRadius: '8px',
                                                                '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.2)' },
                                                            }}
                                                        >
                                                            {copySuccess ? 'Tersalin!' : 'Salin Rekening'}
                                                        </Button>
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#f8fafc',
                                                            whiteSpace: 'pre-line',
                                                            fontFamily: 'monospace',
                                                            bgcolor: 'rgba(15, 23, 42, 0.8)',
                                                            p: 2,
                                                            borderRadius: '10px',
                                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                                            lineHeight: 1.7,
                                                        }}
                                                    >
                                                        {bankTransferInfo}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Upload Proof of Payment */}
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#e2e8f0', mb: 0.5 }}>
                                                Unggah Bukti Pembayaran *
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
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
                                                        borderRadius: '12px',
                                                        borderColor: 'rgba(56, 189, 248, 0.4)',
                                                        color: '#38bdf8',
                                                        bgcolor: 'rgba(56, 189, 248, 0.08)',
                                                        textTransform: 'none',
                                                        fontWeight: 800,
                                                        px: 2.5,
                                                        py: 1.2,
                                                        '&:hover': { borderColor: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.16)' },
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
                                                        borderRadius: '12px',
                                                        borderColor: 'rgba(255, 255, 255, 0.15)',
                                                        color: '#cbd5e1',
                                                        bgcolor: 'rgba(255, 255, 255, 0.04)',
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        px: 2.5,
                                                        py: 1.2,
                                                        '&:hover': { borderColor: '#10b981', color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.08)' },
                                                    }}
                                                >
                                                    📁 Pilih dari Galeri
                                                </Button>
                                            </Box>

                                            {compressing && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 2 }}>
                                                    <CircularProgress size={20} sx={{ color: '#10b981' }} />
                                                    <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>
                                                        Mengompresi foto otomatis di browser...
                                                    </Typography>
                                                </Box>
                                            )}

                                            {proofPreview && (
                                                <Box
                                                    sx={{
                                                        mt: 2,
                                                        p: 2,
                                                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                                        borderRadius: '14px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={proofPreview}
                                                        alt="Bukti Transfer"
                                                        sx={{ width: 68, height: 68, objectFit: 'cover', borderRadius: '10px', border: '1px solid #10b981' }}
                                                    />
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <CheckCircleIcon sx={{ fontSize: 16 }} /> Foto siap diunggah!
                                                        </Typography>
                                                        {compressionStats && (
                                                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.3 }}>
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
                                <Box sx={{ mt: 5, mb: 4 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        disabled={processing || compressing}
                                        startIcon={processing ? <CircularProgress size={22} color="inherit" /> : <ConfirmationNumberIcon />}
                                        sx={{
                                            background: isExclusive 
                                                ? 'linear-gradient(180deg, #fbbf24 0%, #d97706 100%)' 
                                                : 'linear-gradient(180deg, #10b981 0%, #047857 100%)',
                                            color: isExclusive ? '#000' : '#fff',
                                            fontWeight: 900,
                                            fontSize: { xs: '1.05rem', md: '1.18rem' },
                                            py: 2,
                                            borderRadius: '16px',
                                            textTransform: 'none',
                                            letterSpacing: '0.01em',
                                            border: `1px solid ${isExclusive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.3)'}`,
                                            boxShadow: isExclusive
                                                ? '0 6px 0 #92400e, 0 15px 30px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255,255,255,0.5)'
                                                : '0 6px 0 #064e3b, 0 15px 30px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.5)',
                                            '&:hover': {
                                                background: isExclusive
                                                    ? 'linear-gradient(180deg, #fcd34d 0%, #b45309 100%)'
                                                    : 'linear-gradient(180deg, #34d399 0%, #065f46 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: isExclusive
                                                    ? '0 8px 0 #92400e, 0 18px 35px rgba(245, 158, 11, 0.5), inset 0 1px 0 rgba(255,255,255,0.6)'
                                                    : '0 8px 0 #064e3b, 0 18px 35px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255,255,255,0.6)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(4px)',
                                                boxShadow: isExclusive
                                                    ? '0 2px 0 #92400e, 0 6px 15px rgba(245, 158, 11, 0.4)'
                                                    : '0 2px 0 #064e3b, 0 6px 15px rgba(16, 185, 129, 0.4)',
                                            },
                                            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
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
