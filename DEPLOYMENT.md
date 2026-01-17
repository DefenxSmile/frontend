# Деплой проекта TableBook

## GitHub Pages

Проект автоматически деплоится на GitHub Pages при каждом push в ветку `main`.

### Настройка GitHub Pages

1. Перейдите в настройки репозитория: `Settings` → `Pages`
2. В разделе "Source" выберите:
   - **Source**: `GitHub Actions`
3. Сохраните изменения

### URL приложения

После деплоя приложение будет доступно по адресу:
```
https://DefenxSmile.github.io/frontend/
```

### Локальная проверка production сборки

Для проверки production сборки локально:

```bash
npm run build
npm run preview
```

## CI/CD Pipeline

### Workflow файлы

- **`.github/workflows/deploy.yml`** — автоматический деплой на GitHub Pages
- **`.github/workflows/ci.yml`** — проверка кода (lint, TypeScript, сборка)

### Триггеры

- **Автоматический деплой**: при push в `main`
- **CI проверки**: при push и pull request в `main` или `develop`
- **Ручной запуск**: через GitHub Actions UI (workflow_dispatch)

### Этапы деплоя

1. **Checkout** — получение кода из репозитория
2. **Setup Node.js** — установка Node.js 20 с кэшированием npm
3. **Install dependencies** — установка зависимостей (`npm ci`)
4. **Run linter** — проверка кода линтером
5. **Build project** — сборка production версии
6. **Upload artifact** — загрузка собранных файлов
7. **Deploy to GitHub Pages** — деплой на GitHub Pages

## Переменные окружения

Для production сборки можно добавить переменные окружения в настройках репозитория:

1. Перейдите в `Settings` → `Secrets and variables` → `Actions`
2. Добавьте необходимые переменные:
   - `VITE_API_URL` — URL API бекенда
   - `VITE_APP_NAME` — название приложения
   - И другие по необходимости

Использование в workflow:

```yaml
- name: Build project
  run: npm run build
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

## Troubleshooting

### Проблема: Страница не загружается после деплоя

**Решение**: Проверьте, что в `vite.config.ts` указан правильный `base` path:
```typescript
base: process.env.NODE_ENV === 'production' ? '/frontend/' : '/'
```

### Проблема: Роутинг не работает на GitHub Pages

**Решение**: Убедитесь, что в `main.tsx` используется `basename`:
```typescript
<BrowserRouter basename={basename}>
```

### Проблема: GitHub Actions не запускается

**Решение**: 
1. Проверьте, что файлы workflow находятся в `.github/workflows/`
2. Убедитесь, что в настройках репозитория включены GitHub Actions
3. Проверьте права доступа для GitHub Actions

### Просмотр логов деплоя

1. Перейдите в раздел `Actions` репозитория
2. Выберите нужный workflow run
3. Просмотрите логи каждого шага

## Альтернативные платформы для деплоя

### Vercel

1. Установите Vercel CLI: `npm i -g vercel`
2. Запустите: `vercel`
3. Или подключите репозиторий через веб-интерфейс Vercel

### Netlify

1. Установите Netlify CLI: `npm i -g netlify-cli`
2. Запустите: `netlify deploy --prod`
3. Или подключите репозиторий через веб-интерфейс Netlify

### Cloudflare Pages

1. Подключите репозиторий через Cloudflare Dashboard
2. Укажите build command: `npm run build`
3. Укажите output directory: `dist`

