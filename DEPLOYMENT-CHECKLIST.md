# 🚀 Deployment Checklist - Egg Integration

## ✅ Готово на локальной машине

- [x] Установлены все зависимости (`npm install`)
- [x] Создана структура `/src/app/egg/`
- [x] Перемещены все файлы из `egg/` в `src/app/egg/`
- [x] Обновлены все импорты и пути
- [x] Создан изолированный layout для egg
- [x] Добавлена кнопка на страницу `/about`
- [x] Обновлен `env.production.template` с JWT_SECRET
- [x] Обновлен `tsconfig.json` для исключения папки `egg/`
- [x] Обновлен `next.config.js` для исключения папки `egg/`
- [x] Проект успешно собирается (`npm run build`)
- [x] Нет ошибок TypeScript
- [x] Нет ошибок линтера

## 📋 Нужно сделать перед деплоем

### 1. На сервере обновить `.env.production`

```bash
# SSH на сервер
ssh root@85.202.192.68

# Перейти в проект
cd /var/www/heartofzharu

# Добавить JWT_SECRET в .env.production
nano .env.production
```

Добавить строку:
```bash
# Генерировать сильный ключ (опционально):
JWT_SECRET=$(openssl rand -base64 32)

# Или вручную добавить в .env.production:
JWT_SECRET="your-super-secret-jwt-key-at-least-32-chars-long"
```

Сохранить и выйти (Ctrl+O, Enter, Ctrl+X).

### 2. Закоммитить изменения

```bash
# На локальной машине
git add .
git commit -m "feat: integrate Heart of Zh.A. romantic quest at /egg route"
git push origin prod
```

### 3. Дождаться деплоя

GitHub Actions автоматически:
1. Соберёт Docker образ с egg проектом ✨
2. Запушит в GHCR 📦
3. Задеплоит на сервер 🚀

Следить за прогрессом: https://github.com/moralfager/heartzh/actions

## 🧪 Тестирование после деплоя

### Обязательные проверки:

```bash
# 1. Главная страница egg
curl https://heartofzha.ru/egg
# Должно вернуть HTML с "Heart of Zh.A."

# 2. API health check
curl https://heartofzha.ru/api/health
# Должно вернуть {"status":"ok"}

# 3. Генерация QR кода
curl -I https://heartofzha.ru/api/egg/qr-generate?format=image
# Должно вернуть Content-Type: image/png

# 4. Страница about
curl https://heartofzha.ru/about | grep "Подарок для Жаният"
# Должно найти текст
```

### В браузере:

1. **Открыть главную**: https://heartofzha.ru/egg
   - [ ] Страница загружается
   - [ ] Показывается сердце ❤️
   - [ ] Есть кнопка "Начать путешествие"
   - [ ] Розовый/лавандовый дизайн

2. **Проверить кнопку в About**: https://heartofzha.ru/about
   - [ ] Прокрутить вниз
   - [ ] Видна карточка "Подарок для Жаният"
   - [ ] Клик ведёт на `/egg`

3. **Начать квест**:
   - [ ] Нажать "Начать путешествие"
   - [ ] Открывается Глава 1
   - [ ] Есть аудио контроллер
   - [ ] Можно ввести код

4. **Проверить аудио**:
   - [ ] Нажать на иконку звука
   - [ ] Аудио воспроизводится
   - [ ] Можно включить/выключить

5. **Проверить карту**:
   - [ ] Перейти на `/egg/map`
   - [ ] Показываются все главы
   - [ ] Индикаторы статуса работают

6. **Проверить изоляцию стилей**:
   - [ ] Открыть `/` (главная psychotest)
   - [ ] Открыть `/egg` (egg проект)
   - [ ] Стили не смешиваются
   - [ ] Каждый проект выглядит правильно

## 🔧 Если что-то не работает

### JWT_SECRET не установлен

**Симптом**: Ошибка при генерации токенов
```
Error: JWT_SECRET is not defined
```

**Решение**: Добавить JWT_SECRET в `.env.production` на сервере

```bash
ssh root@85.202.192.68
cd /var/www/heartofzha.ru
echo 'JWT_SECRET="'$(openssl rand -base64 32)'"' >> .env.production
docker compose -f docker-compose.prod.yml restart psychotest
```

### Аудио не воспроизводится

**Симптом**: Ошибка 404 для `/egg/audio/ambient-main.mp3`

**Проверка**: Проверить что файлы скопировались
```bash
ssh root@85.202.192.68
docker compose -f docker-compose.prod.yml exec psychotest ls -la /app/public/egg/audio/
```

**Решение**: Если файлов нет, значит они не были в git. Добавить и задеплоить снова.

### Стили не применяются

**Симптом**: Egg страница выглядит без стилей

**Проверка**: Проверить что globals.css есть
```bash
ssh root@85.202.192.68
docker compose -f docker-compose.prod.yml exec psychotest cat /app/src/app/egg/globals.css | head -20
```

**Решение**: Перезапустить контейнер или пересобрать образ.

### 404 на /egg

**Симптом**: Страница не найдена

**Проверка**: 
```bash
ssh root@85.202.192.68
docker compose -f docker-compose.prod.yml exec psychotest ls -la /app/src/app/egg/
```

**Решение**: Файлы не попали в образ. Проверить что коммит был правильно запушен.

## 📊 Мониторинг

После успешного деплоя следить за:

1. **Логи приложения**:
```bash
ssh root@85.202.192.68
docker compose -f docker-compose.prod.yml logs psychotest --tail=100 -f
```

2. **Метрики сервера**:
```bash
ssh root@85.202.192.68
docker stats
```

3. **Доступность**:
- https://heartofzha.ru/api/health
- https://heartofzha.ru/egg

## 🎉 Готово!

После всех проверок egg проект успешно интегрирован и работает на продакшене!

## 📝 Полезные команды

```bash
# Перезапустить только приложение
docker compose -f docker-compose.prod.yml restart psychotest

# Посмотреть логи
docker compose -f docker-compose.prod.yml logs psychotest --tail=200

# Проверить здоровье
curl http://localhost:3000/api/health

# Зайти в контейнер
docker compose -f docker-compose.prod.yml exec psychotest sh

# Посмотреть переменные окружения
docker compose -f docker-compose.prod.yml exec psychotest env | grep JWT
```

