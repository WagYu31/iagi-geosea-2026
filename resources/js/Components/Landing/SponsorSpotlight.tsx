import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Building2 } from 'lucide-react';

interface SponsorItem {
  id?: number | string;
  name?: string;
  logo?: string;
  website?: string;
  category?: string;
  level?: string;
}

interface BadgeStyle {
  label: string;
  shortLabel: string;
  className: string;
  style: React.CSSProperties;
}

const getCategoryBadge = (category?: string, level?: string): BadgeStyle => {
  const cat = (category || level || 'OTHER').trim();
  const lower = cat.toLowerCase();

  // 1. Main Event Diamond
  if (lower.includes('diamond')) {
    return {
      label: 'MAIN EVENT DIAMOND',
      shortLabel: 'DIAMOND',
      className: 'font-extrabold shadow-sm',
      style: {
        backgroundColor: '#1d4ed8',
        color: '#ffffff',
        borderColor: '#3b82f6',
      },
    };
  }

  // 2. Main Event Bronze
  if (lower.includes('bronze')) {
    return {
      label: 'MAIN EVENT BRONZE',
      shortLabel: 'BRONZE',
      className: 'font-extrabold shadow-sm',
      style: {
        backgroundColor: '#78350f',
        color: '#fef3c7',
        borderColor: '#92400e',
      },
    };
  }

  // 3. IAGI President Election
  if (lower.includes('president') || lower.includes('election')) {
    return {
      label: 'IAGI PRESIDENT ELECTION',
      shortLabel: 'PRESIDENT ELECTION',
      className: 'font-extrabold shadow-sm',
      style: {
        backgroundColor: '#b91c1c',
        color: '#ffffff',
        borderColor: '#dc2626',
      },
    };
  }

  // 4. Ice Breaking Night
  if (lower.includes('ice') || lower.includes('breaking')) {
    return {
      label: 'ICE BREAKING NIGHT',
      shortLabel: 'ICE BREAKING',
      className: 'font-extrabold shadow-sm',
      style: {
        backgroundColor: '#1d4ed8',
        color: '#ffffff',
        borderColor: '#2563eb',
      },
    };
  }

  // 5. Technical Sessions
  if (lower.includes('technical')) {
    return {
      label: 'TECHNICAL SESSIONS',
      shortLabel: 'TECHNICAL SESSIONS',
      className: 'font-extrabold shadow-2xs',
      style: {
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        borderColor: '#7dd3fc',
      },
    };
  }

  // 6. Lanyard & Name Tag
  if (lower.includes('lanyard') || lower.includes('name tag') || lower.includes('tag')) {
    return {
      label: 'LANYARD & NAME TAG',
      shortLabel: 'LANYARD & PASS',
      className: 'font-extrabold shadow-2xs',
      style: {
        backgroundColor: '#f3e8ff',
        color: '#6b21a8',
        borderColor: '#d8b4fe',
      },
    };
  }

  // 7. Keynote/Plenary
  if (lower.includes('keynote') || lower.includes('plenary')) {
    return {
      label: 'KEYNOTE / PLENARY',
      shortLabel: 'KEYNOTE / PLENARY',
      className: 'font-bold shadow-sm',
      style: {
        backgroundColor: '#1e293b',
        color: '#ffffff',
        borderColor: '#334155',
      },
    };
  }

  // 8. Exhibition
  if (lower.includes('exhibition') || lower.includes('booth')) {
    return {
      label: 'EXHIBITION',
      shortLabel: 'EXHIBITION',
      className: 'font-bold shadow-sm',
      style: {
        backgroundColor: '#334155',
        color: '#ffffff',
        borderColor: '#475569',
      },
    };
  }

  // 9. Other / Default
  return {
    label: cat.toUpperCase(),
    shortLabel: cat.toUpperCase(),
    className: 'font-semibold',
    style: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      borderColor: '#cbd5e1',
    },
  };
};

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
  const [windowWidth, setWindowWidth] = useState(1280);

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

  // Window resize handler for fluid wide responsive transforms
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  // Drag and swipe handlers
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

  // Determine dynamic wide spacing based on viewport width
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024 && windowWidth < 1440;
  const isWide = windowWidth >= 1440;

  // Wider horizontal spacing so carousel fans out across the entire screen width like GetLayers.ai
  let spacing1 = 290;
  let spacing2 = 560;
  let spacing3 = 810;
  let stagePerspective = '1200px';

  if (isMobile) {
    spacing1 = 140;
    spacing2 = 250;
    spacing3 = 350;
    stagePerspective = '750px';
  } else if (isTablet) {
    spacing1 = 210;
    spacing2 = 400;
    spacing3 = 570;
    stagePerspective = '950px';
  } else if (isDesktop) {
    spacing1 = 265;
    spacing2 = 510;
    spacing3 = 740;
    stagePerspective = '1100px';
  } else if (isWide) {
    spacing1 = 300;
    spacing2 = 580;
    spacing3 = 850;
    stagePerspective = '1300px';
  }

  const currentSponsor = sponsors[activeIndex] || sponsors[0];
  const currentNumber = activeIndex + 1 < 10 ? `0${activeIndex + 1}` : `${activeIndex + 1}`;
  const totalNumber = total < 10 ? `0${total}` : `${total}`;

  return (
    <div
      ref={containerRef}
      className="relative w-full py-10 md:py-16 select-none overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-teal-500/6 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section (Centered and Elegantly Spaced) */}
      <div className="max-w-4xl mx-auto text-center mb-10 md:mb-14 px-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50/80 border border-teal-200/60 mb-3.5 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-teal-800">
            OFFICIAL SUPPORTERS &amp; PARTNERS
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase mb-2">
          {title}
        </h2>

        {description && description.trim() !== '' && (
          <p className="text-sm sm:text-base text-teal-800/80 italic max-w-xl mx-auto leading-relaxed mt-1">
            {description}
          </p>
        )}
      </div>

      {/* 3D Concave Arc Carousel Stage - Full Width Expansive */}
      <div className="relative w-full h-[340px] sm:h-[380px] md:h-[430px] flex items-center justify-center overflow-visible">
        {/* Giant Watermark Number in Background (as in Image 2) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <span className="text-[200px] sm:text-[280px] md:text-[380px] font-serif font-black text-slate-900/[0.035] tracking-tighter leading-none block transition-all duration-700 ease-out">
            {currentNumber}
          </span>
        </div>

        {/* Floor Spotlight Beam under active center card */}
        <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[480px] sm:w-[700px] md:w-[920px] h-[110px] bg-gradient-to-r from-transparent via-teal-400/25 to-transparent blur-3xl rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 w-[240px] sm:w-[320px] md:w-[360px] h-[30px] bg-slate-900/12 blur-2xl rounded-full pointer-events-none z-0" />

        {/* 3D Perspective Stage Container */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: stagePerspective, transformStyle: 'preserve-3d' }}
        >
          {sponsors.map((sponsor, index) => {
            // Cyclic offset relative to center
            let offset = index - activeIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;

            // Wide Concave cylinder calculations
            let translateX = 0;
            let translateZ = 0;
            let rotateY = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 40;
            let pointerEvents: 'auto' | 'none' = 'auto';

            if (isCenter) {
              translateX = 0;
              translateZ = 0;
              rotateY = 0;
              scale = 1;
              opacity = 1;
              zIndex = 40;
            } else if (offset === -1 || offset === 1) {
              translateX = Math.sign(offset) * spacing1;
              translateZ = -65;
              rotateY = -Math.sign(offset) * 16;
              scale = 0.90;
              opacity = 0.95;
              zIndex = 30;
            } else if (offset === -2 || offset === 2) {
              translateX = Math.sign(offset) * spacing2;
              translateZ = -135;
              rotateY = -Math.sign(offset) * 28;
              scale = 0.82;
              opacity = isMobile ? 0 : 0.80;
              zIndex = 20;
              if (isMobile) pointerEvents = 'none';
            } else if (offset === -3 || offset === 3) {
              translateX = Math.sign(offset) * spacing3;
              translateZ = -210;
              rotateY = -Math.sign(offset) * 40;
              scale = 0.74;
              opacity = isMobile || isTablet ? 0 : 0.60;
              zIndex = 10;
              if (isMobile || isTablet) pointerEvents = 'none';
            } else {
              translateX = Math.sign(offset) * (spacing3 + 200);
              translateZ = -280;
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
                className={`absolute w-[220px] sm:w-[250px] md:w-[275px] h-[300px] sm:h-[340px] md:h-[370px] rounded-[26px] bg-white p-6 sm:p-7 flex flex-col items-center justify-between cursor-pointer transition-all duration-500 ease-out shadow-[0_12px_40px_-8px_rgba(0,0,0,0.08)] border ${
                  isCenter
                    ? 'border-teal-500/50 shadow-[0_25px_60px_-10px_rgba(13,148,136,0.3)] ring-4 ring-teal-500/12'
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
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100/90 px-2.5 py-0.5 rounded-md shadow-2xs">
                    {itemNumber}
                  </span>
                  {(() => {
                    const badge = getCategoryBadge(sponsor.category, sponsor.level);
                    return (
                      <span
                        className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${badge.className}`}
                        style={badge.style}
                      >
                        {badge.shortLabel}
                      </span>
                    );
                  })()}
                </div>

                {/* Center Logo Area */}
                <div className="w-full flex-1 flex items-center justify-center my-3 overflow-hidden p-2">
                  {sponsor.logo ? (
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name ? `Supported by ${sponsor.name}` : 'Sponsor'}
                      className="max-w-[88%] max-h-[140px] sm:max-h-[160px] object-contain drop-shadow-xs transition-transform duration-500 hover:scale-105"
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

      {/* Bottom Controls Bar (Counter, Title, Dots, Arrows) - Centered Container */}
      <div className="max-w-6xl mx-auto mt-6 md:mt-10 pt-6 px-6 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left: Counter Index (Large Display) */}
        <div className="flex items-baseline gap-1.5 min-w-[130px]">
          <span className="text-3xl md:text-5xl font-black text-slate-900 font-mono tracking-tight">
            {currentNumber}
          </span>
          <span className="text-sm md:text-base font-semibold text-slate-400 font-mono">
            / {totalNumber}
          </span>
        </div>

        {/* Center: Dynamic Active Sponsor Meta & Dots */}
        <div className="text-center max-w-lg mx-auto">
          <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
            DRAG · SWIPE · ARROW KEYS
          </div>

          {(() => {
            const activeBadge = getCategoryBadge(currentSponsor.category, currentSponsor.level);
            return (
              <div
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-2 border shadow-xs ${activeBadge.className}`}
                style={activeBadge.style}
              >
                <span>★</span>
                <span>{activeBadge.label}</span>
              </div>
            );
          })()}

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
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

          {/* Pagination Dots with Active Pill */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {sponsors.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to sponsor ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? 'w-7 h-2 bg-teal-600 shadow-xs'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Next / Prev Circular Buttons */}
        <div className="flex items-center gap-2.5 min-w-[130px] justify-end">
          <button
            onClick={prev}
            aria-label="Previous partner"
            className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next partner"
            className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
