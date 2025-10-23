export type TestCategory = 'relationships' | 'personality' | 'values' | 'intelligence' | 'communication' | 'wellbeing';

export type Scale = 'likert' | 'single' | 'multi' | 'text';
export type Domain =
  | 'A_SECURE' | 'A_ANXIOUS' | 'A_AVOIDANT'
  | 'V_SUPPORT' | 'V_PASSION' | 'V_SECURITY' | 'V_GROWTH'
  | 'L_WORDS' | 'L_TIME' | 'L_GIFTS' | 'L_SERVICE' | 'L_TOUCH'
  | 'C_COLLAB' | 'C_COMPROM' | 'C_AVOID' | 'C_ACCOM' | 'C_COMPETE'
  | 'E_WORDS' | 'E_TIME' | 'E_GIFTS' | 'E_SERVICE' | 'E_TOUCH' | 'E_ROMANTIC' | 'E_SURPRISE'
  | 'G_LUXURY' | 'G_PRACTICAL' | 'G_HANDMADE' | 'G_EMOTIONAL' | 'G_EXPERIENCE' | 'G_SPONTANEOUS' | 'G_TRADITIONAL'
  | 'D_LUXURY' | 'D_HOMEY' | 'D_ACTIVE' | 'D_ROMANTIC' | 'D_ADVENTURE' | 'D_PLANNING' | 'D_SURPRISE' | 'D_VARIETY'
  | 'C_WORDS' | 'C_TIME' | 'C_GIFTS' | 'C_SERVICE' | 'C_TOUCH' | 'C_FREQUENCY' | 'C_PLANNING' | 'C_COMPLIMENTS' | 'C_THOUGHTFULNESS';

export interface TestMeta {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: TestCategory;
  tags: string[];
  estMinutes: number;
  questionsCount: number;
  isPseudo: boolean;
  languages: string[];
  thumbnailUrl?: string;
  rating?: number;
}

export interface AnswerOption {
  id: string;
  label: string;
  weight?: number;
  domains?: Partial<Record<Domain, number>>;
}

export interface Question {
  id: string;
  block: 1 | 2 | 3 | 4;
  text: string;
  scale: Scale;
  options?: AnswerOption[];
  reverse?: boolean;
}

export interface SessionAnswer {
  questionId: string;
  questionText?: string; // Текст вопроса для админ панели
  block?: number; // Номер блока
  value: number | string | string[];
  answer?: number | string | string[]; // Alias для value (для обратной совместимости)
  timestamp: number;
}

export type ScoreMap = {
  [D in Domain]: number;
}

export interface ResultProfile {
  attachment: {
    secure: number;
    anxious: number;
    avoidant: number;
  };
  values: {
    support: number;
    passion: number;
    security: number;
    growth: number;
  };
  loveLanguage: {
    words: number;
    time: number;
    gifts: number;
    service: number;
    touch: number;
  };
  conflict: {
    collab: number;
    comprom: number;
    avoid: number;
    accom: number;
    compete: number;
  };
  expressions?: {
    words: number;
    time: number;
    gifts: number;
    service: number;
    touch: number;
    romantic: number;
    surprise: number;
  };
  gifts?: {
    luxury: number;
    practical: number;
    handmade: number;
    emotional: number;
    experience: number;
    spontaneous: number;
    traditional: number;
  };
  dates?: {
    luxury: number;
    homey: number;
    active: number;
    romantic: number;
    adventure: number;
    planning: number;
    surprise: number;
    variety: number;
  };
  care?: {
    words: number;
    time: number;
    gifts: number;
    service: number;
    touch: number;
    frequency: number;
    planning: number;
    compliments: number;
    thoughtfulness: number;
  };
  summaryType: string;
  summary: string;
  tips: string[];
}

export interface TestDefinition {
  meta: TestMeta;
  questions: Question[];
  scoring?: {
    type: 'weighted-domains';
  };
  resultRules?: ResultRule[];
  // New engine fields
  resultMode?: string;
  defaultResult?: any;
  scales?: any[];
  rules?: any[];
}

export interface ResultRule {
  when: (scores: ScoreMap) => boolean;
  title: string;
  summary: string;
  tips: string[];
}

export interface TestSession {
  id: string;
  testId: string;
  answers: SessionAnswer[];
  startedAt: number;
  completedAt?: number;
  currentQuestionIndex: number;
}

export interface TestFilters {
  q?: string;
  category?: string;
  duration?: string;
  tags?: string[];
}
