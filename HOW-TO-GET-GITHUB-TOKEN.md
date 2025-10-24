# 🔑 Как получить GitHub Token для GHCR

## Шаг 1: Создать Personal Access Token (PAT)

1. Зайди на GitHub: https://github.com/settings/tokens
2. Нажми **"Generate new token"** → **"Generate new token (classic)"**
3. Заполни форму:
   - **Note**: `GHCR Docker Access` (название для себя)
   - **Expiration**: `No expiration` (или выбери срок)
   - **Scopes** (галочки):
     - ✅ `write:packages` - для публикации образов
     - ✅ `read:packages` - для скачивания образов
     - ✅ `delete:packages` - для удаления старых версий (опционально)

4. Нажми **"Generate token"** внизу страницы
5. **ВАЖНО**: Скопируй токен сразу! Он показывается только один раз!
   - Выглядит примерно так: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Шаг 2: Для твоего случая

Твои данные:
- **Username**: `moralfager` (твой GitHub username)
- **Repository**: `moralfager/heartzh`
- **Token**: `ghp_твой_токен_который_скопировал`

## Шаг 3: Залогиниться на сервере

Подключись к серверу и выполни:

```bash
# Замени ghp_YOUR_TOKEN на свой токен
echo "ghp_YOUR_TOKEN" | docker login ghcr.io -u moralfager --password-stdin
```

Пример с настоящим токеном (НЕ ПОКАЗЫВАЙ НИКОМУ):
```bash
echo "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" | docker login ghcr.io -u moralfager --password-stdin
```

Должно появиться:
```
Login Succeeded
```

## Шаг 4: Сделать пакет публичным (Рекомендуется)

Если ты сделаешь Docker image публичным, то не нужен будет логин вообще!

1. После первого деплоя, зайди: https://github.com/moralfager?tab=packages
2. Найди пакет `heartzh`
3. Нажми на него
4. **Package settings** (справа внизу)
5. **Change visibility** → **Public**
6. Подтверди

Теперь сервер сможет пуллить образы без логина!

## Шаг 5: Добавить токен в GitHub Secrets

Для GitHub Actions (уже должен быть `GITHUB_TOKEN`, но если нужен другой):

1. Зайди: https://github.com/moralfager/heartzh/settings/secrets/actions
2. **New repository secret**
3. Name: `GHCR_TOKEN` (если нужен отдельный)
4. Value: твой токен `ghp_xxxxx`

Но обычно `GITHUB_TOKEN` уже есть автоматически и его достаточно.

## ⚠️ Безопасность

- ❌ НЕ коммить токен в git
- ❌ НЕ публиковать токен
- ✅ Храни токен в password manager
- ✅ Используй токен только на сервере через переменные окружения

## 🔄 Если забыл токен

Токен показывается только один раз. Если забыл - создай новый:
1. https://github.com/settings/tokens
2. Найди старый токен (по названию)
3. **Delete** (удали старый)
4. Создай новый (шаги выше)

## ✅ Проверка

После логина проверь, что можешь пуллить:
```bash
docker pull ghcr.io/moralfager/heartzh:prod
```

Если работает - всё настроено правильно! 🎉



