import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function normalizeScore(value: number, min: number = 1, max: number = 5): number {
  return Math.round(((value - min) / (max - min)) * 100);
}

export function getAttachmentType(secure: number, anxious: number, avoidant: number): string {
  const max = Math.max(secure, anxious, avoidant);
  if (max === secure) return 'Надёжный';
  if (max === anxious) return 'Тревожный';
  return 'Избегающий';
}

export function getTopValues(values: Record<string, number>, count: number = 2): string[] {
  return Object.entries(values)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([key]) => key);
}

export function getLoveLanguageType(loveLanguage: Record<string, number>): string {
  const max = Math.max(...Object.values(loveLanguage));
  const top = Object.entries(loveLanguage).find(([, value]) => value === max);
  return top ? top[0] : 'words';
}

export function getConflictStyle(conflict: Record<string, number>): string {
  const max = Math.max(...Object.values(conflict));
  const top = Object.entries(conflict).find(([, value]) => value === max);
  return top ? top[0] : 'collab';
}

