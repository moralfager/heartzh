# 🚀 Ручной деплой на Production

## Почему ручной деплой?

GitHub Actions SSH подключения блокируются сервером (firewall/rate limiting).  
Используйте ручной деплой со своего компьютера.

---

## 📋 Быстрый деплой

### Windows (PowerShell):

```powershell
.\deploy-manual.ps1
```

### Linux/Mac:

```bash
chmod +x deploy-manual.sh
./deploy-manual.sh
```

---

## 🔧 Что делает скрипт

1. ✅ Проверяет что вы на ветке `prod`
2. ✅ Проверяет что нет незакоммиченных изменений
3. 📤 Пушит изменения в `origin/prod`
4. 🔐 Подключается к серверу через SSH
5. 📥 Делает `git pull` на сервере
6. 🐳 Пересобирает и перезапускает Docker контейнеры
7. ✅ Показывает статус контейнеров

---

## ⚙️ Настройка

### 1. SSH доступ

Убедитесь что у вас есть SSH доступ к серверу:

```powershell
ssh root@85.202.192.68
```

Если не работает, настройте SSH ключ:

```powershell
# Создайте ключ (если нет)
ssh-keygen -t ed25519

# Скопируйте на сервер
ssh-copy-id root@85.202.192.68
```

### 2. Переменные окружения (опционально)

Если у вас другой пользователь/хост/порт:

**PowerShell:**
```powershell
$env:SSH_USER = "myuser"
$env:SSH_HOST = "myserver.com"
$env:SSH_PORT = "2222"

.\deploy-manual.ps1
```

**Bash:**
```bash
export SSH_USER=myuser
export SSH_HOST=myserver.com
export SSH_PORT=2222

./deploy-manual.sh
```

---

## 📝 Workflow

### Типичный деплой:

```powershell
# 1. Убедитесь что все изменения закоммичены
git status

# 2. Переключитесь на prod
git checkout prod

# 3. Слейте изменения (если нужно)
git merge main

# 4. Запустите деплой
.\deploy-manual.ps1
```

---

## 🐛 Troubleshooting

### ❌ SSH connection refused

**Проблема:** Не можете подключиться к серверу

**Решение:**
1. Проверьте что сервер доступен: `ping 85.202.192.68`
2. Проверьте SSH порт: `ssh -v root@85.202.192.68`
3. Проверьте firewall на сервере

### ❌ Permission denied (publickey)

**Проблема:** SSH ключ не принимается

**Решение:**
```powershell
# Скопируйте ваш публичный ключ на сервер
cat ~/.ssh/id_ed25519.pub | ssh root@85.202.192.68 "cat >> ~/.ssh/authorized_keys"
```

### ❌ Docker build fails

**Проблема:** Ошибка при сборке Docker

**Решение:**
```bash
# Подключитесь к серверу
ssh root@85.202.192.68

# Очистите Docker кэш
docker system prune -a --volumes

# Попробуйте снова
cd /var/www/heartzh
docker compose -f docker-compose.prod.yml build --no-cache
```

---

## 🔄 Альтернатива: GitHub Actions (если разблокируют SSH)

Если SSH с GitHub Actions будет разрешен:

1. Раскомментируйте в `.github/workflows/deploy.yml`:
   ```yaml
   on:
     push:
       branches: [ "prod" ]
   ```

2. Push в prod будет автоматически деплоить

---

## ✅ После деплоя

Проверьте что всё работает:

- 🌐 Сайт: https://heartofzha.ru
- 📋 Тесты: https://heartofzha.ru/tests
- 🔧 Админка: https://heartofzha.ru/admin

---

## 📞 Поддержка

Если что-то не работает:

1. Проверьте логи на сервере:
   ```bash
   ssh root@85.202.192.68
   cd /var/www/heartzh
   docker compose -f docker-compose.prod.yml logs -f
   ```

2. Проверьте статус контейнеров:
   ```bash
   docker ps
   ```

3. Перезапустите контейнеры:
   ```bash
   docker compose -f docker-compose.prod.yml restart
   ```

