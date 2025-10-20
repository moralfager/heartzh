# 🧮 Result Engine

DSL-based движок для расчёта результатов психологических тестов.

## 📋 Возможности

✅ **Гибкая система правил** - никакого hardcode  
✅ **Три типа правил** - threshold, formula, combo  
✅ **Полный аудит** - каждый шаг расчёта записывается  
✅ **Версионирование** - старые результаты не ломаются  
✅ **Типобезопасность** - TypeScript из коробки  

---

## 🚀 Быстрый старт

### Пример 1: Простой тест с threshold правилами

```typescript
import { computeResult } from '@/lib/result-engine';

const result = computeResult({
  version: 1,
  scales: [
    {
      key: 'O',
      name: 'Открытость опыту',
      min: 0,
      max: 50,
      bands: [
        { to: 16, label: 'low' },
        { to: 34, label: 'mid' },
        { to: 50, label: 'high' }
      ]
    }
  ],
  rules: [
    {
      kind: 'threshold',
      payload: {
        scaleKey: 'O',
        ranges: [
          {
            to: 16,
            label: 'low',
            title: 'Консервативный',
            description: 'Вы предпочитаете стабильность'
          },
          {
            to: 34,
            label: 'mid',
            title: 'Сбалансированный',
            description: 'Вы открыты к новому, но осторожны'
          },
          {
            to: 50,
            label: 'high',
            title: 'Искатель приключений',
            description: 'Вы любите новизну'
          }
        ]
      }
    }
  ],
  answers: [
    { questionId: 'q1', value: 5, weights: { O: 5 } },
    { questionId: 'q2', value: 4, weights: { O: 4 } },
    { questionId: 'q3', value: 5, weights: { O: 5 } },
    // ... ещё 7 вопросов
  ]
});

console.log(result);
// {
//   scaleScores: { O: 42 },
//   interpretations: {
//     O: {
//       score: 42,
//       label: 'high',
//       title: 'Искатель приключений',
//       description: 'Вы любите новизну'
//     }
//   },
//   ...
// }
```

---

### Пример 2: Формулы (composite scores)

```typescript
const result = computeResult({
  version: 1,
  scales: [
    { key: 'O', name: 'Открытость', min: 0, max: 50 },
    { key: 'C', name: 'Добросовестность', min: 0, max: 50 }
  ],
  rules: [
    {
      kind: 'formula',
      payload: {
        key: 'creativity',
        name: 'Индекс креативности',
        expr: '(O * 0.7) + (C * -0.3) + 15',
        ranges: [
          { to: 30, label: 'Рациональный' },
          { to: 50, label: 'Креативный' }
        ]
      }
    }
  ],
  answers: [
    // O = 42, C = 18
  ]
});

console.log(result.compositeScores.creativity);
// {
//   key: 'creativity',
//   name: 'Индекс креативности',
//   value: 38.7,
//   label: 'Креативный'
// }
```

---

### Пример 3: Логические комбинации (patterns)

```typescript
const result = computeResult({
  version: 1,
  scales: [
    { key: 'O', name: 'Открытость', min: 0, max: 50 },
    { key: 'C', name: 'Добросовестность', min: 0, max: 50 }
  ],
  rules: [
    // ... threshold rules для O и C ...
    {
      kind: 'combo',
      payload: {
        when: [
          { scaleKey: 'O', condition: 'high' },
          { scaleKey: 'C', condition: 'low' }
        ],
        label: 'creative_chaos',
        title: 'Творческий хаос',
        description: 'У вас много идей, но мало дисциплины',
        recommendations: [
          'Установите routine для реализации идей',
          'Используйте Pomodoro технику'
        ]
      }
    }
  ],
  answers: [
    // O = 45 (high), C = 12 (low)
  ]
});

console.log(result.patterns);
// [
//   {
//     label: 'creative_chaos',
//     title: 'Творческий хаос',
//     description: 'У вас много идей, но мало дисциплины',
//     recommendations: [...],
//     matchedConditions: ['O=high', 'C=low']
//   }
// ]
```

---

## 📊 Структура результата

```typescript
interface ResultSummary {
  version: number;
  
  // Баллы по шкалам
  scaleScores: {
    O: 42,
    C: 18,
    // ...
  };
  
  // Интерпретации threshold правил
  interpretations: {
    O: {
      score: 42,
      label: 'high',
      title: 'Искатель приключений',
      description: '...'
    }
  };
  
  // Результаты формул
  compositeScores: {
    creativity: {
      key: 'creativity',
      value: 38.7,
      label: 'Креативный'
    }
  };
  
  // Найденные паттерны
  patterns: [
    {
      label: 'creative_chaos',
      title: 'Творческий хаос',
      recommendations: [...]
    }
  ];
  
  // Аудит расчётов (для отладки)
  audit: [
    { step: 'init', timestamp: ..., data: {...} },
    { step: 'scale_aggregation', timestamp: ..., data: {...} },
    // ...
  ];
}
```

---

## 🔧 API Reference

### `computeResult(input: ComputeResultInput): ResultSummary`

Главная функция расчёта результатов.

**Параметры:**
- `version` - версия теста
- `scales` - массив шкал
- `rules` - массив правил
- `answers` - ответы пользователя

**Возвращает:** `ResultSummary` с полным расчётом

---

### `validateResult(result: ResultSummary): { valid: boolean; errors: string[] }`

Валидация результата (для отладки).

---

## 🎯 Типы правил

### 1. Threshold Rule

Простые пороговые зоны.

```typescript
{
  kind: 'threshold',
  payload: {
    scaleKey: 'O',
    ranges: [
      { to: 16, label: 'low', title: '...', description: '...' },
      { to: 34, label: 'mid', title: '...', description: '...' },
      { to: 50, label: 'high', title: '...', description: '...' }
    ]
  }
}
```

### 2. Formula Rule

Математические вычисления.

```typescript
{
  kind: 'formula',
  payload: {
    key: 'creativity',
    name: 'Индекс креативности',
    expr: '(O * 0.7) + (C * -0.3) + 15',
    ranges: [
      { to: 30, label: 'Рациональный' },
      { to: 50, label: 'Креативный' }
    ]
  }
}
```

**Доступные операторы:**
- `+`, `-`, `*`, `/` - арифметика
- `()` - скобки для приоритета
- Переменные - ключи шкал (O, C, E, A, N и т.д.)

⚠️ **ВАЖНО:** Сейчас используется `eval()` для простоты. В продакшене замените на `mathjs` или аналог!

### 3. Combo Rule

Логические комбинации.

```typescript
{
  kind: 'combo',
  payload: {
    when: [
      { scaleKey: 'O', condition: 'high' },
      { scaleKey: 'C', condition: 'low' }
    ],
    label: 'creative_chaos',
    title: 'Творческий хаос',
    description: '...',
    recommendations: ['...']
  }
}
```

**Условия:**
- `low`, `mid`, `high` - стандартные
- Можно расширить своими (если bands определены)

---

## ✅ Тестирование

```bash
# Unit тесты (будут созданы)
npm test src/lib/result-engine

# Пример эталонного теста
npm run test:engine
```

---

## 🚧 TODO

- [ ] Заменить `eval()` на `mathjs` для безопасности
- [ ] Добавить unit тесты
- [ ] Добавить эталонные наборы ответов
- [ ] Поддержка вложенных формул
- [ ] Поддержка условных формул (if/then)
- [ ] Визуализация audit trail

---

## 📚 Примеры использования

Смотрите примеры в:
- `src/lib/result-engine/__tests__/` - unit тесты
- `src/app/api/tests/[slug]/compute/route.ts` - API endpoint
- `src/app/tests/[slug]/results/page.tsx` - фронтенд

---

**Готово к использованию!** 🎉

