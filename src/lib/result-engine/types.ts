/**
 * Result Engine Types
 * Types for DSL-based result calculation engine
 */

// ============================================================================
// SCALES (Шкалы)
// ============================================================================

export interface Scale {
  key: string;          // уникальный идентификатор (например: "O", "secure_attachment")
  name: string;         // название шкалы
  min: number;          // минимальное значение
  max: number;          // максимальное значение
  bands?: ScaleBand[];  // диапазоны интерпретации
}

export interface ScaleBand {
  to: number;           // верхняя граница диапазона
  label: string;        // метка (low, mid, high)
  title?: string;       // заголовок интерпретации
  description?: string; // описание
  recommendations?: string[]; // рекомендации
}

// ============================================================================
// RULES (Правила)
// ============================================================================

export type RuleKind = 'threshold' | 'formula' | 'combo';

export interface BaseRule {
  kind: RuleKind;
  payload: unknown;
}

// Threshold Rule: пороговые зоны
export interface ThresholdRule extends BaseRule {
  kind: 'threshold';
  payload: {
    scaleKey: string;   // к какой шкале применяется
    ranges?: {
      to: number;       // верхняя граница
      label: string;    // метка
      title?: string;   // заголовок
      description?: string;
      recommendations?: string[];
    }[];
    // ChatGPT format support
    threshold?: number;
    operator?: string;
    interpretation?: {
      summaryType?: string;
      summary?: string;
      tips?: string[];
    };
  };
}

// Formula Rule: математические вычисления
export interface FormulaRule extends BaseRule {
  kind: 'formula';
  payload: {
    key: string;        // идентификатор результата формулы
    name: string;       // название
    expr: string;       // выражение: "(O * 0.6) + (C * 0.4)"
    ranges?: {
      to: number;
      label: string;
      title?: string;
      description?: string;
    }[];
  };
}

// Combo Rule: логические комбинации
export interface ComboRule extends BaseRule {
  kind: 'combo';
  payload: {
    when: {
      scaleKey: string;
      condition: 'low' | 'mid' | 'high' | string; // можно расширить
    }[];
    label: string;
    title: string;
    description?: string;
    recommendations?: string[];
  };
}

export type Rule = ThresholdRule | FormulaRule | ComboRule;

// ============================================================================
// ANSWERS (Ответы пользователя)
// ============================================================================

export interface Answer {
  questionId: string;
  value: string | number | string[]; // значение ответа (может быть массив для multi-select)
  weights: Record<string, number>; // веса по шкалам
  timestamp?: Date;
}

// ============================================================================
// RESULTS (Результаты расчёта)
// ============================================================================

export interface ScaleScore {
  scaleKey: string;
  score: number;
  percentage?: number; // процент от максимума
}

export interface Interpretation {
  scaleKey: string;
  score: number;
  label: string;       // low/mid/high
  title?: string;
  description?: string;
  recommendations?: string[];
}

export interface CompositeScore {
  key: string;
  name: string;
  value: number;
  label?: string;
  title?: string;
  description?: string;
}

export interface Pattern {
  label: string;
  title: string;
  description?: string;
  recommendations?: string[];
  matchedConditions: string[]; // для аудита
}

export interface AuditStep {
  step: string;
  timestamp: Date;
  data: unknown;
}

export interface ResultSummary {
  version: number;
  scaleScores: Record<string, number>;
  interpretations: Record<string, Interpretation>;
  compositeScores: Record<string, CompositeScore>;
  patterns: Pattern[];
  audit: AuditStep[];
}

// ============================================================================
// ENGINE INPUT
// ============================================================================

export interface ComputeResultInput {
  scales: Scale[];
  rules: Rule[];
  answers: Answer[];
  version: number;
}

