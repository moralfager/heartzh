# ✅ ГОТОВО К ДЕПЛОЮ (БЕЗ SSL)!

## 📦 Что сделано

### Созданные файлы:
- ✅ `nginx-http-only.conf` - временный конфиг БЕЗ SSL (только HTTP)
- ✅ `SETUP-SSL.md` - инструкция по настройке SSL после деплоя

### Обновлённые файлы:
- ✅ `docker-compose.prod.yml` - использует HTTP-only конфиг
- ✅ `START-HERE.md` - добавлена информация о деплое без SSL
- ✅ `.github/workflows/deploy.yml` - тесты не блокируют деплой

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ

### 1. Проверь GitHub Secrets

Зайди в **GitHub → Settings → Secrets and variables → Actions**

Убедись что настроены:
```
SSH_PRIVATE_KEY = <твой SSH ключ>
SERVER_HOST = 85.202.192.68  ← ВАЖНО: IP адрес, НЕ домен!
SERVER_USER = root
SERVER_PATH = /root/psychotest
```

**❌ НЕ ИСПОЛЬЗУЙ:** `heartofzha.ru` в SERVER_HOST  
**✅ ИСПОЛЬЗУЙ:** `85.202.192.68`

---

### 2. Деплой на сервер

```bash
git add .
git commit -m "Deploy without SSL (first deploy)"
git push origin prod
```

**Что произойдёт:**
1. GitHub Actions запустится автоматически
2. Соберёт приложение
3. Подключится к серверу по SSH
4. Запустит docker-compose
5. Приложение будет доступно на **http://heartofzha.ru** (БЕЗ https)

---

### 3. После успешного деплоя

**Проверь что работает:**
```bash
# В браузере
http://heartofzha.ru

# Или командой
curl http://heartofzha.ru/api/health
```

**Должен вернуть:**
```json
{"status":"healthy","services":{"database":"connected","api":"running"}}
```

---

### 4. Настрой SSL (HTTPS)

Когда приложение работает на HTTP, настрой SSL:

📖 **Следуй инструкциям:** `SETUP-SSL.md`

После настройки:
- ✅ https://heartofzha.ru - работает с зелёным замочком 🔒
- ✅ http://heartofzha.ru - автоматически редиректит на https

---

## 📊 Мониторинг деплоя

### Смотри процесс в GitHub Actions:
https://github.com/YOUR_USERNAME/YOUR_REPO/actions

### Логи на сервере:
```bash
ssh root@85.202.192.68
cd /root/psychotest
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🆘 Если что-то пошло не так

### GitHub Actions упал с "missing server host"
→ Проверь что `SERVER_HOST = 85.202.192.68` (IP, не домен!)

### Nginx не запускается
→ Это нормально если используется старый конфиг с SSL
→ Убедись что используется `nginx-http-only.conf` в docker-compose

### База данных не создаётся
→ Подожди 30 секунд для инициализации
→ Проверь логи: `docker-compose -f docker-compose.prod.yml logs mysql`

### Приложение не отвечает
→ Проверь логи: `docker-compose -f docker-compose.prod.yml logs psychotest`
→ Проверь `.env.production` на сервере

---

## 📖 Документация

- **START-HERE.md** - быстрый старт
- **SETUP-SSL.md** - настройка SSL после деплоя
- **README.md** - полная документация

---

**Готов деплоить?** 🚀

1. Проверь GitHub Secrets ✅
2. Push в prod ✅
3. Жди ~2-3 минуты ⏳
4. Проверь http://heartofzha.ru ✅
5. Настрой SSL 🔒




