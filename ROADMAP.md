# 🗺️ Дорожная карта развития проекта

## 🎯 Цели и принципы

### Ключевые принципы:
- ✅ **Анонимность по умолчанию**: пользователь не регистрируется, результаты привязаны к **временной сессии** и доступны **≤ 24 часов**
- ✅ **Приватность**: результаты видны только владельцу сессии; в админ-панели — полная видимость для модерации/аналитики
- ✅ **Редактируемость**: тесты, вопросы, шкалы и логика результатов управляются из **админ-панели** (не JSON-файлами в репозитории)
- ✅ **Надёжность**: чёткий пайплайн миграций, тестов и деплоя

### Что НЕ включаем:
- ❌ PWA и offline режим
- ❌ Auth/Users (регистрация/логин)
- ❌ Внешний REST API/Webhooks
- ❌ Экспорт PDF/CSV

---

## 📋 Milestone 1 — Данные и приватность (🔥 Высокий приоритет)

**Цель**: Перевести тесты и результаты в базу, включить приватные временные результаты и автоочистку.

### Задачи:

#### 1.1 Prisma / MySQL схема (миграции)
**Ветка:** `feature/db-core-privacy`

**Таблицы:**
```prisma
model Test {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  version   Int      @default(1)
  published Boolean  @default(false)
  questions Question[]
  scales    Scale[]
  rules     Rule[]
  results   Result[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([slug, version])
  @@index([slug])
  @@index([published])
}

model Question {
  id        String   @id @default(cuid())
  testId    String
  order     Int
  text      String   @db.Text
  type      String   // single | multi | scale | likert
  options   AnswerOption[]
  test      Test     @relation(fields: [testId], references: [id], onDelete: Cascade)
  
  @@index([testId, order])
}

model AnswerOption {
  id         String   @id @default(cuid())
  questionId String
  text       String   @db.Text
  value      Int
  weights    Json?    // {[scaleId]: weight}
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  @@index([questionId])
}

model Scale {
  id        String  @id @default(cuid())
  testId    String
  key       String  // O, C, E, A, N для Big5
  name      String
  min       Int
  max       Int
  bands     Json?   // [{to: number, label: string}]
  test      Test    @relation(fields: [testId], references: [id], onDelete: Cascade)
  
  @@unique([testId, key])
  @@index([testId])
}

model Rule {
  id        String  @id @default(cuid())
  testId    String
  kind      String  // threshold | combo | formula
  payload   Json    // DSL правил
  test      Test    @relation(fields: [testId], references: [id], onDelete: Cascade)
  
  @@index([testId])
}

model Session {
  id        String   @id @default(cuid()) // sessionId из cookie
  createdAt DateTime @default(now())
  expiresAt DateTime
  results   Result[]
  
  @@index([expiresAt])
}

model Result {
  id        String   @id @default(cuid())
  testId    String
  sessionId String
  version   Int
  summary   Json     // агрегаты по шкалам, финальные ярлыки
  details   ResultDetail?
  createdAt DateTime @default(now())
  session   Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  test      Test     @relation(fields: [testId], references: [id])
  
  @@index([sessionId])
  @@index([testId])
  @@index([createdAt])
}

model ResultDetail {
  id        String  @id @default(cuid())
  resultId  String  @unique
  details   Json    // по-вопросные данные, аудит расчёта
  result    Result  @relation(fields: [resultId], references: [id], onDelete: Cascade)
}

model ImportJob {
  id          String   @id @default(cuid())
  externalId  String
  contentHash String
  appliedAt   DateTime @default(now())
  testId      String?
  status      String   // applied | skipped | failed
  
  @@unique([externalId, contentHash])
  @@index([externalId])
}
```

**Файлы:**
- `prisma/schema.prisma` - схема базы данных
- `prisma/migrations/` - миграции
- `src/lib/db.ts` - Prisma client + helpers

#### 1.2 Временные сессии
**Файлы:**
- `src/lib/session.ts` - генерация/валидация sessionId

**Логика:**
```typescript
// Генерация sessionId (secure cookie)
- HttpOnly: true
- SameSite: 'Lax' (dev) / 'Strict' (prod)
- Secure: true (prod)
- MaxAge: 24 часа

// TTL результатов: 24 часа (конфиг по env)
- RESULT_TTL_HOURS=24
- SESSION_COOKIE_NAME=hoz_sid
```

#### 1.3 Автоочистка
**Файлы:**
- `src/lib/cleanup-cron.ts` - cron задача

**Реализация:**
```typescript
// Удаление записей старше TTL:
- Session + каскадное удаление Result/ResultDetail
- Запуск: каждый час или через Vercel Cron
```

#### 1.4 Миграция тестов из JSON → БД
**Файлы:**
- `scripts/import-tests.ts` - одноразовый импортёр
- Валидация через Zod
- Idempotency через хэш содержимого

#### 1.5 API уровня приложения
**Файлы:**
- `src/app/api/internal/results/route.ts` - сохранение/получение результатов
- `src/app/api/internal/session/route.ts` - управление сессией

**Endpoints:**
```typescript
POST /api/internal/results
  - Сохранить результат текущей сессии
  
GET /api/internal/results/current
  - Получить текущий результат по sessionId
  
GET /api/internal/session/active
  - Проверить активную сессию
```

### ✅ Критерии приёмки:
- [ ] Результаты создаются и читаются только в течение 24 часов одной сессии
- [ ] После TTL результаты недоступны с клиентской стороны
- [ ] Старые записи реально удаляются по крону
- [ ] Импорт JSON → БД работает корректно

**Срок:** 2-3 недели  
**Приоритет:** 🔥🔥🔥 Критический

---

## 📋 Milestone 2 — Админ-панель: полноценный CRUD (🔥 Высокий приоритет)

**Цель**: Управление тестами из БД без правки JSON.

### Задачи:

#### 2.1 CRUD для сущностей
**Ветка:** `feature/admin-crud`

**Файлы:**
- `src/app/admin/tests/*` - управление тестами
- `src/app/admin/questions/*` - управление вопросами
- `src/app/admin/scales/*` - управление шкалами
- `src/app/admin/rules/*` - управление правилами

**Функционал:**
- **Test**: создание/архивирование, slug, версия теста
- **Question**: порядок, текст, тип (single/multi/scale/likert)
- **AnswerOption**: текст, значение, веса по шкалам
- **Scale**: название шкалы, описание, min/max, интерпретации
- **Rule**: правила расчёта результата

#### 2.2 Версионирование тестов
**Логика:**
- Поле `version` у `Test` + immutable snapshot правил для расчётов
- Запрет редактирования опубликованной версии
- Изменения через выпуск новой версии

#### 2.3 UX админки
**Компоненты:**
- Табличные списки с поиском/фильтрами
- Drag&drop сортировка вопросов
- Формы с валидацией (Zod/Yup)
- Превью логики расчёта

#### 2.4 Импорт тестов из JSON по шаблону
**Файлы:**
- `src/app/admin/tests/import/page.tsx` - страница импорта
- `src/lib/test-importer.ts` - логика импорта
- `src/lib/schemas/import-template.ts` - Zod схемы

**Формат JSON:**
```json
{
  "meta": {
    "templateVersion": 1,
    "externalId": "big5_ru_v1",
    "slug": "big5",
    "title": "Большая Пятёрка",
    "version": 1,
    "published": false
  },
  "scales": [
    {
      "key": "O",
      "name": "Открытость опыту",
      "min": 0,
      "max": 50,
      "bands": [
        {"to": 16, "label": "low"},
        {"to": 34, "label": "mid"},
        {"to": 50, "label": "high"}
      ]
    }
  ],
  "questions": [
    {
      "order": 1,
      "text": "Мне нравится пробовать новое",
      "type": "likert",
      "options": [
        {
          "text": "Совсем не про меня",
          "value": 0,
          "weights": {"O": 0}
        }
      ]
    }
  ],
  "rules": [
    {
      "kind": "threshold",
      "payload": {
        "scaleKey": "O",
        "ranges": [
          {"to": 16, "label": "Низкая"},
          {"to": 34, "label": "Средняя"},
          {"to": 50, "label": "Высокая"}
        ]
      }
    }
  ]
}
```

**Поток импорта:**
1. Админ загружает JSON файл
2. Валидация схемы (Zod)
3. Dry-run превью (опционально)
4. Проверка идемпотентности (externalId + contentHash)
5. Транзакция: создание Test → Scales → Questions → Options → Rules
6. Возврат сводки

**Endpoints:**
- `POST /api/admin/tests/import?dryRun=1` - превью импорта
- `POST /api/admin/tests/import` - выполнение импорта

### ✅ Критерии приёмки:
- [ ] Полный цикл CRUD без ошибок
- [ ] Изменения мгновенно отражаются на фронте
- [ ] Удобное редактирование вопросов/вариантов/правил
- [ ] Сохранение версий работает
- [ ] Импорт JSON работает с идемпотентностью

**Срок:** 2-3 недели  
**Приоритет:** 🔥🔥🔥 Критический

---

## 📋 Milestone 3 — Логика результатов (🔥 Высокий приоритет)

**Цель**: Правильная психолого-логическая интерпретация ответов.

### Задачи:

#### 3.1 Сервис расчёта
**Ветка:** `feature/result-engine`

**Файлы:**
- `src/lib/result-engine/engine.ts` - движок расчёта
- `src/lib/result-engine/rules-dsl.ts` - DSL правил
- `src/lib/result-engine/validators.ts` - валидаторы

**Архитектура:**
```typescript
// Чистая функция
function computeResult(
  test: Test,
  answers: Answer[],
  version: number
): ResultSummary {
  // 1. Агрегация по шкалам
  // 2. Применение правил (threshold/formula/combo)
  // 3. Генерация интерпретаций
  // 4. Рекомендации
  return {
    scales: {...},
    labels: {...},
    recommendations: [...]
  };
}
```

#### 3.2 Модель правил
**DSL правил:**

1. **Threshold** (пороговые зоны):
```json
{
  "kind": "threshold",
  "payload": {
    "scaleKey": "O",
    "ranges": [
      {"to": 16, "label": "low"},
      {"to": 34, "label": "mid"},
      {"to": 50, "label": "high"}
    ]
  }
}
```

2. **Formula** (формулы):
```json
{
  "kind": "formula",
  "payload": {
    "expr": "(O * 0.6) + (C * 0.4)"
  }
}
```

3. **Combo** (логические комбинации):
```json
{
  "kind": "combo",
  "payload": {
    "when": [{"cond": "O=high"}, {"cond": "C=low"}],
    "label": "Творческий хаос"
  }
}
```

#### 3.3 Валидация и тестирование
**Файлы:**
- `src/lib/result-engine/__tests__/` - unit тесты

**Тесты:**
- Эталонные наборы ответов → ожидаемые результаты
- Защита от неполных ответов
- Защита от повторных отправок
- Проверка версионирования

### ✅ Критерии приёмки:
- [ ] Для набора тестовых ответов результаты совпадают с ожидаемыми
- [ ] Изменение правил в админке меняет итоговые выводы только в новых прохождениях
- [ ] Unit тесты покрывают все типы правил
- [ ] Аудит промежуточных вычислений работает

**Срок:** 2-3 недели  
**Приоритет:** 🔥🔥🔥 Критический

---

## 📋 Milestone 4 — UX для анонимной сессии (🟢 Средний)

**Цель**: Пользовательский комфорт без авторизации.

### Задачи:

#### 4.1 Интерфейс сессии
**Ветка:** `feature/session-ux`

**Файлы:**
- `src/app/page.tsx` - кнопка "Мои результаты"
- `src/app/tests/[slug]/page.tsx` - прохождение теста
- `src/app/tests/[slug]/results/page.tsx` - просмотр результатов
- `src/components/SessionIndicator.tsx` - индикатор сессии

**Функционал:**
- Кнопка «Мои результаты» на главной (если есть активная сессия)
- Сохранение прогресса прохождения (sessionStorage + server sync)
- Плавные переходы между вопросами
- Прогресс-бар
- Таймер TTL результатов

#### 4.2 Эргономика
- Анимации переходов
- Адаптивный дизайн для всех вопросов
- Подтверждение перед выходом (если есть несохраненные ответы)

### ✅ Критерии приёмки:
- [ ] После прохождения теста пользователь видит результаты сразу
- [ ] Можно вернуться к результатам в течение 24 часов
- [ ] Прогресс сохраняется при закрытии страницы
- [ ] Плавные переходы работают

**Срок:** 1-2 недели  
**Приоритет:** 🟢 Средний

---

## 📋 Milestone 5 — Мини-аналитика в админке (🟢 Средний)

**Цель**: Базовое понимание распределений.

### Задачи:

#### 5.1 Дашборд аналитики
**Ветка:** `feature/admin-mini-analytics`

**Файлы:**
- `src/app/admin/analytics/page.tsx` - страница аналитики
- `src/lib/analytics.ts` - агрегация данных
- `src/components/admin/Charts.tsx` - графики

**Функционал:**
- Простые графики по шкалам (bar/pie charts)
- Распределение по версиям тестов
- Фильтры по датам и версиям
- Общая статистика (количество прохождений, средние значения)

**Библиотеки:**
- Recharts или Chart.js для графиков

#### 5.2 Приватность
- Только агрегированные данные (без персональных результатов)
- Минимальный размер выборки для показа (например, ≥10 результатов)

### ✅ Критерии приёмки:
- [ ] Графики корректно отражают агрегаты
- [ ] Не нарушается приватность (агрегация без персональных данных)
- [ ] Фильтры работают
- [ ] Загрузка быстрая (индексы в БД)

**Срок:** 1-2 недели  
**Приоритет:** 🟢 Средний

---

## 🔧 Environment переменные

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/psychotest"

# Session
RESULT_TTL_HOURS=24
SESSION_COOKIE_NAME=hoz_sid
SESSION_COOKIE_SAMESITE=Lax
SESSION_COOKIE_SECURE=true

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password

# Cleanup
CLEANUP_CRON_SCHEDULE="0 * * * *"  # каждый час
```

---

## 🔄 Git Workflow

### Цикл feature-ветки:
```bash
# 1. Создать feature ветку
git checkout dev
git pull origin dev
git checkout -b feature/<name>

# 2. Разработка + тесты
npm run lint
npm run build
npm run test

# 3. Локальное тестирование
docker-compose -f docker-compose.prod.yml up --build

# 4. Коммит
git add .
git commit -m "feat(<name>): описание"
git push origin feature/<name>

# 5. Слить в dev
git checkout dev
git merge --no-ff feature/<name>
git push origin dev

# 6. Удалить feature ветку
git branch -d feature/<name>
git push origin --delete feature/<name>

# 7. Когда dev стабильна → main
git checkout main
git merge dev
git push origin main

# 8. Деплой в prod
git checkout prod
git merge main
git push origin prod  # 🚀 Автоматический деплой!
```

---

## 📊 Порядок реализации

### Фаза 1 (Месяц 1-2): Foundation
```
Week 1-2: Milestone 1 (База данных + сессии)
Week 3-4: Milestone 2 (Админ CRUD)
Week 5-6: Milestone 3 (Движок результатов)
```

### Фаза 2 (Месяц 3): Polish
```
Week 7-8: Milestone 4 (UX сессий)
Week 9-10: Milestone 5 (Аналитика)
Week 11-12: Тестирование, багфиксы, оптимизация
```

---

## 🧪 Тестирование

### Unit тесты:
- Движок правил
- Парсер формул
- Валидация входных данных
- Расчёт результатов

### Integration тесты:
- Прохождение теста → расчёт → сохранение → чтение
- Импорт JSON → создание в БД
- Очистка по TTL

### E2E тесты (Cypress/Playwright):
- Сценарий "Пройти тест"
- Сценарий "Вернуться к результатам"
- Сценарий "Истёк TTL"
- Админ CRUD операции

---

## 📂 Структура файлов

```
prisma/
  schema.prisma                         # Схема БД
  migrations/                           # Миграции

src/
  lib/
    db.ts                               # Prisma client
    session.ts                          # Управление сессиями
    cleanup-cron.ts                     # Очистка по расписанию
    test-importer.ts                    # Импорт JSON → БД
    result-engine/
      engine.ts                         # Движок расчёта
      rules-dsl.ts                      # DSL правил
      validators.ts                     # Валидаторы
      __tests__/                        # Unit тесты
    schemas/
      import-template.ts                # Zod схемы для импорта
    analytics.ts                        # Агрегация данных

  app/
    api/
      internal/
        results/route.ts                # API результатов
        session/route.ts                # API сессий
      admin/
        tests/
          import/route.ts               # Импорт тестов
    
    tests/
      [slug]/
        page.tsx                        # Прохождение теста
        results/page.tsx                # Результаты
    
    admin/
      tests/*                           # CRUD тестов
      questions/*                       # CRUD вопросов
      scales/*                          # CRUD шкал
      rules/*                           # CRUD правил
      analytics/page.tsx                # Аналитика
      import/page.tsx                   # Импорт тестов
    
    page.tsx                            # Главная + "Мои результаты"

  components/
    SessionIndicator.tsx                # Индикатор сессии
    admin/
      Charts.tsx                        # Графики
      TestForm.tsx                      # Формы тестов
      QuestionEditor.tsx                # Редактор вопросов

scripts/
  import-tests.ts                       # Скрипт импорта
```

---

## 🎯 Метрики успеха

### Milestone 1:
- [ ] 100% результатов сохраняются в БД
- [ ] 0 утечек памяти (старые сессии удаляются)
- [ ] Время ответа API < 200ms

### Milestone 2:
- [ ] Создание теста < 5 минут
- [ ] Импорт JSON < 10 секунд
- [ ] 0 багов при версионировании

### Milestone 3:
- [ ] 100% точность на эталонных тестах
- [ ] Время расчёта < 100ms
- [ ] 90%+ покрытие тестами

### Milestone 4:
- [ ] 95%+ пользователей завершают тест
- [ ] Время загрузки страницы < 2s
- [ ] 0 потерь прогресса

### Milestone 5:
- [ ] Аналитика обновляется в реальном времени
- [ ] Загрузка дашборда < 1s
- [ ] 100% соблюдение приватности

---

**🚀 Roadmap готов! Начинаем с Milestone 1!**

