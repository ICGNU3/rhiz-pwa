import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico', 
        'rhiz-logo-apple-touch.png', 
        'rhiz-logo-maskable-192.png',
        'rhiz-logo-maskable-512.png',
        'rhiz-logo-192.png',
        'rhiz-logo-512.png'
      ],
      manifest: {
        name: 'Rhiz - Intelligent Relationship Engine',
        short_name: 'Rhiz',
        description: 'Transform your scattered contacts into an intelligent relationship engine with trust scores, goal-driven matching, and AI assistance.',
        theme_color: '#1ABC9C',
        background_color: '#0F172A',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/login',
        icons: [
          {
            src: 'rhiz-logo-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'rhiz-logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'rhiz-logo-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'rhiz-logo-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: 'rhiz-screenshot-mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Rhiz mobile interface showing network intelligence dashboard'
          },
          {
            src: 'rhiz-screenshot-desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Rhiz desktop interface with relationship graph visualization'
          }
        ],
        shortcuts: [
          {
            name: 'AI Assistant',
            short_name: 'Ask AI',
            description: 'Get intelligent insights about your network',
            url: '/app/intelligence',
            icons: [{ src: 'rhiz-logo-192.png', sizes: '192x192' }]
          },
          {
            name: 'Add Contact',
            short_name: 'Add Contact',
            description: 'Quickly add a new contact to your network',
            url: '/app/contacts?action=add',
            icons: [{ src: 'rhiz-logo-192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^.*\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'rhiz-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'rhiz-images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'rhiz-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^.*\/(app|login|dashboard|contacts|goals|intelligence|network|trust|settings|import).*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'rhiz-pages-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              },
              networkTimeoutSeconds: 3
            }
          }
        ],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: '/offline'
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'supabase': ['@supabase/supabase-js'],
          'tanstack-query': ['@tanstack/react-query'],
          'lucide': ['lucide-react']
        }
      }
    },
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Generate source maps for production
    sourcemap: false
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: false
  },
  // Improve server performance
  server: {
    hmr: {
      overlay: false
    }
  }
});