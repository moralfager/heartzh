# 🚀 БЫСТРЫЙ СТАРТ - Запуск контейнеров

## Проблема
Контейнеры созданы но не запущены (STATUS: Created вместо Up)

## ✅ Решение

Выполните на сервере:

```bash
cd /var/www/heartzh

# Запустите контейнеры
sudo docker compose -f docker-compose.prod.yml up -d

# Проверьте статус (должны быть Up)
sudo docker ps

# Проверьте логи
sudo docker compose -f docker-compose.prod.yml logs --tail=30

# Проверьте что Nginx отвечает
curl http://localhost
```

## 🔍 Если Nginx не запустился

Ошибка может быть из-за MySQL контейнера (мы его убрали из docker-compose).

Попробуйте:

```bash
cd /var/www/heartzh

# Удалите старые контейнеры
sudo docker compose -f docker-compose.prod.yml down -v

# Запустите заново
sudo docker compose -f docker-compose.prod.yml up -d

# Проверьте
sudo docker ps
```

Должно быть 3 контейнера Up:
- heartzh-psychotest-1
- heartzh-nginx-1  
- heartzh-watchtower-1





