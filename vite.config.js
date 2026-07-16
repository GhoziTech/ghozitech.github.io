import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
    },
    build: {
        chunkSizeWarningLimit: 950,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                    three: ['three', '@react-three/fiber'],
                    motion: ['gsap', 'lenis'],
                },
            },
        },
    },
    preview: {
        host: '0.0.0.0',
        port: 4173,
        strictPort: true,
    },
});
