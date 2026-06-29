import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const isGhPages = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';

export default defineConfig({
  base: isGhPages && repoName ? `/${repoName}/` : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'brand/img.jpg', 'brand/img2.jpg', 'brand/icon-192.png', 'brand/icon-512.png'],
      manifest: {
        name: 'HUST Quiz',
        short_name: 'HUST Quiz',
        start_url: '.',
        display: 'standalone',
        background_color: '#f4f1ea',
        theme_color: '#214e34',
        icons: [
          {
            src: 'brand/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'brand/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
