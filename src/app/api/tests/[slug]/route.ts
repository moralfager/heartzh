import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/tests/[slug]
 * Public endpoint to get test data for frontend
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check if test exists (regardless of published status)
    const testExists = await prisma.test.findFirst({
      where: { slug },
      select: { published: true },
      orderBy: { version: 'desc' },
    });

    // If test exists but is not published, return 403
    if (testExists && !testExists.published) {
      return NextResponse.json(
        { error: 'Test is currently unavailable' },
        { status: 403 }
      );
    }

    // Find the latest published version of the test
    const test = await prisma.test.findFirst({
      where: {
        slug,
        published: true,
      },
      include: {
        questions: {
          include: {
            options: {
              orderBy: {
                value: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        scales: true,
        rules: true,
      },
      orderBy: {
        version: 'desc',
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Transform to frontend format (compatible with existing JSON structure)
    const testData = {
      meta: {
        id: test.id,
        slug: test.slug,
        title: test.title,
        subtitle: test.description || '',
        category: 'relationships', // Default category
        tags: [], // Can be added to DB schema later
        estMinutes: Math.ceil(test.questions.length / 7), // Estimate: 7 questions per minute
        questionsCount: test.questions.length,
        isPseudo: true,
        languages: ['ru'],
        rating: test.rating || 4.8,
      },
      questions: test.questions.map((q) => ({
        id: q.id,
        block: 1, // Can be added to DB schema later
        text: q.text,
        scale: q.type === 'scale' ? 'likert' : q.type,
        options: q.options.map((opt) => ({
          id: opt.id,
          label: opt.text,
          domains: opt.weights as Record<string, number>,
        })),
      })),
      scales: test.scales,
      rules: test.rules,
    };

    return NextResponse.json(testData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch test',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

