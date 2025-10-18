# 🚀 Деплой на ps.kz хостинг

## 📋 Пошаговая инструкция

### 1. Подготовка проекта
```bash
# Удалить ненужные файлы
rm -f deploy.sh deploy.bat
rm -f env.production.example
rm -f DEPLOYMENT_GUIDE.md DEPLOYMENT_READY.md
rm -f check-build.sh next-images.config.js
rm -f ecosystem.config.js
rm -f nginx.conf
rm -rf logs/
```

### 2. Сборка проекта
```bash
npm run build
```

### 3. Создание архива для загрузки
```bash
# Создать архив без node_modules
tar -czf psychotest.tar.gz --exclude=node_modules --exclude=.next --exclude=.git .
```

### 4. Загрузка на ps.kz

#### Через панель управления:
1. Зайти в **Файловый менеджер**
2. Перейти в папку **public_html** (или указанную в настройках)
3. Загрузить архив **psychotest.tar.gz**
4. Распаковать архив
5. Удалить архив

#### Через FTP:
```bash
# Загрузить файлы через FTP клиент
# Путь: /public_html/
```

### 5. Настройка на сервере

#### Установка Node.js (если не установлен):
```bash
# В терминале хостинга
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Установка зависимостей:
```bash
cd /path/to/your/project
npm install --production
```

#### Сборка проекта:
```bash
npm run build
```

### 6. Настройка веб-сервера

#### Для Apache (ps.kz обычно использует Apache):
- Файл `.htaccess` уже создан
- Настроить виртуальный хост если нужно

#### Для Nginx (если доступен):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/project/out;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 7. Настройка домена

#### В панели управления ps.kz:
1. **Домены** → **Добавить домен**
2. Указать домен: `your-domain.com`
3. Настроить DNS записи:
   - A: IP сервера
   - CNAME: www → your-domain.com

### 8. SSL сертификат

#### Через панель управления:
1. **SSL сертификаты** → **Let's Encrypt**
2. Выбрать домен
3. Активировать бесплатный SSL

### 9. Проверка работы

#### Открыть в браузере:
- `http://your-domain.com`
- `https://your-domain.com`

#### Проверить:
- ✅ Главная страница загружается
- ✅ Тесты работают
- ✅ Админка доступна
- ✅ SSL сертификат активен

### 10. Мониторинг

#### Логи ошибок:
```bash
# В панели управления ps.kz
# Логи → Ошибки веб-сервера
```

#### Статистика:
- **Посетители** → Аналитика
- **Трафик** → Статистика

## 🔧 Настройки ps.kz

### Рекомендуемые тарифы:
- **Стартовый**: 1GB RAM, 10GB SSD
- **Базовый**: 2GB RAM, 20GB SSD
- **Продвинутый**: 4GB RAM, 40GB SSD

### Дополнительные услуги:
- **SSL сертификат**: Бесплатно (Let's Encrypt)
- **Резервное копирование**: Рекомендуется
- **Мониторинг**: Включить

## 🆘 Решение проблем

### Ошибка 500:
1. Проверить логи ошибок
2. Проверить права доступа к файлам
3. Проверить настройки PHP/Node.js

### Медленная загрузка:
1. Включить кэширование
2. Оптимизировать изображения
3. Использовать CDN

### Проблемы с SSL:
1. Проверить настройки домена
2. Обновить сертификат
3. Проверить DNS записи

## 📞 Поддержка ps.kz

- **Техподдержка**: support@ps.kz
- **Документация**: docs.ps.kz
- **Форум**: forum.ps.kz

---

**Удачного деплоя! 🚀**
