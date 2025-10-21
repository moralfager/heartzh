# 🚀 Деплой СЕЙЧАС - Простая инструкция

## GitHub Actions не работает (SSH блокируется)

Деплойте вручную - это проще и быстрее!

---

## ✅ ШАГ 1: Подключитесь к серверу

```powershell
ssh root@85.202.192.68
```

Если нужен другой порт:
```powershell
ssh -p 22 root@85.202.192.68
```

---

## ✅ ШАГ 2: Выполните команды на сервере

После подключения выполните:

```bash
cd /var/www/heartzh

# Подтянуть последние изменения
git fetch --all
git reset --hard origin/prod

# Остановить контейнеры
docker compose -f docker-compose.prod.yml down

# Собрать заново
docker compose -f docker-compose.prod.yml build

# Запустить
docker compose -f docker-compose.prod.yml up -d

# Проверить статус
docker ps
```

---

## ✅ ШАГ 3: Проверьте результат

Откройте в браузере:

- https://heartofzha.ru
- https://heartofzha.ru/tests
- https://heartofzha.ru/admin

---

## 🔍 Если что-то не работает

### Посмотреть логи:

```bash
docker compose -f docker-compose.prod.yml logs -f psychotest
```

### Перезапустить:

```bash
docker compose -f docker-compose.prod.yml restart
```

### Полная пересборка (если нужно):

```bash
docker compose -f docker-compose.prod.yml down
docker system prune -a
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📝 Все изменения уже в prod ветке!

```
✅ TypeScript ошибки исправлены
✅ Build проходит успешно
✅ Код в GitHub обновлен
```

**Просто выполните команды выше на сервере!** 🎉

