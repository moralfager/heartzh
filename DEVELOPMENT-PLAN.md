# 📋 План разработки проекта

> 📖 **Полная техническая документация:** [ROADMAP.md](./ROADMAP.md)  
> 📊 **Отслеживание прогресса:** [PROGRESS.md](./PROGRESS.md)

## ✅ Что уже реализовано

### 🚀 Инфраструктура:
- ✅ Проект на Next.js 15 с TypeScript
- ✅ Docker контейнеризация
- ✅ Nginx reverse proxy с HTTPS
- ✅ Let's Encrypt SSL сертификаты (автообновление)
- ✅ GitHub Actions CI/CD
- ✅ Автоматический деплой на VPS (prod ветка)
- ✅ Домен с HTTPS: https://heartofzha.ru

### 📚 Документация:
- ✅ README.md - общая информация
- ✅ WORKFLOW.md - полное руководство по Git workflow
- ✅ QUICKSTART.md - быстрый старт
- ✅ DOCKER-GUIDE.md - Docker инструкции
- ✅ DEV-BRANCH.md - инструкции для разработки

### 🔄 Git структура:
- ✅ **main** - стабильная версия
- ✅ **dev** - разработка (создана и готова)
- ✅ **prod** - продакшн с автодеплоем

### 🎯 Функционал:
- ✅ 2 психологических теста (50 вопросов каждый)
- ✅ Админ-панель с авторизацией
- ✅ Просмотр результатов
- ✅ Редактор вопросов
- ✅ Адаптивный дизайн

---

## 🎯 Текущий фокус: Milestone 1 - База данных и приватность

> 🔥 **Статус:** В разработке  
> ⏱️ **Срок:** 2-3 недели  
> 🌿 **Ветка:** `feature/db-core-privacy`

### 📊 Milestone 1: База данных и приватность (Приоритет: 🔥 Критический)

**Цель:** Перевести тесты и результаты в MySQL, включить приватные временные результаты (≤24ч) и автоочистку.

### 📋 Задачи Milestone 1:

#### ✅ Задача 1.1: Prisma схема и миграции
**Статус:** 🔜 Следующая  
**Файлы:**
- `prisma/schema.prisma` - полная схема (8 таблиц)
- `prisma/migrations/` - миграции

**Таблицы:**
```
Test (тесты с версионированием)
Question (вопросы)
AnswerOption (варианты ответов)
Scale (шкалы результатов)
Rule (правила расчёта)
Session (временные сессии, TTL 24ч)
Result (результаты тестов)
ResultDetail (детали расчётов)
ImportJob (история импортов)
```

**Команды:**
```bash
# Создать миграцию
npx prisma migrate dev --name init_schema

# Применить миграции
npx prisma migrate deploy

# Открыть Prisma Studio
npx prisma studio
```

#### ⏳ Задача 1.2: Временные сессии (cookie-based)
**Статус:** Ожидает 1.1  
**Файлы:**
- `src/lib/session.ts` - генерация/валидация sessionId

**Реализация:**
```typescript
// Cookie настройки:
- HttpOnly: true
- SameSite: 'Lax' (dev) / 'Strict' (prod)
- Secure: true (prod)
- MaxAge: 24 часа
```

**Environment:**
```env
RESULT_TTL_HOURS=24
SESSION_COOKIE_NAME=hoz_sid
SESSION_COOKIE_SAMESITE=Lax
SESSION_COOKIE_SECURE=true
```

#### ⏳ Задача 1.3: Internal API endpoints
**Статус:** Ожидает 1.1, 1.2  
**Файлы:**
- `src/app/api/internal/results/route.ts`
- `src/app/api/internal/session/route.ts`

**Endpoints:**
```typescript
POST /api/internal/results
  Body: { testId, answers }
  → Сохранить результат для текущей сессии

GET /api/internal/results/current
  → Получить результат текущей сессии (если ≤24ч)

GET /api/internal/session/active
  → Проверить наличие активной сессии
```

#### ⏳ Задача 1.4: Автоочистка (cron)
**Статус:** Ожидает 1.1  
**Файлы:**
- `src/lib/cleanup-cron.ts`
- `src/app/api/cron/cleanup/route.ts` (для Vercel Cron)

**Логика:**
```typescript
// Удаление:
- Session где expiresAt < NOW()
- Каскадное удаление Result + ResultDetail
- Запуск: каждый час через Vercel Cron
```

#### ⏳ Задача 1.5: Импорт JSON → БД
**Статус:** Ожидает 1.1  
**Файлы:**
- `scripts/import-tests.ts`
- `src/lib/test-importer.ts`

**Функционал:**
```bash
# Одноразовый импорт существующих тестов
npm run import-tests

# Идемпотентность через хэш содержимого
# Валидация через Zod
```

#### ⏳ Задача 1.6: Unit тесты
**Статус:** Ожидает 1.1-1.5  
**Файлы:**
- `src/lib/__tests__/session.test.ts`
- `src/lib/__tests__/cleanup.test.ts`

### ✅ Критерии приёмки Milestone 1:
- [ ] Результаты создаются и читаются только в течение 24 часов одной сессии
- [ ] После TTL результаты недоступны с клиентской стороны
- [ ] Старые записи реально удаляются по крону
- [ ] Импорт JSON → БД работает корректно
- [ ] Unit тесты покрывают ≥80% кода
- [ ] Время ответа API < 200ms

### 🔄 Workflow Milestone 1:
```bash
# 1. Создать feature ветку
git checkout dev
git checkout -b feature/db-core-privacy

# 2. Последовательно выполнить задачи 1.1 → 1.6

# 3. После каждой задачи - коммит
git add .
git commit -m "feat(db): описание задачи"

# 4. После завершения всех задач
npm run lint
npm run build
npm run test

# 5. Локальное тестирование
docker-compose -f docker-compose.prod.yml up --build

# 6. Слить в dev
git checkout dev
git merge --no-ff feature/db-core-privacy
git push origin dev

# 7. Обновить PROGRESS.md

# 8. Создать PR в main (опционально)
```

---

---

## 🔜 Следующие Milestones (после M1)

### 📋 Milestone 2: Админ CRUD (Приоритет: 🔥 Критический)

**Цель:** Управление тестами из БД без правки JSON

**Краткое описание:**
- CRUD для Test, Question, AnswerOption, Scale, Rule
- Версионирование тестов
- Drag&drop сортировка
- Импорт JSON по шаблону

**Ветка:** `feature/admin-crud`  
**Срок:** 2-3 недели

---

### 📋 Milestone 3: Логика результатов (Приоритет: 🔥 Критический)

**Цель:** Правильная психологическая интерпретация ответов

**Краткое описание:**
- Движок расчёта (pure function)
- DSL правил (threshold/formula/combo)
- Unit тесты на эталонах
- Версионированные расчёты

**Ветка:** `feature/result-engine`  
**Срок:** 2-3 недели

---

### 📋 Milestone 4: UX сессий (Приоритет: 🟢 Средний)

**Цель:** Пользовательский комфорт без авторизации

**Краткое описание:**
- Кнопка "Мои результаты" на главной
- Сохранение прогресса
- Плавные переходы
- Прогресс-бар и анимации

**Ветка:** `feature/session-ux`  
**Срок:** 1-2 недели

---

### 📋 Milestone 5: Аналитика (Приоритет: 🟢 Средний)

**Цель:** Базовое понимание распределений

**Краткое описание:**
- Графики по шкалам
- Фильтры по датам/версиям
- Приватность (только агрегаты)

**Ветка:** `feature/admin-mini-analytics`  
**Срок:** 1-2 недели

---

## 📈 Стандартный Workflow для всех Milestones

### Стандартный процесс:

```bash
# 1. Создать feature ветку от dev
git checkout dev
git pull origin dev
git checkout -b feature/название-задачи

# 2. Разработка и коммиты
# ... делаем изменения ...
git add .
git commit -m "feat: описание изменений"
git push origin feature/название-задачи

# 3. Тестирование
npm run lint
npm run build
docker-compose -f docker-compose.prod.yml up --build

# 4. Слить в dev
git checkout dev
git merge feature/название-задачи
git push origin dev

# 5. Удалить feature ветку
git branch -d feature/название-задачи
git push origin --delete feature/название-задачи

# 6. Когда dev стабильна - в main
git checkout main
git merge dev
git push origin main

# 7. Деплой в prod (когда готовы к релизу)
git checkout prod
git merge main
git push origin prod  # 🚀 Автоматический деплой!
```

---

## 🔄 Частота релизов

### Рекомендуемый график:

- **dev → main**: По завершении каждой фазы или крупной функции
- **main → prod**: 1-2 раза в неделю (пятница вечер или воскресенье)
- **Hotfix**: Немедленно при критических багах

---

## ⚠️ Важные правила

### ✅ DO (Делать):
1. **Всегда работать в dev** для новых функций
2. **Тестировать локально** перед push
3. **Делать частые коммиты** с понятными сообщениями
4. **Документировать изменения** в README/CHANGELOG
5. **Проверять GitHub Actions** после деплоя
6. **Использовать feature branches** для больших задач

### ❌ DON'T (Не делать):
1. **Не коммитить напрямую в prod**
2. **Не пушить неработающий код**
3. **Не удалять документацию**
4. **Не хардкодить пароли и ключи**
5. **Не изменять prod конфигурацию без тестирования**
6. **Не делать force push** в основные ветки

---

## 📝 Шаблоны коммитов

### Типы:
- `feat:` - новая функция
- `fix:` - исправление бага
- `docs:` - документация
- `style:` - форматирование, стили
- `refactor:` - рефакторинг
- `test:` - тесты
- `chore:` - обновление зависимостей
- `perf:` - оптимизация производительности

### Примеры:
```bash
git commit -m "feat: добавлена интеграция с MySQL"
git commit -m "fix: исправлен расчет результатов теста"
git commit -m "docs: обновлена документация API"
git commit -m "style: улучшен дизайн карточек результатов"
git commit -m "refactor: оптимизирована работа с БД"
git commit -m "perf: добавлено кэширование результатов"
```

---

## 🎯 Текущие приоритеты

### Неделя 1-2: База данных
- [ ] Настроить Prisma schema
- [ ] Создать API endpoints
- [ ] Интегрировать сохранение результатов
- [ ] Протестировать и задеплоить

### Неделя 3-4: UI улучшения
- [ ] Добавить анимации
- [ ] Реализовать темную тему
- [ ] Улучшить мобильный вид
- [ ] Протестировать и задеплоить

### Неделя 5+: Дополнительные функции
- [ ] Аналитика и графики
- [ ] PWA функционал
- [ ] Экспорт в PDF
- [ ] ...

---

## 🚀 Итоговая схема workflow

```
Feature Branch → dev → main → prod (Auto-deploy на VPS)
     ↓            ↓      ↓      ↓
 Разработка   Тестир. Стабил.  Production
              локально  версия  heartofzha.ru
```

---

## 📞 Контакты и ресурсы

### GitHub:
- **Репозиторий:** https://github.com/moralfager/heartzh
- **Actions:** https://github.com/moralfager/heartzh/actions
- **Issues:** https://github.com/moralfager/heartzh/issues

### Продакшн:
- **Сайт:** https://heartofzha.ru
- **Админ:** https://heartofzha.ru/admin
- **VPS:** 85.202.192.68

### Документация:
- [WORKFLOW.md](./WORKFLOW.md) - Git workflow
- [QUICKSTART.md](./QUICKSTART.md) - Быстрый старт
- [DEV-BRANCH.md](./.github/DEV-BRANCH.md) - Dev инструкции
- [DOCKER-GUIDE.md](./DOCKER-GUIDE.md) - Docker руководство

---

**🚀 Готово к разработке! Удачи с реализацией новых функций!**

