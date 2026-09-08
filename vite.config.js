import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

import fs from 'fs';

// Plugin to generate version.txt on each build
function versionPlugin() {
    return {
        name: 'version-generator',
        closeBundle() {
            const version = Date.now().toString();
            fs.mkdirSync('public/build', { recursive: true });
            fs.writeFileSync('public/build/version.txt', version);
            console.log(`[version] Build version: ${version}`);
        }
    };
}

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        versionPlugin(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('@mui/x-charts') || id.includes('@mui/x-data-grid')) {
                            return 'vendor-mui-charts';
                        }
                        if (id.includes('@mui/icons-material')) {
                            return 'vendor-mui-icons';
                        }
                        if (id.includes('@mui/material') || id.includes('@mui/system') || id.includes('@mui/styled-engine') || id.includes('@emotion')) {
                            return 'vendor-mui-core';
                        }
                        if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                            return 'vendor-react';
                        }
                        if (id.includes('@inertiajs') || id.includes('axios')) {
                            return 'vendor-inertia';
                        }
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
});
