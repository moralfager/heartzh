import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * Schema for DefaultResult
 */
const DefaultResultSchema = z.object({
  summaryType: z.string().min(1).max(255),
  summary: z.string().min(1),
  scalesData: z.record(z.any()), // JSON with all scales
});

/**
 * GET /api/admin/tests/[id]/default-result
 * Get default result for test
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const defaultResult = await prisma.defaultResult.findUnique({
      where: { testId: id },
    });

    if (!defaultResult) {
      return NextResponse.json(
        { error: 'Default result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(defaultResult);
  } catch (error) {
    console.error('Error fetching default result:', error);
    return NextResponse.json(
      { error: 'Failed to fetch default result' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/tests/[id]/default-result
 * Update or create default result
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate
    const validated = DefaultResultSchema.parse(body);

    // Upsert default result
    const defaultResult = await prisma.defaultResult.upsert({
      where: { testId: id },
      update: {
        summaryType: validated.summaryType,
        summary: validated.summary,
        scalesData: validated.scalesData,
      },
      create: {
        testId: id,
        summaryType: validated.summaryType,
        summary: validated.summary,
        scalesData: validated.scalesData,
      },
    });

    return NextResponse.json(defaultResult);
  } catch (error) {
    console.error('Error updating default result:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update default result' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/tests/[id]/default-result
 * Delete default result
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.defaultResult.delete({
      where: { testId: id },
    });

    return NextResponse.json({ message: 'Default result deleted' });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Default result not found' },
        { status: 404 }
      );
    }

    console.error('Error deleting default result:', error);
    return NextResponse.json(
      { error: 'Failed to delete default result' },
      { status: 500 }
    );
  }
}

