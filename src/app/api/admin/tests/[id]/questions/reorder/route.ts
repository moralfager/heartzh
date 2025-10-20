import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Zod schema for reordering questions
const ReorderQuestionsSchema = z.object({
  questionIds: z.array(z.string()).min(1, 'At least one question ID is required'),
});

/**
 * POST /api/admin/tests/[id]/questions/reorder
 * Reorder questions based on new order
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedBody = ReorderQuestionsSchema.parse(body);

    // Update order for each question in a transaction
    await prisma.$transaction(
      validatedBody.questionIds.map((questionId, index) =>
        prisma.question.update({
          where: { id: questionId },
          data: { order: index + 1 },
        })
      )
    );

    return NextResponse.json(
      { message: 'Questions reordered successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error reordering questions:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to reorder questions' },
      { status: 500 }
    );
  }
}

