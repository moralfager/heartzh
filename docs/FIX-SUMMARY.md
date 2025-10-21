# 🔥 Исправление проблемы с нулевыми значениями

## 🐛 Проблема
Scales показывали 0% потому что:
1. **Engine ожидал `Answer.weights`** с ключами scales (`language_words`, `conflict_collab`)
2. **SessionAnswer содержал только `{questionId, value, timestamp}`** без weights
3. **Вопросы использовали domains** (`L_WORDS`, `C_COLLAB`) вместо scale keys

## ✅ Решение

### 1. Создан Mapper (`src/lib/result-engine/mappers.ts`)
Преобразует `SessionAnswer` + `Question` → `Answer` с маппингом:
```
L_WORDS → language_words
L_TIME → language_time
C_COLLAB → conflict_collab
V_SUPPORT → value_support
...
```

### 2. Обновлён Results Page
Теперь перед вызовом engine:
```typescript
const engineAnswers = convertSessionAnswersToEngineAnswers(answers, testData.questions);
```

### 3. Исправлены типы
- `TestDefinition` теперь поддерживает `scales`, `rules`, `resultMode`
- Добавлен `version: 1` в `ComputeResultInput`

## ⚠️ ВАЖНО: Нужно исправить ключи scales в JSON!

Ваш JSON использует **неправильные ключи**:
- ❌ `"love_words"` → ✅ `"language_words"`
- ❌ `"conflict_collaboration"` → ✅ `"conflict_collab"`
- ❌ `"conflict_avoidance"` → ✅ `"conflict_avoid"`
- ❌ `"conflict_compromise"` → ✅ `"conflict_comprom"`
- ❌ `"conflict_accommodation"` → ✅ `"conflict_accom"`
- ❌ `"conflict_competition"` → ✅ `"conflict_compete"`

**См. `CORRECTED-SCALE-KEYS.md` для полного списка замен!**

## 📝 Следующие шаги

1. **Откройте ваш JSON** со scales и rules
2. **Find & Replace** неправильные ключи (список в `CORRECTED-SCALE-KEYS.md`)
3. **Удалите старые scales/rules** в админке
4. **Импортируйте исправленный JSON**
5. **Пройдите тест снова** и проверьте результаты

## 🎯 После исправления должно работать:
- ✅ Scales с правильными процентами (не 0%)
- ✅ Interpretations с заголовками и описаниями
- ✅ Топ-6 рекомендаций (не "целый вагон")

