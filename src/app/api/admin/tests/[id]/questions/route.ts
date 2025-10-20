import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Zod schema for creating a question
const CreateQuestionSchema = z.object({
  text: z.string().min(1, 'Question text is required').max(1000),
  type: z.enum(['single', 'multi', 'scale', 'likert']),
  order: z.number().int().positive().optional(),
  options: z.array(z.object({
    text: z.string().min(1),
    value: z.number(),
    weights: z.record(z.number()).optional(),
  })).min(1, 'At least one option is required'),
});

/**
 * GET /api/admin/tests/[id]/questions
 * Get all questions for a test
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const questions = await prisma.question.findMany({
      where: { testId: id },
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
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch questions',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/tests/[id]/questions
 * Create a new question
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedBody = CreateQuestionSchema.parse(body);

    // Check if test exists
    const test = await prisma.test.findUnique({
      where: { id },
    });

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Get the next order number if not provided
    const order = validatedBody.order || (
      await prisma.question.count({ where: { testId: id } }) + 1
    );

    // Create question with options
    const question = await prisma.question.create({
      data: {
        testId: id,
        text: validatedBody.text,
        type: validatedBody.type,
        order,
        options: {
          create: validatedBody.options.map((opt) => ({
            text: opt.text,
            value: opt.value,
            weights: opt.weights || {},
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

