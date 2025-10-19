/**
 * Cron Job API: Cleanup Expired Sessions
 * 
 * GET /api/cron/cleanup
 *   - Удаляет истекшие сессии и результаты
 *   - Защищен CRON_SECRET для Vercel Cron
 * 
 * Vercel Cron Configuration (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/cleanup",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredSessions } from '@/lib/cleanup-cron';

export async function GET(request: NextRequest) {
  try {
    // Защита: проверяем CRON_SECRET (для Vercel Cron)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Выполняем очистку
    const stats = await cleanupExpiredSessions();

    return NextResponse.json({
      success: true,
      stats: {
        sessionsDeleted: stats.sessionsDeleted,
        resultsDeleted: stats.resultsDeleted,
        executionTime: `${stats.executionTime}ms`,
        timestamp: stats.timestamp.toISOString(),
      },
    });
  } catch (error) {
    console.error('[CRON] Cleanup error:', error);
    return NextResponse.json(
      {
        error: 'Cleanup failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Также поддерживаем POST для ручного вызова
export async function POST(request: NextRequest) {
  return GET(request);
}

