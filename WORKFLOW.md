# 🔄 Git Workflow & Deployment Guide

## 📌 Структура веток

### **main** (основная ветка)
- 📚 Стабильная версия с полной документацией
- ✅ Все тесты пройдены
- 📖 README и документация актуальны
- 🚫 **Прямые коммиты запрещены** - только через Pull Request

### **dev** (ветка разработки)
- 🔧 Активная разработка новых функций
- 🧪 Тестирование изменений
- 💾 Работа с базой данных
- 🎨 Эксперименты с UI/UX
- 🔄 Локальная разработка

### **prod** (продакшн ветка)
- 🚀 **Автоматический деплой на VPS**
- ✅ Только проверенный код из main
- 🔒 HTTPS с SSL сертификатами
- 🌐 Доступна по адресу: https://heartofzha.ru
- ⚡ GitHub Actions автоматически деплоит изменения

---

## 🔄 Workflow разработки

### **1. Начало работы над новой функцией**

```bash
# Переключиться на dev ветку
git checkout dev

# Убедиться, что у вас последняя версия
git pull origin dev

# (Опционально) Создать feature ветку для конкретной задачи
git checkout -b feature/new-database-integration
```

### **2. Локальная разработка**

```bash
# Установить зависимости (если нужно)
npm install

# Запустить dev сервер
npm run dev

# Или через Docker
docker-compose up --build
```

**Сервер будет доступен:** http://localhost:3000

### **3. Работа с базой данных**

```bash
# Применить миграции Prisma
npx prisma migrate dev

# Открыть Prisma Studio для управления БД
npx prisma studio

# Генерация Prisma Client
npx prisma generate
```

### **4. Коммит изменений**

```bash
# Проверить изменения
git status

# Добавить файлы
git add .

# Коммит с описательным сообщением
git commit -m "feat: добавлена интеграция с MySQL базой данных"

# Отправить в dev ветку
git push origin dev
```

**Типы коммитов:**
- `feat:` - новая функция
- `fix:` - исправление бага
- `docs:` - изменения в документации
- `style:` - форматирование, стили
- `refactor:` - рефакторинг кода
- `test:` - добавление тестов
- `chore:` - обновление зависимостей, конфигов

### **5. Тестирование перед релизом**

```bash
# Запустить линтер
npm run lint

# Собрать продакшн версию
npm run build

# Тестовый деплой через Docker
docker-compose -f docker-compose.prod.yml up --build
```

### **6. Слияние в main**

```bash
# Переключиться на main
git checkout main

# Обновить main
git pull origin main

# Слить dev в main
git merge dev

# Отправить в удаленный репозиторий
git push origin main
```

### **7. Деплой в продакшн**

```bash
# Переключиться на prod
git checkout prod

# Обновить prod из main
git merge main

# Отправить в prod (автоматический деплой!)
git push origin prod
```

**🚀 После push в prod:**
- GitHub Actions автоматически подключается к VPS
- Скачивает последние изменения
- Собирает Docker образы
- Перезапускает контейнеры
- Сайт обновляется на https://heartofzha.ru

---

## 📊 Диаграмма workflow

```
┌─────────────┐
│     dev     │ ← Активная разработка
│ (локально)  │   - Новые функции
└──────┬──────┘   - Эксперименты
       │          - База данных
       │ git merge
       ↓
┌─────────────┐
│    main     │ ← Стабильная версия
│  (GitHub)   │   - Документация
└──────┬──────┘   - Тесты пройдены
       │
       │ git merge
       ↓
┌─────────────┐
│    prod     │ ← Продакшн
│    (VPS)    │   - Auto-deploy
└─────────────┘   - HTTPS
                  - heartofzha.ru
```

---

## 🛠️ Примеры сценариев

### **Сценарий 1: Добавление новой функции**

```bash
# 1. Начать работу в dev
git checkout dev
git pull origin dev

# 2. Разработка
npm run dev
# ... делаем изменения ...

# 3. Коммит и пуш
git add .
git commit -m "feat: добавлена функция экспорта результатов в PDF"
git push origin dev

# 4. Тестирование
npm run build
docker-compose -f docker-compose.prod.yml up --build

# 5. Если все ок - в main
git checkout main
git merge dev
git push origin main

# 6. Деплой в продакшн
git checkout prod
git merge main
git push origin prod  # 🚀 Автоматический деплой!
```

### **Сценарий 2: Работа с базой данных**

```bash
# 1. В dev ветке
git checkout dev

# 2. Изменить schema.prisma
# ... редактируем схему БД ...

# 3. Создать миграцию
npx prisma migrate dev --name add_user_profiles

# 4. Протестировать
npx prisma studio
npm run dev

# 5. Коммит
git add prisma/
git commit -m "feat: добавлена таблица user_profiles"
git push origin dev

# 6. Когда готово - в main и prod
git checkout main && git merge dev && git push origin main
git checkout prod && git merge main && git push origin prod
```

### **Сценарий 3: Срочное исправление (hotfix)**

```bash
# 1. Создать hotfix ветку от prod
git checkout prod
git checkout -b hotfix/critical-bug-fix

# 2. Исправить баг
# ... делаем изменения ...

# 3. Коммит
git add .
git commit -m "fix: исправлена критическая ошибка в расчете результатов"

# 4. Слить в prod
git checkout prod
git merge hotfix/critical-bug-fix
git push origin prod  # 🚀 Автоматический деплой!

# 5. Слить обратно в main и dev
git checkout main
git merge hotfix/critical-bug-fix
git push origin main

git checkout dev
git merge hotfix/critical-bug-fix
git push origin dev

# 6. Удалить hotfix ветку
git branch -d hotfix/critical-bug-fix
```

---

## 🔍 Проверка перед деплоем

### **Checklist перед слиянием в prod:**

- [ ] ✅ Код протестирован локально
- [ ] ✅ `npm run lint` без ошибок
- [ ] ✅ `npm run build` успешно
- [ ] ✅ Docker контейнеры запускаются
- [ ] ✅ Миграции БД применены (если есть)
- [ ] ✅ Документация обновлена
- [ ] ✅ README.md актуален
- [ ] ✅ Нет чувствительных данных в коде
- [ ] ✅ Environment переменные настроены

---

## 🚨 Откат изменений

### **Если что-то пошло не так на prod:**

```bash
# 1. На сервере - откат к предыдущему коммиту
ssh ubuntu@85.202.192.68
sudo -i
cd /var/www/heartzh

# 2. Откатить к предыдущей версии
git log --oneline  # Найти нужный коммит
git reset --hard <commit_hash>

# 3. Перезапустить контейнеры
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Проверить
docker ps
curl -I https://heartofzha.ru
```

### **Откат через GitHub:**

```bash
# Локально
git checkout prod
git revert <bad_commit_hash>
git push origin prod  # 🚀 Автоматический деплой откатной версии!
```

---

## 📦 CI/CD Pipeline

### **GitHub Actions автоматически выполняет:**

1. **При push в prod:**
   - Подключается к VPS через SSH
   - Переходит в `/var/www/heartzh`
   - Выполняет `git pull origin prod`
   - Запускает `docker-compose -f docker-compose.prod.yml up -d --build`
   - Проверяет статус контейнеров

2. **Логи деплоя:**
   - Доступны в GitHub: https://github.com/moralfager/heartzh/actions
   - Можно отслеживать в реальном времени

3. **Уведомления:**
   - Успешный деплой = зеленая галочка ✅
   - Ошибка деплоя = красный крестик ❌

---

## 🔐 Безопасность

### **Secrets в GitHub:**
- `SSH_KEY` - приватный SSH ключ для доступа к VPS
- `SSH_HOST` - адрес сервера (85.202.192.68)
- `SSH_USER` - пользователь (ubuntu)
- `SSH_PORT` - порт SSH (22)

### **Переменные окружения на сервере:**
```bash
# На VPS в /var/www/heartzh/.env
NODE_ENV=production
DATABASE_URL="mysql://..."
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password
```

---

## 📝 Полезные команды

### **Просмотр статуса деплоя:**
```bash
# На сервере
ssh ubuntu@85.202.192.68
sudo -i
cd /var/www/heartzh

# Статус контейнеров
docker ps

# Логи
docker-compose -f docker-compose.prod.yml logs -f

# Проверка сайта
curl -I https://heartofzha.ru
```

### **Управление ветками:**
```bash
# Список веток
git branch -a

# Удалить локальную ветку
git branch -d feature/old-feature

# Удалить удаленную ветку
git push origin --delete feature/old-feature

# Переименовать текущую ветку
git branch -m new-branch-name
```

---

## 🎯 Best Practices

1. **Всегда работайте в dev ветке** для новых функций
2. **Тестируйте локально** перед push
3. **Используйте осмысленные commit messages**
4. **Делайте частые коммиты** с небольшими изменениями
5. **Проверяйте GitHub Actions** после push в prod
6. **Держите main в стабильном состоянии**
7. **Документируйте изменения** в README
8. **Используйте feature branches** для больших задач
9. **Делайте code review** перед слиянием в main
10. **Тестируйте prod build локально** перед деплоем

---

**🚀 Готово! Теперь у вас есть полноценный workflow для безопасной разработки и деплоя!**

