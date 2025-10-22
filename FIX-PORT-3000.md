# 🔧 Исправление: Порт 3000 занят

## Проблема
```
failed to bind host port for 0.0.0.0:3000:172.18.0.3:3000/tcp: address already in use
```

## ✅ Решение

### Шаг 1: Найдите что занимает порт 3000

```bash
# Найти процесс на порту 3000
sudo lsof -i :3000

# Или через netstat
sudo netstat -tlnp | grep :3000

# Или через ss
sudo ss -tlnp | grep :3000
```

### Шаг 2: Остановите процесс

#### Вариант А: Если это старый Docker контейнер

```bash
# Покажите все контейнеры (даже остановленные)
sudo docker ps -a

# Найдите контейнеры с портом 3000
sudo docker ps -a | grep 3000

# Остановите и удалите
sudo docker rm -f <CONTAINER_ID>

# ИЛИ удалите все остановленные контейнеры
sudo docker container prune -f
```

#### Вариант Б: Если это Node.js процесс

```bash
# Найдите PID процесса
sudo lsof -i :3000
# Запомните число в колонке PID

# Остановите процесс
sudo kill -9 <PID>
```

#### Вариант В: Если это PM2/systemd сервис

```bash
# Проверьте PM2
pm2 list
pm2 stop all
pm2 delete all

# Проверьте systemd
sudo systemctl list-units | grep psycho
sudo systemctl stop <service-name>
```

### Шаг 3: Запустите контейнеры заново

```bash
cd /var/www/heartzh

# Запустите
sudo docker compose -f docker-compose.prod.yml up -d

# Проверьте
sudo docker ps
```

---

## 🚀 Быстрое решение (выполните на сервере)

```bash
# 1. Найдите и остановите процесс на порту 3000
sudo lsof -i :3000
# Скопируйте PID из вывода

# 2. Остановите процесс (замените <PID> на число из шага 1)
sudo kill -9 <PID>

# 3. Удалите все остановленные контейнеры
sudo docker container prune -f

# 4. Запустите заново
cd /var/www/heartzh
sudo docker compose -f docker-compose.prod.yml up -d

# 5. Проверьте
sudo docker ps
curl http://localhost
```

---

## 📋 Альтернатива: Изменить порт

Если не можете освободить порт 3000, измените его:

```bash
sudo nano /var/www/heartzh/docker-compose.prod.yml
```

Измените:
```yaml
psychotest:
  ports:
    - "3001:3000"  # Изменили 3000 на 3001
```

И в nginx-docker.conf:
```nginx
proxy_pass http://psychotest:3000;  # Внутри контейнера всё равно 3000
```

Но лучше освободить порт 3000!





