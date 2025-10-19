/**
 * Internal API: Results Management
 * 
 * POST /api/internal/results
 *   - Сохраняет результат теста для текущей сессии
 *   - Body: { testId, version, answers, summary, details }
 * 
 * GET /api/internal/results/current
 *   - Возвращает результат текущей сессии (если ≤24ч)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSession, getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const CreateResultSchema = z.object({
  testId: z.string().min(1),
  version: z.number().int().positive().default(1),
  answers: z.record(z.any()),
  summary: z.record(z.any()),
  details: z.record(z.any()).optional(),
});

// ============================================================================
// POST: Create Result
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Получить или создать сессию
    const session = await getOrCreateSession();

    // Парсинг body
    const body = await request.json();
    const validation = CreateResultSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { testId, version, answers, summary, details } = validation.data;

    // Проверка существования теста
    const testExists = await prisma.test.findFirst({
      where: {
        id: testId,
        published: true,
      },
    });

    if (!testExists) {
      return NextResponse.json(
        {
          error: 'Test not found or not published',
        },
        { status: 404 }
      );
    }

    // Создание результата
    const result = await prisma.result.create({
      data: {
        testId,
        sessionId: session.id,
        version,
        summary,
        detail: details
          ? {
              create: {
                details,
              },
            }
          : undefined,
      },
      include: {
        detail: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        result: {
          id: result.id,
          testId: result.testId,
          summary: result.summary,
          createdAt: result.createdAt.toISOString(),
        },
        session: {
          id: session.id,
          expiresAt: session.expiresAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Create result error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create result',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET: Get Current Results
// ============================================================================

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.isExpired) {
      return NextResponse.json(
        {
          results: [],
          message: 'No active session',
        },
        { status: 200 }
      );
    }

    // Получить все результаты текущей сессии
    const results = await prisma.result.findMany({
      where: {
        sessionId: session.id,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      results: results.map((result) => ({
        id: result.id,
        testId: result.testId,
        testSlug: result.test.slug,
        testTitle: result.test.title,
        version: result.version,
        summary: result.summary,
        details: result.detail?.details,
        createdAt: result.createdAt.toISOString(),
      })),
      session: {
        id: session.id,
        expiresAt: session.expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[API] Get results error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get results',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

