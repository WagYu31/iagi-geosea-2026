"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";

interface CardProps {
  number: string;
  title: string;
  description: string;
  date?: string;
  status?: string;
  colorTheme?: "orange" | "blue" | "purple" | "emerald";
  className?: string;
  rotate?: string;
  style?: React.CSSProperties;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({
  number,
  title,
  description,
  date,
  status,
  colorTheme = "blue",
  className = "",
  rotate = "",
  style,
  colors: customColors,
}: CardProps) => {
  const defaultBgColors = {
    orange: "bg-orange-50/90 border-orange-200/80",
    blue: "bg-sky-50/90 border-sky-200/80",
    purple: "bg-purple-50/90 border-purple-200/80",
    emerald: "bg-emerald-50/90 border-emerald-200/80",
  };
  const defaultTextColors = {
    orange: "text-orange-500",
    blue: "text-sky-600",
    purple: "text-purple-600",
    emerald: "text-emerald-600",
  };
  const defaultBorderColors = {
    orange: "border-orange-200/90",
    blue: "border-sky-200/90",
    purple: "border-purple-200/90",
    emerald: "border-emerald-200/90",
  };

  const bgColor = customColors?.bg || defaultBgColors[colorTheme] || defaultBgColors.blue;
  const textColor = customColors?.text || defaultTextColors[colorTheme] || defaultTextColors.blue;
  const borderColor = customColors?.border || defaultBorderColors[colorTheme] || defaultBorderColors.blue;

  return (
    <div
      style={style}
      className={`transition-all duration-300 hover:z-30 hover:scale-105 hover:rotate-0 ${rotate} ${className}`}
    >
      <div className="bg-white p-2 sm:p-2.5 rounded-[20px] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08),0_2px_6px_-1px_rgba(0,0,0,0.04)] border border-slate-200/90 relative backdrop-blur-sm h-full flex flex-col">
        {/* Active Now Pill Badge */}
        {status === "active" && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Active Now
          </div>
        )}

        <Pin className={`w-6 h-6 sm:w-7 sm:h-7 ${textColor} z-20 mb-2 sm:mb-2.5 mx-auto drop-shadow-sm shrink-0`} />
        <div
          className={`${bgColor} border ${borderColor} rounded-[14px] p-2.5 sm:p-3 flex-1 flex flex-col justify-between overflow-hidden`}
        >
          <div>
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span
                className={`${textColor} text-2xl sm:text-3xl font-handwriting select-none leading-none`}
                style={{
                  fontFamily: '"Comic Sans MS", "Chalkboard SE", "Caveat", cursive, sans-serif',
                }}
              >
                {number}
              </span>
              {date && (
                <span className="text-[9px] sm:text-[10px] font-bold tracking-tight text-slate-700 bg-white/95 px-1.5 sm:px-2 py-0.5 rounded-md border border-slate-200/80 shadow-xs whitespace-nowrap">
                  {date}
                </span>
              )}
            </div>
            <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 leading-snug mb-1">
              {title}
            </h3>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  description: string;
  date?: string;
  status?: string;
  colorTheme?: "orange" | "blue" | "purple" | "emerald";
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface StepPosition {
  className?: string;
  rotate?: string;
  style?: React.CSSProperties;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
}

// Responsive percentage-based positions: fits 100% width cleanly on desktop without clipping Card 05
const RESPONSIVE_HORIZONTAL_POSITIONS: StepPosition[] = [
  {
    className: "absolute top-[18px]",
    rotate: "-rotate-3",
    style: { left: "1%", width: "18%" },
  },
  {
    className: "absolute top-[125px]",
    rotate: "rotate-3",
    style: { left: "21%", width: "18%" },
  },
  {
    className: "absolute top-[18px]",
    rotate: "-rotate-3",
    style: { left: "41%", width: "18%" },
  },
  {
    className: "absolute top-[125px]",
    rotate: "rotate-3",
    style: { left: "61%", width: "18%" },
  },
  {
    className: "absolute top-[18px]",
    rotate: "-rotate-2",
    style: { left: "81%", width: "18%" },
  },
];

export default function HowItWorks({
  features,
  className = "",
  stepPositions,
}: HowItWorksProps) {
  const defaultFeatures: Step[] = [
    {
      title: "Abstract Submission",
      description: "Opening of research abstract submission for oral and poster presentation tracks.",
      date: "Feb 9, 2026",
      status: "active",
      colorTheme: "orange",
    },
    {
      title: "Abstract Deadline",
      description: "Final submission deadline for research abstracts and peer-review process.",
      date: "Mar 21, 2026",
      status: "active",
      colorTheme: "blue",
    },
    {
      title: "Acceptance Announcement",
      description: "Official notification and announcement of accepted research papers.",
      date: "May 07, 2026",
      status: "upcoming",
      colorTheme: "purple",
    },
    {
      title: "Full Manuscript Deadline",
      description: "Deadline for submitting full manuscripts for indexed conference proceedings.",
      date: "Aug 07, 2026",
      status: "upcoming",
      colorTheme: "orange",
    },
    {
      title: "Main Event Conference",
      description: "The 55th PIT IAGI & GEOSEA XIX Annual Scientific Convention & Exhibition.",
      date: "Nov 3, 2026",
      status: "upcoming",
      colorTheme: "blue",
    },
  ];

  const data = features && features.length > 0 ? features : defaultFeatures;
  const positions = stepPositions || RESPONSIVE_HORIZONTAL_POSITIONS;

  const totalHeight = 440;

  return (
    <LazyMotion features={domAnimation}>
      <div className={`w-full bg-white relative py-2 sm:py-4 px-1 sm:px-2 ${className}`}>
        {/* Mobile Swipe Hint */}
        <div className="flex lg:hidden items-center justify-center gap-1.5 text-xs text-slate-500 font-medium mb-3 select-none">
          <span>👉</span> Geser ke samping untuk melihat timeline lengkap
        </div>

        {/* Scrollable Container on small screens (<1024px), fully fluid on desktop (>=1024px) */}
        <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200">
          <div
            className="relative mx-auto min-w-[960px] lg:min-w-0 w-full"
            style={{ height: `${totalHeight}px` }}
          >
            {/* Subtle lined paper pattern background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05]"
              style={{
                backgroundImage: "linear-gradient(#0f172a 1px, transparent 1px)",
                backgroundSize: "100% 30px",
                marginTop: "4px",
              }}
            ></div>

            {/* Animated Connecting Horizontal Sine-Wave Loop Line */}
            {data.length > 1 && (
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
                viewBox="0 0 1000 420"
                preserveAspectRatio="none"
              >
                {(() => {
                  // Connects the 5 pins at (100, 42) -> (300, 149) -> (500, 42) -> (700, 149) -> (900, 42)
                  const pathD =
                    "M 100 42 C 185 42, 215 149, 300 149 C 385 149, 415 42, 500 42 C 585 42, 615 149, 700 149 C 785 149, 815 42, 900 42";
                  return (
                    <m.path
                      d={pathD}
                      stroke="#cbd5e1"
                      strokeWidth="2.5"
                      strokeDasharray="8 6"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{
                        strokeDashoffset: -140, // seamless loop
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  );
                })()}
              </svg>
            )}

            {/* Pinned Post-It Cards (Landscape Ke Samping) */}
            {data.map((step, index) => {
              const position = positions[index % positions.length];

              return (
                <Card
                  key={step.title}
                  number={`0${index + 1}`}
                  title={step.title}
                  description={step.description}
                  date={step.date}
                  status={step.status}
                  colorTheme={step.colorTheme || "blue"}
                  colors={step.colors}
                  rotate={position.rotate}
                  className={position.className}
                  style={position.style}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
