import React from 'react';
import { Head } from '@inertiajs/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import AppAppBar from '../Components/Landing/AppAppBar';
import Hero from '../Components/Landing/Hero';
import LogoCollection from '../Components/Landing/LogoCollection';
import Features from '../Components/Landing/Features';
import Highlights from '../Components/Landing/Highlights';
import Pricing from '../Components/Landing/Pricing';
import Testimonials from '../Components/Landing/Testimonials';
import FAQ from '../Components/Landing/FAQ';
import Footer from '../Components/Landing/Footer';
import ScrollReveal from '../Components/Landing/ScrollReveal';

// Force light-mode theme for the landing page
const landingTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#094d42',
            light: '#0d7a6a',
            dark: '#073d34',
        },
        secondary: {
            main: '#4dd4ac',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#111827',
            secondary: '#6b7280',
        },
        divider: '#e5e7eb',
    },
    typography: {
        fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: { scrollBehavior: 'smooth' },
            },
        },
    },
});

export default function LandingPage({ auth, serverSettings }) {
    const settings = serverSettings || {};

    return (
        <ThemeProvider theme={landingTheme}>
            <CssBaseline enableColorScheme />
            <Head title="55TH PIT IAGI - GEOSEA XIX 2026 | International Geological Conference">
                <meta name="description" content="Join the 55th Annual Convention of the Indonesian Association of Geologists (IAGI) and GEOSEA XIX 2026 — Southeast Asia's premier geological conference. Register now for keynote sessions, workshops, and networking opportunities." />
                <meta name="robots" content="index, follow" />
            </Head>

            <AppAppBar auth={auth} />

            <Box sx={{ bgcolor: 'background.default' }}>
                <Hero settings={settings} auth={auth} />

                <ScrollReveal variant="fadeUp" duration={900}>
                    <LogoCollection settings={settings} />
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" duration={900} delay={100}>
                    <Features settings={settings} />
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" duration={900}>
                    <Highlights settings={settings} />
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" duration={900} delay={100}>
                    <Pricing settings={settings} />
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" duration={900}>
                    <Testimonials settings={settings} />
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" duration={900} delay={100}>
                    <FAQ settings={settings} />
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" duration={900}>
                    <Footer settings={settings} auth={auth} />
                </ScrollReveal>
            </Box>
        </ThemeProvider>
    );
}

