/**
 * Internal API: Single Result
 * 
 * GET /api/internal/results/[id]
 *   - Возвращает результат по ID (только если принадлежит текущей сессии)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || session.isExpired) {
      return NextResponse.json(
        {
          error: 'No active session',
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const result = await prisma.result.findFirst({
      where: {
        id: id,
        sessionId: session.id, // Проверка принадлежности к сессии
      },
      include: {
        test: {
          select: {
            slug: true,
            title: true,
            description: true,
          },
        },
        detail: true,
      },
    });

    if (!result) {
      return NextResponse.json(
        {
          error: 'Result not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      result: {
        id: result.id,
        testId: result.testId,
        testSlug: result.test.slug,
        testTitle: result.test.title,
        version: result.version,
        summary: result.summary,
        details: result.detail?.details,
        createdAt: result.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[API] Get result error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get result',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

