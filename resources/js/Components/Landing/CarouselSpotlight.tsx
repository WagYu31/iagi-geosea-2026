import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

interface StepItem {
  id: number | string;
  stepNumber: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  link?: string;
  linkText?: string;
  rating?: string;
}

interface CarouselSpotlightProps {
  items?: StepItem[];
  title?: string;
  subtitle?: string;
  sectionLabel?: string;
}

const DEFAULT_STEPS: StepItem[] = [
  {
    id: 1,
    stepNumber: '01',
    title: 'Create Account',
    category: 'Registration · Step 1',
    tagline: 'Account Setup',
    description: 'Sign up on the official PIT IAGI - GEOSEA 2026 conference portal with your active email address and complete email verification.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    link: '/register',
    linkText: 'Register Now',
    rating: 'Step 1',
  },
  {
    id: 2,
    stepNumber: '02',
    title: 'Author Profile',
    category: 'Profile · Step 2',
    tagline: 'Institutional Affiliation',
    description: 'Complete your personal and institutional profile. Add co-authors, academic credentials, and contact details for official indexing.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    link: '/dashboard',
    linkText: 'Go to Dashboard',
    rating: 'Step 2',
  },
  {
    id: 3,
    stepNumber: '03',
    title: 'Abstract Submission',
    category: 'Call for Papers · Step 3',
    tagline: 'Research Submission',
    description: 'Format your abstract according to conference guidelines (Word/PDF template). Select your technical session and submit through the author portal.',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    link: '#resources',
    linkText: 'Download Guideline',
    rating: 'Step 3',
  },
  {
    id: 4,
    stepNumber: '04',
    title: 'Peer Review & Acceptance',
    category: 'Scientific Review · Step 4',
    tagline: 'Committee Assessment',
    description: 'Track the review status of your submission in real time. Official notification letters (LoA) will be announced and sent via email.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    link: '/dashboard',
    linkText: 'Track Status',
    rating: 'Step 4',
  },
  {
    id: 5,
    stepNumber: '05',
    title: 'Full Manuscript',
    category: 'Proceedings · Step 5',
    tagline: 'Indexed Publication',
    description: 'Accepted authors upload the final full paper manuscript and presentation slides for inclusion in indexed scientific proceedings.',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    link: '#resources',
    linkText: 'View Template',
    rating: 'Step 5',
  },
  {
    id: 6,
    stepNumber: '06',
    title: 'Payment & Conference Pass',
    category: 'Delegates · Step 6',
    tagline: 'Final Confirmation',
    description: 'Select your registration package, complete secure payment via Virtual Account or Card, and download your official conference delegate badge.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    link: '/register',
    linkText: 'Get Conference Pass',
    rating: 'Step 6',
  },
];

export default function CarouselSpotlight({
  items,
  title = 'Submission procedure, framed in light',
  subtitle = 'Follow these simple, step-by-step procedures to submit your abstract and register for the conference.',
  sectionLabel = 'SUBMISSION PROCEDURE · 55TH PIT IAGI & GEOSEA XIX 2026',
}: CarouselSpotlightProps) {
  const steps = items && items.length > 0 ? items : DEFAULT_STEPS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentDragDeltaRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = steps.length;

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

  const currentStep = steps[activeIndex] || steps[0];

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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 text-xs font-extrabold tracking-widest uppercase mb-3.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>{sectionLabel}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {title.includes('framed in light') ? (
            <>
              Selected works, framed in <span className="font-serif italic font-normal text-teal-600">light</span>
            </>
          ) : (
            title
          )}
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* 3D Concave Arc Carousel Stage */}
      <div className="relative w-full max-w-6xl mx-auto h-[380px] sm:h-[440px] md:h-[470px] flex items-center justify-center">
        {/* Spotlight Oval Glow on Stage Floor */}
        <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-[340px] sm:w-[420px] h-[90px] bg-teal-400/20 blur-3xl rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[24px] left-1/2 -translate-x-1/2 w-[240px] sm:w-[280px] h-[25px] bg-slate-900/10 blur-xl rounded-full pointer-events-none z-0" />

        {/* 3D Space Container */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: '1100px', transformStyle: 'preserve-3d' }}
        >
          {steps.map((step, index) => {
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

            if (isCenter) {
              translateX = 0;
              translateZ = 0;
              rotateY = 0;
              scale = 1;
              opacity = 1;
              zIndex = 30;
            } else if (offset === -1) {
              translateX = -180;
              translateZ = -70;
              rotateY = 24;
              scale = 0.88;
              opacity = 0.88;
              zIndex = 20;
            } else if (offset === 1) {
              translateX = 180;
              translateZ = -70;
              rotateY = -24;
              scale = 0.88;
              opacity = 0.88;
              zIndex = 20;
            } else if (offset === -2) {
              translateX = -330;
              translateZ = -150;
              rotateY = 38;
              scale = 0.76;
              opacity = 0.6;
              zIndex = 10;
            } else if (offset === 2) {
              translateX = 330;
              translateZ = -150;
              rotateY = -38;
              scale = 0.76;
              opacity = 0.6;
              zIndex = 10;
            } else {
              translateX = Math.sign(offset) * 440;
              translateZ = -220;
              rotateY = -Math.sign(offset) * 48;
              scale = 0.65;
              opacity = 0.2;
              zIndex = 5;
            }

            return (
              <div
                key={step.id}
                onClick={() => setActiveIndex(index)}
                className={`absolute w-[220px] sm:w-[250px] md:w-[270px] h-[310px] sm:h-[360px] md:h-[390px] rounded-[22px] md:rounded-[26px] overflow-hidden cursor-pointer transition-all duration-500 ease-out shadow-[0_16px_40px_-8px_rgba(0,0,0,0.18)] border ${
                  isCenter
                    ? 'border-white/90 shadow-[0_20px_50px_-5px_rgba(13,148,136,0.35)] ring-2 ring-teal-500/30'
                    : 'border-slate-200/60'
                }`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Background Image */}
                <img
                  src={step.image}
                  alt={step.title}
                  className="absolute inset-0 w-full h-full object-cover object-center filter transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/20" />

                {/* Card Watermark Step Number Top-Left */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-white/80 font-mono text-xs font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                    {step.stepNumber}
                  </span>
                </div>

                {/* Watermark Tagline on Top-Right */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="text-teal-300 font-sans text-[10px] font-extrabold uppercase tracking-widest bg-teal-950/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-teal-500/30">
                    {step.tagline}
                  </span>
                </div>

                {/* Bottom Card Content */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <p className="text-[11px] font-bold tracking-wider text-teal-300 uppercase mb-0.5">
                    {step.category}
                  </p>
                  <h4 className="text-lg md:text-xl font-bold text-white leading-snug line-clamp-1 drop-shadow-sm">
                    {step.title}
                  </h4>
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
            {currentStep.stepNumber}
          </span>
          <span className="text-sm font-semibold text-slate-400 font-mono">
            / 0{total}
          </span>
        </div>

        {/* Center: Dynamic Active Step Meta & Dots */}
        <div className="text-center max-w-md mx-auto">
          <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">
            DRAG · SWIPE · ARROW KEYS
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentStep.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
            {currentStep.description}
          </p>

          {/* Action Button CTA */}
          {currentStep.link && (
            <div className="mt-3">
              <a
                href={currentStep.link}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <span>{currentStep.linkText || 'Proceed to Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to step ${i + 1}`}
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
            aria-label="Previous step"
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next step"
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
