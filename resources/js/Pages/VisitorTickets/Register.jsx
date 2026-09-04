import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Chip,
    Stack,
    Divider,
    IconButton,
    Alert,
    CircularProgress,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Tooltip,
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ConstructionIcon from '@mui/icons-material/Construction';

export default function Register({
    categories: propCategories = [],
    priceExclusive: propPriceExclusive,
    priceNonExclusive: propPriceNonExclusive,
    enabled: propEnabled,
    qrisImage: propQrisImage,
    bankTransferInfo: propBankTransferInfo,
    eventDate: propEventDate,
    eventVenue: propEventVenue,
    settings = {},
}) {
    const defaultCategories = [
        {
            id: 'iagi_member_professional',
            group: 'conference',
            name: 'IAGI Member - Professional',
            badge: 'IAGI MEMBER',
            normalPrice: 3000000,
            price: 3000000,
            tag: 'IAGI MEMBER',
            discountAmount: 0,
            tagColor: '#047857',
            tagBg: '#dcfce7',
            borderSelected: '#10b981',
            bgSelected: '#f0fdf4',
            lanyardTheme: { border: '#059669', banner: '#094d42', badge: 'IAGI MEMBER PRO' },
            description: 'Full conference sessions, exhibition arena, scientific poster sessions, lanyard ID badge & lunches.',
            perks: ['Full Conference Access', 'Seminar Kit & Lanyard', 'Exhibition Arena & Lunches'],
        },
        {
            id: 'non_iagi_member_professional',
            group: 'conference',
            name: 'Non IAGI Member - Professional',
            badge: 'NON-MEMBER PRO',
            normalPrice: 4000000,
            price: 4000000,
            tag: 'NON-MEMBER PRO',
            discountAmount: 0,
            tagColor: '#0284c7',
            tagBg: '#e0f2fe',
            borderSelected: '#0284c7',
            bgSelected: '#f0f9ff',
            lanyardTheme: { border: '#0284c7', banner: '#0369a1', badge: 'NON-MEMBER PRO' },
            description: 'Full conference sessions, exhibition arena, scientific poster sessions, lanyard ID badge & lunches.',
            perks: ['Full Conference Access', 'Seminar Kit & Lanyard', 'Exhibition Arena & Lunches'],
        },
        {
            id: 'iagi_member_expatriate',
            group: 'conference',
            name: 'IAGI Member - Expatriate',
            badge: 'IAGI EXPATRIATE',
            normalPrice: 6000000,
            price: 6000000,
            tag: 'IAGI EXPATRIATE',
            discountAmount: 0,
            tagColor: '#b45309',
            tagBg: '#fef3c7',
            borderSelected: '#f59e0b',
            bgSelected: '#fffbeb',
            lanyardTheme: { border: '#f59e0b', banner: '#b45309', badge: 'IAGI EXPATRIATE' },
            description: 'Full international delegate access, technical sessions, exhibition, VIP lanyard & gala dinner.',
            perks: ['International Delegate', 'VIP Lanyard & Kit', 'Plenary & Gala Dinner'],
        },
        {
            id: 'non_iagi_member_expatriate',
            group: 'conference',
            name: 'Non IAGI Member - Expatriate',
            badge: 'INTERNATIONAL DELEGATE',
            normalPrice: 7000000,
            price: 7000000,
            tag: 'INTERNATIONAL DELEGATE',
            discountAmount: 0,
            tagColor: '#7c3aed',
            tagBg: '#ede9fe',
            borderSelected: '#8b5cf6',
            bgSelected: '#f5f3ff',
            lanyardTheme: { border: '#8b5cf6', banner: '#6d28d9', badge: 'INTERNATIONAL DELEGATE' },
            description: 'Full international delegate access, technical sessions, exhibition, VIP lanyard & gala dinner.',
            perks: ['International Delegate', 'VIP Lanyard & Kit', 'Plenary & Gala Dinner'],
        },
        {
            id: 'student_undergraduate',
            group: 'conference',
            name: 'Student Undergraduate',
            badge: 'STUDENT PASS',
            normalPrice: 1000000,
            price: 1000000,
            tag: 'STUDENT PASS',
            discountAmount: 0,
            tagColor: '#4338ca',
            tagBg: '#e0e7ff',
            borderSelected: '#6366f1',
            bgSelected: '#eef2ff',
            lanyardTheme: { border: '#6366f1', banner: '#4338ca', badge: 'STUDENT PASS' },
            description: 'Undergraduate student pass (valid student ID required), technical sessions & certificate.',
            perks: ['Student ID Required', 'Technical Sessions', 'Exhibition & E-Certificate'],
        },
        {
            id: 'non_exclusive',
            group: 'visitor',
            name: 'Visitor',
            badge: 'FREE PASS',
            normalPrice: 0,
            price: 0,
            tag: 'FREE PASS',
            discountAmount: 0,
            tagColor: '#059669',
            tagBg: '#d1fae5',
            borderSelected: '#10b981',
            bgSelected: '#f0fdf4',
            lanyardTheme: { border: '#10b981', banner: '#094d42', badge: 'VISITOR PASS' },
            description: 'Access to general geological exhibition arena & scientific poster exhibition sessions.',
            perks: ['General Exhibition', 'Poster Sessions', 'Instant E-Ticket & Badge'],
        },
    ];

    const regularPrices = {
        iagi_member_professional: 3000000,
        non_iagi_member_professional: 4000000,
        iagi_member_expatriate: 6000000,
        non_iagi_member_expatriate: 7000000,
        student_undergraduate: 1000000,
        non_exclusive: 0,
    };

    const categoriesList = defaultCategories.map(d => {
        const propCat = propCategories?.find(c => c.id === d.id);
        const regularPrice = regularPrices[d.id] ?? d.price;
        return {
            ...d,
            ...(propCat || {}),
            price: regularPrice,
            normalPrice: regularPrice,
            discountAmount: 0,
        };
    });

    const enabled = propEnabled ?? settings.enabled ?? true;
    const qrisImage = propQrisImage ?? settings.qrisImage ?? null;
    const bankTransferInfo = propBankTransferInfo ?? settings.bankTransferInfo ?? settings.bankInfo ?? "Bank Mandiri\nNo. Rek: 123-456-7890\na.n. Panitia PIT IAGI 2026";
    const eventDate = propEventDate ?? settings.eventDate ?? '3-5 November 2026';
    const eventVenue = propEventVenue ?? settings.eventVenue ?? 'Royal Ambarrukmo Yogyakarta';
    
    const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'conference', 'visitor'
    const [visitorType, setVisitorType] = useState('iagi_member_professional');
    const [paymentMethod, setPaymentMethod] = useState('foreign_bank_transfer');
    const [members, setMembers] = useState([
        { name: '', email: '', phone: '', institution: '' }
    ]);
    const [proofFile, setProofFile] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [compressionStats, setCompressionStats] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Live Camera Viewfinder Modal State
    const [cameraModalOpen, setCameraModalOpen] = useState(false);
    const [cameraFacingMode, setCameraFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
    const [cameraLoading, setCameraLoading] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        visitor_type: 'iagi_member_professional',
        members: members,
        payment_method: 'foreign_bank_transfer',
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
        setMousePos({ x: x * 14, y: y * -14 });
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

    const processFileAndSet = async (file) => {
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
            alert('Failed to process image. Please try another file.');
        } finally {
            setCompressing(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processFileAndSet(file);
    };

    // DIRECT CAMERA STREAM (WebRTC Live Viewfinder)
    useEffect(() => {
        let stream = null;
        let isCancelled = false;

        if (cameraModalOpen) {
            setCameraLoading(true);
            setCameraError(null);

            const initCamera = async () => {
                try {
                    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                        throw new Error('WebRTC camera is not supported in this browser.');
                    }

                    let constraints = {
                        video: {
                            facingMode: cameraFacingMode === 'environment' ? { ideal: 'environment' } : 'user',
                            width: { ideal: 1280 },
                            height: { ideal: 720 },
                        },
                        audio: false,
                    };

                    let mediaStream;
                    try {
                        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                    } catch (fallbackErr) {
                        console.warn('Ideal constraints failed, trying default video:', fallbackErr);
                        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    }

                    if (isCancelled) {
                        mediaStream.getTracks().forEach(track => track.stop());
                        return;
                    }

                    stream = mediaStream;
                    streamRef.current = mediaStream;

                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current?.play().catch(e => console.log('Video play interrupted:', e));
                            setCameraLoading(false);
                        };
                    }
                } catch (err) {
                    console.error('Camera stream error:', err);
                    setCameraLoading(false);
                    setCameraError('Unable to access camera. Please ensure camera permissions are granted or use your device camera.');
                }
            };

            initCamera();
        } else {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }

        return () => {
            isCancelled = true;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraModalOpen, cameraFacingMode]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraModalOpen(false);
    };

    const handleOpenDirectCamera = () => {
        setCameraModalOpen(true);
    };

    const handleSwitchCamera = () => {
        setCameraFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    const handleCapturePhoto = () => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) {
                alert('Failed to capture photo from camera.');
                return;
            }

            const capturedFile = new File([blob], `payment_proof_${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
            });

            stopCamera();
            processFileAndSet(capturedFile);
        }, 'image/jpeg', 0.85);
    };

    const selectedCategory = categoriesList.find(c => c.id === visitorType) || categoriesList[0];
    const isPaid = (selectedCategory?.price ?? 0) > 0;
    const totalEstimate = (selectedCategory?.price ?? 0) * members.length;
    const primaryMember = members[0] || { name: '', institution: '' };

    const filteredCategories = selectedTab === 'all'
        ? categoriesList
        : categoriesList.filter(c => c.group === selectedTab);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        for (let i = 0; i < members.length; i++) {
            if (!members[i].name || !members[i].email) {
                alert(`Please complete Full Name and Email for Participant #${i + 1}`);
                return;
            }
        }

        if (isPaid && !proofFile) {
            alert(`Please upload payment proof for ${selectedCategory.name} registration.`);
            return;
        }

        post(route('visitor.tickets.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f8fafc',
                color: '#0f172a',
                py: { xs: 2.5, md: 4 },
                backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
            }}
        >
            <Head title="Registration & Ticket Portal - 55th PIT IAGI & GEOSEA 2026" />

            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Top Nav Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.2,
                        px: 2.5,
                        borderRadius: '16px',
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        mb: 3,
                    }}
                >
                    <Button
                        component={Link}
                        href="/"
                        startIcon={<ArrowBackIcon />}
                        size="small"
                        sx={{
                            color: '#334155',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            borderRadius: '10px',
                            px: 1.8,
                            py: 0.6,
                            bgcolor: '#f1f5f9',
                            '&:hover': {
                                color: '#094d42',
                                bgcolor: '#e2e8f0',
                            },
                        }}
                    >
                        Back to Home
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                            Official Registration Portal &bull; PIT IAGI & GEOSEA 2026
                        </Typography>
                    </Box>
                </Box>

                {/* Hero Header Section */}
                <Box sx={{ textAlign: 'center', mb: 3.5 }}>
                    <Chip
                        icon={<ConfirmationNumberIcon sx={{ fontSize: '15px !important', color: '#047857 !important' }} />}
                        label="CONFERENCE & VISITOR PASSES &bull; REGISTRATION OPEN"
                        size="small"
                        sx={{
                            bgcolor: '#ecfdf5',
                            color: '#047857',
                            border: '1px solid #a7f3d0',
                            fontWeight: 900,
                            fontSize: '0.72rem',
                            letterSpacing: '0.06em',
                            px: 1,
                            py: 0.4,
                            mb: 1.5,
                            borderRadius: '20px',
                        }}
                    />

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                            letterSpacing: '-0.03em',
                            color: '#0f172a',
                            lineHeight: 1.2,
                            mb: 0.8,
                        }}
                    >
                        Conference & Visitor Registration
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: '#64748b',
                            maxWidth: 680,
                            mx: 'auto',
                            fontSize: { xs: '0.88rem', md: '0.95rem' },
                            lineHeight: 1.6,
                            mb: 2,
                        }}
                    >
                        Select your registration category below to receive your official conference badge, digital QR ticket pass, and seminar credentials for PIT IAGI & GEOSEA 2026.
                    </Typography>

                    {/* Venue & Date Pills */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            gap: { xs: 1.5, sm: 2.5 },
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            px: 2.5,
                            py: 0.8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <EventIcon sx={{ fontSize: 18, color: '#0284c7' }} />
                            <Typography variant="caption" sx={{ color: '#1e293b', fontWeight: 800, fontSize: '0.8rem' }}>
                                {eventDate}
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto', borderColor: '#cbd5e1' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <LocationOnIcon sx={{ fontSize: 18, color: '#e11d48' }} />
                            <Typography variant="caption" sx={{ color: '#1e293b', fontWeight: 800, fontSize: '0.8rem' }}>
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
                            fontSize: '0.95rem',
                            fontWeight: 700,
                        }}
                    >
                        Conference ticket registration is currently closed by the committee.
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* 2-COLUMN LAYOUT: FORM ON LEFT, BADGE ON RIGHT */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', lg: 'row' },
                                gap: 3.5,
                                alignItems: 'flex-start',
                            }}
                        >
                            {/* LEFT COLUMN: STEPS 1, 2, 3 */}
                            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 65%' }, width: '100%' }}>
                                <Stack spacing={3}>
                                    
                                    {/* STEP 1: SELECT TICKET CATEGORY */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: { xs: 2.5, sm: 3 },
                                            borderRadius: '20px',
                                            bgcolor: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Box
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: '10px',
                                                        bgcolor: '#094d42',
                                                        color: '#fff',
                                                        fontSize: '0.85rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    1
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.05rem' }}>
                                                    Select Ticket Category
                                                </Typography>
                                            </Box>

                                            {/* Category Segmented Tabs */}
                                            <Box sx={{ display: 'flex', bgcolor: '#f1f5f9', p: 0.5, borderRadius: '10px', gap: 0.5 }}>
                                                {[
                                                    { key: 'all', label: `All Passes (${categoriesList.length})` },
                                                    { key: 'conference', label: `Conference (${categoriesList.filter(c => c.group === 'conference').length})` },
                                                    { key: 'visitor', label: `Visitor & Expo (${categoriesList.filter(c => c.group === 'visitor').length})` },
                                                ].map((tab) => (
                                                    <Button
                                                        key={tab.key}
                                                        size="small"
                                                        onClick={() => setSelectedTab(tab.key)}
                                                        sx={{
                                                            px: 1.5,
                                                            py: 0.4,
                                                            borderRadius: '8px',
                                                            fontSize: '0.74rem',
                                                            fontWeight: 800,
                                                            textTransform: 'none',
                                                            bgcolor: selectedTab === tab.key ? '#ffffff' : 'transparent',
                                                            color: selectedTab === tab.key ? '#094d42' : '#64748b',
                                                            boxShadow: selectedTab === tab.key ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                                                            '&:hover': {
                                                                bgcolor: selectedTab === tab.key ? '#ffffff' : '#e2e8f0',
                                                            },
                                                        }}
                                                    >
                                                        {tab.label}
                                                    </Button>
                                                ))}
                                            </Box>
                                        </Box>

                                        {/* Categories Grid */}
                                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                            {filteredCategories.map((cat) => {
                                                const isSelected = visitorType === cat.id;

                                                return (
                                                    <Box
                                                        key={cat.id}
                                                        onClick={() => handleTypeChange(cat.id)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            borderRadius: '18px',
                                                            bgcolor: isSelected ? (cat.bgSelected || '#f0fdf4') : '#ffffff',
                                                            border: `2px solid ${isSelected ? (cat.borderSelected || '#10b981') : '#e2e8f0'}`,
                                                            p: 2.4,
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between',
                                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            boxShadow: isSelected 
                                                                ? `0 10px 28px ${cat.borderSelected || '#10b981'}25, 0 2px 6px rgba(0,0,0,0.02)` 
                                                                : '0 2px 6px rgba(0,0,0,0.02)',
                                                            transform: isSelected ? 'translateY(-2px)' : 'none',
                                                            '&:hover': {
                                                                borderColor: cat.borderSelected || '#10b981',
                                                                bgcolor: cat.bgSelected || '#f8fafc',
                                                                transform: 'translateY(-2px)',
                                                            },
                                                        }}
                                                    >
                                                        <Box>
                                                            {/* Top Badges Bar */}
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
                                                                <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
                                                                    <Chip
                                                                        label={cat.tag || cat.badge}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: cat.tagBg || '#dcfce7',
                                                                            color: cat.tagColor || '#047857',
                                                                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                                            fontWeight: 800,
                                                                            fontSize: '0.64rem',
                                                                            height: 23,
                                                                            px: 0.6,
                                                                            letterSpacing: '0.07em',
                                                                            borderRadius: '7px',
                                                                            border: `1px solid ${cat.borderSelected || '#86efac'}45`,
                                                                        }}
                                                                    />
                                                                </Stack>

                                                                {/* Radio Circle Indicator */}
                                                                <Box
                                                                    sx={{
                                                                        width: 22,
                                                                        height: 22,
                                                                        borderRadius: '50%',
                                                                        border: `2px solid ${isSelected ? (cat.borderSelected || '#10b981') : '#cbd5e1'}`,
                                                                        bgcolor: isSelected ? (cat.borderSelected || '#10b981') : '#ffffff',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        transition: 'all 0.15s ease',
                                                                        flexShrink: 0,
                                                                        boxShadow: isSelected ? `0 0 10px ${cat.borderSelected || '#10b981'}80` : 'none',
                                                                    }}
                                                                >
                                                                    {isSelected && <CheckCircleIcon sx={{ fontSize: 16, color: '#ffffff' }} />}
                                                                </Box>
                                                            </Box>

                                                            {/* Category Title */}
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                                    fontWeight: 800,
                                                                    color: '#0f172a',
                                                                    fontSize: '1.05rem',
                                                                    mb: 0.8,
                                                                    lineHeight: 1.3,
                                                                    letterSpacing: '-0.02em',
                                                                }}
                                                            >
                                                                {cat.name}
                                                            </Typography>

                                                            {/* Price Display with Outfit font & separated IDR prefix */}
                                                            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1.2, flexWrap: 'wrap' }}>
                                                                {cat.price === 0 ? (
                                                                    <Typography
                                                                        sx={{
                                                                            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                                                                            fontWeight: 900,
                                                                            color: '#059669',
                                                                            fontSize: '1.35rem',
                                                                            letterSpacing: '0.02em',
                                                                            lineHeight: 1,
                                                                        }}
                                                                    >
                                                                        FREE
                                                                    </Typography>
                                                                ) : (
                                                                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                                                                        <Typography
                                                                            component="span"
                                                                            sx={{
                                                                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                                                fontWeight: 800,
                                                                                fontSize: '0.78rem',
                                                                                letterSpacing: '0.07em',
                                                                                color: isSelected ? (cat.tagColor || '#047857') : '#64748b',
                                                                                mr: 0.6,
                                                                                textTransform: 'uppercase',
                                                                            }}
                                                                        >
                                                                            IDR
                                                                        </Typography>
                                                                        <Typography
                                                                            component="span"
                                                                            sx={{
                                                                                fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                                                                                fontWeight: 900,
                                                                                color: isSelected ? (cat.tagColor || '#0f172a') : '#0f172a',
                                                                                fontSize: '1.42rem',
                                                                                lineHeight: 1,
                                                                                letterSpacing: '-0.03em',
                                                                            }}
                                                                        >
                                                                            {cat.price.toLocaleString('id-ID')}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Box>

                                                            {/* Description */}
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                                    color: '#64748b',
                                                                    display: 'block',
                                                                    lineHeight: 1.55,
                                                                    mb: 1.5,
                                                                    fontSize: '0.78rem',
                                                                }}
                                                            >
                                                                {cat.description}
                                                            </Typography>
                                                        </Box>

                                                        {/* Perks Bullet List */}
                                                        {cat.perks && cat.perks.length > 0 && (
                                                            <Box sx={{ mt: 1, pt: 1.2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                                                <Stack spacing={0.6}>
                                                                    {cat.perks.map((perk, perkIdx) => (
                                                                        <Box key={perkIdx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                                            <CheckCircleIcon sx={{ fontSize: 14, color: cat.borderSelected || '#10b981', flexShrink: 0 }} />
                                                                            <Typography
                                                                                variant="caption"
                                                                                sx={{
                                                                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                                                    color: '#334155',
                                                                                    fontWeight: 700,
                                                                                    fontSize: '0.74rem',
                                                                                }}
                                                                            >
                                                                                {perk}
                                                                            </Typography>
                                                                        </Box>
                                                                    ))}
                                                                </Stack>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Paper>

                                    {/* STEP 2: VISITOR / PARTICIPANT INFORMATION */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: { xs: 2.5, sm: 3 },
                                            borderRadius: '20px',
                                            bgcolor: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Box
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: '10px',
                                                        bgcolor: '#094d42',
                                                        color: '#fff',
                                                        fontSize: '0.85rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    2
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.05rem' }}>
                                                    Participant Details {members.length > 1 && `(${members.length} People)`}
                                                </Typography>
                                            </Box>

                                            <Button
                                                startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                                                onClick={addMember}
                                                size="small"
                                                sx={{
                                                    color: '#094d42',
                                                    bgcolor: '#f0fdf4',
                                                    border: '1.5px dashed #86efac',
                                                    borderRadius: '10px',
                                                    textTransform: 'none',
                                                    fontWeight: 800,
                                                    fontSize: '0.8rem',
                                                    px: 1.8,
                                                    py: 0.6,
                                                    '&:hover': { bgcolor: '#dcfce7', borderColor: '#4ade80' },
                                                }}
                                            >
                                                + Add Another Participant
                                            </Button>
                                        </Box>

                                        <Stack spacing={2.5}>
                                            {members.map((member, idx) => (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        p: 2.5,
                                                        borderRadius: '16px',
                                                        bgcolor: '#f8fafc',
                                                        border: '1px solid #e2e8f0',
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Chip
                                                                label={idx === 0 ? 'Primary Registrant / Group Leader' : `Participant #${idx + 1}`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: idx === 0 ? '#e0f2fe' : '#e2e8f0',
                                                                    color: idx === 0 ? '#0369a1' : '#475569',
                                                                    fontWeight: 900,
                                                                    fontSize: '0.72rem',
                                                                    height: 24,
                                                                    borderRadius: '8px',
                                                                }}
                                                            />
                                                        </Box>

                                                        {members.length > 1 && (
                                                            <Button
                                                                onClick={() => removeMember(idx)}
                                                                size="small"
                                                                startIcon={<DeleteOutlineIcon sx={{ fontSize: 15 }} />}
                                                                sx={{
                                                                    color: '#ef4444',
                                                                    fontSize: '0.72rem',
                                                                    fontWeight: 800,
                                                                    textTransform: 'none',
                                                                    '&:hover': { bgcolor: '#fee2e2' },
                                                                }}
                                                            >
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </Box>

                                                    {/* 2x2 Airy Grid Input Layout */}
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Full Name *"
                                                                placeholder="e.g. Dr. John Doe, S.T., M.T."
                                                                value={member.name}
                                                                onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                                                fullWidth
                                                                required
                                                                size="small"
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <PersonOutlineIcon sx={{ color: '#094d42', fontSize: 18 }} />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        bgcolor: '#ffffff',
                                                                        borderRadius: '10px',
                                                                        fontSize: '0.86rem',
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Email Address *"
                                                                type="email"
                                                                placeholder="e.g. john.doe@organization.com"
                                                                value={member.email}
                                                                onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                                                                fullWidth
                                                                required
                                                                size="small"
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <EmailOutlinedIcon sx={{ color: '#0284c7', fontSize: 18 }} />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        bgcolor: '#ffffff',
                                                                        borderRadius: '10px',
                                                                        fontSize: '0.86rem',
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="WhatsApp / Phone Number"
                                                                placeholder="e.g. +62 812 3456 7890"
                                                                value={member.phone}
                                                                onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <PhoneIphoneIcon sx={{ color: '#059669', fontSize: 18 }} />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        bgcolor: '#ffffff',
                                                                        borderRadius: '10px',
                                                                        fontSize: '0.86rem',
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Institution / Company / University"
                                                                placeholder="e.g. Pertamina / ITB / UGM / ESDM"
                                                                value={member.institution}
                                                                onChange={(e) => handleMemberChange(idx, 'institution', e.target.value)}
                                                                fullWidth
                                                                size="small"
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <BusinessOutlinedIcon sx={{ color: '#7c3aed', fontSize: 18 }} />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        bgcolor: '#ffffff',
                                                                        borderRadius: '10px',
                                                                        fontSize: '0.86rem',
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Paper>

                                    {/* STEP 3: PAYMENT INSTRUCTIONS (IF PAID) */}
                                    {isPaid && (
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: { xs: 2.5, sm: 3 },
                                                borderRadius: '20px',
                                                bgcolor: '#ffffff',
                                                border: `2px solid ${selectedCategory?.borderSelected || '#86efac'}`,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: '10px',
                                                        bgcolor: selectedCategory?.tagColor || '#094d42',
                                                        color: '#fff',
                                                        fontSize: '0.85rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    3
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.05rem' }}>
                                                    Payment Instructions & Proof Upload ({selectedCategory?.name})
                                                </Typography>
                                            </Box>

                                            {/* Payment Method Selector Pills */}
                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 2.5 }}>
                                                {/* Bank Transfer (Active & Recommended) */}
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
                                                        justifyContent: 'space-between',
                                                        gap: 1.5,
                                                        transition: 'all 0.15s ease',
                                                        boxShadow: paymentMethod === 'foreign_bank_transfer' ? '0 4px 12px rgba(2, 132, 199, 0.12)' : 'none',
                                                        '&:hover': { bgcolor: '#f0f9ff' },
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#e0f2fe', color: '#0284c7' }}>
                                                            <AccountBalanceIcon sx={{ fontSize: 22 }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a' }}>Bank Transfer</Typography>
                                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>Direct Bank Transfer / SWIFT</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Chip
                                                        label="ACTIVE"
                                                        size="small"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: '0.62rem',
                                                            fontWeight: 900,
                                                            bgcolor: '#dcfce7',
                                                            color: '#15803d',
                                                            border: '1px solid #bbf7d0',
                                                            letterSpacing: '0.04em',
                                                        }}
                                                    />
                                                </Paper>

                                                {/* QRIS Indonesia (Under Maintenance / Coming Soon) */}
                                                <Paper
                                                    onClick={() => {
                                                        setPaymentMethod('qris_indo');
                                                        setData('payment_method', 'qris_indo');
                                                    }}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        bgcolor: paymentMethod === 'qris_indo' ? '#fffbeb' : '#f8fafc',
                                                        border: `2px solid ${paymentMethod === 'qris_indo' ? '#f59e0b' : '#e2e8f0'}`,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: 1.5,
                                                        transition: 'all 0.15s ease',
                                                        boxShadow: paymentMethod === 'qris_indo' ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none',
                                                        '&:hover': { bgcolor: '#fffbeb' },
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#fef3c7', color: '#d97706' }}>
                                                            <QrCodeIcon sx={{ fontSize: 22 }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a' }}>QRIS Indonesia</Typography>
                                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>BCA, GoPay, OVO, Dana</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Chip
                                                        label="COMING SOON"
                                                        size="small"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: '0.62rem',
                                                            fontWeight: 900,
                                                            bgcolor: '#fef3c7',
                                                            color: '#b45309',
                                                            border: '1px solid #fde68a',
                                                            letterSpacing: '0.03em',
                                                        }}
                                                    />
                                                </Paper>
                                            </Box>

                                            {/* QRIS Container (Maintenance / Coming Soon Display) */}
                                            {paymentMethod === 'qris_indo' && (
                                                <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#fffbeb', borderRadius: '14px', border: '1.5px dashed #fcd34d', mb: 2.5 }}>
                                                    <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '50%', bgcolor: '#fef3c7', color: '#d97706', mb: 1.2 }}>
                                                        <ConstructionIcon sx={{ fontSize: 32 }} />
                                                    </Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#92400e', mb: 0.5 }}>
                                                        QRIS Indonesia (Under Maintenance / Coming Soon)
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#b45309', maxWidth: 480, mx: 'auto', mb: 2, fontSize: '0.82rem', lineHeight: 1.5 }}>
                                                        Instant QRIS payment gateway is currently under scheduled maintenance & gateway configuration. Please proceed with <strong>Bank Transfer</strong> for immediate registration processing.
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<AccountBalanceIcon sx={{ fontSize: 16 }} />}
                                                        onClick={() => {
                                                            setPaymentMethod('foreign_bank_transfer');
                                                            setData('payment_method', 'foreign_bank_transfer');
                                                        }}
                                                        sx={{
                                                            bgcolor: '#0284c7',
                                                            color: '#fff',
                                                            fontWeight: 800,
                                                            borderRadius: '8px',
                                                            textTransform: 'none',
                                                            px: 2.5,
                                                            py: 0.8,
                                                            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                                                            '&:hover': { bgcolor: '#0369a1' },
                                                        }}
                                                    >
                                                        Switch to Bank Transfer
                                                    </Button>
                                                </Box>
                                            )}

                                            {/* Bank Transfer Container */}
                                            {paymentMethod === 'foreign_bank_transfer' && (
                                                <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', mb: 2.5 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0284c7' }}>
                                                            Official Bank Account Details:
                                                        </Typography>
                                                        <Button
                                                            size="small"
                                                            startIcon={<ContentCopyIcon sx={{ fontSize: 13 }} />}
                                                            onClick={handleCopyBankInfo}
                                                            sx={{
                                                                color: '#0284c7',
                                                                bgcolor: '#e0f2fe',
                                                                fontSize: '0.74rem',
                                                                fontWeight: 800,
                                                                borderRadius: '6px',
                                                                px: 1.2,
                                                                textTransform: 'none',
                                                                '&:hover': { bgcolor: '#bae6fd' },
                                                            }}
                                                        >
                                                            {copySuccess ? 'Copied to Clipboard!' : 'Copy Info'}
                                                        </Button>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ color: '#0f172a', whiteSpace: 'pre-line', fontFamily: 'monospace', bgcolor: '#fff', p: 2, borderRadius: '10px', border: '1px solid #e2e8f0', display: 'block', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                                        {bankTransferInfo}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Proof Upload Action Zone */}
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mb: 1 }}>
                                                Upload Payment Receipt / Proof of Transfer *
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

                                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<PhotoCameraIcon sx={{ fontSize: 16 }} />}
                                                    onClick={handleOpenDirectCamera}
                                                    disabled={compressing}
                                                    sx={{
                                                        borderRadius: '10px',
                                                        bgcolor: '#0284c7',
                                                        color: '#ffffff',
                                                        textTransform: 'none',
                                                        fontWeight: 800,
                                                        fontSize: '0.82rem',
                                                        px: 2,
                                                        py: 1,
                                                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                                                        '&:hover': { bgcolor: '#0369a1' },
                                                    }}
                                                >
                                                    📷 Open Live Camera
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={compressing}
                                                    sx={{
                                                        borderRadius: '10px',
                                                        borderColor: '#cbd5e1',
                                                        color: '#334155',
                                                        textTransform: 'none',
                                                        fontWeight: 800,
                                                        fontSize: '0.82rem',
                                                        px: 2,
                                                        py: 1,
                                                        bgcolor: '#ffffff',
                                                        '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' },
                                                    }}
                                                >
                                                    📁 Browse Gallery / File
                                                </Button>
                                            </Box>

                                            {compressing && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                                                    <CircularProgress size={16} sx={{ color: '#059669' }} />
                                                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
                                                        Auto-compressing image preview...
                                                    </Typography>
                                                </Box>
                                            )}

                                            {proofPreview && (
                                                <Box sx={{ mt: 2, p: 2, bgcolor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box component="img" src={proofPreview} alt="Proof Preview" sx={{ width: 56, height: 56, objectFit: 'cover', borderRadius: '8px', border: '1.5px solid #86efac', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }} />
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#059669', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.78rem' }}>
                                                            <CheckCircleIcon sx={{ fontSize: 16 }} /> Payment proof attached ({compressionStats?.compressed} KB)
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                                                            Original: {compressionStats?.original} KB &bull; Compressed for fast server verification.
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Paper>
                                    )}
                                </Stack>
                            </Box>

                            {/* RIGHT COLUMN: 3D BADGE PREVIEW + ORDER SUMMARY + CTA BUTTON */}
                            <Box sx={{ flex: { xs: '1 1 100%', lg: '0 0 380px' }, width: '100%', position: { lg: 'sticky' }, top: { lg: 24 } }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2.5, sm: 3 },
                                        borderRadius: '20px',
                                        bgcolor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 25px rgba(0,0,0,0.06)',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                            <VisibilityIcon sx={{ fontSize: 15, color: selectedCategory.lanyardTheme?.banner || '#059669' }} /> Live 3D Lanyard Badge
                                        </Typography>
                                        <Chip
                                            label={selectedCategory.badge || 'PASS'}
                                            size="small"
                                            sx={{
                                                bgcolor: selectedCategory.tagBg || '#ecfdf5',
                                                color: selectedCategory.tagColor || '#047857',
                                                fontWeight: 900,
                                                fontSize: '0.68rem',
                                                height: 22,
                                                borderRadius: '6px',
                                            }}
                                        />
                                    </Box>

                                    {/* 3D Perspective Card Container */}
                                    <Box
                                        onMouseMove={handleCardMouseMove}
                                        onMouseLeave={handleCardMouseLeave}
                                        sx={{
                                            perspective: '900px',
                                            cursor: 'pointer',
                                            my: 1.5,
                                        }}
                                    >
                                        {/* Lanyard Top Strap & Metallic Clip */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: -1, position: 'relative', zIndex: 3 }}>
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 20,
                                                    bgcolor: selectedCategory.lanyardTheme?.banner || '#094d42',
                                                    borderRadius: '4px 4px 0 0',
                                                    boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2)',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    width: 16,
                                                    height: 12,
                                                    bgcolor: '#e2e8f0',
                                                    borderRadius: '3px',
                                                    border: '1.5px solid #94a3b8',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                }}
                                            />
                                        </Box>

                                        {/* Physical Lanyard Card 3D Body */}
                                        <Box
                                            sx={{
                                                transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
                                                transition: 'transform 0.15s ease-out',
                                                borderRadius: '18px',
                                                bgcolor: '#ffffff',
                                                border: `2px solid ${selectedCategory.lanyardTheme?.border || '#10b981'}`,
                                                boxShadow: `0 14px 30px -5px ${selectedCategory.lanyardTheme?.border || '#10b981'}35, 0 4px 12px rgba(0,0,0,0.04)`,
                                                p: 2.5,
                                                textAlign: 'center',
                                                position: 'relative',
                                            }}
                                        >
                                            {/* Hole Punch */}
                                            <Box
                                                sx={{
                                                    width: 26,
                                                    height: 6,
                                                    borderRadius: '3px',
                                                    bgcolor: '#e2e8f0',
                                                    mx: 'auto',
                                                    mb: 1.5,
                                                }}
                                            />

                                            <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#094d42', fontSize: '0.7rem', display: 'block' }}>
                                                55TH PIT IAGI & GEOSEA 2026
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.62rem', display: 'block', mb: 1.5, fontWeight: 700 }}>
                                                ANNUAL SCIENTIFIC CONVENTION
                                            </Typography>

                                            {/* QR Code */}
                                            <Box
                                                sx={{
                                                    p: 1.2,
                                                    bgcolor: '#ffffff',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    width: 'fit-content',
                                                    mx: 'auto',
                                                    mb: 1.5,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                                                }}
                                            >
                                                <QRCodeSVG
                                                    value="TKT-SAMPLE-PREVIEW"
                                                    size={100}
                                                    level="H"
                                                    includeMargin={false}
                                                />
                                            </Box>

                                            {/* Live Name & Institution */}
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 900,
                                                    color: '#0f172a',
                                                    lineHeight: 1.2,
                                                    fontSize: '1.05rem',
                                                    minHeight: '1.2em',
                                                    mb: 0.3,
                                                }}
                                            >
                                                {primaryMember.name || 'Participant Name'}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: selectedCategory.lanyardTheme?.banner || '#0284c7',
                                                    fontSize: '0.78rem',
                                                    display: 'block',
                                                    minHeight: '1.2em',
                                                    mb: 1.8,
                                                }}
                                            >
                                                {primaryMember.institution || 'Institution / Organization'}
                                            </Typography>

                                            {/* Bottom Banner */}
                                            <Box
                                                sx={{
                                                    bgcolor: selectedCategory.lanyardTheme?.banner || '#094d42',
                                                    color: '#ffffff',
                                                    py: 0.8,
                                                    borderRadius: '10px',
                                                    fontWeight: 900,
                                                    letterSpacing: '0.06em',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.74rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0.5,
                                                }}
                                            >
                                                {isPaid && <StarIcon sx={{ fontSize: 13 }} />}
                                                {selectedCategory.lanyardTheme?.badge || selectedCategory.name}
                                                {isPaid && <StarIcon sx={{ fontSize: 13 }} />}
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Order Summary Box */}
                                    <Box sx={{ mt: 2.5, p: 2.2, bgcolor: '#f8fafc', borderRadius: '16px', border: '1.5px solid #e2e8f0' }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                                fontWeight: 800,
                                                color: '#475569',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.08em',
                                                display: 'block',
                                                mb: 1.5,
                                                fontSize: '0.72rem',
                                            }}
                                        >
                                            Order Summary:
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#64748b', fontWeight: 600 }}>
                                                    Category:
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: selectedCategory.tagColor || '#059669' }}>
                                                    {selectedCategory.name}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#64748b', fontWeight: 600 }}>
                                                    Price / Ticket:
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif', fontWeight: 800, color: '#0f172a' }}>
                                                    {selectedCategory.price > 0 ? `IDR ${selectedCategory.price.toLocaleString('id-ID')}` : 'FREE'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#64748b', fontWeight: 600 }}>
                                                    Total Participants:
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: '#0f172a' }}>
                                                    {members.length} Person(s)
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ borderColor: '#e2e8f0', my: 0.5 }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="subtitle2" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                                                    Total Amount:
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                                                        fontWeight: 900,
                                                        color: isPaid ? '#094d42' : '#059669',
                                                        fontSize: '1.3rem',
                                                        letterSpacing: '-0.02em',
                                                    }}
                                                >
                                                    {isPaid ? `IDR ${totalEstimate.toLocaleString('id-ID')}` : 'FREE (Rp 0)'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    {/* Submit CTA Button */}
                                    <Box sx={{ mt: 2.5 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={processing || compressing}
                                            startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <ConfirmationNumberIcon />}
                                            sx={{
                                                background: isPaid 
                                                    ? 'linear-gradient(180deg, #094d42 0%, #06352e 100%)' 
                                                    : 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                                                color: '#ffffff',
                                                fontWeight: 900,
                                                fontSize: '0.95rem',
                                                py: 1.5,
                                                borderRadius: '14px',
                                                textTransform: 'none',
                                                boxShadow: isPaid
                                                    ? '0 4px 0 #04221d, 0 10px 22px rgba(9, 77, 66, 0.35)'
                                                    : '0 4px 0 #047857, 0 10px 22px rgba(16, 185, 129, 0.35)',
                                                '&:hover': {
                                                    background: isPaid
                                                        ? 'linear-gradient(180deg, #0c6153 0%, #094d42 100%)'
                                                        : 'linear-gradient(180deg, #34d399 0%, #047857 100%)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: isPaid
                                                        ? '0 6px 0 #04221d, 0 14px 25px rgba(9, 77, 66, 0.45)'
                                                        : '0 6px 0 #047857, 0 14px 25px rgba(16, 185, 129, 0.45)',
                                                },
                                                '&:active': {
                                                    transform: 'translateY(2px)',
                                                    boxShadow: isPaid
                                                        ? '0 2px 0 #04221d, 0 4px 8px rgba(9, 77, 66, 0.3)'
                                                        : '0 2px 0 #047857, 0 4px 8px rgba(16, 185, 129, 0.3)',
                                                },
                                                transition: 'all 0.12s ease',
                                            }}
                                        >
                                            {processing 
                                                ? 'Processing Registration...' 
                                                : isPaid 
                                                    ? `Register & Upload Proof (IDR ${totalEstimate.toLocaleString('id-ID')})` 
                                                    : 'Claim Free E-Ticket'
                                            }
                                        </Button>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1.2, fontSize: '0.72rem', fontWeight: 600 }}>
                                            <ShieldOutlinedIcon sx={{ fontSize: 14, color: '#059669' }} /> Encrypted & verified by IAGI Secretariat Committee
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>
                    </form>
                )}
            </Container>

            {/* LIVE CAMERA VIEWFINDER MODAL */}
            <Dialog
                open={cameraModalOpen}
                onClose={stopCamera}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        bgcolor: '#0f172a',
                        color: '#fff',
                        overflow: 'hidden',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        px: 2.5,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhotoCameraIcon sx={{ color: '#38bdf8' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff' }}>
                            Capture Payment Proof
                        </Typography>
                    </Box>
                    <IconButton onClick={stopCamera} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0, position: 'relative', bgcolor: '#000', minHeight: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cameraLoading && (
                        <Box sx={{ textAlign: 'center', p: 3 }}>
                            <CircularProgress sx={{ color: '#38bdf8', mb: 1.5 }} />
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                Initializing camera...
                            </Typography>
                        </Box>
                    )}

                    {cameraError ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#f87171', mb: 2 }}>
                                {cameraError}
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    stopCamera();
                                    cameraInputRef.current?.click();
                                }}
                                sx={{ color: '#38bdf8', borderColor: '#38bdf8', textTransform: 'none', borderRadius: '8px' }}
                            >
                                Use Native Camera App
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: '480px',
                                    objectFit: 'contain',
                                    display: cameraLoading ? 'none' : 'block',
                                }}
                            />
                            {/* Scanning Guide Box Overlay */}
                            {!cameraLoading && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '75%',
                                        height: '65%',
                                        border: '2px dashed rgba(56, 189, 248, 0.6)',
                                        borderRadius: '12px',
                                        pointerEvents: 'none',
                                    }}
                                />
                            )}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, px: 2.5, bgcolor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)', justifyContent: 'space-between' }}>
                    <Button
                        startIcon={<CameraswitchIcon />}
                        onClick={handleSwitchCamera}
                        size="small"
                        sx={{ color: '#94a3b8', textTransform: 'none', '&:hover': { color: '#fff' } }}
                    >
                        Switch Camera
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCapturePhoto}
                        disabled={cameraLoading || !!cameraError}
                        startIcon={<PhotoCameraIcon />}
                        sx={{
                            bgcolor: '#0284c7',
                            color: '#fff',
                            fontWeight: 800,
                            borderRadius: '10px',
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            '&:hover': { bgcolor: '#0369a1' },
                        }}
                    >
                        Capture Photo
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
