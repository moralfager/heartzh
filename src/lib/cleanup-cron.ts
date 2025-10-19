/**
 * Cleanup Cron Job
 * 
 * Автоматическое удаление истекших сессий и связанных результатов
 * 
 * Запуск:
 * - Vercel Cron: через API route /api/cron/cleanup
 * - Manual: вызов cleanupExpiredSessions()
 */

import { prisma } from './prisma';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CLEANUP_CONFIG = {
  batchSize: 100, // Удалять по 100 сессий за раз
  logEnabled: process.env.NODE_ENV !== 'production',
} as const;

// ============================================================================
// CLEANUP LOGIC
// ============================================================================

export interface CleanupStats {
  sessionsDeleted: number;
  resultsDeleted: number;
  executionTime: number;
  timestamp: Date;
}

/**
 * Удаляет истекшие сессии и связанные результаты
 */
export async function cleanupExpiredSessions(): Promise<CleanupStats> {
  const startTime = Date.now();
  const now = new Date();

  if (CLEANUP_CONFIG.logEnabled) {
    console.log('[CLEANUP] Starting cleanup at', now.toISOString());
  }

  try {
    // Найти истекшие сессии
    const expiredSessions = await prisma.session.findMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
      select: {
        id: true,
      },
      take: CLEANUP_CONFIG.batchSize,
    });

    if (expiredSessions.length === 0) {
      if (CLEANUP_CONFIG.logEnabled) {
        console.log('[CLEANUP] No expired sessions found');
      }

      return {
        sessionsDeleted: 0,
        resultsDeleted: 0,
        executionTime: Date.now() - startTime,
        timestamp: now,
      };
    }

    const sessionIds = expiredSessions.map((s) => s.id);

    // Подсчитать результаты для удаления
    const resultsCount = await prisma.result.count({
      where: {
        sessionId: {
          in: sessionIds,
        },
      },
    });

    // Удалить сессии (каскадное удаление результатов и деталей)
    const deleteResult = await prisma.session.deleteMany({
      where: {
        id: {
          in: sessionIds,
        },
      },
    });

    const executionTime = Date.now() - startTime;

    if (CLEANUP_CONFIG.logEnabled) {
      console.log('[CLEANUP] Completed:', {
        sessionsDeleted: deleteResult.count,
        resultsDeleted: resultsCount,
        executionTime: `${executionTime}ms`,
      });
    }

    return {
      sessionsDeleted: deleteResult.count,
      resultsDeleted: resultsCount,
      executionTime,
      timestamp: now,
    };
  } catch (error) {
    console.error('[CLEANUP] Error:', error);
    throw error;
  }
}

/**
 * Удаляет все истекшие сессии (рекурсивно, если больше batchSize)
 */
export async function cleanupAllExpiredSessions(): Promise<CleanupStats> {
  let totalSessions = 0;
  let totalResults = 0;
  let totalTime = 0;
  const startTimestamp = new Date();

  // Удаляем пакетами, пока не останется истекших сессий
  while (true) {
    const stats = await cleanupExpiredSessions();

    totalSessions += stats.sessionsDeleted;
    totalResults += stats.resultsDeleted;
    totalTime += stats.executionTime;

    if (stats.sessionsDeleted === 0) {
      break;
    }

    // Небольшая пауза между пакетами
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return {
    sessionsDeleted: totalSessions,
    resultsDeleted: totalResults,
    executionTime: totalTime,
    timestamp: startTimestamp,
  };
}

/**
 * Получает статистику по истекшим сессиям без удаления
 */
export async function getCleanupStats(): Promise<{
  expiredSessions: number;
  expiredResults: number;
}> {
  const now = new Date();

  const expiredSessions = await prisma.session.count({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });

  const expiredSessionIds = await prisma.session.findMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
    select: {
      id: true,
    },
  });

  const expiredResults = await prisma.result.count({
    where: {
      sessionId: {
        in: expiredSessionIds.map((s) => s.id),
      },
    },
  });

  return {
    expiredSessions,
    expiredResults,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export const cleanupConfig = CLEANUP_CONFIG;

