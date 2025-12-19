import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Toolkit Lab',
        short_name: 'Toolkit',
        description: 'Ultra-fast, secure, and client-side conversion tools.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Online-only configuration to ensure ads load
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'documents',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              }
            }
          }
        ],
        // Don't cache everything by default to save storage and ensure freshness
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      }
    })
  ],
  define: {
    // Polyfill 'global' for Magenta.js dependencies
    'global': 'window',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ffmpeg: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util', 'onnxruntime-web'],
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
});
