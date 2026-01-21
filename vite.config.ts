import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const baseUrl = env.VITE_BASE_URL || (mode === 'production' ? '/frontend/' : '/')
  const apiUrl = env.VITE_API_URL || 'https://restaurant-api.defenx.crazedns.ru'

  return {
    plugins: [react()],
    base: baseUrl,
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''), // Убираем /api из пути при проксировании
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
