import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const UpdateScaleSchema = z.object({
  key: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(200).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  bands: z.any().optional(),
});

// PUT - обновить
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scaleId: string }> }
) {
  try {
    const { scaleId } = await params;
    const body = await request.json();
    const validated = UpdateScaleSchema.parse(body);

    const scale = await prisma.scale.update({
      where: { id: scaleId },
      data: validated,
    });

    return NextResponse.json(scale);
  } catch (error) {
    console.error('Error updating scale:', error);
    return NextResponse.json({ error: 'Failed to update scale' }, { status: 500 });
  }
}

// DELETE - удалить
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ scaleId: string }> }
) {
  try {
    const { scaleId } = await params;
    await prisma.scale.delete({ where: { id: scaleId } });
    return NextResponse.json({ message: 'Scale deleted' });
  } catch (error) {
    console.error('Error deleting scale:', error);
    return NextResponse.json({ error: 'Failed to delete scale' }, { status: 500 });
  }
}

