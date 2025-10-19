# 💕 Психология Любви - Психологические Тесты

Современное веб-приложение для психологических тестов с красивым интерфейсом, админ-панелью и системой управления тестами.

> 🌐 **Продакшн**: https://heartofzha.ru (HTTPS с SSL от Let's Encrypt)
> 
> 🚀 **Автоматический деплой**: Изменения в ветке `prod` автоматически деплоятся на VPS через GitHub Actions.
> 
> 📋 **Workflow**: [WORKFLOW.md](./WORKFLOW.md) - полное руководство по работе с ветками и деплою

---

## 🔄 Структура веток

- **`main`** - стабильная версия с документацией
- **`dev`** - активная разработка и тестирование
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

### Локальная разработка (dev ветка)
```bash
# Переключиться на dev ветку
git checkout dev

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Открыть http://localhost:3000
```

### Docker (рекомендуется)
```bash
# Разработка
docker-compose up --build

# Продакшн (тестирование локально)
docker-compose -f docker-compose.prod.yml up -d --build
```

### Деплой в продакшн
```bash
# 1. Протестировать в dev
git checkout dev
# ... разработка и тестирование ...

# 2. Слить в main
git checkout main
git merge dev
git push origin main

# 3. Деплой (автоматический!)
git checkout prod
git merge main
git push origin prod  # 🚀 Автоматически деплоится на https://heartofzha.ru
```

📖 **Подробнее**: [WORKFLOW.md](./WORKFLOW.md)

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

### Автоматический деплой (текущая настройка)

**Просто push в prod ветку:**
```bash
git checkout prod
git merge main
git push origin prod  # 🚀 Автоматически деплоится!
```

**GitHub Actions автоматически:**
1. Подключается к VPS через SSH
2. Обновляет код (`git pull origin prod`)
3. Пересоздает Docker контейнеры
4. Сайт обновляется на https://heartofzha.ru

**Отслеживание деплоя:**
- GitHub Actions: https://github.com/moralfager/heartzh/actions
- Логи на сервере: `docker-compose -f docker-compose.prod.yml logs -f`

### Ручной деплой (если нужно)

**На VPS:**
```bash
ssh ubuntu@85.202.192.68
sudo -i
cd /var/www/heartzh
git pull origin prod
docker-compose -f docker-compose.prod.yml up -d --build
```

### SSL сертификаты

**Автоматическое обновление:**
- Cron задача запускается каждый день в 3:00
- Скрипт: `/var/www/heartzh/ssl-renew.sh`
- Сертификаты действительны 90 дней

**Ручное обновление:**
```bash
cd /var/www/heartzh
./ssl-renew.sh
```

📖 **Подробнее**: [WORKFLOW.md](./WORKFLOW.md)

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker-compose logs`
2. Проверьте статус: `docker ps`
3. Проверьте конфигурацию: `docker-compose config`

## 📄 Лицензия

MIT License - используйте свободно для коммерческих и некоммерческих проектов.

---

**Создано с ❤️ для изучения психологии любви**