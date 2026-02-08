import { createTheme } from '@mui/material/styles';

// Design tokens that adapt to light/dark mode
export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#0d7a6a',
      light: '#4dd4ac',
      dark: '#094d42',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#20c997',
      light: '#4dd4ac',
      dark: '#17a689',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: mode === 'dark' ? '#0f1117' : '#ffffff',
      paper: mode === 'dark' ? '#1a1d27' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#e5e7eb' : '#111827',
      secondary: mode === 'dark' ? '#9ca3af' : '#6b7280',
    },
    divider: mode === 'dark' ? '#2d3748' : '#f0f0f0',
    grey: {
      50: mode === 'dark' ? '#1a1d27' : '#f9fafb',
      100: mode === 'dark' ? '#1f2937' : '#f3f4f6',
      200: mode === 'dark' ? '#374151' : '#e5e7eb',
      300: mode === 'dark' ? '#4b5563' : '#d1d5db',
      400: mode === 'dark' ? '#6b7280' : '#9ca3af',
      500: mode === 'dark' ? '#9ca3af' : '#6b7280',
      600: mode === 'dark' ? '#d1d5db' : '#4b5563',
      700: mode === 'dark' ? '#e5e7eb' : '#374151',
      800: mode === 'dark' ? '#f3f4f6' : '#1f2937',
      900: mode === 'dark' ? '#f9fafb' : '#111827',
    },
    // Custom tokens for dark mode support
    custom: {
      cardBg: mode === 'dark' ? '#1a1d27' : '#ffffff',
      cardBorder: mode === 'dark' ? '#2d3748' : '#f0f0f0',
      cardBorderHover: mode === 'dark' ? '#4b5563' : '#e5e7eb',
      surfaceBg: mode === 'dark' ? '#141721' : '#fafbfc',
      headerBg: mode === 'dark' ? '#0f1117' : '#f8fafb',
      sidebarBg: mode === 'dark' ? '#0f1117' : '#ffffff',
      sidebarHeaderBg: mode === 'dark'
        ? 'linear-gradient(160deg, #041f1a 0%, #0a3d33 45%, #0c4a3e 100%)'
        : 'linear-gradient(160deg, #064e3b 0%, #0d7a6a 45%, #0f766e 100%)',
      appBarBg: mode === 'dark' ? 'rgba(15, 17, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      appBarBorder: mode === 'dark' ? '#2d3748' : '#f0f0f0',
      textPrimary: mode === 'dark' ? '#e5e7eb' : '#111827',
      textSecondary: mode === 'dark' ? '#9ca3af' : '#6b7280',
      textMuted: mode === 'dark' ? '#6b7280' : '#9ca3af',
      // Chip backgrounds (softer in dark mode)
      chipGreenBg: mode === 'dark' ? 'rgba(5, 150, 105, 0.15)' : '#ecfdf5',
      chipGreenBorder: mode === 'dark' ? 'rgba(5, 150, 105, 0.3)' : '#d1fae5',
      chipGreenText: mode === 'dark' ? '#34d399' : '#059669',
      chipRedBg: mode === 'dark' ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2',
      chipRedBorder: mode === 'dark' ? 'rgba(220, 38, 38, 0.3)' : '#fecaca',
      chipRedText: mode === 'dark' ? '#f87171' : '#dc2626',
      chipBlueBg: mode === 'dark' ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff',
      chipBlueBorder: mode === 'dark' ? 'rgba(37, 99, 235, 0.3)' : '#dbeafe',
      chipBlueText: mode === 'dark' ? '#60a5fa' : '#2563eb',
      chipAmberBg: mode === 'dark' ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb',
      chipAmberBorder: mode === 'dark' ? 'rgba(217, 119, 6, 0.3)' : '#fde68a',
      chipAmberText: mode === 'dark' ? '#fbbf24' : '#d97706',
      chipGrayBg: mode === 'dark' ? 'rgba(107, 114, 128, 0.15)' : '#f9fafb',
      chipGrayBorder: mode === 'dark' ? 'rgba(107, 114, 128, 0.3)' : '#e5e7eb',
      chipGrayText: mode === 'dark' ? '#9ca3af' : '#6b7280',
      // Hover states
      rowHover: mode === 'dark' ? '#1f2937' : '#f9fafb',
      // Alert card bg
      alertBg: mode === 'dark' ? 'rgba(245, 158, 11, 0.08)' : '#fffef5',
      alertBorder: mode === 'dark' ? 'rgba(253, 230, 138, 0.2)' : '#fde68a',
      // Button soft bg
      btnSoftBg: mode === 'dark' ? 'rgba(13, 122, 106, 0.12)' : '#f0fdf4',
      btnSoftBgHover: mode === 'dark' ? 'rgba(13, 122, 106, 0.2)' : '#ecfdf5',
      btnSoftBorder: mode === 'dark' ? 'rgba(209, 250, 229, 0.2)' : '#d1fae5',
      // Info box
      infoBg: mode === 'dark' ? 'rgba(37, 99, 235, 0.1)' : '#eff6ff',
      infoBorder: mode === 'dark' ? 'rgba(37, 99, 235, 0.2)' : '#dbeafe',
    },
    // Gradient definitions
    gradient: {
      primary: 'linear-gradient(135deg, #0d7a6a 0%, #0f8574 40%, #11967e 100%)',
      hero: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 30%, #0f8574 60%, #11967e 100%)',
      heroOverlay: 'linear-gradient(135deg, rgba(13, 122, 106, 0.95) 0%, rgba(15, 133, 116, 0.90) 50%, rgba(17, 150, 126, 0.95) 100%)',
      teal: 'linear-gradient(135deg, #0d7a6a 0%, #20c997 100%)',
      secondary: 'linear-gradient(135deg, #20c997 0%, #4dd4ac 100%)',
      accent: 'linear-gradient(135deg, #4dd4ac 0%, #20c997 100%)',
      subtle: 'linear-gradient(135deg, rgba(13, 122, 106, 0.05) 0%, rgba(32, 201, 151, 0.08) 100%)',
      darkTeal: 'linear-gradient(135deg, #094d42 0%, #0d7a6a 50%, #0f8574 100%)',
    },
    accent: {
      teal: '#0d7a6a',
      lightTeal: '#4dd4ac',
      brightTeal: '#20c997',
      darkTeal: '#094d42',
      cyan: '#06b6d4',
      white: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.3 },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600, letterSpacing: '0em' },
    h6: { fontWeight: 600, letterSpacing: '0.01em' },
    body1: { lineHeight: 1.7, letterSpacing: '0em', fontWeight: 400 },
    body2: { lineHeight: 1.6, letterSpacing: '0em', fontWeight: 400 },
    button: { fontWeight: 600, letterSpacing: '0.03em', textTransform: 'none' },
    overline: { fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0px 2px 4px rgba(9, 77, 66, 0.1), 0px 1px 2px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(9, 77, 66, 0.12), 0px 2px 4px rgba(0,0,0,0.06)',
    '0px 6px 12px rgba(9, 77, 66, 0.14), 0px 3px 6px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(9, 77, 66, 0.16), 0px 4px 8px rgba(0,0,0,0.10)',
    '0px 12px 24px rgba(9, 77, 66, 0.18), 0px 6px 12px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(9, 77, 66, 0.20), 0px 8px 16px rgba(0,0,0,0.14)',
    '0px 20px 40px rgba(9, 77, 66, 0.22), 0px 10px 20px rgba(0,0,0,0.16)',
    '0px 24px 48px rgba(9, 77, 66, 0.24), 0px 12px 24px rgba(0,0,0,0.18)',
    '0px 28px 56px rgba(9, 77, 66, 0.26), 0px 14px 28px rgba(0,0,0,0.20)',
    '0px 32px 64px rgba(9, 77, 66, 0.28), 0px 16px 32px rgba(0,0,0,0.22)',
    '0px 36px 72px rgba(9, 77, 66, 0.30), 0px 18px 36px rgba(0,0,0,0.24)',
    '0px 40px 80px rgba(9, 77, 66, 0.32), 0px 20px 40px rgba(0,0,0,0.26)',
    '0px 44px 88px rgba(9, 77, 66, 0.34), 0px 22px 44px rgba(0,0,0,0.28)',
    '0px 48px 96px rgba(9, 77, 66, 0.36), 0px 24px 48px rgba(0,0,0,0.30)',
    '0px 52px 104px rgba(9, 77, 66, 0.38), 0px 26px 52px rgba(0,0,0,0.32)',
    '0px 56px 112px rgba(9, 77, 66, 0.40), 0px 28px 56px rgba(0,0,0,0.34)',
    '0px 60px 120px rgba(9, 77, 66, 0.42), 0px 30px 60px rgba(0,0,0,0.36)',
    '0px 64px 128px rgba(9, 77, 66, 0.44), 0px 32px 64px rgba(0,0,0,0.38)',
    '0px 68px 136px rgba(9, 77, 66, 0.46), 0px 34px 68px rgba(0,0,0,0.40)',
    '0px 72px 144px rgba(9, 77, 66, 0.48), 0px 36px 72px rgba(0,0,0,0.42)',
    '0px 76px 152px rgba(9, 77, 66, 0.50), 0px 38px 76px rgba(0,0,0,0.44)',
    '0px 80px 160px rgba(9, 77, 66, 0.52), 0px 40px 80px rgba(0,0,0,0.46)',
    '0px 84px 168px rgba(9, 77, 66, 0.54), 0px 42px 84px rgba(0,0,0,0.48)',
    '0px 88px 176px rgba(9, 77, 66, 0.56), 0px 44px 88px rgba(0,0,0,0.50)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          textTransform: 'none',
          padding: '12px 28px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '0.95rem',
          '&:hover': { transform: 'translateY(-2px)' },
        },
        contained: {
          boxShadow: '0 4px 14px rgba(9, 77, 66, 0.25)',
          '&:hover': { boxShadow: '0 8px 24px rgba(9, 77, 66, 0.35)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #20c997 0%, #17a689 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #17a689 0%, #138f75 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { transform: 'translateY(-4px)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, borderRadius: 8 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'dark' ? 'rgba(15, 17, 23, 0.95)' : 'rgba(9, 77, 66, 0.98)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove MUI's default dark mode paper gradient
        },
      },
    },
  },
});

// Default light theme export (for backward compatibility with landing page etc.)
const theme = createTheme(getDesignTokens('light'));
export default theme;
