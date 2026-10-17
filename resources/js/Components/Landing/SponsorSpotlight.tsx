import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Sparkles, Building2 } from 'lucide-react';

interface SponsorItem {
  id?: number | string;
  name?: string;
  logo?: string;
  website?: string;
  category?: string;
}

interface SponsorSpotlightProps {
  sponsors: SponsorItem[];
  title?: string;
  description?: string;
}

export default function SponsorSpotlight({
  sponsors = [],
  title = 'SUPPORTED BY :',
  description = '',
}: SponsorSpotlightProps) {
  if (!sponsors || sponsors.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentDragDeltaRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = sponsors.length;

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  // Touch and mouse drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    currentDragDeltaRef.current = currentX - startXRef.current;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (currentDragDeltaRef.current < -40) {
      next();
    } else if (currentDragDeltaRef.current > 40) {
      prev();
    }
    currentDragDeltaRef.current = 0;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    currentDragDeltaRef.current = e.clientX - startXRef.current;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (currentDragDeltaRef.current < -40) {
      next();
    } else if (currentDragDeltaRef.current > 40) {
      prev();
    }
    currentDragDeltaRef.current = 0;
  };

  // Responsive mobile check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentSponsor = sponsors[activeIndex] || sponsors[0];
  const currentNumber = activeIndex + 1 < 10 ? `0${activeIndex + 1}` : `${activeIndex + 1}`;
  const totalNumber = total < 10 ? `0${total}` : `${total}`;

  return (
    <div
      ref={containerRef}
      className="relative w-full py-12 md:py-16 px-4 select-none overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-10 md:mb-14 relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-wider uppercase mb-2">
          {title}
        </h2>

        {description && description.trim() !== '' && (
          <p className="text-sm sm:text-base text-teal-800/80 italic max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* 3D Concave Arc Carousel Stage */}
      <div className="relative w-full max-w-6xl mx-auto h-[320px] sm:h-[360px] md:h-[390px] flex items-center justify-center">
        {/* Spotlight Oval Glow on Stage Floor */}
        <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[340px] sm:w-[420px] h-[90px] bg-teal-400/20 blur-3xl rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 w-[240px] sm:w-[280px] h-[25px] bg-slate-900/10 blur-xl rounded-full pointer-events-none z-0" />

        {/* 3D Space Container */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: isMobile ? '800px' : '1100px', transformStyle: 'preserve-3d' }}
        >
          {sponsors.map((sponsor, index) => {
            // Calculate cyclic offset
            let offset = index - activeIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;

            // Compute 3D cylinder transform
            let translateX = 0;
            let translateZ = 0;
            let rotateY = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 30;
            let pointerEvents: 'auto' | 'none' = 'auto';

            const spacing1 = isMobile ? 135 : 205;
            const spacing2 = isMobile ? 240 : 380;

            if (isCenter) {
              translateX = 0;
              translateZ = 0;
              rotateY = 0;
              scale = 1;
              opacity = 1;
              zIndex = 30;
            } else if (offset === -1) {
              translateX = -spacing1;
              translateZ = -70;
              rotateY = 24;
              scale = 0.88;
              opacity = 0.88;
              zIndex = 20;
            } else if (offset === 1) {
              translateX = spacing1;
              translateZ = -70;
              rotateY = -24;
              scale = 0.88;
              opacity = 0.88;
              zIndex = 20;
            } else if (offset === -2) {
              translateX = -spacing2;
              translateZ = -150;
              rotateY = 38;
              scale = 0.76;
              opacity = isMobile ? 0 : 0.6;
              zIndex = 10;
              if (isMobile) pointerEvents = 'none';
            } else if (offset === 2) {
              translateX = spacing2;
              translateZ = -150;
              rotateY = -38;
              scale = 0.76;
              opacity = isMobile ? 0 : 0.6;
              zIndex = 10;
              if (isMobile) pointerEvents = 'none';
            } else {
              translateX = Math.sign(offset) * (spacing2 + 100);
              translateZ = -220;
              rotateY = -Math.sign(offset) * 48;
              scale = 0.65;
              opacity = 0;
              zIndex = 0;
              pointerEvents = 'none';
            }

            const itemNumber = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`absolute w-[220px] sm:w-[250px] md:w-[270px] h-[270px] sm:h-[300px] md:h-[320px] rounded-[24px] bg-white p-6 flex flex-col items-center justify-between cursor-pointer transition-all duration-500 ease-out shadow-[0_12px_36px_-6px_rgba(0,0,0,0.08)] border ${
                  isCenter
                    ? 'border-teal-500/50 shadow-[0_20px_50px_-5px_rgba(13,148,136,0.3)] ring-4 ring-teal-500/10'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  pointerEvents,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Top Row: Index Badge & Partner Pill */}
                <div className="w-full flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-md">
                    {itemNumber}
                  </span>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                    PARTNER
                  </span>
                </div>

                {/* Center Logo Area */}
                <div className="w-full flex-1 flex items-center justify-center my-3 overflow-hidden p-2">
                  {sponsor.logo ? (
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name ? `Supported by ${sponsor.name}` : 'Sponsor'}
                      className="max-w-[90%] max-h-[130px] sm:max-h-[150px] object-contain drop-shadow-xs transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700">
                      <Building2 className="w-10 h-10 stroke-[1.8]" />
                    </div>
                  )}
                </div>

                {/* Bottom Sponsor Name */}
                <div className="w-full pt-3 border-t border-slate-100 text-center">
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug line-clamp-1">
                    {sponsor.name || 'Supporting Institution'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls Bar (Counter, Title, Dots, Arrows) */}
      <div className="max-w-5xl mx-auto mt-6 md:mt-10 pt-6 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left: Counter Index */}
        <div className="flex items-baseline gap-1 min-w-[120px]">
          <span className="text-3xl md:text-4xl font-black text-slate-900 font-mono">
            {currentNumber}
          </span>
          <span className="text-sm font-semibold text-slate-400 font-mono">
            / {totalNumber}
          </span>
        </div>

        {/* Center: Dynamic Active Sponsor Meta & Dots */}
        <div className="text-center max-w-md mx-auto">
          <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">
            DRAG · SWIPE · ARROW KEYS
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentSponsor.name || 'Official Partner'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Official Supporting Institution for 55th PIT IAGI - GEOSEA XIX 2026
          </p>

          {/* Website Link CTA if available */}
          {currentSponsor.website && (
            <div className="mt-3">
              <a
                href={currentSponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {sponsors.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to sponsor ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? 'w-6 h-2 bg-teal-600 shadow-xs'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Next / Prev Circular Buttons */}
        <div className="flex items-center gap-2.5 min-w-[120px] justify-end">
          <button
            onClick={prev}
            aria-label="Previous partner"
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next partner"
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
