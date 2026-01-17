import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения
  const env = loadEnv(mode, process.cwd(), '')
  
  // Определяем base URL из переменной окружения или используем дефолтное значение
  const baseUrl = env.VITE_BASE_URL || (mode === 'production' ? '/frontend/' : '/')

  return {
    plugins: [react()],
    base: baseUrl,
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
    // Переменные окружения доступны через import.meta.env
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '0.0.0'),
    },
  }
})
