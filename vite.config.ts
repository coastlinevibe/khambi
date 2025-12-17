import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Ensure only one React instance is bundled to prevent "Invalid hook call"
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['framer-motion', 'react-router-dom'],
    // Force pre-bundling of heavy dependencies
    force: true,
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'framer-motion'],
        },
      },
    },
    sourcemap: false,
  },
  css: {
    postcss: './postcss.config.js',
    devSourcemap: false,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: 'localhost',
  },
});
