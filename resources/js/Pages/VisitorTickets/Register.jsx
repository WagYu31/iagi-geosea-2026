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
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import axios from 'axios';

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
            name: 'Professional (Member)',
            badge: 'PROFESSIONAL (MEMBER)',
            normalPrice: 3000000,
            price: 3000000,
            tag: 'PROFESSIONAL (MEMBER)',
            discountAmount: 0,
            tagColor: '#047857',
            tagBg: '#dcfce7',
            borderSelected: '#10b981',
            bgSelected: '#f0fdf4',
            lanyardTheme: { border: '#059669', banner: '#094d42', badge: 'PROFESSIONAL' },
            description: 'For Professional IAGI Member',
            perks: [
                'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                'Seminar Kit',
                'Lunch and Snack',
            ],
        },
        {
            id: 'non_iagi_member_professional',
            group: 'conference',
            name: 'Professional (Non-Member)',
            badge: 'PROFESSIONAL (NON-MEMBER)',
            normalPrice: 4000000,
            price: 4000000,
            tag: 'PROFESSIONAL (NON-MEMBER)',
            discountAmount: 0,
            tagColor: '#0284c7',
            tagBg: '#e0f2fe',
            borderSelected: '#0284c7',
            bgSelected: '#f0f9ff',
            lanyardTheme: { border: '#0284c7', banner: '#0369a1', badge: 'PROFESSIONAL' },
            description: 'For Professional Non - IAGI Member',
            perks: [
                'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                'Seminar Kit',
                'Lunch and Snack',
            ],
        },
        {
            id: 'iagi_member_expatriate',
            group: 'conference',
            name: 'Expatriate (Member)',
            badge: 'EXPATRIATE (MEMBER)',
            normalPrice: 6000000,
            price: 6000000,
            tag: 'EXPATRIATE (MEMBER)',
            discountAmount: 0,
            tagColor: '#b45309',
            tagBg: '#fef3c7',
            borderSelected: '#f59e0b',
            bgSelected: '#fffbeb',
            lanyardTheme: { border: '#f59e0b', banner: '#b45309', badge: 'EXPATRIATE' },
            description: 'For Expatriate IAGI Member',
            perks: [
                'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                'Seminar Kit',
                'Lunch and Snack',
            ],
        },
        {
            id: 'non_iagi_member_expatriate',
            group: 'conference',
            name: 'Expatriate (Non-Member)',
            badge: 'EXPATRIATE (NON-MEMBER)',
            normalPrice: 7000000,
            price: 7000000,
            tag: 'EXPATRIATE (NON-MEMBER)',
            discountAmount: 0,
            tagColor: '#7c3aed',
            tagBg: '#ede9fe',
            borderSelected: '#8b5cf6',
            bgSelected: '#f5f3ff',
            lanyardTheme: { border: '#8b5cf6', banner: '#6d28d9', badge: 'EXPATRIATE' },
            description: 'For Expatriate Non - IAGI Member',
            perks: [
                'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                'Seminar Kit',
                'Lunch and Snack',
            ],
        },
        {
            id: 'student_undergraduate',
            group: 'conference',
            name: 'Student Undergraduate',
            badge: 'STUDENT UNDERGRADUATE',
            normalPrice: 1000000,
            price: 1000000,
            tag: 'STUDENT UNDERGRADUATE',
            discountAmount: 0,
            tagColor: '#4338ca',
            tagBg: '#e0e7ff',
            borderSelected: '#6366f1',
            bgSelected: '#eef2ff',
            lanyardTheme: { border: '#6366f1', banner: '#4338ca', badge: 'STUDENT' },
            description: 'For Undergraduate Student',
            perks: [
                'Full Access for Exhibition Hall/Panel Discussion/Technical Session',
                'Seminar Kit',
                'Lunch and Snack',
            ],
        },
        {
            id: 'non_exclusive',
            group: 'visitor',
            name: 'Visitor Pass (Free)',
            badge: 'VISITOR PASS (FREE)',
            normalPrice: 0,
            price: 0,
            tag: 'VISITOR PASS (FREE)',
            discountAmount: 0,
            tagColor: '#059669',
            tagBg: '#d1fae5',
            borderSelected: '#10b981',
            bgSelected: '#f0fdf4',
            lanyardTheme: { border: '#10b981', banner: '#094d42', badge: 'VISITOR PASS' },
            description: 'For anyone who visiting on site',
            perks: ['Free Registration', 'Access Exhibition Hall only'],
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
    const rawBankTransferInfo = propBankTransferInfo ?? settings.bankTransferInfo ?? settings.bankInfo ?? "Bank Mandiri\nAccount Number: 137-00-1234567-8\nAccount Holder: Ikatan Ahli Geologi Indonesia (IAGI)";
    const bankTransferInfo = typeof rawBankTransferInfo === 'string'
        ? rawBankTransferInfo
            .replace(/No\.\s*Rek\s*:/gi, 'Account Number:')
            .replace(/a\.\s*n\.\s*:?/gi, 'Account Holder: ')
            .replace(/atas\s*nama\s*:?/gi, 'Account Holder: ')
        : rawBankTransferInfo;
    const eventDate = propEventDate ?? settings.eventDate ?? '3-5 November 2026';
    const eventVenue = propEventVenue ?? settings.eventVenue ?? 'Royal Ambarrukmo Yogyakarta';
    
    const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'conference', 'visitor'
    const [visitorType, setVisitorType] = useState('iagi_member_professional');
    const [paymentMethod, setPaymentMethod] = useState('foreign_bank_transfer');
    const [members, setMembers] = useState([
        { name: '', email: '', phone: '', institution: '' }
    ]);
    const [uniqueCode] = useState(() => Math.floor(100 + Math.random() * 900));
    const [proofFile, setProofFile] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [compressionStats, setCompressionStats] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Check Status & Find Ticket Modal State
    const [checkStatusOpen, setCheckStatusOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [searchError, setSearchError] = useState(null);
    const [searchHasSubmitted, setSearchHasSubmitted] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCopyCode = (code) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        }
    };

    const handlePerformSearch = async (e) => {
        if (e) e.preventDefault();
        const trimmed = searchQuery.trim();
        if (!trimmed || trimmed.length < 3) {
            setSearchError('Please enter at least 3 characters (e.g. your Email, Phone Number, or Payment Code).');
            return;
        }

        setIsSearching(true);
        setSearchError(null);
        setSearchResults(null);
        setSearchHasSubmitted(true);

        try {
            const response = await axios.post(route('visitor.tickets.lookup'), {
                query: trimmed,
            });

            if (response.data && response.data.success) {
                setSearchResults(response.data.data || []);
            } else {
                setSearchError(response.data?.message || 'No registration records found.');
                setSearchResults([]);
            }
        } catch (err) {
            console.error('Ticket lookup failed:', err);
            setSearchError(err.response?.data?.message || 'Failed to search records. Please check your internet connection or try again.');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleResetSearch = () => {
        setSearchQuery('');
        setSearchResults(null);
        setSearchError(null);
        setSearchHasSubmitted(false);
    };

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
        unique_code: uniqueCode,
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
    const subtotal = (selectedCategory?.price ?? 0) * members.length;
    const totalEstimate = isPaid ? subtotal + uniqueCode : 0;
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
            <Head title="Registration & Ticket Portal - 55ᵀᴴ PIT IAGI-GEOSEA XIX 2026" />

            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Top Nav Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        p: 1.2,
                        px: { xs: 1.8, sm: 2.5 },
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

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button
                            onClick={() => {
                                setCheckStatusOpen(true);
                                setSearchError(null);
                            }}
                            startIcon={<SearchIcon sx={{ color: '#047857' }} />}
                            size="small"
                            sx={{
                                bgcolor: '#ecfdf5',
                                color: '#047857',
                                border: '1px solid #a7f3d0',
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                borderRadius: '10px',
                                px: 1.8,
                                py: 0.6,
                                boxShadow: '0 1px 3px rgba(4,120,87,0.08)',
                                '&:hover': {
                                    bgcolor: '#d1fae5',
                                    borderColor: '#6ee7b7',
                                    boxShadow: '0 2px 8px rgba(4,120,87,0.15)',
                                },
                            }}
                        >
                            Check Status / Find Ticket
                        </Button>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                Official Registration Portal &bull; 55ᵀᴴ PIT IAGI-GEOSEA XIX 2026
                            </Typography>
                        </Box>
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
                        Select your registration category below to receive your official conference badge, digital QR ticket pass, and seminar credentials for 55ᵀᴴ PIT IAGI-GEOSEA XIX 2026.
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

                    {/* Quick Status Lookup Banner */}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            onClick={() => {
                                setCheckStatusOpen(true);
                                setSearchError(null);
                            }}
                            startIcon={<ManageSearchIcon sx={{ color: '#047857' }} />}
                            endIcon={<ArrowForwardIcon sx={{ fontSize: '15px !important', color: '#047857' }} />}
                            size="small"
                            sx={{
                                bgcolor: '#ffffff',
                                border: '1px solid #cbd5e1',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                borderRadius: '30px',
                                px: { xs: 2, sm: 2.5 },
                                py: 0.7,
                                textTransform: 'none',
                                color: '#334155',
                                fontSize: { xs: '0.78rem', sm: '0.84rem' },
                                fontWeight: 600,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: '#ecfdf5',
                                    borderColor: '#10b981',
                                    boxShadow: '0 4px 14px rgba(16,185,129,0.15)',
                                },
                            }}
                        >
                            Already registered? <Box component="span" sx={{ color: '#047857', fontWeight: 800, ml: 0.8 }}>Check Registration Status / Find My Ticket</Box>
                        </Button>
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
                                                    Payment Method
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
                                                            Bank Account
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

                                                            {isPaid && (
                                                                <Box sx={{ mt: 1.5, p: 1.8, bgcolor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                                                    <Box>
                                                                        <Typography variant="caption" sx={{ color: '#166534', fontWeight: 700, display: 'block' }}>
                                                                            Total Amount to Transfer:
                                                                        </Typography>
                                                                        <Typography variant="subtitle1" sx={{ color: '#094d42', fontWeight: 900, fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif' }}>
                                                                            IDR {totalEstimate.toLocaleString('id-ID')}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Chip label={`Unique Code: ${uniqueCode}`} size="small" sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 900, fontSize: '0.74rem' }} />
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    )}

                                            {/* Proof Upload Action Zone */}
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mb: 1 }}>
                                                 Upload Payment Receipt *
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
                                                    Open Camera
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
                                                    Browse Gallery / File
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
                                                55ᵀᴴ PIT IAGI-GEOSEA XIX 2026
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
                                            {isPaid && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="caption" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#64748b', fontWeight: 600 }}>
                                                        Unique Code:
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif', fontWeight: 800, color: '#0284c7' }}>
                                                        +IDR {uniqueCode}
                                                    </Typography>
                                                </Box>
                                            )}
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
                                                : 'Submit Registration'
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

            {/* CHECK STATUS & FIND TICKET MODAL */}
            <Dialog
                open={checkStatusOpen}
                onClose={() => setCheckStatusOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        bgcolor: '#ffffff',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        p: { xs: 2.2, sm: 3 },
                        pb: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #f1f5f9',
                        bgcolor: '#f8fafc',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: '14px',
                                bgcolor: '#ecfdf5',
                                border: '1px solid #a7f3d0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#047857',
                            }}
                        >
                            <ManageSearchIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                                Find My Ticket & Payment Status
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.3 }}>
                                Cek Status Pendaftaran & E-Ticket Peserta 55ᵀᴴ PIT IAGI-GEOSEA 2026
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        onClick={() => setCheckStatusOpen(false)}
                        size="small"
                        sx={{
                            color: '#94a3b8',
                            bgcolor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            '&:hover': { color: '#0f172a', bgcolor: '#f1f5f9' },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: { xs: 2.2, sm: 3 } }}>
                    {/* Search Input Box Form */}
                    <Box component="form" onSubmit={handlePerformSearch} sx={{ mb: 2.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', mb: 1 }}>
                            Search by Email / Phone / Payment Code
                        </Typography>
                        <TextField
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="e.g. yourname@gmail.com, 08123456789, or VPAY-260911..."
                            variant="outlined"
                            size="medium"
                            disabled={isSearching}
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#047857' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {searchQuery && (
                                                <IconButton size="small" onClick={handleResetSearch} sx={{ color: '#94a3b8' }}>
                                                    <HighlightOffIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={isSearching || !searchQuery.trim()}
                                                startIcon={isSearching ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SearchIcon />}
                                                sx={{
                                                    bgcolor: '#047857',
                                                    color: '#fff',
                                                    fontWeight: 800,
                                                    borderRadius: '10px',
                                                    textTransform: 'none',
                                                    px: 2.5,
                                                    py: 0.9,
                                                    boxShadow: 'none',
                                                    '&:hover': { bgcolor: '#065f46' },
                                                }}
                                            >
                                                {isSearching ? 'Searching...' : 'Search'}
                                            </Button>
                                        </Stack>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '14px',
                                    bgcolor: '#f8fafc',
                                    pr: 1,
                                    '&:hover fieldset': { borderColor: '#10b981' },
                                    '&.Mui-focused fieldset': { borderColor: '#047857', borderWidth: '2px' },
                                },
                            }}
                        />
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.76rem', display: 'block', mt: 0.8, ml: 0.5 }}>
                            💡 <strong>Tip:</strong> Masukkan alamat email yang Anda gunakan saat mengisi formulir pendaftaran untuk menemukan seluruh tiket Anda.
                        </Typography>
                    </Box>

                    {/* Loading State */}
                    {isSearching && (
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                            <CircularProgress size={36} sx={{ color: '#047857', mb: 1.5 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
                                Searching registration records...
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                Sedang memeriksa data tiket dan bukti pembayaran di server.
                            </Typography>
                        </Box>
                    )}

                    {/* Search Error / Not Found State */}
                    {!isSearching && searchError && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: '16px',
                                bgcolor: '#fffbeb',
                                border: '1px solid #fde68a',
                                mb: 2,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <HourglassEmptyIcon sx={{ color: '#d97706', mt: 0.2 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400e' }}>
                                        Registration Record Not Found
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#78350f', fontSize: '0.84rem', mt: 0.5, lineHeight: 1.5 }}>
                                        {searchError}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#92400e', display: 'block', mt: 1 }}>
                                        Need direct help? Contact the PIT IAGI organizing committee via WhatsApp:
                                    </Typography>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 1.5 }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            component="a"
                                            href="https://wa.me/628122699923?text=Halo%20Panitia%20PIT%20IAGI%2C%20saya%20ingin%20menanyakan%20status%20pendaftaran%20tiket%20saya."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            startIcon={<WhatsAppIcon sx={{ color: '#16a34a' }} />}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: '0.8rem',
                                                borderRadius: '10px',
                                                bgcolor: '#ffffff',
                                                borderColor: '#86efac',
                                                color: '#15803d',
                                                '&:hover': { bgcolor: '#f0fdf4', borderColor: '#4ade80' },
                                            }}
                                        >
                                            WhatsApp Registration (Adeline)
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            component="a"
                                            href="https://wa.me/6281325779040?text=Halo%20Sekretariat%20PIT%20IAGI%2C%20saya%20ingin%20menanyakan%20status%20pendaftaran%20tiket%20saya."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            startIcon={<WhatsAppIcon sx={{ color: '#16a34a' }} />}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: '0.8rem',
                                                borderRadius: '10px',
                                                bgcolor: '#ffffff',
                                                borderColor: '#86efac',
                                                color: '#15803d',
                                                '&:hover': { bgcolor: '#f0fdf4', borderColor: '#4ade80' },
                                            }}
                                        >
                                            WhatsApp Secretariat (Tiyas)
                                        </Button>
                                    </Stack>
                                </Box>
                            </Box>
                        </Paper>
                    )}

                    {/* Search Results List */}
                    {!isSearching && searchResults && searchResults.length > 0 && (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Chip
                                    label={`Found ${searchResults.length} Registration Record(s)`}
                                    size="small"
                                    sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 800, border: '1px solid #a7f3d0' }}
                                />
                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                    Klik tombol untuk membuka halaman status tiket / bukti bayar
                                </Typography>
                            </Box>

                            <Stack spacing={2}>
                                {searchResults.map((item) => {
                                    const isItemPending = item.status === 'pending' || item.payment_status === 'pending';
                                    const isItemActive = item.status === 'active' || item.payment_status === 'verified';
                                    const isItemRejected = item.status === 'rejected' || item.payment_status === 'rejected';

                                    let badgeBg = '#f1f5f9';
                                    let badgeColor = '#475569';
                                    let badgeLabel = item.status?.toUpperCase() || 'UNKNOWN';

                                    if (isItemPending) {
                                        badgeBg = '#fef3c7';
                                        badgeColor = '#b45309';
                                        badgeLabel = '⏳ Awaiting Verification';
                                    } else if (isItemActive) {
                                        badgeBg = '#dcfce7';
                                        badgeColor = '#15803d';
                                        badgeLabel = '✓ Verified & Active';
                                    } else if (isItemRejected) {
                                        badgeBg = '#fee2e2';
                                        badgeColor = '#b91c1c';
                                        badgeLabel = '✕ Rejected';
                                    } else if (item.status === 'used') {
                                        badgeBg = '#e0e7ff';
                                        badgeColor = '#4338ca';
                                        badgeLabel = 'Check-in Done';
                                    }

                                    return (
                                        <Paper
                                            key={item.id}
                                            elevation={0}
                                            sx={{
                                                p: 2.2,
                                                borderRadius: '16px',
                                                border: `1px solid ${isItemActive ? '#86efac' : isItemPending ? '#fde68a' : '#e2e8f0'}`,
                                                bgcolor: isItemActive ? '#f0fdf4' : isItemPending ? '#fffdf7' : '#ffffff',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                                                    borderColor: isItemActive ? '#4ade80' : isItemPending ? '#f59e0b' : '#cbd5e1',
                                                },
                                            }}
                                        >
                                            <Grid container spacing={2} alignItems="center">
                                                {/* Left Details */}
                                                <Grid item xs={12} md={7}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.6 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                                                            {item.name}
                                                        </Typography>
                                                        <Chip
                                                            label={item.category_label}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#f1f5f9',
                                                                color: '#334155',
                                                                fontWeight: 700,
                                                                fontSize: '0.68rem',
                                                                height: 20,
                                                            }}
                                                        />
                                                        <Chip
                                                            label={badgeLabel}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: badgeBg,
                                                                color: badgeColor,
                                                                fontWeight: 800,
                                                                fontSize: '0.7rem',
                                                                height: 22,
                                                                border: `1px solid ${badgeColor}33`,
                                                            }}
                                                        />
                                                    </Box>

                                                    <Stack spacing={0.4} sx={{ color: '#475569', fontSize: '0.8rem' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                            <EmailOutlinedIcon sx={{ fontSize: 15, color: '#64748b' }} />
                                                            <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600 }}>
                                                                {item.email}
                                                            </Typography>
                                                        </Box>
                                                        {item.phone && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                                <PhoneIphoneIcon sx={{ fontSize: 15, color: '#64748b' }} />
                                                                <Typography variant="caption" sx={{ color: '#475569' }}>
                                                                    {item.phone}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                        {item.institution && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                                <BusinessOutlinedIcon sx={{ fontSize: 15, color: '#64748b' }} />
                                                                <Typography variant="caption" sx={{ color: '#475569' }}>
                                                                    {item.institution}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Stack>

                                                    {/* Code Box */}
                                                    <Box sx={{ mt: 1.2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                        {item.payment_code && (
                                                            <Box
                                                                sx={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.6,
                                                                    px: 1.2,
                                                                    py: 0.3,
                                                                    borderRadius: '8px',
                                                                    bgcolor: '#f1f5f9',
                                                                    border: '1px solid #e2e8f0',
                                                                }}
                                                            >
                                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.74rem' }}>
                                                                    Payment: {item.payment_code}
                                                                </Typography>
                                                                <Tooltip title={copiedCode === item.payment_code ? 'Copied!' : 'Copy Code'}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleCopyCode(item.payment_code)}
                                                                        sx={{ p: 0.2, color: copiedCode === item.payment_code ? '#16a34a' : '#64748b' }}
                                                                    >
                                                                        {copiedCode === item.payment_code ? <CheckCircleIcon sx={{ fontSize: 13 }} /> : <ContentCopyIcon sx={{ fontSize: 13 }} />}
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        )}
                                                        <Box
                                                            sx={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: 0.6,
                                                                px: 1.2,
                                                                py: 0.3,
                                                                borderRadius: '8px',
                                                                bgcolor: '#f1f5f9',
                                                                border: '1px solid #e2e8f0',
                                                            }}
                                                        >
                                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.74rem' }}>
                                                                Ticket: {item.ticket_code}
                                                            </Typography>
                                                            <Tooltip title={copiedCode === item.ticket_code ? 'Copied!' : 'Copy Code'}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleCopyCode(item.ticket_code)}
                                                                    sx={{ p: 0.2, color: copiedCode === item.ticket_code ? '#16a34a' : '#64748b' }}
                                                                >
                                                                    {copiedCode === item.ticket_code ? <CheckCircleIcon sx={{ fontSize: 13 }} /> : <ContentCopyIcon sx={{ fontSize: 13 }} />}
                                                                </IconButton>
                            </Tooltip>
                                                        </Box>
                                                    </Box>
                                                </Grid>

                                                {/* Right Action CTA */}
                                                <Grid item xs={12} md={5}>
                                                    <Stack spacing={1} sx={{ alignItems: { xs: 'stretch', md: 'flex-end' } }}>
                                                        {item.has_payment ? (
                                                            <>
                                                                <Button
                                                                    component="a"
                                                                    href={item.status_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    variant="contained"
                                                                    size="small"
                                                                    endIcon={<ArrowForwardIcon />}
                                                                    sx={{
                                                                        bgcolor: isItemActive ? '#15803d' : '#047857',
                                                                        color: '#fff',
                                                                        fontWeight: 800,
                                                                        fontSize: '0.82rem',
                                                                        textTransform: 'none',
                                                                        borderRadius: '10px',
                                                                        px: 2,
                                                                        py: 0.8,
                                                                        boxShadow: 'none',
                                                                        width: { xs: '100%', md: 'auto' },
                                                                        '&:hover': { bgcolor: '#065f46' },
                                                                    }}
                                                                >
                                                                    {isItemPending ? 'Open Payment Status Page' : 'Open Verification Page'}
                                                                </Button>

                                                                {isItemActive && (
                                                                    <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', md: 'auto' } }}>
                                                                        <Button
                                                                            component="a"
                                                                            href={item.ticket_url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            startIcon={<QrCodeIcon />}
                                                                            sx={{
                                                                                color: '#047857',
                                                                                borderColor: '#a7f3d0',
                                                                                fontWeight: 700,
                                                                                fontSize: '0.78rem',
                                                                                textTransform: 'none',
                                                                                borderRadius: '8px',
                                                                                flex: 1,
                                                                                '&:hover': { bgcolor: '#ecfdf5', borderColor: '#10b981' },
                                                                            }}
                                                                        >
                                                                            E-Ticket
                                                                        </Button>
                                                                        {item.receipt_url && (
                                                                            <Button
                                                                                component="a"
                                                                                href={item.receipt_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                startIcon={<ReceiptLongIcon />}
                                                                                sx={{
                                                                                    color: '#475569',
                                                                                    borderColor: '#cbd5e1',
                                                                                    fontWeight: 700,
                                                                                    fontSize: '0.78rem',
                                                                                    textTransform: 'none',
                                                                                    borderRadius: '8px',
                                                                                    flex: 1,
                                                                                    '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' },
                                                                                }}
                                                                            >
                                                                                Receipt
                                                                            </Button>
                                                                        )}
                                                                    </Stack>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <Button
                                                                component="a"
                                                                href={item.ticket_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                variant="contained"
                                                                size="small"
                                                                endIcon={<ArrowForwardIcon />}
                                                                startIcon={<QrCodeIcon />}
                                                                sx={{
                                                                    bgcolor: '#047857',
                                                                    color: '#fff',
                                                                    fontWeight: 800,
                                                                    fontSize: '0.82rem',
                                                                    textTransform: 'none',
                                                                    borderRadius: '10px',
                                                                    px: 2,
                                                                    py: 0.8,
                                                                    boxShadow: 'none',
                                                                    width: { xs: '100%', md: 'auto' },
                                                                    '&:hover': { bgcolor: '#065f46' },
                                                                }}
                                                            >
                                                                View Digital E-Ticket
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 2,
                        px: 3,
                        bgcolor: '#f8fafc',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                        PIT IAGI-GEOSEA XIX 2026 Ticketing Support
                    </Typography>
                    <Button
                        onClick={() => setCheckStatusOpen(false)}
                        sx={{
                            color: '#334155',
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 2,
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
