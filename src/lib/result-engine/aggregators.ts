/**
 * Scale Aggregators
 * Functions for aggregating answer weights into scale scores
 */

import { Scale, Answer, ScaleScore } from './types';

/**
 * Агрегация ответов по шкалам
 * Суммирует веса из ответов для каждой шкалы
 */
export function aggregateScales(
  scales: Scale[],
  answers: Answer[]
): Record<string, number> {
  const scores: Record<string, number> = {};

  // Инициализируем все шкалы нулями
  scales.forEach(scale => {
    scores[scale.key] = 0;
  });

  // Суммируем веса из ответов
  answers.forEach(answer => {
    if (!answer.weights) return;

    Object.entries(answer.weights).forEach(([scaleKey, weight]) => {
      if (scores.hasOwnProperty(scaleKey)) {
        scores[scaleKey] += weight;
      }
    });
  });

  // Проверяем границы min/max
  scales.forEach(scale => {
    const score = scores[scale.key];
    if (score < scale.min) {
      console.warn(`[Aggregator] Scale ${scale.key}: score ${score} < min ${scale.min}`);
      scores[scale.key] = scale.min;
    }
    if (score > scale.max) {
      console.warn(`[Aggregator] Scale ${scale.key}: score ${score} > max ${scale.max}`);
      scores[scale.key] = scale.max;
    }
  });

  return scores;
}

/**
 * Получить детальную информацию о шкале с процентами
 */
export function getScaleDetails(
  scale: Scale,
  score: number
): ScaleScore {
  const range = scale.max - scale.min;
  const percentage = range > 0 ? ((score - scale.min) / range) * 100 : 0;

  return {
    scaleKey: scale.key,
    score,
    percentage: Math.round(percentage * 10) / 10, // округляем до 1 знака
  };
}

/**
 * Найти band (диапазон) для score
 */
export function findBand(
  bands: Array<{ to: number; label: string }>,
  score: number
): { to: number; label: string } | undefined {
  // Сортируем bands по возрастанию
  const sorted = [...bands].sort((a, b) => a.to - b.to);

  // Находим первый band, где score <= to
  return sorted.find(band => score <= band.to);
}

/**
 * Получить label для score (low/mid/high)
 */
export function getScoreLabel(
  scale: Scale,
  score: number
): string {
  if (!scale.bands || scale.bands.length === 0) {
    // Если bands нет, используем простую логику thirds
    const range = scale.max - scale.min;
    const normalized = (score - scale.min) / range;
    
    if (normalized < 0.33) return 'low';
    if (normalized < 0.67) return 'mid';
    return 'high';
  }

  const band = findBand(scale.bands, score);
  return band?.label || 'unknown';
}

