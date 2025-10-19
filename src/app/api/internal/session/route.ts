/**
 * Internal API: Session Management
 * 
 * GET /api/internal/session/active
 *   - Проверяет наличие активной сессии
 *   - Возвращает информацию о сессии и времени до истечения
 */

import { NextResponse } from 'next/server';
import { getSession, getSessionTimeRemaining, formatTimeRemaining } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.isExpired) {
      return NextResponse.json(
        {
          active: false,
          session: null,
        },
        { status: 200 }
      );
    }

    const timeRemaining = await getSessionTimeRemaining();

    return NextResponse.json({
      active: true,
      session: {
        id: session.id,
        createdAt: session.createdAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        timeRemaining: timeRemaining ? formatTimeRemaining(timeRemaining) : null,
      },
    });
  } catch (error) {
    console.error('[API] Session check error:', error);
    return NextResponse.json(
      {
        error: 'Failed to check session',
        active: false,
      },
      { status: 500 }
    );
  }
}

