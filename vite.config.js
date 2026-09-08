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
        chunkSizeWarningLimit: 1500,
    },
});
