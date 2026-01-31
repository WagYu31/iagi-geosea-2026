import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-mui-core': ['@mui/material', '@mui/system', '@mui/styled-engine'],
                    'vendor-mui-icons': ['@mui/icons-material'],
                    'vendor-mui-charts': ['@mui/x-charts', '@mui/x-data-grid'],
                    'vendor-inertia': ['@inertiajs/react'],
                    'vendor-utils': ['react-countdown', 'prop-types', 'use-sync-external-store'],

                    // Application chunks
                    'pages-auth': [
                        './resources/js/Pages/Auth/Login.jsx',
                        './resources/js/Pages/Auth/Register.jsx',
                        './resources/js/Pages/Auth/ConfirmPassword.jsx',
                        './resources/js/Pages/Auth/ForgotPassword.jsx',
                        './resources/js/Pages/Auth/ResetPassword.jsx',
                        './resources/js/Pages/Auth/VerifyEmail.jsx'
                    ],
                    'pages-admin': [
                        './resources/js/Pages/Admin/Dashboard.jsx',
                        './resources/js/Pages/Admin/Submissions.jsx',
                        './resources/js/Pages/Admin/Payments.jsx'
                    ],
                    'pages-profile': [
                        './resources/js/Pages/Profile/Edit.jsx'
                    ],
                    'layouts': [
                        './resources/js/Layouts/AuthenticatedLayout.jsx',
                        './resources/js/Layouts/GuestLayout.jsx',
                        './resources/js/Layouts/MUIGuestLayout.jsx',
                        './resources/js/Layouts/SidebarLayout.jsx'
                    ],
                    'components': [
                        './resources/js/Components/ApplicationLogo.jsx',
                        './resources/js/Components/Checkbox.jsx',
                        './resources/js/Components/DangerButton.jsx',
                        './resources/js/Components/Dropdown.jsx',
                        './resources/js/Components/InputError.jsx',
                        './resources/js/Components/InputLabel.jsx',
                        './resources/js/Components/Modal.jsx',
                        './resources/js/Components/NavLink.jsx',
                        './resources/js/Components/PrimaryButton.jsx',
                        './resources/js/Components/ResponsiveNavLink.jsx',
                        './resources/js/Components/SecondaryButton.jsx',
                        './resources/js/Components/TextInput.jsx'
                    ]
                }
            }
        },
        chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb
    },
});
