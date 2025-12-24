# Nashi Cultural Platform - Frontend

Елегантна, адаптивна платформа культурної спадщини України.

## Встановлення та запуск

```bash
# Встановити залежності
npm install

# Запустити dev сервер
npm run dev

# Зібрати для production
npm run build
```

## Налаштування середовища

Створіть файл `.env.local` на основі `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_MAPTILER_API_KEY=your_maptiler_api_key
```

## Структура проекту

```
src/
├── app/                    # Конфігурація додатку
│   ├── router.tsx         # React Router конфігурація
│   └── providers.tsx      # Query Client та інші провайдери
├── components/
│   ├── ui/                # shadcn/ui компоненти
│   └── layout/            # Layout компоненти (Header, MobileNav)
├── pages/                 # Сторінки додатку
├── lib/
│   ├── api/              # API клієнт та hooks
│   │   ├── client.ts     # Fetch wrapper
│   │   ├── errors.ts     # Error handling
│   │   ├── generated/    # TypeScript types з swagger.json
│   │   └── hooks/        # TanStack Query hooks
│   ├── config.ts         # Environment configuration
│   └── utils.ts          # Utility functions
└── styles/
    └── globals.css       # Global styles + Tailwind
# nashi-frontend
