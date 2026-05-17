# BookVerse

**Автор:** Леваков Григорий Олегович  
**Курс:** Т-Академия Фронтенда, выпускной проект (2 семестр)  
**Год:** 2026

## О проекте

**BookVerse** — веб-приложение для поиска книг и ведения личной читательской библиотеки. Каталог и метаданные книг загружаются из [Open Library API](https://openlibrary.org/developers/api). Избранное, коллекции, отзывы и профиль пользователя хранятся в облаке [Supabase](https://supabase.com) с разграничением доступа (Row Level Security).

### Задача

Дать читателю одно место, где можно найти книгу по названию или теме, сохранить её в избранное, собрать тематические коллекции и оставить короткий отзыв — без собственного серверного бэкенда, с аккаунтом по email.

### Целевая аудитория

Читатели 16–45 лет, студенты и любители художественной и учебной литературы, которым нужен простой каталог на русском интерфейсе и синхронизация списков между устройствами после входа в аккаунт.

### Основные возможности

| Раздел | Описание |
|--------|----------|
| Главная `/` | Три подборки: в тренде, популярное, рекомендации |
| Каталог `/books` | Поиск, фильтры по темам, сортировка, бесконечная подгрузка |
| Книга `/books/:id` | Карточка, похожие книги, избранное, коллекции, отзывы |
| Избранное `/favorites` | Сохранённые книги (только после входа) |
| Коллекции `/collections` | Пользовательские списки книг |
| Профиль `/profile` | Имя и аватар |
| Вход / регистрация | Email и пароль через Supabase Auth |

Адаптивная вёрстка: боковое меню на десктопе, нижняя навигация на мобильных.

**Наблюдаемость (опционально):** Sentry — ошибки в браузере; PostHog — просмотры страниц, поиск, избранное. Ключи в `.env` / CI Variables (`VITE_SENTRY_DSN`, `VITE_POSTHOG_KEY`). Дашборды: [sentry.io](https://sentry.io) → Issues; [PostHog](https://eu.posthog.com) → Activity → Live events.

## Ссылки

| Ресурс | URL |
|--------|-----|
| **GitLab (сдача курса)** | https://gitlab.education.tbank.ru/frontend-academy-2-2026/homework-forks/grigoriy.levakov/final-project-2-semester |
| **Демо GitLab Pages** | см. **Deploy → Pages** в GitLab (путь fork: `/homework-forks/grigoriy.levakov/final-project-2-semester/`) |
| **GitHub** | https://github.com/ВАШ_ЛОГИН/ИМЯ_РЕПО |
| **Демо GitHub Pages** | https://ВАШ_ЛОГИН.github.io/ИМЯ_РЕПО/ |

## Тестовый аккаунт

Создайте пользователя в Supabase (**Authentication → Users → Add user**) или через **/register** на стенде, затем добавьте несколько книг в избранное и коллекцию.

| Поле | Значение |
|------|----------|
| Email | `bookverse.demo@tbank-academy.ru` |
| Пароль | `BookVerseDemo2026!` |

После первого входа: откройте любую книгу → «В избранное», «В коллекцию» → создайте коллекцию на странице **Коллекции** → при желании оставьте отзыв.

## Стек

React 18 · TypeScript · Vite · React Router 7 · TanStack Query · Zustand · Tailwind CSS · Framer Motion · React Hook Form · Zod · Supabase · Jest · Testing Library · ESLint · Prettier

## Архитектура (FSD)

```
src/
  app/           — провайдеры, роутер, глобальные стили
  pages/         — экраны по маршрутам
  widgets/       — layout, header, sidebar, footer
  features/      — auth, избранное, коллекции, отзывы
  entities/book/ — Open Library API, модель книги
  shared/        — UI, хуки, конфиг, утилиты
```

## Локальный запуск

1. Клонируйте репозиторий и перейдите в каталог проекта.

2. Скопируйте `.env.example` в `.env`, укажите `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` (Supabase → Settings → API).

3. В Supabase SQL Editor выполните по порядку:
   - `docs/supabase/schema.sql`
   - при ошибках 403 на REST — `docs/supabase/grants-fix.sql`

4. в Supabase отключите Confirm email в настройках Email.

5. Установка и запуск:

```bash
npm install
npm run dev
```

Приложение: http://localhost:5173

## CI/CD

Файл `.gitlab-ci.yml`: **lint** → **unit_tests** → **pages** (ветка по умолчанию).

Supabase для сборки **GitLab Pages**: ключи в `.env.production` (приватный репозиторий; client-side ключи). Локально — `.env` из `.env.example`.

GitHub: `.github/workflows/ci.yml` (lint, test), `.github/workflows/pages.yml` (Pages).  
После первого push: **Settings → Pages → Source: GitHub Actions**. Supabase: в URL Configuration добавить оба URL стенда (GitLab и GitHub).

## Покрытие тестами

Юнит-тесты (Jest + React Testing Library): утилиты, мапперы, хуки, UI-компоненты. Целевое покрытие курса — **около 30%** (пороги в `jest.config.cjs`).

## Переменные окружения

См. `.env.example`: Supabase (обязательно), Sentry и PostHog (метрики, опционально).

## Лицензии данных

Метаданные книг — **Open Library**. Учебный проект, не аффилирован с Open Library и Supabase.
