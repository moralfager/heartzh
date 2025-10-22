/**
 * Admin API: Get ALL results from database
 * GET /api/admin/results
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin: Fetching ALL results from database...');

    // Get all results with details
    const results = await prisma.result.findMany({
      include: {
        test: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        detail: true,
        session: {
          select: {
            id: true,
            expiresAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1000, // Limit to 1000 results
    });

    console.log(`✅ Found ${results.length} results in database`);

    return NextResponse.json({
      results: results.map((result) => ({
        id: result.id,
        sessionId: result.sessionId,
        testId: result.test.slug, // Use slug for frontend
        testTitle: result.test.title,
        version: result.version,
        summary: result.summary,
        detail: {
          answers: result.detail?.answers || {},
          details: result.detail?.details || {},
        },
        createdAt: result.createdAt.toISOString(),
      })),
      count: results.length,
    });
  } catch (error) {
    console.error('❌ Error fetching admin results:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch results',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

