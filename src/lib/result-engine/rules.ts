/**
 * Rule Processors
 * Functions for applying different types of rules
 */

import {
  Scale,
  ThresholdRule,
  FormulaRule,
  ComboRule,
  Interpretation,
  CompositeScore,
  Pattern,
} from './types';
import { findBand, getScoreLabel } from './aggregators';

// ============================================================================
// THRESHOLD RULES
// ============================================================================

/**
 * Применить threshold правила (пороговые зоны)
 */
export function applyThresholdRules(
  rules: ThresholdRule[],
  scaleScores: Record<string, number>,
  scales: Scale[]
): Record<string, Interpretation> {
  const interpretations: Record<string, Interpretation> = {};

  rules.forEach(rule => {
    const { scaleKey, ranges } = rule.payload;
    const score = scaleScores[scaleKey];

    if (score === undefined) {
      console.warn(`[ThresholdRule] Scale ${scaleKey} not found in scores`);
      return;
    }

    // Находим подходящий range
    const range = findBand(ranges, score);

    if (!range) {
      console.warn(`[ThresholdRule] No range found for score ${score} in scale ${scaleKey}`);
      return;
    }

    interpretations[scaleKey] = {
      scaleKey,
      score,
      label: range.label,
      title: range.title,
      description: range.description,
      recommendations: range.recommendations,
    };
  });

  return interpretations;
}

// ============================================================================
// FORMULA RULES
// ============================================================================

/**
 * Вычислить математическое выражение
 * Простой парсер для выражений типа "(A * 0.6) + (B * 0.4)"
 */
function evaluateExpression(
  expr: string,
  variables: Record<string, number>
): number {
  // Замена переменных на значения
  let processedExpr = expr;

  Object.entries(variables).forEach(([key, value]) => {
    // Заменяем все вхождения ключа на значение
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    processedExpr = processedExpr.replace(regex, String(value));
  });

  try {
    // ВНИМАНИЕ: eval опасен! В продакшене используйте библиотеку типа mathjs
    // Для простоты используем eval, но это НЕ безопасно для пользовательского ввода
    const result = eval(processedExpr);
    return typeof result === 'number' ? result : 0;
  } catch (error) {
    console.error(`[FormulaRule] Error evaluating expression "${expr}":`, error);
    return 0;
  }
}

/**
 * Применить formula правила (математические формулы)
 */
export function applyFormulaRules(
  rules: FormulaRule[],
  scaleScores: Record<string, number>
): Record<string, CompositeScore> {
  const compositeScores: Record<string, CompositeScore> = {};

  rules.forEach(rule => {
    const { key, name, expr, ranges } = rule.payload;

    // Вычисляем значение формулы
    const value = evaluateExpression(expr, scaleScores);

    // Определяем label если есть ranges
    let label: string | undefined;
    let rangeData: typeof ranges[0] | undefined;

    if (ranges && ranges.length > 0) {
      rangeData = findBand(ranges, value);
      label = rangeData?.label;
    }

    compositeScores[key] = {
      key,
      name,
      value: Math.round(value * 100) / 100, // округляем до 2 знаков
      label,
      title: rangeData?.title,
      description: rangeData?.description,
    };
  });

  return compositeScores;
}

// ============================================================================
// COMBO RULES
// ============================================================================

/**
 * Проверить условие combo правила
 */
function checkCondition(
  scaleKey: string,
  condition: string,
  scaleScores: Record<string, number>,
  scales: Scale[]
): boolean {
  const score = scaleScores[scaleKey];
  
  if (score === undefined) {
    return false;
  }

  const scale = scales.find(s => s.key === scaleKey);
  if (!scale) {
    return false;
  }

  // Получаем label для текущего score
  const label = getScoreLabel(scale, score);

  // Сравниваем с условием
  return label === condition;
}

/**
 * Применить combo правила (логические комбинации)
 */
export function applyComboRules(
  rules: ComboRule[],
  scaleScores: Record<string, number>,
  scales: Scale[]
): Pattern[] {
  const patterns: Pattern[] = [];

  rules.forEach(rule => {
    const { when, label, title, description, recommendations } = rule.payload;

    // Проверяем все условия
    const matchedConditions: string[] = [];
    const allConditionsMet = when.every(cond => {
      const met = checkCondition(cond.scaleKey, cond.condition, scaleScores, scales);
      if (met) {
        matchedConditions.push(`${cond.scaleKey}=${cond.condition}`);
      }
      return met;
    });

    if (allConditionsMet) {
      patterns.push({
        label,
        title,
        description,
        recommendations,
        matchedConditions,
      });
    }
  });

  return patterns;
}

