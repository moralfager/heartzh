/**
 * Result Engine
 * Main engine for computing test results using DSL rules
 */

import {
  ComputeResultInput,
  ResultSummary,
  AuditStep,
} from './types';
import { aggregateScales } from './aggregators';
import {
  applyThresholdRules,
  applyFormulaRules,
  applyComboRules,
} from './rules';

/**
 * Главная функция расчёта результатов
 * Чистая функция без побочных эффектов
 */
export function computeResult(input: ComputeResultInput): ResultSummary {
  const audit: AuditStep[] = [];
  const startTime = new Date();

  // Валидация входных данных
  if (!input.scales || input.scales.length === 0) {
    throw new Error('[ResultEngine] No scales provided');
  }

  if (!input.answers || input.answers.length === 0) {
    throw new Error('[ResultEngine] No answers provided');
  }

  audit.push({
    step: 'init',
    timestamp: new Date(),
    data: {
      scalesCount: input.scales.length,
      answersCount: input.answers.length,
      rulesCount: input.rules.length,
      version: input.version,
    },
  });

  // Шаг 1: Агрегация по шкалам
  const scaleScores = aggregateScales(input.scales, input.answers);
  
  audit.push({
    step: 'scale_aggregation',
    timestamp: new Date(),
    data: scaleScores,
  });

  // Шаг 2: Применение threshold правил
  const thresholdRules = input.rules.filter(r => r.kind === 'threshold');
  const interpretations = applyThresholdRules(
    thresholdRules as any,
    scaleScores,
    input.scales
  );

  audit.push({
    step: 'threshold_rules',
    timestamp: new Date(),
    data: {
      rulesCount: thresholdRules.length,
      interpretations: Object.keys(interpretations),
    },
  });

  // Шаг 3: Вычисление формул
  const formulaRules = input.rules.filter(r => r.kind === 'formula');
  let compositeScores = {};
  try {
    compositeScores = applyFormulaRules(
      formulaRules as any,
      scaleScores
    );
  } catch (error) {
    console.warn('[Engine] Formula rules error (skipping):', error);
  }

  audit.push({
    step: 'formula_rules',
    timestamp: new Date(),
    data: {
      rulesCount: formulaRules.length,
      compositeScores: Object.keys(compositeScores),
    },
  });

  // Шаг 4: Поиск паттернов
  const comboRules = input.rules.filter(r => r.kind === 'combo');
  let patterns = [];
  try {
    patterns = applyComboRules(
      comboRules as any,
      scaleScores,
      input.scales
    );
  } catch (error) {
    console.warn('[Engine] Combo rules error (skipping):', error);
  }

  audit.push({
    step: 'combo_rules',
    timestamp: new Date(),
    data: {
      rulesCount: comboRules.length,
      patternsFound: patterns.length,
    },
  });

  // Финальный аудит
  const endTime = new Date();
  audit.push({
    step: 'complete',
    timestamp: endTime,
    data: {
      duration: endTime.getTime() - startTime.getTime(),
      totalSteps: audit.length,
    },
  });

  return {
    version: input.version,
    scaleScores,
    interpretations,
    compositeScores,
    patterns,
    audit,
  };
}

/**
 * Валидация результата (для отладки)
 */
export function validateResult(result: ResultSummary): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!result.scaleScores || Object.keys(result.scaleScores).length === 0) {
    errors.push('No scale scores computed');
  }

  if (!result.audit || result.audit.length === 0) {
    errors.push('No audit trail');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

