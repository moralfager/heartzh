import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Zod schema for creating a test
const CreateTestSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  version: z.number().int().positive().default(1),
  published: z.boolean().default(false),
});

/**
 * GET /api/admin/tests
 * Get all tests from database
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    
    const tests = await prisma.test.findMany({
      where: published !== null ? { published: published === 'true' } : undefined,
      include: {
        _count: {
          select: {
            questions: true,
            scales: true,
            rules: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      tests,
      count: tests.length,
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/tests
 * Create a new test
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateTestSchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.test.findFirst({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Test with this slug already exists' },
        { status: 409 }
      );
    }

    // Create test
    const test = await prisma.test.create({
      data: {
        slug: validatedData.slug,
        title: validatedData.title,
        description: validatedData.description,
        version: validatedData.version,
        published: validatedData.published,
      },
      include: {
        _count: {
          select: {
            questions: true,
            scales: true,
            rules: true,
          },
        },
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating test:', error);
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    );
  }
}

