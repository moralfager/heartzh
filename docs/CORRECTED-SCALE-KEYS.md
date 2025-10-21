# 🔧 Исправленные ключи scales для импорта

## ❌ НЕПРАВИЛЬНЫЕ ключи в вашем JSON:

```json
"love_words"              // ❌ Должно быть language_words
"love_time"               // ❌ Должно быть language_time
"love_gifts"              // ❌ Должно быть language_gifts
"love_service"            // ❌ Должно быть language_service
"love_touch"              // ❌ Должно быть language_touch
"conflict_collaboration"  // ❌ Должно быть conflict_collab
"conflict_avoidance"      // ❌ Должно быть conflict_avoid
"conflict_compromise"     // ❌ Должно быть conflict_comprom
"conflict_accommodation"  // ❌ Должно быть conflict_accom
"conflict_competition"    // ❌ Должно быть conflict_compete
```

## ✅ ПРАВИЛЬНЫЕ ключи (используйте эти):

```json
{
  "scales": [
    { "key": "secure_attachment", ... },       // ✅
    { "key": "anxious_attachment", ... },      // ✅
    { "key": "avoidant_attachment", ... },     // ✅
    
    { "key": "value_support", ... },           // ✅
    { "key": "value_passion", ... },           // ✅
    { "key": "value_security", ... },          // ✅
    { "key": "value_growth", ... },            // ✅
    
    { "key": "language_words", ... },          // ✅ (НЕ love_words!)
    { "key": "language_time", ... },           // ✅ (НЕ love_time!)
    { "key": "language_gifts", ... },          // ✅ (НЕ love_gifts!)
    { "key": "language_service", ... },        // ✅ (НЕ love_service!)
    { "key": "language_touch", ... },          // ✅ (НЕ love_touch!)
    
    { "key": "conflict_collab", ... },         // ✅ (НЕ conflict_collaboration!)
    { "key": "conflict_avoid", ... },          // ✅ (НЕ conflict_avoidance!)
    { "key": "conflict_comprom", ... },        // ✅ (НЕ conflict_compromise!)
    { "key": "conflict_accom", ... },          // ✅ (НЕ conflict_accommodation!)
    { "key": "conflict_compete", ... }         // ✅ (НЕ conflict_competition!)
  ]
}
```

## 📝 Что нужно сделать:

### Вариант 1: Find & Replace (быстро)
Откройте ваш JSON файл и сделайте **глобальную замену**:

```
"love_words"              →  "language_words"
"love_time"               →  "language_time"
"love_gifts"              →  "language_gifts"
"love_service"            →  "language_service"
"love_touch"              →  "language_touch"
"conflict_collaboration"  →  "conflict_collab"
"conflict_avoidance"      →  "conflict_avoid"
"conflict_compromise"     →  "conflict_comprom"
"conflict_accommodation"  →  "conflict_accom"
"conflict_competition"    →  "conflict_compete"
```

### Вариант 2: Переимпортировать
1. Удалить все scales и rules из теста в админке
2. Исправить JSON
3. Импортировать снова

## 🔍 Почему именно эти ключи?

Ключи должны совпадать с **доменами в вопросах**:
- `L_WORDS` → `language_words` (prefix "language_")
- `L_TIME` → `language_time`
- `C_COLLAB` → `conflict_collab` (короткие имена)
- `C_AVOID` → `conflict_avoid`

Система маппинга находится в `src/lib/result-engine/mappers.ts`.

