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
      className={`transition-transform duration-300 hover:z-30 hover:scale-105 hover:rotate-0 ${rotate} ${className}`}
    >
      <div className="bg-white p-2.5 rounded-[22px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08),0_4px_10px_-2px_rgba(0,0,0,0.04)] border border-slate-200/90 relative backdrop-blur-sm">
        {/* Active Now Pill Badge */}
        {status === "active" && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Active Now
          </div>
        )}

        <Pin className={`w-7 h-7 ${textColor} z-20 mb-3 mx-auto drop-shadow-sm`} />
        <div
          className={`${bgColor} border ${borderColor} rounded-[16px] p-3.5 h-full flex flex-col relative overflow-hidden`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`${textColor} text-3xl font-handwriting select-none`}
              style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", "Caveat", cursive, sans-serif',
              }}
            >
              {number}
            </span>
            {date && (
              <span className="text-[10px] font-bold tracking-tight text-slate-600 bg-white/95 px-2 py-0.5 rounded-md border border-slate-200/80 shadow-xs">
                {date}
              </span>
            )}
          </div>
          <h3 className="text-[15px] font-bold text-slate-800 leading-snug mb-1.5">
            {title}
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
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
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
  orientation?: "horizontal" | "vertical";
}

// 5 Horizontal Staggered Positions (Landscape Left-to-Right wave)
const DEFAULT_HORIZONTAL_POSITIONS: StepPosition[] = [
  { className: "absolute top-[25px] left-[10px] w-[225px]", rotate: "-rotate-3" },
  { className: "absolute top-[135px] left-[245px] w-[225px]", rotate: "rotate-3" },
  { className: "absolute top-[25px] left-[480px] w-[225px]", rotate: "-rotate-3" },
  { className: "absolute top-[135px] left-[715px] w-[225px]", rotate: "rotate-3" },
  { className: "absolute top-[25px] left-[950px] w-[225px]", rotate: "-rotate-2" },
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
  const positions = stepPositions || DEFAULT_HORIZONTAL_POSITIONS;

  const totalWidth = 1185;
  const totalHeight = 450;

  return (
    <LazyMotion features={domAnimation}>
      <div className={`w-full bg-white relative py-4 px-2 ${className}`}>
        {/* Mobile Swipe Hint */}
        <div className="flex lg:hidden items-center justify-center gap-1.5 text-xs text-slate-500 font-medium mb-3 select-none">
          <span>👉</span> Geser ke samping untuk melihat timeline lengkap
        </div>

        {/* Scrollable Container on small screens, centered on desktop */}
        <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200">
          <div
            className="relative mx-auto"
            style={{ width: `${totalWidth}px`, height: `${totalHeight}px` }}
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
                viewBox={`0 0 ${totalWidth} ${totalHeight}`}
                preserveAspectRatio="none"
              >
                {(() => {
                  // Connects the 5 pins along an undulating horizontal wave
                  const pathD =
                    "M 122.5 49 C 230 49, 250 159, 357.5 159 C 465 159, 485 49, 592.5 49 C 700 49, 720 159, 827.5 159 C 935 159, 955 49, 1062.5 49";
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
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
