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
            <Head title="55TH IAGI - GEOSEA XIX 2026" />

            <AppAppBar auth={auth} />

            <Box sx={{ bgcolor: 'background.default' }}>
                <Hero settings={settings} auth={auth} />
                <LogoCollection settings={settings} />
                <Features settings={settings} />
                <Highlights settings={settings} />
                <Pricing settings={settings} />
                <Testimonials settings={settings} />
                <FAQ settings={settings} />
                <Footer settings={settings} auth={auth} />
            </Box>
        </ThemeProvider>
    );
}
