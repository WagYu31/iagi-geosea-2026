import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import jsQR from 'jsqr';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Chip,
    Stack,
    Divider,
    Alert,
    IconButton,
    Paper,
    CircularProgress,
    Tooltip,
    FormControl,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PrintIcon from '@mui/icons-material/Print';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import StopIcon from '@mui/icons-material/Stop';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import DeskIcon from '@mui/icons-material/DesktopWindows';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CloseIcon from '@mui/icons-material/Close';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CropPortraitIcon from '@mui/icons-material/CropPortrait';
import StayCurrentPortraitIcon from '@mui/icons-material/StayCurrentPortrait';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';

const CATEGORY_MAP = {
    // 1. Participant
    iagi_member_professional: {
        label: 'PARTICIPANT: PROFESSIONAL (MEMBER)',
        shortLabel: 'PRO (MEMBER)',
        bg: '#dcfce7',
        color: '#15803d',
        border: '#86efac',
    },
    non_iagi_member_professional: {
        label: 'PARTICIPANT: PROFESSIONAL (NON-MEMBER)',
        shortLabel: 'PRO (NON-MEMBER)',
        bg: '#e0f2fe',
        color: '#0369a1',
        border: '#7dd3fc',
    },
    iagi_member_expatriate: {
        label: 'PARTICIPANT: EXPATRIATE (MEMBER)',
        shortLabel: 'EXPAT (MEMBER)',
        bg: '#ede9fe',
        color: '#6d28d9',
        border: '#c4b5fd',
    },
    non_iagi_member_expatriate: {
        label: 'PARTICIPANT: EXPATRIATE (NON-MEMBER)',
        shortLabel: 'EXPAT (NON-MEMBER)',
        bg: '#ede9fe',
        color: '#5b21b6',
        border: '#c4b5fd',
    },
    student_undergraduate: {
        label: 'PARTICIPANT: STUDENT UNDERGRADUATE',
        shortLabel: 'STUDENT',
        bg: '#e0e7ff',
        color: '#3730a3',
        border: '#a5b4fc',
    },

    // 2. Visitor
    non_exclusive: {
        label: 'VISITOR PASS',
        shortLabel: 'VISITOR',
        bg: '#ecfdf5',
        color: '#047857',
        border: '#a7f3d0',
    },

    // 3. VIP
    vip: {
        label: 'VIP',
        shortLabel: 'VIP',
        bg: '#fef3c7',
        color: '#92400e',
        border: '#fde68a',
    },

    // 4. Keynote Speaker
    speaker: {
        label: 'KEYNOTE SPEAKER',
        shortLabel: 'KEYNOTE SPEAKER',
        bg: '#fdf2f8',
        color: '#9d174d',
        border: '#fbcfe8',
    },
    keynote_speech: {
        label: 'KEYNOTE SPEAKER',
        shortLabel: 'KEYNOTE SPEAKER',
        bg: '#fdf2f8',
        color: '#9d174d',
        border: '#fbcfe8',
    },
    keynote_speaker: {
        label: 'KEYNOTE SPEAKER',
        shortLabel: 'KEYNOTE SPEAKER',
        bg: '#fdf2f8',
        color: '#9d174d',
        border: '#fbcfe8',
    },

    // 5. Panelist
    panelist: {
        label: 'PANELIST',
        shortLabel: 'PANELIST',
        bg: '#f5f3ff',
        color: '#5b21b6',
        border: '#ddd6fe',
    },

    // 6. Moderator
    moderator: {
        label: 'MODERATOR',
        shortLabel: 'MODERATOR',
        bg: '#ecfeff',
        color: '#155e75',
        border: '#a5f3fc',
    },

    // 7. Exhibition
    exhibition: {
        label: 'EXHIBITION',
        shortLabel: 'EXHIBITION',
        bg: '#fff7ed',
        color: '#9a3412',
        border: '#fed7aa',
    },

    // 8. Committee
    committee: {
        label: 'COMMITTEE',
        shortLabel: 'COMMITTEE',
        bg: '#eff6ff',
        color: '#1e40af',
        border: '#bfdbfe',
    },

    // 9. Student Volunteer
    student_volunteer: {
        label: 'STUDENT VOLUNTEER',
        shortLabel: 'STUDENT VOLUNTEER',
        bg: '#f0fdf4',
        color: '#166534',
        border: '#bbf7d0',
    },

    // 10. Board
    board: {
        label: 'BOARD',
        shortLabel: 'BOARD',
        bg: '#fef3c7',
        color: '#b45309',
        border: '#fde68a',
    },

    // 11. Delegate
    sponsorship: {
        label: 'DELEGATE',
        shortLabel: 'DELEGATE',
        bg: '#ecfdf5',
        color: '#065f46',
        border: '#a7f3d0',
    },
    sponsor: {
        label: 'DELEGATE',
        shortLabel: 'DELEGATE',
        bg: '#ecfdf5',
        color: '#065f46',
        border: '#a7f3d0',
    },
    delegate: {
        label: 'DELEGATE',
        shortLabel: 'DELEGATE',
        bg: '#ecfdf5',
        color: '#065f46',
        border: '#a7f3d0',
    },
};

const getCategoryMeta = (type) => CATEGORY_MAP[type] || CATEGORY_MAP.non_exclusive;

export default function GateScanner({
    exclusiveTemplate = null,
    nonExclusiveTemplate = null,
    eventVenue = 'Royal Ambarrukmo Yogyakarta',
}) {
    const [scanning, setScanning] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [processing, setProcessing] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [facingMode, setFacingMode] = useState(() => {
        if (typeof navigator !== 'undefined') {
            const isPhoneScanner = /iPhone|Android.*Mobile|Mobile.*Android/i.test(navigator.userAgent) && !/iPad|Tablet/i.test(navigator.userAgent);
            return isPhoneScanner ? 'environment' : 'user';
        }
        return 'user';
    });
    const [availableCameras, setAvailableCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState('');
    const [scanResult, setScanResult] = useState(null);
    const [recentScans, setRecentScans] = useState([]);
    const [cameraError, setCameraError] = useState(null);
    const [scanPulse, setScanPulse] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenToastVisible, setFullscreenToastVisible] = useState(false);
    const toastTimeoutRef = useRef(null);

    // Portrait / Landscape Viewfinder Orientation Mode
    const [isPortrait, setIsPortrait] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('gate_scanner_orientation');
            if (saved) return saved === 'portrait';
            return window.innerHeight > window.innerWidth;
        }
        return false;
    });
    const isPortraitRef = useRef(isPortrait);
    useEffect(() => {
        isPortraitRef.current = isPortrait;
    }, [isPortrait]);

    const toggleOrientation = async () => {
        const next = !isPortrait;
        setIsPortrait(next);
        isPortraitRef.current = next;
        localStorage.setItem('gate_scanner_orientation', next ? 'portrait' : 'landscape');
        if (scanning) {
            await startCamera(selectedCameraId || null, next);
        }
    };

    // Auto-detect orientation change on mobile/tablet if no explicit preference is set
    useEffect(() => {
        const handleResize = () => {
            const saved = localStorage.getItem('gate_scanner_orientation');
            if (!saved && typeof window !== 'undefined') {
                const autoPortrait = window.innerHeight > window.innerWidth;
                setIsPortrait(autoPortrait);
                isPortraitRef.current = autoPortrait;
            }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    // AI Auto-Focus State
    const [aiAutoFocus, setAiAutoFocus] = useState(() => {
        const saved = localStorage.getItem('gate_scanner_ai_autofocus');
        return saved !== null ? saved === 'true' : true;
    });
    const [focusTapPoint, setFocusTapPoint] = useState(null);
    const [aiFocusStatus, setAiFocusStatus] = useState('ACTIVE'); // 'ACTIVE' | 'LOCKING' | 'LOCKED'
    const focusTapTimeoutRef = useRef(null);
    const autoFocusIntervalRef = useRef(null);

    // AI Hardware Auto-Focus Constraint Driver (WebRTC MediaTrackConstraints)
    const triggerHardwareFocus = async (point = null) => {
        try {
            const videoEl = document.querySelector('#qr-reader video');
            if (!videoEl || !videoEl.srcObject) return;
            const stream = videoEl.srcObject;
            const tracks = stream.getVideoTracks ? stream.getVideoTracks() : [];
            if (tracks.length === 0) return;
            const track = tracks[0];

            const capabilities = track.getCapabilities ? track.getCapabilities() : {};
            const advancedConstraints = {};

            // Optical Continuous / Single-Shot Focus
            if (capabilities.focusMode) {
                if (capabilities.focusMode.includes('continuous')) {
                    advancedConstraints.focusMode = 'continuous';
                } else if (capabilities.focusMode.includes('single-shot')) {
                    advancedConstraints.focusMode = 'single-shot';
                }
            }

            // Tap-to-focus point coordinate
            if (point && capabilities.pointsOfInterest) {
                advancedConstraints.pointsOfInterest = [{ x: point.normX, y: point.normY }];
            }

            // Auto exposure adjustment
            if (capabilities.exposureMode && capabilities.exposureMode.includes('continuous')) {
                advancedConstraints.exposureMode = 'continuous';
            }

            if (Object.keys(advancedConstraints).length > 0) {
                await track.applyConstraints({ advanced: [advancedConstraints] });
            }
        } catch (_) {}
    };

    // AI Auto-Focus Routine Listener
    useEffect(() => {
        if (!scanning || !aiAutoFocus) {
            if (autoFocusIntervalRef.current) clearInterval(autoFocusIntervalRef.current);
            return;
        }

        // Apply immediately
        triggerHardwareFocus();

        // Recalibrate focus every 4 seconds
        autoFocusIntervalRef.current = setInterval(() => {
            setAiFocusStatus('LOCKING');
            triggerHardwareFocus();
            setTimeout(() => {
                setAiFocusStatus('LOCKED');
                setTimeout(() => setAiFocusStatus('ACTIVE'), 1000);
            }, 600);
        }, 4000);

        return () => {
            if (autoFocusIntervalRef.current) clearInterval(autoFocusIntervalRef.current);
        };
    }, [scanning, aiAutoFocus]);

    const handleViewfinderClick = (e) => {
        if (!scanning) return;
        if (e.target.closest('button') || e.target.closest('.MuiButtonBase-root') || e.target.closest('input')) {
            return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const normX = Math.max(0, Math.min(1, x / rect.width));
        const normY = Math.max(0, Math.min(1, y / rect.height));

        setFocusTapPoint({ x, y });
        setAiFocusStatus('LOCKING');
        triggerHardwareFocus({ normX, normY });

        if (focusTapTimeoutRef.current) clearTimeout(focusTapTimeoutRef.current);
        focusTapTimeoutRef.current = setTimeout(() => {
            setAiFocusStatus('LOCKED');
            setTimeout(() => {
                setFocusTapPoint(null);
                setAiFocusStatus('ACTIVE');
            }, 1200);
        }, 400);
    };

    // Fullscreen Camera Kiosk Toggle Handlers
    const toggleFullscreen = async () => {
        if (!isFullscreen) {
            setIsFullscreen(true);
            if (!scanning) {
                await startCamera(selectedCameraId || null);
            }
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen().catch(() => {});
                } else if (document.documentElement.webkitRequestFullscreen) {
                    await document.documentElement.webkitRequestFullscreen().catch(() => {});
                }
            } catch (_) {}
        } else {
            exitFullscreen();
        }
    };

    const exitFullscreen = () => {
        setIsFullscreen(false);
        try {
            if (document.fullscreenElement || document.webkitFullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen().catch(() => {});
                }
            }
        } catch (_) {}
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isDocFullscreen = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
            if (!isDocFullscreen && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                exitFullscreen();
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            window.removeEventListener('keydown', handleKeyDown);
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        };
    }, [isFullscreen]);

    // High Speed Multi-Station Features (10 Stations / Printers)
    const [stationNumber, setStationNumber] = useState(() => {
        return localStorage.getItem('gate_scanner_station_no') || '1';
    });

    const [autoPrint, setAutoPrint] = useState(() => {
        const saved = localStorage.getItem('gate_scanner_auto_print');
        return saved !== null ? saved === 'true' : true;
    });

    const html5QrCodeRef = useRef(null);
    const isProcessingRef = useRef(false);
    const lastScannedCodeRef = useRef('');
    const lastScannedAtRef = useRef(0);
    const inputRef = useRef(null);
    const barcodeBufferRef = useRef('');
    const lastKeyTimeRef = useRef(0);

    // Save Station & Auto-Print preferences
    const handleStationChange = (val) => {
        setStationNumber(val);
        localStorage.setItem('gate_scanner_station_no', val);
    };

    const handleToggleAutoPrint = (val) => {
        setAutoPrint(val);
        localStorage.setItem('gate_scanner_auto_print', String(val));
    };

    const triggerAutoPrint = (ticketId) => {
        try {
            const printUrl = route('admin.visitorTickets.printBadge', ticketId);

            // Attempt 1: window.open (Standard separate popup window)
            let win = null;
            try {
                win = window.open(printUrl, '_blank', 'width=750,height=900,menubar=no,toolbar=no,location=no');
            } catch (_) {}

            // Attempt 2: If Safari / Chrome blocked the popup, fallback immediately to silent iframe print!
            if (!win || win.closed || typeof win.closed === 'undefined') {
                let iframe = document.getElementById('silent-badge-printer-frame');
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = 'silent-badge-printer-frame';
                    iframe.style.position = 'fixed';
                    iframe.style.right = '0';
                    iframe.style.bottom = '0';
                    iframe.style.width = '10px';
                    iframe.style.height = '10px';
                    iframe.style.opacity = '0.01';
                    iframe.style.border = 'none';
                    iframe.style.pointerEvents = 'none';
                    iframe.style.zIndex = '-9999';
                    document.body.appendChild(iframe);
                }
                iframe.src = printUrl;
            }
        } catch (e) {
            console.warn('Auto print error:', e);
        }
    };

    // Preload Badge Background SVGs for 0ms print latency
    useEffect(() => {
        const badgeSvgs = [
            '/images/badges/Committee.svg',
            '/images/badges/Exhibitor.svg',
            '/images/badges/Moderator.svg',
            '/images/badges/Panelist.svg',
            '/images/badges/Participant.svg',
            '/images/badges/Speaker.svg',
            '/images/badges/Student_Volunteer.svg',
            '/images/badges/VIP.svg',
            '/images/badges/Board.svg',
            '/images/badges/Visitor.svg',
            '/images/badges/Sponsorship.svg',
        ];
        badgeSvgs.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        if (inputRef.current) {
            inputRef.current.focus();
        }



        return () => {
            if (html5QrCodeRef.current) {
                try {
                    const qr = html5QrCodeRef.current;
                    const isScanning = typeof qr.isScanning === 'boolean' ? qr.isScanning : (qr.getState && qr.getState() === 2);
                    if (isScanning) {
                        qr.stop().catch(() => {});
                    }
                } catch (_) {}
            }
        };
    }, []);

    // Global barcode scanner hardware gun listener (Keyboard wedge support for USB/Bluetooth 2D Guns)
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            const target = e.target;
            const isInsideInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

            const now = Date.now();
            const timeDiff = now - lastKeyTimeRef.current;
            lastKeyTimeRef.current = now;

            if (e.key === 'Enter') {
                if (barcodeBufferRef.current.length >= 5) {
                    const scanned = barcodeBufferRef.current.trim();
                    barcodeBufferRef.current = '';
                    processTicketCheckIn(scanned, true);
                    e.preventDefault();
                } else {
                    barcodeBufferRef.current = '';
                }
            } else if (e.key.length === 1) {
                // Barcode scanner guns send keystrokes extremely rapidly (<50ms per key)
                if (timeDiff < 60 || barcodeBufferRef.current.length > 0) {
                    barcodeBufferRef.current += e.key;
                } else if (!isInsideInput) {
                    barcodeBufferRef.current = e.key;
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [autoPrint]);

    // Audio Feedback Synthesis
    const playSound = (type) => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'success') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            } else if (type === 'warning') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(320, ctx.currentTime);
                osc.frequency.setValueAtTime(220, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.35, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.35);
            } else {
                osc.type = 'square';
                osc.frequency.setValueAtTime(160, ctx.currentTime);
                gain.gain.setValueAtTime(0.35, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            }
        } catch (e) {
            console.error('Audio playback error:', e);
        }
    };

    // Update session history with unique attendee deduping
    const updateRecentScans = (ticketData, status) => {
        if (!ticketData) return;
        const nowTime = new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        setRecentScans((prev) => {
            const filtered = prev.filter(
                (item) => item.ticket?.ticket_code !== ticketData.ticket_code
            );

            return [
                {
                    ticket: ticketData,
                    timestamp: nowTime,
                    status: status, // 'success' | 'already_checked_in' | 'error'
                },
                ...filtered.slice(0, 39), // Keep up to 40 unique attendees in view
            ];
        });
    };

    const processTicketCheckIn = async (code, isManual = false) => {
        if (!code) return;
        let cleanCode = code.trim();

        // Auto extract ticket code if raw URL was scanned (e.g. https://pitiagi.cloud/ticket/show/TKT-...)
        const urlMatch = cleanCode.match(/TKT-[A-Z0-9\-]+/i);
        if (urlMatch) {
            cleanCode = urlMatch[0].toUpperCase();
        }

        const now = Date.now();

        // Prevent camera loop from repeatedly scanning the exact same QR code (2.5-second cooldown per same code)
        if (!isManual) {
            if (isProcessingRef.current) return;
            if (
                lastScannedCodeRef.current === cleanCode &&
                now - lastScannedAtRef.current < 2500
            ) {
                return; // Silently skip duplicate camera triggers for same code
            }
        }

        isProcessingRef.current = true;
        lastScannedCodeRef.current = cleanCode;
        lastScannedAtRef.current = now;

        setProcessing(true);
        setCameraError(null);
        setScanPulse(true);
        setTimeout(() => setScanPulse(false), 800);

        try {
            const response = await axios.post(route('admin.gateScanner.checkin'), {
                ticket_code: cleanCode,
            });

            const data = response.data;
            setScanResult(data);
            setFullscreenToastVisible(true);
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
            toastTimeoutRef.current = setTimeout(() => {
                setFullscreenToastVisible(false);
            }, 4500);
            playSound('success');

            if (data.ticket) {
                updateRecentScans(data.ticket, 'success');

                // ⚡ AUTO-OPEN PRINT BADGE IF ENABLED (For 10 Printer Stations High Speed Printing)
                if (autoPrint) {
                    triggerAutoPrint(data.ticket.id);
                }
            }
        } catch (err) {
            const errorData = err.response?.data || {
                success: false,
                status: 'error',
                message: 'Failed to verify ticket. Please check your network connection.',
            };

            setScanResult(errorData);
            setFullscreenToastVisible(true);
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
            toastTimeoutRef.current = setTimeout(() => {
                setFullscreenToastVisible(false);
            }, 4500);

            if (errorData.status === 'already_checked_in') {
                playSound('warning');
            } else {
                playSound('error');
            }

            if (errorData.ticket) {
                updateRecentScans(errorData.ticket, errorData.status);
            }
        } finally {
            setProcessing(false);
            setManualCode('');
            // Focus back to manual code input for hardware guns
            if (inputRef.current) {
                inputRef.current.focus();
            }
            // Rapid release: 800ms delay before next scan can process
            setTimeout(() => {
                isProcessingRef.current = false;
            }, 800);
        }
    };

    // Multi-Engine High Speed Realtime QR Decoder Loop (Direct Video Stream + jsQR inverted attemptBoth + Native BarcodeDetector)
    useEffect(() => {
        if (!scanning) return;

        let active = true;
        let animationFrameId = null;
        let canvas = null;
        let ctx = null;

        let nativeDetector = null;
        if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
            try {
                nativeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
            } catch (_) {}
        }

        const scanDirectVideo = async () => {
            if (!active) return;

            const videoEl = document.querySelector('#qr-reader video');
            if (videoEl && videoEl.readyState >= 2 && !videoEl.paused && !isProcessingRef.current) {
                let detectedCode = null;

                // Priority 1: Native Hardware BarcodeDetector (instant GPU decode on Apple/Android)
                if (nativeDetector) {
                    try {
                        const barcodes = await nativeDetector.detect(videoEl);
                        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                            detectedCode = barcodes[0].rawValue;
                        }
                    } catch (_) {}
                }

                // Priority 2: jsQR with { inversionAttempts: 'attemptBoth' } (Crucial for dark mode phone screens & inverted QR codes)
                if (!detectedCode && videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
                    try {
                        if (!canvas) {
                            canvas = document.createElement('canvas');
                            ctx = canvas.getContext('2d', { willReadFrequently: true });
                        }

                        // Sample at max 720 width for fast 30fps decoding
                        const scale = Math.min(1, 720 / videoEl.videoWidth);
                        const w = Math.floor(videoEl.videoWidth * scale);
                        const h = Math.floor(videoEl.videoHeight * scale);

                        if (canvas.width !== w || canvas.height !== h) {
                            canvas.width = w;
                            canvas.height = h;
                        }

                        ctx.drawImage(videoEl, 0, 0, w, h);
                        const imageData = ctx.getImageData(0, 0, w, h);

                        const qr = jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: 'attemptBoth',
                        });

                        if (qr && qr.data) {
                            detectedCode = qr.data;
                        }
                    } catch (_) {}
                }

                if (detectedCode && !isProcessingRef.current) {
                    processTicketCheckIn(detectedCode, false);
                }
            }

            if (active) {
                setTimeout(() => {
                    if (active) {
                        animationFrameId = requestAnimationFrame(scanDirectVideo);
                    }
                }, 80);
            }
        };

        const timer = setTimeout(() => {
            animationFrameId = requestAnimationFrame(scanDirectVideo);
        }, 400);

        return () => {
            active = false;
            clearTimeout(timer);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            canvas = null;
            ctx = null;
        };
    }, [scanning]);

    const startCamera = async (specificModeOrId = null, forcedPortrait = null) => {
        setCameraError(null);
        try {
            if (html5QrCodeRef.current) {
                try {
                    const qr = html5QrCodeRef.current;
                    const isScanning = typeof qr.isScanning === 'boolean' ? qr.isScanning : (qr.getState && qr.getState() === 2);
                    if (isScanning) {
                        await qr.stop();
                    }
                    await qr.clear();
                } catch (e) {
                    console.warn('Error clearing previous camera instance:', e);
                }
            }

            const isHandheldPhone = /iPhone|Android.*Mobile|Mobile.*Android/i.test(navigator.userAgent) && !/iPad|Tablet/i.test(navigator.userAgent);
            const usePortrait = forcedPortrait !== null ? forcedPortrait : isPortraitRef.current;

            // Full frame scan configuration (no restrictive qrbox cropping)
            const qrConfig = {
                fps: 25,
                disableFlip: false,
                videoConstraints: {
                    facingMode: isHandheldPhone ? 'environment' : 'user',
                    width: usePortrait ? { ideal: 720 } : { ideal: 1280 },
                    height: usePortrait ? { ideal: 1280 } : { ideal: 720 },
                    aspectRatio: usePortrait ? 0.75 : 1.7777,
                },
            };

            const qrSuccessCallback = (decodedText) => {
                processTicketCheckIn(decodedText, false);
            };

            const el = document.getElementById('qr-reader');
            if (el) el.innerHTML = '';
            const instance = new Html5Qrcode('qr-reader', {
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                verbose: false,
                experimentalFeatures: {
                    useBarCodeDetectorIfSupported: true,
                },
            });
            html5QrCodeRef.current = instance;

            // 1. If user explicitly selected a camera from dropdown
            if (specificModeOrId && specificModeOrId !== 'environment' && specificModeOrId !== 'user') {
                await instance.start(specificModeOrId, qrConfig, qrSuccessCallback, () => {});
                setSelectedCameraId(specificModeOrId);
                setScanning(true);
                setCameraError(null);
                return;
            }

            // 2. Hardware-ID First: enumerate physical cameras to avoid facingMode constraint mismatch
            try {
                const cameras = await Html5Qrcode.getCameras();
                if (cameras && cameras.length > 0) {
                    setAvailableCameras(cameras);
                    // iPad, Mac, PC: ALWAYS pick the Front / User camera
                    // Smartphone: pick Rear camera
                    const preferred = isHandheldPhone
                        ? (cameras.find((c) => /back|rear|environment|belakang/i.test(c.label)) || cameras[cameras.length - 1])
                        : (cameras.find((c) => /front|user|facetime|built-in|integrated|macbook|depan/i.test(c.label)) || cameras[0]);

                    await instance.start(preferred.id, qrConfig, qrSuccessCallback, () => {});
                    setSelectedCameraId(preferred.id);
                    setScanning(true);
                    setCameraError(null);
                    return;
                }
            } catch (camErr) {
                console.warn('Physical camera enumeration fallback:', camErr);
            }

            // 3. Fallback: try by facingMode
            const primaryMode = isHandheldPhone ? 'environment' : 'user';
            const secondaryMode = isHandheldPhone ? 'user' : 'environment';

            let started = false;
            try {
                await instance.start({ facingMode: primaryMode }, qrConfig, qrSuccessCallback, () => {});
                setFacingMode(primaryMode);
                started = true;
            } catch (err1) {
                console.warn(`Primary mode (${primaryMode}) failed:`, err1);
                try {
                    await instance.start({ facingMode: secondaryMode }, qrConfig, qrSuccessCallback, () => {});
                    setFacingMode(secondaryMode);
                    started = true;
                } catch (err2) {
                    console.warn(`Secondary mode (${secondaryMode}) failed:`, err2);
                    throw err1 || err2;
                }
            }

            if (started) {
                setScanning(true);
                setCameraError(null);
                setTimeout(() => triggerHardwareFocus(), 300);
                return;
            }

            throw new Error('Tidak ada perangkat kamera yang dapat diakses.');

        } catch (err) {
            console.error('Camera start error:', err);
            const errName = err?.name || '';
            const errStr = String(err?.message || err);

            setCameraError(errStr.replace(/^Error:\s*/, ''));
            setScanning(false);
        }
    };

    const stopCamera = async () => {
        if (html5QrCodeRef.current && scanning) {
            try {
                await html5QrCodeRef.current.stop();
                setScanning(false);
            } catch (err) {
                console.error('Camera stop error:', err);
            }
        }
    };

    const toggleCameraFacing = async () => {
        if (availableCameras.length > 1) {
            const currentIndex = availableCameras.findIndex(c => c.id === selectedCameraId);
            const nextIndex = (currentIndex + 1) % availableCameras.length;
            const nextCam = availableCameras[nextIndex];
            setSelectedCameraId(nextCam.id);
            await startCamera(nextCam.id);
        } else {
            const nextMode = facingMode === 'environment' ? 'user' : 'environment';
            setFacingMode(nextMode);
            if (scanning) {
                await startCamera(nextMode);
            }
        }
    };



    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualCode.trim()) {
            processTicketCheckIn(manualCode.trim(), true);
        }
    };

    const totalSuccess = recentScans.filter(s => s.status === 'success').length;
    const totalVip = recentScans.filter(s => (s.ticket?.visitor_type === 'exclusive' || s.ticket?.visitor_type === 'vip') && s.status === 'success').length;
    const totalWarn = recentScans.filter(s => s.status !== 'success').length;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', color: '#0f172a', py: { xs: 2, md: 3 } }}>
            <Head title={`Gate Scanner (Station ${stationNumber}) - 55th PIT IAGI & GEOSEA 2026`} />

            {/* Global Keyframes for Fullscreen Scanner Animations & AI Auto-Focus */}
            <style>{`
                @keyframes scanLaserLine {
                    0% { top: 8%; opacity: 0.2; }
                    50% { top: 86%; opacity: 1; }
                    100% { top: 8%; opacity: 0.2; }
                }
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.15); }
                }
                @keyframes slideUpToast {
                    from { transform: translate(-50%, 40px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
                @keyframes aiFocusRing {
                    0% { transform: scale(0.3); opacity: 1; border-color: #22d3ee; }
                    50% { transform: scale(1.15); opacity: 0.85; border-color: #06b6d4; }
                    100% { transform: scale(1.6); opacity: 0; border-color: #10b981; }
                }
                @keyframes spinPulse {
                    0% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.2); }
                    100% { transform: rotate(360deg) scale(1); }
                }
                @keyframes crosshairPulse {
                    0%, 100% { opacity: 0.4; transform: scale(0.95); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
            `}</style>

            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>
                {/* 3D HEADER BAR WITH HIGH-SPEED CONFIG & STATION SELECTOR */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        px: 3,
                        borderRadius: '18px',
                        bgcolor: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        boxShadow: '0 4px 0 #e2e8f0, 0 10px 25px rgba(0,0,0,0.03)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button
                            component={Link}
                            href={route('admin.visitorTickets')}
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                bgcolor: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                color: '#334155',
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                borderRadius: '10px',
                                px: 1.8,
                                py: 0.8,
                                boxShadow: '0 2px 0 #cbd5e1',
                                '&:hover': { bgcolor: '#f1f5f9', transform: 'translateY(-1px)' },
                                '&:active': { transform: 'translateY(1px)' },
                            }}
                        >
                            Ticket Dashboard
                        </Button>

                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.15rem', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                Entrance Gate Scanner 📱
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                55th PIT IAGI & GEOSEA XIX 2026 &bull; {eventVenue}
                            </Typography>
                        </Box>
                    </Box>

                    {/* CONTROL BAR: STATION SELECTOR, AUTO-PRINT TOGGLE, SOUND TOGGLE */}
                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                        {/* Desk / Printer Station Selector */}
                        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f1f5f9', p: '2px 8px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                            <DeskIcon sx={{ fontSize: 16, color: '#475569', mr: 0.8 }} />
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', mr: 0.8 }}>
                                Station:
                            </Typography>
                            <FormControl size="small" variant="standard">
                                <Select
                                    value={stationNumber}
                                    onChange={(e) => handleStationChange(e.target.value)}
                                    disableUnderline
                                    sx={{
                                        fontSize: '0.82rem',
                                        fontWeight: 900,
                                        color: '#094d42',
                                        '& .MuiSelect-select': { py: 0.3, pr: '20px !important' },
                                    }}
                                >
                                    {[...Array(10)].map((_, idx) => (
                                        <MenuItem key={idx + 1} value={String(idx + 1)}>
                                            Gate {idx + 1} (Printer {idx + 1})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* ⚡ Instant Auto-Print Badge Toggle */}
                        <Tooltip title={autoPrint ? "Auto-Print ON: Scan langsung membuka & mencetak Lanyard Badge" : "Auto-Print OFF: Hanya cek tiket tanpa membuka print"}>
                            <Button
                                size="small"
                                onClick={() => handleToggleAutoPrint(!autoPrint)}
                                startIcon={autoPrint ? <BoltIcon sx={{ color: '#ffffff' }} /> : <LocalPrintshopIcon sx={{ color: '#64748b' }} />}
                                sx={{
                                    bgcolor: autoPrint ? '#094d42' : '#f1f5f9',
                                    color: autoPrint ? '#ffffff' : '#64748b',
                                    border: `1px solid ${autoPrint ? '#094d42' : '#cbd5e1'}`,
                                    boxShadow: autoPrint ? '0 2px 0 #04221d, 0 4px 12px rgba(9,77,66,0.25)' : '0 2px 0 #cbd5e1',
                                    textTransform: 'none',
                                    fontWeight: 900,
                                    fontSize: '0.75rem',
                                    borderRadius: '10px',
                                    px: 1.5,
                                    py: 0.6,
                                    '&:hover': {
                                        bgcolor: autoPrint ? '#06352e' : '#e2e8f0',
                                    },
                                }}
                            >
                                {autoPrint ? '⚡ Auto-Print: ON' : 'Auto-Print: OFF'}
                            </Button>
                        </Tooltip>

                        {/* AI Auto-Focus Toggle Button */}
                        <Tooltip title={aiAutoFocus ? "AI Auto-Fokus AKTIF: Kamera otomatis mengunci fokus & ketajaman QR code" : "AI Auto-Fokus NONAKTIF"}>
                            <Button
                                size="small"
                                onClick={() => {
                                    const next = !aiAutoFocus;
                                    setAiAutoFocus(next);
                                    localStorage.setItem('gate_scanner_ai_autofocus', String(next));
                                    if (next) triggerHardwareFocus();
                                }}
                                startIcon={<AutoAwesomeIcon sx={{ color: aiAutoFocus ? '#0284c7' : '#94a3b8' }} />}
                                sx={{
                                    bgcolor: aiAutoFocus ? '#f0f9ff' : '#f1f5f9',
                                    color: aiAutoFocus ? '#0284c7' : '#64748b',
                                    border: `1px solid ${aiAutoFocus ? '#bae6fd' : '#cbd5e1'}`,
                                    boxShadow: aiAutoFocus ? '0 2px 0 #bae6fd, 0 4px 12px rgba(2,132,199,0.15)' : '0 2px 0 #cbd5e1',
                                    textTransform: 'none',
                                    fontWeight: 900,
                                    fontSize: '0.75rem',
                                    borderRadius: '10px',
                                    px: 1.5,
                                    py: 0.6,
                                    '&:hover': {
                                        bgcolor: aiAutoFocus ? '#e0f2fe' : '#e2e8f0',
                                        transform: 'translateY(-1px)',
                                    },
                                    '&:active': { transform: 'translateY(1px)' },
                                }}
                            >
                                {aiAutoFocus ? '🤖 AI Focus: ON' : 'AI Focus: OFF'}
                            </Button>
                        </Tooltip>

                        {/* Portrait / Landscape Viewfinder Toggle Button */}
                        <Tooltip title={isPortrait ? "Beralih ke Tampilan Landscape (Melebar)" : "Beralih ke Tampilan Portrait (Tegak / Stand Kiosk)"}>
                            <Button
                                size="small"
                                onClick={toggleOrientation}
                                startIcon={isPortrait ? <CropPortraitIcon sx={{ color: '#094d42' }} /> : <ScreenRotationIcon sx={{ color: '#64748b' }} />}
                                sx={{
                                    bgcolor: isPortrait ? '#ecfdf5' : '#f8fafc',
                                    color: isPortrait ? '#094d42' : '#475569',
                                    border: `1.5px solid ${isPortrait ? '#a7f3d0' : '#cbd5e1'}`,
                                    boxShadow: isPortrait ? '0 2px 0 #a7f3d0, 0 4px 12px rgba(16,185,129,0.1)' : '0 2px 0 #cbd5e1',
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    fontSize: '0.75rem',
                                    borderRadius: '10px',
                                    px: 1.5,
                                    py: 0.6,
                                    '&:hover': {
                                        bgcolor: isPortrait ? '#d1fae5' : '#f1f5f9',
                                        transform: 'translateY(-1px)',
                                    },
                                    '&:active': { transform: 'translateY(1px)' },
                                }}
                            >
                                {isPortrait ? '📱 Portrait' : '🖥️ Landscape'}
                            </Button>
                        </Tooltip>

                        {/* Sound Toggle */}
                        <Tooltip title={soundEnabled ? 'Mute Audio Beep' : 'Enable Audio Beep'}>
                            <IconButton
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                sx={{
                                    bgcolor: soundEnabled ? '#ecfdf5' : '#f1f5f9',
                                    border: `1.5px solid ${soundEnabled ? '#a7f3d0' : '#cbd5e1'}`,
                                    color: soundEnabled ? '#059669' : '#64748b',
                                    boxShadow: soundEnabled ? '0 2px 0 #a7f3d0' : '0 2px 0 #cbd5e1',
                                    borderRadius: '10px',
                                    p: 0.8,
                                }}
                            >
                                {soundEnabled ? <VolumeUpIcon sx={{ fontSize: 19 }} /> : <VolumeOffIcon sx={{ fontSize: 19 }} />}
                            </IconButton>
                        </Tooltip>

                        {/* Fullscreen Kiosk Mode Button */}
                        <Tooltip title="Buka Kamera Layar Penuh (Hanya Tampil Kamera)">
                            <Button
                                size="small"
                                onClick={toggleFullscreen}
                                startIcon={<FullscreenIcon />}
                                sx={{
                                    bgcolor: '#0284c7',
                                    color: '#ffffff',
                                    border: '1px solid #0284c7',
                                    boxShadow: '0 2px 0 #0369a1, 0 4px 12px rgba(2, 132, 199, 0.25)',
                                    textTransform: 'none',
                                    fontWeight: 900,
                                    fontSize: '0.75rem',
                                    borderRadius: '10px',
                                    px: 1.6,
                                    py: 0.6,
                                    '&:hover': {
                                        bgcolor: '#0369a1',
                                        transform: 'translateY(-1px)',
                                    },
                                    '&:active': { transform: 'translateY(1px)' },
                                }}
                            >
                                Layar Penuh
                            </Button>
                        </Tooltip>
                    </Stack>
                </Paper>

                {/* 3D QUICK SESSION STATS */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.8,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                            border: '1.5px solid #a7f3d0',
                            boxShadow: '0 4px 0 #a7f3d0, 0 6px 16px rgba(16,185,129,0.06)',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: '#065f46', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                            Successful Check-Ins
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#047857', mt: 0.2 }}>
                            {totalSuccess} <Typography component="span" variant="caption" sx={{ color: '#065f46', fontWeight: 700 }}>Visitors</Typography>
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.8,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                            border: '1.5px solid #fde68a',
                            boxShadow: '0 4px 0 #fde68a, 0 6px 16px rgba(245,158,11,0.06)',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                            VIP Visitors
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#b45309', mt: 0.2 }}>
                            {totalVip} <Typography component="span" variant="caption" sx={{ color: '#92400e', fontWeight: 700 }}>VIP</Typography>
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.8,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                            border: '1.5px solid #fecaca',
                            boxShadow: '0 4px 0 #fecaca, 0 6px 16px rgba(239,68,68,0.06)',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                            Duplicate / Denied
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#dc2626', mt: 0.2 }}>
                            {totalWarn} <Typography component="span" variant="caption" sx={{ color: '#991b1b', fontWeight: 700 }}>Tickets</Typography>
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.8,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                            border: '1.5px solid #bae6fd',
                            boxShadow: '0 4px 0 #bae6fd, 0 6px 16px rgba(2,132,199,0.06)',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                            Total Scans (Session)
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0284c7', mt: 0.2 }}>
                            {recentScans.length} <Typography component="span" variant="caption" sx={{ color: '#0369a1', fontWeight: 700 }}>Times</Typography>
                        </Typography>
                    </Paper>
                </Box>

                {/* 2-COLUMN STRICT SIDE-BY-SIDE GRID LAYOUT */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 3,
                        alignItems: 'start',
                        width: '100%',
                    }}
                >
                    {/* LEFT COLUMN: CAMERA SCANNER & HARDWARE GUN INPUT */}
                    <Box sx={{ width: '100%', minWidth: 0 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: '20px',
                                bgcolor: '#ffffff',
                                border: '1.5px solid #e2e8f0',
                                boxShadow: '0 4px 0 #e2e8f0, 0 12px 28px rgba(0,0,0,0.03)',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CameraAltIcon sx={{ color: '#094d42', fontSize: 20 }} />
                                    QR Code Camera Scanner
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    {scanning && (
                                        <Tooltip title="Switch Front / Rear Camera">
                                            <Button
                                                size="small"
                                                onClick={toggleCameraFacing}
                                                startIcon={<FlipCameraIosIcon />}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    color: '#0284c7',
                                                    bgcolor: '#f0f9ff',
                                                    border: '1px solid #bae6fd',
                                                    borderRadius: '8px',
                                                    py: 0.4,
                                                    px: 1.2,
                                                }}
                                            >
                                                {facingMode === 'environment' ? 'Rear Camera' : 'Front Camera'}
                                            </Button>
                                        </Tooltip>
                                    )}

                                    <Tooltip title={isPortrait ? "Beralih ke Tampilan Landscape (Melebar)" : "Beralih ke Tampilan Portrait (Tegak / Vertikal)"}>
                                        <Button
                                            size="small"
                                            onClick={toggleOrientation}
                                            startIcon={isPortrait ? <CropPortraitIcon /> : <ScreenRotationIcon />}
                                            sx={{
                                                textTransform: 'none',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                color: isPortrait ? '#065f46' : '#475569',
                                                bgcolor: isPortrait ? '#ecfdf5' : '#f8fafc',
                                                border: `1px solid ${isPortrait ? '#a7f3d0' : '#cbd5e1'}`,
                                                borderRadius: '8px',
                                                py: 0.4,
                                                px: 1.2,
                                                boxShadow: `0 1px 0 ${isPortrait ? '#a7f3d0' : '#cbd5e1'}`,
                                                '&:hover': {
                                                    bgcolor: isPortrait ? '#d1fae5' : '#f1f5f9',
                                                    transform: 'translateY(-1px)',
                                                },
                                                '&:active': { transform: 'translateY(1px)' },
                                            }}
                                        >
                                            {isPortrait ? '📱 Portrait' : '🖥️ Landscape'}
                                        </Button>
                                    </Tooltip>

                                    <Tooltip title="Buka Kamera Layar Penuh (Hanya Tampil Kamera Full)">
                                        <Button
                                            size="small"
                                            onClick={toggleFullscreen}
                                            startIcon={<FullscreenIcon />}
                                            sx={{
                                                textTransform: 'none',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                color: '#094d42',
                                                bgcolor: '#ecfdf5',
                                                border: '1px solid #a7f3d0',
                                                borderRadius: '8px',
                                                py: 0.4,
                                                px: 1.2,
                                                boxShadow: '0 1px 0 #a7f3d0',
                                                '&:hover': { bgcolor: '#d1fae5', transform: 'translateY(-1px)' },
                                                '&:active': { transform: 'translateY(1px)' },
                                            }}
                                        >
                                            Layar Penuh
                                        </Button>
                                    </Tooltip>
                                </Stack>
                            </Box>

                            {/* Camera Viewfinder Box (Switches seamlessly between Portrait / Landscape / Fullscreen) */}
                            <Box
                                onClick={handleViewfinderClick}
                                sx={{
                                    position: isFullscreen ? 'fixed' : 'relative',
                                    top: isFullscreen ? 0 : 'auto',
                                    left: isFullscreen ? 0 : 'auto',
                                    right: isFullscreen ? 0 : 'auto',
                                    bottom: isFullscreen ? 0 : 'auto',
                                    width: isFullscreen ? '100vw !important' : '100%',
                                    height: isFullscreen
                                        ? '100vh !important'
                                        : (isPortrait ? { xs: 450, sm: 500, md: 520 } : 280),
                                    maxHeight: isFullscreen
                                        ? '100vh !important'
                                        : (isPortrait ? { xs: 450, sm: 500, md: 520 } : 280),
                                    maxWidth: isFullscreen
                                        ? '100vw !important'
                                        : (isPortrait ? { xs: '100%', sm: 400, md: 440 } : '100%'),
                                    mx: isPortrait && !isFullscreen ? 'auto' : 0,
                                    zIndex: isFullscreen ? 999999 : 1,
                                    borderRadius: isFullscreen ? 0 : '16px',
                                    overflow: 'hidden',
                                    bgcolor: '#000000',
                                    border: isFullscreen ? 'none' : (scanPulse ? '3px solid #10b981' : '2px solid #334155'),
                                    boxShadow: isFullscreen ? 'none' : (scanPulse ? '0 0 25px rgba(16, 185, 129, 0.6), inset 0 2px 10px rgba(0,0,0,0.5)' : 'inset 0 2px 10px rgba(0,0,0,0.5)'),
                                    mb: isFullscreen ? 0 : 2.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    cursor: scanning ? 'crosshair' : 'default',
                                }}
                            >
                                <Box
                                    id="qr-reader"
                                    sx={{
                                        width: isFullscreen ? '100vw !important' : '100% !important',
                                        height: isFullscreen ? '100vh !important' : (isPortrait ? '100% !important' : '280px !important'),
                                        minHeight: isFullscreen ? '100vh !important' : (isPortrait ? '100% !important' : '280px !important'),
                                        '& video': {
                                            width: isFullscreen ? '100vw !important' : '100% !important',
                                            height: isFullscreen ? '100vh !important' : (isPortrait ? '100% !important' : '280px !important'),
                                            minHeight: isFullscreen ? '100vh !important' : (isPortrait ? '100% !important' : '280px !important'),
                                            objectFit: 'cover !important',
                                            display: 'block !important',
                                        },
                                        '& #qr-shaded-region': {
                                            display: 'none !important',
                                        },
                                        '& #qr-reader__scan_region': {
                                            width: isFullscreen ? '100vw !important' : '100% !important',
                                            height: isFullscreen ? '100vh !important' : (isPortrait ? '100% !important' : '280px !important'),
                                            minHeight: isFullscreen ? '100vh !important' : (isPortrait ? '100% !important' : '280px !important'),
                                            border: 'none !important',
                                            boxShadow: 'none !important',
                                        },
                                        '& #qr-reader__scan_region > div': {
                                            border: 'none !important',
                                            boxShadow: 'none !important',
                                        },
                                        '& #qr-reader__scan_region canvas': {
                                            display: 'none !important',
                                        },
                                        '& #qr-reader__scan_region video': {
                                            width: isFullscreen ? '100vw !important' : '100% !important',
                                            height: isFullscreen ? '100vh !important' : (isPortrait ? '100% !important' : '280px !important'),
                                            minHeight: isFullscreen ? '100vh !important' : (isPortrait ? '100% !important' : '280px !important'),
                                            objectFit: 'cover !important',
                                        },
                                        '& #qr-reader__dashboard_section_csr': {
                                            display: 'none !important',
                                        },
                                        '& #qr-reader__header_message': {
                                            display: 'none !important',
                                        },
                                        '& img': {
                                            display: 'none !important',
                                        },
                                    }}
                                />

                                {/* Interactive Tap-to-Focus Sonar Ring */}
                                {focusTapPoint && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: focusTapPoint.x,
                                            top: focusTapPoint.y,
                                            transform: 'translate(-50%, -50%)',
                                            pointerEvents: 'none',
                                            zIndex: 45,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: '50%',
                                                border: '2px solid #22d3ee',
                                                animation: 'aiFocusRing 0.8s ease-out forwards',
                                                boxShadow: '0 0 16px #22d3ee',
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: '#22d3ee',
                                                boxShadow: '0 0 8px #22d3ee',
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                position: 'absolute',
                                                top: 42,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                whiteSpace: 'nowrap',
                                                color: '#22d3ee',
                                                fontWeight: 900,
                                                fontSize: '0.7rem',
                                                textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                                                bgcolor: 'rgba(15,23,42,0.85)',
                                                px: 1,
                                                py: 0.3,
                                                borderRadius: '6px',
                                                border: '1px solid rgba(34,211,238,0.5)',
                                            }}
                                        >
                                            🎯 AI FOCUS LOCKED
                                        </Typography>
                                    </Box>
                                )}

                                {/* Normal Mode Badges (Top-Left AI Focus pill & Top-Right Fullscreen Expand) */}
                                {!isFullscreen && scanning && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 10,
                                            left: 10,
                                            zIndex: 10,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.6,
                                            bgcolor: 'rgba(15, 23, 42, 0.75)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(6, 182, 212, 0.4)',
                                            borderRadius: '20px',
                                            px: 1.2,
                                            py: 0.4,
                                            color: '#22d3ee',
                                        }}
                                    >
                                        <AutoAwesomeIcon sx={{ fontSize: 13, animation: 'spinPulse 3s linear infinite' }} />
                                        <Typography sx={{ fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.02em' }}>
                                            AI AUTO-FOKUS
                                        </Typography>
                                    </Box>
                                )}

                                {/* Floating Fullscreen Expand Button on Viewfinder Corner (Normal Mode Only) */}
                                {!isFullscreen && (
                                    <Tooltip title="Buka Kamera Layar Penuh">
                                        <IconButton
                                            onClick={toggleFullscreen}
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                zIndex: 10,
                                                bgcolor: 'rgba(15, 23, 42, 0.65)',
                                                backdropFilter: 'blur(8px)',
                                                color: '#ffffff',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                p: 0.8,
                                                '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.9)' },
                                            }}
                                        >
                                            <FullscreenIcon sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Tooltip>
                                )}

                                {!scanning && !isFullscreen && (
                                    <Box sx={{ position: 'absolute', textAlign: 'center', p: 3, color: '#94a3b8', zIndex: 2 }}>
                                        <QrCodeScannerIcon sx={{ fontSize: 52, color: '#475569', mb: 1 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#cbd5e1' }}>
                                            Camera Is Inactive
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            Click the green button or use USB Barcode Scanner Gun.
                                        </Typography>
                                    </Box>
                                )}

                                {/* ======================================================== */}
                                {/* FULLSCREEN HUD & OVERLAYS (ONLY SHOWN IN FULLSCREEN MODE) */}
                                {/* ======================================================== */}
                                {isFullscreen && (
                                    <>
                                        {/* TOP HUD BAR */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                zIndex: 50,
                                                p: { xs: 2, sm: 2.5 },
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
                                            }}
                                        >
                                            {/* Left Live Gate & AI Badges */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        bgcolor: 'rgba(255,255,255,0.12)',
                                                        backdropFilter: 'blur(12px)',
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                        borderRadius: '12px',
                                                        px: { xs: 1.5, sm: 2 },
                                                        py: 0.8,
                                                        color: '#ffffff',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%',
                                                            bgcolor: '#10b981',
                                                            mr: 1,
                                                            boxShadow: '0 0 10px #10b981',
                                                            animation: 'pulseGlow 1.5s infinite',
                                                        }}
                                                    />
                                                    <Typography sx={{ fontWeight: 900, fontSize: { xs: '0.78rem', sm: '0.88rem' }, letterSpacing: '0.02em' }}>
                                                        GATE {stationNumber} SCANNER
                                                    </Typography>
                                                </Box>

                                                {/* AI Auto-Focus Indicator Pill */}
                                                <Box
                                                    sx={{
                                                        display: { xs: 'none', sm: 'flex' },
                                                        alignItems: 'center',
                                                        bgcolor: aiAutoFocus ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.1)',
                                                        backdropFilter: 'blur(12px)',
                                                        border: `1px solid ${aiAutoFocus ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255,255,255,0.2)'}`,
                                                        borderRadius: '12px',
                                                        px: 1.5,
                                                        py: 0.8,
                                                        color: aiAutoFocus ? '#67e8f9' : '#94a3b8',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const next = !aiAutoFocus;
                                                        setAiAutoFocus(next);
                                                        localStorage.setItem('gate_scanner_ai_autofocus', String(next));
                                                        if (next) triggerHardwareFocus();
                                                    }}
                                                >
                                                    <AutoAwesomeIcon sx={{ fontSize: 16, mr: 0.6, color: aiAutoFocus ? '#22d3ee' : '#94a3b8' }} />
                                                    <Typography sx={{ fontWeight: 800, fontSize: '0.78rem' }}>
                                                        {aiAutoFocus ? 'AI Auto-Focus: ON' : 'AI Focus: OFF'}
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        display: { xs: 'none', md: 'flex' },
                                                        alignItems: 'center',
                                                        bgcolor: autoPrint ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
                                                        backdropFilter: 'blur(12px)',
                                                        border: `1px solid ${autoPrint ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.2)'}`,
                                                        borderRadius: '12px',
                                                        px: 1.5,
                                                        py: 0.8,
                                                        color: autoPrint ? '#6ee7b7' : '#94a3b8',
                                                    }}
                                                >
                                                    <BoltIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    <Typography sx={{ fontWeight: 800, fontSize: '0.78rem' }}>
                                                        {autoPrint ? 'Auto-Print ON' : 'Auto-Print OFF'}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Center Event Title */}
                                            <Typography
                                                sx={{
                                                    display: { xs: 'none', lg: 'block' },
                                                    color: 'rgba(255,255,255,0.7)',
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem',
                                                    letterSpacing: '0.02em',
                                                }}
                                            >
                                                55th PIT IAGI & GEOSEA XIX 2026 &bull; {eventVenue}
                                            </Typography>

                                            {/* Right Controls */}
                                            <Stack direction="row" spacing={1.2} alignItems="center">
                                                {/* Manual Refocus Trigger */}
                                                <Tooltip title="Trigger AI Auto-Focus Sekarang">
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setAiFocusStatus('LOCKING');
                                                            triggerHardwareFocus();
                                                            setTimeout(() => {
                                                                setAiFocusStatus('LOCKED');
                                                                setTimeout(() => setAiFocusStatus('ACTIVE'), 1000);
                                                            }, 500);
                                                        }}
                                                        sx={{
                                                            bgcolor: 'rgba(6, 182, 212, 0.25)',
                                                            backdropFilter: 'blur(12px)',
                                                            color: '#22d3ee',
                                                            border: '1px solid rgba(6, 182, 212, 0.4)',
                                                            borderRadius: '12px',
                                                            p: 1,
                                                            '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.4)' },
                                                        }}
                                                    >
                                                        <CenterFocusStrongIcon sx={{ fontSize: 20 }} />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Ganti Kamera Depan / Belakang">
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleCameraFacing();
                                                        }}
                                                        sx={{
                                                            bgcolor: 'rgba(255,255,255,0.15)',
                                                            backdropFilter: 'blur(12px)',
                                                            color: '#ffffff',
                                                            border: '1px solid rgba(255,255,255,0.25)',
                                                            borderRadius: '12px',
                                                            p: 1,
                                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                                                        }}
                                                    >
                                                        <FlipCameraIosIcon sx={{ fontSize: 20 }} />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title={isPortrait ? "Ganti ke Reticle Landscape (Melebar)" : "Ganti ke Reticle Portrait (Tegak / Vertikal)"}>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleOrientation();
                                                        }}
                                                        sx={{
                                                            bgcolor: isPortrait ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.15)',
                                                            backdropFilter: 'blur(12px)',
                                                            color: isPortrait ? '#34d399' : '#ffffff',
                                                            border: `1px solid ${isPortrait ? 'rgba(52, 211, 153, 0.5)' : 'rgba(255,255,255,0.25)'}`,
                                                            borderRadius: '12px',
                                                            p: 1,
                                                            '&:hover': { bgcolor: isPortrait ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.25)' },
                                                        }}
                                                    >
                                                        {isPortrait ? <StayCurrentPortraitIcon sx={{ fontSize: 20 }} /> : <CropPortraitIcon sx={{ fontSize: 20 }} />}
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title={soundEnabled ? 'Mute Suara Beep' : 'Nyalakan Suara Beep'}>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSoundEnabled(!soundEnabled);
                                                        }}
                                                        sx={{
                                                            bgcolor: 'rgba(255,255,255,0.15)',
                                                            backdropFilter: 'blur(12px)',
                                                            color: '#ffffff',
                                                            border: '1px solid rgba(255,255,255,0.25)',
                                                            borderRadius: '12px',
                                                            p: 1,
                                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                                                        }}
                                                    >
                                                        {soundEnabled ? <VolumeUpIcon sx={{ fontSize: 20 }} /> : <VolumeOffIcon sx={{ fontSize: 20 }} />}
                                                    </IconButton>
                                                </Tooltip>

                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        exitFullscreen();
                                                    }}
                                                    startIcon={<FullscreenExitIcon />}
                                                    sx={{
                                                        background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
                                                        color: '#ffffff',
                                                        fontWeight: 900,
                                                        fontSize: { xs: '0.75rem', sm: '0.82rem' },
                                                        textTransform: 'none',
                                                        borderRadius: '12px',
                                                        px: { xs: 1.5, sm: 2 },
                                                        py: 0.8,
                                                        boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                                                        border: '1px solid rgba(255,255,255,0.25)',
                                                        '&:hover': { background: '#dc2626' },
                                                    }}
                                                >
                                                    Keluar Layar Penuh (Esc)
                                                </Button>
                                            </Stack>
                                        </Box>

                                        {/* Center Reticle / Scan Frame with AI Auto-Focus Indicator */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: isPortrait ? { xs: 240, sm: 280, md: 320 } : { xs: 260, sm: 320, md: 360 },
                                                height: isPortrait ? { xs: 340, sm: 400, md: 460 } : { xs: 260, sm: 320, md: 360 },
                                                pointerEvents: 'none',
                                                zIndex: 40,
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            {/* AI Auto-Focus Status Badge above Frame */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: -42,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.8,
                                                    bgcolor: 'rgba(15, 23, 42, 0.85)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: `1.5px solid ${aiFocusStatus === 'LOCKING' ? '#f59e0b' : '#06b6d4'}`,
                                                    borderRadius: '20px',
                                                    px: 1.6,
                                                    py: 0.4,
                                                    boxShadow: '0 0 14px rgba(6, 182, 212, 0.35)',
                                                }}
                                            >
                                                <AutoAwesomeIcon sx={{ fontSize: 14, color: aiFocusStatus === 'LOCKING' ? '#fbbf24' : '#22d3ee', animation: 'spinPulse 3s linear infinite' }} />
                                                <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                                                    AI AUTO-FOKUS {aiFocusStatus === 'LOCKING' ? 'MENGUNCI FOKUS...' : aiFocusStatus === 'LOCKED' ? 'TERKUNCI 100%' : 'AKTIF'}
                                                </Typography>
                                                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: aiFocusStatus === 'LOCKING' ? '#f59e0b' : '#10b981', boxShadow: '0 0 8px #10b981' }} />
                                            </Box>

                                            {/* 4 Corner Markers */}
                                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTop: `4px solid ${aiFocusStatus === 'LOCKING' ? '#f59e0b' : '#10b981'}`, borderLeft: `4px solid ${aiFocusStatus === 'LOCKING' ? '#f59e0b' : '#10b981'}`, borderRadius: '4px 0 0 0', filter: 'drop-shadow(0 0 8px #10b981)', transition: 'border-color 0.2s ease' }} />
                                            <Box sx={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTop: `4px solid ${aiFocusStatus === 'LOCKING' ? '#f59e0b' : '#10b981'}`, borderRight: `4px solid ${aiFocusStatus === 'LOCKING' ? '#f59e0b' : '#10b981'}`, borderRadius: '0 4px 0 0', filter: 'drop-shadow(0 0 8px #10b981)', transition: 'border-color 0.2s ease' }} />
                                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottom: `4px solid ${aiFocusStatus === 'LOCKING' ? '#f59e0b' : '#10b981'}`, borderLeft: `4px solid ${aiFocusStatus === 'LOCKING' ? '#f59e0b' : '#10b981'}`, borderRadius: '0 0 0 4px', filter: 'drop-shadow(0 0 8px #10b981)', transition: 'border-color 0.2s ease' }} />
                                            <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottom: `4px solid ${aiFocusStatus === 'LOCKING' ? '#f59e0b' : '#10b981'}`, borderRight: `4px solid ${aiFocusStatus === 'LOCKING' ? '#f59e0b' : '#10b981'}`, borderRadius: '0 0 4px 0', filter: 'drop-shadow(0 0 8px #10b981)', transition: 'border-color 0.2s ease' }} />

                                            {/* Center Crosshair Aim */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    width: 24,
                                                    height: 24,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    animation: 'crosshairPulse 2s ease-in-out infinite',
                                                }}
                                            >
                                                <Box sx={{ position: 'absolute', width: 24, height: '1.5px', bgcolor: 'rgba(34, 211, 238, 0.7)' }} />
                                                <Box sx={{ position: 'absolute', height: 24, width: '1.5px', bgcolor: 'rgba(34, 211, 238, 0.7)' }} />
                                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#22d3ee', boxShadow: '0 0 6px #22d3ee' }} />
                                            </Box>

                                            {/* Animated Laser Scanning Line */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    left: '4%',
                                                    width: '92%',
                                                    height: '3px',
                                                    background: 'linear-gradient(90deg, transparent, #34d399, #10b981, #34d399, transparent)',
                                                    boxShadow: '0 0 16px #10b981, 0 0 30px #34d399',
                                                    animation: 'scanLaserLine 2.6s ease-in-out infinite',
                                                }}
                                            />

                                            {/* Instruction Text below frame */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: -56,
                                                    left: -60,
                                                    right: -60,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: '#ffffff',
                                                        fontWeight: 800,
                                                        fontSize: { xs: '0.82rem', sm: '0.95rem' },
                                                        textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.9)',
                                                    }}
                                                >
                                                    Arahkan QR Code Tiket ke dalam Kotak
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: '#67e8f9',
                                                        fontWeight: 700,
                                                        fontSize: '0.72rem',
                                                        textShadow: '0 2px 6px rgba(0,0,0,0.8)',
                                                        mt: 0.3,
                                                    }}
                                                >
                                                    🎯 Ketuk layar di mana saja untuk Auto-Fokus manual
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Inactive Fallback Button while in Fullscreen */}
                                        {!scanning && (
                                            <Box sx={{ position: 'absolute', textAlign: 'center', p: 3, zIndex: 45, bgcolor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                <Typography sx={{ color: '#fff', fontWeight: 800, mb: 1.5 }}>
                                                    Kamera Sedang Tidak Aktif
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => startCamera(selectedCameraId || null)}
                                                    startIcon={<CameraAltIcon />}
                                                    sx={{ bgcolor: '#10b981', color: '#fff', fontWeight: 800, textTransform: 'none', borderRadius: '10px' }}
                                                >
                                                    Mulai Kamera
                                                </Button>
                                            </Box>
                                        )}

                                        {/* Floating Scan Result Toast / Card (Bottom HUD) */}
                                        {fullscreenToastVisible && scanResult && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: { xs: 20, sm: 30 },
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    zIndex: 60,
                                                    width: '92%',
                                                    maxWidth: 540,
                                                    bgcolor: 'rgba(15, 23, 42, 0.94)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: `2px solid ${
                                                        scanResult.success
                                                            ? '#10b981'
                                                            : scanResult.status === 'already_checked_in'
                                                                ? '#f59e0b'
                                                                : '#ef4444'
                                                    }`,
                                                    borderRadius: '20px',
                                                    boxShadow: '0 25px 50px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.4)',
                                                    p: { xs: 2, sm: 2.5 },
                                                    color: '#ffffff',
                                                    animation: 'slideUpToast 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {scanResult.success ? (
                                                            <CheckCircleIcon sx={{ fontSize: 24, color: '#10b981' }} />
                                                        ) : scanResult.status === 'already_checked_in' ? (
                                                            <WarningAmberIcon sx={{ fontSize: 24, color: '#f59e0b' }} />
                                                        ) : (
                                                            <ErrorOutlineIcon sx={{ fontSize: 24, color: '#ef4444' }} />
                                                        )}
                                                        <Typography sx={{ fontWeight: 900, fontSize: '0.92rem', color: scanResult.success ? '#34d399' : scanResult.status === 'already_checked_in' ? '#fbbf24' : '#f87171' }}>
                                                            {scanResult.success ? 'CHECK-IN BERHASIL! 🎟️' : scanResult.status === 'already_checked_in' ? 'SUDAH CHECK-IN SEBELUMNYA' : 'CHECK-IN GAGAL'}
                                                        </Typography>
                                                    </Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setFullscreenToastVisible(false)}
                                                        sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ffffff' } }}
                                                    >
                                                        <CloseIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Box>

                                                {scanResult.ticket && (
                                                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '12px', p: 1.5, my: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
                                                            <Chip
                                                                label={getCategoryMeta(scanResult.ticket.visitor_type).label}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: getCategoryMeta(scanResult.ticket.visitor_type).bg,
                                                                    color: getCategoryMeta(scanResult.ticket.visitor_type).color,
                                                                    fontWeight: 900,
                                                                    fontSize: '0.7rem',
                                                                    height: 22,
                                                                }}
                                                            />
                                                            <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '0.85rem', color: '#6ee7b7' }}>
                                                                {scanResult.ticket.ticket_code}
                                                            </Typography>
                                                        </Box>
                                                        <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', mb: 0.2 }}>
                                                            {scanResult.ticket.visitor_name}
                                                        </Typography>
                                                        {scanResult.ticket.visitor_institution && (
                                                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600 }}>
                                                                {scanResult.ticket.visitor_institution}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                )}

                                                {autoPrint && scanResult.success && (
                                                    <Typography sx={{ color: '#6ee7b7', fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', mt: 0.5 }}>
                                                        ⚡ Sedang Mencetak Lanyard Badge Otomatis...
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>

                            {cameraError && (
                                <Alert 
                                    severity={cameraError.includes('PERMISSION_DENIED') ? 'warning' : 'error'} 
                                    sx={{ 
                                        mb: 2, 
                                        borderRadius: '12px', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 600,
                                        '& .MuiAlert-message': { width: '100%' }
                                    }}
                                    action={
                                        <Button 
                                            color="inherit" 
                                            size="small" 
                                            onClick={() => {
                                                setCameraError(null);
                                                startCamera();
                                            }}
                                            sx={{ fontWeight: 800, textTransform: 'none', border: '1px solid rgba(0,0,0,0.2)', borderRadius: '8px', px: 1.5, ml: 1 }}
                                        >
                                            Coba Lagi
                                        </Button>
                                    }
                                >
                                    {cameraError.includes('PERMISSION_DENIED') ? (
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5, color: '#92400e' }}>
                                                🔒 Izin Kamera Ditolak oleh Sistem / Browser
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'block', color: '#78350f', mb: 0.5, lineHeight: 1.4 }}>
                                                <strong>1. Pengguna Mac:</strong> Buka <em>System Settings &gt; Privacy &amp; Security &gt; Camera</em>, pastikan <strong>Google Chrome</strong> posisi ON.
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'block', color: '#78350f', mb: 0.5, lineHeight: 1.4 }}>
                                                <strong>2. Browser:</strong> Klik ikon pengaturan di samping <code>https://pitiagi.cloud</code> &gt; Izinkan Kamera.
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'block', color: '#047857', fontWeight: 700, mt: 0.5, lineHeight: 1.4 }}>
                                                ⚡ <strong>Untuk Hari-H Acara:</strong> Cukup colok <strong>USB Barcode Scanner Gun</strong> (alat tembak) — bisa scan &amp; cetak langsung tanpa perlu kamera sama sekali! Atau buka di browser HP (Android / iOS).
                                            </Typography>
                                        </Box>
                                    ) : (
                                        cameraError
                                    )}
                                </Alert>
                            )}

                            {/* 3D Pushable Camera Control Button */}
                            <Box sx={{ mb: 2.5 }}>
                                {!scanning ? (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<CameraAltIcon />}
                                        onClick={() => startCamera(selectedCameraId || null)}
                                        sx={{
                                            background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                                            color: '#ffffff',
                                            fontWeight: 900,
                                            fontSize: '0.9rem',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            py: 1.3,
                                            boxShadow: '0 4px 0 #047857, 0 8px 20px rgba(16, 185, 129, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(180deg, #34d399 0%, #047857 100%)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 5px 0 #047857, 0 10px 22px rgba(16, 185, 129, 0.4)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(3px)',
                                                boxShadow: '0 1px 0 #047857',
                                            },
                                            transition: 'all 0.12s ease',
                                        }}
                                    >
                                        Start Scanner Camera
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color="error"
                                        startIcon={<StopIcon />}
                                        onClick={stopCamera}
                                        sx={{
                                            background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
                                            color: '#ffffff',
                                            fontWeight: 900,
                                            fontSize: '0.9rem',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            py: 1.3,
                                            boxShadow: '0 4px 0 #991b1b, 0 8px 20px rgba(239, 68, 68, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(180deg, #f87171 0%, #991b1b 100%)',
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(3px)',
                                                boxShadow: '0 1px 0 #991b1b',
                                            },
                                            transition: 'all 0.12s ease',
                                        }}
                                    >
                                        Stop Camera
                                    </Button>
                                )}
                            </Box>

                            <Divider sx={{ my: 2 }}>
                                <Chip label="USB SCANNER GUN / MANUAL CODE" size="small" sx={{ fontSize: '0.68rem', fontWeight: 800, bgcolor: '#f1f5f9', color: '#64748b' }} />
                            </Divider>

                            {/* 3D Manual & Hardware Gun Input Form */}
                            <form onSubmit={handleManualSubmit}>
                                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                    <TextField
                                        inputRef={inputRef}
                                        placeholder="Scan with Gun or Type (e.g. TKT-IPRO-26-XXXX)"
                                        value={manualCode}
                                        onChange={(e) => setManualCode(e.target.value)}
                                        size="small"
                                        fullWidth
                                        autoFocus
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: '#f8fafc',
                                                borderRadius: '12px',
                                                fontSize: '0.85rem',
                                                fontFamily: 'monospace',
                                                fontWeight: 800,
                                            },
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing || !manualCode.trim()}
                                        sx={{
                                            background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                                            color: '#ffffff',
                                            fontWeight: 900,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            px: 3,
                                            boxShadow: '0 3px 0 #075985',
                                            '&:hover': { bgcolor: '#0369a1', transform: 'translateY(-1px)' },
                                            '&:active': { transform: 'translateY(2px)', boxShadow: '0 1px 0 #075985' },
                                        }}
                                    >
                                        {processing ? <CircularProgress size={18} color="inherit" /> : 'Check'}
                                    </Button>
                                </Stack>
                            </form>
                        </Paper>
                    </Box>

                    {/* RIGHT COLUMN: REALTIME SCAN RESULT & LANYARD BADGE PRINT */}
                    <Box sx={{ width: '100%', minWidth: 0 }}>
                        {scanResult ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '20px',
                                    bgcolor: scanResult.success
                                        ? '#f0fdf4'
                                        : scanResult.status === 'already_checked_in'
                                            ? '#fffbeb'
                                            : '#fef2f2',
                                    border: `2px solid ${
                                        scanResult.success
                                            ? '#86efac'
                                            : scanResult.status === 'already_checked_in'
                                                ? '#fde68a'
                                                : '#fecaca'
                                    }`,
                                    boxShadow: `0 4px 0 ${
                                        scanResult.success
                                            ? '#86efac'
                                            : scanResult.status === 'already_checked_in'
                                                ? '#fde68a'
                                                : '#fecaca'
                                    }, 0 12px 28px rgba(0,0,0,0.04)`,
                                    p: 3,
                                    textAlign: 'center',
                                    mb: 3,
                                }}
                            >
                                <Box sx={{ mb: 1.5 }}>
                                    {scanResult.success ? (
                                        <CheckCircleIcon sx={{ fontSize: 60, color: '#16a34a' }} />
                                    ) : scanResult.status === 'already_checked_in' ? (
                                        <WarningAmberIcon sx={{ fontSize: 60, color: '#d97706' }} />
                                    ) : (
                                        <ErrorOutlineIcon sx={{ fontSize: 60, color: '#dc2626' }} />
                                    )}
                                </Box>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 900,
                                        color: scanResult.success ? '#166534' : scanResult.status === 'already_checked_in' ? '#92400e' : '#991b1b',
                                        mb: 0.5,
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    {scanResult.success ? 'CHECK-IN SUCCESSFUL! 🎟️' : scanResult.status === 'already_checked_in' ? 'ALREADY CHECKED IN' : 'CHECK-IN FAILED'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, mb: 2.5 }}>
                                    {scanResult.message}
                                </Typography>

                                {scanResult.ticket && (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            bgcolor: '#ffffff',
                                            borderRadius: '16px',
                                            border: '1.5px solid #e2e8f0',
                                            textAlign: 'left',
                                            mb: 2.5,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                            <Chip
                                                icon={scanResult.ticket.visitor_type === 'exclusive' ? <StarIcon sx={{ fontSize: 13, color: '#92400e !important' }} /> : undefined}
                                                label={getCategoryMeta(scanResult.ticket.visitor_type).label}
                                                size="small"
                                                sx={{
                                                    bgcolor: getCategoryMeta(scanResult.ticket.visitor_type).bg,
                                                    color: getCategoryMeta(scanResult.ticket.visitor_type).color,
                                                    border: `1px solid ${getCategoryMeta(scanResult.ticket.visitor_type).border}`,
                                                    fontWeight: 900,
                                                    fontSize: '0.72rem',
                                                    height: 24,
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ color: '#094d42', fontFamily: 'monospace', fontWeight: 900 }}>
                                                {scanResult.ticket.ticket_code}
                                            </Typography>
                                        </Box>

                                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.15rem' }}>
                                            {scanResult.ticket.visitor_name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.4 }}>
                                            <EmailIcon sx={{ fontSize: 15 }} /> {scanResult.ticket.visitor_email}
                                        </Typography>

                                        {scanResult.ticket.visitor_institution && (
                                            <Typography variant="body2" sx={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.4 }}>
                                                <BusinessIcon sx={{ fontSize: 15 }} /> {scanResult.ticket.visitor_institution}
                                            </Typography>
                                        )}
                                    </Paper>
                                )}

                                {/* Auto-Print Status Banner */}
                                {autoPrint && scanResult.success && (
                                    <Box sx={{ mb: 1.5, p: 1.2, bgcolor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', textAlign: 'center' }}>
                                        <Typography sx={{ color: '#047857', fontWeight: 800, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8 }}>
                                            <BoltIcon sx={{ fontSize: 16 }} /> Auto-Print aktif: Perintah cetak badge telah dikirim ke printer.
                                        </Typography>
                                    </Box>
                                )}

                                {/* Action: Trigger Print Lanyard Card */}
                                {scanResult.ticket && (
                                    <Button
                                        component="a"
                                        href={route('admin.visitorTickets.printBadge', scanResult.ticket.id)}
                                        target="_blank"
                                        variant="contained"
                                        fullWidth
                                        startIcon={<PrintIcon />}
                                        sx={{
                                            background: 'linear-gradient(180deg, #094d42 0%, #06352e 100%)',
                                            color: '#ffffff',
                                            fontWeight: 900,
                                            fontSize: '0.88rem',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            py: 1.3,
                                            boxShadow: '0 4px 0 #04221d',
                                            '&:hover': { transform: 'translateY(-1px)' },
                                            '&:active': { transform: 'translateY(2px)' },
                                        }}
                                    >
                                        🖨️ Print Lanyard Badge ({getCategoryMeta(scanResult.ticket.visitor_type).shortLabel})
                                    </Button>
                                )}
                            </Paper>
                        ) : (
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '20px',
                                    bgcolor: '#ffffff',
                                    border: '2px dashed #cbd5e1',
                                    p: 4.5,
                                    textAlign: 'center',
                                    mb: 3,
                                }}
                            >
                                <QrCodeScannerIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#475569', mb: 0.5 }}>
                                    Waiting for QR Code Scan...
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    Point the camera or use USB Barcode Gun to instantly check in and print badge.
                                </Typography>
                            </Paper>
                        )}

                        {/* RECENT SCANS SESSION LIST (PROFESSIONAL UNIQUE ATTENDEES LOG) */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: '20px',
                                bgcolor: '#ffffff',
                                border: '1.5px solid #e2e8f0',
                                boxShadow: '0 4px 0 #e2e8f0, 0 12px 28px rgba(0,0,0,0.03)',
                                p: { xs: 2, sm: 2.5 },
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HowToRegIcon sx={{ color: '#0284c7', fontSize: 20 }} />
                                        Recent Scans in this Session ({recentScans.length})
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                        Unique attendees verified at Gate {stationNumber}
                                    </Typography>
                                </Box>
                                {recentScans.length > 0 && (
                                    <Button
                                        size="small"
                                        onClick={() => setRecentScans([])}
                                        startIcon={<DeleteSweepIcon />}
                                        sx={{
                                            color: '#64748b',
                                            fontSize: '0.75rem',
                                            textTransform: 'none',
                                            fontWeight: 800,
                                            bgcolor: '#f1f5f9',
                                            borderRadius: '8px',
                                            px: 1.5,
                                            '&:hover': { bgcolor: '#e2e8f0', color: '#dc2626' },
                                        }}
                                    >
                                        Clear History
                                    </Button>
                                )}
                            </Box>

                            {recentScans.length === 0 ? (
                                <Box sx={{ py: 4, textAlign: 'center', color: '#94a3b8', bgcolor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                                    <HowToRegIcon sx={{ fontSize: 36, color: '#cbd5e1', mb: 0.5 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b', display: 'block' }}>No Attendees Scanned Yet</Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Point camera or use barcode gun to see instant scan history here.</Typography>
                                </Box>
                            ) : (
                                <Stack spacing={1.2}>
                                    {recentScans.map((r, i) => {
                                        const meta = getCategoryMeta(r.ticket?.visitor_type);
                                        const isSuccess = r.status === 'success';
                                        const isAlready = r.status === 'already_checked_in';

                                        return (
                                            <Paper
                                                key={r.ticket?.ticket_code || i}
                                                elevation={0}
                                                sx={{
                                                    p: 1.6,
                                                    bgcolor: isSuccess ? '#f0fdf4' : isAlready ? '#fffbeb' : '#fef2f2',
                                                    border: `1.5px solid ${isSuccess ? '#86efac' : isAlready ? '#fde68a' : '#fecaca'}`,
                                                    borderRadius: '14px',
                                                    display: 'flex',
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                    justifyContent: 'space-between',
                                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                                    gap: 1.5,
                                                    transition: 'all 0.15s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                    },
                                                }}
                                            >
                                                {/* Attendee Info */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                                    <Box
                                                        sx={{
                                                            width: 38,
                                                            height: 38,
                                                            borderRadius: '10px',
                                                            bgcolor: isSuccess ? '#dcfce7' : isAlready ? '#fef3c7' : '#fee2e2',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {isSuccess ? (
                                                            <CheckCircleIcon sx={{ fontSize: 22, color: '#16a34a' }} />
                                                        ) : isAlready ? (
                                                            <WarningAmberIcon sx={{ fontSize: 22, color: '#d97706' }} />
                                                        ) : (
                                                            <ErrorOutlineIcon sx={{ fontSize: 22, color: '#dc2626' }} />
                                                        )}
                                                    </Box>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                            <Typography variant="body1" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.92rem' }}>
                                                                {r.ticket?.visitor_name || 'Unknown Attendee'}
                                                            </Typography>
                                                            <Chip
                                                                label={meta.shortLabel}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: meta.bg,
                                                                    color: meta.color,
                                                                    border: `1px solid ${meta.border}`,
                                                                    fontWeight: 900,
                                                                    fontSize: '0.65rem',
                                                                    height: 20,
                                                                }}
                                                            />
                                                            {isAlready && (
                                                                <Chip
                                                                    label="ALREADY IN"
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: '#fef3c7',
                                                                        color: '#b45309',
                                                                        border: '1px solid #fde68a',
                                                                        fontWeight: 800,
                                                                        fontSize: '0.62rem',
                                                                        height: 20,
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap', mt: 0.3 }}>
                                                            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#094d42' }}>{r.ticket?.ticket_code}</span>
                                                            {r.ticket?.visitor_institution && (
                                                                <span>&bull; {r.ticket?.visitor_institution}</span>
                                                            )}
                                                            <span>&bull; Scanned at {r.timestamp}</span>
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Action button */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                                                    {r.ticket?.id && (
                                                        <Button
                                                            component="a"
                                                            href={route('admin.visitorTickets.printBadge', r.ticket.id)}
                                                            target="_blank"
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<PrintIcon sx={{ fontSize: 15 }} />}
                                                            sx={{
                                                                color: '#094d42',
                                                                borderColor: '#a7f3d0',
                                                                bgcolor: '#ffffff',
                                                                fontWeight: 800,
                                                                fontSize: '0.72rem',
                                                                textTransform: 'none',
                                                                borderRadius: '8px',
                                                                px: 1.5,
                                                                py: 0.4,
                                                                '&:hover': {
                                                                    bgcolor: '#094d42',
                                                                    color: '#ffffff',
                                                                    borderColor: '#094d42',
                                                                },
                                                            }}
                                                        >
                                                            Print Badge
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Paper>
                                        );
                                    })}
                                </Stack>
                            )}
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
