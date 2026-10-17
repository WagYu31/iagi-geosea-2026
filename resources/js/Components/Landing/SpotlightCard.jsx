import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';

/**
 * SpotlightCard — Premium interactive card with cursor-tracking ambient spotlight
 * Inspired by GetLayers Relay template (adapted for bright/light modern theme).
 */
export default function SpotlightCard({
    children,
    spotlightColor = 'rgba(13, 148, 136, 0.12)',
    borderColor = 'rgba(13, 148, 136, 0.35)',
    sx = {},
    ...props
}) {
    const cardRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <Box
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '20px',
                bgcolor: '#ffffff',
                border: '1px solid rgba(226, 232, 240, 0.85)',
                boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.04)',
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 20px 40px -10px rgba(13, 148, 136, 0.14)',
                    borderColor: borderColor,
                },
                ...sx,
            }}
            {...props}
        >
            {/* Smooth Dynamic Cursor Spotlight Beam */}
            <Box
                sx={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 80%)`,
                    zIndex: 0,
                }}
            />

            {/* Inner Content */}
            <Box sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
                {children}
            </Box>
        </Box>
    );
}
