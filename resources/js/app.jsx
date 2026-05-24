import '../css/app.css';
import '../css/premium-geological.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeContextProvider } from './ThemeContext';
import axios from 'axios';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Global 419 handler: auto-reload page when CSRF token expires
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 419) {
            window.location.reload();
            return new Promise(() => {}); // prevent further error handling
        }
        return Promise.reject(error);
    }
);

// Inertia global error handler for 419
router.on('invalid', (event) => {
    if (event.detail.response.status === 419) {
        event.preventDefault();
        window.location.reload();
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeContextProvider>
                <App {...props} />
            </ThemeContextProvider>
        );
    },
    progress: {
        color: '#1abc9c',
        showSpinner: true,
    },
});
