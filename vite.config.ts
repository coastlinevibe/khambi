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
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animations';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'vendor-icons';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('tsparticles') || id.includes('react-beautiful-dnd')) {
              return 'vendor-heavy';
            }
            return 'vendor-misc';
          }
          
          // Component chunks
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
          if (id.includes('/components/')) {
            return 'components';
          }
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
    chunkSizeWarningLimit: 200,
    // Optimize assets - reduce inline limit for better caching
    assetsInlineLimit: 1024,
    cssCodeSplit: true,
    // Experimental: reduce bundle size
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
