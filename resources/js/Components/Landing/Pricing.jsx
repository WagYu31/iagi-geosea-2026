import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { 
    FileText, 
    Download, 
    UserCheck, 
    KeyRound, 
    UploadCloud, 
    ArrowRight,
    FileCheck2,
    Sparkles,
    FolderDown
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function Pricing({ settings = {} }) {
    const resources = settings.resources && settings.resources.length > 0
        ? settings.resources.filter(r => r.title && r.title.trim() !== '')
        : [];

    if (resources.length === 0) return null;

    // Helper to determine rich visual style, badges, and icons for each resource
    const getResourceMeta = (resource, index) => {
        const title = (resource.title || '').toLowerCase();
        
        if (title.includes('abstract guideline') || title.includes('pedoman')) {
            return {
                badge: 'PDF • GUIDELINE',
                docType: 'Official Document',
                badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
                accentGradient: 'from-teal-500 via-emerald-500 to-teal-600',
                iconBg: 'bg-teal-50/80 text-teal-600 border border-teal-200/70',
                glowColor: 'rgba(13, 148, 136, 0.15)',
                Icon: FileText,
                fallbackDesc: 'Comprehensive formatting, structure, and submission guidelines for oral & poster abstracts.',
            };
        }
        if (title.includes('registration') || title.includes('daftar') || title.includes('step 1')) {
            return {
                badge: 'STEP-BY-STEP • GUIDE',
                docType: 'User Manual',
                badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200/80',
                accentGradient: 'from-sky-500 via-blue-500 to-indigo-600',
                iconBg: 'bg-sky-50/80 text-sky-600 border border-sky-200/70',
                glowColor: 'rgba(2, 132, 199, 0.15)',
                Icon: UserCheck,
                fallbackDesc: 'Complete tutorial on creating an account, choosing participant packages, and completing payment.',
            };
        }
        if (title.includes('password') || title.includes('forgot') || title.includes('step 2')) {
            return {
                badge: 'SECURITY • FAQ',
                docType: 'Troubleshooting',
                badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200/80',
                accentGradient: 'from-amber-500 via-orange-500 to-amber-600',
                iconBg: 'bg-amber-50/80 text-amber-600 border border-amber-200/70',
                glowColor: 'rgba(245, 158, 11, 0.15)',
                Icon: KeyRound,
                fallbackDesc: 'Step-by-step instructions for self-service password reset and account verification recovery.',
            };
        }
        if (title.includes('submit') || title.includes('abstrak') || title.includes('step 3')) {
            return {
                badge: 'SUBMISSION • GUIDE',
                docType: 'Author Manual',
                badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200/80',
                accentGradient: 'from-purple-500 via-fuchsia-500 to-indigo-600',
                iconBg: 'bg-purple-50/80 text-purple-600 border border-purple-200/70',
                glowColor: 'rgba(147, 51, 234, 0.15)',
                Icon: UploadCloud,
                fallbackDesc: 'Walkthrough on uploading research papers, adding co-authors, and tracking review statuses.',
            };
        }

        // Generic fallback by index
        const fallbacks = [
            {
                badge: 'PDF • GUIDELINE',
                docType: 'Official Document',
                badgeStyle: 'bg-teal-50 text-teal-700 border-teal-200/80',
                accentGradient: 'from-teal-500 via-emerald-500 to-teal-600',
                iconBg: 'bg-teal-50/80 text-teal-600 border border-teal-200/70',
                glowColor: 'rgba(13, 148, 136, 0.15)',
                Icon: FileCheck2,
                fallbackDesc: 'Official conference documentation and guideline resource for delegates.',
            },
            {
                badge: 'PDF • TUTORIAL',
                docType: 'Procedure Guide',
                badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200/80',
                accentGradient: 'from-sky-500 via-blue-500 to-indigo-600',
                iconBg: 'bg-sky-50/80 text-sky-600 border border-sky-200/70',
                glowColor: 'rgba(2, 132, 199, 0.15)',
                Icon: UserCheck,
                fallbackDesc: 'Participant guide and procedure handbook for the convention.',
            },
            {
                badge: 'PDF • HELP',
                docType: 'Support Manual',
                badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200/80',
                accentGradient: 'from-amber-500 via-orange-500 to-amber-600',
                iconBg: 'bg-amber-50/80 text-amber-600 border border-amber-200/70',
                glowColor: 'rgba(245, 158, 11, 0.15)',
                Icon: KeyRound,
                fallbackDesc: 'Technical support documentation and self-help guide.',
            },
            {
                badge: 'PDF • GUIDE',
                docType: 'Author Guide',
                badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200/80',
                accentGradient: 'from-purple-500 via-fuchsia-500 to-indigo-600',
                iconBg: 'bg-purple-50/80 text-purple-600 border border-purple-200/70',
                glowColor: 'rgba(147, 51, 234, 0.15)',
                Icon: UploadCloud,
                fallbackDesc: 'Author portal guidelines and submission steps.',
            },
        ];
        return fallbacks[index % fallbacks.length];
    };

    // Determine grid columns dynamically: 
    // - 4 items: 4 columns on large screens (1 neat row), 2 on medium (2x2 balanced), 1 on mobile
    // - 3 items: 3 columns
    // - 2 items: 2 columns
    // - 1 item: 1 centered column
    const getGridCols = () => {
        if (resources.length === 1) return 'grid-cols-1 max-w-md mx-auto';
        if (resources.length === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto';
        if (resources.length === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto';
        if (resources.length === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto';
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto';
    };

    return (
        <Box
            id="resources"
            sx={{
                py: { xs: 8, sm: 12 },
                background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f0fdfa 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background subtle radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

            <Container
                maxWidth="xl"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 4, sm: 6 },
                    position: 'relative',
                    zIndex: 1,
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                {/* Header */}
                <Box sx={{ maxWidth: '700px', textAlign: 'center' }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: 'rgba(13, 148, 136, 0.1)',
                            borderRadius: '50px',
                            px: 2.5,
                            py: 0.7,
                            mb: 2,
                            border: '1px solid rgba(13, 148, 136, 0.2)',
                        }}
                    >
                        <FolderDown className="w-4 h-4 text-teal-600" />
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#0d9488',
                                fontWeight: 800,
                                letterSpacing: '0.15em',
                                fontSize: '0.75rem',
                            }}
                        >
                            DOWNLOADS & GUIDELINES
                        </Typography>
                    </Box>

                    <Typography
                        component="h2"
                        variant="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 900,
                            color: '#0f172a',
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {settings.resources_title || 'Conference Resources'}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#64748b',
                            fontSize: { xs: '0.95rem', md: '1.05rem' },
                            lineHeight: 1.6,
                        }}
                    >
                        {settings.resources_description || 'Download important documents, templates, and guidelines for the 55th PIT IAGI - GEOSEA XIX 2026.'}
                    </Typography>
                </Box>

                {/* Symmetrical Modern Resource Hub Grid */}
                <div className={`grid ${getGridCols()} gap-5 sm:gap-6 w-full`}>
                    {resources.map((resource, index) => {
                        const meta = getResourceMeta(resource, index);
                        const { Icon } = meta;
                        const fileUrl = resource.file_url || resource.url || '#';
                        const displayDesc = (resource.description && !resource.description.toLowerCase().startsWith('about your account'))
                            ? resource.description
                            : meta.fallbackDesc;

                        return (
                            <ScrollReveal
                                key={index}
                                variant="fadeUp"
                                delay={index * 120}
                                duration={600}
                                className="h-full"
                            >
                                <div className="group relative h-full flex flex-col justify-between bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_18px_36px_-6px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
                                    {/* Top colorful accent stripe */}
                                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${meta.accentGradient}`} />

                                    {/* Subtle hover background highlight */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                    {/* Top Metadata Row: Icon & Format Pill */}
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between gap-2 mb-4">
                                            {/* Modern 3D Rounded Icon */}
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${meta.iconBg} shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-6 h-6 stroke-[2.2]" />
                                            </div>

                                            {/* Format Badge */}
                                            <span className={`text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-full border shadow-2xs uppercase ${meta.badgeStyle}`}>
                                                {meta.badge}
                                            </span>
                                        </div>

                                        {/* Document Category / Type */}
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                            {meta.docType}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base sm:text-[17px] font-bold text-slate-800 leading-snug mb-2 group-hover:text-teal-600 transition-colors">
                                            {resource.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-xs text-slate-600 leading-relaxed mb-6">
                                            {displayDesc}
                                        </p>
                                    </div>

                                    {/* Bottom Action Area */}
                                    <div className="relative z-10 pt-4 border-t border-slate-100">
                                        <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            aria-label={`Download ${resource.title}`}
                                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50/90 hover:bg-teal-600 border border-slate-200/80 hover:border-teal-600 text-slate-700 hover:text-white font-semibold text-xs transition-all duration-200 group/btn shadow-2xs hover:shadow-md"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Download className="w-4 h-4 text-teal-600 group-hover/btn:text-white transition-colors group-hover/btn:-translate-y-0.5 group-hover/btn:translate-y-0.5" />
                                                <span>Download File</span>
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                                        </a>
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </Container>
        </Box>
    );
}
