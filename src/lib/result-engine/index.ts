/**
 * Result Engine
 * Public API for the result calculation engine
 */

// Main engine
export { computeResult, validateResult } from './engine';

// Aggregators
export {
  aggregateScales,
  getScaleDetails,
  findBand,
  getScoreLabel,
} from './aggregators';

// Rule processors
export {
  applyThresholdRules,
  applyFormulaRules,
  applyComboRules,
} from './rules';

// Mappers
export {
  convertSessionAnswerToEngineAnswer,
  convertSessionAnswersToEngineAnswers,
} from './mappers';

// Types
export type {
  Scale,
  ScaleBand,
  Rule,
  RuleKind,
  ThresholdRule,
  FormulaRule,
  ComboRule,
  Answer,
  ScaleScore,
  Interpretation,
  CompositeScore,
  Pattern,
  AuditStep,
  ResultSummary,
  ComputeResultInput,
} from './types';

