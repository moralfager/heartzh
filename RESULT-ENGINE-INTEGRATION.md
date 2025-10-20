# 🔧 Интеграция Result Engine

Как интегрировать новый движок расчёта результатов в существующий код.

---

## 📋 Что нужно сделать

### ✅ Уже готово:
- [x] Result Engine реализован (`src/lib/result-engine/`)
- [x] Типы определены
- [x] Aggregators созданы
- [x] Rules processors готовы
- [x] Главный движок работает

### 🔄 Осталось сделать:
- [ ] UI для управления Scales в админке
- [ ] UI для управления Rules в админке
- [ ] Заменить hardcoded расчёты на `computeResult()`
- [ ] Добавить scales и rules в существующие тесты

---

## 🎯 План интеграции

### Этап 1: Добавить Scales UI в админку

**Файл:** `src/app/admin/tests/[id]/edit/_components/ScalesTab.tsx`

**Что делает:**
- Список scales теста
- CRUD операции (создать, редактировать, удалить)
- Настройка bands (диапазонов)

**API endpoints:**
- `GET /api/admin/tests/[id]/scales`
- `POST /api/admin/tests/[id]/scales`
- `PUT /api/admin/tests/[id]/scales/[scaleId]`
- `DELETE /api/admin/tests/[id]/scales/[scaleId]`

---

### Этап 2: Добавить Rules UI в админку

**Файл:** `src/app/admin/tests/[id]/edit/_components/RulesTab.tsx`

**Что делает:**
- Список rules теста
- Визуальный редактор для каждого типа:
  - Threshold: drag & drop ranges
  - Formula: редактор выражений с превью
  - Combo: конструктор условий

**API endpoints:**
- `GET /api/admin/tests/[id]/rules`
- `POST /api/admin/tests/[id]/rules`
- `PUT /api/admin/tests/[id]/rules/[ruleId]`
- `DELETE /api/admin/tests/[id]/rules/[ruleId]`

---

### Этап 3: Интегрировать с результатами

**Было:** `src/app/tests/[slug]/results/page.tsx`
```typescript
// Hardcoded расчёт
const scores = calculateScores(answers, testData.questions);
const profile = generateResultProfile(scores);
```

**Стало:**
```typescript
import { computeResult } from '@/lib/result-engine';

// Получаем scales и rules из БД (вместе с тестом)
const result = computeResult({
  version: testData.meta.version,
  scales: testData.scales,
  rules: testData.rules,
  answers: answers.map(a => ({
    questionId: a.questionId,
    value: a.value,
    weights: getWeightsForAnswer(a, testData),
    timestamp: a.timestamp,
  })),
});

// result содержит:
// - scaleScores
// - interpretations
// - compositeScores
// - patterns
// - audit (для отладки)
```

---

## 📊 Пример: Миграция теста "Психология Любви"

### Текущая структура (hardcoded):

```typescript
// src/lib/love-test-logic.ts
export function calculateScores(answers, questions) {
  const scores = {
    secure: 0,
    anxious: 0,
    avoidant: 0,
    // ... hardcode
  };
  
  // Магические числа и формулы
  answers.forEach(answer => {
    if (answer.questionId.includes('block1')) {
      scores.secure += answer.value;
    }
    // ...
  });
  
  return scores;
}
```

### Новая структура (DSL):

**1. Scales в БД:**
```json
[
  {
    "key": "secure_attachment",
    "name": "Надёжная привязанность",
    "min": 0,
    "max": 50,
    "bands": [
      {"to": 16, "label": "low"},
      {"to": 34, "label": "mid"},
      {"to": 50, "label": "high"}
    ]
  },
  {
    "key": "anxious_attachment",
    "name": "Тревожная привязанность",
    "min": 0,
    "max": 50
  },
  {
    "key": "avoidant_attachment",
    "name": "Избегающая привязанность",
    "min": 0,
    "max": 50
  }
]
```

**2. Rules в БД:**
```json
[
  {
    "kind": "threshold",
    "payload": {
      "scaleKey": "secure_attachment",
      "ranges": [
        {
          "to": 16,
          "label": "low",
          "title": "Неустойчивая привязанность",
          "description": "Вам может быть сложно доверять партнёру",
          "recommendations": [
            "Работа с психологом по теме привязанности",
            "Исследуйте свои детские паттерны"
          ]
        },
        {
          "to": 34,
          "label": "mid",
          "title": "Умеренная привязанность",
          "description": "У вас есть признаки надёжной привязанности, но есть куда расти"
        },
        {
          "to": 50,
          "label": "high",
          "title": "Надёжная привязанность",
          "description": "Вы способны к глубоким и доверительным отношениям"
        }
      ]
    }
  },
  {
    "kind": "formula",
    "payload": {
      "key": "relationship_health",
      "name": "Здоровье отношений",
      "expr": "(secure_attachment * 0.5) + (anxious_attachment * -0.25) + (avoidant_attachment * -0.25) + 25",
      "ranges": [
        {"to": 30, "label": "Требует внимания"},
        {"to": 60, "label": "Стабильные"},
        {"to": 100, "label": "Гармоничные"}
      ]
    }
  },
  {
    "kind": "combo",
    "payload": {
      "when": [
        {"scaleKey": "anxious_attachment", "condition": "high"},
        {"scaleKey": "avoidant_attachment", "condition": "high"}
      ],
      "label": "fearful_avoidant",
      "title": "Тревожно-избегающий тип",
      "description": "Вы хотите близости, но боитесь её. Это создаёт внутренний конфликт",
      "recommendations": [
        "Индивидуальная терапия обязательна",
        "Работа с травмой привязанности",
        "Медленный темп в новых отношениях"
      ]
    }
  }
]
```

**3. Weights в вопросах:**

Вместо:
```json
{
  "id": "q1",
  "text": "Мне легко довериться партнёру",
  "block": 1  // <- магическая связь с расчётами
}
```

Делаем:
```json
{
  "id": "q1",
  "text": "Мне легко довериться партнёру",
  "type": "scale",
  "options": [
    {
      "text": "Совсем не про меня",
      "value": 1,
      "weights": {
        "secure_attachment": 1,
        "anxious_attachment": 5
      }
    },
    {
      "text": "Скорее не про меня",
      "value": 2,
      "weights": {
        "secure_attachment": 2,
        "anxious_attachment": 4
      }
    },
    {
      "text": "Нейтрально",
      "value": 3,
      "weights": {
        "secure_attachment": 3,
        "anxious_attachment": 3
      }
    },
    {
      "text": "Скорее про меня",
      "value": 4,
      "weights": {
        "secure_attachment": 4,
        "anxious_attachment": 2
      }
    },
    {
      "text": "Полностью про меня",
      "value": 5,
      "weights": {
        "secure_attachment": 5,
        "anxious_attachment": 1
      }
    }
  ]
}
```

---

## 🔧 Изменения в коде

### 1. API для загрузки теста

**Было:** `src/app/api/tests/[slug]/route.ts`
```typescript
// Scales и rules пустые
scales: test.scales,  // []
rules: test.rules,    // []
```

**Стало:**
```typescript
// Возвращаем настоящие данные
scales: test.scales.map(s => ({
  key: s.key,
  name: s.name,
  min: s.min,
  max: s.max,
  bands: s.bands, // JSON поле
})),
rules: test.rules.map(r => ({
  kind: r.kind,
  payload: r.payload, // JSON поле
})),
```

### 2. Страница результатов

**Было:** `src/app/tests/[slug]/results/page.tsx`
```typescript
const scores = calculateScores(answers, testData.questions);
const profile = generateResultProfile(scores);
```

**Стало:**
```typescript
import { computeResult } from '@/lib/result-engine';

const result = computeResult({
  version: testData.meta.version || 1,
  scales: testData.scales,
  rules: testData.rules,
  answers: answers.map(a => {
    const question = testData.questions.find(q => q.id === a.questionId);
    const option = question?.options.find(o => o.id === a.value);
    
    return {
      questionId: a.questionId,
      value: a.value,
      weights: option?.weights || {},
      timestamp: a.timestamp,
    };
  }),
});

// Используем result вместо profile
setResult(result);
```

### 3. Отображение результатов

```typescript
// Вместо hardcoded блоков:
<div>Тип привязанности: {profile.attachment}</div>

// Используем динамические данные:
{Object.entries(result.interpretations).map(([key, interp]) => (
  <div key={key}>
    <h3>{interp.title}</h3>
    <p>{interp.description}</p>
    <p>Балл: {interp.score}</p>
    {interp.recommendations && (
      <ul>
        {interp.recommendations.map(rec => <li>{rec}</li>)}
      </ul>
    )}
  </div>
))}

// Composite scores:
{Object.values(result.compositeScores).map(score => (
  <div key={score.key}>
    <h3>{score.name}: {score.value}</h3>
    <p>{score.title}</p>
  </div>
))}

// Patterns:
{result.patterns.map(pattern => (
  <div key={pattern.label}>
    <h3>{pattern.title}</h3>
    <p>{pattern.description}</p>
    <ul>
      {pattern.recommendations?.map(rec => <li>{rec}</li>)}
    </ul>
  </div>
))}
```

---

## ✅ Преимущества нового подхода

### До (hardcoded):
❌ Каждый тест = новый файл с логикой  
❌ Изменение формул = изменение кода  
❌ Невозможно A/B тестировать интерпретации  
❌ Старые результаты ломаются при изменениях  
❌ Сложно тестировать  

### После (DSL):
✅ Новый тест = просто JSON в БД  
✅ Изменение формул через админку  
✅ A/B тестинг через версии  
✅ Версионирование защищает старые результаты  
✅ Легко писать unit тесты  
✅ Audit trail для каждого расчёта  

---

## 🚀 Следующие шаги

1. **Создать UI для Scales**
   - ScalesTab component
   - API endpoints
   - Форма редактирования bands

2. **Создать UI для Rules**
   - RulesTab component
   - Visual editor для каждого типа
   - Превью результатов

3. **Мигрировать существующие тесты**
   - Извлечь логику из `calculateScores()`
   - Создать scales и rules в БД
   - Проверить результаты

4. **Тестирование**
   - Unit тесты для движка
   - Эталонные наборы ответов
   - Сравнение старых и новых результатов

---

**Готовы продолжить?** Переходим к UI! 🎨

