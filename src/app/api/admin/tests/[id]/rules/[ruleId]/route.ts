import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - обновить
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ruleId: string }> }
) {
  try {
    const { ruleId } = await params;
    const body = await request.json();

    const rule = await prisma.rule.update({
      where: { id: ruleId },
      data: {
        kind: body.kind,
        payload: body.payload,
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
  }
}

// DELETE - удалить
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ruleId: string }> }
) {
  try {
    const { ruleId } = await params;
    await prisma.rule.delete({ where: { id: ruleId } });
    return NextResponse.json({ message: 'Rule deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 });
  }
}

