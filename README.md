# Дневник смен водителя

Небольшое приложение: список поездок за день и сводка за день (число поездок, выручка, комиссия, на руки, разбивка наличные/карта). Стек: Next.js (App Router, TypeScript, Tailwind), pnpm, Node 24. Зависимостей для UI-библиотек нет, все компоненты свои.

## Запуск

```bash
pnpm install
pnpm dev
```

Открыть `http://localhost:3000/`. Данные лежат в `data/trips.json` рядом с кодом.

Сборка и прод:

```bash
pnpm build
pnpm start -- -p 3002
```

## API

Список и сводка за день:

```bash
curl.exe "http://127.0.0.1:3000/api/trips?date=2026-10-01"
```

```json
{"date": "2026-10-01", "trips": [...], "summary": {"count": 2, "revenue": 3900, "commission": 585, "net": 3315, "cash": {"count": 1, "total": 1500}, "card": {"count": 1, "total": 2400}}}
```

Добавление поездки (`amount > 0`, `end` позже `start`, `payment` cash/card, `commission` по умолчанию 0). В PowerShell тело класть в файл:

```bash
curl.exe -X POST http://127.0.0.1:3000/api/trips -H "Content-Type: application/json" --data-binary "@body.json"
```

`body.json`:

```json
{"start": "2026-10-02T10:00:00+05:00", "end": "2026-10-02T10:25:00+05:00", "amount": 2000, "payment": "card", "commission": 300}
```

Повторная отправка с тем же `id` возвращает сохраненную поездку со статусом 200 и дубль не создает. Без `id` сервер сгенерирует его сам.

## Тесты

```bash
pnpm test
```

Проверяют: математику сводки, защиту от дублей, ошибки валидации, пустой день, дефолт комиссии, BOM в теле запроса.

---

# Driver Shift Diary

Small app: trip list per day plus day summary (trip count, revenue, commission, net payout, cash/card split). Stack: Next.js (App Router, TypeScript, Tailwind), pnpm, Node 24. No UI library dependencies, all components are hand-made.

## Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000/`. Data lives in `data/trips.json` next to the code.

Build and prod:

```bash
pnpm build
pnpm start -- -p 3002
```

## API

Day list plus summary:

```bash
curl "http://127.0.0.1:3000/api/trips?date=2026-10-01"
```

```json
{"date": "2026-10-01", "trips": [...], "summary": {"count": 2, "revenue": 3900, "commission": 585, "net": 3315, "cash": {"count": 1, "total": 1500}, "card": {"count": 1, "total": 2400}}}
```

Add a trip (`amount > 0`, `end` after `start`, `payment` cash/card, `commission` defaults to 0):

```bash
curl -X POST http://127.0.0.1:3000/api/trips -H "Content-Type: application/json" --data-binary "@body.json"
```

`body.json`:

```json
{"start": "2026-10-02T10:00:00+05:00", "end": "2026-10-02T10:25:00+05:00", "amount": 2000, "payment": "card", "commission": 300}
```

Resending the same `id` returns the stored trip with status 200 and creates no duplicate. Without `id` the server generates one.

## Tests

```bash
pnpm test
```

Cover: summary math, duplicate protection, validation errors, empty day, commission default, BOM in request body.