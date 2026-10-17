import React from 'react';
import {
  Globe,
  Users,
  Mic,
  Calendar,
  Sparkles,
  BookOpen,
  Compass,
  ArrowUpRight,
  Award,
  Layers,
  Share2,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import useCountUp from './useCountUp';

function CountUpStatCard({ end, suffix, label, sublabel, icon, index }) {
  const { ref, display } = useCountUp(end, 2000, suffix);

  return (
    <ScrollReveal key={index} variant="fadeUp" delay={index * 100} duration={600}>
      <div
        ref={ref}
        className="relative overflow-hidden rounded-[24px] bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_-8px_rgba(13,148,136,0.18)] hover:border-teal-500/40 transition-all duration-300 group hover:-translate-y-1"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50/90 text-teal-700 border border-teal-200/60 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-300">
            {icon}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-md">
            METRIC 0{index + 1}
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight leading-none">
          {display}
        </div>

        <div className="text-sm font-bold text-slate-800 mt-2">
          {label}
        </div>

        <div className="text-xs text-slate-500 mt-0.5 leading-snug">
          {sublabel}
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function Features({ settings = {} }) {
  const stats = [
    {
      end: 2000,
      suffix: '+',
      label: 'Expected Delegates',
      sublabel: 'Academics, geologists & industry leaders',
      icon: <Users className="w-6 h-6 stroke-[1.8]" />,
    },
    {
      end: 50,
      suffix: '+',
      label: 'Expert Speakers',
      sublabel: 'Global keynotes & panel authorities',
      icon: <Mic className="w-6 h-6 stroke-[1.8]" />,
    },
    {
      end: 3,
      suffix: '',
      label: 'Days of Sessions',
      sublabel: 'Plenary, technical oral & poster tracks',
      icon: <Calendar className="w-6 h-6 stroke-[1.8]" />,
    },
    {
      end: 8,
      suffix: '+',
      label: 'Member Nations',
      sublabel: 'ASEAN geological societies union',
      icon: <Globe className="w-6 h-6 stroke-[1.8]" />,
    },
  ];

  const themes = [
    'Energy Transition & Geothermal',
    'Critical Minerals & Mining Security',
    'Geo-hazards & Volcanic Mitigation',
    'Hydrogeology & Coastal Dynamics',
    'Geo-heritage & UNESCO Geoparks',
    'AI & Digital Geoscience Tech',
  ];

  const memberNations = [
    { flag: '🇮🇩', code: 'IAGI', country: 'Indonesia' },
    { flag: '🇲🇾', code: 'GSM', country: 'Malaysia' },
    { flag: '🇹🇭', code: 'GST', country: 'Thailand' },
    { flag: '🇵🇭', code: 'GSP', country: 'Philippines' },
    { flag: '🇻🇳', code: 'GSV', country: 'Vietnam' },
    { flag: '🇯🇵', code: 'GSJ', country: 'Japan' },
    { flag: '🇰🇷', code: 'GSK', country: 'Korea' },
    { flag: '🇨🇳', code: 'GSC', country: 'China' },
  ];

  const whyAttendPillars = [
    {
      number: '01',
      title: 'High-Level Networking',
      description:
        'Connect directly with 2,000+ delegates, industry executives, renowned researchers, and policymakers from Southeast Asia and beyond.',
      tag: '2,000+ Attendees',
      colorClass: 'bg-teal-50 text-teal-700 border border-teal-200/60',
      icon: <Share2 className="w-6 h-6 stroke-[1.8]" />,
    },
    {
      number: '02',
      title: 'Cutting-Edge Research',
      description:
        'Access groundbreaking discoveries and technical presentations on critical mineral security, geothermal exploration, and disaster resilience.',
      tag: '300+ Papers',
      colorClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      icon: <Layers className="w-6 h-6 stroke-[1.8]" />,
    },
    {
      number: '03',
      title: 'Scopus-Indexed Proceedings',
      description:
        'Elevate your scientific publication profile. Present your work to an international peer audience with indexed proceedings.',
      tag: 'Peer-Reviewed',
      colorClass: 'bg-sky-50 text-sky-700 border border-sky-200/60',
      icon: <BookOpen className="w-6 h-6 stroke-[1.8]" />,
    },
    {
      number: '04',
      title: 'Yogyakarta Geo-Excursion',
      description:
        'Experience world-class geological field trips across Yogyakarta’s active volcanic systems, ancient karst terrains, and geo-heritage sites.',
      tag: 'Field Excursion',
      colorClass: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      icon: <Compass className="w-6 h-6 stroke-[1.8]" />,
    },
  ];

  return (
    <section
      id="about"
      className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-[#f7fdfb] via-white to-[#f0fbf8] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fadeUp" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-teal-800">
                ABOUT THE CONFERENCE · 55TH PIT IAGI &amp; GEOSEA XIX 2026
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Premier International{' '}
              <span className="bg-gradient-to-r from-teal-800 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Geological Gathering
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              The 55th Annual Scientific Meeting of IAGI convenes together with the 19th Congress of
              Southeast Asian Geologists in Yogyakarta, creating the most influential regional
              earth-science forum of 2026.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid Row 1: Narrative Hero Card (2 cols) + ASEAN Union (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Card 1: Narrative & Strategic Thematic Pillars */}
          <ScrollReveal variant="fadeUp" delay={100} duration={700} sx={{ height: '100%' }}>
            <div className="lg:col-span-2 h-full relative overflow-hidden rounded-[28px] bg-white border border-slate-200/80 p-7 sm:p-9 shadow-[0_10px_35px_-8px_rgba(0,0,0,0.06)] flex flex-col justify-between group hover:border-teal-500/40 transition-all duration-300">
              {/* Subtle radial backdrop */}
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-bl from-teal-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200/60">
                    FLAGSHIP EVENT
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Yogyakarta, Indonesia</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  Shaping the Future of Southeast Asian Geosciences
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                  The joint 55th PIT IAGI &amp; GEOSEA XIX 2026 bridges high-level scientific dialogue
                  with industry applications. From advancing critical mineral exploration to
                  safeguarding populations against active geo-hazards, this conference sets the
                  agenda for regional resilience and environmental stewardship.
                </p>
              </div>

              {/* Key Thematic Badges */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Key Thematic Focus Areas
                </div>
                <div className="flex flex-wrap gap-2">
                  {themes.map((theme, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50/80 border border-slate-200/70 hover:border-teal-200 text-xs font-semibold text-slate-700 hover:text-teal-800 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: 8+ Southeast Asian Nations & Member Societies */}
          <ScrollReveal variant="fadeUp" delay={200} duration={700} sx={{ height: '100%' }}>
            <div className="h-full relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-[#07362f] p-7 sm:p-9 text-white shadow-[0_16px_40px_-8px_rgba(7,54,47,0.35)] flex flex-col justify-between group">
              {/* Top ambient glow */}
              <div className="absolute top-0 right-0 w-60 h-60 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-teal-300 mb-5 shadow-inner">
                  <Globe className="w-6 h-6 stroke-[1.8]" />
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono tracking-tight text-white">8+</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-500/30">
                    MEMBER SOCIETIES
                  </span>
                </div>

                <h4 className="text-xl font-bold text-white mt-2">Regional Union</h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Uniting geological societies across Southeast Asia to establish harmonized technical
                  standards and collaborative cross-border research.
                </p>
              </div>

              {/* Country Flag Pills */}
              <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                {memberNations.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-200"
                  >
                    <span className="text-base leading-none">{m.flag}</span>
                    <span className="truncate">{m.code} · {m.country}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bento Grid Row 2: 4 Sleek Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {stats.map((stat, i) => (
            <CountUpStatCard
              key={i}
              index={i}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
              sublabel={stat.sublabel}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Bento Grid Row 3: Why Attend - Four Pillars of Excellence */}
        <ScrollReveal variant="fadeUp" delay={100} duration={700}>
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-teal-700 uppercase mb-1">
              <Award className="w-4 h-4" />
              <span>CONFERENCE VALUE PROPOSITION</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Attend PIT IAGI – GEOSEA XIX?
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Four core advantages designed for researchers, industry leaders, and next-generation geoscientists.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyAttendPillars.map((pillar, i) => (
              <ScrollReveal key={i} variant="fadeUp" delay={i * 100} duration={600}>
                <div className="h-full relative rounded-[24px] bg-white border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_-8px_rgba(13,148,136,0.18)] hover:border-teal-500/50 transition-all duration-300 group hover:-translate-y-1.5">
                  {/* Top: Icon + Watermark Number */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pillar.colorClass} shadow-2xs group-hover:scale-110 transition-transform duration-300`}
                    >
                      {pillar.icon}
                    </div>
                    <span className="text-3xl font-black font-mono text-slate-200 group-hover:text-teal-200 transition-colors">
                      {pillar.number}
                    </span>
                  </div>

                  {/* Center: Title & Description */}
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors mb-2 leading-snug">
                      {pillar.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Bottom: Feature Tag Pill */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50/80 px-2.5 py-1 rounded-full border border-teal-200/50">
                      {pillar.tag}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
