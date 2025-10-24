# Исправление проблемы подключения к БД

## Проблема
Ошибка `Server has closed the connection` при сохранении результатов тестов в production.

## Причина
MySQL закрывает неактивные соединения, а Prisma Client не переподключался корректно.

## Исправления

### 1. `src/lib/prisma.ts`
- Упрощена конфигурация Prisma Client
- Добавлен механизм keep-alive (пинг каждые 5 минут)
- Добавлено автоматическое переподключение при ошибках

### 2. `src/app/api/internal/results/route.ts`
- Добавлена retry логика (3 попытки) для операций с БД
- Добавлено переподключение при временных ошибках

## Деплой на production

### На сервере (Linux):

```bash
# 1. Загрузить изменения из репозитория
cd /var/www/heartofzha.ru
git pull origin prod

# 2. Запустить скрипт деплоя
chmod +x quick-fix-deploy.sh
./quick-fix-deploy.sh
```

### Или вручную:

```bash
# 1. Перейти в директорию проекта
cd /var/www/heartofzha.ru

# 2. Загрузить изменения
git pull origin prod

# 3. Остановить контейнер
docker compose -f docker-compose.prod.yml stop psychotest

# 4. Удалить старый контейнер
docker compose -f docker-compose.prod.yml rm -f psychotest

# 5. Пересобрать образ
docker compose -f docker-compose.prod.yml build psychotest

# 6. Запустить контейнер
docker compose -f docker-compose.prod.yml up -d psychotest

# 7. Проверить логи
docker compose -f docker-compose.prod.yml logs -f psychotest
```

## Проверка работы

1. Откройте сайт и пройдите тест
2. Результаты должны сохраниться без ошибки 500
3. В логах должно появиться:
   ```
   [Prisma] Keep-alive ping successful
   ```

## Мониторинг

Следить за логами в реальном времени:
```bash
docker compose -f docker-compose.prod.yml logs -f psychotest
```

Проверить состояние контейнера:
```bash
docker compose -f docker-compose.prod.yml ps
```

## Дополнительно

Если проблема сохраняется, проверьте настройки MySQL:
```bash
docker compose -f docker-compose.prod.yml exec mysql mysql -u root -p -e "SHOW VARIABLES LIKE 'wait_timeout';"
```

Стандартное значение `wait_timeout` для MySQL: 28800 секунд (8 часов).
Keep-alive пингует каждые 5 минут, что должно предотвратить закрытие соединения.

