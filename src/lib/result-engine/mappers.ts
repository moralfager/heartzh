/**
 * Mappers
 * Преобразование между форматами данных (legacy domains → engine scale keys)
 */

import { Answer } from './types';
import type { SessionAnswer, Question, Domain } from '../types';

/**
 * Маппинг domain keys (из вопросов) → scale keys (для engine)
 */
const DOMAIN_TO_SCALE_MAP: Record<string, string> = {
  // Attachment
  'A_SECURE': 'secure_attachment',
  'A_ANXIOUS': 'anxious_attachment',
  'A_AVOIDANT': 'avoidant_attachment',
  
  // Values
  'V_SUPPORT': 'value_support',
  'V_PASSION': 'value_passion',
  'V_SECURITY': 'value_security',
  'V_GROWTH': 'value_growth',
  
  // Love Language
  'L_WORDS': 'language_words',
  'L_TIME': 'language_time',
  'L_GIFTS': 'language_gifts',
  'L_SERVICE': 'language_service',
  'L_TOUCH': 'language_touch',
  
  // Conflict
  'C_COLLAB': 'conflict_collab',
  'C_COMPROM': 'conflict_comprom',
  'C_AVOID': 'conflict_avoid',
  'C_ACCOM': 'conflict_accom',
  'C_COMPETE': 'conflict_compete',
  
  // Love Expressions
  'E_WORDS': 'expression_words',
  'E_TIME': 'expression_time',
  'E_GIFTS': 'expression_gifts',
  'E_SERVICE': 'expression_service',
  'E_TOUCH': 'expression_touch',
  'E_ROMANTIC': 'expression_romantic',
  'E_SURPRISE': 'expression_surprise',
  
  // Gifts
  'G_LUXURY': 'gift_luxury',
  'G_PRACTICAL': 'gift_practical',
  'G_HANDMADE': 'gift_handmade',
  'G_EMOTIONAL': 'gift_emotional',
  'G_EXPERIENCE': 'gift_experience',
  'G_SPONTANEOUS': 'gift_spontaneous',
  'G_TRADITIONAL': 'gift_traditional',
  
  // Dates
  'D_LUXURY': 'date_luxury',
  'D_HOMEY': 'date_homey',
  'D_ACTIVE': 'date_active',
  'D_ROMANTIC': 'date_romantic',
  'D_ADVENTURE': 'date_adventure',
  'D_PLANNING': 'date_planning',
  'D_SURPRISE': 'date_surprise',
  'D_VARIETY': 'date_variety',
  
  // Care (конфликт с C_COLLAB, нужен другой префикс)
  'CARE_WORDS': 'care_words',
  'CARE_TIME': 'care_time',
  'CARE_GIFTS': 'care_gifts',
  'CARE_SERVICE': 'care_service',
  'CARE_TOUCH': 'care_touch',
  'CARE_FREQUENCY': 'care_frequency',
  'CARE_PLANNING': 'care_planning',
  'CARE_COMPLIMENTS': 'care_compliments',
  'CARE_THOUGHTFULNESS': 'care_thoughtfulness',
};

/**
 * Преобразовать SessionAnswer + Question → Answer (для engine)
 */
export function convertSessionAnswerToEngineAnswer(
  sessionAnswer: SessionAnswer,
  question: Question
): Answer | null {
  // Найти выбранную опцию
  const selectedOption = question.options?.find(
    opt => opt.id === String(sessionAnswer.value)
  );

  if (!selectedOption || !selectedOption.domains) {
    // console.warn(`[Mapper] No domains found for answer:`, { questionId: question.id, value: sessionAnswer.value });
    return null;
  }

  // Преобразовать domains → weights с маппингом ключей
  const weights: Record<string, number> = {};
  
  Object.entries(selectedOption.domains).forEach(([domainKey, weight]) => {
    const scaleKey = DOMAIN_TO_SCALE_MAP[domainKey];
    if (scaleKey && weight !== undefined) {
      weights[scaleKey] = weight;
    } else {
      console.warn(`[Mapper] Unknown domain key: ${domainKey}`);
    }
  });

  // Если нет весов после маппинга, пропускаем
  if (Object.keys(weights).length === 0) {
    return null;
  }

  return {
    questionId: sessionAnswer.questionId,
    value: sessionAnswer.value,
    weights,
    timestamp: new Date(sessionAnswer.timestamp),
  };
}

/**
 * Преобразовать массив SessionAnswers → массив Answers
 */
export function convertSessionAnswersToEngineAnswers(
  sessionAnswers: SessionAnswer[],
  questions: Question[]
): Answer[] {
  const engineAnswers: Answer[] = [];

  sessionAnswers.forEach(sessionAnswer => {
    const question = questions.find(q => q.id === sessionAnswer.questionId);
    if (!question) {
      console.warn(`[Mapper] Question not found: ${sessionAnswer.questionId}`);
      return;
    }

    const engineAnswer = convertSessionAnswerToEngineAnswer(sessionAnswer, question);
    if (engineAnswer) {
      engineAnswers.push(engineAnswer);
    }
  });

  console.log(`[Mapper] Converted ${engineAnswers.length}/${sessionAnswers.length} answers`);
  
  return engineAnswers;
}

