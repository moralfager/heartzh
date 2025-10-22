-- Обновляет существующие записи default_results, добавляя поле recommendations
-- Если у записи уже есть recommendations, ничего не делает

USE psychotest_production;

-- Обновляем все записи, у которых нет recommendations или они пустые
UPDATE default_results 
SET recommendations = JSON_ARRAY(
  'Развивай навыки вербального выражения чувств',
  'Работай над созданием безопасного пространства в отношениях',
  'Учись принимать уязвимость как силу, а не слабость'
)
WHERE recommendations IS NULL 
   OR JSON_LENGTH(recommendations) = 0;

-- Проверяем результат
SELECT 
  id, 
  test_id,
  summary_type,
  JSON_EXTRACT(recommendations, '$[0]') as first_recommendation,
  JSON_LENGTH(recommendations) as rec_count,
  updated_at
FROM default_results;

