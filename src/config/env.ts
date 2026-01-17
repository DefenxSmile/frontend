/**
 * Конфигурация приложения на основе переменных окружения
 * Все переменные должны начинаться с VITE_ для доступности в клиентском коде
 */

export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,

  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'TableBook',
  appVersion: import.meta.env.VITE_APP_VERSION || '0.0.0',

  // Feature Flags
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',

  // Base URL
  baseUrl: import.meta.env.VITE_BASE_URL || import.meta.env.BASE_URL || '/',

  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const

// Валидация обязательных переменных окружения в production
if (config.isProduction) {
  const requiredVars = ['VITE_API_URL']
  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  )

  if (missingVars.length > 0) {
    console.warn(
      `Missing required environment variables: ${missingVars.join(', ')}`
    )
  }
}

// Экспорт типов для TypeScript
export type Config = typeof config

