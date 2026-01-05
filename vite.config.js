import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/mattress-pwa/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Mattress & Foam PWA',
        short_name: 'MattressPWA',
        description: 'Custom and standard mattresses with VIP features',
        theme_color: '#0ea5e9',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/mattress-pwa/',
        icons: [
          { src: '/mattress-pwa/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/mattress-pwa/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/mattress-pwa/icons/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],
  server: { port: 5173 }
});
