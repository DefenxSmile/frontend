# Варианты деплоя проекта TableBook

## Проблема с GitHub Pages для приватных репозиториев

GitHub Pages для приватных репозиториев доступен только на платных планах (Pro, Team, Enterprise). Для бесплатных аккаунтов GitHub Pages работает только с публичными репозиториями.

## Решения

### Вариант 1: Сделать репозиторий публичным (рекомендуется для open-source)

Если проект можно сделать публичным:

1. Перейдите в `Settings` → `Danger Zone` → `Change visibility`
2. Выберите "Make public"
3. GitHub Actions и GitHub Pages заработают автоматически

**Преимущества:**
- ✅ Бесплатно
- ✅ Простая настройка
- ✅ Автоматический деплой через GitHub Actions

**Недостатки:**
- ❌ Код будет публичным

### Вариант 2: Использовать Vercel (рекомендуется для приватных репозиториев)

Vercel предоставляет бесплатный хостинг для приватных репозиториев.

#### Настройка через веб-интерфейс (проще):

1. Зайдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "Add New Project"
4. Выберите ваш репозиторий `DefenxSmile/frontend`
5. Настройки:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
6. Добавьте переменные окружения:
   - `VITE_API_URL`
   - `VITE_APP_NAME`
   - И другие по необходимости
7. Нажмите "Deploy"

#### Настройка через GitHub Actions:

1. Получите токены из Vercel:
   - Зайдите в [Vercel Settings](https://vercel.com/account/tokens)
   - Создайте новый токен
   - Скопируйте `Vercel Token`
   - В настройках проекта найдите `Org ID` и `Project ID`

2. Добавьте Secrets в GitHub:
   - `Settings` → `Secrets and variables` → `Actions`
   - Добавьте:
     - `VERCEL_TOKEN` — токен из Vercel
     - `VERCEL_ORG_ID` — ID организации
     - `VERCEL_PROJECT_ID` — ID проекта

3. Используйте workflow `.github/workflows/deploy-vercel.yml`

**Преимущества:**
- ✅ Бесплатно для приватных репозиториев
- ✅ Автоматический деплой при push
- ✅ Preview deployments для pull requests
- ✅ Быстрый CDN
- ✅ Автоматический HTTPS

### Вариант 3: Использовать Netlify

Netlify также поддерживает приватные репозитории бесплатно.

#### Настройка через веб-интерфейс:

1. Зайдите на [netlify.com](https://netlify.com)
2. Войдите через GitHub
3. Нажмите "Add new site" → "Import an existing project"
4. Выберите ваш репозиторий
5. Настройки:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Добавьте переменные окружения в разделе "Site settings" → "Environment variables"
7. Нажмите "Deploy site"

#### Настройка через GitHub Actions:

1. Получите токен из Netlify:
   - Зайдите в [Netlify User Settings](https://app.netlify.com/user/applications)
   - Создайте новый access token
   - Скопируйте токен

2. Получите Site ID:
   - В настройках сайта найдите "Site details"
   - Скопируйте "Site ID"

3. Добавьте Secrets в GitHub:
   - `NETLIFY_AUTH_TOKEN` — токен из Netlify
   - `NETLIFY_SITE_ID` — ID сайта

4. Используйте workflow `.github/workflows/deploy-netlify.yml`

**Преимущества:**
- ✅ Бесплатно для приватных репозиториев
- ✅ Автоматический деплой
- ✅ Preview deployments
- ✅ Form handling (если понадобится)

### Вариант 4: Использовать Cloudflare Pages

Cloudflare Pages — еще один бесплатный вариант.

#### Настройка через веб-интерфейс:

1. Зайдите на [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Перейдите в "Workers & Pages"
3. Нажмите "Create application" → "Pages" → "Connect to Git"
4. Выберите GitHub и ваш репозиторий
5. Настройки:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Добавьте переменные окружения
7. Нажмите "Save and Deploy"

#### Настройка через GitHub Actions:

1. Получите API токен из Cloudflare:
   - Зайдите в [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Создайте токен с правами на Pages
   - Скопируйте токен

2. Получите Account ID:
   - В правой панели Dashboard найдите "Account ID"

3. Добавьте Secrets в GitHub:
   - `CLOUDFLARE_API_TOKEN` — токен из Cloudflare
   - `CLOUDFLARE_ACCOUNT_ID` — Account ID

4. Используйте workflow `.github/workflows/deploy-cloudflare.yml`

**Преимущества:**
- ✅ Бесплатно
- ✅ Быстрый CDN от Cloudflare
- ✅ Автоматический HTTPS
- ✅ Preview deployments

## Рекомендации

### Для приватных репозиториев:
1. **Vercel** — лучший выбор для React/Vite проектов
2. **Netlify** — хорошая альтернатива с дополнительными функциями
3. **Cloudflare Pages** — если уже используете Cloudflare

### Для публичных репозиториев:
1. **GitHub Pages** — самый простой вариант
2. **Vercel/Netlify** — если нужны дополнительные функции

## Настройка переменных окружения

Для всех платформ переменные окружения настраиваются одинаково:

### В веб-интерфейсе:
- Vercel: `Settings` → `Environment Variables`
- Netlify: `Site settings` → `Environment variables`
- Cloudflare: `Settings` → `Environment variables`

### В GitHub Actions:
Добавьте в секцию `env` шага `Build project`:

```yaml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
  VITE_APP_NAME: TableBook
  # и т.д.
```

## Обновление base URL

Для всех платформ кроме GitHub Pages используйте:

```env
VITE_BASE_URL=/
```

В `vite.config.ts` это уже настроено автоматически.

## Troubleshooting

### Проблема: Деплой не запускается

**Решение**: Проверьте:
1. Что workflow файл находится в `.github/workflows/`
2. Что в настройках репозитория включены GitHub Actions
3. Что все необходимые Secrets добавлены

### Проблема: Переменные окружения не работают

**Решение**: 
1. Убедитесь, что переменные начинаются с `VITE_`
2. Перезапустите деплой после добавления переменных
3. Проверьте логи сборки

### Проблема: Роутинг не работает после деплоя

**Решение**: 
1. Убедитесь, что `VITE_BASE_URL=/` в production
2. Проверьте настройки redirects на платформе (для SPA нужен redirect всех путей на index.html)

## Сравнение платформ

| Платформа | Приватные репо | Preview Deploys | CDN | Бесплатно |
|-----------|----------------|-----------------|-----|-----------|
| GitHub Pages | ❌ (только Pro) | ❌ | ✅ | ✅ (публичные) |
| Vercel | ✅ | ✅ | ✅ | ✅ |
| Netlify | ✅ | ✅ | ✅ | ✅ |
| Cloudflare Pages | ✅ | ✅ | ✅ | ✅ |

