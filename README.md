# NaDent — сайт стоматологічної клініки

Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS 4 · дві мови (UA / EN) · Liquid Glass-дизайн.

> Демо-проєкт: клініка вигадана. Що замінити перед запуском, див. `docs/TODO_CONTENT.md`.

## Запуск

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # статичний сайт у папці out/
npm start            # переглянути out/ локально
npm run test:e2e     # Playwright (спершу npm run build)
```

## Як замінити фото

1. Знайдіть потрібний id у `docs/IMAGE_PROMPTS.md` (наприклад, `hero-desktop`).
2. Покладіть файл `public/images/hero-desktop.jpg` (підходять `.jpg`, `.png`, `.webp`).
3. `npm run build`: скрипт сам створить AVIF/WebP потрібних розмірів, а плейсхолдер зміниться на фото.

## Де редагувати контент

| Що | Файл |
|---|---|
| Контакти, графік, ліцензія, рейтинг | `src/config/clinic.ts` |
| Ціни | `src/content/prices.ts` |
| Послуги | `src/content/services.ts` |
| Лікарі | `src/content/doctors.ts` |
| Тексти головної | `src/content/home.ts` |
| FAQ | `src/content/faq.ts` |
| Варіанти заголовка hero для A/B | `src/config/experiments.ts` |

Кожен файл містить обидві мови поруч (`uk` / `en`), тож TypeScript не дасть забути переклад.

## Деплой

GitHub Pages: кожен push у `main` запускає `.github/workflows/deploy.yml`. Інтеграції (обробник форм, аналітика) вмикаються змінними середовища, див. `.env.example`.

Документація проєкту лежить у `docs/`.
