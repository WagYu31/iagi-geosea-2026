import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Box, Typography, Button, IconButton, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

/**
 * CoachMark - Guided Tour Component
 *
 * Usage:
 * <CoachMark
 *   tourId="submissions-tour"
 *   steps={[
 *     { target: '#new-submission-btn', title: 'New Submission', description: 'Click here to submit your paper', position: 'bottom' },
 *     { target: '#status-filter', title: 'Filter Status', description: 'Filter submissions by status', position: 'bottom' },
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

        if (!el) {
            // If target not found, skip or show centered
            setSpotlightRect(null);
            setTooltipPos({
                top: window.innerHeight / 2 - 80,
                left: window.innerWidth / 2 - 160,
            });
            return;
        }

        const rect = el.getBoundingClientRect();
        const padding = 8;

        setSpotlightRect({
            top: rect.top - padding,
            left: rect.left - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
            borderRadius: 12,
        });

        // Calculate tooltip position
        const tooltipWidth = 320;
        const tooltipHeight = 180;
        const gap = 16;
        const pos = step.position || 'bottom';

        let top, left;

        switch (pos) {
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
        if (left < 16) left = 16;
        if (left + tooltipWidth > window.innerWidth - 16) left = window.innerWidth - tooltipWidth - 16;
        if (top < 16) top = rect.bottom + gap;
        if (top + tooltipHeight > window.innerHeight - 16) top = rect.top - tooltipHeight - gap;

        setTooltipPos({ top, left });
    }, [isActive, currentStep, steps]);

    useEffect(() => {
        if (!isActive) return;

        updatePosition();

        // Scroll target into view
        const step = steps[currentStep];
        if (step) {
            const el = document.querySelector(step.target);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Recalculate after scroll
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
            }, 200);
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
            }, 200);
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

    return createPortal(
        <>
            {/* Overlay - does NOT dismiss on click, user must use Skip/Finish */}
            <Box
                sx={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9998,
                    bgcolor: 'rgba(0, 0, 0, 0.55)',
                    backdropFilter: 'blur(2px)',
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* Spotlight cutout */}
            {spotlightRect && (
                <Box
                    onClick={() => {
                        const step = steps[currentStep];
                        const el = document.querySelector(step.target);
                        // Close coach mark first so overlay doesn't block
                        setIsActive(false);
                        // Then trigger the actual element click after overlay is gone
                        setTimeout(() => {
                            if (el) {
                                el.click();
                            }
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
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.55)',
                        border: '2px solid rgba(26, 188, 156, 0.6)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: -4,
                            borderRadius: `${spotlightRect.borderRadius + 4}px`,
                            border: '2px solid rgba(26, 188, 156, 0.3)',
                            animation: 'coachPulse 2s ease-in-out infinite',
                        },
                        '@keyframes coachPulse': {
                            '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
                            '50%': { opacity: 1, transform: 'scale(1.02)' },
                        },
                    }}
                />
            )}

            {/* Tooltip */}
            <Box
                ref={tooltipRef}
                sx={{
                    position: 'fixed',
                    top: tooltipPos.top,
                    left: tooltipPos.left,
                    zIndex: 10000,
                    width: 320,
                    bgcolor: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(26, 188, 156, 0.15)',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: isAnimating ? 0 : 1,
                    transform: isAnimating ? 'translateY(8px) scale(0.97)' : 'translateY(0) scale(1)',
                }}
            >
                {/* Progress bar */}
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 3,
                        bgcolor: '#f0fdf4',
                        '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #0d7a6a, #1abc9c)',
                            borderRadius: 2,
                        },
                    }}
                />

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            width: 28, height: 28,
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #0d7a6a, #1abc9c)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <LightbulbIcon sx={{ color: '#fff', fontSize: 16 }} />
                        </Box>
                        <Typography sx={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                        }}>
                            Step {currentStep + 1} of {steps.length}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={skipTour} sx={{ color: '#9ca3af', '&:hover': { color: '#6b7280' } }}>
                        <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ px: 2, pb: 1.5 }}>
                    <Typography sx={{
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        color: '#111827',
                        mb: 0.5,
                        lineHeight: 1.3,
                    }}>
                        {step.icon && <span style={{ marginRight: 6 }}>{step.icon}</span>}
                        {step.title}
                    </Typography>
                    <Typography sx={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        lineHeight: 1.5,
                    }}>
                        {step.description}
                    </Typography>
                </Box>

                {/* Footer */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    bgcolor: '#f9fafb',
                    borderTop: '1px solid #f3f4f6',
                }}>
                    <Button
                        size="small"
                        onClick={skipTour}
                        sx={{
                            color: '#9ca3af',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            '&:hover': { color: '#6b7280', bgcolor: 'transparent' },
                        }}
                    >
                        Skip Tour
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {currentStep > 0 && (
                            <Button
                                size="small"
                                onClick={goPrev}
                                startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
                                sx={{
                                    color: '#6b7280',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    borderRadius: '8px',
                                    px: 1.5,
                                    '&:hover': { bgcolor: '#f3f4f6' },
                                }}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            size="small"
                            variant="contained"
                            onClick={goNext}
                            endIcon={isLastStep ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <ArrowForwardIcon sx={{ fontSize: 14 }} />}
                            sx={{
                                background: 'linear-gradient(135deg, #0d7a6a 0%, #1abc9c 100%)',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                borderRadius: '8px',
                                px: 2,
                                boxShadow: '0 2px 8px rgba(13, 122, 106, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #0a6b5c 0%, #16a085 100%)',
                                    boxShadow: '0 4px 12px rgba(13, 122, 106, 0.4)',
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
