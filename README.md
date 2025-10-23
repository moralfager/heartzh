# 💕 Психология Любви - Психологические Тесты

Современное веб-приложение для психологических тестов с красивым интерфейсом, админ-панелью и системой управления тестами.

> 🌐 **Продакшн**: https://heartofzha.ru (HTTPS с SSL от Let's Encrypt)
> 
> 🚀 **Автоматический деплой**: Push в ветку `prod` → GitHub Actions → VPS
> 
> 📖 **Деплой**: [START-HERE.md](./START-HERE.md) - быстрый старт для деплоя

---

## 🔄 Ветки

- **`prod`** - продакшн с автоматическим деплоем на https://heartofzha.ru

## ✨ Возможности

- 🧠 **Психологические тесты** - "Психология Любви" и "Как ты проявляешь свою любовь?"
- 📊 **Админ-панель** - просмотр результатов, управление тестами
- ✏️ **Редактор вопросов** - добавление, редактирование, удаление вопросов
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🎨 **Современный UI** - красивый интерфейс с анимациями
- 🔒 **Безопасность** - защищенная админ-панель
- 🐳 **Docker** - готовые контейнеры для деплоя

## 🚀 Быстрый старт

### Локальная разработка
```bash
# Установка зависимостей
npm install

# Создать .env файл (Windows)
powershell -ExecutionPolicy Bypass -File create-env.ps1

# Сгенерировать Prisma Client и настроить БД
npm run prisma:generate
npm run prisma:push

# Импортировать тестовые данные
npm run import-tests

# Запуск в режиме разработки (с Turbopack ⚡)
npm run dev

# Открыть http://localhost:3000
```

### Docker (рекомендуется для production)
```bash
# Разработка (MySQL + Adminer)
npm run docker:dev

# Production (полный стек)
npm run docker:prod

# Просмотр логов
npm run docker:logs

# Остановка
npm run docker:down
```

### База данных
```bash
# Открыть Prisma Studio (GUI для БД)
npm run prisma:studio

# Синхронизация схемы
npm run prisma:push

# Импорт тестов
npm run import-tests
```

### Деплой в продакшн
```bash
# Автоматический деплой через GitHub Actions
git checkout prod
git push origin prod  # 🚀 Автоматически деплоится на https://heartofzha.ru

# Или вручную на сервере
ssh root@85.202.192.68
cd /root/psychotest
git pull origin prod
docker-compose -f docker-compose.prod.yml up -d --build
```

📖 **Инструкции**: [START-HERE.md](./START-HERE.md)

## 🛠️ Технологии

**Frontend:**
- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Lucide React** - иконки

**Backend & Infrastructure:**
- **Docker** - контейнеризация
- **Nginx** - обратный прокси с HTTPS
- **Let's Encrypt** - бесплатные SSL сертификаты
- **GitHub Actions** - CI/CD автоматизация
- **Prisma** (готово) - ORM для работы с БД
- **MySQL** (готово) - база данных

## 📊 Тесты

### 1. Психология Любви (50 вопросов)
- **4 блока**: Партнер в любви, Ценности, Язык любви, Реакции на конфликты
- **Результат**: тип личности и рекомендации

### 2. Как ты проявляешь свою любовь? (50 вопросов)
- **4 блока**: Проявления любви, Подарки, Идеальные свидания, Забота о партнере
- **Результат**: профиль проявлений любви

## 🔧 Админ-панель

### Доступ
- URL: `/admin`
- Логин: `admin`
- Пароль: `psychotest2024`

### Возможности
- Просмотр результатов тестов
- Статистика пользователей
- Управление тестами
- Редактирование вопросов
- Экспорт данных

## 🐳 Docker деплой

### Локальное тестирование
```bash
docker-compose up --build
```

### Продакшн деплой
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### VPS деплой
```bash
# На сервере
git clone https://github.com/moralfager/heartzh.git
cd heartzh
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📁 Структура проекта

```
src/
├── app/                 # Next.js App Router
│   ├── admin/          # Админ-панель
│   ├── tests/          # Страницы тестов
│   └── api/            # API endpoints
├── components/          # React компоненты
├── lib/               # Утилиты и типы
└── hooks/             # Custom hooks

public/
├── tests/             # JSON файлы тестов
└── images/            # Статические изображения

# Docker файлы
├── Dockerfile         # Docker образ
├── docker-compose.yml # Разработка
├── docker-compose.prod.yml # Продакшн
└── nginx-docker.conf  # Nginx конфигурация
```

## 🔧 Настройка

### Переменные окружения
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### База данных (опционально)
```env
DATABASE_URL="mysql://user:pass@host:port/db"
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password
```

## 📈 Мониторинг

### Docker
```bash
# Статус контейнеров
docker ps

# Логи
docker-compose logs -f

# Ресурсы
docker stats
```

### PM2 (альтернатива)
```bash
pm2 status
pm2 logs
pm2 monit
```

## 🛡️ Безопасность

- ✅ **HTTPS** с SSL сертификатами от Let's Encrypt
- ✅ **HSTS** (HTTP Strict Transport Security)
- ✅ **Security Headers** (X-Frame-Options, X-Content-Type-Options, etc.)
- ✅ **Автоматическое обновление SSL** (cron каждый день в 3:00)
- ✅ Защищенная админ-панель
- ✅ Валидация входных данных
- ✅ Защита от XSS
- ✅ Docker изоляция

## 🚀 Деплой

### Автоматический деплой через GitHub Actions

**1. Настройка GitHub Secrets (один раз)**

Добавьте secrets в настройках репозитория (Settings → Secrets and variables → Actions):

- `SSH_PRIVATE_KEY` - SSH ключ для подключения к серверу
- `SERVER_HOST` - `85.202.192.68`
- `SERVER_USER` - `root`
- `SERVER_PATH` - `/root/psychotest`

**2. Деплой**
```bash
# Просто push в prod
git push origin prod  # 🚀 Автоматически деплоится!
```

**3. Мониторинг**
- GitHub Actions: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
- Логи на сервере: `ssh root@85.202.192.68 "cd /root/psychotest && docker-compose -f docker-compose.prod.yml logs -f"`

### Ручной деплой

**На сервере:**
```bash
ssh root@85.202.192.68
cd /root/psychotest
git pull origin prod
docker-compose -f docker-compose.prod.yml up -d --build
```

**Локально (с скриптами):**
```bash
# Windows
.\deploy-production.ps1

# Linux/Mac
./deploy-production.sh
```

### Первый деплой на чистый сервер

```bash
# 1. На сервере установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git /root/psychotest
cd /root/psychotest
git checkout prod

# 3. Создать .env.production
cp env.production.template .env.production
nano .env.production  # Изменить пароли!

# 4. Запустить
docker-compose -f docker-compose.prod.yml up -d --build

# 5. Проверить
curl http://localhost:3000/api/health
```

📖 **Детальные инструкции**: [START-HERE.md](./START-HERE.md)

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker-compose logs`
2. Проверьте статус: `docker ps`
3. Проверьте конфигурацию: `docker-compose config`

## 📄 Лицензия

MIT License - используйте свободно для коммерческих и некоммерческих проектов.

---

**Создано с ❤️ для изучения психологии любви**#   t o u c h   t o   t r i g g e r   d e p l o y   1 0 / 2 3 / 2 0 2 5   1 9 : 4 1 : 5 5  
 #   t o u c h   t o   t r i g g e r   d e p l o y   1 0 / 2 3 / 2 0 2 5   1 9 : 4 6 : 0 7  
 #   t o u c h   t o   t r i g g e r   d e p l o y   1 0 / 2 3 / 2 0 2 5   2 0 : 0 4 : 2 0  
 #   t o u c h   t o   t r i g g e r   d e p l o y   1 0 / 2 3 / 2 0 2 5   2 0 : 0 9 : 0 7  
 