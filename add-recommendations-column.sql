-- Добавляет поле recommendations в таблицу default_results
-- Выполни на production сервере:
-- docker exec -i psychotest-psychotest-1 mysql -u psychotest_user -p1234 psychotest_production < add-recommendations-column.sql

USE psychotest_production;

-- Добавляем новое поле (если его ещё нет)
ALTER TABLE default_results 
ADD COLUMN IF NOT EXISTS recommendations JSON DEFAULT ('[]');

-- Проверяем что поле добавлено
DESCRIBE default_results;

-- Показываем все записи (для проверки)
SELECT id, test_id, summary_type, 
       JSON_LENGTH(recommendations) as rec_count,
       created_at 
FROM default_results;

