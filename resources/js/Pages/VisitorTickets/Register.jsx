import React, { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
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
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    Alert,
    CircularProgress,
    Tooltip,
    Paper,
    Snackbar,
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
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';

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

                    // Max resolution dimension: 1600px
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

                    // Compress to JPEG quality 0.75
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
        
        // Basic validation
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

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'radial-gradient(ellipse at top, #092c25 0%, #05141b 50%, #03080c 100%)',
                color: '#f8fafc',
                position: 'relative',
                overflow: 'hidden',
                py: { xs: 3, md: 7 },
            }}
        >
            <Head title="Registrasi Tiket Penonton - 55th PIT IAGI & GEOSEA 2026" />

            {/* Ambient Background Glows */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '20%',
                    width: '600px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: '30%',
                    right: '10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(234, 179, 8, 0.08) 0%, transparent 70%)',
                    filter: 'blur(70px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Navigation & Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        component={Link}
                        href="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: '#94a3b8',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '10px',
                            px: 2,
                            py: 0.8,
                            bgcolor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                                color: '#fff',
                                bgcolor: 'rgba(255, 255, 255, 0.08)',
                                borderColor: 'rgba(16, 185, 129, 0.4)',
                            },
                        }}
                    >
                        Kembali ke Beranda
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SecurityIcon sx={{ fontSize: 16, color: '#10b981' }} />
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                            Official Conference Portal
                        </Typography>
                    </Box>
                </Box>

                {/* Hero Title Section */}
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 0.7,
                            borderRadius: '50px',
                            bgcolor: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            backdropFilter: 'blur(10px)',
                            mb: 2,
                            boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)',
                        }}
                    >
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                        <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            55th PIT IAGI & GEOSEA XIX 2026
                        </Typography>
                    </Box>

                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '2rem', sm: '2.6rem', md: '3.1rem' },
                            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.15,
                            mb: 1.5,
                        }}
                    >
                        Registrasi Tiket Penonton
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: '#94a3b8',
                            maxWidth: 620,
                            mx: 'auto',
                            fontSize: { xs: '0.95rem', md: '1.05rem' },
                            lineHeight: 1.6,
                        }}
                    >
                        Dapatkan tiket resmi & QR Code digital untuk akses langsung ke arena pameran geologi, sesi poster ilmiah, serta zona industri energi & mineral.
                    </Typography>

                    {/* Venue & Date Frosted Pill */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            gap: { xs: 1.5, sm: 3 },
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            bgcolor: 'rgba(15, 23, 42, 0.65)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(16px)',
                            borderRadius: '16px',
                            px: { xs: 2, sm: 3 },
                            py: 1.2,
                            mt: 3,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: 'rgba(56, 189, 248, 0.15)', display: 'flex' }}>
                                <EventIcon sx={{ fontSize: 17, color: '#38bdf8' }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>
                                {eventDate}
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', display: { xs: 'none', sm: 'block' } }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: 'rgba(244, 63, 94, 0.15)', display: 'flex' }}>
                                <LocationOnIcon sx={{ fontSize: 17, color: '#f43f5e' }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>
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
                            bgcolor: 'rgba(234, 179, 8, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid rgba(234, 179, 8, 0.3)',
                            p: 3,
                            fontSize: '0.95rem',
                        }}
                    >
                        Pendaftaran tiket penonton saat ini sedang ditutup oleh panitia. Silakan hubungi panitia untuk informasi lebih lanjut.
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* STEP 1: CATEGORY SELECTION */}
                        <Box sx={{ mb: 4.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                <Box
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: '#fff',
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
                                    }}
                                >
                                    1
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                                    Pilih Kategori Tiket
                                </Typography>
                            </Box>

                            <Grid container spacing={3}>
                                {/* Non-Exclusive Free Pass */}
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        onClick={() => handleTypeChange('non_exclusive')}
                                        sx={{
                                            cursor: 'pointer',
                                            borderRadius: '20px',
                                            bgcolor: visitorType === 'non_exclusive' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.55)',
                                            border: `2px solid ${visitorType === 'non_exclusive' ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
                                            backdropFilter: 'blur(16px)',
                                            boxShadow: visitorType === 'non_exclusive'
                                                ? '0 12px 35px rgba(16, 185, 129, 0.2), inset 0 0 20px rgba(16, 185, 129, 0.05)'
                                                : '0 8px 20px rgba(0,0,0,0.2)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                borderColor: '#10b981',
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 15px 35px rgba(16, 185, 129, 0.25)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Chip
                                                    label="FREE ENTRY PASS"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(16, 185, 129, 0.2)',
                                                        color: '#34d399',
                                                        fontWeight: 800,
                                                        fontSize: '0.72rem',
                                                        letterSpacing: '0.05em',
                                                        border: '1px solid rgba(16, 185, 129, 0.4)',
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        width: 22,
                                                        height: 22,
                                                        borderRadius: '50%',
                                                        border: `2px solid ${visitorType === 'non_exclusive' ? '#10b981' : '#475569'}`,
                                                        bgcolor: visitorType === 'non_exclusive' ? '#10b981' : 'transparent',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    {visitorType === 'non_exclusive' && (
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fff' }} />
                                                    )}
                                                </Box>
                                            </Box>

                                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', mb: 0.5 }}>
                                                Visitor Non-Exclusive
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#34d399', mb: 1.5 }}>
                                                GRATIS <Typography component="span" variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>(Free Pass)</Typography>
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, mb: 2.5 }}>
                                                Akses langsung ke area pameran umum, poster presentation, dan booth exhibition tanpa dipungut biaya registrasi.
                                            </Typography>

                                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />

                                            <Stack spacing={1.2}>
                                                <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                                                    <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} /> E-Tiket instan ber-QR Code langsung terbit
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                                                    <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} /> Cetak Kartu Lanyard Non-Exclusive di Gate
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                                                    <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} /> Tanpa perlu upload bukti transfer
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Exclusive VIP Pass */}
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        onClick={() => handleTypeChange('exclusive')}
                                        sx={{
                                            cursor: 'pointer',
                                            borderRadius: '20px',
                                            bgcolor: visitorType === 'exclusive' ? 'rgba(234, 179, 8, 0.08)' : 'rgba(15, 23, 42, 0.55)',
                                            border: `2px solid ${visitorType === 'exclusive' ? '#eab308' : 'rgba(255, 255, 255, 0.08)'}`,
                                            backdropFilter: 'blur(16px)',
                                            boxShadow: visitorType === 'exclusive'
                                                ? '0 12px 35px rgba(234, 179, 8, 0.22), inset 0 0 20px rgba(234, 179, 8, 0.06)'
                                                : '0 8px 20px rgba(0,0,0,0.2)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                borderColor: '#eab308',
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 15px 35px rgba(234, 179, 8, 0.28)',
                                            },
                                        }}
                                    >
                                        {/* Top Ribbon */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 14,
                                                right: 14,
                                                bgcolor: 'rgba(234, 179, 8, 0.2)',
                                                border: '1px solid rgba(234, 179, 8, 0.4)',
                                                color: '#fbbf24',
                                                fontSize: '0.65rem',
                                                fontWeight: 800,
                                                px: 1,
                                                py: 0.3,
                                                borderRadius: '6px',
                                                letterSpacing: '0.05em',
                                            }}
                                        >
                                            VIP RECOMMENDED
                                        </Box>

                                        <CardContent sx={{ p: 3.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Chip
                                                    icon={<StarIcon sx={{ fontSize: 13, color: '#000 !important' }} />}
                                                    label="EXCLUSIVE VIP PASS"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                        backgroundColor: '#f59e0b',
                                                        color: '#000',
                                                        fontWeight: 900,
                                                        fontSize: '0.72rem',
                                                        letterSpacing: '0.04em',
                                                    }}
                                                />
                                            </Box>

                                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', mb: 0.5 }}>
                                                Visitor Exclusive
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#fbbf24', mb: 1.5 }}>
                                                Rp {priceExclusive.toLocaleString('id-ID')} <Typography component="span" variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>/ orang</Typography>
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, mb: 2.5 }}>
                                                Akses menyeluruh Plenary Session, VIP Lounge, Exhibition, Kartu Lanyard Gold, serta Seminar Kit resmi.
                                            </Typography>

                                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />

                                            <Stack spacing={1.2}>
                                                <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                                                    <WorkspacePremiumIcon sx={{ fontSize: 16, color: '#fbbf24' }} /> Kartu Lanyard Fisik Desain Exclusive VIP
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                                                    <WorkspacePremiumIcon sx={{ fontSize: 16, color: '#fbbf24' }} /> Akses Main Plenary & VIP Networking Lounge
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                                                    <WorkspacePremiumIcon sx={{ fontSize: 16, color: '#fbbf24' }} /> E-Certificate & Official Seminar Kit
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* STEP 2: VISITOR DATA (SINGLE OR GROUP) */}
                        <Box sx={{ mb: 4.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: '#fff',
                                            fontSize: '0.85rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 800,
                                            boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
                                        }}
                                    >
                                        2
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
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
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontWeight: 700,
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
                                    + Tambah Peserta Rombongan
                                </Button>
                            </Box>

                            <Stack spacing={2.5}>
                                {members.map((member, idx) => (
                                    <Card
                                        key={idx}
                                        sx={{
                                            borderRadius: '18px',
                                            bgcolor: 'rgba(15, 23, 42, 0.65)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            backdropFilter: 'blur(16px)',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '6px',
                                                            bgcolor: idx === 0 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                                            color: idx === 0 ? '#38bdf8' : '#cbd5e1',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 800,
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
                                                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                            borderRadius: '8px',
                                                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' },
                                                        }}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>

                                            <Grid container spacing={2.5}>
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
                                                        helperText="E-Tiket ber-QR Code akan dikirim ke email ini"
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
                                                        label="Instansi / Universitas / Perusahaan"
                                                        placeholder="Contoh: ITB / Pertamina / Umum"
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
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Box>

                        {/* STEP 3: PAYMENT SECTION (EXCLUSIVE ONLY) */}
                        {visitorType === 'exclusive' && (
                            <Box sx={{ mb: 4.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                    <Box
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                            color: '#000',
                                            fontSize: '0.85rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 900,
                                            boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)',
                                        }}
                                    >
                                        3
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                                        Pembayaran Tiket Exclusive
                                    </Typography>
                                </Box>

                                <Card
                                    sx={{
                                        borderRadius: '20px',
                                        bgcolor: 'rgba(15, 23, 42, 0.75)',
                                        border: '1px solid rgba(234, 179, 8, 0.3)',
                                        backdropFilter: 'blur(16px)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                                        {/* Total Summary Banner */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 3,
                                                bgcolor: 'rgba(234, 179, 8, 0.1)',
                                                border: '1px solid rgba(234, 179, 8, 0.25)',
                                                p: 2.5,
                                                borderRadius: '14px',
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block' }}>
                                                    Total Pembayaran ({members.length} Tiket Exclusive)
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
                                                        p: 2.2,
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
                                                    <Radio checked={paymentMethod === 'qris_indo'} sx={{ p: 0, color: '#10b981' }} />
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Paper
                                                    onClick={() => {
                                                        setPaymentMethod('foreign_bank_transfer');
                                                        setData('payment_method', 'foreign_bank_transfer');
                                                    }}
                                                    sx={{
                                                        p: 2.2,
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
                                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#fff' }}>Bank Transfer / Luar Negeri</Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>SWIFT / Manual Transfer</Typography>
                                                    </Box>
                                                    <Radio checked={paymentMethod === 'foreign_bank_transfer'} sx={{ p: 0, color: '#38bdf8' }} />
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

                                        {/* Upload Proof of Payment with Direct Camera & Auto-Compress */}
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#e2e8f0', mb: 0.5 }}>
                                            Unggah Bukti Pembayaran *
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                                            Foto berukuran besar (10MB+) dari kamera HP akan dikompresi otomatis &lt; 500KB agar cepat terunggah.
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
                                                    fontWeight: 700,
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
                                                    fontWeight: 600,
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
                                    </CardContent>
                                </Card>
                            </Box>
                        )}

                        {/* SUBMIT BUTTON */}
                        <Box sx={{ textAlign: 'center', mt: 5, mb: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={processing || compressing}
                                startIcon={processing ? <CircularProgress size={22} color="inherit" /> : <ConfirmationNumberIcon />}
                                sx={{
                                    background: visitorType === 'exclusive' 
                                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: visitorType === 'exclusive' ? '#000' : '#fff',
                                    fontWeight: 900,
                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                    py: 2,
                                    borderRadius: '16px',
                                    textTransform: 'none',
                                    letterSpacing: '0.01em',
                                    boxShadow: visitorType === 'exclusive'
                                        ? '0 10px 30px rgba(245, 158, 11, 0.4)'
                                        : '0 10px 30px rgba(16, 185, 129, 0.4)',
                                    '&:hover': {
                                        background: visitorType === 'exclusive'
                                            ? 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)'
                                            : 'linear-gradient(135deg, #34d399 0%, #047857 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: visitorType === 'exclusive'
                                            ? '0 14px 35px rgba(245, 158, 11, 0.5)'
                                            : '0 14px 35px rgba(16, 185, 129, 0.5)',
                                    },
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                {processing 
                                    ? 'Memproses Pendaftaran...' 
                                    : visitorType === 'exclusive' 
                                        ? `Submit Pendaftaran Exclusive (Rp ${totalEstimate.toLocaleString('id-ID')})` 
                                        : 'Terbitkan E-Tiket Gratis Sekarang'
                                }
                            </Button>

                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 2, fontWeight: 500 }}>
                                🔒 Data pengunjung & pembayaran terenkripsi aman &bull; Dikelola oleh Panitia Resmi 55th PIT IAGI & GEOSEA 2026
                            </Typography>
                        </Box>
                    </form>
                )}
            </Container>
        </Box>
    );
}
