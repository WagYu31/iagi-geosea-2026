import React, { useRef, useEffect, useState } from 'react';

/**
 * useCountUp — animates a number from 0 to `end` when the ref is in view.
 *
 * @param {number} end       Target number
 * @param {number} duration  Animation duration in ms (default 2000)
 * @param {string} suffix    Suffix like "+" to append
 * @returns {{ ref, display }}
 */
export default function useCountUp(end, duration = 2000, suffix = '') {
    const ref = useRef(null);
    const [display, setDisplay] = useState('0' + suffix);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    animateCount();
                    observer.unobserve(el);
                }
            },
            { threshold: 0.3 }
        );

        const animateCount = () => {
            const startTime = performance.now();

            const tick = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease-out cubic for natural feel
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * end);

                setDisplay(current + suffix);

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            };

            requestAnimationFrame(tick);
        };

        observer.observe(el);
        return () => observer.disconnect();
    }, [end, duration, suffix]);

    return { ref, display };
}
