# 🐳 Docker деплой "Психология Любви"

## 🚀 Быстрый старт

### **1. Локальное тестирование**

```bash
# Собрать и запустить
docker-compose up --build

# Или в фоновом режиме
docker-compose up -d --build
```

**Приложение будет доступно на:** http://localhost:3000

### **2. Продакшн деплой**

```bash
# Запуск продакшн версии
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📋 **Команды Docker**

### **Основные команды:**
```bash
# Сборка образа
docker build -t psychotest .

# Запуск контейнера
docker run -p 3000:3000 psychotest

# Остановка всех контейнеров
docker-compose down

# Просмотр логов
docker-compose logs -f

# Перезапуск
docker-compose restart
```

### **Управление контейнерами:**
```bash
# Список контейнеров
docker ps

# Остановка контейнера
docker stop <container_id>

# Удаление контейнера
docker rm <container_id>

# Удаление образа
docker rmi psychotest
```

## 🔧 **Настройка для продакшена**

### **1. Переменные окружения**

Создайте файл `.env`:
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### **2. SSL сертификаты**

```bash
# Создать папку для SSL
mkdir ssl

# Скопировать сертификаты
cp your-cert.crt ssl/
cp your-key.key ssl/
```

### **3. Настройка домена**

Отредактируйте `nginx-docker.conf`:
```nginx
server_name your-domain.com www.your-domain.com;
```

## 📊 **Мониторинг**

### **Проверка статуса:**
```bash
# Статус контейнеров
docker-compose ps

# Логи приложения
docker-compose logs psychotest

# Логи Nginx
docker-compose logs nginx

# Использование ресурсов
docker stats
```

### **Health checks:**
```bash
# Проверка здоровья
curl http://localhost/health

# Проверка приложения
curl http://localhost:3000
```

## 🚀 **Деплой на VPS с Docker**

### **1. Подготовка сервера:**
```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **2. Загрузка проекта:**
```bash
# Клонирование
git clone https://github.com/moralfager/heartzh.git
cd heartzh

# Запуск
docker-compose -f docker-compose.prod.yml up -d --build
```

### **3. Настройка автозапуска:**
```bash
# Создать systemd сервис
sudo nano /etc/systemd/system/psychotest.service
```

Содержимое сервиса:
```ini
[Unit]
Description=Psychology Love Test
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/your/project
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Активация:
```bash
sudo systemctl daemon-reload
sudo systemctl enable psychotest
sudo systemctl start psychotest
```

## 🔄 **Обновление приложения**

### **Автоматическое обновление (Watchtower):**
```bash
# Watchtower автоматически обновит контейнеры
# Проверить логи
docker-compose logs watchtower
```

### **Ручное обновление:**
```bash
# Остановить
docker-compose down

# Обновить код
git pull

# Пересобрать и запустить
docker-compose up -d --build
```

## 🛡️ **Безопасность**

### **1. Ограничения ресурсов:**
```yaml
# В docker-compose.yml
services:
  psychotest:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

### **2. Сетевая безопасность:**
```yaml
# Создать отдельную сеть
networks:
  psychotest-network:
    driver: bridge
```

### **3. Обновления безопасности:**
```bash
# Обновить базовые образы
docker-compose pull
docker-compose up -d --build
```

## 🆘 **Решение проблем**

### **Контейнер не запускается:**
```bash
# Проверить логи
docker-compose logs psychotest

# Проверить конфигурацию
docker-compose config
```

### **Ошибка портов:**
```bash
# Проверить занятые порты
netstat -tlnp | grep :3000
netstat -tlnp | grep :80

# Остановить конфликтующие процессы
sudo fuser -k 3000/tcp
sudo fuser -k 80/tcp
```

### **Проблемы с Nginx:**
```bash
# Проверить конфигурацию Nginx
docker exec -it <nginx_container_id> nginx -t

# Перезапустить Nginx
docker-compose restart nginx
```

## 📈 **Оптимизация**

### **1. Многоэтапная сборка:**
- Уже настроено в Dockerfile
- Уменьшает размер финального образа

### **2. Кэширование слоев:**
```bash
# Использовать кэш при сборке
docker-compose build --no-cache
```

### **3. Мониторинг ресурсов:**
```bash
# Установить cAdvisor для мониторинга
docker run -d \
  --name=cadvisor \
  -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  google/cadvisor:latest
```

---

**Docker - идеальное решение для деплоя! 🐳🚀**
