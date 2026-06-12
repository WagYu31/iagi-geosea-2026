import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Box, Typography, Button, IconButton, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TouchAppIcon from '@mui/icons-material/TouchApp';

/**
 * CoachMark - Premium Guided Tour Component (Responsive)
 *
 * Usage:
 * <CoachMark
 *   tourId="submissions-tour"
 *   steps={[
 *     { target: '#new-submission-btn', title: 'New Submission', description: 'Click here to submit your paper', position: 'bottom' },
 *   ]}
 * />
 */
export default function CoachMark({ tourId, steps = [], onComplete }) {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const [spotlightRect, setSpotlightRect] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const tooltipRef = useRef(null);
    const resizeTimer = useRef(null);

    // Responsive breakpoints
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(min-width:601px) and (max-width:960px)');

    // Tooltip dimensions based on screen size
    const getTooltipWidth = () => {
        if (isMobile) return Math.min(280, window.innerWidth - 32);
        if (isTablet) return 320;
        return 360;
    };

    // Always show tour on every page load
    useEffect(() => {
        if (steps.length > 0) {
            const timer = setTimeout(() => {
                setIsActive(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [steps.length]);

    // Calculate target element position
    const updatePosition = useCallback(() => {
        if (!isActive || currentStep >= steps.length) return;

        const step = steps[currentStep];
        const el = document.querySelector(step.target);
        const tooltipWidth = getTooltipWidth();

        if (!el) {
            setSpotlightRect(null);
            setTooltipPos({
                top: window.innerHeight / 2 - 100,
                left: window.innerWidth / 2 - tooltipWidth / 2,
            });
            return;
        }

        const rect = el.getBoundingClientRect();
        const padding = isMobile ? 6 : 10;

        setSpotlightRect({
            top: rect.top - padding,
            left: rect.left - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
            borderRadius: 14,
        });

        // Calculate tooltip position
        const tooltipHeight = isMobile ? 200 : 220;
        const gap = isMobile ? 12 : 18;
        const pos = step.position || 'bottom';

        let top, left;

        // On mobile, always position bottom or top (avoid left/right)
        const effectivePos = isMobile ? (pos === 'left' || pos === 'right' ? 'bottom' : pos) : pos;

        switch (effectivePos) {
            case 'top':
                top = rect.top - tooltipHeight - gap;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
                break;
            case 'bottom':
                top = rect.bottom + gap;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
                break;
            case 'left':
                top = rect.top + rect.height / 2 - tooltipHeight / 2;
                left = rect.left - tooltipWidth - gap;
                break;
            case 'right':
                top = rect.top + rect.height / 2 - tooltipHeight / 2;
                left = rect.right + gap;
                break;
            default:
                top = rect.bottom + gap;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
        }

        // Boundary checks
        const margin = isMobile ? 8 : 16;
        if (left < margin) left = margin;
        if (left + tooltipWidth > window.innerWidth - margin) left = window.innerWidth - tooltipWidth - margin;
        if (top < margin) top = rect.bottom + gap;
        if (top + tooltipHeight > window.innerHeight - margin) top = rect.top - tooltipHeight - gap;

        setTooltipPos({ top, left });
    }, [isActive, currentStep, steps, isMobile, isTablet]);

    useEffect(() => {
        if (!isActive) return;

        updatePosition();

        const step = steps[currentStep];
        if (step) {
            const el = document.querySelector(step.target);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(updatePosition, 400);
            }
        }

        const handleResize = () => {
            if (resizeTimer.current) clearTimeout(resizeTimer.current);
            resizeTimer.current = setTimeout(updatePosition, 100);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isActive, currentStep, updatePosition]);

    const goNext = () => {
        if (currentStep < steps.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsAnimating(false);
            }, 250);
        } else {
            completeTour();
        }
    };

    const goPrev = () => {
        if (currentStep > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev - 1);
                setIsAnimating(false);
            }, 250);
        }
    };

    const completeTour = () => {
        setIsActive(false);
        onComplete?.();
    };

    const skipTour = () => {
        setIsActive(false);
    };

    if (!isActive || steps.length === 0) return null;

    const step = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;
    const isLastStep = currentStep === steps.length - 1;
    const tooltipWidth = getTooltipWidth();

    return createPortal(
        <>
            {/* Overlay */}
            <Box
                sx={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9998,
                    bgcolor: 'rgba(0, 0, 0, 0.45)',
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* Spotlight cutout */}
            {spotlightRect && (
                <Box
                    onClick={() => {
                        const step = steps[currentStep];
                        const el = document.querySelector(step.target);
                        setIsActive(false);
                        setTimeout(() => {
                            if (el) el.click();
                        }, 150);
                    }}
                    sx={{
                        position: 'fixed',
                        top: spotlightRect.top,
                        left: spotlightRect.left,
                        width: spotlightRect.width,
                        height: spotlightRect.height,
                        zIndex: 9999,
                        borderRadius: `${spotlightRect.borderRadius}px`,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                        border: '2px solid rgba(16, 185, 129, 0.7)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: -6,
                            borderRadius: `${spotlightRect.borderRadius + 6}px`,
                            border: '1.5px dashed rgba(16, 185, 129, 0.35)',
                            animation: 'coachPulseOuter 2.5s ease-in-out infinite',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: -3,
                            borderRadius: `${spotlightRect.borderRadius + 3}px`,
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.08))',
                            animation: 'coachGlow 2s ease-in-out infinite',
                        },
                        '@keyframes coachPulseOuter': {
                            '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                            '50%': { opacity: 0.8, transform: 'scale(1.01)' },
                        },
                        '@keyframes coachGlow': {
                            '0%, 100%': { opacity: 0 },
                            '50%': { opacity: 1 },
                        },
                    }}
                />
            )}

            {/* Click hint on spotlight */}
            {spotlightRect && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: spotlightRect.top + spotlightRect.height - 12,
                        left: spotlightRect.left + spotlightRect.width - 12,
                        zIndex: 10001,
                        pointerEvents: 'none',
                        animation: 'clickBounce 1.5s ease-in-out infinite',
                        '@keyframes clickBounce': {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-4px)' },
                        },
                    }}
                >
                    <Box sx={{
                        width: 24, height: 24,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.5)',
                    }}>
                        <TouchAppIcon sx={{ color: '#fff', fontSize: 14 }} />
                    </Box>
                </Box>
            )}

            {/* Premium Tooltip */}
            <Box
                ref={tooltipRef}
                sx={{
                    position: 'fixed',
                    top: tooltipPos.top,
                    left: tooltipPos.left,
                    zIndex: 10000,
                    width: tooltipWidth,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.97), rgba(248,250,252,0.95))',
                    borderRadius: { xs: '14px', md: '18px' },
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(16, 185, 129, 0.12), 0 0 40px rgba(16, 185, 129, 0.06)',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: isAnimating ? 0 : 1,
                    transform: isAnimating ? 'translateY(10px) scale(0.96)' : 'translateY(0) scale(1)',
                }}
            >
                {/* Gradient accent bar */}
                <Box sx={{
                    height: { xs: 3, md: 4 },
                    background: `linear-gradient(90deg, #059669 0%, #10b981 ${progress}%, #e5e7eb ${progress}%)`,
                    transition: 'background 0.5s ease',
                }} />

                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: 1.5, md: 2.5 },
                    pt: { xs: 1.2, md: 1.8 },
                    pb: { xs: 0.3, md: 0.5 },
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, md: 1 } }}>
                        <Box sx={{
                            width: { xs: 26, md: 32 },
                            height: { xs: 26, md: 32 },
                            borderRadius: { xs: '8px', md: '10px' },
                            background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #06b6d4 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 3px 12px rgba(5, 150, 105, 0.3)',
                        }}>
                            <AutoAwesomeIcon sx={{ color: '#fff', fontSize: { xs: 14, md: 17 } }} />
                        </Box>
                        <Box>
                            <Typography sx={{
                                fontSize: { xs: '0.6rem', md: '0.68rem' },
                                fontWeight: 800,
                                color: '#059669',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                lineHeight: 1,
                            }}>
                                Guided Tour
                            </Typography>
                            <Typography sx={{
                                fontSize: { xs: '0.55rem', md: '0.6rem' },
                                fontWeight: 500,
                                color: '#9ca3af',
                                lineHeight: 1.2,
                                mt: 0.2,
                            }}>
                                {currentStep + 1} / {steps.length}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={skipTour}
                        sx={{
                            color: '#9ca3af',
                            width: { xs: 28, md: 32 },
                            height: { xs: 28, md: 32 },
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.2s',
                            '&:hover': { color: '#374151', bgcolor: '#f3f4f6', borderColor: '#d1d5db' },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ px: { xs: 1.5, md: 2.5 }, pb: { xs: 1.2, md: 1.5 }, pt: { xs: 0.5, md: 0.8 } }}>
                    <Typography sx={{
                        fontWeight: 800,
                        fontSize: { xs: '0.9rem', md: '1.05rem' },
                        color: '#111827',
                        mb: { xs: 0.3, md: 0.5 },
                        lineHeight: 1.3,
                        letterSpacing: '-0.01em',
                    }}>
                        {step.title}
                    </Typography>
                    <Typography sx={{
                        fontSize: { xs: '0.75rem', md: '0.82rem' },
                        color: '#6b7280',
                        lineHeight: 1.55,
                        letterSpacing: '0.005em',
                    }}>
                        {step.description}
                    </Typography>
                </Box>

                {/* Dot navigation + actions */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: 1.5, md: 2.5 },
                    py: { xs: 1.2, md: 1.5 },
                    bgcolor: 'rgba(249, 250, 251, 0.8)',
                    borderTop: '1px solid rgba(229, 231, 235, 0.6)',
                }}>
                    {/* Left: Skip + dot nav */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                        <Button
                            size="small"
                            onClick={skipTour}
                            sx={{
                                color: '#9ca3af',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: { xs: '0.68rem', md: '0.75rem' },
                                minWidth: 'auto',
                                px: { xs: 0.5, md: 1 },
                                '&:hover': { color: '#6b7280', bgcolor: 'transparent' },
                            }}
                        >
                            Skip
                        </Button>

                        {/* Dot navigation */}
                        {!isMobile && (
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                {steps.map((_, idx) => (
                                    <Box
                                        key={idx}
                                        sx={{
                                            width: idx === currentStep ? 16 : 6,
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: idx === currentStep
                                                ? '#10b981'
                                                : idx < currentStep ? '#a7f3d0' : '#e5e7eb',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Right: Nav buttons */}
                    <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 0.8 } }}>
                        {currentStep > 0 && (
                            <IconButton
                                size="small"
                                onClick={goPrev}
                                sx={{
                                    width: { xs: 30, md: 34 },
                                    height: { xs: 30, md: 34 },
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    color: '#6b7280',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: '#f3f4f6', borderColor: '#d1d5db' },
                                }}
                            >
                                <ArrowBackIosNewIcon sx={{ fontSize: { xs: 12, md: 14 } }} />
                            </IconButton>
                        )}
                        <Button
                            size="small"
                            variant="contained"
                            onClick={goNext}
                            endIcon={isLastStep
                                ? <CheckCircleOutlineIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                                : <ArrowForwardIosIcon sx={{ fontSize: { xs: 10, md: 12 } }} />
                            }
                            sx={{
                                background: isLastStep
                                    ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                                    : 'linear-gradient(135deg, #0f766e 0%, #10b981 50%, #06b6d4 100%)',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: { xs: '0.7rem', md: '0.78rem' },
                                borderRadius: '10px',
                                px: { xs: 1.5, md: 2.2 },
                                py: { xs: 0.5, md: 0.7 },
                                minHeight: { xs: 30, md: 34 },
                                boxShadow: '0 3px 12px rgba(16, 185, 129, 0.3)',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    background: isLastStep
                                        ? 'linear-gradient(135deg, #047857 0%, #059669 100%)'
                                        : 'linear-gradient(135deg, #0d6b63 0%, #059669 50%, #0891b2 100%)',
                                    boxShadow: '0 5px 16px rgba(16, 185, 129, 0.4)',
                                    transform: 'translateY(-1px)',
                                },
                            }}
                        >
                            {isLastStep ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>,
        document.body
    );
}

/**
 * Reset a tour (no-op now, tours always show)
 */
export function resetTour(tourId) {
    // No-op: tours now always show on page load
}

/**
 * Check if a tour has been completed (always false now)
 */
export function isTourCompleted(tourId) {
    return false;
}
