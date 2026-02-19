import React, { useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';

/**
 * ScrollReveal — wraps children and animates them in when scrolled into view.
 *
 * Props:
 *   variant   – 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'zoomIn' | 'fade' (default: 'fadeUp')
 *   delay     – ms delay before animation starts (default: 0)
 *   duration  – ms animation duration (default: 800)
 *   distance  – px translate distance (default: 60)
 *   threshold – 0-1, how much of element must be visible (default: 0.15)
 *   once      – animate only once (default: true)
 *   style     – additional sx props forwarded to the wrapper Box
 */

const variants = {
    fadeUp: (d) => ({ opacity: 0, transform: `translateY(${d}px)` }),
    fadeDown: (d) => ({ opacity: 0, transform: `translateY(-${d}px)` }),
    fadeLeft: (d) => ({ opacity: 0, transform: `translateX(${d}px)` }),
    fadeRight: (d) => ({ opacity: 0, transform: `translateX(-${d}px)` }),
    zoomIn: () => ({ opacity: 0, transform: 'scale(0.85)' }),
    fade: () => ({ opacity: 0 }),
};

const visibleStyle = { opacity: 1, transform: 'translate(0) scale(1)' };

export default function ScrollReveal({
    children,
    variant = 'fadeUp',
    delay = 0,
    duration = 800,
    distance = 60,
    threshold = 0.15,
    once = true,
    sx = {},
    ...rest
}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, once]);

    const getInitialStyle = variants[variant] || variants.fadeUp;

    return (
        <Box
            ref={ref}
            sx={{
                ...getInitialStyle(distance),
                transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                willChange: 'opacity, transform',
                ...(isVisible ? visibleStyle : {}),
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Box>
    );
}
