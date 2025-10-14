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
  },
  build: {
    // Optimize for mobile performance
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['framer-motion'],
          icons: ['lucide-react', 'react-icons'],
          ui: ['@radix-ui/react-avatar', '@radix-ui/react-slot'],
          particles: ['@tsparticles/react', '@tsparticles/slim'],
          dnd: ['react-beautiful-dnd'],
          utils: ['class-variance-authority', 'clsx', 'tailwind-merge'],
        },
        // Optimize chunk loading
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      // Enable tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      // Reduce bundle size
      external: (id) => {
        // Don't bundle large dependencies that can be loaded separately
        return false;
      },
    },
    // Enable gzip compression
    reportCompressedSize: true,
    chunkSizeWarningLimit: 300,
    // Optimize assets
    assetsInlineLimit: 2048,
    cssCodeSplit: true,
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
