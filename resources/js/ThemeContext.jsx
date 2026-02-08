import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getDesignTokens } from './theme';

const ThemeContext = createContext({
    mode: 'light',
    toggleMode: () => { },
});

export const useThemeMode = () => useContext(ThemeContext);

export function ThemeContextProvider({ children }) {
    const [mode, setMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme-mode') || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme-mode', mode);
        // Set class on body for Tailwind/CSS dark mode
        document.documentElement.classList.toggle('dark', mode === 'dark');
    }, [mode]);

    const toggleMode = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    const contextValue = useMemo(() => ({ mode, toggleMode }), [mode]);

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default ThemeContext;
