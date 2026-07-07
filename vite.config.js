import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png'],
      manifest: {
        name: 'Concurso de Belleza',
        short_name: 'CdB',
        description: 'Juego de estrategia y lógica basado en el Rey de Diamantes',
        theme_color: '#111827',      
        background_color: '#111827', 
        display: 'fullscreen',      
        orientation: 'portrait',     
        icons: [
          {
            src: '/logo-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  base: '/',
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    hmr: {
      clientPort: 5173 
    }
  }
})