-- SQL скрипт для создания таблиц в MySQL/MariaDB
-- Выполните этот скрипт в phpMyAdmin или SQL редакторе вашего хостинга

-- Таблица для хранения результатов тестов
CREATE TABLE test_results (
  id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  test_id VARCHAR(255) NOT NULL,
  test_title VARCHAR(255) NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  answers JSON NOT NULL,
  results JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_session_id (session_id),
  INDEX idx_test_id (test_id),
  INDEX idx_completed_at (completed_at)
);

-- Таблица для хранения тестов
CREATE TABLE tests (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  category VARCHAR(255),
  est_minutes INT DEFAULT 5,
  questions_count INT DEFAULT 0,
  is_pseudo BOOLEAN DEFAULT FALSE,
  languages TEXT DEFAULT '["ru"]',
  questions JSON,
  scoring JSON,
  result_rules JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug)
);

-- Вставляем существующие тесты
INSERT INTO tests (id, slug, title, subtitle, category, est_minutes, questions_count, is_pseudo, languages, questions, scoring, result_rules) VALUES
('test-1', 'love-psychology', 'Психология Любви', 'Узнайте свой тип привязанности и язык любви', 'relationships', 10, 40, false, '["ru"]', '{}', '{"type": "weighted-domains"}', '[]'),
('test-2', 'love-expressions', 'Как ты проявляешь свою любовь?', 'Тест о способах выражения любви и предпочтениях в отношениях', 'relationships', 15, 50, false, '["ru"]', '{}', '{"type": "weighted-domains"}', '[]');
