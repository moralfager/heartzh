import { ScoreMap, ResultProfile, Domain, SessionAnswer, Question } from './types';
import { normalizeScore, getAttachmentType, getTopValues, getLoveLanguageType, getConflictStyle } from './utils';

export function calculateScores(answers: SessionAnswer[], questions: Question[]): ScoreMap {
  const scores: Record<string, number> = {
    // Attachment
    A_SECURE: 0,
    A_ANXIOUS: 0,
    A_AVOIDANT: 0,
    // Values
    V_SUPPORT: 0,
    V_PASSION: 0,
    V_SECURITY: 0,
    V_GROWTH: 0,
    // Love Language
    L_WORDS: 0,
    L_TIME: 0,
    L_GIFTS: 0,
    L_SERVICE: 0,
    L_TOUCH: 0,
    // Conflict
    C_COLLAB: 0,
    C_COMPROM: 0,
    C_AVOID: 0,
    C_ACCOM: 0,
    C_COMPETE: 0,
    // Love Expressions
    E_WORDS: 0,
    E_TIME: 0,
    E_GIFTS: 0,
    E_SERVICE: 0,
    E_TOUCH: 0,
    E_ROMANTIC: 0,
    E_SURPRISE: 0,
    // Gifts
    G_LUXURY: 0,
    G_PRACTICAL: 0,
    G_HANDMADE: 0,
    G_EMOTIONAL: 0,
    G_EXPERIENCE: 0,
    G_SPONTANEOUS: 0,
    G_TRADITIONAL: 0,
    // Dates
    D_LUXURY: 0,
    D_HOMEY: 0,
    D_ACTIVE: 0,
    D_ROMANTIC: 0,
    D_ADVENTURE: 0,
    D_PLANNING: 0,
    D_SURPRISE: 0,
    D_VARIETY: 0,
    // Care
    C_WORDS: 0,
    C_TIME: 0,
    C_GIFTS: 0,
    C_SERVICE: 0,
    C_TOUCH: 0,
    C_FREQUENCY: 0,
    C_PLANNING: 0,
    C_COMPLIMENTS: 0,
    C_THOUGHTFULNESS: 0,
  };

  const domainCounts: Record<string, number> = {};

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    if (question.scale === 'likert' && typeof answer.value === 'number') {
      question.options?.forEach(option => {
        if (option.domains) {
          Object.entries(option.domains).forEach(([domain, weight]) => {
            const domainKey = domain as Domain;
            if (option.id === answer.value.toString() && domainKey in scores) {
              scores[domainKey] += weight || 0;
              domainCounts[domainKey] = (domainCounts[domainKey] || 0) + 1;
            }
          });
        }
      });
    } else if (question.scale === 'single' && typeof answer.value === 'string') {
      question.options?.forEach(option => {
        if (option.domains && option.id === answer.value) {
          Object.entries(option.domains).forEach(([domain, weight]) => {
            const domainKey = domain as Domain;
            if (domainKey in scores) {
              scores[domainKey] += weight || 0;
              domainCounts[domainKey] = (domainCounts[domainKey] || 0) + 1;
            }
          });
        }
      });
    }
  });

  // Нормализация баллов
  Object.keys(scores).forEach(domain => {
    const domainKey = domain as Domain;
    const count = domainCounts[domainKey] || 1;
    scores[domainKey] = normalizeScore(scores[domainKey] / count);
  });

  return scores as ScoreMap;
}

export function generateResultProfile(scores: ScoreMap): ResultProfile {
  // Attachment
  const attachment = {
    secure: (scores as Record<string, number>).A_SECURE,
    anxious: (scores as Record<string, number>).A_ANXIOUS,
    avoidant: (scores as Record<string, number>).A_AVOIDANT,
  };

  // Values
  const values = {
    support: (scores as Record<string, number>).V_SUPPORT,
    passion: (scores as Record<string, number>).V_PASSION,
    security: (scores as Record<string, number>).V_SECURITY,
    growth: (scores as Record<string, number>).V_GROWTH,
  };

  // Love Language
  const loveLanguage = {
    words: (scores as Record<string, number>).L_WORDS,
    time: (scores as Record<string, number>).L_TIME,
    gifts: (scores as Record<string, number>).L_GIFTS,
    service: (scores as Record<string, number>).L_SERVICE,
    touch: (scores as Record<string, number>).L_TOUCH,
  };

  // Conflict
  const conflict = {
    collab: (scores as Record<string, number>).C_COLLAB,
    comprom: (scores as Record<string, number>).C_COMPROM,
    avoid: (scores as Record<string, number>).C_AVOID,
    accom: (scores as Record<string, number>).C_ACCOM,
    compete: (scores as Record<string, number>).C_COMPETE,
  };

  // Love Expressions
  const expressions = {
    words: (scores as Record<string, number>).E_WORDS,
    time: (scores as Record<string, number>).E_TIME,
    gifts: (scores as Record<string, number>).E_GIFTS,
    service: (scores as Record<string, number>).E_SERVICE,
    touch: (scores as Record<string, number>).E_TOUCH,
    romantic: (scores as Record<string, number>).E_ROMANTIC,
    surprise: (scores as Record<string, number>).E_SURPRISE,
  };

  // Gifts
  const gifts = {
    luxury: (scores as Record<string, number>).G_LUXURY,
    practical: (scores as Record<string, number>).G_PRACTICAL,
    handmade: (scores as Record<string, number>).G_HANDMADE,
    emotional: (scores as Record<string, number>).G_EMOTIONAL,
    experience: (scores as Record<string, number>).G_EXPERIENCE,
    spontaneous: (scores as Record<string, number>).G_SPONTANEOUS,
    traditional: (scores as Record<string, number>).G_TRADITIONAL,
  };

  // Dates
  const dates = {
    luxury: (scores as Record<string, number>).D_LUXURY,
    homey: (scores as Record<string, number>).D_HOMEY,
    active: (scores as Record<string, number>).D_ACTIVE,
    romantic: (scores as Record<string, number>).D_ROMANTIC,
    adventure: (scores as Record<string, number>).D_ADVENTURE,
    planning: (scores as Record<string, number>).D_PLANNING,
    surprise: (scores as Record<string, number>).D_SURPRISE,
    variety: (scores as Record<string, number>).D_VARIETY,
  };

  // Care
  const care = {
    words: (scores as Record<string, number>).C_WORDS,
    time: (scores as Record<string, number>).C_TIME,
    gifts: (scores as Record<string, number>).C_GIFTS,
    service: (scores as Record<string, number>).C_SERVICE,
    touch: (scores as Record<string, number>).C_TOUCH,
    frequency: (scores as Record<string, number>).C_FREQUENCY,
    planning: (scores as Record<string, number>).C_PLANNING,
    compliments: (scores as Record<string, number>).C_COMPLIMENTS,
    thoughtfulness: (scores as Record<string, number>).C_THOUGHTFULNESS,
  };

  // Определение типа личности
  const attachmentType = getAttachmentType(attachment.secure, attachment.anxious, attachment.avoidant);
  const topValues = getTopValues(values);
  const loveLang = getLoveLanguageType(loveLanguage);
  const conflictStyle = getConflictStyle(conflict);

  const summaryType = generateSummaryType(attachmentType, topValues, loveLang);
  const summary = generateSummary(attachmentType, topValues, loveLang, conflictStyle);
  const tips = generateTips(attachmentType, topValues, loveLang, conflictStyle);

  return {
    attachment,
    values,
    loveLanguage,
    conflict,
    expressions,
    gifts,
    dates,
    care,
    summaryType,
    summary,
    tips,
  };
}

function generateSummaryType(attachmentType: string, topValues: string[], loveLang: string): string {
  const valueMap: Record<string, string> = {
    support: 'Заботливый',
    passion: 'Страстный',
    security: 'Надёжный',
    growth: 'Развивающийся',
  };

  const loveLangMap: Record<string, string> = {
    words: 'Словесный',
    time: 'Временной',
    gifts: 'Подарочный',
    service: 'Служебный',
    touch: 'Тактильный',
  };

  const primaryValue = valueMap[topValues[0]] || 'Гармоничный';
  const loveLangType = loveLangMap[loveLang] || 'Универсальный';

  return `${primaryValue} ${loveLangType}`;
}

function generateSummary(attachmentType: string, topValues: string[], loveLang: string, conflictStyle: string): string {
  const valueMap: Record<string, string> = {
    support: 'поддержка',
    passion: 'страсть',
    security: 'безопасность',
    growth: 'личный рост',
  };

  const loveLangMap: Record<string, string> = {
    words: 'тёплые слова',
    time: 'время вместе',
    gifts: 'знаки внимания',
    service: 'заботу делами',
    touch: 'прикосновения',
  };

  const conflictMap: Record<string, string> = {
    collab: 'сотрудничество',
    comprom: 'компромисс',
    avoid: 'избегание',
    accom: 'приспособление',
    compete: 'соперничество',
  };

  const primaryValue = valueMap[topValues[0]] || 'гармония';
  const secondaryValue = valueMap[topValues[1]] || 'стабильность';
  const loveLangType = loveLangMap[loveLang] || 'разные способы';
  const conflictType = conflictMap[conflictStyle] || 'диалог';

  return `Ты — ${attachmentType.toLowerCase()} партнёр. Для тебя важны ${primaryValue} и ${secondaryValue}, а говорить о чувствах легче через ${loveLangType}. В конфликтах ты стремишься к ${conflictType}, что помогает находить баланс в отношениях.`;
}

function generateTips(attachmentType: string, topValues: string[], loveLang: string, _conflictStyle: string): string[] {
  const tips: string[] = [];

  // Советы по типу привязанности
  if (attachmentType === 'Тревожный') {
    tips.push('Практикуй открытое общение с партнёром о своих потребностях');
    tips.push('Развивай уверенность в себе через личные достижения');
  } else if (attachmentType === 'Избегающий') {
    tips.push('Постепенно открывайся партнёру, начиная с малого');
    tips.push('Обсуждай важность личного пространства в отношениях');
  } else {
    tips.push('Продолжай поддерживать здоровые границы в отношениях');
    tips.push('Будь примером для партнёра в открытом общении');
  }

  // Советы по языку любви
  const loveLangMap: Record<string, string> = {
    words: 'Чаще говори партнёру о своих чувствах словами',
    time: 'Планируй качественное время вместе без отвлечений',
    gifts: 'Делай небольшие сюрпризы и знаки внимания',
    service: 'Помогай партнёру в повседневных делах',
    touch: 'Не забывай о физической близости и прикосновениях',
  };

  tips.push(loveLangMap[loveLang] || 'Экспериментируй с разными способами выражения любви');

  // Советы по конфликтам
  if (_conflictStyle === 'avoid') {
    tips.push('Попробуй обсуждать проблемы раньше, чем они накопятся');
  } else if (_conflictStyle === 'compete') {
    tips.push('Помни, что в отношениях вы команда, а не соперники');
  }

  return tips;
}
