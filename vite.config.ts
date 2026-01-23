import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const baseUrl = env.VITE_BASE_URL || (mode === 'production' ? '/frontend/' : '/')
  // Базовый URL API без /api/v1 (прокси добавит это автоматически)
  const apiUrl = env.VITE_API_URL || 'https://restaurant-api.defenx.crazedns.ru'

  return {
    plugins: [react()],
    base: baseUrl,
    server: {
      proxy: {
        '/api': {
          target: apiUrl || 'https://restaurant-api.defenx.crazedns.ru',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
      cors: false,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
            konva: ['konva', 'react-konva'],
          },
        },
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '0.0.0'),
    },
  }
})
