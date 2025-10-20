import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Zod schema for updating a test
const UpdateTestSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  version: z.number().int().positive().optional(),
  published: z.boolean().optional(),
});

/**
 * GET /api/admin/tests/[id]
 * Get a single test by ID with all related data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        scales: {
          orderBy: {
            name: 'asc',
          },
        },
        rules: true,
        _count: {
          select: {
            questions: true,
            scales: true,
            rules: true,
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(test);
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

/**
 * PUT /api/admin/tests/[id]
 * Update a test
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate request body
    const validatedData = UpdateTestSchema.parse(body);

    // Check if test exists
    const existing = await prisma.test.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // If updating slug, check if new slug already exists
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const slugExists = await prisma.test.findFirst({
        where: { 
          slug: validatedData.slug,
          NOT: { id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Test with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update test
    const test = await prisma.test.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
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

    return NextResponse.json(test);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating test:', error);
    return NextResponse.json(
      { error: 'Failed to update test' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/tests/[id]
 * Delete a test and all related data (cascade delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if test exists
    const existing = await prisma.test.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Delete test (cascade delete will handle related data)
    await prisma.test.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Test deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    console.error('Error deleting test:', error);
    return NextResponse.json(
      { error: 'Failed to delete test' },
      { status: 500 }
    );
  }
}

