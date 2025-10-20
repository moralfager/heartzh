import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Zod schema for updating a question
const UpdateQuestionSchema = z.object({
  text: z.string().min(1).max(1000).optional(),
  type: z.enum(['single', 'multi', 'scale', 'likert']).optional(),
  order: z.number().int().positive().optional(),
});

/**
 * GET /api/admin/tests/[id]/questions/[questionId]
 * Get a single question by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    const { questionId } = await params;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: {
          orderBy: {
            value: 'asc',
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch question',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/tests/[id]/questions/[questionId]
 * Update a question
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    const { questionId } = await params;
    const body = await request.json();
    const validatedBody = UpdateQuestionSchema.parse(body);

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: validatedBody,
      include: {
        options: true,
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/tests/[id]/questions/[questionId]
 * Delete a question
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    const { questionId } = await params;

    await prisma.question.delete({
      where: { id: questionId },
    });

    return NextResponse.json(
      { message: 'Question deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}

