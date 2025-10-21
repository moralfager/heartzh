# ⚡ Quick Start Guide

## 🎯 Для разработчиков

### 1️⃣ Клонирование и настройка

```bash
# Клонировать репозиторий
git clone https://github.com/moralfager/heartzh.git
cd heartzh

# Переключиться на dev ветку
git checkout dev

# Установить зависимости
npm install
```

### 2️⃣ Локальная разработка

```bash
# Запуск dev сервера
npm run dev

# Открыть браузер: http://localhost:3000
```

### 3️⃣ Работа с Docker

```bash
# Запуск через Docker
docker-compose up --build

# В фоновом режиме
docker-compose up -d --build

# Остановка
docker-compose down
```

### 4️⃣ Деплой в продакшн

```bash
# 1. Протестировать изменения
npm run build
docker-compose -f docker-compose.prod.yml up --build

# 2. Если все ок - коммит
git add .
git commit -m "feat: ваше описание"
git push origin dev

# 3. Слить в main
git checkout main
git merge dev
git push origin main

# 4. Деплой (автоматический!)
git checkout prod
git merge main
git push origin prod  # 🚀 Автоматически деплоится на https://heartofzha.ru
```

---

## 🔑 Доступы

### Админ-панель
- **URL:** https://heartofzha.ru/admin
- **Логин:** `admin`
- **Пароль:** `psychotest2024`

### VPS сервер
- **IP:** 85.202.192.68
- **Пользователь:** ubuntu
- **Подключение:** `ssh ubuntu@85.202.192.68`

---

## 📋 Частые команды

### Git workflow
```bash
# Начать новую функцию
git checkout dev
git pull origin dev

# Коммит
git add .
git commit -m "feat: описание"
git push origin dev

# Деплой
git checkout prod
git merge main
git push origin prod
```

### Docker
```bash
# Статус контейнеров
docker ps

# Логи
docker-compose logs -f

# Перезапуск
docker-compose restart

# Остановка и очистка
docker-compose down
docker system prune -f
```

### На сервере
```bash
# Подключение
ssh ubuntu@85.202.192.68
sudo -i
cd /var/www/heartzh

# Статус
docker ps
docker-compose -f docker-compose.prod.yml logs -f

# Ручной деплой (если нужно)
git pull origin prod
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🐛 Решение проблем

### Контейнер не запускается
```bash
# Проверить логи
docker-compose logs

# Пересоздать контейнеры
docker-compose down
docker-compose up --build
```

### Ошибки в prod
```bash
# На сервере
ssh ubuntu@85.202.192.68
sudo -i
cd /var/www/heartzh

# Откат к предыдущей версии
git log --oneline
git reset --hard <commit_hash>
docker-compose -f docker-compose.prod.yml up -d --build
```

### SSL не работает
```bash
# На сервере
cd /var/www/heartzh
./ssl-renew.sh

# Проверка сертификата
curl -I https://heartofzha.ru
echo | openssl s_client -connect heartofzha.ru:443 -servername heartofzha.ru 2>/dev/null | openssl x509 -noout -dates
```

---

## 📖 Полная документация

- **Workflow:** [WORKFLOW.md](./WORKFLOW.md) - работа с ветками и деплой
- **Docker:** [DOCKER-GUIDE.md](./DOCKER-GUIDE.md) - детальное руководство по Docker
- **README:** [README.md](./README.md) - общая информация о проекте

---

## 🎯 Структура веток

```
dev (разработка) → main (стабильная) → prod (продакшн + авто-деплой)
```

- **dev** - активная разработка, эксперименты
- **main** - стабильная версия, документация
- **prod** - продакшн, автоматический деплой на https://heartofzha.ru

---

**🚀 Готово к работе!**

