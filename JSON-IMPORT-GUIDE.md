# 📋 Руководство по импорту Scales + Rules

## 🎯 Назначение

Этот файл объясняет как создавать JSON для импорта **шкал** (Scales) и **правил** (Rules) в тесты психологического тестирования.

---

## 📦 Формат JSON

```json
{
  "scales": [
    {
      "key": "attachment_secure",
      "name": "Надёжная привязанность",
      "min": 0,
      "max": 100,
      "bands": [
        {
          "min": 0,
          "max": 40,
          "label": "Низкая",
          "interpretation": "Вам сложно доверять партнёру"
        },
        {
          "min": 41,
          "max": 70,
          "label": "Средняя",
          "interpretation": "Вы в целом доверяете, но осторожны"
        },
        {
          "min": 71,
          "max": 100,
          "label": "Высокая",
          "interpretation": "Вы легко строите доверительные отношения"
        }
      ]
    }
  ],
  "rules": [
    {
      "type": "threshold",
      "priority": 100,
      "payload": {
        "scaleKey": "attachment_secure",
        "threshold": 70,
        "operator": ">=",
        "interpretation": {
          "summaryType": "Надёжный партнёр",
          "summary": "Вы легко строите близкие отношения и доверяете партнёру"
        }
      }
    }
  ]
}
```

---

## 🔑 Описание полей

### **Scales (Шкалы)**

| Поле | Тип | Описание | Пример |
|------|-----|----------|--------|
| `key` | string | Уникальный идентификатор шкалы (латиница, подчёркивания) | `"attachment_secure"` |
| `name` | string | Русское название | `"Надёжная привязанность"` |
| `min` | number | Минимальное значение | `0` |
| `max` | number | Максимальное значение | `100` |
| `bands` | array | Диапазоны интерпретации (опционально) | см. ниже |

#### **Bands (Диапазоны)**

| Поле | Тип | Описание |
|------|-----|----------|
| `min` | number | Начало диапазона |
| `max` | number | Конец диапазона |
| `label` | string | Название уровня |
| `interpretation` | string | Текст интерпретации (опционально) |

---

### **Rules (Правила)**

| Поле | Тип | Описание | Пример |
|------|-----|----------|--------|
| `type` | string | Тип правила: `threshold`, `formula`, `combo` | `"threshold"` |
| `priority` | number | Приоритет (чем больше, тем важнее) | `100` |
| `payload` | object | JSON с логикой правила | см. примеры ниже |

---

## 📖 Типы правил

### **1️⃣ Threshold (Пороговое)**

Срабатывает когда балл шкалы пересекает порог.

```json
{
  "type": "threshold",
  "priority": 100,
  "payload": {
    "scaleKey": "attachment_avoidant",
    "threshold": 70,
    "operator": ">=",
    "interpretation": {
      "summaryType": "Избегающий партнёр",
      "summary": "Вы предпочитаете эмоциональную дистанцию"
    }
  }
}
```

**Операторы:** `>=`, `>`, `<=`, `<`, `==`

---

### **2️⃣ Formula (Формула)**

Вычисляет новую шкалу из существующих.

```json
{
  "type": "formula",
  "priority": 50,
  "payload": {
    "formula": "attachment_secure - attachment_anxious",
    "targetKey": "attachment_balance",
    "targetName": "Баланс привязанности"
  }
}
```

---

### **3️⃣ Combo (Комбинация)**

Срабатывает при выполнении ВСЕХ или ЛЮБОГО условия.

```json
{
  "type": "combo",
  "priority": 150,
  "payload": {
    "conditions": [
      {
        "scaleKey": "attachment_secure",
        "threshold": 70,
        "operator": ">="
      },
      {
        "scaleKey": "love_words",
        "threshold": 60,
        "operator": ">="
      }
    ],
    "logic": "AND",
    "interpretation": {
      "summaryType": "Надёжный Словесный",
      "summary": "Вы надёжный партнёр, который любит выражать чувства словами"
    }
  }
}
```

**Logic:** `AND` (все условия) или `OR` (хотя бы одно)

---

## 🤖 Промт для генерации через ИИ

Используйте этот промт в ChatGPT/Claude для генерации JSON:

```
Создай JSON для импорта шкал и правил психологического теста.

КОНТЕКСТ:
Тест: [название теста, например "Тест на типы привязанности"]
Цель: [что измеряет, например "Определить тип привязанности в романтических отношениях"]

ТРЕБОВАНИЯ:
1. Создай 3-5 шкал (scales) с key, name, min (0), max (100)
2. Для каждой шкалы добавь 3 bands: низкий (0-40), средний (41-70), высокий (71-100)
3. Создай 3-7 правил (rules):
   - минимум 2 threshold (пороговых)
   - минимум 1 combo (комбинация)
   - можно 1 formula (если нужно)

ФОРМАТ:
Используй структуру из JSON-IMPORT-GUIDE.md:
{
  "scales": [...],
  "rules": [...]
}

ВАЖНО:
- key только латиница + подчёркивания
- interpretation должен быть психологически обоснован
- priority: важные правила = 150-200, обычные = 100, второстепенные = 50
```

---

## 📝 Примеры для популярных тестов

### Тест на привязанность

<details>
<summary>Нажмите для просмотра</summary>

```json
{
  "scales": [
    {
      "key": "attachment_secure",
      "name": "Надёжная привязанность",
      "min": 0,
      "max": 100,
      "bands": [
        {"min": 0, "max": 40, "label": "Низкая", "interpretation": "Сложно доверять"},
        {"min": 41, "max": 70, "label": "Средняя", "interpretation": "Осторожное доверие"},
        {"min": 71, "max": 100, "label": "Высокая", "interpretation": "Лёгкое доверие"}
      ]
    },
    {
      "key": "attachment_anxious",
      "name": "Тревожная привязанность",
      "min": 0,
      "max": 100,
      "bands": [
        {"min": 0, "max": 40, "label": "Низкая", "interpretation": "Спокойны в отношениях"},
        {"min": 41, "max": 70, "label": "Средняя", "interpretation": "Иногда тревожитесь"},
        {"min": 71, "max": 100, "label": "Высокая", "interpretation": "Часто нужна поддержка"}
      ]
    },
    {
      "key": "attachment_avoidant",
      "name": "Избегающая привязанность",
      "min": 0,
      "max": 100,
      "bands": [
        {"min": 0, "max": 40, "label": "Низкая", "interpretation": "Открыты для близости"},
        {"min": 41, "max": 70, "label": "Средняя", "interpretation": "Умеренная дистанция"},
        {"min": 71, "max": 100, "label": "Высокая", "interpretation": "Предпочитаете независимость"}
      ]
    }
  ],
  "rules": [
    {
      "type": "threshold",
      "priority": 150,
      "payload": {
        "scaleKey": "attachment_secure",
        "threshold": 70,
        "operator": ">=",
        "interpretation": {
          "summaryType": "Надёжный партнёр",
          "summary": "Вы легко строите доверительные отношения, открыты для близости и комфортно чувствуете себя с партнёром"
        }
      }
    },
    {
      "type": "threshold",
      "priority": 150,
      "payload": {
        "scaleKey": "attachment_anxious",
        "threshold": 70,
        "operator": ">=",
        "interpretation": {
          "summaryType": "Тревожный партнёр",
          "summary": "Вы нуждаетесь в частом подтверждении чувств, переживаете об отношениях и стремитесь к близости"
        }
      }
    },
    {
      "type": "threshold",
      "priority": 150,
      "payload": {
        "scaleKey": "attachment_avoidant",
        "threshold": 70,
        "operator": ">=",
        "interpretation": {
          "summaryType": "Избегающий партнёр",
          "summary": "Вы цените независимость, предпочитаете эмоциональную дистанцию и медленно открываетесь"
        }
      }
    },
    {
      "type": "combo",
      "priority": 200,
      "payload": {
        "conditions": [
          {"scaleKey": "attachment_anxious", "threshold": 60, "operator": ">="},
          {"scaleKey": "attachment_avoidant", "threshold": 60, "operator": ">="}
        ],
        "logic": "AND",
        "interpretation": {
          "summaryType": "Дезорганизованный партнёр",
          "summary": "Вы одновременно стремитесь к близости и боитесь её. Это может создавать внутренний конфликт"
        }
      }
    }
  ]
}
```

</details>

---

## ✅ Как использовать

1. **Создайте JSON** (вручную или через ИИ с промтом выше)
2. **Скопируйте** содержимое
3. **Админка** → Выберите тест → **Вкладка "Правила"**
4. **Нажмите "Импорт JSON"**
5. **Вставьте** JSON → **Импортировать**

✨ **Готово!** Шкалы и правила применены к тесту.

---

## ⚠️ Частые ошибки

1. **Invalid JSON** – проверьте запятые, кавычки, скобки
2. **Key must be lowercase** – используйте только `a-z`, `0-9`, `_`
3. **Threshold > max** – порог не может быть больше max шкалы
4. **Unknown scaleKey** – ключ шкалы должен существовать в списке scales

---

## 🎓 Дополнительно

- См. `src/lib/result-engine/README.md` для технической документации
- См. `RESULT-ENGINE-INTEGRATION.md` для интеграции с кодом

