# 🔧 Dev Branch - Ветка для разработки

## 👋 Добро пожаловать в dev ветку!

Эта ветка предназначена для **активной разработки** новых функций, экспериментов и тестирования перед релизом в продакшн.

---

## 🎯 Что можно делать в dev ветке?

### ✅ Разрешено:
- 🆕 Разработка новых функций
- 🗄️ Эксперименты с базой данных
- 🎨 Изменения в дизайне и UI
- 🧪 Тестирование новых библиотек
- 🔧 Рефакторинг кода
- 📝 Работа с API
- 🐛 Исправление багов

### ❌ Не делать:
- 🚫 Прямой push в prod ветку (только через main)
- 🚫 Коммиты с неработающим кодом (код должен собираться)
- 🚫 Удаление документации
- 🚫 Изменение конфигурации продакшн сервера

---

## 🚀 Быстрый старт

### 1. Убедитесь, что вы в dev ветке
```bash
git branch  # Должна быть помечена звездочкой: * dev
```

### 2. Обновите dev ветку
```bash
git pull origin dev
```

### 3. Установите зависимости
```bash
npm install
```

### 4. Запустите dev сервер
```bash
npm run dev
```

Откройте http://localhost:3000 в браузере.

---

## 📋 Workflow для разработки

### Простой сценарий (только dev → main → prod):
```bash
# 1. В dev ветке - разработка
git checkout dev
# ... делаем изменения ...
git add .
git commit -m "feat: новая функция"
git push origin dev

# 2. Слить в main
git checkout main
git merge dev
git push origin main

# 3. Деплой в prod
git checkout prod
git merge main
git push origin prod  # 🚀 Автоматический деплой!
```

### С feature branch (для больших задач):
```bash
# 1. Создать feature ветку от dev
git checkout dev
git checkout -b feature/add-mysql-database

# 2. Разработка в feature ветке
# ... делаем изменения ...
git add .
git commit -m "feat: добавлена интеграция с MySQL"
git push origin feature/add-mysql-database

# 3. Слить в dev
git checkout dev
git merge feature/add-mysql-database
git push origin dev

# 4. Удалить feature ветку
git branch -d feature/add-mysql-database
git push origin --delete feature/add-mysql-database

# 5. Когда готово - в main и prod
git checkout main && git merge dev && git push origin main
git checkout prod && git merge main && git push origin prod
```

---

## 💾 Работа с базой данных

### Настройка Prisma (MySQL)

1. **Создайте `.env` файл:**
```env
DATABASE_URL="mysql://user:password@localhost:3306/psychotest"
```

2. **Примените миграции:**
```bash
npx prisma migrate dev
```

3. **Откройте Prisma Studio:**
```bash
npx prisma studio
```

4. **Генерация Prisma Client:**
```bash
npx prisma generate
```

### Создание новой миграции
```bash
# После изменения schema.prisma
npx prisma migrate dev --name add_user_profiles
```

### Откат миграции
```bash
npx prisma migrate reset
```

---

## 🐳 Docker для разработки

### Запуск через Docker
```bash
# Сборка и запуск
docker-compose up --build

# В фоновом режиме
docker-compose up -d --build

# Остановка
docker-compose down
```

### Тестирование prod build локально
```bash
docker-compose -f docker-compose.prod.yml up --build
```

---

## 🧪 Тестирование перед релизом

### Checklist перед слиянием в main:
- [ ] Код работает локально (`npm run dev`)
- [ ] Нет ошибок линтера (`npm run lint`)
- [ ] Prod build успешен (`npm run build`)
- [ ] Docker контейнеры запускаются (`docker-compose up --build`)
- [ ] Документация обновлена (если нужно)
- [ ] Нет console.log и debug кода
- [ ] Нет чувствительных данных (пароли, ключи)

---

## 📝 Примеры задач для dev ветки

### Идеи для разработки:
1. **База данных:**
   - Интеграция с MySQL
   - Сохранение результатов тестов
   - Система пользователей
   - История прохождений

2. **Новые функции:**
   - Экспорт результатов в PDF
   - Сравнение результатов
   - Система рекомендаций
   - Аналитика и графики

3. **Улучшения:**
   - Анимации и переходы
   - Темная тема
   - Локализация (i18n)
   - PWA функции

4. **API:**
   - REST API для мобильных приложений
   - Webhooks для интеграций
   - Rate limiting
   - Кэширование

---

## 🐛 Решение проблем

### Конфликты при слиянии
```bash
# Если возникли конфликты
git status  # Посмотреть конфликты
# Решить конфликты вручную в файлах
git add .
git commit -m "fix: resolve merge conflicts"
```

### Откат изменений
```bash
# Откат последнего коммита (изменения сохраняются)
git reset --soft HEAD~1

# Откат последнего коммита (изменения удаляются)
git reset --hard HEAD~1

# Откат конкретного файла
git checkout -- filename.ts
```

### Очистка Docker
```bash
# Удалить все контейнеры и образы
docker-compose down
docker system prune -a -f

# Пересоздать все
docker-compose up --build
```

---

## 📚 Полезные ресурсы

- **Workflow:** [WORKFLOW.md](../WORKFLOW.md)
- **Quick Start:** [QUICKSTART.md](../QUICKSTART.md)
- **Docker Guide:** [DOCKER-GUIDE.md](../DOCKER-GUIDE.md)
- **README:** [README.md](../README.md)

---

## 🎯 Текущие задачи

### В процессе:
- [ ] ...

### Планируется:
- [ ] Интеграция MySQL базы данных
- [ ] Система сохранения результатов
- [ ] Экспорт результатов в PDF
- [ ] Аналитика и статистика

---

## 💡 Tips & Tricks

### Быстрые коммиты
```bash
# Add + Commit одной командой
git commit -am "feat: быстрый коммит"
```

### Просмотр истории
```bash
# Красивая история коммитов
git log --oneline --graph --all
```

### Stash для временного сохранения
```bash
# Сохранить изменения
git stash

# Восстановить изменения
git stash pop
```

### Быстрое переключение веток
```bash
# Вернуться к предыдущей ветке
git checkout -
```

---

**🚀 Счастливого кодинга! Творите и экспериментируйте!**

