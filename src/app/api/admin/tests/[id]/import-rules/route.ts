import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * JSON Schema для импорта Scales + Rules
 */
const ScaleBandSchema = z.object({
  min: z.number(),
  max: z.number(),
  label: z.string(),
  interpretation: z.string().optional(),
});

const ScaleSchema = z.object({
  key: z.string().regex(/^[a-z0-9_]+$/, 'Key must be lowercase letters, numbers, and underscores'),
  name: z.string(),
  min: z.number(),
  max: z.number(),
  bands: z.array(ScaleBandSchema).optional(),
});

const RuleSchema = z.object({
  kind: z.enum(['threshold', 'formula', 'combo']),
  priority: z.number().int().default(100),
  payload: z.record(z.any()), // JSON payload
});

const ImportSchema = z.object({
  scales: z.array(ScaleSchema),
  rules: z.array(RuleSchema),
});

/**
 * POST /api/admin/tests/[id]/import-rules
 * Импорт Scales + Rules из JSON
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate JSON
    const validated = ImportSchema.parse(body);

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

    // Import in transaction
    const result = await prisma.$transaction(async (tx) => {
      const createdScales = [];
      const createdRules = [];

      // 1. Import Scales
      for (const scale of validated.scales) {
        const created = await tx.scale.create({
          data: {
            testId: id,
            key: scale.key,
            name: scale.name,
            min: scale.min,
            max: scale.max,
            bands: scale.bands || [],
          },
        });
        createdScales.push(created);
      }

      // 2. Import Rules
      for (const rule of validated.rules) {
        const created = await tx.rule.create({
          data: {
            testId: id,
            kind: rule.kind,
            priority: rule.priority,
            payload: rule.payload,
          },
        });
        createdRules.push(created);
      }

      return { scales: createdScales, rules: createdRules };
    });

    return NextResponse.json({
      message: 'Import successful',
      imported: {
        scales: result.scales.length,
        rules: result.rules.length,
      },
      data: result,
    }, { status: 201 });

  } catch (error) {
    console.error('Error importing rules:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON format', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to import rules' },
      { status: 500 }
    );
  }
}

