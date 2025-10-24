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

    // Проверка существования теста (ищем по slug, т.к. testId на самом деле slug)
    let testExists;
    try {
      testExists = await prisma.test.findFirst({
        where: {
          slug: testId, // testId на самом деле slug из URL
          published: true,
        },
      });
    } catch (dbError: any) {
      console.error('[API] Database error finding test:', dbError);
      // Пробуем переподключиться и повторить
      try {
        await prisma.$disconnect();
        await prisma.$connect();
        testExists = await prisma.test.findFirst({
          where: {
            slug: testId,
            published: true,
          },
        });
      } catch (retryError) {
        console.error('[API] Retry failed:', retryError);
        throw dbError;
      }
    }

    if (!testExists) {
      return NextResponse.json(
        {
          error: 'Test not found or not published',
        },
        { status: 404 }
      );
    }

    // Создание результата (используем реальный ID теста из БД) с retry логикой
    let result;
    const maxRetries = 3;
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        result = await prisma.result.create({
          data: {
            testId: testExists.id, // Используем реальный ID из БД
            sessionId: session.id,
            version,
            summary,
            detail: {
              create: {
                answers,
                details: details || {},
              },
            },
          },
          include: {
            detail: true,
          },
        });
        break; // Успешно создали, выходим из цикла
      } catch (error: any) {
        lastError = error;
        console.error(`[API] Create result attempt ${attempt + 1}/${maxRetries} failed:`, error.message);
        
        if (attempt < maxRetries - 1) {
          // Переподключаемся к БД
          try {
            await prisma.$disconnect();
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            await prisma.$connect();
            console.log(`[API] Reconnected, retrying...`);
          } catch (reconnectError) {
            console.error('[API] Reconnect failed:', reconnectError);
          }
        }
      }
    }

    if (!result) {
      throw lastError || new Error('Failed to create result after retries');
    }

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

