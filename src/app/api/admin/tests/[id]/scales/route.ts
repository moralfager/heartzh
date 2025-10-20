import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ScaleSchema = z.object({
  key: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  min: z.number(),
  max: z.number(),
  bands: z.array(z.object({
    to: z.number(),
    label: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
});

// GET - список шкал
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const scales = await prisma.scale.findMany({
      where: { testId: id },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(scales);
  } catch (error) {
    console.error('Error fetching scales:', error);
    return NextResponse.json({ error: 'Failed to fetch scales' }, { status: 500 });
  }
}

// POST - создать шкалу
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await params;
    const body = await request.json();
    const validated = ScaleSchema.parse(body);

    const scale = await prisma.scale.create({
      data: {
        testId,
        ...validated,
      },
    });

    return NextResponse.json(scale, { status: 201 });
  } catch (error) {
    console.error('Error creating scale:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create scale' }, { status: 500 });
  }
}

