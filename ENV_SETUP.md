# Настройка переменных окружения

## Обзор

Проект использует переменные окружения через файлы `.env` для настройки различных параметров в зависимости от окружения (development/production).

## Структура файлов

- `.env.example` — пример файла с описанием всех переменных
- `.env.development` — переменные для локальной разработки (коммитится в репозиторий)
- `.env.production` — переменные для production сборки (коммитится в репозиторий)
- `.env.local` — локальные переопределения (не коммитится, добавлен в .gitignore)
- `.env.development.local` — локальные переопределения для development (не коммитится)
- `.env.production.local` — локальные переопределения для production (не коммитится)

## Доступные переменные

### API Configuration

```env
VITE_API_URL=http://localhost:3000/api          # URL API бекенда
VITE_API_TIMEOUT=10000                          # Таймаут запросов в мс
```

### App Configuration

```env
VITE_APP_NAME=TableBook                         # Название приложения
VITE_APP_VERSION=0.0.0                          # Версия приложения
```

### Feature Flags

```env
VITE_ENABLE_DEBUG=true                          # Включить отладочные логи
VITE_ENABLE_MOCK_API=true                       # Использовать мок API
```

### Base URL

```env
VITE_BASE_URL=/frontend/                        # Base URL для роутинга (для GitHub Pages)
```

## Использование в коде

### Через import.meta.env

```typescript
const apiUrl = import.meta.env.VITE_API_URL
const isDebug = import.meta.env.VITE_ENABLE_DEBUG === 'true'
```

### Через config файл (рекомендуется)

```typescript
import { config } from './config/env'

console.log(config.apiUrl)
console.log(config.enableDebug)
```

## Настройка для локальной разработки

1. Скопируйте `.env.example` в `.env.development.local` (опционально, если нужны переопределения)
2. Отредактируйте значения под ваши нужды
3. Перезапустите dev сервер: `npm run dev`

## Настройка для production

### Локальная сборка

1. Создайте `.env.production.local` (опционально)
2. Заполните необходимые переменные
3. Запустите сборку: `npm run build`

### GitHub Actions (CI/CD)

Переменные окружения можно настроить через Secrets в GitHub:

1. Перейдите в `Settings` → `Secrets and variables` → `Actions`
2. Добавьте необходимые переменные:
   - `VITE_API_URL` — URL production API
   - `VITE_APP_VERSION` — версия приложения
   - И другие по необходимости

3. Они автоматически будут использоваться в workflow файле `.github/workflows/deploy.yml`

## Приоритет загрузки переменных

Vite загружает переменные в следующем порядке (более поздние переопределяют более ранние):

1. `.env`
2. `.env.local`
3. `.env.[mode]` (например, `.env.development`)
4. `.env.[mode].local` (например, `.env.development.local`)

## Важные замечания

### Безопасность

⚠️ **ВАЖНО**: Переменные окружения, начинающиеся с `VITE_`, доступны в клиентском коде!

- ❌ **НЕ** храните секретные ключи (API keys, tokens) в переменных `VITE_*`
- ✅ Используйте их только для публичных конфигураций (URLs, feature flags)
- ✅ Для секретов используйте backend API

### Типы переменных

Все переменные окружения в Vite являются строками. Для булевых значений используйте:

```typescript
const isEnabled = import.meta.env.VITE_FEATURE_FLAG === 'true'
```

Для чисел:

```typescript
const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 10000
```

## Примеры использования

### Настройка API клиента

```typescript
// src/api/client.ts
import { config } from '../config/env'

const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
})
```

### Условная логика на основе feature flags

```typescript
import { config } from './config/env'

if (config.enableDebug) {
  console.log('Debug mode enabled')
}

if (config.enableMockApi) {
  // Использовать мок данные
}
```

### Логирование в development

```typescript
import { config } from './config/env'

if (config.isDevelopment && config.enableDebug) {
  console.log('Development mode:', config)
}
```

## Troubleshooting

### Переменные не загружаются

1. Убедитесь, что переменные начинаются с `VITE_`
2. Перезапустите dev сервер после изменения `.env` файлов
3. Проверьте, что файл находится в корне проекта

### Неправильные значения в production

1. Проверьте, что `.env.production` содержит правильные значения
2. Убедитесь, что в GitHub Secrets настроены нужные переменные
3. Проверьте логи GitHub Actions для отладки

### Base URL не работает

1. Убедитесь, что `VITE_BASE_URL` соответствует пути репозитория на GitHub Pages
2. Проверьте, что `basename` в `BrowserRouter` использует правильное значение
3. Для корневого домена используйте `VITE_BASE_URL=/`

